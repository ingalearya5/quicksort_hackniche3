from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re
from bson.objectid import ObjectId
import traceback

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Connect to MongoDB
client = MongoClient("mongodb+srv://quicksort:newquicksort@quicksort.1bv5w.mongodb.net/?retryWrites=true&w=majority&appName=quicksort")
db = client["test"]
products_collection = db["products"]
interactions_collection = db["interactions"]

# Load data and prepare recommendation system
def load_data():
    global df_products, content_similarity_df, df_interactions
    
    # Fetch products data
    products_data = list(products_collection.find({}))
    df_products = pd.DataFrame(products_data)
    
    # Fetch interactions data
    interactions_data = list(interactions_collection.find({}, {"_id": 0, "userId": 1, "productId": 1, "action": 1}))
    df_interactions = pd.DataFrame(interactions_data)
    if 'productId' in df_interactions.columns:
        df_interactions['productId'] = df_interactions['productId'].astype(str)
    
    # Prepare data for recommendations
    df_products = prepare_content_features(df_products)
    df_products = clean_numeric_fields(df_products)
    
    # Create TF-IDF vectors and similarity matrix
    tfidf = TfidfVectorizer(stop_words='english')
    if not df_products.empty and 'content_features' in df_products.columns:
        tfidf_matrix = tfidf.fit_transform(df_products['content_features'])
        content_similarity = cosine_similarity(tfidf_matrix, tfidf_matrix)
        
        # Create similarity DataFrame
        content_similarity_df = pd.DataFrame(
            content_similarity, 
            index=[str(id) for id in df_products['_id']], 
            columns=[str(id) for id in df_products['_id']]
        )
        
        print(f"Data loaded successfully. Products: {len(df_products)}, Interactions: {len(df_interactions)}")
        return True
    else:
        print("Failed to create content features or empty dataframe")
        return False

# Function to preprocess text
def preprocess_text(text):
    if not isinstance(text, str):
        return ""
    # Convert to lowercase and remove special characters
    text = re.sub(r'[^\w\s]', ' ', text.lower())
    return text

# Create content features
def prepare_content_features(df):
    # Handle missing values
    df = df.fillna("")
    
    # Preprocess title and category
    df['title_processed'] = df['title'].apply(preprocess_text)
    df['category_processed'] = df['category'].apply(preprocess_text)
    
    # Create a combined text feature for content-based filtering
    df['content_features'] = (
        df['title_processed'] + " " + 
        df['category_processed'] + " " + 
        df['gender'].apply(lambda x: str(x).lower()) + " " + 
        df['reviews'].apply(lambda x: str(x).lower())
    )
    
    return df

# Convert price and rating to numeric
def clean_numeric_fields(df):
    # Convert price to numeric, coercing errors to NaN
    if 'price' in df.columns:
        df['price_numeric'] = pd.to_numeric(df['price'], errors='coerce')
    
    # Convert rating to numeric, coercing errors to NaN
    if 'rating' in df.columns:
        df['rating_numeric'] = pd.to_numeric(df['rating'], errors='coerce')
    
    return df

# Get user's preferred gender based on interaction history
def get_user_preferred_gender(user_id):
    """Determine user's gender preference based on interaction history"""
    if user_id not in df_interactions['userId'].values:
        return None
    
    # Get products user has interacted with
    user_products = df_interactions[df_interactions['userId'] == user_id]['productId'].unique()
    user_products = [str(prod_id) for prod_id in user_products]
    
    # Get gender for each product
    gender_counts = {}
    for product_id in user_products:
        product_data = df_products[df_products['_id'].astype(str) == product_id]
        if not product_data.empty and 'gender' in product_data.columns:
            gender = product_data.iloc[0]['gender'].lower() if isinstance(product_data.iloc[0]['gender'], str) else "unknown"
            if gender in gender_counts:
                gender_counts[gender] += 1
            else:
                gender_counts[gender] = 1
    
    # Determine preferred gender (most interacted with)
    if gender_counts:
        preferred_gender = max(gender_counts.items(), key=lambda x: x[1])[0]
        return preferred_gender
    return None

# Function to get personalized recommendations
def recommend_for_user(user_id, top_n=4):
    """Get personalized recommendations for a user"""
    
    # Check if user exists in interactions
    if user_id not in df_interactions['userId'].values:
        return {"error": "User not found in the dataset"}
    
    # Get user's preferred gender
    preferred_gender = get_user_preferred_gender(user_id)
    print(f"User {user_id} preferred gender: {preferred_gender}")
    
    # Get the products the user has interacted with
    user_products = df_interactions[df_interactions['userId'] == user_id]['productId'].unique()
    print(f"User {user_id} has interacted with {len(user_products)} products")
    
    if len(user_products) == 0:
        return {"error": "No interaction data found for user"}
    
    # Convert all product IDs to strings for consistent comparison
    user_products = [str(prod_id) for prod_id in user_products]
    
    # Calculate preference scores for each product
    preference_scores = {}
    
    for product_id in user_products:
        product_id_str = str(product_id)
        if product_id_str in content_similarity_df.columns:
            # Get similar products
            similar_products = content_similarity_df[product_id_str]
            
            # Update preference scores
            for similar_id, similarity in similar_products.items():
                similar_id_str = str(similar_id)
                if similar_id_str != product_id_str and similar_id_str not in [str(p) for p in user_products]:
                    if similar_id_str in preference_scores:
                        preference_scores[similar_id_str] += similarity
                    else:
                        preference_scores[similar_id_str] = similarity
    
    # Filter based on preferred gender if we have a preference
    if preferred_gender and preferred_gender not in ["unknown", "unisex"]:
        filtered_scores = {}
        for product_id, score in preference_scores.items():
            product_data = df_products[df_products['_id'].astype(str) == product_id]
            if not product_data.empty and 'gender' in product_data.columns:
                product_gender = product_data.iloc[0]['gender'].lower() if isinstance(product_data.iloc[0]['gender'], str) else "unknown"
                if product_gender == preferred_gender or product_gender == "unisex":
                    filtered_scores[product_id] = score
        
        # Only override if we have gender-filtered results
        if filtered_scores:
            preference_scores = filtered_scores
    
    # If no recommendations based on user history, use fallback
    if not preference_scores:
        # Return popular products as fallback, respecting gender preference if available
        top_rated_query = df_products.copy()
        
        if preferred_gender and preferred_gender not in ["unknown", "unisex"]:
            gender_filter = (top_rated_query['gender'].str.lower() == preferred_gender) | (top_rated_query['gender'].str.lower() == "unisex")
            gender_filtered = top_rated_query[gender_filter]
            # Only apply filter if we get results
            if not gender_filtered.empty:
                top_rated_query = gender_filtered
        
        top_rated = top_rated_query.sort_values('rating_numeric', ascending=False).head(top_n).copy()
        
        if not top_rated.empty:
            # Format results for API response
            results = []
            for _, product in top_rated.iterrows():
                product_dict = format_product_for_response(product)
                product_dict["recommendation_source"] = "Popular products you might like"
                results.append(product_dict)
            
            return {"products": results, "source": "popular_products"}
        return {"error": "Could not generate recommendations"}
    
    # Get top N products with highest preference scores
    top_products = sorted(preference_scores.items(), key=lambda x: x[1], reverse=True)[:top_n]
    top_product_ids = [product_id for product_id, _ in top_products]
    
    # Get product details
    recommended_products = df_products[df_products['_id'].astype(str).isin(top_product_ids)].copy()
    
    # Add preference score
    for idx, row in recommended_products.iterrows():
        product_id_str = str(row['_id'])
        if product_id_str in preference_scores:
            recommended_products.at[idx, 'preference_score'] = preference_scores[product_id_str]
    
    # Sort by preference score
    recommended_products = recommended_products.sort_values('preference_score', ascending=False)
    
    # Format results for API response
    results = []
    for _, product in recommended_products.iterrows():
        product_dict = format_product_for_response(product)
        product_dict["recommendation_source"] = "Based on your browsing history"
        results.append(product_dict)
    
    return {"products": results, "source": "user_history"}

# Function to format product for API response
def format_product_for_response(product):
    """Format a product row for API response"""
    product_dict = {
        "id": str(product['_id']),
        "title": product['title'] if 'title' in product else "",
        "category": product['category'] if 'category' in product else "",
        "gender": product['gender'] if 'gender' in product else "",
        "price": float(product['price_numeric']) if 'price_numeric' in product and not pd.isna(product['price_numeric']) else 0,
        "rating": float(product['rating_numeric']) if 'rating_numeric' in product and not pd.isna(product['rating_numeric']) else 0,
        "image": product['images'][0] if 'images' in product and isinstance(product['images'], list) and len(product['images']) > 0 else "",
    }
    
    # Add additional fields if they exist
    if 'preference_score' in product and not pd.isna(product['preference_score']):
        product_dict["preference_score"] = float(product['preference_score'])
    
    if 'similarity_score' in product and not pd.isna(product['similarity_score']):
        product_dict["similarity_score"] = float(product['similarity_score'])
    
    return product_dict

# Function to recommend similar products
def recommend_similar_products(product_id, top_n=4):
    """Get similar products based on content similarity"""
    
    # Convert product_id to string for consistent comparison
    product_id_str = str(product_id)
    
    # Check if the product exists
    if product_id_str not in content_similarity_df.index:
        return {"error": f"Product {product_id} not found in the dataset"}
    
    # Get the gender of the current product for filtering
    product_data = df_products[df_products['_id'].astype(str) == product_id_str]
    product_gender = None
    if not product_data.empty and 'gender' in product_data.columns:
        product_gender = product_data.iloc[0]['gender'].lower() if isinstance(product_data.iloc[0]['gender'], str) else None
    
    # Get similarity scores for the product
    product_similarities = content_similarity_df[product_id_str]
    
    # Sort products by similarity score (excluding the product itself)
    similar_products = product_similarities.sort_values(ascending=False)[1:]
    
    # Filter by gender if applicable
    if product_gender and product_gender not in ["unknown", "unisex"]:
        filtered_similar_ids = []
        count = 0
        
        for similar_id in similar_products.index:
            if count >= top_n:
                break
                
            similar_data = df_products[df_products['_id'].astype(str) == similar_id]
            if not similar_data.empty and 'gender' in similar_data.columns:
                similar_gender = similar_data.iloc[0]['gender'].lower() if isinstance(similar_data.iloc[0]['gender'], str) else "unknown"
                if similar_gender == product_gender or similar_gender == "unisex":
                    filtered_similar_ids.append(similar_id)
                    count += 1
        
        # If we have gender-filtered results, use them
        if filtered_similar_ids:
            similar_ids = filtered_similar_ids
        else:
            # Fallback to regular similarity if gender filtering returns nothing
            similar_ids = similar_products.index.tolist()[:top_n]
    else:
        # No gender filtering needed
        similar_ids = similar_products.index.tolist()[:top_n]
    
    # Get recommended products with details
    recommended_products = df_products[df_products['_id'].astype(str).isin(similar_ids)].copy()
    
    # If no similar products found, return error
    if recommended_products.empty:
        return {"error": f"No similar products found for {product_id}"}
    
    # Add similarity score to the results
    for idx, row in recommended_products.iterrows():
        product_id_str = str(row['_id'])
        if product_id_str in similar_products:
            recommended_products.at[idx, 'similarity_score'] = similar_products[product_id_str]
    
    # Sort by similarity score
    recommended_products = recommended_products.sort_values('similarity_score', ascending=False)
    
    # Format results for API response
    results = []
    for _, product in recommended_products.iterrows():
        product_dict = format_product_for_response(product)
        product_dict["recommendation_source"] = "Similar products"
        results.append(product_dict)
    
    return {"products": results, "source": "similar_products"}

# Function to recommend products by attributes
def recommend_by_attributes(title=None, category=None, gender=None, price_range=None, top_n=4):
    """Get products based on specified attributes"""
    
    # Create a copy of the dataframe to work with
    filtered_df = df_products.copy()
    
    # Apply filters
    if title:
        title_keywords = preprocess_text(title).split()
        pattern = '|'.join(title_keywords)
        filtered_df = filtered_df[filtered_df['title_processed'].str.contains(pattern, na=False)]
    
    if category:
        category = category.lower()
        filtered_df = filtered_df[filtered_df['category_processed'].str.contains(category, na=False)]
    
    if gender:
        gender = gender.lower()
        filtered_df = filtered_df[filtered_df['gender'].str.lower() == gender]
    
    if price_range and len(price_range) == 2:
        min_price, max_price = price_range
        filtered_df = filtered_df[(filtered_df['price_numeric'] >= min_price) & 
                                (filtered_df['price_numeric'] <= max_price)]
    
    # Sort by rating
    if not filtered_df.empty and 'rating_numeric' in filtered_df.columns:
        filtered_df_with_ratings = filtered_df.dropna(subset=['rating_numeric'])
        
        if not filtered_df_with_ratings.empty:
            filtered_df_with_ratings = filtered_df_with_ratings.sort_values('rating_numeric', ascending=False)
            filtered_df = pd.concat([filtered_df_with_ratings, filtered_df[filtered_df['rating_numeric'].isna()]])
    
    # Get top results
    filtered_df = filtered_df.head(top_n)
    
    # If no products found, return error
    if filtered_df.empty:
        return {"error": "No products found matching the criteria"}
    
    # Format results for API response
    results = []
    for _, product in filtered_df.iterrows():
        product_dict = format_product_for_response(product)
        if category:
            product_dict["recommendation_source"] = f"Top {category} products"
        else:
            product_dict["recommendation_source"] = "Products matching your criteria"
        results.append(product_dict)
    
    return {"products": results, "source": "attribute_filtered"}

# Initialize data
print("Loading recommendation data...")
data_loaded = load_data()
if not data_loaded:
    print("WARNING: Failed to initialize recommendation system!")

# API Routes
@app.route('/api/recommendations', methods=['GET'])
def get_recommendations():
    try:
        user_id = request.args.get('userId')
        count = int(request.args.get('count', 4))
        
        if not user_id:
            return jsonify({"error": "userId parameter is required"}), 400
        
        # Get recommendations for user
        recommendations = recommend_for_user(user_id, top_n=count)
        
        if "error" in recommendations:
            return jsonify(recommendations), 404
        
        return jsonify(recommendations), 200
    
    except Exception as e:
        print("Error in recommendations API:", str(e))
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/api/similar', methods=['GET'])
def get_similar_products():
    try:
        product_id = request.args.get('productId')
        count = int(request.args.get('count', 4))
        
        if not product_id:
            return jsonify({"error": "productId parameter is required"}), 400
        
        # Get similar products
        similar_products = recommend_similar_products(product_id, top_n=count)
        
        if "error" in similar_products:
            return jsonify(similar_products), 404
        
        return jsonify(similar_products), 200
    
    except Exception as e:
        print("Error in similar products API:", str(e))
        return jsonify({"error": str(e)}), 500

@app.route('/api/filtered', methods=['GET'])
def get_filtered_products():
    try:
        title = request.args.get('title')
        category = request.args.get('category')
        gender = request.args.get('gender')
        min_price = request.args.get('minPrice')
        max_price = request.args.get('maxPrice')
        count = int(request.args.get('count', 4))
        
        # Parse price range if provided
        price_range = None
        if min_price is not None and max_price is not None:
            price_range = (float(min_price), float(max_price))
        
        # Get filtered products
        filtered_products = recommend_by_attributes(
            title=title,
            category=category,
            gender=gender,
            price_range=price_range,
            top_n=count
        )
        
        if "error" in filtered_products:
            return jsonify(filtered_products), 404
        
        return jsonify(filtered_products), 200
    
    except Exception as e:
        print("Error in filtered products API:", str(e))
        return jsonify({"error": str(e)}), 500

@app.route('/api/debug', methods=['GET'])
def debug_recommendations():
    try:
        user_id = request.args.get('userId')
        
        if not user_id:
            return jsonify({"error": "userId parameter is required"}), 400
        
        # Get user's preferred gender
        preferred_gender = get_user_preferred_gender(user_id)
        
        # Check user in interactions
        user_exists = user_id in df_interactions['userId'].values
        
        # Get user interactions
        user_interactions = []
        if user_exists:
            interactions = df_interactions[df_interactions['userId'] == user_id]
            for _, row in interactions.iterrows():
                product_id = row['productId']
                product_info = df_products[df_products['_id'].astype(str) == product_id]
                if not product_info.empty:
                    product_title = product_info.iloc[0]['title'] if 'title' in product_info.columns else "Unknown"
                    product_gender = product_info.iloc[0]['gender'] if 'gender' in product_info.columns else "Unknown"
                    user_interactions.append({
                        "productId": product_id,
                        "title": product_title,
                        "gender": product_gender,
                        "action": row['action'] if 'action' in row else "Unknown"
                    })
        
        debug_info = {
            "userId": user_id,
            "exists": user_exists,
            "preferredGender": preferred_gender,
            "interactionCount": len(user_interactions),
            "interactions": user_interactions[:5],  # Limit to 5 for brevity
            "dataStats": {
                "products": len(df_products),
                "interactions": len(df_interactions),
                "users": df_interactions['userId'].nunique() if 'userId' in df_interactions.columns else 0
            }
        }
        
        return jsonify(debug_info), 200
    
    except Exception as e:
        print("Error in debug API:", str(e))
        return jsonify({"error": str(e)}), 500

# Run the server
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)