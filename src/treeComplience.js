//table fields demo
var demofields =["positionname","currency", "market value", "instrument type", "notional ammount"];

var g_modelObj;
var m_Layout;
var m_TreeView;
var m_GridView;
var m_ContexMenu;
var m_ToolBar;
var m_filterCombo;
var m_Tabbar;
var idRow;
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
		
        g_modelObj = new complianceObj();

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
    idRow = 1;
    if (m_GridView == null)
    {
        m_Tabbar = m_Layout.cells("b").attachTabbar({
				tabs: [
					{ id: "setTab1", text: "Set tab", active: true }
				]
			});


        m_ToolBar = m_Tabbar.tabs("setTab1").attachToolbar({

        });
        m_ToolBar.addText("name", 0, "Set name", "", "");
        m_ToolBar.addInput("txtName",1,"",200);
        m_ToolBar.addSeparator("sep1", 2)
        m_ToolBar.addButton("btnInsert",3,"Insert expression");
        m_ToolBar.addSeparator("sep2", 4)
        m_ToolBar.addButton("btnSave",5,"Save");
        m_ToolBar.addButton("btnClear",6,"Clear");
        m_ToolBar.addButton("btnCancel",7,"Cancel");
        m_ToolBar.attachEvent("onClick",onClickListenerToolbar);


        
        

    }
}
function initGridSetObj()
{
    m_GridView = m_Tabbar.tabs("setTab1").attachGrid(); //m_TreeView.attachEvent;
        m_GridView.setImagePath("../codebase/imgs/");
        m_GridView.setColAlign("center,left,left,right,left,left,left,left,left");
        m_GridView.setHeader("Mark,Name,Operator,(...,Aggregation,Set,Filter,parameters,...)");
        m_GridView.setColTypes("ch,ed,combo,ed,combo,combo,combo,ed,ed");
        m_GridView.setInitWidths("37,70,75,25,80,,,70,22");
        m_GridView.enableValidation(false,false,false,true,false,false,false,false,true); 
        m_GridView.setColValidators(",NotEmpty,,BrackedOpenValidation,NotEmpty,NotEmpty,,,BrackedCloseValidation");
        m_GridView.attachEvent("onCellChanged",onCellChangedListener)
        m_GridView.init();
        l_operatorCombo = m_GridView.getColumnCombo(2);
        l_operatorCombo.enableFilteringMode(true);
        l_operatorCombo.addOption([
            ["empty"," "],
            ["and","AND"],
            ["or","OR"],
            ["not","NOT"],
            ["nand","AND NOT"],
            ["nor","OR NOT"]
        ]);

        l_fieldCombo = m_GridView.getColumnCombo(5);
        l_fieldCombo.enableFilteringMode(true);
        var jsonArg1 = new Object();
        
        for (i =0 ; i < g_modelObj.mSetArray.length; i++)
        {
            var toParseJsonArray = new Array();
            jsonArg1.text = g_modelObj.mSetArray[i].name;
            jsonArg1.value = g_modelObj.mSetArray[i].name;
            toParseJsonArray.push(jsonArg1);
              var fieldArray = JSON.parse(JSON.stringify(toParseJsonArray));
            l_fieldCombo.addOption(fieldArray);
        }

        l_aggregationCombo = m_GridView.getColumnCombo(4);
        l_aggregationCombo.enableFilteringMode(true);
        l_aggregationCombo.addOption([
            ["set","set"],
            ["subset","subset"],
            ["max","max"],
            ["min","min"]
        ]);

        l_filterCombo = m_GridView.getColumnCombo(6);
        l_filterCombo.enableFilteringMode(true);
}

function onClickListenerToolbar(id)
{
    switch (id)
    {
        case "btnSave":
        name = m_ToolBar.getValue("txtName");
        g_modelObj.createSetObj(name);
        m_Tabbar.tabs("setTab1").setText(name);
        m_TreeView.addItem(name,name,"1");
        initGridSetObj();
        break;
        case "btnInsert":
        m_GridView.addRow(idRow,"1,new,empty");
        idRow++;
        break;
        default:
        break;
    }
}

function onCellChangedListener(rID,cInd,nValue)
{
    //rId	mixed	the id of a row
    //cInd	number	the index of a column
    //nValue	mixed	a new value
    if (cInd == 4)
    {
       l_filterCombo.clearAll();
       switch(nValue)
       {
           case "subset":
           //m_GridView.cells(rID,6).setValue("set up position filter");
           l_filterCombo.addOption([["addPosFilter","new position filter"]]);
           break;
           default:
            m_GridView.cells(rID,6).setValue("");
           break;
       }
    }

    if(cInd == 6)
    {
         switch(nValue)
       {
           case "addPosFilter":
           alert("add position");
           m_Tabbar.addTab("posFilterTab","new pos filter");
           m_Tabbar.goToNextTab();
           m_Tabbar.appendObject(m_ToolBar);
           break;
           default:
           break;
       }
    }

}
dhtmlxValidation.isBrackedOpenValidation = function(p_value)
{
    var pattern= new RegExp("^[(]*$");
    return pattern.test(p_value);
}

dhtmlxValidation.isBrackedCloseValidation = function(p_value)
{
    var pattern= new RegExp("^[)]*$");
    return pattern.test(p_value);
}

function enable() {
			m_TreeView.enableContextMenu(true);
		}

function disable() {
			m_TreeView.enableContextMenu(false);
		}