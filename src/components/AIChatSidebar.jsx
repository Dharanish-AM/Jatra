import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Bot, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTrip } from '../context/TripContext';
import routesData from '../data/routes.json';
import hotelsData from '../data/hotels.json';
import { useAIStore } from '../features/ai/store/aiStore';
import { getTravelRecommendation } from '../services/aiService.js';

export default function AIChatSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Namaste! I'm Jatra AI. Ask me for cheapest strategy, best route+hotel combo, budget estimate, and alternate dates.",
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const apiKey = useAIStore((state) => state.apiKey);
  const setApiKey = useAIStore((state) => state.setApiKey);

  const { searchParams, actions } = useTrip();
  const chatEndRef = useRef(null);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-ai-chat', handleOpen);
    return () => window.removeEventListener('open-ai-chat', handleOpen);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (event) => {
    event.preventDefault();
    if (!inputValue.trim() || !apiKey.trim()) return;

    const userMsg = inputValue.trim();
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setInputValue('');
    setIsTyping(true);

    try {
      const relevantRoutes = routesData.filter(
        (route) =>
          route.from.toLowerCase() === searchParams.from.toLowerCase() &&
          route.to.toLowerCase() === searchParams.to.toLowerCase(),
      );

      const relevantHotels = hotelsData.filter(
        (hotel) => hotel.city.toLowerCase() === searchParams.to.toLowerCase(),
      );

      const recommendation = await getTravelRecommendation({
        apiKey,
        message: userMsg,
        searchParams,
        routes: relevantRoutes,
        hotels: relevantHotels,
      });

      if (recommendation.pickedRouteId) {
        actions.setAiPick(recommendation.pickedRouteId);
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: recommendation.answer }]);
    } catch (error) {
      console.error(error);
      toast.error('Failed to connect to AI. Please check your API key.');
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "I'm unable to connect right now. Please check your API key and try again.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close travel assistant overlay"
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-card-bg/95 backdrop-blur-2xl border-l border-border-light z-[110] transform transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.5)] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Jatra AI assistant"
      >
        <div className="flex justify-between items-center p-5 border-b border-border-light bg-gradient-to-r from-primary-bg/80 to-card-bg/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-accent-orange to-accent-orange-light p-2 rounded-xl shadow-[0_4px_10px_rgba(249,115,22,0.3)] border border-white/10">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-extrabold text-white text-lg tracking-wide">Jatra AI</h2>
              <p className="text-xs text-accent-orange font-medium">Claude 3.5 Sonnet</p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close assistant"
            onClick={() => setIsOpen(false)}
            className="text-text-muted hover:text-white p-2 hover:bg-white/5 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!apiKey.trim() ? (
          <div className="p-6 flex-1 flex flex-col justify-center">
            <div className="glass-card p-8 text-center">
              <div className="bg-accent-orange/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[inset_0_0_20px_rgba(249,115,22,0.2)]">
                <KeyRound className="w-10 h-10 text-accent-orange" />
              </div>
              <h3 className="font-bold text-white text-xl mb-3">Claude API Key Required</h3>
              <p className="text-sm text-text-muted mb-8 leading-relaxed">
                Your key is saved only in this browser session.
              </p>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  if (!apiKey.trim()) return;
                  toast.success('API key saved');
                }}
                className="flex flex-col gap-4"
              >
                <input
                  type="password"
                  aria-label="Anthropic API key"
                  placeholder="sk-ant-..."
                  value={apiKey}
                  onChange={(event) => setApiKey(event.target.value.trim())}
                  className="bg-primary-bg/50 border border-border-light text-white text-sm rounded-xl px-5 py-3.5 outline-none focus:border-accent-orange focus:ring-1 focus:ring-accent-orange shadow-inner"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-accent-orange to-accent-orange-light text-primary-bg font-bold py-3.5 rounded-xl hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all"
                >
                  Save API Key
                </button>
              </form>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-5 space-y-6" role="log" aria-live="polite">
              {messages.map((message, index) => (
                <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-sm shadow-md ${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-accent-orange to-accent-orange-light text-primary-bg font-medium rounded-tr-sm'
                        : 'bg-primary-bg/80 border border-border-light text-white rounded-tl-sm backdrop-blur-sm'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-2 mb-2 text-xs font-bold text-accent-orange">
                        <Bot className="w-4 h-4" /> Jatra AI
                      </div>
                    )}
                    <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start animate-fade-in" aria-label="Assistant is typing">
                  <div className="bg-primary-bg/80 border border-border-light rounded-2xl p-4 rounded-tl-sm flex gap-2 items-center backdrop-blur-sm shadow-md">
                    <div className="w-2.5 h-2.5 bg-accent-orange/60 rounded-full animate-bounce" />
                    <div
                      className="w-2.5 h-2.5 bg-accent-orange/60 rounded-full animate-bounce"
                      style={{ animationDelay: '0.15s' }}
                    />
                    <div
                      className="w-2.5 h-2.5 bg-accent-orange/60 rounded-full animate-bounce"
                      style={{ animationDelay: '0.3s' }}
                    />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-5 border-t border-border-light bg-primary-bg/90 backdrop-blur-xl">
              <form onSubmit={handleSendMessage} className="relative flex items-center group">
                <input
                  type="text"
                  aria-label="Ask Jatra AI"
                  placeholder="Ask for cheapest route, budget, alternatives..."
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                  className="w-full bg-card-bg/50 border border-border-light text-white text-sm rounded-full pl-5 pr-14 py-4 outline-none focus:border-accent-orange focus:bg-card-bg transition-all shadow-inner"
                />
                <button
                  type="submit"
                  aria-label="Send message"
                  disabled={!inputValue.trim() || isTyping}
                  className="absolute right-2 p-2.5 bg-accent-orange text-white rounded-full disabled:opacity-50 disabled:bg-border transition-all hover:bg-accent-orange-light hover:scale-105"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </form>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
