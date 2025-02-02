import Expression from "../lang/Expression.js";
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
}
declare const _default: Compiler;
export default _default;
//# sourceMappingURL=Compiler.d.ts.map