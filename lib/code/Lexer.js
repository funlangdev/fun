import TokenType from "./TokenType.js";
const KEYWORDS = new Set(["var", "function", "if", "else", "while", "return"]);
const OPE;
class Lexer {
    tokenize(code) {
        const tokens = [];
        let i = 0;
        while (i < code.length) {
            const ch = code[i];
            if (ch === "\n") {
                tokens.push({ type: TokenType.Newline });
                continue;
            }
            if (ch === "#") {
                let text = "";
                while (code[i] !== undefined && code[i] !== "\n") {
                    text += code[i];
                    i++;
                }
                tokens.push({ type: TokenType.Comment, value: text });
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
                    }
                    else {
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
        }
        return tokens;
    }
}
export default new Lexer();
//# sourceMappingURL=Lexer.js.map