import {detectProblemType} from './parser.js';
import {solveMath} from './solver/mathSolver.js';
import {solvePhysics} from './solver/physicsSolver.js';

const el = {
  input: document.getElementById('problemInput'),
  result: document.getElementById('result'),
  history: document.getElementById('history'),
  solve: document.getElementById('solveBtn'),
  clear: document.getElementById('clearBtn'),
  theme: document.getElementById('themeToggle'),
  symbolRow: document.getElementById('symbolRow'),
};

const symbols = ['√', 'π', 'sin(x)', 'cos(x)', 'x^2', '∫', 'd/dx', '=', '+', '-', '*', '/'];
const history = JSON.parse(localStorage.getItem('solver-history') || '[]');
let formulasDb = {};

async function loadFormulas() {
  const res = await fetch('./data/formulas.json');
  formulasDb = await res.json();
}

function renderSymbols() {
  symbols.forEach((s) => {
    const b = document.createElement('button');
    b.className = 'symbol';
    b.textContent = s;
    b.addEventListener('click', () => {
      el.input.value += `${s} `;
      el.input.focus();
    });
    el.symbolRow.appendChild(b);
  });
}

function renderHistory() {
  el.history.innerHTML = '';
  history.slice().reverse().forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    li.title = 'Click to reuse';
    li.onclick = () => (el.input.value = item);
    el.history.appendChild(li);
  });
}

function saveHistory(text) {
  if (!text.trim()) return;
  history.push(text.trim());
  if (history.length > 20) history.shift();
  localStorage.setItem('solver-history', JSON.stringify(history));
  renderHistory();
}

function renderSolution(solution) {
  el.result.classList.remove('empty');
  if (solution.error) {
    el.result.innerHTML = `<div class="step">❌ ${solution.error}</div>`;
    return;
  }

  const stepsHtml = solution.steps.map((s, i) => `<div class="step"><strong>Step ${i + 1}:</strong> ${s}</div>`).join('');
  el.result.innerHTML = `${stepsHtml}<div class="final">Final: ${solution.final}</div>`;
}

function normalizeInput(text) {
  return text.replace(/π/g, String(Math.PI)).replace(/√\s*(\d+(?:\.\d+)?)/g, (_, n) => Math.sqrt(Number(n)));
}

function solveInput() {
  const raw = el.input.value.trim();
  if (!raw) return;
  const text = normalizeInput(raw);
  const type = detectProblemType(text);
  const solution = type === 'physics' ? solvePhysics(text, formulasDb) : solveMath(text);
  renderSolution(solution);
  saveHistory(raw);
}

function initTheme() {
  const mode = localStorage.getItem('solver-theme') || 'light';
  if (mode === 'dark') document.body.classList.add('dark');
  el.theme.textContent = document.body.classList.contains('dark') ? '☀️ Light' : '🌙 Dark';
  el.theme.onclick = () => {
    document.body.classList.toggle('dark');
    const dark = document.body.classList.contains('dark');
    localStorage.setItem('solver-theme', dark ? 'dark' : 'light');
    el.theme.textContent = dark ? '☀️ Light' : '🌙 Dark';
  };
}

el.solve.addEventListener('click', solveInput);
el.clear.addEventListener('click', () => {
  el.input.value = '';
  el.result.innerHTML = 'No solution yet.';
  el.result.classList.add('empty');
});
el.input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) solveInput();
});

await loadFormulas();
renderSymbols();
renderHistory();
initTheme();
