function complianceObj(){
    this.mSetArray = [];
    this.mSetExprArray = [];
    this.mPosFilterArray = [];
    this.mPosFilterExprArray = [];

    this.createSetObj = function(pName){
        if (pName !== "") {
            this.mSetArray.push(new SetObj(pName));
        }
    };

    this.createPositionFilter = function(pName)
    {
        if (pName !== "")
        {
            this.mPosFilterArray.push(new PosFilterObj(pName));
        }
    };

    this.insertExpr = function(pExprName, pSetName, pType, pAdditionalParams)
    {
        if (this.findExpr(pExprName) === -1) {
            this.mSetExprArray.push(new SetExpr(pExprName, pSetName, pType, pAdditionalParams));
        }
    };

    this.findExpr = function(exprName)
    {
        var l_found= -1;
      for (i =0; i <this.mSetExprArray.length ; i++)
      {
          if (this.mSetExprArray[i].name === exprName)
          {
              l_found = i;
          }
      }
      return l_found;
    };

    this.assignExprToSet = function(setIndex, exprName)
    {
        l_index = this.findExpr(exprName);
        if( l_index !== -1)
        {
            this.mSetArray[setIndex].expressions.push(l_index);
        }
    };
}
function SetObj(pName)
{
    this.name = pName;
    this.expressions= [];
}
function PosFilterObj(pName)
{
    this.name = pName;
    this.expressions= [];
}
function SetExpr(pExprName,pSetName, pType, pAdditionalParams) {
    this.name=pExprName;
    this.exprSetName = pSetName;
    this.exprType = pType;
    if (pAdditionalParams.length > 0)
    {
        this.externalExpr = pAdditionalParams[0];
        if(pAdditionalParams.length > 1) {
            this.exprStart = pAdditionalParams[1];
            this.exprSize = pAdditionalParams[2];
        }
    }
}