"use client";

import React, { useEffect, useState, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "./ui/card";
import { cn } from "@/utils/utils";
import NetworkWave from "./NetworkWave";

// Utility function to generate random fluctuations
const fluctuate = (base: number, percentage: number = 5) => {
  const variance = base * (percentage / 100);
  return (base + (Math.random() - 0.5) * variance).toFixed(3);
};

interface TokenMetricProps {
  label: string;
  value: string;
  trend?: number;
  isAnimated?: boolean;
}

const TokenMetric = ({ label, value, trend, isAnimated = true }: TokenMetricProps) => {
  const [currentValue, setCurrentValue] = useState(value);
  
  useEffect(() => {
    if (!isAnimated) return;
    const interval = setInterval(() => {
      const baseValue = parseFloat(value.replace(/[^0-9.-]+/g, ""));
      const newValue = (baseValue + (Math.random() - 0.5) * 0.1).toFixed(3);
      setCurrentValue(value.startsWith("$") ? `$${newValue}` : newValue);
    }, 2000);

    return () => clearInterval(interval);
  }, [value, isAnimated]);

  return (
    <Card className="relative overflow-hidden bg-black/40 backdrop-blur-sm border border-[#9945FF]/40">
      <div className="p-4">
        {/* Header with Label and Trend */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] text-white tracking-wider font-mono">{label}</span>
          { trend && <span className={cn(
            "px-1.5 py-0.5 text-[10px] rounded border",
            trend >= 0 
              ? "text-[#00F0FF] bg-[#00F0FF]/10 border-[#00F0FF]/30" 
              : "text-[#FF4400] bg-[#FF4400]/10 border-[#FF4400]/30"
          )}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
}
        </div>

        {/* Value Display */}
        <motion.div 
          className="text-2xl font-mono text-[#00F0FF] tracking-wider"
          animate={isAnimated ? {
            opacity: [0.9, 1, 0.9],
            textShadow: [
              "0 0 10px rgba(0, 240, 255, 0.3)",
              "0 0 20px rgba(0, 240, 255, 0.5)",
              "0 0 10px rgba(0, 240, 255, 0.3)"
            ]
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {currentValue}
        </motion.div>
      </div>

      {/* Background Glow Effect */}
      <motion.div
        className="absolute inset-0 -z-10 rounded-lg opacity-20"
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
    </Card>
  );
};

// Add this function at the top
const generateRandomFluctuation = (baseValue: number, range: number = 2) => {
  return Math.min(100, Math.max(0, baseValue + (Math.random() - 0.5) * range));
};

// Add this utility function at the top
const generateFluctuation = (baseValue: number, range: number = 3) => {
  return Math.min(100, Math.max(0, baseValue + (Math.random() - 0.5) * range));
};

// Add this LiveStatBar component
const LiveStatBar = ({ label, value, className }: { label: string; value: number; className?: string }) => {
  const [currentValue, setCurrentValue] = useState(value);

  // Add subtle value fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentValue(prev => {
        const fluctuation = (Math.random() - 0.5) * 0.4;
        return Number((prev + fluctuation).toFixed(1));
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn("relative", className)}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-mono text-[#9945FF] tracking-[0.2em]">{label}</span>
        <span className="text-xs font-mono text-[#00F0FF]">{currentValue.toFixed(1)}%</span>
      </div>
      <div className="relative h-1.5 bg-black/60 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-[#9945FF] to-[#00F0FF]"
          style={{ width: `${currentValue}%` }}
          animate={{
            opacity: [0.7, 1, 0.7],
            boxShadow: [
              "0 0 10px rgba(153, 69, 255, 0.3)",
              "0 0 15px rgba(0, 240, 255, 0.5)",
              "0 0 10px rgba(153, 69, 255, 0.3)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
    </div>
  );
};

const NetworkGrid = ({ total, active }: { total: number; active: number }) => {
  return (
    <div className="grid grid-cols-15 gap-0.5">
      {[...Array(total)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: i * 0.01 }}
          className={cn(
            "h-1.5 w-1.5 rounded-sm relative group",
            i < active ? 'bg-blue-400/80' : 'bg-gray-700/30',
            i < active && 'animate-pulse'
          )}
        >
          <motion.div
            className="absolute inset-0 bg-blue-400/30 rounded-sm"
            initial={false}
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      ))}
    </div>
  );
};

// Add this component near the top of StatsContainer.tsx, after the TokenMetric component
const SystemMetric = ({ label, value, maxValue = 100 }: { label: string; value: number; maxValue?: number }) => {
  return (
    <Card className="relative overflow-hidden bg-black/40 backdrop-blur-sm border border-[#9945FF]/40">
      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] text-white tracking-wider font-mono">{label}</span>
          <span className="px-1.5 py-0.5 text-[10px] rounded border text-[#00F0FF] bg-[#00F0FF]/10 border-[#00F0FF]/30">
            {value.toFixed(1)}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="relative h-1.5 bg-black/60 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-[#9945FF] to-[#00F0FF]"
            style={{ width: `${(value / maxValue) * 100}%` }}
            animate={{
              opacity: [0.7, 1, 0.7],
              boxShadow: [
                "0 0 10px rgba(153, 69, 255, 0.3)",
                "0 0 15px rgba(0, 240, 255, 0.5)",
                "0 0 10px rgba(153, 69, 255, 0.3)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </div>

      {/* Background Glow */}
      <motion.div
        className="absolute inset-0 -z-10 rounded-lg opacity-20"
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
    </Card>
  );
};

// Update the SystemStats component
const SystemMetrics = () => {
  const [metrics, setMetrics] = useState({
    cpu: 39.2,
    memory: 64.9
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics({
        cpu: 35 + Math.random() * 10,
        memory: 60 + Math.random() * 10
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-2 gap-2">
      {/* CPU Load */}
      <Card className="relative overflow-hidden bg-black/40 backdrop-blur-sm border border-[#9945FF]/40">
        <div className="p-2">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] text-white tracking-wider font-mono">CPU_LOAD</span>
            <span className="text-[10px] text-[#00F0FF]">{metrics.cpu.toFixed(1)}%</span>
          </div>
          
          {/* Progress Bar */}
          <div className="relative h-1.5 bg-black/60 rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-[#9945FF] to-[#00F0FF]"
              style={{ width: `${metrics.cpu}%` }}
              animate={{
                opacity: [0.7, 1, 0.7],
                boxShadow: [
                  "0 0 10px rgba(153, 69, 255, 0.3)",
                  "0 0 15px rgba(0, 240, 255, 0.5)",
                  "0 0 10px rgba(153, 69, 255, 0.3)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </div>

        {/* Background Glow */}
        <motion.div
          className="absolute inset-0 -z-10 rounded-lg opacity-20"
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
      </Card>

      {/* Memory Usage */}
      <Card className="relative overflow-hidden bg-black/40 backdrop-blur-sm border border-[#9945FF]/40">
        <div className="p-2">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] text-white tracking-wider font-mono">MEMORY</span>
            <span className="text-[10px] text-[#00F0FF]">{metrics.memory.toFixed(1)}%</span>
          </div>
          
          {/* Progress Bar */}
          <div className="relative h-1.5 bg-black/60 rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-[#9945FF] to-[#00F0FF]"
              style={{ width: `${metrics.memory}%` }}
              animate={{
                opacity: [0.7, 1, 0.7],
                boxShadow: [
                  "0 0 10px rgba(153, 69, 255, 0.3)",
                  "0 0 15px rgba(0, 240, 255, 0.5)",
                  "0 0 10px rgba(153, 69, 255, 0.3)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </div>

        {/* Background Glow */}
        <motion.div
          className="absolute inset-0 -z-10 rounded-lg opacity-20"
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
      </Card>
    </div>
  );
};

// Memoized components
const AnimatedMetric = memo(({ label, value, unit = '' }: { label: string, value: string, unit?: string }) => (
  <div className="flex flex-col">
    <span className="text-white/60 mb-1 text-xs tracking-wider">{label}</span>
    <span className="text-white font-bold metric-glow">
      {value}{unit}
    </span>
  </div>
));

AnimatedMetric.displayName = 'AnimatedMetric';

// Optimized random value generator
const generateRandomValue = (min: number, max: number, decimals = 0) => {
  const value = min + Math.random() * (max - min);
  return Number(value.toFixed(decimals));
};

// Main component optimization
export default function StatsContainer() {
  const [metrics, setMetrics] = useState(() => ({
    price: "$1.247",
    marketCap: "$12.4M",
    holders: "1,247",
    volume: "$847.2K"
  }));

  const [timeLeft, setTimeLeft] = useState({
    days: 10,
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0
  });

  useEffect(() => {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 10);

    const timer = setInterval(() => {
      const now = new Date();
      const difference = endDate.getTime() - now.getTime();

      if (difference <= 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        milliseconds: Math.floor(difference % 1000)
      });
    }, 41);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        price: fluctuate(1.247, 2),
        marketCap: fluctuate(12.4, 1),
        holders: Math.floor(1247 + Math.random() * 10).toString(),
        volume: fluctuate(847.2, 3)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Memoized value generators
  const getBPM = useCallback(() => generateRandomValue(138, 145), []);
  const getPeak = useCallback(() => generateRandomValue(95, 99), []);
  
  return (
    <motion.div
      className="fixed top-0 right-0 w-[400px] h-screen z-50"
      initial={{ transform: 'translateX(100%)' }}
      animate={{ transform: 'translateX(0)' }}
      transition={{ duration: 0.3 }}
    >
      <div className="h-full overflow-y-auto scrollbar-hide backdrop-blur-lg bg-black/20 p-4 border-l border-white/20">
        <div className="sticky top-0 z-10 bg-black/40 -mx-4 px-4 pt-2 pb-2 mb-4">
          <div className="text-white font-mono text-sm border-b border-white/20 pb-2 relative">
            <motion.span
              className="absolute -left-2 top-0 h-full w-1 bg-white/50"
              animate={{
                height: ["0%", "100%", "0%"],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="tracking-[0.3em] relative">
              <motion.span 
                className="text-lg text-[#FF4400] font-mono"
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {`${timeLeft.days}:${String(timeLeft.hours).padStart(2, '0')}:${String(timeLeft.minutes).padStart(2, '0')}:${String(timeLeft.seconds).padStart(2, '0')}.${String(timeLeft.milliseconds).padStart(3, '0')}`}
              </motion.span>
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <TokenMetrics />
          <SystemMetrics />
          <CookingHeat />
          <NeuralMetrics />
        </div>
      </div>
    </motion.div>
  );
}

// Add this CookingHeat component inside StatsContainer.tsx
const CookingHeat = () => {
  const getBPM = () => Math.floor(Math.random() * (140 - 135) + 135);
  const getPeak = () => Math.floor(Math.random() * (98 - 93) + 93);
  
  return (
    <Card className="relative overflow-hidden bg-black/40 backdrop-blur-sm border border-[#9945FF]/40">
      <div className="p-2">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] text-white tracking-wider font-mono">COOKING_HEAT</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-white tracking-wider">BPM</span>
              <span className="text-[10px] text-[#00F0FF]">{getBPM()}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-white tracking-wider">PEAK</span>
              <span className="text-[10px] text-[#00F0FF]">{getPeak()}%</span>
            </div>
            <div className="px-1.5 py-0.5 text-[10px] bg-[#9945FF]/20 rounded border border-[#9945FF]/30 text-[#00F0FF]">
              LIVE
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          {[
            { label: "INTENSITY", value: "86%" },
            { label: "FREQUENCY", value: "18.3kHz" },
            { label: "AMPLITUDE", value: "-3.2dB" },
            { label: "SATURATION", value: "93%" }
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-[10px] text-white tracking-wider font-mono mb-1">{stat.label}</div>
              <div className="text-[10px] text-[#00F0FF] tracking-wider">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Visualization */}
        <div className="relative h-32 rounded-lg overflow-hidden bg-black/60 border border-[#9945FF]/20">
          <NetworkWave 
            total={128}
            columns={32}
            rows={24}
            className="cooking-heat"
          />
          
          {/* Overlay Gradient */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                linear-gradient(
                  180deg,
                  transparent 0%,
                  rgba(0, 240, 255, 0.1) 50%,
                  rgba(153, 69, 255, 0.2) 100%
                )
              `,
              mixBlendMode: 'overlay'
            }}
          />
        </div>
      </div>

      {/* Background Glow */}
      <motion.div
        className="absolute inset-0 -z-10 rounded-lg opacity-20"
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
    </Card>
  );
};

// Update the NeuralMetrics component to remove SYSTEM_HEALTH
const NeuralMetrics = () => {
  return (
    <Card className="relative overflow-hidden bg-black/40 backdrop-blur-sm border border-[#9945FF]/40">
      <div className="p-2 space-y-4">
        {[
          { label: "NEURAL_HARMONY", value: 93.3 },
          { label: "BEATS_ANALYZED", value: 67.7 },
          { label: "AI_FLOW", value: 96.9 }
        ].map((metric) => (
          <div key={metric.label} className="relative">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] text-white tracking-wider font-mono">{metric.label}</span>
              <span className="px-1.5 py-0.5 text-[10px] rounded border text-[#00F0FF] bg-[#00F0FF]/10 border-[#00F0FF]/30">
                {metric.value}%
              </span>
            </div>
            <div className="relative h-1.5 bg-black/60 rounded-full overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#9945FF] to-[#00F0FF]"
                style={{ width: `${metric.value}%` }}
                animate={{
                  opacity: [0.7, 1, 0.7],
                  boxShadow: [
                    "0 0 10px rgba(153, 69, 255, 0.3)",
                    "0 0 15px rgba(0, 240, 255, 0.5)",
                    "0 0 10px rgba(153, 69, 255, 0.3)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Background Glow - keeping the exact same effect */}
      <motion.div
        className="absolute inset-0 -z-10 rounded-lg opacity-20"
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
    </Card>
  );
};

const TokenMetrics = () => {
  const [metrics, setMetrics] = useState({
    price: 1.247,
    priceChange: 2.5,
    marketCap: 12.4,
    marketCapChange: 1.8,
    holders: "1247",
    holdersChange: 3.2,
    volume: 847.2,
    volumeChange: -0.7
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        price: parseFloat(fluctuate(prev.price, 2)),
        priceChange: parseFloat(fluctuate(prev.priceChange, 10)),
        marketCap: parseFloat(fluctuate(prev.marketCap, 1)),
        marketCapChange: parseFloat(fluctuate(prev.marketCapChange, 5)),
        holders: Math.floor(1247 + Math.random() * 10).toString(),
        holdersChange: parseFloat(fluctuate(prev.holdersChange, 3)),
        volume: parseFloat(fluctuate(prev.volume, 3)),
        volumeChange: parseFloat(fluctuate(prev.volumeChange, 8))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-2 gap-4 pt-[14px]">
      {/* Price */}
      <Card className="relative overflow-hidden bg-black/40 backdrop-blur-sm border border-[#9945FF]/40">
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] text-white tracking-wider font-mono">FLIPZ_PRICE</span>
            <span className={cn(
              "px-1.5 py-0.5 text-[10px] rounded border",
              metrics.priceChange >= 0 
                ? "text-[#00F0FF] bg-[#00F0FF]/10 border-[#00F0FF]/30" 
                : "text-[#FF4400] bg-[#FF4400]/10 border-[#FF4400]/30"
            )}>
              {metrics.priceChange >= 0 ? '+' : ''}{metrics.priceChange.toFixed(1)}%
            </span>
          </div>
          <div className="text-2xl font-mono text-[#00F0FF] tracking-wider">
            ${metrics.price.toFixed(3)}
          </div>
        </div>
        <TokenMetricGlow />
      </Card>

      {/* Market Cap */}
      <Card className="relative overflow-hidden bg-black/40 backdrop-blur-sm border border-[#9945FF]/40">
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] text-white tracking-wider font-mono">MARKET_CAP</span>
            <span className={cn(
              "px-1.5 py-0.5 text-[10px] rounded border",
              metrics.marketCapChange >= 0 
                ? "text-[#00F0FF] bg-[#00F0FF]/10 border-[#00F0FF]/30" 
                : "text-[#FF4400] bg-[#FF4400]/10 border-[#FF4400]/30"
            )}>
              {metrics.marketCapChange >= 0 ? '+' : ''}{metrics.marketCapChange.toFixed(1)}%
            </span>
          </div>
          <div className="text-2xl font-mono text-[#00F0FF] tracking-wider">
            ${metrics.marketCap.toFixed(1)}M
          </div>
        </div>
        <TokenMetricGlow />
      </Card>

      {/* Holders */}
      <Card className="relative overflow-hidden bg-black/40 backdrop-blur-sm border border-[#9945FF]/40">
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] text-white tracking-wider font-mono">HOLDERS</span>
            <span className="px-1.5 py-0.5 text-[10px] rounded border text-[#00F0FF] bg-[#00F0FF]/10 border-[#00F0FF]/30">
              +{metrics.holdersChange.toFixed(1)}%
            </span>
          </div>
          <div className="text-2xl font-mono text-[#00F0FF] tracking-wider">
            {metrics.holders}
          </div>
        </div>
        <TokenMetricGlow />
      </Card>

      {/* Volume */}
      <Card className="relative overflow-hidden bg-black/40 backdrop-blur-sm border border-[#9945FF]/40">
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] text-white tracking-wider font-mono">VOLUME</span>
            <span className={cn(
              "px-1.5 py-0.5 text-[10px] rounded border",
              metrics.volumeChange >= 0 
                ? "text-[#00F0FF] bg-[#00F0FF]/10 border-[#00F0FF]/30" 
                : "text-[#FF4400] bg-[#FF4400]/10 border-[#FF4400]/30"
            )}>
              {metrics.volumeChange >= 0 ? '+ 