# app.py
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

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

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

# Define API routes
@app.route('/api/chatbot', methods=['POST'])
def chatbot():
    try:
        data = request.json
        user_message = data.get('message', '').strip()
        
        if not user_message:
            return jsonify({'response': 'Please provide a message.'})
        
        # Determine the intent of the user message
        if is_product_search(user_message):
            response = handle_product_search(user_message)
        elif is_fashion_advice(user_message):
            response = get_fashion_advice(user_message)
        elif is_faq(user_message):
            response = get_faq_answer(user_message)
        else:
            # Try to find the best matching response
            if "product" in user_message.lower() or "find" in user_message.lower() or "search" in user_message.lower():
                response = handle_product_search(user_message)
            else:
                response = "I'm not sure how to help with that. You can ask me about products, fashion advice, or general questions about ShopMart."
        
        return jsonify({'response': response})
    except Exception as e:
        print(f"Error in chatbot endpoint: {e}")
        return jsonify({'response': 'Sorry, I encountered an error processing your request.'})

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
    fashion_keywords = ['wear', 'outfit', 'fashion', 'style', 'trend', 'dress', 'match']
    return any(keyword in message.lower() for keyword in fashion_keywords)

def is_faq(message):
    faq_keywords = ['policy', 'shipping', 'return', 'delivery', 'payment', 'track', 'order', 'how do i', 'how to']
    return any(keyword in message.lower() for keyword in faq_keywords)

# Product search handler
def handle_product_search(query):
    try:
        # If FAISS index is empty, return appropriate message
        if len(product_ids) == 0:
            return "Sorry, our product database is currently empty or being updated. Please try again later."
            
        # Extract price constraints if any
        max_price = extract_max_price(query)
        
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