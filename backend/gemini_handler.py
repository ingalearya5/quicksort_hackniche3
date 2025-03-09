import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()

# Set up Gemini API
GEMINI_API_KEY = os.getenv("AIzaSyAcwz32bB_2bKAy9MnwYh2pRVcT5MNCHPs")
genai.configure(api_key=GEMINI_API_KEY)

# Configure the model
model = genai.GenerativeModel('gemini-2.0-flash')

def get_gemini_response(query, response_type):
    """
    Get structured response from Google Gemini model
    
    Args:
        query (str): User's query
        response_type (str): Type of response needed (e.g., 'fashion_advice', 'general')
        
    Returns:
        str: Structured response from Gemini
    """
    try:
        # Create a prompt that guides Gemini to provide structured responses
        if response_type == "fashion_advice":
            prompt = f"""
            You are a fashion assistant for ShopMart. Provide helpful fashion advice for the following query:
            
            Query: {query}
            
            Provide concise, professional advice with specific suggestions. Include current trends if relevant.
            Format your response in a friendly, conversational tone.
            """
        else:
            prompt = f"""
            You are a customer service assistant for ShopMart. Provide a helpful and structured response to the following query:
            
            Query: {query}
            
            Provide a concise, professional response. If the query is about products, suggest relevant products.
            Format your response in a friendly, conversational tone.
            """
        
        # Get response from Gemini
        response = model.generate_content(prompt)
        
        # Extract and return the text
        if response and hasattr(response, 'text'):
            return response.text
        else:
            # Fallback to local responses if Gemini API fails
            if response_type == "fashion_advice":
                from fashion_advice import get_fashion_advice
                return get_fashion_advice(query)
            else:
                return "I'm not sure how to help with that. You can ask me about products, fashion advice, or general questions about ShopMart."
            
    except Exception as e:
        print(f"Error with Gemini API: {e}")
        # Fallback to local responses
        if response_type == "fashion_advice":
            from fashion_advice import get_fashion_advice
            return get_fashion_advice(query)
        else:
            return "I'm not sure how to help with that. You can ask me about products, fashion advice, or general questions about ShopMart."