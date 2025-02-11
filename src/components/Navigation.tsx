"use client";

import { motion } from 'framer-motion';
import { cn } from '@/utils/utils';
import Modal from './ui/Modal';
import { useState } from 'react';
import { 
  ModalHeader, 
  ModalSection, 
  StatusIndicator, 
  ActionButton,
  TypewriterText,
  StatValue 
} from "./modals/ModalContent";

const navItems = [
  { 
    id: 'gang', 
    name: 'GANG',
    modalTitle: 'GANG INTERFACE v1.0.2',
    description: 'Access the exclusive FLIPZ community network and governance system.'
  },
  { 
    id: 'tokenomics', 
    name: 'TOKENOMICS',
    modalTitle: 'TOKENOMICS ANALYZER v2.1.4',
    description: 'Real-time analysis of $FLIPZ token metrics and market performance.'
  },
  { 
    id: 'mao', 
    name: 'M.A.O',
    modalTitle: 'M.A.O SYSTEM v3.0.1',
    description: 'Music Asset Optimization - AI-powered music creation and enhancement.'
  },
  { 
    id: 'submit', 
    name: 'SUBMIT YOUR MUSIC',
    modalTitle: 'MUSIC SUBMISSION PROTOCOL v1.1.5',
    description: 'Submit your tracks to the FLIPZ network for AI enhancement and distribution.'
  },
];

const Navigation = () => {
  const [activeItem, setActiveItem] = useState('gang');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<typeof navItems[0] | null>(null);

  const handleItemClick = (item: typeof navItems[0]) => {
    setActiveItem(item.id);
    setSelectedItem(item);
    setModalOpen(true);
  };

  const renderModalContent = (item: typeof navItems[0]) => {
    return (
      <div className="space-y-6">
        <ModalHeader title={item.modalTitle} />
        
        <div className="p-6 space-y-6">
          <ModalSection 
            title="SYSTEM OVERVIEW"
            stats={[
              { value: "98.7%", label: "SYSTEM INTEGRITY", color: "#00F0FF" },
              { value: "1.2ms", label: "RESPONSE TIME", color: "#9945FF" },
              { value: "847", label: "ACTIVE NODES", color: "#00F0FF" },
            ]}
          >
            <TypewriterText text={item.description} />
            
            <div className="mt-4 grid grid-cols-2 gap-4">
              <ActionButton color="#00F0FF">
                INITIALIZE
              </ActionButton>
              
              <ActionButton color="#9945FF">
                VIEW DETAILS
              </ActionButton>
            </div>
          </ModalSection>

          <div className="grid grid-cols-2 gap-4">
            <ModalSection title="SYSTEM STATUS">
              <div className="space-y-2">
                <StatusIndicator label="NETWORK" value="CONNECTED" />
                <StatusIndicator label="LATENCY" value="23ms" color="#9945FF" />
                <StatusIndicator label="UPTIME" value="99.9%" />
                <motion.div 
                  className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#00F0FF]/20 to-transparent"
                  animate={{
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <div className="pt-2">
                  <TypewriterText text="All systems operational. No anomalies detected." />
                </div>
              </div>
            </ModalSection>

            <ModalSection title="QUICK ACTIONS">
              <div className="space-y-2">
                <ActionButton>
                  <div className="flex items-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      ◈
                    </motion.span>
                    SCAN NETWORK
                  </div>
                </ActionButton>
                <ActionButton>
                  <div className="flex items-center gap-2">
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      ⟲
                    </motion.span>
                    UPDATE CACHE
                  </div>
                </ActionButton>
              </div>
            </ModalSection>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <nav className="flex gap-4 items-center">
        {navItems.map((item) => {
          const isActive = activeItem === item.id;
          
          return (
            <button 
              key={item.id}
              onClick={() => handleItemClick(item)}
              className="focus:outline-none"
            >
              <motion.div
                className={cn(
                  "neon-tab-button relative px-6 py-2.5 rounded-sm",
                  "font-mono text-sm tracking-wider overflow-hidden",
                  isActive ? "neon-tab-active" : "neon-tab-inactive"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="relative z-10">{item.name}</div>
                
                {/* Gradient background */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-white/5 to-red-500/10" />
                
                {/* Hover effect */}
                <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-red-500/20 via-white/10 to-red-500/20" />
                
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-500 via-white to-red-500"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </motion.div>
            </button>
          );
        })}
      </nav>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        className="w-full max-w-xl"
      >
        {selectedItem && renderModalContent(selectedItem)}
      </Modal>
    </>
  );
};

export default Navigation;  