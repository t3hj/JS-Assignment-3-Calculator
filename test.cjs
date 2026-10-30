const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
function load() {
  const elements = new Map();
  function element() { return {textContent:'',disabled:false,dataset:{},style:{},tagName:'BODY',clientWidth:600,handlers:{},addEventListener(name, fn){this.handlers[name]=fn},append(){},remove(){},replaceChildren(){}}; }
  const buttons = Array.from({length:3}, element);
  const document = {hidden:false,handlers:{},querySelector(selector){if(!elements.has(selector))elements.set(selector,element());return elements.get(selector)},querySelectorAll(){return buttons},createElement:element,addEventListener(name,fn){this.handlers[name]=fn}};
  const context = vm.createContext({document,Math,console,requestAnimationFrame:()=>1,cancelAnimationFrame:()=>{}});
  vm.runInContext(fs.readFileSync(__dirname+'/script.js','utf8'),context);
  return {run:code=>vm.runInContext(code,context),document,buttons};
}
function press(a,keys){for(const k of keys)a.run(`handleKey(${JSON.stringify(k)})`);return a.run('displayValue')}
test('arithmetic functions and operate dispatch',()=>{const a=load();assert.equal(a.run('add(2,3)'),5);assert.equal(a.run('subtract(2,3)'),-1);assert.equal(a.run('multiply(-2,3)'),-6);assert.equal(a.run("operate('/',7,2)"),3.5)});
test('evaluates each pair in sequence',()=>{const a=load();assert.equal(press(a,['1','2','+','7','-','5','*','3','=']),'42')});
test('incomplete equals is safe and operators can be replaced',()=>{const a=load();assert.equal(press(a,['=','2','+','=']),'2');assert.equal(press(a,['*','3','=']),'6')});
test('decimals, rounding and backspace',()=>{const a=load();assert.equal(press(a,['1','.','2','.','3','Backspace']),'1.2');assert.equal(press(a,['Clear','0','.','1','+','0','.','2','=']),'0.3');assert.equal(press(a,['Clear','1','/','3','=']),'0.333333333333')});
test('clear removes pending state; errors recover with fresh input',()=>{const a=load();assert.equal(press(a,['9','/','0','=']),'Error');assert.match(a.document.querySelector('#message').textContent,/Zero/);assert.equal(press(a,['2','+','3','=']),'5');assert.equal(press(a,['+','Clear','4','=']),'4');assert.equal(a.run('operator'),null)});
test('result supports continuation or fresh entry',()=>{const a=load();assert.equal(press(a,['2','+','3','=','*','4','=']),'20');assert.equal(press(a,['7']),'7')});
