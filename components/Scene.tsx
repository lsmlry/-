import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera, Stars, BakeShadows } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { TreeState } from '../types';
import LryTree from './LryTree';
import * as THREE from 'three';

interface SceneProps {
  treeState: TreeState;
}

const Scene: React.FC<SceneProps> = ({ treeState }) => {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ 
        antialias: false, 
        toneMapping: THREE.ReinhardToneMapping, 
        toneMappingExposure: 1.5 
      }}
      className="w-full h-full"
    >
      <PerspectiveCamera makeDefault position={[0, 2, 12]} fov={45} />
      
      {/* Lighting Strategy: Cinematic & Moody */}
      <ambientLight intensity={0.2} color="#001a0d" />
      <spotLight 
        position={[10, 10, 10]} 
        angle={0.5} 
        penumbra={1} 
        intensity={10} 
        castShadow 
        color="#fff0d6"
        shadow-bias={-0.0001}
      />
      <spotLight 
        position={[-10, 5, 5]} 
        angle={0.5} 
        penumbra={1} 
        intensity={5} 
        color="#D4AF37" 
      />
      <pointLight position={[0, -2, 0]} intensity={2} color="#Emerald" distance={10} />

      {/* Reflections */}
      <Environment preset="city" />

      {/* Background Ambience */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <fog attach="fog" args={['#010a05', 8, 35]} />

      {/* Main Content */}
      <group position={[0, -3, 0]}>
        <LryTree state={treeState} />
        {/* Floor Reflector */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial 
            color="#010a05" 
            roughness={0.1} 
            metalness={0.8} 
            envMapIntensity={1}
          />
        </mesh>
      </group>

      <OrbitControls 
        enablePan={false} 
        minPolarAngle={Math.PI / 4} 
        maxPolarAngle={Math.PI / 1.8}
        minDistance={6}
        maxDistance={20}
        autoRotate={treeState === TreeState.TREE_SHAPE}
        autoRotateSpeed={0.5}
      />

      <BakeShadows />

      {/* Post Processing for the "Glow" */}
      <EffectComposer disableNormalPass>
        <Bloom 
          luminanceThreshold={1.1} 
          mipmapBlur 
          intensity={1.2} 
          radius={0.7}
        />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
        <Noise opacity={0.02} />
      </EffectComposer>
    </Canvas>
  );
};

export default Scene;