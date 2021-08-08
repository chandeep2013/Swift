jQuery.sap.require("sap.ui.project.e2etm.util.Formatter");
jQuery.sap.require("sap.ui.project.e2etm.util.StaticUtility");
sap.ui.controller("sap.ui.project.e2etm.controller.Cargo_Reports", {
    onInit: function() {
        sap.ui.core.routing.Router.getRouter("MyRouter").attachRoutePatternMatched(this.onRouteMatched, this);
        //sap.ui.project.e2etm.util.StaticUtility.setBusy(false, this);
       // $("html").find(".sapMShellCentralBox").addClass("flexWidth"); 
    },
    onRouteMatched: function() {
        var oGlobal = sap.ui.getCore().getModel("global").getData();
        sap.ui.getCore().getModel("global").setData(oGlobal);
        var oModel = new sap.ui.model.json.JSONModel();
        oModel.setData(oGlobal.country);
        oModel.setSizeLimit(oGlobal.country.length);
        this.getView().setModel(oModel, "reports");
    },
    /*##############  Clear search filters ####################*/
    handleClearSearchFilters: function() {
        var array = ["idEmployeeNo", "idTravelPlanNo", "idCargoType", "idCountry", "idRequestCreationDateFrom", "idVendor", "idRequestCreationDateTo"];
        var clearArray=[];
        for (var i = 0; i < array.length; i++) {
            if(this.getView().byId(array[i]).getValue() !=""){
            	 clearArray.push(this.getView().byId(array[i]).getValue());
            }
            this.getView().byId(array[i]).setValue("");
            try{this.getView().byId(array[i]).setSelectedKey("");}catch(err){}
        }
        if(clearArray.length>0){
        	sap.m.MessageToast.show("All Filter values are cleared..!");
        }
    },
    handleSearchButtonPress: function() {
    	var that = this;
    	sap.ui.core.BusyIndicator.show(1);
    	this.getView().byId("idSearchBtn").setEnabled(false);
        var EmployeeNo = this.getView().byId("idEmployeeNo").getValue();
        var TravelPlanNo = this.getView().byId("idTravelPlanNo").getValue();
        var CargoType = this.getView().byId("idCargoType").getSelectedKey();
        var Country = this.getView().byId("idCountry").getSelectedKey();
        var RequestFrom = this.getView().byId("idRequestCreationDateFrom").getValue();
        var Vendor = this.getView().byId("idVendor").getSelectedKey();
        var RequestTo = this.getView().byId("idRequestCreationDateTo").getValue();
        if(RequestFrom && (RequestFrom > RequestTo)){
        	sap.ui.define(["sap/m/MessageBox"], function(MessageBox) {
        		MessageBox.show(
        			"Start Date should be less than End Date.", {
        				icon: MessageBox.Icon.ERROR,
        				title: "Error",
        				actions: [MessageBox.Action.OK],
        				onClose: function(oAction) { / * do something * / }
        			}
        		);
        	});
        }
        else{
        	//Service call for Cargo reports to show in UI Table.
        	var filterURL = "/ZE2E_CARO_REPORTSet?$filter=ZZ_TO_CNTY eq '"+Country+"' and ZZ_OWNER eq '"+EmployeeNo+"' and ZZ_REINR eq '"+TravelPlanNo+"' and ZZ_CAR_TYP eq '"+CargoType+"' and Vendor eq '"+Vendor+"'";
        	oDataModel.read(filterURL, null, null, true, function(oData, response) {
    			//console.log(oData.results);
    			that.getView().byId("idExcelDownloadButton").setVisible(true);
    			that.getView().byId("idSearchBtn").setEnabled(true);
    			sap.ui.core.BusyIndicator.hide();
    			var reportsModel = new sap.ui.model.json.JSONModel();
    			reportsModel.setData(oData.results);
    			reportsModel.setSizeLimit(oData.results.length); // Model size limit
    			that.getView().setModel(reportsModel,"reportsData");
    			that.getView().byId("idCargoTableInfoToolBar").setText("Reports("+oData.results.length+")");
    			if(oData.results.length == 0 ){
    				sap.m.MessageToast.show("No Data Found...!!");
    			}
    		}, function(error) {
    			sap.ui.define(["sap/m/MessageBox"], function(MessageBox) {
            		MessageBox.show(
            			"Please contact support Team...!", {
            				icon: MessageBox.Icon.ERROR,
            				title: "Error",
            				actions: [MessageBox.Action.OK],
            				onClose: function(oAction) { / * do something * / }
            			}
            		);
            	});
    			that.getView().byId("idExcelDownloadButton").setVisible(false);
    			that.getView().byId("idSearchBtn").setEnabled(true);
    			sap.ui.core.BusyIndicator.hide();
    		});

        }
      },
    
    /*######################## onPress Excel download button ##########################*/
    excelDownload: function() {
        var table = this.getView().byId("idCargoReporsTable");
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
        saveAs(blob, "Cargo Reports.xlsx");
    },
    /*################## Table preparation for XlSX file download #######################*/
    prepareTableData: function() {
        var table = this.getView().byId("idCargoReporsTable");
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
    onNavBack: function() {
        window.history.go(-1);
    },
    onExit:function(){
    	//$("html").find(".sapMShellCentralBox").removeStyleClass("flexWidth"); 
    },
    handleSettignsPress:function(){
    	var that =this;
    	/*Object creation for Table*/
    	var colName=[{"ColName":"EmployeeNo","id":"idEmployeeNoCol"},{"ColName":"Assosiate Name","id":"idAssocitionCol"},{"ColName":"Travel Plan No","id":"idTravelPlanCol"},
    		{"ColName":"Deputation Request Number","id":"idDepReqNoCol"},{"ColName":"Cargo Type","id":"idCargoTypeCol"},{"ColName":"Department","id":"idDepartmentCol"},
    		{"ColName":"Deputation Start Date","id":"idDepStartDateCol"},{"ColName":"Deputation End Date","id":"idDepENdDateCol"},
    		{"ColName":"Vendor","id":"idVendorCol"},{"ColName":"Deputation Duration","id":"idDepDurationCol"},{"ColName":"CARGO Request Created Date","id":"idCargoeqCreationDateCol"},
    		{"ColName":"CARGO Request approved date	","id":"idCargoeqApproveDateCol"},{"ColName":"CARGO Movement Date","id":"idCargoeqMovementDateCol"},
    		{"ColName":"Cargo Eligibility (kg)","id":"idcargoEligibiltyCol"},{"ColName":"Country","id":"idCounrtyCol"},{"ColName":"NT ID","id":"idNTIDCol"},{"ColName":"Remarks","id":"idRemarksCol"}];
    	
    	var oColModel = new sap.ui.model.json.JSONModel();
    	oColModel.setData(colName);
		this.getView().setModel(oColModel, "colNames");

		/*Dialog creation*/
    	if (!this.pressDialog) {
			this.pressDialog = new sap.m.Dialog({
				title: "Select Columns Names",
				contentWidth:"25%",
				content: new sap.m.Table("idVisibileColList",{
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
						var selectedItems=sap.ui.getCore().byId("idVisibileColList").getSelectedItems()
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
				var oList=sap.ui.getCore().byId("idVisibileColList");
				var oItem = oList.getItems()[i];
		        oList.setSelectedItem(oItem);
			}
		}
    }
    
});