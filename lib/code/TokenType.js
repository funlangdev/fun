var TokenType;
(function (TokenType) {
    TokenType[TokenType["Newline"] = 0] = "Newline";
    TokenType[TokenType["Comment"] = 1] = "Comment";
    TokenType[TokenType["Number"] = 2] = "Number";
    TokenType[TokenType["String"] = 3] = "String";
    TokenType[TokenType["Keyword"] = 4] = "Keyword";
    TokenType[TokenType["Identifier"] = 5] = "Identifier";
    TokenType[TokenType["Operator"] = 6] = "Operator";
    TokenType[TokenType["Punctuation"] = 7] = "Punctuation";
})(TokenType || (TokenType = {}));
export default TokenType;
//# sourceMappingURL=TokenType.js.map