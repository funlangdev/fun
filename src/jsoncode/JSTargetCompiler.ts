import Expression, {
  FunctionDeclaration,
  IfExpression,
  VarDeclaration,
  WhileExpression,
} from "../lang/Expression.js";

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

class JSTargetCompiler {
  public compile(ast: Expression[]): string {
    return this.compileBlock(ast);
  }

  private compileBlock(ast: Expression[]): string {
    let code = "";
    let prevType = "";

    for (const node of ast) {
      if (prevType === "var" && node.type === "var") {
        code = code.trim();
      }
      prevType = node.type;
      code += this.compileNode(node) + "\n";
    }

    return code.trim().replace(/\n\n+/g, "\n\n");
  }

  private compileNode(node: Expression): string {
    switch (node.type) {
      case "var":
        return "\n" + this.compileVarDeclaration(node) + "\n";
      case "function":
        return this.compileFunctionDeclaration(node);
      case "if":
        return this.compileIfExpression(node);
      case "while":
        return this.compileWhileExpression(node);
      case "return":
        return this.compileReturnExpression(node);
      case "comment":
        return "\n" + this.compileExpression(node);
      default:
        return this.compileExpression(node) + ";";
    }
  }

  private compileVarDeclaration(node: VarDeclaration): string {
    return "var " + node.name + " = " + this.compileExpression(node.init) + ";";
  }

  private compileFunctionDeclaration(node: FunctionDeclaration): string {
    const params = node.params.join(", ");
    const body = this.compileBlock(node.body);
    return (
      "function " +
      node.name +
      "(" +
      params +
      ") {\n" +
      this.indent(body) +
      "\n}\n"
    );
  }

  private compileIfExpression(node: IfExpression): string {
    let code = "if (" + this.compileExpression(node.test) + ") {\n";
    code += this.indent(this.compileBlock(node.then));
    code += "\n}";
    if (node.else) {
      code += " else {\n";
      code += this.indent(this.compileBlock(node.else));
      code += "\n}";
    }
    return code + "\n";
  }

  private compileWhileExpression(node: WhileExpression): string {
    let code = "while (" + this.compileExpression(node.test) + ") {\n";
    code += this.indent(this.compileBlock(node.body));
    code += "\n}";
    return code + "\n";
  }

  private compileReturnExpression(node: Expression): string {
    let arg = "";
    if (
      (node as any).argument !== null && (node as any).argument !== undefined
    ) {
      arg = " " + this.compileExpression((node as any).argument);
    }
    return "return" + arg + ";";
  }

  private compileExpression(node: Expression, parentPrecedence = 0): string {
    switch (node.type) {
      case "number":
        return node.value;
      case "string":
        return JSON.stringify(node.value);
      case "boolean":
        return node.value ? "true" : "false";
      case "identifier":
        return node.name;
      case "binary":
        const precedence = this.getPrecedence(node.operator);
        const left = this.compileExpression(node.left, precedence);
        const right = this.compileExpression(
          node.right,
          precedence + 1,
        );
        let expression = `${left} ${node.operator} ${right}`;
        if (precedence < parentPrecedence) {
          expression = `(${expression})`;
        }
        return expression;
      case "unary":
        return node.operator + this.compileExpression(node.operand);
      case "postfix":
        return this.compileExpression(node.operand) + node.operator;
      case "call":
        return (
          this.compileExpression(node.callee) +
          "(" +
          node.args.map((arg: Expression) => this.compileExpression(arg)).join(
            ", ",
          ) +
          ")"
        );
      case "member":
        return this.compileExpression(node.object) + "." +
          this.compileExpression(node.property);
      case "comment":
        return "// " + node.text;
      default:
        throw new Error("Unknown expression type: " + node.type);
    }
  }

  private indent(code: string): string {
    return code
      .split("\n")
      .map((line) => "  " + line)
      .join("\n");
  }

  private getPrecedence(operator: string): number {
    return PRECEDENCES[operator] || 0;
  }
}

export default new JSTargetCompiler();
