def get_faq_answer(query):
    """
    Get answers to frequently asked questions
    
    Args:
        query (str): User's FAQ query
        
    Returns:
        str: FAQ response
    """
    query_lower = query.lower()
    
    if any(word in query_lower for word in ['policy', 'policies']):
        return """Our policies include:
1. Free returns within 30 days
2. Free shipping on orders over ₹1000
3. Secure payment options
4. 24/7 customer support"""
    
    elif any(word in query_lower for word in ['shipping', 'delivery']):
        return """We offer:
1. Standard shipping (3-5 business days)
2. Express shipping (1-2 business days)
3. Free shipping on orders over ₹1000"""
    
    elif any(word in query_lower for word in ['return', 'exchange']):
        return """Our return policy:
1. Free returns within 30 days
2. Items must be unused and in original packaging
3. Refunds processed within 5 business days"""
    
    elif any(word in query_lower for word in ['payment', 'pay']):
        return """We accept:
1. Credit/Debit cards
2. Net banking
3. UPI
4. EMI options"""
    
    elif any(word in query_lower for word in ['track', 'tracking']):
        return """You can track your order:
1. Log in to your account
2. Go to 'My Orders'
3. Click 'Track Order'
4. You'll see the latest status and tracking number"""
    
    elif any(word in query_lower for word in ['order', 'status']):
        return """To check your order status:
1. Log in to your account
2. Go to 'My Orders'
3. You'll see the status of all your recent orders"""
    
    else:
        return "I'm not sure how to help with that. You can ask me about shipping, returns, payments, or order tracking."