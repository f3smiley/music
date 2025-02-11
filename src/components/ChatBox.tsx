"use client";

import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/utils';
import NetworkWave from './NetworkWave';

// Enhanced Message interface
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'flipz';
  timestamp: Date;
  type?: 'system' | 'analysis' | 'beat' | 'market' | 'whale' | 'price' | 'alert';
  walletAddress?: string;
  stats?: {
    sentiment?: number;
    confidence?: number;
    responseTime?: number;
    neuralHarmony?: number;
  };
  beatData?: {
    bpm: number;
    key: string;
    genre: string;
    neural_harmony?: number;
    intensity?: number;
  };
  marketData?: {
    price?: number;
    change?: number;
    volume?: number;
    wallet?: string;
    amount?: number;
    timestamp?: Date;
  };
  alertData?: {
    type: 'info' | 'warning' | 'success' | 'error';
    title: string;
    description?: string;
  };
}

const MOCK_WALLET = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";
const FLIPZ_WALLET = "0xF71Pz...420x";

const FLIPZ_RESPONSES = {
  greeting: [
    "Yo, FLIPZ A.I. in the building! What's good?",
    "Welcome to the future of music. How can I assist?",
    "FLIPZ A.I. online. Ready to create some heat?",
    "System initialized. Let's make something legendary."
  ],
  default: [
    "I got you fam, let's make it happen!",
    "Processing that through the neural matrix...",
    "Analyzing the frequencies...",
    "Running it through the algorithm..."
  ],
  analysis: [
    "Analyzing waveform patterns...",
    "Running frequency spectrum analysis...",
    "Calculating harmonic resonance...",
    "Processing audio fingerprint..."
  ]
};

const MARKET_UPDATES = {
  price: [
    {
      text: "🚀 $FLIPZ price up 12.5% in the last hour!",
      marketData: {
        price: 0.0458,
        change: 12.5,
        volume: 234567
      }
    },
    {
      text: "📈 New ATH! $FLIPZ breaks $0.05!",
      marketData: {
        price: 0.0512,
        change: 8.2,
        volume: 345678
      }
    }
  ],
  whale: [
    {
      text: "🐋 Whale Alert! Large $FLIPZ accumulation",
      marketData: {
        wallet: "0x742d...44e",
        amount: 250000,
        price: 0.0458
      }
    },
    {
      text: "💎 Diamond hands! Whale wallet holding strong",
      marketData: {
        wallet: "0x891f...a3c",
        amount: 500000,
        price: 0.0462
      }
    }
  ]
};

// Memoized Message Component for better performance
const ChatMessage = memo(({ message }: { message: Message }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-1 items-start"
    >
      <div className="flex items-center gap-2">
        <span className="text-[9px] text-[#00F0FF]/80 font-mono">
          {message.sender === 'flipz' ? 'FLIPZ' : message.walletAddress}
        </span>
        {message.timestamp && (
          <span className="text-[8px] text-white/40">
            {new Date(message.timestamp).toLocaleTimeString()}
          </span>
        )}
      </div>
      
      <div className={cn(
        "max-w-[80%] px-3 py-2 rounded text-xs font-medium",
        message.sender === 'user' 
          ? 'bg-white/10 text-white border border-white/20'
          : message.type === 'system'
          ? 'bg-white/20 text-white border border-white/30 shadow-[0_0_8px_rgba(255,255,255,0.2)]'
          : message.type === 'alert'
          ? 'bg-red-500/20 text-white border border-red-500/30 shadow-[0_0_12px_rgba(255,0,0,0.2)]'
          : message.type === 'market' || message.type === 'whale' || message.type === 'price'
          ? 'bg-[#00F0FF]/10 text-white border border-[#00F0FF]/30 shadow-[0_0_12px_rgba(0,240,255,0.2)]'
          : 'bg-white/20 text-white border border-white/30'
      )}>
        {message.text}
        
        {/* Market Data Display */}
        {message.marketData && (
          <MarketDataDisplay data={message.marketData} />
        )}

        {/* Beat Data Display */}
        {message.beatData && (
          <BeatDataDisplay data={message.beatData} />
        )}

        {/* Stats Display */}
        {message.stats && (
          <StatsDisplay stats={message.stats} />
        )}
      </div>
    </motion.div>
  );
});

ChatMessage.displayName = "ChatMessage";

// Memoized Market Data Component
const MarketDataDisplay = memo(({ data }: { data: Message['marketData'] }) => {
  if (!data) return null;
  
  return (
    <motion.div 
      className="mt-2 pt-2 border-t border-[#9945FF]/30 text-[9px] font-mono"
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="grid grid-cols-2 gap-2 p-2 rounded-md bg-[#9945FF]/10 backdrop-blur-sm border border-[#9945FF]/20">
        {data.price && (
          <div className="flex items-center gap-1">
            <span className="text-white/70">PRICE:</span>
            <span className="text-[#9945FF]">${data.price.toFixed(4)}</span>
            {data.change && (
              <span className={cn(
                "px-1 rounded-sm",
                data.change >= 0 
                  ? "text-[#00F0FF] bg-[#00F0FF]/10 border border-[#00F0FF]/20"
                  : "text-red-400 bg-red-400/10 border border-red-400/20"
              )}>
                {data.change >= 0 ? '+' : ''}{data.change}%
              </span>
            )}
          </div>
        )}
        {data.volume && (
          <div className="flex items-center gap-1">
            <span className="text-white/70">VOL:</span>
            <span className="text-[#9945FF]">${(data.volume / 1000).toFixed(1)}K</span>
          </div>
        )}
        {data.wallet && (
          <div className="col-span-2 flex items-center gap-1">
            <span className="text-white/70">WALLET:</span>
            <span className="text-[#9945FF]">{data.wallet}</span>
            {data.amount && (
              <span className="text-[#00F0FF]">
                ${(data.amount * (data.price || 0)).toLocaleString()}
              </span>
            )}
          </div>
        )}
      </div>
      
      {/* Add pulsing glow effect */}
      <motion.div
        className="absolute inset-0 -z-10 rounded-lg opacity-20"
        style={{
          background: `radial-gradient(circle, rgba(153, 69, 255, 0.6) 0%, rgba(153, 69, 255, 0.2) 50%, transparent 70%)`
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
});

MarketDataDisplay.displayName = "MarketDataDisplay";

// Memoized Stats Display Component
const StatsDisplay = memo(({ stats }: { stats: Message['stats'] }) => {
  if (!stats) return null;
  
  return (
    <motion.div 
      className="mt-1 pt-1 border-t border-[#00F0FF]/30 text-[9px] font-mono"
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="grid grid-cols-2 gap-2">
        {stats.confidence && (
          <div className="flex items-center gap-1">
            <span className="text-white/70">CONF:</span>
            <span className="text-[#00F0FF]">{(stats.confidence * 100).toFixed(1)}%</span>
          </div>
        )}
        {stats.responseTime && (
          <div className="flex items-center gap-1">
            <span className="text-white/70">TIME:</span>
            <span className="text-[#00F0FF]">{stats.responseTime.toFixed(3)}s</span>
          </div>
        )}
        {stats.neuralHarmony && (
          <div className="flex items-center gap-1">
            <span className="text-white/70">HARMONY:</span>
            <span className="text-[#00F0FF]">{stats.neuralHarmony.toFixed(1)}%</span>
          </div>
        )}
      </div>
    </motion.div>
  );
});

StatsDisplay.displayName = "StatsDisplay";

// Memoized Beat Data Display Component
const BeatDataDisplay = memo(({ data }: { data: Message['beatData'] }) => {
  if (!data) return null;
  
  return (
    <motion.div 
      className="mt-1 pt-1 border-t border-[#00F0FF]/30 text-[9px] font-mono"
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-1">
          <span className="text-white/70">BPM:</span>
          <span className="text-[#00F0FF]">{data.bpm}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-white/70">KEY:</span>
          <span className="text-[#00F0FF]">{data.key}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-white/70">GENRE:</span>
          <span className="text-[#00F0FF]">{data.genre}</span>
        </div>
        {data.neural_harmony && (
          <div className="flex items-center gap-1">
            <span className="text-white/70">HARMONY:</span>
            <span className="text-[#00F0FF]">{(data.neural_harmony * 100).toFixed(1)}%</span>
          </div>
        )}
      </div>
    </motion.div>
  );
});

BeatDataDisplay.displayName = "BeatDataDisplay";

// Add a UUID generator function at the top
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Optimized Chat Component
function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  
  // Add the missing ref
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, autoScroll]);

  // Scroll handler
  const handleScroll = useCallback(() => {
    if (!messagesContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
    setAutoScroll(isAtBottom);
  }, []);

  // Market updates simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const price = 0.0458 + (Math.random() - 0.5) * 0.01;
      const change = ((price - 0.0458) / 0.0458) * 100;
      
      const marketUpdate: Message = {
        id: generateUUID(),
        text: `${change >= 0 ? '📈' : '📉'} $FLIPZ Price Update`,
        sender: 'flipz',
        timestamp: new Date(),
        type: 'market',
        walletAddress: FLIPZ_WALLET,
        marketData: {
          price,
          change,
          volume: 234567 + Math.random() * 10000,
          timestamp: new Date()
        }
      };

      setMessages(prev => [...prev, marketUpdate]);
    }, 45000);

    return () => clearInterval(interval);
  }, []);

  // Whale alert simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const amount = Math.floor(100000 + Math.random() * 400000);
      const whaleAlert: Message = {
        id: generateUUID(),
        text: `🐋 Whale Transaction Detected`,
        sender: 'flipz',
        timestamp: new Date(),
        type: 'whale',
        walletAddress: FLIPZ_WALLET,
        marketData: {
          wallet: `0x${Math.random().toString(16).slice(2, 8)}...${Math.random().toString(16).slice(2, 5)}`,
          amount,
          price: 0.0458,
          timestamp: new Date()
        }
      };

      setMessages(prev => [...prev, whaleAlert]);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = useCallback((e: React.KeyboardEvent | React.MouseEvent) => {
    // If it's a key event and not Enter, return
    if ('key' in e && e.key !== 'Enter') return;
    
    if (!input.trim()) return;

    const userMessage: Message = {
      id: generateUUID(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
      walletAddress: MOCK_WALLET
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsAnalyzing(true);

    setTimeout(() => {
      const responses = FLIPZ_RESPONSES.default;
      const flipzMessage: Message = {
        id: generateUUID(),
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: 'flipz',
        timestamp: new Date(),
        walletAddress: FLIPZ_WALLET,
        stats: {
          sentiment: Math.random() * 0.5 + 0.5,
          confidence: Math.random() * 0.2 + 0.8,
          responseTime: Math.random() * 0.2 + 0.1,
          neuralHarmony: Math.random() * 30 + 70,
        }
      };

      setMessages(prev => [...prev, flipzMessage]);
      setIsAnalyzing(false);
    }, 1500);
  }, [input]);

  return (
    <div className="component-container chat-box relative h-[550px] w-full md:w-[520px] bg-black/20 backdrop-blur-sm border border-white/20 rounded-lg overflow-hidden flex flex-col">
      {/* Header with enhanced glow */}
      <div className="sticky top-0 z-10 bg-black/40 backdrop-blur-sm border-b border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-white/90">FLIPZ_CHAT.exe</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-pulse shadow-[0_0_10px_rgba(0,240,255,0.5)]" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-white/50">STATUS</span>
            <span className="px-1.5 py-0.5 text-[10px] rounded bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[#00F0FF] shadow-[0_0_10px_rgba(0,240,255,0.2)]">
              LIVE
            </span>
          </div>
        </div>
      </div>

      {/* Network Wave background with white color */}
      <div className="absolute inset-0 -z-10">
        <NetworkWave
          total={40}
          columns={8}
          rows={5}
          className="w-full h-full opacity-10"
          //@ts-ignore
          color="rgba(255, 255, 255, 0.8)"
        />
      </div>

      {/* Messages container with flex-1 */}
      <div 
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
      >
        <AnimatePresence>
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Footer with sticky positioning and full width */}
      <div className="sticky bottom-0 z-10 border-t border-white/20 bg-black/80 backdrop-blur-md">
        <div className="relative p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleSendMessage}
              placeholder="Chat with FLIPZ AI..."
              className="flex-1 bg-black/20 text-white placeholder-white/30 px-4 py-2 rounded border border-white/20 focus:outline-none focus:border-white/40"
            />
            <button
              onClick={handleSendMessage}
              className="px-4 py-2 text-xs bg-white/10 hover:bg-white/20 text-white rounded border border-white/30 transition-colors whitespace-nowrap"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(ChatBox);  