import { MapHierarchyBuilder } from './hierarchyBuilder';

/**
 * Main entry point for hierarchy generation.
 * Modularized to MapHierarchyBuilder for strict nesting and territorial integrity.
 */
export function buildHierarchy(landPoints: {x:number, z:number}[], random: () => number) {
  const builder = new MapHierarchyBuilder(random);
  return builder.build(landPoints);
}
