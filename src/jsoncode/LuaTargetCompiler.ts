import Expression, {
  Comment,
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

class LuaTargetCompiler {
  public compile(ast: Expression[]): string {
    return this.compileBlock(ast);
  }

  private compileBlock(ast: Expression[]): string {
    let code = "";
    for (const node of ast) {
      code += this.compileNode(node) + "\n";
    }
    return code.trim();
  }

  private compileNode(node: Expression): string {
    switch (node.type) {
      case "var":
        return this.compileVarDeclaration(node);
      case "function":
        return this.compileFunctionDeclaration(node);
      case "if":
        return this.compileIfExpression(node);
      case "while":
        return this.compileWhileExpression(node);
      case "return":
        return this.compileReturnExpression(node);
      case "comment":
        return this.compileComment(node);
      default:
        return this.compileExpression(node);
    }
  }

  private compileVarDeclaration(node: VarDeclaration): string {
    return "local " + node.name + " = " + this.compileExpression(node.init);
  }

  private compileFunctionDeclaration(node: FunctionDeclaration): string {
    const params = node.params.join(", ");
    const body = this.compileBlock(node.body);
    return (
      "function " + node.name + "(" + params + ")\n" +
      this.indent(body) + "\nend"
    );
  }

  private compileIfExpression(node: IfExpression): string {
    let code = "if " + this.compileExpression(node.test) + " then\n";
    code += this.indent(this.compileBlock(node.then));
    if (node.else) {
      code += "\nelse\n" + this.indent(this.compileBlock(node.else));
    }
    code += "\nend";
    return code;
  }

  private compileWhileExpression(node: WhileExpression): string {
    let code = "while " + this.compileExpression(node.test) + " do\n";
    code += this.indent(this.compileBlock(node.body));
    code += "\nend";
    return code;
  }

  private compileReturnExpression(node: Expression): string {
    let arg = "";
    if (
      (node as any).argument !== undefined && (node as any).argument !== null
    ) {
      arg = " " + this.compileExpression((node as any).argument);
    }
    return "return" + arg;
  }

  private compileComment(node: Expression): string {
    return "-- " + (node as Comment).text;
  }

  private compileExpression(
    node: Expression,
    parentPrecedence: number = 0,
  ): string {
    switch (node.type) {
      case "number":
        return node.value;
      case "string":
        return JSON.stringify(node.value);
      case "boolean":
        return node.value ? "true" : "false";
      case "identifier":
        return node.name;
      case "binary": {
        const precedence = this.getPrecedence(node.operator);
        const left = this.compileExpression(node.left, precedence);
        const right = this.compileExpression(node.right, precedence + 1);
        const op = this.getLuaOperator(node.operator);
        let expression = `${left} ${op} ${right}`;
        if (precedence < parentPrecedence) {
          expression = `(${expression})`;
        }
        return expression;
      }
      case "unary":
        if (node.operator === "!") {
          return "not " + this.compileExpression(node.operand);
        }
        return node.operator + this.compileExpression(node.operand);
      case "postfix":
        return this.compileExpression(node.operand) + node.operator;
      case "call":
        return (
          this.compileExpression(node.callee) +
          "(" +
          node.args.map((arg) => this.compileExpression(arg)).join(", ") +
          ")"
        );
      case "member":
        return this.compileExpression(node.object) + "." +
          this.compileExpression(node.property);
      case "comment":
        return "-- " + (node as Comment).text;
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

  private getLuaOperator(operator: string): string {
    switch (operator) {
      case "&&":
        return "and";
      case "||":
        return "or";
      case "!=":
        return "~=";
      default:
        return operator;
    }
  }
}

export default new LuaTargetCompiler();
