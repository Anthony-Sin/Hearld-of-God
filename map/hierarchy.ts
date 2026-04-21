import { MapData } from './types';
import { generateNames } from './naming';

export interface HierarchyEntity {
    id: number;
    name: string;
    x: number;
    z: number;
    color: string;
}

export interface BaronyData extends HierarchyEntity {
    countyId: number;
    duchyId: number;
    kingdomId: number;
    empireId: number;
    development: number;
    flag: {
        symbol: string;
        primaryColor: string;
        secondaryColor: string;
    };
}

export function buildHierarchy(points: {x:number, z:number}[], random: () => number) {
    const names = generateNames(points.length);
    const colors = [
        '#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080', '#ffffff', '#000000'
    ];

    const baronies: BaronyData[] = [];
    const counties: Record<number, HierarchyEntity> = {};
    const duchies: Record<number, HierarchyEntity> = {};
    const kingdoms: Record<number, HierarchyEntity> = {};
    const empires: Record<number, HierarchyEntity> = {};

    const symbols = ['lion', 'eagle', 'dragon', 'shield', 'cross', 'star', 'sun', 'moon', 'bird', 'wolf', 'crown'];

    points.forEach((p, i) => {
        const cId = Math.floor(i / 3);
        const dId = Math.floor(i / 9);
        const kId = Math.floor(i / 27);
        const eId = Math.floor(i / 81);

        baronies.push({
            id: i,
            name: names[i],
            x: p.x,
            z: p.z,
            color: colors[i % colors.length],
            countyId: cId,
            duchyId: dId,
            kingdomId: kId,
            empireId: eId,
            development: Math.floor(random() * 20) + 5,
            flag: {
                symbol: symbols[Math.floor(random() * symbols.length)],
                primaryColor: colors[Math.floor(random() * colors.length)],
                secondaryColor: colors[Math.floor(random() * colors.length)],
            }
        });

        if (!counties[cId]) counties[cId] = { id: cId, name: `County ${cId}`, x:0, z:0, color: colors[cId % colors.length] };
        if (!duchies[dId]) duchies[dId] = { id: dId, name: `Duchy ${dId}`, x:0, z:0, color: colors[dId % colors.length] };
        if (!kingdoms[kId]) kingdoms[kId] = { id: kId, name: `Kingdom ${kId}`, x:0, z:0, color: colors[kId % colors.length] };
        if (!empires[eId]) empires[eId] = { id: eId, name: `Empire ${eId}`, x:0, z:0, color: colors[eId % colors.length] };
    });

    return { baronies, counties, duchies, kingdoms, empires };
}
