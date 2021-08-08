jQuery.sap.require("sap.ui.core.util.Export");
jQuery.sap.require("sap.ui.core.util.ExportType");
jQuery.sap.require("sap.ui.core.util.ExportTypeCSV");
jQuery.sap.require("sap.ui.project.e2etm.util.Formatter");
jQuery.sap.require("sap.ui.project.e2etm.util.StaticUtility");
jQuery.sap.require("sap.ui.ux3.NotificationBar");

sap.ui.controller("sap.ui.project.e2etm.controller.Registration", {

	onInit: function() {
		oController = this;
		
		sap.ui.core.routing.Router.getRouter("MyRouter").attachRoutePatternMatched(oController.onRouteMatched, oController); 
		
	
	},
	
	onRouteMatched:function(evt){
		if(evt.getParameter("name")=="Registration"){
		oController.getReq(oController.getView().byId("RegIconBar").getSelectedKey());	
		}
	},

	RegistrationTabBarSelect:function(evt){
		oController.getReq(oController.getView().byId("RegIconBar").getSelectedKey());
	},
	
	onItemPress:function(evt){
		var itemData = this.getView().getModel("RegistrationSet").getProperty(evt.getParameter("listItem").getBindingContext("RegistrationSet").sPath);
		
		sap.ui.core.routing.Router.getRouter("MyRouter").navTo("RegistrationDetails",{reinr:itemData.Reinr,pernr:itemData.Pernr,ttype:itemData.TType,query:{
			Tab:oController.getView().byId("RegIconBar").getSelectedKey(),
			
		}});	
	},
	
	handleRefresh:function(evt){
		oController.getReq(oController.getView().byId("RegIconBar").getSelectedKey());
		oController.getView().byId("pullToRefresh").setBusy(false);
	},
	RegsSearch:function(evt){
			var table = evt.getSource().getParent().getParent();
			var value = evt.getSource().getValue();
			var aFilters = [new sap.ui.model.Filter({path:"Reinr",operator:"Contains",value1:value}),
	         	new sap.ui.model.Filter({path:"Pernr",operator:"Contains",value1:value}),
	         	new sap.ui.model.Filter({path:"Name",operator:"Contains",value1:value}),
	         	new sap.ui.model.Filter({path:"begda",operator:"Contains",value1:value}),
	         	new sap.ui.model.Filter({path:"endda",operator:"Contains",value1:value}),
	         	new sap.ui.model.Filter({path:"rdate",operator:"Contains",value1:value}),
	         	new sap.ui.model.Filter({path:"cntry",operator:"Contains",value1:value}),
	         	];

	        var oFilter = new sap.ui.model.Filter(aFilters,false);
	        table.getBinding("items").filter(oFilter);
	
		
		
	},
	getReq:function(Key){
		var oDataModel = new sap.ui.model.odata.ODataModel(sServiceUrl);	
		sap.ui.project.e2etm.util.StaticUtility.setBusy(true, oController);
		oDataModel.read("RegistrationSet?$filter=Tab eq '" + Key + "'", null, null, true, jQuery.proxy(function(oData, response) {
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(oData.results);
			oController.getView().byId("RegsTableFragment--RegistrationTable")
			var oTable= oController.getView().byId("RegsTableFragment--RegistrationTable")
			  oTable.setModel(oModel,'RegistrationSet'); 
			  this.getView().setModel(oModel,'RegistrationSet');
			sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oController);
		},this), function(error) {
			sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oController);
		});
	},
});