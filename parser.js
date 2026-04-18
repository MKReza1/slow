export function detectProblemType(input) {
  const text = input.toLowerCase();
  const physicsHints = ['find', 'velocity', 'acceleration', 'force', 'current', 'voltage', 'resistance', 'mass', 'u=', 'v=', 'a=', 't=', 'f=', 'i=', 'r=', 'kg', 'm/s', 'newton', 'ohm'];
  if (physicsHints.some((h) => text.includes(h))) return 'physics';
  return 'math';
}

export function tokenizeExpression(expr) {
  const cleaned = expr.replace(/\s+/g, '');
  const regex = /(\d*\.?\d+|[a-zA-Z]+|\^|\*|\/|\+|\-|\(|\))/g;
  return cleaned.match(regex) || [];
}

export function parseKnownValues(input) {
  const assignments = [...input.matchAll(/([a-zA-Z]+)\s*=\s*(-?\d*\.?\d+)\s*([a-zA-Z/\^0-9]*)/g)];
  const known = {};
  const units = {};
  assignments.forEach((m) => {
    known[m[1].toLowerCase()] = Number(m[2]);
    if (m[3]) units[m[1].toLowerCase()] = m[3];
  });
  const unknownMatch = input.match(/(?:find|solve for|unknown)\s+([a-zA-Z]+)/i);
  const unknown = unknownMatch ? unknownMatch[1].toLowerCase() : null;
  return {known, units, unknown};
}

export function extractEquation(input) {
  const eqMatch = input.match(/([^=]+)=([^=]+)/);
  if (!eqMatch) return null;
  return {left: eqMatch[1].trim(), right: eqMatch[2].trim()};
}
