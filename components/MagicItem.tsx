import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { easing } from 'maath';
import { TreeItemData, TreeState, ItemType } from '../types';

interface MagicItemProps {
  data: TreeItemData;
  targetState: TreeState;
}

const MagicItem: React.FC<MagicItemProps> = ({ data, targetState }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  
  // Random offset for floating animation to make them unsynchronized
  const timeOffset = useMemo(() => Math.random() * 100, []);
  
  // Temporary vectors for math to avoid GC
  const vec = useMemo(() => new THREE.Vector3(), []);
  
  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const isTree = targetState === TreeState.TREE_SHAPE;
    const targetPos = isTree ? data.treePosition : data.scatterPosition;

    // 1. Position Interpolation (Smooth Damping)
    // Damp time is slower for scattering (floating away) and snappier for tree forming
    const smoothTime = isTree ? 1.5 : 3.0; 
    easing.damp3(meshRef.current.position, targetPos, smoothTime, delta);

    // 2. Floating Effect (Hover)
    // Only apply significant floating when in Scattered state
    // But even in Tree state, slight breathing looks alive
    const t = state.clock.getElapsedTime() + timeOffset;
    
    if (!isTree) {
      // Large floating motion
      meshRef.current.position.y += Math.sin(t * 0.5) * 0.01; 
      meshRef.current.position.x += Math.cos(t * 0.3) * 0.005;
      
      // Continuous Rotation while scattered
      meshRef.current.rotation.x += data.scatterRotationSpeed.x;
      meshRef.current.rotation.y += data.scatterRotationSpeed.y;
      meshRef.current.rotation.z += data.scatterRotationSpeed.z;
    } else {
      // Reset rotation to intended tree rotation
      easing.dampE(meshRef.current.rotation, data.rotation, 0.5, delta);
      
      // Breathing effect on foliage
      if (data.type === ItemType.FOLIAGE) {
         // Subtle wind
         meshRef.current.rotation.z = data.rotation.z + Math.sin(t * 2) * 0.05;
      }
    }

    // 3. Emissive Pulse for Star
    if (data.type === ItemType.STAR && materialRef.current) {
        materialRef.current.emissiveIntensity = 2 + Math.sin(t * 3) * 1;
    }
  });

  // Render based on Type
  const renderGeometry = () => {
    switch (data.type) {
      case ItemType.FOLIAGE:
        // Using Tetrahedron for a stylized, sharp, expensive look (emerald cut vibe)
        return <tetrahedronGeometry args={[1, 0]} />;
      case ItemType.ORNAMENT_SPHERE:
        return <sphereGeometry args={[1, 32, 32]} />;
      case ItemType.GIFT_BOX:
        return <boxGeometry args={[1, 1, 1]} />;
      case ItemType.STAR:
        // A simple composition for star
        return <octahedronGeometry args={[1, 0]} />;
      default:
        return <boxGeometry />;
    }
  };

  const getMaterial = () => {
    if (data.type === ItemType.GIFT_BOX) {
       // Gift boxes need a bit of ribbon logic ideally, but for now simple lux material
       return (
         <meshStandardMaterial 
            ref={materialRef}
            color={data.color}
            roughness={data.roughness}
            metalness={data.metalness}
            envMapIntensity={1.5}
         />
       );
    }
    
    if (data.type === ItemType.STAR) {
        return (
            <meshStandardMaterial 
                ref={materialRef}
                color={data.color}
                emissive={data.color}
                emissiveIntensity={2}
                toneMapped={false}
                roughness={0.1}
                metalness={1}
            />
        )
    }

    return (
      <meshStandardMaterial 
        ref={materialRef}
        color={data.color}
        roughness={data.roughness}
        metalness={data.metalness}
        envMapIntensity={data.type === ItemType.ORNAMENT_SPHERE ? 2 : 1}
      />
    );
  };

  // Extra detail: Ribbon for gifts
  const Ribbon = () => (
    <group>
        <mesh position={[0, 0, 0]} scale={[1.02, 1.02, 0.2]}>
            <boxGeometry />
            <meshStandardMaterial color="#D4AF37" metalness={1} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0, 0]} scale={[0.2, 1.02, 1.02]}>
            <boxGeometry />
            <meshStandardMaterial color="#D4AF37" metalness={1} roughness={0.1} />
        </mesh>
    </group>
  );

  return (
    <group>
      <mesh 
        ref={meshRef} 
        position={data.scatterPosition} // Initial pos
        scale={data.scale}
        castShadow 
        receiveShadow
      >
        {renderGeometry()}
        {getMaterial()}
        {data.type === ItemType.GIFT_BOX && <Ribbon />}
      </mesh>
    </group>
  );
};

export default MagicItem;