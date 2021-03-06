jQuery.sap.require("sap.ui.project.e2etm.util.StaticUtility");
jQuery.sap.require("sap.ui.project.e2etm.util.Formatter");
jQuery.sap.require('sap.ui.project.e2etm.controls.customStage');
jQuery.sap.require('sap.ui.project.e2etm.controls.stageItem');
jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("sap.m.MessageBox");
sap.ui.controller("sap.ui.project.e2etm.controller.TravelPlan", {
	onInit : function() {
		var that = this;
		TravelPlanThis = this;
		sap.ui.project.e2etm.util.StaticUtility.setBusy(true, oDeputationThis);
		tabIndex = 0;
		var oDataModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
		var batchOperation0 = oDataModel.createBatchOperation("GetDomain?DomainName='ZINF_REASON'&$format=json", "GET")
		var batchOperation1 = oDataModel.createBatchOperation("GetDomain?DomainName='ZINSUR'&$format=json", "GET");
		
		if(oDeputationThis.getView().getModel().getData().screenData.ZZ_REQ_TYP == "SECO") {
			var batchOperation2 = oDataModel.createBatchOperation("DEP_COUNTRIESSet?$filter=MOLGA+eq+'HU' ","GET");	
	     }
	 	else
	    {		
	 		var batchOperation2 = oDataModel.createBatchOperation("DEP_COUNTRIESSet", "GET");
	    }
		
		var batchOperation3 = oDataModel.createBatchOperation("GetDomain?DomainName='FTPD_MEALCODE'&$format=json", "GET");
		var batchOperation4 = oDataModel.createBatchOperation("GetDomain?DomainName='FTPD_FLIGHT_PREF_SEAT'&$format=json", "GET");
		var batchOperation5 = oDataModel.createBatchOperation("GetF4Table?TableName='ZE2E_TRV_TYP'&Col1='ZZ_TRV_KEY'&Col2='ZZ_TRV_TYP'&Col3=''&Col4=''&Col5=''&Col6=''&Col7=''&Col8=''&Col9=''&Col10=''&$format=json", "GET");
		var batchOperation8 = oDataModel.createBatchOperation("GetConstant?CONST='BUSR'&SELPAR='WARNING'&$format=json", "GET");
		
		// TGG1HC get first digit of ZZ_TRV_REQ
		var screenData = oDeputationThis.getView().getModel().getData().screenData;
		
		//dye5kor
		//SIM card changes_DYE5KOR
		TravelPlanThis.getView().byId("Lbl_SimReq").setVisible(false);
		TravelPlanThis.getView().byId("Lbl_SimTyp").setVisible(false);
		TravelPlanThis.getView().byId("Lbl_SimData").setVisible(false);
		TravelPlanThis.getView().byId("SimReq").setVisible(false);
		TravelPlanThis.getView().byId("SimTyp").setVisible(false);
		TravelPlanThis.getView().byId("SimData").setVisible(false);	
		
		if(screenData.ZZ_REQ_TYP=='BUSR' && screenData.ZZ_DEP_TYPE == "INTL"){
			
			if(screenData.ZZ_DEP_REQ==""){
			var tpstDate = new Date(screenData.ZZ_DEP_STDATE.substr(0, 4), screenData.ZZ_DEP_STDATE.substr(4, 2) - 1, screenData.ZZ_DEP_STDATE.substr(6, 2));
			var tpenDate = new Date(screenData.ZZ_DEP_ENDATE.substr(0, 4), screenData.ZZ_DEP_ENDATE.substr(4, 2) - 1, screenData.ZZ_DEP_ENDATE.substr(6, 2));
			var tpDur = new Date(tpenDate - tpstDate);
			var tpDays  = tpDur.getTime() / (1000 * 3600 * 24) + 1;
			tpDays = "" + Math.round(tpDays);
			
			if(tpDays <= 31){
			TravelPlanThis.getView().byId("Lbl_SimReq").setVisible(true);
			TravelPlanThis.getView().byId("Lbl_SimTyp").setVisible(true);
			TravelPlanThis.getView().byId("Lbl_SimData").setVisible(true);
			TravelPlanThis.getView().byId("SimReq").setVisible(true);
			TravelPlanThis.getView().byId("SimTyp").setVisible(true);
			TravelPlanThis.getView().byId("SimData").setVisible(true);	
				}
			}else{
				TravelPlanThis.getView().byId("Lbl_SimReq").setVisible(true);
				TravelPlanThis.getView().byId("Lbl_SimTyp").setVisible(true);
				TravelPlanThis.getView().byId("Lbl_SimData").setVisible(true);
				TravelPlanThis.getView().byId("SimReq").setVisible(true);
				TravelPlanThis.getView().byId("SimTyp").setVisible(true);
				TravelPlanThis.getView().byId("SimData").setVisible(true);	
					
			}
		}
		
		
		
		
		var sSELLAR = screenData.ZZ_TRV_REQ.charAt(2);
		var sTRV_TR_URL = "GetConstant?CONST='VKM_TR'&SELPAR='{0}'&$format=json";
		sTRV_TR_URL = sTRV_TR_URL.replace("{0}", sSELLAR);
		var batchOperation13 = oDataModel.createBatchOperation(sTRV_TR_URL, "GET");
	////########### UCD1KOR 12 July 2021 changes - BUSR Copy ###########////
		if(sap.ui.getCore().getModel("global").getData().isCopy){
			screenData.ZZ_REQ_TYP = sap.ui.getCore().getModel("global").getData().ZZ_REQ_TYP1;
		}
		if (sap.ui.getCore().getModel("global").getData().isCopy == true || screenData.ZZ_REQ_TYP == "BUSR" || screenData.ZZ_REQ_TYP == "SECO" || screenData.ZZ_REQ_TYP == "HOME" || screenData.ZZ_REQ_TYP == "EMER" || screenData.ZZ_REQ_TYP == "INFO") {
			if (sap.ui.getCore().getModel("global").getData().isCopy !== true && sap.ui.getCore().getModel("global").getData().isCreate && (screenData.ZZ_REQ_TYP == "SECO" || screenData.ZZ_REQ_TYP == "BUSR" || screenData.ZZ_REQ_TYP == "INFO")) { // Create
																																														// a
																																														// new
																																														// request
				var batchOperation6 = oDataModel.createBatchOperation("CUSTOMER_DETAILS_RFC?PERNR='" + sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_PERNR + "'&$format=json", "GET");
				oDataModel.addBatchReadOperations([ batchOperation0, batchOperation1, batchOperation2, batchOperation3, batchOperation4, batchOperation5, batchOperation6, batchOperation8, batchOperation13 ]);
				oDataModel.submitBatch(function(oResult) {
					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setSizeLimit(300);
					var oData = {
						ZZ_ZDURN : (screenData.ZZ_REQ_TYP == "BUSR" || screenData.ZZ_REQ_TYP == "INFO") ? screenData.ZZ_DEP_DAYS : "",
						ZZ_DATB1 : (screenData.ZZ_REQ_TYP == "BUSR" || screenData.ZZ_REQ_TYP == "INFO") ? screenData.ZZ_DEP_ENDATE : "",
						ZZ_DATV1 : (screenData.ZZ_REQ_TYP == "BUSR" || screenData.ZZ_REQ_TYP == "INFO") ? screenData.ZZ_DEP_STDATE : "",
						ZZ_LAND1 : screenData.ZZ_DEP_TOCNTRY,
						ZZ_LOCATION_END : (screenData.ZZ_REQ_TYP == "BUSR" || screenData.ZZ_REQ_TYP == "INFO") ? screenData.ZZ_DEP_TOLOC_TXT : "",
						ZZ_FMCNTRY : (screenData.ZZ_REQ_TYP == "BUSR" || screenData.ZZ_REQ_TYP == "INFO") ? screenData.ZZ_DEP_FRCNTRY : screenData.ZZ_DEP_TOCNTRY,
						ZZ_FMLOC : (screenData.ZZ_REQ_TYP == "BUSR" || screenData.ZZ_REQ_TYP == "INFO") ? screenData.ZZ_DEP_FRMLOC_TXT : screenData.ZZ_DEP_TOLOC_TXT,
						ZZ_TRV_TYP : screenData.ZZ_REQ_TYP,
						ZZ_ZCATG : TravelPlanThis.assignTravelCategory(sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_LEVEL),
						ZZ_PERNR : sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_PERNR,
						ZZ_REINR : '0000000000',
						ZZ_LEVEL : sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_LEVEL,
						ZZ_ZVISAT : (screenData.ZZ_REQ_TYP == "BUSR" || screenData.ZZ_REQ_TYP == "INFO") ? TravelPlanThis.assignVisaCategory(screenData.ZZ_REQ_TYP, screenData.ZZ_DEP_FRCNTRY, screenData.ZZ_DEP_TOCNTRY) : "1",
						ZZ_MODID : screenData.ZZ_REQ_TYP,
						ZZ_STATUS : "",
						ZZ_SIM_REQ_KEY :"",
						ZZ_SIM_TYP_KEY :"",
						ZZ_SIM_DATA_KEY:"",
						PersFlag:"",				//added by uea6kor_16.9.2020
						SDate:"",
						STime:"",
						EDate:"",
						ETime:"",
					};
					oData.ZZ_SMODID = (oData.ZZ_FMCNTRY == oData.ZZ_LAND1) || (oData.ZZ_FMCNTRY == "IN" && oData.ZZ_LAND1 == "NP") || (oData.ZZ_FMCNTRY == "NP" && oData.ZZ_LAND1 == "IN") ? "DOME" : "INTL";
					TravelPlanThis.bindTravelData(oData, oResult.__batchResponses[0].data, oResult.__batchResponses[1].data, oResult.__batchResponses[2].data, oResult.__batchResponses[3].data, oResult.__batchResponses[4].data, oResult.__batchResponses[5].data, oResult.__batchResponses[6].data);
					TravelPlanThis.getView().byId("flexBoxFundF02").setVisible(false);// sidd
					TravelPlanThis.getView().byId("flexBoxFundF03").setVisible(false);// sidd
					TravelPlanThis.getView().byId("flexBoxFundF01F02F04").setVisible(false);// sidd
					TravelPlanThis.getView().byId("flexCtgMcr").setVisible(false);	//added for MCR UEA6KOR_15.03.2019	
					
					TravelPlanThis.bindingDeepEntity(oData, screenData.ZZ_DEP_TOCNTRY);
					oData.view = {
						'enabled' : true,
						'isFuture' : true,
						'costLength' : 0,
						'detailLength' : 0,
						'accommodationLength' : 0,
						'international' : screenData.ZZ_DEP_TYPE == "INTL",
						'enableConfirm' : screenData.ZZ_DEP_TYPE == "INTL",
						'enableAddDetail' : true,
						'enabledCountry' : screenData.ZZ_REQ_TYP == "SECO",
						'warning' : oResult.__batchResponses[7].data.GetConstant.VALUE,
						'visaAvailability' : (screenData.ZZ_REQ_TYP == "BUSR" || screenData.ZZ_REQ_TYP == "INFO") && screenData.ZZ_DEP_TYPE == "INTL",
						'cargoVis' : false,
						'editPersTrip' : true		//added by uea6kor_15.9.2020 for personal trip
					};
					if (oData.ZZ_DATB1 != "00000000" && oData.ZZ_DATB1 != "" && oData.ZZ_DATB1 != null) {
						oData.view.ZZ_DATB1_VALUE = new Date(oData.ZZ_DATB1.substr(0, 4), oData.ZZ_DATB1.substr(4, 2) - 1, oData.ZZ_DATB1.substr(6, 2));
						oData.view.ZZ_DATV1_VALUE = new Date(oData.ZZ_DATV1.substr(0, 4), oData.ZZ_DATV1.substr(4, 2) - 1, oData.ZZ_DATV1.substr(6, 2));
					} else {
						oData.ZZ_DATB1 = "";
						oData.ZZ_DATV1 = "";
					}
					// Set value for insurance
					if ((oData.ZZ_TRV_TYP == "BUSR" || oData.ZZ_TRV_TYP == "INFO") && oData.ZZ_SMODID == "INTL") {
						oData.view.enableInsurance = false;
						oData.ZZ_ZINSUR = "B";
					} else {
						oData.view.enableInsurance = oData.view.isFuture;
					}
					//uea6kor_17.9.2020
					TravelPlanThis.getView().byId("idpersbox").setValue("No");
					TravelPlanThis.getView().byId("lbPerstdate").setVisible(false);
					TravelPlanThis.getView().byId("idPerstdate").setVisible(false);
					TravelPlanThis.getView().byId("lbPersendate").setVisible(false);
					TravelPlanThis.getView().byId("idPersendate").setVisible(false);
					//uea6kor_18.9.2020
					
					//// removing RU 25 feb 2020 ucd1kor
					if(oData.ZZ_TRV_TYP == "SECO"){
					var countryList = oResult.__batchResponses[2];
					var len = countryList.data.results;
					for(var i=0;i<len.length;i++){
						if(len[i].MOLGA == "RU")
						     len.splice(i, 1); 
					}
				}

					//// removing RU 25 feb 2020 ucd1kor
					
					// TGG1HC for VKM_TR
					// oData.VKM_TR =
					// oResult.__batchResponses[8].data.GetConstant.VALUE;
					sap.ui.getCore().getModel("global").setProperty("/VKM_TR", oResult.__batchResponses[8].data.GetConstant.VALUE);
					// Set model and bind root element
					oModel.setData(oData);
					backup = TravelPlanThis.copyFields(oData, backup);
					TravelPlanThis.getView().bindElement("/");
					TravelPlanThis.getView().setModel(oModel);
					// Control upload document
					try {
						var oDepuData = oDeputationThis.getView().getModel().getData();
						oDepuData.selfVisa.visibleOpen = false;
						oDeputationThis.getView().getModel().setData(oDepuData);
					} catch (ex) {
					}
					sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oDeputationThis);
					oDeputationThis.travelDeffered.resolve();
				}, function(oError) {
					sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oDeputationThis);
					sap.ca.ui.message.showMessageBox({
						type : sap.ca.ui.message.Type.ERROR,
						message : "Sorry for this inconvenience. Please contact support team",
						details : oError.responseText
					});
				});
			} else { // Open an existing request
				var batchOperation6 = oDataModel.createBatchOperation("CUSTOMER_DETAILS_RFC?PERNR='" + screenData.ZZ_DEP_PERNR + "'&$format=json", "GET");
				if (sap.ui.getCore().getModel("global").getData().isCreate && sap.ui.getCore().getModel("global").getData().isCopy !== true) {
					var batchOperation7 = oDataModel.createBatchOperation("TRV_HDRSet(ZZ_PERNR='" + screenData.ZZ_DEP_PERNR + "',ZZ_DEP_REQ='" + screenData.ZZ_TRV_REQ + "',ZZ_VERSION='',ZZ_TRV_TYP='" + "DEPU" + "')?$expand=TRV_HDRtoTRV_COST_ASGN,TRV_HDRtoTRV_travel_Data,TRV_HDRtoTRV_ACCOM,TRV_HDRtoTRV_ADVANCE,DEP_VISA_PLAN", "GET");		
			////////############### UCD1KOR 30 Nov,2020 #################/////////////
			///############### Added below batch operation for SECO, EMER travels		
					var batchOperation14 = oDataModel.createBatchOperation("PersonalTripSet(TrvReq='"+screenData.ZZ_TRV_REQ+"',EmpNo='"+screenData.ZZ_DEP_PERNR+"',Version='')", "GET"); 
				} else {
					//############### UCD1KOR 14 July 2021 changes BUSR COopy ##############/////
					if(screenData.ZZ_REQ_TYP == "DEPU"){
						var batchOperation7 = oDataModel.createBatchOperation("TRV_HDRSet(ZZ_PERNR='" + screenData.ZZ_DEP_PERNR + "',ZZ_DEP_REQ='" + screenData.ZZ_TRV_REQ + "',ZZ_VERSION='',ZZ_TRV_TYP='" + screenData.ZZ_REQ_TYP + "')?$expand=TRV_HDRtoTRV_COST_ASGN,TRV_HDRtoTRV_travel_Data,TRV_HDRtoTRV_ACCOM,TRV_HDRtoTRV_ADVANCE,DEP_VISA_PLAN", "GET");
					}
					else{
						var batchOperation7 = oDataModel.createBatchOperation("TRV_HDRSet(ZZ_PERNR='" + screenData.ZZ_DEP_PERNR + "',ZZ_DEP_REQ='" + screenData.ZZ_DEP_REQ + "',ZZ_VERSION='',ZZ_TRV_TYP='" + screenData.ZZ_REQ_TYP + "')?$expand=TRV_HDRtoTRV_COST_ASGN,TRV_HDRtoTRV_travel_Data,TRV_HDRtoTRV_ACCOM,TRV_HDRtoTRV_ADVANCE,DEP_VISA_PLAN", "GET");
					}
					//uea6kor_16.9.2020
	                var batchOperation14 = oDataModel.createBatchOperation("PersonalTripSet(TrvReq='"+screenData.ZZ_TRV_REQ+"',EmpNo='"+screenData.ZZ_DEP_PERNR+"',Version='')", "GET"); 
//					//uea6kor_16.9.2020
				}
				
				var batchOperation9 = oDataModel.createBatchOperation("DmsDocsSet?$filter=DepReq+eq+'" + screenData.ZZ_DEP_REQ + "'+and+EmpNo+eq+'" + screenData.ZZ_DEP_PERNR + "'", "GET");
				
				var aBatch = [ batchOperation0, batchOperation1, batchOperation2, batchOperation3, batchOperation4, batchOperation5, batchOperation6, batchOperation7, batchOperation8, batchOperation9 ];
				if (sap.ui.getCore().getModel("global").getData().ZZ_VREASON == 'TA') {
					var iVersion = sap.ui.getCore().getModel("global").getData().ZZ_VERSION - 1;
					if (sap.ui.getCore().getModel("global").getData().isCreate) {
						var batchOperation10 = oDataModel.createBatchOperation("TRV_HDRSet(ZZ_PERNR='" + screenData.ZZ_DEP_PERNR + "',ZZ_DEP_REQ='" + screenData.ZZ_DEP_REQ + "',ZZ_VERSION='" + iVersion + "',ZZ_TRV_TYP='" + "DEPU" + "')?$expand=TRV_HDRtoTRV_COST_ASGN,TRV_HDRtoTRV_travel_Data", "GET");
					} else {
						var batchOperation10 = oDataModel.createBatchOperation("TRV_HDRSet(ZZ_PERNR='" + screenData.ZZ_DEP_PERNR + "',ZZ_DEP_REQ='" + screenData.ZZ_DEP_REQ + "',ZZ_VERSION='" + iVersion + "',ZZ_TRV_TYP='" + screenData.ZZ_REQ_TYP + "')?$expand=TRV_HDRtoTRV_COST_ASGN,TRV_HDRtoTRV_travel_Data", "GET");
					}
					aBatch.push(batchOperation10);
				}
				
				// TGG1HC
				
				aBatch.push(batchOperation13);
				aBatch.push(batchOperation14);  //uea6kor_16.9.2020
				oDataModel.addBatchReadOperations(aBatch);
				oDataModel.submitBatch(function(oResult) {
					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setSizeLimit(300);
					oData = oResult.__batchResponses[7].data;
					//UEA6KOR_17.9.2020
					if(sap.ui.getCore().getModel("global").getData().ZZ_VREASON == "TA"){
						pData = oResult.__batchResponses[12].data;
					}else{
						pData = oResult.__batchResponses[11].data;
					}
					oData.SDate = pData.SDate;
					oData.EDate = pData.EDate;
					oData.PersFlag = pData.PersFlag;
					oData.STime = pData.STime;
					oData.ETime = pData.ETime;	
					////############### UCD1KOR 13 July 2021 changes BUSR copy ################//// 
					if(sap.ui.getCore().getModel("global").getData().isCopy){
						oData.ZZ_DATV1 = sap.ui.getCore().getModel("global").getData().screenData.ZZ_DEP_STDATE;
						oData.ZZ_DATB1 = sap.ui.getCore().getModel("global").getData().screenData.ZZ_DEP_ENDATE;
						//oData.ZZ_BEGDA = sap.ui.getCore().getModel("global").getData().screenData.ZZ_DEP_STDATE;
						//oData.ZZ_ENDDA= sap.ui.getCore().getModel("global").getData().screenData.ZZ_DEP_ENDATE;
						oData.ZZ_LAND1 = sap.ui.getCore().getModel("global").getData().screenData.ZZ_DEP_TOCNTRY;
						oData.ZZ_LOCATION_END = sap.ui.getCore().getModel("global").getData().screenData.ZZ_DEP_TOLOC_TXT;
						oData.ZZ_FMCNTRY = sap.ui.getCore().getModel("global").getData().screenData.ZZ_DEP_FRCNTRY;
						oData.ZZ_FMLOC = sap.ui.getCore().getModel("global").getData().screenData.ZZ_DEP_FRMLOC_TXT;
						oData.ZZ_SMODID  = sap.ui.getCore().getModel("global").getData().screenData.ZZ_DEP_TYPE;
						if(oData.ZZ_SMODID == "DOME"){
							oData.ZZ_ZVISAT = "1";
						}
						else{
							oData.ZZ_ZVISAT = "2";
						}
						oData.ZZ_ZDURN = sap.ui.getCore().getModel("global").getData().screenData.ZZ_DEP_DAYS;
						oData.ZZ_MODID = "BUSR";
						oData.ZZ_REINR = "0000000000";
						oData.ZZ_DEP_REQ = "0000000000"
						oData.ZZ_TRV_TYP = "BUSR";
						oData.ZZ_VERSION = "";
						oData.view = {
								'enabled' : true,
								'isFuture' : true,
								'costLength' : 0,
								'detailLength' : 0,
								'accommodationLength' : 0,
								'international' : oData.ZZ_SMODID == "INTL",
								'enableConfirm' : oData.ZZ_SMODID == "INTL",
								'visaAvailability' : (oData.ZZ_TRV_TYP == "BUSR" || oData.ZZ_TRV_TYP == "INFO") && oData.ZZ_SMODID == "INTL"
							};
					}
					
					if(oData.PersFlag == "X"){
						TravelPlanThis.getView().byId("idpersbox").setValue("Yes");
						TravelPlanThis.getView().byId("lbPerstdate").setVisible(true);
						TravelPlanThis.getView().byId("idPerstdate").setVisible(true);
						TravelPlanThis.getView().byId("lbPersendate").setVisible(true);
						TravelPlanThis.getView().byId("idPersendate").setVisible(true);
					}else{
						TravelPlanThis.getView().byId("idpersbox").setValue("No");
						TravelPlanThis.getView().byId("lbPerstdate").setVisible(false);
						TravelPlanThis.getView().byId("idPerstdate").setVisible(false);
						TravelPlanThis.getView().byId("lbPersendate").setVisible(false);
						TravelPlanThis.getView().byId("idPersendate").setVisible(false);
					}
					//UEA6KOR_17.9.2020 personal trip changes
					if (sap.ui.getCore().getModel("global").getData().isCreate) {
						oData.ZZ_CHANGE_AC = "";
						oData.ZZ_CHANGE_AD = "";
						oData.ZZ_CHANGE_CO = "";
						oData.ZZ_CHANGE_DE = "";
						oData.ZZ_CHANGE_GE = "";
					}
					TravelPlanThis.bindTravelData(oData, oResult.__batchResponses[0].data, oResult.__batchResponses[1].data, oResult.__batchResponses[2].data, oResult.__batchResponses[3].data, oResult.__batchResponses[4].data, oResult.__batchResponses[5].data, oResult.__batchResponses[6].data);
					TravelPlanThis.bindingDeepEntity(oData);
					// Logic to enable fields in travel plan screen
					var loginPernr = sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_PERNR;
					var flag = false;
					if (oData.ZZ_PERNR == loginPernr) {
						flag = true;
					} else {
						flag = false;
					}
					// Control the screen data
					oData.view = {
						'costLength' : oData.TRV_HDRtoTRV_COST_ASGN.results.length,
						'detailLength' : TravelPlanThis.getTravelDetailLength(oData),
						'accommodationLength' : oData.TRV_HDRtoTRV_ACCOM.results.length,
						'selectedTab' : screenData.ZZ_REQ_TYP == "HOME" || screenData.ZZ_REQ_TYP == "EMER" ? 2 : 0,
						'isTravelRequest' : true,
						'warning' : oResult.__batchResponses[8].data.GetConstant.VALUE,
						'visaAvailability' : oData.ZZ_SMODID == "INTL",
						'cargoVis' : false
					//	'enablePersTrip' : false	//added by uea6kor_15.9.2020 for personal trip
					};
					
					oData.view.international = (oData.ZZ_SMODID == "INTL" && (oData.ZZ_TRV_TYP == "BUSR" || oData.ZZ_TRV_TYP == "INFO" || oData.ZZ_TRV_TYP == "DEPU" || oData.ZZ_TRV_TYP == "SECO")) || oData.ZZ_TRV_TYP == "HOME" || oData.ZZ_TRV_TYP == "EMER";
					oData.view.enableConfirm = oData.ZZ_STATUS.substring(2, 5) == "000" || oData.ZZ_STATUS.substring(2, 5) == "008" || sap.ui.getCore().getModel("global").getData().isCreate || sap.ui.getCore().getModel("global").getData().isChange;
					oData.view.confirm = !oData.view.enableConfirm;
					TravelPlanThis.checkfund(oData);
					tabIndex = screenData.ZZ_REQ_TYP == "HOME" || screenData.ZZ_REQ_TYP == "EMER" ? 2 : 0;
					// Convert advance from object to array
					TravelPlanThis.convertAdvance(oData);
					try {
						oData.view.enabled = sap.ui.getCore().getModel("profile").getData().currentRole == "EMP" && (oData.ZZ_TRV_TYP == "BUSR" || oData.ZZ_TRV_TYP == "INFO" || oData.ZZ_TRV_TYP == "SECO") && (oData.ZZ_STATUS.substring(2, 5) == "000" || oData.ZZ_STATUS.substring(2, 5) == "008" || sap.ui.getCore().getModel("global").getData().isChange || sap.ui.getCore().getModel("global").getData().isCreate);
						oData.view.enableAddDetail = sap.ui.getCore().getModel("profile").getData().currentRole == "EMP" && (oData.ZZ_STATUS.substring(2, 5) == "000" || oData.ZZ_STATUS.substring(2, 5) == "008" || sap.ui.getCore().getModel("global").getData().isChange || sap.ui.getCore().getModel("global").getData().isCreate);
						oData.view.enabledCountry = sap.ui.getCore().getModel("profile").getData().currentRole == "EMP" && (oData.ZZ_TRV_TYP == "SECO" && (oData.ZZ_STATUS.substring(2, 5) == "000" || oData.ZZ_STATUS.substring(2, 5) == "008" || sap.ui.getCore().getModel("global").getData().isChange || sap.ui.getCore().getModel("global").getData().isCreate));
					} catch (exp) { // Request is save or open as read only
						oData.view.enabled = sap.ui.getCore().getModel("profile").getData().currentRole == "EMP" && (oData.ZZ_STATUS.substring(2, 5) == "000" || oData.ZZ_STATUS.substring(2, 5) == "008");
						oData.view.enableAddDetail = sap.ui.getCore().getModel("profile").getData().currentRole == "EMP" && (oData.ZZ_STATUS == "FF001" || oData.ZZ_STATUS.substring(2, 5) == "000" || oData.ZZ_STATUS.substring(2, 5) == "008" ? true : oData.view.enabled);
						oData.view.enabledCountry = sap.ui.getCore().getModel("profile").getData().currentRole == "EMP" && ((screenData.ZZ_REQ_TYP == "BUSR" || screenData.ZZ_REQ_TYP == "INFO") && oData.ZZ_STATUS.substring(2, 5) == "000" && oData.ZZ_VERSION.trim() == '');
					}
					if (sap.ui.project.e2etm.util.StaticUtility.checkDateInPast(oData.ZZ_DATV1) && (sap.ui.getCore().getModel("global").getData().isChange || oData.ZZ_VERSION.trim() != "1")) {
						oData.view.isFuture = false;
					} else {
						oData.view.isFuture = oData.view.enabled;
					}
					// Set value for insurance
					if ((oData.ZZ_TRV_TYP == "BUSR" || oData.ZZ_TRV_TYP == "INFO") && oData.ZZ_SMODID == "INTL") {
						oData.view.enableInsurance = false;
						oData.ZZ_ZINSUR = "B";
					} else {
						oData.view.enableInsurance = oData.view.isFuture;
					}
		
					//dye5kor_simcard_changes
					//uea6kor_17.9.2020
					if(sap.ui.getCore().getModel("profile").getData().currentRole == "EMP" && (oData.ZZ_STATUS.substring(2, 5) == "000" ||
						oData.ZZ_STATUS.substring(2, 5) == "001" || oData.ZZ_STATUS.substring(2, 5) == "008") ){
						oData.view.editPersTrip = true;
					}else{
						oData.view.editPersTrip = false;
					}
					//uea6kor_17.9.2020
					
					if(oData.ZZ_TRV_TYP=="BUSR" && oData.ZZ_SMODID=="INTL" && oData.ZZ_SIM_REQ_KEY=="N"){
						
						TravelPlanThis.getView().byId("Lbl_SimTyp").setVisible(false);
						TravelPlanThis.getView().byId("Lbl_SimData").setVisible(false);
						TravelPlanThis.getView().byId("SimTyp").setVisible(false);
						TravelPlanThis.getView().byId("SimData").setVisible(false);

					}
					
					// Format header flag
					TravelPlanThis.formatHeaderFlag(oData);
					if (sap.ui.getCore().getModel("global").getData().ZZ_VREASON == 'TA') {
						oData.old = oResult.__batchResponses[10].data;
					}
					TravelPlanThis.prepareDataforExistingRequest(oData);
					// oData.ZZ_SMODID = screenData.ZZ_DEP_TYPE == "INTL" ||
					// screenData.ZZ_DEP_TYPE == "GEN" ? "INTL":"DOME",
					oData.ZZ_SMODID = (oData.ZZ_FMCNTRY == oData.ZZ_LAND1) || (oData.ZZ_FMCNTRY == "IN" && oData.ZZ_LAND1 == "NP") || (oData.ZZ_FMCNTRY == "NP" && oData.ZZ_LAND1 == "IN") ? "DOME" : "INTL";
					oData.ZZ_TRV_TYP = (screenData.ZZ_REQ_TYP == "BUSR" || screenData.ZZ_REQ_TYP == "INFO") ? oData.ZZ_TRV_TYP : screenData.ZZ_REQ_TYP;
					backup = TravelPlanThis.copyFields(oData, backup);
					// Set data for comment history in Deputation view
					var deputationData = oDeputationThis.getView().getModel().getData();
					// Display visa info
					if (oData.DEP_VISA_PLAN) {
						deputationData.selfVisa = oData.DEP_VISA_PLAN;
						deputationData.selfVisa.visibleOpen = true;
						if (deputationData.selfVisa.ZZ_MULT_ENTRY == "") {
							deputationData.selfVisa.ZZ_MULT_ENTRY_CHAR = false;
						} else {
							deputationData.selfVisa.ZZ_MULT_ENTRY_CHAR = true;
						}
						sap.ui.getCore().byId('panelEmployeeVisaCopy').setVisible(true);
						oData.view.visaExist = 'X';
						for ( var i = 0; i < oResult.__batchResponses[9].data.results.length; i++) {
							if (oResult.__batchResponses[9].data.results[i].FileName.substr(0, 22) == "CL_VISA_COPY_SELF_BUSR") {
								deputationData.selfVisa.href = oResult.__batchResponses[9].data.results[i].FileUrl;
								break;
							}
						}
					}
					try {
						deputationData.selfVisa.enabled = oData.view.enabled;
					} catch (ex) {
					}
					deputationData.screenData.ZZ_COMMENTS = oData.ZZ_COMMENTS;
					oDeputationThis.getView().getModel().setData(deputationData);
					oData.ZZ_COMMENTS = "";
					// Set status and travel category
					oData.ZZ_STATUS = screenData.ZZ_REQ_TYP == "HOME" || screenData.ZZ_REQ_TYP == "EMER" || screenData.ZZ_REQ_TYP == "SECO" ? "" : oData.ZZ_STATUS;
					oData.ZZ_TRV_CAT = screenData.ZZ_REQ_TYP == "HOME" || screenData.ZZ_REQ_TYP == "EMER" || screenData.ZZ_REQ_TYP == "SECO" ? screenData.ZZ_REQ_TYP : oData.ZZ_REQ_TYP;
					// Delete old value for HOME and EMER
					if (sap.ui.getCore().getModel("global").getData().isCreate && (screenData.ZZ_REQ_TYP == "HOME" || screenData.ZZ_REQ_TYP == "EMER")) {
						for ( var i = oData.TRV_HDRtoTRV_travel_Data.results.length - 1; i >= 0; i--) {
							if (oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_TRVCAT == oData.ZZ_TRV_TYP) {
								oData.TRV_HDRtoTRV_travel_Data.results.splice(i, 1);
							}
						}
					}
					TravelPlanThis.createDefaultValue(oData);
					//oData.ZZ_CCNAME = oData.ZZ_CUST_NAME;
					// TGG1HC for VKM_TR
					// oData.VKM_TR =
					// oResult.__batchResponses[12].data.GetConstant.VALUE;
					if (sap.ui.getCore().getModel("global").getData().ZZ_VREASON == 'TA') {
						sap.ui.getCore().getModel("global").setProperty("/VKM_TR", oResult.__batchResponses[11].data.GetConstant.VALUE);
					} else {
						sap.ui.getCore().getModel("global").setProperty("/VKM_TR", oResult.__batchResponses[10].data.GetConstant.VALUE);
					}
					//simcard changes start uea6kor-uml6kor 8/7/2019
					/////############### UCD1KOR 15 July 2021 changes BUSR Copy##############///////////
				/////############### UCD1KOR 15 July 2021 changes BUSR Copy##############///////////

                    if(sap.ui.getCore().getModel("global").getData().isCopy !== true && oData.ZZ_SIM_REQ_KEY == ""){
                    	oData.ZZ_SIM_REQ_KEY = "N";
						TravelPlanThis.getView().byId("SimReq").setValue("NO");
                    }

                   if(oData.ZZ_TRV_TYP=="BUSR" && oData.ZZ_SMODID=="INTL"){
                            TravelPlanThis.getView().byId("Lbl_SimReq").setVisible(true);
						    TravelPlanThis.getView().byId("SimReq").setVisible(true);
						    if(oData.ZZ_SIM_REQ_KEY=="N"){
						    	TravelPlanThis.getView().byId("Lbl_SimTyp").setVisible(false);
                    		    TravelPlanThis.getView().byId("Lbl_SimData").setVisible(false);
                    		    TravelPlanThis.getView().byId("SimTyp").setVisible(false);
                    		    TravelPlanThis.getView().byId("SimData").setVisible(false);
						    }
						    else{
					    	    TravelPlanThis.getView().byId("Lbl_SimTyp").setVisible(true);
					    	    TravelPlanThis.getView().byId("Lbl_SimData").setVisible(true);
					    	    TravelPlanThis.getView().byId("SimTyp").setVisible(true);
					    	    TravelPlanThis.getView().byId("SimData").setVisible(true);
					        }
                    		
					    }
					    else{
					    	    TravelPlanThis.getView().byId("Lbl_SimTyp").setVisible(false);
					    	    TravelPlanThis.getView().byId("Lbl_SimData").setVisible(false);
					    	    TravelPlanThis.getView().byId("SimTyp").setVisible(false);
					    	    TravelPlanThis.getView().byId("SimData").setVisible(false);
					    	    TravelPlanThis.getView().byId("Lbl_SimReq").setVisible(false);
						        TravelPlanThis.getView().byId("SimReq").setVisible(false);

					   }
                   
					if(sap.ui.getCore().getModel("global").getData().isCopy){
						/*oData.ZZ_ZVISAT = "2";*/
						oData.ZZ_SMODID  = sap.ui.getCore().getModel("global").getData().screenData.ZZ_DEP_TYPE;
						oData.ZZ_REINR = "00000000";
						oData.view.enabledCountry = false;
						oData.view.enabled = true;
						oData.view.isFuture = true;
						oData.view.international = oData.ZZ_SMODID == "INTL";
						oData.view.enableConfirm = oData.ZZ_SMODID == "INTL";
						oData.view.visaAvailability = (oData.ZZ_TRV_TYP == "BUSR" || oData.ZZ_TRV_TYP == "INFO") && oData.ZZ_SMODID == "INTL";
					}
				////############### UCD1KOR 13 July 2021 changes BUSR copy ################////  
					/////################ UCD1KOR Sept 16th Condition for Accomdation #################///////
					if(oData.TRV_HDRtoTRV_ACCOM.results[0] && oData.TRV_HDRtoTRV_ACCOM.results[0].ZZ_CONTACT === "" && oData.TRV_HDRtoTRV_ACCOM.results[0].ZZ_BEGDA=== "" && oData.TRV_HDRtoTRV_ACCOM.results[0].ZZ_ENDDA === "" && oData.TRV_HDRtoTRV_ACCOM.results[0].ZZ_ZPLACE=== ""){
						oData.TRV_HDRtoTRV_ACCOM.results = []
					}
				
					
					oModel.setData(oData);
					TravelPlanThis.getView().bindElement("/");
					that.backGroundColor();
					TravelPlanThis.getView().setModel(oModel);
					if (screenData.ZZ_REQ_TYP == "HOME" || screenData.ZZ_REQ_TYP == "EMER") {
						TravelPlanThis.getTravelDetail(oData);
					} else {
						sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oDeputationThis);
					}
					// Filter travel type detail
					var oFilter = new sap.ui.model.Filter("ZZ_TRVCAT", sap.ui.model.FilterOperator.EQ, oData.ZZ_TRV_TYP);
					TravelPlanThis.byId("TableDetailId").getBinding("rows").filter([ oFilter ], sap.ui.model.FilterType.Application);
					if (oData.ZZ_CHANGE_DE == "X") {
						TravelPlanThis.byId("TableDetailOldId").getBinding("rows").filter([ oFilter ], sap.ui.model.FilterType.Application);
					}
					oDeputationThis.travelDeffered.resolve();
				}, function(oError) {
					sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oDeputationThis);
					sap.ca.ui.message.showMessageBox({
						type : sap.ca.ui.message.Type.ERROR,
						message : "Sorry for this inconvenience. Please contact support team",
						details : oError.responseText
					});
				});
			}
		} else { // Deputation request
			var viewDeputationData = view.getModel().getData();
			var batchOperation6 = oDataModel.createBatchOperation("CUSTOMER_DETAILS_RFC?PERNR='" + viewDeputationData.screenData.ZZ_DEP_PERNR + "'&$format=json", "GET");
			var batchOperation7 = oDataModel.createBatchOperation("TRV_HDRSet(ZZ_PERNR='" + viewDeputationData.screenData.ZZ_DEP_PERNR + "',ZZ_DEP_REQ='" + viewDeputationData.screenData.ZZ_TRV_REQ + "',ZZ_VERSION='',ZZ_TRV_TYP='DEPU')?$expand=TRV_HDRtoTRV_travel_Data,TRV_HDRtoTRV_COST_ASGN,TRV_HDRtoTRV_ADVANCE,TRV_HDRtoTRV_ACCOM,DEP_VISA_PLAN", "GET");
			var batchOperation8 = oDataModel.createBatchOperation("GetF4Table?TableName='ZE2E_DEP_COC_C'&Col1='ZZ_LAND1'&Col2=''&Col3=''&Col4=''&Col5=''&Col6=''&Col7=''&Col8=''&Col9=''&Col10=''&$format=json", "GET");
			var batchOperation9 = oDataModel.createBatchOperation("GetConstant?CONST='DEPU'&SELPAR='MIGRATION_REQ'&$format=json", "GET");
			var batchOperation10 = oDataModel.createBatchOperation("GetConstant?CONST='TRFR'&SELPAR='WARNING'&$format=json", "GET");
			oDataModel.addBatchReadOperations([ batchOperation0, batchOperation1, batchOperation2, batchOperation3, batchOperation4, batchOperation5, batchOperation6, batchOperation7, batchOperation8, batchOperation9, batchOperation10 ]);
			if (!sap.ui.getCore().getModel("global").getData().isCreate && (sap.ui.getCore().getModel("global").getData().ZZ_VREASON == 'DA' || sap.ui.getCore().getModel("global").getData().ZZ_VREASON == 'DB')) {
				var iVersion = sap.ui.getCore().getModel("global").getData().ZZ_VERSION - 1;
				var batchOperation11 = oDataModel.createBatchOperation("TRV_HDRSet(ZZ_PERNR='" + screenData.ZZ_DEP_PERNR + "',ZZ_DEP_REQ='" + screenData.ZZ_TRV_REQ + "',ZZ_VERSION='" + iVersion + "',ZZ_TRV_TYP='" + "DEPU" + "')?$expand=TRV_HDRtoTRV_COST_ASGN,TRV_HDRtoTRV_travel_Data", "GET");
				oDataModel.addBatchReadOperations([ batchOperation11 ]);
			}
			// TGG1HC
			oDataModel.addBatchReadOperations([ batchOperation13 ]);
			oDataModel.submitBatch(function(oResult) {
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setSizeLimit(300);
				var oData = {};
				oData = oResult.__batchResponses[7].data;
				if (!sap.ui.getCore().getModel("global").getData().isCreate && (sap.ui.getCore().getModel("global").getData().ZZ_VREASON == 'DA' || sap.ui.getCore().getModel("global").getData().ZZ_VREASON == 'DB')) {
					oData.old = oResult.__batchResponses[11].data;
				} else {
					oData.ZZ_CHANGE_AC = "";
					oData.ZZ_CHANGE_AD = "";
					oData.ZZ_CHANGE_CO = "";
					oData.ZZ_CHANGE_DE = "";
					oData.ZZ_CHANGE_GE = "";
				}
				if (oData.ZZ_ZCATG == "") {
					oData.ZZ_ZCATG = TravelPlanThis.assignTravelCategory(sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_LEVEL);
				}
				TravelPlanThis.bindTravelData(oData, oResult.__batchResponses[0].data, oResult.__batchResponses[1].data, oResult.__batchResponses[2].data, oResult.__batchResponses[3].data, oResult.__batchResponses[4].data, oResult.__batchResponses[5].data, oResult.__batchResponses[6].data);
				// Set default value for date picker
				for ( var i = 0; i < oData.TRV_HDRtoTRV_travel_Data.results.length && oData.TRV_HDRtoTRV_travel_Data != undefined; i++) {
					if (oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA != "00000000" && oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA != "" && oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA != null) {
						oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA_VALUE = new Date(oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA.substr(0, 4), oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA.substr(4, 2) - 1, oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA.substr(6, 2));
					} else {
						oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA = "";
					}
					if (oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ENDDA != "00000000" && oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ENDDA != "" && oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ENDDA != null) {
						oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ENDDA_VALUE = new Date(oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ENDDA.substr(0, 4), oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ENDDA.substr(4, 2) - 1, oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ENDDA.substr(6, 2));
					} else {
						oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ENDDA = "";
					}
				}
				for ( var i = 0; i < oData.TRV_HDRtoTRV_ACCOM.results.length && oData.TRV_HDRtoTRV_ACCOM != undefined; i++) {
					if (oData.TRV_HDRtoTRV_ACCOM.results[i].ZZ_BEGDA != "00000000" && oData.TRV_HDRtoTRV_ACCOM.results[i].ZZ_BEGDA != "" && oData.TRV_HDRtoTRV_ACCOM.results[i].ZZ_BEGDA != null) {
						oData.TRV_HDRtoTRV_ACCOM.results[i].ZZ_BEGDA_VALUE = new Date(oData.TRV_HDRtoTRV_ACCOM.results[i].ZZ_BEGDA.substr(0, 4), oData.TRV_HDRtoTRV_ACCOM.results[i].ZZ_BEGDA.substr(4, 2) - 1, oData.TRV_HDRtoTRV_ACCOM.results[i].ZZ_BEGDA.substr(6, 2));
					} else {
						oData.TRV_HDRtoTRV_ACCOM.results[i].ZZ_BEGDA = "";
					}
					if (oData.TRV_HDRtoTRV_ACCOM.results[i].ZZ_ENDDA != "00000000" && oData.TRV_HDRtoTRV_ACCOM.results[i].ZZ_ENDDA != "" && oData.TRV_HDRtoTRV_ACCOM.results[i].ZZ_ENDDA != null) {
						oData.TRV_HDRtoTRV_ACCOM.results[i].ZZ_ENDDA_VALUE = new Date(oData.TRV_HDRtoTRV_ACCOM.results[i].ZZ_ENDDA.substr(0, 4), oData.TRV_HDRtoTRV_ACCOM.results[i].ZZ_ENDDA.substr(4, 2) - 1, oData.TRV_HDRtoTRV_ACCOM.results[i].ZZ_ENDDA.substr(6, 2));
					} else {
						oData.TRV_HDRtoTRV_ACCOM.results[i].ZZ_ENDDA = "";
					}
				}
				TravelPlanThis.checkfund(oData);
				// Convert advance from object to array
				TravelPlanThis.convertAdvance(oData);
				// Logic to enable fields in travel plan screen
				oData.view = {
					'enabled' : sap.ui.getCore().getModel("profile").getData().currentRole == "EMP" && (oData.ZZ_STATUS.substring(2, 5) == "000" || oData.ZZ_STATUS.substring(2, 5) == "008") && oDeputationThis.getView().getModel().getData().screenData.ZZ_VREASON != "DH",
					'costLength' : oData.TRV_HDRtoTRV_COST_ASGN.results.length,
					'detailLength' : TravelPlanThis.getTravelDetailLength(oData),
					'accommodationLength' : oData.TRV_HDRtoTRV_ACCOM.results.length,
					'international' : screenData.ZZ_DEP_TYPE == "INTL",
					'enabledCountry' : false,
					'visaAvailability' : false
				};
				oData.view.enableConfirm = sap.ui.getCore().getModel("profile").getData().currentRole == "EMP" && (oData.ZZ_STATUS.substring(2, 5) == "000" || oData.ZZ_STATUS.substring(2, 5) == "008");
				oData.view.confirm = !oData.view.enableConfirm;
				oData.view.enableAddDetail = sap.ui.getCore().getModel("profile").getData().currentRole == "EMP" && (oData.ZZ_STATUS.substring(2, 5) == "000" || oData.ZZ_STATUS.substring(2, 5) == "008");
				oData.view.isMigration = oResult.__batchResponses[9].data.GetConstant.VALUE == view.getModel().getData().screenData.ZZ_DEP_REQ.substr(0, 1);
				oData.view.trfrDaysBefore = oResult.__batchResponses[10].data.GetConstant.VALUE;
				
				/*Start-Changes to enable fields for past dates*/
				if(sap.ui.getCore().getModel("profile").getData().currentRole == "EMP" && oData.ZZ_VERSION.trim() == "1" && 
						(oData.ZZ_STATUS == "AA000" || oData.ZZ_STATUS.substring(2, 5) == "008")){
					if(sap.ui.project.e2etm.util.StaticUtility.checkDateInPast(oData.ZZ_DATV1)||sap.ui.project.e2etm.util.StaticUtility.checkDateInPast(oData.ZZ_DATB1)){
						oData.view.isFuture = true;
						oData.view.enabled = true;
					}else{
						if (sap.ui.project.e2etm.util.StaticUtility.checkDateInPast(oData.ZZ_DATV1) && !oData.view.isMigration) {
							oData.view.isFuture = false;
						} else {
							oData.view.isFuture = oData.view.enabled;
						}
					}
					// added changes by VAB6KOR to enble fields for past dates
				}else if(sap.ui.getCore().getModel("profile").getData().currentRole == "EMP" && (oDeputationThis.getView().getModel().getData().screenData.ZZ_VREASON == "DA" || oDeputationThis.getView().getModel().getData().screenData.ZZ_VREASON == "" || oDeputationThis.getView().getModel().getData().screenData.ZZ_VREASON == null) && 
						(oData.ZZ_STATUS == "AA000" || oData.ZZ_STATUS.substring(2, 5) == "008")){
					if(sap.ui.project.e2etm.util.StaticUtility.checkDateInPast(oData.ZZ_DATV1)||sap.ui.project.e2etm.util.StaticUtility.checkDateInPast(oData.ZZ_DATB1)){
						oData.view.isFuture = true;
						oData.view.enabled = true;
					}else{
						if (sap.ui.project.e2etm.util.StaticUtility.checkDateInPast(oData.ZZ_DATV1) && !oData.view.isMigration) {
							oData.view.isFuture = false;
						} else {
							oData.view.isFuture = oData.view.enabled;
						}
					}
				}else{
				/*End-Changes to enable fields for past dates*/
				if (sap.ui.project.e2etm.util.StaticUtility.checkDateInPast(oData.ZZ_DATV1) && !oData.view.isMigration) {
					oData.view.isFuture = false;
				} else {
					oData.view.isFuture = oData.view.enabled;
				}
				}
				oData.view.ZZ_DATB1_VALUE = new Date(oData.ZZ_DATB1.substr(0, 4), oData.ZZ_DATB1.substr(4, 2) - 1, oData.ZZ_DATB1.substr(6, 2));
				oData.view.ZZ_DATV1_VALUE = new Date(oData.ZZ_DATV1.substr(0, 4), oData.ZZ_DATV1.substr(4, 2) - 1, oData.ZZ_DATV1.substr(6, 2));
				//UEA6KOR_17.9.2020
				oData.view.ZZ_STPERS_ERROR = "None";
				oData.view.ZZ_ENDPERS_ERROR = "None";
				//UEA6KOR_17.9.2020				
				oData.ZZ_MODID = "DEPU";
				oData.ZZ_SMODID = (oData.ZZ_FMCNTRY == oData.ZZ_LAND1) || (oData.ZZ_FMCNTRY == "IN" && oData.ZZ_LAND1 == "NP") || (oData.ZZ_FMCNTRY == "NP" && oData.ZZ_LAND1 == "IN") ? "DOME" : "INTL";
				oData.view.cargoVis = oData.ZZ_TRV_TYP == "DEPU" && oData.ZZ_SMODID == "INTL";
				oData.view.coc = oResult.__batchResponses[8].data.results;
				//oData.ZZ_CCNAME = oData.ZZ_CUST_NAME;
			
				//start of code uml6kor for freezing first row when version greater than 1  19/9/2019
				if(sap.ui.getCore().getModel("profile").getData().currentRole == "EMP"  && oData.TRV_HDRtoTRV_travel_Data.results[0].ZZ_VERSION >= 2 && oData.TRV_HDRtoTRV_travel_Data.results[0].ZZ_BEGDA_VALUE <= new Date()){ //uml6kor  23/9/2019 only disable for past dates 
					oData.TRV_HDRtoTRV_travel_Data.results[0].ZZ_ACTIVE = "";
					oData.view.isFuture = false; //added by uml6kor 24/9/2019
				}
				//end of code uml6kor for freezing first row when version greater than 1  19/9/2019

	
				// Set model and bind root element
				oModel.setData(oData);
				backup = TravelPlanThis.copyFields(oData, backup);
				TravelPlanThis.getView().bindElement("/");
				TravelPlanThis.getView().setModel(oModel);
/*Start-Change Family Return Dates*/
				if(oData.ZZ_TRV_TYP == "DEPU" && oData.ZZ_SMODID == "INTL"&& sap.ui.getCore().getModel("global").getData().changeType == "DH"){
				 	tabIndex = 2;
				 	oData.view.selectedTab = tabIndex;
				 	TravelPlanThis.onTabSelect(null);
				 }
/*End-Change Family Return Dates*/	
				sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oDeputationThis);
				// Set data for comment history in Deputation view
				var deputationData = oDeputationThis.getView().getModel().getData();
				deputationData.screenData.ZZ_COMMENTS = deputationData.screenData.ZZ_COMMENTS;
				oDeputationThis.getView().getModel().setData(deputationData);
				oData.ZZ_COMMENTS = "";
				if(oData.ZZ_CATID == ""){
					oData.ZZ_CATID = screenData.ZZ_DEP_SUB_TYPE;
                }
				TravelPlanThis.prepareDataforExistingRequest(oData);
				if (oDeputationThis.getView().getModel().getData().screenData.ZZ_TRV_CAT == "TRFR" && oDeputationThis.getView().getModel().getData().screenData.ZZ_DEP_TYPE == "DOME") {
					oData.view.enabled = false;
				}
				// Insurance one month only for VA/VN
				if (sap.ui.getCore().getModel("global").getData().ZZ_ASG_TYP == "VA" || sap.ui.getCore().getModel("global").getData().ZZ_ASG_TYP == "VN") {
					oData.ZZ_ZINSUR = "A";
					oData.insurance.pop();
				}
				// TGG1HC for VKM_TR
				if (!sap.ui.getCore().getModel("global").getData().isCreate && (sap.ui.getCore().getModel("global").getData().ZZ_VREASON == 'DA' || sap.ui.getCore().getModel("global").getData().ZZ_VREASON == 'DB')) {
					// oData.VKM_TR =
					// oResult.__batchResponses[12].data.GetConstant.VALUE;
					sap.ui.getCore().getModel("global").setProperty("/VKM_TR", oResult.__batchResponses[12].data.GetConstant.VALUE);
				} else {
					// oData.VKM_TR =
					// oResult.__batchResponses[11].data.GetConstant.VALUE;
					sap.ui.getCore().getModel("global").setProperty("/VKM_TR", oResult.__batchResponses[11].data.GetConstant.VALUE);
				}
				oModel.setData(oData);
				that.backGroundColor();
				// Filter travel type detail
				var oFilter = new sap.ui.model.Filter("ZZ_TRVCAT", sap.ui.model.FilterOperator.EQ, oData.ZZ_TRV_TYP);
				TravelPlanThis.byId("TableDetailId").getBinding("rows").filter([ oFilter ], sap.ui.model.FilterType.Application);
				oDeputationThis.travelDeffered.resolve();
			}, function(oError) {
				sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oDeputationThis);
				sap.ca.ui.message.showMessageBox({
					type : sap.ca.ui.message.Type.ERROR,
					message : "Sorry for this inconvenience. Please contact support team",
					details : oError.responseText
				});
			});
		}
	},
///////////#################  UCD1KOR ###############///////26 Nov 2019 start
    backGroundColor:function(){
    	var that =this;
    	setTimeout(function(){
          	var sTime = document.getElementById(that.getView().sId+"--idTripStartTime-Picker-inner");
          	var eTime = document.getElementById(that.getView().sId+"--idTripEndTime-Picker-inner");
          	//sTime.disabled == true eTime.disabled == true
              if(that.getView().byId("idTripStartDate").getEnabled() == false || sTime.disabled==true){
              	sTime.style.backgroundColor = "#F0F8FF";
              	sTime.readOnly = true;
              }
              if(that.getView().byId("idTripEndDate").getEnabled() == false || eTime.disabled==true){
              	eTime.style.backgroundColor = "#F0F8FF";
              	eTime.readOnly = true;
              }
              try{
            	  var sTime_Previous = document.getElementById(that.getView().sId+"--idPreviousTripStartTime-Picker-inner");
                  var eTime_Previous = document.getElementById(that.getView().sId+"--idPreviousTripEndTime-Picker-inner");
                  if(that.getView().byId("idPreviousTripStartDate").getEnabled() == false || sTime_Previous.disabled==true){
                	  	sTime_Previous.style.backgroundColor = "#F0F8FF";
                	  	sTime_Previous.readOnly = true;
                    }
                  if(that.getView().byId("idPreviousTripEndDate").getEnabled() == false || eTime_Previous.disabled==true){
                       	eTime_Previous.style.backgroundColor = "#F0F8FF";
                    	eTime_Previous.readOnly = true;
                    }
              }catch(err){}
    	}, 1000);
    },
    ///////////#################  UCD1KOR ###############///////////////26 Nov 2019 End	
	onSaveDialogPress : function(evt) {
		if (TravelPlanThis.onTabSelect(null) == "") {
			if (TravelPlanThis.getView().getModel().getData().TRV_HDRtoTRV_COST_ASGN.results.length == 0) {
				TravelPlanThis.getView().getModel().getData().view.selectedTab = 1;
				tabIndex = 1;
				TravelPlanThis.getCostAssignment(TravelPlanThis.getView().getModel().getData());
				TravelPlanThis.getView().getModel().refresh();
				sap.m.MessageToast.show("Please enter cost assigment");
			} else {
				TravelPlanThis.saveRequest("AA000");
			}
		}
	},
	// Close dialog press
	onCloseDialogPress : function(evt) {
		if (TravelPlanThis.isChange()) {
			sap.m.MessageBox.confirm(TravelPlanThis.getView().getModel("i18n").getProperty("cur_dat_los"), function(oAction) {
				if (oAction == "OK") {
					var oData = TravelPlanThis.getView().getModel().getData();
					oData = TravelPlanThis.copyFields(backup, oData);
					// Disable modify flag
					oData.view.enabled = false;
					TravelPlanThis.getView().getModel().setData(oData);
					TravelPlanThis.getView().getController()["TRA_Detail_Dialog"].close();
				}
			});
		} else {
			var odata = TravelPlanThis.getView().getModel().getData();
			// Disable modify flag
			odata.view.enabled = false;
			TravelPlanThis.getView().getModel().setData(odata);
			TravelPlanThis.getView().getController()["TRA_Detail_Dialog"].close();
		}
	},
	// Open Dialog Detail
	onOpenDetail : function(evt) {
		TravelPlanThis.openDialog("TRA_Detail_Dialog");
		var odata = TravelPlanThis.getView().getModel().getData();
		odata.view.enabled = true;
		TravelPlanThis.getView().getModel().setData(odata);
	},
	// Open dialog
	openDialog : function(fragmentName) {
		if (!this[fragmentName]) {
			this[fragmentName] = sap.ui.xmlfragment("sap.ui.project.e2etm.fragment.travel." + fragmentName, this // associate
																													// controller
																													// with
																													// the
																													// fragment
			);
			TravelPlanThis.getView().addDependent(this[fragmentName]);
		}
		// Backup Data
		backup = TravelPlanThis.copyFields(TravelPlanThis.getView().getModel().getData(), backup);
		this[fragmentName].open();
	},
	onVisaAvailabilityChange : function(evt) {
		var oData = TravelPlanThis.getView().getModel().getData();
		sap.ui.getCore().byId('panelEmployeeVisaCopy').setVisible(evt.getSource().getSelectedKey() == 'X');
		TravelPlanThis.getView().getModel().setData(oData);
	},
	//UEA6KOR_15.9.2020 personal trip
	OnPersonalTravelSelect : function(){
		if(TravelPlanThis.getView().byId("idpersbox").getSelectedKey()=="01"){
		    TravelPlanThis.getView().byId("lbPerstdate").setVisible(true);
			TravelPlanThis.getView().byId("idPerstdate").setVisible(true);
			TravelPlanThis.getView().byId("lbPersendate").setVisible(true);
			TravelPlanThis.getView().byId("idPersendate").setVisible(true);
			TravelPlanThis.getView().getModel().getData().PersFlag="X";
	  }else{
		    TravelPlanThis.getView().byId("lbPerstdate").setVisible(false);
			TravelPlanThis.getView().byId("idPerstdate").setVisible(false);
			TravelPlanThis.getView().byId("lbPersendate").setVisible(false);
			TravelPlanThis.getView().byId("idPersendate").setVisible(false);
			TravelPlanThis.getView().getModel().getData().PersFlag="";
			TravelPlanThis.getView().getModel().getData().SDate="";
			TravelPlanThis.getView().getModel().getData().STime="";
			TravelPlanThis.getView().getModel().getData().EDate="";
			TravelPlanThis.getView().getModel().getData().ETime="";			
	}
	},
	//UEA6KOR_15.9.2020 personal trip
	
	OnSimcardSelect : function(){
		if(TravelPlanThis.getView().byId("SimReq").getSelectedKey()=="Y"){
			TravelPlanThis.getView().byId("Lbl_SimTyp").setVisible(true);
			TravelPlanThis.getView().byId("Lbl_SimData").setVisible(true);
			TravelPlanThis.getView().byId("SimTyp").setVisible(true);
			TravelPlanThis.getView().byId("SimData").setVisible(true);
//			TravelPlanThis.getView().byId("SimTyp").addStyleClass("dep_customer_flexbox_select");
//			TravelPlanThis.getView().byId("SimData").addStyleClass("dep_customer_flexbox_select");
			
		}else{
			TravelPlanThis.getView().byId("Lbl_SimTyp").setVisible(false);
			TravelPlanThis.getView().byId("Lbl_SimData").setVisible(false);
			TravelPlanThis.getView().byId("SimTyp").setVisible(false);
			TravelPlanThis.getView().byId("SimData").setVisible(false);	
//			TravelPlanThis.getView().byId("SimTyp").addStyleClass("dep_customer_flexbox_select");
//			TravelPlanThis.getView().byId("SimData").addStyleClass("dep_customer_flexbox_select");
			TravelPlanThis.getView().getModel().getData().ZZ_SIM_TYP_KEY="";
			TravelPlanThis.getView().getModel().getData().ZZ_SIM_DATA_KEY="";
		}
		
		},
	onReturnDeputationPress : function(evt) {
		if (TravelPlanThis.isChange() && TravelPlanThis.getView().getModel().getData().view.enabled) {
			sap.m.MessageBox.confirm(TravelPlanThis.getView().getModel("i18n").getProperty("cur_dat_los"), function(oAction) {
				if (oAction == "OK") {
					var oData = TravelPlanThis.getView().getModel().getData();
					oData = TravelPlanThis.copyFields(backup, oData);
					// Disable modify flag
					oData.view.enabled = false;
					TravelPlanThis.getView().getModel().setData(oData);
					sap.ui.core.routing.Router.getRouter("MyRouter").navTo("deputation");
				}
			});
		} else {
			sap.ui.core.routing.Router.getRouter("MyRouter").navTo("deputation");
			;
		}
	},
	onReturnHomePress : function(evt) {
		if (TravelPlanThis.isChange() && TravelPlanThis.getView().getModel().getData().view.enabled) {
			sap.m.MessageBox.confirm(TravelPlanThis.getView().getModel("i18n").getProperty("cur_dat_los"), function(oAction) {
				if (oAction == "OK") {
					var oData = TravelPlanThis.getView().getModel().getData();
					oData = TravelPlanThis.copyFields(backup, oData);
					// Disable modify flag
					oData.view.enabled = false;
					TravelPlanThis.getView().getModel().setData(oData);
					sap.ui.core.routing.Router.getRouter("MyRouter").myNavBack();
				}
			});
		} else {
			sap.ui.core.routing.Router.getRouter("MyRouter").myNavBack();
		}
	},
	//// UCD1KOR 19 Apr 2020
	//Hide fund F08,F09 for GLOB
	// Hide fund F01,F02,F03,F04,F07 for INBO ,INRB
	onChangeTravelClassification:function(){
		var data = TravelPlanThis.getView().getModel().getData();
			try{
				for(var i=0;i<data.TRV_HDRtoTRV_COST_ASGN.results.length;i++){
					///################### UCD1KOR 02 AUG 2021 PBC Changes ##################////////
					if(data.ZZ_CATID !== "GLOB" && sap.ui.getCore().getModel('global').getData().ZZ_TRV_CAT == 'WRKP' && data.ZZ_LAND1 =="JP"){
						data.view.fundEditable = false;
						data.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_GEBER = "F04";
						data.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_BESCHR = "Customer Consolidated (F04)";
					}
					else if(data.ZZ_CATID == "GLOB" && (data.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_GEBER !=="F08" || data.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_GEBER !=="F09")){
						data.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_GEBER = "";
						data.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_BESCHR = "";
					}
					else if(data.ZZ_CATID !== "GLOB" && (data.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_GEBER =="F08" || data.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_GEBER =="F09")){
						data.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_GEBER = "";
						data.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_BESCHR = "";
					}
				}
			}catch(err){}
			///################### UCD1KOR 02 AUG 2021 PBC Changes ##################////////
			if(data.view.fundEditable == false){
				if(data.ZZ_CATID == "GLOB" && sap.ui.getCore().getModel('global').getData().ZZ_TRV_CAT == 'WRKP' && data.ZZ_LAND1 =="JP"){
					data.view.fundEditable = true;
		         }
			}
			TravelPlanThis.getView().getModel().refresh();
	},
	// Open value help request
	onValueHelpRequest : function(evt) {
		var that = this;
		var oControl = evt.oSource;
		var selectedPath = evt.getSource().getParent().getBindingContext().sPath;
		////################ UCD1KOR 30 Nov 2020 ######################/////////////////
		//###########################################################################//
		
		if(oControl.mProperties && oControl.mProperties.enabled == true && oControl.mProperties.editable == true){
		var oValueHelpDialog = new sap.ui.comp.valuehelpdialog.ValueHelpDialog({
			supportMultiselect : false,
			cancel : function(oControlEvent) {
				oValueHelpDialog.close();
			},
			change : function() {
				alert("changeDialog");
			},
			afterClose : function() {
				oValueHelpDialog.destroy();
				
			
			},
			ok : function(oControlEvent) {
				var sKey = oControlEvent.getParameter("tokens")[0].getProperty("key");
				var sText = oControlEvent.getParameter("tokens")[0].getProperty("text");
				oControl.setValue(sKey);
				
				// UCD1KOR 17 Jun 2020 Condition added for Fund RBEI-PE???, ZE2E_DEPU_HDR???ZZ_CATID == ???GLOB??? 
				if(that.ConditionCheckForJapan == true && (sKey == "F01" || sKey == "F02" || sKey == "F07" )){
					TravelPlanThis.getView().getModel().getProperty(selectedPath).ZZ_BESCHR = "";
					TravelPlanThis.getView().getModel().getProperty(selectedPath).ZZ_GEBER = "";
		        	sap.ui.define(["sap/m/MessageBox"], function(MessageBox) {
		        		MessageBox.show(
		        			"Since you are travelling to Global customer, default fund is F08. However the fund can be changed to only F03/F04.", {
		        				icon: MessageBox.Icon.ERROR,
		        				title: "Error",
		        				actions: [MessageBox.Action.OK],
		        				onClose: function(oAction) {}
		        			}
		        		);
		        	});
		        	oValueHelpDialog.close();
					return;
				}
				else{
					oValueHelpDialog.close();
				}
				
				
				
				
				//dye5kor_MCR_NON_MCR Changes
				if(oControl.getId().indexOf("resourceGrp") != -1){
					TravelPlanThis.getView().getModel().getData().ResoucesDesc = sText;
				for(var i=0;i<TravelPlanThis.getView().getModel().getData().mcrData.length;i++){
					if(TravelPlanThis.getView().getModel().getData().mcrData[i].taskId == TravelPlanThis.getView().getModel().getData().ZZ_TASKID && TravelPlanThis.getView().getModel().getData().mcrData[i].ResourceId == sKey){
						TravelPlanThis.getView().byId("ResourceTyp").setValue(TravelPlanThis.getView().getModel().getData().mcrData[i].ResourceTyp );	
						TravelPlanThis.getView().getModel().getData().ZZ_RESOURCETYP = TravelPlanThis.getView().getModel().getData().mcrData[i].ResourceTyp;
						TravelPlanThis.getView().byId("ResourceTyp").setEditable(false); //added by UEA6KOR_11.03.2019
					}
				
				}
			}
				if(oControl.getId().indexOf("taskId") != -1){
					TravelPlanThis.getView().getModel().getData().taskDesc = sText;
				}
				//dye5kor_MCR_NON_MCR_Changes
				if (oControl.getId().indexOf("costCenterId") != -1) {
				oControl.getBindingContext().getModel().getProperty(oControl.getBindingContext().sPath).KTEXT = sText;	
					/*Start-Warning message commented*/						
//					TravelPlanThis.showCostCenterMessage(sKey);
					/*End-Warning message commented*/	
				}
				if (oControl.getId().indexOf("budgetCenterId") != -1) {
					
				oControl.getBindingContext().getModel().getProperty(oControl.getBindingContext().sPath).ZzFundDes = sText;
					
				/*Start-Warning message commented*/					
				//					TravelPlanThis.showBudgetCenterMessage(sKey);
				/*End-Warning message commented*/					
				}
				if (oControl.getId().indexOf("customerId") != -1) {
					/* Start-CTG F03 Changes */
					// TravelPlanThis.getView().getModel().getData().ZZ_CCNAME =
					// sKey;
					TravelPlanThis.getView().getModel().getData().ZZ_CLENTY = sKey;
					/* End-CTG F03 Changes */
				}
				if (oControl.getId().indexOf("budgetCodeId") != -1) {
					var oData = TravelPlanThis.getView().getModel().getData();
					/*var iIndex = oControl.getId().substring(oControl.getId().indexOf("row") + 3, oControl.getId().length);*/
					//dye5kor_UpgradeIssuesFix_05.11.2019
					var iIndex = oControl.getBindingContext().sPath.split("/")[3];
					
					//dye5kor_UpgradeIssuesFix_05.11.2019
					oControl.getBindingContext().getModel().getProperty(oControl.getBindingContext().sPath).ZZ_BUD_DESC = sText;
					oData.TRV_HDRtoTRV_COST_ASGN.results[iIndex].ZZ_FIPEX_ERROR = 'None';
					TravelPlanThis.getView().getModel().setData(oData);
					
				}
				if (oControl.getId().indexOf("fundId") != -1) { // To set VKM
																// and Customer
																// at actuals
																// field visible
					
					var cId = oControl.getId();
					var rowNum = cId.substr(cId.length-1,1);
					
/*					TravelPlanThis.getView().byId("costCenterId-col4-row"+rowNum).setEditable(false);
					TravelPlanThis.getView().byId("wbsId-col3-row"+rowNum).setEditable(false);
*/					//dye5kor_UpgradeIssues_fix_04.11.2019
					 var cloneNum = parseInt(cId.split("_")[4].substring(cId.split("_")[4].length,5));
					 var wbsCloneNum = cloneNum + 2;
					 var costCenterCloneNum = cloneNum + 3;
					 TravelPlanThis.getView().byId("costCenterId-__clone"+costCenterCloneNum).setEditable(false);
					 TravelPlanThis.getView().byId("wbsId-__clone"+wbsCloneNum).setEditable(false);
					
					//dye5kor_UpgradeIssues_fix_04.11.2019
					
					if(sKey=="F01"){
						/*TravelPlanThis.getView().byId("wbsId-col3-row"+rowNum).setEditable(false);
						TravelPlanThis.getView().byId("costCenterId-col4-row"+rowNum).setEditable(true);*/
						//dye5kor_upgradeFixes
						TravelPlanThis.getView().byId("wbsId-__clone"+wbsCloneNum).setEditable(false);
						TravelPlanThis.getView().byId("costCenterId-__clone"+costCenterCloneNum).setEditable(true);
						
						//dye5kor_upgradeFixes
					}else if(sKey=="F02" || sKey=="F03" || sKey=="F04" ){
						
						/*TravelPlanThis.getView().byId("wbsId-col3-row"+rowNum).setEditable(true);*/
						TravelPlanThis.getView().byId("wbsId-__clone"+wbsCloneNum).setEditable(true);
					
					}else if(sKey=="F09"){
						/* UCD1KOR 23 Mar 2021 Added below conditions for F09 */
						////###############################################################################///////
						TravelPlanThis.getView().byId("costCenterId-__clone"+costCenterCloneNum).setEditable(true);
					}
					else if(sKey=="F08"){
						/* UCD1KOR 23 Mar 2021 Added below conditions for F08 */
						////###############################################################################///////
						TravelPlanThis.getView().byId("costCenterId-__clone"+costCenterCloneNum).setEditable(false);
						TravelPlanThis.getView().byId("wbsId-__clone"+wbsCloneNum).setEditable(true);
					}
					else{
						
						/*TravelPlanThis.getView().byId("costCenterId-col4-row"+rowNum).setEditable(true);
						TravelPlanThis.getView().byId("wbsId-col3-row"+rowNum).setEditable(true);	*/
						//dye5kor_upgradeFixes
						TravelPlanThis.getView().byId("costCenterId-__clone"+costCenterCloneNum).setEditable(true);
						TravelPlanThis.getView().byId("wbsId-__clone"+wbsCloneNum).setEditable(true);	
						//dye5kor_upgradeFixes
					}
					/* ####################### 09 Apr 2021 UCD1KOR
					Added Below Logic
					If Fund is F08 then we need to filter with ZZ_CATG = 4 ####################################*/
					var oData = TravelPlanThis.getView().getModel().getData();
					oData.wbsElement = [];
						for(var i=0;i<oData.wbsElementData.length;i++){
							if(sKey=="F08" &&( oData.wbsElementData[i].ZZ_CATG == "4" ||  oData.wbsElementData[i].ZZ_CATG == "04")){
								oData.wbsElement.push(oData.wbsElementData[i]);
							}
							else if(sKey !="F08" && (oData.wbsElementData[i].ZZ_CATG != "4" ||  oData.wbsElementData[i].ZZ_CATG != "04")){
								oData.wbsElement.push(oData.wbsElementData[i]);
							}
						}
					/*######################## End Changes UCD1KOR 09 Apr 2021#################################*/
					/*var iIndex = oControl.getId().substring(oControl.getId().indexOf("row") + 3, oControl.getId().length);*/
					//dye5kor_upgradeIssuesFix_05.11.2019
					var iIndex = oControl.getBindingContext().sPath.split("/")[3];
					
					//dye5kor_upgradeissuesFix_05.11.2019
					oControl.getBindingContext().getModel().getProperty(oControl.getBindingContext().sPath).ZZ_BESCHR = sText;
					//dye5kor
					oData.TRV_HDRtoTRV_COST_ASGN.results[iIndex].ZZ_FISTL = "";
					oData.TRV_HDRtoTRV_COST_ASGN.results[iIndex].ZzFundDes = '';
					oData.TRV_HDRtoTRV_COST_ASGN.results[iIndex].ZZ_FIPOS = '';
					oData.TRV_HDRtoTRV_COST_ASGN.results[iIndex].ZZ_POST1 = '';
					oData.TRV_HDRtoTRV_COST_ASGN.results[iIndex].ZZ_KOSTL = '';
					oData.TRV_HDRtoTRV_COST_ASGN.results[iIndex].KTEXT = '';
					oData.TRV_HDRtoTRV_COST_ASGN.results[iIndex].ZZ_FIPEX = '';
					oData.TRV_HDRtoTRV_COST_ASGN.results[iIndex].ZZ_BUD_DESC = '';
					
					TravelPlanThis.checkfund(oData);
				
				
				}
				/* Start-CI Reporting changes */
				if (oControl.getId().indexOf("ipDepartment") != -1) { // To
																		
					TravelPlanThis.getView().getModel().getData().ZZ_CI_BU = oControlEvent.getParameter("tokens")[0].getAggregation("customData")[0].getValue().BU;
					TravelPlanThis.getView().getModel().getData().ZZ_CI_GRP = "";
				}
				if (oControl.getId().indexOf("ipDivision") != -1) { 

                   TravelPlanThis.getView().getModel().getData().ZZ_CI_BU = "";
                   TravelPlanThis.getView().getModel().getData().ZZ_CI_GRP = "";
                   TravelPlanThis.getView().getModel().getData().ZZ_CI_DEP = "";
                  
                   }

				
			/*	if(oControl.getId().indexOf("col3") != -1){*/
					if(oControl.sId.indexOf("wbsId")!= -1){   //dye5kor_upgardeIssuesFix
					oControl.getBindingContext().getModel().getProperty(oControl.getBindingContext().sPath).ZZ_POST1 = sText;
					/*var IndexSelected = oControl.getId().substring(oControl.getId().indexOf("row") + 3, oControl.getId().length);*/
					//dye5kor_UpgradeIssuesFix
					var IndexSelected = oControl.getBindingContext().sPath.split("/")[3];
					//dye5kor_UpgradeIssuesFix
					
					var oDataModel =  new sap.ui.model.odata.ODataModel(sServiceUrl);
					if(oControl.getBindingContext().getModel().getProperty(oControl.getBindingContext().sPath).ZZ_GEBER=='F03'){
						oDataModel.read("MCRFlagSet(PIFID='" + sKey +"')", null, null, true, jQuery.proxy(function(oData, response) {
							if(oData.MCR_FLAG == 'X'){
								TravelPlanThis.getView().getModel().getData().mcrFlag = 'X';
								TravelPlanThis.getView().getModel().getData().TRV_HDRtoTRV_COST_ASGN.results[IndexSelected].ZZ_MCR='X';
								TravelPlanThis.getView().byId("flexCtgMcr").setVisible(true);
								TravelPlanThis.getView().byId("flexBoxFundF03").setVisible(false); 
								
							}else{
								TravelPlanThis.getView().byId("flexCtgMcr").setVisible(false);
								TravelPlanThis.getView().byId("flexBoxFundF03").setVisible(true); //uncomment by UEA6KOR_11.03.2019
								TravelPlanThis.getView().getModel().getData().mcrFlag = '';
								TravelPlanThis.getView().getModel().getData().TRV_HDRtoTRV_COST_ASGN.results[IndexSelected].ZZ_MCR='';
								TravelPlanThis.getView().getModel().getData().TRV_HDRtoTRV_COST_ASGN.results[IndexSelected].ZZ_TASKID='';
								TravelPlanThis.getView().getModel().getData().TRV_HDRtoTRV_COST_ASGN.results[IndexSelected].ZZ_RESOURCEID='';
								TravelPlanThis.getView().getModel().getData().TRV_HDRtoTRV_COST_ASGN.results[IndexSelected]. ZZ_RESOURCETYP='';								
							
							} 
							
							sap.ui.project.e2etm.util.StaticUtility.setBusy(false,this);
						},this), function(error) {
							sap.ui.project.e2etm.util.StaticUtility.setBusy(false, TravelPlanThis);
						});
						
					}
					
					//uea6kor_MCR_Non_MCR Changes
				/*	for(var i=0;i < TravelPlanThis.getView().getModel().getData().TRV_HDRtoTRV_COST_ASGN.results.length;i++){
						if (TravelPlanThis.getView().getModel().getData().TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_GEBER == 'F03'){
					
					//uea6kor_MCR_Non_MCR Changes
				//dye5kor_MCR_Non_MCR Changes
					var oDataModel =  new sap.ui.model.odata.ODataModel(sServiceUrl);
					oDataModel.read("MCRFlagSet(PIFID='" + sKey +"')", null, null, true, jQuery.proxy(function(oData, response) {
						if(oData.MCR_FLAG == 'X'){
							TravelPlanThis.getView().getModel().getData().mcrFlag = 'X';
							TravelPlanThis.getView().byId("flexCtgMcr").setVisible(true);
							TravelPlanThis.getView().byId("flexBoxFundF03").setVisible(false); //uncomment by UEA6KOR_11.03.2019
							
						}else{
							TravelPlanThis.getView().byId("flexCtgMcr").setVisible(false);
							TravelPlanThis.getView().byId("flexBoxFundF03").setVisible(true); //uncomment by UEA6KOR_11.03.2019
							TravelPlanThis.getView().getModel().getData().mcrFlag = '';
							TravelPlanThis.getView().getModel().getData().TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_MCR='';
							TravelPlanThis.getView().getModel().getData().TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_TASKID='';
							TravelPlanThis.getView().getModel().getData().TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_RESOURCEID='';
							TravelPlanThis.getView().getModel().getData().TRV_HDRtoTRV_COST_ASGN.results[i]. ZZ_RESOURCETYP='';
							
						
						} 
						
						sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oController);
					},this), function(error) {
						sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oController);
					});
				
					
					}else{
						var oDataModel =  new sap.ui.model.odata.ODataModel(sServiceUrl);
						oDataModel.read("MCRFlagSet(PIFID='" + sKey +"')", null, null, true, jQuery.proxy(function(oData, response) {
							if(oData.MCR_FLAG == 'X'){
								TravelPlanThis.getView().getModel().getData().mcrFlag = 'X';
								TravelPlanThis.getView().byId("flexCtgMcr").setVisible(true);
							//	TravelPlanThis.getView().byId("flexBoxFundF03").setVisible(false); //uncomment by UEA6KOR_11.03.2019
								
							}else{
								TravelPlanThis.getView().byId("flexCtgMcr").setVisible(false);
							//	TravelPlanThis.getView().byId("flexBoxFundF03").setVisible(true); //uncomment by UEA6KOR_11.03.2019
							
							} 
							
							sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oController);
						},this), function(error) {
							sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oController);
						});						
					}
						
					
					}*/
				//dye5kor_MCR_Non_MCR Changes
				
				}
				/* End-CI Reporting changes */
			},
		});
		var oRowsModel = new sap.ui.model.json.JSONModel();
		oValueHelpDialog.setModel(oRowsModel);
		oValueHelpDialog.theTable = oValueHelpDialog.getTable();
		oValueHelpDialog.theTable.bindRows("/");
		// sidd code start
		if (oControl.getId().indexOf("vkmId") != -1) { // vkm
			TravelPlanThis.setVKMF4(oRowsModel, oValueHelpDialog);
		}
		//dye5kor_MCR NON_MCR changes
		if (oControl.getId().indexOf("taskId") != -1) { // vkm
		TravelPlanThis.setTaskID(oRowsModel, oValueHelpDialog);
		}
		if (oControl.getId().indexOf("resourceGrp") != -1) { // vkm
			TravelPlanThis.setResourceID(oRowsModel, oValueHelpDialog);
			}
			
		//dye5kor_MCR_NON_MCR Changes
		if (oControl.getId().indexOf("customerId") != -1) { // Customer search
															// help
			TravelPlanThis.setCustomerF4(oRowsModel, oValueHelpDialog);
			oValueHelpDialog.open();
		} else if (oControl.getId().indexOf("FromLocationId") != -1) {
			TravelPlanThis.setLocationF4(oRowsModel, oValueHelpDialog, TravelPlanThis.getView().getModel().getData().ZZ_FMCNTRY);
		} else if (oControl.getId().indexOf("ToLocationId") != -1) {
			TravelPlanThis.setLocationF4(oRowsModel, oValueHelpDialog, TravelPlanThis.getView().getModel().getData().ZZ_LAND1);
		}
		/* Start-CI Reporting Changes */
		else if (oControl.getId().indexOf("ipDivision") != -1) {
			TravelPlanThis.setDivisionF4(oRowsModel, oValueHelpDialog, TravelPlanThis.getView().getModel().getData());
		} else if (oControl.getId().indexOf("ipDepartment") != -1) {
			TravelPlanThis.setDepartmentF4(oRowsModel, oValueHelpDialog, TravelPlanThis.getView().getModel().getData());
		} else if (oControl.getId().indexOf("ipGroup") != -1) {
			TravelPlanThis.setGroupF4(oRowsModel, oValueHelpDialog, TravelPlanThis.getView().getModel().getData());
		}
		/* End-CI Reporting Changes */
		else { // Table columns search help
			var sControlId = oControl.getId().substr(oControl.getId().length - 9, 4);
			/*if (sControlId == "col5") {*/ //dye5kor_UpgradeFix
				//dye5kor_UpgradeFix_04.11.2019
				if (oControl.sId.indexOf("budgetCodeId") != -1) {
				//dye5kor_UpgradeFix_04.11.2019
				/*var iIndex = oControl.getId().substring(oControl.getId().indexOf("row") + 3, oControl.getId().length);*/
				/*if (TravelPlanThis.getView().getModel().getData().TRV_HDRtoTRV_COST_ASGN.results[iIndex].ZZ_GEBER == undefined || TravelPlanThis.getView().getModel().getData().TRV_HDRtoTRV_COST_ASGN.results[iIndex].ZZ_GEBER.trim() == "") {*///Dye5kor_upgradefix
			      //dye5kor_UpgradeFixes_04.11.2019
				var iIndex = oControl.getBindingContext().sPath.split("/")[3];
				if(oControl.getBindingContext().getModel().getProperty(oControl.getBindingContext().sPath).ZZ_GEBER== undefined){
				  //dye5kor_UpgradeFixes_04.11.2019
					sap.m.MessageToast.show("Please enter Fund value");
				} else {
					sap.ui.project.e2etm.util.StaticUtility.setBusy(true, TravelPlanThis);
					var get = $.ajax({
						cache : false,
						url : sServiceUrl + "Commit_item_f4?" + "GEBER='" + TravelPlanThis.getView().getModel().getData().TRV_HDRtoTRV_COST_ASGN.results[iIndex].ZZ_GEBER + "'&ZZ_SMODID='" + TravelPlanThis.getView().getModel().getData().ZZ_SMODID + "'&$format=json",
						type : "GET"
					});
					get.fail(function(err) {
						sap.ui.project.e2etm.util.StaticUtility.setBusy(false, TravelPlanThis);
					});
					get.done(function(result, response, header) {
						TravelPlanThis.getView().getModel().getData().budgetCost = result.d.results;
						if (TravelPlanThis.getView().getModel().getData().budgetCost.length == 0) {
							sap.m.MessageToast.show("Invalid Fund");
						} else {
							TravelPlanThis.setColumnF4Table(sControlId, oRowsModel, oValueHelpDialog, oControl);
							oValueHelpDialog.open();
						}
						sap.ui.project.e2etm.util.StaticUtility.setBusy(false, TravelPlanThis);
					});
				}
			} else {
				TravelPlanThis.setColumnF4Table(sControlId, oRowsModel, oValueHelpDialog, oControl);
				oValueHelpDialog.open();
				
				
				
			}
		}
	}
	},
	
	/*beforeClose:function(evt){
		
	if(1==2){
		
	}	
	},*/
	// Currency change
	////############### 27 Feb 2020 UCD1KOR changed event onCurrencyChange to onCurrencyChange1
	onCurrencyChange1 : function(evt) {
		if (evt.getParameter('newValue').trim() != "") {
			var iIndex = sap.ui.project.e2etm.util.StaticUtility.getArrayIndex(TravelPlanThis.getView().getModel().getData().currency, "FIELD1", evt.getParameter("newValue"));
			if (iIndex == -1) {
				evt.getSource().setValueState("Error");
				sap.ca.ui.message.showMessageBox({
					type : sap.ca.ui.message.Type.ERROR,
					message : "Invalid currency",
				});
			} else {
				evt.getSource().setValueState("None");
			}
			//Advance Restriction CR changed by MYU1KOR
			var oData = TravelPlanThis.getView().getModel().getData();
			var ind = evt.getSource().getId().substr(evt.getSource().getId().length - 1);
			var new_curr = TravelPlanThis.getView().getModel().getData().currency[iIndex].FIELD1;
			var get = $.ajax({
				cache : false,
				url : sServiceUrl + "CurrExchangeSet?$filter=ZzFcurr eq'" + backup.advance[ind].currency_key + "'+and+ZzTcurr+eq+'" + new_curr + "'&$format=json",
				type : "GET"
			});
			get.fail(function(err) {
				sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
			});
			get.done(function(result, response, header) {
				//########### 27 Feb 2020 UCD1KOR check
				if(result.d.results[0] && result.d.results[0].ZzExchange != "")
					{
					var exc_rate = result.d.results[0].ZzExchange;
					oData.advance[ind].total = parseInt(oData.advance[ind].total) * exc_rate;
					oData.advance[ind].boarding = parseInt(oData.advance[ind].boarding) * exc_rate;
					TravelPlanThis.getView().getModel().setData(oData);
					}

			});	
			
			backup = TravelPlanThis.copyFields(oData, backup);
			//end of changes by MYU1KOR
		}
	},
	onAdvanceMoneyChange : function(evt) {
		var oData = TravelPlanThis.getView().getModel().getData();
		/*var iIndex = evt.getSource().getId().substr(evt.getSource().getId().length - 1);*/
		var iIndex = evt.getSource().getBindingContext().sPath.split("/")[2];
		if (isNaN(evt.getParameter("newValue"))) {
			sap.ca.ui.message.showMessageBox({
				type : sap.ca.ui.message.Type.ERROR,
				message : "Invalid Number"
			});
			evt.getSource().setValueState("Error");
		} else {
			if (evt.getSource().getValue().trim() == "") {
				evt.getSource().setValue(0);
			}
			TravelPlanThis.getView().getModel().getData().advance[iIndex].total = parseFloat(TravelPlanThis.getView().getModel().getData().advance[iIndex].boarding) + parseFloat(TravelPlanThis.getView().getModel().getData().advance[iIndex].lodging) + parseFloat(TravelPlanThis.getView().getModel().getData().advance[iIndex].surface) + parseFloat(TravelPlanThis.getView().getModel().getData().advance[iIndex].others);
			if (TravelPlanThis.getView().getModel().getData().advance[iIndex].total != 0 && TravelPlanThis.getView().getModel().getData().advance[iIndex].currency_key.trim() == "") {
				TravelPlanThis.getView().getModel().getData().advance[iIndex].currency_key_error = "Error";
				sap.ca.ui.message.showMessageBox({
					type : sap.ca.ui.message.Type.ERROR,
					message : "Invalid currency"
				});

			} else {
				TravelPlanThis.getView().getModel().getData().advance[iIndex].currency_key_error = "None";
				TravelPlanThis.getView().getModel().getData().advance[iIndex].total_error = "None";
				evt.getSource().setValueState("None");
//				start of changes by MYU1kor for CR-Advance Restriction
				var globalData = sap.ui.getCore().getModel("global").getData();
				
				var adv_data = [
					TravelPlanThis.getView().getModel().getData().ZZ_LAND1,
					TravelPlanThis.getView().getModel().getData().ZZ_LOCATION_END,
					TravelPlanThis.getView().getModel().getData().ZZ_MODID,
					sap.ui.getCore().getModel("global").getData().ZZ_TRV_CAT
				]
				var advTable = new Array(1);
				for (var i = 0; i < globalData.TrvAdvRestrict.length; i++)
					{
						advTable[i] = new Array(6);
						advTable[i][0] = globalData.TrvAdvRestrict[i].ZzToCountry;
						advTable[i][1] = globalData.TrvAdvRestrict[i].ZzTrvToloc;
						advTable[i][2] = globalData.TrvAdvRestrict[i].ZzTrvKey;
						advTable[i][3] = globalData.TrvAdvRestrict[i].ZzTrvCat;
						advTable[i][4] = globalData.TrvAdvRestrict[i].ZzAmount;
						advTable[i][5] = globalData.TrvAdvRestrict[i].ZzCurrency;
					}
//				if ( oData.ZZ_MODID != 'DEPU') commented by uml6kor 18/9/2019
//				{
//					for (var i = 0; i < advTable.length; i++){
//						if (advTable[i][1] != "*")
//							{
//								for(var j = 0; j < globalData.cityto.length; j++){
//									if ( advTable[i][1] == globalData.cityto[j].MOLGA )
//										{
//										advTable[i][1] = globalData.cityto[j].BLAND;
//										}
//								}
//							}
//			
//					}
//				}
//				
		
				
				for (var i = 0; i < adv_data.length; i++)
				{
					
					for (var j = 0; j < 4; j++) 
					{
						if(advTable[j] != null){
							if(advTable[j][i] == "*")
								{
							
								}	
							else if( adv_data[i] != advTable[j][i] ){
								delete advTable[j];
							}
						}
					}
					}
				var flag = -1;
				var advAmt;
				var curr;
				for (var i = 0; i < 6; i++)
				{
					
					for (var j = 0; j < advTable.length; j++){
						
						if(advTable[j] != null){
							if(advTable[j][i] != "*")
							{
								
								advAmt = advTable[j][4];
								curr = advTable[j][5];
								flag = 0;
								break;
							}
								else{
									advAmt = advTable[j][4];
									curr = advTable[j][5];
								}
						}					
					}
					if(flag == 0)
						break;
				
				}
				if(TravelPlanThis.getView().getModel().getData().advance[iIndex].total > advAmt)
				{
				TravelPlanThis.getView().getModel().getData().advance[iIndex].total_error = "Error"
					sap.ca.ui.message.showMessageBox({
					type : sap.ca.ui.message.Type.ERROR,
					message : "You have exceeded the advance amount eligibility. Please consider changing the advance entered and create additional advance request while on travel."
					});
				evt.getSource().setValueState("Error");
				}
//			end of changes by MYU1KOR
			}
			TravelPlanThis.getView().getModel().refresh();
		}
		backup = TravelPlanThis.copyFields(oData, backup);
	},
	////################################# UCD1KOR 09 Apr 2021 ###########################///////////////////////
	//################################### On SUbmit Manager Details#########/////////////////////////////////
	onSubmitMgrNTID: function(evt){
		var that= this;
		var ntidmgr1 = sap.ui.getCore().byId("ManagerL1").getValue().toUpperCase();
		var ntidmgr2 = sap.ui.getCore().byId("ManagerL2").getValue().toUpperCase();
		var empNtid = sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_NTID;
		if(ntidmgr1 == empNtid || ntidmgr2 == empNtid){
			sap.m.MessageBox.error("Manager and Employee can not be identical");
			return;
		}
		if( ntidmgr1.trim() == null || ntidmgr1.trim() == undefined || ntidmgr1.trim() == "" ){
			sap.m.MessageBox.error("1st level Manager's NTID is mandatory");
			return;
		}
		var lv_epernr = sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_PERNR;
		var data = TravelPlanThis.getView().getModel().getData();
		var error_txt = "";
		var get = $.ajax({
			cache: false,
			url:  sServiceUrl + "CheckValidManager?NTID_L1='"
				+ntidmgr1.trim()+"'&NTID_L2='"+ntidmgr2.trim()+"'&EmpNo='"+lv_epernr+"'&Begda='"
				+data.ZZ_DATV1 +"'&Endda='"+data.ZZ_DATB1+"'&$format=json",
			async: false,
			type: "GET"
		});
		get.done(function(result) {
			if (result != null) {
				that.mgr_name = ntidmgr1;
				if(result.d.results[0].EMSG_L1 != "" && result.d.results[0].EMSG_L1 != null && result.d.results[0].EMSG_L1 != undefined ){
					error_txt = result.d.results[0].EMSG_L1 ;
				}else if(ntidmgr2 !== "" && result.d.results[0].EMSG_L2 != "" && result.d.results[0].EMSG_L2 != null && result.d.results[0].EMSG_L2 != undefined ){
					error_txt = result.d.results[0].EMSG_L2 ;	
				}
				else if(error_txt != null && error_txt != "" && error_txt != undefined ){
					sap.m.MessageBox.error(error_txt);
					return;
				}
				else{
					that.oCommonMngrDialog.close();
					that.CheckBudgetAvailable(evt);
				}
			}
		});
	},
////################################# UCD1KOR 09 Apr 2021 ###########################///////////////////////
////################################### Budget check before Tp Submission #########////////////////////////
	
	CheckBudgetAvailable:function(evt){
		var that = this;
		if (evt.getSource().getIcon() == "sap-icon://save") {
			sAction = "AA000";
		} else {
			sAction = "AA003";
		}
		//start_uml6kor_13/5/2019  budget check only for submit status
		if(sAction == "AA003" && TravelPlanThis.getView().getModel().getData().TRV_HDRtoTRV_COST_ASGN.results[0] == undefined){
			sap.m.MessageBox.error("Enter required field(s)");
			return;
		}
		if(sAction == "AA003" && TravelPlanThis.getView().getModel().getData().TRV_HDRtoTRV_COST_ASGN.results[0].ZZ_GEBER != "F08"){ 
				var reqNo = TravelPlanThis.getView().getModel().getData().ZZ_REINR;
				var status = sAction;
				sap.ui.project.e2etm.util.StaticUtility.setBusy(true, TravelPlanThis);
				var get = $.ajax({
							cache: false,
							url: sServiceUrl + "BudgetCheck?ZZ_DEP_SUB_TYP='" + TravelPlanThis.getView().getModel().getData().ZZ_DEP_SUB_TYP +
							"'&ZZ_PERNR='" + sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_PERNR +
							"'&ZZ_MGR_PERNR='" + sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_PERNR +
							"'&ZZ_REINR='" + reqNo + "'&ZZ_STAT_FLAG='" + sAction +
							"'&ZZ_TTYPE='" + TravelPlanThis.getView().getModel().getData().ZZ_TRV_TYP +
							"'&$format=json",
							 type: "GET",
							async:false
							});
						get.done(function(output) {
							try {
								try {
									var sHasBudget = output.d.results[0].ZZ_BUDGET_AVL;
								} catch (ex) {
									var sHasBudget = 'X';
								}
								sap.ui.project.e2etm.util.StaticUtility.setBusy(false, TravelPlanThis);
								if (!sap.ui.project.e2etm.util.StaticUtility.noBudgetCheck(
										sAction,
										sHasBudget,
										sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_DEPT,					
										TravelPlanThis.getView().getModel().getData().ZZ_FSTL, 
										TravelPlanThis.getView().getModel().getData().TRV_HDRtoTRV_COST_ASGN.results[0].ZZ_GEBER,
										TravelPlanThis.getView().getModel().getData().ZZ_SMODID)) {
									sap.ca.ui.message.showMessageBox({
										type: sap.ca.ui.message.Type.ERROR,
										message: "Budget not available. Please contact your manager.",
										details: "Budget not available. Please contact your manager."
									});
									sap.ui.project.e2etm.util.StaticUtility.setBusy(false, TravelPlanThis);
									return;
								}
								else{
									that.onSubmitTravelPlanRequest(evt);
								}
								
							} catch (exc) {
								sap.ca.ui.message.showMessageBox({
									type: sap.ca.ui.message.Type.ERROR,
									message: "Budget not available. Please contact your manager.",
									details: "Budget not available. Please contact your manager."
								});
								sap.ui.project.e2etm.util.StaticUtility.setBusy(false, TravelPlanThis);
								return;
							}
						});
			//end_uml6kor_13/5/2019*/
				}
				else{
					this.onSubmitTravelPlanRequest(evt);
				}
	},
////################################# UCD1KOR 09 Apr 2021 ###########################///////////////////////
////################################### On SUbmit Travel Plan##############/////////////////////////////////
	
	onSubmitTravelPlan:function(evt){
		
		var sAction;
		var that = this;
		if (evt.getSource().getIcon() == "sap-icon://save") {
			sAction = "AA000";
		} else {
			sAction = "AA003";
		}
///////////////##############################09 Apr 2021 UCD1KOR ##############################//////////////////
//////################################## Check manager available for user or not ###############/////////////////
		var globalData = sap.ui.getCore().getModel('global').getData();
		if (sAction == "AA003") { //// submit
			var mgr_name = sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_GRM;
			var emp_name = sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_NAME;
			if(emp_name == mgr_name){
				mgr_name = null;
			} 
			//mgr_name = null; 
			if((this.mgr_name == null || this.mgr_name == undefined) && (mgr_name == null || mgr_name == undefined || mgr_name == "" )){
				if (this.oCommonMngrDialog) {
					this.oCommonMngrDialog.destroy();
				}
				try{ sap.ui.getCore().byId("ManagerL1").destroy();}catch(err){}
				try{ sap.ui.getCore().byId("ManagerL2").destroy();}catch(err){}
				try{ sap.ui.getCore().byId("submitMgrDialog").destroy();}catch(err){}
				
				// instantiate the Fragment if not done yet
				this.oCommonMngrDialog = sap.ui.xmlfragment("sap.ui.project.e2etm.fragment.common.CheckValidMgr", this);
				this.oCommonMngrDialog.open(evt);
			}
			else{
				this.CheckBudgetAvailable(evt);
			}
		}
		else{
			this.onSubmitTravelPlanRequest(evt); //// save
		}
		
	},
	
	onSubmitTravelPlanRequest : function(evt) {
		// Save or submit
		var sAction;
		var that = this;
		if (evt.getSource().getIcon() == "sap-icon://save") {
			sAction = "AA000";
		} else {
			sAction = "AA003";
		}
		
		// Check upload file for document
		try {
			
			//########## UCD1KOR 18 May 2020 Passport Validations #############///
			if(sAction == "AA003" && TravelPlanThis.getView().getModel().getData().ZZ_SMODID == "INTL" &&(TravelPlanThis.getView().getModel().getData().ZZ_TRV_TYP == "INFO" ||TravelPlanThis.getView().getModel().getData().ZZ_TRV_TYP == "BUSR")){
				sap.ui.project.e2etm.util.StaticUtility.setBusy(true, TravelPlanThis);
				var oDepuData = oDeputationThis.getView().getModel().getData();
				var empNo =TravelPlanThis.getView().getModel().getData().ZZ_PERNR;
				var passportURL = "DmsDocsSet?$filter=DepReq+eq+'999999999'+and+EmpNo+eq+'" + empNo + "'+and+DocType+eq+'PS'";
				var oDataModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
		    	oDataModel.read(passportURL, null, null, false, function(oData, response) {
		    		that.Passport = oData.results;
					sap.ui.project.e2etm.util.StaticUtility.setBusy(false, TravelPlanThis);
				}, function(error) {
					sap.ui.project.e2etm.util.StaticUtility.setBusy(false, TravelPlanThis);
				});
		    	if(that.Passport == undefined || that.Passport.length == 0){
	    			sap.ca.ui.message.showMessageBox({
						type : sap.ca.ui.message.Type.ERROR,
						message : "Scanned copy of your passport is missing. Please save the request and update employee profile with passport copy. The scanned copy will help the ticketing team to block your tickets against your name as in passport.",
						details : sError
					});
	    			return;
	    		}
				oDeputationThis.getView().getModel().setData(oDepuData);
			}
			if (TravelPlanThis.getView().getModel().getData().ZZ_SMODID == "INTL" && (TravelPlanThis.getView().getModel().getData().ZZ_TRV_TYP == "DEPU" || ((TravelPlanThis.getView().getModel().getData().ZZ_TRV_TYP == "BUSR" || TravelPlanThis.getView().getModel().getData().ZZ_TRV_TYP == "SECO" || TravelPlanThis.getView().getModel().getData().ZZ_TRV_TYP == "INFO") && TravelPlanThis.getView().getModel().getData().view.visaExist == "X"))) {
				var oDepuData = oDeputationThis.getView().getModel().getData();
				var sError = oDeputationThis.validateVisaUploadSelf(oDepuData);
				if (sError != "") {
					if (TravelPlanThis.getView().getModel().getData().ZZ_TRV_TYP == "DEPU" && sError.indexOf("Please upload visa") == -1) {
						//sError = "Please go back dashboard screen and upload visa data";
						  sError = "Once you accept CL , please upload extended visa in home page (option is Upload visa)";
					}
					sap.ca.ui.message.showMessageBox({
						type : sap.ca.ui.message.Type.ERROR,
						message : sError,
						details : sError
					});
					oDeputationThis.getView().getModel().setData(oDepuData);
					return;
				}
				// Check dependents visa upload for deputation request
				if (oDeputationThis.getView().getModel().getData().screenData.ZZ_TRV_TYP == "DEPU") {
					sError = oDeputationThis.validateVisaUploadDependent(oDepuData);
					if (sError != "") {
						sap.ca.ui.message.showMessageBox({
							type : sap.ca.ui.message.Type.ERROR,
							message : sError,
							details : sError
						});
						oDeputationThis.getView().getModel().setData(oDepuData);
						return;
					}
				} else { // Validate travel start date with visa valid to
					if (parseInt(TravelPlanThis.getView().getModel().getData().ZZ_DATV1) > parseInt(oDeputationThis.getView().getModel().getData().selfVisa.ZZ_VISA_EDATE)) {
						var sError = "Start date must be less than " + sap.ui.project.e2etm.util.Formatter.sapDate(oDeputationThis.getView().getModel().getData().selfVisa.ZZ_VISA_EDATE) + " (Visa Valid To)";
						sap.ca.ui.message.showMessageBox({
							type : sap.ca.ui.message.Type.ERROR,
							message : sError,
							details : sError
						});
						return;
					}
				}
				oDeputationThis.getView().getModel().setData(oDepuData);
			}
		} catch (ex) {
		}
		// Check travel plan
		if (TravelPlanThis.onTabSelect(null) == "") { // Check cost assignment
			if (TravelPlanThis.getView().getModel().getData().TRV_HDRtoTRV_COST_ASGN.results.length == 0) {
				TravelPlanThis.onCostAssignmentAddPress();
			}
			var sError = TravelPlanThis.checkCostAssignment(TravelPlanThis.getView().getModel().getData());
			if (sError != "") {
				TravelPlanThis.getView().getModel().getData().view.selectedTab = 1;
				tabIndex = 1;
				TravelPlanThis.getCostAssignment(TravelPlanThis.getView().getModel().getData());
				TravelPlanThis.getView().getModel().refresh();
				sap.ca.ui.message.showMessageBox({
					type : sap.ca.ui.message.Type.ERROR,
					message : sError
				});
				return;
			}
			TravelPlanThis.createDefaultValue(TravelPlanThis.getView().getModel().getData());
			sError = TravelPlanThis.checkTravelDetail(TravelPlanThis.getView().getModel().getData());
			if (sError != "") {
				TravelPlanThis.getView().getModel().getData().view.selectedTab = 2;
				tabIndex = 2;
				TravelPlanThis.getTravelDetail(TravelPlanThis.getView().getModel().getData());
				TravelPlanThis.getView().getModel().refresh();
				sap.ca.ui.message.showMessageBox({
					type : sap.ca.ui.message.Type.ERROR,
					message : sError
				});
				return;
			}
			if (!TravelPlanThis.getView().getModel().getData().view.confirm && sAction == "AA003" && TravelPlanThis.getView().getModel().getData().view.international) { // Check
																																											// confirm
																																											// for
																																											// international
				TravelPlanThis.getView().getModel().getData().view.selectedTab = 5;
				tabIndex = 5;
				TravelPlanThis.getView().getModel().refresh();
				sap.ui.project.e2etm.util.StaticUtility.setBusy(false, TravelPlanThis);
				sap.ca.ui.message.showMessageBox({
					type : sap.ca.ui.message.Type.ERROR,
					message : "Please check on 'I have read and understood the above statement'"
				});
				return;
				
			}
/*Start- Secondary Travel Advance*/
			if(TravelPlanThis.getView().getModel().getData().ZZ_MODID=="SECO"&&sap.ui.getCore().getModel("profile").getData().currentRole=="EMP"&&
			(TravelPlanThis.getView().getModel().getData().ZZ_FMCNTRY!="IN"&&TravelPlanThis.getView().getModel().getData().ZZ_LAND1!="IN")){
			
				var advErrorMsg = TravelPlanThis.checkAdvanceAmount(TravelPlanThis.getView().getModel().getData());
				if(advErrorMsg!=""){
				sap.ca.ui.message.showMessageBox({
					type : sap.ca.ui.message.Type.ERROR,
					message : advErrorMsg
				});
				return;
				}
			}
/*End- Secondary Travel Advance*/	
			//start check for travel dates _uml6kor_17_5_2019
			var oDepuData = oDeputationThis.getView().getModel().getData();
			if (oDepuData.screenData.ZZ_TRV_PUR !="COVI" && TravelPlanThis.getView().getModel().getData().ZZ_DATV1 != null && TravelPlanThis.getView().getModel().getData().ZZ_DATB1 != null && TravelPlanThis.getView().getModel().getData().ZZ_SMODID == "INTL" && oDeputationThis.getView().getModel().getData().screenData.ZZ_TRV_CAT == "WRKP" && oDeputationThis.getView().getModel().getData().screenData.ZZ_BEGDA >= "20180101") //uml6kor 9/10/2019
			 {  
				strtdate = TravelPlanThis.getView().getModel().getData().ZZ_DATV1;
				enddate = TravelPlanThis.getView().getModel().getData().ZZ_DATB1;
						var dStart = new Date(strtdate.substr(0, 4), strtdate.substr(4, 2) - 1, strtdate.substr(6, 2));
						var dEnd = new Date(enddate.substr(0, 4), enddate.substr(4, 2) - 1, enddate.substr(6, 2));
						var dDur = new Date(dEnd - dStart);
						var	durStEn = Math.round(dDur.getTime() / (1000 * 3600 * 24) + 1); //durStEn: duration between start date and end date 
						
						if( durStEn > parseInt(sap.ui.getCore().getModel("global").getData().coolingPeriodMaxdays) ){//= 184 ){ //changed from >183 to >=184 uml6kor 29/8/2019//parseInt(sap.ui.getCore().getModel("global").getData().coolingPeriodMaxdays)+1

							sap.ca.ui.message.showMessageBox({
								type: sap.ca.ui.message.Type.ERROR,
								message: "Duration should not exceed more than 183 days for STA / STAPP assignment travels.",
								details: ""
							});

							sap.ui.project.e2etm.util.StaticUtility.setBusy(false, TravelPlanThis);

						}
			}
			//end check for travel dates _uml6kor_17_5_2019
			var globalData = sap.ui.getCore().getModel("global").getData();
			enddate = TravelPlanThis.getView().getModel().getData().ZZ_DATB1;
			var endDate = new Date(enddate.substr(0, 4),enddate.substr(4, 2) - 1, 
					enddate.substr(6, 2));
			var ext_date = new Date(globalData.ext_date.substr(0, 4), globalData.ext_date.substr(4, 2) - 1, 
					globalData.ext_date.substr(6, 2));
			if(oDepuData.screenData.ZZ_TRV_PUR =="COVI" && endDate > ext_date ){
				sap.m.MessageBox.error("Since you are exceeding ???policy duration???, Maximum end date allowed is "+''+globalData.ext_date.substr(6, 2)+"."+ (globalData.ext_date.substr(4, 2))+"."+
						globalData.ext_date.substr(0, 4));
				return false;
			}
			
		//start of uea6kor_5.11.2020 NonPE_Tax
			if( ((TravelPlanThis.getView().getModel().getData().ZZ_MODID == "BUSR" || TravelPlanThis.getView().getModel().getData().ZZ_MODID == "INFO") && ( TravelPlanThis.getView().getModel().getData().ZZ_SMODID == "INTL"))){
				var oDataModel = new sap.ui.model.odata.ODataModel(sServiceUrl);	
				sap.ui.project.e2etm.util.StaticUtility.setBusy(true, TravelPlanThis);
				 var taxURL = "CheckNonPETaxExpSet(ZZ_MODID='"+TravelPlanThis.getView().getModel().getData().ZZ_MODID+"',ZZ_SMODID='"+TravelPlanThis.getView().getModel().getData().ZZ_SMODID+"',ZZ_PERNR='" +
				 TravelPlanThis.getView().getModel().getData().ZZ_PERNR +
					"',ZZ_ENDDATE='"+TravelPlanThis.getView().getModel().getData().ZZ_DATB1+
					"',ZZ_STDATE='"+TravelPlanThis.getView().getModel().getData().ZZ_DATV1+
					"',ZZ_CNTRY='"+TravelPlanThis.getView().getModel().getData().ZZ_LAND1+"')";
				 
				 var totalDur;

				oDataModel.read(taxURL, null, null, false, jQuery.proxy(function(oData, response) {
					totalDur = oData.ZZ_DURATION;
					
					sap.ui.project.e2etm.util.StaticUtility.setBusy(false, TravelPlanThis);
				},this), function(error) {
					sap.ui.project.e2etm.util.StaticUtility.setBusy(false, TravelPlanThis);
//					sap.m.MessageBox.error("We are not able to Porcess your request.Try After some time");
//					return;
					
				});
				
				sap.ui.project.e2etm.util.StaticUtility.setBusy(false, TravelPlanThis);
				if(totalDur != "1-"){
					var total = 180;
					var remDur = total - totalDur;
					if (TravelPlanThis.getView().getModel().getData().ZZ_ZDURN > remDur){
						
						var text ="You have cumulative travel duration of  "+ Math.abs(totalDur) +
						" days for this year. As per policy, maximum cumulative duration an employee can travel on " +
						" Business Travels (including personal time)/Info Travel/Secondary travel for a " +
						" calendar year should not be more than "+ total + "days."
						" Please check and adjust the duration accordingly.";
				sap.ca.ui.message.showMessageBox({
					type: sap.ca.ui.message.Type.ERROR,
					message: text,
				});
				//sap.ui.getCore().getModel("global").setData(aData);
				sap.ui.project.e2etm.util.StaticUtility.setBusy(false, TravelPlanThis);
				return;
				
			      } 
			   }	
			
				if(totalDur == undefined){
					sap.m.MessageBox.error("We are not able to Porcess your request.Try After some time");
					return;
				}
				
				
			}					
			
		//end of uea6kor_5.11.2020 NonPE_Tax
			
	
			
			//start of code uml6kor newpolicy_CR_DE 16.9.2019 commented by uml6kor 18/9/2019
			var np_date = sap.ui.getCore().getModel("global").getData().npde_date; //added by uml6kor_25.9.2019_new policy for Germany is valid from npde_date 
			
			if(oDepuData.screenData.ZZ_TRV_PUR !="COVI" && oDeputationThis.getView().getModel().getData().screenData.ZZ_TRV_CAT == "WRKP" && oDeputationThis.getView().getModel().getData().screenData.ZZ_DEP_TOCNTRY == "DE"  && oDeputationThis.getView().getModel().getData().screenData.ZZ_BEGDA >= np_date )
			{
				
				var strtdate =  TravelPlanThis.getView().getModel().getData().ZZ_DATV1;//aData.screenData.ZZ_DEP_STDATE;
				var enddate = TravelPlanThis.getView().getModel().getData().ZZ_DATB1;//aData.screenData.ZZ_DEP_ENDATE;
				var dStart = new Date(strtdate.substr(0, 4), strtdate.substr(4, 2) - 1, strtdate.substr(6, 2));
				var dEnd = new Date(enddate.substr(0, 4), enddate.substr(4, 2) - 1, enddate.substr(6, 2));
				var dDur = new Date(dEnd - dStart);
				var	durStEn = dDur.getTime() / (1000 * 3600 * 24) + 1;
	
				var edate1 = new Date(dStart.getFullYear(), 
						dStart.getMonth(), 180);
			if((durStEn) >= 180){
				var text = 'As per immigration rules, end date cannot be greater than or equal to your Start '+
				'date when deputation duration is greater than or equal to 180 days.Please change your return date '+
				'earlier to the end date selected';
				
				if((strtdate.substr(6,8) == enddate.substr(6,8))&& strtdate.substr(6,8) <= "03") //if both dates are eq 01
				{
					sap.ca.ui.message.showMessageBox({
						type: sap.ca.ui.message.Type.ERROR,
						message: text,
						details: text
					});
					sap.ui.project.e2etm.util.StaticUtility.setBusy(false, TravelPlanThis);
					return;
						
				}	
				else if((dEnd > new Date(edate1.getFullYear(), 
					edate1.getMonth()+1, 0)) && strtdate.substr(6,8) <= "03")
				{////if both start date is 01 and end date has to be end of month(28,29,30,31)
					if ((enddate.substr(6,8) >= strtdate.substr(6,8))){ //added by uml6kor 24/9/2019
						sap.ca.ui.message.showMessageBox({
							type: sap.ca.ui.message.Type.ERROR,
							message: text,
							details: text
						});
						sap.ui.project.e2etm.util.StaticUtility.setBusy(false, TravelPlanThis);
						return;
	
						
					}
					
				}
				else if ((enddate.substr(6,8) >= strtdate.substr(6,8)) && strtdate.substr(6,8) > "03")
				{// enddateDD>strtdateDD
					sap.ca.ui.message.showMessageBox({
						type: sap.ca.ui.message.Type.ERROR,
						message: text,
						details: text
					});
					sap.ui.project.e2etm.util.StaticUtility.setBusy(false, TravelPlanThis);
					return;
				}
			}
		}
	//end of code newpolicy_CR_DE 16.9.2019
		
			// start changes for dates validation_UEA6KOR 30.5.2019
			if (sAction == "AA003" && TravelPlanThis.getView().getModel().getData().ZZ_SMODID == "INTL" && oDeputationThis.getView().getModel().getData().screenData.ZZ_BEGDA >= "20180101"){
				
				
				var max = 0;
				var min = 0;
				var globalData = sap.ui.getCore().getModel("global").getData();
				var oDepuData = oDeputationThis.getView().getModel().getData();
				
				for (var i = 0; i < globalData.DepTravelType.length; i++) {
					
					if(TravelPlanThis.getView().getModel().getData().ZZ_LAND1 == "DE" ){
						
						if(TravelPlanThis.getView().getModel().getData().ZZ_LAND1 == globalData.DepTravelType[i].ZzCountry &&
						    TravelPlanThis.getView().getModel().getData().ZZ_MODID  == globalData.DepTravelType[i].ZzTrvKey &&
					    	TravelPlanThis.getView().getModel().getData().ZZ_SMODID ==	globalData.DepTravelType[i].ZzDepSubType &&
					    	oDepuData.screenData.ZZ_TRV_CAT ==	globalData.DepTravelType[i].ZzTrvCat) {
								
							max = globalData.DepTravelType[i].ZzMaxDur;
							min = globalData.DepTravelType[i].ZzMinDur;
							
							strtdate = TravelPlanThis.getView().getModel().getData().ZZ_DATV1;
							enddate = TravelPlanThis.getView().getModel().getData().ZZ_DATB1;
									var dStart = new Date(strtdate.substr(0, 4), strtdate.substr(4, 2) - 1, strtdate.substr(6, 2));
									var dEnd = new Date(enddate.substr(0, 4), enddate.substr(4, 2) - 1, enddate.substr(6, 2));
									var dDur = new Date(dEnd - dStart);
								    var	durStEn = Math.round(dDur.getTime() / (1000 * 3600 * 24) + 1);
								    
							if( durStEn <= max && durStEn >= min ){
								// allow to summit for all countries commented it later by uml6kor 17/9/2019
//								if(durStEn >= "152" && enddate.substr(6,2) < "05" ){
//									
//									var text =
//									  'Error: Please select the dates from previous month or after 04th of this month, as your duration is more than 152 days. This is as per RBEI travel policy for Germany travels' ;
//								sap.ca.ui.message.showMessageBox({
//									type: sap.ca.ui.message.Type.ERROR,
//									message: text,
//									details: text
//								});
//								sap.ui.project.e2etm.util.StaticUtility.setBusy(false, TravelPlanThis);
//								return;
//								}
							}
							else{
								//not allow to submit and display error for all countries case
								if(oDepuData.screenData.ZZ_TRV_PUR !="COVI"){
								
								var text =
								  'Error: Maximum allowed travel duration for the selected country is ' + max + ' . Please correct the dates accordingly' ;
							sap.ca.ui.message.showMessageBox({
								type: sap.ca.ui.message.Type.ERROR,
								message: text,
								details: text
							});
							sap.ui.project.e2etm.util.StaticUtility.setBusy(false, TravelPlanThis);
							return;
							}
							}
							
						}
					}else{
						if(  TravelPlanThis.getView().getModel().getData().ZZ_MODID == globalData.DepTravelType[i].ZzTrvKey &&
						     TravelPlanThis.getView().getModel().getData().ZZ_SMODID ==	globalData.DepTravelType[i].ZzDepSubType &&
						     oDepuData.screenData.ZZ_TRV_CAT ==	globalData.DepTravelType[i].ZzTrvCat ){
							
							max = globalData.DepTravelType[i].ZzMaxDur;
							min = globalData.DepTravelType[i].ZzMinDur;
							
							strtdate = TravelPlanThis.getView().getModel().getData().ZZ_DATV1;
							enddate = TravelPlanThis.getView().getModel().getData().ZZ_DATB1;
							
							var dStart = new Date(strtdate.substr(0, 4), strtdate.substr(4, 2) - 1, strtdate.substr(6, 2));
							var dEnd = new Date(enddate.substr(0, 4), enddate.substr(4, 2) - 1, enddate.substr(6, 2));
							var dDur = new Date(dEnd - dStart);
						    var	durStEn = Math.round(dDur.getTime() / (1000 * 3600 * 24) + 1);
							
							if(durStEn > max ){ //uea6kor 20/9/2019
								//not allow to submit and display error for all countries case
								if(oDepuData.screenData.ZZ_TRV_PUR !="COVI"){
									
								
								var text =
								  'Error: Maximum allowed travel duration for the selected country is ' + max +' . Please correct the dates accordingly' ;
							sap.ca.ui.message.showMessageBox({
								type: sap.ca.ui.message.Type.ERROR,
								message: text,
								details: text
							});
							sap.ui.project.e2etm.util.StaticUtility.setBusy(false, TravelPlanThis);
							return;
							}
							}
							
						}
					}
				}

								
		
				
				

			}
			// End changes for dates validation_UEA6KOR 30.5.2019
			
			// All validation is passed
			if (TravelPlanThis.getView().getModel().getData().ZZ_TRV_TYP == "SECO" || TravelPlanThis.getView().getModel().getData().ZZ_TRV_TYP == "HOME" || TravelPlanThis.getView().getModel().getData().ZZ_TRV_TYP == "EMER") { // Secondary,
																																																									// home,
				///// ############## 27 Feb 2020 UCD1KOR Commented below event and adding showConfirmWBS(sAction);###################/////																																																					// emergency
				//TravelPlanThis.saveRequest(sAction);
				
				TravelPlanThis.showConfirmWBS(sAction); /// 27 Feb 2020 UCD1KOR added new event
			} else { // Business or deputation travel
				var sPastFuture = sServiceUrl + "DEP_REQ_DATES?CONST='DEP_REQ_DATE'&SELPAR=''&$format=json";
				$.when($.ajax({
					cache : false,
					url : sPastFuture
				})).done(function(oPastFuture) {
					/*if (((!sap.ui.getCore().getModel("global").getData().isChange && TravelPlanThis.getView().getModel().getData().ZZ_MODID != "DEPU") || (TravelPlanThis.getView().getModel().getData().ZZ_MODID == "DEPU" && TravelPlanThis.getView().getModel().getData().ZZ_VERSION.trim() == "1")) && TravelPlanThis.getView().getModel().getData().ZZ_STATUS.substring(2, 5) != "008" && sap.ui.project.e2etm.util.StaticUtility.checkPastMax(oPastFuture.d.results[1].VALUE, TravelPlanThis.getView().getModel().getData().ZZ_DATV1)) {
						sap.ca.ui.message.showMessageBox({
							type : sap.ca.ui.message.Type.ERROR,
							message : "Request is only created within " + oPastFuture.d.results[1].VALUE + " days(s) in the past"
						});
						return;
					}
					if (sap.ui.project.e2etm.util.StaticUtility.checkFutureMax(oPastFuture.d.results[0].VALUE, TravelPlanThis.getView().getModel().getData().ZZ_DATV1)) {
						sap.ca.ui.message.showMessageBox({
							type : sap.ca.ui.message.Type.ERROR,
							message : "Request is only created within " + oPastFuture.d.results[0].VALUE + " days(s) in the future"
						});
						return;
					}*/
					if ((TravelPlanThis.getView().getModel().getData().ZZ_MODID == "BUSR" || TravelPlanThis.getView().getModel().getData().ZZ_MODID == "INFO") && // Confirmation
																																									// only
																																									// for
																																									// international
																																									// business
																																									// travel
					sAction == "AA003" && TravelPlanThis.getView().getModel().getData().ZZ_SMODID == "INTL") {
						var stDate = TravelPlanThis.getView().getModel().getData().ZZ_DATV1;
						var checkStartDateTmp = new Date(stDate.substr(0, 4), stDate.substr(4, 2) - 1, stDate.substr(6, 2));
						var checkCurDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
						//########### UCD1KOR 18 May 2020 Passport Validations############/////
						var passportExpiry =  sap.ui.getCore().getModel("profile").getData().passportDetail.ZZ_DATE_EXPIRY;
						try{
							var passExpiryDate = new Date(passportExpiry.substr(0,4),(passportExpiry.substr(4,2)-1),passportExpiry.substr(6,2));
							var crrDate = new Date();
							var diff =(passExpiryDate.getTime() - crrDate.getTime()) / 1000;
							   diff /= (60 * 60 * 24 * 7 * 4);
							  var val= Math.round(diff);
							if(val <= 6){
								// no
								that.passportWarning = true;
							}
							else{
								that.passportWarning = false;
							}
						}catch(err){}
						
						
						if (parseInt(TravelPlanThis.getView().getModel().getData().ZZ_ZDURN) > parseInt(TravelPlanThis.getView().getModel().getData().view.warning)) { // Confirmation
																																										// for
																																										// BUSR
																																										// INTL
																																										// with
																																										// warning
							var sWarning = "This request will be forwarded for additional approval as your travel duration is more than " + TravelPlanThis.getView().getModel().getData().view.warning + " days, do you want to continue ?";
						} else if(TravelPlanThis.getView().getModel().getData().ZZ_MODID == "BUSR" && 
								checkStartDateTmp <= checkCurDate){
							var sWarning = "Do you want to submit the request ? Please note: Create 'additional advance request' in case you need additional advance"; //uml6kor_upgrade 26/11/2019 change of symbols 
						}
						else if(that.passportWarning == true){
							var sWarning = "Your passport is going to expire soon. Make sure you have sufficient passport validity (> 6 months) for the travel";
						}
						else { // Confirmation for BUSR INT w/o warning
							var sWarning = "Do you want to submit the request ?";
						}
						sap.m.MessageBox.confirm(sWarning, function(oAction) {
							if (oAction == "OK") {
								TravelPlanThis.showConfirmWBS(sAction);
							}
						});
					} else if (TravelPlanThis.getView().getModel().getData().ZZ_MODID == "BUSR" || TravelPlanThis.getView().getModel().getData().ZZ_MODID == "INFO") {
						// if(
						// parseInt(TravelPlanThis.getView().getModel().getData().ZZ_ZDURN)
						// >
						// parseInt(TravelPlanThis.getView().getModel().getData().view.warning)){
						// //Confirmation for BUSR DOME with warning
						// var sWarning = "This request will be forwarded for
						// additional approval as your travel duration is more
						// than " +
						// TravelPlanThis.getView().getModel().getData().view.warning
						// +
						// " days, do you want to continue ?";
						// sap.m.MessageBox.confirm(
						// sWarning,
						// function (oAction){
						// if(oAction == "OK" ){
						// TravelPlanThis.showConfirmWBS("AA003");
						// }
						// });
						// }else{ //No confirmation for BUSR DOME
						TravelPlanThis.showConfirmWBS(sAction);
						// }
					} else { // No confirmation for DEPU, SECO, HOME, EMER
						TravelPlanThis.showConfirmWBS(sAction);
					}
				}).fail(function(err) {
					alert("Error occurs");
				});
			}
			
		}
	},
	onBudgetCodeChange : function(evt) {
		var iIndex = evt.getSource().getId().substring(evt.getSource().getId().indexOf("row") + 3, evt.getSource().getId().length);
		if (TravelPlanThis.getView().getModel().getData().TRV_HDRtoTRV_COST_ASGN.results[iIndex].ZZ_GEBER == undefined || TravelPlanThis.getView().getModel().getData().TRV_HDRtoTRV_COST_ASGN.results[iIndex].ZZ_GEBER.trim() == "") {
			sap.m.MessageToast.show("Please enter Fund value");
		} else {
			sap.ui.project.e2etm.util.StaticUtility.setBusy(true, TravelPlanThis);
			var get = $.ajax({
				cache : false,
				url : sServiceUrl + "Commit_item_f4?" + "GEBER='" + TravelPlanThis.getView().getModel().getData().TRV_HDRtoTRV_COST_ASGN.results[iIndex].ZZ_GEBER + "'&ZZ_SMODID='" + TravelPlanThis.getView().getModel().getData().ZZ_SMODID + "'&$format=json",
				type : "GET"
			});
			get.fail(function(err) {
				sap.ui.project.e2etm.util.StaticUtility.setBusy(false, TravelPlanThis);
			});
			get.done(function(result, response, header) {
				TravelPlanThis.getView().getModel().getData().budgetCost = result.d.results;
				if (TravelPlanThis.getView().getModel().getData().budgetCost.length == 0) {
					sap.m.MessageToast.show("Invalid Fund");
				} else {
					var oData = TravelPlanThis.getView().getModel().getData();
					if (!sap.ui.project.e2etm.util.StaticUtility.checkExistingArray(TravelPlanThis.getView().getModel().getData().budgetCost, "FIPEX", oData.TRV_HDRtoTRV_COST_ASGN.results[iIndex].ZZ_FIPEX)) {
						oData.TRV_HDRtoTRV_COST_ASGN.results[iIndex].ZZ_FIPEX_ERROR = 'Error';
						sap.m.MessageToast.show("Invalid Budget Code");
					} else {
						oData.TRV_HDRtoTRV_COST_ASGN.results[iIndex].ZZ_FIPEX_ERROR = 'None';
					}
				}
				TravelPlanThis.getView().getModel().setData(oData);
				sap.ui.project.e2etm.util.StaticUtility.setBusy(false, TravelPlanThis);
			});
		}
	},
	showConfirmWBS : function(sAction) {
		/// ##### 27 Feb 2020 UCD1KOR commented below code  ###########////
		/*var bWBS = false;
		var oData = TravelPlanThis.getView().getModel().getData();
		for ( var i = 0; i < oData.TRV_HDRtoTRV_COST_ASGN.results.length && oData.TRV_HDRtoTRV_ACCOM != undefined; i++) {
			if (oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_FIPOS.trim() == "") {
				bWBS = true;
				break;
			}
		}*/
		///##### 27 Feb 2020  UCD1KOR changed below if condition
		/// if (bWBS && sAction == "AA003")
		
		if (sAction == "AA003") {
			
			///############ 27 Feb UCD1KOR Commented Below messagebox ############//// start
			/*sap.m.MessageBox.show("Cost center is being used instead of WBS Element.\nYou are not travelling on Project cost. Please confirm !", {
				icon : sap.m.MessageBox.Icon.QUESTION,
				title : "Confirmation",
				actions : [ sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO ],
				onClose : function(oAction) {
					if (oAction == "YES") {
						TravelPlanThis.saveRequest(sAction);
					} else {
						TravelPlanThis.getView().getModel().getData().view.selectedTab = 1;
						tabIndex = 1;
						TravelPlanThis.getView().getModel().refresh();
					}
				}
			});*/ // end
			
			

			/// ################ 27 Feb 2020 UCD1KOR Advance validation ##########///
				var advanceData = TravelPlanThis.getView().getModel().getData().advance;
				var totalRow0 = advanceData[0].boarding + advanceData[0].lodging + advanceData[0].surface;
				var totalRow1 = advanceData[1].boarding + advanceData[1].lodging + advanceData[1].surface;
				var totalRow2 = advanceData[2].boarding + advanceData[2].lodging + advanceData[2].surface;

				var totalAdance = parseInt(totalRow0) + parseInt(totalRow1) + parseInt(totalRow2) ;
				
			////#################### 26 Feb 2020 UCD1KOR advance restrction condition ###################///// start
				if(totalAdance == 0 ){
					sap.m.MessageBox.show("The advance amount entered is '0' for this request. Do you still want to continue with submission of the request ?  ", {
						icon : sap.m.MessageBox.Icon.QUESTION,
						title : "Confirmation",
						actions : [ sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO ],
						onClose : function(oAction) {
							if (oAction == "YES") {
								TravelPlanThis.saveRequest(sAction);
							} else {
								TravelPlanThis.getView().getModel().getData().view.selectedTab = 4;
								tabIndex = 4;
								TravelPlanThis.getView().getModel().refresh();
							}
						}
					});
				}
				else{
					TravelPlanThis.saveRequest(sAction);
				}
			////#################### 26 Feb 2020 UCD1KOR advance restrction condition ###################///// End
		} else {
			TravelPlanThis.saveRequest(sAction);
		}
	},
	// On remove a line in cost assignment
	onCostAssignmentDeletePress : function(evt) {
		var iIndex = TravelPlanThis.getView().byId("tabCostAssignment").getSelectedIndex();
		if (iIndex != -1) {
			var oData = TravelPlanThis.getView().getModel().getData();
			if (oData.TRV_HDRtoTRV_COST_ASGN.results[iIndex].ZZ_GEBER == "F02") {
				TravelPlanThis.getView().byId("flexBoxFundF02").setVisible(false);
			}
			if (oData.TRV_HDRtoTRV_COST_ASGN.results[iIndex].ZZ_GEBER == "F03") {
				TravelPlanThis.getView().byId("flexBoxFundF03").setVisible(false);
			}
			/* Start-CI Reporting Changes */
			if (oData.TRV_HDRtoTRV_COST_ASGN.results[iIndex].ZZ_GEBER == "F01"||
					oData.TRV_HDRtoTRV_COST_ASGN.results[iIndex].ZZ_GEBER == "F02"||
					oData.TRV_HDRtoTRV_COST_ASGN.results[iIndex].ZZ_GEBER == "F04") {
				TravelPlanThis.getView().byId("flexBoxFundF01F02F04").setVisible(false);
			}
			
			/* End-CI Reporting Changes */
			oData.TRV_HDRtoTRV_COST_ASGN.results.splice(iIndex, 1);
			oData.view.costLength--;
			TravelPlanThis.getView().getModel().setData(oData);
		}
	},
	// On Add new line in travel detail
	onDetailAddPress : function(evt) {
		var oData = TravelPlanThis.getView().getModel().getData();
		var oDataItem = {
			ZZ_ACTIVE : 'X',
			ZZ_TRVCAT : oData.ZZ_TRV_TYP
		};
		if (TravelPlanThis.getView().getModel().getData().ZZ_SMODID == "INTL") {
			oDataItem.ZZ_ZMODE = "A";
		}
		oData.TRV_HDRtoTRV_travel_Data.results.push(oDataItem);
		oData.view.detailLength++;
		TravelPlanThis.getView().getModel().setData(oData);
	},
	// On remove a line in travel detail
	onDetailDeletePress : function(evt) {
		var iIndex = TravelPlanThis.getView().byId("TableDetailId").getSelectedIndex();
		var oData = TravelPlanThis.getView().getModel().getData();
		if (iIndex != -1) {
			if (oData.TRV_HDRtoTRV_travel_Data.results[iIndex].ZZ_ACTIVE == "X") {
				oData.TRV_HDRtoTRV_travel_Data.results.splice(iIndex, 1);
				oData.view.detailLength--;
				TravelPlanThis.getView().getModel().setData(oData);
			} else {
				sap.ca.ui.message.showMessageBox({
					type : sap.ca.ui.message.Type.ERROR,
					message : "Cannot delete this row"
				});
			}
		}
	},
	// On Add new line in Accommodation
	onAccomodationAddPress : function(evt) {
		var oData = TravelPlanThis.getView().getModel().getData();
		var oDataItem = {
			"enabled" : true
		};
		oData.TRV_HDRtoTRV_ACCOM.results.push(oDataItem);
		oData.view.accommodationLength++;
		TravelPlanThis.getView().getModel().setData(oData);
	},
	// On remove a line in Accommodation
	onAccommodationDeletePress : function(evt) {
		var iIndex = TravelPlanThis.getView().byId("AccommodationTableId").getSelectedIndex();
		var oData = TravelPlanThis.getView().getModel().getData();
		if (iIndex != -1) {
			if (oData.TRV_HDRtoTRV_ACCOM.results[iIndex].enabled) {
				oData.TRV_HDRtoTRV_ACCOM.results.splice(iIndex, 1);
				oData.view.accommodationLength--;
				TravelPlanThis.getView().getModel().setData(oData);
			} else {
				sap.ca.ui.message.showMessageBox({
					type : sap.ca.ui.message.Type.ERROR,
					message : "Cannot delete this row"
				});
			}
		}
	},
	onAdvancePress : function(evt) { // sidd code start
		var oData = TravelPlanThis.getView().getModel().getData();
		var get = $.ajax({
			cache : false,
			url : sServiceUrl + "AdvanceAmount?" + "ENDDA='" + oData.ZZ_DATB1 + "'&STDATE='" + oData.ZZ_DATV1 + "'&ZE2E_LEVEL='" + oData.ZZ_LEVEL + "'&ZZ_CITY='" + oData.ZZ_LOCATION_END + "'&ZZ_FRMLAND='" + oData.ZZ_FMCNTRY + "'&ZZ_MODID='" + oData.ZZ_MODID + "'&ZZ_SMODID='" + oData.ZZ_SMODID + "'&ZZ_TOLAND='" + oData.ZZ_LAND1 + "'&$format=json",
			type : "GET"
		});
		get.fail(function(err) {
			sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
		});
		get.done(function(result, response, header) {
			if (TravelPlanThis.advanceDialog) {
				TravelPlanThis.advanceDialog.destroy();
			}
			// instantiate the Fragment if not done yet
			TravelPlanThis.advanceDialog = sap.ui.xmlfragment("sap.ui.project.e2etm.fragment.travel.AdvanceDetails", TravelPlanThis);
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(result.d.results);
			/// 28 Feb 2020 UCD1KOR BugFix
			//sap.ui.getCore().byId("tableAdvance").setModel(oModel);
			sap.ui.getCore().setModel(oModel,"advanceModel");
			sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
			TravelPlanThis.advanceDialog.open();
		});
	}, // sidd code end
	// On travel date start / end change
	onTravelDateChange : function(evt) {
		////######## 19 Feb 2019 UCD1KOR ########/// Check given for date modified
		this.TravelDateModified ="Modified";
		var aData = TravelPlanThis.getView().getModel().getData();
		if (aData.ZZ_DATV1 != null && aData.ZZ_DATB1 != null) {
			var dStart = new Date(aData.ZZ_DATV1.substr(0, 4), aData.ZZ_DATV1.substr(4, 2) - 1, aData.ZZ_DATV1.substr(6, 2));
			var dEnd = new Date(aData.ZZ_DATB1.substr(0, 4), aData.ZZ_DATB1.substr(4, 2) - 1, aData.ZZ_DATB1.substr(6, 2));
			var dDur = new Date(dEnd - dStart);
			aData.ZZ_ZDURN = dDur.getTime() / (1000 * 3600 * 24) + 1;
			aData.ZZ_ZDURN = "" + Math.round(aData.ZZ_ZDURN);
			var sError = "";
			
			///#################### UCD1KOR 21 July 2021 DOME TRFR Changes ################/////
			
			if(sap.ui.getCore().getModel("global").getData().TrfrFlag === "X"){
				aData.ZZ_DATB1 = aData.ZZ_DATV1;
				TravelPlanThis.getView().getModel().setData(aData); 
			}
			else if(oDeputationThis.getView().getModel().getData().screenData.ZZ_TRV_CAT == "WRKP" && aData.ZZ_SMODID == "INTL"){
				var crdt = oDeputationThis.getView().getModel().getData().screenData.ZZ_BEGDA;
				var oCrDt = new Date(crdt.substr(0, 4), crdt.substr(4, 2) - 1, crdt.substr(6, 2));
				var oDecDt = new Date(2017, 11, 31);
				if(oCrDt.getTime() > oDecDt.getTime()){
					sError = sap.ui.project.e2etm.util.StaticUtility.checTravelCategoryDuration("WRKP", aData.ZZ_ZDURN, aData.ZZ_SMODID, aData.ZZ_LAND1);
				}else{
					if(parseInt(aData.ZZ_ZDURN) > 730){
						sError = "Duration should not exceed more than 730 days for STA assignment travels";						
					}
				}
			}else{
			   sError = sap.ui.project.e2etm.util.StaticUtility.checTravelCategoryDuration(aData.ZZ_TRV_TYP, aData.ZZ_ZDURN, aData.ZZ_SMODID, aData.ZZ_LAND1);
			}
			if (sError == "") {
				aData.view.ZZ_DATB1_ERROR = 'None';
				aData.view.ZZ_DATV1_ERROR = 'None';
				TravelPlanThis.getView().getModel().setData(aData);
			} else {
				aData.view.ZZ_DATV1_ERROR = 'Error';
				aData.view.ZZ_DATB1_ERROR = 'Error';
				TravelPlanThis.getView().getModel().setData(aData);
				sap.ca.ui.message.showMessageBox({
					type : sap.ca.ui.message.Type.WARNING, 
					message : sError
				});
				return "";
			}
		}
		// Logic to display warning travel date change with details tab
		var foundOne = false;
		for ( var i = 0; i < aData.TRV_HDRtoTRV_travel_Data.results.length && aData.TRV_HDRtoTRV_travel_Data != undefined; i++) {
			if (aData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_TRVCAT == aData.ZZ_TRV_TYP) {
				if (aData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA != "" || aData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA != null) {
					foundOne = true;
					break;
				}
			}
		}
		if (foundOne) {
			sap.ca.ui.message.showMessageBox({
				type : sap.ca.ui.message.Type.WARNING,
				message : "Please also check dates in Travel Details and Accommodation tab"
			});
		}
	
		if(aData.ZZ_ZDURN >= 31 && aData.ZZ_MODID=='BUSR' && aData.ZZ_SMODID=='INTL'){
			
		sap.ca.ui.message.showMessageBox({
			type : sap.ca.ui.message.Type.WARNING,
			message : "SIM Card Cannot be processed for the duration mora than 31 days" +
					  "	Please get in touch with mobility team for any queries "
		});
	
		TravelPlanThis.getView().byId("Lbl_SimReq").setVisible(false);
		TravelPlanThis.getView().byId("Lbl_SimTyp").setVisible(false);
		TravelPlanThis.getView().byId("Lbl_SimData").setVisible(false);
		TravelPlanThis.getView().byId("SimReq").setVisible(false);
		TravelPlanThis.getView().byId("SimTyp").setVisible(false);
		TravelPlanThis.getView().byId("SimData").setVisible(false);	
		
	}
//		begin of change by MYU1KOR
		if(aData.ZZ_MODID == 'BUSR' || aData.ZZ_MODID == 'SECO' || aData.ZZ_MODID == 'INFO' || (aData.ZZ_MODID == 'DEPU' && sap.ui.getCore().getModel("global").getData().ZZ_TRV_CAT != 'TRFR'))
		{
			var min_date;
			var max_date;
			var flag1 = 0;
			var flag2 = 0;
			for ( var i = 0; i < aData.TRV_HDRtoTRV_travel_Data.results.length && aData.TRV_HDRtoTRV_travel_Data != undefined; i++) {
				if(aData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ZSLFDPD == '00')
				{
						
						if(min_date == null || max_date == null)
						{
							min_date = aData.TRV_HDRtoTRV_travel_Data.results[0].ZZ_BEGDA;
							max_date = aData.TRV_HDRtoTRV_travel_Data.results[0].ZZ_BEGDA;
						
						}
						if(parseInt(min_date) >= parseInt(aData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA))
						{
							min_date = aData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA;
							flag1 = i;
						}
						if(parseInt(max_date) <= parseInt(aData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA))
						{
							max_date = aData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA;
							flag2 = i;
						}
				}	
		
			}
			//############# UCD1KOR Nov 30,2020 try catch block added ###############///////////
			try{
				aData.TRV_HDRtoTRV_travel_Data.results[flag1].ZZ_BEGDA = aData.ZZ_DATV1;
				aData.TRV_HDRtoTRV_travel_Data.results[flag2].ZZ_BEGDA = aData.ZZ_DATB1;
				
			}catch(err){}
			

			TravelPlanThis.getView().getModel().setData(aData); 
			
	
		}
		
		///#################### UCD1KOR 21 July 2021 DOME TRFR Changes ################/////
		
		if(sap.ui.getCore().getModel("global").getData().TrfrFlag === "X"){
			aData.ZZ_DATB1 = aData.ZZ_DATV1;
		}
		
		
	//end of change by MYU1KOR

	},	

	onTabSelect : function(evt) {
		var oData = TravelPlanThis.getView().getModel().getData();
		var sError = "";
		if (TravelPlanThis.getView().getModel().getData().view.enabled || TravelPlanThis.getView().getModel().getData().view.isFuture || TravelPlanThis.getView().getModel().getData().view.enableAddDetail) {
			sError = TravelPlanThis.checkDate(oData);
			if (sError == "") {
				if (oData.ZZ_TRV_TYP=="BUSR" && oData.ZZ_SMODID=="INTL" && oData.PersFlag == "X"){		//added by uea6kor_23.9.2020 personal trip changes
				    sError = TravelPlanThis.checkPersonalDate(oData);					
				}	
				if (sError == "") {									//added by uea6kor_23.9.2020 personal trip changes
					switch (tabIndex) {
					case 0:
						sError = TravelPlanThis.checkGeneral(oData);
						break;
					case 1:
						sError = TravelPlanThis.checkCostAssignment(oData);
						break;
					case 2:
						sError = TravelPlanThis.checkTravelDetail(oData);
						break;
					case 3:
						sError = TravelPlanThis.checkAccomodation(oData);
						break;
					case 4:
						sError = TravelPlanThis.checkAdvance(oData);
						break;
					}					
				}

			}
		}
		 ////####################### UCD1KOR ######## ////////start 26 nov 2019
        if(evt !=null && evt.getSource().getSelectedIndex() ==2){
        	var rows = this.getView().byId("TableDetailId").mAggregations.rows;
        	for (var i = 0; i < rows.length; i++) {
        			if(rows[i].mAggregations.cells[6].mProperties.enabled== false){
        					document.getElementById(rows[i].mAggregations.cells[7].sId+"-Picker-inner").style.backgroundColor = "#F0F8FF";
        					document.getElementById(rows[i].mAggregations.cells[7].sId+"-Picker-inner").readOnly = true;
        				}
        			if(rows[i].mAggregations.cells[4].mProperties.enabled== false){
        					document.getElementById(rows[i].mAggregations.cells[5].sId+"-Picker-inner").style.backgroundColor = "#F0F8FF";
        					document.getElementById(rows[i].mAggregations.cells[5].sId+"-Picker-inner").readOnly = true;
        				}
        							
        			}
        }
		if (sError != "") {
			oData.view.selectedTab = tabIndex;
			sap.ca.ui.message.showMessageBox({
				type : sap.ca.ui.message.Type.ERROR,
				message : sError,
				details : sError
			});
			TravelPlanThis.getView().getModel().setData(oData);
		} else {
			if (tabIndex == 4) {
				sap.ca.ui.message.showMessageBox({
					type : sap.ca.ui.message.Type.INFO,
					message : "Please consider the 'Advances as Per Policy' by clicking the button"
				});
			}
			tabIndex = oData.view.selectedTab;
			if (tabIndex == 1) {
				TravelPlanThis.getCostAssignment(oData);
				if (TravelPlanThis.getView().getModel().getData().TRV_HDRtoTRV_COST_ASGN.results.length == 0) {
					TravelPlanThis.onCostAssignmentAddPress();
				}else{
					//dye5kor
					var costDataLength = TravelPlanThis.getView().getModel().getData().TRV_HDRtoTRV_COST_ASGN.results.length;
					for(var i=0;i<costDataLength;i++){
						
					var fundToValidate = TravelPlanThis.getView().getModel().getData().TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_GEBER;
					
					/*TravelPlanThis.getView().byId("wbsId-col3-row"+i).setEditable(false);
					TravelPlanThis.getView().byId("costCenterId-col4-row"+i).setEditable(false);*/
					//dye5kor_UpgradeFixes_05.11.2019
					var wbsCloneId = TravelPlanThis.getView().byId("tabCostAssignment").getRows()[i].mAggregations.cells[3].mAggregations.items[0].sId;
					var costCenterCloneId = TravelPlanThis.getView().byId("tabCostAssignment").getRows()[i].mAggregations.cells[4].mAggregations.items[0].sId;
					TravelPlanThis.getView().byId(wbsCloneId).setEditable(false);
					//TravelPlanThis.getView().byId(costCenterCloneId).setEditable(false);
					/*UCD1KOR 18 Dec 2019 above line Commented*/
					//dye5kor_UpgradeFixes_05.11.2019
					
					
					if(fundToValidate=='F01'){
				//		TravelPlanThis.getView().byId("wbsId-col3-row"+i).setEditable(false);
						/*TravelPlanThis.getView().byId("costCenterId-col4-row"+i).setEditable(true);*/
						//dye5kor_upgradeFix_05.11.2019
						TravelPlanThis.getView().byId(costCenterCloneId).setEditable(true);
						
						//dye5kor_upgradeFix_05.11.2019
						
					}else if(fundToValidate=="F02" || fundToValidate=="F03" || fundToValidate=="F04"){
						/*TravelPlanThis.getView().byId("wbsId-col3-row"+i).setEditable(true);*/
						TravelPlanThis.getView().byId(wbsCloneId).setEditable(true);
						
					}else{
						
						/*TravelPlanThis.getView().byId("costCenterId-col4-row"+i).setEditable(true);
						TravelPlanThis.getView().byId("wbsId-col3-row"+i).setEditable(true);*/
						//dye5kor_UpgradeFixes_05.11.2019
						TravelPlanThis.getView().byId(costCenterCloneId).setEditable(true);
						TravelPlanThis.getView().byId(wbsCloneId).setEditable(true);
						//dye5kor_UpgradeFixes_05.11.2019
					}
					
						
						
					}
					
					
					//dye5kor
					
				}
			} else if (tabIndex == 2) {
				TravelPlanThis.createDefaultValue(oData);
				TravelPlanThis.getTravelDetail(oData);
				
			} else if (tabIndex == 4) {
				TravelPlanThis.getAdvance(oData);
				/* ############## 19 Feb 2020 UCD1KOR ##################*/
				// once select advance tab then global variable
				this.advanceClicked = "Clicked";
/*Start-Secondary Travel changes*/
				 this.getView().byId("bankCardFlexBox").setVisible(false);
				if(oData.ZZ_MODID=="SECO"&&(oData.ZZ_FMCNTRY!="IN"&&oData.ZZ_LAND1!="IN")){
				    this.getView().byId("bankCardFlexBox").setVisible(true);
					TravelPlanThis.getCardBankDetails(oData);
				}
/*End-Secondary Travel changes*/				
			}
			TravelPlanThis.getView().getModel().setData(oData);
		}
		return sError;
	},
	// On Add new line in cost assignment
	onCostAssignmentAddPress : function(evt) {
		var oData = TravelPlanThis.getView().getModel().getData();
		var oDataItem = {
			ZZ_PERCENT : 100
		};
		if (oData.ZZ_TRV_TYP == "SECO") {
			oDataItem.ZZ_GEBER = "F03";
			///######### UCD1KOR Nov 30,2020 #########///
			////######### Fund editable = fasle for SECO Travels ###############///
			oData.view.fundEditable = false;
			TravelPlanThis.getView().byId("flexBoxFundF03").setVisible(true);
		}
		
		//Start of changes_DYE5KOR_05.10.2018
		//Default the fund based on assignment model
		if(oData.ZZ_MODID=='DEPU' && oData.ZZ_SMODID=='INTL' && (oData.ZZ_STATUS=='AA000' || oData.ZZ_STATUS.substring(2, 5) == '008')){
			
			if(sap.ui.getCore().getModel('global').getData().ZZ_ASG_TYP != 'TRNG'){
				
				if(oData.TRV_HDRtoTRV_COST_ASGN.results.length >= 1){
					oDataItem.ZZ_GEBER = oData.TRV_HDRtoTRV_COST_ASGN.results[oData.TRV_HDRtoTRV_COST_ASGN.results.length - 1].ZZ_GEBER;
					
				}
			}
			
		}
		oData.TRV_HDRtoTRV_COST_ASGN.results.push(oDataItem);
		oData.view.costLength++;
		TravelPlanThis.getView().getModel().setData(oData);
	},
	onCountryChange : function(evt) {
		var oData = TravelPlanThis.getView().getModel().getData();
		oData.ZZ_ZVISAT = TravelPlanThis.assignVisaCategory(oData.ZZ_TRV_TYP, oData.ZZ_FMCNTRY, oData.ZZ_LAND1);
		oData.view.visaAvailability = oData.ZZ_FMCNTRY != oData.ZZ_LAND1;
		oData.view.international = oData.ZZ_FMCNTRY != oData.ZZ_LAND1;
		oData.view.enableConfirm = true;
		// Clear Location
		if (evt.getParameters().id.indexOf("FromCountryId") != -1) {
			oData.ZZ_FMLOC = "";
		} else if (evt.getParameters().id.indexOf("ToCountryId") != -1) {
			oData.ZZ_LOCATION_END = "";
		}
		TravelPlanThis.getView().getModel().setData(oData);
	},
	onCostCenterChange : function(evt) {
		/*Start-Warning Message commented*/	
//		TravelPlanThis.showCostCenterMessage(evt.getParameter("newValue"));
		/*End-Warning Message commented*/
	},
	onCustomerChange : function(evt) {
		var oData = TravelPlanThis.getView().getModel().getData();
		/* Start-CTG F03 Changes */
		// oData.ZZ_CCNAME = oData.ZZ_CUST_NAME;
		oData.ZZ_CLENTY = oData.ZZ_CUST_NAME;
		/* End-CTG F03 Changes */
		TravelPlanThis.getView().getModel().setData(oData);
	},
	onBudgetCenterChange : function(evt) {
/*Start-Warning Message commented*/		
//		TravelPlanThis.showBudgetCenterMessage(evt.getParameter("newValue"));
/*End-Warning Message commented*/		
	},
	showCostCenterMessage : function(sValue) {
		if (sValue.trim() != "") {
			var index = sap.ui.project.e2etm.util.StaticUtility.getArrayIndex(TravelPlanThis.getView().getModel().getData().costCenter, "KOSTL", sValue);
			if (index == -1 || sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_DEPT.indexOf( // CC
																													// not
																													// belong
																													// to
																													// department
			TravelPlanThis.getView().getModel().getData().costCenter[index].VERAK) == -1) {
				sap.ca.ui.message.showMessageBox({
					type : sap.ca.ui.message.Type.WARNING,
					message : "Cost center does not belong to your department"
				});
			}
		}
	},
	showBudgetCenterMessage : function(sValue) {
		if (sValue.trim() != "") {
			var index = sap.ui.project.e2etm.util.StaticUtility.getArrayIndex(
			// tgg1hc
			// TravelPlanThis.getView().getModel().getData().budgetCenter,
			// "fictr", sValue);
			TravelPlanThis.getView().getModel().getData().budgetCenter, "ZzFundC", sValue);
			if (index == -1 || sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_DEPT.indexOf( // Budget
																													// center
																													// not
																													// belong
																													// to
																													// department
			TravelPlanThis.getView().getModel().getData().budgetCenter[index].ZzFundC) == -1) {
				sap.ca.ui.message.showMessageBox({
					type : sap.ca.ui.message.Type.WARNING,
					message : "Budget center does not belong to your department"
				});
			}
		}
	},
	// Convert advance from object to array
	convertAdvance : function(oData) {
		// Convert advance from object to array
		if (oData.TRV_HDRtoTRV_ADVANCE.results.length != 0 && oData.TRV_HDRtoTRV_ADVANCE != undefined) {
			var line_1 = {
				currency_key : oData.TRV_HDRtoTRV_ADVANCE.results[0].ZZ_CUR1,
				boarding : parseInt(oData.TRV_HDRtoTRV_ADVANCE.results[0].ZZ_BODVL1),
				lodging : parseInt(oData.TRV_HDRtoTRV_ADVANCE.results[0].ZZ_LODVL1),
				surface : parseInt(oData.TRV_HDRtoTRV_ADVANCE.results[0].ZZ_SRTVL1),
				others : parseInt(oData.TRV_HDRtoTRV_ADVANCE.results[0].ZZ_OTHVL1)
			};
			line_1.total = parseFloat(line_1.boarding) + parseFloat(line_1.lodging) + parseFloat(line_1.surface) + parseFloat(line_1.others);
			var line_2 = {
				currency_key : oData.TRV_HDRtoTRV_ADVANCE.results[0].ZZ_CUR2,
				boarding : parseInt(oData.TRV_HDRtoTRV_ADVANCE.results[0].ZZ_BODVL2),
				lodging : parseInt(oData.TRV_HDRtoTRV_ADVANCE.results[0].ZZ_LODVL2),
				surface : parseInt(oData.TRV_HDRtoTRV_ADVANCE.results[0].ZZ_SRTVL2),
				others : parseInt(oData.TRV_HDRtoTRV_ADVANCE.results[0].ZZ_OTHVL2)
			};
			line_2.total = parseFloat(line_2.boarding) + parseFloat(line_2.lodging) + parseFloat(line_2.surface) + parseFloat(line_2.others);
			var line_3 = {
				currency_key : oData.TRV_HDRtoTRV_ADVANCE.results[0].ZZ_CUR3,
				boarding : parseInt(oData.TRV_HDRtoTRV_ADVANCE.results[0].ZZ_BODVL3),
				lodging : parseInt(oData.TRV_HDRtoTRV_ADVANCE.results[0].ZZ_LODVL3),
				surface : parseInt(oData.TRV_HDRtoTRV_ADVANCE.results[0].ZZ_SRTVL3),
				others : parseInt(oData.TRV_HDRtoTRV_ADVANCE.results[0].ZZ_OTHVL3)
			};
			line_3.total = parseFloat(line_3.boarding) + parseFloat(line_3.lodging) + parseFloat(line_3.surface) + parseFloat(line_3.others);
			// var line_4 = {currency_key:
			// oData.TRV_HDRtoTRV_ADVANCE.results[0].ZZ_CUR3,
			// boarding:
			// parseInt(oData.TRV_HDRtoTRV_ADVANCE.results[0].ZZ_BODVL4),
			// lodging:
			// parseInt(oData.TRV_HDRtoTRV_ADVANCE.results[0].ZZ_LODVL4),
			// surface:
			// parseInt(oData.TRV_HDRtoTRV_ADVANCE.results[0].ZZ_SRTVL4),
			// others:
			// parseInt(oData.TRV_HDRtoTRV_ADVANCE.results[0].ZZ_OTHVL4)};
			// line_4.total = parseFloat(line_4.boarding) +
			// parseFloat(line_4.lodging) + parseFloat(line_4.surface) +
			// parseFloat(line_4.others);
			// var line_5 = {currency_key:
			// oData.TRV_HDRtoTRV_ADVANCE.results[0].ZZ_CUR5,
			// boarding:
			// parseInt(oData.TRV_HDRtoTRV_ADVANCE.results[0].ZZ_BODVL5),
			// lodging:
			// parseInt(oData.TRV_HDRtoTRV_ADVANCE.results[0].ZZ_LODVL5),
			// surface:
			// parseInt(oData.TRV_HDRtoTRV_ADVANCE.results[0].ZZ_SRTVL5),
			// others:
			// parseInt(oData.TRV_HDRtoTRV_ADVANCE.results[0].ZZ_OTHVL5)};
			// line_5.total = parseFloat(line_5.boarding) +
			// parseFloat(line_5.lodging) + parseFloat(line_5.surface) +
			// parseFloat(line_5.others);
			// var line_6 = {currency_key:
			// oData.TRV_HDRtoTRV_ADVANCE.results[0].ZZ_CUR6,
			// boarding:
			// parseInt(oData.TRV_HDRtoTRV_ADVANCE.results[0].ZZ_BODVL6),
			// lodging:
			// parseInt(oData.TRV_HDRtoTRV_ADVANCE.results[0].ZZ_LODVL6),
			// surface:
			// parseInt(oData.TRV_HDRtoTRV_ADVANCE.results[0].ZZ_SRTVL6),
			// others:
			// parseInt(oData.TRV_HDRtoTRV_ADVANCE.results[0].ZZ_OTHVL6)};
			// line_6.total = parseFloat(line_6.boarding) +
			// parseFloat(line_6.lodging) + parseFloat(line_6.surface) +
			// parseFloat(line_6.others);
			oData.advance = [ line_1, line_2, line_3 ];
		} else {
			var line_1 = {
				currency_key : "",
				boarding : 0,
				lodging : 0,
				surface : 0,
				others : 0,
				total : 0
			};
			var line_2 = {
				currency_key : "",
				boarding : 0,
				lodging : 0,
				surface : 0,
				others : 0,
				total : 0
			};
			var line_3 = {
				currency_key : "",
				boarding : 0,
				lodging : 0,
				surface : 0,
				others : 0,
				total : 0
			};
			// var line_4 = { currency_key: "", boarding: 0, lodging: 0,
			// surface: 0, others: 0, total : 0 };
			// var line_5 = { currency_key: "", boarding: 0, lodging: 0,
			// surface: 0, others: 0, total : 0 };
			// var line_6 = { currency_key: "", boarding: 0, lodging: 0,
			// surface: 0, others: 0, total : 0 };
			oData.advance = [ line_1, line_2, line_3 ];
		}
	},
	// Prepare data for open an existing request
	prepareDataforExistingRequest : function(oData) {
		var that = this;
		var iLength = 0;
		oData.view.ZZ_DATB1_VALUE = new Date(oData.ZZ_DATB1.substr(0, 4), oData.ZZ_DATB1.substr(4, 2) - 1, oData.ZZ_DATB1.substr(6, 2));
		oData.view.ZZ_DATV1_VALUE = new Date(oData.ZZ_DATV1.substr(0, 4), oData.ZZ_DATV1.substr(4, 2) - 1, oData.ZZ_DATV1.substr(6, 2));
		if (sap.ui.getCore().getModel("global").getData().ZZ_VREASON == 'TA' || (!sap.ui.getCore().getModel("global").getData().isCreate && (sap.ui.getCore().getModel("global").getData().ZZ_VREASON == 'DA' || sap.ui.getCore().getModel("global").getData().ZZ_VREASON == 'DB'))) {
			oData.old.ZZ_DATB1_VALUE = new Date(oData.old.ZZ_DATB1.substr(0, 4), oData.old.ZZ_DATB1.substr(4, 2) - 1, oData.old.ZZ_DATB1.substr(6, 2));
			oData.old.ZZ_DATV1_VALUE = new Date(oData.old.ZZ_DATV1.substr(0, 4), oData.old.ZZ_DATV1.substr(4, 2) - 1, oData.old.ZZ_DATV1.substr(6, 2));
			for ( var i = 0; i < oData.old.TRV_HDRtoTRV_travel_Data.results.length && oData.old.TRV_HDRtoTRV_travel_Data != undefined; i++) {
				if (oData.old.TRV_HDRtoTRV_travel_Data.results[i].ZZ_TRVCAT == oData.ZZ_TRV_TYP) {
					if (oData.old.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA != "00000000" && oData.old.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA != "" && oData.old.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA != null) {
						oData.old.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA_VALUE = new Date(oData.old.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA.substr(0, 4), oData.old.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA.substr(4, 2) - 1, oData.old.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA.substr(6, 2));
					} else {
						oData.old.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA = "";
					}
					if (oData.old.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ENDDA != "00000000" && oData.old.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ENDDA != "" && oData.old.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ENDDA != null) {
						oData.old.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ENDDA_VALUE = new Date(oData.old.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ENDDA.substr(0, 4), oData.old.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ENDDA.substr(4, 2) - 1, oData.old.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ENDDA.substr(6, 2));
					} else {
						oData.old.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ENDDA = "";
					}
					iLength++;
				}
			}
			oData.old.detailLength = iLength;
			oData.old.costLength = oData.old.TRV_HDRtoTRV_COST_ASGN.results.length;
		}
		// Set default value for date picker for travel detail
	/////############### UCD1KOR 13 July 2021 Changes BUSR Copy ##################///////
		 if(sap.ui.getCore().getModel("global").getData().isCopy){
			 try{
				 var mode1 = oData.TRV_HDRtoTRV_travel_Data.results[0].ZZ_ZMODE;
				 var mode2 = oData.TRV_HDRtoTRV_travel_Data.results[1].ZZ_ZMODE;
			 }catch(err){}
			 oData.TRV_HDRtoTRV_travel_Data.results = [];
				var oFirstItem = {
						ZZ_ZSLFDPD : "00",
						ZZ_ZFRPLACE : oData.ZZ_FMLOC,
						ZZ_ZTOPLACE : oData.ZZ_LOCATION_END,
						ZZ_BEGDA : oData.ZZ_DATV1,
						ZZ_BEGDA_VALUE : new Date(oData.ZZ_DATV1.substr(0, 4), oData.ZZ_DATV1.substr(4, 2) - 1, oData.ZZ_DATV1.substr(6, 2)),
						ZZ_TRVCAT : oData.ZZ_TRV_TYP,
						ZZ_ACTIVE : 'X',
						ZZ_ZMODE: mode1
					};
					var oEndItem = {
						ZZ_ZSLFDPD : "00",
						ZZ_ZFRPLACE : oData.ZZ_LOCATION_END,
						ZZ_ZTOPLACE : oData.ZZ_FMLOC,
						ZZ_BEGDA : oData.ZZ_DATB1,
						ZZ_BEGDA_VALUE : new Date(oData.ZZ_DATB1.substr(0, 4), oData.ZZ_DATB1.substr(4, 2) - 1, oData.ZZ_DATB1.substr(6, 2)),
						ZZ_TRVCAT : oData.ZZ_TRV_TYP,
						ZZ_ACTIVE : 'X',
						ZZ_ZMODE: mode2
					};
					oData.TRV_HDRtoTRV_travel_Data.results.push(oFirstItem);
					oData.TRV_HDRtoTRV_travel_Data.results.push(oEndItem);
					oData.view.detailLength = TravelPlanThis.getTravelDetailLength(oData);
			
		 }else{
			 for ( var i = 0; i < oData.TRV_HDRtoTRV_travel_Data.results.length && oData.TRV_HDRtoTRV_travel_Data != undefined; i++) {
					if (oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA != "00000000" && oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA != "" && oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA != null) {
						oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA_VALUE = new Date(oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA.substr(0, 4), oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA.substr(4, 2) - 1, oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA.substr(6, 2));
					} else {
						oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA = "";
					}
					if (oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ENDDA != "00000000" && oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ENDDA != "" && oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ENDDA != null) {
						oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ENDDA_VALUE = new Date(oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ENDDA.substr(0, 4), oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ENDDA.substr(4, 2) - 1, oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ENDDA.substr(6, 2));
					} else {
						oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ENDDA = "";
					}
					try {
						if (sap.ui.project.e2etm.util.StaticUtility.checkDateInPast(oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA) && !oData.view.isMigration && (isChange || oData.ZZ_VERSION.trim() != "1")) {
							oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ACTIVE = '';
						} else {
							oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ACTIVE = oData.view.enableAddDetail ? "X" : "";
						}
					} catch (ex) {
					}
				}
		 }
		
		// Set default value for date picker for accommodation
		for ( var i = 0; i < oData.TRV_HDRtoTRV_ACCOM.results.length && oData.TRV_HDRtoTRV_ACCOM != undefined; i++) {
			if (oData.TRV_HDRtoTRV_ACCOM.results[i].ZZ_BEGDA != "00000000" && oData.TRV_HDRtoTRV_ACCOM.results[i].ZZ_BEGDA != "" && oData.TRV_HDRtoTRV_ACCOM.results[i].ZZ_BEGDA != null) {
				oData.TRV_HDRtoTRV_ACCOM.results[i].ZZ_BEGDA_VALUE = new Date(oData.TRV_HDRtoTRV_ACCOM.results[i].ZZ_BEGDA.substr(0, 4), oData.TRV_HDRtoTRV_ACCOM.results[i].ZZ_BEGDA.substr(4, 2) - 1, oData.TRV_HDRtoTRV_ACCOM.results[i].ZZ_BEGDA.substr(6, 2));
			} else {
				oData.TRV_HDRtoTRV_ACCOM.results[i].ZZ_BEGDA = "";
			}
			if (oData.TRV_HDRtoTRV_ACCOM.results[i].ZZ_ENDDA != "00000000" && oData.TRV_HDRtoTRV_ACCOM.results[i].ZZ_ENDDA != "" && oData.TRV_HDRtoTRV_ACCOM.results[i].ZZ_ENDDA != null) {
				oData.TRV_HDRtoTRV_ACCOM.results[i].ZZ_ENDDA_VALUE = new Date(oData.TRV_HDRtoTRV_ACCOM.results[i].ZZ_ENDDA.substr(0, 4), oData.TRV_HDRtoTRV_ACCOM.results[i].ZZ_ENDDA.substr(4, 2) - 1, oData.TRV_HDRtoTRV_ACCOM.results[i].ZZ_ENDDA.substr(6, 2));
			} else {
				oData.TRV_HDRtoTRV_ACCOM.results[i].ZZ_ENDDA = "";
			}
			if (sap.ui.project.e2etm.util.StaticUtility.checkDateInPast(oData.TRV_HDRtoTRV_ACCOM.results[i].ZZ_BEGDA) && !oData.view.isMigration && (sap.ui.getCore().getModel("global").getData().isChange || oData.ZZ_VERSION.trim() != "1")) {
				oData.TRV_HDRtoTRV_ACCOM.results[i].enabled = false;
			} else {
				oData.TRV_HDRtoTRV_ACCOM.results[i].enabled = oData.view.enabled;
			}
			 ////########### UCD1KOR 14 July 2021 Changes BUSR Copy ######################///////
			if(sap.ui.getCore().getModel("global").getData().isCopy ){
			    oData.TRV_HDRtoTRV_ACCOM.results[i].enabled = true;
		    }
		}
	
	//Start of change_DYE5KOR_Set Default values for international deputations
		// case 1.Assignment Model STA/STAPP set F04
		// case 2.Assignment Model STA/STAPP set F03
		if(oData.ZZ_DATV1 >= 20190101){     //Added by UEA6KOR_06.03.2019
		if(sap.ui.getCore().getModel('global').getData().ZZ_TRV_CAT != 'TRNG'){
		if((oData.ZZ_STATUS=='AA000' || oData.ZZ_STATUS.substring(2, 5) == '008') && oData.ZZ_MODID=='DEPU' && oData.ZZ_SMODID=='INTL'){
			var chkDepuAsgModel = sap.ui.getCore().getModel('global').getData().ZZ_ASG_TYP;
			oData.view.fundEditable = true;
		for(var i=0;i < oData.TRV_HDRtoTRV_COST_ASGN.results.length;i++){
			if(chkDepuAsgModel=='STA' || chkDepuAsgModel=='STAPP' ){
				oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_GEBER = 'F04';
				TravelPlanThis.getView().byId("flexBoxFundF01F02F04").setVisible(true);	
				var orgUnit  = sap.ui.getCore().getModel('global').getData().ZZ_COMABBR;
	            var travelCategory = sap.ui.getCore().getModel('global').getData().ZZ_TRV_CAT;
	             var toCountry = oData.ZZ_LAND1;
				 if( oData.ZZ_CATID == "GLOB" && travelCategory == "WRKP" && toCountry =="JP"){
	                oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_GEBER ='F08'; 
	                TravelPlanThis.getView().byId("flexBoxFundF01F02F04").setVisible(false);	
	            }
			}else if(chkDepuAsgModel=='VA' || chkDepuAsgModel=='VN' || chkDepuAsgModel=='STVA' || chkDepuAsgModel=='NC'||
				 chkDepuAsgModel=='STX' || chkDepuAsgModel=='LTX' || chkDepuAsgModel=='NCX' ){ //added new policy asg models _uml6kor_9/5/2019
				
					var FundFlag = "";
				 	var TPNo = oDeputationThis.getView().getModel().getData().screenData.ZZ_TRV_REQ;
			         var FundFlag =  "CheckFundFlag?Reinr='" +TPNo+ "'&$format=json";
			     	oDataModel.read(FundFlag, null, null, false, function(oData, response) {
			     		var val = JSON.parse(response.body);
			     		 FundFlag = val.d.CheckFundFlag.FundFlag;
			 		}, function(error) {
			 			sap.m.MessageToast.show("Internal Server Error");
			 		},false);
				
				
				/// UCD1KOR 17 Jun 2020  Requirement specification for F08 fund for Transfer cases
				var orgUnit  = sap.ui.getCore().getModel('global').getData().ZZ_COMABBR;
	            var travelCategory = sap.ui.getCore().getModel('global').getData().ZZ_TRV_CAT;
	            var toCountry = oData.ZZ_LAND1;
	            //########################### UCD1KOR 5 Apr 2021 desable costcenter for F08 #######################//////////
	            if(orgUnit == "RBEI-PE" && oData.ZZ_CATID == "GLOB" && travelCategory == "TRFR" && toCountry =="JP"){
	            	oData.view.EnableCostCenterForF08 = false;
	            }
	            else{
	            	oData.view.EnableCostCenterForF08 = true;
	            }
	            
	            if(orgUnit == "RBEI-PE" && oData.ZZ_CATID == "GLOB" && travelCategory == "TRFR" && toCountry =="JP"){
	                oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_GEBER ='F08';
					 that.ConditionCheckForJapan = true;
	            }
	            if(orgUnit == "RBEI-PE" && oData.ZZ_CATID == "GLOB" && travelCategory == "WRKP" && toCountry =="JP"){
	                oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_GEBER ='F08';
	            }
	            ////#############################################################################//////////////
	            
				// UCD1KOR 04 May 2020 F03 removing defaulting 
	            else if(oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_GEBER  && (oData.ZZ_STATUS != "AA000" || FundFlag == "X")){ //added saved status for defaulting to F03 for trfr cases 24/6/2020_uml6kor
					oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_GEBER = oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_GEBER;
				}
				else{
					oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_GEBER ='F03'
				}
//			      MCR NonMCR start changes UEA6KOR_12.03.2019	

				//		TravelPlanThis.getView().byId("flexBoxFundF03").setVisible(true);
					
						if(oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_MCR == 'X'){			
							TravelPlanThis.getView().byId("flexCtgMcr").setVisible(true);
							TravelPlanThis.getView().byId("flexBoxFundF03").setVisible(false); //uncomment by UEA6KOR_11.03.2019
							
						}else{
							TravelPlanThis.getView().byId("flexCtgMcr").setVisible(false);
							TravelPlanThis.getView().byId("flexBoxFundF03").setVisible(true); //uncomment by UEA6KOR_11.03.2019
						
						} 		
						if(oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_GEBER == 'F08'){
							TravelPlanThis.getView().byId("flexBoxFundF03").setVisible(false);
							TravelPlanThis.getView().byId("flexBoxFundF01F02F04").setVisible(false);
						}
						else if(oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_GEBER == 'F04'){
							TravelPlanThis.getView().byId("flexBoxFundF03").setVisible(false);
						}
						
						if(oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_GEBER == 'F03'){
							TravelPlanThis.getView().byId("flexBoxFundF01F02F04").setVisible(false);
						}
					//MCR NonMCR end changes UEA6KOR_12.03.2019	
			}
			oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_KOSTL = '';
			oData.TRV_HDRtoTRV_COST_ASGN.results[i].KTEXT = '';
			oData.view.fundEditable = false;
		
		}
			}
		}
		 ///############## UD1KOR 2 Dec 2019 Start #############//////////
        /////#############FUND Editable Logic##############///////// Version added
        
        if((oData.ZZ_STATUS == 'AA000'|| oData.ZZ_STATUS =="BB000" || oData.ZZ_STATUS.substring(2, 5) == '008') && (oData.ZZ_VERSION.trim() == "1" || sap.ui.project.e2etm.util.StaticUtility.checkDateInPast(oData.ZZ_DATV1) == false)){
        	//########### UCD1KOR 06 March 2020 for domestic condition added
        	if(oData.ZZ_MODID=='DEPU' && oData.ZZ_SMODID=='DOME'){
       		 oData.view.fundEditable = true;
        	}
        	else if(oData.ZZ_MODID == 'DEPU' &&  sap.ui.getCore().getModel('global').getData().ZZ_TRV_CAT == 'TRFR' &&  that.ConditionCheckForJapan == true){
       		 oData.view.fundEditable = true;
        	}
        	else if(oData.ZZ_MODID == 'DEPU' && (sap.ui.getCore().getModel('global').getData().ZZ_TRV_CAT == 'WRKP' || sap.ui.getCore().getModel('global').getData().ZZ_TRV_CAT == 'TRFR')){
        		 oData.view.fundEditable = false;
        	}
        	else if( oData.ZZ_MODID == 'DEPU' && sap.ui.getCore().getModel('global').getData().ZZ_TRV_CAT == 'TRNG'){
        		oData.view.fundEditable = true;
        	}/*UCD1KOR 24 Jan 24th commented below line*/ //ZZ_SMOID
        	/*else {
        		oData.view.fundEditable = true;
        	}*/
        }
        else{
        	oData.view.fundEditable = false;
        }//oData.ZZ_VERSION.trim() == "1" &&
      ///############## UD1KOR 2 Dec 2019 End #############//////////
        ////########### UCD1KOR 14 July 2021 Changes BUSR Copy ######################///////
		if(sap.ui.getCore().getModel("global").getData().isCopy ){
			oData.view.fundEditable = true;
		}
		var travelCategory = sap.ui.getCore().getModel('global').getData().ZZ_TRV_CAT;
	    var toCountry = oData.ZZ_LAND1;
	    if(oData.ZZ_STATUS.substring(2, 5) == '000'){
	    	if(oData.ZZ_CATID == "GLOB" && travelCategory == "WRKP" && toCountry =="JP"){
	         	oData.view.fundEditable = true;
	         }
	    	if(oData.ZZ_CATID == "GLOB" && travelCategory == "TRFR" && oData.TRV_HDRtoTRV_COST_ASGN.results[0].ZZ_GEBER == "F08"){
	      	    oData.view.fundEditable = true;
	         }
	    }
		
		
		}
//		End of change_DYE5KOR_Set Default values for international deputations
	},
	// Format header change flag
	formatHeaderFlag : function(oData) {
		if (oData.ZZ_CHANGE_GE == 'X' || oData.ZZ_CHANGE_CO == 'X' || oData.ZZ_CHANGE_DE == 'X' || oData.ZZ_CHANGE_AC == 'X' || oData.ZZ_CHANGE_AD == 'X') {
			oData.view.ChangeReason = "- Change:";
		}
		if (oData.ZZ_CHANGE_GE == 'X') {
			oData.view.ChangeReason += " General";
		}
		if (oData.ZZ_CHANGE_CO == 'X') {
			if (oData.view.ChangeReason == "- Change:") {
				oData.view.ChangeReason += " Cost Assignment";
			} else {
				oData.view.ChangeReason += ", Cost Assignment";
			}
		}
		if (oData.ZZ_CHANGE_DE == 'X') {
			if (oData.view.ChangeReason == "- Change:") {
				oData.view.ChangeReason += " Details";
			} else {
				oData.view.ChangeReason += ", Details";
			}
		}
		if (oData.ZZ_CHANGE_AC == 'X') {
			if (oData.view.ChangeReason == "- Change:") {
				oData.view.ChangeReason += " Accomodation";
			} else {
				oData.view.ChangeReason += ", Accomodation";
			}
		}
		if (oData.ZZ_CHANGE_AD == 'X') {
			if (oData.view.ChangeReason == "- Change:") {
				oData.view.ChangeReason += " Advance";
			} else {
				oData.view.ChangeReason += ", Advance";
			}
		}
	},
	// Assign visa category
	assignVisaCategory : function(sTravelCategory, sFromCountry, sToCountry) {
		if (sFromCountry == sToCountry) {
			return "1";
		} else if (sTravelCategory == 'SECO') {
			return "5";
		}
		if (sTravelCategory == 'WRKP' || sTravelCategory == 'TRFR') {
			return "3";
		}
		if (sTravelCategory == 'TRNG') {
			return "4";
		}
		return "2";
	},
	// Assign travel category
	assignTravelCategory : function(sLevel) {
		switch (sLevel) {
		case '52':
			return 'C';
		case '53':
			return 'C';
		case '54':
			return 'D';
		case '55':
			return 'D';
		case '56':
			return 'D';
		default:
			if (sLevel <= '51') {
				return 'B';
			} else if (sLevel >= '57') {
				return 'E';
			}
		}
	},
	// Save Request
	saveRequest : function(sStatus) {
		var that = this;
		//############# 29 Jan 2021 UCD1KOR Conditions added for Retirement date ############//////////////////////
		var aData = TravelPlanThis.getView().getModel().getData();
		////########## 13 July 2021 UCD1KOR changes BUSR Copy #################////
		if(sap.ui.getCore().getModel("global").getData().isCopy){
			aData.ZZ_REINR = "0000000000";
			aData.ZZ_TRV_TYP = "BUSR";
		}
		if(sap.ui.getCore().getModel("global").getData().TrfrFlag  == "X"){
			aData.TrfrFlag  = "X";
		}
		else{
			aData.TrfrFlag  = "";
		}
		var rDate = sap.ui.getCore().getModel("profile").getData().employeeDetail.RetirementDate;
		if(rDate !==""){
			try{
				var RetirementDate = new Date(rDate.substr(0,4), rDate.substr(4,2)-1, rDate.substr(6,2));
			}catch(err){}
		}
		if(aData.PersFlag == "X"){
			var TripEnd = new Date(aData.ZZ_DATB1.substr(0,4), aData.ZZ_DATB1.substr(4,2)-1, aData.ZZ_DATB1.substr(6,2));
			var PersonalTrip = new Date(aData.EDate.substr(0,4), aData.EDate.substr(4,2)-1, aData.EDate.substr(6,2));
			if(PersonalTrip > TripEnd){
				TripEnd = PersonalTrip;
			}
			
		}else{
			TripEnd = new Date(aData.ZZ_DATB1.substr(0,4), aData.ZZ_DATB1.substr(4,2)-1, aData.ZZ_DATB1.substr(6,2));
		}
		var TripStart = new Date(aData.ZZ_DATV1.substr(0,4), aData.ZZ_DATV1.substr(4,2)-1, aData.ZZ_DATV1.substr(6,2));
		if(RetirementDate && (TripEnd > RetirementDate || TripStart > RetirementDate)){
			err = "The entered date is beyond your retirement date. Please correct.";
			sap.ca.ui.message.showMessageBox({
				type: sap.ca.ui.message.Type.ERROR,
				message: err,
				details: err
			});
			return;
		}
		///############# end changes 29 Jan 2021 UCD1KOR################//
		if (TravelPlanThis.onTabSelect(null) == "") { // validate data
			var aData = TravelPlanThis.getView().getModel().getData();
			TravelPlanThis.createDefaultValue(aData);
			var aSave = $.extend(false, {}, aData);
			sap.ui.project.e2etm.util.StaticUtility.setBusy(true, oDeputationThis);
			delete aSave.FundData;
			delete aSave.wbsElementData;
			delete aSave.advance;
			delete aSave.country;
			delete aSave.insurance;
			delete aSave.meal;
			delete aSave.seat;
			delete aSave.travelType;
			delete aSave.customer;
			delete aSave.view;
			delete aSave.visaCategory;
			delete aSave.budgetCenter;
			delete aSave.budgetCost;
			delete aSave.fund;
			delete aSave.vkm; // sidd
			delete aSave.ZZ_VKM; // sidd
			delete aSave.ZZ_VKM_ERROR;// sidd
			delete aSave.ZZ_VKM_TOOLTIP;// sidd
			delete aSave.ZZ_CCNAME;// sidd
			delete aSave.ZZ_CCNAME_ERROR;// sidd
			delete aSave.ZZ_CCDEPT;// sidd
			delete aSave.ZZ_CCDEPT_ERROR;// sidd
			delete aSave.ZZ_PO_ERROR;// added by uea6kor for upgrade_28.11.2019
			delete aSave.ZZ_CCOST;// sidd
			delete aSave.ZZ_CCOST_ERROR;// sidd
			delete aSave.ZZ_CLENTY;// sidd
			delete aSave.ZZ_CLENTY_ERROR;// sidd
			delete aSave.ZZ_EANO;// sidd
			delete aSave.ZZ_PONO;// sidd
			delete aSave.costCenter;
			delete aSave.wbsElement;
			delete aSave.dependent;
			delete aSave.mode;
			delete aSave.currency;
			delete aSave.ZZ_TRV_CAT;
			delete aSave.old;
			delete aSave.DEP_VISA_PLAN;
			delete aSave.ZZ_BEGDA_VALUE;
			delete aSave.ZZ_ENDDA_VALUE;
			delete aSave.ZZ_BEGDA_ERROR;
			delete aSave.ZZ_ENDDA_ERROR;
			delete aSave.__metadata;
/*Start-CI Reporting Changes*/
		//	uea6kor_16.9.2020
			delete aSave.SDate;
			delete aSave.EDate;
			delete aSave.PersFlag;
			delete aSave.ETime;
			delete aSave.STime;
			delete aSave.ZZ_STPERS_ERROR;
			delete aSave.ZZ_ENDPERS_ERROR;
			delete aSave.minPDate;
			delete aSave.maxPDate;
//			uea6kor_16.9.2020	
			delete aSave.ZZ_CI_CUSTTYP;
			delete aSave.ZZ_CI_CUSTTYP_ERROR;
			delete aSave.ZZ_CI_DIVISION;
			delete aSave.ZZ_CI_DIVISION_ERROR;
			delete aSave.ZZ_CI_DEP;
			delete aSave.ZZ_CI_DEP_ERROR;
			delete aSave.ZZ_CI_BU;
			delete aSave.ZZ_CI_GRP;
			delete aSave.ZZ_CI_GRP_ERROR;
			delete aSave.CiCustomerDetls;
			delete aSave.CiDivision;
			delete aSave.CiDepartment;
			delete aSave.CiGroup;
/*End-CI Reporting Changes*/		

/*Start-Secondary Travel Advance Changes*/
			delete aSave.bankcarddetails;
/*End-Secondary Travel Advance Changes*/	
			//DYE5kOR_MCR_NON_MCR changes
			delete aSave.mcrData;
			delete aSave.mcrFlag;
			delete aSave.ZZ_TASKID;
			delete aSave.ZZ_RESOURCEID;
			delete aSave.ResoucesDesc;
			delete aSave.taskDesc;
			delete aSave.ZZ_RESOURCETYP;
			delete aSave.ZZ_TASKDESC;
			//DYE5kOR_MCR_NON_MCR changes
			aSave.ZZ_STATUS = sStatus;
			aSave.TRV_HDRtoTRV_travel_Data = $.extend(true, [], aData.TRV_HDRtoTRV_travel_Data.results);
			for ( var i = 0; i < aSave.TRV_HDRtoTRV_travel_Data.length; i++) {
				////######## UCD1KOR 13 July 2021 Changes BUSR Copy #############/////
				aSave.TRV_HDRtoTRV_travel_Data[i].ZZ_REINR = "0000000000";
				delete aSave.TRV_HDRtoTRV_travel_Data[i].ZZ_BEGDA_ERROR;
				delete aSave.TRV_HDRtoTRV_travel_Data[i].ZZ_BEGUR_ERROR;
				delete aSave.TRV_HDRtoTRV_travel_Data[i].ZZ_ENDDA_ERROR;
				delete aSave.TRV_HDRtoTRV_travel_Data[i].ZZ_ENDUZ_ERROR;
				delete aSave.TRV_HDRtoTRV_travel_Data[i].ZZ_ZFRPLACE_ERROR;
				delete aSave.TRV_HDRtoTRV_travel_Data[i].ZZ_ZTOPLACE_ERROR;
				delete aSave.TRV_HDRtoTRV_travel_Data[i].ZZ_BEGDA_VALUE;
				delete aSave.TRV_HDRtoTRV_travel_Data[i].ZZ_ENDDA_VALUE;
				delete aSave.TRV_HDRtoTRV_travel_Data[i].ZZ_ZMODE_ERROR;
				delete aSave.TRV_HDRtoTRV_travel_Data[i].ZZ_ZSLFDPD_ERROR;
				delete aSave.TRV_HDRtoTRV_travel_Data[i].__metadata;
			}
			aSave.TRV_HDRtoTRV_COST_ASGN = $.extend(true, [], aData.TRV_HDRtoTRV_COST_ASGN.results);
			for ( var i = 0; i < aSave.TRV_HDRtoTRV_COST_ASGN.length; i++) {
				aSave.TRV_HDRtoTRV_COST_ASGN[i].ZZ_PERCENT = parseFloat(aSave.TRV_HDRtoTRV_COST_ASGN[i].ZZ_PERCENT);
			////######## UCD1KOR 13 July 2021 Changes BUSR Copy #############/////
				aSave.TRV_HDRtoTRV_COST_ASGN[i].ZZ_REINR = "0000000000";
				delete aSave.TRV_HDRtoTRV_COST_ASGN[i].ZZ_PERCENT_ERROR;
				delete aSave.TRV_HDRtoTRV_COST_ASGN[i].ZZ_FISTL_ERROR;
				delete aSave.TRV_HDRtoTRV_COST_ASGN[i].ZZ_GEBER_ERROR;
				delete aSave.TRV_HDRtoTRV_COST_ASGN[i].ZZ_GEBER_TOOLTIP;
				delete aSave.TRV_HDRtoTRV_COST_ASGN[i].ZZ_VKM_ERROR;// sidd
				delete aSave.TRV_HDRtoTRV_COST_ASGN[i].ZZ_VKM_TOOLTIP;
				delete aSave.TRV_HDRtoTRV_COST_ASGN[i].ZZ_FIPEX_ERROR;
				delete aSave.TRV_HDRtoTRV_COST_ASGN[i].ZZ_FIPEX_TOOLTIP;
				delete aSave.TRV_HDRtoTRV_COST_ASGN[i].ZZ_FIPOS_ERROR;
				delete aSave.TRV_HDRtoTRV_COST_ASGN[i].ZZ_KOSTL_ERROR;
				delete aSave.TRV_HDRtoTRV_COST_ASGN[i].__metadata;
			}
			aSave.TRV_HDRtoTRV_ACCOM = $.extend(true, [], aData.TRV_HDRtoTRV_ACCOM.results);
			for ( var i = 0; i < aSave.TRV_HDRtoTRV_ACCOM.length; i++) {
				delete aSave.TRV_HDRtoTRV_ACCOM[i].ZZ_ZPLACE_ERROR;
				delete aSave.TRV_HDRtoTRV_ACCOM[i].ZZ_BEGDA_ERROR;
				delete aSave.TRV_HDRtoTRV_ACCOM[i].ZZ_ENDDA_ERROR;
				delete aSave.TRV_HDRtoTRV_ACCOM[i].ZZ_CONTACT_ERROR;
				delete aSave.TRV_HDRtoTRV_ACCOM[i].ZZ_BEGDA_VALUE;
				delete aSave.TRV_HDRtoTRV_ACCOM[i].ZZ_ENDDA_VALUE;
				delete aSave.TRV_HDRtoTRV_ACCOM[i].enabled;
				delete aSave.TRV_HDRtoTRV_ACCOM[i].__metadata;
			}
			// Convert advance from array to object
			aSave.TRV_HDRtoTRV_ADVANCE = new Array();
			var advance = {};
			// ##################### 19 Feb 2020 UCD1KOR ####################### //
			// this.advanceClicked = "Clicked"
				advance.ZZ_CUR1 = aData.advance[0].currency_key.toString();
				advance.ZZ_BODVL1 = aData.advance[0].boarding.toString();
				advance.ZZ_LODVL1 = aData.advance[0].lodging.toString();
				advance.ZZ_SRTVL1 = aData.advance[0].surface.toString();
				advance.ZZ_OTHVL1 = aData.advance[0].others.toString();
				advance.ZZ_CUR2 = aData.advance[1].currency_key.toString();
				advance.ZZ_BODVL2 = aData.advance[1].boarding.toString();
				advance.ZZ_LODVL2 = aData.advance[1].lodging.toString();
				advance.ZZ_SRTVL2 = aData.advance[1].surface.toString();
				advance.ZZ_OTHVL2 = aData.advance[1].others.toString();
				advance.ZZ_CUR3 = aData.advance[2].currency_key.toString();
				advance.ZZ_BODVL3 = aData.advance[2].boarding.toString();
				advance.ZZ_LODVL3 = aData.advance[2].lodging.toString();
				advance.ZZ_SRTVL3 = aData.advance[2].surface.toString();
				advance.ZZ_OTHVL3 = aData.advance[2].others.toString();
				
			// advance.ZZ_CUR4 = aData.advance[3].currency_key.toString();
			// advance.ZZ_BODVL4 = aData.advance[3].boarding.toString();
			// advance.ZZ_LODVL4 = aData.advance[3].lodging.toString();
			// advance.ZZ_SRTVL4 = aData.advance[3].surface.toString();
			// advance.ZZ_OTHVL4 = aData.advance[3].others.toString();
			//
			// advance.ZZ_CUR5 = aData.advance[4].currency_key.toString();
			// advance.ZZ_BODVL5 = aData.advance[4].boarding.toString();
			// advance.ZZ_LODVL5 = aData.advance[4].lodging.toString();
			// advance.ZZ_SRTVL5 = aData.advance[4].surface.toString();
			// advance.ZZ_OTHVL5 = aData.advance[4].others.toString();
			//
			// advance.ZZ_CUR6 = aData.advance[5].currency_key.toString();
			// advance.ZZ_BODVL6 = aData.advance[5].boarding.toString();
			// advance.ZZ_LODVL6 = aData.advance[5].lodging.toString();
			// advance.ZZ_SRTVL6 = aData.advance[5].surface.toString();
			// advance.ZZ_OTHVL6 = aData.advance[5].others.toString();
			aSave.TRV_HDRtoTRV_ADVANCE.push(advance);
			aSave.ZZ_ZDURN = aSave.ZZ_ZDURN.toString();
			aSave.ZZ_SMODID = (aSave.ZZ_FMCNTRY == aSave.ZZ_LAND1) || (aSave.ZZ_FMCNTRY == "IN" && aSave.ZZ_LAND1 == "NP") || (aSave.ZZ_FMCNTRY == "NP" && aSave.ZZ_LAND1 == "IN") ? "DOME" : "INTL";
			// Giang CODE BEGIN
			try {
				if (aSave.ZZ_TRV_TYP == "DEPU") {
					aSave.ZZ_DEP_REQ = oDeputationThis.getView().getModel().getData().screenData.ZZ_DEP_REQ;
				} else {
					aSave.ZZ_DEP_REQ = oDeputationThis.getView().getModel().getData().screenData.ZZ_TRV_REQ;
				}
			} catch (exc) {
				aSave.ZZ_DEP_REQ = "";
			}
			// Giang CODE END
/*Start-Change Family Return Dates*/			
			aSave.ZZ_VREASON = sap.ui.getCore().getModel("global").getData().changeType;
/*End-Change Family Return Dates*/
			
			var token = "";
			var get = $.ajax({
				cache : false,
				url : sServiceUrl + "TRV_HDRSet",
				type : "GET",
				headers : {
					'Authorization' : token
				},
				beforeSend : function(xhr) {
					xhr.setRequestHeader('X-CSRF-Token', 'Fetch');
				},
			});
			get.done(function(result, response, header) {
				token = header.getResponseHeader("X-CSRF-Token");
				var sUrl = sServiceUrl + "TRV_HDRSet";
				jQuery.ajax({
					cache : false,
					url : sUrl,
					type : "POST",
					beforeSend : function(xhr) {
						xhr.setRequestHeader('X-Requested-With', "XMLHttpRequest");
						xhr.setRequestHeader('X-CSRF-Token', token);
						xhr.setRequestHeader('Accept', "application/json");
						xhr.setRequestHeader('DataServiceVersion', "2.0");
						xhr.setRequestHeader('Content-Type', "application/json");
					},
					data : JSON.stringify(aSave),
					dataType : "json",
					success : function(data) {
						var sMsg = "";
						if (data.d.ZZ_REINR == '0000000000') {
							//changes start for budget check msg display uml6kor 4/7/2019
							//// UCD1KOR 17/06/2021 commented below if condition
							//if(data.d.ZZ_COMMENTS.indexOf("Budget") != -1 && data.d.ZZ_COMMENTS.indexOf("manager") != -1 ) 
							if(data.d.ZZ_COMMENTS !== "" ) 
								{
								sap.ca.ui.message.showMessageBox({
									type : sap.ca.ui.message.Type.ERROR,
									message : data.d.ZZ_COMMENTS,
									details : data.d.ZZ_COMMENTS
								});
								sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oDeputationThis);	
								}
							else{
								that.errorOnSave = true; // added by UCD1KOR 21 July 2021
								sap.ca.ui.message.showMessageBox({
									type : sap.ca.ui.message.Type.ERROR,
									message : "Cannot save request in system",
									details : data.d.ZZ_COMMENTS
								});
								sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oDeputationThis);
							}//changes end for budget check msg display uml6kor 4/7/2019
							
						} else {
							that.errorOnSave = false; // added by UCD1KOR 21 July 2021
							var aBookingLocation = ["Coimbatore", "Bangalore"]; //Thanh 14.05.2021 Declare Location Array for booking room navigation
						////############ UCD1KOR 13 July 2021 Changes BUSR Copy ###############////
							sap.ui.getCore().getModel("global").getData().isCopy = false;
							sap.ui.getCore().getModel("global").getData().copyGeneral= false;
							sap.ui.getCore().getModel("global").getData().copyTravelDetails= false;
							sap.ui.getCore().getModel("global").getData().copyCostAssignment= false;
							sap.ui.getCore().getModel("global").getData().copyAdvance= false;
							sap.ui.getCore().getModel("global").refresh();
							if (aSave.ZZ_REINR == "0000000000") {							
								aData.ZZ_REINR = data.d.ZZ_REINR;
								TravelPlanThis.getView().getModel().setData(aData);
								//UEA6KOR_16.9.2020 personal trip changes
								TravelPlanThis.onPersonalTripCreate(aData);
//								//UEA6KOR_16.9.2020 personal trip changes
								
								sMsg = "Travel plan " + data.d.ZZ_REINR + " is created successfully..! ";
								//sap.m.MessageToast.show(sMsg);
								
								//Thanh 14.05.2021 Navigate to booking room
								if(aSave.ZZ_STATUS !== "AA000" && aBookingLocation.indexOf(aData.ZZ_FMLOC) > -1 && aBookingLocation.indexOf(aData.ZZ_LOCATION_END) > -1) {
									/*sap.ui.core.routing.Router.getRouter("MyRouter").navTo("reservation",{
										reinr:aData.ZZ_REINR,
										pernr:aData.ZZ_PERNR,
										query: {
											travelPlan: true
										}});*/
									// UCD1KOR 04 June Info message added for BAN,COB locations
									sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oDeputationThis);
									if (!that.osuccessDialog && sap.ui.getCore().getModel("global").getData().TrfrFlag !=="X") {
										that.osuccessDialog = new sap.m.Dialog({
											type: "Message",
											title: "Success",
											state: "Success",
											content: [
							    				   new sap.m.Text({ class: "label_bold",text:sMsg +
								    					 "\nOn successful approval of the travel request, kindly book your accommodation" +
								    					 "\nby clicking on ???Accommodation??? link available against the request"
							    						 }).addStyleClass("label_bold"),			 
											],
					    				    escapeHandler: function(e){
					    				    	  //Depending on the use case, call pEscapePending.resolve() or pEscapePending.reject() to overwrite the default behavior.
					    				    	e.reject();
					    				    	this.close();e.preventDefault();e.stopPropagation();
					    				    },
											endButton: new sap.m.Button({
												text: "OK",
												press: function () {
													sap.ui.core.routing.Router.getRouter("MyRouter").myNavBack();
												}.bind(this)
											})
										});
									}
									that.osuccessDialog.open();
								}
								else {
									sap.m.MessageToast.show(sMsg);
									sap.ui.core.routing.Router.getRouter("MyRouter").myNavBack();
								}
							} else {
								if (aSave.ZZ_STATUS == "AA000") {
									//UEA6KOR_16.9.2020 personal trip changes
									TravelPlanThis.onPersonalTripCreate(aData);
									//UEA6KOR_16.9.2020 personal trip changes
									
									sMsg = "Saved successfully";
									sap.m.MessageToast.show(sMsg);
								} else {
									//UEA6KOR_16.9.2020 personal trip changes
									TravelPlanThis.onPersonalTripCreate(aData);
									
									//UEA6KOR_16.9.2020 personal trip changes
									sMsg = "Submitted successfully..! ";
									//sap.m.MessageToast.show(sMsg);
									
									//Thanh 14.05.2021 Navigate to booking room
									if(aSave.ZZ_STATUS !== "AA000" && aBookingLocation.indexOf(aData.ZZ_FMLOC) > -1 && aBookingLocation.indexOf(aData.ZZ_LOCATION_END) > -1) {
										/*sap.ui.core.routing.Router.getRouter("MyRouter").navTo("reservation",{
											reinr:aData.ZZ_REINR,
											pernr:aData.ZZ_PERNR,
											query: {
												travelPlan: true
											}});*/
										// UCD1KOR 04 June Info message added for BAN,COB locations
										sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oDeputationThis);
										if (!that.osuccessDialog && sap.ui.getCore().getModel("global").getData().TrfrFlag !=="X") {
											that.osuccessDialog = new sap.m.Dialog({
												type: "Message",
												title: "Success",
												state: "Success",
												content: [
								    				   new sap.m.Text({ class: "label_bold",text:sMsg +
									    					 "\nOn successful approval of the travel request, kindly book your accommodation" +
									    					 "\nby clicking on ???Accommodation??? link available against the request"
								    						 }).addStyleClass("label_bold"),
												],
						    				    escapeHandler: function(e){
						    				    	  //Depending on the use case, call pEscapePending.resolve() or pEscapePending.reject() to overwrite the default behavior.
						    				    	e.reject();
						    				    	this.close();e.preventDefault();e.stopPropagation();
						    				    },
												endButton: new sap.m.Button({
													text: "OK",
													press: function () {
														sap.ui.core.routing.Router.getRouter("MyRouter").myNavBack();
													}.bind(this)
												})
											});
										}
										that.osuccessDialog.open();
									}
									else {
										sap.m.MessageToast.show(sMsg);
										sap.ui.core.routing.Router.getRouter("MyRouter").myNavBack();
									}
									//sap.ui.core.routing.Router.getRouter("MyRouter").myNavBack();
								}
							}
							//that.mgr_name = null;
							// Save travel plan
							if (TravelPlanThis.getView().getModel().getData().view.visaExist == "X") {
								oDeputationThis.getView().getModel().getData().selfVisa.ZZ_DEP_REQ = data.d.ZZ_REINR;
								oDeputationThis.saveVisaPlan(oDeputationThis.getView().getModel().getData(), "", "", TravelPlanThis.getView().getModel().getData().ZZ_TRV_TYP);
								if (sap.ui.getCore().byId('UploadVisaSelf').oFileUpload.files.length != 0) {
									sap.ui.project.e2etm.util.StaticUtility.uploadFileDeputation(oDeputationThis, sap.ui.getCore().byId('UploadVisaSelf'), data.d.ZZ_REINR, oDeputationThis.getView().getModel().getData().screenData.ZZ_DEP_PERNR, sMsg);
								}
							}
/*Start-Secondary Travel Advance Changes*/
							if(aData.ZZ_MODID=="SECO"&&(aData.ZZ_FMCNTRY!="IN"&&aData.ZZ_LAND1!="IN")){
							TravelPlanThis.saveCardBankIfSecondary(aData);
							}
/*End-Secondary Travel Advance Changes*/							
						}
						backup = aData;
						sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oDeputationThis);
					},
					fail : function(data) {
						sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oDeputationThis);
					}
				});
			});
		}
	},
	// Create default value for travel detail and cost assignment
	createDefaultValue : function(oData) {
		if (oData.TRV_HDRtoTRV_travel_Data.results.length == 0) { // Business
																	// request
			if(oData.ZZ_TRV_TYP=="BUSR" && oData.ZZ_SMODID=="INTL" && oData.PersFlag == "X"){ //uea6kor_23.9.2020 personal trip changes
				var min_pdate;
				var max_pdate;
	            var pstripDate = new Date(oData.SDate.substr(0, 4), 
						             oData.SDate.substr(4, 2) - 1, 
						             oData.SDate.substr(6, 2));
				var petripDate = new Date(oData.EDate.substr(0, 4), 
			                         oData.EDate.substr(4, 2) - 1, 
			                         oData.EDate.substr(6, 2));
			     var tstripDate = new Date(oData.ZZ_DATV1.substr(0, 4), 
						             oData.ZZ_DATV1.substr(4, 2) - 1, 
						             oData.ZZ_DATV1.substr(6, 2));
				var tetripDate = new Date(oData.ZZ_DATB1.substr(0, 4), 
			                         oData.ZZ_DATB1.substr(4, 2) - 1, 
			                         oData.ZZ_DATB1.substr(6, 2));		
			      if (tetripDate > pstripDate){
	                max_pdate = oData.ZZ_DATB1;
	                min_pdate = oData.SDate;
			      }  else{
	                 max_pdate = oData.EDate;
	                 min_pdate = oData.ZZ_DATV1;
			      }
			      oData.minPDate = min_pdate;
			      oData.maxPDate = max_pdate;

		 if(oData.TRV_HDRtoTRV_travel_Data != undefined){
			var oFirstItem = {
				ZZ_ZSLFDPD : "00",
				ZZ_ZFRPLACE : oData.ZZ_FMLOC,
				ZZ_ZTOPLACE : oData.ZZ_LOCATION_END,
				ZZ_BEGDA : min_pdate,
				ZZ_BEGDA_VALUE : new Date(min_pdate.substr(0, 4), min_pdate.substr(4, 2) - 1, min_pdate.substr(6, 2)),
				ZZ_TRVCAT : oData.ZZ_TRV_TYP,
				ZZ_ACTIVE : 'X'
			};
			var oEndItem = {
				ZZ_ZSLFDPD : "00",
				ZZ_ZFRPLACE : oData.ZZ_LOCATION_END,
				ZZ_ZTOPLACE : oData.ZZ_FMLOC,
				ZZ_BEGDA : max_pdate,
				ZZ_BEGDA_VALUE : new Date(max_pdate.substr(0, 4), max_pdate.substr(4, 2) - 1, max_pdate.substr(6, 2)),
				ZZ_TRVCAT : oData.ZZ_TRV_TYP,
				ZZ_ACTIVE : 'X'
			};
			oData.TRV_HDRtoTRV_travel_Data.results.push(oFirstItem);
			oData.TRV_HDRtoTRV_travel_Data.results.push(oEndItem);
			oData.view.detailLength = TravelPlanThis.getTravelDetailLength(oData);
			
		}				
	}else{
				var oFirstItem = {
						ZZ_ZSLFDPD : "00",
						ZZ_ZFRPLACE : oData.ZZ_FMLOC,
						ZZ_ZTOPLACE : oData.ZZ_LOCATION_END,
						ZZ_BEGDA : oData.ZZ_DATV1,
						ZZ_BEGDA_VALUE : new Date(oData.ZZ_DATV1.substr(0, 4), oData.ZZ_DATV1.substr(4, 2) - 1, oData.ZZ_DATV1.substr(6, 2)),
						ZZ_TRVCAT : oData.ZZ_TRV_TYP,
						ZZ_ACTIVE : 'X'
					};
					var oEndItem = {
						ZZ_ZSLFDPD : "00",
						ZZ_ZFRPLACE : oData.ZZ_LOCATION_END,
						ZZ_ZTOPLACE : oData.ZZ_FMLOC,
						ZZ_BEGDA : oData.ZZ_DATB1,
						ZZ_BEGDA_VALUE : new Date(oData.ZZ_DATB1.substr(0, 4), oData.ZZ_DATB1.substr(4, 2) - 1, oData.ZZ_DATB1.substr(6, 2)),
						ZZ_TRVCAT : oData.ZZ_TRV_TYP,
						ZZ_ACTIVE : 'X'
					};
					////########## UCD1KOR 21 July 2021 DOME TRFR Changes #############///////
					if(sap.ui.getCore().getModel("global").getData().TrfrFlag == "X"){
						oData.TRV_HDRtoTRV_travel_Data.results.push(oFirstItem);
					}
					else{
						oData.TRV_HDRtoTRV_travel_Data.results.push(oFirstItem);
						oData.TRV_HDRtoTRV_travel_Data.results.push(oEndItem);
					}
					
					oData.view.detailLength = TravelPlanThis.getTravelDetailLength(oData);
			}
			
		} else if (oData.ZZ_TRV_TYP == 'HOME' || oData.ZZ_TRV_TYP == 'EMER') { // Home
																				// or
																				// Emergency
																				// Trip
			var iIndex = 0;
			for (iIndex = 0; iIndex < oData.TRV_HDRtoTRV_travel_Data.results.length; iIndex++) {
				if (oData.TRV_HDRtoTRV_travel_Data.results[iIndex].ZZ_TRVCAT == oData.ZZ_TRV_TYP) {
					break;
				}
			}
			if (iIndex == oData.TRV_HDRtoTRV_travel_Data.results.length) { // No
																			// Default
																			// value
																			// for
																			// HOME
																			// or
																			// EMER
				var oFirstItem = {
					ZZ_ZSLFDPD : "00",
					ZZ_ZFRPLACE : oData.ZZ_LOCATION_END,
					ZZ_ZTOPLACE : oData.ZZ_FMLOC,
					ZZ_TRVCAT : oData.ZZ_TRV_TYP,
					ZZ_ACTIVE : 'X'
				};
				var oEndItem = {
					ZZ_ZSLFDPD : "00",
					ZZ_ZFRPLACE : oData.ZZ_FMLOC,
					ZZ_ZTOPLACE : oData.ZZ_LOCATION_END,
					ZZ_TRVCAT : oData.ZZ_TRV_TYP,
					ZZ_ACTIVE : 'X'
				};
				oData.TRV_HDRtoTRV_travel_Data.results.push(oFirstItem);
				oData.TRV_HDRtoTRV_travel_Data.results.push(oEndItem);
				oData.view.detailLength = TravelPlanThis.getTravelDetailLength(oData);
			}
		}
		
		/*UCD1KOR 14 Jan 2020 Two way tickts for STX Start*/
		
		else if(oData.TRV_HDRtoTRV_travel_Data.results.length == 1 && oData.ZZ_SMODID == 'INTL' && oDeputationThis.getView().getModel().getData().screenData.ZZ_TRV_CAT == 'TRFR' &&  oDeputationThis.getView().getModel().getData().screenData.ZZ_ASG_TYP =="STX"){
			var oReturnItem = {
					ZZ_ZSLFDPD : "00",
					ZZ_ZFRPLACE : oData.ZZ_LOCATION_END,
					ZZ_ZTOPLACE : oData.ZZ_FMLOC,
					ZZ_BEGDA : oData.ZZ_DATB1,
					ZZ_BEGDA_VALUE : new Date(oData.ZZ_DATB1.substr(0, 4), oData.ZZ_DATB1.substr(4, 2) - 1, oData.ZZ_DATB1.substr(6, 2)),
					ZZ_TRVCAT : oData.ZZ_TRV_TYP,
					ZZ_ACTIVE : 'X'
				};
			oData.TRV_HDRtoTRV_travel_Data.results.push(oReturnItem);
			oData.view.detailLength = TravelPlanThis.getTravelDetailLength(oData);
		}
		
		/*UCD1KOR 14 Jan 2020 Two way tickts for STX  End*/
		
	},
	// Get travel detail length
	getTravelDetailLength : function(oData) {
		var iLen = 0;
		for ( var i = 0; i < oData.TRV_HDRtoTRV_travel_Data.results.length; i++) {
			if (oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_TRVCAT == oData.ZZ_TRV_TYP) {
				iLen++;
			}
		}
		return iLen;
	},
	// Binding travel data
	bindTravelData : function(oData, sVisaCategory, sInsurance, sCountry, sMeal, sSeat, sTravelType, sCustomer) {
		try {
			// Dropdown list visa category
			oData.visaCategory = sVisaCategory.results;
			// Dropdown insurance
			oData.insurance = sInsurance.results;
			// Dropdown list for country
			oData.country = sCountry.results;			
			// Dropdown Meal
			oData.meal = sMeal.results;
			// Dropdown Seat
			oData.seat = sSeat.results;

			// Dropdown list for travel type
			oData.travelType = sTravelType.results;
			// Dropdown list for customer
			oData.customer = sCustomer.results;
		} catch (exc) {
		}
	},
	bindingDeepEntity : function(oData) {
		var line_1 = {
			currency_key : "",
			boarding : 0,
			lodging : 0,
			surface : 0,
			others : 0,
			total : 0
		};
		var line_2 = {
			currency_key : "",
			boarding : 0,
			lodging : 0,
			surface : 0,
			others : 0,
			total : 0
		};
		var line_3 = {
			currency_key : "",
			boarding : 0,
			lodging : 0,
			surface : 0,
			others : 0,
			total : 0
		};
		// var line_4 = { currency_key: "", boarding: 0, lodging: 0,
		// surface: 0, others: 0, total : 0 };
		// var line_5 = { currency_key: "", boarding: 0, lodging: 0,
		// surface: 0, others: 0, total : 0 };
		// var line_6 = { currency_key: "", boarding: 0, lodging: 0,
		// surface: 0, others: 0, total : 0 };
		oData.advance = [ line_1, line_2, line_3 ];
		if (oData.TRV_HDRtoTRV_COST_ASGN == undefined) {
			oData.TRV_HDRtoTRV_COST_ASGN = {};
			oData.TRV_HDRtoTRV_COST_ASGN.results = new Array();
		}
		if (oData.TRV_HDRtoTRV_travel_Data == undefined) {
			oData.TRV_HDRtoTRV_travel_Data = {};
			oData.TRV_HDRtoTRV_travel_Data.results = new Array();
		}
		if (oData.TRV_HDRtoTRV_ACCOM == undefined) {
			oData.TRV_HDRtoTRV_ACCOM = {};
			oData.TRV_HDRtoTRV_ACCOM.results = new Array();
		}
		if (oData.TRV_HDRtoTRV_ADVANCE == undefined) {
			oData.TRV_HDRtoTRV_ADVANCE = {};
			oData.TRV_HDRtoTRV_ADVANCE.results = new Array();
		}
	},
	// Mapping fields
	copyFields : function(oSource, oTarget) {
		oTarget.ZZ_DATB1 = oSource.ZZ_DATB1;
		oTarget.ZZ_DATV1 = oSource.ZZ_DATV1;
		oTarget.ZZ_DEP_REQ = oSource.ZZ_DEP_REQ;
		oTarget.ZZ_KUNDE = oSource.ZZ_KUNDE;
		oTarget.ZZ_CUST_NAME = oSource.ZZ_CUST_NAME;
		oTarget.ZZ_LAND1 = oSource.ZZ_LAND1;
		oTarget.ZZ_LOCATION_END = oSource.ZZ_LOCATION_END;
		oTarget.ZZ_FMLOC = oSource.ZZ_FMLOC;
		oTarget.ZZ_FMCNTRY = oSource.ZZ_FMCNTRY;
		oTarget.ZZ_PERNR = oSource.ZZ_PERNR;
		oTarget.ZZ_REINR = oSource.ZZ_REINR;
		oTarget.ZZ_UHRB1 = oSource.ZZ_UHRB1;
		oTarget.ZZ_UHRV1 = oSource.ZZ_UHRV1;
		oTarget.ZZ_ZCATG = oSource.ZZ_ZCATG;
		oTarget.ZZ_ZDURN = oSource.ZZ_ZDURN, oTarget.ZZ_ZINSUR = oSource.ZZ_ZINSUR;
		oTarget.ZZ_ZMEAL = oSource.ZZ_ZMEAL;
		oTarget.ZZ_ZMEAL = oSource.ZZ_ZMEAL;
		oTarget.ZZ_ZPURPOSE = oSource.ZZ_ZPURPOSE;
		oTarget.TRV_HDRtoTRV_COST_ASGN = {};
		oTarget.TRV_HDRtoTRV_travel_Data = {};
		oTarget.TRV_HDRtoTRV_ACCOM = {};
		oTarget.advance = {};
		oTarget.TRV_HDRtoTRV_COST_ASGN.results = $.extend(true, [], oSource.TRV_HDRtoTRV_COST_ASGN.results);
		oTarget.TRV_HDRtoTRV_travel_Data.results = $.extend(true, [], oSource.TRV_HDRtoTRV_travel_Data.results);
		oTarget.TRV_HDRtoTRV_ACCOM.results = $.extend(true, [], oSource.TRV_HDRtoTRV_ACCOM.results);
		oTarget.advance = $.extend(true, [], oSource.advance);
		return oTarget;
	},
	// Set location for search help
	setLocationF4 : function(oRowsModel, oValueHelpDialog, sCountry) {
		sap.ui.project.e2etm.util.StaticUtility.setBusy(true, oDeputationThis);
		var get = $.ajax({
			cache : false,
			url : sServiceUrl + "DEP_LOCATIONSSet?$filter=MOLGA eq '" + sCountry + "'&$format=json",
			type : "GET"
		});
		get.done(function(result) {
			if (result != null) {
				oValueHelpDialog.setTitle("LOCATION");
				oValueHelpDialog.setKey("BLAND");
				oValueHelpDialog.theTable.addColumn(new sap.ui.table.Column({
					label : new sap.ui.commons.Label({
						text : "LOCATION"
					}),
					template : new sap.ui.commons.TextView().bindProperty("text", "BLAND"),
					templateShareable:false,
					sortProperty : "BLAND",
					filterProperty : "BLAND"
				}));
				oRowsModel.setData(result.d.results);
				sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oDeputationThis);
				oValueHelpDialog.open();
			}
		});
		get.fail(function(err) {
			sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oDeputationThis);
			alert("No location is maintained");
		});
	},
	// Set customer for search help
	setCustomerF4 : function(oRowsModel, oValueHelpDialog) {
		oValueHelpDialog.setTitle("CUSTOMER");
		oValueHelpDialog.setKey("NAME1");
		oValueHelpDialog.theTable.addColumn(new sap.ui.table.Column({
			width : "170px",
			label : new sap.ui.commons.Label({
				text : "CUSTOMER NAME"
			}),
			template : new sap.ui.commons.TextView().bindProperty("text", "NAME1"),
			templateShareable:false,
			sortProperty : "NAME1",
			filterProperty : "NAME1"
		}));
		oValueHelpDialog.theTable.addColumn(new sap.ui.table.Column({
			width : "170px",
			label : new sap.ui.commons.Label({
				text : "CUSTOMER NO"
			}),
			template : new sap.ui.commons.TextView().bindProperty("text", "KUNNR"),
			templateShareable:false,
			sortProperty : "KUNNR",
			filterProperty : "KUNNR"
		}));
		oValueHelpDialog.theTable.addColumn(new sap.ui.table.Column({
			width : "170px",
			label : new sap.ui.commons.Label({
				text : "COUNTRY"
			}),
			template : new sap.ui.commons.TextView().bindProperty("text", {
				templateShareable:false,
				path : "LAND1",
				formatter : function(fValue) {
					if (fValue) {
						return sap.ui.project.e2etm.util.Formatter.formatCountry(fValue);
					}
					return "0";
				}
			}),
			sortProperty : "LAND1",
			filterProperty : "LAND1"
		})), oValueHelpDialog.theTable.addColumn(new sap.ui.table.Column({
			width : "170px",
			label : new sap.ui.commons.Label({
				text : "CITY"
			}),
			template : new sap.ui.commons.TextView().bindProperty("text", "ORT01"),
			templateShareable:false,
			sortProperty : "ORT01",
			filterProperty : "ORT01"
		}));
		oValueHelpDialog.theTable.addColumn(new sap.ui.table.Column({
			width : "170px",
			label : new sap.ui.commons.Label({
				text : "POSTAL CODE"
			}),
			template : new sap.ui.commons.TextView().bindProperty("text", "PSTLZ"),
			templateShareable:false,
			sortProperty : "PSTLZ",
			filterProperty : "PSTLZ"
		}));
		oValueHelpDialog.theTable.addColumn(new sap.ui.table.Column({
			width : "170px",
			label : new sap.ui.commons.Label({
				text : "HOME ADDRESS"
			}),
			template : new sap.ui.commons.TextView().bindProperty("text", "STRAS"),
			templateShareable:false,
			sortProperty : "STRAS",
			filterProperty : "STRAS"
		}));
		oValueHelpDialog.theTable.addColumn(new sap.ui.table.Column({
			width : "170px",
			label : new sap.ui.commons.Label({
				text : "SEARCH TERM"
			}),
			template : new sap.ui.commons.TextView().bindProperty("text", "SORTL"),
			templateShareable:false,
			sortProperty : "SORTL",
			filterProperty : "SORTL"
		}));
		oValueHelpDialog.theTable.addColumn(new sap.ui.table.Column({
			width : "170px",
			label : new sap.ui.commons.Label({
				text : "PHONE NO"
			}),
			template : new sap.ui.commons.TextView().bindProperty("text", "TELF1"),
			templateShareable:false,
			sortProperty : "TELF1",
			filterProperty : "TELF1"
		}));
		oRowsModel.setData(TravelPlanThis.getView().getModel().getData().customer);
	},
	// sidd code starts
	setVKMF4 : function(oRowsModel, oValueHelpDialog) {
		oValueHelpDialog.setTitle("VKM");
		oValueHelpDialog.setKey("VKMCode");
		oValueHelpDialog.theTable.addColumn(new sap.ui.table.Column({
			label : new sap.ui.commons.Label({
				text : "VKM NAME"
			}),
			template : new sap.ui.commons.TextView().bindProperty("text", "VKMName"),
			templateShareable:false,
			sortProperty : "VKMName",
			filterProperty : "VKMName"
		}));
		oValueHelpDialog.theTable.addColumn(new sap.ui.table.Column({
			label : new sap.ui.commons.Label({
				text : "VKM CODE"
			}),
			template : new sap.ui.commons.TextView().bindProperty("text", "VKMCode"),
			templateShareable:false,
			sortProperty : "VKMCode",
			filterProperty : "VKMCode"
		}));
		oValueHelpDialog.theTable.addColumn(new sap.ui.table.Column({
			label : new sap.ui.commons.Label({
				text : "DEPARTMENT"
			}),
			template : new sap.ui.commons.TextView().bindProperty("text", "Department"),
			templateShareable:false,
			sortProperty : "Department",
			filterProperty : "Department"
		}));
		oValueHelpDialog.theTable.addColumn(new sap.ui.table.Column({
			label : new sap.ui.commons.Label({
				text : "BUSINESS UNIT"
			}),
			template : new sap.ui.commons.TextView().bindProperty("text", "BusinessUnit"),
			templateShareable:false,
			sortProperty : "BusinessUnit",
			filterProperty : "BusinessUnit"
		}));
		oRowsModel.setData(TravelPlanThis.getView().getModel().getData().vkm);
	},
	// sidd code ends
	
	//DYE5KOR_MCR_NON_MCR Changes
	setTaskID:function(oRowsModel, oValueHelpDialog) {
		
		oValueHelpDialog.setTitle("TaskID");
		oValueHelpDialog.setKey("taskId");
		oValueHelpDialog.setDescriptionKey("taskDesc");
		oValueHelpDialog.theTable.addColumn(new sap.ui.table.Column({
			label : new sap.ui.commons.Label({
				text : "Task ID"
			}),
			template : new sap.ui.commons.TextView().bindProperty("text", "taskId"),
			templateShareable:false,
			sortProperty : "taskId",
			filterProperty : "taskId"
		}));
		oValueHelpDialog.theTable.addColumn(new sap.ui.table.Column({
			label : new sap.ui.commons.Label({
				text : "Task Description"
			}),
			template : new sap.ui.commons.TextView().bindProperty("text", "taskDesc"),
			templateShareable:false,
			sortProperty : "taskDesc",
			filterProperty : "taskDesc"
		}));
		oRowsModel.setData(TravelPlanThis.getView().getModel().getData().mcrData);
		
	},
	
	setResourceID:function(oRowsModel, oValueHelpDialog) {
		
		oValueHelpDialog.setTitle("Resource Group");
		oValueHelpDialog.setKey("ResourceId");
		oValueHelpDialog.setDescriptionKey("ResoucesDesc");
		oValueHelpDialog.theTable.addColumn(new sap.ui.table.Column({
			label : new sap.ui.commons.Label({
				text : "Resource ID"
			}),
			template : new sap.ui.commons.TextView().bindProperty("text", "ResourceId"),
			templateShareable:false,
			sortProperty : "ResourceId",
			filterProperty : "ResourceId"
		}));
		oValueHelpDialog.theTable.addColumn(new sap.ui.table.Column({
			label : new sap.ui.commons.Label({
				text : "Resource Group Description"
			}),
			template : new sap.ui.commons.TextView().bindProperty("text", "ResoucesDesc"),
			templateShareable:false,
			sortProperty : "ResoucesDesc",
			filterProperty : "ResoucesDesc"
		}));
		oRowsModel.setData(TravelPlanThis.getView().getModel().getData().mcrData);
		
	},
	//DYE5KOR_MCR_NON_MCR changes
	
	// Set columns for search help
	setColumnF4Table : function(sControlId, oRowsModel, oValueHelpDialog, oControl) {
		//dye5kor_Upgrade Fixes_11.04.2019
			if(oControl.sId.indexOf("fundId") != -1){
				sControlId = 'col1';
			}else if(oControl.sId.indexOf("budgetCenterId") != -1){
				sControlId = 'col2';
			}else if(oControl.sId.indexOf("wbsId") != -1){
				sControlId = 'col3';	
			}else if(oControl.sId.indexOf("costCenterId") != -1){
				sControlId = 'col4';
			}else if(oControl.sId.indexOf("budgetCodeId") != -1){
				sControlId = 'col5';
			}
		
		//dye5kor_Upgrade_Fixes_11.04.2019
		switch (sControlId) {
		case 'col1': // Fund
			oValueHelpDialog.setTitle("FUND");
			oValueHelpDialog.setKey("fincode");
			oValueHelpDialog.setDescriptionKey("beschr");
			oValueHelpDialog.theTable.addColumn(new sap.ui.table.Column({
				label : new sap.ui.commons.Label({
					text : "FUND"
				}),
				template : new sap.ui.commons.TextView().bindProperty("text", "fikrs"),
				templateShareable:false,
				sortProperty : "fikrs",
				filterProperty : "fikrs"
			}));
			oValueHelpDialog.theTable.addColumn(new sap.ui.table.Column({
				label : new sap.ui.commons.Label({
					text : "NAME"
				}),
				template : new sap.ui.commons.TextView().bindProperty("text", "fincode"),
				templateShareable:false,
				sortProperty : "fincode",
				filterProperty : "fincode"
			}));
			oValueHelpDialog.theTable.addColumn(new sap.ui.table.Column({
				label : new sap.ui.commons.Label({
					text : "DESCRIPTION"
				}),
				template : new sap.ui.commons.TextView().bindProperty("text", "beschr"),
				templateShareable:false,
				sortProperty : "beschr",
				filterProperty : "beschr"
			}));
			
			oRowsModel.setData(TravelPlanThis.getView().getModel().getData().fund);
			break;
		case 'col2': // Budget Center
		// oValueHelpDialog.setTitle("BUDGET CENTER");
		// oValueHelpDialog.setKey("fictr");
		// oValueHelpDialog.theTable.addColumn(new sap.ui.table.Column({
		// label: new sap.ui.commons.Label({text: "FMA"}),
		// template: new sap.ui.commons.TextView().bindProperty("text",
		// "fikrs"),
		// sortProperty: "fikrs",
		// filterProperty: "fikrs"
		// }));
		// oValueHelpDialog.theTable.addColumn(new sap.ui.table.Column({
		// label: new sap.ui.commons.Label({text: "BUDGET CENTER"}),
		// template: new sap.ui.commons.TextView().bindProperty("text",
		// "fictr"),
		// sortProperty: "fictr",
		// filterProperty: "fictr"
		// }));
		//		
		// oRowsModel.setData(TravelPlanThis.getView().getModel().getData().budgetCenter);
		//			
			// TGG1HC fix WBS
			oValueHelpDialog.setTitle("BUDGET CENTER");
			oValueHelpDialog.setKey("ZzFundC");
			oValueHelpDialog.setDescriptionKey("ZzFundDes")
			oValueHelpDialog.theTable.addColumn(new sap.ui.table.Column({
				label : new sap.ui.commons.Label({
					text : "FMA"
				}),
				template : new sap.ui.commons.TextView().bindProperty("text", "ZzFundC"),
				templateShareable:false,
				sortProperty : "ZzFundC",
				filterProperty : "ZzFundC"
			}));
			oValueHelpDialog.theTable.addColumn(new sap.ui.table.Column({
				label : new sap.ui.commons.Label({
					text : "DESCRIPTION"
				}),
				template : new sap.ui.commons.TextView().bindProperty("text", "ZzFundDes"),
				templateShareable:false,
				sortProperty : "ZzFundDes",
				filterProperty : "ZzFundDes"
			}));
			// TGG1HC fixing display search help
			var aWBs = [];
			/*if (oControl.getParent().getCells()[1].getValue() == "F02")*/ 
			if(oControl.getBindingContext().getModel().getProperty(oControl.getBindingContext().sPath).ZZ_GEBER == "F02")
			{
				for ( var i = 0; i < TravelPlanThis.getView().getModel().getData().budgetCenter.length; i++) {
					if (TravelPlanThis.getView().getModel().getData().budgetCenter[i].ZzVkmFund == "X") {
						var oWBs = {
							ZzFundC : "",
							ZzFundDes : "",
							ZzVkmFund : "",
							ZzVkmOwner : "",
						};
						oWBs.ZzFundC = TravelPlanThis.getView().getModel().getData().budgetCenter[i].ZzFundC;
						oWBs.ZzFundDes = TravelPlanThis.getView().getModel().getData().budgetCenter[i].ZzFundDes;
						oWBs.ZzVkmFund = TravelPlanThis.getView().getModel().getData().budgetCenter[i].ZzVkmFund;
						oWBs.ZzVkmOwner = TravelPlanThis.getView().getModel().getData().budgetCenter[i].ZzVkmOwner;
						aWBs.push(oWBs);
					}
				}
			} else {
				for ( var i = 0; i < TravelPlanThis.getView().getModel().getData().budgetCenter.length; i++) {
					if (TravelPlanThis.getView().getModel().getData().budgetCenter[i].ZzVkmFund == "") {
						var oWBs = {
							ZzFundC : "",
							ZzFundDes : "",
							ZzVkmFund : "",
							ZzVkmOwner : "",
						};
						oWBs.ZzFundC = TravelPlanThis.getView().getModel().getData().budgetCenter[i].ZzFundC;
						oWBs.ZzFundDes = TravelPlanThis.getView().getModel().getData().budgetCenter[i].ZzFundDes;
						oWBs.ZzVkmFund = TravelPlanThis.getView().getModel().getData().budgetCenter[i].ZzVkmFund;
						oWBs.ZzVkmOwner = TravelPlanThis.getView().getModel().getData().budgetCenter[i].ZzVkmOwner;
						aWBs.push(oWBs);
					}
				}
			}
			oRowsModel.setData(aWBs);
			break;
		case 'col3': // WBS Element
			oValueHelpDialog.setTitle("WBS ELEMENT");
			oValueHelpDialog.setKey("ZZ_POSKI");
			oValueHelpDialog.setDescriptionKey("ZZ_POST1");
			/*oValueHelpDialog.theTable.setNoDataText("Note : If WBS element in not found in the list, please follow below steps:\n \t1.Please seek help from your  PM/FLM/SDM to check if the PIF is in released state.\n \t\t\t\t      2.Please seek help from your  FLM/SDM to check if respective location/company code PIF is created.\nNote: If PIF is created newly, it takes 24hrs to reflect into SWIFT application.\nIf you still find issues after taking care of above points, raise iQuery ticket.");*/
			oValueHelpDialog.theTable.addColumn(new sap.ui.table.Column({
				label : new sap.ui.commons.Label({
					text : "WBS ELEMENT"
				}),
				template : new sap.ui.commons.TextView().bindProperty("text", "ZZ_POSKI"),
				templateShareable:false,
				sortProperty : "ZZ_POSKI",
				filterProperty : "ZZ_POSKI"
			}));
			oValueHelpDialog.theTable.addColumn(new sap.ui.table.Column({
				label : new sap.ui.commons.Label({
					text : "DESCRIPTION"
				}),
				template : new sap.ui.commons.TextView().bindProperty("text", "ZZ_POST1"),
				sortProperty : "ZZ_POST1",
				filterProperty : "ZZ_POST1"
			}));
			oRowsModel.setData(TravelPlanThis.getView().getModel().getData().wbsElement);
			break;
		case 'col4': // Cost center
			oValueHelpDialog.setTitle("COST CENTER");
			oValueHelpDialog.setKey("KOSTL");
			oValueHelpDialog.setDescriptionKey("KTEXT");	
			oRowsModel.setData(TravelPlanThis.getView().getModel().getData().costCenter);
			oValueHelpDialog.theTable.addColumn(new sap.ui.table.Column({
				label : new sap.ui.commons.Label({
					text : "COST CENTER"
				}),
				template : new sap.ui.commons.TextView().bindProperty("text", "KOSTL"),
				templateShareable:false,
				sortProperty : "KOSTL",
				filterProperty : "KOSTL"
			}));
			oValueHelpDialog.theTable.addColumn(new sap.ui.table.Column({
				label : new sap.ui.commons.Label({
					text : "CONTROLLING AREA"
				}),
				template : new sap.ui.commons.TextView().bindProperty("text", "KOKRS"),
				templateShareable:false,
				sortProperty : "KOKRS",
				filterProperty : "KOKRS"
			}));
			oValueHelpDialog.theTable.addColumn(new sap.ui.table.Column({
				label : new sap.ui.commons.Label({
					text : "NAME"
				}),
				template : new sap.ui.commons.TextView().bindProperty("text", "VERAK"),
				templateShareable:false,
				sortProperty : "VERAK",
				filterProperty : "VERAK"
			}));
			oValueHelpDialog.theTable.addColumn(new sap.ui.table.Column({
				label : new sap.ui.commons.Label({
					text : "DESCRIPTION"
				}),
				template : new sap.ui.commons.TextView().bindProperty("text", "KTEXT"),
				templateShareable:false,
				sortProperty : "KTEXT",
				filterProperty : "KTEXT"
			}));
			break;
		case 'col5': // Budget cost
			oValueHelpDialog.setTitle("BUDGET CODE");
			oValueHelpDialog.setKey("FIPEX");
			oValueHelpDialog.setDescriptionKey("ZZ_BUD_DESC");
			oRowsModel.setData(TravelPlanThis.getView().getModel().getData().budgetCost);
			oValueHelpDialog.theTable.addColumn(new sap.ui.table.Column({
				label : new sap.ui.commons.Label({
					text : "BUDGET CODE"
				}),
				template : new sap.ui.commons.TextView().bindProperty("text", "FIPEX"),
				templateShareable:false,
				sortProperty : "FIPEX",
				filterProperty : "FIPEX",
				width : "20%",
			}));
			oValueHelpDialog.theTable.addColumn(new sap.ui.table.Column({
				label : new sap.ui.commons.Label({
					text : "DESCRIPTION"
				}),
				template : new sap.ui.commons.TextView().bindProperty("text", "ZZ_BUD_DESC"),
				templateShareable:false,
				sortProperty : "ZZ_BUD_DESC",
				filterProperty : "ZZ_BUD_DESC",
				width : "60%",
			}));
			break;
		}
	},
	getCostAssignment : function(oData) {
		var ZZ_CATID = oData.ZZ_CATID; 
		if (oData.wbsElement == undefined) {
			sap.ui.project.e2etm.util.StaticUtility.setBusy(true, oDeputationThis);
			var sRequest = TravelPlanThis.getView().getModel().getData().ZZ_REINR;
			if (oData.ZZ_MODID == "SECO") {
				sRequest = sap.ui.getCore().getModel("global").getData().ZZ_TRV_REQ;
			}
			//////#################### UCD1KOR 15 July 2021 BUSR Copy ######################////////
			if(sap.ui.getCore().getModel("global").getData().isCopy){
				sRequest = "0000000000";
				TravelPlanThis.getView().getModel().getData().ZZ_TRV_TYP = "BUSR";
			}
			var oDataModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
			// var batchOperation0 =
			// oDataModel.createBatchOperation("GetF4Help?Srch_help='ZBUD'&$format=json",
			// "GET");
			// var batchOperation1 =
			// oDataModel.createBatchOperation("GetF4Table?TableName='PRPS'&Col1='PSPNR'&Col2='POSID'&Col3='POST1'&Col4=''&Col5=''&Col6=''&Col7=''&Col8=''&Col9=''&Col10=''&$format=json",
			// "GET");
			var batchOperation0 = oDataModel.createBatchOperation("WBSf4Help?" + "ZZ_REINR='" + sRequest + "'&ZZ_PERNR='" + TravelPlanThis.getView().getModel().getData().ZZ_PERNR + "'&ZZ_LAND1='" + TravelPlanThis.getView().getModel().getData().ZZ_LAND1 + "'&ZZ_TTYPE='" + TravelPlanThis.getView().getModel().getData().ZZ_TRV_TYP + "'&$format=json", "GET");
			// TGG1HC
			// var batchOperation0 =
			// oDataModel.createBatchOperation("ZE2E_FUND_CENTERSet","GET");
			// var batchOperation2 =
			// oDataModel.createBatchOperation("GetF4Table?TableName='CSKT'&Col1='KOKRS'&Col2='KOSTL'&Col3='KTEXT'&Col4='LTEXT'&Col5=''&Col6=''&Col7=''&Col8=''&Col9=''&Col10=''&$format=json",
			// "GET");
			var batchOperation1 = oDataModel.createBatchOperation("CostCenterF4Help?" + "ZZ_REINR='" + sRequest + "'&ZZ_TTYPE='" + TravelPlanThis.getView().getModel().getData().ZZ_TRV_TYP + "'&ZZ_PERNR='" + TravelPlanThis.getView().getModel().getData().ZZ_PERNR + "'&ZZ_LAND1='" + TravelPlanThis.getView().getModel().getData().ZZ_LAND1 + "'&$format=json", "GET");
			var batchOperation2 = oDataModel.createBatchOperation("Fund_F4_Help?ZZ_BEGDA='" + oData.ZZ_DATV1 + "'&ZZ_ENDDA='" + oData.ZZ_DATB1 + "'&$format=json", "GET");
			// var batchOperation3 =
			// oDataModel.createBatchOperation("BudgetCenter_F4_Help?ZZ_BEGDA='"
			// + oData.ZZ_DATV1 + "'&ZZ_ENDDA='" + oData.ZZ_DATB1 +
			// "'&$format=json", "GET");
			// tgg1hc buget center
			var batchOperation3 = oDataModel.createBatchOperation("ZE2E_FUND_CENTERSet", "GET");
			var batchOperation4 = oDataModel.createBatchOperation("VKMNames?VKMName='DE'&$format=json", "GET");
			//dye5kor_MCR_Non_MCR
			var batchOperation5 = oDataModel.createBatchOperation("MCRData?&$format=json", "GET");
			//dye5kor_MCR_Non_MCR
			oDataModel.addBatchReadOperations([ batchOperation0, batchOperation1, batchOperation2, batchOperation3, batchOperation4,batchOperation5 ]);
			oDataModel.submitBatch(function(oResult) {
				// Search help for WBS element
				///// 09 Apr 2021 UCD1KOR commented below line added wbsElementData
				//oData.wbsElement = oResult.__batchResponses[0].data.results;
				oData.wbsElementData = oResult.__batchResponses[0].data.results;
				// Search help for cost center
				oData.costCenter = oResult.__batchResponses[1].data.results;
				// Search help for fund
				//////// 19 Apr 2021 UCD1KOR Commented below line added FundData
				//oData.fund = oResult.__batchResponses[2].data.results;
				//////// Arranging Fund 
				oData.FundData = oResult.__batchResponses[2].data.results;
				oData.fund = [];
					for(var i=0;i<oData.FundData.length;i++){
						if(ZZ_CATID == "GLOB" && (oData.FundData[i].fincode == "F08" || oData.FundData[i].fincode == "F09")){
							oData.fund.push(oData.FundData[i]);
						}
						else if(ZZ_CATID !== "GLOB" && (oData.FundData[i].fincode !== "F08" && oData.FundData[i].fincode !== "F09")){
							oData.fund.push(oData.FundData[i]);
						}
					}
				////////////////////////////////////////////////////////////////////////////////////////////////////	
				// Search help for budget center
				oData.budgetCenter = oResult.__batchResponses[3].data.results;
				// Search help for VKM
				oData.vkm = oResult.__batchResponses[4].data.results;
				//dye5kor_MCR_Non_MCR
				oData.mcrData = oResult.__batchResponses[5].data.results;
				//dye5kor_MCR_Non_MCR
				
				/////############### UCD1KOR 9 July 2020 ####################////////////
				/// Bug fix for Fund Desc
				for(var i=0;i<oData.TRV_HDRtoTRV_COST_ASGN.results.length;i++){
					if(oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_GEBER == "F03"){
						oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_BESCHR = "Customer-At actuals"
					}
					else if(oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_GEBER == "F04"){
						oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_BESCHR = "Customer Consolidated"
					}
					else if(oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_GEBER == "F02"){
						oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_BESCHR = "Customer-VKM Fund"
					}
					else if(oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_GEBER == "F08"){
						//oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_BESCHR = "Global-Third Party Business"
						oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_BESCHR = "SDS projects"
					}
				}
				////UCD1KOR 17 May 2021 wbs fix 
				try{
					var sKey = oData.TRV_HDRtoTRV_COST_ASGN.results[0].ZZ_GEBER;
					oData.wbsElement = [];
							for(var i=0;i<oData.wbsElementData.length;i++){
								if(sKey=="F08" &&( oData.wbsElementData[i].ZZ_CATG == "4" ||  oData.wbsElementData[i].ZZ_CATG == "04")){
									oData.wbsElement.push(oData.wbsElementData[i]);
								}
								else if(sKey !="F08" && (oData.wbsElementData[i].ZZ_CATG != "4" ||  oData.wbsElementData[i].ZZ_CATG != "04")){
									oData.wbsElement.push(oData.wbsElementData[i]);
								}
					}
				}catch(err){}
				
				
				sap.ui.project.e2etm.util.StaticUtility.showTooltipFund(oData);
				sap.ui.project.e2etm.util.StaticUtility.showTooltipBudgetCode(oData);
				sap.ui.project.e2etm.util.StaticUtility.showTooltipVKM(oData);
				// sap.ui.project.e2etm.util.StaticUtility();
				TravelPlanThis.getView().getModel().setData(oData);
				sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oDeputationThis);
			}, function(oError) {
				sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oDeputationThis);
				sap.ca.ui.message.showMessageBox({
					type : sap.ca.ui.message.Type.ERROR,
					message : "Sorry for this inconvenience. Please contact support team",
					details : oError.responseText
				});
			});
		}
		else{
			oData.fund = [];
			for(var i=0;i<oData.FundData.length;i++){
				if(ZZ_CATID == "GLOB" && (oData.FundData[i].fincode == "F08" || oData.FundData[i].fincode == "F09")){
					oData.fund.push(oData.FundData[i]);
				}
				else if(ZZ_CATID !== "GLOB" && (oData.FundData[i].fincode !== "F08" && oData.FundData[i].fincode !== "F09")){
					oData.fund.push(oData.FundData[i]);
				}
			}
		}
	},
	getTravelDetail : function(oData) {
		if (oData.dependent == undefined) {
			sap.ui.project.e2etm.util.StaticUtility.setBusy(true, oDeputationThis);
			var sDependent = sServiceUrl + "GetDomain?DomainName='ZSLFDPD'&$format=json";
			var sMode = sServiceUrl + "GetDomain?DomainName='ZINF_MODE'&$format=json";
			var sVisaExist = sServiceUrl + "DEP_VISA_PLANSet('" + sap.ui.getCore().getModel("global").getData().ZZ_VISA_PLAN + "')?$expand=VISAPLANTOITEM&$format=json";
			if (sap.ui.getCore().getModel("global").getData().ZZ_REQ_TYP == "HOME" || sap.ui.getCore().getModel("global").getData().ZZ_REQ_TYP == "EMER") {
				$.when($.ajax({
					cache : false,
					url : sDependent
				}), $.ajax({
					cache : false,
					url : sMode
				}), $.ajax({
					cache : false,
					url : sVisaExist
				})).done(function(sDependent, sMode, sVisaExist) {
					var sVisaExist = sVisaExist[0].d.VISAPLANTOITEM.results;
					TravelPlanThis.setTravelDetail(oData, sVisaExist, sDependent);
					// Dropdown list mode
					oData.mode = sMode[0].d.results;
					TravelPlanThis.getView().getModel().setData(oData);
					sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oDeputationThis);
				});
			} else {
				$.when($.ajax({
					cache : false,
					url : sDependent
				}), $.ajax({
					cache : false,
					url : sMode
				})).done(function(sDependent, sMode) {
					var sVisaExist;
					if (TravelPlanThis.getView().getModel().getData().ZZ_TRV_TYP == "BUSR" || TravelPlanThis.getView().getModel().getData().ZZ_TRV_TYP == "INFO" || (TravelPlanThis.getView().getModel().getData().ZZ_SMODID == "DOME" && oDeputationThis.getView().getModel().getData().screenData.ZZ_TRV_CAT == "TRFR")) {
						sVisaExist = sap.ui.getCore().getModel("profile").getData().dependentDetail;
					} else {
						sVisaExist = oDeputationThis.getView().getModel().getData().visaExistingDependent;
					}
					TravelPlanThis.setTravelDetail(oData, sVisaExist, sDependent);
					// Dropdown list mode
					oData.mode = sMode[0].d.results;
					TravelPlanThis.getView().getModel().setData(oData);
					sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oDeputationThis);
				});
			}
		}
	},
	setTravelDetail : function(oData, sVisaExist, sDependent) {
		// Dropdown list dependent
		if (oData.view.enableAddDetail || oData.view.enableAddDetail) {
			oData.dependent = [ {
				DOMVALUE_L : "00",
				DDTEXT : 'Self'
			} ];
			try {
				// var aDependent =
				// oDeputationThis.getView().getModel().getData().visaExistingDependent;
				for ( var i = 0; i < sVisaExist.length; i++) {
					if (TravelPlanThis.getView().getModel().getData().ZZ_TRV_TYP == "BUSR" || TravelPlanThis.getView().getModel().getData().ZZ_TRV_TYP == "INFO" || (TravelPlanThis.getView().getModel().getData().ZZ_SMODID == "DOME" && oDeputationThis.getView().getModel().getData().screenData.ZZ_TRV_CAT == "TRFR")) {
						if (sVisaExist[i].ZZ_DEP_TYP.indexOf("Spouse") != -1) {
							oData.dependent.push({
								DOMVALUE_L : "01",
								DDTEXT : 'Spouse'
							});
						} else if (sVisaExist[i].ZZ_DEP_TYP.indexOf("C1") != -1) {
							oData.dependent.push({
								DOMVALUE_L : "02",
								DDTEXT : 'Child 1'
							});
						} else if (sVisaExist[i].ZZ_DEP_TYP.indexOf("C2") != -1) {
							oData.dependent.push({
								DOMVALUE_L : "90",
								DDTEXT : 'Child 2'
							});
						} else if (sVisaExist[i].ZZ_DEP_TYP.indexOf("C3") != -1) {
							oData.dependent.push({
								DOMVALUE_L : "03",
								DDTEXT : 'Child 3'
							});
						} else if (sVisaExist[i].ZZ_DEP_TYP.indexOf("C4") != -1) {
							oData.dependent.push({
								DOMVALUE_L : "04",
								DDTEXT : 'Child 4'
							});
						} else if (sVisaExist[i].ZZ_DEP_TYP.indexOf("C5") != -1) {
							oData.dependent.push({
								DOMVALUE_L : "05",
								DDTEXT : 'Child 5'
							});
						}
					} else if (sVisaExist[i].ZZ_VISA_PLAN != "") {
						if (sVisaExist[i].ZZ_DEPNDT_TYP.indexOf("Spouse") != -1) {
							oData.dependent.push({
								DOMVALUE_L : "01",
								DDTEXT : 'Spouse'
							});
						} else if (sVisaExist[i].ZZ_DEPNDT_TYP.indexOf("C1") != -1) {
							oData.dependent.push({
								DOMVALUE_L : "02",
								DDTEXT : 'Child 1'
							});
						} else if (sVisaExist[i].ZZ_DEPNDT_TYP.indexOf("C2") != -1) {
							oData.dependent.push({
								DOMVALUE_L : "90",
								DDTEXT : 'Child 2'
							});
						} else if (sVisaExist[i].ZZ_DEPNDT_TYP.indexOf("C3") != -1) {
							oData.dependent.push({
								DOMVALUE_L : "03",
								DDTEXT : 'Child 3'
							});
						} else if (sVisaExist[i].ZZ_DEPNDT_TYP.indexOf("C4") != -1) {
							oData.dependent.push({
								DOMVALUE_L : "04",
								DDTEXT : 'Child 4'
							});
						} else if (sVisaExist[i].ZZ_DEPNDT_TYP.indexOf("C5") != -1) {
							oData.dependent.push({
								DOMVALUE_L : "05",
								DDTEXT : 'Child 5'
							});
						}
					}
				}
			} catch (ex) {
			}
		} else {
			oData.dependent = sDependent[0].d.results;
		}
	},
	getAdvance : function(oData) {
		var that = this;
		//changed by MYU1KOR : Advance Restriction CR
		this.Advanceflag1 = 0;
		for(var i = 0; i < oData.advance.length; i++)
			{
				if(oData.advance[i].currency_key != "")
					{
					this.Advanceflag1 = 1; 
						break;
					}
			}
		///################## 20 FEB 2020 UCD1KOR #######/////// added below condition
		if(this.Advanceflag1 == 0 || (this.TravelDateModified ="Modified" && oData.ZZ_STATUS == ""))
			{
			if(oData.ZZ_MODID == 'BUSR' || oData.ZZ_MODID == 'SECO' || oData.ZZ_MODID == 'INFO' || (oData.ZZ_MODID == 'DEPU' && sap.ui.getCore().getModel("global").getData().ZZ_TRV_CAT != 'TRFR'))
			{
				var globalData = sap.ui.getCore().getModel("global").getData();
				
				var adv_data = [
						TravelPlanThis.getView().getModel().getData().ZZ_LAND1,
						TravelPlanThis.getView().getModel().getData().ZZ_LOCATION_END,
						TravelPlanThis.getView().getModel().getData().ZZ_MODID,
						sap.ui.getCore().getModel("global").getData().ZZ_TRV_CAT
					]
				var advTable = new Array(1);
				for (var i = 0; i < globalData.TrvAdvRestrict.length; i++)
					{
						advTable[i] = new Array(6);
						advTable[i][0] = globalData.TrvAdvRestrict[i].ZzToCountry;
						advTable[i][1] = globalData.TrvAdvRestrict[i].ZzTrvToloc;
						advTable[i][2] = globalData.TrvAdvRestrict[i].ZzTrvKey;
						advTable[i][3] = globalData.TrvAdvRestrict[i].ZzTrvCat;
						advTable[i][4] = globalData.TrvAdvRestrict[i].ZzAmount;
						advTable[i][5] = globalData.TrvAdvRestrict[i].ZzCurrency;
					}
//				if ( oData.ZZ_MODID != 'DEPU')  commented by uml6kor 18/9/2019
//				{
//					for (var i = 0; i < advTable.length; i++){
//						if (advTable[i][1] != "*")
//							{
//								for(var j = 0; j < globalData.cityto.length; j++){
//									if ( advTable[i][1] == globalData.cityto[j].MOLGA )
//										{
//										advTable[i][1] = globalData.cityto[j].BLAND;
//										}
//								}
//							}
//			
//					}
//			
//				}
//				
				
				for (var i = 0; i < adv_data.length; i++)
				{
					
					for (var j = 0; j < advTable.length; j++) 
					{
						if(advTable[j] != null){
							if(advTable[j][i] == "*")
								{
							
								}	
							else if( adv_data[i] != advTable[j][i] ){
								delete advTable[j];
							}
						}
					}
					}
				var flag = -1;
				var advAmt;
				var curr;
				for (var i = 0; i < 6; i++)
				{
					
					for (var j = 0; j < advTable.length; j++){
						
						if(advTable[j] != null){
							if(advTable[j][i] != "*")
							{
								
								advAmt = advTable[j][4];
								curr = advTable[j][5];
								flag = 0;
								break;
							}
								else{
									advAmt = advTable[j][4];
									curr = advTable[j][5];
								}
						}					
					}
					if(flag == 0)
						break;
				}
				var newIndex;
				var boac;
				var lodc;
				var conc;
				var tot_adv;
				var total_adv;
				var get = $.ajax({
					cache : false,
					url : sServiceUrl + "AdvanceAmount?" + "ENDDA='" + oData.ZZ_DATB1 + "'&STDATE='" + oData.ZZ_DATV1 + "'&ZE2E_LEVEL='" + oData.ZZ_LEVEL + "'&ZZ_CITY='" + oData.ZZ_LOCATION_END + "'&ZZ_FRMLAND='" + oData.ZZ_FMCNTRY + "'&ZZ_MODID='" + oData.ZZ_MODID + "'&ZZ_SMODID='" + oData.ZZ_SMODID + "'&ZZ_TOLAND='" + oData.ZZ_LAND1 + "'&$format=json",
					type : "GET"
				});
				get.fail(function(err) {
					sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
				});
				get.done(function(result, response, header) {
				for(var i = 0; i < result.d.results.length; i++ ){
					boac = result.d.results[i].ZE2E_BOAC_AMT;
					lodc = result.d.results[i].ZE2E_LODC_AMT;
					conc = result.d.results[i].ZE2E_CONC_AMT;
					
					if(oData.ZZ_MODID == 'BUSR' || oData.ZZ_MODID == 'SECO' || oData.ZZ_MODID == 'INFO'){
						tot_adv = ( parseInt(boac) + parseInt(lodc) + parseInt(conc) ) * parseInt(oData.ZZ_ZDURN);
						
					}else
					{
						tot_adv = (( parseInt(boac) + parseInt(lodc) + parseInt(conc) ) / 30) * parseInt(oData.ZZ_ZDURN);
					}
					
					if(result.d.results[i].ZE2E_BOAC_CURR == curr){
						if((advAmt != "" || advAmt != '0') && advAmt < tot_adv )
						{
							oData.advance[i].boarding = advAmt;
							oData.advance[i].total = advAmt;
							oData.advance[i].currency_key= result.d.results[i].ZE2E_CONC_CURR;
							adv_amount = advAmt;
						}
					else
						{
							oData.advance[i].boarding = tot_adv;
							oData.advance[i].total = tot_adv;
							oData.advance[i].currency_key= result.d.results[i].ZE2E_CONC_CURR;
							adv_amount = tot_adv;
						}

					TravelPlanThis.getView().getModel().setData(oData);
					}else
					{
						newIndex = i;
						var get = $.ajax({
							cache : false,
							url : sServiceUrl + "CurrExchangeSet?$filter=ZzFcurr eq'" + curr + "'+and+ZzTcurr+eq+'" + result.d.results[i].ZE2E_CONC_CURR + "'&$format=json",
							type : "GET"
						});
						get.fail(function(err) {
							sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
						});
						get.done(function(result, response, header) {
							//// 26 Feb 2020 UCD1KOR bug fix for result.d.results[0] 
							if(result.d.results[0] && result.d.results[0].ZzExchange != "")
								{
								var exc_rate = result.d.results[0].ZzExchange;
								if(advAmt != "" || advAmt != '0' && advAmt < tot_adv )
								{
									oData.advance[newIndex].boarding = parseInt(advAmt) * exc_rate;
									oData.advance[newIndex].total = parseInt(advAmt) * exc_rate;
									oData.advance[newIndex].currency_key= result.d.results[0].ZzTcurr;
									adv_amount = advAmt;
								}
							else
								{
									oData.advance[newIndex].boarding = tot_adv;
									oData.advance[newIndex].total = tot_adv;
									oData.advance[newIndex].currency_key= result.d.results[0].ZzFcurr;
									adv_amount = tot_adv;
								}

								
							TravelPlanThis.getView().getModel().setData(oData);
							
								}


						});	
						
						
					}
								
				}
				});	
				////############# UCD1KOR 21 July BUg fix for "Can not save request" ###############///////////
				if(that.errorOnSave !== true){
					backup = TravelPlanThis.copyFields(oData, backup); 
				}
			}	
			}
		

		
		//end of changes by MYU1KOR
		if (oData.currency == undefined) {
			sap.ui.project.e2etm.util.StaticUtility.setBusy(true, oDeputationThis);
			var sCurrency = sServiceUrl + "GetF4Help?Srch_help='F4_TCURC_ISOCD'&ZZ_SMODID='" + TravelPlanThis.getView().getModel().getData().ZZ_SMODID + "'&$format=json";
			// var sSMODID = oData.ZZ_FMCNTRY == oData.ZZ_LAND1 ? "DOME":"INTL";
			// var sAdvance = sServiceUrl + "GetAdvance?" +
			// "ZZ_FRMCNTY='" + oData.ZZ_FMCNTRY +
			// "'&ZZ_TOCNTY='" + oData.ZZ_LAND1 +
			// "'&ZZ_MODID='" + oData.ZZ_MODID +
			// "'&ZZ_SMODID='" + sSMODID +
			// "'&ZZ_STDATE='" + oData.ZZ_DATV1 +
			// "'&ZZ_ENDATE='" + oData.ZZ_DATB1 +
			// "'&ZZ_LEVEL='" +
			// sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_LEVEL
			// +
			// "'&$format=json";
			$.when($.ajax({
				cache : false,
				url : sCurrency
			})).done(function(sCurrency) {
				// Dropdown list currency
				oData.currency = sCurrency.d.results;
				// Advance
				// try{
				// oData.advance[0].currency_key =
				// sAdvance[0].d.results[0].ZZ_CUR1;
				// oData.advance[0].boarding =
				// sAdvance[0].d.results[0].ZZ_BODVL1;
				// oData.advance[0].lodging =
				// sAdvance[0].d.results[0].ZZ_LODVL1;
				// oData.advance[0].surface =
				// sAdvance[0].d.results[0].ZZ_SRTVL1;
				// oData.advance[0].others = sAdvance[0].d.results[0].ZZ_OTHVL1;
				// oData.advance[0].total =
				// parseFloat(oData.advance[0].boarding) +
				// parseFloat(oData.advance[0].lodging) +
				// parseFloat(oData.advance[0].surface) +
				// parseFloat(oData.advance[0].others)
				// }catch(ex){}
				// TravelPlanThis.getCurrencyText(oData);
				TravelPlanThis.getView().getModel().setData(oData);
				sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oDeputationThis);
			});
		}
	},
	getCurrencyText : function(oData) {
		for ( var i = 0; i < oData.advance.length; i++) {
			for ( var j = 0; j < oData.currency.length && oData.advance[i].currency_key != ""; j++) {
				if (oData.advance[i].currency_key == oData.currency[j].FIELD1) {
					oData.advance[i].currency_text = oData.currency[j].FIELD2;
					break;
				}
			}
		}
	},
	// Check any data is changed
	isChange : function() {
		var oData = TravelPlanThis.getView().getModel().getData();
		if (oData.ZZ_DATV1 != backup.ZZ_DATV1 || oData.ZZ_UHRB1 != backup.ZZ_UHRB1 || oData.ZZ_DATB1 != backup.ZZ_DATB1 || oData.ZZ_UHRV1 != backup.ZZ_UHRV1 || oData.ZZ_ZINSUR != backup.ZZ_ZINSUR || oData.ZZ_LOCATION_END != backup.ZZ_LOCATION_END || oDatZZ_FMLOC != backup.oDatZZ_FMLOC || oData.ZZ_KUNDE != backup.ZZ_KUNDE || oData.ZZ_CUST_NAME != backup.ZZ_CUST_NAME) { // Check
																																																																																													// general
			return true;
		} else { // Check cost assignment
			if (oData.TRV_HDRtoTRV_COST_ASGN != undefined && oData.TRV_HDRtoTRV_COST_ASGN != undefined && oData.TRV_HDRtoTRV_COST_ASGN.results.length != backup.TRV_HDRtoTRV_COST_ASGN.results.length) { // Check
																																																			// table
																																																			// length
																																																			// of
																																																			// cost
																																																			// assignment
				return true;
			} else { // Check table content of cost assignment
				for ( var i = 0; i < oData.TRV_HDRtoTRV_COST_ASGN.results.length && oData.TRV_HDRtoTRV_COST_ASGN != undefined; i++) {
					if (oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_PERCENT != backup.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_PERCENT || oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_GEBER != backup.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_GEBER || oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_FISTL != backup.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_FISTL || oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_FIPOS != backup.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_FIPOS || oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_KOSTL != backup.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_KOSTL || oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_FIPEX != backup.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_FIPEX) {
						return true;
					}
				}
				if (oData.TRV_HDRtoTRV_travel_Data != undefined && oData.TRV_HDRtoTRV_travel_Data != undefined && oData.TRV_HDRtoTRV_travel_Data.results.length != backup.TRV_HDRtoTRV_travel_Data.results.length) { // Check
																																																						// table
																																																						// length
																																																						// of
																																																						// travel
																																																						// detail
					return true;
				} else { // Check table content of travel detail
					for ( var i = 0; i < oData.TRV_HDRtoTRV_travel_Data.results.length && oData.TRV_HDRtoTRV_travel_Data != undefined; i++) {
						if (oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ZSLFDPD != backup.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ZSLFDPD || oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ZFRPLACE != backup.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ZFRPLACE || oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ZTOPLACE != backup.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ZTOPLACE || oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA != backup.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA || oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGUR != backup.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGUR || oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ENDDA != backup.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ENDDA || oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ENDUZ != backup.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ENDUZ || oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ZMODE != backup.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ZMODE) {
							return true;
						}
					}
					if (oData.TRV_HDRtoTRV_ACCOM != undefined && oData.TRV_HDRtoTRV_ACCOM != undefined && oData.TRV_HDRtoTRV_ACCOM.results.length != backup.TRV_HDRtoTRV_ACCOM.results.length) { // Check
																																																	// table
																																																	// length
																																																	// of
																																																	// travel
																																																	// detail
						return true;
					} else { // Check table content of travel detail
						for ( var i = 0; i < oData.TRV_HDRtoTRV_ACCOM.results.length; i++) {
							if (oData.TRV_HDRtoTRV_ACCOM.results[i].ZZ_ZPLACE != backup.TRV_HDRtoTRV_ACCOM.results[i].ZZ_ZPLACE || oData.TRV_HDRtoTRV_ACCOM.results[i].ZZ_BEGDA != backup.TRV_HDRtoTRV_ACCOM.results[i].ZZ_BEGDA || oData.TRV_HDRtoTRV_ACCOM.results[i].ZZ_ENDDA != backup.TRV_HDRtoTRV_ACCOM.results[i].ZZ_ENDDA || oData.TRV_HDRtoTRV_ACCOM.results[i].ZZ_CONTACT != backup.TRV_HDRtoTRV_ACCOM.results[i].ZZ_CONTACT) {
								return true;
							}
						}
						if (oData.advance.length != backup.advance.length) { // Check
																				// table
																				// length
																				// of
																				// travel
																				// detail
							return true;
						} else { // Check table content of travel detail
							for ( var i = 0; i < oData.advance.length; i++) {
								if (oData.advance[i].currency_key != backup.advance[i].currency_key || oData.advance[i].boarding != backup.advance[i].boarding || oData.advance[i].lodging != backup.advance[i].lodging || oData.advance[i].surface != backup.advance[i].surface || oData.advance[i].surface != backup.advance[i].others) {
									return true;
								}
							}
						}
					}
				}
			}
		}
		return false;
	},
	// Check Date
	checkDate : function(oData) {
		if (oData.ZZ_DATV1 == null || oData.ZZ_DATV1 == "") {
			oData.view.ZZ_DATV1_ERROR = 'Error';
			return "Please check Start Date";
		} else {
			oData.view.ZZ_DATV1_ERROR = 'None';
		}
		if (oData.ZZ_DATB1 == null || oData.ZZ_DATB1 == "") {
			oData.view.ZZ_DATB1_ERROR = 'Error';
			return "Please check End Date";
		} else {
			oData.view.ZZ_DATB1_ERROR = 'None';
		}
		if (parseInt(oData.ZZ_DATV1) > parseInt(oData.ZZ_DATB1)) {
			oData.view.ZZ_DATV1_ERROR = 'Error';
			oData.view.ZZ_DATB1_ERROR = 'Error';
			return "End Date must be greater than or equal to Start Date";
		} else {
			oData.view.ZZ_DATB1_ERROR = 'None';
			oData.view.ZZ_DATV1_ERROR = 'None';
		}
		if (oData.ZZ_DATV1 == oData.ZZ_DATB1 && oData.ZZ_UHRB1 >= oData.ZZ_UHRV1 && oData.ZZ_UHRB1 != "" && oData.ZZ_UHRV1 != "") {
			oData.view.ZZ_UHRB1_ERROR = 'Error';
			oData.view.ZZ_UHRV1_ERROR = 'Error';
			return "End Time must be greater than Start Time";
		} else {
			oData.view.ZZ_UHRB1_ERROR = 'None';
			oData.view.ZZ_UHRV1_ERROR = 'None';
		}
		if (oData.ZZ_TRV_TYP == "SECO") { // Check primary request start and
											// end date
			if (parseInt(oData.ZZ_DATV1) < parseInt(sap.ui.getCore().getModel("global").getData().ZZ_DEP_STDATE)) {
				oData.view.ZZ_DATV1_ERROR = 'Error';
				return "Start date must be greater than or equal to " + sap.ui.project.e2etm.util.Formatter.sapDate(sap.ui.getCore().getModel("global").getData().ZZ_DEP_STDATE) + " (Primary Request)";
			} else {
				oData.view.ZZ_DATV1_ERROR = 'None';
			}
			if (parseInt(oData.ZZ_DATB1) > parseInt(sap.ui.getCore().getModel("global").getData().ZZ_DEP_ENDATE)) {
				oData.view.ZZ_DATB1_ERROR = 'Error';
				return "End date must be less than or equal to " + sap.ui.project.e2etm.util.Formatter.sapDate(sap.ui.getCore().getModel("global").getData().ZZ_DEP_ENDATE) + " (Primary Request)";
			} else {
				oData.view.ZZ_DATB1_ERROR = 'None';
			}
		} else if (oData.ZZ_TRV_TYP == "DEPU") { // Check VISA & COC start
													// and end date
			// COC
			try {
				var iIndex = sap.ui.project.e2etm.util.StaticUtility.getArrayIndex(oData.view.coc, "FIELD1", oData.ZZ_LAND1);
				if (iIndex != -1) { // COC Countries
					if (oDeputationThis.getView().getModel().getData().screenData.ZZ_COC_STDATE == "") {
						return "COC has not been uploaded, please contact Deputation Team";
					} else {
						if (parseInt(oData.ZZ_DATV1) < parseInt(oDeputationThis.getView().getModel().getData().screenData.ZZ_COC_STDATE)) {
							oData.view.ZZ_DATV1_ERROR = 'Error';
							return "Start date must be greater than or equal to " + sap.ui.project.e2etm.util.Formatter.sapDate(oDeputationThis.getView().getModel().getData().screenData.ZZ_COC_STDATE) + " (COC Date)";
						} else {
							oData.view.ZZ_DATV1_ERROR = 'None';
						}
						if (parseInt(oData.ZZ_DATB1) > parseInt(oDeputationThis.getView().getModel().getData().screenData.ZZ_COC_EDATE)) {
							oData.view.ZZ_DATB1_ERROR = 'Error';
							return "End date must be less than or equal to " + sap.ui.project.e2etm.util.Formatter.sapDate(oDeputationThis.getView().getModel().getData().screenData.ZZ_COC_EDATE) + " (COC Date)";
						} else {
							oData.view.ZZ_DATB1_ERROR = 'None';
						}
					}
				}
			} catch (ex) {
			}
			// VISA
			if (oData.ZZ_SMODID == "INTL") {
				if (parseInt(oData.ZZ_DATV1) > parseInt(oDeputationThis.getView().getModel().getData().selfVisa.ZZ_VISA_EDATE)) {
					oData.view.ZZ_DATV1_ERROR = 'Error';
					return "Start date must be less than " + sap.ui.project.e2etm.util.Formatter.sapDate(oDeputationThis.getView().getModel().getData().selfVisa.ZZ_VISA_EDATE) + " (Visa Valid To)";
				} else {
					oData.view.ZZ_DATV1_ERROR = 'None';
				}
			}
		}
		var sErrorOverlapping = "";
		if (TravelPlanThis.getView().getModel().getData().ZZ_TRV_TYP == "BUSR" || TravelPlanThis.getView().getModel().getData().ZZ_TRV_TYP == "INFO") { // BUSR
			sErrorOverlapping = sap.ui.project.e2etm.util.StaticUtility.checkDateOverlapping(TravelPlanThis.getView().getModel().getData().ZZ_DATV1, TravelPlanThis.getView().getModel().getData().ZZ_DATB1, TravelPlanThis.getView().getModel().getData().ZZ_REINR, TravelPlanThis.getView().getModel().getData().ZZ_TRV_TYP, null, TravelPlanThis.getView().getModel().getData().ZZ_REINR);
		} else if (TravelPlanThis.getView().getModel().getData().ZZ_TRV_TYP == "SECO") {
			sPriRequest = oDeputationThis.getView().getModel().getData().screenData.ZZ_TRV_REQ;
			sErrorOverlapping = sap.ui.project.e2etm.util.StaticUtility.checkDateOverlapping(TravelPlanThis.getView().getModel().getData().ZZ_DATV1, TravelPlanThis.getView().getModel().getData().ZZ_DATB1, TravelPlanThis.getView().getModel().getData().ZZ_REINR, TravelPlanThis.getView().getModel().getData().ZZ_TRV_TYP, null, sPriRequest);
		} else if (TravelPlanThis.getView().getModel().getData().ZZ_TRV_TYP == "DEPU") { // DEPU
			sErrorOverlapping = sap.ui.project.e2etm.util.StaticUtility.checkDateOverlapping(TravelPlanThis.getView().getModel().getData().ZZ_DATV1, TravelPlanThis.getView().getModel().getData().ZZ_DATB1, oDeputationThis.getView().getModel().getData().screenData.ZZ_TRV_REQ, TravelPlanThis.getView().getModel().getData().ZZ_TRV_TYP, null, oDeputationThis.getView().getModel().getData().screenData.ZZ_TRV_REQ);
		}
		if (sErrorOverlapping == "") {
			oData.view.ZZ_DATB1_ERROR = 'None';
			oData.view.ZZ_DATV1_ERROR = 'None';
		} else {
			oData.view.ZZ_DATV1_ERROR = 'Error';
			oData.view.ZZ_DATB1_ERROR = 'Error';
			return sErrorOverlapping;
		}
		if (oData.ZZ_TRV_TYP != 'HOME' && oData.ZZ_TRV_TYP != 'EMER') {
			////############### UCD1KOR 21 July 2021 DOME TRFR Changes ###############////
			if(sap.ui.getCore().getModel("global").getData().TrfrFlag === "X"){
				var sError = "";
			}else{
				 sError = sap.ui.project.e2etm.util.StaticUtility.checTravelCategoryDuration(TravelPlanThis.getView().getModel().getData().ZZ_TRV_TYP, TravelPlanThis.getView().getModel().getData().ZZ_ZDURN, TravelPlanThis.getView().getModel().getData().ZZ_SMODID, TravelPlanThis.getView().getModel().getData().ZZ_LAND1);
			}
			if (sError == "") {
				oData.view.ZZ_DATB1_ERROR = 'None';
				oData.view.ZZ_DATV1_ERROR = 'None';
			} else {
				oData.view.ZZ_DATV1_ERROR = 'Error';
				oData.view.ZZ_DATB1_ERROR = 'Error';
				return sError;
			}
		}
		////////############ UCD1KOR 14 July 2021 added TrfrFlag below ################////////
		if(sap.ui.getCore().getModel("global").getData().TrfrFlag !=="X" && oDeputationThis.getView().getModel().getData().screenData.ZZ_TRV_CAT=='TRFR'){
	//		if(oDeputationThis.getView().getModel().getData().screenData.ZZ_DEP_TOCNTRY != "AT"){
			if(oDeputationThis.getView().getModel().getData().screenData.ZZ_REQ_TYP == 'SECO') //uml6kor 18/2/2020 skipping error block for seco trfr trvl
			{//no error msg
		    }else
			{
			var sDate = new Date(oData.ZZ_DATV1.substr(0, 4), 
					             oData.ZZ_DATV1.substr(4, 2) - 1, 
					             oData.ZZ_DATV1.substr(6, 2));
			var eDate = new Date(oData.ZZ_DATB1.substr(0, 4), 
		                         oData.ZZ_DATB1.substr(4, 2) - 1, 
		                         oData.ZZ_DATB1.substr(6, 2));
			///////################### UCD1KOR 14 July 2021 BUSR Copy ####################//////
			if(sap.ui.getCore().getModel("global").getData().isCopy == false){
				if (sDate > new Date(oData.ZZ_DATV1.substr(0, 4),
						oData.ZZ_DATV1.substr(4, 2) - 1, 1)) {
					oData.view.ZZ_DATV1_ERROR = 'Error';
					err = "For transfer request, start date must always be Start Day of the Month";				
					return err;
				}else{
					oData.view.ZZ_DATV1_ERROR = 'None';
				}
				
				if (eDate.toString() != new Date(oData.ZZ_DATB1.substr(0, 4), 
						 oData.ZZ_DATB1.substr(4, 2), 0).toString()) {
					oData.view.ZZ_DATB1_ERROR = 'Error';
					err = "For transfer request, end date must always be end day of the month";
					
					return err;
				}else{
					oData.view.ZZ_DATB1_ERROR = 'None';
				}
			}
			
//		}
		//else{
			
		//	oData.view.ZZ_DATV1_ERROR = 'None';
		//	oData.view.ZZ_DATB1_ERROR = 'None';
	//	}
	}
		}
		return "";
	},
	// Check required fields for general tab
	checkGeneral : function(oData) {
		if (oData.ZZ_FMLOC == null || oData.ZZ_FMLOC == "") {
			oData.view.ZZ_FMLOC_ERROR = 'Error';
			return TravelPlanThis.getView().getModel("i18n").getProperty("enter_required_field");
		} else {
			oData.view.ZZ_FMLOC_ERROR = 'None';
		}
		if (oData.ZZ_LOCATION_END == null || oData.ZZ_LOCATION_END == "") {
			oData.view.ZZ_LOCATION_END_ERROR = 'Error';
			return TravelPlanThis.getView().getModel("i18n").getProperty("enter_required_field");
		} else {
			oData.view.ZZ_LOCATION_END_ERROR = 'None';
		}
		if ((oData.ZZ_MODID == 'BUSR' || oData.ZZ_MODID == 'SECO' || oData.ZZ_MODID == 'INFO') && oData.ZZ_FMCNTRY == oData.ZZ_LAND1 && oData.ZZ_LOCATION_END == oData.ZZ_FMLOC) {
			oData.view.ZZ_FMLOC_ERROR = 'Error';
			oData.view.ZZ_LOCATION_END_ERROR = 'Error';
			return "From and To location must be different";
		} else {
			oData.view.ZZ_FMLOC_ERROR = 'None';
			oData.view.ZZ_LOCATION_END_ERROR = 'None';
		}
		if (oData.ZZ_KUNDE == null || oData.ZZ_KUNDE == "") {
			oData.view.ZZ_KUNDE_ERROR = 'Error';
			return TravelPlanThis.getView().getModel("i18n").getProperty("enter_required_field");
		} else {
			oData.view.ZZ_KUNDE_ERROR = 'None';
		}
		//####### 13 Apr 2020 UCD1KOR added below condition for Travel to dropdown ########//
		if (oData.ZZ_CATID == null || oData.ZZ_CATID == "") {
			oData.view.ZZ_CATID_ERROR = 'Error';
			return "Please Select Travel To";
		} else {
			oData.view.ZZ_KUNDE_ERROR = 'None';
		}
		// if( oData.ZZ_MOBILE == null || oData.ZZ_MOBILE == "" ){
		// oData.view.ZZ_MOBILE_ERROR = 'Error';
		// return
		// TravelPlanThis.getView().getModel("i18n").getProperty("enter_required_field");
		// }else{
		// if(
		// !sap.ui.project.e2etm.util.StaticUtility.checkPhoneNo(oData.ZZ_MOBILE)
		// ){
		// oData.view.ZZ_MOBILE_ERROR = 'Error';
		// return "Invalid phone number";
		// }else{
		// oData.view.ZZ_MOBILE_ERROR = 'None';
		// }
		// }
		if (oData.ZZ_MOBILE != null && oData.ZZ_MOBILE != "" && !sap.ui.project.e2etm.util.StaticUtility.checkPhoneNo(oData.ZZ_MOBILE)) {
			oData.view.ZZ_MOBILE_ERROR = 'Error';
			return "Please enter number in following format +91987654321 or 0987654321";
		} else {
			oData.view.ZZ_MOBILE_ERROR = 'None';
		}
		
		
	//	if (oData.ZZ_CUST_NAME == null || oData.ZZ_CUST_NAME == "") {
	//		oData.view.ZZ_CUST_NAME_ERROR = 'Error';
	//		return TravelPlanThis.getView().getModel("i18n").getProperty("enter_required_field");
	//	} else {
	//		oData.view.ZZ_CUST_NAME_ERROR = 'None';
	//	}
		/*if (oData.ZZ_CUST_NAME == null || oData.ZZ_CUST_NAME == "") {
			oData.view.ZZ_CUST_NAME_ERROR = 'Error';
			return TravelPlanThis.getView().getModel("i18n").getProperty("enter_required_field");
		} else {
			oData.view.ZZ_CUST_NAME_ERROR = 'None';
		}*/
		
		if(oData.ZZ_TRV_TYP == "BUSR" && oData.ZZ_SMODID == "INTL" && parseInt(oData.ZZ_ZDURN)<= 31 ){
			if(oData.ZZ_SIM_REQ_KEY=="" || oData.ZZ_SIM_REQ_KEY=="P" ){
				oData.view.ZZ_SIM_REQ_KEY_ERROR = 'Error';
				return "Please select the the option SIM card Required or not";
				}else {
					
					oData.view.ZZ_SIM_REQ__KEY_ERROR = 'None';
				}
			
		if(oData.ZZ_SIM_REQ_KEY=="Y" && (oData.ZZ_SIM_TYP_KEY=="" || oData.ZZ_SIM_TYP_KEY=="P" ) ){
			
			return "Please select the the option SIM card Type ";
			
		}else if(oData.ZZ_SIM_REQ_KEY=="Y" && (oData.ZZ_SIM_DATA_KEY=="" || oData.ZZ_SIM_DATA_KEY=="P")){
			
			return "Please select the the option SIM card Data";
		}			
		
		}
			
		
		return "";
	},
	checkCostAssignment : function(oData) {
		var iPercent = 0;
		if (oData.TRV_HDRtoTRV_COST_ASGN.results.length == 0) {
			return "Please enter cost assigment";
		}
		for ( var i = 0; i < oData.TRV_HDRtoTRV_COST_ASGN.results.length && oData.TRV_HDRtoTRV_ACCOM != undefined; i++) {
			if (oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_PERCENT == null || oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_PERCENT == "" || oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_PERCENT == "0") {
				oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_PERCENT_ERROR = 'Error';
				return TravelPlanThis.getView().getModel("i18n").getProperty("enter_required_field");
			} else {
				oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_PERCENT_ERROR = 'None';
			}
			iPercent += parseFloat(oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_PERCENT);
			if (isNaN(iPercent)) {
				oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_PERCENT_ERROR = 'Error';
				return TravelPlanThis.getView().getModel("i18n").getProperty("Invalid Number");
			} else {
				oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_PERCENT_ERROR = 'None';
			}
			if (oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_GEBER == null || oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_GEBER == "") {
				oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_GEBER_ERROR = 'Error';
				return TravelPlanThis.getView().getModel("i18n").getProperty("enter_required_field");
			} else {
				oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_GEBER_ERROR = 'None';
			}
			if (oData.ZZ_TRV_TYP == "SECO" && oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_GEBER != "F03") {
				oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_GEBER_ERROR = 'Error';
				return "Please enter F03 for Secondary request";
			} else {
				oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_GEBER_ERROR = 'None';
			}
			if (oData.fund && !sap.ui.project.e2etm.util.StaticUtility.checkExistingArray(oData.fund, "fincode", oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_GEBER)) {
				oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_GEBER_ERROR = 'Error';
				///############## UCD1KOR 27 July 2021 PBC Changes ##################////
				if(oData.ZZ_CATID =="GLOB" &&sap.ui.getCore().getModel('global').getData().ZZ_COMABBR !== "RBEI-PE" && sap.ui.getCore().getModel('global').getData().ZZ_TRV_CAT =="TRFR" && oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_GEBER =="F03"){
					oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_GEBER_ERROR = '';
				}
				else{
					return TravelPlanThis.getView().getModel("i18n").getProperty("Invalid Fund");
				}
			} else {
				oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_GEBER_ERROR = 'None';
			}
			if (oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_FISTL == null || oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_FISTL == "") {
				oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_FISTL_ERROR = 'Error';
				return TravelPlanThis.getView().getModel("i18n").getProperty("enter_required_field");
			} else {
				oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_FISTL_ERROR = 'None';
			}
			// if( oData.budgetCenter &&
			// !sap.ui.project.e2etm.util.StaticUtility.checkExistingArray(oData.budgetCenter,
			// "fictr", oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_FISTL) ){
			// oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_FISTL_ERROR = 'Error';
			// return
			// TravelPlanThis.getView().getModel("i18n").getProperty("Invalid
			// Budget Center");
			// }else{
			// oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_FISTL_ERROR = 'None';
			// } //NHI1HC
			// TGG1HC
			if (oData.budgetCenter && !sap.ui.project.e2etm.util.StaticUtility.checkExistingArray(oData.budgetCenter, "ZzFundC", oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_FISTL)) {
				oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_FISTL_ERROR = 'Error';
				return TravelPlanThis.getView().getModel("i18n").getProperty("Invalid Budget Center");
			} else {
				oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_FISTL_ERROR = 'None';
			}
			//////############## UCD1KOR 21 July 2021 Budget code Validation ############//////// 
			if(sap.ui.getCore().getModel("global").getData().isCopy){
				if (!sap.ui.project.e2etm.util.StaticUtility.checkExistingArray(TravelPlanThis.getView().getModel().getData().budgetCost, "FIPEX", oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_FIPEX)) {
					oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_FIPEX_ERROR = 'Error';
					sap.m.MessageToast.show("Invalid Budget Code");
				} else {
					oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_FIPEX_ERROR = 'None';
				}
			}
			
			if (oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_FIPEX_ERROR == 'Error') {
				return TravelPlanThis.getView().getModel("i18n").getProperty("Invalid Budget Code");
			}
			if (oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_FIPEX == null || oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_FIPEX == "") {
				oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_FIPEX_ERROR = 'Error';
				return TravelPlanThis.getView().getModel("i18n").getProperty("enter_required_field");
			} else {
				oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_FIPEX_ERROR = 'None';
			}
			if (oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_FIPOS == undefined) {
				oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_FIPOS = "";
			}
			if (oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_KOSTL == undefined) {
				oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_KOSTL = "";
			}
			if (oData.wbsElement && !sap.ui.project.e2etm.util.StaticUtility.checkExistingArray(oData.wbsElement, "ZZ_POSKI", oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_FIPOS) && oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_FIPOS != "") {
				oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_FIPOS_ERROR = 'Error';
				return TravelPlanThis.getView().getModel("i18n").getProperty("Invalid WBS Element");
			} else {
				oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_FIPOS_ERROR = 'None';
			}
			if (oData.costCenter && !sap.ui.project.e2etm.util.StaticUtility.checkExistingArray(oData.costCenter, "KOSTL", oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_KOSTL) && oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_KOSTL != "") {
				oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_KOSTL_ERROR = 'Error';
				return TravelPlanThis.getView().getModel("i18n").getProperty("Invalid Cost Center");
			} else {
				oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_KOSTL_ERROR = 'None';
			}
			if (oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_KOSTL == "" && oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_GEBER == "F01") {
				oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_KOSTL_ERROR = 'Error';
				return TravelPlanThis.getView().getModel("i18n").getProperty("Cost center is required for F01 Fund");
			} else {
				oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_KOSTL_ERROR = 'None';
			}
			// fund validation sidd code start
			if (oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_GEBER == "F02") {
				if (oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_FIPOS == "") {
					oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_FIPOS_ERROR = "Error";
					return "Please enter WBS Element for F02 Fund";
				} else {
					oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_FIPOS_ERROR = "None";
				}
				// TGG1HC check for displaying and validating for VKM
				// if(Number(oData.ZZ_REINR) < Number(oData.VKM_TR)){
				if (Number(oData.ZZ_REINR) < Number(sap.ui.getCore().getModel("global").getProperty("/VKM_TR")) && sap.ui.getCore().getModel("global").getProperty("/VKM_TR") != 0) {
					if (oData.ZZ_VKM == null || oData.ZZ_VKM == "") {
						TravelPlanThis.getView().byId("flexBoxFundF02").setVisible(true);
						oData.ZZ_VKM_ERROR = 'Error';
						return TravelPlanThis.getView().getModel("i18n").getProperty("Please Enter VKM Details");
					} else if (oData.vkm && !sap.ui.project.e2etm.util.StaticUtility.checkExistingArray(oData.vkm, "VKMCode", oData.ZZ_VKM)) {
						TravelPlanThis.getView().byId("flexBoxFundF02").setVisible(true);
						oData.ZZ_VKM_ERROR = 'Error';
						return TravelPlanThis.getView().getModel("i18n").getProperty("Invalid VKM");
					} else {
						oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_VKM_ERROR = 'None';
						oData.ZZ_VKM_ERROR = 'None';
						oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_VKM = oData.ZZ_VKM;
					}
				}
			}
			// UCD1KOR WBS mandatory for F08 Fund 17 Jun 2020
			if (oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_GEBER == "F08") {
				if (oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_FIPOS == "") {
					oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_FIPOS_ERROR = "Error";
					return "Please enter WBS Element for F08 Fund";
				} else {
					oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_FIPOS_ERROR = "None";
				}
			}
			
			//############ UCD1KOR Cost Center for F09 Fund 30 Mar 2021 ####################//
			if (oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_GEBER == "F09") {
				if (oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_KOSTL == "") {
					oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_KOSTL_ERROR = "Error";
					return "Please enter Cost Center for F09 Fund";
				} else {
					oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_KOSTL_ERROR = "None";
				}
			}
			
			if (oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_GEBER == "F03") {
				if (oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_FIPOS == "") {
					oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_FIPOS_ERROR = "Error";
					return "Please enter WBS Element for F03 Fund";
				} else {
					oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_FIPOS_ERROR = "None";
				}
				if(oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_MCR == ""  ){ //dye5kor_MCR_NON_MCR
				if (oData.ZZ_CCDEPT == undefined || oData.ZZ_CCDEPT == "") {
					TravelPlanThis.getView().byId("flexBoxFundF03").setVisible(true);
//					TravelPlanThis.getView().byId("flexCtgMcr").setVisible(true);
					oData.ZZ_CCDEPT_ERROR = 'Error';
					return TravelPlanThis.getView().getModel("i18n").getProperty("Please enter Customer Coordinator Department");
				} else {
					oData.ZZ_CCDEPT_ERROR = 'None';
				}
				/* Start-CTG F03 Changes */
				if (oData.ZZ_CCNAME == undefined || oData.ZZ_CCNAME == "") {
					TravelPlanThis.getView().byId("flexBoxFundF03").setVisible(true);
					oData.ZZ_CCNAME_ERROR = 'Error';
					return "Please enter Customer Coordinator Name";
				} else {
					oData.ZZ_CCNAME_ERROR = 'None';
				}
				if (oData.ZZ_CUST_NAME == undefined || oData.ZZ_CUST_NAME == "") {
					TravelPlanThis.getView().byId("flexBoxFundF03").setVisible(true);
				//	oData.ZZ_CCNAME_ERROR = 'Error';
					return "Please enter Customer Company Name";
				} 
//				//Added for swift_upgrade_uea6kor_28.11.2019
//				if (oData.ZZ_PONO == undefined || oData.ZZ_PONO == "") {
//					TravelPlanThis.getView().byId("flexBoxFundF03").setVisible(true);
//					oData.ZZ_PO_ERROR = 'Error';
//					return "Please enter PO Number";
//				} else {
//					oData.ZZ_PO_ERROR = 'None';
//				}
//				//Added for swift_upgrade_uea6kor_28.11.2019
				
				
				}
				/* End-CTG F03 Changes */
				TravelPlanThis.getView().getModel().getData().TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_CCNAME = oData.ZZ_CCNAME;
				TravelPlanThis.getView().getModel().getData().TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_CCDEPT = oData.ZZ_CCDEPT;
				TravelPlanThis.getView().getModel().getData().TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_EANO = oData.ZZ_EANO;
				TravelPlanThis.getView().getModel().getData().TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_CCOST = oData.ZZ_CCOST;
				TravelPlanThis.getView().getModel().getData().TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_PONO = oData.ZZ_PONO;
				TravelPlanThis.getView().getModel().getData().TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_CLENTY = oData.ZZ_CLENTY;
				//dye5kor_for_MCR_NON_MCR
				if(oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_MCR == "X"  ){
				TravelPlanThis.getView().getModel().getData().TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_TASKID = oData.ZZ_TASKID;
				TravelPlanThis.getView().getModel().getData().TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_RESOURCEID = oData.ZZ_RESOURCEID;
				TravelPlanThis.getView().getModel().getData().TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_RESOURCETYP = oData.ZZ_RESOURCETYP;
				TravelPlanThis.getView().getModel().getData().TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_TASKDESC = oData.taskDesc;
				TravelPlanThis.getView().getModel().getData().TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_RESOUCESDESC = oData.ResoucesDesc;
				//dye5kor_for_MCR_NON_MCR
					}
				}
			/* Start CI Reporting Changes */
			if(oData.ZZ_MODID == "DEPU"&&oData.ZZ_SMODID=="INTL"){
			var errorMsg = this.checkF01F02F04CIDetails(i, oData);
			if(errorMsg!="")
				return errorMsg;
			}
			/* End CI Reporting Changes */
			// TGG1HC
			if (oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_GEBER == "F04") {
				// Check WBS element
/*Start- No validation if TP < Tp specified in Swift Constants table*/				
				if((oData.ZZ_REINR == "0000000000") || 
				   (Number(oData.ZZ_REINR) >= Number(sap.ui.getCore().getModel("global").getProperty("/VKM_TR")) && Number(sap.ui.getCore().getModel("global").getProperty("/VKM_TR")) != 0)
						){
/*End-No validation if TP < Tp specified in Swift Constants table*/								
					if (oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_FIPOS == "") {
						oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_FIPOS_ERROR = "Error";
						return "Please enter WBS Element for F04 Fund";
					} else {
						oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_FIPOS_ERROR = "None";
					}	
			    /*Start-No validation if TP < Tp specified in Swift Constants table*/					
                 }
				/*End-No validation if TP < Tp specified in Swift Constants table*/
				
			}
			if ((oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_FIPOS == "" && oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_KOSTL == "") || (oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_FIPOS != "" && oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_KOSTL != "")) {
				oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_FIPOS_ERROR = 'Error';
				oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_KOSTL_ERROR = 'Error';
				return "Please enter either WBS Element or Cost Center";
			} else {
				oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_FIPOS_ERROR = 'None';
				oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_KOSTL_ERROR = 'None';
			}
		}
		// sidd code ends
		if (iPercent != 100) {
			oData.TRV_HDRtoTRV_COST_ASGN.results[0].ZZ_PERCENT_ERROR = 'Error';
			return "Total percent must be 100";
		} else {
			oData.TRV_HDRtoTRV_COST_ASGN.results[0].ZZ_PERCENT_ERROR = 'None';
		}
		return "";
	},
	checkTravelDetail : function(oData) {
		if (oData.TRV_HDRtoTRV_travel_Data.results.length == 0) {
			return "Please enter travel details";
		}
		var trvl_SLFDPD00_count = 0;
		for ( var i = 0; i < oData.TRV_HDRtoTRV_travel_Data.results.length && oData.TRV_HDRtoTRV_travel_Data != undefined; i++) {
			
			//############### UCD1KOR 13 July 2021 Changes DOME-TRFR ################//////
			
			if (oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_TRVCAT == oData.ZZ_TRV_TYP) {
				
				if(oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ZSLFDPD =='00'){
					//start of changes uml6kor 28/8/2019 ticketing: transfer case restricting to one way
					/*UCD1OR 14 Jan 2020 transfer case removed restriction*/
					trvl_SLFDPD00_count++;		
					if(trvl_SLFDPD00_count > 1 && oData.ZZ_SMODID == 'INTL' && oDeputationThis.getView().getModel().getData().screenData.ZZ_TRV_CAT == 'TRFR' && oDeputationThis.getView().getModel().getData().screenData.ZZ_ASG_TYP !="STX")
					{
						oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ZSLFDPD_ERROR = 'Error';
						var err = "For international transfers, only one way tickets are provided(i.e only one entry per traveler is allowed). Please enter the data accordingly" ;				
			            return err;
			        }
					////############### UCD1KOR 13 July 2021 Changes DOME-TRFR #############//////
					
					var DOME_TRFR = sap.ui.getCore().getModel("global").getData().TrfrFlag ; 
					if(DOME_TRFR == undefined){
						DOME_TRFR = oData.TrfrFlag;
					}
					//var NextRecord = oData.TRV_HDRtoTRV_travel_Data.results[i+1];
					for(var j=1;j<oData.TRV_HDRtoTRV_travel_Data.results.length;j++){
						if(oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ZSLFDPD == oData.TRV_HDRtoTRV_travel_Data.results[j].ZZ_ZSLFDPD && DOME_TRFR == "X"){
							oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ZSLFDPD_ERROR = 'Error';
							var err = "For domestic transfers, only one way tickets are provided(i.e only one entry per traveler is allowed). Please enter the data accordingly" ;				
				            return err;
						}
					}
					/*if(NextRecord && oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ZSLFDPD == oData.TRV_HDRtoTRV_travel_Data.results[i+1].ZZ_ZSLFDPD && DOME_TRFR == "X"){
						oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ZSLFDPD_ERROR = 'Error';
						var err = "For domestic transfers, only one way tickets are provided(i.e only one entry per traveler is allowed). Please enter the data accordingly" ;				
			            return err;
					}*/
					
					//end of changes uml6kor 28/8/2019
					
					
				}
				if (oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ZSLFDPD == null || oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ZSLFDPD == "") {
					oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ZSLFDPD_ERROR = 'Error';
					return TravelPlanThis.getView().getModel("i18n").getProperty("enter_required_field");
				} else {
					oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ZSLFDPD_ERROR = 'None';
				}
				if (oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ZFRPLACE == null || oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ZFRPLACE == "") {
					oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ZFRPLACE_ERROR = 'Error';
					return TravelPlanThis.getView().getModel("i18n").getProperty("enter_required_field");
				} else {
					oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ZFRPLACE_ERROR = 'None';
				}
				if (oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ZTOPLACE == null || oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ZTOPLACE == "") {
					oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ZTOPLACE_ERROR = 'Error';
					return TravelPlanThis.getView().getModel("i18n").getProperty("enter_required_field");
				} else {
					oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ZTOPLACE_ERROR = 'None';
				}
				if (oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA == null || oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA == "") {
					oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA_ERROR = 'Error';
					return "Please check Depart Date";
				} else {
//					if(sap.ui.getCore().getModel("global").getData().changeType=="DH" 
//					&& oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ZSLFDPD != "00")
//						{
					if(oData.ZZ_TRV_CAT !="HOME"&&oData.ZZ_TRV_CAT !="EMER"){
					if((oData.ZZ_MODID == "DEPU"&&oData.ZZ_SMODID=="INTL")||
						(oDeputationThis.getView().getModel().getData().screenData.ZZ_TRV_CAT == "TRFR"&&oData.ZZ_SMODID=="INTL")
						||(oDeputationThis.getView().getModel().getData().screenData.ZZ_TRV_CAT == "TRNG"&&oData.ZZ_SMODID == "INTL")){
					      var checkMsg = TravelPlanThis.validateDateWithVisa(oData.TRV_HDRtoTRV_travel_Data.results[i]);
					      if(checkMsg!=""){
					    	  oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA_ERROR = 'Error';
					    	  return checkMsg;
					      }else{
					    	  oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA_ERROR = 'None';
					      }
					      
						}
					else{
					oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA_ERROR = 'None';
					}
					}else{
						oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA_ERROR = 'None';
					}
				}
				if (oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ENDDA != "" && parseInt(oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA) > parseInt(oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ENDDA)) {
					oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA_ERROR = 'Error';
					oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ENDDA_ERROR = 'Error';
					return "Depart Date must be less than or equal to Arrival Date";
				} else {
					oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ENDDA_ERROR = 'None';
					oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA_ERROR = 'None';
					if (oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA == oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ENDDA && oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGUR >= oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ENDUZ && oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGUR != "" && oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ENDUZ != "") {
						oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGUR_ERROR = "Error";
						oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ENDUZ_ERROR = "Error";
						return "Depart Time must be less than Arrival Time";
					} else {
						oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGUR_ERROR = "None";
						oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ENDUZ_ERROR = "None";
					}
					if ((oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ENDDA == null || oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ENDDA == "") && oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ENDUZ != "" && oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ENDUZ != null && oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ENDUZ != "000000") {
						oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ENDDA_ERROR = "Error";
						return "Please enter Arrival Date";
					} else {
						oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ENDDA_ERROR = "None";
					}
				}
				if (oDeputationThis.getView().getModel().getData().screenData.ZZ_TRV_CAT != "TRFR") {
					if(oData.ZZ_MODID == 'BUSR' && oData.ZZ_SMODID == "INTL" && oData.PersFlag == "X"){
						if (parseInt(oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA) < parseInt(oData.minPDate) || parseInt(oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA) > parseInt(oData.maxPDate)) {
							oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA_ERROR = 'Error';
							return "Depart Date must be between Start Date and End Date";
						} else {
                        oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA_ERROR = 'None';
						}
					}else{
						if (parseInt(oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA) < parseInt(oData.ZZ_DATV1) || parseInt(oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA) > parseInt(oData.ZZ_DATB1)) {
							oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA_ERROR = 'Error';
							return "Depart Date must be between Start Date and End Date";
						} else {
							oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA_ERROR = 'None';
							// if( oData.ZZ_DATV1 ==
							// oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA &&
							// oData.ZZ_UHRB1 >
							// oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGUR){
							// oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGUR_ERROR
							// = "Error";
							// return "Depart Time must be greater than or equal to
							// Start Time";
							// }else{
							// oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGUR_ERROR
							// = "None";
							// }
						}		
					}
					
				} else {
					if (parseInt(oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA) < parseInt(oData.ZZ_DATV1) || parseInt(oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA) > parseInt(oData.ZZ_DATB1)) {
						oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA_ERROR = 'Error';
						return "Depart Date must be between Start Date and End Date";
					} else {
						oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA_ERROR = 'None';
						// if( oData.ZZ_DATV1 ==
						// oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA &&
						// oData.ZZ_UHRB1 >
						// oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGUR){
						// oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGUR_ERROR
						// = "Error";
						// return "Depart Time must be greater than or equal to
						// Start Time";
						// }else{
						// oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGUR_ERROR
						// = "None";
						// }
					}
//					var tripStartDate = new Date(oData.ZZ_DATV1.substr(0, 4), oData.ZZ_DATV1.substr(4, 2) - 1, oData.ZZ_DATV1.substr(6, 2));
//					tripStartDate.setDate(tripStartDate.getDate() - parseInt(oData.view.trfrDaysBefore));
//					var ticketStartDate = new Date(oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA.substr(0, 4), oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA.substr(4, 2) - 1, oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA.substr(6, 2));
//					if (ticketStartDate < tripStartDate || parseInt(oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA) > parseInt(oData.ZZ_DATB1)) {
//						oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA_ERROR = 'Error';
//						return "Depart Date must be between " + oData.view.trfrDaysBefore + " days before Start Date and End Date";
//					} else {
//						oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA_ERROR = 'None';
						// if( oData.ZZ_DATV1 ==
						// oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA &&
						// oData.ZZ_UHRB1 >
						// oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGUR){
						// oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGUR_ERROR
						// = "Error";
						// return "Depart Time must be greater than or equal to
						// Start Time";
						// }else{
						// oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGUR_ERROR
						// = "None";
						// }
//					}
				}
				//////////// ############## UCD1KOR 12 Feb 2020 arrival date +3 added ###################//////////
				if (oDeputationThis.getView().getModel().getData().screenData.ZZ_TRV_CAT != "TRFR") {
					
					var tripEndDate = oData.ZZ_DATB1;
					var tripEndDateValue = new Date(parseInt(tripEndDate.substr(0,4)),parseInt(tripEndDate.substr(4,2))-1,parseInt(tripEndDate.substr(6,2))+3);
					
					var arrivalDate = oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ENDDA;
					try{
						var arrivalDateValue = new Date(parseInt(arrivalDate.substr(0,4)),parseInt(arrivalDate.substr(4,2))-1,parseInt(arrivalDate.substr(6,2)));
					 }catch(err){
						 
					 }
					/// replaced parseInt(oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ENDDA) > parseInt(oData.ZZ_DATB1)+3) condition with arrivalDateValue > tripEndDateValue
					
					if ((parseInt(oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ENDDA) < parseInt(oData.ZZ_DATV1) || arrivalDateValue > tripEndDateValue) && oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ENDDA != "") {
						oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ENDDA_ERROR = 'Error';
						return "Depart Date/Arrival Date must be between Start Date and End Date";
					} else {
						oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ENDDA_ERROR = 'None';
						// if( oData.ZZ_DATB1 ==
						// oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA &&
						// oData.ZZ_UHRV1 >
						// oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGUR){
						// oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGUR_ERROR
						// = "Error";
						// return "Depart Time must be greater than or equal to
						// End Time";
						// }else{
						// oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGUR_ERROR
						// = "None";
						// }
					}
				}
				if (oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ZMODE == null || oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ZMODE == "") {
					oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ZMODE_ERROR = 'Error';
					return TravelPlanThis.getView().getModel("i18n").getProperty("enter_required_field");
				} else {
					oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ZMODE_ERROR = 'None';
				}
				if (oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_TRVCAT == "HOME" || oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_TRVCAT == "EMER") {
					// Validate lines on screen
					var iCount = 0, startDate, endDate, tempDate;
					startDate = oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA;
					for ( var j = i + 1; j < oData.TRV_HDRtoTRV_travel_Data.results.length && oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_TRVCAT == oData.ZZ_TRV_TYP; j++) {
						if (oData.TRV_HDRtoTRV_travel_Data.results[j].ZZ_TRVCAT == oData.ZZ_TRV_TYP && oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ZSLFDPD == oData.TRV_HDRtoTRV_travel_Data.results[j].ZZ_ZSLFDPD) {
							iCount++;
							endDate = oData.TRV_HDRtoTRV_travel_Data.results[j].ZZ_BEGDA;
						}
					}
					if (iCount > 1) {
						return "Maximum two lines for every traveller type in " + oData.ZZ_TRV_TYP + " trip";
					}
					// Get start date and end date
					if (iCount == 1) {
						try {
							if (parseInt(startDate) > parseInt(endDate)) {
								tempDate = startDate;
								startDate = endDate;
								endDate = tempDate;
							}
							var dStart = new Date(startDate.substr(0, 4), startDate.substr(4, 2) - 1, startDate.substr(6, 2));
							var dEnd = new Date(endDate.substr(0, 4), endDate.substr(4, 2) - 1, endDate.substr(6, 2));
							var dDur = new Date(dEnd - dStart);
							var iDur = (dDur.getTime() / (1000 * 3600 * 24) + 1);
							iDur = "" + Math.round(iDur);
							var sError = sap.ui.project.e2etm.util.StaticUtility.checTravelCategoryDuration(oData.ZZ_TRV_TYP, iDur, oData.ZZ_SMODID, oData.ZZ_LAND1);
							if (sError != "" && oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ZSLFDPD == "00") {
								return sError;
							}
							sError = sap.ui.project.e2etm.util.StaticUtility.checkDateOverlapping(startDate, endDate, TravelPlanThis.getView().getModel().getData().ZZ_REINR, oData.ZZ_TRV_TYP, oData.ZZ_VERSION, TravelPlanThis.getView().getModel().getData().ZZ_REINR);
							if (sError != "") {
								return sError;
							}
						} catch (exc) {
						}
					}
				}
			}
			//////################# UCD1KOR 15 July 2021 BUSR Copy #############################///////////
			if(sap.ui.getCore().getModel("global").getData().TrfrFlag !== "X"){
				if(oDeputationThis.getView().getModel().getData().screenData.ZZ_TRV_CAT == 'TRFR' && sap.ui.getCore().getModel("global").getData().isCopy == false){
//					if(oDeputationThis.getView().getModel().getData().screenData.ZZ_DEP_TOCNTRY != "AT"){
						if(oDeputationThis.getView().getModel().getData().screenData.ZZ_REQ_TYP == 'SECO' || oDeputationThis.getView().getModel().getData().screenData.ZZ_REQ_TYP == 'EMER' ||oDeputationThis.getView().getModel().getData().screenData.ZZ_REQ_TYP == 'HOME' ) //uml6kor 18/2/2020 skipping error block for seco trfr trvl
						{//no error msg
					    }else
						{
						if(oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ZSLFDPD =='00'){
							if(i==0){
								var begda = oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA;
								var sDate = new Date(begda.substr(0, 4), 
										             begda.substr(4, 2) - 1, 
										             begda.substr(6, 2));
					           
					
					           if (sDate > new Date(begda.substr(0, 4),
					        		                begda.substr(4, 2) - 1, 5)) {
							    	oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA_ERROR = 'Error';
					            	var err = "For transfer request, onward departure date should be between 1st to 5th day of the month";				
					            	return err;
					            }else{
							    	  oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA_ERROR = 'None';
					            }
					
					         
							}else if(i==1){
								var endda = oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA;
								var eDate = new Date(endda.substr(0, 4), 
										              endda.substr(4, 2) - 1, 
										              endda.substr(6, 2));
								  if (eDate < new Date(endda.substr(0, 4),endda.substr(4, 2) - 1, 26)) {
									  oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA_ERROR = 'Error';
		                               var err = "For transfer request, return departure date should be between 26th to last day of the month";                               return err;
		                          }else{
		                        	  oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA_ERROR = 'None';
		                          }
							}
						}
					}
//					}
				//	else{
				//		 oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA_ERROR = 'None';
				//		 oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA_ERROR = 'None';
				//	}
				}
			}
	}
		
		return "";
	},
	checkAccomodation : function(oData) {
		for ( var i = 0; i < oData.TRV_HDRtoTRV_ACCOM.results.length && oData.TRV_HDRtoTRV_ACCOM != undefined; i++) {
			if (oData.TRV_HDRtoTRV_ACCOM.results[i].ZZ_ZPLACE == null || oData.TRV_HDRtoTRV_ACCOM.results[i].ZZ_ZPLACE == "") {
				oData.TRV_HDRtoTRV_ACCOM.results[i].ZZ_ZPLACE_ERROR = 'Error';
				return TravelPlanThis.getView().getModel("i18n").getProperty("enter_required_field");
			} else {
				oData.TRV_HDRtoTRV_ACCOM.results[i].ZZ_ZPLACE_ERROR = 'None';
			}
			if (oData.TRV_HDRtoTRV_ACCOM.results[i].ZZ_BEGDA == null || oData.TRV_HDRtoTRV_ACCOM.results[i].ZZ_BEGDA == "") {
				oData.TRV_HDRtoTRV_ACCOM.results[i].ZZ_BEGDA_ERROR = 'Error';
				return "Please check From Date";
			} else {
				oData.TRV_HDRtoTRV_ACCOM.results[i].ZZ_BEGDA_ERROR = 'None';
			}
			if (oData.TRV_HDRtoTRV_ACCOM.results[i].ZZ_ENDDA == null || oData.TRV_HDRtoTRV_ACCOM.results[i].ZZ_ENDDA == "") {
				oData.TRV_HDRtoTRV_ACCOM.results[i].ZZ_ENDDA_ERROR = 'Error';
				return "Please check To Date";
			} else {
				oData.TRV_HDRtoTRV_ACCOM.results[i].ZZ_ENDDA_ERROR = 'None';
			}
			if (parseInt(oData.TRV_HDRtoTRV_ACCOM.results[i].ZZ_BEGDA) < parseInt(oData.ZZ_DATV1)) {
				oData.TRV_HDRtoTRV_ACCOM.results[i].ZZ_BEGDA_ERROR = 'Error';
				return "Accomodation From Date must be greater than or equal to Trip Start Date";
			} else {
				oData.TRV_HDRtoTRV_ACCOM.results[i].ZZ_BEGDA_ERROR = 'None';
			}
			if (parseInt(oData.TRV_HDRtoTRV_ACCOM.results[i].ZZ_ENDDA) > parseInt(oData.ZZ_DATB1)) {
				oData.TRV_HDRtoTRV_ACCOM.results[i].ZZ_ENDDA_ERROR = 'Error';
				return "Accomodation To Date must be less than or equal to Trip End Date";
			} else {
				oData.TRV_HDRtoTRV_ACCOM.results[i].ZZ_ENDDA_ERROR = 'None';
			}
			if (parseInt(oData.TRV_HDRtoTRV_ACCOM.results[i].ZZ_BEGDA) > parseInt(oData.TRV_HDRtoTRV_ACCOM.results[i].ZZ_ENDDA)) {
				oData.TRV_HDRtoTRV_ACCOM.results[i].ZZ_BEGDA_ERROR = 'Error';
				oData.TRV_HDRtoTRV_ACCOM.results[i].ZZ_ENDDA_ERROR = 'Error';
				return "To Date must be greater than or equal to From Date";
			} else {
				oData.TRV_HDRtoTRV_ACCOM.results[i].ZZ_BEGDA_ERROR = 'None';
				oData.TRV_HDRtoTRV_ACCOM.results[i].ZZ_ENDDA_ERROR = 'None';
			}
		}
		// Check date overlapping GIANG BEGIN
		for ( var i = 0; i < oData.TRV_HDRtoTRV_ACCOM.results.length && oData.TRV_HDRtoTRV_ACCOM != undefined; i++) {
			var stDate = oData.TRV_HDRtoTRV_ACCOM.results[i].ZZ_BEGDA;
			var enDate = oData.TRV_HDRtoTRV_ACCOM.results[i].ZZ_ENDDA;
			var checkStartDate = new Date(stDate.substr(0, 4), stDate.substr(4, 2) - 1, stDate.substr(6, 2));
			var checkEndDate = new Date(enDate.substr(0, 4), enDate.substr(4, 2) - 1, enDate.substr(6, 2));
			for ( var j = i + 1; j < oData.TRV_HDRtoTRV_ACCOM.results.length && oData.TRV_HDRtoTRV_ACCOM != undefined; j++) {
				var curStDate = oData.TRV_HDRtoTRV_ACCOM.results[j].ZZ_BEGDA;
				var curEnDate = oData.TRV_HDRtoTRV_ACCOM.results[j].ZZ_ENDDA;
				var curStartDate = new Date(curStDate.substr(0, 4), curStDate.substr(4, 2) - 1, curStDate.substr(6, 2));
				var curEndDate = new Date(curEnDate.substr(0, 4), curEnDate.substr(4, 2) - 1, curEnDate.substr(6, 2));
				if (checkEndDate < curStartDate || checkStartDate > curEndDate) {
					oData.TRV_HDRtoTRV_ACCOM.results[j].ZZ_BEGDA_ERROR = 'None';
					oData.TRV_HDRtoTRV_ACCOM.results[j].ZZ_ENDDA_ERROR = 'None';
					continue;
				} else {
					oData.TRV_HDRtoTRV_ACCOM.results[j].ZZ_BEGDA_ERROR = 'Error';
					oData.TRV_HDRtoTRV_ACCOM.results[j].ZZ_ENDDA_ERROR = 'Error';
					return "Date is overlapping";
				}
			}
		}
		// Check date overlapping GIANG END
		return "";
	},
	checkAdvance : function(oData) {
		for ( var i = 0; i < oData.advance.length; i++) {
//			Changed by MYU1KOR
			if (oData.advance[i].total_error == "Error"){
				return "You have exceeded the advance amount eligibility. Please consider changing the advance entered and create additional advance request while on travel.";
			}
//			End of changes by MYU1KOR
			else if (oData.advance[i].boarding_error == "Error" || oData.advance[i].lodging_error == "Error" || oData.advance[i].surface_error == "Error" || oData.advance[i].others_error == "Error") {
				return "Invalid number(s) for advance";
			} else if (oData.advance[i].currency_key_error == "Error") {
				return "Invalid currency for advance";
			}
			if (oData.advance[i].currency_key.trim() == "" && oData.advance[i].total != 0) {
				return "Please enter currency in line " + (i + 1);
			}
//			Changed by MYU1KOR
			if(oData.ZZ_MODID == 'BUSR' || oData.ZZ_MODID == 'SECO' || oData.ZZ_MODID == 'INFO' || (oData.ZZ_MODID == 'DEPU' && sap.ui.getCore().getModel("global").getData().ZZ_TRV_CAT != 'TRFR'))
			{
				
			}else
				{
					if (oData.advance[i].currency_key.trim() != "" && oData.advance[i].total == 0) {
					return "Please enter amount in line " + (i + 1);
					}
				}
//			End of changes by MYU1KOR

			if (oData.ZZ_LAND1 == "IN" && oData.advance[i].currency_key != "INR" && oData.advance[i].total != 0) {
				return "Please enter the currency as INR";
			}
		}
		return "";
	},
	showPreviousGeneralDetails : function(evt) {
		TravelPlanThis.getView().byId("rowRepeaterGeneralDetails").nextPage();
		TravelPlanThis.getView().byId("btnPreviousVersionGeneralDetails").setEnabled(false);
		TravelPlanThis.getView().byId("btnCurrentVersionGeneralDetails").setEnabled(true);
	},
	showCurrentGeneralDetails : function(evt) {
		TravelPlanThis.getView().byId("rowRepeaterGeneralDetails").previousPage();
		TravelPlanThis.getView().byId("btnPreviousVersionGeneralDetails").setEnabled(true);
		TravelPlanThis.getView().byId("btnCurrentVersionGeneralDetails").setEnabled(false);
	},
	showPreviousCostDetails : function(evt) {
		TravelPlanThis.getView().byId("rowRepeaterCostDetails").nextPage();
		TravelPlanThis.getView().byId("btnPreviousVersionCostDetails").setEnabled(false);
		TravelPlanThis.getView().byId("btnCurrentVersionCostDetails").setEnabled(true);
	},
	showCurrentCostDetails : function(evt) {
		TravelPlanThis.getView().byId("rowRepeaterCostDetails").previousPage();
		TravelPlanThis.getView().byId("btnPreviousVersionCostDetails").setEnabled(true);
		TravelPlanThis.getView().byId("btnCurrentVersionCostDetails").setEnabled(false);
	},
	showPreviousTravelDetails : function(evt) {
		TravelPlanThis.getView().byId("rowRepeaterTravelDetails").nextPage();
		TravelPlanThis.getView().byId("btnPreviousVersionTravelDetails").setEnabled(false);
		TravelPlanThis.getView().byId("btnCurrentVersionTravelDetails").setEnabled(true);
	},
	showCurrentTravelDetails : function(evt) {
		TravelPlanThis.getView().byId("rowRepeaterTravelDetails").previousPage();
		TravelPlanThis.getView().byId("btnPreviousVersionTravelDetails").setEnabled(true);
		TravelPlanThis.getView().byId("btnCurrentVersionTravelDetails").setEnabled(false);
	},
	onChangeFund : function(oControlEvent) {
		var source = oControlEvent.getSource();
		var oData = TravelPlanThis.getView().getModel().getData();
		var iIndex = source.getId().substring(source.getId().indexOf("row") + 3, source.getId().length);
		if (source.getValue() != "")
			oData.TRV_HDRtoTRV_COST_ASGN.results[iIndex].ZZ_GEBER = source.getValue().toUpperCase();
		oData.TRV_HDRtoTRV_COST_ASGN.results[iIndex].ZZ_FISTL = "";
		TravelPlanThis.checkfund(oData);
	},
	checkfund : function(oData) {
		var fundF02, fundF03, fundF01F02F04,fundF03Mcr;
		fundF02 = false;
		fundF03 = false;		
		fundF01F02F04 = false;
		fundF03Mcr = false;
	
		for ( var i = 0; i < oData.TRV_HDRtoTRV_COST_ASGN.results.length; i++) {
			if (oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_GEBER == "F02") {
				if (Number(oData.ZZ_REINR) < Number(sap.ui.getCore().getModel("global").getProperty("/VKM_TR")) && Number(sap.ui.getCore().getModel("global").getProperty("/VKM_TR")) != 0) {
					fundF02 = true;
					oData.ZZ_VKM = oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_VKM;
					oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_CCDEPT = "";
					oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_CCOST = "";
					oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_CCNAME = "";
					oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_EANO = "";
					oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_PONO = "";
					oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_CLENTY = "";
				}
			}
			if (oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_GEBER == "F03") {
				if(oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_MCR == 'X'){
					fundF03Mcr = true;
					
					oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_VKM = "";
					oData.ZZ_TASKID = oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_TASKID;
					oData.ZZ_TASKDESC = oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_TASKDESC;
					oData.ZZ_CCNAME = oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_RESOURCEID;
					oData.ZZ_RESOURCEID = oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_RESOURCEID;
					oData.ZZ_RESOURCETYP = oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_RESOURCETYP;
				//new changes_09.02
		/*			oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_VKM = "";                    //commented by UEA6KOR_11.03.2019_MCRNonMCR
					oData.ZZ_CCDEPT = oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_CCDEPT;
					oData.ZZ_CCOST = oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_CCOST;
					oData.ZZ_CCNAME = oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_CCNAME;
					oData.ZZ_EANO = oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_EANO;
					oData.ZZ_PONO = oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_PONO;
					oData.ZZ_CLENTY = oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_CLENTY;    */
					
					
				//new changes_09.02
				
				}else{
					fundF03 = true;
					oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_VKM = "";
					oData.ZZ_CCDEPT = oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_CCDEPT;
					oData.ZZ_CCOST = oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_CCOST;
					oData.ZZ_CCNAME = oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_CCNAME;
				//	oData.ZZ_EANO = oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_EANO;
					oData.ZZ_PONO = oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_PONO;
					oData.ZZ_CLENTY = oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_CLENTY;
				}
				
				
				
				
				/* Start-CTG F03 Changes */
				// oData.ZZ_CLENTY =
				// oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_CLENTY;
				/* End-CTG F03 Changes */
			}
			if (oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_GEBER != "F02" && oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_GEBER != "F03") {
				oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_VKM = "";
				oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_CCDEPT = "";
				oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_CCOST = "";
				oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_CCNAME = "";
				oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_EANO = "";
				oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_PONO = "";
				oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_CLENTY = "";
			}
			/*UCD1KOR 12 Dec 2019 visibility of customer type */
			//if(oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_GEBER =="F04"){
				// fundF01F02F04 = true
			// }
			/*"Start of chnage_DYE5KOR"*/
			
			/*for(var j=0;j<= oData.fund.length;j++){
				if(oData.fund[j].fincode == oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_GEBER){		
					oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_BESCHR = oData.fund[j].beschr;
					break;
					
				}
			
			}*/
			
			/*"End of chnage_DYE5KOR"*/
			
			/* Start-CI Reporting Changes */
			if(oData.ZZ_MODID == "DEPU"&&oData.ZZ_SMODID=="INTL")
				{
			if (oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_GEBER == "F02" || oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_GEBER == "F01" || oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_GEBER == "F04") {
				fundF01F02F04 = true;
				 oData.ZZ_CI_CUSTTYP =
				 oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_CI_CUSTTYP;
				 oData.ZZ_CI_DIVISION =
				 oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_CI_DIVISION;
				 oData.ZZ_CI_DEP =
				 oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_CI_DEP;
				 oData.ZZ_CI_GRP =
				 oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_CI_GRP;
				 oData.ZZ_CI_BU =
				 oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_CI_BU;
			}
				}
			
			/* End-CI Reporting Changes */
		}
		TravelPlanThis.getView().byId("flexBoxFundF02").setVisible(fundF02);
		TravelPlanThis.getView().byId("flexBoxFundF03").setVisible(fundF03);
		TravelPlanThis.getView().byId("flexBoxFundF01F02F04").setVisible(fundF01F02F04);
	    TravelPlanThis.getView().byId("flexCtgMcr").setVisible(fundF03Mcr);
		
		
	},
	onAfterRendering : function() {

		if (this.getView().byId("f01CiRep--ipDepartment")) {
             this.valueHelpFieldAsReadOnly(this.getView().byId("f01CiRep--ipDepartment"));
		}
		if (this.getView().byId("f01CiRep--ipDivision")) {
            this.valueHelpFieldAsReadOnly(this.getView().byId("f01CiRep--ipDivision"));
		}
		if (this.getView().byId("f01CiRep--ipGroup")) {
            this.valueHelpFieldAsReadOnly(this.getView().byId("f01CiRep--ipGroup"));
		}
		
		if(this.getView().byId("tabCostAssignment")){
			this.getView().byId("tabCostAssignment").onAfterRendering = jQuery.proxy(function(){
			if (sap.ui.table.Table.prototype.onAfterRendering) {
				sap.ui.table.Table.prototype.onAfterRendering.apply(this.getView().byId("tabCostAssignment"), arguments);
			}
			$(".budget_center_read_only>input").attr('readonly', 'readonly');
			},this);
		}
		
/*Start-Change Family Return Dates*/
		if (this.getView().byId("TableDetailId")) {
			this.getView().byId("TableDetailId").onAfterRendering = jQuery.proxy(function() {
				if (sap.ui.table.Table.prototype.onAfterRendering) {
					sap.ui.table.Table.prototype.onAfterRendering.apply(this.getView().byId("TableDetailId"), arguments);
				}
				if (TravelPlanThis.getView().getModel().getData().ZZ_TRV_TYP == "DEPU" && TravelPlanThis.getView().getModel().getData().ZZ_SMODID == "INTL" && sap.ui.getCore().getModel("global").getData().changeType == "DH") {
					var travelDetails = TravelPlanThis.getView().getModel().getData().TRV_HDRtoTRV_travel_Data.results;
					var table = this.getView().byId("TableDetailId");
					var currentDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
					for ( var i = 0; i < travelDetails.length; i++) {
						var startDate = new Date(travelDetails[i].ZZ_BEGDA.substr(0, 4), travelDetails[i].ZZ_BEGDA.substr(4, 2) - 1, travelDetails[i].ZZ_BEGDA.substr(6, 2));
						if (travelDetails[i].ZZ_ZSLFDPD != "00" && startDate > currentDate) {// Spouse
							var cells = table.getRows()[i].getCells();
							for(var j=0;j<cells.length;j++){
								cells[j].unbindProperty("enabled");//Arrival Date
								cells[j].setEnabled(true);	
							}
							
						}
					}
				}
			}, this);
		}
/* End-Change Family Return Dates */		
		 this.backGroundColor();
		
	},
	valueHelpFieldAsReadOnly:function(control){
		control.onAfterRendering = function() {
			if (sap.ui.commons.ValueHelpField.prototype.onAfterRendering) {
				sap.ui.commons.ValueHelpField.prototype.onAfterRendering.apply(this, arguments);
			}
			$(".cust_leg_entity .sapUiTfInner").attr('readonly', 'readonly');
		};
	},
	onCustomerTypeChange : function(evt) {
		
		var key = evt.oSource.getSelectedKey();
		this.getView().getModel().getData().ZZ_CI_DIVISION = '';
		this.getView().getModel().getData().ZZ_CI_BU = '';
		this.getView().getModel().getData().ZZ_CI_DEP = '';
		this.getView().getModel().getData().ZZ_CI_GRP = '';
		this.getView().getModel().refresh(true);
		//this.getView().getModel().getData().ZZ_CI_DIVISION = '';
//		if (key == "BSCH") {
//			oComponent.getModel().callFunction("CiCustomerDetailsF4Help", "GET", null, null, jQuery.proxy(function(oData, response) {
//				var data = this.getView().getModel().getData();
//				data.CiCustomerDetls = oData.results;
//				data.CiDivision = [];
//				data.CiDepartment = [];
//				for ( var i = 0; i < oData.results.length; i++) {
//					if ((data.CiDivision.map(function(d) {
//						return d['Division'];
//					}).indexOf(oData.results[i].Division)) == -1)
//						data.CiDivision.push({
//							Division : oData.results[i].Division
//						});
//					if ((data.CiDepartment.map(function(d) {
//						return d['Department'];
//					}).indexOf(oData.results[i].Department)) == -1 && (data.CiDepartment.map(function(d) {
//						return d['BU'];
//					}).indexOf(oData.results[i].Bu)) == -1)
//						data.CiDepartment.push({
//							Department : oData.results[i].Department,
//							BU : oData.results[i].Bu
//						});
//				}
//			}, this), function(error) {
//				sap.m.MessageToast.show("Error");
//			}, true);
//		}
	},
	setDivisionF4 : function(oRowsModel, oValueHelpDialog, data) {
		oValueHelpDialog.setTitle("Division");
		oValueHelpDialog.setKey("Division");
		oValueHelpDialog.theTable.addColumn(new sap.ui.table.Column({
			label : new sap.ui.commons.Label({
				text : "Division"
			}),
			template : new sap.ui.commons.TextView().bindProperty("text", "Division"),
			sortProperty : "Division",
			filterProperty : "Division"
		}));
		
		if(!(data.hasOwnProperty("CiCustomerDetls"))){
			this.getCICustomerDetails("Division",oRowsModel,oValueHelpDialog)
		}
		else{
		oRowsModel.setData(data.CiDivision);
		oValueHelpDialog.open();
		}
	},
	setDepartmentF4 : function(oRowsModel, oValueHelpDialog, data) {
		oValueHelpDialog.setTitle("Department");
		oValueHelpDialog.setKey("Department");
		oValueHelpDialog.theTable.addColumn(new sap.ui.table.Column({
			label : new sap.ui.commons.Label({
				text : "Department"
			}),
			template : new sap.ui.commons.TextView().bindProperty("text", "Department"),
			sortProperty : "Department",
			filterProperty : "Department"
		}));
		oValueHelpDialog.theTable.addColumn(new sap.ui.table.Column({
			label : new sap.ui.commons.Label({
				text : "BU"
			}),
			template : new sap.ui.commons.TextView().bindProperty("text", "BU"),
			sortProperty : "BU",
			filterProperty : "BU"
		}));
		if(!(data.hasOwnProperty("CiCustomerDetls"))){
			this.getCICustomerDetails("Department",oRowsModel,oValueHelpDialog)
		}else{
		var department =  this.getDeptByDivision(data);	
		oRowsModel.setData(department);
		oValueHelpDialog.open();
		}
	},
	setGroupF4 : function(oRowsModel, oValueHelpDialog, data) {

		oValueHelpDialog.setTitle("Group");
		oValueHelpDialog.setKey("Group");
		oValueHelpDialog.theTable.addColumn(new sap.ui.table.Column({
			label : new sap.ui.commons.Label({
				text : "Group"
			}),
			template : new sap.ui.commons.TextView().bindProperty("text", "Group"),
			sortProperty : "Group",
			filterProperty : "Group"
		}));
		if(!(data.hasOwnProperty("CiCustomerDetls"))){
			this.getCICustomerDetails("Group",oRowsModel,oValueHelpDialog)
		}else{
	    var group = this.getGroupbyDept(data)
		oRowsModel.setData(group);
		oValueHelpDialog.open();
		}
	},
	checkF01F02F04CIDetails : function(i, oData) {
		if (oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_GEBER == "F01" || oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_GEBER == "F02" || oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_GEBER == "F04") {
			if(oData.ZZ_CI_CUSTTYP==undefined||oData.ZZ_CI_CUSTTYP == ""){
				oData.ZZ_CI_CUSTTYP_ERROR = 'Error';
				return "Please enter Customer Type";
			}else{
				oData.ZZ_CI_CUSTTYP_ERROR = 'None';
			}
			if (oData.ZZ_CI_CUSTTYP == "BSCH") {
				if (oData.ZZ_CI_DIVISION == undefined || oData.ZZ_CI_DIVISION == "") {
					oData.ZZ_CI_DIVISION_ERROR = 'Error';
					return "Please enter Division";
				}else{
					oData.ZZ_CI_DIVISION_ERROR = 'None';
				}
				if (oData.ZZ_CI_DIVISION == "CI") {
					if (oData.ZZ_CI_DEP == undefined || oData.ZZ_CI_DEP == "") {
						oData.ZZ_CI_DEP_ERROR = 'Error';
						return "Please enter Department";
					}else{
						oData.ZZ_CI_DEP_ERROR = 'None';
					}
//					if (oData.ZZ_CI_GRP == undefined || oData.ZZ_CI_GRP == "") {
//						oData.ZZ_CI_GRP_ERROR = 'Error';
//						return "Please enter Group";
//					}else{
//						oData.ZZ_CI_GRP_ERROR = 'None';
//					}
				}
			}
			
			oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_CI_DEP = oData.ZZ_CI_DEP;
			oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_CI_GRP = oData.ZZ_CI_GRP;
			oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_CI_DIVISION = oData.ZZ_CI_DIVISION;
			oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_CI_BU = oData.ZZ_CI_BU;
			oData.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_CI_CUSTTYP = oData.ZZ_CI_CUSTTYP;
		
		}
		return "";
		
	},
	getCICustomerDetails:function(property,oRowsModel,oValueHelpDialog){
		oComponent.getModel().callFunction("CiCustomerDetailsF4Help", "GET", null, null, jQuery.proxy(function(oData, response) {
			var data = this.getView().getModel().getData();
			data.CiCustomerDetls = oData.results;
			data.CiDivision = [];
			data.CiDepartment = [];
			for ( var i = 0; i < oData.results.length; i++) {
				if ((data.CiDivision.map(function(d) {
					return d['Division'];
				}).indexOf(oData.results[i].Division)) == -1)
					data.CiDivision.push({
						Division : oData.results[i].Division
					});
				
			}
			if(property=="Division"){
				oRowsModel.setData(data.CiDivision);
				
			}else if(property=="Department"){
				var department =  this.getDeptByDivision(data);
				oRowsModel.setData(department);
			}else if(property=="Group"){
				var group = this.getGroupbyDept(data);
				oRowsModel.setData(group);
			}
			this.getView().getModel().setData(data);
			oValueHelpDialog.open();
		}, this), function(error) {
			sap.m.MessageToast.show("Error");
		}, true);
	},
	getDeptByDivision:function(data){
		data.CiDepartment = [];
		for ( var i = 0; i < data.CiCustomerDetls.length; i++) {
			if (data.CiCustomerDetls[i].Division == data.ZZ_CI_DIVISION) {
				if ((data.CiDepartment.map(function(d) {
					return d['Department'];
				}).indexOf(data.CiCustomerDetls[i].Section1)) == -1 || (data.CiDepartment.map(function(d) {
					return d['BU'];
				}).indexOf(data.CiCustomerDetls[i].Bu)) == -1){
					if(data.CiCustomerDetls[i].Section1!=""&&data.CiCustomerDetls[i].Section1!=undefined)
					data.CiDepartment.push({
						Department : data.CiCustomerDetls[i].Section1,
						BU : data.CiCustomerDetls[i].Bu
					});
				}
			}
		}
		return data.CiDepartment;
	},
	getGroupbyDept:function(data){
		data.CiGroup = [];
		for ( var i = 0; i < data.CiCustomerDetls.length; i++) {
			if (data.CiCustomerDetls[i].Section1 == data.ZZ_CI_DEP) {
				if ((data.CiGroup.map(function(d) {
					return d['Group'];
				}).indexOf(data.CiCustomerDetls[i].Department)) == -1) {
					if(data.CiCustomerDetls[i].Department!=""&&data.CiCustomerDetls[i].Department!=undefined)
					data.CiGroup.push({
						Group : data.CiCustomerDetls[i].Department
					});
				}
			}
		}
		return data.CiGroup;
	},
/*Start-Secondary Travel Advance Changes*/	
	getCardBankDetails:function(oData){
		var trvky = 'DEPU';
		var currentRole = sap.ui.getCore().getModel("profile").getData().currentRole;
		var global = sap.ui.getCore().getModel("global").getData();
		var batch1 = oDataModel.createBatchOperation("BankDetailsSet(EmpNo='" + global.ZZ_DEP_PERNR + "',TravelPlan='" + global.ZZ_TRV_REQ + "',TravelType='"+trvky+"')", "GET");
		var batch2 = oDataModel.createBatchOperation("MRGeneralDataSet(EmpNo='" + global.ZZ_DEP_PERNR + "',TravelPlan='" + global.ZZ_TRV_REQ + "',TravelType='"+trvky+"',LoginRole='" + currentRole + "')", "GET");
		var batch3 = oDataModel.createBatchOperation("SecoAdvSet(Pernr='" + global.ZZ_DEP_PERNR + "',Reinr='" + TravelPlanThis.getView().getModel().getData().ZZ_REINR + "',Trvky='SECO')", "GET");
		oDataModel.addBatchReadOperations([ batch1,batch2,batch3 ]);
		oDataModel.submitBatch(function(oResult) {
			try {
				var data = TravelPlanThis.getView().getModel().getData();
                data.bankcarddetails = $.extend({},oResult.__batchResponses[0].data,
                		oResult.__batchResponses[1].data,
                		oResult.__batchResponses[2].data);
                if(data.bankcarddetails["Card"]!="X"&& data.bankcarddetails["Bank"]!="X"){
                	data.bankcarddetails["None"] = "X";
                }
                TravelPlanThis.getView().getModel().setData(data);
                
				//sap.ui.project.e2etm.util.StaticUtility.setBusy(false, TravelPlanThis);
			} catch (err) {
				//sap.ui.project.e2etm.util.StaticUtility.setBusy(false, TravelPlanThis);
			}
		}, function(error) {
			//sap.ui.project.e2etm.util.StaticUtility.setBusy(false, TravelPlanThis);
		}, true);
	},
	saveCardBankIfSecondary:function(aData){
		if(aData.bankcarddetails){
		var oData1 = {Pernr:aData.bankcarddetails.EmpNo,Reinr:aData.ZZ_REINR,
				     Trvky:'SECO'};
		
		oData1.Card = this.getView().byId("rbBtnCard").getSelected()?"X":"";
		oData1.Bank = this.getView().byId("rbBtnBank").getSelected()?"X":"";
		oData1.None = this.getView().byId("rbBtnNone").getSelected()?"X":"";
		
		oDataModel.create("SecoAdvSet", oData1, null, function(oData, response) {
			// oController.uploadFiles(global.ZZ_TRV_REQ);
			
		}, function(error) {
		
			sap.m.MessageToast.show("Internal Server Error");
		}, true);
		}
	},
	checkAdvanceAmount:function(oData){
		if(oData.bankcarddetails){
		   	if(this.getView().byId("rbBtnCard").getSelected()){
		   		if(oData.bankcarddetails.CardNo==""||oData.bankcarddetails.CardNo==undefined||oData.bankcarddetails.CardNo==" "){
		   			return "Please update Card Details";
		   		}
		   	}
		   	if(this.getView().byId("rbBtnBank").getSelected()){
		   		if(oData.bankcarddetails.Bkact==""||oData.bankcarddetails.Bkact==undefined||oData.bankcarddetails.Bkact==" "){
		   			return "Please update Bank Details in Bank Advice Form";
		   		}
		   	}
		}
		var sum = 0;
		for ( var i = 0; i < oData.advance.length; i++) {
			sum = sum + oData.advance[i].total;			
		}
		if(sum==0){
		sap.ca.ui.message.showMessageBox({
			type : sap.ca.ui.message.Type.INFO,
			message : "Advance amount entered is Zero.Request will not be processed."
		});
		}
		return "";
	},
/*End-Secondary Travel Advance Changes*/	
	
	
		validateDateWithVisa : function(data) {
		//var currentDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
		var begda = new Date(data.ZZ_BEGDA.substr(0, 4), data.ZZ_BEGDA.substr(4, 2) - 1, data.ZZ_BEGDA.substr(6, 2));
		var depData = oDeputationThis.getView().getModel().getData().visaExistingDependent;
		var selfVisa = oDeputationThis.getView().getModel().getData().selfVisa;
		var depType;
		var visasdate,visaedate;
		switch (data.ZZ_ZSLFDPD) {
		case "01":
			depType = "(Spouse)";
			break;
		case "02":
			depType = "(C1)";
			break;
		case "90":
			depType = "(C2)";
			break;
		case "03":
			depType = "(C3)";
			break;
		case "04":
			depType = "(C4)";
			break;
		case "05":
			depType = "(C5)";
			break;
		}
		 
		if(oDeputationThis.getView().getModel().getData().screenData.ZZ_DEP_TOCNTRY == "DE"){
			if (data.ZZ_ZSLFDPD == "00") {
				visaedate = new Date(selfVisa.ZZ_VISA_EDATE.substr(0, 4), selfVisa.ZZ_VISA_EDATE.substr(4, 2) - 1, selfVisa.ZZ_VISA_EDATE.substr(6, 2));
				visasdate = new Date(selfVisa.ZZ_VISA_SDATE.substr(0, 4), selfVisa.ZZ_VISA_SDATE.substr(4, 2) - 1, selfVisa.ZZ_VISA_SDATE.substr(6, 2));
				if (!(begda >= visasdate && begda <= visaedate)) {
					return "Please check the Visa Dates of Self";
				}
			} else {
				for ( var i = 0; i < depData.length; i++) {
					if ((depData[i].ZZ_DEPNDT_TYP).indexOf(depType) != -1) {
						visaedate = new Date(depData[i].ZZ_VISA_EDATE.substr(0, 4), depData[i].ZZ_VISA_EDATE.substr(4, 2) - 1, depData[i].ZZ_VISA_EDATE.substr(6, 2));
						visasdate = new Date(depData[i].ZZ_VISA_SDATE.substr(0, 4), depData[i].ZZ_VISA_SDATE.substr(4, 2) - 1, depData[i].ZZ_VISA_SDATE.substr(6, 2));
					}
				}
				if (!(begda >= visasdate && begda <= visaedate)) {
					return "Please check the Visa Dates of Dependent";
				}
			}
		}
		
		return "";
	},
	
	onDeputationDateChange: function(evt){
		//change by MYU1KOR
		var oData = TravelPlanThis.getView().getModel().getData();
		if(oData.ZZ_MODID == 'BUSR' && oData.ZZ_SMODID == "INTL" && oData.PersFlag == "X" ){	//UEA6KOR_24.9.2020 personal trip changes
			//trip date change not required (bottom up)
		}else{
			if(oData.ZZ_MODID == 'BUSR' || oData.ZZ_MODID == 'SECO' || oData.ZZ_MODID == 'INFO' || (oData.ZZ_MODID == 'DEPU' && sap.ui.getCore().getModel("global").getData().ZZ_TRV_CAT != 'TRFR'))
			{
				var min_date;
				var max_date;
				for ( var i = 0; i < oData.TRV_HDRtoTRV_travel_Data.results.length && oData.TRV_HDRtoTRV_travel_Data != undefined; i++) {
					
					if(oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_ZSLFDPD == '00')
					{
							if(min_date == null || max_date == null)
							{
								min_date = oData.TRV_HDRtoTRV_travel_Data.results[0].ZZ_BEGDA;
								max_date = oData.TRV_HDRtoTRV_travel_Data.results[0].ZZ_BEGDA;
							
							}
								if(parseInt(min_date) > parseInt(oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA))
								{
									min_date = oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA;
								}
								if(parseInt(max_date) < parseInt(oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA))
								{
									max_date = oData.TRV_HDRtoTRV_travel_Data.results[i].ZZ_BEGDA;
								}
							
					}
				
				}
				
				oData.ZZ_DATV1 = min_date;
				oData.ZZ_DATB1 = max_date;
				TravelPlanThis.getView().getModel().setData(oData); 
			//end of changes by Myu1kor
			}			
		}


		return "";
	},
	//uea6kor_23.9.2020 personal trip changes
	onPersonalDateChange:function(evt){
		//######################## UCD1KOR Nov 27, 2020 #########################//////////////
		//// Bug Fix #####################################////
		var oData = TravelPlanThis.getView().getModel().getData();
		try{
			
			var selectedField = evt.getSource();
			if(selectedField.getId().indexOf("idPersendate") != -1){
				oData.EDate = selectedField.getValue();
			}
			else if(selectedField.getId().indexOf("idPerstdate") != -1){
				oData.SDate = selectedField.getValue();
			}

		}catch(err){}
		if(TravelPlanThis.getView().getModel().getData().view.selectedTab == 2 || 
				TravelPlanThis.getView().getModel().getData().view.selectedTab == 0){
			
			if(oData.ZZ_DATV1 != "" && oData.ZZ_DATB1 != "" && oData.SDate != "" && oData.EDate != "" ){
		    if(oData.ZZ_MODID == 'BUSR' && oData.ZZ_SMODID == "INTL" && oData.PersFlag == "X"){
				var min_pdate;
				var max_pdate;
	            var pstripDate = new Date(oData.SDate.substr(0, 4), 
						             oData.SDate.substr(4, 2) - 1, 
						             oData.SDate.substr(6, 2));
				var petripDate = new Date(oData.EDate.substr(0, 4), 
			                         oData.EDate.substr(4, 2) - 1, 
			                         oData.EDate.substr(6, 2));
			     var tstripDate = new Date(oData.ZZ_DATV1.substr(0, 4), 
						             oData.ZZ_DATV1.substr(4, 2) - 1, 
						             oData.ZZ_DATV1.substr(6, 2));
				var tetripDate = new Date(oData.ZZ_DATB1.substr(0, 4), 
			                         oData.ZZ_DATB1.substr(4, 2) - 1, 
			                         oData.ZZ_DATB1.substr(6, 2));		
			      if (tetripDate > pstripDate){
	                max_pdate = oData.ZZ_DATB1;
	                min_pdate = oData.SDate;
			      }  else{
	                 max_pdate = oData.EDate;
	                 min_pdate = oData.ZZ_DATV1;
			      }

			      if(oData.TRV_HDRtoTRV_travel_Data != undefined){
			      	oData.TRV_HDRtoTRV_travel_Data.results[0].ZZ_BEGDA = min_pdate;
			      	oData.TRV_HDRtoTRV_travel_Data.results[oData.TRV_HDRtoTRV_travel_Data.results.length - 1].ZZ_BEGDA = max_pdate;
			      	oData.minPDate = min_pdate;
			      	oData.maxPDate = max_pdate;
			      	TravelPlanThis.getView().getModel().setData(oData);
			      }
			                       		
			    }
			} 
		}
		return"";

	},
	
	//uea6kor_23.9.2020 personal trip changes
	onPersonalTripCreate : function(sData){
		var postData = {};
		postData.TrvReq = sData.ZZ_REINR;
		postData.EmpNo = sData.ZZ_PERNR;
		postData.Version = "";
		postData.PersFlag = sData.PersFlag;
		postData.SDate = sData.SDate;
		postData.STime = "";
		postData.EDate = sData.EDate;
		postData.ETime = "";
		
		oDataModel.create("PersonalTripSet", postData, null,function(oData, response) {
			//sap.ui.project.e2etm.util.StaticUtility.setBusy(false, TravelPlanThis);
			//sap.m.MessageToast.show("Data Saved!!");			
		},function(error) {
			sap.m.MessageToast.show("Personal Trip error");
			//sap.ui.project.e2etm.util.StaticUtility.setBusy(false, TravelPlanThis);
		}, true);
		
	},
	checkPersonalDate : function(oData){
		//uea6kor_16.9.2020 personal trip changes
		if(oData.ZZ_TRV_TYP == "BUSR" && oData.ZZ_SMODID == "INTL" && oData.PersFlag == "X"){
			if (oData.SDate != null || oData.EDate != null) {
// 				var pbegin =  parseInt(oData.SDate - oData.ZZ_DATB1);
// 				var pend = parseInt(oData.ZZ_DATV1 - oData.EDate);
            var psDate = new Date(oData.SDate.substr(0, 4), 
					             oData.SDate.substr(4, 2) - 1, 
					             oData.SDate.substr(6, 2));
			var peDate = new Date(oData.EDate.substr(0, 4), 
		                         oData.EDate.substr(4, 2) - 1, 
		                         oData.EDate.substr(6, 2));
		     var tsDate = new Date(oData.ZZ_DATV1.substr(0, 4), 
					             oData.ZZ_DATV1.substr(4, 2) - 1, 
					             oData.ZZ_DATV1.substr(6, 2));
			var teDate = new Date(oData.ZZ_DATB1.substr(0, 4), 
		                         oData.ZZ_DATB1.substr(4, 2) - 1, 
		                         oData.ZZ_DATB1.substr(6, 2));
		     var peDateDiff = new Date(tsDate - 1);
		     var psDateDiff = new Date(psDate - 1);
		     if(peDateDiff.getDate() == peDate.getDate() || psDateDiff.getDate() == teDate.getDate()){
                oData.view.ZZ_STPERS_ERROR = 'None';
					oData.view.ZZ_ENDPERS_ERROR = 'None';
					TravelPlanThis.getView().getModel().setData(oData);
					return"";
		     }else{
		     	oData.view.ZZ_STPERS_ERROR = 'Error';
					oData.view.ZZ_ENDPERS_ERROR = 'Error';
					TravelPlanThis.getView().getModel().setData(oData);
					 return"Please make sure that there is no gap/overlap between personal travel and business travel";
		     }
		
//		if(oData.ZZ_TRV_TYP == "BUSR" && oData.ZZ_SMODID == "INTL" && oData.PersFlag == "X"){
//			if (oData.SDate != null || oData.EDate != null) {
//				var pbegin =  parseInt(oData.SDate - oData.ZZ_DATB1);
//				var pend = parseInt(oData.ZZ_DATV1 - oData.EDate);
//				if (pbegin == 1 || pend == 1 ){
//
//					oData.view.ZZ_STPERS_ERROR = 'None';
//					oData.view.ZZ_ENDPERS_ERROR = 'None';
//					TravelPlanThis.getView().getModel().setData(oData);
//				}else{
//				    oData.view.ZZ_STPERS_ERROR = 'Error';
//					oData.view.ZZ_ENDPERS_ERROR = 'Error';
//					TravelPlanThis.getView().getModel().setData(oData);
//					   return"Please make sure that there is no gap/overlap between personal travel and business travel";
//				}
//				
			}			
		}

//		uea6kor_16.9.2020 personal trip changes

		
	}
	//uea6kor_18.9.2020 personal trip changes



});