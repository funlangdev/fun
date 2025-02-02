import Expression from "../code/Expression.js";
declare class JSTargetCompiler {
    compile(ast: Expression[]): string;
    private compileNode;
    private compileVarDeclaration;
    private compileFunctionDeclaration;
    private compileIfExpression;
    private compileWhileExpression;
    private compileReturnExpression;
    private compileExpression;
    private indent;
}
declare const _default: JSTargetCompiler;
export default _default;
//# sourceMappingURL=JSTargetCompiler.d.ts.map