import Expression from "./Expression.js";
import Token from "./Token.js";
import TokenType from "./TokenType.js";

const PRECEDENCES: { [key: string]: number } = {
  "=": 1,
  "||": 2,
  "&&": 3,
  "==": 4,
  "!=": 4,
  "<": 5,
  ">": 5,
  "<=": 5,
  ">=": 5,
  "+": 6,
  "-": 6,
  "*": 7,
  "/": 7,
  "%": 7,
};

class Parser {
  private parseExpression(tokens: Token[], i: number, precedence: number = 0): [Expression, number] {
    while (
      i < tokens.length &&
      (tokens[i].type === TokenType.Newline || tokens[i].type === TokenType.Comment)
    )
      i++;
    if (i >= tokens.length) throw new Error("Unexpected end of input");

    let left: Expression;
    const token = tokens[i];

    if (
      token.type === TokenType.Operator &&
      (token.value === "!" || token.value === "-" || token.value === "+")
    ) {
      const op = token.value!;
      i++;
      let argument: Expression;
      [argument, i] = this.parseExpression(tokens, i, 8);
      left = { type: "unary", operator: op, argument };
    } else if (token.type === TokenType.Keyword) {
      if (token.value === "var") {
        i++;
        if (i >= tokens.length || tokens[i].type !== TokenType.Identifier)
          throw new Error("Expected identifier after 'var'");
        const varName = tokens[i].value!;
        i++;
        if (
          i >= tokens.length ||
          tokens[i].type !== TokenType.Operator ||
          tokens[i].value !== "="
        )
          throw new Error("Expected '=' after variable name");
        i++;
        let initExpr: Expression;
        [initExpr, i] = this.parseExpression(tokens, i, 0);
        left = { type: "var", name: varName, init: initExpr };
      } else if (token.value === "function") {
        i++;
        if (i >= tokens.length || tokens[i].type !== TokenType.Identifier)
          throw new Error("Expected identifier after 'function'");
        const funcName = tokens[i].value!;
        i++;
        if (
          i >= tokens.length ||
          tokens[i].type !== TokenType.Punctuation ||
          tokens[i].value !== "("
        )
          throw new Error("Expected '(' after function name");
        i++;
        const params: string[] = [];
        while (
          i < tokens.length &&
          !(tokens[i].type === TokenType.Punctuation && tokens[i].value === ")")
        ) {
          if (tokens[i].type === TokenType.Identifier) {
            params.push(tokens[i].value!);
            i++;
            if (
              i < tokens.length &&
              tokens[i].type === TokenType.Punctuation &&
              tokens[i].value === ","
            )
              i++;
          } else {
            throw new Error("Expected identifier in function parameters");
          }
        }
        if (
          i >= tokens.length ||
          tokens[i].type !== TokenType.Punctuation ||
          tokens[i].value !== ")"
        )
          throw new Error("Expected ')' after function parameters");
        i++;
        if (
          i >= tokens.length ||
          tokens[i].type !== TokenType.Punctuation ||
          tokens[i].value !== "{"
        )
          throw new Error("Expected '{' to start function body");
        i++;
        const body: Expression[] = [];
        while (
          i < tokens.length &&
          !(tokens[i].type === TokenType.Punctuation && tokens[i].value === "}")
        ) {
          let stmt: Expression;
          [stmt, i] = this.parseExpression(tokens, i, 0);
          body.push(stmt);
        }
        if (
          i >= tokens.length ||
          tokens[i].type !== TokenType.Punctuation ||
          tokens[i].value !== "}"
        )
          throw new Error("Expected '}' at end of function body");
        i++;
        left = { type: "function", name: funcName, params, body };
      } else if (token.value === "if") {
        i++;
        if (
          i >= tokens.length ||
          tokens[i].type !== TokenType.Punctuation ||
          tokens[i].value !== "("
        )
          throw new Error("Expected '(' after 'if'");
        i++;
        let testExpr: Expression;
        [testExpr, i] = this.parseExpression(tokens, i, 0);
        if (
          i >= tokens.length ||
          tokens[i].type !== TokenType.Punctuation ||
          tokens[i].value !== ")"
        )
          throw new Error("Expected ')' after if test expression");
        i++;
        if (
          i >= tokens.length ||
          tokens[i].type !== TokenType.Punctuation ||
          tokens[i].value !== "{"
        )
          throw new Error("Expected '{' to start if then block");
        i++;
        const thenBlock: Expression[] = [];
        while (
          i < tokens.length &&
          !(tokens[i].type === TokenType.Punctuation && tokens[i].value === "}")
        ) {
          let stmt: Expression;
          [stmt, i] = this.parseExpression(tokens, i, 0);
          thenBlock.push(stmt);
        }
        if (
          i >= tokens.length ||
          tokens[i].type !== TokenType.Punctuation ||
          tokens[i].value !== "}"
        )
          throw new Error("Expected '}' after if then block");
        i++;
        let elseBlock: Expression[] | undefined;
        if (
          i < tokens.length &&
          tokens[i].type === TokenType.Keyword &&
          tokens[i].value === "else"
        ) {
          i++;
          if (
            i >= tokens.length ||
            tokens[i].type !== TokenType.Punctuation ||
            tokens[i].value !== "{"
          )
            throw new Error("Expected '{' to start else block");
          i++;
          elseBlock = [];
          while (
            i < tokens.length &&
            !(tokens[i].type === TokenType.Punctuation &&
              tokens[i].value === "}")
          ) {
            let stmt: Expression;
            [stmt, i] = this.parseExpression(tokens, i, 0);
            elseBlock.push(stmt);
          }
          if (
            i >= tokens.length ||
            tokens[i].type !== TokenType.Punctuation ||
            tokens[i].value !== "}"
          )
            throw new Error("Expected '}' after else block");
          i++;
        }
        left = { type: "if", test: testExpr, then: thenBlock, else: elseBlock };
      } else if (token.value === "while") {
        i++;
        if (
          i >= tokens.length ||
          tokens[i].type !== TokenType.Punctuation ||
          tokens[i].value !== "("
        )
          throw new Error("Expected '(' after 'while'");
        i++;
        let testExpr: Expression;
        [testExpr, i] = this.parseExpression(tokens, i, 0);
        if (
          i >= tokens.length ||
          tokens[i].type !== TokenType.Punctuation ||
          tokens[i].value !== ")"
        )
          throw new Error("Expected ')' after while test expression");
        i++;
        if (
          i >= tokens.length ||
          tokens[i].type !== TokenType.Punctuation ||
          tokens[i].value !== "{"
        )
          throw new Error("Expected '{' to start while body");
        i++;
        const body: Expression[] = [];
        while (
          i < tokens.length &&
          !(tokens[i].type === TokenType.Punctuation && tokens[i].value === "}")
        ) {
          let stmt: Expression;
          [stmt, i] = this.parseExpression(tokens, i, 0);
          body.push(stmt);
        }
        if (
          i >= tokens.length ||
          tokens[i].type !== TokenType.Punctuation ||
          tokens[i].value !== "}"
        )
          throw new Error("Expected '}' after while body");
        i++;
        left = { type: "while", test: testExpr, body };
      } else {
        throw new Error("Unexpected keyword: " + token.value);
      }
    } else if (token.type === TokenType.Number) {
      left = { type: "number", value: token.value! };
      i++;
    } else if (token.type === TokenType.String) {
      left = { type: "string", value: token.value! };
      i++;
    } else if (token.type === TokenType.Identifier) {
      if (token.value === "true") {
        left = { type: "boolean", value: true };
      } else if (token.value === "false") {
        left = { type: "boolean", value: false };
      } else {
        left = { type: "identifier", name: token.value! } as any;
      }
      i++;
    } else if (token.type === TokenType.Punctuation && token.value === "(") {
      i++;
      [left, i] = this.parseExpression(tokens, i, 0);
      if (
        i >= tokens.length ||
        tokens[i].type !== TokenType.Punctuation ||
        tokens[i].value !== ")"
      )
        throw new Error("Expected ')' after grouped expression");
      i++;
    } else {
      throw new Error("Unexpected token: " + JSON.stringify(token));
    }

    while (
      i < tokens.length &&
      tokens[i].type === TokenType.Punctuation &&
      tokens[i].value === "("
    ) {
      i++;
      const args: Expression[] = [];
      while (
        i < tokens.length &&
        !(tokens[i].type === TokenType.Punctuation && tokens[i].value === ")")
      ) {
        let arg: Expression;
        [arg, i] = this.parseExpression(tokens, i, 0);
        args.push(arg);
        if (
          i < tokens.length &&
          tokens[i].type === TokenType.Punctuation &&
          tokens[i].value === ","
        )
          i++;
      }
      if (
        i >= tokens.length ||
        tokens[i].type !== TokenType.Punctuation ||
        tokens[i].value !== ")"
      )
        throw new Error("Expected ')' after call arguments");
      i++;
      left = { type: "call", callee: left, args };
    }

    while (i < tokens.length && tokens[i].type === TokenType.Operator) {
      const op = tokens[i].value!;
      const opPrecedence = PRECEDENCES[op] || 0;
      if (opPrecedence < precedence) break;
      i++;
      let right: Expression;
      [right, i] = this.parseExpression(tokens, i, opPrecedence + 1);
      left = { type: "binary", operator: op, left, right };
    }

    return [left, i];
  }

  public parse(tokens: Token[]): Expression[] {
    const ast: Expression[] = [];
    let i = 0;
    while (i < tokens.length) {
      if (
        tokens[i].type === TokenType.Newline ||
        tokens[i].type === TokenType.Comment
      ) {
        i++;
        continue;
      }
      if (
        tokens[i].type === TokenType.Punctuation &&
        tokens[i].value === "}"
      ) {
        i++;
        continue;
      }
      let expr: Expression;
      [expr, i] = this.parseExpression(tokens, i, 0);
      ast.push(expr);
    }
    return ast;
  }
}

export default new Parser();
