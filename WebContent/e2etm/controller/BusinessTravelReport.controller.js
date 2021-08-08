jQuery.sap.require("sap.ui.project.e2etm.util.Formatter");
jQuery.sap.require("sap.ui.project.e2etm.util.StaticUtility");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("sap.ui.core.util.Export");
jQuery.sap.require("sap.ui.core.util.ExportType");
jQuery.sap.require("sap.ui.core.util.ExportTypeCSV");

sap.ui.controller("sap.ui.project.e2etm.controller.BusinessTravelReport", {

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
/*    	var CurrentYear = new Date().getFullYear()+7;
    	var yearModel = new sap.ui.model.json.JSONModel();
    	YearArray = [];
    	for(var i=2000;i<CurrentYear;i++){
    		YearArray.push({"Key":i,"Text":i});
    	}
    	yearModel.setData(YearArray);
    	oPEReport.getView().setModel(yearModel,"Year");*/
	},
	
	backPress : function(evt) {
		sap.ui.core.routing.Router.getRouter("MyRouter").myNavBack();
	},
	
	handleClearSearchFilters: function(evt){
		this.getView().byId("idBTSdate").setValue("");
		this.getView().byId("idBTEdate").setValue("");
		this.getView().byId("idBTtoSDt").setValue("");
		this.getView().byId("idBTtoEDt").setValue("");
		this.getView().byId("idBTtraveltype").setValue("");
		this.getView().byId("idBTtraveltype").setSelectedKeys([]);
		this.getView().byId("idBTcntry").setValue("");
		this.getView().byId("idBTcntry").setSelectedKeys([]);
	},
	handleSearchButtonPress:function(){
		var oPEReport = this;
		var country= this.getView().byId("idBTcntry").getSelectedKeys().toString();
		var Traveltype= this.getView().byId("idBTtraveltype").getSelectedKeys().toString();
		var sdate= this.getView().byId("idBTSdate").getValue();
		var edate= this.getView().byId("idBTEdate").getValue();
		var stdate= this.getView().byId("idBTtoSDt").getValue();
		var etdate= this.getView().byId("idBTtoEDt").getValue();
		if(country == "" && Traveltype =="" && sdate =="" && edate == "" && stdate == "" && etdate == "")
			{
			sap.m.MessageToast.show("Please Select One Of the Field.");
			}
		/*else if((sdate == "" && stdate != "") || (edate == "" && etdate != ""))
			{
			sap.m.MessageToast.show("Please Select correct Fields.");
			}*/
		else{
		sap.ui.project.e2etm.util.StaticUtility.setBusy(true, oPEReport);
		var ReportsModel = new sap.ui.model.json.JSONModel();
		//var service ="CheckNonPETaxExpSet?$filter=ZZ_PERNR eq '"+EmpNo+"'+ and ZZ_YEAR eq '"+year+"' and ZZ_CNTRY eq '"+country+"'&$format=json";		
		// service call 
		//var service = "BusinessTravelReport/Begda eq '"+sdate+"'and Country eq '"+country+"' and Endda eq '"+edate+"' and etdate eq '"+etdate+"' and Stdate eq '"+stdate+"' and TravelType eq '"+Traveltype+"'&$format=json";
		var service= "BusinessTravelReport/?Begda='"+sdate+"'&Country='"+country+"'&Endda='"+edate+"'&etdate='"+etdate+"'&Stdate='"+stdate+"'&TravelType='"+Traveltype+"'&$format=json";
		oDataModel.read(service, null, null, true, function(oData, response) {
    		var data = JSON.parse(response.body);
    		ReportsModel.setData(data.d);
    		oPEReport.getView().setModel(ReportsModel,"Reports");
    		sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oPEReport);
		},function(error) {
			sap.m.MessageToast.show("Internal Server Error");
			sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oPEReport);
		}, true);
		
	}},
	 /*######################## onPress Excel download button ##########################*/
    excelDownload: function() {
        var table = this.getView().byId("idBTReportTable");
        //var aData = this.getView().getModel("reportsData");
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
        saveAs(blob, "Business Travel Report.xlsx");
    },
    /*################## Table preparation for XlSX file download #######################*/
    prepareTableData: function() {
        var table = this.getView().byId("idBTReportTable");
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
    	var colName=[{"ColName":"REQ NO","id":"idBTREQNo"},{"ColName":"EMP NO","id":"idBTEMPNo"},{"ColName":"GID","id":"idBTGID"},
    		{"ColName":"Job Level","id":"idBTJobLvl"},{"ColName":"ASSOCIATE NAME","id":"idBTEname"},{"ColName":"DOB","id":"idBTDOB"},
    		{"ColName":"DOJ","id":"idBTDOJ"},{"ColName":"PASSPORT","id":"idBTPass"},
    		{"ColName":"TRAVEL REQ","id":"idBTTR"},{"ColName":"START DATE","id":"idBTSDate"},{"ColName":"END DATE","id":"idBTEndDate"},
    		{"ColName":"NO. OF DAYS","id":"idBTNDays"},{"ColName":"FROM COUNTRY","id":"idBTFcntry"},
    		{"ColName":"FROM LOCATION","id":"idBTFloc"},{"ColName":"TO COUNTRY","id":"idBTTcntry"},{"ColName":"TO LOCATION","id":"idBTTloc"}
    		,{"ColName":"Travel Type","id":"idBTTtyp"},{"ColName":"EMAIL","id":"idBTEmail"},{"ColName":"GROUP","id":"idBTGrp"}
    		,{"ColName":"BU","id":"idBTBU"},{"ColName":"Section","id":"idBTSection"},{"ColName":"Department","id":"idBTDept"}
    		,{"ColName":"Approved TP Start date","id":"idBTAprovTpSdate"},{"ColName":"Approved TP End date","id":"idBTAprovTpEdate"},
    		{"ColName":"Ticket issued","id":"idBTTickt"},{"ColName":"Gender","id":"idBTGNDR"},{"ColName":"Approver Name","id":"idBTApprover"},
    		{"ColName":"Associate NT ID","id":"idBTNTID"},{"ColName":"Work Location","id":"idBTWorkLoc"},
    		{"ColName":"Personal Travel Start Date","id":"idBTPTSdate"},{"ColName":"Personal Travel End Date","id":"idBTPTEdate"}
    		,{"ColName":"Ticket cost","id":"idBTTcost"},{"ColName":"Airline","id":"idBTAir"},{"ColName":"Ticket type","id":"idBTTktTyp"}
    		];
    	
    	var oColModel = new sap.ui.model.json.JSONModel();
    	oColModel.setData(colName);
		this.getView().setModel(oColModel, "colNames");

		/*Dialog creation*/
    	if (!this.pressDialog) {
			this.pressDialog = new sap.m.Dialog({
				title: "Select Columns Names",
				contentWidth:"25%",
				content: new sap.m.Table("idBTVisibileColList",{
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
						var selectedItems=sap.ui.getCore().byId("idBTVisibileColList").getSelectedItems()
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
				var oList=sap.ui.getCore().byId("idBTVisibileColList");
				var oItem = oList.getItems()[i];
		        oList.setSelectedItem(oItem);
			}
		}
    },
});