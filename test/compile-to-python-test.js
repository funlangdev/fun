import PythonTargetCompiler from "../lib/compilers/PythonTargetCompiler.js";
import Lexer from "../lib/funlang/Lexer.js";
import Parser from "../lib/funlang/Parser.js";

const testCode = `
var a = 1 + 2 * (1 + 2) + 4
var b = 1 + 2 * 1 + 2 + 4
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

print(add(a, b))
print(sub(b, c))
`;

const tokens = Lexer.tokenize(testCode);
console.log(tokens);

const ast = new Parser(tokens).parse();
console.log(JSON.stringify(ast, null, 2));

const pythonCode = PythonTargetCompiler.compile(ast);
console.log(pythonCode);
