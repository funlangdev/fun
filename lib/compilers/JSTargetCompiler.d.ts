import Expression from "../funlang/Expression.js";
declare class JSTargetCompiler {
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
declare const _default: JSTargetCompiler;
export default _default;
//# sourceMappingURL=JSTargetCompiler.d.ts.map