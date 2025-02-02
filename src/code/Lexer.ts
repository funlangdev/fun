import Token from "./Token.js";
import TokenType from "./TokenType.js";

const KEYWORDS = new Set(["var", "function", "if", "else", "while", "return"]);
const OPERATORS = new Set([
  "=",
  "+",
  "-",
  "*",
  "/",
  "%",
  "&&",
  "||",
  "!",
  "==",
  "!=",
  "<",
  ">",
  "<=",
  ">=",
  "++",
  "--",
  "+=",
  "-=",
  "*=",
  "/=",
  "%=",
]);
const PUNCTUATIONS = new Set(["(", ")", "{", "}", "[", "]", ",", "."]);

// code -> tokens
class Lexer {
  public tokenize(code: string): Token[] {
    const tokens: Token[] = [];

    let i = 0;
    while (i < code.length) {
      const ch = code[i];

      if (ch === " ") {
        i++;
        continue;
      }

      if (ch === "\n") {
        tokens.push({ type: TokenType.Newline });
        i++;
        continue;
      }

      if (ch === "#") {
        i++;

        let text = "";
        while (code[i] !== undefined && code[i] !== "\n") {
          text += code[i];
          i++;
        }
        tokens.push({ type: TokenType.Comment, value: text.trim() });
        continue;
      }

      if (/[0-9]/.test(ch)) {
        let value = "";
        while (code[i] !== undefined && /[0-9\.]/.test(code[i])) {
          value += code[i];
          i++;
        }
        tokens.push({ type: TokenType.Number, value });
        continue;
      }

      if (ch === '"') {
        let value = "";
        i++;
        while (code[i] !== undefined && code[i] !== '"') {
          if (code[i] === "\\" && code[i + 1] === '"') {
            i++;
            value += '"';
          } else {
            value += code[i];
          }
          i++;
        }
        if (code[i] !== '"') {
          throw new Error("Unterminated string literal");
        }
        i++;
        tokens.push({ type: TokenType.String, value });
        continue;
      }

      if (/[a-zA-Z_]/.test(ch)) {
        let id = "";
        while (code[i] !== undefined && /[a-zA-Z0-9_]/.test(code[i])) {
          id += code[i];
          i++;
        }
        if (KEYWORDS.has(id)) {
          tokens.push({ type: TokenType.Keyword, value: id });
          continue;
        }
        tokens.push({ type: TokenType.Identifier, value: id });
        continue;
      }

      if (OPERATORS.has(ch + code[i + 1])) {
        tokens.push({ type: TokenType.Operator, value: ch + code[i + 1] });
        i += 2;
        continue;
      }

      if (OPERATORS.has(ch)) {
        tokens.push({ type: TokenType.Operator, value: ch });
        i++;
        continue;
      }

      if (PUNCTUATIONS.has(ch)) {
        tokens.push({ type: TokenType.Punctuation, value: ch });
        i++;
        continue;
      }

      throw new Error(
        `Unexpected character: ${ch}(${ch.charCodeAt(0)}) at ${i}`,
      );
    }

    return tokens;
  }
}

export default new Lexer();
