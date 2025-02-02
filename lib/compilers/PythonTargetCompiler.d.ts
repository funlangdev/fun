import Expression from "../funlang/Expression.js";
declare class PythonTargetCompiler {
    compile(ast: Expression[]): string;
    private compileBlock;
    private compileNode;
    private compileVarDeclaration;
    private compileFunctionDeclaration;
    private compileIfExpression;
    private compileWhileExpression;
    private compileReturnExpression;
    private compileComment;
    private compileExpression;
    private indent;
    private getPrecedence;
    private getPythonOperator;
}
declare const _default: PythonTargetCompiler;
export default _default;
//# sourceMappingURL=PythonTargetCompiler.d.ts.map