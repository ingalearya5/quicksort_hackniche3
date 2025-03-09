from pymongo import MongoClient
import os
from dotenv import load_dotenv
import re

# Load environment variables
load_dotenv()

# MongoDB connection
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client["test"]
products_collection = db["products"]

def check_product_availability(query):
    """
    Check if products are available based on user query
    
    Args:
        query (str): User's product availability query
        
    Returns:
        str: Response about product availability
    """
    try:
        # Extract product details from query
        product_name = extract_product_name(query)
        size = extract_size(query)
        color = extract_color(query)
        gender = extract_gender(query)
        
        if not product_name:
            return "I couldn't determine which product you're asking about. Could you specify the product name?"
        
        # Build MongoDB query
        mongo_query = {"title": {"$regex": product_name, "$options": "i"}}
        
        # Add optional filters if specified
        if gender:
            mongo_query["gender"] = {"$regex": gender, "$options": "i"}
        
        if color:
            mongo_query["title"] = {"$regex": color, "$options": "i"}
            
        # Find matching products
        matching_products = list(products_collection.find(mongo_query).limit(5))
        
        if not matching_products:
            return f"I'm sorry, I couldn't find any {product_name} in our inventory. Would you like to see similar products?"
        
        # Format response based on results
        if len(matching_products) == 1:
            product = matching_products[0]
            return f"Yes, we have {product['title']} available for {product['price']}. It has a rating of {product['rating'] or 'N/A'} and belongs to the {product['category']} category."
        else:
            response = f"We have {len(matching_products)} types of {product_name} available:\n\n"
            for i, product in enumerate(matching_products, 1):
                response += f"{i}. {product['title']} - {product['price']}\n"
            
            response += "\nWould you like more details on any of these items?"
            return response
            
    except Exception as e:
        print(f"Error checking product availability: {e}")
        return "I encountered an error while checking product availability. Please try again or contact customer support."

# Helper functions to extract information from query
def extract_product_name(query):
    # Look for common product type words
    product_types = ["shirt", "pants", "jeans", "dress", "top", "hoodie", "shoes", "sneakers", 
                    "watch", "bag", "jacket", "sweater", "t-shirt", "tshirt", "socks"]
    
    for product in product_types:
        if product in query.lower():
            # Try to get a more specific name (e.g., "blue shirt" instead of just "shirt")
            words_before = re.findall(r'(\w+)\s+' + product, query.lower())
            if words_before:
                return f"{words_before[-1]} {product}"
            return product
    
    # If no specific product type is found, try to find anything after "do you have" or similar phrases
    match = re.search(r'(?:do you have|is there|availability of|stock of|any)\s+(\w+(?:\s+\w+){0,3})', query.lower())
    if match:
        return match.group(1)
    
    return None

def extract_size(query):
    # Look for common size patterns
    size_patterns = [
        r'size\s+(\w+)',
        r'(\w+)\s+size',
        r'in\s+(\w+)'
    ]
    
    for pattern in size_patterns:
        match = re.search(pattern, query.lower())
        if match:
            return match.group(1)
    
    # Look for common clothing sizes
    sizes = ["xs", "s", "m", "l", "xl", "xxl", "small", "medium", "large"]
    for size in sizes:
        if f" {size} " in f" {query.lower()} ":
            return size
    
    return None

def extract_color(query):
    # Common colors
    colors = ["black", "white", "red", "blue", "green", "yellow", "purple", "pink", 
              "brown", "gray", "grey", "orange", "navy", "beige"]
    
    for color in colors:
        if color in query.lower():
            return color
    
    return None

def extract_gender(query):
    # Check for gender-specific terms
    if any(term in query.lower() for term in ["men", "man", "male", "boy", "guys"]):
        return "men"
    elif any(term in query.lower() for term in ["women", "woman", "female", "girl", "ladies"]):
        return "women"
    
    return None