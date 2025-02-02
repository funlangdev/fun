import Expression, {
  FunctionDeclaration,
  IfExpression,
  VarDeclaration,
  WhileExpression,
} from "./Expression.js";
import Token from "./Token.js";
import TokenType from "./TokenType.js";

const PRECEDENCES: { [op: string]: number } = {
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

export default class Parser {
  private pos: number = 0;
  constructor(private tokens: Token[]) {}

  public parse(): Expression[] {
    const ast: Expression[] = [];
    while (!this.isAtEnd()) {
      this.skipNewlines();
      if (this.isAtEnd()) break;
      ast.push(this.parseStatement());
    }
    return ast;
  }

  private parseStatement(): Expression {
    if (this.check(TokenType.Keyword, "var")) {
      return this.parseVarDeclaration();
    }
    if (this.check(TokenType.Keyword, "function")) {
      return this.parseFunctionDeclaration();
    }
    if (this.check(TokenType.Keyword, "if")) {
      return this.parseIfStatement();
    }
    if (this.check(TokenType.Keyword, "while")) {
      return this.parseWhileStatement();
    }
    if (this.check(TokenType.Keyword, "return")) {
      return this.parseReturnStatement();
    }
    return this.parseExpression();
  }

  private parseVarDeclaration(): VarDeclaration {
    this.consume(TokenType.Keyword, "var");
    const nameToken = this.consume(TokenType.Identifier);
    const varName = nameToken.value!;
    this.consume(TokenType.Operator, "=");
    const init = this.parseExpression();
    return { type: "var", name: varName, init };
  }

  private parseFunctionDeclaration(): FunctionDeclaration {
    this.consume(TokenType.Keyword, "function");
    const nameToken = this.consume(TokenType.Identifier);
    const funcName = nameToken.value!;
    this.consume(TokenType.Punctuation, "(");
    const params: string[] = [];
    if (!this.check(TokenType.Punctuation, ")")) {
      do {
        const paramToken = this.consume(TokenType.Identifier);
        params.push(paramToken.value!);
      } while (this.match(TokenType.Punctuation, ","));
    }
    this.consume(TokenType.Punctuation, ")");
    this.consume(TokenType.Punctuation, "{");
    const body: Expression[] = [];
    while (!this.check(TokenType.Punctuation, "}")) {
      this.skipNewlines();
      body.push(this.parseStatement());
    }
    this.consume(TokenType.Punctuation, "}");
    return { type: "function", name: funcName, params, body };
  }

  private parseIfStatement(): IfExpression {
    this.consume(TokenType.Keyword, "if");
    this.consume(TokenType.Punctuation, "(");
    const test = this.parseExpression();
    this.consume(TokenType.Punctuation, ")");
    this.consume(TokenType.Punctuation, "{");
    const thenBlock: Expression[] = [];
    while (!this.check(TokenType.Punctuation, "}")) {
      this.skipNewlines();
      thenBlock.push(this.parseStatement());
    }
    this.consume(TokenType.Punctuation, "}");
    let elseBlock: Expression[] | undefined;
    if (this.match(TokenType.Keyword, "else")) {
      this.consume(TokenType.Punctuation, "{");
      elseBlock = [];
      while (!this.check(TokenType.Punctuation, "}")) {
        this.skipNewlines();
        elseBlock.push(this.parseStatement());
      }
      this.consume(TokenType.Punctuation, "}");
    }
    return { type: "if", test, then: thenBlock, else: elseBlock };
  }

  private parseWhileStatement(): WhileExpression {
    this.consume(TokenType.Keyword, "while");
    this.consume(TokenType.Punctuation, "(");
    const test = this.parseExpression();
    this.consume(TokenType.Punctuation, ")");
    this.consume(TokenType.Punctuation, "{");
    const body: Expression[] = [];
    while (!this.check(TokenType.Punctuation, "}")) {
      this.skipNewlines();
      body.push(this.parseStatement());
    }
    this.consume(TokenType.Punctuation, "}");
    return { type: "while", test, body };
  }

  private parseReturnStatement(): Expression {
    this.consume(TokenType.Keyword, "return");
    let argument: Expression | undefined;
    if (!this.check(TokenType.Newline) && !this.isAtEnd()) {
      argument = this.parseExpression();
    }
    return { type: "return", argument };
  }

  private parseExpression(precedence: number = 0): Expression {
    this.skipNewlines();
    let left = this.parseUnary();

    while (true) {
      this.skipNewlines();
      const token = this.peek();
      if (!token || token.type !== TokenType.Operator) break;
      const opPrecedence = this.getPrecedence(token);
      if (opPrecedence < precedence) break;
      const opToken = this.advance();
      const nextPrecedence = this.isRightAssociative(opToken.value!)
        ? opPrecedence
        : opPrecedence + 1;
      const right = this.parseExpression(nextPrecedence);
      left = { type: "binary", operator: opToken.value!, left, right };
    }
    return left;
  }

  private parseUnary(): Expression {
    this.skipNewlines();
    const token = this.peek();
    if (
      token &&
      token.type === TokenType.Operator &&
      (token.value === "!" ||
        token.value === "+" ||
        token.value === "-" ||
        token.value === "++" ||
        token.value === "--")
    ) {
      const opToken = this.advance();
      const operand = this.parseUnary();
      return { type: "unary", operator: opToken.value!, operand };
    }
    return this.parsePrimary();
  }

  private parsePrimary(): Expression {
    this.skipNewlines();
    const token = this.advance();
    if (!token) {
      throw new Error("Unexpected end of input in primary expression");
    }
    if (token.type === TokenType.Comment) {
      return this.parsePostfix({ type: "comment", text: token.value! });
    }
    if (token.type === TokenType.Number) {
      return this.parsePostfix({ type: "number", value: token.value! });
    }
    if (token.type === TokenType.String) {
      return this.parsePostfix({ type: "string", value: token.value! });
    }
    if (token.type === TokenType.Identifier) {
      if (token.value === "true") {
        return this.parsePostfix({ type: "boolean", value: true });
      }
      if (token.value === "false") {
        return this.parsePostfix({ type: "boolean", value: false });
      }
      return this.parsePostfix({ type: "identifier", name: token.value! });
    }
    if (token.type === TokenType.Punctuation && token.value === "(") {
      const expr = this.parseExpression();
      this.consume(TokenType.Punctuation, ")");
      return this.parsePostfix(expr);
    }
    throw new Error(
      "Unexpected token in primary expression: " + JSON.stringify(token),
    );
  }

  private parsePostfix(expr: Expression): Expression {
    while (true) {
      if (
        this.check(TokenType.Operator, "++") ||
        this.check(TokenType.Operator, "--")
      ) {
        const opToken = this.advance();
        expr = { type: "postfix", operator: opToken.value!, operand: expr };
        continue;
      }

      if (this.check(TokenType.Punctuation, "(")) {
        this.advance();
        const args: Expression[] = [];
        if (!this.check(TokenType.Punctuation, ")")) {
          do {
            args.push(this.parseExpression());
          } while (this.match(TokenType.Punctuation, ","));
        }
        this.consume(TokenType.Punctuation, ")");
        expr = { type: "call", callee: expr, args };
        continue;
      }
      break;
    }
    return expr;
  }

  private peek(): Token | undefined {
    return this.tokens[this.pos];
  }

  private advance(): Token {
    return this.tokens[this.pos++];
  }

  private match(type: string, value?: string): boolean {
    if (this.check(type, value)) {
      this.advance();
      return true;
    }
    return false;
  }

  private check(type: string, value?: string): boolean {
    const token = this.peek();
    if (!token) return false;
    if (token.type !== type) return false;
    if (value !== undefined && token.value !== value) return false;
    return true;
  }

  private consume(type: string, value?: string): Token {
    if (this.check(type, value)) {
      return this.advance();
    }
    throw new Error(
      `Expected token ${type} ${value ? value : ""} but got ${
        JSON.stringify(this.peek())
      }`,
    );
  }

  private skipNewlines(): void {
    while (this.check(TokenType.Newline)) {
      this.advance();
    }
  }

  private getPrecedence(token: Token): number {
    return PRECEDENCES[token.value!] || 0;
  }

  private isRightAssociative(op: string): boolean {
    return op === "=";
  }

  private isAtEnd(): boolean {
    return this.pos >= this.tokens.length;
  }
}
