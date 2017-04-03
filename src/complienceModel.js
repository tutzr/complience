var AGGR_SETEXPR_SUBSET = "subset";
var AGGR_MAX = "max";
var AGGR_MIN = "min";

var g_CompianceRules;
/*
*   Constructor for global Compliance Rules 
*/
function ComplianceRules()
{
    this.compSetArray = [];
    this.compSetExprArray = [];

    this.addSet = function(compSet){
        this.compSetArray.push(compSet);
    }
    this.addSetExpr = function(compSetExpr)
    {
        this.compSetExprArray.push(compSetExpr);
    }
}

/*
*   Constructor for setExprObj 
*/
function SetExprObj(pParentSet, pAggregation, pAdditionalParams)
{
    
    this.parentSet = pParentSet;
    this.aggregation = pAggregation;
    this.aggregationRef = null;
    this.params = pAdditionalParams;

}

/*
* Constructor for setObj 
*/
function SetObj()
{
    this.ArraySetExpr = new Array();
}