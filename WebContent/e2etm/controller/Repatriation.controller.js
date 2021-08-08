jQuery.sap.require("sap.ui.project.e2etm.util.Formatter");
jQuery.sap.require("sap.ui.project.e2etm.util.StaticUtility");
sap.ui.controller("sap.ui.project.e2etm.controller.Repatriation", {

    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     * @memberOf e2etm.view.AccmTool
     */
    onInit: function() {
        sap.ui.core.routing.Router.getRouter("MyRouter").attachRoutePatternMatched(this.onRouteMatched, this);

    },
    onRouteMatched: function(evt) {
        var oThis = this;
        oRepatriation = this;
        if (evt.getParameter("name") == "Repatriation") {
            var view = evt.mParameters.view;
            oThis = view.getController();
            var oShell = oComponent.oContainer.getParent();
            oShell.setAppWidthLimited(false);
            var par1 = evt.getParameter("arguments").TpNo;
            var TpNo = Base64.decode(par1)
        	var par2 = evt.getParameter("arguments").EmpNo;
            var EmpNo = Base64.decode(par2);
            oThis.getDetails(TpNo,EmpNo);
            
            oThis.TpNo =TpNo ;oThis.EmpNo=EmpNo;

        } else {
            var oShell = oComponent.oContainer.getParent();
            oShell.setAppWidthLimited(true);
        }
    },
    onNavBack: function() {
        window.history.go(-1);
    },
    
    getDetails:function(TpNo,EmpNo){
    	var oThis = this;
    	sap.ui.project.e2etm.util.StaticUtility.setBusy(true, oRepatriation);
    	// get empno and tp no from url
		var currentRole = sap.ui.getCore().getModel("profile").getData().currentRole;
        var global = sap.ui.getCore().getModel("global").getData();
		
        /// files
        var fileModel = new sap.ui.model.json.JSONModel();
		fileModel.setData({
			Files : []
		});
		oThis.getView().setModel(fileModel, "new");
		/// Header details
		var model = new sap.ui.model.json.JSONModel();
        if( global.ZZ_VERSION || global.ZZ_DEP_PERNR || global.ZZ_TRV_REQ){ //global.ZZ_REQ_TYP
        	if(global.ZZ_VERSION !=""){
        		var version = global.ZZ_VERSION.trim();
        	}
        	else{
        		var version = "";
        	}
        	var general = oDataModel.createBatchOperation("TrvStGenDataSet(EmpNo='" + global.ZZ_DEP_PERNR + "',TravelPlan='" + global.ZZ_TRV_REQ + "',Version='" + version + "',TravelType='DEPU',LoginRole='" + currentRole + "',Module='TRST',Item='1')?$expand=TRV_COST_ASGNSet", "GET");
        	var getDocs = oDataModel.createBatchOperation("DmsDocsSet?$filter=DepReq+eq+'" + global.ZZ_TRV_REQ + "'+and+EmpNo+eq+'" + global.ZZ_DEP_PERNR + "'+and+DocType+eq+'REPS'", "GET");
        	//var hrbp = oDataModel.createBatchOperation("HRBP_F4Set", "GET");
        	//Added by uik1kor on 08/10/2020
        	var hr = '13';
        	if( currentRole == 'GRM')
        		{
        			hr = '14';
        		}
        	var hrbp = oDataModel.createBatchOperation("HRBP_F4Set?$filter=ZZ_ROLE+eq+'" + hr + "'", "GET");
        	//end of addition
        	oDataModel.addBatchReadOperations([general,getDocs,hrbp]);
            oDataModel.submitBatch(function(oResult) {
            	model.setData(oResult.__batchResponses[0].data);
            	model.getData().currentRole = sap.ui.getCore().getModel("profile").getData().currentRole;
            	model.getData().Manager = sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_GRM;
            	model.getData().loggedinEmpNo = sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_PERNR;
            	model.getData().display = global.display;
            	model.getData().ZZ_COMABBR = global.ZZ_COMABBR;
    			oThis.getView().setModel(model, "travelsettlement");
    			
    			///// get files
    			var filesAll = oResult.__batchResponses[1].data.results;
				var uploadData = oThis.getView().getModel("new").getData();
				uploadData.Files = filesAll;
				oThis.getView().getModel("new").setData(uploadData);
				oThis.getView().getModel("new").refresh(true);
				
				// hrbp list
				var hrbpModel = new sap.ui.model.json.JSONModel();
				hrbpModel.setData(oResult.__batchResponses[2].data.results);
				if( currentRole == 'GRM')
        		{
					oThis.getView().setModel(hrbpModel,"hrpp");
        		}
				else{
				oThis.getView().setModel(hrbpModel,"hrbp");
				}
				
				/// Repatriation
				var repatriation = new sap.ui.model.json.JSONModel();
		        var filterURL =  "RepatriationSet(ZZ_REP_REQ='" +TpNo  + "',ZZ_REP_PERNR='" + EmpNo +"')";
		    	oDataModel.read(filterURL, null, null, true, function(oData, response) {
		    		 if(oData){
		            	if( oData.ZZ_RADIO_MS !="" ){
		            		oData.ZZ_RADIO_MS = parseInt( oData.ZZ_RADIO_MS);
		            	}
		            	else{
		            		oData.ZZ_RADIO_MS = 3;
		            	}
		            	if( oData.ZZ_RADIO_ES !="" ){
		            		oData.ZZ_RADIO_ES = parseInt( oData.ZZ_RADIO_ES);
		            	}
		            	else{
		            		oData.ZZ_RADIO_ES = 3;
		            	}
		            	if(oData.ZZ_SDATE_M == "00000000"){
		            		oData.ZZ_SDATE_M ="";
		            	}
		            	if(oData.ZZ_REQ_MGR !=""){
		            			oThis.getView().getModel("travelsettlement").getData().Manager = oData.ZZ_REQ_MGR;
		                		oThis.getView().getModel("travelsettlement").refresh();
		            	}
		            	if(oData.ZZ_STATUS == "NEW"){
		            		var endDate = model.getData().EndDate;
		            		var Value = new Date(parseInt(endDate.substring(0,4)),parseInt(endDate.substring(4,6)),parseInt("01"));
		            		oData.ZZ_SDATE_E = Value.getFullYear()+""+((Value.getMonth() <10) ? ("0"+(Value.getMonth()+1)): Value.getMonth())+""+((Value.getDate() <10) ? ("0"+(Value.getDate())): Value.getDate());
		            	}
		            	if(oData.ZZ_STATUS == "Submitted by Employee"){
		            		var endDate = model.getData().EndDate;
	                        var Value = new Date(parseInt(endDate.substring(0,4)),parseInt(endDate.substring(4,6)),parseInt("01"));
	                        oData.ZZ_SDATE_M = Value.getFullYear()+""+((Value.getMonth() <10) ? ("0"+(Value.getMonth()+1)): Value.getMonth())+""+((Value.getDate() <10) ? ("0"+(Value.getDate())): Value.getDate());
		            	}
		            	if(oData.ZZ_HPERNR == "00000000"){
		            		oThis.getView().byId("idAssignHRBP").setSelectedKey("");
		            	}
		            	if(oData.ZZ_HPERNR == "00000000"){
		            		oThis.getView().byId("idAssignHRLPP3").setSelectedKey("");
		            	}
		            }
		    		repatriation.setData(oData);
		    		oThis.getView().setModel(repatriation,"repatriation");
				}, function(error) {
					sap.m.MessageToast.show("Internal Server Error");
					sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oRepatriation);
				});
            },
            function(error) {
            	sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oRepatriation);
            	window.history.go(-1);
            });
        }
        else{
        	window.history.go(-1);
        	sap.ui.core.BusyIndicator.hide();
        }
    	/// For Logs
    	 var history = new sap.ui.model.json.JSONModel();
         var historyURL =  "RepatriationLogSet?$filter=ZZ_REP_PERNR eq'"+ EmpNo + "' and ZZ_REP_REQ eq '"+ TpNo +"'";
     	oDataModel.read(historyURL, null, null, true, function(oData, response) {
     		sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oRepatriation);
     		history.setData(oData);
     		oThis.getView().setModel(history,"history");
 		}, function(error) {
 			sap.m.MessageToast.show("Internal Server Error");
 			sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oRepatriation);
 		});
    	
    	
    },
    onChangeEmpRemarks:function(){
    	var val = this.getView().byId("idEMpRemarks").setValue();
    	if(val != ""){
    		this.getView().byId("idEMpRemarks").setValueState("None");
    	}
    },
    postRepatriationRequest:function(value,sendBackTo){
    	var oThis = this;
    	sap.ui.project.e2etm.util.StaticUtility.setBusy(true, oRepatriation);
    	// get details
    	var currentRole = sap.ui.getCore().getModel("profile").getData().currentRole;
    	var postData = this.getView().getModel("repatriation").getData();
    	if(currentRole == "EMP" && value=="Submit"){
    		postData.ZZ_ACTION = "01";
    		postData.ZZ_NEXTACTION = "";
    		postData.ZZ_ROLE = "01";
    	}
    	else if(currentRole == "GRM"&& value=="Approve"){
    		postData.ZZ_ACTION = "03";
    		postData.ZZ_NEXTACTION = "";
    		postData.ZZ_ROLE = "02";
			/*postData.ZZ_HNAME = this.getView().byId("idAssignHRBP").getValue();
			postData.ZZ_HPERNR = this.getView().byId("idAssignHRBP").getSelectedKey();*/
    		postData.ZZ_HPNAME = this.getView().byId("idAssignHRLPP3").getValue();
			postData.ZZ_HPPERNR = this.getView().byId("idAssignHRLPP3").getSelectedKey();
    	}
    	//// HRBP Approve
    	else if(currentRole == "REBP"&& value=="Approve"){
    		postData.ZZ_ACTION = "03";
    		postData.ZZ_NEXTACTION = "";
    		postData.ZZ_ROLE = "13";
    	}
    	// HRL-PP3 Approve
    	else if(currentRole == "REPP"&& value=="Approve"){
    		postData.ZZ_ACTION = "03";
    		postData.ZZ_NEXTACTION = "";
    		postData.ZZ_ROLE = "14";
    	}
    	// Manager send back to employee
    	else if(currentRole == "GRM" && value=="sentBack"){
    		postData.ZZ_ACTION = "02";
    		postData.ZZ_NEXTACTION = ""; 
    		postData.ZZ_ROLE = "02";
    	}
    	// HRBP Send back to Manager
    	else if(currentRole == "REBP" && value=="sentBack"){
    		postData.ZZ_ACTION = "02";
    		postData.ZZ_NEXTACTION = ""; 
    		postData.ZZ_ROLE = "13";
    	}
    	
    	// HRL-PP3 Send back to HRBP
    	else if(currentRole == "REPP" && value=="sentBack" && sendBackTo =="HRBP"){
    		postData.ZZ_ACTION = "35"; //10
    		postData.ZZ_NEXTACTION = ""; 
    		postData.ZZ_ROLE = "14";
    	}
    	// HRL-PP3 Send back to Manager
    	else if(currentRole == "REPP" && value=="sentBack" && sendBackTo =="Manager"){
    		postData.ZZ_ACTION = "02"; 
    		postData.ZZ_NEXTACTION = ""; 
    		postData.ZZ_ROLE = "14"; 
    	}
    	postData.ZZ_REP_RELALLWC ="INR";
    	postData.ZZ_RADIO_ES = postData.ZZ_RADIO_ES.toString();
    	postData.ZZ_RADIO_MS = postData.ZZ_RADIO_MS.toString();
    	// service call 
    	oDataModel.create("RepatriationSet", postData, null,function(oData, response) {
    		sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oRepatriation);
			sap.m.MessageToast.show("Sent Successfully");
			//// Update data on HRBP/HRlPP3 Dashboard
			if(currentRole == "REBP" || currentRole == "REPP"){
				if(currentRole == "REBP"){
						//var action = profile.employeeDetail.ZZ_DEP_PERNR;
						var action="88888888";
					}
					else if(currentRole == "REPP"){
						var action ="99999999";
						//var action = profile.employeeDetail.ZZ_DEP_PERNR;
					}
					var hrbpModel = new sap.ui.model.json.JSONModel();
			        var filterURL =  "RepatriationSet?$filter=ZZ_NEXTACTION eq '" +action+"'" ;
			    	oDataModel.read(filterURL, null, null, true, function(oData, response) {
			    		sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oRepatriation);
			    		hrbpModel.setData(oData);
			    		oThis.getView().setModel(hrbpModel,"hrbp");
			    		sap.ui.getCore().setModel(hrbpModel,"hrbp");
						window.history.go(-1);
					}, function(error) {
						sap.m.MessageToast.show("Internal Server Error");
						sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oRepatriation);
					});
			}
			else{
			window.history.go(-1);
			}
		},function(error) {
			sap.m.MessageToast.show("Internal Server Error");
			sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oRepatriation);
		}, true);
    	
    },
    onPressSubmit:function(){
    	var postData = this.getView().getModel("repatriation").getData();
    	var effDate = postData.ZZ_SDATE_E;
    	var endDate = this.getView().getModel("travelsettlement").getData().EndDate;
    	var EffectiveDate = new Date(parseInt(effDate.substring(0,4)),parseInt(effDate.substring(4,6)-1),parseInt(effDate.substring(6,8)));
    	var EndDate = new Date(parseInt(endDate.substring(0,4)),parseInt(endDate.substring(4,6)-1),parseInt(endDate.substring(6,8)));
        // Start of change by uik1kor on 02/09/2020 to check the manager data on submit
    	var mgr = "";
    	var epernr = this.getView().getModel("travelsettlement").getData().EmpNo;
    	var getmgrurl = sServiceUrl + "GetManagerDetls/?EPernr='"+epernr+"'";
		var get = $.ajax({
			cache: false,
			url: getmgrurl, 
			type: "GET",
			async: false,
			dataType:'json',
		});
		get.done(function(result) {
			var l = result.d.results.length;
			if(l > 0)
				{
				mgr = result.d.results[0].MgrFname;
				}
		});
		get.fail(function(err) {
			sap.m.MessageBox.error("We are not able to Porcess your request.Try After some time");
		});	
    		    	if(mgr === "")
    		    		{
//start of code uml6kor 9/3/2021 RBEIITAPPPIPELINE-1364 repatriation manager changes
    		    		if(EffectiveDate >= EndDate){
    		        		
    		    	    	if(postData.ZZ_RADIO_ES != 3 && postData.ZZ_SDATE_E){
    		    	    		if(postData.ZZ_RADIO_ES == 2 && postData.ZZ_EMP_REMRK == ""){
    		    	    			this.getView().byId("idEMpRemarks").setValueState("Error");
    		    	    			sap.m.MessageBox.error("Please enter remarks");
    		    	    			return;
    		    	    		}
    		    	    		
    		    	    	}
    		    	    	else{
    		    	    		if(postData.ZZ_SDATE_E == ""){
    		    	    			this.getView().byId("idEMpDate").setValueState("Error");

        		    	    		sap.m.MessageBox.error("Please enter all fields");
        		    	    		return;
        		    	    		}
    		    	    	}
    		    	    	}
    		    	    	else{
    		    	    		sap.m.MessageBox.error("Effective date cannot be less than the Travel end date");

    		    	    		return;
    		    	    		}
	    		    			if (this.oCommonDialog) {
	    							this.oCommonDialog.destroy();
	    						}
	    						// instantiate the Fragment if not done yet
	    						this.oCommonDialog = sap.ui.xmlfragment("sap.ui.project.e2etm.fragment.common.CheckValidMgr", this);
	    						this.oCommonDialog.open();
	    	    				    	    			
	    	    		
    		    		
//end of code uml6kor 9/3/2021 RBEIITAPPPIPELINE-1364 repatriation manager changes

//commented below code uml6kor 9/3/2021 RBEIITAPPPIPELINE-1364 repatriation manager changes
    						/*
    						this.oErrorMessageDialog = new sap.m.Dialog({
    							type: sap.m.DialogType.Message,
    							title: "Error",
    							state: sap.ui.core.ValueState.Error,
    							content: [new sap.m.VBox({ items:[
    								new sap.m.Text({text :"No approver detected. Please contact RBEI IT application support"}),new sap.m.Link({
    		                text: "RBEI.IT.ApplicationSupport@in.bosch.com",
    		                press: this.handleLinkPress
    		                })]
    		                })],
    							beginButton: new sap.m.Button({
    								type: sap.m.ButtonType.Emphasized,
    								text: "OK",
    								press: function () {
    									this.oErrorMessageDialog.close();
    								}.bind(this)
    							}),
    							//afterClose: function () {
    								//	this.oErrorMessageDialog.destroy();
    								//} 
    						});
    					}

    					this.oErrorMessageDialog.open();
    		    		}*/
       }
    		    	//End of change on 02/09/2020  
    	else{
    	if(EffectiveDate >= EndDate){
    		
    	if(postData.ZZ_RADIO_ES != 3 && postData.ZZ_SDATE_E){
    		if(postData.ZZ_RADIO_ES == 2 && postData.ZZ_EMP_REMRK == ""){
    			this.getView().byId("idEMpRemarks").setValueState("Error");
    			sap.m.MessageToast.show("Please enter remarks");
    		}
    		else{
    			var value="Submit"
    	    	this.postRepatriationRequest(value);
    		}
    	}
    	else{
    		if(postData.ZZ_SDATE_E == ""){
    			this.getView().byId("idEMpDate").setValueState("Error");
    		}
    		sap.m.MessageToast.show("Please enter all fields");
    	}
    	}
    	else{
    		sap.m.MessageBox.error("Effective date cannot be less than the Travel end date");
    	}
    	}
    },
    handleLinkPress : function()
    {
    	sap.m.URLHelper.triggerEmail("RBEI.IT.ApplicationSupport@in.bosch.com", "","","","");
    }, 
    onPressSentBack:function(evt){
    	
    	// Sent back
    	var currentRole = sap.ui.getCore().getModel("profile").getData().currentRole;
    	var postData = this.getView().getModel("repatriation").getData();
    	
    	//Manager send back
    	if(currentRole =="GRM"){
    		if(currentRole =="GRM"&& postData.ZZ_MGR_COMM){
    			postData.ZZ_SDATE_M = "";
        		postData.ZZ_RADIO_MS = 3;
        		var value = "sentBack";
    	    	this.postRepatriationRequest(value); 
        	}
        	else{
        		this.getView().byId("idManagerComments").setValueState("Error");
        		sap.m.MessageToast.show("Please enter Comments");
        	}
    	}
    	else if(currentRole =="REBP"){
    		if(currentRole =="REBP"&& postData.ZZ_HBP_COMM){
        		var value = "sentBack";
    	    	this.postRepatriationRequest(value); 
        	}
        	else{
        		this.getView().byId("idHRBPComments").setValueState("Error");
        		sap.m.MessageToast.show("Please enter Comments");
        	}
    	}
    	else if(currentRole =="REPP"){
    		var sendBackTo = "Manager";
    		if(currentRole =="REPP"&& postData.ZZ_HPP_COMM){
        		var value = "sentBack";
    	    	this.postRepatriationRequest(value,sendBackTo); 
        	}
        	else{
        		this.getView().byId("idHRPPComments").setValueState("Error");
        		sap.m.MessageToast.show("Please enter Comments");
        	}
    	}
    	
    },
    
    onPressApprove:function(){
    	var currentRole = sap.ui.getCore().getModel("profile").getData().currentRole;
    	var postData = this.getView().getModel("repatriation").getData();
    	if(currentRole =="GRM"){
    		if(postData.ZZ_SDATE_M >= this.getView().getModel("travelsettlement").getData().EndDate){
    			if(postData.ZZ_RADIO_MS !=3 && postData.ZZ_SDATE_M && postData.ZZ_HPNAME && postData.EmpOrgUnit ){
        			if(postData.ZZ_RADIO_MS == 2 && postData.ZZ_MGR_REMRK == ""){
            			this.getView().byId("idManagerRemarks").setValueState("Error");
            			sap.m.MessageToast.show("Please enter remarks");
            		}
            		else{
                		var value="Approve"
                	    this.postRepatriationRequest(value);
            		}
            	}
            	else{
            		if(postData.ZZ_SDATE_M == ""){
            			this.getView().byId("idManagerDate").setValueState("Error");
            		}
            		if(postData.EmpOrgUnit == ""){
            			this.getView().byId("idEmpOrgUnit").setValueState("Error");
            		}
            		sap.m.MessageToast.show("Please enter all fields");
            	}
    		}
    		else{
        		sap.m.MessageBox.error("Effective date cannot be less than the Travel end date");
        	}
    		
    	}
    	else if(currentRole =="REBP"){
    		var value="Approve"
        	    this.postRepatriationRequest(value);
    	}
    	else if(currentRole =="REPP"){
    		if(postData.ZZ_REP_ALLWC){
    			if(postData.ZZ_REP_ALLWC =="Yes" && postData.ZZ_REP_RAAMT ==""){
        			sap.m.MessageToast.show("Please enter amount");
        		}
        		else{
        			var value="Approve"
                    this.postRepatriationRequest(value);
        		}
    		}
    		else{
    			sap.m.MessageToast.show("Please enter madatory fields");
    		}
    	}
    	
    },
    /// files
    
    onFileUpload : function(evt) {
    	var oThis = this;
		var file = evt.getParameters("files").files[0];
		var oData = evt.oSource.getParent().getModel("travelsettlement").getData();
		var sModule = "REPS";
		// oThis.getView().byId("UploadCollection").aItems=[];
		sap.ui.project.e2etm.util.StaticUtility.uploadCollectionFile(oThis, file, oThis.TpNo, oThis.EmpNo, sModule);
		// oThis.uploadCollectionFile(evt.oSource, oThis, file,
		// oData.traveldetails.TravelPlan, oData.traveldetails.EmpNo, sModule);
	},
	onFileDeleted : function(oEvent) {
		var oThis = this;
		// prepare FileName
		var sFileName = oEvent.getParameters("item").item.getFileName();
		// prepare DocType
		var oData = oEvent.oSource.getParent().getModel("travelsettlement").getData();
		var sDocType;
		sDocType = "REPS";
		// prepare travel request number
		var sDepReq =oThis.TpNo;
		// prepare employee number
		var sEmpNo = oThis.EmpNo;
		// prepare index
		var sIndex = 0;
		sap.ui.project.e2etm.util.StaticUtility.deleteUploadCollectionFile(oThis, oEvent, sDepReq, sFileName, sDocType, sEmpNo, sIndex);
		// evt.oSource.fireUploadComplete();
	},
	onUploadComplete : function(oEvent) {
		var oThis = this;
		oThis.getView().getModel("new").refresh(true);
		// oEvent.oSource.setUploadUrl("");
	},
	onViewPDFPress:function(){
		var fileUrl;
		var oThis= this;
		if (window.location.hostname == "localhost")
			fileUrl = "proxy/sap/opu/odata/sap/ZE2E_DEP_NWGS_SRV/TravelPdfSet(EmpNo='"+oThis.EmpNo+"',TrNo='"+oThis.TpNo+"',TrvKey='DEPU',Module='REPS')/$value";
		else
			fileUrl = "/sap/opu/odata/sap/ZE2E_DEP_NWGS_SRV/TravelPdfSet(EmpNo='"+oThis.EmpNo+"',TrNo='"+oThis.TpNo+"',TrvKey='DEPU',Module='REPS')/$value";

		//pdflink.setHref(fileUrl);
		window.open(fileUrl, "_blank");
	},
	ChangeValueState:function(evt){
		this.getView().byId(evt.getSource().getId()).setValueState("None");
		if(evt.getSource().getId().indexOf("idEMpDate") != -1){
			var date =this.getView().byId("idEMpDate").getDateValue().getDate();
			if(date != 1 || date !=01){
				sap.ui.define(["sap/m/MessageBox"], function(MessageBox) {
            		MessageBox.warning(
            				"Please make sure the effective date is first day of the month. In case of deviation, please attach necessary approvals. Else request may be sent back for clarifications by HR.", {
            				title: "Warning",
            				actions: [MessageBox.Action.OK],
            				onClose: function(oAction) {}
            			}
            		);
            	});
			}
		}
		else if(evt.getSource().getId().indexOf("idManagerDate") != -1){
			var date =this.getView().byId("idManagerDate").getDateValue().getDate();
			if(date != 1 || date !=01){
				sap.ui.define(["sap/m/MessageBox"], function(MessageBox) {
            		MessageBox.warning(
            				"Please make sure the effective date is first day of the month. In case of deviation, please attach necessary approvals. Else request may be sent back for clarifications by HR.", {
            				title: "Warning",
            				actions: [MessageBox.Action.OK],
            				onClose: function(oAction) {}
            			}
            		);
            	});
			}
		}
		else if(evt.getSource().getId().indexOf("idAssignHRBP") != -1){
			this.onChangeHrbp();
		}
		// Added by uik1kor
		else if(evt.getSource().getId().indexOf("idAssignHRLPP3") != -1){
			this.onChangeHrlpp();
		}
		//end
		
	},
	onViewReportPress:function(){
		sap.ui.core.routing.Router.getRouter("MyRouter").navTo("HRBPReports");
	},
	//Added by uik1kor
	onChangeHrlpp:function(){
		var data = this.getView().getModel("repatriation").getData();
		data.ZZ_HPNAME = this.getView().byId("idAssignHRLPP3").getValue();
		data.ZZ_HPPERNR = this.getView().byId("idAssignHRLPP3").getSelectedKey();
		this.getView().getModel("repatriation").refresh();
	},
	//end
	onChangeHrbp:function(){
		var data = this.getView().getModel("repatriation").getData();
		data.ZZ_HNAME = this.getView().byId("idAssignHRBP").getValue();
		data.ZZ_HPERNR = this.getView().byId("idAssignHRBP").getSelectedKey();
		this.getView().getModel("repatriation").refresh();
	},
	onChangeRelocationAmount:function(){
		var data = this.getView().byId("idReLocationAllowance").getValue();
		if(data =="Yes"){
			this.getView().byId("idRelocationAmount").setEditable(true);
		}
		else{
			this.getView().byId("idRelocationAmount").setEditable(false);
		}
	},
	//start of code uml6kor 9/3/2021 RBEIITAPPPIPELINE-1364 repatriation manager changes
	onSubmitMgrNTID: function(){
		var that= this;
		var ntidmgr1 = sap.ui.getCore().byId("ManagerL1").getValue().toUpperCase();
		var ntidmgr2 = sap.ui.getCore().byId("ManagerL2").getValue().toUpperCase();
		var empNtid = sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_NTID;
		
		if(ntidmgr1 == empNtid || ntidmgr2 == empNtid){
			sap.ca.ui.message.showMessageBox({
				type: sap.ca.ui.message.Type.ERROR,
				message: "Manager and Employee can not be identical",
				details: "Manager and Employee can not be identical"
			});
			return;
		}
		
		if( ntidmgr1.trim() == null || ntidmgr1.trim() == undefined || ntidmgr1.trim() == "" )
			{
			sap.ca.ui.message.showMessageBox({
				type: sap.ca.ui.message.Type.ERROR,
				message: "1st level Manager's NTID is mandatory",
				details: "1st level Manager's NTID is mandatory"
			});
			return;
		
			}
		var lv_epernr = sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_PERNR;
		var error_txt = "";
		var startdate = this.getView().getModel("travelsettlement").getData().StartDate;
		var enddate = this.getView().getModel("travelsettlement").getData().EndDate;
		var get = $.ajax({
			cache: false,
			url:  sServiceUrl + "CheckValidManager?NTID_L1='"
				+ntidmgr1.trim()+"'&NTID_L2='"+ntidmgr2.trim()+"'&EmpNo='"+lv_epernr+"'&Begda='"
				+startdate +"'&Endda='"+enddate+"'&$format=json",
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
					var value="Submit";
    	    	    this.postRepatriationRequest(value);	
    	    	    }
			}
		});
		
		if( error_txt != null && error_txt != "" && error_txt != undefined ){
			
				sap.ca.ui.message.showMessageBox({
					type: sap.ca.ui.message.Type.ERROR,
					message: error_txt,
					details: error_txt
				});
				return;
			
		}
		
	}
	////end of code uml6kor 9/3/2021 RBEIITAPPPIPELINE-1364 repatriation manager changes



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