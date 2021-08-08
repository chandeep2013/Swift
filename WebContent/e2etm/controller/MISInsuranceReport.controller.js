jQuery.sap.require("sap.ui.project.e2etm.util.Formatter");
jQuery.sap.require("sap.ui.project.e2etm.util.StaticUtility");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("sap.ui.core.util.Export");
jQuery.sap.require("sap.ui.core.util.ExportType");
jQuery.sap.require("sap.ui.core.util.ExportTypeCSV");

sap.ui.controller("sap.ui.project.e2etm.controller.MISInsuranceReport", {

	onInit : function(evt) {
		sap.ui.core.routing.Router.getRouter("MyRouter").attachRoutePatternMatched(this.onRouteMatched, this);
	},
	
	onRouteMatched : function(evt) {
		var MISINSRReport = this;
		var ReportsModel = new sap.ui.model.json.JSONModel();
		this.handleClearSearchFilters();
	},
	
	backPress : function(evt) {
		sap.ui.core.routing.Router.getRouter("MyRouter").myNavBack();
	},
	
	handleClearSearchFilters: function(evt){
		this.getView().byId("idMisInsrStartFromDate").setValue("");
		this.getView().byId("idMisInsrEndFromDate").setValue("");
		this.getView().byId("idMisInsrStartToDate").setValue("");
		this.getView().byId("idMisInsrEndToDate").setValue("");
		this.getView().byId("idMisInsrEmpNO").setValue("");
		this.getView().byId("idMisInsrTpNO").setValue("");
		try{
			this.getView().byId("idMisInsrRadio").setSelectedIndex(2);
		}catch(err){}
		this.MisInsrRadioSelect();
		
	},
	handleSearchButtonPress:function(){
		var that = this;
		var StartFrom = that.getView().byId("idMisInsrStartFromDate");
		var StartTo = that.getView().byId("idMisInsrStartToDate");
		var EndFrom = that.getView().byId("idMisInsrEndFromDate");
		var EndTo = that.getView().byId("idMisInsrEndToDate");
		///########################### UCD1KOR Nov 20,2020 ######################/////////
		
		try{
			var dateValue1 = StartFrom.getDateValue().getFullYear()+""+(StartFrom.getDateValue().getMonth()+1 < 10 ? "0"+(StartFrom.getDateValue().getMonth()+1):StartFrom.getDateValue().getMonth()+1)+""+(StartFrom.getDateValue().getDate()<10 ? "0"+StartFrom.getDateValue().getDate():StartFrom.getDateValue().getDate());
			}
		catch(err){
			var dateValue1 = "";
		}
		
		try{
			var dateValue2 = StartTo.getDateValue().getFullYear()+""+(StartTo.getDateValue().getMonth()+1 <10 ? "0"+(StartTo.getDateValue().getMonth()+1):StartTo.getDateValue().getMonth()+1)+""+(StartTo.getDateValue().getDate()<10 ? "0"+StartTo.getDateValue().getDate():StartTo.getDateValue().getDate());
		}catch(err){
			var dateValue2 = "";
		}
		
		try{
			var dateValue3 = EndFrom.getDateValue().getFullYear()+""+(EndFrom.getDateValue().getMonth()+1 < 10 ? "0"+(EndFrom.getDateValue().getMonth()+1):EndFrom.getDateValue().getMonth()+1)+""+(EndFrom.getDateValue().getDate()<10 ? "0"+EndFrom.getDateValue().getDate():EndFrom.getDateValue().getDate());
		}catch(err){
			var dateValue3 = "";
		}
		
		try{
			var dateValue4 = EndTo.getDateValue().getFullYear()+""+(EndTo.getDateValue().getMonth()+1 <10 ? "0"+(EndTo.getDateValue().getMonth()+1):EndTo.getDateValue().getMonth()+1)+""+(EndTo.getDateValue().getDate()<10 ? "0"+EndTo.getDateValue().getDate():EndTo.getDateValue().getDate());

		}catch(err){
			var dateValue4 = "";
		}
		let selectedButton = this.getView().byId("idMisInsrRadio").getSelectedIndex();
		if( selectedButton == 2){
			var Error = "Please select the report";
				sap.m.MessageBox.error(Error);
				return;
		}
		
		if(StartFrom.getDateValue() && StartTo.getDateValue() && (StartFrom.getDateValue() > StartTo.getDateValue())){
			var Error = "Start date should be greater than end date";
		}
		else if(EndFrom.getDateValue() && EndTo.getDateValue() && (EndFrom.getDateValue() > EndTo.getDateValue())){
			var Error = "Start date should be greater than end date";
		}
		else {
			var Error = "";
		}
		var empNo = this.getView().byId("idMisInsrEmpNO").getValue();
		var reqNo = this.getView().byId("idMisInsrTpNO").getValue();
		if(dateValue1 == "" &&dateValue2 == "" &&dateValue3 == "" &&dateValue4 == "" && empNo == "" && reqNo ==""){
			var Error = "Please apply atleast one filter";
		}
		else{
			var Error = "";
		}
		
		if(Error == ""){
			sap.ui.project.e2etm.util.StaticUtility.setBusy(true, this);
			var MisInsReport_url = sServiceUrl + "InsSlaReport/?FromStartDate='"+dateValue1+"'&ToStartDate='"+dateValue2+"'&FromEndDate='"+dateValue3+"'&ToEndDate='"+dateValue4+"'&EmpNo='"+empNo+"'&ReqNo='"+reqNo+"'";
			var get = $.ajax({
				cache: false,
				url: MisInsReport_url, 
				type: "GET",
				async: true,
				dataType:'json',
			});
			var reinr_arr = '';
			get.done(function(result) {
				reinr_arr = result.d.results;	
				for(i=0;i<reinr_arr.length;i++){
					reinr_arr[i].zz_slno = i+1;
				}
				var reportsModel = new sap.ui.model.json.JSONModel();
				reportsModel.setData(reinr_arr);
				reportsModel.setSizeLimit(reinr_arr.length);
				if(reinr_arr.length <= 0 ){
					sap.m.MessageToast.show("No data found");
				}
				that.getView().setModel(reportsModel,"Reports");
				sap.ui.project.e2etm.util.StaticUtility.setBusy(false, that);
			});
			get.fail(function(err) {
				sap.ui.project.e2etm.util.StaticUtility.setBusy(false, that);
				sap.m.MessageBox.error("We are not able to Porcess your request.Try After some time");
			});
		}
		else{
			sap.m.MessageBox.error(Error);
		}
		
	},
	
	onSearch: function(oEvent) {
        var sQuery = this.getView().byId("idMisEmpSearch").getValue();
        var EmpNo = new sap.ui.model.Filter("ZZ_PERNR", sap.ui.model.FilterOperator.Contains, sQuery);
        var RequestNo = new sap.ui.model.Filter("ZZ_TRV_REQ", sap.ui.model.FilterOperator.Contains, sQuery);

        var filters = new sap.ui.model.Filter([EmpNo, RequestNo]);
        var listassign = this.getView().byId("idMISReportTable");
        listassign.getBinding("items").filter(filters, "Appliation");
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
        saveAs(blob, "MIS-Insurance Report.xlsx");
    },
    MisInsrRadioSelect:function(){
    	let selectedButton = this.getView().byId("idMisInsrRadio").getSelectedIndex();
    	let array = ["idMisInsrDep1","idMisInsrPolicyNo1","idMisInsrStartDate1","idMisInsrEndDate1",
			 "idMisInsrDep2","idMisInsrPolicyNo2","idMisInsrStartDate2","idMisInsrEndDate2",
			 "idMisInsrDep3","idMisInsrPolicyNo3","idMisInsrStartDate3","idMisInsrEndDate3",
			 "idMisInsrDep4","idMisInsrPolicyNo4","idMisInsrStartDate4","idMisInsrEndDate4"];
    	for(let i=0;i<array.length;i++){
    		if(selectedButton == 0){
        		this.getView().byId(array[i]).setVisible(false);
        		this.getView().byId("idMisInsrSettings").setVisible(false);
        	}else{
        		this.getView().byId(array[i]).setVisible(true);
        		this.getView().byId("idMisInsrSettings").setVisible(true);
        	}
		}
    },
    /*################## Table preparation for XlSX file download #######################*/
    prepareTableData: function() {
        var table = this.getView().byId("idMISReportTable");
        var allColumns = table.getColumns();
        let selectedButton = this.getView().byId("idMisInsrRadio").getSelectedIndex();
        var columns = [];
        for(var i=0;i<allColumns.length;i++){
        	if(selectedButton ===0 && allColumns[i].getVisible()){
        		columns.push(allColumns[i]) 
            }
        }
        if(selectedButton ===1){
        	columns = allColumns;
        }
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
                if(selectedButton == 0 && (j<8 || j==24 || j==25)){
                	aBuffer.push("<td width='450px'>" + property + "</td>");
                }else if(selectedButton == 1){
                	aBuffer.push("<td width='450px'>" + property + "</td>");
                }
                
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
    	let colName=[{"ColName":"SL.No","id":"idMisInsrSLNo"},{"ColName":"Emp Name","id":"idMisInsrEmpName"},{"ColName":"Emp No","id":"idMisInsrEmpNo"},
    		{"ColName":"TP No","id":"idMisInsrTPNo"},{"ColName":"Country","id":"idMisInsrCountry"},
    		{"ColName":"Start Date","id":"idMisInsrStartDate"},{"ColName":"End Date","id":"idMisInsrEndDate"},{"ColName":"Certificate(Policy) # ","id":"idMisInsrCertificate"},
    		{"ColName":"Dep 1 Name","id":"idMisInsrDep1"},{"ColName":"Policy No","id":"idMisInsrPolicyNo1"},{"ColName":"Start Date","id":"idMisInsrStartDate1"},{"ColName":"End Date","id":"idMisInsrEndDate1"},
    		{"ColName":"Dep 2 Name","id":"idMisInsrDep2"},{"ColName":"Policy No","id":"idMisInsrPolicyNo2"},{"ColName":"Start Date","id":"idMisInsrStartDate2"},{"ColName":"End Date","id":"idMisInsrEndDate2"},
    		{"ColName":"Dep 3 Name","id":"idMisInsrDep3"},{"ColName":"Policy No","id":"idMisInsrPolicyNo3"},{"ColName":"Start Date","id":"idMisInsrStartDate3"},{"ColName":"End Date","id":"idMisInsrEndDate3"},
    		{"ColName":"Dep 4 Name","id":"idMisInsrDep4"},{"ColName":"Policy No","id":"idMisInsrPolicyNo4"},{"ColName":"Start Date","id":"idMisInsrStartDate4"},{"ColName":"End Date","id":"idMisInsrEndDate4"},
    		];
    	
    	var oColModel = new sap.ui.model.json.JSONModel();
    	oColModel.setData(colName);
		this.getView().setModel(oColModel, "colNames");

		/*Dialog creation*/
    	if (!this.pressDialog) {
			this.pressDialog = new sap.m.Dialog({
				title: "Select Columns Names",
				contentWidth:"25%",
				content: new sap.m.Table("idMisInsrVisibileColList",{
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
						var selectedItems=sap.ui.getCore().byId("idMisInsrVisibileColList").getSelectedItems()
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
				var oList=sap.ui.getCore().byId("idMisInsrVisibileColList");
				var oItem = oList.getItems()[i];
		        oList.setSelectedItem(oItem);
			}
		}
    },
});