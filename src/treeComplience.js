//table fields demo
var demofields =["positionname","currency", "market value", "instrument type", "notional ammount"];

var m_Layout;
var m_TreeView;
var m_GridView;
var m_ContexMenu;
function createComplienceTree() {

    m_Layout = new dhtmlXLayoutObject({
        parent: "layoutObj", 
        pattern: "2U",
        
    // cells: [ 
    //     {
    //         id:             "complTree",        // id of the cell you want to configure
    //         text:           "Sturcure tree",     // header text
    //         collapsed_text: "Structure tree",   // header text for a collapsed cell
    //         header:         false,      // hide header on init
    //         collapse:       false,        // collapse on init
    //         fix_size:       [true,null] // fix cell's size, [width,height]
    //     },
    //     {
    //         id:             "complGrid",        // id of the cell you want to configure
    //         text:           "Edit node",     // header text
    //         collapsed_text: "Edit node",   // header text for a collapsed cell
    //         header:         false,      // hide header on init
    //         collapse:       false,        // collapse on init
    //         fix_size:       [true,null] // fix cell's size, [width,height]
    //     }
    // ]
    });
		//m_TreeView = new dhtmlXTreeView("treeComplienceView");
        m_Layout.cells("b").setWidth(850);
        m_Layout.cells("a").setText("Structure Tree");
        m_Layout.cells("b").setText("Edit node")
        m_TreeView= m_Layout.cells("a").attachTreeView();
        m_TreeView.addItem("1", "root");
        m_TreeView.attachEvent("onContextMenu", ContexMenuHandler);
		enable();
		
        m_TreeView.openItem("1", false);
		m_TreeView.selectItem("1");
}

function ContexMenuHandler(id, x, y, ev)
{
				if (m_ContexMenu == null) {
					m_ContexMenu = new dhtmlXMenuObject({
						//icons_path: "../../../dhtmlxMenu/samples/common/imgs/",
						context: true,
						items: [
                            {id: "insertSet", text: "Insert Set"},
                            {id: "insertLimit", text: "Insert Limit"},
                            {id: "insertResult", text: "Insert Result"},
							{type: "separator"},
							{id: "cut", text: "Cut"},
							{id: "copy", text: "Copy"},
							{id: "paste", text: "Paste"}
						]
					});
                  m_ContexMenu.attachEvent("onClick", contexMenuListener);
                }
                //m_ContexMenu.setItemText("itemText", m_TreeView.getItemText(id));
				m_ContexMenu.showContextMenu(x, y);
				m_TreeView.selectItem(id);

				return false; // prevent default context menu
}

function contexMenuListener(menuitemId,type)
{
    switch(menuitemId)
    {
        case "insertSet":
            createGridForSetExpr()
            break;
        default:
            break;
    }
}

function createGridForSetExpr()
{
    if (m_GridView == null)
    {
        m_GridView = m_Layout.cells("b").attachGrid(); //m_TreeView.attachEvent;
        m_GridView.setImagePath("../codebase/imgs/")
        m_GridView.setHeader("Expression Name,Operator,Included,(...,Field,Aggregation,parameters,...)");
        m_GridView.setColAlign("left,left,left,left,left,left,center,right");
        m_GridView.setColTypes("ed,combo,ch,ed,combo,combo,link,ed");
        m_GridView.enableAutoWidth(true);
        m_GridView.enableValidation(true,false,false,true); 
        m_GridView.setColValidators("NotEmpty,,,BrackedOpenValidation");
        m_GridView.attachEvent("onCellChanged",initParameterLink)
        m_GridView.init();
        l_operatorCombo = m_GridView.getColumnCombo(1);
        l_operatorCombo.enableFilteringMode(true);
        l_operatorCombo.addOption([
            ["empty"," "],
            ["and","AND"],
            ["or","OR"],
            ["not","NOT"],
            ["nand","AND NOT"],
            ["nor","OR NOT"]
        ]);

        l_fieldCombo = m_GridView.getColumnCombo(4);
        l_fieldCombo.enableFilteringMode(true);
        var jsonArg1 = new Object();
        
        for (i =0 ; i < demofields.length; i++)
        {
            var toParseJsonArray = new Array();
            jsonArg1.text = demofields[i];
            jsonArg1.value = demofields[i];
            toParseJsonArray.push(jsonArg1);
              var fieldArray = JSON.parse(JSON.stringify(toParseJsonArray));
            l_fieldCombo.addOption(fieldArray);
        }
      

        l_aggregationCombo = m_GridView.getColumnCombo(5);
        l_aggregationCombo.enableFilteringMode(true);
        l_aggregationCombo.addOption([
            ["name","name"],
            ["set","set"],
            ["subset","subset"],
            ["max","max"],
            ["min","min"]
        ]); 


        m_GridView.addRow("1","test1,empty,1");
        m_GridView.addRow("2","test2,empty,0");
    }
}
function initParameterLink(rID,cInd,nValue)
{
    //rId	mixed	the id of a row
    //cInd	number	the index of a column
    //nValue	mixed	a new value
    if (cInd == 5)
    {
       
       switch(nValue)
       {
           case "set":
            m_GridView.cells(rID,6).setValue("set parameters");
           alert("set case");
           break;
           default:
            m_GridView.cells(rID,6).setValue("");
           break;
       }
    }
}
dhtmlxValidation.isBrackedOpenValidation = function(p_value)
{
    var pattern= new RegExp("^[()]*$");
    return pattern.test(p_value);
}

function enable() {
			m_TreeView.enableContextMenu(true);
		}

function disable() {
			m_TreeView.enableContextMenu(false);
		}