jQuery.sap.require("sap.ui.core.util.Export");
jQuery.sap.require("sap.ui.core.util.ExportType");
jQuery.sap.require("sap.ui.core.util.ExportTypeCSV");
jQuery.sap.require("sap.m.MessageBox");
sap.ui.controller("sap.ui.project.e2etm.controller.MISReport", {
	/**
	 * Called when a controller is instantiated and its View controls (if
	 * available) are already created. Can be used to modify the View before it
	 * is displayed, to bind event handlers and do other one-time
	 * initialization.
	 * 
	 * @memberOf e2etm.view.MISReport
	 */
	onInit : function() {
		var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
		var properties = [];
		oModel.attachMetadataLoaded(null, jQuery.proxy(function() {
			var oMetadata = oModel.getServiceMetadata();
			var enitytypes = oMetadata.dataServices.schema[0].complexType;
			$.each(enitytypes, function(index, entity) {
				if (entity["name"] == "MIS_DATA") {
					properties = entity["property"];
					return false;
				}
			});
			var table = this.getView().byId("tableMis");
			for ( var i = 0; i < properties.length; i++) {
				var label = "";
				$.each(properties[i].extensions, function(index, extension) {
					if (extension["name"] == "label") {
						label = extension["value"];
						return false;
					}
				});
				if (label == "") {
					label = properties[i].name;
				}
				var column;
				if(properties[i].name == "ZZ_CCDEPT" || properties[i].name ==  "ZZ_CLENTY" ||  properties[i].name ==  "EMP_PASS_VALID"
					|| properties[i].name == "EMP_WORK_LOC" || properties[i].name == "SPOUSE_NAME" || properties[i].name == "SPOUSE_DOB" ||properties[i].name ==  "CHILD1_NAME"
					|| properties[i].name ==  "CHILD1_DOB" || properties[i].name ==  "CHILD2_NAME" ||properties[i].name ==  "CHILD2_DOB"
					|| properties[i].name == "INVI_REC_DATE" || properties[i].name == "PASS_REC_DATE_AFVISA"|| properties[i].name ==  "CHILD3_NAME" ||properties[i].name ==  "CHILD3_DOB" || properties[i].name == "ZZ_TRV_PUR"
					|| properties[i].name == "EMP_VISA_NO" 
					|| properties[i].name == "EMP_VISA_TYP" || properties[i].name == "COOL_OFF_DAYS" || properties[i].name == "SP_VISA_NO"
					|| properties[i].name == "SP_VISA_STDATE" || properties[i].name == "SP_VISA_ENDATE" || properties[i].name == "SP_VISA_TYP"
					|| properties[i].name == "CH1_VISA_NO" || properties[i].name == "CH1_VISA_STDATE" || properties[i].name == "CH1_VISA_ENDATE"
				    || properties[i].name == "CH1_VISA_TYP" || properties[i].name == "CH2_VISA_NO" || properties[i].name == "CH2_VISA_STDATE"
				    || properties[i].name == "CH2_VISA_ENDATE" || properties[i].name == "CH2_VISA_TYP" || properties[i].name == "CH3_VISA_NO"
				    || properties[i].name == "CH3_VISA_STDATE" || properties[i].name == "CH3_VISA_ENDATE" || properties[i].name == "CH3_VISA_TYP"
				    || properties[i].name == "VISA_CLR_DATE" 
				    || properties[i].name == "CL_ACPT_DATE" || properties[i].name == "NDAYS_VISA_STAMP" || properties[i].name == "CGGS_AMT"
				    || properties[i].name == "TAGS_AMT" || properties[i].name == "SAL_DIFF" || properties[i].name == "ZZ_SERV_TYP"
				    || properties[i].name == "ZZ_ADD_ACC" || properties[i].name == "RTDAT" || properties[i].name == "ZZ_DEP_FRMLOC" || properties[i].name == "ZZ_DEP_TOLOC" 
				    || properties[i].name == "EM_TR_STDATE" || properties[i].name == "EM_TR_ENTDATE" || properties[i].name == "SEC1_TR_STDATE"
				    || properties[i].name == "SEC1_TR_ENDATE" || properties[i].name == "SEC2_TR_STDATE"|| properties[i].name == "SEC2_TR_ENDATE"
				    || properties[i].name == "SEC3_TR_STDATE" || properties[i].name == "SEC3_TR_ENDATE" || properties[i].name == "EMP_HM_TR_STDATE"
				   	|| properties[i].name == "EMP_HM_TR_ENDATE" || properties[i].name == "SP_HM_TR_STDATE" || properties[i].name == "SP_HM_TR_ENDATE"
				   	|| properties[i].name == "CH1_HM_TR_STDATE" || properties[i].name == "CH1_HM_TR_ENDATE" || properties[i].name == "CH2_HM_TR_STDATE"
				   	|| properties[i].name == "CH2_HM_TR_ENDATE" || properties[i].name == "CH3_HM_TR_STDATE"  || properties[i].name == "CH3_HM_TR_ENDATE" 
				   	|| properties[i].name == "DEP_CHNG_STDATE1" ||  properties[i].name == "DEP_CHNG_ENDATE4" || properties[i].name == "ZZ_3PARTY_CUST"
				   	|| properties[i].name == "DEP_CHNG_ENDATE1" || properties[i].name == "DEP_CHNG_STDATE2" || properties[i].name == "DEP_CHNG_ENDATE2"
				   	|| properties[i].name == "DEP_CHNG_STDATE3" || properties[i].name == "DEP_CHNG_ENDATE3" || properties[i].name == "DEP_CHNG_STDATE4"
				   	|| properties[i].name == "CURR_VISA_STAT" || properties[i].name == "DEP_DATE_FRMCNTRY" || properties[i].name == "DEP_DATE_TOMCNTRY"
				   	|| properties[i].name == "DOC_REC_DATE" || properties[i].name == "DOC_SENT_DATE" || properties[i].name =="VISA_AP_REC_DATE"){
					 
				}
				
				else if (properties[i].name == "EMP_DOB" || properties[i].name == "ZZ_DEP_STDATE" || properties[i].name == "BEGDA" || properties[i].name == "COC_ST_DATE" || properties[i].name == "COC_EN_DATE"
					||properties[i].name == "ZZ_DEP_ENDATE" || properties[i].name == "EMP_PASS_VALID" || properties[i].name == "DAT02"
					|| properties[i].name == "SPOUSE_DOB" || properties[i].name == "CHILD1_DOB" || properties[i].name == "CLSDT" // ticket issued
					|| properties[i].name == "CHILD2_DOB" || properties[i].name == "CHILD3_DOB"  || properties[i].name == "ZZ_Add_DOC_VER_DAT"  
					|| properties[i].name=="RTDAT"||properties[i].name=="ENDDA" ||  properties[i].name == "PREA_REC_DATE"
					|| properties[i].name == "ZZ_CNTRT_GEN_DATE" || properties[i].name == "ZZ_Stg1_Doc_Sub_Dat" || properties[i].name == "ZZ_Stg2_Doc_Sub_Dat"
					|| properties[i].name == "ZZ_Stg3_Doc_Sub_Dat"|| properties[i].name == "ZZ_Stg1_Doc_Ver_Dat" || properties[i].name == "EMP_VISA_STDATE" || properties[i].name == "EMP_VISA_ENDATE" 
					|| properties[i].name == "ZZ_Stg2_Doc_Ver_Dat"|| properties[i].name == "ZZ_Stg3_Clr_Dat" || properties[i].name == "ZZ_COC_CLR_DAT" 
					|| (properties[i].name.indexOf("DATE")!=-1)) {
					column = new sap.ui.table.Column({
						width : "150px",
						label : label,
						template : new sap.m.Label({
							text : {
								path : properties[i].name,
								formatter : function(value) {
									if (value != "" && value!=null) {
										if(value === "0000-00-00"){
											return "NA";
										}
									  var date = value.split("-");
									  if(date.length!=0)
											return date[2]+ "/" + date[1] + "/" + date[0];
									}	
								}
							}
						})
					});
				}else{
				column = new sap.ui.table.Column({
					width : "150px",
					sorted:true,
					sortProperty : properties[i].name,
					filterProperty : properties[i].name,
					label : label,
					template : new sap.m.Label({
						text : "{" + properties[i].name + "}"
					})
				});
				}
				table.addColumn(column);
			}
			this.onGetCustomerDetails();
			// table.bindRows("/MIS_REP");
			// table.setModel(oModel);
		}, this), null);
	},
	onGetCustomerDetails:function(){
	///////############################ UCD1COR Dec 02,2020 #####################///////
		////// ######################County list for UI filter#################////////////
		var oGlobal = sap.ui.getCore().getModel("global").getData();
        sap.ui.getCore().getModel("global").setData(oGlobal);
		var oModel = new sap.ui.model.json.JSONModel();
        oModel.setData(oGlobal.country);
        oModel.setSizeLimit(oGlobal.country.length);
        this.getView().setModel(oModel, "reports");
	},
	onSelect : function(evt) {
		//var id = this.getView().byId("btnMisGrp").getSelectedButton().getId();
	//	this.getView().byId("tableMis").setBusy(true);
		//var visaRep;
		if (this.getView().byId("btnBefore").getSelected()) {
			this.getView().byId("btnBefore").fireSelect({selected:true});
		} else if (this.getView().byId("btnAfter").getSelected() ) {
			this.getView().byId("btnAfter").fireSelect({selected:true});
		}
	//	this.getDetails(visaRep);
	},
	onSelect1:function(evt){
		var visaRep = 'X';
		if(evt.getParameter("selected")){
			//this.getView().byId("tableMis").setBusy(true);
			this.getDetails(visaRep);
		}
	},
	onSelect2:function(evt){
		var visaRep = '';
		if(evt.getParameter("selected")){
			//this.getView().byId("tableMis").setBusy(true);
			this.getDetails(visaRep);
		}
	},
	onCheckboxSelect:function(){
		var that = this;
		var ActiveCases= that.getView().byId("idMisReportAssignCheckBox").getSelected();
		if(ActiveCases == true){
			that.getView().byId("idMisDStartFrom").setValue("");
			that.getView().byId("idMisDStartTo").setValue("");
			that.getView().byId("idMisDEndFrom").setValue("");
			that.getView().byId("idMisDEndTo").setValue("");
			that.getView().byId("idMisDStartFrom").setEditable(false);
			that.getView().byId("idMisDStartTo").setEditable(false);
			that.getView().byId("idMisDEndFrom").setEditable(false);
			that.getView().byId("idMisDEndTo").setEditable(false);
		}
		else{
			that.getView().byId("idMisDStartFrom").setEditable(true);
			that.getView().byId("idMisDStartTo").setEditable(true);
			that.getView().byId("idMisDEndFrom").setEditable(true);
			that.getView().byId("idMisDEndTo").setEditable(true); 
		}
	},
	handleSearchButtonPress : function(visaRep) {
		this.getView().byId("tableMis").setBusy(true);
		
		var that = this;
		var StartFrom = that.getView().byId("idMisDStartFrom");
		var StartTo = that.getView().byId("idMisDStartTo");
		var EndFrom = that.getView().byId("idMisDEndFrom");
		var EndTo = that.getView().byId("idMisDEndTo");
		var SelectedCountries = that.getView().byId("idMisDepuCountry").getSelectedKeys();
		var SelectedAssignent = that.getView().byId("idMisReportAssignMentGroup").getSelectedKeys();
		var ActiveCases= that.getView().byId("idMisReportAssignCheckBox").getSelected();
		///########################### UCD1KOR 07/12/2020 ######################/////////
		/// Bug Fixing
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
		
		if(StartFrom.getDateValue() && StartTo.getDateValue() && (StartFrom.getDateValue() > StartTo.getDateValue())){
			var Error = "Start date should be greater than end date"
		}
		else if(EndFrom.getDateValue() && EndTo.getDateValue() && (EndFrom.getDateValue() > EndTo.getDateValue())){
			var Error = "Start date should be greater than end date"
		}
		else {
			var Error = "";
		}
		
		if(ActiveCases == true){
			var ActiveCasesCheck = "X"
		}
		else {
			var ActiveCasesCheck = "";
		}
		
		if(ActiveCases == false && dateValue1 == "" && dateValue2 == "" && dateValue3 =="" && dateValue4 =="" && SelectedCountries =="" && SelectedAssignent == ""){
			var Error = "Please select atleast one filter";
		}
		
		if(Error == ""){
			let countries = SelectedCountries.toString();
			let assignment = SelectedAssignent.toString();

			var odata = {
					PERNR : sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_PERNR,
					ROLE : sap.ui.getCore().getModel("profile").getData().currentRole,
					//visaRep
					VISA_REP : '',
					FromStartDate:dateValue1,
					ToStartDate:dateValue2,
					FromEndDate:dateValue3,
					ToEndDate:dateValue4,
					Countries:countries,
					Assignment:assignment,
					Active : ActiveCasesCheck
					
				}
			//let mis_url = sServiceUrl + "MIS_REP/?FromStartDate='"+dateValue1+"'&ToStartDate='"+dateValue2+"'&FromEndDate='"+dateValue3+"'&ToEndDate='"+dateValue4+"'&Countries='"+countries+"'&Assignment='"+assignment+"'";
				oComponent.getModel().callFunction("MIS_REP", "GET", odata, null, jQuery.proxy(function(oData, response) {
					var table = this.getView().byId("tableMis");
					var model = new sap.ui.model.json.JSONModel();
					
					var Country  = that.getView().getModel("reports").getData();
					
					for(var i=0;i<oData.results.length;i++){
						for(var j=0;j<Country.length;j++){
							if(oData.results[i].ZZ_DEP_FRCNTRY == Country[j].MOLGA){
								oData.results[i].ZZ_DEP_FRCNTRY = Country[j].LTEXT
							}
						}
					}
					model.setData(oData.results);
					table.bindRows("/");
					table.setModel(model);
					table.setBusy(false);
				}, this), jQuery.proxy(function(error) {
					this.getView().byId("tableMis").setBusy(false);
				}, this), true);
				
		}
		else{
			this.getView().byId("tableMis").setBusy(false);
			sap.m.MessageBox.error(Error);
		}
		
	},
	onExport : function() {
		var table = this.getView().byId("tableMis");
		var model = table.getModel();
		// model.setDefaultCountMode(sap.ui.model.odata.CountMode.None);
		// var sFilterParams = table.getBinding("items").sFilterParams;
		var columns = this.getExcelColumns(table);
		oExport = new sap.ui.core.util.Export({
			exportType : new sap.ui.core.util.ExportTypeCSV({
				separatorChar : ","
			}),
			models : model,
			rows : {
				path : "/"
			},
			columns : columns
		});
	//	var id = this.getView().byId("btnMisGrp").getSelectedButton().getId();
		if (this.getView().byId("btnBefore").getSelected()) {
			text = "MIS Report";
		} else if (this.getView().byId("btnAfter").getSelected()) {
			text = "MIS Report";
		}
		oExport.saveFile(text).always(function() {
			this.destroy();
		});
	},
	getExcelColumns : function(table) {
		var columns = [];
		var table;
		// table = this.getView().byId("idItemTable");
		// var cells = table.getBindingInfo("items").template.getCells();
		var cols = table.getColumns();
		for ( var i = 0; i < cols.length; i++) {
			var cells = cols[i].getTemplate();
			if (cells.getBindingInfo("text")) {
				var path = cells.getBindingInfo("text").parts[0].path;
				if (path == "EMP_DOB" || path == "ZZ_DEP_STDATE"
					||path == "ZZ_DEP_ENDATE" || path == "EMP_PASS_VALID"
					|| path == "SPOUSE_DOB" || path == "CHILD1_DOB"
					|| path == "CHILD2_DOB" || path == "CHILD3_DOB"||path=="RTDAT"||path=="ENDDA"
					|| (path.indexOf("DATE")!=-1) || path == "BEGDA" ||  path == "EMP_PASS_VALID" || path == "DAT02"
						|| path == "SPOUSE_DOB" || path == "CHILD1_DOB" || path == "CLSDT" // ticket issued
							|| path == "CHILD2_DOB" || path == "CHILD3_DOB"  || path == "ZZ_Add_DOC_VER_DAT"  
							|| path=="RTDAT"||path=="ENDDA" ||  path == "PREA_REC_DATE"
							|| path == "ZZ_CNTRT_GEN_DATE" || path == "ZZ_Stg1_Doc_Sub_Dat" || path == "ZZ_Stg2_Doc_Sub_Dat"
							|| path == "ZZ_Stg3_Doc_Sub_Dat"|| path == "ZZ_Stg1_Doc_Ver_Dat"
							|| path == "ZZ_Stg2_Doc_Ver_Dat"|| path == "ZZ_Stg3_Clr_Dat" || path == "ZZ_COC_CLR_DAT") {
					columns.push({
						name : cols[i].getLabel().getText(),
						template : {
							content : {path:path,formatter:function(value){
								if (value != "" && value!=null && value !="0000-00-00") {
									  var date = value.split("-");
									  if(date.length!=0)
											return date[1]+ "/" + date[2] + "/" + date[0];
									}
								else{
									return "NA";
								}
							}}
						}
					});
					
				}else{
				columns.push({
					name : cols[i].getLabel().getText(),
					template : {
						content : { 
							path:path,formatter:function(value){
								if(value!=""&&value){
									//value = JSON.stringify(value);
									value = value.replace(/"/g, '');
									//value = value.replace(/"$/, '');
									//value = "\""+value+"\"";
									return value;
								}
							} 
						}
					}
				});
				}
				// }
			}
		}
		return columns;
	},
	onSubmit:function(evt){
		//var frmdate = evt.getSource().getValue();
		var frmDate = this.getView().byId("frmDate").getValue();
		var toDate = this.getView().byId("toDate").getValue();
		if(frmDate!=""&&toDate!=""){
		var table = this.getView().byId("tableMis");
		var aFilters = [];
		var oDateFilter = new sap.ui.model.Filter({ path: "ZZ_DEP_STDATE", operator: "BT", value1: frmDate, value2: toDate });
		aFilters.push(oDateFilter);
		table.getBinding("rows").filter(aFilters);
		}else{
			sap.m.MessageToast.show("Please enter From Date and To Date");
		}
	},
	onReset:function(){
		this.getView().byId("frmDate").setValue("");
		this.getView().byId("toDate").setValue("");
		this.onSelect();
	},
	handleClearSearchFilters:function(){
		this.getView().byId("idMisDStartFrom").setValue("");
		this.getView().byId("idMisDEndFrom").setValue("");
		this.getView().byId("idMisDStartTo").setValue("");
		this.getView().byId("idMisDEndTo").setValue("");
		this.getView().byId("idMisDepuCountry").setSelectedKeys([]);
		this.getView().byId("idMisReportAssignMentGroup").setSelectedKeys([]);
	},
	
	//////############################## MIS Report Modification ###################################///
	///##################### UCD1KOR Dec 02,2020 ###################################################///
	
	onCountryChange:function(){
    	var cnty = this.getView().byId("idMisDepuCountry").getSelectedKeys();
    	var aFilters = [];
        aFilters.push(new sap.ui.model.Filter({path:"ToCountry",operator:"EQ",
        	                                   value1:cnty }));    

        var oTemplate = new sap.ui.core.Item({key:"{Key}",text:"{AsgType}"});

        this.getView().byId("idMisReportAssignMentGroup").bindItems({path:"/AsgModelsF4Set",template:oTemplate,filters:aFilters});	
    }
	
/**
 * Similar to onAfterRendering, but this hook is invoked before the controller's
 * View is re-rendered (NOT before the first rendering! onInit() is used for
 * that one!).
 * 
 * @memberOf e2etm.view.MISReport
 */
// onBeforeRendering: function() {
//
// },
/**
 * Called when the View has been rendered (so its HTML is part of the document).
 * Post-rendering manipulations of the HTML could be done here. This hook is the
 * same one that SAPUI5 controls get after being rendered.
 * 
 * @memberOf e2etm.view.MISReport
 */
// onAfterRendering: function() {
//
// },
/**
 * Called when the Controller is destroyed. Use this one to free resources and
 * finalize activities.
 * 
 * @memberOf e2etm.view.MISReport
 */
// onExit: function() {
//
// }
});