"use strict";
function add(a, b) { return a + b; }
function subtract(a, b) { return a - b; }
function multiply(a, b) { return a * b; }
function divide(a, b) {
  if (b === 0) throw new Error("Nice try. Zero refuses to be a divisor!");
  return a / b;
}
function operate(operator, a, b) {
  const operations = { "+": add, "-": subtract, "*": multiply, "/": divide };
  if (!operations[operator]) throw new Error("Choose a valid operator.");
  const result = operations[operator](a, b);
  if (!Number.isFinite(result)) throw new Error("That number is too large. Try something smaller.");
  return result;
}
// firstNumber and operator hold the pending pair; displayValue holds the current input.
let displayValue = "0";
let firstNumber = null;
let operator = null;
let waitingForNumber = false;
let hasError = false;
const display = document.querySelector("#display");
const message = document.querySelector("#message");
const symbols = { "+": "+", "-": "−", "*": "×", "/": "÷" };
function fitDisplay() {
  // Shrink the font until the whole number fits, so long results are never cut off.
  display.style.fontSize = "";
  let size = parseFloat(getComputedStyle(display).fontSize);
  while (display.scrollWidth > display.clientWidth && size > 12) {
    size -= 1;
    display.style.fontSize = `${size}px`;
  }
}
function render() {
  display.textContent = displayValue;
  document.querySelector('[data-key="."]').disabled = !waitingForNumber && displayValue.includes(".");
  fitDisplay();
}
function clear() {
  displayValue = "0";
  firstNumber = null;
  operator = null;
  waitingForNumber = false;
  hasError = false;
  message.textContent = "Ready to calculate.";
  render();
}
function calculate() {
  // Round to 12 significant figures, then to at most 4 decimals.
  firstNumber = operate(operator, firstNumber, Number(displayValue));
  firstNumber = Number(firstNumber.toPrecision(12));
  firstNumber = Number(firstNumber.toFixed(4));
  displayValue = String(firstNumber);
}
function handleKey(key) {
  if (key === "Clear") { clear(); return; }
  if (hasError) {
    if (!/^[0-9.]$/.test(key)) return;
    clear();
  }
  try {
    if (/^[0-9]$/.test(key) || key === ".") {
      if (waitingForNumber) { displayValue = "0"; waitingForNumber = false; }
      if (key === ".") {
        if (!displayValue.includes(".")) displayValue += ".";
     } else if (displayValue.replace(/[.-]/g, "").length < 12) {
  if ((displayValue.split(".")[1] || "").length >= 4) {
    message.textContent = "Maximum 4 decimals.";
  } else {
    displayValue = displayValue === "0" ? key : displayValue + key;
  }
}
    } else if (key === "Backspace") {
      if (!waitingForNumber) displayValue = displayValue.slice(0, -1);
      if (!displayValue || displayValue === "-") displayValue = "0";
    } else if (["+", "-", "*", "/"].includes(key)) {
      // A second operator replaces the pending operator until a number is entered.
      if (operator && !waitingForNumber) calculate();
      else firstNumber = Number(displayValue);
      operator = key;
      waitingForNumber = true;
      message.textContent = `${displayValue} ${symbols[operator]} …`;
    } else if (key === "=") {
      if (!operator || waitingForNumber) return;
      calculate();
      operator = null;
      firstNumber = null;
      waitingForNumber = true;
      message.textContent = "Result. Type a number to start again, or choose an operator to continue.";
    }
  } catch (error) {
    displayValue = "Error";
    message.textContent = error.message;
    firstNumber = null;
    operator = null;
    waitingForNumber = true;
    hasError = true;
  }
  render();
}
document.querySelectorAll("[data-key]").forEach(button => {
  button.addEventListener("click", () => handleKey(button.dataset.key));
});
document.addEventListener("keydown", event => {
  if (event.ctrlKey || event.metaKey || event.altKey) return;
  // Space activates the focused button; Enter always evaluates the calculation.
  if (event.target.tagName === "BUTTON" && event.key === " ") return;
  const key = event.key === "Escape" || event.key === "Delete" ? "Clear" : event.key === "Enter" ? "=" : event.key;
  if (/^[0-9.+*/=-]$/.test(key) || ["Clear", "Backspace"].includes(key)) {
    event.preventDefault();
    handleKey(key);
  }
});
window.addEventListener("resize", fitDisplay);
render();
