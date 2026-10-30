# Calculator

JavaScript practicum group assignment, implemented with plain HTML, CSS and JavaScript.

## Run locally

Open `index.html` in a modern browser. No installation, build step or account is required.
Alternatively, use VS Code Live Server to open the project folder.

## Assignment coverage

- Named `add`, `subtract`, `multiply`, `divide` functions and an `operate` dispatcher.
- Digit, operator, equals and clear buttons, with the current input stored in `displayValue`.
- `firstNumber`, `operator` and `waitingForNumber` track a single pending pair.
- Sequential evaluation: `12 + 7 - 5 * 3 =` produces `42`, without precedence rules.
- Repeated operators replace the pending operator. Incomplete equals presses do nothing.
- Results round to twelve significant figures; input is limited to twelve digits.
- Division by zero shows a friendly error; typing a number or Clear recovers.
- Decimal input prevents a second decimal point; the decimal button disables appropriately.
- Backspace, keyboard digits/operators, Enter/= and Escape/Delete support.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Semantic page structure and controls |
| `style.css` | Responsive layout, colours and focus styles |
| `script.js` | Application state and event handlers |
| `test.cjs` | Dependency-free Node regression tests |
| `PRESENTATION.md` | Demo outline and teammate handover |

## Automated checks

Install Node.js 22 or newer, then run `npm test`. No `npm install` is needed.
The tests execute the actual script in an isolated DOM stub. They cover logic and
state transitions; visual layout and real browser behaviour require the manual checklist.

## Manual checks

- Enter `12 + 7 - 5 * 3 =`; expect 42.
- Enter `1 / 3 =`; expect 0.333333333333 without display overflow.
- Enter `0.1 + 0.2 =`; expect 0.3.
- Press `=`, then `2 + =`; expect no crash or invented second operand.
- Enter `2 + * 3 =`; expect 6 (operator replacement).
- Enter `9 / 0 =`; expect Error and an explanatory message. Type 2 to recover.
- Clear halfway through an operation; verify no pending operation survives.
- Try entering a second decimal and deleting the last digit with Backspace.
- Tab through buttons and try keyboard digits, operators, =, Escape and Enter.

## Working together

Pull the latest `main` before starting. Create a branch for your change, use a clear
commit message, and open a pull request describing what changed and how you checked it.
Keep styling changes in `style.css` and behaviour changes in `script.js` where practical.

See `PRESENTATION.md` for suggested preparation before Saturday, 31 October 2026.
