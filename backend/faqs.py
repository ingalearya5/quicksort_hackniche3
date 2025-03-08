# faqs.py

# Dictionary of pre-defined FAQ responses
faq_responses = {
    'return_policy': """Our Return Policy:
- You can return most items within 30 days of delivery
- Items must be unused and in original packaging
- Return shipping is free for defective items
- Refunds are processed within 5-7 business days
- Gift returns receive store credit

To initiate a return, log into your account and select the order you wish to return.""",

    'shipping': """Our Shipping Information:
- Standard shipping (3-5 business days): Free on orders over ₹1000
- Express shipping (1-2 business days): ₹200
- Same-day delivery: Available in select cities for ₹500
- International shipping: Available to 30+ countries

Shipping times may vary during peak seasons and sales.""",

    'payment': """Payment Methods Accepted:
- All major credit and debit cards
- UPI payments (Google Pay, PhonePe, Paytm)
- Net banking
- Cash on delivery (for orders under ₹10,000)
- EMI options available on orders over ₹3,000

All payments are secure and encrypted.""",

    'order_tracking': """To Track Your Order:
1. Log into your ShopMart account
2. Go to "My Orders" section
3. Click on the order you want to track
4. Click the "Track Package" button

You can also track your order using the tracking number sent to your email or phone.""",

    'account': """Managing Your Account:
- To create an account: Click "Sign Up" on the homepage
- To reset password: Click "Forgot Password" on the login page
- To update profile: Go to "My Account" > "Profile Settings"
- To view order history: Go to "My Account" > "Order History"

For additional account help, contact customer support.""",

    'contact': """Contact Information:
- Customer Support: 1800-123-4567 (7 AM - 11 PM, all days)
- Email: support@shopmart.com
- Live Chat: Available on our website and app
- Social Media: @ShopMartOfficial on Twitter, Instagram, and Facebook

Our customer support team typically responds within 24 hours.""",

    'size_guide': """Finding Your Size:
- Detailed size charts are available on each product page
- We recommend measuring yourself and comparing with our size chart
- For clothing, measure chest/bust, waist, and hip circumference
- For shoes, measure foot length in centimeters
- If between sizes, we recommend sizing up

Need more help? Contact our customer support for sizing assistance.""",

    'discount': """Discount and Promotions:
- Sign up for our newsletter to receive a 10% off coupon
- Download our app for exclusive app-only discounts
- Student discount: 15% off with verified student ID
- Seasonal sales: Up to 70% off during end-of-season sales
- Loyalty program: Earn points on every purchase

Our current promotions are displayed on our homepage."""
}

def get_faq_answer(query):
    query_lower = query.lower()
    
    # Check for specific FAQ topics
    if any(word in query_lower for word in ['return', 'refund', 'exchange', 'money back']):
        return faq_responses['return_policy']
    
    elif any(word in query_lower for word in ['shipping', 'delivery', 'ship', 'deliver']):
        return faq_responses['shipping']
    
    elif any(word in query_lower for word in ['payment', 'pay', 'card', 'upi', 'cash']):
        return faq_responses['payment']
    
    elif any(word in query_lower for word in ['track', 'order status', 'where is my order', 'package']):
        return faq_responses['order_tracking']
    
    elif any(word in query_lower for word in ['account', 'login', 'sign up', 'profile', 'password']):
        return faq_responses['account']
    
    elif any(word in query_lower for word in ['contact', 'phone', 'email', 'support', 'help']):
        return faq_responses['contact']
    
    elif any(word in query_lower for word in ['size', 'fit', 'measurement', 'dimension']):
        return faq_responses['size_guide']
    
    elif any(word in query_lower for word in ['discount', 'coupon', 'promo', 'sale', 'offer']):
        return faq_responses['discount']
    
    # Generic response if no specific match is found
    return """I can answer frequently asked questions about:
1. Return policy and refunds
2. Shipping and delivery options
3. Payment methods
4. Order tracking
5. Account management
6. Contact information
7. Size guides
8. Discounts and promotions

Could you specify what information you're looking for?"""