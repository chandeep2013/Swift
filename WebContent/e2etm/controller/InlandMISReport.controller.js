jQuery.sap.require("sap.ui.project.e2etm.util.Formatter");
jQuery.sap.require("sap.ui.project.e2etm.util.StaticUtility");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("sap.ui.core.util.Export");
jQuery.sap.require("sap.ui.core.util.ExportType");
jQuery.sap.require("sap.ui.core.util.ExportTypeCSV");

sap.ui.controller("sap.ui.project.e2etm.controller.InlandMISReport", {

	onInit : function(evt) {
		sap.ui.core.routing.Router.getRouter("MyRouter").attachRoutePatternMatched(this.onRouteMatched, this);
	},
	ServiceCall: function(evt)
	{
		var IMSReport = this;
		var sdate= this.getView().byId("idMisrpSdate").getValue();
		var edate= this.getView().byId("idMisrpEdate").getValue(); 
		var psel = this.getView().byId("idMisrprb1").getSelected();
		var asel = this.getView().byId("idMisrprb2").getSelected();
		var Active= this.getView().byId("idMinrpCheckBox").getSelected();
		if(Active == true){
			var ActiveCases = "X";
		}else{
			ActiveCases = "";
		}
		
		if(Active == false && (sdate == '' || edate == '')){
			sap.m.MessageToast.show('Please select both date.');
		}
		else{
			sap.ui.project.e2etm.util.StaticUtility.setBusy(true, IMSReport);
			var ReportsModel = new sap.ui.model.json.JSONModel();
			if(psel){
				sopt = 'P';
			}
			else if(asel){
				sopt = 'A'
			}
		var service = "Inland_MIS_Report/?zsdate='"+sdate+"'&zedate='"+edate+"'&zrdopt='"+sopt+"'&active='"+ActiveCases+"'&$format=json";
    	oDataModel.read(service, null, null, true, function(oData, response) {
    		var data = JSON.parse(response.body);
    		ReportsModel.setSizeLimit(data.d.results.length);
    		ReportsModel.setData(data.d);
    		IMSReport.getView().setModel(ReportsModel,"Reports");
    		sap.ui.project.e2etm.util.StaticUtility.setBusy(false, IMSReport);
		},function(error) {
			sap.m.MessageToast.show("Internal Server Error");
			sap.ui.project.e2etm.util.StaticUtility.setBusy(false, IMSReport);
		}, true);}
		
	},
	onRouteMatched : function(evt) {
		//this.ServiceCall(evt);
	},
	onCheckboxSelect:function(){
		var that = this;
		var ActiveCases= that.getView().byId("idMinrpCheckBox").getSelected();
		if(ActiveCases == true){
			that.getView().byId("idMisrpSdate").setValue("");
			that.getView().byId("idMisrpEdate").setValue("");
			that.getView().byId("idMisrpSdate").setEditable(false);
			that.getView().byId("idMisrpEdate").setEditable(false); 
		}
		else{
			that.getView().byId("idMisrpSdate").setEditable(true);
			that.getView().byId("idMisrpEdate").setEditable(true);
		
		}
	},
	
	OnchangeRbtn: function(evt)
	{
		//this.ServiceCall(evt);
		var selected = this.getView().byId("idMisRadioGroup").getSelectedIndex()
		if(selected == 0 ){
			this.getView().byId("idMinrpCheckBox").setSelected(false);
			this.getView().byId("idMinrpCheckBox").setEnabled(false);
			this.getView().byId("idMisrpSdate").setEditable(true);
			this.getView().byId("idMisrpEdate").setEditable(true);
			this.getView().byId("idMisrpSdate").setValue("");
			this.getView().byId("idMisrpEdate").setValue("");
		}
		else{
			this.getView().byId("idMinrpCheckBox").setEnabled(true);
		}
	},
	handleClearSearchFilters : function(evt)
	{
		this.getView().byId("idMisrpSdate").setValue("");
		this.getView().byId("idMisrpEdate").setValue(""); 
	},
	handleSearchButtonPress : function(evt)
	{
		this.ServiceCall(evt);
	},
	backPress : function(evt) {
		sap.ui.core.routing.Router.getRouter("MyRouter").myNavBack();
	},
	 /*######################## onPress Excel download button ##########################*/
    excelDownload: function() {
        var table = this.getView().byId("idMISReportTable");
        var aData = this.getView().getModel("reportsData");
        var aHead = this.prepareTableData();
        var blob,
            wb = {
                SheetNames: [],
                Sheets: {}
            };
        var ws1 = XLSX.read(aHead.join(""), {
            type: "binary"
        }).Sheets.Sheet1;
        wb.SheetNames.push("Reports");
        wb.Sheets["Reports"] = ws1;
        blob = new Blob([this.s2ab(XLSX.write(wb, {
            bookType: 'xlsx',
            type: 'binary'
        }))], {
            type: "application/octet-stream"
        });
        saveAs(blob, "Inland MIS Report.xlsx");
    },
    /*################## Table preparation for XlSX file download #######################*/
    prepareTableData: function() {
        var table = this.getView().byId("idMISReportTable");
        var columns = table.getColumns();
        var aBuffer = [];
        aBuffer.push("<html><head><style>td{font-weight:900;}</style></head><body><table>");
        aBuffer.push("<tr>");
        $.each(columns, function(index, column) {
            aBuffer.push("<td width='450px' style='font-weight:bold'><div><b>" + column.mAggregations.header.getText() + "</b></div></td>");
        });
        aBuffer.push("</tr>");
        for (var i = 0; i < table.getItems().length; i++) {
            aBuffer.push("<tr>");
            for (var j = 0; j < table.getItems()[i].getCells().length; j++) {
            	if(j==10 || j==11|| j==16 || j==17 || j==19){
            		var val = table.getItems()[i].getCells()[j].mProperties.text;
            		try{
            			var property = val.split("/")[1]+"/"+val.split("/")[0]+"/"+val.split("/")[2];
            		}catch(err){
            			property = "";
            		}
            	}
            	else{
            		 property = table.getItems()[i].getCells()[j].mProperties.text;
            	}
               
                aBuffer.push("<td width='450px'>" + property + "</td>");
            }
            aBuffer.push("</tr>");
        }
        aBuffer.push("</table></body></html>");
        return aBuffer;
    },
    s2ab: function(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    },
	
	handleSettignsPress:function(){
    	var that =this;
    	/*Object creation for Table*/
    	var colName=[{"ColName":"SL.No","id":"idMISLNo"},{"ColName":"E.No.","id":"idMISENo"},{"ColName":"GID","id":"idMISGuid"},{"ColName":"Depu Request No","id":"idMISDEPNo"},
    		{"ColName":"TP No","id":"idMISTPNo"},{"ColName":"Assignment Code","id":"idMISasg"},{"ColName":"Status","id":"idMISStatus"},{"ColName":"Name","id":"idMISName"},{"ColName":"Level","id":"idMISLevel"},
    		{"ColName":"Gender","id":"idMISGender"},{"ColName":"DOB","id":"idMISDOB"},
    		{"ColName":"DOJ","id":"idMISDOJ"},{"ColName":"Work Loc","id":"idMISWorkLoc"},{"ColName":"From Loc","id":"idMISFLoc"},{"ColName":"To Loc","id":"idMISToLoc"},
    		{"ColName":"Name of the company","id":"idMISCmpny"},{"ColName":"Start Date","id":"idMISStDate"},
    		{"ColName":"End Date","id":"idMISEndDate"},{"ColName":"Days","id":"idMISDays"},{"ColName":"Letter Generation date","id":"idMISGenDate"},
    		{"ColName":"Dept.","id":"idMISDept"},{"ColName":"BU","id":"idMISBU"},{"ColName":"Group","id":"idMISGroup"},
    		{"ColName":"Section","id":"idMISSection"},{"ColName":"Approver","id":"idMISApprover"},{"ColName":"Reason For Change","id":"idMISRFC"},
    		{"ColName":"Daily Allowance","id":"idMISDailyAll"},{"ColName":"Deputation Allowance","id":"idMISDurationAll"},{"ColName":"Lodging Allowance","id":"idMISLodgingAll"},
    		{"ColName":"Onetime Allowance","id":"idMISOnetimeAll"}
    		];
    	
    	var oColModel = new sap.ui.model.json.JSONModel();
    	oColModel.setData(colName);
		this.getView().setModel(oColModel, "colNames");

		/*Dialog creation*/
    	if (!this.pressDialog) {
			this.pressDialog = new sap.m.Dialog({
				title: "Select Columns Names",
				contentWidth:"25%",
				content: new sap.m.Table("idMISVisibileColList",{
					  mode:"MultiSelect",
					  columns:[new sap.m.Column({header:[new sap.m.Label({ text:"Select Columns"}),new sap.m.Label({visible:false})]}) ],
				 items:{
					path: 'colNames>/', 
					template: new sap.m.ColumnListItem({
						cells:[  new sap.m.Text({ text:"{colNames>ColName}"}),new sap.m.Text({ text:"{colNames>id}" })  ]
					  })
					}
				 }) ,
				beginButton: new sap.m.Button({
					text: "OK",
					press: function (oEvent) {
						/*Setting visibility for columns*/
						for(var i=0;i<colName.length;i++){
							this.getView().byId(colName[i].id).setVisible(false);
						}
						var selectedItems=sap.ui.getCore().byId("idMISVisibileColList").getSelectedItems()
						for(var i=0;i<selectedItems.length;i++){
							var id = selectedItems[i].mAggregations.cells[1].mProperties.text;
							that.getView().byId(id).setVisible(true);
							that.VisibiityForColumns(colName);
							}
						this.pressDialog.close();
					}.bind(this)
				}),
				endButton: new sap.m.Button({
					text: "Close",
					press: function () {
						this.pressDialog.close();
					}.bind(this)
				})
			});
			//to get access to the global model
			this.getView().addDependent(this.pressDialog);
		}
		this.pressDialog.open();
		this.VisibiityForColumns(colName);
    },
    VisibiityForColumns:function(colName){
    	for(var i=0;i<colName.length;i++){
			if(this.getView().byId(colName[i].id).getVisible()==true){
				var oList=sap.ui.getCore().byId("idMISVisibileColList");
				var oItem = oList.getItems()[i];
		        oList.setSelectedItem(oItem);
			}
		}
    },
});