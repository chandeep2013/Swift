jQuery.sap.require("sap.ca.ui.message.message");
jQuery.sap.require("sap.ca.ui.dialog.factory");
jQuery.sap.require("sap.ui.project.e2etm.util.StaticUtility");
jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("sap.m.MessageBox");
sap.ui.controller("sap.ui.project.e2etm.controller.Menu", {

/*------------------------CONTROLLER EVENT AREA BEGIN------------------------*/
	onInit : function(evt) {
		sap.ui.core.routing.Router.getRouter("MyRouter").attachRoutePatternMatched(this.onRouteMatched, this);
	},
	onRouteMatched : function(oEvent) { 
		try {
			var routeName = null;
			if (oEvent.mParameters != null) {
				routeName = oEvent.getParameter("name");
			}
			if (routeName != null) {
				// Check whether the current route is valid for the current user
				// If it's valid, continue the current logic to display user information
				// on menu bar. Otherwise, navigate to the respective route based on 
				// current role
				if(routeName =="RepDashboard"){
					var data = sap.ui.getCore().getModel("profile").getData();
					data.currentRole = "REDP";
				}
				var validRoute = this.checkValidRoute(oEvent.mParameters);
				if (!validRoute) {
					this.navigateToRouteBasedOnRole();
				} else {
					// load menu bars
					this.loadMenuView();
					
					setTimeout(function() {
						try {
							var oShell = oComponent.oContainer.getParent();
							// Put the routename that will be displayed in bigger screen
							if (routeName == "cargoAdmin" || routeName == "insuranceAdmin" || 
									routeName == "accommodation" || routeName == "reimbursement" ||
									routeName == "taxReport" || routeName == "CargoReport" || routeName == "ReimbursementReport" || 
									routeName=="forexsalesreport" ||routeName=="forexmasterreport" || routeName=="cardreloadreport" || 
									routeName=="forexencashmentreport" || routeName=="chplemployeetraveldetailsreport" || 
									routeName=="InsslaReport" ||  routeName=="onsiteaddressreport") {
								oShell.removeStyleClass("customShell1");
								oShell.addStyleClass("customShell2");
							} else {
								oShell.removeStyleClass("customShell2");
								oShell.addStyleClass("customShell1");
							}
						} catch(exc){}	
					}, 1000);
				}
			}
		} catch(exc) {}
	},
/*------------------------CONTROLLER EVENT AREA END------------------------*/


/*------------------------CUSTOM FUNCTION AREA BEGIN------------------------*/
	invisibleAllButtons : function() {
		this.getView().byId("btnReport").setVisible(false);
		this.getView().byId("btnTaxReport").setVisible(false);
		this.getView().byId("btnPEExposureReport").setVisible(false);
		this.getView().byId("btnSlaRep").setVisible(false);
		this.getView().byId("btnTransfer").setVisible(false);
		this.getView().byId("btnAddNewRequest").setVisible(false);
		this.getView().byId("btnBusiVisaRequest").setVisible(false);
		this.getView().byId("btnBusiForm").setVisible(false); //tinhtd 09/08/2018
		this.getView().byId("btnForexSalesReport").setVisible(false);
		this.getView().byId("btnForexEncashmentReport").setVisible(false);
		this.getView().byId("btnForexMasterReport").setVisible(false);
		this.getView().byId("btnCardReloadReport").setVisible(false);
		this.getView().byId("btnOnsiteAddressReport").setVisible(false);
		this.getView().byId("btnMRReport").setVisible(false);
		this.getView().byId("btnTrstReport").setVisible(false);
		this.getView().byId("btnTcktReport").setVisible(false);
		this.getView().byId("btnAirSavingsReport").setVisible(false);
		this.getView().byId("btnQmmReport").setVisible(false);
		this.getView().byId("btnQeiReport").setVisible(false);
		this.getView().byId("btnSecoReport").setVisible(false);
		this.getView().byId("btnSetlReport").setVisible(false);
		this.getView().byId("btnSetlUsetlReport").setVisible(false);
		this.getView().byId("btnMisRep").setVisible(false);
		//dye5kor
		this.getView().byId("OnlyDepuMenu").setVisible(false);
		//
		this.getView().byId("btnDownCl").setVisible(false);
		
		//ucd1kor 24/1/2020 added trvlpdf
		//this.getView().byId("btnViewTPPDF").setVisible(false); 
		this.getView().byId("OnlyCTGMore").setVisible(false); /// Ucd1KOR added 
		this.getView().byId("btnInlandMISReportReport").setVisible(false);
//uml6kor 10/2/2020 added trv_status
		//this.getView().byId("btnViewTPStat").setVisible(false); 
		//uea6kor-uml6kor_22.9.2020 personal trip report
		this.getView().byId("btnPersTripReport").setVisible(false);
		this.getView().byId("btnREPSReport").setVisible(false);
		//ucd1kor Nov 18, 2020 added MIS-Insurance Report
		this.getView().byId("btnMISInsuranceRep").setVisible(false);
		this.getView().byId("btnSettlementRep").setVisible(false);//uea6kor 9/12/2020 trst report
		
		this.getView().byId("OnlyMngr").setVisible(false);
		// UIKI1KOR Added below line
		this.getView().byId("btnbtreport").setVisible(false); 	
		this.getView().byId("OnlyREPPMore").setVisible(false);
		this.getView().byId("OnlyREDPMore").setVisible(false);
		this.getView().byId("btnMRReportFn").setVisible(false);
		this.getView().byId("onlyMRCRReports").setVisible(false);
		
	},
	
	loadMenuView : function() {
		try {
//			this.getView().byId("logoBar").setVisible(true);  
			this.getView().byId("welcomeBar").setVisible(true);
			
			var data = sap.ui.getCore().getModel("profile").getData();
			try {
				this.invisibleAllButtons();
				if (data.currentRole == null || data.currentRole == "EMP") {
					this.getView().byId("btnAddNewRequest").setVisible(true);
					this.getView().byId("btnBusiVisaRequest").setVisible(true);
					this.getView().byId("btnBusiForm").setVisible(false);//commented by uml6kor 12/9/2019 true); //tinhtd 09/08/2018
				} else {
					if (data.currentRole == "GRM" || data.currentRole == "DEPU" || 
							data.currentRole == "ECO" || data.currentRole == "TAX") {
						this.getView().byId("btnReport").setVisible(true);
						if (data.currentRole == "TAX") {
							this.getView().byId("btnTaxReport").setVisible(true);
							this.getView().byId("btnPEExposureReport").setVisible(true);
						}
						if (data.currentRole=="DEPU") {
							this.getView().byId("btnTransfer").setVisible(true);
							this.getView().byId("btnMisRep").setVisible(true);
							this.getView().byId("btnOnsiteAddressReport").setVisible(true);
							this.getView().byId("OnlyDepuMenu").setVisible(true);
						}
						if (data.currentRole=="GRM") {
						    this.getView().byId("btnSetlUsetlReport").setVisible(true);
						    //UCD1KOR Commneted below lines
						   // this.getView().byId("btnMisRep").setVisible(true);
						    //this.getView().byId("btnDownCl").setVisible(true);
						    this.getView().byId("OnlyMngr").setVisible(true);
						}
					} else if (data.currentRole == "MRCR" || data.currentRole == "DEPM") {
						if (data.currentRole == "MRCR") {
							this.getView().byId("btnCardReloadReport").setVisible(true);
							this.getView().byId("btnSecoReport").setVisible(true);
							this.getView().byId("btnOnsiteAddressReport").setVisible(true);
							//ucd1kor added 28/05/2021 removed from  dashboard -extraline
							this.getView().byId("onlyMRCRReports").setVisible(true);
						}						
					} else if (data.currentRole == "MRCA") {
						this.getView().byId("btnOnsiteAddressReport").setVisible(true);
						///############# UCD1KOR NOV 2020 MIS INsurance report added #################////
						this.getView().byId("btnMISInsuranceRep").setVisible(true);
					} else if (data.currentRole == "FEX") {						
						this.getView().byId("btnForexSalesReport").setVisible(true);
						
						this.getView().byId("btnForexEncashmentReport").setVisible(true);
					} else if(data.currentRole == "TRST" || data.currentRole == "FINA"){						
						this.getView().byId("btnForexEncashmentReport").setVisible(true);
						if( data.currentRole == "TRST"){
							//this.getView().byId("btnSlaRep").setVisible(true);
							this.getView().byId("btnTrstReport").setVisible(true);
							this.getView().byId("btnForexSalesReport").setVisible(true);
							this.getView().byId("btnQmmReport").setVisible(true);
							this.getView().byId("btnQeiReport").setVisible(true);
							this.getView().byId("btnSetlReport").setVisible(true);
							//this.getView().byId("btnPersTripReport").setVisible(true);//uea6kor-uml6kor_22.9.2020 personal trip report
						}
						if( data.currentRole == "FINA"){
							this.getView().byId("btnForexMasterReport").setVisible(true);
							this.getView().byId("btnForexSalesReport").setVisible(true);
							//ucd1kor added 28/05/2021 removed from finance dashboard -extraline
							this.getView().byId("btnMISInsuranceRep").setVisible(true);
							this.getView().byId("btnMRReportFn").setVisible(true);
						}
					}else if( data.currentRole == "FINA"){
						this.getView().byId("btnForexMasterReport").setVisible(true);
						this.getView().byId("btnForexEncashmentReport").setVisible(true);
						this.getView().byId("btnForexSalesReport").setVisible(true);
						
					}else if(data.currentRole == "TKM"){
						this.getView().byId("btnTcktReport").setVisible(true);
						this.getView().byId("btnAirSavingsReport").setVisible(true);
						this.getView().byId("btnPersTripReport").setVisible(true);//uea6kor-uml6kor_22.9.2020 personal trip report
						this.getView().byId("btnbtreport").setVisible(true);// added by uik1kor on 03/12/2020 
					}else if(data.currentRole == 'INSR'){
						// ***** UCD1KOR Nov 18, 2020 Hidden for INSR Team
						//*** Commented below line and added new Button for MIS-Insurance Report
						// this.getView().byId("btnSlaRep").setVisible(true); 
						this.getView().byId("btnMISInsuranceRep").setVisible(true);
						this.getView().byId("btnMisRep").setVisible(true);
						
					}
					else if(data.currentRole == "CTG"){
						this.getView().byId("btnMisRep").setVisible(true);
						/*this.getView().byId("btnViewTPPDF").setVisible(true);//uml6kor 16/1/2020 ctg view pdf
						this.getView().byId("btnViewTPStat").setVisible(true);*/ //uml6kor 10/2/2020 ctg view status
						this.getView().byId("OnlyCTGMore").setVisible(true);
						this.getView().byId("btnSetlUsetlReport").setVisible(true); // UCD1KOR Aug 03 Settle/Unsettle Report
						this.getView().byId("btnSettlementRep").setVisible(true);//uea6kor 9/12/2020 trst report
					}
					else if(data.currentRole == "REPP"){//uea6kor-uml6kor_22.9.2020 personal trip report
						
						// UCD1KOR More button Added
						this.getView().byId("OnlyREPPMore").setVisible(true);
						
						/*this.getView().byId("btnPersTripReport").setVisible(true);
						this.getView().byId("btnREPSReport").setVisible(true);
						this.getView().byId("btnInlandMISReportReport").setVisible(true);
						this.getView().byId("btnMISInsuranceRep").setVisible(true);
						this.getView().byId("btnSettlementRep").setVisible(true);
						this.getView().byId("btnbtreport").setVisible(true);*/
					}else if(data.currentRole == "REDP"){// UCD1KOR Added 19 May 2021 more button for REDP
						// UCD1KOR More button Added
						this.getView().byId("OnlyREDPMore").setVisible(true);
					}
					
				}
			} catch(exc) {}
			// Set account info
			this.setAccountInfo();
		} catch(exc) {}
	},
	
	navigateToRouteBasedOnRole : function() {
		var role = sap.ui.getCore().getModel("profile").getData().currentRole;
		if (role == "EMP" || role == "DEPU" || role == "GRM" || 
			role == "ECO"  || role == "CTG") {
			sap.ui.core.routing.Router.getRouter("MyRouter").navTo("home");
		} else if (role == "CARG") {
			sap.ui.core.routing.Router.getRouter("MyRouter").navTo("cargoAdmin");
		} else if (role == "FEX") {
			sap.ui.core.routing.Router.getRouter("MyRouter").navTo("forexAdmin");
		} else if (role == "INSR") {
			sap.ui.core.routing.Router.getRouter("MyRouter").navTo("insuranceAdmin");
		} else if (role == "TKAD") {
			sap.ui.core.routing.Router.getRouter("MyRouter").navTo("ticketingAdmin",{user:"Admin"});
		} else if (role == "TKM") {
			sap.ui.core.routing.Router.getRouter("MyRouter").navTo("ticketingAdmin",{user:"Manager"});
		} else if (role == "ACCO") {
			sap.ui.core.routing.Router.getRouter("MyRouter").navTo("accommodationAdmin",{user:"Manager"});
		} else if (role == "ACCD") {
			sap.ui.core.routing.Router.getRouter("MyRouter").navTo("accommodationAdmin",{user:"Admin"});
		} else if (role == "VISA") {
			sap.ui.core.routing.Router.getRouter("MyRouter").navTo("VisaAdmin");
		} else if (role=="MRCR") {
			sap.ui.core.routing.Router.getRouter("MyRouter").navTo("cardDashBoard",{role:"PE-Payroll Approver"});
		}else if (role=="MRCA") {
			sap.ui.core.routing.Router.getRouter("MyRouter").navTo("cardDashBoard",{role:"PE-Payroll Reviewer"});
		} else if (role=="DEPM") {
			sap.ui.core.routing.Router.getRouter("MyRouter").navTo("cardDashBoard",{role:"Deputation Manager"});
		} else if (role=="FINA") {
			sap.ui.core.routing.Router.getRouter("MyRouter").navTo("cardDashBoard",{role:"Finance"});
		}else if (role=="TAX") {
//			sap.ui.core.routing.Router.getRouter("MyRouter").navTo("reimbursementAdmin");
			sap.ui.core.routing.Router.getRouter("MyRouter").navTo("taxclearanceAdmin");
		}else if (role=="REMR" ) {
			sap.ui.core.routing.Router.getRouter("MyRouter").navTo("reimbursementAdmin",{role:"PE-Accounting"});
		}else if (role == "REBI") {
			sap.ui.core.routing.Router.getRouter("MyRouter").navTo("reimbursementAdmin",{role:"Bino-team"});
		}else if (role == "TRST" || role == "TRSD") {
			sap.ui.core.routing.Router.getRouter("MyRouter").navTo("trsettlelist");
		}else if (role == "MHLD") {
			sap.ui.core.routing.Router.getRouter("MyRouter").navTo("SimCard");
		}else if (role == "ONRG") {
			sap.ui.core.routing.Router.getRouter("MyRouter").navTo("Registration");
		}
		else if (role == "REPP" || role == "REBP") {
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
				//var action = profile.employeeDetail.ZZ_DEP_PERNR;
			}
			
			var hrbpModel = new sap.ui.model.json.JSONModel();
	        var filterURL =  "RepatriationSet?$filter=ZZ_NEXTACTION eq '" +action+"'" ;
	    	oDataModel.read(filterURL, null, null, true, function(oData, response) {
	    		sap.ui.core.BusyIndicator.hide();
	    		hrbpModel.setData(oData);
	    		oThis.getView().setModel(hrbpModel,"hrbp");
	    		sap.ui.getCore().setModel(hrbpModel,"hrbp");
	    		sap.ui.core.routing.Router.getRouter("MyRouter").navTo("HRBPDashboard");
			}, function(error) {
				sap.m.MessageToast.show("Internal Server Error");
				sap.ui.core.BusyIndicator.hide();
			});
		}else if (role == undefined) { //added by uml6kor 23/5/2019 for role= undefined ..employee delimited
			this.getView().byId("OnlyDepuMenu").setVisible(false);
			this.getView().byId("OnlyMngr").setVisible(false);
		}
		
	},
	
	checkValidRoute : function(mParameters) {
		var role = sap.ui.getCore().getModel("profile").getData().currentRole;
		var routeName = mParameters.name;
		
		// Return false means that route name and the role doesn't matcha
		// If new role is inserted, give a case that new route name and 
		// the new role does not match
		if (routeName == "home" && role != "EMP" && role != "DEPU" && 
			role != "GRM"  && role != "ECO" && role != "CTG") {
			return false;
		} else if (routeName == "cargoAdmin" && role != "CARG") {
			return false;
		} else if (routeName == "forexAdmin" && role != "FEX") {
			return false;
		} else if (routeName == "insuranceAdmin" && role != "INSR") {
			return false;
		} else if (routeName == "taxclearanceAdmin" && role != "TAX") {
			return false;
		} else if (routeName == "reimbursementAdmin" && (role != "REMR" || role != "REBI")) {
			if (mParameters.arguments != null) {
				if (role == "REMR" || role == "REBI") {
					if ((mParameters.arguments.role == "Bino-team" && role == "REMR") ||
						(mParameters.arguments.role == "PE-Accounting" && role == "REBI")) {
						return false;
					}
				} else {
					return false;
				}
			}
		}else if (routeName == "ticketingAdmin" && (role != "TKM" || role != "TKAD")) {
			if (mParameters.arguments != null) {
				if (role == "TKM" || role == "TKAD") {
					if ((mParameters.arguments.user == "Admin" && role == "TKM") ||
						(mParameters.arguments.user == "Manager" && role == "TKAD")) {
						return false;
					}
				} else {
					return false;
				}
			}
		} else if (routeName == "accommodationAdmin" && (role != "ACCO" || role != "ACCD")) {
			if (mParameters.arguments != null) {
				if (role == "ACCO" || role == "ACCD") {
					if ((mParameters.arguments.user == "Admin" && role == "ACCO") ||
						(mParameters.arguments.user == "Manager" && role == "ACCD")) {
						return false;
					}
				} else {
					return false;
				}
			}
		}
/*Changes done by Bharadwaj*/		
		else if (routeName == "VisaAdmin" && role != "VISA") {
			return false;
		}
		else if(routeName=="cardDashBoard" && (role!="MRCR" && role!="DEPM" && role!="FINA" &&role!="MRCA"))
			{
//			if (mParameters.arguments != null) {
//				if (role == "MRCR" || role == "DEPM" || role == "FINA") {
//					if ((mParameters.arguments.role == "PE-Payroll" && role == "MRCR") ||
//						(mParameters.arguments.role == "Deputation Manager" && role == "DEPM")||
//						(mParameters.arguments.role == "Finance" && role == "FINA")) {
//						return false;
//					}
//				} else {
//					return false;
//				}
//			}
			return false;
			}
		else if (routeName == "trsettlelist" && (role != "TRST"&&role!="TRSD")) {
			return false;
		}
		
/*Changes done by Bharadwaj*/
		return true;
	},
	
	setDefaultRadioFromRole : function(selectedRole) {
		var elements = this.menuPopOver.getContent()[1].getItems();
		var roleKeys = sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_POSITION.split(";");
		var roleTxts = sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_ROLE_NAME.split(";");
		var roleText = null;
		for (var i = 0; i < roleKeys.length; i++) {
			if (roleKeys[i] == selectedRole) {
				roleText = roleTxts[i];
			}
		}
		for (var i = 0; i < elements.length; i++) {
			try {
				var text = elements[i].getText();
				if (text == roleText) {
					elements[i].setSelected(true);
					break;
				}
			} catch(exc) {
				continue;
			}
		}
	},
	// Set Account information
	setAccountInfo : function() {
		// If profile model already exists, use it. Otherwise, call ajax
//		this.getView().byId("lblUsername").setText(sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_NAME);

		// Display current role on menu bar
		var roleItems = [];
		var data = {};
		var curRole = sap.ui.getCore().getModel("profile").getData().currentRole;
		if (curRole == "GRM") {
			this.getView().byId("iconSubstitution").setVisible(true);
		} else {
			this.getView().byId("iconSubstitution").setVisible(false);
		}
		var rolesText = sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_ROLE_NAME.split(";");
		var roles = sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_POSITION.split(";");

		/////// ############ 07 Apr 2020 UCD1KOR POC for Repatriation ############////
		// HR-BP, HRL-PP3Roles added form UI side 
		//roles.push("REDP");
		//rolesText.push("HRSIN-Repatriation");
		// roles added
		
		this.getView().byId("roleList").removeAllItems();
		for (var i = 0; i < roles.length; i++) {
			if (roles[i] == "") {
				continue;
			}
			this.getView().byId("roleList").addItem(new sap.ui.core.Item({
				key: roles[i],
				text: rolesText[i]
			}));
			if (curRole == roles[i]) {
				this.getView().byId("roleList").setSelectedKey(roles[i]);
				this.getView().byId("roleList").setTooltip(rolesText[i]);
			}
		}
	},
/*------------------------CUSTOM FUNCTION AREA BEGIN------------------------*/


/*------------------------USER EVENT HANDLER AREA BEGIN------------------------*/
	onDuringTravel : function(evt) {
		sap.ca.ui.message.showMessageBox({
			type: sap.ca.ui.message.Type.ERROR,
			message: "Function in progress",
		});
	},
	onReportPress : function(evt) {
		sap.ui.core.routing.Router.getRouter("MyRouter").navTo("report");
	},
	onTaxReportPress : function(evt) {
		sap.ui.core.routing.Router.getRouter("MyRouter").navTo("taxReport");
	},
	onReimReportPress : function(evt) {
		sap.ui.core.routing.Router.getRouter("MyRouter").navTo("reimReport");
	},
	onTransferPress : function(evt) {
		sap.ui.core.routing.Router.getRouter("MyRouter").navTo("trnsrep");
	},
	
	/////############# UCD1KOR NOV 2,2020 Route for PEExposureReport
	onPEExposureReportPress : function(evt) {
		sap.ui.core.routing.Router.getRouter("MyRouter").navTo("PEExposureReport");
	},

	
	onSlaOutput:function(oEvent){	
	sap.ui.core.routing.Router.getRouter("MyRouter").navTo("InsSlaReport");
	},
/////################ UIK1KOR on 03/12/2020 for business travel report
	onBusinesstravelPress : function(evt)
	{
		sap.ui.core.routing.Router.getRouter("MyRouter").navTo("BusinessTravelReport");
	},	

	onMRPress : function(evt) {
		// sap.ui.core.routing.Router.getRouter("MyRouter").navTo("mrreports");
		var router = sap.ui.core.routing.Router.getRouter("MyRouter");
		var url = router.getURL("mrreports");
		var url1 = window.document.URL.split("#");
		url = url1[0] + "#/" + url;
		window.open(url, "_blank");
	},
	onForexSalesReportPress:function(evt){
		REPORTFOREXTYPE ="SALE";
		var oGlobal = sap.ui.getCore().getModel("global").getData();
		oGlobal.REPORTFOREXTYPE = REPORTFOREXTYPE;
		sap.ui.getCore().getModel("global").setData(oGlobal);
		sap.ui.core.routing.Router.getRouter("MyRouter").navTo("forexsalesreport");
	},
	onForexMasterReportPress:function(evt){
		REPORTFOREXTYPE ="MAST";
		var oGlobal = sap.ui.getCore().getModel("global").getData();
		oGlobal.REPORTFOREXTYPE = REPORTFOREXTYPE;
		sap.ui.getCore().getModel("global").setData(oGlobal);
		sap.ui.core.routing.Router.getRouter("MyRouter").navTo("forexmasterreport");
	},
	onCardReloadReportPress:function(evt){
		sap.ui.core.routing.Router.getRouter("MyRouter").navTo("cardreloadreport");
	},
	onOnsiteAddressReportPress:function(evt) {
		sap.ui.core.routing.Router.getRouter("MyRouter").navTo("onsiteaddressreport");
	},
	onForexEncashmentReportPress:function(evt){

		REPORTFOREXTYPE ="TRST";
		var oGlobal = sap.ui.getCore().getModel("global").getData();
		oGlobal.REPORTFOREXTYPE = REPORTFOREXTYPE;
		sap.ui.getCore().getModel("global").setData(oGlobal);
		sap.ui.core.routing.Router.getRouter("MyRouter").navTo("forexencashmentreport");
	},
	onHomePress : function(evt) {
		sap.ui.core.routing.Router.getRouter("MyRouter").navTo("home");
	},
	onTrstReportPress:function(evt){
		var router = sap.ui.core.routing.Router.getRouter("MyRouter");
		var url = router.getURL("dailyreport");
		var url1 = window.document.URL.split("#");
		url = url1[0] + "#/" + url;
		window.open(url, "_blank");
	},
	onTcktReportPress:function(evt){
		var router = sap.ui.core.routing.Router.getRouter("MyRouter");
		var url = router.getURL("ticketreport");
		var url1 = window.document.URL.split("#");
		url = url1[0] + "#/" + url;
		window.open(url, "_blank");
	},
	onSavingsReportPress:function(evt){
		var router = sap.ui.core.routing.Router.getRouter("MyRouter");
		var url = router.getURL("airsavingsreport");
		var url1 = window.document.URL.split("#");
		url = url1[0] + "#/" + url;
		window.open(url, "_blank");
	},
	onQmmReportPress:function(evt){
		var router = sap.ui.core.routing.Router.getRouter("MyRouter");
		var url = router.getURL("qmmreport",{name:"QMM"});
		var url1 = window.document.URL.split("#");
		url = url1[0] + "#/" + url;
		window.open(url, "_blank");
	},
	onQeiReportPress:function(evt){
		var router = sap.ui.core.routing.Router.getRouter("MyRouter");
		var url = router.getURL("qmmreport",{name:"OEI"});
		var url1 = window.document.URL.split("#");
		url = url1[0] + "#/" + url;
		window.open(url, "_blank");
	},
	onSecoReportPress:function(evt){
		var router = sap.ui.core.routing.Router.getRouter("MyRouter");
		var url = router.getURL("secoadvancereport");
		var url1 = window.document.URL.split("#");
		url = url1[0] + "#/" + url;
		window.open(url, "_blank");
	},
	onSetlUsetlReportPress:function(evt){
		var router = sap.ui.core.routing.Router.getRouter("MyRouter");
		var currentRole = sap.ui.getCore().getModel("profile").getData().currentRole;
		var url = router.getURL("setlusetlreport",{role:Base64.encode(currentRole)});
		var url1 = window.document.URL.split("#");
		url = url1[0] + "#/" + url;
		window.open(url, "_blank");
	},
	onMoreReportPress:function(evt){
		var router = sap.ui.core.routing.Router.getRouter("MyRouter");
		var currentRole = sap.ui.getCore().getModel("profile").getData().currentRole;
		var url = router.getURL("moretrstreport",{role:Base64.encode(currentRole)});
		var url1 = window.document.URL.split("#");
		url = url1[0] + "#/" + url;
		window.open(url, "_blank");
	},
	//uea6kor_22.9.2020 personal trip report
	onPersTripReportPress:function(){
		var router = sap.ui.core.routing.Router.getRouter("MyRouter");
		var currentRole = sap.ui.getCore().getModel("profile").getData().currentRole;
		var url = router.getURL("personaltripreport",{role:Base64.encode(currentRole)});
		var url1 = window.document.URL.split("#");
		url = url1[0] + "#/" + url;
		window.open(url, "_blank");				
	},
	onViewReportPress:function(){
		var router = sap.ui.core.routing.Router.getRouter("MyRouter");
		var url = router.getURL("HRBPReports");
		var url1 = window.document.URL.split("#");
		url = url1[0] + "#/" + url;
		window.open(url, "_blank");				
		
		sap.ui.core.routing.Router.getRouter("MyRouter").navTo("HRBPReports");
	},
	//uea6kor_22.9.2020 personal trip report
	onMisOutput:function(){
		var router = sap.ui.core.routing.Router.getRouter("MyRouter");
		var url = router.getURL("MISReport");
		var url1 = window.document.URL.split("#");
		url = url1[0] + "#/" + url;
		window.open(url, "_blank");
	},
	onSettlementPress : function(evt) {
		var router = sap.ui.core.routing.Router.getRouter("MyRouter");
		var url = router.getURL("SettlementReport");
		var url1 = window.document.URL.split("#");
		url = url1[0] + "#/" + url;
		window.open(url, "_blank");
	},
	
/////############# UCD1KOR NOV 18,2020 Route for MISInsuranceReport
	onMISInsurancePress : function(evt) {
		var router = sap.ui.core.routing.Router.getRouter("MyRouter");
		var url = router.getURL("MISInsuranceReport");
		var url1 = window.document.URL.split("#");
		url = url1[0] + "#/" + url;
		window.open(url, "_blank");
	},
	
	
	onTPViewPDF:function(evt){ //uml6kor 17/1/2020 
		
		if (this.oViewPDFDialog) {
			this.oViewPDFDialog.destroy();
		}
		// instantiate the Fragment if not done yet
		this.oViewPDFDialog = sap.ui.xmlfragment("sap.ui.project.e2etm.fragment.common.ViewTravelPlanPDFDialog",this);

		//sap.ui.getCore().byId("btnDialogRejectCancel").setVisible(false);
		//sap.ui.getCore().byId("ViewPDF").setVisible(true);
		this.oViewPDFDialog.open();
//
//			
	},
	onViewPDFPress:function(){
		var fileUrl;
		var empno = "";
		var tpno =  sap.ui.getCore().byId("linktpno").getValue();
	    var ttype = "";
	    
		if (window.location.hostname == "localhost")
			fileUrl = "proxy/sap/opu/odata/sap/ZE2E_DEP_NWGS_SRV/TravelPdfSet(EmpNo='"+empno+"',TrNo='"+tpno+"',TrvKey='"+ttype+"',Module='REQ')/$value";
		else
			fileUrl = "/sap/opu/odata/sap/ZE2E_DEP_NWGS_SRV/TravelPdfSet(EmpNo='"+empno+"',TrNo='"+tpno+"',TrvKey='"+ttype+"',Module='REQ')/$value";

		//pdflink.setHref(fileUrl);
		window.open(fileUrl, "_blank");

	},//End17/1/2020
	
	onTPViewStat:function(evt){ //uml6kor 10/2/2020 
		
		if (this.oViewPDFDialog) {
			this.oViewPDFDialog.destroy();
		}
		// instantiate the Fragment if not done yet
		this.oViewPDFDialog = sap.ui.xmlfragment("sap.ui.project.e2etm.fragment.common.ViewTravelPlanStatDialog",this);
		this.oViewPDFDialog.open();
//
//			
	},
	onViewStatPress:function(){
		var fileUrl;
		var tpno =  sap.ui.getCore().byId("linktpno").getValue();
		var tp_stat = sServiceUrl + "GetTPStatus?&ZZ_REINR='" +tpno+
		"'&$format=json";
		
		var get = $.ajax({
			cache: false,
			url: tp_stat, 
			type: "GET",
			async: false
		});
		var reinr_status = '';
		get.done(function(result) {
			reinr_status = result.d.GetTPStatus.ZZ_STATUS_DESC;	
		//ucd1kor 10/2/2020 tp status view
			sap.ui.getCore().byId("idTravelStatus").setValue(reinr_status);
		});
		
		

	},//End10/1/2020
	
	onSetlUsetlReportPress:function(evt){
		var router = sap.ui.core.routing.Router.getRouter("MyRouter");
		var currentRole = sap.ui.getCore().getModel("profile").getData().currentRole;
		var url = router.getURL("setlusetlreport",{role:Base64.encode(currentRole)});
		var url1 = window.document.URL.split("#");
		url = url1[0] + "#/" + url;
		window.open(url, "_blank");
	},
	
	onDownloadCl:function(){
		var router = sap.ui.core.routing.Router.getRouter("MyRouter");
		var url = router.getURL("cldownload");
		var url1 = window.document.URL.split("#");
		url = url1[0] + "#/" + url;
		window.open(url, "_blank");
		
	},
	onIssueCl:function(){
		var router = sap.ui.core.routing.Router.getRouter("MyRouter");
		var url = router.getURL("issuecl");
		var url1 = window.document.URL.split("#");
		url = url1[0] + "#/" + url;
		window.open(url, "_blank");
	},
	onUploadMgr:function(){
//		var router = sap.ui.core.routing.Router.getRouter("MyRouter");
//		var url = router.getURL("UploadMgr");
//		var url1 = window.document.URL.split("#");
//		url = url1[0] + "#/" + url;
//		window.open(url, "_blank");
		var uploadMgr =  sap.ui.xmlfragment("sap.ui.project.e2etm.fragment.deputation.COMMON.UploadManagerDetls", this);
		var dialog = new sap.m.Dialog({
			title: 'Upload Manager Details',
			type: 'Message',
			content: uploadMgr,
			beginButton:new sap.m.Button({
				text:"Upload"					
			}).attachPress(this.handleUploadPress,this),
			endButton: new sap.m.Button({
				text: 'Close',
				press: function () {				
					dialog.close();
				}
			}),
			
			afterClose: function() {
				dialog.destroy();
			}
		});
		dialog.open();
	},
	onMonthlyReport:function(){
		var router = sap.ui.core.routing.Router.getRouter("MyRouter");
		var url = router.getURL("depumonthrep");
		var url1 = window.document.URL.split("#");
		url = url1[0] + "#/" + url;
		window.open(url, "_blank");
	},
	onCSGenerate:function(){
		var router = sap.ui.core.routing.Router.getRouter("MyRouter");
		var url = router.getURL("csgenerate");
		var url1 = window.document.URL.split("#");
		url = url1[0] + "#/" + url;
		window.open(url, "_blank");
	},
	onRepatriationReports:function(){
		var router = sap.ui.core.routing.Router.getRouter("MyRouter");
		var url = router.getURL("HRBPReports");
		var url1 = window.document.URL.split("#");
		url = url1[0] + "#/" + url;
		window.open(url, "_blank");
	},
	////////############ UCD1KOR Nov 09 onInlandMISReport ################//////////
	onInlandMISReport:function(){
		var router = sap.ui.core.routing.Router.getRouter("MyRouter");
		var url = router.getURL("InlandMISReport");
		var url1 = window.document.URL.split("#");
		url = url1[0] + "#/" + url;
		window.open(url, "_blank");
	},
	onInlandMISReportPress:function(){
		sap.ui.core.routing.Router.getRouter("MyRouter").navTo("InlandMISReport");
	},

	//<!-- start uml6kor 4/5/2021  RBEIITAPPPIPELINE-1350 (Feedback form) -->
	onFeedBackReport:function()
	{
		var currenTRole = sap.ui.getCore().getModel("profile").getData().currentRole;
		var router = sap.ui.core.routing.Router.getRouter("MyRouter");
		var url = router.getURL("FeedBackReport",{role:currenTRole});
		var url1 = window.document.URL.split("#");
		url = url1[0] + "#/" + url;
		window.open(url, "_blank");
	},
				
	//	<!-- end uml6kor 4/5/2021  RBEIITAPPPIPELINE-1350 (Feedback form) -->
				
	handleUploadPress:function(){
	//	sap.ui.project.e2etm.util.StaticUtility.setBusy(true,this);
		var file = sap.ui.getCore().byId("fileUploader").oFileUpload.files[0];
		var importFile = $.Deferred();
		sap.ui.project.e2etm.util.StaticUtility.setBusy(true, this);
		importFile = sap.ui.project.e2etm.util.StaticUtility.onXLSFileImport(file,"EmpMgrDetlsSet","EmpMgrToMgrNav",oComponent.getModel())
		importFile.done(jQuery.proxy(function(response){
			sap.ui.project.e2etm.util.StaticUtility.setBusy(false, this);
			sap.m.MessageToast.show("Uploaded Successfully");
			 this.fetchDetails();
		},this));
		
		importFile.fail(jQuery.proxy(function(response){
			sap.ui.project.e2etm.util.StaticUtility.setBusy(false, this);
			sap.m.MessageToast.show("Please make use of template provided to upload the data");
			
		},this));
	
	},
	onDownloadTemplate:function(){
		var columns = this.getTemplateColumns();
		sap.ui.project.e2etm.util.StaticUtility.exportCSV(null,new sap.ui.model.json.JSONModel(),"Manager List",columns);
	},
	getTemplateColumns:function(){
		var columns = [{
			name : "Country Grouping_Land1",
	        template : {
				content: "{Land1}"	             
				       }
		}
		, {
			name : "Company Code_Bukrs",
			template : {
				content : "{Bukrs}"
			}
		}, {
			name : "Employee No_Pernr",
			template : {
				content : "{Pernr}"
			}
		},{
			name : "Travel Start Date_Begda",
			template : {
				content : "{Begda}"
			}
		},{
			name : "Travel End Date_Endda",
			template : {
				content : "{Endda}"
			}
		}, {
			name : "Manager1_Mngr1",
			template : {
				content : "{Mngr1}"
			// "{Width} x {Depth} x {Height} {DimUnit}"
			}
		}, {
			name : "Manager2_Mngr2",
			template : {
				content : "{Mngr2}"
			}
		}
		];
		
		return columns;
	
	},
	onBusinessVisaRequest :function(evt){
//		if(this.onRequestCreateValidation()){    //Added by UEA6KOR_9.9.2019 for validating during deputation request creation
			var dialog = new sap.m.Dialog({
				title: 'Business Visa Plan',
				type: 'Message',
				content: new sap.m.Text({ text: "VISA Plan should only be used  to avail 'Business VISA' in advance when Travel Dates are not confirmed. If confirmed travel date is available, create Business Travel request. Do you want to continue ?" }),
				beginButton: new sap.m.Button({
					text: 'Request',
					press: function () {
						sap.ui.core.routing.Router.getRouter("MyRouter").navTo("businessVisaRequest");
						sap.ui.core.routing.Router.getRouter("MyRouter").navTo("VisaRequest");
						dialog.close();
					}
				}),
				endButton: new sap.m.Button({
					text: 'Cancel',
					press: function () {
						dialog.close();
					}
				}),
				afterClose: function() {
					dialog.destroy();
				}
			});
			var globalData = sap.ui.getCore().getModel("global").getData();

			globalData.ZZ_VISA_REQ = "";
			globalData.whichTab = "MT";
			globalData.ZZ_NACTION_BY = "X"; 
			//globalData.ZZ_NACTION_BY = sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_PERNR;
			globalData.ZZ_DEP_PERNR = sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_PERNR;
			sap.ui.getCore().getModel("global").setData(globalData);
			dialog.open();			
//		} //Added by UEA6KOR_9.9.2019

	},

	onTravelRequestCreate : function(evt) {
//		if(this.onRequestCreateValidation()){ //Added by UEA6KOR_9.9.2019 for validating during deputation request creation
			
		 //Added by UEA6KOR_9.9.2019
		var profileData = sap.ui.getCore().getModel("profile").getData();

		// Check supervisor blank
		if (profileData.employeeDetail.ZZ_DEP_GRM == "" || profileData.employeeDetail.ZZ_DEP_GRM == null) {
			sap.ca.ui.message.showMessageBox({
				type: sap.ca.ui.message.Type.ERROR,
				message: "No supervisor available. Please contact HR!",
			});
			return;
		}

		var aData = sap.ui.getCore().getModel("global").getData();
		aData.screenData = {};
		aData.screenData.ZZ_REQ_TYP = "";
		aData.screenData.ZZ_DEP_STDATE = "";
		aData.screenData.ZZ_DEP_ENDATE = "";
		aData.screenData.ZZ_DEP_DAYS = "0";
		aData.screenData.ZZ_DEP_TYPE = "DOME";

		aData.screenData.ZZ_DEP_FRCNTRY = profileData.employeeDetail.ZZ_BASE_CNTRY;
		aData.screenData.ZZ_DEP_FRCNTRY_TXT = profileData.employeeDetail.ZZ_BASE_CNTRY_TXT;

		aData.screenData.ZZ_DEP_TOCNTRY = profileData.employeeDetail.ZZ_BASE_CNTRY;
		aData.screenData.ZZ_DEP_TOCNTRY_TXT = profileData.employeeDetail.ZZ_BASE_CNTRY_TXT;

		aData.screenData.ZZ_DEP_FRMLOC = profileData.employeeDetail.ZZ_BASE_LOC_KEY;
		aData.screenData.ZZ_DEP_FRMLOC_TXT = profileData.employeeDetail.ZZ_BASE_LOC_TXT;

		aData.screenData.ZZ_DEP_TOLOC = profileData.employeeDetail.ZZ_BASE_LOC_KEY;
		aData.screenData.ZZ_DEP_TOLOC_TXT = profileData.employeeDetail.ZZ_BASE_LOC_TXT;

		aData.screenData.ZZ_TRV_CAT = "";
		aData.screenData.ZZ_MIN = 0;
		aData.screenData.ZZ_MAX = 0;
		aData.screenData.ZZ_SP_CMPNY = false;

		var aData = sap.ui.getCore().getModel("global").getData();
		aData.cityfrom = [];
		aData.cityto = [];

		// instantiate the Fragment if not done yet
		try {
			sap.ui.getCore().byId("cbBoxFromCity").destroy();
			sap.ui.getCore().byId("cbBoxToCity").destroy();
			sap.ui.getCore().byId("TravelCategoryId").destroy(false);
			sap.ui.getCore().byId("requestDialog").destroy();
		} catch(exc) {}
		this.oFragmentDialog = sap.ui.xmlfragment("sap.ui.project.e2etm.fragment.common.DeputationDialog", this);
		this.oFragmentDialog.open();
		//################### UCD1KOR 11 July 2021 BUSR Copy Request ###############/////////
		try{
			sap.ui.getCore().byId("idCopyBUSRRequest").setVisible(false);
		}catch(err){}
		sap.ui.getCore().byId("requestDialog").setBusy(true);
		var post = $.ajax({
			cache: false,
			url: sServiceUrl + "DEP_LOCATIONSSet?$filter=MOLGA eq '" + aData.screenData.ZZ_DEP_FRCNTRY + "'&$format=json",
			type: "GET"
		});
		post.done(function(result) {
			if (result != null) {
				sap.ui.getCore().byId("cbBoxFromCity").setSelectedKey(profileData.employeeDetail.ZZ_BASE_LOC_KEY);
				sap.ui.getCore().byId("cbBoxToCity").setSelectedKey(profileData.employeeDetail.ZZ_BASE_LOC_KEY);

				aData.cityfrom = result.d.results;
				aData.cityto = result.d.results;
				sap.ui.getCore().getModel("global").setData(aData);

				//Filter travel of category
				var oTravelCategory = sap.ui.getCore().byId("TravelCategoryId");
				var oFilterBlank = new sap.ui.model.Filter("ZZ_VKEY", sap.ui.model.FilterOperator.EQ,"");
				var oFilterDepu = new sap.ui.model.Filter("ZZ_VKEY", sap.ui.model.FilterOperator.EQ,"DEPU");
				var ofilterBusiness = new sap.ui.model.Filter("ZZ_VKEY", sap.ui.model.FilterOperator.EQ,"BUSR");
				var ofilterTraining = new sap.ui.model.Filter("ZZ_VKEY", sap.ui.model.FilterOperator.EQ,"TRNG");
				var ofilterTransfer = new sap.ui.model.Filter("ZZ_VKEY", sap.ui.model.FilterOperator.EQ,"TRFR");
				var ofilterWork = new sap.ui.model.Filter("ZZ_VKEY", sap.ui.model.FilterOperator.EQ,"WRKP");
				var ofilterSMODID = new sap.ui.model.Filter("ZZ_ZZ_SMODID", sap.ui.model.FilterOperator.EQ,"DOME");
		///////////############ UCD1KOR 8 July 2021 Changes for Domestic Info Travel ###############################//////////////////////
				var ofilterDomeInfo = new sap.ui.model.Filter("ZZ_VKEY", sap.ui.model.FilterOperator.EQ,"INFO");
				var ofilterDomeInfoText = new sap.ui.model.Filter("ZZ_VISA_DESC", sap.ui.model.FilterOperator.Contains, "Domestic Info Travel");

				var ofilterLocation = new sap.ui.model.Filter("ZZ_VISA_DESC", sap.ui.model.FilterOperator.Contains, "Within");
				var ofilterLocation1 = new sap.ui.model.Filter("ZZ_VISA_DESC", sap.ui.model.FilterOperator.Contains, "Business");
				var ofilterLocation2 = new sap.ui.model.Filter("ZZ_VISA_DESC", sap.ui.model.FilterOperator.Contains, "Transfer");
				oTravelCategory.getBinding("items").filter([oFilterBlank,oFilterDepu,ofilterBusiness,ofilterDomeInfo,ofilterDomeInfoText,
				                                            ofilterTraining,ofilterTransfer,ofilterWork,
				                                            ofilterSMODID,ofilterLocation,ofilterLocation1,ofilterLocation2], 
				                                            sap.ui.model.FilterType.Application);
				aData.screenData.ZZ_TRV_CAT = oTravelCategory.getSelectedKey();

				sap.ui.getCore().byId("requestDialog").setBusy(false);
			}
		});
//	}
	},
	////############## UCD1KOR 11 July 2021 Changes for BUSR Copy ################////
	onSelectCreateCopySwitch:function(evt){
		var selectedOption = sap.ui.getCore().byId("idCreateCopySwitch").getState();
		if(selectedOption == true){
			sap.ui.getCore().byId("idCopyBUSRRequest").setVisible(true);
		}else{
			sap.ui.getCore().byId("idCopyBUSRRequest").setVisible(false);
		}
		
	},

	onSelectDepuType : function(evt) {
		var aData = sap.ui.getCore().getModel("profile").getData();
		aData.selectedDepuType = evt.getSource().getText();
		sap.ui.getCore().getModel("profile").setData(aData);
		sap.ui.core.routing.Router.getRouter("MyRouter").navTo("deputation");
	},

	onLogout : function() {
		eraseCookie(di0Cookie);
		if (!document.execCommand("ClearAuthenticationCache")) {  
			//"ClearAuthenticationCache" will work only for IE. Below code for other browsers  
			$.ajax({
				cache: false,
				type: "GET",  
				url: sServiceUrl + "DEP_EMPSet",
				dataType: 'json', //any URL to a Gateway service  
				username: 'dummy', //dummy credentials: when request fails, will clear the authentication header  
				password: 'dummy',  
				statusCode: { 401: function() {
					//This empty handler function will prevent authentication pop-up in chrome/firefox
					sap.ui.getCore().setModel(null, "profile");
					window.location = "logout.html";
				} },  
				error: function() {  
					//alert('reached error of wrong username password')  
				} 
			}); 
		} else {
			window.location = "logout.html";
		}
	},

	onEmployeeDetails : function(curEvt) {
		var globalData = sap.ui.getCore().getModel("global").getData();
		globalData.isProfileView = true;
		sap.ui.getCore().getModel("global").setData(globalData);
		sap.ui.project.e2etm.util.StaticUtility.openProfileDialog(this, this.getView());
	},

	handleChangeRole : function(evt) {
		// Profile data
		var aData = sap.ui.getCore().getModel("profile").getData();
		var curRole = aData.currentRole;
		var targetRole = "";
		// Get list of role keys and role descriptions
		var roleKeys = aData.employeeDetail.ZZ_POSITION.split(";");
		var roleTxts = aData.employeeDetail.ZZ_ROLE_NAME.split(";");
		
		targetRole = this.getView().byId("roleList").getSelectedItem().getKey();
		if (targetRole == curRole) {
			return;
		}
		
		// Set the targetRole to the profile model data
		aData.currentRole = targetRole;
		sap.ui.getCore().getModel("profile").setData(aData);
		
		// Routing to the correct URL based on targetRole
		if (targetRole == "TKAD") {
			sap.ui.core.routing.Router.getRouter("MyRouter").navTo("ticketingAdmin",{user:"Admin"});
		} else if (targetRole == "INSR") {
			sap.ui.core.routing.Router.getRouter("MyRouter").navTo("insuranceAdmin");
		} else if (targetRole == "CARG") {
			sap.ui.core.routing.Router.getRouter("MyRouter").navTo("cargoAdmin");
		} else if (targetRole == "TKM") {
			sap.ui.core.routing.Router.getRouter("MyRouter").navTo("ticketingAdmin",{user:"Manager"});
		} else if (targetRole == "FEX") {
			sap.ui.core.routing.Router.getRouter("MyRouter").navTo("forexAdmin");
		} else if (targetRole == "MRCR"){
			sap.ui.core.routing.Router.getRouter("MyRouter").navTo("cardDashBoard",{role:"PE-Payroll Approver"});
		} else if (targetRole == "MRCA"){
			sap.ui.core.routing.Router.getRouter("MyRouter").navTo("cardDashBoard",{role:"PE-Payroll Reviewer"});
        }else if (targetRole == "FINA") {
			sap.ui.core.routing.Router.getRouter("MyRouter").navTo("cardDashBoard",{role:"Finance"});
		} else if (targetRole == "DEPM") {
			sap.ui.core.routing.Router.getRouter("MyRouter").navTo("cardDashBoard",{role:"Deputation Manager"});
		} else if (targetRole == "ACCD") {
			sap.ui.core.routing.Router.getRouter("MyRouter").navTo("accommodationAdmin",{user:"Admin"});
		} else if (targetRole == "ACCO") {
			sap.ui.core.routing.Router.getRouter("MyRouter").navTo("accommodationAdmin",{user:"Manager"});
		}else if (targetRole == "VISA") {
			sap.ui.core.routing.Router.getRouter("MyRouter").navTo("VisaAdmin");
		}else if (targetRole == "TAX") {
			sap.ui.core.routing.Router.getRouter("MyRouter").navTo("taxclearanceAdmin");
		}else if (targetRole == "TRST" || targetRole=="TRSD") {
			sap.ui.core.routing.Router.getRouter("MyRouter").navTo("trsettlelist");
		} else if (targetRole=="REMR"  ) {
			sap.ui.core.routing.Router.getRouter("MyRouter").navTo("reimbursementAdmin",{role:"PE-Accounting"});
		}else if (targetRole=="REBI" ) {
			sap.ui.core.routing.Router.getRouter("MyRouter").navTo("reimbursementAdmin",{role:"Bino-team"});
		}else if(targetRole=="MHLD"){
			sap.ui.core.routing.Router.getRouter("MyRouter").navTo("SimCard");
		}else if(targetRole=="ONRG"){
			sap.ui.core.routing.Router.getRouter("MyRouter").navTo("Registration");
		}else if(targetRole=="REDP"){
			sap.ui.core.routing.Router.getRouter("MyRouter").navTo("RepDashboard");
		}
	/////################# 07 Apr 2020 UCD1KOR POC for HR-BP, HRL-PP3 roles dashboard ################//////
		else if(targetRole=="REBP" || targetRole=="REPP"){
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
				//var action = profile.employeeDetail.ZZ_DEP_PERNR;
			}
			
			var hrbpModel = new sap.ui.model.json.JSONModel();
	        var filterURL =  "RepatriationSet?$filter=ZZ_NEXTACTION eq '" +action+"'" ;
	    	oDataModel.read(filterURL, null, null, true, function(oData, response) {
	    		sap.ui.core.BusyIndicator.hide();
	    		hrbpModel.setData(oData);
	    		oThis.getView().setModel(hrbpModel,"hrbp");
	    		sap.ui.getCore().setModel(hrbpModel,"hrbp");
	    		sap.ui.core.routing.Router.getRouter("MyRouter").navTo("HRBPDashboard");
			}, function(error) {
				sap.m.MessageToast.show("Internal Server Error");
				sap.ui.core.BusyIndicator.hide();
			});
		}
		
		else {
			if (curRole == "TKAD" || curRole == "INSR" || curRole == "CARG" || curRole == "TAX" ||curRole == "REBP" || curRole == "REPP"||
					curRole == "TKM" || curRole == "FEX" || curRole == "MRCR" || curRole=="MRCA" || curRole == "DEPM" || curRole == "REDP" ||
					curRole == "FINA" || curRole == "ACCO" || curRole == "ACCD" || curRole == "VISA"||curRole=="TRST"||curRole=="REMR"||curRole=="REBI"||curRole=="TRSD" || curRole=="MHLD" || curRole=="ONRG") {
					
				sap.ui.core.routing.Router.getRouter("MyRouter").navTo("home");
			} else {
				this.loadMenuView();
				if (this.menuPopOver) {
					this.menuPopOver.close();
				}
				oHomeThis.loadHomeView();
			}
		}
	},

	onCountryFromChange : function(curEvt) {
		sap.ui.getCore().byId("requestDialog").setBusy(true);
		var aData = sap.ui.getCore().getModel("global").getData();
		aData.screenData.ZZ_DEP_FRCNTRY_TXT = curEvt.oSource.getSelectedItem().getText();
		aData.cityfrom = [];
		var post = $.ajax({
			cache: false,
			url: sServiceUrl + "DEP_LOCATIONSSet?$filter=MOLGA eq '" + curEvt.oSource.getSelectedKey() + "'&$format=json",
			type: "GET"
		});
		post.done(function(result){
			if (result != null) {
				aData.cityfrom = result.d.results;
				sap.ui.getCore().getModel("global").setData(aData);
			}
			sap.ui.getCore().byId("requestDialog").setBusy(false);
		});

		//Filter travel of category
		var oTravelCategory = sap.ui.getCore().byId("TravelCategoryId");
		var oFilterBlank = new sap.ui.model.Filter("ZZ_VKEY", sap.ui.model.FilterOperator.EQ,"");
		var oFilterDepu = new sap.ui.model.Filter("ZZ_VKEY", sap.ui.model.FilterOperator.EQ,"DEPU");
		var ofilterBusiness = new sap.ui.model.Filter("ZZ_VKEY", sap.ui.model.FilterOperator.EQ,"BUSR");
		var ofilterInfo = new sap.ui.model.Filter("ZZ_VKEY", sap.ui.model.FilterOperator.EQ,"INFO");
		var ofilterTraining = new sap.ui.model.Filter("ZZ_VKEY", sap.ui.model.FilterOperator.EQ,"TRNG");
		var ofilterTransfer = new sap.ui.model.Filter("ZZ_VKEY", sap.ui.model.FilterOperator.EQ,"TRFR");
		var ofilterWork = new sap.ui.model.Filter("ZZ_VKEY", sap.ui.model.FilterOperator.EQ,"WRKP");
		var smodID = "DOME";
		if (aData.screenData.ZZ_DEP_FRCNTRY == aData.screenData.ZZ_DEP_TOCNTRY) {
			smodID = "DOME";
		} else {
			smodID = "INTL";
		}
		var ofilterSMODID = new sap.ui.model.Filter("ZZ_ZZ_SMODID", sap.ui.model.FilterOperator.EQ, smodID);
		var within = "Within";
		if (aData.screenData.ZZ_DEP_FRCNTRY == aData.screenData.ZZ_DEP_TOCNTRY) {
			if(aData.screenData.ZZ_DEP_TOCNTRY != "NP") {
				if (aData.screenData.ZZ_DEP_FRMLOC == aData.screenData.ZZ_DEP_TOLOC) {
					within = "Within";
				} else {
					within = "Outside";
				}
			} else {
				within = "Outside";
			}
		} else {
			within = "";
		}
///////////############ UCD1KOR 8 July 2021 Changes for Domestic Info Travel ###############################//////////////////////
		if(smodID == "DOME"){
			var ofilterDomeInfo = new sap.ui.model.Filter("ZZ_VKEY", sap.ui.model.FilterOperator.EQ,"INFO");
			var ofilterDomeInfoText = new sap.ui.model.Filter("ZZ_VISA_DESC", sap.ui.model.FilterOperator.Contains, "Domestic Info Travel");
			var ofilterLocation = new sap.ui.model.Filter("ZZ_VISA_DESC", sap.ui.model.FilterOperator.Contains, within);
			var ofilterLocation1 = new sap.ui.model.Filter("ZZ_VISA_DESC", sap.ui.model.FilterOperator.Contains, "Business");
			var ofilterLocation2 = new sap.ui.model.Filter("ZZ_VISA_DESC", sap.ui.model.FilterOperator.Contains, "Transfer");
			oTravelCategory.getBinding("items").filter([oFilterBlank,oFilterDepu,ofilterBusiness, ofilterInfo,ofilterDomeInfo,ofilterDomeInfoText,
			                                            ofilterTraining,ofilterTransfer,ofilterWork,
			                                            ofilterSMODID,ofilterLocation,ofilterLocation1,ofilterLocation2], 
			                                            sap.ui.model.FilterType.Application);
		}
		else{
			var ofilterLocation = new sap.ui.model.Filter("ZZ_VISA_DESC", sap.ui.model.FilterOperator.Contains, within);
			var ofilterLocation1 = new sap.ui.model.Filter("ZZ_VISA_DESC", sap.ui.model.FilterOperator.Contains, "Business");
			var ofilterLocation2 = new sap.ui.model.Filter("ZZ_VISA_DESC", sap.ui.model.FilterOperator.Contains, "Transfer");
			oTravelCategory.getBinding("items").filter([oFilterBlank,oFilterDepu,ofilterBusiness, ofilterInfo,
			                                            ofilterTraining,ofilterTransfer,ofilterWork,
			                                            ofilterSMODID,ofilterLocation,ofilterLocation1,ofilterLocation2], 
			                                            sap.ui.model.FilterType.Application);
		}
		
	},

	onCountryToChange : function(curEvt) {
		sap.ui.getCore().byId("requestDialog").setBusy(true);
		var aData = sap.ui.getCore().getModel("global").getData();
		aData.screenData.ZZ_DEP_TOCNTRY_TXT = curEvt.oSource.getSelectedItem().getText();
		aData.cityto = [];
		var post = $.ajax({
			cache: false,
			url: sServiceUrl + "DEP_LOCATIONSSet?$filter=MOLGA eq '" + curEvt.oSource.getSelectedKey() + "'&$format=json",
			type: "GET"
		});
		post.done(function(result){
			if (result != null) {
				aData.cityto = result.d.results;
				if(aData.screenData.ZZ_DEP_TOCNTRY != "NP") {
					if (aData.screenData.ZZ_DEP_FRCNTRY == aData.screenData.ZZ_DEP_TOCNTRY) {
						aData.screenData.ZZ_DEP_TYPE = "DOME";
					} else {
						aData.screenData.ZZ_DEP_TYPE = "INTL";
					}
				} else {
					aData.screenData.ZZ_DEP_TYPE = "DOME";
				}

				sap.ui.getCore().getModel("global").setData(aData);
			}
			sap.ui.getCore().byId("requestDialog").setBusy(false);
		});
		//Filter travel of category
		var oTravelCategory = sap.ui.getCore().byId("TravelCategoryId");
		var oFilterBlank = new sap.ui.model.Filter("ZZ_VKEY", sap.ui.model.FilterOperator.EQ,"");
		var oFilterDepu = new sap.ui.model.Filter("ZZ_VKEY", sap.ui.model.FilterOperator.EQ,"DEPU");
		var ofilterBusiness = new sap.ui.model.Filter("ZZ_VKEY", sap.ui.model.FilterOperator.EQ,"BUSR");
		var ofilterInfo = new sap.ui.model.Filter("ZZ_VKEY", sap.ui.model.FilterOperator.EQ,"INFO");
		var ofilterTraining = new sap.ui.model.Filter("ZZ_VKEY", sap.ui.model.FilterOperator.EQ,"TRNG");
		var ofilterTransfer = new sap.ui.model.Filter("ZZ_VKEY", sap.ui.model.FilterOperator.EQ,"TRFR");
			
		/// hide data For Russia ucd1kor 24/2/2020
		var selectedCountry = curEvt.oSource.getSelectedKey();
		if(selectedCountry =="RU"){
			var ofilterWork = new sap.ui.model.Filter("ZZ_VISA_DESC", sap.ui.model.FilterOperator.NE,"Work");
		}
		else{
			var ofilterWork = new sap.ui.model.Filter("ZZ_VKEY", sap.ui.model.FilterOperator.EQ,"WRKP");
		}
		/// hide data For Russia ucd1kor 24/2/2020
		
		var smodID = "DOME";
		if (aData.screenData.ZZ_DEP_FRCNTRY == aData.screenData.ZZ_DEP_TOCNTRY || aData.screenData.ZZ_DEP_TOCNTRY == "NP") {
			smodID = "DOME";
		} else {
			smodID = "INTL";
		}

		var ofilterSMODID = new sap.ui.model.Filter("ZZ_ZZ_SMODID", sap.ui.model.FilterOperator.EQ, smodID);
		var within = "Within";
		if (aData.screenData.ZZ_DEP_FRCNTRY == aData.screenData.ZZ_DEP_TOCNTRY) {
			if(aData.screenData.ZZ_DEP_TOCNTRY != "NP") {
				if (aData.screenData.ZZ_DEP_FRMLOC == aData.screenData.ZZ_DEP_TOLOC) {
					within = "Within";
				} else {
					within = "Outside";
				}
			} else {
				within = "Outside";
			}
		} else {
			within = "";
		}
		if (smodID == "INTL") {
			within = "";
		}
		///////////############ UCD1KOR 8 July 2021 Changes for Domestic Info Travel ###############################//////////////////////
		if(smodID == "DOME"){
			var ofilterDomeInfo = new sap.ui.model.Filter("ZZ_VKEY", sap.ui.model.FilterOperator.EQ,"INFO");
			var ofilterDomeInfoText = new sap.ui.model.Filter("ZZ_VISA_DESC", sap.ui.model.FilterOperator.Contains, "Domestic Info Travel");
			var ofilterLocation = new sap.ui.model.Filter("ZZ_VISA_DESC", sap.ui.model.FilterOperator.Contains, within);
			var ofilterLocation1 = new sap.ui.model.Filter("ZZ_VISA_DESC", sap.ui.model.FilterOperator.Contains, "Business");
			var ofilterLocation2 = new sap.ui.model.Filter("ZZ_VISA_DESC", sap.ui.model.FilterOperator.Contains, "Transfer");
			oTravelCategory.getBinding("items").filter([oFilterBlank,oFilterDepu,ofilterBusiness, ofilterInfo,ofilterDomeInfo,ofilterDomeInfoText,
			                                            ofilterTraining,ofilterTransfer,ofilterWork,
			                                            ofilterSMODID,ofilterLocation,ofilterLocation1,ofilterLocation2], 
			                                            sap.ui.model.FilterType.Application);
		}else{
		var ofilterLocation = new sap.ui.model.Filter("ZZ_VISA_DESC", sap.ui.model.FilterOperator.Contains, within);
		var ofilterLocation1 = new sap.ui.model.Filter("ZZ_VISA_DESC", sap.ui.model.FilterOperator.Contains, "Business");
		var ofilterLocation2 = new sap.ui.model.Filter("ZZ_VISA_DESC", sap.ui.model.FilterOperator.Contains, "Transfer");
		oTravelCategory.getBinding("items").filter([oFilterBlank,oFilterDepu,ofilterBusiness, ofilterInfo,
		                                            ofilterTraining,ofilterTransfer,ofilterWork,
		                                            ofilterSMODID,ofilterLocation,ofilterLocation1,ofilterLocation2], 
		                                            sap.ui.model.FilterType.Application);
		}
		
	

		
		
		
		
		var now = new Date();
		var fiftyYears = new Date();
		fiftyYears.setYear(now.getFullYear() + 50);
		
		Date.prototype.yyyymmdd = function() {
			var yyyy = this.getFullYear().toString();
			var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
			var dd  = this.getDate().toString();
			return yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]); // padding
		};
		
		if (smodID != "DOME" || aData.screenData.ZZ_TRV_CAT != "TRFR") {
			if (aData.screenData.ZZ_DEP_ENDATE == fiftyYears.yyyymmdd()) {
				aData.screenData.ZZ_DEP_ENDATE = "";
			}
			sap.ui.getCore().byId("dpEndDate").setEnabled(true);
		} else {
			if (aData.screenData.ZZ_TRV_CAT == "TRFR" && smodID == "DOME") {
				aData.screenData.ZZ_DEP_ENDATE = fiftyYears.yyyymmdd();
				sap.ui.getCore().byId("dpEndDate").setEnabled(false);
			} else {
				if (aData.screenData.ZZ_DEP_ENDATE == fiftyYears.yyyymmdd()) {
					aData.screenData.ZZ_DEP_ENDATE = "";
				}
				sap.ui.getCore().byId("dpEndDate").setEnabled(true);
			}
		}
	},

	onLocationChange : function(curEvt) {
		var aData = sap.ui.getCore().getModel("global").getData();

		//Filter travel of category
		var oTravelCategory = sap.ui.getCore().byId("TravelCategoryId");
		var oFilterBlank = new sap.ui.model.Filter("ZZ_VKEY", sap.ui.model.FilterOperator.EQ,"");
		var oFilterDepu = new sap.ui.model.Filter("ZZ_VKEY", sap.ui.model.FilterOperator.EQ,"DEPU");
		var ofilterBusiness = new sap.ui.model.Filter("ZZ_VKEY", sap.ui.model.FilterOperator.EQ,"BUSR");
		var ofilterInfo = new sap.ui.model.Filter("ZZ_VKEY", sap.ui.model.FilterOperator.EQ,"INFO");
		var ofilterTraining = new sap.ui.model.Filter("ZZ_VKEY", sap.ui.model.FilterOperator.EQ,"TRNG");
		var ofilterTransfer = new sap.ui.model.Filter("ZZ_VKEY", sap.ui.model.FilterOperator.EQ,"TRFR");
		var ofilterWork = new sap.ui.model.Filter("ZZ_VKEY", sap.ui.model.FilterOperator.EQ,"WRKP");
		
		/// hide data For Russia uml6kor 23/3/2020
		if(aData.screenData.ZZ_DEP_TOCNTRY =="RU"){
		   var ofilterWork = new sap.ui.model.Filter("ZZ_VISA_DESC", sap.ui.model.FilterOperator.NE,"Work");
		}
		else{
			var ofilterWork = new sap.ui.model.Filter("ZZ_VKEY", sap.ui.model.FilterOperator.EQ,"WRKP");
		}
		/// hide data For Russia uml6kor 23/3/2020
		
		var smodID = "DOME";
		if (aData.screenData.ZZ_DEP_FRCNTRY == aData.screenData.ZZ_DEP_TOCNTRY || aData.screenData.ZZ_DEP_TOCNTRY == "NP") {
			smodID = "DOME";
		} else {
			smodID = "INTL";
		}
		var ofilterSMODID = new sap.ui.model.Filter("ZZ_ZZ_SMODID", sap.ui.model.FilterOperator.EQ, smodID);

		var within = "Within";
		if (aData.screenData.ZZ_DEP_FRCNTRY == aData.screenData.ZZ_DEP_TOCNTRY) {
			if(aData.screenData.ZZ_DEP_TOCNTRY != "NP") {
				if (aData.screenData.ZZ_DEP_FRMLOC == aData.screenData.ZZ_DEP_TOLOC) {
					within = "Within";
				} else {
					within = "Outside";
				}
			} else {
				within = "Outside";
			}
		} else {
			within = "";
		}
		/////////############ UCD1KOR 8 July 2021 changes #################///////
		if(smodID == "DOME"){
			var ofilterDomeInfo = new sap.ui.model.Filter("ZZ_VKEY", sap.ui.model.FilterOperator.EQ,"INFO");
			var ofilterDomeInfoText = new sap.ui.model.Filter("ZZ_VISA_DESC", sap.ui.model.FilterOperator.Contains, "Domestic Info Travel");
			var ofilterLocation = new sap.ui.model.Filter("ZZ_VISA_DESC", sap.ui.model.FilterOperator.Contains, within);
			var ofilterLocation1 = new sap.ui.model.Filter("ZZ_VISA_DESC", sap.ui.model.FilterOperator.Contains, "Business");
			var ofilterLocation2 = new sap.ui.model.Filter("ZZ_VISA_DESC", sap.ui.model.FilterOperator.Contains, "Transfer");
			oTravelCategory.getBinding("items").filter([oFilterBlank,oFilterDepu,ofilterBusiness,ofilterInfo,ofilterDomeInfo,ofilterDomeInfoText,
			                                            ofilterTraining,ofilterTransfer,ofilterWork,
			                                            ofilterSMODID,ofilterLocation,ofilterLocation1,ofilterLocation2], 
			                                            sap.ui.model.FilterType.Application);
		}
		else{

			var ofilterLocation = new sap.ui.model.Filter("ZZ_VISA_DESC", sap.ui.model.FilterOperator.Contains, within);
			var ofilterLocation1 = new sap.ui.model.Filter("ZZ_VISA_DESC", sap.ui.model.FilterOperator.Contains, "Business");
			var ofilterLocation2 = new sap.ui.model.Filter("ZZ_VISA_DESC", sap.ui.model.FilterOperator.Contains, "Transfer");
			oTravelCategory.getBinding("items").filter([oFilterBlank,oFilterDepu,ofilterBusiness,ofilterInfo,
			                                            ofilterTraining,ofilterTransfer,ofilterWork,
			                                            ofilterSMODID,ofilterLocation,ofilterLocation1,ofilterLocation2], 
			                                            sap.ui.model.FilterType.Application);
		
		}
		
		
		
	},

	onCategoryChange : function(curEvt) {
		var globalData = sap.ui.getCore().getModel("global").getData().screenData;
		if (globalData.ZZ_TRV_CAT == "TRFR" && globalData.ZZ_DEP_TYPE == "DOME") {
			//######## UCD1KOR 9 July 2021 commented below code #############////
			/*var now = new Date();
			var fiftyYears = new Date();
			fiftyYears.setYear(now.getFullYear() + 50);
			
			Date.prototype.yyyymmdd = function() {
				var yyyy = this.getFullYear().toString();
				var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
				var dd  = this.getDate().toString();
				return yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]); // padding
			};
			
			globalData.ZZ_DEP_ENDATE = fiftyYears.yyyymmdd();
			sap.ui.getCore().byId("dpEndDate").setEnabled(false);*/
		////########### UCD1KOR 9 July 2021 DOME-TRFR ################////////
			var aData = sap.ui.getCore().getModel("global").getData();
			if (aData.screenData.ZZ_TRV_CAT == "TRFR" && aData.screenData.ZZ_DEP_TYPE == "DOME") {
				aData.screenData.ZZ_DEP_ENDATE = aData.screenData.ZZ_DEP_STDATE;
				aData.screenData.ZZ_DEP_ENDATE_VALUE = aData.screenData.ZZ_DEP_STDATE_VALUE;
				sap.ui.getCore().getModel("global").refresh();
			}
			sap.ui.getCore().byId("dpEndDate").setEnabled(false);
		} else {
			//globalData.ZZ_DEP_ENDATE = "";
			sap.ui.getCore().byId("dpEndDate").setEnabled(true);
		}
	////########### UCD1KOR 14 July 2021 Changes BUSR Copy ################////////
		if(curEvt.getSource().getSelectedItem().getKey() == "BUSR" || curEvt.getSource().getSelectedItem().getKey() == "INFO"){
			sap.ui.getCore().byId("idCreateCopySwitch").setVisible(true);
			sap.ui.getCore().byId("idCopyText").setVisible(true);
		}
		else{
			sap.ui.getCore().byId("idCreateCopySwitch").setVisible(false);
			sap.ui.getCore().byId("idCopyText").setVisible(false);
			sap.ui.getCore().byId("idCopyBUSRRequest").setVisible(false);
			sap.ui.getCore().byId("idCreateCopySwitch").setState(false);
		}
	},
	
	covid_19COnditionCheck:function(aData){
		if(aData.ZZ_TRV_CAT =="WRKP" && aData.ZZ_DEP_TYPE =="INTL"){
			return 183;
			}
			else if(aData.ZZ_TRV_CAT =="WRKP" && aData.ZZ_DEP_TYPE =="DOME"){
			return 9999;
			}
			else if(aData.ZZ_TRV_CAT =="TRNG" ){
				return  90;
			}
			else if(aData.ZZ_TRV_CAT =="TRFR"  && aData.ZZ_DEP_TYPE =="INTL" ){
				return  4380;
			}
			else if(aData.ZZ_TRV_CAT =="TRFR" && aData.ZZ_DEP_TYPE =="DOME"){
				return  9999;
			}
			else if(aData.ZZ_TRV_CAT =="INFO" ){
				return  7;
			}
			else if(aData.ZZ_TRV_CAT =="HOME" || aData.ZZ_TRV_CAT =="ERMR" || aData.ZZ_TRV_CAT =="SECO" ){
				return  30;
			}else if(aData.ZZ_TRV_CAT =="BUSR" && aData.ZZ_DEP_TYPE =="INTL"){
				return  90;
			}
			else if(aData.ZZ_TRV_CAT =="BUSR" && aData.ZZ_DEP_TYPE =="DOME"){
				return  89;
			}
		
	},
	onDeputationDateChange:function(evt){
		//UCD1KOR Validation for RetirementDate
		// 29 Jan 2021
		var aData = sap.ui.getCore().getModel("global").getData();
		var rDate = sap.ui.getCore().getModel("profile").getData().employeeDetail.RetirementDate;
		if(rDate !==""){
			try{
				var RetirementDate = new Date(rDate.substr(0,4), rDate.substr(4,2)-1, rDate.substr(6,2));
			}catch(err){}
		}
		
		
		var sStart = new Date(aData.screenData.ZZ_DEP_STDATE.substr(0,4), aData.screenData.ZZ_DEP_STDATE.substr(4,2)-1, aData.screenData.ZZ_DEP_STDATE.substr(6,2));
		var dEnd = new Date(aData.screenData.ZZ_DEP_ENDATE.substr(0,4), aData.screenData.ZZ_DEP_ENDATE.substr(4,2)-1, aData.screenData.ZZ_DEP_ENDATE.substr(6,2));
		
		if(RetirementDate && (dEnd > RetirementDate || sStart > RetirementDate)){
			if(evt.getSource().getId() == "dpEndDate"){
				aData.screenData.ZZ_DEP_ENDATE = "";
				aData.screenData.ZZ_DEP_ENDATE_VALUE = ""
			}
			else{
				aData.screenData.ZZ_DEP_STDATE = "";
				aData.screenData.ZZ_DEP_STDATE_VALUE = ""
			}
			err = "The entered date is beyond your retirement date. Please correct.";
			sap.ca.ui.message.showMessageBox({
				type: sap.ca.ui.message.Type.ERROR,
				message: err,
				details: err
			});
			sap.ui.getCore().getModel("global").refresh();
			return;
		}
	////########### UCD1KOR 9 July 2021 DOME-TRFR ################////////
		if (aData.screenData.ZZ_TRV_CAT == "TRFR" && aData.screenData.ZZ_DEP_TYPE == "DOME") {
			aData.screenData.ZZ_DEP_ENDATE = aData.screenData.ZZ_DEP_STDATE;
			aData.screenData.ZZ_DEP_ENDATE_VALUE = aData.screenData.ZZ_DEP_STDATE_VALUE;
			sap.ui.getCore().getModel("global").refresh();
		}
	},
	
	onNextButtonClick : function(curEvt) {
		var that= this;
		var aData = sap.ui.getCore().getModel("global").getData();
		var err = "";
		//############# UCD1KOR 12 July Changes BUSR Copy #####################//
		var selectedOption = sap.ui.getCore().byId("idCreateCopySwitch").getState();
		if(selectedOption == true){
			aData.isCopy = true;
			var oList = sap.ui.getCore().byId("idCopyReqList");
	        var contexts = oList.getSelectedContexts();
	        if(contexts.length == 0){
	        	sap.ca.ui.message.showMessageBox({
					type: sap.ca.ui.message.Type.ERROR,
					message: "Select Request to copy data..!!"
				});
	        	return;
	        }
	        var entity = contexts.map(function(c) {
	            return c.getObject();
	        });
	        var copyGeneral = sap.ui.getCore().byId("idCopyGeneralData").getSelected();
	        var copyTravelDetails = sap.ui.getCore().byId("idCopyTravelDetails").getSelected();
	        var copyCostAssignment = sap.ui.getCore().byId("idCopyCostAssignment").getSelected();
	        var copyAdvance = sap.ui.getCore().byId("idCopyAdvance").getSelected();
	        if(copyGeneral == true){
	        	aData.copyGeneral = true;
	        }else{
	        	aData.copyGeneral = false;
	        }
	        if(copyTravelDetails == true){
	        	aData.copyTravelDetails = true;
	        }else{
	        	aData.copyTravelDetails = false;
	        }
	        if(copyCostAssignment == true){
	        	aData.copyCostAssignment = true;
	        }else{
	        	aData.copyCostAssignment = false;
	        }
	        if(copyAdvance == true){
	        	aData.copyAdvance = true;
	        }else{
	        	aData.copyAdvance = false;
	        }
	        
			aData.ZZ_DEP_REQ = entity[0].ZZ_DEP_REQ;
			aData.ZZ_REQ_TYP = "BUSR";
			aData.ZZ_REQ_TYP1 = entity[0].ZZ_REQ_TYP;
			aData.ZZ_TRV_CAT = entity[0].ZZ_TRV_CAT;
			aData.ZZ_DEP_TYPE = entity[0].ZZ_DEP_TYPE;
			aData.ZZ_DEP_SUB_TYPE = entity[0].ZZ_DEP_SUB_TYPE;
			aData.ZZ_DEP_PERNR = entity[0].ZZ_DEP_PERNR;
			aData.ZZ_VREASON = entity[0].ZZ_VREASON;
			aData.ZZ_VERSION = entity[0].ZZ_VERSION;
			aData.ZZ_TRV_REQ = entity[0].ZZ_TRV_REQ;
			aData.ZZ_DEP_TYPE = entity[0].ZZ_DEP_TYPE;
			aData.ZZ_STAT_FLAG = entity[0].ZZ_STAT_FLAG;
			aData.ZZ_TRV_CAT = entity[0].ZZ_TRV_CAT;
			aData.ZZ_DEP_TOCNTRY = aData.screenData.ZZ_DEP_TOCNTRY;
			aData.ZZ_DEP_TOLOC = aData.screenData.ZZ_DEP_TOLOC;
			aData.ZZ_DEP_TOLOC_TXT = aData.screenData.ZZ_DEP_TOLOC_TXT;
			aData.ZZ_DEP_FRCNTRY = aData.screenData.ZZ_DEP_FRCNTRY;
			aData.ZZ_DEP_FRMLOC = aData.screenData.ZZ_DEP_FRMLOC;
			aData.ZZ_DEP_FRMLOC_TXT = aData.screenData.ZZ_DEP_FRMLOC_TXT;
			aData.ZZ_TRV_REQ = entity[0].ZZ_TRV_REQ;
			aData.ZZ_FSTL = entity[0].ZZ_FSTL;
			aData.ZZ_GEBER = entity[0].ZZ_GEBER;
			aData.ZZ_VREASON = entity[0].ZZ_VREASON;
			aData.ZZ_COMMENTS = entity[0].ZZ_COMMENTS;
			aData.ZZ_VERSION = entity[0].ZZ_VERSION;
		}

		if( (aData.screenData.ZZ_TRV_CAT == "BUSR" || aData.screenData.ZZ_TRV_CAT == "INFO") &&
				aData.screenData.ZZ_DEP_FRCNTRY == aData.screenData.ZZ_DEP_TOCNTRY &&
				aData.screenData.ZZ_DEP_FRMLOC == aData.screenData.ZZ_DEP_TOLOC){
			sap.ca.ui.message.showMessageBox({
				type: sap.ca.ui.message.Type.ERROR,
				message: "From and To location must be different",
				details: "From and To location must be different"
			});
			sap.ui.getCore().getModel("global").setData(aData);
			return;
		}

		// Validate black-listed country
		var selectedCountry = aData.screenData.ZZ_DEP_TOCNTRY;
		for (var i = 0; i < aData.country.length; i ++) {
			if (aData.country[i].MOLGA == selectedCountry) {
				if (aData.country[i].Black_Listed == 'X') {
					sap.ca.ui.message.showMessageBox({
						type: sap.ca.ui.message.Type.ERROR,
						message: "You are not allowed to travel to this country as per ECO guidelines",
						details: "You are not allowed to travel to this country as per ECO guidelines"
					});
					sap.ui.getCore().getModel("global").setData(aData);
					return;
				}
			}
		}
		//UCD1KOR Validation for RetirementDate
		// 29 Jan 2021
		
		var rDate = sap.ui.getCore().getModel("profile").getData().employeeDetail.RetirementDate;
		if(rDate !==""){
			try{
				var RetirementDate = new Date(rDate.substr(0,4), rDate.substr(4,2)-1, rDate.substr(6,2));
			}catch(err){}
		}
		var sStart = new Date(aData.screenData.ZZ_DEP_STDATE.substr(0,4), aData.screenData.ZZ_DEP_STDATE.substr(4,2)-1, aData.screenData.ZZ_DEP_STDATE.substr(6,2));
		var dEnd = new Date(aData.screenData.ZZ_DEP_ENDATE.substr(0,4), aData.screenData.ZZ_DEP_ENDATE.substr(4,2)-1, aData.screenData.ZZ_DEP_ENDATE.substr(6,2));
		
		if(RetirementDate && (dEnd > RetirementDate || sStart > RetirementDate)){
			err = "The entered date is beyond your retirement date. Please correct.";
			sap.ca.ui.message.showMessageBox({
				type: sap.ca.ui.message.Type.ERROR,
				message: err,
				details: err
			});
			return;
		}

		// Validate start date input
		if (aData.screenData.ZZ_DEP_STDATE == "") {
			aData.screenData.ZZ_DEP_STDATE_ERROR = "Error";
			err = "Please check start date";
			sap.ca.ui.message.showMessageBox({
				type: sap.ca.ui.message.Type.ERROR,
				message: err,
				details: err
			});
			sap.ui.getCore().getModel("global").setData(aData);
			return;
		} else {
			if (aData.screenData.ZZ_TRV_CAT == "TRFR" && aData.screenData.ZZ_DEP_TYPE == "INTL") {
//				if (new Date(aData.screenData.ZZ_DEP_STDATE_VALUE.getFullYear(), 
//							 aData.screenData.ZZ_DEP_STDATE_VALUE.getMonth(), 1).toString() != 
//						aData.screenData.ZZ_DEP_STDATE_VALUE.toString()) {
				if (aData.screenData.ZZ_DEP_STDATE_VALUE > new Date(aData.screenData.ZZ_DEP_STDATE_VALUE.getFullYear(), 
						 aData.screenData.ZZ_DEP_STDATE_VALUE.getMonth(), 1)) {
					aData.screenData.ZZ_DEP_STDATE_ERROR = "Error";
					err = "For transfer request, start date must always be Start Day of the Month";
					sap.ca.ui.message.showMessageBox({
						type: sap.ca.ui.message.Type.ERROR,
						message: err,
						details: err
					});
					sap.ui.getCore().getModel("global").setData(aData);
					return;
				}
				
				if (aData.screenData.ZZ_DEP_ENDATE_VALUE.toString() != new Date(aData.screenData.ZZ_DEP_ENDATE_VALUE.getFullYear(), 
						 aData.screenData.ZZ_DEP_ENDATE_VALUE.getMonth()+1, 0).toString()) {
					aData.screenData.ZZ_DEP_ENDATE_ERROR = "Error";
					err = "For transfer request, end date must always be end day of the month";
					sap.ca.ui.message.showMessageBox({
						type: sap.ca.ui.message.Type.ERROR,
						message: err,
						details: err
					});
					sap.ui.getCore().getModel("global").setData(aData);
					return;
				}
				
			}
			aData.screenData.ZZ_DEP_ENDATE_ERROR = "None";
			aData.screenData.ZZ_DEP_STDATE_ERROR = "None";
		}

		if (aData.screenData.ZZ_TRV_CAT != "BUSR" && aData.screenData.ZZ_TRV_CAT != "INFO" && aData.screenData.ZZ_TRV_CAT != "") {
			// Check date in the past
			if (sap.ui.project.e2etm.util.StaticUtility.checkDateInPast(aData.screenData.ZZ_DEP_STDATE)) {
				aData.screenData.ZZ_DEP_STDATE_ERROR = "Error";
				err = "Please enter start date in the future";
				sap.ca.ui.message.showMessageBox({
					type: sap.ca.ui.message.Type.ERROR,
					message: err,
					details: err
				});
				sap.ui.getCore().getModel("global").setData(aData);
				return;
			} else {
				aData.screenData.ZZ_DEP_STDATE_ERROR = "None";
			}
		} else {
			aData.screenData.ZZ_DEP_STDATE_ERROR = "None";
		}

		// Validate end date input
		if (aData.screenData.ZZ_DEP_ENDATE == "") {
			aData.screenData.ZZ_DEP_ENDATE_ERROR = "Error";
			err = "Please check end date";
			sap.ca.ui.message.showMessageBox({
				type: sap.ca.ui.message.Type.ERROR,
				message: err,
				details: err
			});
			sap.ui.getCore().getModel("global").setData(aData);
			return;
		} else {
			aData.screenData.ZZ_DEP_ENDATE_ERROR = "None";
		}

		if (aData.screenData.ZZ_TRV_CAT != "BUSR" && aData.screenData.ZZ_TRV_CAT != "INFO" && aData.screenData.ZZ_TRV_CAT != "") {
			// Check date in the past
			if (sap.ui.project.e2etm.util.StaticUtility.checkDateInPast(aData.screenData.ZZ_DEP_ENDATE)) {
				aData.screenData.ZZ_DEP_ENDATE_ERROR = "Error";
				err = "Please enter end date in the future";
				sap.ca.ui.message.showMessageBox({
					type: sap.ca.ui.message.Type.ERROR,
					message: err,
					details: err
				});
				sap.ui.getCore().getModel("global").setData(aData);
				return;
			} else {
				aData.screenData.ZZ_DEP_ENDATE_ERROR = "None";
			}
		} else {
			aData.screenData.ZZ_DEP_ENDATE_ERROR = "None";
		}

		// Validate if input date is overlapped
		if (this.checkDateOverlapping() == "") {
			aData.screenData.ZZ_DEP_STDATE_ERROR = "None";
			aData.screenData.ZZ_DEP_ENDATE_ERROR = "None";
		} else {
			aData.screenData.ZZ_DEP_STDATE_ERROR = "Error";
			aData.screenData.ZZ_DEP_ENDATE_ERROR = "Error";
			err = this.checkDateOverlapping();
			sap.ca.ui.message.showMessageBox({
				type: sap.ca.ui.message.Type.ERROR,
				message: err,
				details: err
			});
			sap.ui.getCore().getModel("global").setData(aData);
			return;
		}
		aData.screenData.ZZ_DEP_FRMLOC_TXT = sap.ui.getCore().byId("cbBoxFromCity").getSelectedItem().getText();
		aData.screenData.ZZ_DEP_TOLOC_TXT = sap.ui.getCore().byId("cbBoxToCity").getSelectedItem().getText();
		// Validate if Category of Travel is not entered
		if (aData.screenData.ZZ_TRV_CAT == "") {
			aData.screenData.ZZ_TRV_CAT_ERROR = "Error";
			err = "Please select Category of Travel";
			sap.ca.ui.message.showMessageBox({
				type: sap.ca.ui.message.Type.ERROR,
				message: err,
				details: err
			});
			sap.ui.getCore().getModel("global").setData(aData);
			return;
		} else {
		///// ################### UCD1KOR 9 July 2021 added below if condition for DOME-TRFR ###############////////
			if( selectedOption == true){
				aData.screenData.ZZ_REQ_TYP = "BUSR";  
				aData.TrfrFlag  = "";
			}
			else if(aData.screenData.ZZ_TRV_CAT =="TRFR" && aData.screenData.ZZ_DEP_TYPE=="DOME" ){
				aData.screenData.ZZ_REQ_TYP = "BUSR";  
				aData.TrfrFlag  = "X";
			}
			else if (aData.screenData.ZZ_TRV_CAT != "BUSR" && aData.screenData.ZZ_TRV_CAT != "INFO") {
				aData.screenData.ZZ_REQ_TYP = "DEPU";
				aData.TrfrFlag  = "";
			} else {
				if (aData.screenData.ZZ_TRV_CAT == "BUSR") {
					aData.screenData.ZZ_REQ_TYP = "BUSR";
				} else if (aData.screenData.ZZ_TRV_CAT == "INFO") {
					aData.screenData.ZZ_REQ_TYP = "INFO";
				}
				aData.TrfrFlag  = "";
			}
			
			
			// If Category of Travel is entered, retrieve the min and max days
			var categoryList = sap.ui.getCore().getModel("global").getData().visaType; 
			var catID = aData.screenData.ZZ_TRV_CAT;
			var selectedDesc = sap.ui.getCore().byId("TravelCategoryId").getSelectedItem().getText();
			for (var i = 0; i < categoryList.length; i++) {
				if (catID == categoryList[i].ZZ_VKEY && aData.screenData.ZZ_DEP_TYPE == categoryList[i].ZZ_ZZ_SMODID) {
					if (selectedDesc.indexOf(categoryList[i].ZZ_VISA_DESC) != -1) {
						aData.screenData.ZZ_MIN = categoryList[i].ZZ_MIN;
						aData.screenData.ZZ_MAX = categoryList[i].ZZ_MAX;
						aData.screenData.ZZ_VISA_DESC = categoryList[i].ZZ_VISA_DESC;
						break;
					}
				}
			}
			aData.screenData.ZZ_TRV_CAT_ERROR = "None";
		}

		// Validate duration based on Category of Travel
		if (aData.screenData.ZZ_DEP_STDATE != "" && aData.screenData.ZZ_DEP_ENDATE != "") {
			var dStart = new Date(aData.screenData.ZZ_DEP_STDATE.substr(0,4), aData.screenData.ZZ_DEP_STDATE.substr(4,2)-1, aData.screenData.ZZ_DEP_STDATE.substr(6,2));
			var dEnd = new Date(aData.screenData.ZZ_DEP_ENDATE.substr(0,4), aData.screenData.ZZ_DEP_ENDATE.substr(4,2)-1, aData.screenData.ZZ_DEP_ENDATE.substr(6,2));
			var dDur = new Date(dEnd - dStart);
			aData.screenData.ZZ_DEP_DAYS = "" + ( dDur.getTime() / ( 1000*3600*24 ) + 1 );
			aData.screenData.ZZ_DEP_DAYS = "" + Math.round(aData.screenData.ZZ_DEP_DAYS);
			
			if (parseInt(aData.screenData.ZZ_DEP_DAYS) > 0) {
				err = sap.ui.project.e2etm.util.StaticUtility.
				checTravelCategoryDuration(aData.screenData.ZZ_TRV_CAT,aData.screenData.ZZ_DEP_DAYS,aData.screenData.ZZ_DEP_TYPE,aData.screenData.ZZ_DEP_TOCNTRY);
				// Validate if input date is between the category duration
				if ( err != "") {
					aData.screenData.ZZ_DEP_STDATE_ERROR = "Error";
					aData.screenData.ZZ_DEP_ENDATE_ERROR = "Error";
					sap.ca.ui.message.showMessageBox({
						type: sap.ca.ui.message.Type.ERROR,
						message: err,
						details: err
					});
					sap.ui.getCore().getModel("global").setData(aData);
					return;
				} else {
					aData.screenData.ZZ_DEP_STDATE_ERROR = "None";
					aData.screenData.ZZ_DEP_ENDATE_ERROR = "None";

					// Setting additional information to screen data (sponsor by company)
					if (aData.screenData.ZZ_DEP_TYPE == "INTL") {
						if (parseInt(aData.screenData.ZZ_DEP_DAYS) > 360) {
							aData.screenData.ZZ_SP_CMPNY = true;
						}
					}
					sap.ui.getCore().getModel("global").setData(aData);
				}
			} else {
				aData.screenData.ZZ_DEP_STDATE_ERROR = "Error";
				aData.screenData.ZZ_DEP_ENDATE_ERROR = "Error";
				err = "To Date must be greater than or equal to From Date";
				sap.ca.ui.message.showMessageBox({
					type: sap.ca.ui.message.Type.ERROR,
					message: err,
					details: err
				});
				sap.ui.getCore().getModel("global").setData(aData);
				return;
			}
		}
		aData.isCreate = true;
		aData.isChange = false;
		

		//start of code uml6kor newpolicy_CR_DE 16.9.2019		//start of code uml6kor newpolicy_CR_DE 16.9.2019
		if(aData.screenData.ZZ_TRV_CAT == "WRKP" && aData.screenData.ZZ_DEP_TOCNTRY == "DE" )
		{
			
			var strtdate =  aData.screenData.ZZ_DEP_STDATE;
			var enddate = aData.screenData.ZZ_DEP_ENDATE;
			var dStart = new Date(strtdate.substr(0, 4), strtdate.substr(4, 2) - 1, strtdate.substr(6, 2));
			var dEnd = new Date(enddate.substr(0, 4), enddate.substr(4, 2) - 1, enddate.substr(6, 2));
			var dDur = new Date(dEnd - dStart);
			var	durStEn = dDur.getTime() / (1000 * 3600 * 24) + 1;
			
			var edate1 = new Date(aData.screenData.ZZ_DEP_STDATE_VALUE.getFullYear(), 
                    aData.screenData.ZZ_DEP_STDATE_VALUE.getMonth(), 180);

		if((durStEn) >= 180){
			var text = 'As per immigration rules, end date cannot be greater than or equal to your Start '+
			'date when deputation duration is greater than or equal to 180 days.Please change your return date '+
			'earlier to the end date selected';
			
			 if((aData.screenData.ZZ_DEP_STDATE.substr(6,8) == aData.screenData.ZZ_DEP_ENDATE.substr(6,8) ) && aData.screenData.ZZ_DEP_ENDATE.substr(6,8) <= "03") //if both dates are eq 01			{
			 {
				 sap.ca.ui.message.showMessageBox({
					type: sap.ca.ui.message.Type.ERROR,
					message: text,
					details: text
				});
				sap.ui.getCore().getModel("global").setData(aData);
				return;
				
			}
			 else if((aData.screenData.ZZ_DEP_ENDATE_VALUE > new Date(edate1.getFullYear(), 
                     edate1.getMonth()+1, 0)) && (aData.screenData.ZZ_DEP_STDATE.substr(6,8) <= "03" )) //modified by uml6kor 20/9/2019
			 {////if both start date is 01 and end date has to be end of month (28,29,30,31)
				 if ((aData.screenData.ZZ_DEP_ENDATE.substr(6,8) >= aData.screenData.ZZ_DEP_STDATE.substr(6,8))){ //added by uml6kor 24/9/2019
					 sap.ca.ui.message.showMessageBox({
							type: sap.ca.ui.message.Type.ERROR,
							message: text,
							details: text
						});
						sap.ui.getCore().getModel("global").setData(aData);
						return;	 
				 }
				
			}
			 else if ((aData.screenData.ZZ_DEP_ENDATE.substr(6,8) >= aData.screenData.ZZ_DEP_STDATE.substr(6,8)) && (aData.screenData.ZZ_DEP_STDATE.substr(6,8) > "03"))//  && aData.screenData.ZZ_DEP_STDATE.substr(6,8) != "01") 
			{// enddateDD>strtdateDD
				sap.ca.ui.message.showMessageBox({
					type: sap.ca.ui.message.Type.ERROR,
					message: text,
					details: text
				});
				sap.ui.getCore().getModel("global").setData(aData);
				return;
			}
		}
}
//end of code newpolicy_CR_DE 16.9.2019
		//start of code for trvl settlement uml6kor_26/12/2019
		if( ((aData.screenData.ZZ_REQ_TYP == "BUSR" || aData.screenData.ZZ_REQ_TYP == "DEPU" || aData.screenData.ZZ_REQ_TYP == "INFO") && ( aData.screenData.ZZ_DEP_TYPE == "INTL"|| aData.screenData.ZZ_DEP_TYPE == "DOME"))
			){//added info travel trvl settlement uml6kor_8/1/2020
			sap.ui.project.e2etm.util.StaticUtility.setBusy(true,oHomeThis);
			var trvl_set_url = sServiceUrl + "checkTrvlSettlement?&ZZ_PERNR='" +
			sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_PERNR +
			"'&ZZ_SMODID='"+aData.screenData.ZZ_DEP_TYPE+
			"'&ZZ_MODID='" +aData.screenData.ZZ_REQ_TYP+
			"'&ZZ_ENDDATE='"+aData.screenData.ZZ_DEP_ENDATE+
			"'&$format=json";
			
			var get = $.ajax({
				cache: false,
				url: trvl_set_url, 
				type: "GET",
				async: false
			});
			var reinr_arr = '';
			get.done(function(result) {
				reinr_arr = result.d.results;	
				sap.ui.project.e2etm.util.StaticUtility.setBusy(false,oHomeThis);
				that.onValidationCheck = true;
			});
			get.fail(function(err) {
				that.onValidationCheck = false;
				sap.ui.project.e2etm.util.StaticUtility.setBusy(false,oHomeThis);
				sap.m.MessageBox.error("We are not able to Porcess your request.Try After some time");
			});
			if( reinr_arr.length > 0)
			{var list_r = "";
			var blkflag = "";//added by uml6kor 17/3/2020 new validation policy for trvl settlements
			if(reinr_arr.length == 1)
			{
                if(reinr_arr[0].ZZ_REINR.substr(2,10) == sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_PERNR )
                {
                	var text ="You are blocked from creation of new travel requests" +
                	" due to pending travel settlements";
			sap.ca.ui.message.showMessageBox({
				type: sap.ca.ui.message.Type.ERROR,
				message: text+"\n"+list_r,
			});
			blkflag = 'X';
			sap.ui.getCore().getModel("global").setData(aData);
			return;
                }
			}
			if(blkflag != 'X'){ //added by uml6kor 17/3/2020 new validation policy for trvl settlements
				for(var i = 0 ; i<reinr_arr.length ; i++)
				{
					list_r =  list_r +"-" + reinr_arr[i].ZZ_REINR + "\n";
				}
				var text ="You have travel requests which are "+
					" pending for the settlement. You are not allowed to"+
					"  create a new request until the Travel settlement for the previous requests are completed";
				sap.ca.ui.message.showMessageBox({
					type: sap.ca.ui.message.Type.ERROR,
					message: text+"\n"+list_r,
				});

				sap.ui.getCore().getModel("global").setData(aData);
				return;
}				
			}
	
			
		}
		
		//start of uea6kor_5.11.2020 NonPE_Tax
		if( ((aData.screenData.ZZ_REQ_TYP == "BUSR" || aData.screenData.ZZ_REQ_TYP == "INFO") && ( aData.screenData.ZZ_DEP_TYPE == "INTL"))){
			var oDataModel = new sap.ui.model.odata.ODataModel(sServiceUrl);	
			sap.ui.project.e2etm.util.StaticUtility.setBusy(true, oHomeThis);
			 var taxURL = "CheckNonPETaxExpSet(ZZ_MODID='"+ aData.screenData.ZZ_REQ_TYP+"',ZZ_SMODID='"+aData.screenData.ZZ_DEP_TYPE+"',ZZ_PERNR='" +
				sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_PERNR +
				"',ZZ_ENDDATE='"+aData.screenData.ZZ_DEP_ENDATE+
				"',ZZ_STDATE='"+aData.screenData.ZZ_DEP_STDATE+
				"',ZZ_CNTRY='"+aData.screenData.ZZ_DEP_TOCNTRY+"')";
			 
			 var totalDur;

			oDataModel.read(taxURL, null, null, false, jQuery.proxy(function(oData, response) {
				totalDur = oData.ZZ_DURATION;
				
				
			},this), function(error) {
				sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
				
				
			});
			
			sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
			if(totalDur != "1-"){			
				var total = 180;
				var remDur = total - totalDur;
				if (aData.screenData.ZZ_DEP_DAYS > remDur){
					//Error
		        var text ="You have cumulative travel duration of  "+ Math.abs(totalDur) +
				" days for this year. As per policy, maximum cumulative duration an employee can travel on " +
				" Business Travels (including personal time)/Info Travel/Secondary travel for a " +
				" calendar year should not be more than "+ total + "days."
				" Please check and adjust the duration accordingly.";
			sap.ca.ui.message.showMessageBox({
				type: sap.ca.ui.message.Type.ERROR,
				message: text,
			});
			sap.ui.getCore().getModel("global").setData(aData);
			sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
			return;
			
		      } 
		   }	
			if(totalDur == undefined){
				sap.m.MessageBox.error("We are not able to Porcess your request.Try After some time");
				return;
			}			
		}					
		
		//end of uea6kor_5.11.2020 NonPE_Tax
		
		
		//end of code uml6kor trvl_settlement uml6kor_26/12/2019
		
		if (aData.screenData.ZZ_TRV_CAT != "BUSR" && aData.screenData.ZZ_TRV_CAT != "INFO" &&  aData.screenData.ZZ_DEP_TYPE == "INTL") { //International deputation request
			//### UCD1KOR 06 May 2020 Comment
			/// Covid-19 changes
			var covid_max = that.covid_19COnditionCheck(aData.screenData);
			if( parseInt(aData.screenData.ZZ_DEP_DAYS) > covid_max ){
			//do						
			}
			else{
				//start of code by uml6kor(09/11/2020) for RBEIITAPPPIPELINE-683 Displaying information related to conversion in Deputation dashboard
				if (aData.screenData.ZZ_TRV_CAT == "TRFR" && aData.screenData.ZZ_DEP_TYPE == "INTL") {
						/*var mgr_name = sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_GRM;
						var emp_name = sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_NAME;
						if(emp_name == mgr_name){
							mgr_name = null;
						} 
						if( mgr_name == null || mgr_name == undefined || mgr_name == "" )
						{
							if (this.oCommonDialog) {
								this.oCommonDialog.destroy();
							}
							// instantiate the Fragment if not done yet
							this.oCommonDialog = sap.ui.xmlfragment("sap.ui.project.e2etm.fragment.common.CheckValidMgr", this);
							this.oCommonDialog.open();
						}
						else{
							this.checkPeriod(aData);		
						}*/
						this.checkPeriod(aData);
				}
				else{
					this.checkPeriod(aData);		
				}
		//end of code by uml6kor(09/11/2020) for RBEIITAPPPIPELINE-683 Displaying information related to conversion in Deputation dashboard
			}
			
		}
		else {  //Business travel or domestic 
			//started display of business popup uml6kor 24/6/2019
			if(that.onValidationCheck == true && aData.screenData.ZZ_TRV_CAT == "BUSR" && aData.screenData.ZZ_DEP_TOCNTRY != "IN" )
				{
				var oThis = this;
				var dialog = new sap.m.Dialog({
					title: 'Confirm',
					type: 'Message',
					content: new sap.m.Text({ text: "1. China - It is advisable to submit the documents minimum 30 days in advance, else Associate has to travel to Mumbai / Delhi for personal submission."+
						 "\n2. Turkey - If you are holding valid Schengen / USA / UK and Ireland - you can apply for E visa else you have to go with offline submission, then documents should be notarized with Mantralaya, Mumbai which would increase the processing time."
						+"\n3. Bangladesh - Applicant has to travel to Delhi / Mumbai / Kolkata and submit the documents to Embassy personally. "
						+"\n4. Brazil - Increase in lead time as documents to be notarized with Mantralaya, Mumbai. "
						+"\n5. Romania - Applicant has to travel in Person to Delhi and submit the documents to Embassy and it is advisable to plan the travel 30 days in advance." }),
					beginButton: new sap.m.Button({
						text: 'Continue',
						press: function () {
							sap.ui.getCore().getModel("global").setData(aData);
							oThis.oFragmentDialog.close();
							sap.ui.core.routing.Router.getRouter("MyRouter").navTo("deputation");	
						}
					}),
					endButton: new sap.m.Button({
						text: 'Cancel',
						press: function () {
							dialog.close();
						}
					}),
					afterClose: function() {
						dialog.destroy();
					}
				});
				dialog.open();

				
				}
			else{
				if(that.onValidationCheck == true){
					sap.ui.getCore().getModel("global").setData(aData);
					this.oFragmentDialog.close();
					sap.ui.core.routing.Router.getRouter("MyRouter").navTo("deputation");	
				}else{
					sap.m.MessageBox.error("We are not able to Porcess your request.Try After some time");
				}
				
			}
			//end uml6kor 24/6/2019
//			sap.ui.getCore().getModel("global").setData(aData);
//			this.oFragmentDialog.close();
//			sap.ui.core.routing.Router.getRouter("MyRouter").navTo("deputation");
		}
	},
	//start of code by uml6kor(09/11/2020) for RBEIITAPPPIPELINE-683 Displaying information related to conversion in Deputation dashboard
	
	onSubmitMgrNTID: function(){
		var that= this;
		var aData = sap.ui.getCore().getModel("global").getData();
		var ntidmgr1 = sap.ui.getCore().byId("ManagerL1").getValue();
		var ntidmgr2 = sap.ui.getCore().byId("ManagerL2").getValue();
		
		if( ntidmgr1.trim() == null || ntidmgr1.trim() == undefined || ntidmgr1.trim() == "" )
			{
			sap.ca.ui.message.showMessageBox({
				type: sap.ca.ui.message.Type.ERROR,
				message: "1st level Manager's NTID is mandatory",
				details: "1st level Manager's NTID is mandatory"
			});
			sap.ui.getCore().getModel("global").setData(aData);
			return;
		
			}
		var lv_epernr = sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_PERNR;
		var error_txt = "";
		var get = $.ajax({
			cache: false,
			url:  sServiceUrl + "CheckValidManager?NTID_L1='"
				+ntidmgr1.trim()+"'&NTID_L2='"+ntidmgr2.trim()+"'&EmpNo='"+lv_epernr+"'&Begda='"
				+aData.screenData.ZZ_DEP_STDATE +"'&Endda='"+aData.screenData.ZZ_DEP_ENDATE+"'&$format=json",
			async: false,
			type: "GET"
		});
		
		get.done(function(result) {
			if (result != null) {
				if(result.d.results[0].EMSG_L1 != "" && result.d.results[0].EMSG_L1 != null && result.d.results[0].EMSG_L1 != undefined ){
					error_txt = result.d.results[0].EMSG_L1 ;
				}else if(ntidmgr2 !== "" && result.d.results[0].EMSG_L2 != "" && result.d.results[0].EMSG_L2 != null && result.d.results[0].EMSG_L2 != undefined ){
					error_txt = result.d.results[0].EMSG_L2 ;	
				}else{
					that.oCommonDialog.close();
					that.checkPeriod(aData);	
				}
			}
		});
		
		if( error_txt != null && error_txt != "" && error_txt != undefined ){
			
				sap.ca.ui.message.showMessageBox({
					type: sap.ca.ui.message.Type.ERROR,
					message: error_txt,
					details: error_txt
				});
				sap.ui.getCore().getModel("global").setData(aData);
				return;
			
		}
		
	},
	//end of code by uml6kor(09/11/2020) for RBEIITAPPPIPELINE-683 Displaying information related to conversion in Deputation dashboard
	
	// Check leading period and rolling duration
	checkPeriod: function(aData) {
		var oThis = this;
		var sChecPeriod = sServiceUrl + "Period_Check?ZZ_DEP_EDATE='" + 
		aData.screenData.ZZ_DEP_ENDATE + "'&ZZ_DEP_FRCNTRY='" +
		aData.screenData.ZZ_DEP_FRCNTRY + "'&ZZ_DEP_PERNR='" +
		sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_PERNR + "'&ZZ_DEP_SDATE='" +
		aData.screenData.ZZ_DEP_STDATE + "'&ZZ_DEP_TOCNTRY='" +
		aData.screenData.ZZ_DEP_TOCNTRY + "'&ZZ_TRV_CAT='" +
		aData.screenData.ZZ_TRV_CAT + "'&$format=json";
		
		var visaExists = ""; // added by uml6kor 10/6/2019
		
		var sCheckCooling = sServiceUrl + "Check_cooling_ROW?ZZ_DEP_REQ='"+aData.screenData.ZZ_DEP_REQ+"'&ZZ_PERNR='" +
		sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_PERNR +
		"'&ZZ_DEP_TOCNTR='" + aData.screenData.ZZ_DEP_TOCNTRY +
		"'&ZZ_DEP_SDATE='" + aData.screenData.ZZ_DEP_STDATE +
		"'&ZZ_VISA_AEXIST='" + visaExists +
		"'&ZZ_DEP_DAYS='" + aData.screenData.ZZ_DEP_DAYS + //added by uml6kor 16/1/2020 stx cooling off
		"'&ZZ_TRV_CAT='" + aData.screenData.ZZ_TRV_CAT +  //added by uml6kor 16/1/2020 stx cooling off
		"'&$format=json";
		
		var empStaDef = $.Deferred();
		if(aData.screenData.ZZ_TRV_CAT == "TRFR"){
			empStaDef = sap.ui.project.e2etm.util.StaticUtility.checkEmpOnStaDepu(
					     sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_PERNR)
		}else{
			empStaDef.resolve();
		}
		
		sap.ui.project.e2etm.util.StaticUtility.setBusy(true,oHomeThis);
		$.when($.ajax({cache: false,url:sChecPeriod}),$.ajax({cache: false,url:sCheckCooling}),empStaDef).done(
			function(oChecPeriod, oCheckCooling, oCheckEmpSta){
				if(aData.screenData.ZZ_TRV_CAT == "TRFR"){
					if(oCheckEmpSta!=""){
						var globalData = sap.ui.getCore().getModel("global").getData();
						var startDate = aData.screenData.ZZ_DEP_STDATE;
						var cDate = new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate());
						var sDate = new Date(startDate.substr(0, 4), startDate.substr(4, 2) - 1, startDate.substr(6, 2));
						var days = Math.round((sDate.getTime() - cDate.getTime()) / (1000 * 60 * 60 * 24));
					    days = days + 1;
					    if(days < globalData.stvaReminder){
					    	var sError = "Already there is one request";
							sap.ca.ui.message.showMessageBox({
								type: sap.ca.ui.message.Type.ERROR,
								message:  sError,
								details:  sError
							});
							sap.ui.project.e2etm.util.StaticUtility.setBusy(false,oHomeThis);
							return;
							
					    }
					
					}
				}
				if( oChecPeriod[0].d.Period_Check.ZZ_COOL_PRD == ""){  //Validation is ok
					if (oChecPeriod[0].d.Period_Check.ZZ_MIN_WAGE == "X") {
						aData.screenData.ZZ_MIN_WAGE = "YES";
					} else {
						aData.screenData.ZZ_MIN_WAGE = "NO";
					}
					if (oChecPeriod[0].d.Period_Check.ZZ_LEAD_TIME == "") {
						aData.screenData.ZZ_DEP_TEDATE = aData.screenData.ZZ_DEP_STDATE;
					} else {
						aData.screenData.ZZ_DEP_TEDATE = oChecPeriod[0].d.Period_Check.ZZ_LEAD_TIME;
					}
					
					if (aData.screenData.ZZ_DEP_TOCNTRY == "DE" && (aData.screenData.ZZ_TRV_CAT == "WRKP"// || aData.screenData.ZZ_TRV_CAT == "TRNG" //commented by uml6kor 14/2/2020 
						)){// added trng uml6kor 3/6/2019
						
						if( sap.ui.project.e2etm.util.StaticUtility.checkCoolingDate( oCheckCooling[0].d.Check_cooling_ROW.NEXT_DATE, aData.screenData.ZZ_DEP_STDATE) ){
							var sMaxday = 0;
							//start uml6kor 12/4/2019
							  
							if(oCheckCooling[0].d.Check_cooling_ROW.TRVL_DURATION != "")
							{
							if(parseInt(oCheckCooling[0].d.Check_cooling_ROW.TRVL_DURATION) < sap.ui.getCore().getModel("global").getData().coolingPeriodMaxdays)
							  {
								  if(parseInt(oCheckCooling[0].d.Check_cooling_ROW.TRVL_DURATION) < parseInt(oCheckCooling[0].d.Check_cooling_ROW.MAX_DURATION))
								  {
											sMaxday = oCheckCooling[0].d.Check_cooling_ROW.TRVL_DURATION;
								  }else{
											sMaxday = oCheckCooling[0].d.Check_cooling_ROW.MAX_DURATION;
								  }
							  }
							  else if (sap.ui.getCore().getModel("global").getData().coolingPeriodMaxdays < parseInt(oCheckCooling[0].d.Check_cooling_ROW.MAX_DURATION))
							  {
							  		sMaxday = sap.ui.getCore().getModel("global").getData().coolingPeriodMaxdays;
							  }
							  else 
							  {
								  sMaxday = oCheckCooling[0].d.Check_cooling_ROW.MAX_DURATION;
							  }
								
							}
						else
							{
							if (sap.ui.getCore().getModel("global").getData().coolingPeriodMaxdays < parseInt(oCheckCooling[0].d.Check_cooling_ROW.MAX_DURATION))
							  {
							  		sMaxday = sap.ui.getCore().getModel("global").getData().coolingPeriodMaxdays;
							  }
							  else 
							  {
								  sMaxday = oCheckCooling[0].d.Check_cooling_ROW.MAX_DURATION;
							  }
							
							}
						
							  
							  //end uml6kor 12/4/2019
//							if(parseInt(oCheckCooling[0].d.Check_cooling_ROW.MAX_DURATION) > sap.ui.getCore().getModel("global").getData().coolingPeriodMaxdays){ //commented by uml6kor 12/4/2019
//								sMaxday = sap.ui.getCore().getModel("global").getData().coolingPeriodMaxdays;
//							}else{
//								sMaxday = oCheckCooling[0].d.Check_cooling_ROW.MAX_DURATION;
//							}

									//started uml6kor 04.04.2019
							var text =
								'As per proposed cooling period conditions, you are not allowed to travel on the selected date. The probable travel start date can be on or after ' 
								+ sap.ui.project.e2etm.util.Formatter.sapDate(oCheckCooling[0].d.Check_cooling_ROW.NEXT_DATE) + ' for a maximum duration of '+ sMaxday +
								'. Please correct the dates accordingly and continue.' ;
							sap.ca.ui.message.showMessageBox({
								type: sap.ca.ui.message.Type.ERROR,
								message: text,
							});
							//ended uml6kor 04.04.2019
							/* commented by uml6kor 04/04/2019
							
							var text = 'You can travel to Germany on "STA Assignment Model" from ' 
								+ sap.ui.project.e2etm.util.Formatter.sapDate(oCheckCooling[0].d.Check_cooling_ROW.NEXT_DATE) + ' for a maximum of ' + 
								sMaxday + ' days. This policy will be effective from ' + sap.ui.project.e2etm.util.Formatter.sapDate(sap.ui.getCore().getModel("global").getData().coolingPeriodStartDate);
//							
							
							var text = 'You can travel to Germany on "STA Assignment Model" from ' 
							+ sap.ui.project.e2etm.util.Formatter.sapDate(oCheckCooling[0].d.CheckCoolingPeriod.NEXT_DATE);
							
							var dialog = new sap.m.Dialog({
								title: 'Confirm',
								type: 'Message',
								content: new sap.m.Text({ text: text }),
								beginButton: new sap.m.Button({
									text: 'Continue',
									press: function () {
										sap.ui.getCore().getModel("global").setData(aData);
										dialog.close();
										oThis.oFragmentDialog.close();
										sap.ui.core.routing.Router.getRouter("MyRouter").navTo("deputation");
									}
								}),
								endButton: new sap.m.Button({
									text: 'Cancel',
									press: function () {
										dialog.close();
									}
								}),
								afterClose: function() {
									dialog.destroy();
								}
							});
							dialog.open();*/
						}//started uml6kor 12/4/2019
						else if (oCheckCooling[0].d.Check_cooling_ROW.TRVL_DURATION != "" && 
								(parseInt(oCheckCooling[0].d.Check_cooling_ROW.TRVL_DURATION) < sap.ui.getCore().getModel("global").getData().coolingPeriodMaxdays) && 
								parseInt(aData.screenData.ZZ_DEP_DAYS) > parseInt(oCheckCooling[0].d.Check_cooling_ROW.TRVL_DURATION) &&
								(parseInt(aData.screenData.ZZ_DEP_DAYS) > sap.ui.getCore().getModel("global").getData().coolingPeriodMaxdays)) 
							{
									var text = 'As per the Travel duration, employee will be able to travel to Germany only for ' + oCheckCooling[0].d.Check_cooling_ROW.TRVL_DURATION + 
									' Days. Please correct the dates accordingly and continue. Refer the travel policy for more information.';
									sap.ca.ui.message.showMessageBox({
										type: sap.ca.ui.message.Type.ERROR,
										message: text,
										details: text
									});
	
							
							}
							
							//ended uml6kor 12/4/2019
						
						else{
							sap.ui.getCore().getModel("global").setData(aData);
							oThis.oFragmentDialog.close();
							sap.ui.core.routing.Router.getRouter("MyRouter").navTo("deputation");
						}

					} else {

						 //start of code by uml6kor 16/1/2020 stx cooling off
						if ( (aData.screenData.ZZ_DEP_FRCNTRY != aData.screenData.ZZ_DEP_TOCNTRY) &&  aData.screenData.ZZ_TRV_CAT != "TRNG" ) {//added code for trng -removal of trng.uml6kor 20/2/2020
						
							if ( oCheckCooling[0].d.Check_cooling_ROW.NEXT_DATE > aData.screenData.ZZ_DEP_STDATE ) {
								if ( (aData.screenData.ZZ_TRV_CAT == "WRKP" //|| aData.screenData.ZZ_TRV_CAT == "TRNG"
									) && aData.screenData.ZZ_DEP_TOCNTRY != "GB" ) {//added trng uml6kor 3.6.2019 //added uk 4.6.2019 //commented by uml6kor 14/2/2020
									var text = 'As per cooling period policy, employee will be able to travel to the selected country only from ' + 
									sap.ui.project.e2etm.util.Formatter.sapDate(oCheckCooling[0].d.Check_cooling_ROW.NEXT_DATE) +
									'.Please refer the travel policy for more information.';
									sap.ca.ui.message.showMessageBox({
										type: sap.ca.ui.message.Type.ERROR,
										message: text,
										details: text
									});
									
								}
								else if ((aData.screenData.ZZ_TRV_CAT == "TRFR")){
									var text = 'As per cooling period guidelines, you will not be able to travel to the selected country on STX assignment model only from '+
									sap.ui.project.e2etm.util.Formatter.sapDate(oCheckCooling[0].d.Check_cooling_ROW.NEXT_DATE) +
									'. Please refer the travel policy on Proview for more information.';
									sap.ca.ui.message.showMessageBox({
										type: sap.ca.ui.message.Type.ERROR,
										message: text,
										details: text
									});
								}
								else{
									sap.ui.getCore().getModel("global").setData(aData);
									oThis.oFragmentDialog.close();
									sap.ui.core.routing.Router.getRouter("MyRouter").navTo("deputation");
								} 
		 
							}
							else{
								sap.ui.getCore().getModel("global").setData(aData);
								oThis.oFragmentDialog.close();
								sap.ui.core.routing.Router.getRouter("MyRouter").navTo("deputation");
							
							}
						}
						else{

							sap.ui.getCore().getModel("global").setData(aData);
							oThis.oFragmentDialog.close();
							sap.ui.core.routing.Router.getRouter("MyRouter").navTo("deputation");
						}
						//end of code by uml6kor 16/1/2020 stx cooling off
						
						/*// crt5kor //commented by uml6kor 16/1/2020
						if ( (aData.screenData.ZZ_TRV_CAT == "WRKP" || aData.screenData.ZZ_TRV_CAT == "TRNG") && aData.screenData.ZZ_DEP_TOCNTRY != "GB" ) {//added trng uml6kor 3.6.2019 //added uk 4.6.2019
							if ( aData.screenData.ZZ_DEP_FRCNTRY != aData.screenData.ZZ_DEP_TOCNTRY ) {

								if ( oCheckCooling[0].d.Check_cooling_ROW.NEXT_DATE > aData.screenData.ZZ_DEP_STDATE ) {
									var text = 'As per cooling period policy, employee will be able to travel to the selected country only from ' + sap.ui.project.e2etm.util.Formatter.sapDate(oCheckCooling[
										0].d.Check_cooling_ROW.NEXT_DATE) + '.Please refer the travel policy for more information.';
									sap.ca.ui.message.showMessageBox({
										type: sap.ca.ui.message.Type.ERROR,
										message: text,
										details: text
									});
								}
								else {
									sap.ui.getCore().getModel("global").setData(aData);
									oThis.oFragmentDialog.close();
									sap.ui.core.routing.Router.getRouter("MyRouter").navTo("deputation");
								}
							}

							else {
								sap.ui.getCore().getModel("global").setData(aData);
								oThis.oFragmentDialog.close();
								sap.ui.core.routing.Router.getRouter("MyRouter").navTo("deputation");
							}
						}


						else {
							sap.ui.getCore().getModel("global").setData(aData);
							oThis.oFragmentDialog.close();
							sap.ui.core.routing.Router.getRouter("MyRouter").navTo("deputation");
						}*/
					}
				}else{  //Show error or warning message
					if( oChecPeriod[0].d.Period_Check.ZZ_COOL_PRD != "" ){   //Show error message
						var sError = "You cannot travel to " + sap.ui.project.e2etm.util.Formatter.formatCountry(aData.screenData.ZZ_DEP_TOCNTRY) + 
						" until " + sap.ui.project.e2etm.util.Formatter.sapDate(oChecPeriod[0].d.Period_Check.ZZ_COOL_PRD);
						sap.ca.ui.message.showMessageBox({
							type: sap.ca.ui.message.Type.ERROR,
							message:  sError,
							details:  sError
						});
					}
				}
				sap.ui.project.e2etm.util.StaticUtility.setBusy(false,oHomeThis);
			}).fail(function(err){
				if(aData.screenData.ZZ_DEP_TOCNTRY == "DE"){
					alert("In order to raise STA request to Germany, minimum tenure of 6 months with Bosch India should be met. This is only a warning message and this rule will be enforced strictly effective 01.07.2016.");
				}

				sap.ui.project.e2etm.util.StaticUtility.setBusy(false,oHomeThis);
			});
	},

	//Check overlapping start and end date
	checkDateOverlapping: function() {
		var aData = sap.ui.getCore().getModel("global").getData();
		var aList = sap.ui.getCore().getModel("global").getData().deputationList; //Deputation List
		if (aList != null) {
			for (var i=0; i < aList.length; i++) {
				var existSD = aList[i].ZZ_DEP_STDATE;
				var existED = aList[i].ZZ_DEP_ENDATE;
				var newSD = aData.screenData.ZZ_DEP_STDATE;
				var newED = aData.screenData.ZZ_DEP_ENDATE;
				// Validation is ok
				if ((newSD < existSD && newED < existSD) || (newSD > existED && newED > existED)) {
					continue;
				} else {
					if ((newSD != existSD && newED != existED && 
							(aData.screenData.ZZ_TRV_CAT == "BUSR" || aData.screenData.ZZ_TRV_CAT == "INFO") && 
							aList[i].ZZ_REQ_TYP == "DEPU") || 
						aList[i].ZZ_REQ_TYP == "VISA" ||
						(aList[i].ZZ_TRV_CAT == "TRFR" && aList[i].ZZ_DEP_TYPE == "DOME")) {
						continue;
					} else {
						return "Request" + " '" + aList[i].ZZ_DEP_REQ + "' " + 
						"has already opened from " + sap.ui.project.e2etm.util.Formatter.sapDate(existSD) + " to " +
						sap.ui.project.e2etm.util.Formatter.sapDate(existED) + ". Please select another date";
					}
				}
			}
		}
		return "";
	},
	
	//  Process dependent visa
	onSaveEmployeeDialog: function(evt){
		sap.ui.project.e2etm.util.StaticUtility.onSaveEmployeeDialog(evt, this);
	},

	// Process substitution
	onSubStitutionPress: function(evt){
		var oThis = this;
		if (!this["Substitution"]) {
			sap.ui.project.e2etm.util.StaticUtility.setBusy(true,oHomeThis);
			this["Substitution"] = sap.ui.xmlfragment("sap.ui.project.e2etm.fragment.common.SubstitutionDialog", this);
			this.getView().addDependent(this["Substitution"]);
			var sSubstitution = sServiceUrl + "MGR_SUBSTITUTIONSet?$filter=US_NAME eq '" + 
			sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_NTID + "'&$format=json";
			var sProfile = sServiceUrl + "GetF4Table?TableName='T77RQ'&Col1='LANGU'&Col2='REPPR'&Col3='RTEXT'&Col4=''&Col5=''&Col6=''&Col7=''&Col8=''&Col9=''&Col10=''&$format=json";
			$.when($.ajax({cache: false,url:sSubstitution}),$.ajax({cache: false,url:sProfile})).done(
				function(sSubstitution,sProfile){
					var oModel = new sap.ui.model.json.JSONModel();
					var aData = {};
					aData.subsitution = sSubstitution[0].d.results;
					for( var i=0; i<aData.subsitution.length;i++ ){
						aData.subsitution[i].isNew = false;
						if( aData.subsitution[i].BEGDA != "00000000" ){
							aData.subsitution[i].BEGDA_VALUE = new Date(aData.subsitution[i].BEGDA.substr(0, 4), 
									aData.subsitution[i].BEGDA.substr(4, 2) - 1, 
									aData.subsitution[i].BEGDA.substr(6, 2));
						}
						if( aData.subsitution[i].ENDDA != "00000000" ){
							aData.subsitution[i].ENDDA_VALUE = new Date(aData.subsitution[i].ENDDA.substr(0, 4), 
									aData.subsitution[i].ENDDA.substr(4, 2) - 1, 
									aData.subsitution[i].ENDDA.substr(6, 2));
						}
					}
					aData.profile = sProfile[0].d.results;
					for (var i=aData.profile.length-1; i>=0;i--){
						if( aData.profile[i].FIELD1 != "E" ){
							aData.profile.splice(i,1);
						}
					}
					aData.active = [{key: "X", text: "Active"}, {key: "", text: "Inactive"} ];
					aData.view = {length: aData.subsitution.length};
					oModel.setData(aData);
					var oTable = oThis["Substitution"].getContent()[0];
					oThis["Substitution"].setModel(oModel);
					oTable.bindRows("/subsitution");
					sap.ui.project.e2etm.util.StaticUtility.setBusy(false,oHomeThis);
					oThis["Substitution"].open();
				}
			).fail(function(err) {
				alert("Error occurs");
				sap.ui.project.e2etm.util.StaticUtility.setBusy(false,oHomeThis);
			});

		}else{
			this["Substitution"].open();
		}
	},

	onSubstitutionSavePress: function(evt){
		var aData = this["Substitution"].getContent()[0].getModel().getData();
		var sError = this.validateSubstitution(aData);
		
		// check for assigned account available or not
		var oThis =this;
		var slink = this.createLink(aData.subsitution);
		var sAccUrl =  "ZZSUBSTISet?$filter=" +slink;
		this.getView().getModel().read(sAccUrl,{
			success : jQuery.proxy(function(mResponse) {       
				// UCD1KOR 28 APR If Condiotin modified
				// || mResponse.results.length == 0
				if(mResponse.results.length != 0 || mResponse.results.length == 0){
					
					for(var i = 0; i < mResponse.results.length; i++){
						var j = 0;
						for( j = 0; j< aData.subsitution.length; j++){
							if(aData.subsitution[j].REP_NAME.toUpperCase() == mResponse.results[i].BNAME){
								break;
								
								
							}
						}
						
						//check available				
						if(mResponse.results[i].ID_AVAI == ""){
							aData.subsitution[j].REP_NAME_ERROR = "Error";
							sError = "User ID not available. Please check your entries";
							break;
						}
						
						if(mResponse.results[i].ID_ROLE == "EMP"){
							aData.subsitution[j].REP_NAME_ERROR = "Error";
							sError = "No manager Role exist for the assigned account. Please verify";
							break;
						}
					}

				if (sError == null) {  //Save data to backend
					//convert REP_NAME to uppercase
					for (var i = 0 ; i < aData.subsitution.length; i++){
						aData.subsitution[i].REP_NAME = aData.subsitution[i].REP_NAME.toUpperCase();
					}
			
					this.saveSubstitution(aData);
				} else {  //Show error message
					sap.m.MessageToast.show(sError);
		//			this["Substitution"].getContent()[0].getModel().setData(aData);
				}
				this["Substitution"].getContent()[0].getModel().setData(aData);
								
				}
			}, this),
			error : jQuery.proxy(function(error) {
				jQuery.sap.require("sap.m.MessageToast");
			}, this)
		});
	},

	onSubstitutionAddPress: function(evt){
		var oData = this["Substitution"].getModel().getData();
		var oDataItem = {US_NAME: sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_NTID,REPPR : "SWIFT", isNew: true}; //Changed value of REPPR from ALL to SWIFT 27/4/2020 uml6kor-uea6kor
		oData.subsitution.push(oDataItem);
		oData.view.length++;
		this["Substitution"].getModel().setData(oData);
	},

	onSubStitutionDeletePress: function(evt){
		var iIndex = evt.getSource().getParent().getParent().getSelectedIndex();
		if( iIndex != -1 ){
			var oData = this["Substitution"].getModel().getData();
			oData.subsitution.splice(iIndex,1);
			oData.view.length--;
			this["Substitution"].getModel().setData(oData);
		}
	},

	validateSubstitution: function(aData){
		for(var i=0;i<aData.subsitution.length;i++){
			if(aData.subsitution[i].REP_NAME == "" || aData.subsitution[i].REP_NAME == undefined){
				aData.subsitution[i].REP_NAME_ERROR = "Error";
				return "Please enter required field(s)";
			}else{
				aData.subsitution[i].REP_NAME_ERROR = "None";
			}
			if(aData.subsitution[i].BEGDA == "" || aData.subsitution[i].BEGDA == undefined){
				aData.subsitution[i].BEGDA_ERROR = "Error";
				return "Please enter required field(s)";
			}else{
				aData.subsitution[i].BEGDA_ERROR = "None";
			}
			if(aData.subsitution[i].ENDDA == "" || aData.subsitution[i].ENDDA == undefined){
				aData.subsitution[i].ENDDA_ERROR = "Error";
				return "Please enter required field(s)";
			}else{
				aData.subsitution[i].ENDDA_ERROR = "None";
			}
			
			if(sap.ui.project.e2etm.util.StaticUtility.checkDateOverclap(aData.subsitution[i].ENDDA,aData.subsitution[i].BEGDA)){
				aData.subsitution[i].BEGDA_ERROR = "Error";
				aData.subsitution[i].ENDDA_ERROR = "Error";
				return "Start Date cannot be after End Date";
			}else{
				aData.subsitution[i].BEGDA_ERROR = "None";
				aData.subsitution[i].ENDDA_ERROR = "None";
			}
						
			if(i < aData.subsitution.length -1 ){
			
				if(!sap.ui.project.e2etm.util.StaticUtility.checkDateOverclap(aData.subsitution[i].ENDDA,aData.subsitution[i+1].BEGDA)){
					aData.subsitution[i].ENDDA_ERROR = "Error";
					aData.subsitution[i+1].BEGDA_ERROR = "Error";
					return "Overlapping substitution found. Please verify";
				}else{
					aData.subsitution[i].ENDDA_ERROR = "None";
					aData.subsitution[i+1].BEGDA_ERROR = "None";
//					oTable.getItems()[i].getCells()[2].setValueState("None");
//					oTable.getItems()[i+1].getCells()[1].setValueState("None");
				}
			}
			
			
			
			
			
			
		}
	},

	saveSubstitution: function(aData){
		//Save data in deep entity
		sap.ui.project.e2etm.util.StaticUtility.setBusy(true,oHomeThis);
		var token = "";
		var get = $.ajax({
			cache: false,
			url: sServiceUrl + "EMP_PASSPORT_INFOSet",
			type: "GET",
			headers: {
				'Authorization': token
			},
			beforeSend: function(xhr){
				xhr.setRequestHeader('X-CSRF-Token', 'Fetch');
			},
		});

		get.done(function(result, response, header){
			token = header.getResponseHeader("X-CSRF-Token");
			var aSave = $.extend(false, {}, sap.ui.getCore().getModel("profile").getData().employeeDetail);
			delete aSave.__metadata;
			delete aSave.isEditable;
			delete aSave.isNotSingle;

			aSave.EMPtoEMPDEPNDNT = new Array();
			aSave.EMPtoSUBSTITUTION = $.extend(true, [], aData.subsitution);
			for(var i=0;i<aSave.EMPtoSUBSTITUTION.length;i++){
				delete aSave.EMPtoSUBSTITUTION[i].REP_NAME_ERROR;
				delete aSave.EMPtoSUBSTITUTION[i].BEGDA_ERROR;
				delete aSave.EMPtoSUBSTITUTION[i].BEGDA_VALUE;
				delete aSave.EMPtoSUBSTITUTION[i].ENDDA_ERROR;
				delete aSave.EMPtoSUBSTITUTION[i].ENDDA_VALUE;
				delete aSave.EMPtoSUBSTITUTION[i].isNew;
				delete aSave.EMPtoSUBSTITUTION[i].__metadata;
			}
			jQuery.ajax({
				cache: false,
				url: sServiceUrl + "DEP_EMPSet",
				type: "POST",
				beforeSend: function(xhr){
					xhr.setRequestHeader('X-Requested-With', "XMLHttpRequest");
					xhr.setRequestHeader('X-CSRF-Token', token);
					xhr.setRequestHeader('Accept', "application/json");
					xhr.setRequestHeader('DataServiceVersion', "2.0");
					xhr.setRequestHeader('Content-Type', "application/json");
				},
				data: JSON.stringify(aSave),
				dataType:"json",
				success: function(data) {
					sap.m.MessageToast.show("Saved successfully");
					sap.ui.project.e2etm.util.StaticUtility.setBusy(false,oHomeThis);
				},
				fail: function(data) {
					alert("Error occurs");
					sap.ui.project.e2etm.util.StaticUtility.setBusy(false,oHomeThis);
				}
			});
		});
	},
	openHelpDoc : function(evt) {
		window.open("http://sgpmis02.apac.bosch.com/Helpdesk/ESS/swifthelpdoc/Deputation/landingpage.html",
				'_blank' // <- This is what makes it open in a new window.
		);
	},
	
	// PREPARE link to check USER ID available and Role
	createLink: function(slist){
		var slink ="";

			for(i=0;i<slist.length;i++){
				var a = slist[i].REP_NAME;
				if(i==0){
					slink = slink = "BNAME+eq+'"+a.toUpperCase()+"'";
				}else{
					slink = slink + "+or+BNAME+eq+'"+a.toUpperCase()+"'";	
				}			
			}
		return slink;
	},
	
	
/*------------------------USER EVENT HANDLER AREA BEGIN------------------------*/
//dye5kor
	
	onSendNotificationsPress:function(evt){
		
		sap.ui.core.routing.Router.getRouter("MyRouter").navTo("DepuNotifications");
	},
	
	
	onPdmCalenderPress:function(evt){
		
		sap.ui.core.routing.Router.getRouter("MyRouter").navTo("PreDepartureCalender");
	},
	
//dye5kor
	/*------------------------TinhTD AREA BEGIN------------------------*/
	_navToPageByKey: function(sKey) {
		sap.ui.core.routing.Router.getRouter("MyRouter").navTo(sKey);
	},
	_prepareDataForBusinessTravel: function() {
		var globalData = sap.ui.getCore().getModel("global").getData();

		globalData.ZZ_VISA_REQ = "";
		globalData.whichTab = "MT";
		globalData.ZZ_NACTION_BY = "X";
		//globalData.ZZ_NACTION_BY = sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_PERNR;
		globalData.ZZ_DEP_PERNR = sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_PERNR;
		sap.ui.getCore().getModel("global").setData(globalData);
	},
	 // Start of change by UEA6KOR_9.9.2019
	
	  onRequestCreateValidation: function(){
		  var get = $.ajax({
				cache: false,
				url: sServiceUrl + "CheckRequestCreation?ZZ_PERNR='" + sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_PERNR + "'&$format=json",
				type: "GET",
				async : false
			});
		  
	  get.done(function(result){
	  if(result != null){
		  	 xflag = result.d.CheckRequestCreation.ZZ_FLAG; 	 
	   }	  
	 });
	  
	  if(xflag == 'X'){
		  var text = 'You have open travel requests with pending/incomplete Travel settlement. You are not allowed to create any new requests until the settlement process is complete for pending travel requests ';// ask for text to madhu
			sap.ca.ui.message.showMessageBox({
				type: sap.ca.ui.message.Type.ERROR,
				message: text,
				details: text
			});
	
			return false;
	  }	
	  else{
		  return true;
	  }
	  },
	 // End of change by UEA6KOR_9.9.2019
	  
	/*START BUSINESS UX COMMENTED by uml6kor 2/7/2019*
	  onBusinessTravelHandle: function() {    
	//	  this.onRequestCreateValidation();
//		 if( !this.onRequestCreateValidation() ){  //Added by  UEA6KOR_9.9.2019
//			 
//		 } 
		 
		  if(this.onRequestCreateValidation()){  //Added by  UEA6KOR_9.9.2019
			 
		  var that = this;
			//prepare data
			that._prepareDataForBusinessTravel();
			//move to detail page
			//strted by uml6kor newpolicy popup business 24/6/2019
			var dialog = new sap.m.Dialog({
				
				title: 'Confirm',
				type: 'Message',
				content: new sap.m.Text({ text: "1. China - It is advisable to submit the documents minimum 30 days in advance, else Associate has to travel to Mumbai / Delhi for personal submission."+
					 "\n2. Turkey - If you are holding valid Schengen / USA / UK and Ireland - you can apply for E visa else you have to go with offline submission, then documents should be notarized with Mantralaya, Mumbai which would increase the processing time."
					+"\n3. Bangladesh � Applicant has to travel to Delhi / Mumbai / Kolkata and submit the documents to Embassy personally."
					+"\n4. Brazil - Increase in lead time as documents to be notarized with Mantralaya, Mumbai. "
					+"\n5. Romania - Applicant has to travel in Person to Delhi and submit the documents to Embassy and it is advisable to plan the travel 30 days in advance." }),
				beginButton: new sap.m.Button({
					text: 'Continue',
					press: function () {
						dialog.destroy();	//added by uml6kor 30/8/2019
						//that._navToPageByKey("businessTravelRequest");//commented by uml6kor 30/8/2019
						//that._navToPageByKey("TravelRequest");
						sap.ui.core.routing.Router.getRouter("MyRouter").navTo("TravelRequest", {
							"reqId":'NewRequest' ,"ischange":false
						});	
					}
				}),
				endButton: new sap.m.Button({
					text: 'Cancel',
					press: function () {
						dialog.close();
					}
				}),
//				afterClose: function() { //commented by uml6kor 30/8/2019
//					dialog.destroy();
//				}
			});
			dialog.open();
//ended  popup business 24/6/2019 by uml6kor
//
//			that._navToPageByKey("businessTravelRequest");
//			that._navToPageByKey("TravelRequest");
	  }
		}
	/*END BUSINESS UX COMMENTED by uml6kor 2/7/2019
	*/
	/*------------------------TinhTD AREA END------------------------*/
	
});