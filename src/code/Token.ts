import TokenType from "./TokenType.ts";

interface Token {
  type: TokenType;
  value: string;
}

export default Token;
