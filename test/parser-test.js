import Lexer from "../lib/code/lexer.js";
import Parser from "../lib/code/parser.js";

const testCode = `
var a = 1 + 2 + 3
var str = "Hello, World!"
str
a += 3

# This is a comment.
if (a > 3) {
  b = 3
}
`;

const tokens = Lexer.tokenize(testCode);
console.log(tokens);

const ast = Parser.parse(tokens);
console.log(ast);
