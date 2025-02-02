import Lexer from "../lib/code/lexer.js";
import Parser from "../lib/code/parser.js";

const testCode = `
var a = 1 + 2 * (1 + 2) + 4
var b = 1 + 2 * 1 + 2 + 4++
var c = 1 + 2 + -1 + 2 + +4

var str = "Hello, World!"
str
a += 3

var b = true

# This is a comment.
if (a > 3) {
  b = 3
} else {
  b = 4
}

function add(a, b) {
  return a + b
}

function sub(a, b) {
  return a - b
}

console.log(add(1, 2))
console.log(sub(1, 2))
`;

const tokens = Lexer.tokenize(testCode);
console.log(tokens);

const ast = new Parser(tokens).parse();
console.log(JSON.stringify(ast, null, 2));
