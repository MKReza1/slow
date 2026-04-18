# Offline Math + Physics Solver

A fully offline, deterministic web app for solving mathematics and physics problems with step-by-step explanations.

## Features
- Math: arithmetic (BODMAS), linear equations, quadratic equations, basic derivatives, basic integrals.
- Physics: rule-based formula solver with known/unknown detection.
- Step-by-step solution output.
- Formula database in `data/formulas.json`.
- Dark mode + local history.
- No external API or backend.

## Run
```bash
npm run start
```
Then open `http://localhost:3000`.

## Project Structure
- `index.html`
- `style.css`
- `app.js`
- `parser.js`
- `solver/mathSolver.js`
- `solver/physicsSolver.js`
- `data/formulas.json`
