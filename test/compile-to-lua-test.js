import Lexer from "../lib/lang/lexer.js";
import Parser from "../lib/lang/parser.js";
import LuaTargetCompiler from "../lib/jsoncode/LuaTargetCompiler.js";

const testCode = `
var a = 1 + 2 * (1 + 2) + 4
var b = 1 + 2 * 1 + 2 + 4
var c = 1 + 2 + -1 + 2 + 4

var str = "Hello, World!"
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

const luaCode = LuaTargetCompiler.compile(ast);
console.log(luaCode);
