const PRECEDENCES = {
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
class PythonTargetCompiler {
    compile(ast) {
        return this.compileBlock(ast);
    }
    compileBlock(ast) {
        let code = "";
        for (const node of ast) {
            code += this.compileNode(node) + "\n";
        }
        return code.trim();
    }
    compileNode(node) {
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
    compileVarDeclaration(node) {
        return node.name + " = " + this.compileExpression(node.init);
    }
    compileFunctionDeclaration(node) {
        const params = node.params.join(", ");
        const header = "def " + node.name + "(" + params + "):";
        const body = this.compileBlock(node.body);
        return header + "\n" + this.indent(body);
    }
    compileIfExpression(node) {
        let code = "if " + this.compileExpression(node.test) + ":";
        code += "\n" + this.indent(this.compileBlock(node.then));
        if (node.else) {
            code += "\nelse:\n" + this.indent(this.compileBlock(node.else));
        }
        return code;
    }
    compileWhileExpression(node) {
        let code = "while " + this.compileExpression(node.test) + ":";
        code += "\n" + this.indent(this.compileBlock(node.body));
        return code;
    }
    compileReturnExpression(node) {
        let arg = "";
        if (node.argument !== undefined && node.argument !== null) {
            arg = " " + this.compileExpression(node.argument);
        }
        return "return" + arg;
    }
    compileComment(node) {
        return "# " + node.text;
    }
    compileExpression(node, parentPrecedence = 0) {
        switch (node.type) {
            case "number":
                return node.value;
            case "string":
                return JSON.stringify(node.value);
            case "boolean":
                return node.value ? "True" : "False";
            case "identifier":
                return node.name;
            case "binary": {
                const precedence = this.getPrecedence(node.operator);
                const left = this.compileExpression(node.left, precedence);
                const right = this.compileExpression(node.right, precedence + 1);
                const op = this.getPythonOperator(node.operator);
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
                return (this.compileExpression(node.callee) +
                    "(" +
                    node.args.map((arg) => this.compileExpression(arg)).join(", ") +
                    ")");
            case "member":
                return this.compileExpression(node.object) + "." +
                    this.compileExpression(node.property);
            case "comment":
                return "# " + node.text;
            default:
                throw new Error("Unknown expression type: " + node.type);
        }
    }
    indent(code) {
        return code
            .split("\n")
            .map((line) => "    " + line)
            .join("\n");
    }
    getPrecedence(operator) {
        return PRECEDENCES[operator] || 0;
    }
    getPythonOperator(operator) {
        switch (operator) {
            case "&&":
                return "and";
            case "||":
                return "or";
            default:
                return operator;
        }
    }
}
export default new PythonTargetCompiler();
//# sourceMappingURL=PythonTargetCompiler.js.map