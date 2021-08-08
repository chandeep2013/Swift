jQuery.sap.require("sap.ui.project.e2etm.util.Formatter");
jQuery.sap.require("sap.ui.project.e2etm.util.StaticUtility");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("sap.ui.core.util.Export");
jQuery.sap.require("sap.ui.core.util.ExportType");
jQuery.sap.require("sap.ui.core.util.ExportTypeCSV");

sap.ui.controller("sap.ui.project.e2etm.controller.PEExposureReport", {

	onInit : function(evt) {
		sap.ui.core.routing.Router.getRouter("MyRouter").attachRoutePatternMatched(this.onRouteMatched, this);
	},
	
	onRouteMatched : function(evt) {
		var oPEReport = this;
		sap.ui.project.e2etm.util.StaticUtility.setBusy(true, oPEReport);
		var countryModel = new sap.ui.model.json.JSONModel();
        var countryURL =  "DEP_COUNTRIESSet";
        countryModel.setSizeLimit(1000);
  ///////############### Countries ##############////////
    	oDataModel.read(countryURL, null, null, true, function(oData, response) {
    		sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oPEReport);
    		//var array = oData;
    		//US, UK, France, DE, Japan removing PE countires from list
    		/*for(var i=0;i<oData.results.length;i++){
    			if(oData.results[i].MOLGA === "FR" || oData.results[i].MOLGA === "GB" || oData.results[i].MOLGA === "US" || oData.results[i].MOLGA === "DE" || oData.results[i].MOLGA === "JP"){
            		  array.results.splice(i, 1);
    			}
    		}*/
    		countryModel.setData(oData);
    		oPEReport.getView().setModel(countryModel,"country");
		}, function(error) {
			sap.m.MessageToast.show("Internal Server Error");
			sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oPEReport);
		});
    	
    	///////############### Year ##############////////
    	var CurrentYear = new Date().getFullYear()+7;
    	var yearModel = new sap.ui.model.json.JSONModel();
    	YearArray = [];
    	for(var i=2000;i<CurrentYear;i++){
    		YearArray.push({"Key":i,"Text":i});
    	}
    	yearModel.setData(YearArray);
    	oPEReport.getView().setModel(yearModel,"Year");
	},
	
	backPress : function(evt) {
		sap.ui.core.routing.Router.getRouter("MyRouter").myNavBack();
	},
	
	handleClearSearchFilters: function(evt){
		this.getView().byId("idPEReportEmpNo").setValue("");
		this.getView().byId("idPECountry").setValue("");
		this.getView().byId("idPECountry").setSelectedKeys([]);
		this.getView().byId("idPEYear").setValue("");
		this.getView().byId("idPEYear").setSelectedKeys([]);
	},
	handleSearchButtonPress:function(){
		var oPEReport = this;
	//##var EmpNo = sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_PERNR;##//
		var EmpNo = this.getView().byId("idPEReportEmpNo").getValue();
		var year = this.getView().byId("idPEYear").getSelectedKeys().toString();
		var country= this.getView().byId("idPECountry").getSelectedKeys().toString();
		sap.ui.project.e2etm.util.StaticUtility.setBusy(true, oPEReport);
		var ReportsModel = new sap.ui.model.json.JSONModel();
		var service ="/CheckNonPETaxExpSet?$filter=ZZ_PERNR eq '"+EmpNo+"' and ZZ_YEAR eq '"+year+"' and ZZ_CNTRY eq '"+country+"'&$format=json"; 
		//var service ="CheckNonPETaxExpSet?$filter=ZZ_PERNR eq '"+EmpNo+"'+ and ZZ_YEAR eq '"+year+"' and ZZ_CNTRY eq '"+country+"'&$format=json";		
		// service call 
    	oDataModel.read(service, null, null, true, function(oData, response) {
    		var data = JSON.parse(response.body);
    		ReportsModel.setData(data.d);
    		oPEReport.getView().setModel(ReportsModel,"Reports");
    		sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oPEReport);
		},function(error) {
			sap.m.MessageToast.show("Internal Server Error");
			sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oPEReport);
		}, true);
		
	},
	 /*######################## onPress Excel download button ##########################*/
    excelDownload: function() {
        var table = this.getView().byId("idPEReportTable");
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
        saveAs(blob, "PE Report.xlsx");
    },
    /*################## Table preparation for XlSX file download #######################*/
    prepareTableData: function() {
        var table = this.getView().byId("idPEReportTable");
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
                var property = table.getItems()[i].getCells()[j].mProperties.text;
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
    	var colName=[{"ColName":"TP Number","id":"idPETPNo"},{"ColName":"Employee Number","id":"idPEEMPNo"},{"ColName":"Employee Name","id":"idPEEMPName"},
    		{"ColName":"Country","id":"idPEReportCountry"},{"ColName":"Location","id":"idPELoc"},{"ColName":"Travel Type","id":"idPETPType"},
    		{"ColName":"Start Date","id":"idPEStDate"},{"ColName":"End Date","id":"idPEEndDate"},
    		{"ColName":"Year","id":"idPEReportYear"},{"ColName":"Department","id":"idPEDept"},{"ColName":"Section","id":"idPESection"},
    		{"ColName":"BU","id":"idPEBU"},{"ColName":"NT ID","id":"idPENTID"},
    		{"ColName":"Personal Travel start date","id":"idPETRStDate"},{"ColName":"Personal Travel End date","id":"idPETREndDate"},{"ColName":"Total Duration","id":"idPETPDuration"}
    		];
    	
    	var oColModel = new sap.ui.model.json.JSONModel();
    	oColModel.setData(colName);
		this.getView().setModel(oColModel, "colNames");

		/*Dialog creation*/
    	if (!this.pressDialog) {
			this.pressDialog = new sap.m.Dialog({
				title: "Select Columns Names",
				contentWidth:"25%",
				content: new sap.m.Table("idPEVisibileColList",{
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
						var selectedItems=sap.ui.getCore().byId("idPEVisibileColList").getSelectedItems()
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
				var oList=sap.ui.getCore().byId("idPEVisibileColList");
				var oItem = oList.getItems()[i];
		        oList.setSelectedItem(oItem);
			}
		}
    },
});