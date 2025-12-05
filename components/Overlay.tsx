import React from 'react';
import { TreeState } from '../types';

interface OverlayProps {
  currentState: TreeState;
  onToggle: () => void;
}

const Overlay: React.FC<OverlayProps> = ({ currentState, onToggle }) => {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8 z-10">
      {/* Header */}
      <div className="flex flex-col items-center mt-4 opacity-90">
        <h1 className="text-[#D4AF37] text-4xl md:text-6xl font-luxury tracking-widest uppercase drop-shadow-[0_0_10px_rgba(212,175,55,0.5)] text-center">
          Arix Signature
        </h1>
        <p className="text-emerald-200 font-body tracking-[0.3em] text-xs md:text-sm mt-2 uppercase">
          LRY Interactive Christmas Edition
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center mb-12 pointer-events-auto">
        <button
          onClick={onToggle}
          className={`
            relative overflow-hidden group
            border border-[#D4AF37] 
            px-12 py-4 
            transition-all duration-700 ease-out
            hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]
            ${currentState === TreeState.SCATTERED ? 'bg-transparent text-[#D4AF37]' : 'bg-[#D4AF37]/10 text-[#D4AF37]'}
          `}
        >
          {/* Button Background Gradient Effect */}
          <div className="absolute inset-0 w-0 bg-[#D4AF37] transition-all duration-[250ms] ease-out group-hover:w-full opacity-10"></div>
          
          <span className="relative font-luxury tracking-widest text-lg z-10">
            {currentState === TreeState.SCATTERED ? 'ASSEMBLE TREE' : 'SCATTER GIFTS'}
          </span>
        </button>
        
        <div className="mt-4 flex gap-2">
           <div className={`w-2 h-2 rounded-full transition-colors duration-500 ${currentState === TreeState.TREE_SHAPE ? 'bg-[#D4AF37]' : 'bg-[#1a4025]'}`} />
           <div className={`w-2 h-2 rounded-full transition-colors duration-500 ${currentState === TreeState.SCATTERED ? 'bg-[#D4AF37]' : 'bg-[#1a4025]'}`} />
        </div>
      </div>

      {/* Decorative Borders */}
      <div className="absolute top-0 left-0 w-full h-full p-4 pointer-events-none">
        <div className="w-full h-full border border-[#D4AF37]/20 border-solid" />
      </div>
    </div>
  );
};

export default Overlay;