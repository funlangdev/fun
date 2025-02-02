export interface BooleanLiteral {
    type: "boolean";
    value: boolean;
}
export interface NumberLiteral {
    type: "number";
    value: string;
}
export interface StringLiteral {
    type: "string";
    value: string;
}
export interface Identifier {
    type: "identifier";
    name: string;
}
export interface BinaryExpression {
    type: "binary";
    operator: string;
    left: Expression;
    right: Expression;
}
export interface UnaryExpression {
    type: "unary";
    operator: string;
    operand: Expression;
}
export interface PostfixExpression {
    type: "postfix";
    operator: string;
    operand: Expression;
}
export interface CallExpression {
    type: "call";
    callee: Expression;
    args: Expression[];
}
export interface VarDeclaration {
    type: "var";
    name: string;
    init: Expression;
}
export interface FunctionDeclaration {
    type: "function";
    name: string;
    params: string[];
    body: Expression[];
}
export interface ReturnExpression {
    type: "return";
    argument?: Expression;
}
export interface IfExpression {
    type: "if";
    test: Expression;
    then: Expression[];
    else?: Expression[];
}
export interface WhileExpression {
    type: "while";
    test: Expression;
    body: Expression[];
}
export interface MemberExpression {
    type: "member";
    object: Expression;
    property: Expression;
}
export interface Comment {
    type: "comment";
    text: string;
}
type Expression = BooleanLiteral | NumberLiteral | StringLiteral | Identifier | BinaryExpression | UnaryExpression | PostfixExpression | CallExpression | VarDeclaration | FunctionDeclaration | ReturnExpression | IfExpression | WhileExpression | MemberExpression | Comment;
export default Expression;
//# sourceMappingURL=Expression.d.ts.map