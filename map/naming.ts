const PREFIXES = ['New', 'Old', 'Upper', 'Lower', 'North', 'South', 'East', 'West', 'Great', 'Saint', 'High', 'Greater'];
const ROOTS = [
  'Wessex', 'Mercia', 'Lothian', 'Munster', 'Anjou', 'Saxon', 'Lombard', 'Leon', 'Navarre', 
  'Sicily', 'Aragon', 'Castile', 'Burgundy', 'Normandy', 'Brittany', 'Cornwall', 'Frankia',
  'Aquitaine', 'Bavaria', 'Silesia', 'Bohemia', 'Swabia', 'Thuringia', 'Frisia', 'Austrasia',
  'Verona', 'Tuscany', 'Istria', 'Spoleto', 'Benevento', 'Capua', 'Salerno'
];
const SUFFIXES = ['ia', 'ony', 'land', 'ford', 'burg', 'shire', 'ance', 'os', 'um', 'berg', 'reich', 'mark', 'stan', 'grad'];

export function generateNames(count: number): string[] {
    const names: string[] = [];
    for (let i = 0; i < count; i++) {
        const root = ROOTS[i % ROOTS.length];
        const suffix = SUFFIXES[i % SUFFIXES.length];
        names.push(root + suffix);
    }
    return names;
}

export function genName(random: () => number, level: string = 'Barony') {
  const root = ROOTS[Math.floor(random() * ROOTS.length)];
  const suffix = SUFFIXES[Math.floor(random() * SUFFIXES.length)];
  
  if (level === 'Empire') {
    const patterns = [
      () => root + ' Empire',
      () => 'Holy ' + root + ' Empire',
      () => 'Grand Empire of ' + root + suffix,
      () => 'The ' + root + ' Realm'
    ];
    return patterns[Math.floor(random() * patterns.length)]();
  }
  
  if (level === 'Kingdom') {
    const patterns = [
      () => 'Kingdom of ' + root,
      () => root + suffix,
      () => 'Great ' + root,
      () => root + 'land'
    ];
    return patterns[Math.floor(random() * patterns.length)]();
  }

  if (random() > 0.85) {
    return PREFIXES[Math.floor(random() * PREFIXES.length)] + ' ' + root + suffix;
  }
  return root + suffix;
}
