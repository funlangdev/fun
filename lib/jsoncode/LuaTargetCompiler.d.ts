import Expression from "../lang/Expression.js";
declare class LuaTargetCompiler {
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
    private getLuaOperator;
}
declare const _default: LuaTargetCompiler;
export default _default;
//# sourceMappingURL=LuaTargetCompiler.d.ts.map