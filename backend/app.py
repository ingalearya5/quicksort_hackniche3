from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import pymongo
from pymongo import MongoClient
from sentence_transformers import SentenceTransformer
import numpy as np
import json
import re
from fashion_advice import get_fashion_advice
from faqs import get_faq_answer
import faiss
from gemini_handler import get_gemini_response
from product_availability import check_product_availability
# Add new imports for language support
from langdetect import detect, LangDetectException
from googletrans import Translator

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize translator
translator = Translator()

# MongoDB connection
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client["test"]  # Using "test" database
products_collection = db["products"]

# Add debugging for MongoDB connection
print(f"Connected to MongoDB: {MONGO_URI}")
try:
    # Test the connection
    client.server_info()
    print("Connection successful!")
    print(f"Available databases: {client.list_database_names()}")
    products_count = products_collection.count_documents({})
    print(f"Products count: {products_count}")
    if products_count == 0:
        print("Warning: No products found in the collection!")
except Exception as e:
    print(f"MongoDB connection error: {e}")

# Load sentence transformer model - this is free and works offline
model = SentenceTransformer('all-MiniLM-L6-v2')  # Small model, good for products

# Initialize FAISS index for fast similarity search
embedding_size = model.get_sentence_embedding_dimension()
index = faiss.IndexFlatL2(embedding_size)
product_ids = []  # To keep track of product IDs corresponding to embeddings

# Supported languages and their default welcome messages
SUPPORTED_LANGUAGES = {
    'en': 'Hi there! 👋 How can I help you today?',
    'es': '¡Hola! 👋 ¿Cómo puedo ayudarte hoy?',
    'fr': 'Bonjour! 👋 Comment puis-je vous aider aujourd\'hui?',
    'de': 'Hallo! 👋 Wie kann ich Ihnen heute helfen?',
    'zh-cn': '你好！👋 今天我能帮你什么忙？',
    'hi': 'नमस्ते! 👋 आज मैं आपकी कैसे मदद कर सकता हूँ?',
    'ja': 'こんにちは！👋 今日はどのようにお手伝いできますか？',
    'ru': 'Привет! 👋 Чем я могу помочь вам сегодня?',
    'ar': 'مرحبًا! 👋 كيف يمكنني مساعدتك اليوم؟',
    'pt': 'Olá! 👋 Como posso ajudá-lo hoje?'
}

# Function to initialize or update the FAISS index
def update_faiss_index():
    global index, product_ids
    index = faiss.IndexFlatL2(embedding_size)
    product_ids = []
    
    # Get all products from MongoDB
    all_products = list(products_collection.find())
    
    if not all_products:
        print("No products found in the database.")
        return
    
    # Create product texts for embedding
    product_texts = []
    for product in all_products:
        try:
            # Safely access fields with .get() to provide defaults for missing fields
            title = product.get('title', 'Unknown Product')
            category = product.get('category', 'Uncategorized')
            review = product.get('review', '')
            price = product.get('price', '0')
            
            # Create a rich text representation of the product
            text = f"{title} {category} {review} price: {price}"
            product_texts.append(text)
            product_ids.append(str(product['_id']))
        except Exception as e:
            print(f"Error processing product {product.get('_id', 'unknown ID')}: {e}")
            continue
    
    if not product_texts:
        print("No valid products to index after filtering.")
        return
    
    # Generate embeddings
    embeddings = model.encode(product_texts)
    
    # Add to FAISS index
    index.add(np.array(embeddings).astype('float32'))
    print(f"FAISS index updated with {len(product_ids)} products")

# Initialize FAISS index on startup
try:
    update_faiss_index()
except Exception as e:
    print(f"Error initializing FAISS index: {e}")

# Function to detect language
def detect_language(text):
    try:
        return detect(text)
    except LangDetectException:
        return 'en'  # Default to English if detection fails

# Function to translate text
def translate_text(text, source_lang, target_lang='en'):
    if source_lang == target_lang:
        return text
    
    try:
        translation = translator.translate(text, src=source_lang, dest=target_lang)
        return translation.text
    except Exception as e:
        print(f"Translation error: {e}")
        return text  # Return original text if translation fails

# Define API routes
@app.route('/api/chatbot', methods=['POST'])
def chatbot():
    try:
        data = request.json
        user_message = data.get('message', '').strip()
        client_lang = data.get('language', None)
        
        if not user_message:
            return jsonify({'response': 'Please provide a message.', 'language': 'en'})
        
        # Detect message language if not provided by client
        detected_lang = client_lang or detect_language(user_message)
        
        # Normalize language code
        detected_lang = detected_lang.lower().split('-')[0] if '-' in detected_lang else detected_lang.lower()
        
        # Translate to English for processing
        english_message = translate_text(user_message, detected_lang, 'en')
        
        # Process the translated message
        if is_availability_check(english_message):
            english_response = check_product_availability(english_message)
        elif is_product_search(english_message):
            english_response = handle_product_search(english_message)
        elif is_fashion_advice(english_message):
            english_response = get_gemini_response(english_message, "fashion_advice")
        elif is_faq(english_message):
            english_response = get_faq_answer(english_message)
        else:
            # Try to find the best matching response
            if "product" in english_message.lower() or "find" in english_message.lower() or "search" in english_message.lower():
                english_response = handle_product_search(english_message)
            else:
                english_response = get_gemini_response(english_message, "general")
        
        # Translate response back to detected language
        if detected_lang != 'en' and detected_lang in SUPPORTED_LANGUAGES:
            response = translate_text(english_response, 'en', detected_lang)
        else:
            response = english_response
        
        return jsonify({'response': response, 'language': detected_lang})
    except Exception as e:
        print(f"Error in chatbot endpoint: {e}")
        error_message = 'Sorry, I encountered an error processing your request.'
        
        # Try to translate the error message
        try:
            if client_lang and client_lang != 'en' and client_lang in SUPPORTED_LANGUAGES:
                error_message = translate_text(error_message, 'en', client_lang)
        except:
            pass  # Fallback to English error
            
        return jsonify({'response': error_message, 'language': client_lang or 'en'})

# New endpoint to get welcome message in specified language
@app.route('/api/get-welcome-message', methods=['GET'])
def get_welcome_message():
    lang = request.args.get('language', 'en')
    
    # Normalize language code
    lang = lang.lower().split('-')[0] if '-' in lang else lang.lower()
    
    # Get welcome message for the specified language or default to English
    welcome_message = SUPPORTED_LANGUAGES.get(lang, SUPPORTED_LANGUAGES['en'])
    
    return jsonify({
        'message': welcome_message,
        'language': lang,
        'supportedLanguages': list(SUPPORTED_LANGUAGES.keys())
    })

# New endpoint to get all supported languages
@app.route('/api/supported-languages', methods=['GET'])
def supported_languages():
    return jsonify({
        'languages': list(SUPPORTED_LANGUAGES.keys())
    })

# Route to manually trigger FAISS index update
@app.route('/api/update-index', methods=['POST'])
def update_index():
    try:
        update_faiss_index()
        return jsonify({'status': 'success', 'message': 'Product index updated successfully'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': f'Error updating index: {str(e)}'})

# Helper functions for intent detection
def is_product_search(message):
    product_keywords = ['find', 'search', 'looking for', 'show me', 'product', 'buy']
    return any(keyword in message.lower() for keyword in product_keywords)

def is_fashion_advice(message):
    fashion_keywords = ['wear', 'outfit', 'fashion', 'style', 'trend', 'dress', 'match', 'fashionable', 'stylish']
    return any(keyword in message.lower() for keyword in fashion_keywords)

def is_faq(message):
    faq_keywords = ['policy', 'shipping', 'return', 'delivery', 'payment', 'track', 'order', 'how do i', 'how to']
    return any(keyword in message.lower() for keyword in faq_keywords)

def is_availability_check(message):
    availability_keywords = ['available', 'in stock', 'do you have', 'do you sell', 'availability']
    return any(keyword in message.lower() for keyword in availability_keywords)

# Product search handler
def handle_product_search(query):
    try:
        # If FAISS index is empty, return appropriate message
        if len(product_ids) == 0:
            return "Sorry, our product database is currently empty or being updated. Please try again later."
            
        # Extract price constraints if any
        max_price = extract_max_price(query)
        
        # Extract rating constraints if any
        min_rating = extract_min_rating(query)
        
        # Extract review constraints if any
        good_reviews = extract_good_reviews(query)
        
        # Extract categories if any
        category = extract_category(query)
        
        # Create embedding for the query
        query_embedding = model.encode([query])
        
        # Search similar products using FAISS
        k = 5  # Number of results to return
        distances, indices = index.search(np.array(query_embedding).astype('float32'), k)
        
        # Get matching product IDs
        matching_product_ids = [product_ids[idx] for idx in indices[0]]
        
        # Retrieve products from MongoDB
        from bson.objectid import ObjectId
        matching_products = list(products_collection.find({
            '_id': {'$in': [ObjectId(pid) for pid in matching_product_ids]}
        }))
        
        # Apply filters
        filtered_products = []
        for product in matching_products:
            # Handle price filtering with safe price extraction
            try:
                price_str = product.get('price', '0')
                if isinstance(price_str, str):
                    # Remove currency symbol and commas
                    price_str = price_str.replace('₹', '').replace(',', '')
                    price_value = float(price_str)
                else:
                    price_value = float(price_str)
                    
                if max_price and price_value > max_price:
                    continue
            except (ValueError, TypeError):
                # If price can't be parsed, skip price filtering
                pass
                
            # Handle rating filtering
            try:
                rating = product.get('rating', 0)
                if min_rating and rating < min_rating:
                    continue
            except (ValueError, TypeError):
                pass
                
            # Handle review filtering
            try:
                reviews = product.get('reviews', '')
                if good_reviews and 'good' not in reviews.lower():
                    continue
            except (ValueError, TypeError):
                pass
                
            # Handle category filtering with safe category extraction
            product_category = product.get('category', '').lower()
            if category and category.lower() not in product_category:
                continue
                
            filtered_products.append(product)
        
        # Format response
        if filtered_products:
            response = "I found the following products for you:\n\n"
            for i, product in enumerate(filtered_products[:3], 1):  # Limit to top 3
                # Safely get product attributes
                title = product.get('title', 'Unnamed Product')
                price = product.get('price', 'N/A')
                category = product.get('category', 'Uncategorized')
                rating = product.get('rating', 'No rating')
                
                # Format with proper currency symbol if not already present
                if isinstance(price, str) and '₹' not in price:
                    price = f"₹{price}"
                
                response += f"{i}. {title} - {price}\n   Category: {category}\n   Rating: {rating}\n\n"
        else:
            response = "I couldn't find any products matching your criteria. Could you try a different search?"
        
        return response
    except Exception as e:
        print(f"Error in product search: {e}")
        return "Sorry, I encountered an error while searching for products. Please try again."

# Helper function to extract maximum price from query
def extract_max_price(query):
    price_patterns = [
        r'under (\d+)',
        r'less than (\d+)',
        r'below (\d+)',
        r'cheaper than (\d+)',
        r'max (\d+)',
        r'maximum (\d+)'
    ]
    
    for pattern in price_patterns:
        match = re.search(pattern, query)
        if match:
            return float(match.group(1))
    return None

# Helper function to extract minimum rating from query
def extract_min_rating(query):
    rating_patterns = [
        r'rated over (\d+)',
        r'rating above (\d+)',
        r'rated above (\d+)',
        r'rating over (\d+)'
    ]
    
    for pattern in rating_patterns:
        match = re.search(pattern, query)
        if match:
            return float(match.group(1))
    return None

# Helper function to extract good reviews from query
def extract_good_reviews(query):
    good_review_keywords = ['good reviews', 'positive reviews', 'highly rated']
    return any(keyword in query.lower() for keyword in good_review_keywords)

# Helper function to extract category from query
def extract_category(query):
    # Common categories in e-commerce
    categories = ['hoodie', 'sneakers', 'shirt', 'pants', 'jeans', 'dress', 'shoes', 'watch', 'bag']
    
    for category in categories:
        if category in query.lower():
            return category
    return None

if __name__ == '__main__':
    app.run(debug=True, port=5000)