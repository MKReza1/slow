import {parseKnownValues} from '../parser.js';

const symbolFor = (formula) => formula.match(/[a-zA-Z]+/g) || [];

function evalExpression(expr, values) {
  const replaced = expr.replace(/[a-zA-Z]+/g, (v) => values[v] ?? v);
  return Function(`"use strict"; return (${replaced});`)();
}

function solveForUnknown(formula, known, unknown) {
  const [lhs, rhs] = formula.split('=').map((s) => s.trim());
  const steps = [`Formula selected: ${formula}`];

  if (unknown === lhs) {
    steps.push(`Unknown is ${lhs}; substitute known values into RHS.`);
    const value = evalExpression(rhs, known);
    steps.push(`${lhs} = ${rhs} = ${value}`);
    return {value, steps};
  }

  if (formula === 'v = u + a*t') {
    if (unknown === 'u') return {value: known.v - known.a * known.t, steps: [...steps, 'Rearrange u = v - a*t']};
    if (unknown === 'a') return {value: (known.v - known.u) / known.t, steps: [...steps, 'Rearrange a = (v - u)/t']};
    if (unknown === 't') return {value: (known.v - known.u) / known.a, steps: [...steps, 'Rearrange t = (v - u)/a']};
  }

  if (formula === 's = u*t + 0.5*a*t^2') {
    if (unknown === 's') return {value: known.u * known.t + 0.5 * known.a * known.t ** 2, steps: [...steps, 'Substitute directly in displacement equation']};
    if (unknown === 'u') return {value: (known.s - 0.5 * known.a * known.t ** 2) / known.t, steps: [...steps, 'Rearrange u = (s - 0.5*a*t^2)/t']};
    if (unknown === 'a') return {value: (2 * (known.s - known.u * known.t)) / (known.t ** 2), steps: [...steps, 'Rearrange a = 2(s - ut)/t²']};
  }

  if (formula === 'f = m*a') {
    if (unknown === 'f') return {value: known.m * known.a, steps: [...steps, 'Substitute directly in force equation']};
    if (unknown === 'm') return {value: known.f / known.a, steps: [...steps, 'Rearrange m = F/a']};
    if (unknown === 'a') return {value: known.f / known.m, steps: [...steps, 'Rearrange a = F/m']};
  }

  if (formula === 'v = i*r') {
    if (unknown === 'v') return {value: known.i * known.r, steps: [...steps, 'Substitute directly in Ohm’s law']};
    if (unknown === 'i') return {value: known.v / known.r, steps: [...steps, 'Rearrange I = V/R']};
    if (unknown === 'r') return {value: known.v / known.i, steps: [...steps, 'Rearrange R = V/I']};
  }

  return null;
}

export function solvePhysics(input, formulasDb) {
  const {known, units, unknown: inputUnknown} = parseKnownValues(input);
  const unknown = inputUnknown || Object.keys(known).find((k) => known[k] === undefined);

  const steps = ['Extract known values from input.'];
  steps.push(`Known: ${JSON.stringify(known)}`);

  for (const category of Object.values(formulasDb)) {
    for (const f of category) {
      const vars = f.variables.map((v) => v.toLowerCase());
      const hasAtLeast = vars.filter((v) => known[v] !== undefined).length >= vars.length - 1;
      const target = unknown || vars.find((v) => known[v] === undefined);
      if (!target || !vars.includes(target) || !hasAtLeast) continue;

      const solved = solveForUnknown(f.formula.toLowerCase(), known, target.toLowerCase());
      if (!solved) continue;

      const unit = units[target] || '';
      return {
        steps: [...steps, ...solved.steps, `Substitute values and simplify.`],
        final: `${target} = ${Number(solved.value.toFixed(6))}${unit ? ` ${unit}` : ''}`,
      };
    }
  }

  return {error: 'Could not match a physics formula. Provide values like u=, a=, t= and specify find variable.'};
}
