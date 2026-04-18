import {extractEquation, tokenizeExpression} from '../parser.js';

function precedence(op) {
  return {'+': 1, '-': 1, '*': 2, '/': 2, '^': 3}[op] || 0;
}

function applyOp(a, b, op) {
  if (op === '+') return a + b;
  if (op === '-') return a - b;
  if (op === '*') return a * b;
  if (op === '/') return a / b;
  if (op === '^') return a ** b;
  throw new Error('Unknown operator');
}

export function evaluateArithmetic(expression) {
  const tokens = tokenizeExpression(expression);
  const values = [];
  const ops = [];
  const steps = [`Tokens: ${tokens.join(' ')}`];

  tokens.forEach((token) => {
    if (!Number.isNaN(Number(token))) values.push(Number(token));
    else if (token === '(') ops.push(token);
    else if (token === ')') {
      while (ops.length && ops.at(-1) !== '(') {
        const op = ops.pop();
        const b = values.pop();
        const a = values.pop();
        values.push(applyOp(a, b, op));
      }
      ops.pop();
    } else {
      while (ops.length && precedence(ops.at(-1)) >= precedence(token)) {
        const op = ops.pop();
        const b = values.pop();
        const a = values.pop();
        values.push(applyOp(a, b, op));
      }
      ops.push(token);
    }
  });

  while (ops.length) {
    const op = ops.pop();
    const b = values.pop();
    const a = values.pop();
    values.push(applyOp(a, b, op));
  }

  steps.push(`Evaluate by precedence (BODMAS) => ${values[0]}`);
  return {steps, final: values[0]};
}

function parseLinearSide(side) {
  const normalized = side.replace(/\s+/g, '').replace(/-/g, '+-');
  const terms = normalized.split('+').filter(Boolean);
  let coeff = 0;
  let constant = 0;
  terms.forEach((t) => {
    const varMatch = t.match(/^(-?\d*\.?\d*)x$/i);
    if (varMatch) {
      const c = varMatch[1] === '' || varMatch[1] === '+' ? 1 : varMatch[1] === '-' ? -1 : Number(varMatch[1]);
      coeff += c;
    } else constant += Number(t);
  });
  return {coeff, constant};
}

export function solveLinearEquation(input) {
  const eq = extractEquation(input);
  if (!eq) return null;
  const left = parseLinearSide(eq.left);
  const right = parseLinearSide(eq.right);

  const steps = [
    `Given equation: ${eq.left} = ${eq.right}`,
    `Collect variable terms and constants`,
    `(${left.coeff}x + ${left.constant}) = (${right.coeff}x + ${right.constant})`,
  ];

  const a = left.coeff - right.coeff;
  const b = right.constant - left.constant;
  steps.push(`Move x terms to left and constants to right => ${a}x = ${b}`);

  if (a === 0) return {steps, final: 'No unique solution'};
  const x = b / a;
  steps.push(`Divide both sides by ${a}`);
  return {steps, final: `x = ${x}`};
}

function parsePolynomial(expr) {
  const normalized = expr.replace(/\s+/g, '').replace(/-/g, '+-');
  const terms = normalized.split('+').filter(Boolean);
  let a = 0; let b = 0; let c = 0;
  terms.forEach((t) => {
    if (/x\^2/i.test(t)) {
      const coef = t.replace(/x\^2/i, '');
      a += coef === '' || coef === '+' ? 1 : coef === '-' ? -1 : Number(coef);
    } else if (/x/i.test(t)) {
      const coef = t.replace(/x/i, '');
      b += coef === '' || coef === '+' ? 1 : coef === '-' ? -1 : Number(coef);
    } else c += Number(t);
  });
  return {a, b, c};
}

export function solveQuadraticEquation(input) {
  const eq = extractEquation(input);
  if (!eq) return null;
  const left = parsePolynomial(eq.left);
  const right = parsePolynomial(eq.right);
  const poly = {a: left.a - right.a, b: left.b - right.b, c: left.c - right.c};
  const {a, b, c} = poly;
  const steps = [`Standard form: ${a}x² + ${b}x + ${c} = 0`];
  if (a === 0) return null;
  const D = b * b - 4 * a * c;
  steps.push(`Discriminant D = b² - 4ac = ${D}`);
  if (D < 0) return {steps, final: 'No real roots'};
  const r1 = (-b + Math.sqrt(D)) / (2 * a);
  const r2 = (-b - Math.sqrt(D)) / (2 * a);
  steps.push('Use quadratic formula x = (-b ± √D) / 2a');
  return {steps, final: `x₁ = ${r1}, x₂ = ${r2}`};
}

function deriveTerm(term) {
  if (/^\d*\.?\d*x\^\d+$/i.test(term)) {
    const [coefPart, powPart] = term.split('x^');
    const c = coefPart === '' ? 1 : Number(coefPart);
    const n = Number(powPart);
    return `${c * n}x^${n - 1}`;
  }
  if (/^x\^\d+$/i.test(term)) {
    const n = Number(term.split('^')[1]);
    return `${n}x^${n - 1}`;
  }
  if (/^\d*\.?\d*x$/i.test(term)) return term.replace('x', '') || '1';
  if (/^x$/i.test(term)) return '1';
  if (/^sin\(x\)$/i.test(term)) return 'cos(x)';
  if (/^cos\(x\)$/i.test(term)) return '-sin(x)';
  if (/^e\^x$/i.test(term)) return 'e^x';
  return '0';
}

function integrateTerm(term) {
  if (/^\d*\.?\d*x\^\d+$/i.test(term)) {
    const [coefPart, powPart] = term.split('x^');
    const c = coefPart === '' ? 1 : Number(coefPart);
    const n = Number(powPart);
    return `${c / (n + 1)}x^${n + 1}`;
  }
  if (/^x\^\d+$/i.test(term)) {
    const n = Number(term.split('^')[1]);
    return `${1 / (n + 1)}x^${n + 1}`;
  }
  if (/^x$/i.test(term)) return '0.5x^2';
  if (!Number.isNaN(Number(term))) return `${term}x`;
  if (/^sin\(x\)$/i.test(term)) return '-cos(x)';
  if (/^cos\(x\)$/i.test(term)) return 'sin(x)';
  if (/^e\^x$/i.test(term)) return 'e^x';
  return `∫(${term})dx`;
}

export function solveCalculus(input) {
  const lc = input.toLowerCase();
  const clean = input.replace(/differentiate|derivative|d\/dx|integrate|\bof\b/gi, '').trim();
  const terms = clean.replace(/\s+/g, '').replace(/-/g, '+-').split('+').filter(Boolean);

  if (lc.includes('differentiate') || lc.includes('derivative') || lc.includes('d/dx')) {
    const steps = ['Apply derivative rules term by term (power/basic trig).'];
    const transformed = terms.map((t) => {
      const d = deriveTerm(t);
      steps.push(`d/dx(${t}) = ${d}`);
      return d;
    });
    return {steps, final: transformed.join(' + ').replace(/\+ -/g, '- ')};
  }

  if (lc.includes('integrate') || lc.startsWith('∫')) {
    const steps = ['Apply integral rules term by term.'];
    const transformed = terms.map((t) => {
      const integ = integrateTerm(t);
      steps.push(`∫ ${t} dx = ${integ}`);
      return integ;
    });
    return {steps, final: `${transformed.join(' + ').replace(/\+ -/g, '- ')} + C`};
  }

  return null;
}

export function solveMath(input) {
  const text = input.trim();
  if (!text) return {error: 'Please enter a math problem.'};

  const calculus = solveCalculus(text);
  if (calculus) return calculus;

  if (text.includes('=')) {
    if (/x\^2/i.test(text)) {
      const quad = solveQuadraticEquation(text);
      if (quad) return quad;
    }
    const lin = solveLinearEquation(text);
    if (lin) return lin;
  }

  if (/^[0-9+\-*/^().\s]+$/.test(text)) return evaluateArithmetic(text);

  return {error: 'Unsupported math format. Try linear/quadratic, arithmetic, derivative, or integral.'};
}
