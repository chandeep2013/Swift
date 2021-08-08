jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.ui.project.e2etm.util.Formatter");
jQuery.sap.require("sap.ui.project.e2etm.util.StaticUtility");
sap.ui.controller("sap.ui.project.e2etm.controller.FeedBackReport", {

	/**
	 * Called when a controller is instantiated and its View controls (if
	 * available) are already created. Can be used to modify the View before it
	 * is displayed, to bind event handlers and do other one-time
	 * initialization.
	 * 
	 * @memberOf e2etm.view.AccmTool
	 */
	onInit : function() {
		oFthis = this;
		sap.ui.core.routing.Router.getRouter("MyRouter")
				.attachRoutePatternMatched(this.onRouteMatched, this);
		

	},
	onRouteMatched : function(evt) {
		var that = this;
		sap.ui.core.BusyIndicator.show(-1);
		this.oDataModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
		var oGlobal = sap.ui.getCore().getModel("global").getData();
        sap.ui.getCore().getModel("global").setData(oGlobal);
        var oModel = new sap.ui.model.json.JSONModel();
		ofeedbackrep = this;
		oFthis.getView().getModel("profile").setData(sap.ui.getCore().getModel("profile").getData());
		//oFthis.fetchDetails();
		this.oDataModel.read("DEP_COUNTRIESSet", null, null, true, function(oData, response) {
    		sap.ui.core.BusyIndicator.hide();
    		 oModel.setSizeLimit(oData.results.length);
    		oModel.setData(oData);
    		that.getView().setModel(oModel, "reports");
		}, function(error) {
			sap.m.MessageToast.show("Internal Server Error");
			sap.ui.core.BusyIndicator.hide();
		});
	},
	onCountryChange:function(){/*
    	var cnty = this.getView().byId("idFeedbackCountry").getSelectedKeys();
    	var aFilters = [];
        aFilters.push(new sap.ui.model.Filter({path:"ToCountry",operator:"EQ",
        	                                   value1:cnty }));    

        var oTemplate = new sap.ui.core.Item({key:"{Key}",text:"{AsgType}"});

        this.getView().byId("idFeedbackAssignment").bindItems({path:"/AsgModelsF4Set",template:oTemplate,filters:aFilters});	
    */},
    handleClearSearchFilters:function(){
    	this.getView().byId("idFeedbackCountry").setSelectedKeys([]);
    	this.getView().byId("idFeedbackAssignment").setSelectedKeys([]);
    	this.getView().byId("idFeedbackCountry").setValue("");
    	this.getView().byId("idFeedbackAssignment").setValue("");
    },
    

	fetchDetails : function() {
		var oProfData = sap.ui.getCore().getModel("profile").getData();
		var oGlobalD = sap.ui.getCore().getModel("global").getData();
		var trvtyp;
		var asgmod;
		var depReq;
		var queryURL = "DeputationFeedbackReport";
		var cnty = this.getView().byId("idFeedbackCountry").getSelectedKeys().toString();
		var model = this.getView().byId("idFeedbackAssignment").getSelectedKeys().toString();
		
		sap.ui.core.BusyIndicator.show(1);
		var service = "DeputationFeedbackReport/?Country='"+cnty+"'&Model='"+model+"'&$format=json";
    	
		this.oDataModel.read(service, null, null,
				true, function(oData, response) {
					var data = JSON.parse(response.body);
					var oModelf = new sap.ui.model.json.JSONModel();
					var fdata = data.d;// .results;
					for (var j = 0; j < fdata.results.length; j++) {
						var ivdata = fdata.results[j].ZZ_E2E_QA.split(";");
						for(var i=0;i<ivdata.length;i++){
							if(ivdata[i] && ivdata[i].split("/")[0] == "Initiative"){
								fdata.results[j].Ini = ivdata[i] ? ivdata[i].split("/")[1]: "NA";
							}
							else if(ivdata[i] && ivdata[i].split("/")[0] == "Error free transaction"){
								fdata.results[j].Errfr = ivdata[i]? ivdata[i].split("/")[1]: "NA";
							}
							else if(ivdata[i] && ivdata[i].split("/")[0] == "Availability"){
								fdata.results[j].Avai = ivdata[i] ? ivdata[i].split("/")[2]: "NA";
							}
							else if(ivdata[i] && ivdata[i].split("/")[0] == "Competence"){
								fdata.results[j].Comp = ivdata[i] ? ivdata[i].split("/")[1]: "NA";
							}
							else if(ivdata[i] && ivdata[i].split("/")[0] == "Courtesy"){
								fdata.results[j].Court = ivdata[i] ? ivdata[i].split("/")[1]: "NA";
							}
							else if(ivdata[i] && ivdata[i].split("/")[0] == "Responsiveness"){
								fdata.results[j].Resp = ivdata[i] ? ivdata[i].split("/")[1]: "NA";
							}
							else if(ivdata[i] && ivdata[i].split("/")[0] == "Quality"){
								fdata.results[j].Qual = ivdata[i] ? ivdata[i].split("/")[1]: "NA";
							}
							else if(ivdata[i] && ivdata[i].split("/")[0] == "Communication"){
								fdata.results[j].Comm = ivdata[i] ? ivdata[i].split("/")[1]: "NA";
							}
							else if(ivdata[i] && ivdata[i].split("/")[0] == "Reliability"){
								fdata.results[j].Reli = ivdata[i] ? ivdata[i].split("/")[1]: "NA";
							}
							else if(ivdata[i] && ivdata[i].split("/")[0] == "Lead Time"){
								fdata.results[j].lead = ivdata[i] ? ivdata[i].split("/")[1]: "NA";
							}
						}
						
						/*fdata.results[j].lead = ivdata[9] ? ivdata[9].split("/")[1]: "NA"; 
						fdata.results[j].Reli = ivdata[8] ? ivdata[8].split("/")[1]: "NA";
						fdata.results[j].Comm = ivdata[7] ? ivdata[7].split("/")[1]: "NA";
						fdata.results[j].Qual = ivdata[6] ? ivdata[6].split("/")[1]: "NA";
						fdata.results[j].Resp = ivdata[5] ? ivdata[5].split("/")[1]: "NA";
						fdata.results[j].Court = ivdata[4] ?ivdata[4].split("/")[1]: "NA";
						fdata.results[j].Comp = ivdata[3] ? ivdata[3].split("/")[1]: "NA";
						fdata.results[j].Avai = ivdata[2] ? ivdata[2].split("/")[2]: "NA";
						fdata.results[j].Errfr = ivdata[1]? ivdata[1].split("/")[1]: "NA";
						fdata.results[j].Ini = ivdata[0] ? ivdata[0].split("/")[1]: "NA";*/
					}
					oModelf.setData(fdata);
					sap.ui.getCore().setModel(oModelf, "fbModel");
					sap.ui.core.BusyIndicator.hide();
				}, function(error) {
					sap.m.MessageToast.show("Internal Server Error");
					sap.ui.project.e2etm.util.StaticUtility.setBusy(false,
							oFthis);
				});

	},

	handleLinkPress : function(evt) {
		var that= this;
		var path = evt.getSource().getParent().getBindingContextPath();
		var screenData = this.getView().getModel("fbModel").getProperty(path);
		var sDeputationNo = screenData.DeputationRequest;
		var get = $.ajax({
			cache: false,
			url: sServiceUrl + "DEP_HDR_INFOSet(ZZ_DEP_REQ='" + sDeputationNo + "',ZZ_VERSION='')?$expand=HDR_ITEM&$format=json",
			type: "GET"
		});
		get.done(function(data, header, response) {
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData(data.d);
				that.getView().setModel(oModel,"depData");
				that.feedbackgetservicecall(screenData);
				if (!that.oCommonDialog) {
						that.oCommonDialog = sap.ui.xmlfragment("sap.ui.project.e2etm.fragment.deputation.COMMON.FeedBackDialog", that);
						that.getView().addDependent(that.oCommonDialog);
				} 
				that.oCommonDialog.open();
		});
	},
	feedbackgetservicecall:function(screenData){
		var role = sap.ui.getCore().getModel("profile").getData().currentRole;
		screenData.TravelType = "DEPU";
		/*screenData.AssignmentModel = "STX";*/
		
		sap.ui.core.BusyIndicator.show(1);
		 var queryURL = "FeedbackFormSet?$filter=Role eq '" + role +"' and TravelType eq '" + screenData.TravelType +"' and AssignmentModel eq '"+ screenData.AssignmentModel +"' and EmployeeNumber eq '"
		 + screenData.EmployeeNumber +"' and DeputationRequest eq'"+ screenData.DeputationRequest +"' &$format=json";
		 this.oDataModel.read(queryURL, null, null,
				true, function(oData, response) {
					var data = JSON.parse(response.body);
					var QAModel = new sap.ui.model.json.JSONModel();
					sap.ui.core.BusyIndicator.hide();
					for(var i=0;i<data.d.results.length;i++){
						data.d.results[i].Role = role;
						data.d.results[i].DeputationRequest = screenData.ZZ_DEP_REQ;
						data.d.results[i].TravelType = screenData.ZZ_REQ_TYP;
						data.d.results[i].AssignmentModel = screenData.ZZ_ASG_TYP;
						data.d.results[i].EmployeeNumber = screenData.ZZ_DEP_PERNR;
					}
					QAModel.setData(data.d);
					sap.ui.getCore().setModel(QAModel, "QAModel");

				}, function(error) {
					sap.m.MessageToast.show("Internal Server Error");
					sap.ui.core.BusyIndicator.hide();
				});

	},
	onSearch:function(){var query = this.getView().byId("SearchId").getValue();
			var EmpName = new sap.ui.model.Filter("EmpName", sap.ui.model.FilterOperator.Contains, query);
			var EmployeeNumber = new sap.ui.model.Filter("EmployeeNumber", sap.ui.model.FilterOperator.Contains, query);
			var DeputationRequest = new sap.ui.model.Filter("DeputationRequest", sap.ui.model.FilterOperator.Contains, query);
	        var filters = new sap.ui.model.Filter([EmpName, EmployeeNumber,DeputationRequest]);
	       	var listassign = this.getView().byId("idfbTable");
	        listassign.getBinding("items").filter(filters, "Appliation");
	},
	onCloseFeedbackDialog:function(){
		this.oCommonDialog.close();
	},
	/*######################## onPress Excel download button ##########################*/
	   excelDownload: function() {
	       var aData = this.getView().getModel("fbModel");
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
	       var table = this.getView().byId("idfbTable");
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
	               if(property == undefined){
	            	   property = table.getItems()[i].getCells()[j].mProperties.value;
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

/**
 * Similar to onAfterRendering, but this hook is invoked before the controller's
 * View is re-rendered (NOT before the first rendering! onInit() is used for
 * that one!).
 * 
 * @memberOf e2etm.FeedBackForm
 */
// onBeforeRendering: function() {
//
// },
/**
 * Called when the View has been rendered (so its HTML is part of the document).
 * Post-rendering manipulations of the HTML could be done here. This hook is the
 * same one that SAPUI5 controls get after being rendered.
 * 
 * @memberOf e2etm.FeedBackForm
 */
// onAfterRendering: function() {
//
// },
/**
 * Called when the Controller is destroyed. Use this one to free resources and
 * finalize activities.
 * 
 * @memberOf e2etm.FeedBackForm
 */
// onExit: function() {
//
// }
});