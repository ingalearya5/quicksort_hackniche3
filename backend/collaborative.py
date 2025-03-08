from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# MongoDB connection
MONGO_URI = os.environ.get('MONGO_URI', "mongodb+srv://quicksort:newquicksort@quicksort.1bv5w.mongodb.net/?retryWrites=true&w=majority&appName=quicksort")

# Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client["test"]
collection = db["interactions"]
products_collection = db["products"]  # Assuming you have a products collection

# Define action weights
ACTION_WEIGHTS = {
    "view": 1,
    "click": 1,
    "add_to_cart": 3,
    "purchase": 5,
    "search": 1,
}

def build_recommendation_model():
    """Build the recommendation model using interaction data"""
    # Fetch interactions
    data = list(collection.find({}, {"_id": 0, "userId": 1, "productId": 1, "action": 1}))
    
    # Convert to DataFrame
    df = pd.DataFrame(data)
    
    # If dataframe is empty, return None
    if df.empty:
        return None, None, None
    
    # Convert actions to numerical ratings
    df["rating"] = df["action"].map(ACTION_WEIGHTS)
    df = df.drop(columns=["action"])
    
    # Create user-item interaction matrix
    interaction_matrix = df.pivot_table(index="userId", columns="productId", values="rating", fill_value=0)
    
    # Compute user similarity
    user_similarity = cosine_similarity(interaction_matrix)
    user_similarity_df = pd.DataFrame(user_similarity, index=interaction_matrix.index, columns=interaction_matrix.index)
    
    return df, interaction_matrix, user_similarity_df

def recommend_products(user_id, top_n=5):
    """
    Recommends products for a user based on collaborative filtering using user similarities.
    
    Args:
        user_id: ID of the user to recommend products for
        top_n: Number of recommendations to return
        
    Returns:
        List of recommended product IDs or product objects
    """
    # Build or update the model
    df, interaction_matrix, user_similarity_df = build_recommendation_model()
    
    if df is None or interaction_matrix is None or user_similarity_df is None:
        return {"error": "Not enough data to build recommendation model"}
    
    if user_id not in user_similarity_df.index:
        return {"error": f"User {user_id} not found in the dataset"}

    # Get user's interactions
    user_interactions = interaction_matrix.loc[user_id]
    user_seen_products = set(user_interactions[user_interactions > 0].index)
    
    # Find similar users and their weights
    user_similarities = user_similarity_df[user_id].sort_values(ascending=False)[1:11]
    similar_users = user_similarities.index.tolist()
    
    # Calculate predicted ratings for unseen products
    recommendations = {}
    
    for product in interaction_matrix.columns:
        if product not in user_seen_products:
            product_ratings = []
            sim_weights = []
            
            for sim_user in similar_users:
                rating = interaction_matrix.loc[sim_user, product]
                if rating > 0:
                    similarity = user_similarities[sim_user]
                    product_ratings.append(rating)
                    sim_weights.append(similarity)
            
            if product_ratings:
                # Calculate weighted average rating
                recommendations[product] = sum(r * w for r, w in zip(product_ratings, sim_weights)) / sum(sim_weights)
    
    # Sort and get top N recommendations
    sorted_recommendations = sorted(recommendations.items(), key=lambda x: x[1], reverse=True)[:top_n]
    recommended_product_ids = [item[0] for item in sorted_recommendations]
    
    # Log recommended product IDs for debugging
    print(f"Recommended product IDs for {user_id}: {recommended_product_ids}")
    
    # Check if product details collection exists and has data
    if products_collection.estimated_document_count() > 0:
        # Fetch product details for recommended products
        recommended_products = []
        for product_id in recommended_product_ids:
            product = products_collection.find_one({"productId": product_id})
            if product:
                # Convert ObjectId to string
                if "_id" in product:
                    product["_id"] = str(product["_id"])
                recommended_products.append(product)
        
        # If we found product details, return them
        if recommended_products:
            return recommended_products
    
    # If no product details found or products collection is empty,
    # return simple product objects with just the IDs
    return [{"id": pid} for pid in recommended_product_ids]

@app.route('/api/recommendations', methods=['GET'])
def get_recommendations():
    user_id = request.args.get('userId', default=None, type=str)
    count = request.args.get('count', default=4, type=int)
    
    if not user_id:
        return jsonify({"error": "userId parameter is required"}), 400
    
    recommendations = recommend_products(user_id, top_n=count)
    
    if isinstance(recommendations, dict) and "error" in recommendations:
        return jsonify(recommendations), 404
        
    return jsonify({"products": recommendations})

@app.route('/api/debug', methods=['GET'])
def debug_recommendations():
    """Debug endpoint to check what product IDs are being recommended"""
    user_id = request.args.get('userId', default="user_1", type=str)
    
    # Build model
    df, interaction_matrix, user_similarity_df = build_recommendation_model()
    
    if df is None:
        return jsonify({"error": "No interaction data found"}), 500
    
    debug_info = {
        "user_exists": user_id in interaction_matrix.index,
        "total_users": len(interaction_matrix.index),
        "total_products": len(interaction_matrix.columns),
        "sample_users": list(interaction_matrix.index)[:5],
        "sample_products": list(interaction_matrix.columns)[:5],
        "products_collection_count": products_collection.estimated_document_count()
    }
    
    if user_id in interaction_matrix.index:
        # Get simplified recommendations (just IDs)
        recommendations = {}
        user_interactions = interaction_matrix.loc[user_id]
        user_seen_products = set(user_interactions[user_interactions > 0].index)
        user_similarities = user_similarity_df[user_id].sort_values(ascending=False)[1:11]
        similar_users = user_similarities.index.tolist()
        
        debug_info["user_seen_products_count"] = len(user_seen_products)
        debug_info["similar_users"] = similar_users
        
        for product in interaction_matrix.columns:
            if product not in user_seen_products:
                product_ratings = []
                sim_weights = []
                
                for sim_user in similar_users:
                    rating = interaction_matrix.loc[sim_user, product]
                    if rating > 0:
                        similarity = user_similarities[sim_user]
                        product_ratings.append(rating)
                        sim_weights.append(similarity)
                
                if product_ratings:
                    recommendations[product] = sum(r * w for r, w in zip(product_ratings, sim_weights)) / sum(sim_weights)
        
        sorted_recommendations = sorted(recommendations.items(), key=lambda x: x[1], reverse=True)[:5]
        debug_info["recommended_products"] = [{"id": item[0], "score": item[1]} for item in sorted_recommendations]
    
    return jsonify(debug_info)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"})

if __name__ == '__main__':
    # Run the app on port 5000
    app.run(host='0.0.0.0', port=5000, debug=True)