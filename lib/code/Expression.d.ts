interface BooleanLiteral {
    type: "boolean";
    value: boolean;
}
interface NumberLiteral {
    type: "number";
    value: string;
}
interface StringLiteral {
    type: "string";
    value: string;
}
interface VarExpression {
    type: "var";
    name: string;
    init: Expression;
}
interface FunctionExpression {
    type: "function";
    name: string;
    params: string[];
    body: Expression[];
}
interface CallExpression {
    type: "call";
    callee: Expression;
    args: Expression[];
}
interface IfExpression {
    type: "if";
    test: Expression;
    then: Expression[];
    else?: Expression[];
}
interface WhileExpression {
    type: "while";
    test: Expression;
    body: Expression[];
}
interface CommentExpression {
    type: "comment";
    text: string;
}
interface BinaryExpression {
    type: "binary";
    operator: string;
    left: Expression;
    right: Expression;
}
interface UnaryExpression {
    type: "unary";
    operator: string;
    argument: Expression;
}
type Expression = BooleanLiteral | NumberLiteral | StringLiteral | VarExpression | FunctionExpression | CallExpression | IfExpression | WhileExpression | CommentExpression | BinaryExpression | UnaryExpression;
export default Expression;
//# sourceMappingURL=Expression.d.ts.map