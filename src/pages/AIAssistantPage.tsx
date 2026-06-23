import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Trash2, Bot, User, Sparkles, ChevronRight } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { t } from '../lib/i18n';
import { getAIResponse } from '../lib/aiKnowledge';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const QUICK_QUESTIONS = {
  ar: [
    'كيف أغسل الحرير؟',
    'كيف أزيل بقعة الدم؟',
    'ما هي رموز الكوي؟',
    'كيف أنظف المناشف؟',
    'كيف أزيل بقعة الزيت؟',
    'كيف أستخدم التبييض؟',
  ],
  en: [
    'How do I wash silk?',
    'How do I remove blood stains?',
    'What are ironing symbols?',
    'How do I clean towels?',
    'How do I remove oil stains?',
    'How do I use bleach safely?',
  ],
};

const WELCOME_MESSAGE = (lang: 'ar' | 'en'): Message => ({
  id: 'welcome',
  role: 'assistant',
  content: getAIResponse('', lang),
  timestamp: new Date(),
});

function formatMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-gold-400">$1</strong>')
    .replace(/^## (.*$)/gm, '<h3 class="text-white font-semibold text-base mt-3 mb-1">$1</h3>')
    .replace(/^• (.*$)/gm, '<li class="ms-4 mb-1">$1</li>')
    .replace(/^🔹 (.*$)/gm, '<li class="ms-4 mb-1">🔹 $1</li>')
    .replace(/^⚠️ (.*$)/gm, '<div class="bg-red-500/10 border border-red-500/20 rounded-lg p-2 my-2 text-red-400">⚠️ $1</div>')
    .replace(/^✅ (.*$)/gm, '<div class="text-green-400 my-0.5">✅ $1</div>')
    .replace(/^❌ (.*$)/gm, '<div class="text-red-400 my-0.5">❌ $1</div>')
    .replace(/\n/g, '<br/>');
}

export default function AIAssistantPage() {
  const { language } = useApp();
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE(language)]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    setMessages([WELCOME_MESSAGE(language)]);
  }, [language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const query = (text ?? input).trim();
    if (!query) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    await new Promise(r => setTimeout(r, 800 + Math.random() * 600));

    const response = getAIResponse(query, language);
    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, assistantMsg]);
    setIsTyping(false);

    // Text-to-speech
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(response.replace(/<[^>]+>/g, '').substring(0, 300));
      utterance.lang = language === 'ar' ? 'ar-SA' : 'en-US';
      utterance.volume = 0.5;
      // Don't auto-play - let user choose
    }
  };

  const toggleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert(language === 'ar' ? 'المتصفح لا يدعم التعرف على الصوت' : 'Browser does not support voice recognition');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'ar' ? 'ar-SA' : 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const clearChat = () => setMessages([WELCOME_MESSAGE(language)]);

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-w-4xl mx-auto">
      {/* Header */}
      <div className="luxury-card p-4 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-500/30 to-gold-700/20 border border-gold-500/30 flex items-center justify-center">
            <Sparkles size={18} className="text-gold-400" />
          </div>
          <div>
            <div className="font-semibold text-white">{t(language, 'aiExpert')}</div>
            <div className="text-xs text-green-400 flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              {language === 'ar' ? 'نشط' : 'Active'}
            </div>
          </div>
        </div>
        <button onClick={clearChat} className="btn-ghost flex items-center gap-2 text-sm px-3 py-2">
          <Trash2 size={14} />
          {t(language, 'clearChat')}
        </button>
      </div>

      {/* Quick questions */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {QUICK_QUESTIONS[language].map(q => (
          <button
            key={q}
            onClick={() => sendMessage(q)}
            className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 glass rounded-full text-xs text-white/60 hover:text-gold-400 hover:border-gold-500/30 transition-all"
          >
            <ChevronRight size={10} />
            {q}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 px-1">
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            {/* Avatar */}
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              msg.role === 'assistant'
                ? 'bg-gradient-to-br from-gold-500/30 to-gold-700/20 border border-gold-500/30'
                : 'bg-gradient-to-br from-blue-500/30 to-blue-700/20 border border-blue-500/30'
            }`}>
              {msg.role === 'assistant' ? <Bot size={14} className="text-gold-400" /> : <User size={14} className="text-blue-400" />}
            </div>

            {/* Bubble */}
            <div className={`max-w-[80%] rounded-2xl p-4 ${
              msg.role === 'assistant'
                ? 'glass border border-gold-500/15 rounded-tl-sm'
                : 'bg-blue-500/20 border border-blue-500/30 rounded-tr-sm'
            }`}>
              {msg.role === 'assistant' ? (
                <div
                  className="text-sm text-white/85 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: formatMarkdown(msg.content) }}
                />
              ) : (
                <p className="text-sm text-white">{msg.content}</p>
              )}
              <div className="text-xs text-white/25 mt-2">
                {msg.timestamp.toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-500/30 to-gold-700/20 border border-gold-500/30 flex items-center justify-center">
              <Bot size={14} className="text-gold-400" />
            </div>
            <div className="glass border border-gold-500/15 rounded-2xl rounded-tl-sm p-4 flex items-center gap-1">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-2 h-2 rounded-full bg-gold-400/60"
                  style={{ animation: `bounce 1s ease-in-out ${i * 0.2}s infinite` }} />
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="luxury-card p-3">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder={t(language, 'askQuestion')}
              rows={1}
              className="luxury-input resize-none max-h-32 py-3"
              style={{ minHeight: '48px' }}
            />
          </div>
          <button
            onClick={toggleVoiceInput}
            className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
              isListening ? 'bg-red-500 text-white animate-pulse' : 'glass text-white/50 hover:text-gold-400'
            }`}
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isTyping}
            className="flex-shrink-0 w-12 h-12 btn-gold rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} className={language === 'ar' ? 'rotate-180' : ''} />
          </button>
        </div>
        {isListening && (
          <div className="mt-2 flex items-center gap-2 text-xs text-red-400">
            <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            {t(language, 'listening')}
          </div>
        )}
      </div>
    </div>
  );
}
