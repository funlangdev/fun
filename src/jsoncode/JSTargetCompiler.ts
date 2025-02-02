import Expression, {
  FunctionDeclaration,
  IfExpression,
  VarDeclaration,
  WhileExpression,
} from "../code/Expression.js";

class JSTargetCompiler {
  public compile(ast: Expression[]): string {
    return ast.map((node) => this.compileNode(node)).join("\n");
  }

  private compileNode(node: Expression): string {
    switch (node.type) {
      case "var":
        return this.compileVarDeclaration(node) + "\n";
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
    const body = node.body.map((stmt) => this.compileNode(stmt)).join("\n");
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
    code += this.indent(
      node.then.map((stmt) => this.compileNode(stmt)).join("\n"),
    );
    code += "\n}";
    if (node.else) {
      code += " else {\n";
      code += this.indent(
        node.else.map((stmt) => this.compileNode(stmt)).join("\n"),
      );
      code += "\n}";
    }
    return code + "\n";
  }

  private compileWhileExpression(node: WhileExpression): string {
    let code = "while (" + this.compileExpression(node.test) + ") {\n";
    code += this.indent(
      node.body.map((stmt) => this.compileNode(stmt)).join("\n"),
    );
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

  private compileExpression(node: Expression): string {
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
        return (
          this.compileExpression(node.left) +
          " " +
          node.operator +
          " " +
          this.compileExpression(node.right)
        );
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
}

export default new JSTargetCompiler();
