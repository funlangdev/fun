import TokenType from "./TokenType.js";
class Parser {
    parseExpression(tokens, i) {
        while (i < tokens.length && tokens[i].type === TokenType.Newline)
            i++;
        if (i >= tokens.length)
            throw new Error("Unexpected end of input");
        const token = tokens[i];
        if (token.type === TokenType.Keyword) {
            if (token.value === "var") {
                i++;
                if (i >= tokens.length || tokens[i].type !== TokenType.Identifier) {
                    throw new Error("Expected identifier after 'var'");
                }
                const varName = tokens[i].value;
                i++;
                if (i >= tokens.length || tokens[i].type !== TokenType.Operator ||
                    tokens[i].value !== "=") {
                    throw new Error("Expected '=' after variable name");
                }
                i++;
                let init;
                [init, i] = this.parseExpression(tokens, i);
                return [{ type: "var", name: varName, init }, i];
            }
            else if (token.value === "function") {
                i++;
                if (i >= tokens.length || tokens[i].type !== TokenType.Identifier) {
                    throw new Error("Expected identifier after 'function'");
                }
                const funcName = tokens[i].value;
                i++;
                if (i >= tokens.length || tokens[i].type !== TokenType.Punctuation ||
                    tokens[i].value !== "(") {
                    throw new Error("Expected '(' after function name");
                }
                i++;
                const params = [];
                while (i < tokens.length &&
                    !(tokens[i].type === TokenType.Punctuation && tokens[i].value === ")")) {
                    if (tokens[i].type === TokenType.Identifier) {
                        params.push(tokens[i].value);
                        i++;
                        if (i < tokens.length && tokens[i].type === TokenType.Punctuation &&
                            tokens[i].value === ",") {
                            i++;
                        }
                    }
                    else {
                        throw new Error("Expected identifier in function parameters");
                    }
                }
                if (i >= tokens.length || tokens[i].type !== TokenType.Punctuation ||
                    tokens[i].value !== ")") {
                    throw new Error("Expected ')' after function parameters");
                }
                i++;
                if (i >= tokens.length || tokens[i].type !== TokenType.Punctuation ||
                    tokens[i].value !== "{") {
                    throw new Error("Expected '{' to start function body");
                }
                i++;
                const body = [];
                while (i < tokens.length &&
                    !(tokens[i].type === TokenType.Punctuation && tokens[i].value === "}")) {
                    let stmt;
                    [stmt, i] = this.parseExpression(tokens, i);
                    body.push(stmt);
                }
                if (i >= tokens.length || tokens[i].type !== TokenType.Punctuation ||
                    tokens[i].value !== "}") {
                    throw new Error("Expected '}' at end of function body");
                }
                i++;
                return [{ type: "function", name: funcName, params, body }, i];
            }
            else if (token.value === "if") {
                i++;
                if (i >= tokens.length || tokens[i].type !== TokenType.Punctuation ||
                    tokens[i].value !== "(") {
                    throw new Error("Expected '(' after 'if'");
                }
                i++;
                let testExpr;
                [testExpr, i] = this.parseExpression(tokens, i);
                if (i >= tokens.length || tokens[i].type !== TokenType.Punctuation ||
                    tokens[i].value !== ")") {
                    throw new Error("Expected ')' after if test expression");
                }
                i++;
                if (i >= tokens.length || tokens[i].type !== TokenType.Punctuation ||
                    tokens[i].value !== "{") {
                    throw new Error("Expected '{' to start if then block");
                }
                i++;
                const thenBlock = [];
                while (i < tokens.length &&
                    !(tokens[i].type === TokenType.Punctuation && tokens[i].value === "}")) {
                    let stmt;
                    [stmt, i] = this.parseExpression(tokens, i);
                    thenBlock.push(stmt);
                }
                if (i >= tokens.length || tokens[i].type !== TokenType.Punctuation ||
                    tokens[i].value !== "}") {
                    throw new Error("Expected '}' after if then block");
                }
                i++;
                let elseBlock;
                if (i < tokens.length && tokens[i].type === TokenType.Keyword &&
                    tokens[i].value === "else") {
                    i++;
                    if (i >= tokens.length || tokens[i].type !== TokenType.Punctuation ||
                        tokens[i].value !== "{") {
                        throw new Error("Expected '{' to start else block");
                    }
                    i++;
                    elseBlock = [];
                    while (i < tokens.length &&
                        !(tokens[i].type === TokenType.Punctuation &&
                            tokens[i].value === "}")) {
                        let stmt;
                        [stmt, i] = this.parseExpression(tokens, i);
                        elseBlock.push(stmt);
                    }
                    if (i >= tokens.length || tokens[i].type !== TokenType.Punctuation ||
                        tokens[i].value !== "}") {
                        throw new Error("Expected '}' after else block");
                    }
                    i++;
                }
                return [{
                        type: "if",
                        test: testExpr,
                        then: thenBlock,
                        else: elseBlock,
                    }, i];
            }
            else if (token.value === "while") {
                i++;
                if (i >= tokens.length || tokens[i].type !== TokenType.Punctuation ||
                    tokens[i].value !== "(") {
                    throw new Error("Expected '(' after 'while'");
                }
                i++;
                let testExpr;
                [testExpr, i] = this.parseExpression(tokens, i);
                if (i >= tokens.length || tokens[i].type !== TokenType.Punctuation ||
                    tokens[i].value !== ")") {
                    throw new Error("Expected ')' after while test expression");
                }
                i++;
                if (i >= tokens.length || tokens[i].type !== TokenType.Punctuation ||
                    tokens[i].value !== "{") {
                    throw new Error("Expected '{' to start while body");
                }
                i++;
                const body = [];
                while (i < tokens.length &&
                    !(tokens[i].type === TokenType.Punctuation && tokens[i].value === "}")) {
                    let stmt;
                    [stmt, i] = this.parseExpression(tokens, i);
                    body.push(stmt);
                }
                if (i >= tokens.length || tokens[i].type !== TokenType.Punctuation ||
                    tokens[i].value !== "}") {
                    throw new Error("Expected '}' after while body");
                }
                i++;
                return [{ type: "while", test: testExpr, body }, i];
            }
            else {
                throw new Error("Unexpected keyword: " + token.value);
            }
        }
        let expr;
        if (token.type === TokenType.Number) {
            expr = { type: "number", value: token.value };
            i++;
        }
        else if (token.type === TokenType.String) {
            expr = { type: "string", value: token.value };
            i++;
        }
        else if (token.type === TokenType.Identifier) {
            if (token.value === "true") {
                expr = { type: "boolean", value: true };
            }
            else if (token.value === "false") {
                expr = { type: "boolean", value: false };
            }
            else {
                expr = { type: "identifier", name: token.value };
            }
            i++;
        }
        else if (token.type === TokenType.Punctuation && token.value === "(") {
            i++;
            [expr, i] = this.parseExpression(tokens, i);
            if (i >= tokens.length || tokens[i].type !== TokenType.Punctuation ||
                tokens[i].value !== ")") {
                throw new Error("Expected ')' after grouped expression");
            }
            i++;
        }
        else {
            throw new Error("Unexpected token: " + JSON.stringify(token));
        }
        while (i < tokens.length && tokens[i].type === TokenType.Punctuation &&
            tokens[i].value === "(") {
            i++;
            const args = [];
            while (i < tokens.length &&
                !(tokens[i].type === TokenType.Punctuation && tokens[i].value === ")")) {
                let arg;
                [arg, i] = this.parseExpression(tokens, i);
                args.push(arg);
                if (i < tokens.length && tokens[i].type === TokenType.Punctuation &&
                    tokens[i].value === ",") {
                    i++;
                }
            }
            if (i >= tokens.length || tokens[i].type !== TokenType.Punctuation ||
                tokens[i].value !== ")") {
                throw new Error("Expected ')' after call arguments");
            }
            i++;
            expr = { type: "call", callee: expr, args };
        }
        return [expr, i];
    }
    parse(tokens) {
        const ast = [];
        let i = 0;
        while (i < tokens.length) {
            if (tokens[i].type === TokenType.Newline) {
                i++;
                continue;
            }
            let expr;
            [expr, i] = this.parseExpression(tokens, i);
            ast.push(expr);
        }
        return ast;
    }
}
export default new Parser();
//# sourceMappingURL=Parser.js.map