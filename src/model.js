function complianceObj(){
    this.mSetArray = [];
    this.mSetExprArray = [];
    this.mPosFilterArray = [];
    this.mPosFilterExprArray = [];
    this.mSetArray.push(new SetObj("positions"));
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
        this.operator = pAdditionalParams[1];
        if(pAdditionalParams.length > 2) {
            this.exprStart = pAdditionalParams[2];
            this.exprSize = pAdditionalParams[3];
        }
    }
}

function PosFilterExprObj(pName, pType, pRef, pOperator)
{
    this.name = pName;
    this.type = pType;
    this.refIndex = pRef;//potentoally findExpr
    this.operator = pOperator;
}