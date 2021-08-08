jQuery.sap.require("sap.ui.project.e2etm.util.Formatter");
jQuery.sap.require("sap.ui.project.e2etm.util.StaticUtility");
jQuery.sap.require("sap.m.MessageBox");
sap.ui.controller("sap.ui.project.e2etm.controller.HRBPReports", {
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
        var array = ["idHRBPCountry", "idHRBPAssignMentGroup"];
        this.getView().byId("idHRBPCountry").setSelectedKey("");
        this.getView().byId("idHRBPCountry").setValue("");
        this.getView().byId("idHRBPAssignMentGroup").setSelectedKey("");
        this.getView().byId("idTripStartDate").setValue("");
        this.getView().byId("idTripEndDate").setValue("");
        this.getView().byId("idHrbpYear").setValue("");
        this.getView().byId("idHrbpMonths").setValue("");
        this.getView().byId("idHrbpMonths").setSelectedKeys("");
        sap.m.MessageToast.show("All Filter values are cleared..!");
    },
    handleSearchButtonPress: function() {
    	var that = this;
        var Country = this.getView().byId("idHRBPCountry").getSelectedKey();
        var Assignmet = this.getView().byId("idHRBPAssignMentGroup").getSelectedKey();
        var RequestFrom = this.getView().byId("idTripStartDate").getValue();
        var RequestTo = this.getView().byId("idTripEndDate").getValue();
        var Value = this.getView().byId("idHrbpMonths").getSelectedKeys();
        var Months = Value.toString();
        var Year = this.getView().byId("idHrbpYear").getValue();
        
        if(RequestFrom && RequestTo && (RequestFrom > RequestTo)){
        	sap.ui.core.BusyIndicator.hide();
    		this.getView().byId("idHRBPSearchBtn").setEnabled(true);
    		sap.m.MessageBox.error("Start Date should be less than End Date.");
        }
        else if(Year !="" && Months ==""){
        	sap.m.MessageBox.error("Select atleast one month");
        }
        else if(Year =="" && Months !=""){
        	sap.m.MessageBox.error("Enter Year");
        }
        else{
        	//Service call for HRBP reports to show in UI Table.
        	this.getView().byId("idHRBPSearchBtn").setEnabled(false);
        	sap.ui.core.BusyIndicator.show(1);
        	var filterUrl = sServiceUrl+ "RepatriationReport/?ZZ_COUNTRY='"+Country+"'&ZZ_ASG_MODEL='"+Assignmet+"'&ZZ_BEGDA='"+RequestFrom+"'&ZZ_ENDDA='"+RequestTo+"'&ZZ_MONTH='"+Months+"'&ZZ_YEAR='"+Year+"'";
        	var get = $.ajax({
				cache: false,
				url: filterUrl, 
				type: "GET",
				dataType: 'json',
				async: true
			});
			var data = '';
			get.done(function(result) {
				data = result;	
				sap.ui.core.BusyIndicator.hide();
				that.getView().byId("idHRBPSearchBtn").setEnabled(true);
				that.getView().byId("idHRBPExcelDownload").setVisible(true);
    			var reportsModel = new sap.ui.model.json.JSONModel();
    			reportsModel.setData(data.d.results);
    			reportsModel.setSizeLimit(data.d.results.length); // Model size limit
    			that.getView().setModel(reportsModel,"reportsData");
    			if(data.d.results.length == 0 ){
    				sap.m.MessageToast.show("No Data Found...!!");
    			}
			});
			get.fail(function(err) {
				sap.ui.core.BusyIndicator.hide();
				that.getView().byId("idHRBPSearchBtn").setEnabled(true);
				that.getView().byId("idHRBPExcelDownload").setVisible(false);
				sap.m.MessageToast.show("Contact SUpport Team!!");
			});
        	
        }
      },
    
    /*######################## onPress Excel download button ##########################*/
    excelDownload: function() {
        var table = this.getView().byId("idHRBPReportsTable");
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
        saveAs(blob, "HRBP Reports.xlsx");
    },
    /*################## Table preparation for XlSX file download #######################*/
    prepareTableData: function() {
        var table = this.getView().byId("idHRBPReportsTable");
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
    	var colName=[{"ColName":"EmployeeNo","id":"idHRBPEmpNo"},{"ColName":"Name of the Employee","id":"idHRBPEmpNmae"},{"ColName":"Top Management","id":"idHRBPTopMngnt"},
    		{"ColName":"Senior Managemnet","id":"idHRBPSrMngnt"},{"ColName":"Middle Management","id":"idHRBPMidMngnt"},{"ColName":"Trip Number","id":"idHRBPTPNo"},
    		{"ColName":"Assignment Model","id":"idHRBPAssModel"},{"ColName":"Host Entity","id":"idHRBPHostEntity"},
    		{"ColName":"Trip Duration","id":"idHRBPTPDuration"},{"ColName":"Trip Begin Date","id":"idHRBPBeginDate"},{"ColName":"Trip End Date","id":"idHRBPEndDate"},
    		{"ColName":"Trip Destination","id":"idHRBPTripDestination"},{"ColName":"Country","id":"idHRBPTCntyTxt"},
    		{"ColName":"Reason for Repatriation","id":"idHRBPReason"},{"ColName":"Effective date of Repatriation","id":"idHRBPEffDate"},{"ColName":"E-mail Id","id":"idHRBPEmail"},
    		{"ColName":"Deputation request","id":"idHrbpDeputationReq"},{"ColName":"Amount","id":"idHrbpAmount"},{"ColName":"Reallocation Applicability","id":"idHRBPApplicability"}];
    	
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
    },
    onCountryChange:function(){
    	var cnty = this.getView().byId("idHRBPCountry").getSelectedKey();
    	var aFilters = [];
        aFilters.push(new sap.ui.model.Filter({path:"ToCountry",operator:"EQ",
        	                                   value1:cnty }));    

        var oTemplate = new sap.ui.core.Item({key:"{Key}",text:"{AsgType}"});

        this.getView().byId("idHRBPAssignMentGroup").bindItems({path:"/AsgModelsF4Set",template:oTemplate,filters:aFilters});	
    }
    
});