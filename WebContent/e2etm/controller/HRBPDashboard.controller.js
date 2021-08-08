jQuery.sap.require("sap.ui.project.e2etm.util.Formatter");
jQuery.sap.require("sap.ui.project.e2etm.util.StaticUtility");

sap.ui.controller("sap.ui.project.e2etm.controller.HRBPDashboard", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf e2etm.view.AccmTool
*/
	onInit: function() {

		sap.ui.core.routing.Router.getRouter("MyRouter").attachRoutePatternMatched(this.onRouteMatched, this);
	//	sap.ui.core.routing.Router.getRouter("MyRouter").attachRouteMatched(this.onGenRouteMatched, this);
//		if(sap.ui.getCore().getModel("profile").getData().currentRole == "REPP"){			//uea6kor_uml6kor 22.9.2020 personal trip report
//			 this.getView().byId("btnPersTripReport").setVisible(true);
//		}
	},

	onRouteMatched : function(evt) {
		sap.ui.getCore().getModel("hrbp").refresh();
		sap.ui.core.BusyIndicator.hide();

	},
	handleLinkPress:function(evt){
		var global = sap.ui.getCore().getModel("global").getData();
		var link = evt.getSource().getParent().getBindingContextPath();
		if(evt.getSource().getId().indexOf("idHRBPTable") != -1){
			var selectedData = this.getView().getModel("hrbp").getProperty(link);
			global.display = "" ;
		}
		else {
			var selectedData = this.getView().getModel("hrpp").getProperty(link);
			global.display = "NoActions";
		}
		
		global.ZZ_DEP_PERNR = selectedData.ZZ_REP_PERNR ;
		global.ZZ_TRV_REQ = selectedData.ZZ_REP_REQ;
	    global.ZZ_VERSION = selectedData.ZZ_VERSION;
	    global.ZZ_COMABBR = selectedData.ZZ_COMABBR;
	    sap.ui.core.routing.Router.getRouter("MyRouter").navTo("Repatriation", {
			"TpNo": Base64.encode(selectedData.ZZ_REP_REQ),
			"EmpNo":Base64.encode(selectedData.ZZ_REP_PERNR)
		});
		
	},
	onHomePress:function(){
		 window.history.go(-1);
	},
	onSearh:function(){
		var oThis = this;
		sap.ui.core.BusyIndicator.show(1);
		var hrppModel = new sap.ui.model.json.JSONModel();
		var query = this.getView().byId("idHRPPSearch").getValue();
		
		if(query.length == 10){
			var TpNo = query;
			var EmpNo = "00000000";
			var queryURL =  "RepatriationSet(ZZ_REP_REQ='" + TpNo  + "',ZZ_REP_PERNR='"+EmpNo+"')";
		}
		else if(query.length == 8){
			var EmpNo = query;
			var TpNo = "";
			var queryURL =  "RepatriationSet?$filter=ZZ_REP_PERNR eq '" +EmpNo+"'" ;
		}
		else{
			this.Error = "Please enter valid TP No";
			sap.m.MessageToast.show(this.Error);
			sap.ui.core.BusyIndicator.hide();
		}
		if(this.Error =="" || this.Error == undefined){
		
    	oDataModel.read(queryURL, null, null, true, function(oData, response) {
    		sap.ui.core.BusyIndicator.hide();
    		if(oData.results){
    			hrppModel.setData(oData.results);
    		}
    		else if(Array.isArray(oData) == false){
    			if(oData.ZZ_REP_PERNR && oData.ZZ_REP_REQ){
    				var results = [];
    	    		results.push(oData);
    	    		hrppModel.setData(results);
        		}
        		else{
        			sap.m.MessageToast.show("Please enter valid TP No/Emp No");
        		}
    		}
    		else{
    			sap.m.MessageToast.show("Please enter valid TP No/Emp No");
    		}
    		oThis.getView().setModel(hrppModel,"hrpp");
		}, function(error) {
			sap.m.MessageToast.show("Internal Server Error");
			sap.ui.core.BusyIndicator.hide();
		});
		}
	},
	onPressApprove:function(){
		 var Obj_List = this.getView().byId("idHRBPTable");
		 var contexts = Obj_List.getSelectedContexts();
		 var TableData = contexts.map(function(c) {
		                    return c.getObject();
		                });
		 if(TableData.len >0){
			 for(var i =0;i<TableData.length;i++){
				 // HRBP Approve
				 if(oThis.currentRole == "REBP"&& value=="Approve"){
					 TableData[i].ZZ_ACTION = "04";
					 TableData[i].ZZ_NEXTACTION = "";
					 TableData[i].ZZ_ROLE = "03";
			    	}
			    	// HRL-PP3 Approve
			    	else if(oThis.currentRole == "REPP"&& value=="Approve"){
			    		TableData[i].ZZ_ACTION = "05";
			    		TableData[i].ZZ_NEXTACTION = "";
			    		TableData[i].ZZ_ROLE = "04";
			    	}
			 }
			
			// service call
		    	oDataModel.create("RepatriationSet", postData, null, jQuery.proxy(function(oData, response) {
					sap.m.MessageToast.show("Sent Successfully");
					sap.ui.core.BusyIndicator.hide();
					oThis.getView().getModel("hrbp").refresh();
				},this), jQuery.proxy(function(error) {
					sap.m.MessageToast.show("Internal Server Error");
					sap.ui.core.BusyIndicator.hide();
				},this), true);
		 }
		 else{
			 sap.m.MessageToast.show("Select atleast one row");
		 }
		 
	},
	onPressRefresh:function(){
		var that= this;
		sap.ui.core.BusyIndicator.show(1);
		
		//setTimeout(function(){ that.onRouteMatched();}, 3000);


		var oThis = this;
		sap.ui.core.BusyIndicator.show(1);
		var profile = sap.ui.getCore().getModel("profile").getData();
		oThis.currentRole = profile.currentRole;
		if(oThis.currentRole == "REBP"){
			//var action = profile.employeeDetail.ZZ_DEP_PERNR;
			var action="88888888";
		}
		else if(oThis.currentRole == "REPP"){
			var action ="99999999";
		}
		
		var hrbpModel = new sap.ui.model.json.JSONModel();
        var filterURL =  "RepatriationSet?$filter=ZZ_NEXTACTION eq '" +action+"'" ;
    	oDataModel.read(filterURL, null, null, true, function(oData, response) {
    		sap.ui.core.BusyIndicator.hide();
    		hrbpModel.setData(oData);
    		sap.ui.getCore().setModel(hrbpModel,"hrbp");
		}, function(error) {
			sap.m.MessageToast.show("Internal Server Error");
			sap.ui.core.BusyIndicator.hide();
		});
	
	},
	onSelectIconTabBar:function(){
		var selectedKey = this.getView().byId("idHrBpIconTab").getSelectedKey();
		
		if(selectedKey == "Closed"){
			this.getView().byId("idHrBpRefresh").setVisible(false);
		}
		else{
			this.getView().byId("idHrBpRefresh").setVisible(true);
		}
	},
	onViewReportPress:function(){
		sap.ui.core.routing.Router.getRouter("MyRouter").navTo("HRBPReports");
	},
	//uea6kor-uml6kor_22.9.2020 personal trip report
	onPersTripReportPress :function(){
			sap.ui.core.routing.Router.getRouter("MyRouter").navTo("personaltripreport", {
				"role": Base64.encode("REPP")
			});
	}, 
	//uea6kor-uml6kor_22.9.2020 personal trip report
/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf e2etm.view.AccmTool
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf e2etm.view.AccmTool
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf e2etm.view.AccmTool
*/
//	onExit: function() {
//
//	}

});