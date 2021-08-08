sap.ui.controller("sap.ui.project.e2etm.controller.RegistrationDetails", {
	
	onInit: function() {

		oThis = this;
		var pernr;
		var reinr;
		var TcktReinr;
		var tab;
		var ttype;
		sap.ui.core.routing.Router.getRouter("MyRouter").attachRoutePatternMatched(this.onRouteMatched, this);
		var fileModel = new sap.ui.model.json.JSONModel();
		fileModel.setData({
			Files : []
		});
		oThis.getView().setModel(fileModel, "new");	
	},

	onRouteMatched:function(evt){ 
		if(evt.getParameter("name")=="RegistrationDetails"){
		 reinr = evt.getParameter("arguments").reinr;
		 pernr = evt.getParameter("arguments").pernr;
		 ttype = evt.getParameter("arguments").ttype
		 tab  = evt.getParameters().arguments["?query"].Tab;
		 TcktReinr = reinr.substring(2, 10);
		var EnabledataModel =  new sap.ui.model.json.JSONModel();
		var EnableData = {};
		var oDataModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
		var batchOperation1 = oDataModel.createBatchOperation("TRV_HDRSet(ZZ_PERNR='" + pernr + "',ZZ_DEP_REQ='" + reinr + "',ZZ_VERSION='',ZZ_TRV_TYP='" + ttype + "')", "GET");
		var batchOperation2 = oDataModel.createBatchOperation("RegistrationDetailsSet?$filter=REINR+eq+'" + reinr + "'+and+PERNR+eq+'" + pernr + "'", "GET");
		var batchOperation3 = oDataModel.createBatchOperation("DmsDocsSet?$filter=DepReq+eq+'" + TcktReinr + "'+and+EmpNo+eq+'" + pernr + "'+and+DocType+eq+'TCK'", "GET");
		var batchOperation4 = oDataModel.createBatchOperation("SimCardEmpDataSet(pernr='" + pernr + "')", "GET");
		var aBatch = [ batchOperation1, batchOperation2,batchOperation3,batchOperation4];
		oDataModel.addBatchReadOperations(aBatch);
		sap.ui.project.e2etm.util.StaticUtility.setBusy(true, oThis);
		oDataModel.submitBatch(jQuery.proxy(function(oResults) { 	
		var oModel = new sap.ui.model.json.JSONModel();	
			oModel.setData(oResults.__batchResponses[0].data);
			this.getView().setModel(oModel,'empTravelData');			
			var oRegistrationDetailsModel = new sap.ui.model.json.JSONModel();	
			if(oResults.__batchResponses[1].data.results.length!=0){
				oRegistrationDetailsModel.setData(oResults.__batchResponses[1].data.results);
			}else{
				var RegDetailsData=[];
				RegDetailsData.push({"REINR":reinr,
					"PERNR":pernr,
					"REGDETAILS":"",
					"BEGDA":"",
					"ENDDA":"",
					"REMARKS":""});
				oRegistrationDetailsModel.setData(RegDetailsData);
			}
			this.getView().setModel(oRegistrationDetailsModel,'RegistrationDetailsSet');
			oThis.getView().byId("UploadCollection").aItems = [];
			var filesAll = oResults.__batchResponses[2].data.results;
			var oEmpModel = new sap.ui.model.json.JSONModel();	
			oEmpModel.setData(oResults.__batchResponses[3].data);
			this.getView().setModel(oEmpModel,'EmpData');	
			var uploadData = oThis.getView().getModel("new").getData();
			uploadData.Files = filesAll;
			oThis.getView().getModel("new").setData(uploadData);
			oThis.getView().getModel("new").refresh(true);
//			new change
			if(tab=='C'){
				EnableData={ editable:false }
			}else{
				EnableData={ editable:true }
			}
			EnabledataModel.setData(EnableData);
			this.getView().setModel(EnabledataModel,"EnabledataModel");
			sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oThis);
		},this),function(error){
			
			sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oThis);
		});
		}
	},
	
	onBack:function(evt){
		
		sap.ui.core.routing.Router.getRouter("MyRouter").navTo("Registration");
		
	},	
	onAdd:function(evt){
		if(evt.getParameter("id").indexOf("RegDetailAdd")!=-1){
		var TableData = this.getView().getModel("RegistrationDetailsSet").getData();
		TableData.push({"REINR":"",
						"PERNR":"",
						"REGDETAILS":"",
						"BEGDA":"",
						"ENDDA":"",
						"REMARKS":""});
	this.getView().getModel("RegistrationDetailsSet").setData(TableData);
		
		
		}
		
	},	
  onDel:function(evt){
	  if(evt.getSource().getParent().getParent().getSelectedContextPaths()[0]==undefined){
		  sap.m.MessageToast.show("Please select atleast one row");
	  }else{
	  var indexSelected = evt.getSource().getParent().getParent().getSelectedContextPaths()[0].substring(1);
	  var RegsDetailsData = this.getView().getModel("RegistrationDetailsSet").getData();
	  RegsDetailsData.splice(indexSelected,1);
	  this.getView().getModel("RegistrationDetailsSet").setData(RegsDetailsData);
	  }
	  
  },
	
  onClose:function(evt){
	  var RegsDetailsData =  this.getView().getModel("RegistrationDetailsSet").getData();
	  var oData = {};
	  var Error;
	  Error="";
	  for(i=0;i<RegsDetailsData.length;i++){
		if(RegsDetailsData[i].REGDETAILS=="" || RegsDetailsData[i].BEGDA=="" || RegsDetailsData[i].BEGDA=="" )  {
			sap.m.MessageToast.show("Please Enter Mandatory fields");
			var Error ='E';
		}
	  }
	if( Error==""){  
		sap.ui.project.e2etm.util.StaticUtility.setBusy(true, this);
	 var oDataModel =  new sap.ui.model.odata.ODataModel(sServiceUrl);
	 oData = { Reinr:reinr,
			 Pernr:pernr,
			 Name:"",
			 Begda:"",
			 Endda:"",
			 Rdate:"",
			 Cntry:"",
			 TType:"",
			 Tab  :"C" };	
	  
	 oData.RegistrationtoDetailsNav=[];
	 for(i=0;i<RegsDetailsData.length;i++){
		 oData.RegistrationtoDetailsNav.push({"REINR":reinr,
										  "PERNR":pernr,
										  "REGDETAILS":RegsDetailsData[i].REGDETAILS,
										  "BEGDA":RegsDetailsData[i].BEGDA,
										  "ENDDA":RegsDetailsData[i].ENDDA,
										  "REMARKS":RegsDetailsData[i].REMARKS});
	 
	 }
	 oDataModel.create("RegistrationSet", oData, null, function(oData, response) {		
				sap.m.MessageToast.show("Data has been saved");
			sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oThis);
			oThis.onBack();
		}, function(error) {
			sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oThis);
			sap.m.MessageToast.show("Internal Server Error");
		}, true);	
	  
	}
		},
	
	
	
});