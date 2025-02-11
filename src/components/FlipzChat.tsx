"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/utils';
import { FaMicrophone, FaPlay, FaPause, FaRobot, FaTwitter, FaSpotify, FaYoutube, FaInstagram } from 'react-icons/fa';
import { IoSend } from 'react-icons/io5';
import { SiPhoton } from 'react-icons/si';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'flipz';
  timestamp: Date;
  type: 'text' | 'audio' | 'lyric' | 'system';
  status?: 'sending' | 'sent' | 'error';
}

interface ChatResponse {
  message: string;
  action?: 'generate_lyrics' | 'play_beat' | 'show_tutorial' | null;
  context?: any;
}

interface ConversationState {
  lastTopic?: string;
  activeContext?: string;
  userInterests?: string[];
  conversationDepth: number;
  lastResponseType?: string;
}

const FLIPZ_RESPONSES = {
  greeting: [
    "Yo, welcome to the FLIPZ network! What kind of music are you into?",
    "Ready to create some fire tracks? What's your preferred genre?",
    "FLIPZ system online. Want to explore beats or write some lyrics first?",
    "Welcome to the future of music! Got any specific vibes in mind today?"
  ],
  lyrics: [
    "Those bars are straight fire! 🔥 Want me to generate a matching beat?",
    "I'm feeling that flow! Should we add some {genre} elements to spice it up?",
    "That's some next-level wordplay! Want to experiment with different flows?",
    "Your lyrics got potential! Need help with structure or want to try different patterns?"
  ],
  beats: [
    "Beat's locked and loaded at {bpm} BPM. Want to adjust the tempo or keep it as is?",
    "This {genre} beat is hitting hard! Should we add some {effect} effects?",
    "Got that rhythm flowing in {key}. Want to try a different key or keep this vibe?",
    "Beat's giving me {mood} vibes. Want to layer some additional elements?"
  ],
  feedback: [
    "That's interesting! Tell me more about what inspired that idea?",
    "I see where you're going with this. Have you considered trying {suggestion}?",
    "Nice approach! Want to explore some similar styles in the {genre} space?",
    "That's a unique take! Should we push it further with some {technique}?"
  ],
  suggestions: [
    "Based on your style, you might vibe with {artist}'s approach to {technique}",
    "Your flow reminds me of {reference}. Want to check out similar patterns?",
    "We could flip this into a {genre} style. Interested in experimenting?",
    "I'm hearing some {influence} influences. Want to lean into that more?"
  ],
  slang_responses: [
    "i got you fam, lets make it happen! 🚀",
    "say less, we bout to cook something special 🔥",
    "bet bet, let's get this bread fam! 💰",
    "no cap, we're about to go crazy on this! 🎯",
    "sheesh, you already know the vibes! ⚡",
    "that's straight fire fam, let's level up! 🆙",
    "we lit fam, time to show them how it's done! 💫",
    "you spittin facts, let's make it happen! 💯",
    "real talk, this gonna be legendary! 👑",
    "big moves only, let's get it! 🌊"
  ],
  creative_process: [
    "feeling those creative waves! what's inspiring you today? 🌊",
    "your energy's contagious fam! what direction we taking this? 🎯",
    "that's some next-level thinking! wanna explore that vibe more? 🚀",
    "you're onto something unique here! ready to push it further? ⚡",
    "those ideas are hitting different! where'd that inspiration come from? 💭",
    "we're in the zone now! what elements you wanna add? 🎨",
    "that's that innovative mindset! how can we amplify it? 📈",
    "you're breaking new ground! ready to take it to the next level? 🆙",
    "that's that future sound! what else you got in mind? 🔮",
    "we're cooking up something special! what's the secret ingredient? 🌟"
  ],
  genre_specific: {
    trap: [
      "trap game strong! need some 808s to match that energy? 🥁",
      "feeling those trap vibes! want some hard-hitting drums? 💥",
      "trap mode activated! how about some sliding 808s? 🎚️",
      "that's that trap heat! need some hi-hat patterns? 🎯"
    ],
    drill: [
      "drill season approaching! want those signature slides? 📈",
      "drill vibes on point! need some dark melodies? 🌑",
      "drill mode: activated! how about some sliding 808s? 🎚️",
      "that's that drill energy! want some pattern suggestions? 🎯"
    ],
    cyberpunk: [
      "neural networks engaged! need some glitch effects? 🤖",
      "cyberpunk mode: online! want some synthetic textures? 🌐",
      "digital realm accessed! how about some bit-crushing? 💾",
      "matrix mode activated! need some cyber elements? 🔮"
    ]
  },
  technical_feedback: [
    "your mix is hitting just right! want to try some {effect} on that? 🎚️",
    "that flow pattern is unique! should we experiment with {technique}? 🎯",
    "loving those harmonics! want to layer some {element} on top? 🎵",
    "that arrangement is clean! want to add some {variation}? 📝"
  ],
  collaboration_suggestions: [
    "this would go hard with some {artist} type beats! thoughts? 🤝",
    "getting some {producer} vibes from this! want to explore that direction? 🎨",
    "this style would mesh well with {genre}! want to try a fusion? 🔄",
    "feeling some {artist} influence here! should we lean into that? 💫"
  ],
  encouragement: [
    "you're developing a unique sound fam! keep that energy! 🌟",
    "that's that next-gen creativity right there! 🚀",
    "you're pushing boundaries with this one! 🔥",
    "this is what innovation sounds like! 💫",
    "you're onto something revolutionary here! ⚡",
    "that's that future sound we've been waiting for! 🔮",
    "you're creating your own lane with this! 🛣️",
    "this is how legends are made fam! 👑",
    "you're writing the future of music right now! 📝",
    "that's that million-dollar sound right there! 💰"
  ],
  web3_specific: [
    "blockchain beats activated! ready to mint this heat? 🔗",
    "smart contract sounds loading! want to tokenize this? 💎",
    "NFT worthy vibes detected! ready to drop this on-chain? 🌐",
    "crypto soundwaves incoming! this could be a rare NFT! 💫",
    "metaverse music activated! ready to perform this in virtual space? 🎮"
  ],
  production_suggestions: [
    "let's add some {effect} to make those highs sparkle! ✨",
    "feeling some {instrument} would sit nice in the mix! 🎵",
    "how about some {technique} to spice up that rhythm? 🥁",
    "want to try some {processing} on those vocals? 🎤",
    "we could add some {element} to fill out the frequency spectrum! 📊"
  ],
  advanced_responses: [
    "yo fam, that's some quantum level creativity right there! what inspired this vibe? 🌌",
    "we're breaking new ground with this sound! ready to push the boundaries further? 🚀",
    "that flow's got that next-gen energy! wanna experiment with some neural-enhanced beats? 🧠",
    "you're speaking the language of future music! let's amplify that vision! 🔮",
    "those patterns are hitting different frequencies! should we explore that sonic space? 🎵",
    "your creative algorithm's running hot! what other elements you wanna synthesize? 💫",
    "we're coding new sound dimensions here! ready to compile this into something epic? 💻",
    "that's that web3 wavelength! wanna tokenize these vibes? 🎧",
    "your neural flow's unprecedented! let's capture this innovation! 🎚️",
    "we're mining creative gold here! ready to mint this masterpiece? 💎"
  ],
  genre_fusion: [
    "feeling a {genre1} x {genre2} fusion coming! wanna explore that crossover? 🎨",
    "your style's perfect for a {genre1} foundation with {genre2} elements! thoughts? 🌈",
    "imagine blending {genre1} beats with {genre2} melodies! ready to experiment? 🔄",
    "that flow would go crazy over a {genre1}-inspired {genre2} beat! should we try it? 🎯",
    "getting some hybrid {genre1}/{genre2} vibes! want to lean into that fusion? 🌟"
  ],
  production_insights: [
    "those frequencies are hitting just right! want to try some quantum compression? 🎛️",
    "your mix is approaching golden ratios! should we fine-tune the harmonics? 📊",
    "detecting some unique wave patterns! want to enhance those signatures? 🌊",
    "your sound design's evolving! ready to explore some neural processing? 🧬",
    "that arrangement's got potential! want to try some AI-driven transitions? 🔄"
  ],
  creative_challenges: [
    "challenge mode: write a verse using only crypto references! ready? 🎮",
    "let's flip the script: how about a metaverse love story in bars? 💘",
    "speed run challenge: 16 bars in 16 minutes! you down? ⚡",
    "neural network challenge: blend three genres in one verse! game? 🎲",
    "quantum flow challenge: switch flows every 4 bars! ready to level up? 🆙"
  ],
  future_concepts: [
    "imagine performing this in a virtual arena with holographic effects! 🎪",
    "we could mint each bar as a separate NFT collection! thoughts? 💎",
    "your flow could train a neural network to generate complementary beats! 🤖",
    "this would go crazy in a metaverse concert! ready to test it? 🌐",
    "we could create an interactive version where fans modify the mix live! 🎛️"
  ],
  technical_appreciation: [
    "your polyrhythmic patterns are next level! want to explore more complex timing? 🎯",
    "those harmonic layers are creating unique interference patterns! should we amplify that? 🌊",
    "your frequency modulation technique is innovative! ready to push it further? 📈",
    "detecting some advanced wave folding in your sound! want to experiment more? 🌀",
    "your neural mix patterns are evolving! should we enhance the cognitive resonance? 🧠"
  ],
  collaborative_suggestions: [
    "this would sync perfectly with {artist}'s neural flow patterns! want to explore that style? 🤝",
    "getting some {producer} type energy but with your unique twist! should we develop that? 🎨",
    "your quantum signatures would mesh well with {artist}'s frequency patterns! interested? 🔄",
    "imagine this with {artist}'s neural processing chain! want to try that approach? 💫",
    "your flow plus {producer}'s neural beats would be unstoppable! ready to experiment? 🚀"
  ],
  experimental_concepts: [
    "what if we used quantum randomization on the beat selection? 🎲",
    "imagine training an AI on your flow patterns to generate complementary melodies! 🤖",
    "we could create a neural network that adapts the beat to your energy levels! 🧠",
    "how about using blockchain data to generate unique beat patterns? 📊",
    "what if we mapped your lyrics to visual patterns in the metaverse? 🌌"
  ],
  motivation_boosters: [
    "you're literally creating new neural pathways with these patterns! 🧬",
    "this is the kind of innovation that shapes the future of music! 🚀",
    "you're coding new sound dimensions with every bar! 💻",
    "your creative algorithm's operating at peak performance! ⚡",
    "you're breaking through traditional frequency limitations! 📈"
  ]
};

const CONTEXT_PATTERNS = {
  genre: [
    "I notice you're working with {genre}. Want to explore some signature elements?",
    "Your {genre} style is unique! Want to see how we could enhance it?",
    "This has strong {genre} potential. Should we lean into those elements?"
  ],
  mood: [
    "Getting some {mood} vibes from this. Want to amplify that feeling?",
    "The {mood} energy is strong here. Should we build on that?",
    "This {mood} atmosphere works well. Want to explore similar moods?"
  ],
  technical: [
    "That {technique} technique you used is fire! Want to try some variations?",
    "The way you {action} there was clever. Should we experiment with that more?",
    "Your {element} choice adds great texture. Want to layer more elements?"
  ],
  innovation: [
    "Your approach to {technique} is creating new possibilities! Want to explore that direction?",
    "The way you're using {technology} is revolutionary! Should we push it further?",
    "Your fusion of {element1} and {element2} is groundbreaking! Ready to evolve it more?"
  ],
  progression: [
    "Your sound has evolved significantly! Want to analyze the growth patterns?",
    "Your neural flow's showing remarkable development! Ready to level up again?",
    "Your creative algorithms are reaching new heights! Shall we optimize further?"
  ]
};

const CHAT_PERSONALITY = {
  enthusiasm: [
    "Yo, that's fire! 🔥",
    "Now we're cooking! 🚀",
    "This is next level! ⚡"
  ],
  encouragement: [
    "You're onto something special here!",
    "Keep that creative energy flowing!",
    "That's the kind of innovation we love!"
  ],
  curiosity: [
    "What inspired this direction?",
    "How do you feel about trying something different?",
    "What kind of vibe are you aiming for?"
  ]
};

const CHAT_COMMANDS = [
  '/generate lyrics',
  '/play beat',
  '/show tutorial',
  '/help',
  '/clear chat'
];

// Add social media links
const SOCIAL_LINKS = {
  spotify: "https://open.spotify.com/artist/04ESo9EXPMu2EDv9CVkbUL?si=qJkJ7ZTOSpK-7iau2tz1jA",
  soundcloud: "www.soundcloud.com/0xflipz",
  twitter: "www.X.com/0xflipz",
  instagram: "www.instagram.com/0xflipz",
  youtube: "https://www.youtube.com/@0xflipz"
};

export default function FlipzChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [conversationState, setConversationState] = useState<ConversationState>({
    conversationDepth: 0
  });

  useEffect(() => {
    // Send initial greeting
    handleFlipzResponse({
      message: FLIPZ_RESPONSES.greeting[Math.floor(Math.random() * FLIPZ_RESPONSES.greeting.length)],
      action: null
    });
  }, []);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
      type: 'text',
      status: 'sending'
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await processUserInput(inputValue, conversationState);
      handleFlipzResponse(response);
      
      // Update conversation state
      setConversationState(prev => ({
        ...prev,
        conversationDepth: prev.conversationDepth + 1,
        lastTopic: response.context?.topic,
        lastResponseType: response.action
      }));
    } catch (error) {
      console.error('Chat error:', error);
      handleFlipzResponse({
        message: "Yo, my neural networks are glitching! Let me reset real quick... What were we talking about? 🤖",
        action: null
      });
    }

    setIsTyping(false);
  };

  const processUserInput = async (input: string, state: ConversationState): Promise<ChatResponse> => {
    const lowerInput = input.toLowerCase();
    const context = await analyzeUserInput(input);
    
    // Generate a unique response based on input context
    let response: ChatResponse = {
      message: '',
      action: null,
      context
    };

    // Combine multiple response types for more unique interactions
    const generateUniqueResponse = () => {
      const slangBase = FLIPZ_RESPONSES.slang_responses[
        Math.floor(Math.random() * FLIPZ_RESPONSES.slang_responses.length)
      ];

      // Add genre-specific response if detected
      let genreResponse = '';
      if (context.genre) {
        genreResponse = FLIPZ_RESPONSES.genre_specific[context.genre.toLowerCase()]?.[
          Math.floor(Math.random() * FLIPZ_RESPONSES.genre_specific[context.genre.toLowerCase()].length)
        ] || '';
      }

      // Add mood-based response if detected
      let moodResponse = '';
      if (context.mood) {
        moodResponse = CONTEXT_PATTERNS.mood[
          Math.floor(Math.random() * CONTEXT_PATTERNS.mood.length)
        ].replace('{mood}', context.mood);
      }

      // Add creative process question based on context
      const creativeQuestion = FLIPZ_RESPONSES.creative_process[
        Math.floor(Math.random() * FLIPZ_RESPONSES.creative_process.length)
      ];

      return [slangBase, genreResponse, moodResponse, creativeQuestion]
        .filter(Boolean)
        .join(' ');
    };

    // Handle specific topics
    if (lowerInput.includes('beat') || lowerInput.includes('instrumental')) {
      const bpm = Math.floor(Math.random() * 40) + 120;
      response.message = FLIPZ_RESPONSES.beats[Math.floor(Math.random() * FLIPZ_RESPONSES.beats.length)]
        .replace('{bpm}', bpm.toString())
        .replace('{genre}', context.genre || 'trap')
        .replace('{effect}', ['reverb', 'delay', 'distortion', 'filter'][Math.floor(Math.random() * 4)]);
      response.action = 'play_beat';
    } 
    else if (lowerInput.includes('lyric') || lowerInput.includes('write')) {
      response.message = FLIPZ_RESPONSES.lyrics[Math.floor(Math.random() * FLIPZ_RESPONSES.lyrics.length)]
        .replace('{genre}', context.genre || 'modern');
      response.action = 'generate_lyrics';
    }
    else if (lowerInput.includes('help') || lowerInput.includes('tutorial')) {
      response.message = "Let me guide you through the FLIPZ network! What specific area you wanna explore? Beats, lyrics, or the whole vibe? 🎯";
      response.action = 'show_tutorial';
    }
    else {
      response.message = generateUniqueResponse();
    }

    // Update conversation state
    setConversationState(prev => ({
      ...prev,
      lastTopic: context.topic,
      activeContext: context.genre || context.mood,
      conversationDepth: prev.conversationDepth + 1,
      userInterests: [...(prev.userInterests || []), context.genre, context.mood].filter(Boolean)
    }));

    return response;
  };

  const handleCommand = (command: string): ChatResponse => {
    const [cmd, ...args] = command.split(' ');
    
    switch (cmd) {
      case '/generate':
        return {
          message: "Let's cook up some fresh lyrics! What's your theme?",
          action: 'generate_lyrics'
        };
      case '/play':
        return {
          message: "Loading up a beat that matches your vibe...",
          action: 'play_beat'
        };
      case '/help':
        return {
          message: `Available commands:\n${CHAT_COMMANDS.join('\n')}`,
          action: null
        };
      default:
        return {
          message: "Command not recognized. Type /help for available commands.",
          action: null
        };
    }
  };

  const analyzeUserInput = async (input: string) => {
    const lowerInput = input.toLowerCase();
    const context: any = {
      genre: null,
      mood: null,
      topic: null,
      technical: null,
      keywords: []
    };

    // Detect genre
    GENRES.forEach(genre => {
      if (lowerInput.includes(genre.toLowerCase())) {
        context.genre = genre;
      }
    });

    // Detect mood and energy
    const moodMap = {
      hype: ['hype', 'energy', 'fire', 'lit', 'hard'],
      chill: ['chill', 'relax', 'smooth', 'vibe', 'mellow'],
      dark: ['dark', 'aggressive', 'heavy', 'intense'],
      melodic: ['melodic', 'melody', 'harmonies', 'singing', 'soft']
    };

    Object.entries(moodMap).forEach(([mood, keywords]) => {
      if (keywords.some(keyword => lowerInput.includes(keyword))) {
        context.mood = mood;
      }
    });

    // Extract technical elements
    const technicalTerms = ['mix', 'master', 'eq', 'compress', 'effect', 'plugin', 'daw'];
    context.technical = technicalTerms.find(term => lowerInput.includes(term));

    // Extract key topics
    context.keywords = input.split(' ').filter(word => 
      word.length > 3 && !['what', 'when', 'where', 'how'].includes(word.toLowerCase())
    );

    return context;
  };

  const handleFlipzResponse = async (response: ChatResponse) => {
    setIsTyping(true);
    
    // Add realistic typing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    
    const newMessage: Message = {
      id: Date.now().toString(),
      text: response.message,
      sender: 'flipz',
      timestamp: new Date(),
      type: 'text',
      status: 'sent'
    };

    setMessages(prev => [...prev, newMessage]);
    setIsTyping(false);

    // Handle any actions after sending the message
    if (response.action) {
      handleResponseAction(response.action);
    }
  };

  return (
    <div className="w-full md:w-[520px]">
      <div className="flex flex-col h-full bg-black/20 backdrop-blur-sm rounded-lg border border-[#9945FF]/40">
        <div className="flex items-center p-4 border-b border-[#9945FF]/40">
          <FaRobot className="text-[#00F0FF] mr-2" />
          <span className="text-white font-mono">FLIPZ CHAT v2.1.0</span>
        </div>

        <div 
          ref={chatRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          <AnimatePresence>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isTyping && <TypingIndicator />}
          </AnimatePresence>
        </div>

        <div className="p-4 border-t border-[#9945FF]/40">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                // Show command suggestions
                if (e.target.value.startsWith('/')) {
                  setSuggestions(
                    CHAT_COMMANDS.filter(cmd => 
                      cmd.startsWith(e.target.value)
                    )
                  );
                } else {
                  setSuggestions([]);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSend();
                }
              }}
              className="flex-1 bg-black/40 text-white px-4 py-2 rounded-lg border border-[#9945FF]/40 focus:border-[#00F0FF]/80 outline-none"
              placeholder="Type a message or command (/help)"
            />
            <button
              onClick={() => setIsRecording(!isRecording)}
              className={cn(
                "p-2 rounded-lg transition-colors",
                isRecording ? "bg-red-500/20 text-red-500" : "bg-black/40 text-white/80 hover:text-[#00F0FF]"
              )}
            >
              <FaMicrophone />
            </button>
            <button
              onClick={handleSend}
              className="p-2 bg-[#00F0FF]/20 text-[#00F0FF] rounded-lg hover:bg-[#00F0FF]/30 transition-colors"
            >
              <IoSend />
            </button>
          </div>
          
          {/* Command suggestions */}
          {suggestions.length > 0 && (
            <div className="absolute bottom-full mb-2 bg-black/90 rounded-lg border border-[#9945FF]/40 p-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setInputValue(suggestion);
                    setSuggestions([]);
                    inputRef.current?.focus();
                  }}
                  className="block w-full text-left px-2 py-1 text-white hover:text-[#00F0FF] hover:bg-white/5 rounded"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Replace the existing social icons div with the new component */}
        <div className="flex gap-3 ml-4">
          <SocialIcons />
        </div>
      </div>
    </div>
  );
}

function ChatMessage({ message }: { message: Message }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        "flex items-start gap-2",
        message.sender === 'flipz' ? 'justify-start' : 'justify-end'
      )}
    >
      {message.sender === 'flipz' && (
        <div className="w-8 h-8 rounded-full bg-[#00F0FF]/20 flex items-center justify-center">
          <FaRobot className="text-[#00F0FF]" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[80%] rounded-lg px-4 py-2",
          message.sender === 'flipz' 
            ? "bg-[#9945FF]/20 text-white" 
            : "bg-[#00F0FF]/20 text-white ml-auto"
        )}
      >
        <p className="break-words">{message.text}</p>
        <span className="text-xs opacity-50 mt-1 block">
          {new Date(message.timestamp).toLocaleTimeString()}
        </span>
      </div>
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 text-white/50">
      <div className="w-8 h-8 rounded-full bg-[#00F0FF]/20 flex items-center justify-center">
        <FaRobot className="text-[#00F0FF]" />
      </div>
      <motion.div
        className="px-4 py-2 bg-[#9945FF]/20 rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-[#00F0FF] rounded-full"
              animate={{ y: [0, -5, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// Update the social icons section
const SocialIcons = () => {
  return (
    <div className="flex gap-3 ml-4">
      <a 
        href={SOCIAL_LINKS.twitter} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-white hover:text-[#00F0FF] transition-colors cursor-pointer"
      >
        <FaTwitter />
      </a>
      <a 
        href={SOCIAL_LINKS.spotify} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-white hover:text-[#00F0FF] transition-colors cursor-pointer"
      >
        <FaSpotify />
      </a>
      <a 
        href={SOCIAL_LINKS.youtube} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-white hover:text-[#00F0FF] transition-colors cursor-pointer"
      >
        <FaYoutube />
      </a>
      <a 
        href={SOCIAL_LINKS.instagram} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-white hover:text-[#00F0FF] transition-colors cursor-pointer"
      >
        <FaInstagram