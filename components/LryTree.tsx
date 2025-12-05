import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TreeState, ItemType, TreeItemData } from '../types';
import MagicItem from './MagicItem';

interface LryTreeProps {
  state: TreeState;
}

const LryTree: React.FC<LryTreeProps> = ({ state }) => {
  // Configuration
  const FOLIAGE_COUNT = 400; // Emerald needles
  const ORNAMENT_COUNT = 80; // Gold balls
  const GIFT_COUNT = 30; // Luxury boxes
  
  // Math Helpers
  const randomRange = (min: number, max: number) => Math.random() * (max - min) + min;

  // Generate Data Once
  const items = useMemo(() => {
    const data: TreeItemData[] = [];
    let idCounter = 0;

    // 1. Generate Tree Foliage (Cone Shape)
    // Height: 8, Radius Bottom: 3.5
    for (let i = 0; i < FOLIAGE_COUNT; i++) {
      const height = 8;
      const radiusBase = 3.5;
      
      // Normalized height (0 to 1), heavily biased towards bottom for volume
      const yNorm = Math.pow(Math.random(), 0.8); 
      const y = yNorm * height;
      const currentRadius = (1 - yNorm) * radiusBase;

      // Random angle
      const theta = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * currentRadius; // Uniform disk distribution

      const treePos = new THREE.Vector3(
        r * Math.cos(theta),
        y,
        r * Math.sin(theta)
      );

      // Add some noise to treePos so it's not a perfect geometric cone
      treePos.x += randomRange(-0.2, 0.2);
      treePos.z += randomRange(-0.2, 0.2);
      treePos.y += randomRange(-0.2, 0.2);

      // Scatter Pos: Random in a large sphere
      const scatterPos = new THREE.Vector3(
        randomRange(-8, 8),
        randomRange(2, 12),
        randomRange(-8, 8)
      );

      data.push({
        id: idCounter++,
        type: ItemType.FOLIAGE,
        treePosition: treePos,
        scatterPosition: scatterPos,
        rotation: new THREE.Euler(randomRange(0, Math.PI), randomRange(0, Math.PI), randomRange(0, Math.PI)),
        scale: randomRange(0.2, 0.5),
        color: i % 5 === 0 ? '#064e3b' : '#047857', // Varying emerald shades
        metalness: 0.3,
        roughness: 0.4,
        scatterRotationSpeed: new THREE.Vector3(Math.random()*0.02, Math.random()*0.02, Math.random()*0.02)
      });
    }

    // 2. Generate Ornaments (Surface of Cone)
    for (let i = 0; i < ORNAMENT_COUNT; i++) {
        const height = 7.5;
        const radiusBase = 3.6; // Slightly larger to sit on outside
        const yNorm = Math.random();
        const y = yNorm * height;
        const currentRadius = (1 - yNorm) * radiusBase;
        const theta = Math.random() * Math.PI * 2;
        
        const treePos = new THREE.Vector3(
            currentRadius * Math.cos(theta),
            y,
            currentRadius * Math.sin(theta)
        );

        const scatterPos = new THREE.Vector3(
            randomRange(-10, 10),
            randomRange(0, 15),
            randomRange(-10, 10)
        );

        data.push({
            id: idCounter++,
            type: ItemType.ORNAMENT_SPHERE,
            treePosition: treePos,
            scatterPosition: scatterPos,
            rotation: new THREE.Euler(0, 0, 0),
            scale: randomRange(0.15, 0.3),
            color: Math.random() > 0.3 ? '#D4AF37' : '#aa8c2c', // Gold varieties
            metalness: 1.0,
            roughness: 0.1,
            scatterRotationSpeed: new THREE.Vector3(Math.random()*0.01, Math.random()*0.01, 0)
        });
    }

    // 3. Generate Gifts (Under the tree or hanging)
    for (let i = 0; i < GIFT_COUNT; i++) {
        const isHanging = i > 10;
        let treePos: THREE.Vector3;
        
        if (isHanging) {
             // Hanging on tree
            const height = 6;
            const radiusBase = 3.2;
            const y = Math.random() * height + 1;
            const r = (1 - (y/8)) * radiusBase + 0.2;
            const theta = Math.random() * Math.PI * 2;
            treePos = new THREE.Vector3(r * Math.cos(theta), y, r * Math.sin(theta));
        } else {
            // Under tree
            const theta = Math.random() * Math.PI * 2;
            const r = randomRange(1, 4);
            treePos = new THREE.Vector3(r * Math.cos(theta), 0.3, r * Math.sin(theta));
        }

        const scatterPos = new THREE.Vector3(
            randomRange(-6, 6),
            randomRange(5, 12), // Floating high up
            randomRange(-6, 6)
        );

        data.push({
            id: idCounter++,
            type: ItemType.GIFT_BOX,
            treePosition: treePos,
            scatterPosition: scatterPos,
            rotation: new THREE.Euler(0, Math.random() * Math.PI, 0),
            scale: isHanging ? randomRange(0.2, 0.35) : randomRange(0.4, 0.7),
            color: Math.random() > 0.5 ? '#ffffff' : '#065f46', // White or Emerald boxes
            metalness: 0.1,
            roughness: 0.5,
            scatterRotationSpeed: new THREE.Vector3(Math.random()*0.01, Math.random()*0.03, Math.random()*0.01)
        });
    }

    // 4. The Star
    data.push({
        id: idCounter++,
        type: ItemType.STAR,
        treePosition: new THREE.Vector3(0, 8.2, 0),
        scatterPosition: new THREE.Vector3(0, 15, 0),
        rotation: new THREE.Euler(0, 0, 0),
        scale: 1,
        color: '#FFD700',
        metalness: 1,
        roughness: 0,
        scatterRotationSpeed: new THREE.Vector3(0, 0.05, 0)
    });

    return data;
  }, []);

  return (
    <group>
      {items.map((item) => (
        <MagicItem key={item.id} data={item} targetState={state} />
      ))}
    </group>
  );
};

export default LryTree;