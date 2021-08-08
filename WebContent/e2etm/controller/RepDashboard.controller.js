jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.ui.project.e2etm.util.Formatter");
jQuery.sap.require("sap.ui.project.e2etm.util.StaticUtility");
sap.ui.controller("sap.ui.project.e2etm.controller.RepDashboard", {

    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     * @memberOf e2etm.view.AccmTool
     */
    onInit: function() {
        sap.ui.core.routing.Router.getRouter("MyRouter").attachRoutePatternMatched(this.onRouteMatched, this);

    },
    onRouteMatched: function(evt) {
       oRepdashboard = this;
       this.repdashModel = new sap.ui.model.json.JSONModel();
       this.getDetails();
    },
    
    handleLinkPress:function(evt){
		var global = sap.ui.getCore().getModel("global").getData();
		var link = evt.getSource().getParent().getParent().getBindingContextPath();
		var selectedData = this.getView().getModel("repdash").getProperty(link);
		global.ZZ_DEP_PERNR = selectedData.EmpNo ;
		global.ZZ_TRV_REQ = selectedData.RepReqNo;
	    global.ZZ_VERSION = selectedData.version;
	    global.ZZ_COMABBR = selectedData.combbar;
	    global.display = "NoActions";
	    sap.ui.core.routing.Router.getRouter("MyRouter").navTo("Repatriation", {
			"TpNo": Base64.encode(selectedData.RepReqNo),
			"EmpNo":Base64.encode(selectedData.EmpNo)
		});
	},	
   getDetails: function(){
   	var oThis = this;
   	var SelectedTab = oThis.getView().byId("idRepDashIconTabbar").getSelectedKey();
		
		if(this.getView().getModel("repdash")  != undefined && this.getView().getModel("repdash").getData() != undefined)
		{
			var query = this.getView().getModel("repdash").getData().searchVal;
			this.SearchVal = query;
		}
		if(SelectedTab == 'all' && query && query.length == 10){			
			var TpNo = query;
			var queryURL =  "RepsDepuDboardSet?$filter=RepReqNo eq '" +TpNo+"' and Action eq '"+ SelectedTab +"'" ;
			this.servicecall = true;
		}
		else if(SelectedTab == 'all' && query && query.length == 8){
			var EmpNo = query;
			var queryURL =  "RepsDepuDboardSet?$filter=EmpNo eq '" +EmpNo+"' and Action eq '"+ SelectedTab +"'" ;
			this.servicecall = true;
		}
		else if(SelectedTab == 'all'){
			this.servicecall = false;
			var repModel = this.getView().getModel("repdash").getData();
			repModel.results = [];
			repModel.search = true;
			repModel.searchDate = false;
			repModel.hideStatus = false;
			this.getView().getModel("repdash").refresh(true);
		}
		else if(SelectedTab == 'approved'){
			//this.servicecall = false;
			var repModel = this.getView().getModel("repdash").getData();	
			if (repModel.StartFrom == undefined){
				repModel.StartFrom = "";
			}
			if (repModel.StartTo == undefined){
				repModel.StartTo = "";
			}
			if (repModel.StartTo != "" && repModel.StartFrom != "" && repModel.StartFrom >= repModel.StartTo){
				sap.m.MessageBox.error("Start date can't be grater than End date"); 
				return;
			}
			this.StartFrom = repModel.StartFrom;
			this.StartTo = repModel.StartTo;
			repModel.results = [];
			repModel.searchDate = true;
			repModel.search = false;
			repModel.hideStatus = false;
			this.getView().getModel("repdash").refresh(true);
			var TpNo = query;
			var queryURL =  "RepsDepuDboardSet?$filter=Sbegda eq '" +repModel.StartFrom+"' and Sendda eq '"+ repModel.StartTo +"' and Action eq '"+ SelectedTab +"'";
			this.servicecall = true;
		}
		else{
		var queryURL =  "RepsDepuDboardSet?$filter=Action eq '"+ SelectedTab +"'";
		this.servicecall = true;
		}
		if(this.servicecall == true)
		{
   	 	var repdashModel = new sap.ui.model.json.JSONModel();
   	 	sap.ui.project.e2etm.util.StaticUtility.setBusy(true, oRepdashboard);
        // var queryURL =  "RepsDepuDboardSet?$filter=Action eq '"+ SelectedTab +"'";
     	oDataModel.read(queryURL, null, null, true, function(oData, response) {
     		if(SelectedTab == 'coming'){
     			oData.hideHrlpp = false;
     			oData.hidelink = false;
     			oData.hidetext = true;
     		}
     		else
     		{
     			oData.hideHrlpp = true;
     			oData.hidelink = true;
     			oData.hidetext = false;
     		}
     		
     		if(SelectedTab == 'all'){
     			oData.search = true;
     		}
     		else
     		{
     			oData.search = false;
     		}
     		if(oThis.SearchVal !== undefined){
     			oData.searchVal = oThis.SearchVal;
     		}
     		else{
     			oData.searchVal = "";
     		}
     		if(SelectedTab == 'inprocess'){
     			oData.hideStatus = true;
     		}
     		else
     		{
     			oData.hideStatus = false;
     		}
     		if(SelectedTab == 'approved'){
     			oData.searchDate = true;
     		}
     		else
     		{
     			oData.searchDate = false;
     		}
     		oData.StartFrom = oThis.StartFrom;
     		oData.StartTo = oThis.StartTo;
     		//oThis.repdashModel.searchVal = (oThis.repdashModel.searchVal != "" && oThis.repdashModel.searchVal != undefined) ? repModel.searchVal:"";
     		sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oRepdashboard);
     		repdashModel.setData(oData);
     		oThis.getView().setModel(repdashModel,"repdash");
 		}, function(error) {
 			sap.m.MessageToast.show("Internal Server Error");
 			sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oRepdashboard);
 		}); 
 		}
   },

   /*######################## onPress Excel download button ##########################*/
   excelDownload: function() {
       var aData = this.getView().getModel("repdash");
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
       saveAs(blob, "Reps.xlsx");
   },
   /*################## Table preparation for XlSX file download #######################*/
   prepareTableData: function() {
	   var SelectedTab = this.getView().byId("idRepDashIconTabbar").getSelectedKey();
	   if(SelectedTab =="inprocess"){
		   var item = 0;
	   }else if(SelectedTab =="approved"){
		   var item = 1;
	   }else if(SelectedTab =="all"){
		   var item = 2;
	   }else if(SelectedTab =="coming"){
		   var item = 3;
	   }
       var table = this.getView().byId("idRepDashIconTabbar").getItems()[item].getContent()[0].getItems()[0];
       var allColumns = table.getColumns();
       var columns = [];
       for(var i=0;i<allColumns.length;i++){
    	   if(allColumns[i].mProperties.visible == true){
    		   columns.push(allColumns[i]); 
    	   }
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
               if(property == undefined){
            	   try{
            		   property =  table.getItems()[i].getCells()[j].getItems()[0].mProperties.text;
            	   }catch(err){
            		   property =  table.getItems()[i].getCells()[j].getItems()[1].mProperties.text;
            	   }
               }
               if(SelectedTab == "inprocess" && j !== 9){
               		aBuffer.push("<td width='450px'>" + property + "</td>");
               }else if( SelectedTab == "all" && j !== 3 && j !== 9){
               		aBuffer.push("<td width='450px'>" + property + "</td>");
               }
               else if( SelectedTab == "approved" && j !== 3){
             		aBuffer.push("<td width='450px'>" + property + "</td>");
               }
               else if( SelectedTab == "coming" && j !== 3 && j !== 4 && j !== 9){
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
   
   
});