import React, { useState, Suspense } from 'react';
import { TreeState } from './types';
import Scene from './components/Scene';
import Overlay from './components/Overlay';

const App: React.FC = () => {
  const [treeState, setTreeState] = useState<TreeState>(TreeState.TREE_SHAPE);

  const toggleState = () => {
    setTreeState((prev) => 
      prev === TreeState.TREE_SHAPE ? TreeState.SCATTERED : TreeState.TREE_SHAPE
    );
  };

  return (
    <div className="relative w-full h-full bg-[#000502]">
      <Suspense fallback={<div className="absolute inset-0 flex items-center justify-center text-[#D4AF37] font-luxury">Loading Luxury Experience...</div>}>
        <Scene treeState={treeState} />
      </Suspense>
      
      <Overlay 
        currentState={treeState} 
        onToggle={toggleState} 
      />
    </div>
  );
};

export default App;