// components/Chatbot.js
"use client"
import { useState, useRef, useEffect } from 'react';

// Language options
const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'zh-cn', name: '中文' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'ru', name: 'Русский' },
  { code: 'ar', name: 'العربية' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'pt', name: 'Português' },
  { code: 'it', name: 'Italiano' }
];

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [supportedLanguages, setSupportedLanguages] = useState([]);
  const messagesEndRef = useRef(null);

  // Fetch welcome message and supported languages
  useEffect(() => {
    const fetchWelcomeMessage = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/get-welcome-message?language=${selectedLanguage}`);
        if (response.ok) {
          const data = await response.json();
          setMessages([{ text: data.message, isBot: true }]);
          
          if (data.supportedLanguages) {
            setSupportedLanguages(data.supportedLanguages);
          }
        } else {
          // Fallback to local welcome messages
          const welcomeMessages = {
            'en': 'Hi there! 👋 How can I help you today?',
            'es': '¡Hola! 👋 ¿Cómo puedo ayudarte hoy?',
            'fr': 'Bonjour! 👋 Comment puis-je vous aider aujourd\'hui?',
            'de': 'Hallo! 👋 Wie kann ich Ihnen heute helfen?',
            'zh-cn': '你好！👋 今天我能帮你什么？',
            'ja': 'こんにちは！👋 今日はどのようにお手伝いできますか？',
            'ko': '안녕하세요! 👋 오늘 어떻게 도와드릴까요?',
            'ru': 'Привет! 👋 Как я могу помочь вам сегодня?',
            'ar': 'مرحباً! 👋 كيف يمكنني مساعدتك اليوم؟',
            'hi': 'नमस्ते! 👋 आज मैं आपकी कैसे मदद कर सकता हूँ?',
            'pt': 'Olá! 👋 Como posso ajudar você hoje?',
            'it': 'Ciao! 👋 Come posso aiutarti oggi?'
          };
          setMessages([{ text: welcomeMessages[selectedLanguage] || welcomeMessages['en'], isBot: true }]);
        }
      } catch (error) {
        console.error('Error fetching welcome message:', error);
        // Use default message if API fails
        setMessages([{ text: 'Hi there! 👋 How can I help you today?', isBot: true }]);
      }
    };

    fetchWelcomeMessage();
  }, [selectedLanguage]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Add user message to chat
    const userMessage = { text: inputValue, isBot: false };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // Send message to backend API
      const response = await fetch(`${API_BASE_URL}/api/chatbot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: userMessage.text,
          language: selectedLanguage
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch response');
      }
      
      const data = await response.json();
      
      // Add bot response to chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: data.response, isBot: true },
      ]);

      // If the language of the response is different from selected language, update it
      if (data.language && data.language !== selectedLanguage) {
        setSelectedLanguage(data.language);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Get UI text for error message
      const uiText = {
        'en': { error: 'Sorry, I encountered an error. Please try again later.' },
        'es': { error: 'Lo siento, encontré un error. Por favor, inténtalo de nuevo más tarde.' },
        'fr': { error: 'Désolé, j\'ai rencontré une erreur. Veuillez réessayer plus tard.' },
        'de': { error: 'Entschuldigung, ich bin auf einen Fehler gestoßen. Bitte versuchen Sie es später erneut.' },
        'zh-cn': { error: '抱歉，我遇到了错误。请稍后再试。' },
        'ja': { error: '申し訳ありませんが、エラーが発生しました。後でもう一度お試しください。' },
        'ko': { error: '죄송합니다. 오류가 발생했습니다. 나중에 다시 시도해주세요.' },
        'ru': { error: 'Извините, я столкнулся с ошибкой. Пожалуйста, повторите попытку позже.' },
        'ar': { error: 'عذرًا، واجهت خطأ. الرجاء المحاولة مرة أخرى لاحقًا.' },
        'hi': { error: 'क्षमा करें, मुझे एक त्रुटि मिली है। कृपया बाद में पुनः प्रयास करें।' },
        'pt': { error: 'Desculpe, encontrei um erro. Por favor, tente novamente mais tarde.' },
        'it': { error: 'Mi dispiace, ho riscontrato un errore. Si prega di riprovare più tardi.' }
      };
      
      setMessages((prevMessages) => [
        ...prevMessages,
        { 
          text: uiText[selectedLanguage]?.error || uiText['en'].error,
          isBot: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Get UI text based on selected language
  const getUiText = () => {
    const uiTextMap = {
      'en': {
        placeholder: 'Type your message...',
        title: 'ShopMart Assistant',
        send: 'Send',
        productSuggestion: 'Search for products',
        fashionAdvice: 'Fashion advice',
        shippingInfo: 'Shipping information',
        closeButton: 'Close'
      },
      'es': {
        placeholder: 'Escribe tu mensaje...',
        title: 'Asistente de ShopMart',
        send: 'Enviar',
        productSuggestion: 'Buscar productos',
        fashionAdvice: 'Consejos de moda',
        shippingInfo: 'Información de envío',
        closeButton: 'Cerrar'
      },
      'fr': {
        placeholder: 'Tapez votre message...',
        title: 'Assistant ShopMart',
        send: 'Envoyer',
        productSuggestion: 'Rechercher des produits',
        fashionAdvice: 'Conseils de mode',
        shippingInfo: 'Informations de livraison',
        closeButton: 'Fermer'
      },
      // Add more languages as needed
    };
    
    return uiTextMap[selectedLanguage] || uiTextMap['en'];
  };

  const uiText = getUiText();

  // Handle RTL languages (like Arabic)
  const isRtl = selectedLanguage === 'ar';
  
  // Quick suggestions
  const handleQuickSuggestion = (suggestion) => {
    setInputValue(suggestion);
  };

  // Render rich message content (handle product cards, etc.)
  const renderMessageContent = (message) => {
    // Simple implementation for now - in a real app, you'd parse the message
    // to identify special content types like product cards
    return <p className="whitespace-pre-line text-sm">{message}</p>;
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chatbot toggle button */}
      <button
        onClick={toggleChatbot}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg flex items-center justify-center transition-all"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chatbot window */}
      {isOpen && (
        <div 
          className={`absolute bottom-16 right-0 w-80 sm:w-96 max-h-[80vh] bg-white rounded-lg shadow-xl overflow-hidden flex flex-col transition-all`}
          dir={isRtl ? 'rtl' : 'ltr'}
          style={{animation: 'slide-up 0.3s ease-out'}}
        >
          {/* Chatbot header */}
          <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <h3 className="font-medium">{uiText.title}</h3>
            </div>
            <div className="flex items-center">
              {/* Language selector */}
              <select 
                value={selectedLanguage}
                onChange={handleLanguageChange}
                className="mr-2 text-xs bg-blue-500 text-white border border-blue-400 rounded p-1"
                aria-label="Select language"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
              <button 
                onClick={toggleChatbot} 
                className="text-white hover:text-gray-200"
                aria-label="Close chat"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Chatbot messages */}
          <div className="flex-1 p-4 overflow-y-auto max-h-[50vh]">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-3 ${
                  message.isBot ? 'flex justify-start' : 'flex justify-end'
                }`}
              >
                {message.isBot && (
                  <div className="flex-shrink-0 mr-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                )}
                <div
                  className={`max-w-xs sm:max-w-sm p-3 rounded-lg ${
                    message.isBot
                      ? 'bg-gray-100 text-gray-800 rounded-bl-none'
                      : 'bg-blue-600 text-white rounded-br-none'
                  }`}
                >
                  {renderMessageContent(message.text)}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start mb-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="bg-gray-100 p-3 rounded-lg rounded-bl-none">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions */}
          <div className="px-4 py-2 border-t border-gray-200">
            <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-thin">
              <button
                onClick={() => handleQuickSuggestion("Show me some products")}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm whitespace-nowrap"
              >
                {uiText.productSuggestion}
              </button>
              <button
                onClick={() => handleQuickSuggestion("What's trending in fashion?")}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm whitespace-nowrap"
              >
                {uiText.fashionAdvice}
              </button>
              <button
                onClick={() => handleQuickSuggestion("How does shipping work?")}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm whitespace-nowrap"
              >
                {uiText.shippingInfo}
              </button>
            </div>
          </div>

          {/* Chatbot input */}
          <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-4">
            <div className="flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder={uiText.placeholder}
                className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg disabled:opacity-50 flex items-center justify-center"
                disabled={isLoading || !inputValue.trim()}
                aria-label="Send message"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .scrollbar-thin::-webkit-scrollbar {
          height: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.5);
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
};

export default Chatbot;