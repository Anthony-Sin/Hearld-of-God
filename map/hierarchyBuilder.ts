import { BaronyData, HierarchyEntity, MapHierarchy, TINTS, Biome } from './types';
import { genName } from './naming';

const CULTURES = ['Anglo-Saxon', 'Norse', 'Gaelic', 'Frankish', 'Occitan', 'Castilian', 'Lombard', 'Saxon', 'Greek'];
const RELIGIONS = ['Catholic', 'Orthodox', 'Asatru', 'Insular', 'Ashari', 'Slavic Pagan'];
const BIOMES: Biome[] = ['plains', 'forest', 'desert', 'tundra', 'mountain', 'wetlands'];

/**
 * Modular builder for the map hierarchy. 
 * Enforces strict nesting: County -> Duchy -> Kingdom -> Empire.
 */
export class MapHierarchyBuilder {
  private random: () => number;

  constructor(random: () => number) {
    this.random = random;
  }

  /**
   * Strategically picks seeds from a pool that are spread out.
   */
  pickSpreadSeeds(pool: {x:number, z:number}[], count: number) {
    const heads: {x:number, z:number}[] = [];
    if (pool.length === 0) return heads;
    heads.push(pool[Math.floor(this.random() * pool.length)]);
    
    for(let i=1; i<count; i++) {
        let maxDist = -1;
        let bestCandidate = pool[0];
        // Sampling for performance
        for(let s=0; s<20; s++) {
            const cand = pool[Math.floor(this.random() * pool.length)];
            let minDistToHeads = Infinity;
            heads.forEach(h => {
                const d = (cand.x - h.x)**2 + (cand.z - h.z)**2;
                if(d < minDistToHeads) minDistToHeads = d;
            });
            if(minDistToHeads > maxDist) {
                maxDist = minDistToHeads;
                bestCandidate = cand;
            }
        }
        heads.push(bestCandidate);
    }
    return heads;
  }

  /**
   * Assigns seeds to their nearest parent from a specific pool.
   */
  assignToNearest(seeds: {x:number, z:number}[], parents: HierarchyEntity[]) {
    return seeds.map(ss => {
        let minDist = Infinity;
        let nearestIdx = 0;
        parents.forEach((p, idx) => {
            const d = (ss.x - p.x)**2 + (ss.z - p.z)**2;
            if(d < minDist) { minDist = d; nearestIdx = idx; }
        });
        return nearestIdx;
    });
  }

  build(landPoints: {x:number, z:number}[]): MapHierarchy {
    // 1. Generate Empires (Toplevel)
    const empireCount = 2 + Math.floor(this.random() * 2);
    const empireSeeds = this.pickSpreadSeeds(landPoints, empireCount);
    const empires: Record<number, HierarchyEntity> = {};
    empireSeeds.forEach((p, i) => {
        empires[i] = { id: i, name: genName(this.random, 'Empire'), color: TINTS[i % TINTS.length], x: p.x, z: p.z, rotation: 0, area: 0 };
    });

    // 2. Generate Kingdoms nested within Empires
    const kingdomCount = empireCount * (2 + Math.floor(this.random() * 2));
    const kingdomSeeds = this.pickSpreadSeeds(landPoints, kingdomCount);
    const kingdomToEmpireIdx = this.assignToNearest(kingdomSeeds, Object.values(empires));
    const kingdoms: Record<number, HierarchyEntity> = {};
    kingdomSeeds.forEach((p, i) => {
      kingdoms[i] = { id: i, name: genName(this.random, 'Kingdom'), color: TINTS[(i * 3 + 12) % TINTS.length], x: p.x, z: p.z, rotation: 0, area: 0 };
    });

    // 3. Generate Duchies nested within Kingdoms
    const duchyCount = kingdomCount * (2 + Math.floor(this.random() * 1));
    const duchySeeds = this.pickSpreadSeeds(landPoints, duchyCount);
    const duchyToKingdomIdx = this.assignToNearest(duchySeeds, Object.values(kingdoms));
    const duchies: Record<number, HierarchyEntity> = {};
    duchySeeds.forEach((p, i) => {
      duchies[i] = { id: i, name: 'Duchy of ' + genName(this.random, 'Duchy'), color: TINTS[(i * 4 + 20) % TINTS.length], x: p.x, z: p.z, rotation: 0, area: 0 };
    });

    // 4. Generate Counties nested within Duchies
    // Reduced multiplier to ensure each county is larger and more "viable" as requested
    const countyCount = Math.floor(duchyCount * (1.2 + this.random() * 0.4));
    const countySeeds = this.pickSpreadSeeds(landPoints, countyCount);
    const countyToDuchyIdx = this.assignToNearest(countySeeds, Object.values(duchies));
    const counties: Record<number, HierarchyEntity> = {};
    countySeeds.forEach((p, i) => {
      counties[i] = { id: i, name: genName(this.random, 'County') + ' County', color: TINTS[(i * 5 + 30) % TINTS.length], x: p.x, z: p.z, rotation: 0, area: 0 };
    });

    // 5. Generate Baronies nested within Counties
    const baronyCount = 250 + Math.floor(this.random() * 100);
    const baronySeeds = [];
    for(let i=0; i<baronyCount; i++) baronySeeds.push(landPoints[Math.floor(this.random() * landPoints.length)]);
    const baronyToCountyIdx = this.assignToNearest(baronySeeds, Object.values(counties));

    const baronies: BaronyData[] = baronySeeds.map((p, i) => {
        const countyId = baronyToCountyIdx[i];
        const duchyId = countyToDuchyIdx[countyId];
        const kingdomId = duchyToKingdomIdx[duchyId];
        const empireId = kingdomToEmpireIdx[kingdomId];

        return {
            id: i, x: p.x, z: p.z, rotation: 0, area: 0,
            name: genName(this.random, 'Barony'),
            color: TINTS[i % TINTS.length],
            biome: BIOMES[Math.floor(this.random() * BIOMES.length)],
            countyId, duchyId, kingdomId, empireId,
            culture: CULTURES[Math.floor(this.random() * CULTURES.length)],
            religion: RELIGIONS[Math.floor(this.random() * RELIGIONS.length)],
            development: Math.floor(5 + this.random() * 25),
            flag: {
                primaryColor: TINTS[Math.floor(this.random() * TINTS.length)],
                secondaryColor: TINTS[Math.floor(this.random() * TINTS.length)],
                symbol: 'shield'
            },
            gold: Math.floor(this.random() * 100),
            prestige: Math.floor(this.random() * 100),
            piety: Math.floor(this.random() * 100),
            renown: Math.floor(this.random() * 100)
        };
    });

    return { baronies, counties, duchies, kingdoms, empires };
  }
}
