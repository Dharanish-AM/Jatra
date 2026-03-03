import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Bot, User, KeyRound, Loader2 } from 'lucide-react';
import { useTrip } from '../context/TripContext';
import routesData from '../data/routes.json';
import toast from 'react-hot-toast';

export default function AIChatSidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const [apiKey, setApiKey] = useState('');
    const [isApiKeySet, setIsApiKeySet] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Namaste! I'm Jatra AI, your travel assistant. Ready to find the perfect route for you?" }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const { searchParams, actions } = useTrip();
    const chatEndRef = useRef(null);

    useEffect(() => {
        const handleOpen = () => setIsOpen(true);
        window.addEventListener('open-ai-chat', handleOpen);

        const storedKey = sessionStorage.getItem('jatra_ai_key');
        if (storedKey) {
            setApiKey(storedKey);
            setIsApiKeySet(true);
        }

        return () => window.removeEventListener('open-ai-chat', handleOpen);
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const saveApiKey = (e) => {
        e.preventDefault();
        if (apiKey.trim()) {
            sessionStorage.setItem('jatra_ai_key', apiKey.trim());
            setIsApiKeySet(true);
            toast.success("API key saved!");
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputValue.trim() || !isApiKeySet) return;

        const userMsg = inputValue.trim();
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setInputValue('');
        setIsTyping(true);

        try {
            const relevantRoutes = routesData.filter(r =>
                r.from.toLowerCase() === searchParams.from.toLowerCase() &&
                r.to.toLowerCase() === searchParams.to.toLowerCase()
            );

            const systemPrompt = `You are Jatra AI, a friendly Indian travel assistant. 
The user is searching routes from ${searchParams.from || 'their origin'} to ${searchParams.to || 'their destination'} on ${searchParams.date || 'a specific date'} 
for ${searchParams.passengers} passengers. Available routes: ${JSON.stringify(relevantRoutes)}.
Recommend the best option by explicitly stating the route ID (e.g., "[AI_PICK: r2]") and giving a short reason. 
Keep replies under 100 words. Use ₹ for currency. Add relevant travel tips for this route. Be warm and helpful.`;

            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01',
                    'anthropic-dangerously-allow-browser': 'true'
                },
                body: JSON.stringify({
                    model: 'claude-3-5-sonnet-20241022',
                    max_tokens: 300,
                    system: systemPrompt,
                    messages: [
                        ...messages.filter(m => m.role !== 'system').map(m => ({ role: m.role, content: m.content })),
                        { role: 'user', content: userMsg }
                    ]
                })
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            let reply = data.content[0].text;

            const pickMatch = reply.match(/\[AI_PICK:\s*([^\]]+)\]/);
            if (pickMatch) {
                const routeId = pickMatch[1].trim();
                actions.setAiPick(routeId);
                reply = reply.replace(/\[AI_PICK:\s*([^\]]+)\]/, '').trim();
            }

            setMessages(prev => [...prev, { role: 'assistant', content: reply }]);

        } catch (error) {
            console.error(error);
            toast.error("Failed to connect to AI. Please check your API key.");
            setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I'm having trouble connecting right now. Please check your API key or try again later." }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-300"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}

            <div
                className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-card-bg/95 backdrop-blur-2xl border-l border-border-light z-[110] transform transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.5)] ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex justify-between items-center p-5 border-b border-border-light bg-gradient-to-r from-primary-bg/80 to-card-bg/80 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-accent-orange to-accent-orange-light p-2 rounded-xl shadow-[0_4px_10px_rgba(249,115,22,0.3)] border border-white/10">
                            <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="font-extrabold text-white text-lg tracking-wide">Jatra AI</h2>
                            <p className="text-xs text-accent-orange font-medium flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-accent-orange animate-pulse"></span> Online
                            </p>
                        </div>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="text-text-muted hover:text-white p-2 hover:bg-white/5 rounded-full transition-colors flex items-center justify-center">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {!isApiKeySet ? (
                    <div className="p-6 flex-1 flex flex-col justify-center">
                        <div className="glass-card p-8 text-center">
                            <div className="bg-accent-orange/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[inset_0_0_20px_rgba(249,115,22,0.2)]">
                                <KeyRound className="w-10 h-10 text-accent-orange" />
                            </div>
                            <h3 className="font-bold text-white text-xl mb-3">Claude API Key Required</h3>
                            <p className="text-sm text-text-muted mb-8 leading-relaxed">Unlock intelligent travel routing. Your Anthropic API key is stored securely in your local browser session.</p>
                            <form onSubmit={saveApiKey} className="flex flex-col gap-4">
                                <input
                                    type="password"
                                    placeholder="sk-ant-..."
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    className="bg-primary-bg/50 border border-border-light text-white text-sm rounded-xl px-5 py-3.5 outline-none focus:border-accent-orange focus:ring-1 focus:ring-accent-orange shadow-inner transition-all"
                                />
                                <button type="submit" className="bg-gradient-to-r from-accent-orange to-accent-orange-light text-primary-bg font-bold py-3.5 rounded-xl hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all hover-lift">
                                    Authenticate AI
                                </button>
                            </form>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 overflow-y-auto p-5 space-y-6">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                                    <div className={`max-w-[85%] rounded-2xl p-4 text-sm shadow-md ${msg.role === 'user'
                                        ? 'bg-gradient-to-br from-accent-orange to-accent-orange-light text-primary-bg font-medium rounded-tr-sm'
                                        : 'bg-primary-bg/80 border border-border-light text-white rounded-tl-sm backdrop-blur-sm'
                                        }`}>
                                        {msg.role === 'assistant' && (
                                            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-accent-orange">
                                                <Bot className="w-4 h-4" /> Jatra AI
                                            </div>
                                        )}
                                        <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                                    </div>
                                </div>
                            ))}

                            {isTyping && (
                                <div className="flex justify-start animate-fade-in">
                                    <div className="bg-primary-bg/80 border border-border-light rounded-2xl p-4 rounded-tl-sm flex gap-2 items-center backdrop-blur-sm shadow-md">
                                        <div className="w-2.5 h-2.5 bg-accent-orange/60 rounded-full animate-bounce"></div>
                                        <div className="w-2.5 h-2.5 bg-accent-orange/60 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                                        <div className="w-2.5 h-2.5 bg-accent-orange/60 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef}></div>
                        </div>

                        <div className="p-5 border-t border-border-light bg-primary-bg/90 backdrop-blur-xl">
                            <form onSubmit={handleSendMessage} className="relative flex items-center group">
                                <input
                                    type="text"
                                    placeholder="Type your message..."
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    className="w-full bg-card-bg/50 border border-border-light text-white text-sm rounded-full pl-5 pr-14 py-4 outline-none focus:border-accent-orange focus:bg-card-bg transition-all shadow-inner"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim() || isTyping}
                                    className="absolute right-2 p-2.5 bg-accent-orange text-white rounded-full disabled:opacity-50 disabled:bg-border transition-all hover:bg-accent-orange-light hover:scale-105 shadow-[0_2px_10px_rgba(249,115,22,0.3)] group-focus-within:shadow-[0_2px_15px_rgba(249,115,22,0.5)]"
                                >
                                    <Send className="w-4 h-4 ml-0.5" />
                                </button>
                            </form>
                            <p className="text-[10px] text-text-muted text-center mt-3 flex items-center justify-center gap-1">
                                Powered by <span className="font-semibold text-white">Claude 3.5 Sonnet</span>
                            </p>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
