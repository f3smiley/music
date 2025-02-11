"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/utils';

const GENRES = [
  "Trap", 
  "Drill", 
  "Boom Bap",
  "Web3 Rap",
  "Cloud Rap",
  "Phonk",
  "Hyperpop",
  "Lo-fi Hip Hop",
  "Synthwave Rap",
  "Cyber Punk",
  "Future Bass",
  "Glitch Hop"
];

const HOOKS = [
  "Stack my ETH up in the metaverse (yeah)",
  "NFT money got me feeling cursed (sheesh)",
  "Mining blocks while these ops rehearse (what)",
  "Smart contracts make my pockets burst (facts)",
  "Web3 gang, we don't fuck with banks (nah)",
  "Blockchain life got unlimited ranks (up)",
  "DeFi money hit different ways (cash)",
  "Crypto life, we don't see no days (never)",
  "Digital dreams in my neural space (plug)",
  "Quantum flows got me levitating (float)",
  "AI mind, human heart collide (sync)",
  "Cyber streets where the data flows (hack)",
  "Neural nets got my mind enhanced (boost)",
  "Virtual worlds in my DNA (code)"
];

// First, let's define a proper structure type
interface VerseStructure {
  sections: Array<{
    name: string;
    lines: number;
  }>;
  flow: string;
  rhymeScheme: string;
  tempo: string;
  adLibFrequency: string;
}

// Update the VERSE_STRUCTURES object to match the new interface
const VERSE_STRUCTURES: Record<string, VerseStructure> = {
  trap: {
    sections: [
      { name: 'VERSE 1', lines: 8 },
      { name: 'HOOK', lines: 4 },
      { name: 'VERSE 2', lines: 8 },
      { name: 'HOOK', lines: 4 }
    ],
    flow: "triplet",
    rhymeScheme: "AABB",
    tempo: "fast",
    adLibFrequency: "high"
  },
  drill: {
    sections: [
      { name: 'INTRO', lines: 4 },
      { name: 'VERSE', lines: 8 },
      { name: 'HOOK', lines: 4 },
      { name: 'OUTRO', lines: 4 }
    ],
    flow: "sliding",
    rhymeScheme: "ABAB",
    tempo: "aggressive",
    adLibFrequency: "medium"
  },
  boomBap: {
    sections: [
      { name: 'VERSE 1', lines: 8 },
      { name: 'HOOK', lines: 4 },
      { name: 'VERSE 2', lines: 8 },
      { name: 'HOOK', lines: 4 }
    ],
    flow: "steady",
    rhymeScheme: "ABAB",
    tempo: "classic",
    adLibFrequency: "low"
  },
  synthwave: {
    sections: [
      { name: 'VERSE 1', lines: 8 },
      { name: 'HOOK', lines: 4 },
      { name: 'VERSE 2', lines: 8 },
      { name: 'HOOK', lines: 4 }
    ],
    flow: "melodic",
    rhymeScheme: "AABBA",
    tempo: "atmospheric",
    adLibFrequency: "minimal"
  },
  cyberPunk: {
    sections: [
      { name: 'VERSE 1', lines: 8 },
      { name: 'HOOK', lines: 4 },
      { name: 'VERSE 2', lines: 8 },
      { name: 'HOOK', lines: 4 }
    ],
    flow: "glitch",
    rhymeScheme: "AABAAB",
    tempo: "erratic",
    adLibFrequency: "high"
  }
};

const AD_LIBS = [
  "skrrt!", 
  "yeah!", 
  "what!", 
  "sheesh!", 
  "gang!", 
  "facts!",
  "no cap!",
  "talk!"
];

const THEMES = {
  web3: [
    "blockchain", "crypto", "NFT", "smart contracts",
    "DeFi", "metaverse", "mining", "tokens",
    "smart wallet", "gas fees", "web3 social", "DAO life",
    "governance", "yield farming", "liquidity", "staking"
  ],
  cyberpunk: [
    "neural link", "cyber implants", "digital dreams",
    "neon streets", "quantum code", "virtual reality",
    "data streams", "neural networks", "binary soul"
  ],
  future: [
    "AI fusion", "quantum leap", "digital ascension",
    "cyber enhancement", "neural upgrade", "virtual essence",
    "digital transformation", "synthetic evolution"
  ],
  flex: [
    "racks", "bands", "chains", "whips",
    "drip", "ice", "stack", "flex"
  ],
  tech: [
    "algorithm", "neural", "digital", "cyber",
    "quantum", "virtual", "binary", "matrix"
  ]
};

// Add status types for better state management
type GeneratorStatus = 'idle' | 'ready' | 'generating' | 'error';

// Add this type at the top with other interfaces
interface LyricsModalProps {
  lyrics: string;
  onClose: () => void;
}

// Add these SVG components at the top of the file
const CloseIcon = () => (
  <svg 
    width="14" 
    height="14" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
    className="text-[#00F0FF]"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const DownloadIcon = () => (
  <svg 
    width="14" 
    height="14" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
    className="text-[#00F0FF]"
  >
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

// Update the LyricsModal component
function LyricsModal({ lyrics, onClose }: LyricsModalProps) {
  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([lyrics], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "flipz_lyrics.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] overflow-y-auto p-4"
    >
      <div className="min-h-full flex items-center justify-center py-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-black/90 border border-[#9945FF]/30 rounded-lg w-full max-w-md"
        >
          <div className="p-4 flex flex-col">
            {/* Lyrics Display */}
            <div 
              className="bg-black/40 rounded p-3 mb-4 text-xs text-white/90 
                       whitespace-pre-line max-h-[60vh] overflow-y-auto custom-scrollbar"
            >
              {lyrics}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={handleDownload}
                className="flex-1 py-2 px-4 bg-[#9945FF]/20 hover:bg-[#9945FF]/30 
                         border border-[#9945FF]/30 hover:border-[#9945FF]/50 
                         rounded text-white font-medium text-xs transition-all duration-200"
              >
                DOWNLOAD LYRICS
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2 px-4 bg-[#9945FF]/20 hover:bg-[#9945FF]/30 
                         border border-[#9945FF]/30 hover:border-[#9945FF]/50 
                         rounded text-white font-medium text-xs transition-all duration-200"
              >
                CLOSE
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Add new theme-based vocabulary
const THEME_MODIFIERS = {
  web3: ['blockchain', 'crypto', 'defi', 'token', 'smart contract', 'wallet', 'nft', 'dao', 'metaverse'],
  trap: ['drip', 'flex', 'stack', 'grind', 'hustle', 'vibe', 'gang', 'squad'],
  future: ['cyber', 'neural', 'quantum', 'digital', 'virtual', 'synthetic', 'hologram', 'matrix'],
  tech: ['algorithm', 'binary', 'protocol', 'system', 'network', 'code', 'data', 'signal']
};

// Add this helper function at the top of the file with other constants
const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Move these outside as they don't need component state
const LINE_BREAK = '\n';
const SECTION_BREAK = '\n\n';
const BRIDGE_SEPARATOR = '* * *';

// Add more dynamic vocabulary and patterns
const LYRIC_PATTERNS = {
  trap: [
    "Pull up in the {vehicle} with that {item} ({adlib})",
    "{action} through the {place} like a {character} ({adlib})",
    "Got that {adjective} flow, can't {verb} me ({adlib})",
    "{theme} life got me {feeling} up ({adlib})",
    "Stack my {currency} till it {verb} up ({adlib})",
    "In my {location} with that {item} lit ({adlib})",
    "{verb} on these {noun} they can't comprehend ({adlib})",
    "Every day we {action}, that's the {theme} way ({adlib})"
  ],
  cyberpunk: [
    "Neural {item} running through my {bodyPart} ({adlib})",
    "Digital {noun} in my {location} space ({adlib})",
    "Cyber {action} got my {item} enhanced ({adlib})",
    "Quantum {noun} in the {place} tonight ({adlib})",
    "{verb} through the {location} with my {item} ({adlib})",
    "Future {noun} got me feeling {adjective} ({adlib})",
    "Tech {flow} in my {bodyPart}, can't stop now ({adlib})",
    "{theme} dreams in the matrix of time ({adlib})"
  ],
  drill: [
    "On the {location} with my {item} ({adlib})",
    "They can't {verb} with my {noun} flow ({adlib})",
    "{action} through the {place}, they know ({adlib})",
    "Got that {adjective} style, watch it {verb} ({adlib})",
    "{theme} life, we don't play around ({adlib})",
    "In the {place} with my {item} down ({adlib})",
    "Every {noun} got that {adjective} sound ({adlib})",
    "{action} through the {location}, can't slow down ({adlib})"
  ],
  synthwave: [
    "Neon {noun} in the {location} light ({adlib})",
    "Retro {item} got my {bodyPart} right ({adlib})",
    "Synthetic {flow} through the {place} tonight ({adlib})",
    "Digital {action} in the {adjective} sky ({adlib})",
    "Wave {verb} through my {noun} mind ({adlib})",
    "{theme} vibes in the {location} shine ({adlib})",
    "Future {noun} got that {adjective} design ({adlib})",
    "{action} through the grid, we're {feeling} fine ({adlib})"
  ],
  boomBap: [
    "Classic {noun} with that {adjective} flow ({adlib})",
    "Old school {item} how we {action} though ({adlib})",
    "In the {location} where the {noun} grow ({adlib})",
    "{theme} life is all I know ({adlib})",
    "Got that {adjective} style from long ago ({adlib})",
    "{verb} through the {place} with the show ({adlib})",
    "Every {noun} got that golden glow ({adlib})",
    "{action} like the legends, that's the {flow} ({adlib})"
  ]
};

// Add dynamic vocabulary for substitution
const VOCABULARY = {
  vehicle: ["Lambo", "Tesla", "Phantom", "spaceship", "cyber-whip", "quantum ride"],
  item: ["stack", "chip", "drive", "code", "neural link", "crypto wallet", "smart contract"],
  action: ["floating", "gliding", "hacking", "mining", "flipping", "staking", "trading"],
  place: ["metaverse", "blockchain", "matrix", "cyberspace", "neural net", "digital realm"],
  character: ["phantom", "hacker", "trader", "miner", "cyber ghost", "digital demon"],
  adjective: ["encrypted", "quantum", "digital", "cyber", "neural", "virtual", "augmented"],
  feeling: ["leveled", "powered", "charged", "encrypted", "programmed", "synchronized"],
  currency: ["ETH", "SOL", "BTC", "FLIPZ", "tokens", "credits", "coins"],
  location: ["server", "network", "mainframe", "blockchain", "protocol", "platform"],
  bodyPart: ["mind", "brain", "system", "cortex", "network", "interface"],
  flow: ["algorithm", "protocol", "program", "sequence", "function", "pattern"],
  noun: ["data", "codes", "blocks", "tokens", "bytes", "scripts", "protocols"],
  verb: ["hack", "mine", "flip", "stack", "code", "sync", "trade", "build"]
};

// Helper functions for complexity variations
const getMetaphor = () => {
  const metaphors = [
    "like binary in the matrix",
    "flowing through digital veins",
    "encrypted in the mainframe",
    "coded in the neural net",
    "running through quantum gates",
    "pulsing through cyber networks",
    "dancing in digital rain",
    "echoing through virtual space"
  ];
  return metaphors[Math.floor(Math.random() * metaphors.length)];
};

const getEmphasis = () => {
  const emphasis = [
    "whispered", 
    "echoed", 
    "distorted", 
    "glitched", 
    "automated",
    "synthesized",
    "encrypted",
    "quantized"
  ];
  return emphasis[Math.floor(Math.random() * emphasis.length)];
};

const getCommentary = () => {
  const comments = [
    "system overload",
    "buffer overflow",
    "stack trace",
    "debug mode",
    "runtime error",
    "neural sync",
    "quantum state",
    "digital echo"
  ];
  return comments[Math.floor(Math.random() * comments.length)];
};

const getVocalEffect = () => {
  const effects = [
    "vocoder",
    "autotune",
    "reverb",
    "delay",
    "bitcrush",
    "glitch",
    "phase",
    "quantum"
  ];
  return effects[Math.floor(Math.random() * effects.length)];
};

export default function LyricGenerator() {
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [lyrics, setLyrics] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Cyberpunk');
  const [hook, setHook] = useState('');
  const [structure, setStructure] = useState(VERSE_STRUCTURES.trap);
  const [useAdLibs, setUseAdLibs] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [bpm, setBpm] = useState(Math.floor(Math.random() * 40) + 120); // 120-160 BPM
  const [key, setKey] = useState(['Am', 'Cm', 'Gm', 'Fm'][Math.floor(Math.random() * 4)]);
  const [mood, setMood] = useState(['Energetic', 'Dark', 'Melodic', 'Aggressive'][Math.floor(Math.random() * 4)]);
  const [status, setStatus] = useState<GeneratorStatus>('idle');
  const [selectedTheme, setSelectedTheme] = useState('web3');
  const [complexity, setComplexity] = useState(50);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const generateHook = useCallback(() => {
    const randomHook = HOOKS[Math.floor(Math.random() * HOOKS.length)];
    setHook(randomHook);
  }, []);

  // Move these functions inside the component
  const generateThematicLine = (theme: string, userTheme: string, complexity: number): string => {
    const genre = selectedGenre.toLowerCase();
    const patterns = LYRIC_PATTERNS[genre as keyof typeof LYRIC_PATTERNS] || LYRIC_PATTERNS.trap;
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    
    // Replace placeholders with vocabulary
    const line = pattern.replace(/{(\w+)}/g, (match, key) => {
      const options = VOCABULARY[key as keyof typeof VOCABULARY] || [];
      const themeWords = userTheme.split(' ').filter(word => word.length > 2);
      
      // Sometimes use theme-specific words
      if (Math.random() < 0.3 && themeWords.length > 0) {
        return themeWords[Math.floor(Math.random() * themeWords.length)];
      }
      
      return options[Math.floor(Math.random() * options.length)];
    });

    // Add complexity variations
    if (complexity > 70) {
      return addComplexityVariations(line);
    }
    
    return line;
  };

  const addComplexityVariations = (line: string): string => {
    const variations = [
      (l: string) => `${l} [${getMetaphor()}]`,
      (l: string) => `*${getEmphasis()}* ${l}`,
      (l: string) => `${l} // ${getCommentary()}`,
      (l: string) => `[${getVocalEffect()}] ${l}`,
    ];

    const variation = variations[Math.floor(Math.random() * variations.length)];
    return variation(line);
  };

  const formatLyricSection = (name: string, lines: string[], adLibs: boolean = false) => {
    const formattedLines = lines.map(line => {
      const adLib = adLibs ? ` ${AD_LIBS[Math.floor(Math.random() * AD_LIBS.length)]}` : '';
      return `${line}${adLib}`;
    });
    
    return `[${name}]${LINE_BREAK}${formattedLines.join(LINE_BREAK)}${SECTION_BREAK}`;
  };

  const generateBridge = (theme: string, flow: string) => {
    const bridgeLines = [
      `${BRIDGE_SEPARATOR}${LINE_BREAK}`,
      `[BRIDGE]${LINE_BREAK}`,
      `In the ${flow} flow, we're taking it higher (yeah)${LINE_BREAK}`,
      `${capitalize(theme)} vibes, we're lighting the fire (what)${LINE_BREAK}`,
      `${BRIDGE_SEPARATOR}${LINE_BREAK}`
    ].join('');
    
    return bridgeLines;
  };

  const generateThematicLines = (theme: string, count: number, complexity: number): string[] => {
    const lines: string[] = [];
    for (let i = 0; i < count; i++) {
      const themeWord = THEME_MODIFIERS[selectedTheme as keyof typeof THEME_MODIFIERS]?.[
        Math.floor(Math.random() * THEME_MODIFIERS[selectedTheme as keyof typeof THEME_MODIFIERS]?.length)
      ] || theme;
      lines.push(generateThematicLine(themeWord, theme, complexity));
    }
    return lines;
  };

  // Update the generateLyrics function
  const generateLyrics = async () => {
    setStatus('generating');
    setGenerating(true);
    
    try {
      const userTheme = prompt.toLowerCase();
      const structure = VERSE_STRUCTURES[selectedGenre.toLowerCase() as keyof typeof VERSE_STRUCTURES] || VERSE_STRUCTURES.trap;
      
      let finalLyrics = '';
      
      // Add intro if present
      if (structure.sections.find(s => s.name === 'INTRO')) {
        const introLines = generateThematicLines(userTheme, 4, complexity);
        finalLyrics += formatLyricSection('INTRO', introLines);
      }
      
      // Generate verses and hooks with proper spacing
      structure.sections.forEach((section, index) => {
        const lines = generateThematicLines(userTheme, section.lines, complexity);
        
        // Add extra spacing before hooks
        if (section.name === 'HOOK' && index > 0) {
          finalLyrics += LINE_BREAK;
        }
        
        finalLyrics += formatLyricSection(
          section.name, 
          lines, 
          useAdLibs && structure.adLibFrequency === 'high'
        );
        
        // Add bridge after first hook
        if (section.name === 'HOOK' && index === 1) {
          finalLyrics += generateBridge(userTheme, structure.flow);
        }
      });
      
      // Add outro if present
      if (structure.sections.find(s => s.name === 'OUTRO')) {
        const outroLines = generateThematicLines(userTheme, 4, complexity);
        finalLyrics += formatLyricSection('OUTRO', outroLines);
      }
      
      setLyrics(finalLyrics);
      setShowModal(true);
      setStatus('idle');
      setGenerating(false);
    } catch (error) {
      console.error('Error generating lyrics:', error);
      setStatus('error');
      setGenerating(false);
    }
  };

  // Update input handler to change status immediately when text is entered
  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPrompt = e.target.value;
    setPrompt(newPrompt);
    // Update status based on input presence
    setStatus(newPrompt.trim().length > 0 ? 'ready' : 'idle');
  };

  // Add this function to generate rain drops
  const renderRainDrops = () => {
    const drops = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 2,
      duration: 0.8 + Math.random() * 0.6, // Faster rain
      width: Math.random() < 0.3 ? 3 : 2,
      height: 30 + Math.random() * 50, // Longer streaks
      opacity: 0.4 + Math.random() * 0.4, // More visible
      glow: Math.random() < 0.4, // More glowing drops
    }));

    return (
      <div className="fixed inset-0 pointer-events-none z-[-1]">
        {drops.map((drop) => (
          <motion.div
            key={drop.id}
            className={cn(
              "absolute bg-gradient-to-b from-[#00F0FF]/60 via-[#00F0FF]/40 to-[#9945FF]/30",
              drop.glow && "shadow-[0_0_15px_rgba(0,240,255,0.6)]"
            )}
            style={{
              left: drop.left,
              width: drop.width,
              height: `${drop.height}px`,
              opacity: drop.opacity,
            }}
            animate={{
              y: ['-10vh', '110vh'],
              opacity: [0, drop.opacity, 0]
            }}
            transition={{
              duration: drop.duration,
              repeat: Infinity,
              delay: drop.delay,
              ease: 'linear'
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="component-container lyric-generator relative h-[238px] w-full md:w-[520px] bg-black/20 backdrop-blur-sm border border-[#9945FF]/20 rounded-lg overflow-hidden">
      {/* Enhanced Header */}
      <div className="absolute inset-x-0 top-0 p-2 flex items-center justify-between border-b border-[#9945FF]/20">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-white tracking-wider font-mono">FLIPZ_LYRIC_GENERATOR.exe</span>
          <div className="h-1.5 w-1.5 rounded-full bg-[#00F0FF] shadow-[0_0_8px_rgba(0,240,255,0.6)]"></div>
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="px-1.5 py-0.5 text-[10px] bg-[#9945FF]/20 rounded border border-[#9945FF]/30 text-[#00F0FF] focus:outline-none"
          >
            {GENRES.map((genre) => (
              <option key={genre} value={genre} className="bg-black">
                {genre}
              </option>
            ))}
          </select>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-white">STATUS</span>
          <div className="px-1.5 py-0.5 text-[10px] bg-[#9945FF]/20 rounded border border-[#9945FF]/30 text-[#00F0FF]">
            {status}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col h-full pt-14 p-2">
        {/* Controls Section */}
        <div className="space-y-2">
          {/* Theme and Genre Selectors */}
          <div className="flex gap-2 mb-2">
            <select
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value as keyof typeof THEME_MODIFIERS)}
              className="flex-1 bg-black/40 border border-[#9945FF]/20 rounded px-2 py-1.5 text-xs text-[#00F0FF] focus:outline-none"
            >
              {Object.keys(THEME_MODIFIERS).map((theme) => (
                <option key={theme} value={theme}>{theme}</option>
              ))}
            </select>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="flex-1 bg-black/40 border border-[#9945FF]/20 rounded px-2 py-1.5 text-xs text-[#00F0FF] focus:outline-none"
            >
              {GENRES.map((genre) => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>

          {/* Complexity Slider */}
          <div className="mb-2">
            <div className="flex justify-between text-[10px] text-white/70 mb-1">
              <span>Complexity</span>
              <span>{complexity}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={complexity}
              onChange={(e) => setComplexity(parseInt(e.target.value))}
              className="w-full h-1 bg-[#9945FF]/20 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Input or Lyrics Display */}
          <div className="relative h-[80px]">
            {!lyrics ? (
              <input
                type="text"
                value={prompt}
                onChange={handlePromptChange}
                placeholder="Enter your lyric theme or concept..."
                className="w-full bg-black/40 border border-[#9945FF]/20 rounded px-3 py-1.5 text-xs text-white placeholder-white/50 focus:outline-none focus:border-[#9945FF]/40"
              />
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="h-full overflow-y-auto scrollbar-hide"
              >
                <div className={cn(
                  "rounded-lg p-3 h-full",
                  "bg-gradient-to-r from-[#9945FF]/10 to-[#00F0FF]/10",
                  "border border-[#9945FF]/30",
                  "text-xs text-white/90 whitespace-pre-line"
                )}>
                  {lyrics}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-2 border-t border-[#9945FF]/20 bg-black/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-xs text-white/70">
                <input
                  type="checkbox"
                  checked={useAdLibs}
                  onChange={(e) => setUseAdLibs(e.target.checked)}
                  className="accent-[#9945FF]"
                />
                Ad-libs
              </label>
              <div className="flex items-center gap-2 text-xs text-white/70">
                <span>Flow:</span>
                <span className="text-[#00F0FF]">
                  {VERSE_STRUCTURES[selectedGenre.toLowerCase() as keyof typeof VERSE_STRUCTURES]?.flow || 'standard'}
                </span>
              </div>
            </div>

            <button
              onClick={generateLyrics}
              disabled={status === 'generating' || status === 'idle'}
              className={cn(
                "relative px-4 py-1.5 text-xs rounded border transition-all duration-200",
                {
                  // Ready state - green glow effect
                  "bg-[#00FF94]/20 border-[#00FF94]/30 text-[#00FF94] hover:bg-[#00FF94]/30 hover:shadow-[0_0_15px_rgba(0,255,148,0.3)]": 
                    status === 'ready',
                  // Generating state - purple pulse
                  "bg-[#9945FF]/30 border-[#9945FF]/40 text-[#00F0FF] animate-pulse":
                    status === 'generating',
                  // Idle state - disabled look
                  "bg-[#9945FF]/20 border-[#9945FF]/30 text-white/50 cursor-not-allowed":
                    status === 'idle',
                }
              )}
            >
              {status === 'generating' ? 'GENERATING...' : 'GENERATE'}
            </button>
          </div>
        </div>
      </div>

      {/* Add the same glow effects as HolographicVideo */}
      <motion.div
        className="absolute inset-0 -z-10 rounded-lg"
        style={{
          background: `radial-gradient(
            circle at center,
            rgba(153, 69, 255, 0.2) 0%,
            rgba(0, 240, 255, 0.15) 50%,
            transparent 70%
          )`
        }}
        animate={{
          opacity: [0.4, 0.6, 0.4]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute inset-0 -z-20 rounded-lg opacity-20"
        style={{
          background: `radial-gradient(circle, rgba(153, 69, 255, 0.4) 0%, rgba(0, 240, 255, 0.4) 50%, transparent 70%)`
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

      {/* Replace existing background effect with this updated one */}
      <motion.div
        className="absolute inset-0 overflow-hidden -z-10"
        style={{
          background: `repeating-linear-gradient(
            90deg,
            transparent,
            rgba(153, 69, 255, 0.1) 1px,
            transparent 2px
          )`
        }}
        animate={{
          x: [-10, 10],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Add Modal */}
      {showModal && lyrics && (
        <LyricsModal
          lyrics={lyrics}
          onClose={() => {
            setShowModal(false);
            setLyrics('');
          }}
        />
      )}
    </div>
  );
}

// Enhanced WaveformVisualizer
function WaveformVisualizer({ isGenerating, complexity }: { isGenerating: boolean; complexity: number }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-8 flex items-center justify-center gap-1 overflow-hidden">
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="w-0.5 bg-gradient-to-t from-[#9945FF] to-[#00F0FF]"
          animate={{
            height: isGenerating 
              ? [10, 20 + (Math.random() * complexity / 5), 10] 
              : 4,
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  );
} 