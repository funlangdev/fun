import Expression from "./Expression.js";
declare class Compiler {
    compile(ast: Expression[]): string;
    private compileBlock;
    private compileNode;
    private compileVarDeclaration;
    private compileFunctionDeclaration;
    private compileIfExpression;
    private compileWhileExpression;
    private compileReturnExpression;
    private compileExpression;
    private indent;
    private getPrecedence;
}
declare const _default: Compiler;
export default _default;
//# sourceMappingURL=Compiler.d.ts.map