import * as THREE from 'three';

export enum TreeState {
  SCATTERED = 'SCATTERED',
  TREE_SHAPE = 'TREE_SHAPE',
}

export enum ItemType {
  FOLIAGE = 'FOLIAGE',
  ORNAMENT_SPHERE = 'ORNAMENT_SPHERE',
  GIFT_BOX = 'GIFT_BOX',
  STAR = 'STAR',
}

export interface TreeItemData {
  id: number;
  type: ItemType;
  treePosition: THREE.Vector3;
  scatterPosition: THREE.Vector3;
  rotation: THREE.Euler;
  scale: number;
  color: string;
  metalness: number;
  roughness: number;
  scatterRotationSpeed: THREE.Vector3;
}
