# Dictionary of pre-defined fashion advice responses
fashion_advice_responses = {
    'wedding': """For a wedding, consider these options:
1. Formal option: A well-fitted suit in navy or charcoal, or a formal dress in an elegant color.
2. Semi-formal option: Dress pants with a blazer, or a cocktail dress.
3. Accessories: Minimal jewelry, dress shoes, and a small bag.

Avoid wearing white (reserved for the bride) or extremely bright colors that might distract from the couple.""",

    'casual': """For a casual everyday look:
1. Classic option: Well-fitted jeans paired with a t-shirt or casual button-up shirt.
2. Comfort option: Chinos or casual pants with a polo shirt or casual sweater.
3. Accessories: Clean sneakers, minimal jewelry, and a casual watch.

Focus on fit and comfort for everyday wear.""",

    'office': """For office or business attire:
1. Professional option: A business suit in navy, gray, or black, or a blouse with dress pants/skirt.
2. Business casual: Chinos or dress pants with a button-up shirt or blouse.
3. Accessories: Leather shoes, minimal jewelry, and a professional bag.

Always prioritize a neat, clean appearance for professional settings.""",

    'date': """For a date night:
1. Restaurant option: Dark jeans with a nice button-up shirt or blouse, or a casual dress.
2. Casual option: Well-fitted jeans with a stylish top or casual button-up.
3. Accessories: Clean shoes, minimal jewelry, and a light fragrance.

Wear something that makes you feel confident and comfortable.""",

    'trends': """Current fashion trends include:
1. Sustainable and eco-friendly fashion choices
2. Oversized silhouettes and comfortable fits
3. Vintage and Y2K inspired looks
4. Monochromatic outfits
5. Gender-neutral clothing options

Remember that personal style matters more than following trends.""",

    'sneakers': """White sneakers remain a versatile classic that can be paired with almost anything. They work well with:
1. Casual outfits: Jeans, t-shirts, and casual tops
2. Semi-formal looks: Chinos, button-ups, and blazers
3. Summer outfits: Shorts, sundresses, and light clothing

Clean, minimal white sneakers are still very much in style and are considered a wardrobe staple.""",

    'colors': """When matching colors in an outfit:
1. Neutral base: Start with neutral colors (black, white, navy, beige) as a foundation
2. Complementary colors: Use the color wheel to find complementary shades
3. Monochromatic: Different shades of the same color create an elegant look
4. Statement piece: Use one bold color as a statement against neutral pieces

For beginners, the 60-30-10 rule works well: 60% dominant color, 30% secondary color, 10% accent color."""
}

def get_fashion_advice(query):
    query_lower = query.lower()
    
    # Check for specific fashion scenarios
    if any(word in query_lower for word in ['wedding', 'formal event', 'ceremony']):
        return fashion_advice_responses['wedding']
    
    elif any(word in query_lower for word in ['casual', 'everyday', 'day to day']):
        return fashion_advice_responses['casual']
    
    elif any(word in query_lower for word in ['office', 'work', 'business', 'professional']):
        return fashion_advice_responses['office']
    
    elif any(word in query_lower for word in ['date', 'dinner', 'restaurant']):
        return fashion_advice_responses['date']
    
    elif any(word in query_lower for word in ['trend', 'trending', 'fashion']):
        return fashion_advice_responses['trends']
    
    elif any(word in query_lower for word in ['sneaker', 'white sneaker', 'shoe']):
        return fashion_advice_responses['sneakers']
    
    elif any(word in query_lower for word in ['color', 'match', 'combination']):
        return fashion_advice_responses['colors']
    
    # Generic response if no specific match is found
    return """I can provide fashion advice for different occasions:
1. For formal events like weddings
2. For casual everyday wear
3. For office or professional settings
4. For date nights or social events
5. About current fashion trends
6. About specific items like sneakers
7. About color matching and combinations

Could you specify what type of fashion advice you're looking for?"""