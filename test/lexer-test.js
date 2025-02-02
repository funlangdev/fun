import Lexer from "../lib/code/lexer.js";

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

console.log(Lexer.tokenize(testCode));
