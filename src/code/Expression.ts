interface VarExpression {
  type: "VarExpression";
  name: string;
  init: Expression;
}

type Expression = VarExpression;

export default Expression;
