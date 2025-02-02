class JSTargetCompiler {
    compile(ast) {
        return this.compileBlock(ast);
    }
    compileBlock(ast) {
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
    compileNode(node) {
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
    compileVarDeclaration(node) {
        return "var " + node.name + " = " + this.compileExpression(node.init) + ";";
    }
    compileFunctionDeclaration(node) {
        const params = node.params.join(", ");
        const body = this.compileBlock(node.body);
        return ("function " +
            node.name +
            "(" +
            params +
            ") {\n" +
            this.indent(body) +
            "\n}\n");
    }
    compileIfExpression(node) {
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
    compileWhileExpression(node) {
        let code = "while (" + this.compileExpression(node.test) + ") {\n";
        code += this.indent(this.compileBlock(node.body));
        code += "\n}";
        return code + "\n";
    }
    compileReturnExpression(node) {
        let arg = "";
        if (node.argument !== null && node.argument !== undefined) {
            arg = " " + this.compileExpression(node.argument);
        }
        return "return" + arg + ";";
    }
    compileExpression(node) {
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
                return (this.compileExpression(node.left) +
                    " " +
                    node.operator +
                    " " +
                    this.compileExpression(node.right));
            case "unary":
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
                return "// " + node.text;
            default:
                throw new Error("Unknown expression type: " + node.type);
        }
    }
    indent(code) {
        return code
            .split("\n")
            .map((line) => "  " + line)
            .join("\n");
    }
}
export default new JSTargetCompiler();
//# sourceMappingURL=JSTargetCompiler.js.map