import Expression from "./Expression.js";
import Token from "./Token.js";
export default class Parser {
    private tokens;
    private pos;
    constructor(tokens: Token[]);
    parse(): Expression[];
    private parseStatement;
    private parseVarDeclaration;
    private parseFunctionDeclaration;
    private parseIfStatement;
    private parseWhileStatement;
    private parseExpression;
    private parseUnary;
    private parsePrimary;
    private parsePostfix;
    private peek;
    private advance;
    private match;
    private check;
    private consume;
    private skipNewlines;
    private getPrecedence;
    private isRightAssociative;
    private isAtEnd;
}
//# sourceMappingURL=Parser.d.ts.map