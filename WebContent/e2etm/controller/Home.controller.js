jQuery.sap.require("sap.ui.project.e2etm.util.Formatter");
jQuery.sap.require("sap.ui.project.e2etm.util.StaticUtility");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.m.MessageToast");

sap.ui.controller("sap.ui.project.e2etm.controller.Home", {

	/*------------------------CONTROLLER EVENT AREA BEGIN------------------------*/
	// This event is called only one time
	onInit: function(curEvt) {
		oHomeThis = this;

		oHomeThis.reportDeffered = $.Deferred();
		oHomeThis.requestDeffered = $.Deferred();
		oHomeThis.taskDeffered = $.Deferred();
		oHomeThis.contractletterDeferred = $.Deferred();
		oHomeThis.assigmentDeferred = $.Deferred();
		oHomeThis.coolingPeriodDeferred = $.Deferred();
		oHomeThis.managerDocsUploadOnApprove = $.Deferred();

		// Define global variables
		oHomeThis.myEmployeeTaskNumberofRows = 0;
		oHomeThis.myManagerTaskNumberofRows = 0;
		oHomeThis.myDeputationTaskNumberofRows = 0;
		oHomeThis.myECOTaskNumberofRows = 0;
		oHomeThis.myTAXTaskNumberofRows = 0;
		oHomeThis.myINSTaskNumberofRows = 0;
		oHomeThis.myCARTaskNumberofRows = 0;
		oHomeThis.myCTGTaskNumberofRows = 0;
		oHomeThis.myRequestNumberofRows = 0;

		sap.ui.core.routing.Router.getRouter("MyRouter").attachRoutePatternMatched(oHomeThis.onRouteMatched, oHomeThis);
	},
	// This event is called everytime the URL route is matched
	onRouteMatched: function(curEvt) {
		var routeName = null;
		if (curEvt.mParameters != null) {
			routeName = curEvt.getParameter("name");
		}
		if (routeName == "home") {
			oHomeThis.loadHomeView();
		}
		// UCD1KOR 22/05/2021 added below .... to reduce screen size
		var oShell = oComponent.oContainer.getParent();
		oShell.setAppWidthLimited(true);
	},
	/*------------------------CONTROLLER EVENT AREA END------------------------*/

	/*------------------------CUSTOM FUNCTION AREA BEGIN------------------------*/
	// This method is used to load the home page depending upon the role
	loadHomeView: function() {
		var that= this;
		var promise1 = jQuery.Deferred();
		var sCurrentRole = sap.ui.getCore().getModel("profile").getData().currentRole;
		try {
			if (sCurrentRole == "EMP" || sCurrentRole == "DEPU" ||
				sCurrentRole == "COC" || //11/Jun/2021 Thanh - COC team dashboard
				sCurrentRole == "GRM" || sCurrentRole == "TAX" || sCurrentRole == "ECO" || sCurrentRole == "CTG") {
				//UCD1KOR Depu Dashboard tiles creation
				if( sCurrentRole == "DEPU" || sCurrentRole == "COC"){ //11/Jun/2021 Thanh - COC team dashboard 
									
					if(this.SelectedStringFormat === undefined || sCurrentRole !== this.LastHomeViewRoleSelected){ //11/Jun/2021 Thanh - COC team dashboard
						this.LastHomeViewRoleSelected = sCurrentRole; //11/Jun/2021 Thanh - COC team dashboard
						this.SelectedStringFormat = [];
						this.SelectedTileBorder = [];
						var TileModel = new sap.ui.model.json.JSONModel();
						var oDataModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
						var sRoleParameter = "LoginRole='" + sCurrentRole + "'"; //11/Jun/2021 Thanh - COC team dashboard
						oDataModel.read("DepuCntrySt?" + sRoleParameter + "&$format=json", null, null, true, function(oData, response) {
							var TilesData = JSON.parse(response.body);
							that.arrageDataForTile(TilesData);
							TileModel.setData(TilesData.d.results);
							oHomeThis.CurrentTile = TilesData.d.results[0];
							that.getView().setModel(TileModel, "Tile");
							sap.ui.getCore().setModel(TileModel, "Tile");
							promise1.resolve();
						}, function(error) {
							sap.m.MessageToast.show("Internal Server Error");
							sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
						});
					}
					else{
						promise1.resolve();
					}
				}

				// Open busy dialog
				sap.ui.project.e2etm.util.StaticUtility.setBusy(true, oHomeThis);

				// Visibility of components set to false
				oHomeThis.getView().byId("tabStripContainer").setVisible(false);
				oHomeThis.getView().byId("tabStrip").setVisible(false);
				oHomeThis.getView().byId("tabStrip").setSelectedIndex(0);
				try {
					oDeputationThis.mainDeputationRequest = "";
				} catch (exc) {}

				// Reset values to initial state
				var globalData = sap.ui.getCore().getModel("global").getData();
				globalData.whichTab = "";
				sap.ui.getCore().getModel("global").setData(globalData);
				
				
				// Display screen's components based on role
				oHomeThis.populateComponentsFromRole();

				if(sap.ui.getCore().getModel("profile").getData().currentRole !== "DEPU"
					&& sap.ui.getCore().getModel("profile").getData().currentRole !== "COC"){ // 11/Jun/2021 Thanh - COC team dashboard
					// Bind value to screen's component
					oHomeThis.bindDataBasedOnRole();
					
				}else{
					$.when(promise1).done(
							function () {
								oHomeThis.bindDataBasedOnRole("None");
								oHomeThis.ArrangeSelectedTileBorder();
							});

				}
				// Visible components after binding
				oHomeThis.getView().byId("tabStripContainer").setVisible(true);
				sap.ui.project.e2etm.util.StaticUtility.setBusy(true, oHomeThis);//uml6kor_upgrade 6/12/2019 setting landing page busy
			} else {
				sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
			}

		} catch (exc) {
			console.log(exc);
		}
	},
	///////########### UCD1KOR 10 Feb 2021 #############///////////////////////////////////
	///############## Arrange Data for Tile Footer #########################/////////////
	arrageDataForTile:function(TilesData){
		var record = TilesData.d.results;
		for(var i=0;i<record.length;i++){
			record[i].TotalCount = record[i].Count;
			if(parseInt(record[i].Count) == 0){
				record[i].Desc = "No Data";
			}else{
				 var sts = record[i].StatusText.split(";");
				    sts.shift();
				        for(var j=0;j<sts.length;j++){
				            var desc = sts[j].split(")"); 
				            if(record[i].Desc !== undefined){
				            	record[i].Desc = record[i].Desc +","+ desc[1];
				            }else{
				            	 record[i].Desc = desc[1];
				            }
				            record[i].TotalDesc = record[i].Desc;
				        }
			}
		   
		}
	},
///////########### UCD1KOR 10 Feb 2021 #############///////////////////////////////////
	///############## Arrange Data for Tile Border #########################/////////////
	ArrangeSelectedTileBorder:function(){
		var array =[];
		if(oHomeThis.SelectedTileBorder.length !=0){
			for(var i=0;i<oHomeThis.SelectedTileBorder.length;i++){
				var val1 = oHomeThis.SelectedTileBorder[i].substr(0,6);
				var val2 = parseInt(oHomeThis.SelectedTileBorder[i].substr(6,1))+1;
				
				this.id =val1 + val2.toString() + oHomeThis.SelectedTileBorder[i].substr(7);
				try{sap.ui.getCore().byId(this.id).addStyleClass("backgroundColorClass");
				array.push(this.id);
				}catch(err){}
			}
		}
		oHomeThis.SelectedTileBorder = array.concat(oHomeThis.SelectedTileBorder);
	},
	// This method is used to set notification (number) on each tab
	setNotifications: function(requestDisplay) {
		var myRole = sap.ui.getCore().getModel("profile").getData().currentRole;
		// Set notifications in Tab my Request
		if (requestDisplay) {
			try {
				if (myRole == "GRM") {

					if (this.getView().byId("tabStrip").getSelectedIndex() == 1) {
						oHomeThis.getView().byId("tabMyRequests").setText("TEAM REQUESTS" + " (" + oHomeThis.myRequestNumberofRows + ") ");
					} else {
						oHomeThis.getView().byId("tabMyRequests").setText("TEAM REQUESTS");
					}
					return;

				} else if (myRole == "DEPU" || myRole == "COC") { // 11/Jun/2021 Thanh - add condition coc dash board
					oHomeThis.getView().byId("tabMyRequests").setText("ALL REQUESTS");
					return;
				} else {
					oHomeThis.getView().byId("tabMyRequests").setText("MY REQUESTS");
				}
				var curText = oHomeThis.getView().byId("tabMyRequests").getText();
				oHomeThis.getView().byId("tabMyRequests").setText(curText + " (" + oHomeThis.myRequestNumberofRows + ") ");
			} catch (exc) {}
		} else {
			// Set notifications in Tab my Task
			if (myRole == "GRM") {
				try {
					oHomeThis.getView().byId("tabMyTasks").setText("");
					oHomeThis.getView().byId("tabMyTasks").setText("MY TASKS (" + oHomeThis.myManagerTaskNumberofRows + ")");
				} catch (exc) {}
			} else if (myRole == "DEPU" || myRole == "COC") { // 11/Jun/2021 Thanh - add condition coc dash board
				try {
					oHomeThis.getView().byId("tabMyTasks").setText("");
					//UCD1KOR 9 Feb 2021 Commented below Line
					//oHomeThis.getView().byId("tabMyTasks").setText("MY TASKS (" + oHomeThis.myDeputationTaskNumberofRows + ")");
					oHomeThis.getView().byId("tabMyTasks").setText("MY TASKS");
				} catch (exc) {}
			} else if (myRole == "EMP") {
				try {
					oHomeThis.getView().byId("tabMyTasks").setText("");
					oHomeThis.getView().byId("tabMyTasks").setText("MY TASKS (" + oHomeThis.myEmployeeTaskNumberofRows + ")");
				} catch (exc) {}
			} else if (myRole == "ECO") {
				try {
					oHomeThis.getView().byId("tabMyTasks").setText("");
					oHomeThis.getView().byId("tabMyTasks").setText("MY TASKS (" + oHomeThis.myECOTaskNumberofRows + ")");
				} catch (exc) {}
			} else if (myRole == "TAX") {
				try {
					oHomeThis.getView().byId("tabMyTasks").setText("");
					oHomeThis.getView().byId("tabMyTasks").setText("MY TASKS (" + oHomeThis.myTAXTaskNumberofRows + ")");
				} catch (exc) {}
			} else if (myRole == "CTG") {
				try {
					oHomeThis.getView().byId("tabMyTasks").setText("");
					oHomeThis.getView().byId("tabMyTasks").setText("MY TASKS (" + oHomeThis.myCTGTaskNumberofRows + ")");
				} catch (exc) {}
			}
		}
	},
	// This method is used to display the corresponding UI Components based on the role
	populateComponentsFromRole: function() {
		var fragmentBoxes; // Boxes fragment if employee
		var fragmentMyTask; // My task fragment tab content
		var fragmentMyRequest; // My request fragment tab content

		// Destroy current content in boxes, task tab, request tab areas
		if (oHomeThis.getView().byId("pageHome").getContent().length == 4) {
			oHomeThis.getView().byId("pageHome").getContent()[1].destroy(true);
		}
		if (oHomeThis.getView().byId("tabMyTasks").getContent().length == 1) {
			oHomeThis.getView().byId("tabMyTasks").getContent()[0].destroy(true);
		}
		if (oHomeThis.getView().byId("tabMyRequests").getContent().length == 1) {
			oHomeThis.getView().byId("tabMyRequests").getContent()[0].destroy(true);
		}

		oHomeThis.getView().byId("tabMyRequests").setVisible(true);
		oHomeThis.getView().byId("CountExpectedTravel").setVisible(false); //tgg1hc
		oHomeThis.getView().byId("EmployeeTravelDetails").setVisible(false);
		oHomeThis.getView().byId("TravelEstimates").setVisible(false);

		// Check current role to display corresponding UI components
		var myRole = sap.ui.getCore().getModel("profile").getData().currentRole;
		if (myRole == "GRM") {
			// here the Fragment My Task is instantiated
			fragmentMyTask = new sap.ui.xmlfragment("sap.ui.project.e2etm.fragment.home.HOME_GRM_TaskTab", oHomeThis);
			// here the Fragment My Request is instantiated
			fragmentMyRequest = new sap.ui.xmlfragment("sap.ui.project.e2etm.fragment.home.HOME_GRM_RequestTab", oHomeThis);

			//Set visible for HPL report button
			oHomeThis.getView().byId("EmployeeTravelDetails").setVisible(true);

		} else if (myRole == "DEPU" || myRole == "COC") { // 11/Jun/2021 Thanh - add condition coc dash board
			// here the Fragment My Task is instantiated
			fragmentMyTask = new sap.ui.xmlfragment("sap.ui.project.e2etm.fragment.home.HOME_DEPU_TaskTab", oHomeThis);
			// here the Fragment My Request is instantiated
			fragmentMyRequest = new sap.ui.xmlfragment("sap.ui.project.e2etm.fragment.home.HOME_DEPU_RequestTab", oHomeThis);

			//Set visible for HPL report button
			oHomeThis.getView().byId("CountExpectedTravel").setVisible(true); //tgg1hc
			oHomeThis.getView().byId("EmployeeTravelDetails").setVisible(true);
			oHomeThis.getView().byId("TravelEstimates").setVisible(true);

		} else if (myRole == "EMP") {
			// here the Fragment Boxes is instantiated
			fragmentBoxes = new sap.ui.xmlfragment("sap.ui.project.e2etm.fragment.home.HOME_EMP_Boxes", oHomeThis);
			// here the Fragment My Task is instantiated
			fragmentMyTask = new sap.ui.xmlfragment("sap.ui.project.e2etm.fragment.home.HOME_EMP_TaskTab", oHomeThis);
			// here the Fragment My Request is instantiated
			fragmentMyRequest = new sap.ui.xmlfragment("sap.ui.project.e2etm.fragment.home.HOME_EMP_RequestTab", oHomeThis);

			// Display Additional information for employee homepage such as Employee profile box, news & updates box
			//      oHomeThis.setMyEmployeeGeneral();   // Profile box
			oHomeThis.setMyEmployeeInformation(); // News & Updates box
		} else if (myRole == "ECO") {
			// here the Fragment My Task is instantiated
			fragmentMyTask = new sap.ui.xmlfragment("sap.ui.project.e2etm.fragment.home.HOME_ECO_TaskTab", oHomeThis);
			oHomeThis.getView().byId("tabMyRequests").setVisible(false);
		} else if (myRole == "TAX") {
			// here the Fragment My Task is instantiated
			fragmentMyTask = new sap.ui.xmlfragment("sap.ui.project.e2etm.fragment.home.HOME_TAX_TaskTab", oHomeThis);
			oHomeThis.getView().byId("tabMyRequests").setVisible(false);
		} else if (myRole == "CTG") {
			// here the Fragment My Task is instantiated
			fragmentMyTask = new sap.ui.xmlfragment("sap.ui.project.e2etm.fragment.home.HOME_CTG_TaskTab", oHomeThis);
			oHomeThis.getView().byId("tabMyRequests").setVisible(false);
		}
		try {
			oHomeThis.getView().byId("pageHome").insertContent(fragmentBoxes, 1);
		} catch (exc) {}
		try {
			oHomeThis.getView().byId("tabMyTasks").addContent(fragmentMyTask);
		} catch (exc) {}
		try {
			oHomeThis.getView().byId("tabMyRequests").addContent(fragmentMyRequest);
		} catch (exc) {}
	},
	// This method is used to bind data to the corresponding UI Components based on the role
	bindDataBasedOnRole: function(check) {
		sap.ui.project.e2etm.util.StaticUtility.setBusy(true, oHomeThis);
		var myRole = sap.ui.getCore().getModel("profile").getData().currentRole;
		var oDataModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
		var batchArray = [];
		var batchOperation;
		var vTabFlag = "MT";
		var oTaskTbl = sap.ui.getCore().byId("tableManagerMyTasks");
		
		
		var pernr = "";
		
		if (myRole != "DEPU")
		{ 
			pernr = sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_PERNR;
		} //For Grm and DH's Lazy loading
		
		if(myRole == "COC"){ // 11/Jun/2021 add coc dashboard
			pernr = "";
		} 
		
		if (myRole == "GRM") {
			var vSelIndex = this.getView().byId("tabStrip").getSelectedIndex();
			if (vSelIndex == 1) {
				oTaskTbl = sap.ui.getCore().byId("tableTeamRequests");
				vTabFlag = "MR";

			}
			oHomeThis.setNotifications(true);
			oHomeThis.setNotifications(false);

			if (oTaskTbl)
				oTaskTbl.setBusy(true);

			batchArray.push(oDataModel.createBatchOperation("DEP_HDR_INFOSet?$filter=ZZ_DEP_PERNR+eq+'" + pernr +
				"'+and+ZZ_ROLE_NAME+eq+'" + myRole + "'+and+ZZ_TAB_FLAG+eq+'" + vTabFlag + "'&$expand=ZE2E_REQ_STATUSSet&$format=json", "GET"));
		}
		////####################### UCD1KOR 9 Feb 2021 Depu Dahsboard changes #########################///////
		/////////////////////////////////////////////////////////////////////////////////////////////////////
		else if(myRole == "DEPU" || myRole == "COC"){ // 11/Jun/2021 add coc dashboard
			var statusFlag=[];
			if(oHomeThis.SelectedStringFormat.length == 0 && check == "None"){
				var reqstr = "XX";
			}else{
				try{
					var array = this.selectedTileObject.selectedItemsInPopOver;
					var country = this.selectedTileObject.Country;
					var reqstr = "";
					for(let i=0;i<oHomeThis.SelectedStringFormat.length;i++){
						reqstr = reqstr + oHomeThis.SelectedStringFormat[i].Country+"("+oHomeThis.SelectedStringFormat[i].StatusFlag+")/";
					}
					reqstr = reqstr.substr(0,reqstr.length-1);
				}catch(err){
					val = oHomeThis.CurrentTile.StatusFlag.split(";");
					country = oHomeThis.CurrentTile.Country;
					for(var i=0;i<val.length;i++){
						if(val[i] !== ""){
							statusFlag.push(val[i]);
						}
					}
					 reqstr = country+"("+statusFlag.toString()+")";
				}
			}
			batchArray.push(oDataModel.createBatchOperation("DEP_HDR_INFOSet?$filter=ZZ_DEP_PERNR+eq+'" + pernr +
				"'+and+ZZ_ROLE_NAME+eq+'" + myRole + "'+and+SELECTION_PAR+eq+'" + reqstr +"'&$expand=ZE2E_REQ_STATUSSet&$format=json", "GET"));
		}
		else {

			batchArray.push(oDataModel.createBatchOperation("DEP_HDR_INFOSet?$filter=ZZ_DEP_PERNR+eq+'" + pernr +
				"'+and+ZZ_ROLE_NAME+eq+'" + myRole + "'&$expand=ZE2E_REQ_STATUSSet&$format=json", "GET"));
		}
		oDataModel.addBatchReadOperations(batchArray);
		oDataModel.submitBatch(function(oResult) {
			var oData = oResult.__batchResponses[0].data.results;

			// From the results, add all 'my task' data into array myTaskData
			// From the results, add all 'my request' data into array myRequestData
			var myTaskData = [];
			var myRequestData = [];
			for (var i = 0; i < oData.length; i++) {
				if (oData[i].ZZ_TAB_FLAG == "MT") {
					myTaskData.push(oData[i]);
				}
				if (oData[i].ZZ_TAB_FLAG == "MR") {
					myRequestData.push(oData[i]);
				}
			}

			if (myRole == "GRM") {
				if (vTabFlag == "MT") {
					oHomeThis.requestDeffered.resolve();
					oHomeThis.setManagerMyTaskData(myTaskData);

				} else {
					oHomeThis.taskDeffered.resolve();
					oHomeThis.setManagerTeamRequestData(myRequestData);
				}
			} else if (myRole == "DEPU" || myRole == "COC") { // 11-Jun-2021 add coc dashboard
				oHomeThis.setDeputationMyTaskData(myTaskData);
				oHomeThis.setDeputationAllRequestData(myRequestData);
				sap.ui.getCore().byId("idFilterToolbarText").setText("Pending Tasks ("+oData.length +")");
			} else if (myRole == "EMP") {
				oHomeThis.setEmployeeMyTaskData(myTaskData);
				oHomeThis.setEmployeeMyRequestData(myRequestData);
				// Set the webview link to the standard transaction
				sap.ui.getCore().byId("linkOldTravelLink").setHref(sap.ui.getCore().getModel("global").getData().oldTravelLink);
			} else if (myRole == "ECO") {
				oHomeThis.requestDeffered.resolve();
				oHomeThis.setECOMyTaskData(myTaskData);
			} else if (myRole == "TAX") {
				oHomeThis.requestDeffered.resolve();
				oHomeThis.setTAXMyTaskData(myTaskData);
			} else if (myRole == "CTG") {
				oHomeThis.requestDeffered.resolve();
				oHomeThis.setCTGMyTaskData(myTaskData);
			}

			$.when(oHomeThis.requestDeffered, oHomeThis.taskDeffered).then(function() {
				oHomeThis.requestDeffered = $.Deferred();
				oHomeThis.taskDeffered = $.Deferred();
				oHomeThis.getView().byId("tabStrip").setVisible(true);
				if (myRole == "EMP") {
					oHomeThis.setEmployeeOpenRequest();
				} else if (myRole == "GRM") {
					if (oTaskTbl)
						oTaskTbl.setBusy(false);
				}
				sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
			});
		}, function(oError) {
			sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
			sap.ca.ui.message.showMessageBox({
				type: sap.ca.ui.message.Type.ERROR,
				message: "Sorry for this inconvenience. Please contact support team",
				details: oError.response.statusText
			});
			oHomeThis.getView().byId("tabStrip").setVisible(true);
		});
	},
	// This method is used to bind data to the corresponding UI Components based on the role 
	// especially in ALL REQUEST TAB OF DEPU dashboard
	bindDataBasedOnDepu: function(evt) {
		sap.ui.project.e2etm.util.StaticUtility.setBusy(true, oHomeThis);
		var myRole = sap.ui.getCore().getModel("profile").getData().currentRole;
		var oDataModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
		var batchArray = [];
		var pernr = "";
		var reqno = "";

		if (evt.getSource().getId() == "EmployeeSearchId") {
			pernr = evt.getParameter("query");
		} else if (evt.getSource().getId() == "RequestSearchId") {
			reqno = evt.getParameter("query");
		}

		batchArray.push(oDataModel.createBatchOperation("DEP_HDR_INFOSet?$filter=ZZ_DEP_PERNR+eq+'" + pernr +
			"'+and+ZZ_ROLE_NAME+eq+'" + myRole + "'+and+ZZ_DEP_REQ+eq+'" + reqno + "'&$format=json", "GET"));

		oDataModel.addBatchReadOperations(batchArray);
		oDataModel.submitBatch(function(oResult) {
			var oData = oResult.__batchResponses[0].data.results;
			oHomeThis.setDeputationAllRequestData(oData);
			sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
		}, function(oError) {
			sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
			sap.ca.ui.message.showMessageBox({
				type: sap.ca.ui.message.Type.ERROR,
				message: "Sorry for this inconvenience. Please contact support team",
				details: oError.response.statusText
			});
		});
	},

	// EMPLOYEE DATA
	setMyEmployeeInformation: function() {
		var model = new sap.ui.model.json.JSONModel();
		var data = {};
		var get = $.ajax({
			cache: false,
			url: sServiceUrl + "NewsUpdatesSet?$filter=Const eq 'NEWS_AND_UPDATES'&$format=json",
			type: "GET"
		});
		get.done(function(result) {
			data.newsandupdates = result.d.results;
			model.setData(data);
			sap.ui.getCore().byId("panelProcessFlow").setModel(model);
			sap.ui.getCore().byId("panelUsefulInfo").setModel(model);
		});
	},
	setEmployeeOpenRequest: function() {
		// Display current request data on employee's top third box
		try {
			// global data 
			var globalModel = sap.ui.getCore().getModel("global");
			var aData = globalModel.getData();
			// This node: deputationList will be bound to the rowrepeater
			aData.deputationList = [];
			aData.openDeputationList = [];

			var allData = jQuery.merge(sap.ui.getCore().byId("tableEmployeeMyTasks").getModel().getData(),
				sap.ui.getCore().byId("tableEmployeeMyRequests").getModel().getData());
			var total = 0;
			total = oHomeThis.myEmployeeTaskNumberofRows + oHomeThis.myRequestNumberofRows;

			if (total > 0) {
				var count = 0;
				var openData = [];
				// loop into myRequest to get only open Request
				for (var i = 0; i < allData.length; i++) {
					// Ignore cancellation
					if ((allData[i].ZZ_REQ_TYP == "DEPU" && allData[i].ZZ_STAT_FLAG == "CANCL") ||
						(allData[i].ZZ_REQ_TYP != "DEPU" && allData[i].ZZ_STAT_FLAG == "CANCL") ||
						(allData[i].ZZ_REQ_TYP != "DEPU" && allData[i].ZZ_STAT_FLAG == "FF002")) {
						continue;
					}

					// Ignore reject case
					if ((allData[i].ZZ_REQ_TYP == "DEPU" &&
							((allData[i].ZZ_STAT_FLAG.substring(2, 5) == "002" &&
									(allData[i].ZZ_TRV_REQ == "" || allData[i].ZZ_TRV_REQ == null || allData[i].ZZ_TRV_REQ == "0000000000")) ||
								(allData[i].ZZ_STAT_FLAG.substring(2, 5) == "007" &&
									(allData[i].ZZ_TRV_REQ != "" && allData[i].ZZ_TRV_REQ != null && allData[i].ZZ_TRV_REQ != "0000000000")))) ||
						(allData[i].ZZ_REQ_TYP != "DEPU" && allData[i].ZZ_STAT_FLAG.substring(2, 5) == "007")) {
						continue;
					}

					aData.deputationList.push(allData[i]);
					if ((allData[i].ZZ_REQ_TYP == "VISA")) {
						continue;
					}
					//          // ignore closed case for travel type = VISA
					//          var sVisaFlag = false;
					//          if((allData[i].ZZ_REQ_TYP == "VISA" )){
					//            //check whether VISA is closed or not
					//            for (var n = 0; n < allData[i].ZE2E_REQ_STATUSSet.results.length; n++){
					//              if(allData[i].ZE2E_REQ_STATUSSet.results[n].ZZ_MODID == "VISA"){
					//                if(allData[i].ZE2E_REQ_STATUSSet.results[n].ZZ_ACTION == '01' && allData[i].ZE2E_REQ_STATUSSet.results[n].ZZ_NROLE == '03'){
					//                  sVisaFlag = true;
					//                  break;
					//                }
					//              }
					//            }
					//
					//            if(sVisaFlag == true || allData[i].ZZDEP_SF_TEXT == "Closed"){
					//              continue;
					//            }
					//          }else if ((allData[i].ZZ_REQ_TYP == "DEPU" && 
					//              (allData[i].ZZ_STAT_FLAG == "JJ000" || allData[i].ZZ_STAT_FLAG == "FF001")) ||
					//              (allData[i].ZZ_REQ_TYP != "DEPU" && allData[i].ZZ_STAT_FLAG == "FF001")) {
					//            // Ignore case travel settlement closed.
					//            var sSettlementFlag = false;
					//            for (var n = 0; n < allData[i].ZE2E_REQ_STATUSSet.results.length; n++){
					//              if(allData[i].ZE2E_REQ_STATUSSet.results[n].ZZ_MODID == "TRST"){
					//                if(allData[i].ZE2E_REQ_STATUSSet.results[n].ZZ_ACTION == '14' && allData[i].ZE2E_REQ_STATUSSet.results[n].ZZ_NROLE == '11'){
					//                  sSettlementFlag = true;
					//                  break;
					//                }
					//              }
					//            }
					//            if(sSettlementFlag == true){
					//              continue;
					//            }
					//
					//          }
					if ((allData[i].ZZ_REQ_TYP == "DEPU" &&
							(allData[i].ZZ_STAT_FLAG == "JJ000" || allData[i].ZZ_STAT_FLAG == "FF001")) ||
						(allData[i].ZZ_REQ_TYP != "DEPU" && allData[i].ZZ_STAT_FLAG == "FF001")) {
						continue;
					} else {
						aData.openDeputationList.push(allData[i]);
					}

				}
				count = aData.openDeputationList.length;
				if (count > 0) {
					aData.openDeputationList.sort(function(a, b) {
						return a.ZZ_DEP_REQ > b.ZZ_DEP_REQ ? -1 : 1;
					});
					globalModel.setData(aData);
				}
			} else {
				globalModel.setData(aData);
			}

			sap.ui.getCore().byId("panelEmployeeCurrentRequest").setModel(globalModel, "currentRequestModel");
		} catch (exc) {
			sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
		}
	},
	setEmployeeMyTaskData: function(results) {
		if (results != null) {
			// Bind the whole table to model and bind detail to first row in a table
			var flexboxEmployeeMyTaskDetail = sap.ui.getCore().byId("flexboxEmployeeMyTaskDetail");
			var tableEmployeeMyTasks = sap.ui.getCore().byId("tableEmployeeMyTasks");
			// Set Date Filter Type to all columns
			sap.ui.project.e2etm.util.StaticUtility.setFilterTypeToAllDateColumns(tableEmployeeMyTasks);
			var myEmployeeTaskModel = new sap.ui.model.json.JSONModel();
			myEmployeeTaskModel.setSizeLimit(1500);

			// Set model to Employee mytask table
			myEmployeeTaskModel.setData(results);
			tableEmployeeMyTasks.setModel(myEmployeeTaskModel);
			tableEmployeeMyTasks.bindRows("/");
			
			////############### UCD1KOR 11 July 2021 Changes- BUSR Copy#######################///////
			var data = [];
			for (var i = 0; i < results.length; i++) {
				if (results[i].ZZ_STAT_FLAG == "FF001" && results[i].ZZ_REQ_TYP === "BUSR") {
					data.push(results[i]);
				}
			}
			var myReqTaskModel = new sap.ui.model.json.JSONModel();
			myReqTaskModel.setData(data);
			this.getView().setModel(myReqTaskModel, "MyReqTasks");
			sap.ui.getCore().setModel(myReqTaskModel, "MyReqTasks");
			
			////############### UCD1KOR end chanegs ########################///////////

			oHomeThis.myEmployeeTaskNumberofRows = tableEmployeeMyTasks.getBinding("rows").getLength();

			// Get the first My taks record index
			var iIndex = sap.ui.project.e2etm.util.StaticUtility.getArrayIndex(results, "ZZ_TAB_FLAG", "MT");
			if (iIndex != -1) {
				// Visibility of proper details components
				sap.ui.getCore().byId("lblNodata").setVisible(false);
				sap.ui.getCore().byId("btnEmployeeRefreshMyTaskTable").setVisible(true);
				tableEmployeeMyTasks.setVisible(true);

				// Set selected record based on the first item of my task table.
				// This statement will trigger the onChangeRow of table
				setTimeout(function() {
					tableEmployeeMyTasks.clearSelection();
					tableEmployeeMyTasks.setSelectedIndex(0);
				}, 100);
			} else {
				sap.ui.getCore().byId("lblNodata").setVisible(true);
				sap.ui.getCore().byId("btnEmployeeRefreshMyTaskTable").setVisible(false);
				tableEmployeeMyTasks.setVisible(false);
				flexboxEmployeeMyTaskDetail.setVisible(false);

				sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
			}

			// Display notification text on each Tab
			oHomeThis.setNotifications(false);
		}
		oHomeThis.taskDeffered.resolve();
	},
	setEmployeeMyRequestData: function(results) {
		if (results != null) {
			// Bind the whole table to model and bind detail to first row in a table
			var tableEmployeeMyRequests = sap.ui.getCore().byId("tableEmployeeMyRequests");
			// Set Date Filter Type to all columns
			sap.ui.project.e2etm.util.StaticUtility.setFilterTypeToAllDateColumns(tableEmployeeMyRequests);

			var myRequestModel = new sap.ui.model.json.JSONModel();
			myRequestModel.setSizeLimit(1500);
			//Set number of requests
			if (results != null) {
				myRequestModel.setData(results);
			}
			tableEmployeeMyRequests.setModel(myRequestModel);
			tableEmployeeMyRequests.bindRows("/");

			oHomeThis.myRequestNumberofRows = tableEmployeeMyRequests.getBinding("rows").getLength();

			oHomeThis.setNotifications(true);
		}
		oHomeThis.requestDeffered.resolve();
	},
	// EMPLOYEE DATA

	// MANAGER DATA
	setManagerMyTaskData: function(results) {
		if (results != null) {
			// Bind the whole table to model
			var tableManagerMyTasks = sap.ui.getCore().byId("tableManagerMyTasks");
			// Set Date Filter Type to all columns
			sap.ui.project.e2etm.util.StaticUtility.setFilterTypeToAllDateColumns(tableManagerMyTasks);
			var flexboxManagerMyTaskDetail = sap.ui.getCore().byId("flexboxManagerMyTaskDetail");

			// This model is used for the whole table
			var myManagerTaskModel = new sap.ui.model.json.JSONModel();
			myManagerTaskModel.setSizeLimit(1500);

			// Set data to Manager my task table model
			myManagerTaskModel.setData(results);

			// Set model to Manager mytask table
			tableManagerMyTasks.setModel(myManagerTaskModel);
			tableManagerMyTasks.bindRows("/");

			oHomeThis.myManagerTaskNumberofRows = tableManagerMyTasks.getBinding("rows").getLength();

			// Get the first My taks record index
			var iIndex = sap.ui.project.e2etm.util.StaticUtility.getArrayIndex(results, "ZZ_TAB_FLAG", "MT");
			if (iIndex != -1) {
				// Visibility of proper details components
				sap.ui.getCore().byId("lblManagerNodata").setVisible(false);
				sap.ui.getCore().byId("btnManagerRefreshMyTaskTable").setVisible(true);
				tableManagerMyTasks.setVisible(true);

				// Visibility of components inside the detail panel
				sap.ui.getCore().byId("txtDurationService").setEnabled(false);
				sap.ui.getCore().byId("managerServiceConditionCheck").setVisible(false);
				try {
					sap.ui.getCore().byId("managerTravelPlanCheck").setChecked(true);
				} catch (exc) {}

				// Set selected record based on the first item of my task table.
				// This statement will trigger the onChangeRow of table
				setTimeout(function() {
					tableManagerMyTasks.clearSelection();
					tableManagerMyTasks.setSelectedIndex(0);
				}, 100);
			} else {
				sap.ui.getCore().byId("lblManagerNodata").setVisible(true);
				sap.ui.getCore().byId("btnManagerRefreshMyTaskTable").setVisible(false);
				tableManagerMyTasks.setVisible(false);
				flexboxManagerMyTaskDetail.setVisible(false);
				sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
			}

			// Display notification text on each Tab
			oHomeThis.setNotifications(false);
		}
		oHomeThis.taskDeffered.resolve();
	},
	setManagerTeamRequestData: function(results) {
		if (results != null) {
			// Bind the whole table to model and bind detail to first row in a table
			var tableTeamRequests = sap.ui.getCore().byId("tableTeamRequests");
			// Set Date Filter Type to all columns
			sap.ui.project.e2etm.util.StaticUtility.setFilterTypeToAllDateColumns(tableTeamRequests);
			var teamRequestModel = new sap.ui.model.json.JSONModel();
			teamRequestModel.setSizeLimit(1500);

			if (results != null) {
				teamRequestModel.setData(results);
			}
			tableTeamRequests.setModel(teamRequestModel);
			tableTeamRequests.bindRows("/");

			oHomeThis.myRequestNumberofRows = tableTeamRequests.getBinding("rows").getLength();
			oHomeThis.setNotifications(true);
		}

		oHomeThis.requestDeffered.resolve();
	},
	// MANAGER DATA

	// ECO DATA
	setECOMyTaskData: function(results) {
		if (results != null) {
			// Bind the whole table to model
			var tableECOMyTasks = sap.ui.getCore().byId("tableECOMyTasks");
			// Set Date Filter Type to all columns
			sap.ui.project.e2etm.util.StaticUtility.setFilterTypeToAllDateColumns(tableECOMyTasks);
			var flexboxECOMyTaskDetail = sap.ui.getCore().byId("flexboxECOMyTaskDetail");

			// This model is used for the whole table
			var myECOTaskModel = new sap.ui.model.json.JSONModel();
			myECOTaskModel.setSizeLimit(1500);

			// Set data to Manager my task table model
			myECOTaskModel.setData(results);

			// Set model to Manager mytask table
			tableECOMyTasks.setModel(myECOTaskModel);
			tableECOMyTasks.bindRows("/");

			oHomeThis.myECOTaskNumberofRows = tableECOMyTasks.getBinding("rows").getLength();

			// Get the first My taks record index
			var iIndex = sap.ui.project.e2etm.util.StaticUtility.getArrayIndex(results, "ZZ_TAB_FLAG", "MT");
			if (iIndex != -1) {
				// Visibility of proper details components
				sap.ui.getCore().byId("lblECONodata").setVisible(false);
				sap.ui.getCore().byId("btnECORefreshMyTaskTable").setVisible(true);
				tableECOMyTasks.setVisible(true);

				// Set selected record based on the first item of my task table.
				// This statement will trigger the onChangeRow of table
				setTimeout(function() {
					tableECOMyTasks.clearSelection();
					tableECOMyTasks.setSelectedIndex(0);
				}, 100);
			} else {
				sap.ui.getCore().byId("lblECONodata").setVisible(true);
				sap.ui.getCore().byId("btnECORefreshMyTaskTable").setVisible(false);
				tableECOMyTasks.setVisible(false);
				flexboxECOMyTaskDetail.setVisible(false);
				sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
			}

			// Display notification text on each Tab
			oHomeThis.setNotifications(false);
		}
		oHomeThis.taskDeffered.resolve();
	},
	// ECO DATA

	// TAX DATA
	setTAXMyTaskData: function(results) {
		if (results != null) {
			// Bind the whole table to model
			var tableTAXMyTasks = sap.ui.getCore().byId("tableTAXMyTasks");
			// Set Date Filter Type to all columns
			sap.ui.project.e2etm.util.StaticUtility.setFilterTypeToAllDateColumns(tableTAXMyTasks);
			var flexboxTAXMyTaskDetail = sap.ui.getCore().byId("flexboxTAXMyTaskDetail");

			// This model is used for the whole table
			var myTAXTaskModel = new sap.ui.model.json.JSONModel();
			myTAXTaskModel.setSizeLimit(1500);

			// Set data to Manager my task table model
			myTAXTaskModel.setData(results);

			// Set model to Manager mytask table
			tableTAXMyTasks.setModel(myTAXTaskModel);
			tableTAXMyTasks.bindRows("/");

			oHomeThis.myTAXTaskNumberofRows = tableTAXMyTasks.getBinding("rows").getLength();

			// Get the first My taks record index
			var iIndex = sap.ui.project.e2etm.util.StaticUtility.getArrayIndex(results, "ZZ_TAB_FLAG", "MT");
			if (iIndex != -1) {
				// Visibility of proper details components
				sap.ui.getCore().byId("lblTAXNodata").setVisible(false);
				sap.ui.getCore().byId("btnTAXRefreshMyTaskTable").setVisible(true);
				tableTAXMyTasks.setVisible(true);

				// Set selected record based on the first item of my task table.
				// This statement will trigger the onChangeRow of table
				setTimeout(function() {
					tableTAXMyTasks.clearSelection();
					tableTAXMyTasks.setSelectedIndex(0);
				}, 100);
			} else {
				sap.ui.getCore().byId("lblTAXNodata").setVisible(true);
				sap.ui.getCore().byId("btnTAXRefreshMyTaskTable").setVisible(false);
				tableTAXMyTasks.setVisible(false);
				flexboxTAXMyTaskDetail.setVisible(false);
				sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
			}

			// Display notification text on each Tab
			oHomeThis.setNotifications(false);
		}
		oHomeThis.taskDeffered.resolve();
	},
	// TAX DATA

	// CTG DATA
	setCTGMyTaskData: function(results) {
		if (results != null) {
			// Bind the whole table to model
			var tableCTGMyTasks = sap.ui.getCore().byId("tableCTGMyTasks");
			// Set Date Filter Type to all columns
			sap.ui.project.e2etm.util.StaticUtility.setFilterTypeToAllDateColumns(tableCTGMyTasks);
			var flexboxCTGMyTaskDetail = sap.ui.getCore().byId("flexboxCTGMyTaskDetail");

			// This model is used for the whole table
			var myCTGTaskModel = new sap.ui.model.json.JSONModel();
			myCTGTaskModel.setSizeLimit(1500);

			// Set data to Manager my task table model
			myCTGTaskModel.setData(results);

			// Set model to Manager mytask table
			tableCTGMyTasks.setModel(myCTGTaskModel);
			tableCTGMyTasks.bindRows("/");

			oHomeThis.myCTGTaskNumberofRows = tableCTGMyTasks.getBinding("rows").getLength();

			// Get the first My taks record index
			var iIndex = sap.ui.project.e2etm.util.StaticUtility.getArrayIndex(results, "ZZ_TAB_FLAG", "MT");
			if (iIndex != -1) {
				// Visibility of proper details components
				sap.ui.getCore().byId("lblCTGNodata").setVisible(false);
				sap.ui.getCore().byId("btnCTGRefreshMyTaskTable").setVisible(true);
				tableCTGMyTasks.setVisible(true);

				// Set selected record based on the first item of my task table.
				// This statement will trigger the onChangeRow of table
				setTimeout(function() {
					tableCTGMyTasks.clearSelection();
					tableCTGMyTasks.setSelectedIndex(0);
				}, 100);
			} else {
				sap.ui.getCore().byId("lblCTGNodata").setVisible(true);
				sap.ui.getCore().byId("btnCTGRefreshMyTaskTable").setVisible(false);
				tableCTGMyTasks.setVisible(false);
				flexboxCTGMyTaskDetail.setVisible(false);
				sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
			}

			// Display notification text on each Tab
			oHomeThis.setNotifications(false);
		}
		oHomeThis.taskDeffered.resolve();
	},
	// CTG DATA

	// DEPUTATION DATA
	setDeputationMyTaskData: function(results) {
		if (results != null) {
			// Bind the whole table to model and bind detail to first row in a table
			var tableDeputationMyTasks = sap.ui.getCore().byId("tableDeputationMyTasks");
			// Set Date Filter Type to all columns
			sap.ui.project.e2etm.util.StaticUtility.setFilterTypeToAllDateColumns(tableDeputationMyTasks);
			var myDeputationTaskModel = new sap.ui.model.json.JSONModel();
			myDeputationTaskModel.setSizeLimit(1500);

			myDeputationTaskModel.setData(results);

			tableDeputationMyTasks.setModel(myDeputationTaskModel);
			tableDeputationMyTasks.bindRows("/");

			oHomeThis.myDeputationTaskNumberofRows = tableDeputationMyTasks.getBinding("rows").getLength();
			oHomeThis.setNotifications(false);
		}

		oHomeThis.taskDeffered.resolve();
	},
	setDeputationAllRequestData: function(results) {
		if (results != null) {
			// Bind the whole table to model and bind detail to first row in a table
			var tableAllRequests = sap.ui.getCore().byId("tableAllRequests");
			// Set Date Filter Type to all columns
			sap.ui.project.e2etm.util.StaticUtility.setFilterTypeToAllDateColumns(tableAllRequests);
			var allRequestModel = new sap.ui.model.json.JSONModel();
			allRequestModel.setSizeLimit(1500);
			allRequestModel.setData(results);
			tableAllRequests.setModel(allRequestModel);
			tableAllRequests.bindRows("/");
			oHomeThis.myRequestNumberofRows = tableAllRequests.getBinding("rows").getLength();
			oHomeThis.setNotifications(true);
		}

		oHomeThis.requestDeffered.resolve();
	},
	// DEPUTATION DATA

	// ECO WORKFLOW ACTION
	ecoAction: function(status, statusString) {
		sap.ui.project.e2etm.util.StaticUtility.setBusy(true, oHomeThis);
		var comment = sap.ui.getCore().byId("textAreaECOComment").getValue();
		var data = sap.ui.getCore().byId("flexboxECOMyTaskDetail").getModel("myECOSelectedTaskModel").getData();

		/*----------Begin of Travel Request----------------------------------------------------*/
		if (data.ZZ_REQ_TYP == 'BUSR' || data.ZZ_REQ_TYP == 'SECO' ||
			data.ZZ_REQ_TYP == 'HOME' || data.ZZ_REQ_TYP == 'EMER' || data.ZZ_REQ_TYP == 'INFO') {
			// In manager dashboard, comment field is mandatory
			if (comment.trim() == "" || comment == null) {
				sap.ui.getCore().byId("textAreaECOComment").setValueState("Error");
				sap.ca.ui.message.showMessageBox({
					type: sap.ca.ui.message.Type.ERROR,
					message: "Please give some comments",
					details: "Please give some comments"
				});
				sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
				return;
			}
			if (status == '001') {
				var get = $.ajax({
					cache: false,
					url: sServiceUrl + "APPROVE_TRAVEL?" +
						"CATID='" + data.ZZ_DEP_SUB_TYPE +
						"'&COMMENT='" + comment +
						"'&PERNR='" + sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_PERNR +
						"'&REQUEST='" + data.ZZ_DEP_REQ +
						"'&TYPE='" + data.ZZ_REQ_TYP +
						"'&ROLE='" + sap.ui.getCore().getModel("profile").getData().currentRole +
						"'&TIMESTAMP='" + data.ZZ_TIMESTAMP +
						"'&$format=json",
					type: "GET"
				});
				get.done(function(result) {
					sap.m.MessageToast.show(statusString + "!");
					oHomeThis.bindDataBasedOnRole();
					sap.ui.getCore().byId("textAreaECOComment").setValue("");
					sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
				});
				get.fail(function(err) {
					sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
					var sMsg = err.responseText;
					if (sMsg.indexOf("EX_OBSOLETE") != -1) {
						sMsg = "This request status is obsolete, please click refresh on the dashboard to retrieve new version";
					}
					sap.ca.ui.message.showMessageBox({
						type: sap.ca.ui.message.Type.ERROR,
						message: "Sorry for this inconvenience. Please contact support team",
						details: sMsg
					});
				});
			} else if (status == '002') {
				var get = $.ajax({
					cache: false,
					url: sServiceUrl + "TravelReject?ZZ_COMMENTS='" + comment +
						"'&ZZ_MGR_PERNR='" + sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_PERNR +
						"'&ZZ_REINR='" + data.ZZ_DEP_REQ +
						"'&ZZ_ROLE='" + sap.ui.getCore().getModel("profile").getData().currentRole +
						"'&ZZ_TTYPE='" + sap.ui.getCore().byId("flexboxECOMyTaskDetail").getModel("myECOSelectedTaskModel").getData().ZZ_REQ_TYP +
						"'&ZZ_TIMESTAMP='" + sap.ui.getCore().byId("flexboxECOMyTaskDetail").getModel("myECOSelectedTaskModel").getData().ZZ_TIMESTAMP +
						"'&$format=json",
					type: "GET"
				});
				get.done(function(result) {
					sap.m.MessageToast.show(statusString + "!");
					oHomeThis.bindDataBasedOnRole();
					sap.ui.getCore().byId("textAreaECOComment").setValue("");
					sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
				});
				get.fail(function(err) {
					sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
					var sMsg = err.responseText;
					if (sMsg.indexOf("EX_OBSOLETE") != -1) {
						sMsg = "This request status is obsolete, please click refresh on the dashboard to retrieve new version";
					}
					sap.ca.ui.message.showMessageBox({
						type: sap.ca.ui.message.Type.ERROR,
						message: "Sorry for this inconvenience. Please contact support team",
						details: sMsg
					});
				});
			} else if (status == '003') {
				var get = $.ajax({
					cache: false,
					url: sServiceUrl + 'TravelSendBack?' +
						"ZZ_COMMENTS='" + comment +
						"'&ZZ_MGR_PERNR='" + sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_PERNR +
						"'&ZZ_REINR='" + data.ZZ_DEP_REQ +
						"'&ZZ_ROLE='" + sap.ui.getCore().getModel("profile").getData().currentRole +
						"'&ZZ_TTYPE='" + data.ZZ_REQ_TYP +
						"'&ZZ_TIMESTAMP='" + data.ZZ_TIMESTAMP +
						"'&$format=json",
					type: "GET"
				});
				get.done(function(result) {
					sap.m.MessageToast.show(statusString + "!");
					oHomeThis.bindDataBasedOnRole();
					sap.ui.getCore().byId("textAreaECOComment").setValue("");
					sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
				});
				get.fail(function(err) {
					sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
					var sMsg = err.responseText;
					if (sMsg.indexOf("EX_OBSOLETE") != -1) {
						sMsg = "This request status is obsolete, please click refresh on the dashboard to retrieve new version";
					}
					sap.ca.ui.message.showMessageBox({
						type: sap.ca.ui.message.Type.ERROR,
						message: "Sorry for this inconvenience. Please contact support team",
						details: sMsg
					});
				});
			}
			return;
		}
		/*----------End of Travel Request------------------------------------------------------*/

		//This block controls deputation request
		var position = sap.ui.getCore().getModel("profile").getData().currentRole;

		var roleKeys = sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_POSITION.split(";");
		var rolePref = sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_STATUS_TXT.split(";");
		for (var i = 0; i < roleKeys.length; i++) {
			if (roleKeys[i] == position) {
				status = rolePref[i] + status;
				break;
			}
		}

		//    var tableECOMyTasks = sap.ui.getCore().byId("tableECOMyTasks");
		var aData = {};
		aData.ZZ_DEP_REQ = data.ZZ_DEP_REQ;
		aData.ZZ_DEP_PERNR = data.ZZ_DEP_PERNR;
		aData.ZZ_DEP_NAME = data.ZZ_DEP_NAME;
		aData.ZZ_DEP_STDATE = data.ZZ_DEP_STDATE;
		aData.ZZ_DEP_ENDATE = data.ZZ_DEP_ENDATE;
		aData.ZZ_DEP_ENDATE = data.ZZ_DEP_ENDATE;
		aData.ZZ_DEP_FRMLOC_TXT = data.ZZ_DEP_FRMLOC_TXT;
		aData.ZZ_DEP_TOLOC_TXT = data.ZZ_DEP_TOLOC_TXT;
		aData.ZZ_STAT_FLAG = status;
		aData.ZZ_DEP_NTID = data.ZZ_DEP_NTID;
		aData.ZZ_DEP_EMAIL = data.ZZ_DEP_EMAIL;
		aData.ZZ_DEP_TYPE = data.ZZ_DEP_TYPE;
		aData.ZZ_DEP_TYPE_TXT = data.ZZ_DEP_TYPE_TXT;
		aData.ZZ_MGR_PERNR = sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_PERNR;
		aData.ZZ_NEW_COMMENTS = comment;
		aData.ZZ_ASG_TYP = data.ZZ_ASG_TYP;
		aData.ZZ_STAGE = "1";
		aData.ZZ_SET = "1_2";
		aData.ZZ_SUBSET = "1_2_1";
		aData.ZZ_SUBSUBSET = "1_2_1_2";
		aData.ZZ_SRVTYP_MONTHS = data.ZZ_SRVTYP_MONTHS;

		// Validation before action
		// In manager dashboard, comment field is mandatory
		if (comment.trim() == "" || comment == null) {
			sap.ui.getCore().byId("textAreaECOComment").setValueState("Error");
			sap.ca.ui.message.showMessageBox({
				type: sap.ca.ui.message.Type.ERROR,
				message: "Please give some comments",
				details: "Please give some comments"
			});
			sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
			return;
		}
		// In manager dashboard, if action is approve, 
		var action = status.substring(2, 5);
		if (action == "001") {
			// validate deputation subtype
			if (data.ZZ_DEP_SUB_TYPE == "" || data.ZZ_DEP_SUB_TYPE == null || data.ZZ_DEP_SUB_TYPE == "Please select") {
				sap.ca.ui.message.showMessageBox({
					type: sap.ca.ui.message.Type.ERROR,
					message: "Please enter Deputation To",
					details: "Please enter Deputation To"
				});
				sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
				return;
			} else {
				aData.ZZ_DEP_SUB_TYPE = data.ZZ_DEP_SUB_TYPE;
			}
			// validate purpose of travel
			if (data.ZZ_TRV_PUR == "" || data.ZZ_TRV_PUR == null || data.ZZ_TRV_PUR == "Please select") {
				sap.ca.ui.message.showMessageBox({
					type: sap.ca.ui.message.Type.ERROR,
					message: "Please enter Purpose of travel",
					details: "Please enter Purpose of travel"
				});
				sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
				return;
			} else {
				aData.ZZ_TRV_PUR = data.ZZ_TRV_PUR;
			}
			// validate service condition
			if (data.ZZ_SERV_TYP == "" || data.ZZ_SERV_TYP == null || data.ZZ_SERV_TYP == "Please select") {
				sap.ca.ui.message.showMessageBox({
					type: sap.ca.ui.message.Type.ERROR,
					message: "Please enter Service Condition",
					details: "Please enter Service Condition"
				});
				sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
				return;
			} else {
				aData.ZZ_SERV_TYP = data.ZZ_SERV_TYP;
			}
		}

		// Update the deputation with new status
		var token = "";
		var get = $.ajax({
			cache: false,
			url: sServiceUrl + "EMP_PASSPORT_INFOSet",
			type: "GET",
			headers: {
				'Authorization': token
			},
			beforeSend: function(xhr) {
				xhr.setRequestHeader('X-CSRF-Token', 'Fetch');
			}
		});
		get.done(function(result, response, header) {
			token = header.getResponseHeader("X-CSRF-Token");
			var post = $.ajax({
				cache: false,
				url: sServiceUrl + "DEP_HDR_INFOSet(ZZ_DEP_REQ='" + aData.ZZ_DEP_REQ + "',ZZ_VERSION='')",
				type: "PUT",
				beforeSend: function(xhr) {
					xhr.setRequestHeader('X-Requested-With', "XMLHttpRequest");
					xhr.setRequestHeader('X-CSRF-Token', token);
					xhr.setRequestHeader('Accept', "application/json");
					xhr.setRequestHeader('DataServiceVersion', "2.0");
					xhr.setRequestHeader('Content-Type', "application/json");
					xhr.setRequestHeader('If-Match', eTagHome);
				},
				data: JSON.stringify(aData),
				dataType: "json",
				success: function(data) {
					sap.m.MessageToast.show(statusString + "!");
					oHomeThis.bindDataBasedOnRole();
					sap.ui.getCore().byId("textAreaECOComment").setValue("");
					sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
				}
			});
			post.fail(function(err) {
				// Call get entity service with deputation request number
				if (err.status == 412) {
					var get = $.ajax({
						cache: false,
						url: sServiceUrl + "DEP_LOCK_USERSet('" + data.ZZ_DEP_REQ + "')?$format=json",
						type: "GET",
					});
					get.done(function(result) {
						sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
						sap.ca.ui.message.showMessageBox({
							type: sap.ca.ui.message.Type.ERROR,
							message: "This request was modified by " + result.d.ZZ_DEP_NTID + ". Please refresh homepage"
						});
					});
				} else {
					sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
					sap.ca.ui.message.showMessageBox({
						type: sap.ca.ui.message.Type.ERROR,
						message: "Sorry for this inconvenience. Please contact support team",
						details: err.responseText
					});
				}
			});
		});
	},
	// ECO WORKFLOW ACTION

	// TAX WORKFLOW ACTION
	taxAction: function(status, statusString) {
		sap.ui.project.e2etm.util.StaticUtility.setBusy(true, oHomeThis);
		var comment = sap.ui.getCore().byId("textAreaTAXComment").getValue();
		var data = sap.ui.getCore().byId("flexboxTAXMyTaskDetail").getModel("myTAXSelectedTaskModel").getData();
		/*----------Begin of Travel Request----------------------------------------------------*/
		if (data.ZZ_REQ_TYP == 'BUSR' || data.ZZ_REQ_TYP == 'SECO' ||
			data.ZZ_REQ_TYP == 'HOME' || data.ZZ_REQ_TYP == 'EMER' || data.ZZ_REQ_TYP == 'INFO') {
			// In manager dashboard, comment field is mandatory
			if (comment.trim() == "" || comment == null) {
				sap.ui.getCore().byId("textAreaTAXComment").setValueState("Error");
				sap.ca.ui.message.showMessageBox({
					type: sap.ca.ui.message.Type.ERROR,
					message: "Please give some comments",
					details: "Please give some comments"
				});
				sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
				return;
			}

			if (status == '001') {
				var get = $.ajax({
					cache: false,
					url: sServiceUrl + "APPROVE_TRAVEL?" +
						"CATID='" + data.ZZ_DEP_SUB_TYPE +
						"'&COMMENT='" + comment +
						"'&PERNR='" + sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_PERNR +
						"'&REQUEST='" + data.ZZ_DEP_REQ +
						"'&TYPE='" + data.ZZ_REQ_TYP +
						"'&ROLE='" + sap.ui.getCore().getModel("profile").getData().currentRole +
						"'&TIMESTAMP='" + data.ZZ_TIMESTAMP +
						"'&$format=json",
					type: "GET"
				});
				get.done(function(result) {
					sap.m.MessageToast.show(statusString + "!");
					oHomeThis.bindDataBasedOnRole();
					sap.ui.getCore().byId("textAreaTAXComment").setValue("");
					sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
				});
				get.fail(function(err) {
					sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
					var sMsg = err.responseText;
					if (sMsg.indexOf("EX_OBSOLETE") != -1) {
						sMsg = "This request status is obsolete, please click refresh on the dashboard to retrieve new version";
					}
					sap.ca.ui.message.showMessageBox({
						type: sap.ca.ui.message.Type.ERROR,
						message: "Sorry for this inconvenience. Please contact support team",
						details: sMsg
					});
				});
			} else if (status == '002') {
				var get = $.ajax({
					cache: false,
					url: sServiceUrl + "TravelReject?ZZ_COMMENTS='" + comment +
						"'&ZZ_MGR_PERNR='" + sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_PERNR +
						"'&ZZ_REINR='" + data.ZZ_DEP_REQ +
						"'&ZZ_ROLE='" + sap.ui.getCore().getModel("profile").getData().currentRole +
						"'&ZZ_TTYPE='" + sap.ui.getCore().byId("flexboxTAXMyTaskDetail").getModel("myTAXSelectedTaskModel").getData().ZZ_REQ_TYP +
						"'&ZZ_TIMESTAMP='" + sap.ui.getCore().byId("flexboxTAXMyTaskDetail").getModel("myTAXSelectedTaskModel").getData().ZZ_TIMESTAMP +
						"'&$format=json",
					type: "GET"
				});
				get.done(function(result) {
					sap.m.MessageToast.show(statusString + "!");
					oHomeThis.bindDataBasedOnRole();
					sap.ui.getCore().byId("textAreaTAXComment").setValue("");
					sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
				});
				get.fail(function(err) {
					sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
					sap.ca.ui.message.showMessageBox({
						type: sap.ca.ui.message.Type.ERROR,
						message: "Sorry for this inconvenience. Please contact support team",
						details: err.responseText
					});
				});
			} else if (status == '003') {
				var get = $.ajax({
					cache: false,
					url: sServiceUrl + 'TravelSendBack?' +
						"ZZ_COMMENTS='" + comment +
						"'&ZZ_MGR_PERNR='" + sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_PERNR +
						"'&ZZ_REINR='" + data.ZZ_DEP_REQ +
						"'&ZZ_ROLE='" + sap.ui.getCore().getModel("profile").getData().currentRole +
						"'&ZZ_TTYPE='" + data.ZZ_REQ_TYP +
						"'&ZZ_TIMESTAMP='" + data.ZZ_TIMESTAMP +
						"'&$format=json",
					type: "GET"
				});
				get.done(function(result) {
					sap.m.MessageToast.show(statusString + "!");
					oHomeThis.bindDataBasedOnRole();
					sap.ui.getCore().byId("textAreaTAXComment").setValue("");
					sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
				});
				get.fail(function(err) {
					sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
					sap.ca.ui.message.showMessageBox({
						type: sap.ca.ui.message.Type.ERROR,
						message: "Sorry for this inconvenience. Please contact support team",
						details: err.responseText
					});
				});
			}
			return;
		}
		/*----------End of Travel Request------------------------------------------------------*/

		var position = sap.ui.getCore().getModel("profile").getData().currentRole;

		var roleKeys = sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_POSITION.split(";");
		var rolePref = sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_STATUS_TXT.split(";");
		for (var i = 0; i < roleKeys.length; i++) {
			if (roleKeys[i] == position) {
				status = rolePref[i] + status;
				break;
			}
		}
		//    var tableTAXMyTasks = sap.ui.getCore().byId("tableTAXMyTasks");
		var aData = {};
		aData.ZZ_DEP_REQ = data.ZZ_DEP_REQ;
		aData.ZZ_DEP_PERNR = data.ZZ_DEP_PERNR;
		aData.ZZ_DEP_NAME = data.ZZ_DEP_NAME;
		aData.ZZ_DEP_STDATE = data.ZZ_DEP_STDATE;
		aData.ZZ_DEP_ENDATE = data.ZZ_DEP_ENDATE;
		aData.ZZ_DEP_ENDATE = data.ZZ_DEP_ENDATE;
		aData.ZZ_DEP_FRMLOC_TXT = data.ZZ_DEP_FRMLOC_TXT;
		aData.ZZ_DEP_TOLOC_TXT = data.ZZ_DEP_TOLOC_TXT;
		aData.ZZ_STAT_FLAG = status;
		aData.ZZ_DEP_NTID = data.ZZ_DEP_NTID;
		aData.ZZ_DEP_EMAIL = data.ZZ_DEP_EMAIL;
		aData.ZZ_DEP_TYPE = data.ZZ_DEP_TYPE;
		aData.ZZ_DEP_TYPE_TXT = data.ZZ_DEP_TYPE_TXT;
		aData.ZZ_MGR_PERNR = sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_PERNR;
		aData.ZZ_NEW_COMMENTS = comment;
		aData.ZZ_ASG_TYP = data.ZZ_ASG_TYP;
		aData.ZZ_SRVTYP_MONTHS = data.ZZ_SRVTYP_MONTHS;

		aData.ZZ_STAGE = "1";
		aData.ZZ_SET = "1_2";
		aData.ZZ_SUBSET = "1_2_1";
		aData.ZZ_SUBSUBSET = "1_2_1_3";

		// Validation before action
		// In manager dashboard, comment field is mandatory
		if (comment.trim() == "" || comment == null) {
			sap.ui.getCore().byId("textAreaTAXComment").setValueState("Error");
			sap.ca.ui.message.showMessageBox({
				type: sap.ca.ui.message.Type.ERROR,
				message: "Please give some comments",
				details: "Please give some comments"
			});
			sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
			return;
		} else {
			if (!sap.ui.project.e2etm.util.StaticUtility.check256Characters(comment.trim())) {
				sap.ui.getCore().byId("textAreaTAXComment").setValueState("Error");
				sap.ca.ui.message.showMessageBox({
					type: sap.ca.ui.message.Type.ERROR,
					message: "Maximum 255 characters allowed",
					details: "Maximum 255 characters allowed"
				});
				sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
				return;
			} else {
				sap.ui.getCore().byId("textAreaTAXComment").setValueState("None");
			}
		}
		// In manager dashboard, if action is approve, 
		var action = status.substring(2, 5);
		if (action == "001") {
			// validate deputation subtype
			if (data.ZZ_DEP_SUB_TYPE == "" || data.ZZ_DEP_SUB_TYPE == null || data.ZZ_DEP_SUB_TYPE == "Please select") {
				sap.ca.ui.message.showMessageBox({
					type: sap.ca.ui.message.Type.ERROR,
					message: "Please enter Deputation To",
					details: "Please enter Deputation To"
				});
				sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
				return;
			} else {
				aData.ZZ_DEP_SUB_TYPE = data.ZZ_DEP_SUB_TYPE;
			}
			// validate purpose of travel
			if (data.ZZ_TRV_PUR == "" || data.ZZ_TRV_PUR == null || data.ZZ_TRV_PUR == "Please select") {
				sap.ca.ui.message.showMessageBox({
					type: sap.ca.ui.message.Type.ERROR,
					message: "Please enter Purpose of travel",
					details: "Please enter Purpose of travel"
				});
				sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
				return;
			} else {
				aData.ZZ_TRV_PUR = data.ZZ_TRV_PUR;
			}
			// validate service condition
			if (data.ZZ_SERV_TYP == "" || data.ZZ_SERV_TYP == null || data.ZZ_SERV_TYP == "Please select") {
				sap.ca.ui.message.showMessageBox({
					type: sap.ca.ui.message.Type.ERROR,
					message: "Please enter Service Condition",
					details: "Please enter Service Condition"
				});
				sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
				return;
			} else {
				aData.ZZ_SERV_TYP = data.ZZ_SERV_TYP;
			}
		}

		// Update the deputation with new status
		var token = "";
		var get = $.ajax({
			cache: false,
			url: sServiceUrl + "EMP_PASSPORT_INFOSet",
			type: "GET",
			headers: {
				'Authorization': token
			},
			beforeSend: function(xhr) {
				xhr.setRequestHeader('X-CSRF-Token', 'Fetch');
			}
		});
		get.done(function(result, response, header) {
			token = header.getResponseHeader("X-CSRF-Token");
			var post = $.ajax({
				cache: false,
				url: sServiceUrl + "DEP_HDR_INFOSet(ZZ_DEP_REQ='" + aData.ZZ_DEP_REQ + "',ZZ_VERSION='')",
				type: "PUT",
				beforeSend: function(xhr) {
					xhr.setRequestHeader('X-Requested-With', "XMLHttpRequest");
					xhr.setRequestHeader('X-CSRF-Token', token);
					xhr.setRequestHeader('Accept', "application/json");
					xhr.setRequestHeader('DataServiceVersion', "2.0");
					xhr.setRequestHeader('Content-Type', "application/json");
					xhr.setRequestHeader('If-Match', eTagHome);
				},
				data: JSON.stringify(aData),
				dataType: "json",
				success: function(data) {
					sap.m.MessageToast.show(statusString + "!");
					oHomeThis.bindDataBasedOnRole();
					sap.ui.getCore().byId("textAreaTAXComment").setValue("");
					sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
				}
			});
			post.fail(function(err) {
				// Call get entity service with deputation request number
				if (err.status == 412) {
					var get = $.ajax({
						cache: false,
						url: sServiceUrl + "DEP_LOCK_USERSet('" + data.ZZ_DEP_REQ + "')?$format=json",
						type: "GET",
					});
					get.done(function(result) {
						sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
						sap.ca.ui.message.showMessageBox({
							type: sap.ca.ui.message.Type.ERROR,
							message: "This request was modified by " + result.d.ZZ_DEP_NTID + ". Please refresh homepage"
						});
					});
				} else {
					sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
					sap.ca.ui.message.showMessageBox({
						type: sap.ca.ui.message.Type.ERROR,
						message: "Sorry for this inconvenience. Please contact support team",
						details: err.responseText
					});
				}
			});
		});
	},
	// TAX WORKFLOW ACTION
	/// UCD1KOR 07 May 2020
	/// Covid-19 changes
	covid_19COnditionCheck:function(aData){
		if(aData.ZZ_TRV_CAT =="WRKP" && aData.ZZ_DEP_TYPE =="INTL"){
			return 183
			}
			else if(aData.ZZ_TRV_CAT =="WRKP" && aData.ZZ_DEP_TYPE =="DOME"){
			return 9999
			}
			else if(aData.ZZ_TRV_CAT =="TRNG" ){
				return  90
			}
			else if(aData.ZZ_TRV_CAT =="TRFR"  && aData.ZZ_DEP_TYPE =="INTL" ){
				return  4380
			}
			else if(aData.ZZ_TRV_CAT =="TRFR" && aData.ZZ_DEP_TYPE =="DOME"){
				return  9999
			}
			else if(aData.ZZ_TRV_CAT =="INFO" ){
				return  7
			}
			else if(aData.ZZ_TRV_CAT =="HOME" || aData.ZZ_TRV_CAT =="ERMR" || aData.ZZ_TRV_CAT =="SECO" ){
				return  30
			}else if(aData.ZZ_TRV_CAT =="BUSR" && aData.ZZ_DEP_TYPE =="INTL"){
				return  90
			}
			else if(aData.ZZ_TRV_CAT =="BUSR" && aData.ZZ_DEP_TYPE =="DOME"){
				return  89
			}
		
	},
	// MANAGER WORKFLOW ACTION
	managerAction: function(status, statusString) {
		var that= this;
		sap.ui.project.e2etm.util.StaticUtility.setBusy(true, oHomeThis);
		var position = sap.ui.getCore().getModel("profile").getData().currentRole;

		var roleKeys = sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_POSITION.split(";");
		var rolePref = sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_STATUS_TXT.split(";");
		for (var i = 0; i < roleKeys.length; i++) {
			if (roleKeys[i] == position) {
				status = rolePref[i] + status;
				break;
			}
		}

		var comment = sap.ui.getCore().byId("textAreaManagerComment").getValue();
		var data = sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData();
		var tableManagerMyTasks = sap.ui.getCore().byId("tableManagerMyTasks");
		var aData = {};
		if (data.ZZ_TRV_REQ == "0000000000" || data.ZZ_TRV_REQ == "" || data.ZZ_TRV_REQ == null) {
			aData.ZZ_DEP_REQ = data.ZZ_DEP_REQ;
			var trvPlan = sap.ui.getCore().byId("managerTravelPlanCheck").getChecked();
			aData.ZZ_DEP_PERNR = data.ZZ_DEP_PERNR;
			aData.ZZ_DEP_NAME = data.ZZ_DEP_NAME;
			aData.ZZ_DEP_STDATE = data.ZZ_DEP_STDATE;
			aData.ZZ_DEP_ENDATE = data.ZZ_DEP_ENDATE;
			aData.ZZ_DEP_ENDATE = data.ZZ_DEP_ENDATE;
			aData.ZZ_DEP_FRMLOC_TXT = data.ZZ_DEP_FRMLOC_TXT;
			aData.ZZ_DEP_TOLOC_TXT = data.ZZ_DEP_TOLOC_TXT;
			aData.ZZ_STAT_FLAG = status;
			aData.ZZ_DEP_NTID = data.ZZ_DEP_NTID;
			aData.ZZ_DEP_EMAIL = data.ZZ_DEP_EMAIL;
			aData.ZZ_DEP_TYPE = data.ZZ_DEP_TYPE;
			aData.ZZ_DEP_TYPE_TXT = data.ZZ_DEP_TYPE_TXT;
			aData.ZZ_DEP_TOCNTRY = data.ZZ_DEP_TOCNTRY;
			aData.ZZ_DEP_TYPE = data.ZZ_DEP_TYPE; //// Added by UCD1KOR
			aData.ZZ_MGR_PERNR = sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_PERNR;
			aData.ZZ_NEW_COMMENTS = comment;
			if (trvPlan) {
				aData.ZZ_TTYPE = "WTRP";
			} else {
				aData.ZZ_TTYPE = "WOTP";
			}

			aData.ZZ_STAGE = "1";
			aData.ZZ_SET = "1_2";
			aData.ZZ_SUBSET = "1_2_1";
			aData.ZZ_SUBSUBSET = "1_2_1_1";
			aData.ZZ_TRV_CAT = data.ZZ_TRV_CAT;

			aData.ZZ_VERSION = data.ZZ_VERSION.trim();
			aData.ZZ_VREASON = data.ZZ_VREASON;

			// Validation before action
			// In manager dashboard, comment field is mandatory
			if (comment.trim() == "" || comment == null) {
				sap.ui.getCore().byId("textAreaManagerComment").setValueState("Error");
				sap.ca.ui.message.showMessageBox({
					type: sap.ca.ui.message.Type.ERROR,
					message: "Please give some comments",
					details: "Please give some comments"
				});
				data.checkFlag = "X";
				sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").setData(data);
				sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
				return;
			} else {
				if (!sap.ui.project.e2etm.util.StaticUtility.check256Characters(comment.trim())) {
					sap.ui.getCore().byId("textAreaManagerComment").setValueState("Error");
					sap.ca.ui.message.showMessageBox({
						type: sap.ca.ui.message.Type.ERROR,
						message: "Maximum 255 characters allowed",
						details: "Maximum 255 characters allowed"
					});
					data.checkFlag = "X";
					sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").setData(data);
					sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
					return;
				} else {
					data.checkFlag = "";
					sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").setData(data);
					sap.ui.getCore().byId("textAreaManagerComment").setValueState("None");
				}
			}
			//sidd start code
			if (data.ZZ_REQ_TYP == "VISA") {

			}
			//sidd end code
			if (data.ZZ_REQ_TYP == "DEPU") {
				// In manager dashboard, if action is approve, 
				var action = status.substring(2, 5);
				if (action == "001") {
					//Validate sponsor by company
					if (data.ZZ_STAT_FLAG == "AA003" &&
						data.ZZ_DEP_TYPE == "INTL" &&
						data.ZZ_REQ_TYP == "DEPU" &&
						data.ZZ_TRV_CAT != "TRNG") {
						if (data.ZZ_SP_CMPNY == "NA") {
							sap.ca.ui.message.showMessageBox({
								type: sap.ca.ui.message.Type.ERROR,
								message: "Please enter Family sponsored",
								details: "Please enter Family sponsored"
							});
							data.checkFlag = "X";
							sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").setData(data);
							sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
							return;
						} else {
							aData.ZZ_SP_CMPNY = data.ZZ_SP_CMPNY;
							data.checkFlag = "";
							sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").setData(data);
							
						}
					} else {
						aData.ZZ_SP_CMPNY = data.ZZ_SP_CMPNY;
						data.checkFlag = "";
						sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").setData(data);
						
					}

					// Validate deputation subtype
					if (data.ZZ_DEP_SUB_TYPE == "" || data.ZZ_DEP_SUB_TYPE == null || data.ZZ_DEP_SUB_TYPE == "Please select") {
						sap.ca.ui.message.showMessageBox({
							type: sap.ca.ui.message.Type.ERROR,
							message: "Please enter Deputation To",
							details: "Please enter Deputation To"
						});
						data.checkFlag = "X";
						sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").setData(data);
						sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
						return;
					} else {
						aData.ZZ_DEP_SUB_TYPE = data.ZZ_DEP_SUB_TYPE;
						data.checkFlag = "";
						sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").setData(data);
						
					}

					/*Start-Third Party Customer Changes*/
					var thirdPartyMsg = this.validateThirdPartyCustomer(status, data.ZZ_DEP_TYPE, data.ZZ_REQ_TYP);

					if (thirdPartyMsg != "") {
						sap.ca.ui.message.showMessageBox({
							type: sap.ca.ui.message.Type.ERROR,
							message: thirdPartyMsg,
							details: thirdPartyMsg
						});
						data.checkFlag = "X";
						sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").setData(data);
						sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
						return;

					}else{
						aData.ZZ_3PARTY_CUST = data.ZZ_3PARTY_CUST;
						data.checkFlag = "";
						sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").setData(data);
						
					}

					
					/*End-Third Party Customer Changes*/

					// Validate assigment model
					if (data.ZZ_ASG_TYP == "" || data.ZZ_ASG_TYP == null || data.ZZ_ASG_TYP == "Please select") {
						sap.ca.ui.message.showMessageBox({
							type: sap.ca.ui.message.Type.ERROR,
							message: "Please enter Assignment Model",
							details: "Please enter Assignment Model"
						});
						data.checkFlag = "X";
						sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").setData(data);
						sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
						return;
					} else {
						aData.ZZ_ASG_TYP = data.ZZ_ASG_TYP;
						data.checkFlag = "";
						sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").setData(data);
						if (data.ZZ_ASG_TYP == "TRFR" && data.ZZ_DEP_TYPE == "DOME") {
							aData.ZZ_TR_RSN = data.ZZ_TR_RSN;
						} else {
							aData.ZZ_TR_RSN = "";
						}
					}

					//################### 07 May 2020 UCD1KOR Changes for Covid-19###############// start
					that.covid_max = that.covid_19COnditionCheck(data);
					that.startDate = new Date(data.ZZ_DEP_STDATE.substr(0, 4), data.ZZ_DEP_STDATE.substr(4, 2) - 1, 
							data.ZZ_DEP_STDATE.substr(6, 2));
					var globalData = sap.ui.getCore().getModel("global").getData();
					that.ext_date = new Date(globalData.ext_date.substr(0, 4), globalData.ext_date.substr(4, 2) - 1, 
							globalData.ext_date.substr(6, 2));
					that.curDate = new Date();
					
					var  oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds

					that.durationDays = Math.round(Math.abs((that.startDate - that.ext_date) / oneDay));
					
					
					//################### 07 May 2020 UCD1KOR Changes for Covid-19###############// End
					// Validate purpose of travel
					if (data.ZZ_TRV_PUR == "" || data.ZZ_TRV_PUR == null || data.ZZ_TRV_PUR == "Please select") {
						sap.ca.ui.message.showMessageBox({
							type: sap.ca.ui.message.Type.ERROR,
							message: "Please enter Motive for travel",
							details: "Please enter Motive for travel"
						});
						data.checkFlag = "X";
						sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").setData(data);
						sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
						return;
					} //################### 07 May 2020 UCD1KOR Changes for Covid-19###############// added
					else if( that.durationDays > that.covid_max && parseInt(data.ZZ_DEP_DAYS) > that.covid_max && data.ZZ_TRV_PUR !="COVI"){
						sap.m.MessageBox.error("Please Select purpose of travel to 'Extension- Covid 2019'");
						data.checkFlag = "X";
						sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").setData(data);
						sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
						return;
					}//################### 07 May 2020 UCD1KOR Changes for Covid-19###############//
						else {
						if (data.ZZ_TRV_PUR != "PROJ" && data.ZZ_DEP_TYPE == "DOME") {
							sap.ca.ui.message.showMessageBox({
								type: sap.ca.ui.message.Type.ERROR,
								message: "For domestic deputation, Motive for travel must be Project Development",
								details: "For domestic deputation, Motive for travel must be Project Development"
							});
							data.checkFlag = "X";
							sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").setData(data);
							sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
							return;
						} else {
							aData.ZZ_TRV_PUR = data.ZZ_TRV_PUR;
							data.checkFlag = "";
							sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").setData(data);
							
						}
					}
					// Validate service condition
					if ((data.ZZ_SERV_TYP == "" || data.ZZ_SERV_TYP == null || data.ZZ_SERV_TYP == "Please select") &&
						data.ZZ_DEP_TYPE == "INTL") {
						sap.ca.ui.message.showMessageBox({
							type: sap.ca.ui.message.Type.ERROR,
							message: "Please enter Service Condition",
							details: "Please enter Service Condition"
						});
						data.checkFlag = "X";
						sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").setData(data);
						sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
						return;
					} else {
						aData.ZZ_SERV_TYP = data.ZZ_SERV_TYP;
						data.checkFlag = "";
						sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").setData(data);
						
					}
					// Validate if service condition type duration is confirmed
					if (data.ZZ_SERV_TYP == "SPCL" && data.ZZ_DEP_TYPE == "INTL") {
						if (data.ZZ_SRVTYP_MONTHS == "" || data.ZZ_SRVTYP_MONTHS == null) {
							sap.ca.ui.message.showMessageBox({
								type: sap.ca.ui.message.Type.ERROR,
								message: "Please enter Service Condition duration",
								details: "Please enter Service Condition duration"
							});
							data.checkFlag = "X";
							sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").setData(data);
							sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
							return;
						} else {
							// Validate if it's a number or not
							if (isNaN(data.ZZ_SRVTYP_MONTHS)) {
								sap.ca.ui.message.showMessageBox({
									type: sap.ca.ui.message.Type.ERROR,
									message: "Please enter Service Condition duration as a number",
									details: "Please enter Service Condition duration as a number"
								});
								data.checkFlag = "X";
								sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").setData(data);
								sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
								return;
							} else {
								// Validate if it's a positive number or not
								if (parseInt(data.ZZ_SRVTYP_MONTHS) <= 0) {
									sap.ca.ui.message.showMessageBox({
										type: sap.ca.ui.message.Type.ERROR,
										message: "Please check the Service Condition duration",
										details: "It should be greater than 0"
									});
									data.checkFlag = "X";
									sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").setData(data);
									sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
									return;
								} else {
									if (parseInt(data.ZZ_SRVTYP_MONTHS) > 24 || parseInt(data.ZZ_SRVTYP_MONTHS) < 1) {
										sap.ca.ui.message.showMessageBox({
											type: sap.ca.ui.message.Type.ERROR,
											message: "Please check the Service Condition duration",
											details: "It should be >= 1 and <= 24 months"
										});
										data.checkFlag = "X";
										sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").setData(data);
										sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
										return;
									} else {
										aData.ZZ_SRVTYP_MONTHS = data.ZZ_SRVTYP_MONTHS;
										data.checkFlag = "";
										sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").setData(data);
										
									}
								}
							}
						}
					} else {
						
						if (data.ZZ_DEP_DAYS <= 90) {
							aData.ZZ_SRVTYP_MONTHS = "3";
						} else {
							aData.ZZ_SRVTYP_MONTHS = "6";
						}
						data.checkFlag = "";
						sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").setData(data);
						
					}
					// Validate confirm service condition checkbox
					if (data.ZZ_SERV_TYP == "SPCL" && data.ZZ_DEP_TYPE == "INTL") {
						var serviceChecked = sap.ui.getCore().byId("managerServiceConditionCheck").getChecked();
						if (!serviceChecked) {
							sap.ca.ui.message.showMessageBox({
								type: sap.ca.ui.message.Type.ERROR,
								message: "Please confirm Service Condition by selecting the checkbox below Service Condition dropdown",
								details: "Please confirm Service Condition by selecting the checkbox below Service Condition dropdown"
							});
							data.checkFlag = "X";
							sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").setData(data);
							sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
							return;
						}
					}else{
						data.checkFlag = "";
						sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").setData(data);
						
					}

				}
			}

			if (status.substring(2, 5) == "002") {
				sap.m.MessageBox.confirm(
					"Complete process needs to be reinitiated if rejected. Do you want to continue?",
					function(oAction) {
						if (oAction == "OK") {
							// Update the deputation with new status
							var token = "";
							var get = $.ajax({
								cache: false,
								url: sServiceUrl + "EMP_PASSPORT_INFOSet",
								type: "GET",
								headers: {
									'Authorization': token
								},
								beforeSend: function(xhr) {
									xhr.setRequestHeader('X-CSRF-Token', 'Fetch');
								}
							});
							get.done(function(result, response, header) {
								token = header.getResponseHeader("X-CSRF-Token");
								var post = $.ajax({
									cache: false,
									url: sServiceUrl + "DEP_HDR_INFOSet(ZZ_DEP_REQ='" + aData.ZZ_DEP_REQ + "',ZZ_VERSION='')",
									type: "PUT",
									beforeSend: function(xhr) {
										xhr.setRequestHeader('X-Requested-With', "XMLHttpRequest");
										xhr.setRequestHeader('X-CSRF-Token', token);
										xhr.setRequestHeader('Accept', "application/json");
										xhr.setRequestHeader('DataServiceVersion', "2.0");
										xhr.setRequestHeader('Content-Type', "application/json");
										xhr.setRequestHeader('If-Match', eTagHome);
									},
									data: JSON.stringify(aData),
									dataType: "json",
									success: function(data) {
										sap.m.MessageToast.show(statusString + "!");
										oHomeThis.bindDataBasedOnRole();
										sap.ui.getCore().byId("textAreaManagerComment").setValue("");
										sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
									}
								});
								post.fail(function(err) {
									// Call get entity service with deputation request number
									if (err.status == 412) {
										var get = $.ajax({
											cache: false,
											url: sServiceUrl + "DEP_LOCK_USERSet('" + data.ZZ_DEP_REQ + "')?$format=json",
											type: "GET",
										});
										get.done(function(result) {
											sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
											sap.ca.ui.message.showMessageBox({
												type: sap.ca.ui.message.Type.ERROR,
												message: "This request was modified by " + result.d.ZZ_DEP_NTID + ". Please refresh homepage"
											});
										});
									} else {
										sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
										sap.ca.ui.message.showMessageBox({
											type: sap.ca.ui.message.Type.ERROR,
											message: "Sorry for this inconvenience. Please contact support team",
											details: err.responseText
										});
									}
								});
							});
						} else if (oAction == "CANCEL") {
							sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
						}
					});
			} else {
				// Validate DE STA
				var globalData = sap.ui.getCore().getModel("global").getData();
				//uml6kor 23/12/2019 added code for family dependents.
				/// Condition check for covid 19
				// UCD1KOR 07 May 2020
				that.covid_max = that.covid_19COnditionCheck(data);
				that.startDate = new Date(data.ZZ_DEP_STDATE.substr(0, 4), data.ZZ_DEP_STDATE.substr(4, 2) - 1, 
						data.ZZ_DEP_STDATE.substr(6, 2));
				that.curDate = new Date();
				var globalData = sap.ui.getCore().getModel("global").getData();
				that.ext_date = new Date(globalData.ext_date.substr(0, 4), globalData.ext_date.substr(4, 2) - 1, 
						globalData.ext_date.substr(6, 2));
				var  oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds

				that.durationDays = Math.round(Math.abs((that.startDate - that.ext_date) / oneDay));
				if (data.ZZ_VREASON != "DH" && data.ZZ_VREASON != "DG" && data.ZZ_VREASON != "DE" && data.ZZ_VREASON != "DF") {

				if (data.ZZ_DEP_TOCNTRY == "DE" && data.ZZ_ASG_TYP == "STA" && status.substring(2, 5) == "001") {
					// Validate if info type 41 is missing
					if (oHomeThis.missingInfoType != null) {
						if (oHomeThis.missingInfoType) {
							sap.ca.ui.message.showMessageBox({
								type: sap.ca.ui.message.Type.ERROR,
								message: "You cannot approve this request because of missing info type 41",
							});
							sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
							return;
						}
					}
					/// Condition check for covid 19
					// UCD1KOR 07 May 2020
				if( that.durationDays>that.covid_max && parseInt(data.ZZ_DEP_DAYS) > that.covid_max ){
					//no
					this.doManagerApprove(aData, statusString);
				}
				else{
					if (sap.ui.getCore().getModel("global").getData().CoolingPeriodCheck.EXCEPTION == "") {
						var nextDate = sap.ui.getCore().getModel("global").getData().CoolingPeriodCheck.NEXT_DATE;
						var nextDateObj = new Date(nextDate.substr(0, 4), nextDate.substr(4, 2) - 1, nextDate.substr(6, 2));
						var startDateObj = new Date(data.ZZ_DEP_STDATE.substr(0, 4),
							data.ZZ_DEP_STDATE.substr(4, 2) - 1, data.ZZ_DEP_STDATE.substr(6, 2));
						if ((nextDateObj > startDateObj && data.ZZ_VREASON == "") ||
							parseInt(data.ZZ_DEP_DAYS) > parseInt(sap.ui.getCore().getModel("global").getData().CoolingPeriodCheck.MAX_DURATION)) {
							//TGG1HC
							var sMaxday = 0;
							if (parseInt(sap.ui.getCore().getModel("global").getData().CoolingPeriodCheck.MAX_DURATION) > sap.ui.getCore().getModel("global")
								.getData()
								.coolingPeriodMaxdays) {
								sMaxday = sap.ui.getCore().getModel("global").getData().coolingPeriodMaxdays;
							} else {
								sMaxday = sap.ui.getCore().getModel("global").getData().CoolingPeriodCheck.MAX_DURATION;
							}
							if (sap.ui.getCore().getModel("global").getData().CoolingPeriodCheck.NEXT_DATE > data.ZZ_DEP_STDATE)/*sap.ui.project.e2etm.util.StaticUtility.checkCoolingDate( sap.ui.getCore().getModel("global").getData().coolingPeriodStartDate , data.ZZ_DEP_STDATE))*/ {
								//                var text = 'Please check your information. You can only travel to Germany on "STA Assignment Model" from ' 
								//                  + sap.ui.project.e2etm.util.Formatter.sapDate(nextDate) + ' for a maximum of ' + 
								//                  sap.ui.getCore().getModel("global").getData().CoolingPeriodCheck.MAX_DURATION + ' days';
								//                var text = 'Associate can travel to Germany on "STA Assignment Model" only from ' 
								//                  + sap.ui.project.e2etm.util.Formatter.sapDate(nextDate) 
								////                  + ' for a deputation of ' + sap.ui.getCore().getModel("global").getData().CoolingPeriodCheck.MAX_DURATION
								//                  + ' for a deputation of ' + sMaxday
								//                  + ' days as per RBEI Cooling period guidelines.';

									var text = 'As per proposed cooling off conditions, associate is not eligible to travel on given date. Proposed start date will be ' + sap
									.ui.project.e2etm.util.Formatter.sapDate(nextDate) + ' for a  maximum duration of ' + sMaxday +
									' days.Cooling period between two STA assignments will be enforced strictly effective ' + sap.ui.project.e2etm.util.Formatter.sapDate(
										sap.ui.getCore().getModel("global").getData().coolingPeriodStartDate) + '.Please contact deputation team'; 
								
								sap.ca.ui.message.showMessageBox({
									type: sap.ca.ui.message.Type.ERROR,
									message: text,
								});
								sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
								return;
							} /*else {
								var text = 'Associate can travel to Germany on "STA Assignment Model" only from ' + sap.ui.project.e2etm.util.Formatter.sapDate(
										nextDate)
									//                  + ' for a deputation of ' + sap.ui.getCore().getModel("global").getData().CoolingPeriodCheck.MAX_DURATION
									+ ' for a deputation of ' + sMaxday + ' days as per RBEI Cooling period guidelines. Do you want to continue?';
								//                var text = 'Please check your information. You can only travel to Germany on "STA Assignment Model" from ' 
								//                  + sap.ui.project.e2etm.util.Formatter.sapDate(nextDate) + ". Do you want to continue ?";
								sap.m.MessageBox.confirm(
									text,
									function(oAction) {
										if (oAction == "OK") {
											
											oHomeThis.doManagerApprove(aData, statusString);
										}
										sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
									});
								
							}*///commented by uml6kor 06_05_2019
							//started by uml6kor 7_5_2019
							else if((sap.ui.getCore().getModel("global").getData().CoolingPeriodCheck.TRVL_DURATION != "" && sap.ui.getCore().getModel("global").getData().CoolingPeriodCheck.TRVL_DURATION != '0') 
									&& parseInt(sap.ui.getCore().getModel("global").getData().CoolingPeriodCheck.TRVL_DURATION) < parseInt(data.ZZ_DEP_DAYS)){
								
							
								sMaxday = parseInt(sap.ui.getCore().getModel("global").getData().CoolingPeriodCheck.TRVL_DURATION);
								
								var text =
									'As per proposed cooling period conditions, associate is able to travel for a  maximum duration of ' + sMaxday +
									' days. Please contact deputation team';
								sap.ca.ui.message.showMessageBox({
									type: sap.ca.ui.message.Type.ERROR,
									message: text,
								});
								sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
								return;
							}
							else
								{
								oHomeThis.doManagerApprove(aData, statusString);
								}
							//ended by uml6kor 7_5_2019
						} else {
							this.doManagerApprove(aData, statusString);
						}
					} else {
						this.doManagerApprove(aData, statusString);
					}
				}
						
				}else {
					
					/// Condition check for covid 19
					// UCD1KOR 07 May 2020
					that.covid_max = that.covid_19COnditionCheck(data);
					that.startDate = new Date(data.ZZ_DEP_STDATE.substr(0, 4), data.ZZ_DEP_STDATE.substr(4, 2) - 1, 
							data.ZZ_DEP_STDATE.substr(6, 2));
					that.curDate = new Date();
					var  oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
					var globalData = sap.ui.getCore().getModel("global").getData();
					that.ext_date = new Date(globalData.ext_date.substr(0, 4), globalData.ext_date.substr(4, 2) - 1, 
							globalData.ext_date.substr(6, 2));
					that.durationDays = Math.round(Math.abs((that.startDate - that.ext_date) / oneDay));
					if(that.durationDays>that.covid_max && parseInt(data.ZZ_DEP_DAYS) > that.covid_max ){
						//no
						this.doManagerApprove(aData, statusString);
					}
					else{
						if (data.ZZ_DEP_FRCNTRY != data.ZZ_DEP_TOCNTRY  && ( data.ZZ_ASG_TYP == "STA" || data.ZZ_ASG_TYP == "STAPP"|| data.ZZ_ASG_TYP == "STX" ) && status.substring(2, 5) == "001") {	//UML6KOR_STX cooling changes

							if ( sap.ui.getCore().getModel("global").getData().CoolingPeriodCheck.NEXT_DATE > data.ZZ_DEP_STDATE ) {
						
								if( data.ZZ_DEP_TOCNTRY == "GB"  && ( data.ZZ_ASG_TYP == "STA" || data.ZZ_ASG_TYP == "STAPP") ){
									var text_coolingoff = 'As per proposed cooling off conditions, associate is not eligible to travel on given date. Proposed start date will be ' + sap
									.ui
									.project.e2etm.util.Formatter.sapDate(nextDate) + ' for a  maximum duration of ' + sMaxday +
									' days.Cooling period between two STA assignments will be enforced strictly effective ' + sap.ui.project.e2etm.util.Formatter.sapDate(
										sap.ui.getCore().getModel("global").getData().coolingPeriodStartDate) + '.Please contact deputation team'; 
								}else if(data.ZZ_ASG_TYP == "STX"){
									var text_coolingoff =  'As per cooling period guidelines, employee will not be able to travel to the selected country on STX assignment model only from '+
									sap.ui.project.e2etm.util.Formatter.sapDate(sap.ui.getCore().getModel("global").getData().CoolingPeriodCheck.NEXT_DATE) +
									'. Please refer the travel policy on Proview for more information.';
								
								}
								else
									{
									
								var text_coolingoff = 'As per cooling period policy, employee will be able to travel to the selected country only from ' + 
								sap.ui.project.e2etm.util.Formatter.sapDate(sap.ui.getCore().getModel("global").getData().CoolingPeriodCheck.NEXT_DATE) + '.Please refer the travel policy for more information.';
									}
								
								var text = text_coolingoff;
								sap.ca.ui.message.showMessageBox({
									type: sap.ca.ui.message.Type.ERROR,
									message: text,
									details: text
								});
								sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
								return;
							} else {
								this.doManagerApprove(aData, statusString);							
							}

						} else {		
							this.doManagerApprove(aData, statusString);
						}
					}

					
				}
			}else {
				this.doManagerApprove(aData, statusString);
			} //uml6kor 23/12/2019 code added for dependents

			}
		} else { // This block is used for approving business travel
			// validation steps
			var action = status.substring(2, 5);
			if (action == "001") {
				// Validate deputation subtype
				if (sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData().ZZ_DEP_SUB_TYPE == "") {
					sap.ca.ui.message.showMessageBox({
						type: sap.ca.ui.message.Type.ERROR,
						message: "Please enter Travel To",
						details: "Please enter Travel To"
					});
					sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
					//Added by UEA6KOR_23.11.2020 for inland CL Automation
					data.checkFlag = "X";
					sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").setData(data);
					//Added by UEA6KOR_23.11.2020 for inland CL Automation
					return;
				}
				
			////######### COvid-19 conditions
				/// UCD1KOR 07 May 2020 start
				that.covid_max = that.covid_19COnditionCheck(data);
				that.startDate = new Date(data.ZZ_DEP_STDATE.substr(0, 4), data.ZZ_DEP_STDATE.substr(4, 2) - 1, 
						data.ZZ_DEP_STDATE.substr(6, 2));
				that.curDate = new Date();
				var  oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
				var globalData = sap.ui.getCore().getModel("global").getData();
				that.ext_date = new Date(globalData.ext_date.substr(0, 4), globalData.ext_date.substr(4, 2) - 1, 
						globalData.ext_date.substr(6, 2));
				that.durationDays = Math.round(Math.abs((that.startDate - that.ext_date) / oneDay));
				if(that.durationDays>that.covid_max && parseInt(data.ZZ_DEP_DAYS) > that.covid_max && data.ZZ_TRV_PUR !="COVI"){
						sap.m.MessageBox.error("Please Select purpose of travel to 'Extension- Covid 2019'");
						sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
						//Added by UEA6KOR_23.11.2020 for inland CL Automation
						data.checkFlag = "X";
						sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").setData(data);
						//Added by UEA6KOR_23.11.2020 for inland CL Automation
						return;
				}
				else {
					if (data.ZZ_TRV_PUR != "PROJ" && data.ZZ_DEP_TYPE == "DOME") {
						sap.ca.ui.message.showMessageBox({
							type: sap.ca.ui.message.Type.ERROR,
							message: "For domestic deputation, Motive for travel must be Project Development",
							details: "For domestic deputation, Motive for travel must be Project Development"
						});
						sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
						//Added by UEA6KOR_23.11.2020 for inland CL Automation
						data.checkFlag = "X";
						sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").setData(data);
						//Added by UEA6KOR_23.11.2020 for inland CL Automation
						return;
					} else {
						aData.ZZ_TRV_PUR = data.ZZ_TRV_PUR;
						//Added by UEA6KOR_23.11.2020 for inland CL Automation
						data.checkFlag = "";
						sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").setData(data);
						//Added by UEA6KOR_23.11.2020 for inland CL Automation
						
					}
				}/// UCD1KOR 07 May 2020 end

			}

			// Validate Comment field
			if (comment.trim() == "" || comment == null) {
				sap.ui.getCore().byId("textAreaManagerComment").setValueState("Error");
				sap.ca.ui.message.showMessageBox({
					type: sap.ca.ui.message.Type.ERROR,
					message: "Please give some comments",
					details: "Please give some comments"
				});
				sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
				//Added by UEA6KOR_23.11.2020 for inland CL Automation
				data.checkFlag = "X";
				sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").setData(data);
				//Added by UEA6KOR_23.11.2020 for inland CL Automation
				return;
			}else{
				//Added by UEA6KOR_23.11.2020 for inland CL Automation
				data.checkFlag = "X";
				sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").setData(data);
				//Added by UEA6KOR_23.11.2020 for inland CL Automation
				
			}

			// Action steps
			var reqNo = "";
			if (sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData().ZZ_REQ_TYP == "BUSR" ||
				sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData().ZZ_REQ_TYP == "SECO" ||
				sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData().ZZ_REQ_TYP == "HOME" ||
				sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData().ZZ_REQ_TYP == "EMER" ||
				sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData().ZZ_REQ_TYP == "INFO") {
				reqNo = sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData().ZZ_DEP_REQ;
			} else {
				reqNo = sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData().ZZ_TRV_REQ;
			}
			if (action == "001") { // Approve travel plan
				//###################### UCD1KOR 24 Mar 2021 ################################//////////
				///////////////////////////////////////////////////////////////////////////////////////
				///During the first level of approval (if it is multi-level approval), if Fund is F08, 
				///budget check should not be performed during ???Approval??? action and with the button ???budget check???.
				var Fund = sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData().ZZ_GEBER;
				///////// If Fund Not equal to F08
				if(Fund.indexOf("F08") == -1){
					var get = $.ajax({
						cache: false,
						url: sServiceUrl + "BudgetCheck?ZZ_DEP_SUB_TYP='" +
							sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData().ZZ_DEP_SUB_TYPE +
							"'&ZZ_PERNR='" + sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData().ZZ_DEP_PERNR +
							"'&ZZ_MGR_PERNR='" + sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_PERNR +
							"'&ZZ_REINR='" + reqNo + "'&ZZ_STAT_FLAG='" + status +
							"'&ZZ_TTYPE='" + sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData().ZZ_REQ_TYP +
							"'&$format=json",
						type: "GET"
					});
					get.done(function(output) {
						try {
							try {
								var sHasBudget = output.d.results[0].ZZ_BUDGET_AVL;
							} catch (ex) {
								var sHasBudget = 'X';
							}
							if (sap.ui.project.e2etm.util.StaticUtility.noBudgetCheck(
									sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData().ZZ_STAT_FLAG,
									sHasBudget,
									sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_DEPT,
									sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData().ZZ_FSTL,
									sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData().ZZ_GEBER,
									sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData().ZZ_DEP_TYPE)) {

								that.ManagerApproveServiceCallLatest(reqNo,statusString);
							} else {
								sap.ca.ui.message.showMessageBox({
									type: sap.ca.ui.message.Type.ERROR,
									message: "Cannot approve this request because budget availability is: " + budget,
									details: "Cannot approve this request because budget availability is: " + budget
								});
								sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
							}
						} catch (exc) {
							oHomeThis.displayPopUpMessage();
							//            sap.ca.ui.message.showMessageBox({
							//              type: sap.ca.ui.message.Type.ERROR,
							//              message: "Cannot approve this request because budget is not available. Contact respective Budget Center owner and CTG BU-Coordinators.\n\n" +
							//              "1. Mr. Irshad Pasha (RBEI/CTG13) / 6657-1812 / NE1 Coordinator\n" +
							//              "2. Mr. Dilip JS (RBEI/CTG15) / 6757-3156 / NE2 Coordinator\n" +
							//              "3. Ms. Vanditha JG (RBEI/CTG15) / 6757-3161 / NE3 & ISY Coordinator\n" +
							//              "4. Mr. Narendra Kumar R (RBEI/CTG31) / 6757-3124 / BSV Coordinator\n" +
							//              "5. Mr. Nishchay Mallaraj Urs (RBEI/CTG36) / 6757-3123 / Corporate Departments Coordinator",
							//            });
							sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
						}
					});
					get.fail(function(err) {
						sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
						var sMsg = err.responseText;
						sap.ca.ui.message.showMessageBox({
							type: sap.ca.ui.message.Type.ERROR,
							message: "Budget Check not working",
							details: sMsg
						});
					});
				}
				else{
					/////####################### UCD1KOR 31 March 2021 #################################///
					//// Call Below service If Fund is F08
					var val = sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData().ZZ_VREASON;
					if(val == "DB" || val == "TA"){
						var indicator = "ADJ";
					}
					else if(val == "DA" || val == "DE" || val == "DF"  || val == "DH" || val == ""){
						var indicator = "CRT";
					}
					else if(val == "DC"){
						var indicator = "CAN";
					}
					var get = $.ajax({
						cache: false,
						url: sServiceUrl + "ProjChckBudget?ZZ_DEP_SUB_TYP='" +
						sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData().ZZ_DEP_SUB_TYPE +
						"'&ZZ_PERNR='" + sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData().ZZ_DEP_PERNR +
						"'&ZZ_MGR_PERNR='" + sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_PERNR +
						"'&ZZ_TTYPE='" + sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData().ZZ_REQ_TYP +
						"'&ZZ_REINR='" + reqNo + "'&Indicator='"+ indicator +"'&$format=json",
						type: "GET"
					});
					get.done(function(output) {
						try{
							//var flag= output.d.ProjChckBudget.Flag;
						}catch(err){}
						that.ManagerApproveServiceCallLatest(reqNo,statusString);
						
					})
					get.fail(function(err) {
						sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
						var sMsg = err.responseText;
						sap.ca.ui.message.showMessageBox({
							type: sap.ca.ui.message.Type.ERROR,
							message: "Budget Check not working",
							details: sMsg
						});
					});
				}
				
			} else if (action == "003" || action == "002") { // Send back or reject travel request
				var sFunction = 'TravelSendBack?';
				if (action == '002') {
					sFunction = 'TravelReject?';
					sap.m.MessageBox.confirm(
						"Complete process needs to be reinitiated if rejected. Do you want to continue?",
						function(oAction) {
							if (oAction == "OK") {
								var get = $.ajax({
									cache: false,
									url: sServiceUrl + sFunction +
										"ZZ_COMMENTS='" + sap.ui.getCore().byId("textAreaManagerComment").getValue() +
										"'&ZZ_MGR_PERNR='" + sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_PERNR +
										"'&ZZ_REINR='" + reqNo +
										"'&ZZ_ROLE='" + sap.ui.getCore().getModel("profile").getData().currentRole +
										"'&ZZ_TTYPE='" + sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData().ZZ_REQ_TYP +
										"'&ZZ_TIMESTAMP='" + sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData().ZZ_TIMESTAMP +
										"'&$format=json",
									type: "GET"
								});
								get.done(function(result) {
									sap.m.MessageToast.show(statusString + "!");
									oHomeThis.bindDataBasedOnRole();
									sap.ui.getCore().byId("textAreaManagerComment").setValue("");
									sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
								});
								get.fail(function(err) {
									sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
									sap.ca.ui.message.showMessageBox({
										type: sap.ca.ui.message.Type.ERROR,
										message: "Sorry for this inconvenience. Please contact support team",
										details: err.responseText
									});
								});
							} else if (oAction == "CANCEL") {
								sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
							}
						});
				} else {
					var get = $.ajax({
						cache: false,
						url: sServiceUrl + sFunction +
							"ZZ_COMMENTS='" + sap.ui.getCore().byId("textAreaManagerComment").getValue() +
							"'&ZZ_MGR_PERNR='" + sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_PERNR +
							"'&ZZ_REINR='" + reqNo +
							"'&ZZ_ROLE='" + sap.ui.getCore().getModel("profile").getData().currentRole +
							"'&ZZ_TTYPE='" + sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData().ZZ_REQ_TYP +
							"'&ZZ_TIMESTAMP='" + sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData().ZZ_TIMESTAMP +
							"'&$format=json",
						type: "GET"
					});
					get.done(function(result) {
						sap.m.MessageToast.show(statusString + "!");
						oHomeThis.bindDataBasedOnRole();
						sap.ui.getCore().byId("textAreaManagerComment").setValue("");
						sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
					});
					get.fail(function(err) {
						sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
						sap.ca.ui.message.showMessageBox({
							type: sap.ca.ui.message.Type.ERROR,
							message: "Sorry for this inconvenience. Please contact support team",
							details: err.responseText
						});
					});
				}
			}
		}
	},
	//###################### UCD1KOR 24 Mar 2021 ################################//////////
	///////////////////////////////////////////////////////////////////////////////////////
	///During the first level of approval (if it is multi-level approval), if Fund is F08, 
	///budget check should not be performed during ???Approval??? action and with the button ???budget check???.
	ManagerApproveServiceCallLatest:function(reqNo,statusString){
		
		var get = $.ajax({
		cache: false,
		url: sServiceUrl + "APPROVE_TRAVEL?" +
			"CATID='" + sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData().ZZ_DEP_SUB_TYPE +
			"'&COMMENT='" + sap.ui.getCore().byId("textAreaManagerComment").getValue() +
			"'&PERNR='" + sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_PERNR +
			"'&REQUEST='" + reqNo +
			"'&TYPE='" + sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData().ZZ_REQ_TYP +
			"'&ROLE='" + sap.ui.getCore().getModel("profile").getData().currentRole +
			"'&TIMESTAMP='" + sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData().ZZ_TIMESTAMP +
			"'&$format=json",
		type: "GET"
	});
	get.done(function(result) {
		sap.m.MessageToast.show(statusString + "!");
		oHomeThis.bindDataBasedOnRole();
		sap.ui.getCore().byId("textAreaManagerComment").setValue("");
		sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
	});
	get.fail(function(err) {
		sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
		var sMsg = err.responseText;
		if (sMsg.indexOf("EX_OBSOLETE") != -1) {
			sMsg = "This request status is obsolete, please click refresh on the dashboard to retrieve new version";
		}
		sap.ca.ui.message.showMessageBox({
			type: sap.ca.ui.message.Type.ERROR,
			message: "Sorry for this inconvenience. Please contact support team",
			details: sMsg
		});
	});},
	doManagerApprove: function(aData, statusString) {
		var that=this;
		/* Start-CGGS Changes */
		if (aData.ZZ_STAT_FLAG.substring(2, 5) == "001") {
			var errorMsg = this.checkCggsData(aData);
			if (errorMsg != "") {
				sap.ca.ui.message.showMessageBox({
					type: sap.ca.ui.message.Type.ERROR,
					message: errorMsg,
					details: errorMsg
				});
				sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
				return;
			}
		}
		/* End-CGGS Changes */
		//uea6kor-uml6kor-uik1kor 21/8/2020 RBEIITAPPPIPELINE-217  for Extension date for Visa
		  var vData = sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData();
		 if(vData.ZZ_VREASON_EX === "EX"){
			aData.ZZ_VREASON_EX = "EX"; 
			var cggsFormsValid = true;
		}else{
			aData.ZZ_VREASON_EX = ""; 
			var cggsFormsValid = sap.ui.project.e2etm.util.StaticUtility.checkCGGSForms(aData, sap.ui.getCore().byId(
			"grmCggsChecklist--cggsFormsDisplay"));
		}
		// Update the deputation with new status
		if (cggsFormsValid) {

			var token = "";
			var get = $.ajax({
				cache: false,
				url: sServiceUrl + "EMP_PASSPORT_INFOSet",
				type: "GET",
				headers: {
					'Authorization': token
				},
				beforeSend: function(xhr) {
					xhr.setRequestHeader('X-CSRF-Token', 'Fetch');
				}
			});
			get.done(function(result, response, header) {
				token = header.getResponseHeader("X-CSRF-Token");
				var post = $.ajax({
					cache: false,
					url: sServiceUrl + "DEP_HDR_INFOSet(ZZ_DEP_REQ='" + aData.ZZ_DEP_REQ + "',ZZ_VERSION='')",
					type: "PUT",
					beforeSend: function(xhr) {
						xhr.setRequestHeader('X-Requested-With', "XMLHttpRequest");
						xhr.setRequestHeader('X-CSRF-Token', token);
						xhr.setRequestHeader('Accept', "application/json");
						xhr.setRequestHeader('DataServiceVersion', "2.0");
						xhr.setRequestHeader('Content-Type', "application/json");
						xhr.setRequestHeader('If-Match', eTagHome);
					},
					data: JSON.stringify(aData),
					dataType: "json",
					success: function(data) {
						/* Start-CGGS Changes */
						var cggsdata = oHomeThis.getView().getModel("cggsmodel").getData();
						var managerData = sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData();
						var cggsFlag = sap.ui.project.e2etm.util.StaticUtility.visibleCggsData(managerData.ZZ_TRV_REQ, managerData.ZZ_DEP_TOCNTRY,
							managerData.ZZ_ASG_TYP, managerData.ZZ_REQ_TYP, managerData.ZZ_TRV_CAT, managerData.ZZ_VREASON, managerData.ZZ_VREASON_EX);//uea6kor-uml6kor 27/8/2020 added RBEIITAPPPIPELINE-217  for Extension date 
						if (cggsFlag) {
							sap.ui.project.e2etm.util.StaticUtility.modifyCggsData(oHomeThis.getView().getModel("cggsmodel").getData());
						}
						/* End-CGGS Changes */
						sap.m.MessageToast.show(statusString + "!");
						oHomeThis.bindDataBasedOnRole();
						sap.ui.getCore().byId("textAreaManagerComment").setValue("");
						if(aData.checkFlag != "X"){
							///################# UCD1KOR Service integrated for validation ###############/////////////////
							oDataModel.read("getDepuStatus?DepuReq='" + aData.ZZ_DEP_REQ + "'&$format=json", null, null, false, function(resData, response) {
								var stsFlag = JSON.parse(response.body);
								if (stsFlag.d.getDepuStatus.ZZ_STATUS_DESC == "X" &&aData.ZZ_DEP_TYPE =="DOME" && (aData.ZZ_REQ_TYP =="DEPU"|| vData.ZZ_REQ_TYP == "DEPU")){
									that.generateCL();
									oHomeThis.deputationAction('006', "Successfully Approved and CL generated");
								}
				    		}, function(error) {
				    					sap.m.MessageToast.show("Manager Approved Failed");
				    		});
							
							
						}
						///##################### UCD1KOR Service integration automatic cssgs generation #################///////////////////
						if(aData.ZZ_DEP_TOCNTRY == "DE" && aData.ZZ_DEP_TYPE == "INTL"){
							//oHomeThis.AutomaticGenOfCggsCalSheet(aData, "CGGS Calculation Sheet Generated Successfully");
						}
						sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
					}
				});
				post.fail(function(err) {
					// Call get entity service with deputation request number
					if (err.status == 412) {
						var get = $.ajax({
							cache: false,
							url: sServiceUrl + "DEP_LOCK_USERSet('" + data.ZZ_DEP_REQ + "')?$format=json",
							type: "GET",
						});
						get.done(function(result) {
							sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
							sap.ca.ui.message.showMessageBox({
								type: sap.ca.ui.message.Type.ERROR,
								message: "This request was modified by " + result.d.ZZ_DEP_NTID + ". Please refresh homepage"
							});
						});
					} else {
						sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
						sap.ca.ui.message.showMessageBox({
							type: sap.ca.ui.message.Type.ERROR,
							message: "Sorry for this inconvenience. Please contact support team",
							details: err.responseText
						});
					}
				});
			});
		} else {
			sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
			var message;
			//start of code exflag uea6kor-uml6kor 24/8/2020 RBEIITAPPPIPELINE-217 date change extension	
//			if(aData.ZZ_VREASON_EX == "EX"){
//				message = "Upload new fully approved requisition form for date extension to proceed further";
//			}	//end of code exflag uea6kor-uml6kor 24/8/2020 RBEIITAPPPIPELINE-217 date change extension	
//			
//			else
				if (sap.ui.project.e2etm.util.StaticUtility.checkStvaAsg(aData.ZZ_ASG_TYP) && aData.ZZ_TRV_CAT == "TRFR") {
				message = "Upload fully approved ST_VA requisition form to proceed further";
			} else {
				message = "Please upload valid requistion Forms";
			}
			sap.m.MessageToast.show(message);
		}
	},
	////##################### UCD1KOR Jan 7th,2021 ###############################////////////////
	AutomaticGenOfCggsCalSheet:function(aData,vMessage){
		sap.ui.project.e2etm.util.StaticUtility.setBusy(true, oHomeThis);
		var cggsSheet = {};
		cggsSheet.AsgTyp = "";
		cggsSheet.Begda = aData.ZZ_DEP_STDATE;
		cggsSheet.DepReq= aData.ZZ_DEP_REQ;
		cggsSheet.EMessage = "";
		cggsSheet.Endda = aData.ZZ_DEP_ENDATE;
		cggsSheet.Name= aData.ZZ_DEP_NAME;
		cggsSheet.Pernr = aData.ZZ_DEP_PERNR;
		cggsSheet.ReqType = "New";
		cggsSheet.SeqNo =  "00";
		cggsSheet.ShStatus =  "G";
		cggsSheet.Tab = "";
		cggsSheet.Template = "N";
		cggsSheet.Version = "1";
		cggsSheet.Vreason = aData.ZZ_DEP_TOCNTRY;
		
		 oDataModel.create("CggsCalcSheetSet", cggsSheet, {success:jQuery.proxy(function(oData, response) {
				sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
				if(oData.EMessage!=""){
					sap.ca.ui.message.showMessageBox({
						type: sap.ca.ui.message.Type.ERROR,
						message: oData.EMessage,
						details: oData.EMessage
					});
				}else{
					sap.m.MessageToast.show(vMessage);	
				}
			},this), error:jQuery.proxy(function(error) {
				sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
				sap.m.MessageBox.error("Error on Automatic Generation Of Cggs Calculation Sheet");
			},this), async:true});
	},
	onCGGSFormsUpload: function(evt) {
		var data = sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData();
		var stvaFlag = false;
		//start of code uea6kor-uml6kor 24/8/2020 RBEIITAPPPIPELINE-217 date change extension
		var ex_flag = false;
		if(data.ZZ_VREASON_EX == "EX"){
			ex_flag = true;
			sap.ui.project.e2etm.util.StaticUtility.validateUploadCggsFile(evt, data.ZZ_DEP_REQ, data.ZZ_DEP_PERNR,
					sap.ui.getCore().byId("grmCggsChecklist--cggsFormsDisplay"),
					stvaFlag, data.ZZ_VERSION, ex_flag);//added exflag uea6kor-uml6kor 24/8/2020 RBEIITAPPPIPELINE-217 date change extension
		}
		//end of code uea6kor-uml6kor 24/8/2020 RBEIITAPPPIPELINE-217 date change extension
		
		if (data.ZZ_TRV_CAT == "TRFR"){
			stvaFlag = true;
			sap.ui.project.e2etm.util.StaticUtility.validateUploadCggsFileChange(evt, data.ZZ_DEP_REQ, data.ZZ_DEP_PERNR,
					sap.ui.getCore().byId("grmCggsChecklist--cggsFormsDisplay"),
					stvaFlag, data.ZZ_VERSION, ex_flag);//added Ucd1kor 10/09/2020 RBEIITAPPPIPELINE-217 file upload bug on mngr dashboard
		}
		if ( data.ZZ_TRV_CAT == "WRKP"){
			/*stvaFlag = true;*/
			sap.ui.project.e2etm.util.StaticUtility.validateUploadCggsFileChange(evt, data.ZZ_DEP_REQ, data.ZZ_DEP_PERNR,
					sap.ui.getCore().byId("grmCggsChecklist--cggsFormsDisplay"),
					stvaFlag, data.ZZ_VERSION, ex_flag);//added Ucd1kor 10/09/2020 RBEIITAPPPIPELINE-217 file upload bug on mngr dashboard
		}
			
			
		
	},
	onMgrDocsUpload: function(evt) {
		//    if(this.getView().byId("flxDocContent").getItems().length!=0)
		if (this.getView().byId("cggsFormsDisplay").getContent().length != 0) {
			this.managerDocsUploadOnApprove.resolve();
			this.getView().byId("dlgMgrCggsDocs").close();
		} else {
			sap.m.MessageToast.show("Please upload valid CGGS Forms")
		}

	},
	onMgrUploadCancel: function(evt) {
		this.getView().byId("dlgMgrCggsDocs").close();
	},
	onMgrUploadComplete: function(evt) {

	},
	onRemoveCggsForms: function() {
		var data = sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData();
		sap.ui.project.e2etm.util.StaticUtility.deleteFileFromDms(sap.ui.getCore().byId("grmCggsChecklist--cggsFormsDisplay").getModel(),
			data.ZZ_DEP_REQ,
			data.ZZ_DEP_PERNR);
	},
	onDownloadCggsForms: function(evt) {
		var data = sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData();
		var sModule = "CGF";
		if (data.ZZ_TRV_CAT == "TRFR")
			sModule = "SRQ";
		sap.ui.project.e2etm.util.StaticUtility.downloadCggsForms(sap.ui.getCore().byId("grmCggsChecklist--cggsFormsDisplay").getModel().getData(),
			data.ZZ_DEP_REQ,
			data.ZZ_DEP_PERNR,
			sModule);

	},

	// MANAGER WORKFLOW ACTION

	// CTG WORKFLOW ACTION
	ctgAction: function(status, statusString) {
		sap.ui.project.e2etm.util.StaticUtility.setBusy(true, oHomeThis);
		var comment = sap.ui.getCore().byId("textAreaCTGComment").getValue();
		var data = sap.ui.getCore().byId("flexboxCTGMyTaskDetail").getModel("myCTGSelectedTaskModel").getData();

		/*----------Begin of Travel Request----------------------------------------------------*/
		if (data.ZZ_REQ_TYP == 'BUSR' || data.ZZ_REQ_TYP == 'SECO' ||
			data.ZZ_REQ_TYP == 'HOME' || data.ZZ_REQ_TYP == 'EMER' ||
			data.ZZ_REQ_TYP == 'DEPU' || data.ZZ_REQ_TYP == 'INFO') {
			// In manager dashboard, comment field is mandatory
			if (comment.trim() == "" || comment == null) {
				sap.ui.getCore().byId("textAreaCTGComment").setValueState("Error");
				sap.ca.ui.message.showMessageBox({
					type: sap.ca.ui.message.Type.ERROR,
					message: "Please give some comments",
					details: "Please give some comments"
				});
				sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
				return;
			}
			if (data.ZZ_REQ_TYP == "DEPU") {
				var requestNo = data.ZZ_TRV_REQ;
			} else {
				var requestNo = data.ZZ_DEP_REQ;
			}

			if (status == '001') { //Approve request           
				var get = $.ajax({
					cache: false,
					url: sServiceUrl + "APPROVE_TRAVEL?" +
						"CATID='" + data.ZZ_DEP_SUB_TYPE +
						"'&COMMENT='" + comment +
						"'&PERNR='" + sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_PERNR +
						"'&REQUEST='" + requestNo +
						"'&TYPE='" + data.ZZ_REQ_TYP +
						"'&ROLE='" + sap.ui.getCore().getModel("profile").getData().currentRole +
						"'&TIMESTAMP='" + data.ZZ_TIMESTAMP +
						"'&$format=json",
					type: "GET"
				});
				get.done(function(result) {
					sap.m.MessageToast.show(statusString + "!");
					oHomeThis.bindDataBasedOnRole();
					sap.ui.getCore().byId("textAreaCTGComment").setValue("");
					sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
				});
				get.fail(function(err) {
					sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
					var sMsg = err.responseText;
					if (sMsg.indexOf("EX_OBSOLETE") != -1) {
						sMsg = "This request status is obsolete, please click refresh on the dashboard to retrieve new version";
					}
					sap.ca.ui.message.showMessageBox({
						type: sap.ca.ui.message.Type.ERROR,
						message: "Sorry for this inconvenience. Please contact support team",
						details: sMsg
					});
				});
			} else if (status == '002') { //Reject request
				var get = $.ajax({
					cache: false,
					url: sServiceUrl + "TravelReject?ZZ_COMMENTS='" + comment +
						"'&ZZ_MGR_PERNR='" + sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_PERNR +
						"'&ZZ_REINR='" + requestNo +
						"'&ZZ_ROLE='" + sap.ui.getCore().getModel("profile").getData().currentRole +
						"'&ZZ_TTYPE='" + data.ZZ_REQ_TYP +
						"'&ZZ_TIMESTAMP='" + data.ZZ_TIMESTAMP +
						"'&$format=json",
					type: "GET"
				});
				get.done(function(result) {
					sap.m.MessageToast.show(statusString + "!");
					oHomeThis.bindDataBasedOnRole();
					sap.ui.getCore().byId("textAreaCTGComment").setValue("");
					sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
				});
				get.fail(function(err) {
					sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
					sap.ca.ui.message.showMessageBox({
						type: sap.ca.ui.message.Type.ERROR,
						message: "Sorry for this inconvenience. Please contact support team",
						details: err.responseText
					});
				});
			} else if (status == '003') {
				var get = $.ajax({
					cache: false,
					url: sServiceUrl + 'TravelSendBack?' +
						"ZZ_COMMENTS='" + comment +
						"'&ZZ_MGR_PERNR='" + sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_PERNR +
						"'&ZZ_REINR='" + requestNo +
						"'&ZZ_ROLE='" + sap.ui.getCore().getModel("profile").getData().currentRole +
						"'&ZZ_TTYPE='" + data.ZZ_REQ_TYP +
						"'&ZZ_TIMESTAMP='" + data.ZZ_TIMESTAMP +
						"'&$format=json",
					type: "GET"
				});
				get.done(function(result) {
					sap.m.MessageToast.show(statusString + "!");
					oHomeThis.bindDataBasedOnRole();
					sap.ui.getCore().byId("textAreaCTGComment").setValue("");
					sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
				});
				get.fail(function(err) {
					sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
					sap.ca.ui.message.showMessageBox({
						type: sap.ca.ui.message.Type.ERROR,
						message: "Sorry for this inconvenience. Please contact support team",
						details: err.responseText
					});
				});
			}
			return;
		}
		/*----------End of Travel Request------------------------------------------------------*/
	},
	// CTG WORKFLOW ACTION

	// This method is used to set neccesarry values to global model before being used in REQUEST DETAILS PAGE
	navigateToDetailScreen: function(entity, whichTab, isChange, changeType, isCreate) {
		sap.ui.project.e2etm.util.StaticUtility.setBusy(true, this); //eslint-disable-line
		var oThis = this;
		var aData = sap.ui.getCore().getModel("global").getData();
		aData.whichTab = whichTab;
		aData.isChange = isChange;
		aData.changeType = changeType;
		aData.isCreate = isCreate;
		aData.isCopy = false;
		aData.copyGeneral= false;
		aData.copyTravelDetails= false;
		aData.copyCostAssignment= false;
		aData.copyAdvance= false;
		aData.ZZ_DEP_REQ = entity.ZZ_DEP_REQ;
		aData.ZZ_REQ_TYP = entity.ZZ_REQ_TYP;
		aData.ZZ_TRV_CAT = entity.ZZ_TRV_CAT;
		aData.ZZ_DEP_TYPE = entity.ZZ_DEP_TYPE;
		aData.ZZ_DEP_SUB_TYPE = entity.ZZ_DEP_SUB_TYPE;
		aData.ZZ_STAT_FLAG = entity.ZZ_STAT_FLAG;
		aData.ZZ_DEP_PERNR = entity.ZZ_DEP_PERNR;
		aData.ZZ_VREASON = entity.ZZ_VREASON;
		aData.ZZ_VERSION = entity.ZZ_VERSION;
		aData.ZZ_TRV_REQ = entity.ZZ_TRV_REQ;
		aData.ZZ_FSTL = entity.ZZ_FSTL;
		aData.ZZ_GEBER = entity.ZZ_GEBER;
		aData.ZZ_COMMENTS = entity.ZZ_COMMENTS;
		aData.ZZ_TIMESTAMP = entity.ZZ_TIMESTAMP;
		aData.ZZ_VERSION = entity.ZZ_VERSION;
		aData.ZZ_VISA_PLAN = entity.ZZ_VISA_PLAN;
		aData.ZZ_ASG_TYP = entity.ZZ_ASG_TYP;
		aData.ZZ_TRV_CAT = entity.ZZ_TRV_CAT;
		/* Start-CGGS Changes */
		aData.cggsdata = this.getView().getModel("cggsmodel") ? this.getView().getModel("cggsmodel").getData() : undefined;
		aData.ZZ_PARENTNAME = entity.ZZ_PARENTNAME;
		aData.ZZ_SPOUSENAME = entity.ZZ_SPOUSENAME;
		aData.ZZ_DESIGNATION = entity.ZZ_DESIGNATION;
		/* End-CGGS Changes */
		/*Start-Change Famil Return Dates*/
		aData.changeType = entity.ZZ_VREASON;
		// UCD1KOR Added below line
		aData.ZZ_DEP_TYPE_TXT = entity.ZZ_DEP_TYPE_TXT;
		// 10 APR 2020 UCD1KOR Repatriation process fields added
		
		aData.ZZ_RADIO_ES = entity.ZZ_RADIO_ES;
		aData.ZZ_SDATE_E = entity.ZZ_SDATE_E;
		aData.ZZ_RADIO_MS = entity.ZZ_RADIO_MS;
		aData.ZZ_SDATE_M = entity.ZZ_SDATE_M;
		aData.ZZ_HRBP_REMRK = entity.ZZ_HRBP_REMRK;
		
		aData.ZZ_REP_RAAMT = entity.ZZ_REP_RAAMT;
		aData.ZZ_REP_RELALLWC = entity.ZZ_REP_RELALLWC;
		aData.ZZ_HRLPP_REMRKS = entity.ZZ_HRLPP_REMRKS;
		aData.ZZ_COMABBR =entity.ZZ_COMABBR
		
		
		/*End-Change Famil Return Dates*/

		//    if(aData.changeType == "DA" || aData.changeType == "DB" ||
		//       aData.changeType == "DE" || aData.changeType == "DF" ||
		//       aData.changeType == "DG"){//Incase if Change Date request is sent back 
		//      if (aData.ZZ_STAT_FLAG != "" && aData.ZZ_STAT_FLAG) {
		//        if (aData.ZZ_STAT_FLAG.substring(0, 2) != "AA" && aData.ZZ_STAT_FLAG.substring(2, 5) == "003") {
		//          aData.isChange = true;
		//        }
		//      }
		//    }

		sap.ui.getCore().getModel("global").setData(aData);
		var oData = sap.ui.getCore().getModel("global").getData();
		//TinhTD Temp for UAT 21/12/2018
		var sReqEncode = Base64.encode(entity.ZZ_DEP_REQ); //eslint-disable-line
		var nCurrReq = parseInt(entity.ZZ_DEP_REQ),
			oDataModel = this.getView().getModel(),
			oIsCheck = $.Deferred(),
			sPath = "/IsNewBusinessTravel";
		var nEmpId = oData.ZZ_DEP_PERNR;
		var sUrlParams = "ZZ_DEP_PERNR='" + nEmpId + "'" + "&ZZ_TRV_REQ='" + nCurrReq + "'";
		oData.isNewReq = "NO";
		oDataModel.read(sPath, {
			urlParameters: sUrlParams,
			success: function(oCData) {
				oData.isNewReq = oCData.IsNewBusinessTravel.ZZ_RETURN;
				oIsCheck.resolve();

			},
			error: function(err) {
				//console.clear(); //eslint-disable-line
				console.info("Error" + err); //eslint-disable-line
			}
		});
		$.when(oIsCheck).done(
			function() {

/*				
				if (aData.ZZ_REQ_TYP === "BUSR" && oData.isNewReq !== "NO") { //eslint-disable-line
					//new UX screen
					sap.ui.core.routing.Router.getRouter("MyRouter").navTo("TravelRequest", {
						"reqId": sReqEncode,"ischange":aData.isChange
					});
					sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oThis);
				} else {
*///commented by uml6kor BUSX 12/9/2019	
				//old logic and screen
				
				
					if (aData.ZZ_REQ_TYP == "VISA") { //sidd code start

						/*  var get = $.ajax({
        cache:false,
        url:sServiceUrl + "ZE2E_BVISA_HDRSet(ZZ_PERNR='00001087',ZZ_VERSION='1'," +
            "ZZ_VISA_REQ='"+oData.ZZ_DEP_REQ +"')?$expand=BVISA_HDR_TO_COST_ASGN",
        type: "GET"
      });
      get.done(function(result){
        var globalData = sap.ui.getCore().getModel("global");
        globalData.getData(result);
        sap.ui.getCore().setModel("globalData");
        sap.ui.core.routing.Router.getRouter("MyRouter").navTo("VisaRequest");
      });
      get.fail(function(error){
        sap.ui.project.e2etm.util.StaticUtility.setBusy(false,oHomeThis);
        sap.ca.ui.message.showMessageBox({
          type: sap.ca.ui.message.Type.ERROR,
          message: "Sorry for this inconvenience. Please contact support team",
          details: err.responseText
        });
      });*/
						var lv_url = sServiceUrl + "ZE2E_BVISA_HDRSet(ZZ_PERNR='" + aData.ZZ_DEP_PERNR + "',ZZ_VERSION='" + aData.ZZ_VERSION + "'," + //eslint-disable-line
							"ZZ_VISA_REQ='" + oData.ZZ_DEP_REQ + "')?$expand=BVISA_HDR_TO_COST_ASGN";
						/*var lv_url = sServiceUrl + "ZE2E_BVISA_HDRSet(ZZ_PERNR='"+aData.ZZ_DEP_PERNR+"',ZZ_VERSION='"+aData.ZZ_VERSION+"'," +
      "ZZ_VISA_REQ='"+oData.ZZ_DEP_REQ +"')?$expand=BVISA_HDR_TO_COST_ASGN";*/
						jQuery.ajax({
							url: lv_url,
							method: 'GET',
							dataType: 'json',
							success: function(data, statusText, xhr) {
								var globalData = sap.ui.getCore().getModel("global").getData();
								//    var empDetail = oHomeThis.getEmployeeDetails(data.d.ZZ_EMP_NTID);
								globalData.BVISA_HDR_TO_COST_ASGN = data.d.BVISA_HDR_TO_COST_ASGN;
								globalData.ZZ_OFF_NUM = data.d.ZZ_OFF_NUM;
								globalData.ZZ_PERNR = data.d.ZZ_PERNR;
								globalData.ZZ_VERSION = data.d.ZZ_VERSION;
								globalData.ZZ_VISA_EDATE = data.d.ZZ_VISA_EDATE;
								globalData.ZZ_VISA_NO = data.d.ZZ_VISA_NO;
								globalData.ZZ_VISA_PEDATE = data.d.ZZ_VISA_PEDATE;
								globalData.ZZ_VISA_PSDATE = data.d.ZZ_VISA_PSDATE;
								globalData.ZZ_VISA_REQ = data.d.ZZ_VISA_REQ;
								globalData.ZZ_VISA_SDATE = data.d.ZZ_VISA_SDATE;
								globalData.ZZ_VISA_TOCNTRY = data.d.ZZ_VISA_TOCNTRY;
								globalData.ZZ_VISA_TYP = data.d.ZZ_VISA_TYP;
								globalData.ZZ_MOBILE = data.d.ZZ_MOBILE;
								/* Next action added to identify close */
								globalData.ZZ_NACTION_BY = entity.ZZ_NEXT_APPROVER;
								/* Next action added to identify close */
								globalData.whichTab = entity.ZZ_TAB_FLAG;
								globalData.ZZ_DEP_NAME = entity.ZZ_DEP_NAME;
								globalData.ZZ_DEP_EMAIL = entity.ZZ_DEP_EMAIL;
								globalData.ZZ_DEP_DOB = entity.ZZ_DEP_DOB;
								globalData.ZZ_DEP_DEPT = entity.ZZ_DEP_DEPT;

								sap.ui.getCore().getModel("global").setData(globalData);
								sap.ui.core.routing.Router.getRouter("MyRouter").navTo("VisaRequest");
							},

							error: function(version_data) {
								sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis); //eslint-disable-line
								sap.ca.ui.message.showMessageBox({
									type: sap.ca.ui.message.Type.ERROR,
									message: "Sorry for this inconvenience. Please contact support team",
									details: version_data.responseText
								});
								sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oThis);
							}
						});
					} else if (aData.ZZ_REQ_TYP == "TRST") {
						//  aData.ZZ_REQ_TYP = "DEPU";// UCD1KOR 5 May 2020
						var globalData = sap.ui.getCore().getModel("global").getData();
						if(globalData.ZZ_DEP_TYPE =="DOME" && globalData.ZZ_DEP_TOCNTRY =="IN"){
							sap.ui.project.e2etm.util.StaticUtility.setBusy(true, oHomeThis);
						var AccomDigitized = sServiceUrl + "AccomDigitizedBooking?&EmpNo='" +globalData.ZZ_DEP_PERNR +"'&TpNo='"+globalData.ZZ_TRV_REQ+"'&$format=json";
						var get = $.ajax({
										cache: false,
										url: AccomDigitized, 
										type: "GET",
										async: true
									});
									get.done(function(result) {
										globalData.DigiFlag  =result.d.AccomDigitizedBooking.DigiFlag;
										sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
									});
									get.fail(function(result) {
										sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
									});
						}else{
							globalData.DigiFlag = "";
						}
						sap.ui.getCore().getModel("global").setData(aData);
						sap.ui.core.routing.Router.getRouter("MyRouter").navTo("trsettle");
					} else if (aData.ZZ_REQ_TYP == "PYVR") {
						//  aData.ZZ_REQ_TYP = "DEPU";
						sap.ui.getCore().getModel("global").setData(aData);
						sap.ui.core.routing.Router.getRouter("MyRouter").navTo("paymentvoucher");
					} else if (aData.ZZ_REQ_TYP == "INRA") {
						//  aData.ZZ_REQ_TYP = "DEPU";
						sap.ui.getCore().getModel("global").setData(aData);
						sap.ui.core.routing.Router.getRouter("MyRouter").navTo("inradvance");
					} else if (aData.ZZ_REQ_TYP == "CARD") {
						//  aData.ZZ_REQ_TYP = "DEPU";

						sap.ui.getCore().getModel("global").setData(aData);
						sap.ui.core.routing.Router.getRouter("MyRouter").navTo("card");
					} else //sidd code end
					if (aData.ZZ_REQ_TYP == "SECO" &&
						sap.ui.getCore().getModel("global").getData().isChange) { //Check date for secondary trip
						sap.ui.project.e2etm.util.StaticUtility.setBusy(true, oHomeThis);
						var get = $.ajax({
							cache: false,
							url: sServiceUrl + "TRV_HDRSet(ZZ_PERNR='" + aData.ZZ_DEP_PERNR + "',ZZ_DEP_REQ='" + aData.ZZ_TRV_REQ +
								"',ZZ_VERSION='',ZZ_TRV_TYP='DEPU')" + "?&$format=json",
							type: "GET"
						});
						get.done(function(result) {
							var globalData = sap.ui.getCore().getModel("global").getData();
							globalData.ZZ_DEP_STDATE = result.d.ZZ_DATV1;
							globalData.ZZ_DEP_ENDATE = result.d.ZZ_DATB1;

							sap.ui.getCore().getModel("global").setData(globalData);
							sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
							sap.ui.core.routing.Router.getRouter("MyRouter").navTo("deputation", {
								"depId": Base64.encode(entity.ZZ_DEP_REQ)
							});
						});
						get.fail(function(err) {
							sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
							sap.ca.ui.message.showMessageBox({
								type: sap.ca.ui.message.Type.ERROR,
								message: "Sorry for this inconvenience. Please contact support team",
								details: err.responseText
							});
						});
					}  //########## 08 Apr 2020 UCD1KOR ##########/////
					else if(aData.ZZ_REQ_TYP == "REPS"){
					//// ### 13 Apr 2020 UCD1KOR 
						sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
						sap.ui.core.routing.Router.getRouter("MyRouter").navTo("Repatriation", {
							"TpNo": Base64.encode(entity.ZZ_TRV_REQ),
							"EmpNo":Base64.encode(entity.ZZ_DEP_PERNR)
						});
					}  //########## 7/1/2021 Uml6kor ##########/////
					else if(aData.ZZ_REQ_TYP == "CARR" || aData.ZZ_REQ_TYP == "CARO"){
						//// ### 13 Apr 2020 UCD1KOR 
							sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
							var globalData = sap.ui.getCore().getModel("global").getData();
							if(aData.ZZ_REQ_TYP == "CARO"){
								globalData.ZZ_CAR_TYP = "V"; //o
								}
							else if(aData.ZZ_REQ_TYP == "CARR"){
								globalData.ZZ_CAR_TYP = "S"; //s
							}
							globalData.action = "02"; 
							globalData.ZZ_DEP_TYPE_TXT= aData.ZZ_DEP_TYPE_TXT;
							globalData.ZZ_ASG_TYP= aData.ZZ_ASG_TYP;
							sap.ui.getCore().getModel("global").setData(globalData);
							sap.ui.core.routing.Router.getRouter("MyRouter").navTo("cargo");
						}
					
					else { //Not secondary trip
						sap.ui.core.routing.Router.getRouter("MyRouter").navTo("deputation", {
							"depId": Base64.encode(entity.ZZ_DEP_REQ)
						});
					}
					//end old screen
//				} //end temp         //uml6kor commented 12/9/2019          
			});

	},

	// This method is used to display REQUEST DETAILS PANEL on HOME PAGE
	setSelectedMyTask: function(selectedDep, reqTyp) {
		var myRole = sap.ui.getCore().getModel("profile").getData().currentRole;
		var allData = null;
		var model = new sap.ui.model.json.JSONModel();
		var flag = false;
		if (myRole == "EMP" || myRole == null) {
			var flexboxEmployeeMyTaskDetail = sap.ui.getCore().byId("flexboxEmployeeMyTaskDetail");
			flexboxEmployeeMyTaskDetail.setVisible(false);
			allData = sap.ui.getCore().byId("tableEmployeeMyTasks").getModel().getData();

			if (allData != null) {
				for (var i = 0; i < allData.length; i++) {
					if (allData[i].ZZ_DEP_REQ == selectedDep && allData[i].ZZ_REQ_TYP == reqTyp) {
						// Set etag
						eTagHome = allData[i].__metadata.etag;
						if (eTagHome == "W/\"''\"" || eTagHome == "W/\"'0.0000000%20'\"") {
							eTagHome = "*";
						}

						model.setData(allData[i]);
						flexboxEmployeeMyTaskDetail.setModel(model, "myEmployeeSelectedTaskModel");

						flag = true;

						if (reqTyp == "VISA") {
							sap.ui.getCore().byId("labelFromLocation").setVisible(false);
							sap.ui.getCore().byId("labeltoLocation").setVisible(false);
						} else {
							sap.ui.getCore().byId("labelFromLocation").setVisible(true);
							sap.ui.getCore().byId("labeltoLocation").setVisible(true);
						}
						break;
					}
				}
			}
			if (flag) {
				//// 13 APR 2020 UCD1KOR added below if conditions 
				if(reqTyp =="REPS"){
					this.RepatriationLinkEnable(model.getData());
				}
				else{
					this.generateDashboardAction(model.getData());
				}
				//this.generateDashboardAction(model.getData()); 13 APR 2020 UCD1KOR  commented

				// Set contract letter if any
				flexboxEmployeeMyTaskDetail.setVisible(true);
				sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
				sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oThis); //added by uml6kor 6/9/2019 
				oHomeThis.contractletterDeferred = $.Deferred();
			} else {
				sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
			}
		} else if (myRole == "GRM") {
			oHomeThis.missingInfoType = null;
			var flexboxManagerMyTaskDetail = sap.ui.getCore().byId("flexboxManagerMyTaskDetail");
			var selectedData = {};
			allData = sap.ui.getCore().byId("tableManagerMyTasks").getModel().getData();
			if(reqTyp == "REPS"){
				sap.ui.getCore().byId("idFlexBoxVisible").setVisible(false);
			}
			else{
				sap.ui.getCore().byId("idFlexBoxVisible").setVisible(true);
			}
			if (allData != null) {
				for (var i = 0; i < allData.length; i++) {
					if (allData[i].ZZ_DEP_REQ == selectedDep && allData[i].ZZ_REQ_TYP == reqTyp) {
						sap.ui.getCore().byId("managerServiceConditionCheck").setVisible(false);
						sap.ui.getCore().byId("managerServiceConditionCheck").setChecked(false);
						sap.ui.getCore().byId("managerServiceConditionCheck").setEnabled(false);
						// Set etag
						eTagHome = allData[i].__metadata.etag;
						if (eTagHome == "W/\"''\"" || eTagHome == "W/\"'0.0000000%20'\"") {
							eTagHome = "*";
						}

						selectedData = jQuery.extend({}, allData[i]);

						// Set value of dropdownlist
						//            if (selectedData.ZZ_STAT_FLAG == "AA003" &&
						//            selectedData.ZZ_DEP_TYPE == "INTL" &&
						//            selectedData.ZZ_REQ_TYP == "DEPU") {
						//            selectedData.ZZ_SP_CMPNY = "NA";
						//            }else{
						selectedData.ZZ_SP_CMPNY = allData[i].ZZ_SP_CMPNY;
						//            }

						if (allData[i].ZZ_DEP_SUB_TYPE == "" || allData[i].ZZ_DEP_SUB_TYPE == "*") {
							selectedData.ZZ_DEP_SUB_TYPE = "";
						} else {
							selectedData.ZZ_DEP_SUB_TYPE = allData[i].ZZ_DEP_SUB_TYPE;
						}
						if (allData[i].ZZ_ASG_TYP == "") {
							selectedData.ZZ_ASG_TYP = "";
						} else {
							selectedData.ZZ_ASG_TYP = allData[i].ZZ_ASG_TYP;
						}
						if (allData[i].ZZ_TRV_PUR == "" || allData[i].ZZ_TRV_PUR == "PROJ") {
							selectedData.ZZ_TRV_PUR = "PROJ";
						} else {
							selectedData.ZZ_TRV_PUR = allData[i].ZZ_TRV_PUR;
						}
						if (allData[i].ZZ_SERV_TYP == "" || allData[i].ZZ_SERV_TYP == "NORM") {
							selectedData.ZZ_SERV_TYP = "NORM";
						} else {
							selectedData.ZZ_SERV_TYP = allData[i].ZZ_SERV_TYP;
						}
						//            if (allData[i].ZZ_SRVTYP_MONTHS == "") {
						if (allData[i].ZZ_DEP_DAYS <= 90) {
							selectedData.ZZ_SRVTYP_MONTHS = "3";
							sap.ui.getCore().byId("cbServiceCon1").setEnabled(false);
						} else {
							selectedData.ZZ_SRVTYP_MONTHS = "6";
							sap.ui.getCore().byId("cbServiceCon1").setEnabled(true);
						}
						//            } else {
						//              selectedData.ZZ_SRVTYP_MONTHS = allData[i].ZZ_SRVTYP_MONTHS;
						//            }

						//Begin of change family details
						if (allData[i].ZZ_DEP_TOCNTRY_TXT == "Germany" || allData[i].ZZ_ASG_TYP == "NC") {
							sap.ui.getCore().byId("cbSponsorByCompany").setEnabled(false);
						} else {
							sap.ui.getCore().byId("cbSponsorByCompany").setEnabled(false);//true);
						}

						if (allData[i].ZZ_ASG_TYP == "NC") {
							selectedData.ZZ_SRVTYP_MONTHS = "6";
							sap.ui.getCore().byId("cbServiceCon1").setEnabled(false);
							sap.ui.getCore().byId("txtDurationService").setEditable(false);
							sap.ui.getCore().byId("cbServiceCon1").setEnabled(false);
							sap.ui.getCore().byId("cbServiceCon1").setSelectedKey("NORM");
							sap.ui.getCore().byId("cbSponsorByCompany").setEnabled(false);

						}
						//End of change family details

						// Populate dropdownlist in manager my task detail
						selectedData.serviceType = sap.ui.getCore().getModel("global").getData().serviceType;
						selectedData.purpose = sap.ui.getCore().getModel("global").getData().purpose;

						/*Start-Third Party Customer Details*/
						selectedData.ZZ_3PARTY_CUST = allData[i].ZZ_3PARTY_CUST;
						/*End-Third Party Customer Details*/

						var subTypeList = [];
						// Domestic transfer, remove the global customer
						if (selectedData.ZZ_TRV_CAT == "TRFR" && selectedData.ZZ_DEP_TYPE == "DOME") {
							for (var i = 0; i < sap.ui.getCore().getModel("global").getData().subtype.length; i++) {
								if (sap.ui.getCore().getModel("global").getData().subtype[i].ZZ_DEP_SUB_TYPE != "GLOB") {
									subTypeList.push(sap.ui.getCore().getModel("global").getData().subtype[i]);
								}
							}
						} else if (selectedData.ZZ_TRV_CAT == "TRFR" && selectedData.ZZ_DEP_TYPE == "INTL") {
							for (var i = 0; i < sap.ui.getCore().getModel("global").getData().subtype.length; i++) {
								if (sap.ui.getCore().getModel("global").getData().subtype[i].ZZ_DEP_SUB_TYPE != "INRB") {
									subTypeList.push(sap.ui.getCore().getModel("global").getData().subtype[i]);
								}
							}
						} else {
							subTypeList = sap.ui.getCore().getModel("global").getData().subtype;
						}

						selectedData.subtype = subTypeList;

						flag = true;
						break;
					}
					
					
				}
			}
			/*Start-Third Party Customer Changes*/
			this.visibleThirdPartyCustomerBox(selectedData);
			/*End-Third Party Customer Changes*/
			sap.ui.project.e2etm.util.StaticUtility.fetchCGGSChecklistForms(selectedData, sap.ui.getCore().byId(
				"grmCggsChecklist--cggsFormsDisplay"));

			//Check whether DEPU has travel plan or not
			if (flag && (selectedData.ZZ_TRV_REQ == "" || selectedData.ZZ_TRV_REQ == "0000000000")) {
				//uml6kor_upgrade added if -vreason to exclude family for infotype41 condition 10/12/2019
				if (selectedData.ZZ_VREASON != "DH" && selectedData.ZZ_VREASON != "DG" && selectedData.ZZ_VREASON != "DE" && selectedData.ZZ_VREASON != "DF") {
					
				if (selectedData.ZZ_DEP_TOCNTRY == "DE") {
					// fetch assignment model based on deputation type
					var sCheckCooling = sServiceUrl + "Check_cooling_ROW?ZZ_DEP_REQ='" + selectedData.ZZ_DEP_REQ +
						"'&ZZ_PERNR='" + selectedData.ZZ_DEP_PERNR +
						"'&ZZ_DEP_TOCNTR='" + selectedData.ZZ_DEP_TOCNTRY +
						"'&ZZ_DEP_SDATE='" + selectedData.ZZ_DEP_STDATE +
						"'&ZZ_VISA_AEXIST='" + selectedData.ZZ_VISA_AEXIST +
						"'&ZZ_DEP_DAYS='" + selectedData.ZZ_DEP_DAYS + //added by uml6kor 16/1/2020 stx cooling off
						"'&ZZ_TRV_CAT='" + selectedData.ZZ_TRV_CAT +  //added by uml6kor 16/1/2020 stx cooling off
						"'&$format=json";
					var get = $.ajax({
						cache: false,
						url: sCheckCooling,
						type: "GET"
					});
					get.done(function(result) {
						var globalData = sap.ui.getCore().getModel("global").getData();
						globalData.CoolingPeriodCheck = result.d.Check_cooling_ROW;
						sap.ui.getCore().getModel("global").setData(globalData);
						oHomeThis.coolingPeriodDeferred.resolve();
					});
					get.fail(function(err) {
						oHomeThis.missingInfoType = true;
						var dialog = new sap.m.Dialog({
							title: 'Warning',
							type: 'Message',
							content: new sap.m.Text({
								text: "This request owner doesn't have Info type 41. Please contact technical team"
							}),
							endButton: new sap.m.Button({
								text: 'OK',
								press: function() {
									oHomeThis.coolingPeriodDeferred.resolve();
									dialog.close();
								}
							}),
							afterClose: function() {
								dialog.destroy();
							}
						});
						dialog.open();
					});
				} else {	
					var sCheckCooling = sServiceUrl + "Check_cooling_ROW?ZZ_DEP_REQ='" + selectedData.ZZ_DEP_REQ +
					"'&ZZ_PERNR='" + selectedData.ZZ_DEP_PERNR +
					"'&ZZ_DEP_TOCNTR='" + selectedData.ZZ_DEP_TOCNTRY +
					"'&ZZ_DEP_SDATE='" + selectedData.ZZ_DEP_STDATE +
					"'&ZZ_VISA_AEXIST='" + selectedData.ZZ_VISA_AEXIST +
					"'&ZZ_DEP_DAYS='" + selectedData.ZZ_DEP_DAYS + //added by uml6kor 16/1/2020 stx cooling off
					"'&ZZ_TRV_CAT='" + selectedData.ZZ_TRV_CAT +  //added by uml6kor 16/1/2020 stx cooling off
					"'&$format=json";
					var get = $.ajax({
						cache: false,
						url: sCheckCooling,
						type: "GET"
					});
					get.done(function(result) {
						var globalData = sap.ui.getCore().getModel("global").getData();
						globalData.CoolingPeriodCheck = result.d.Check_cooling_ROW;
						sap.ui.getCore().getModel("global").setData(globalData);
						oHomeThis.coolingPeriodDeferred.resolve();
					});					
				}
			}else{
					oHomeThis.coolingPeriodDeferred.resolve();
				}
				//uml6kor_upgrade added if-else condition for family dependents 10/12/2019
				// fetch assignment model based on deputation type
				var get = $.ajax({
					cache: false,
					url: sServiceUrl + "AssignmentSet?$filter=ZZ_SMODID eq '" + selectedData.ZZ_DEP_TYPE + "' and ZZ_DEP_REQ eq '" +
						selectedData.ZZ_DEP_REQ + "'&$format=json",
					type: "GET"
				});
				get.done(function(result) {
					if (result != null) {
						var asgModelList = [];
						if (selectedData.ZZ_TRV_CAT == "TRFR" && selectedData.ZZ_DEP_TYPE == "DOME") {
							for (var i = 0; i < result.d.results.length; i++) {
								if (result.d.results[i].ZZ_ASG_TYP == "TRFR" ||
									result.d.results[i].ZZ_ASG_TYP == "") {
									asgModelList.push(result.d.results[i]);
									continue;
								}
							}
						} else {
							for (var i = 0; i < result.d.results.length; i++) {
								if (result.d.results[i].ZZ_ASG_TYP != "TRFR" ||
									result.d.results[i].ZZ_ASG_TYP == "") {
									asgModelList.push(result.d.results[i]);
									continue;
								}
							}
						}

						oHomeThis.setEliSponsorship(selectedData);

						selectedData.assmodel = asgModelList;
//						//start uea6kor changes for to travel 28/6/2019
//						for(var i= 0; i < selectedData.subtype.length; i++ )
//						{
//							 if(selectedData.ZZ_DEP_SUB_TYPE == selectedData.subtype[i].ZZ_DEP_SUB_TYPE)
//								 	{
//								 		selectedData.ZZ_SUB_DESC = selectedData.subtype[i].ZZ_SUB_DEP_DESC;
//								 	}
//						} 
//						//end uea6kor changes for to travel 28/6/2019
						model.setData(selectedData);
						// Set visibility of sponsorship notification
						if (selectedData.ZZ_FAMILY_ACCOMP == "X" && selectedData.ZZ_REQ_TYP == "DEPU" && selectedData.ZZ_DEP_TYPE == "INTL" &&
							selectedData.ZZ_SP_CMPNY == "X" &&
							parseInt(selectedData.ZZ_DEP_DAYS) < parseInt(sap.ui.getCore().getModel("global").getData().sponsorPeriod)) {
							sap.ui.getCore().byId("flexBoxSponsorshipNotification").setVisible(true);
						} else {
							sap.ui.getCore().byId("flexBoxSponsorshipNotification").setVisible(false);
						}

						if (selectedData.ZZ_DEP_TYPE == "INTL") {
							sap.ui.getCore().byId("flexBoxServiceMonths").setVisible(true);
							if (selectedData.ZZ_SERV_TYP == "" || selectedData.ZZ_SERV_TYP == "NORM") {
								sap.ui.getCore().byId("txtDurationService").setEnabled(false);
								sap.ui.getCore().byId("managerServiceConditionCheck").setVisible(false);
							} else {
								sap.ui.getCore().byId("txtDurationService").setEnabled(true);
								sap.ui.getCore().byId("managerServiceConditionCheck").setVisible(true);
								sap.ui.getCore().byId("managerServiceConditionCheck").setEnabled(true);
							}
							sap.ui.getCore().byId("flexBoxServiceCondition").setVisible(true);
						} else {
							sap.ui.getCore().byId("managerServiceConditionCheck").setVisible(false);
							sap.ui.getCore().byId("flexBoxServiceMonths").setVisible(false);
							sap.ui.getCore().byId("flexBoxServiceCondition").setVisible(false);
						}
						flexboxManagerMyTaskDetail.setModel(model, "myManagerSelectedTaskModel");
						flexboxManagerMyTaskDetail.setVisible(true);
					}
					oHomeThis.assigmentDeferred.resolve();
				});
				$.when(oHomeThis.assigmentDeferred, oHomeThis.coolingPeriodDeferred).done(function() {
					sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
					oHomeThis.assigmentDeferred = $.Deferred();
					oHomeThis.coolingPeriodDeferred = $.Deferred();
				});
			} else {
				//start uea6kor changes for to travel 28/6/2019
//				for(var i = 0; i < selectedData.subtype.length; i++ )
//				{
//					 if(selectedData.ZZ_DEP_SUB_TYPE == selectedData.subtype[i].ZZ_DEP_SUB_TYPE)
//						 	{
//						 		selectedData.ZZ_SUB_DESC = selectedData.subtype[i].ZZ_SUB_DEP_DESC;
//						 	}
//				} 
//				//end uea6kor changes for to travel 28/6/2019

				selectedData.ZZ_DEP_SUB_TYPE1 = selectedData.ZZ_DEP_SUB_TYPE; //added code for reimbursement 3/12/2019 uml6kor_upgrade
				model.setData(selectedData);
				flexboxManagerMyTaskDetail.setModel(model, "myManagerSelectedTaskModel");
				flexboxManagerMyTaskDetail.setVisible(true);
				sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
				oHomeThis.assigmentDeferred = $.Deferred();
			}
			//uea6kor-uml6kor 27/8/2020 added RBEIITAPPPIPELINE-217  for Extension date
			if ( selectedData.ZZ_VREASON == "DB" && selectedData.ZZ_VREASON_EX == "EX"){
				sap.ui.getCore().getModel("global").getData().extDoc = true;
				sap.ui.getCore().byId("extdoclistgrm--panelExtensionDocs").setVisible(true);
				sap.ui.project.e2etm.util.StaticUtility.fetchExtCheckListForms(selectedData, sap.ui.getCore().byId("extdoclistgrm--ExtViewRepeatId"));
			
			sap.ui.getCore().byId("extdoclistgrm--ExtSelectBtn").setVisible(false);
			sap.ui.getCore().byId("extdoclistgrm--btnExtFormsUploader").setVisible(true);
			
			sap.ui.getCore().byId("extdoclistgrm--ConfirmExtUpload").setVisible(false);
			sap.ui.getCore().byId("extdoclistgrm--idListEXT_DocFlexBox").setVisible(false);
			}else
				{
				sap.ui.getCore().byId("extdoclistgrm--panelExtensionDocs").setVisible(false);
				sap.ui.getCore().getModel("global").getData().extDoc = false;
				
				}
			
			//uea6kor-uml6kor 27/8/2020 added RBEIITAPPPIPELINE-217  for Extension date
			/* Start-CGGS Changes */
			var cggsData = {
				Pernr: selectedData.ZZ_DEP_PERNR,
				Depreq: selectedData.ZZ_DEP_REQ,
				Version: selectedData.ZZ_VERSION,
				Vreason: selectedData.ZZ_VREASON,
				Frmcntry: selectedData.ZZ_DEP_FRCNTRY,
				Tocntry: selectedData.ZZ_DEP_TOCNTRY,
				Frmloc: selectedData.ZZ_DEP_FRMLOC,
				Toloc: selectedData.ZZ_DEP_TOLOC,
				Deptype: selectedData.ZZ_REQ_TYP,
				Depsubtype: selectedData.ZZ_DEP_TYPE,
				Asgtyp: selectedData.ZZ_ASG_TYP,
				Vreason_ex: selectedData.ZZ_VREASON_EX //uea6kor-uml6kor 27/8/2020 added RBEIITAPPPIPELINE-217  for Extension date 
				
			};
			var cggsModel = new sap.ui.model.json.JSONModel();
			cggsModel.setData(cggsData);
			this.getView().setModel(cggsModel, "cggsmodel");
			var cggsFlag = sap.ui.project.e2etm.util.StaticUtility.visibleCggsData(selectedData.ZZ_TRV_REQ, selectedData.ZZ_DEP_TOCNTRY,
				selectedData.ZZ_ASG_TYP, selectedData.ZZ_REQ_TYP, selectedData.ZZ_TRV_CAT, selectedData.ZZ_VREASON, selectedData.ZZ_VREASON_EX);//uea6kor-uml6kor 27/8/2020 added RBEIITAPPPIPELINE-217  for Extension date 
			sap.ui.getCore().byId("cggsFlxBox").setVisible(cggsFlag);
			if (cggsFlag) {
				sap.ui.project.e2etm.util.StaticUtility.getCggsData(selectedData.ZZ_DEP_PERNR, selectedData.ZZ_DEP_REQ, selectedData.ZZ_VERSION,
					this);
			}
			//End of changes familly details

		} else if (myRole == "ECO") {
			var flexboxECOMyTaskDetail = sap.ui.getCore().byId("flexboxECOMyTaskDetail");
			flexboxECOMyTaskDetail.setVisible(false);
			var selectedData = {};
			allData = sap.ui.getCore().byId("tableECOMyTasks").getModel().getData();

			if (allData != null) {
				for (var i = 0; i < allData.length; i++) {
					if (allData[i].ZZ_DEP_REQ == selectedDep && allData[i].ZZ_REQ_TYP == reqTyp) {
						// Set etag
						eTagHome = allData[i].__metadata.etag;
						if (eTagHome == "W/\"''\"" || eTagHome == "W/\"'0.0000000%20'\"") {
							eTagHome = "*";
						}

						selectedData = jQuery.extend({}, allData[i]);
						if (allData[i].ZZ_DEP_SUB_TYPE == "") {
							selectedData.ZZ_DEP_SUB_TYPE = "";
						} else {
							selectedData.ZZ_DEP_SUB_TYPE = allData[i].ZZ_DEP_SUB_TYPE;
						}

						if (allData[i].ZZ_ASG_TYP == "") {
							selectedData.ZZ_ASG_TYP = "";
						} else {
							selectedData.ZZ_ASG_TYP = allData[i].ZZ_ASG_TYP;
						}

						if (allData[i].ZZ_TRV_PUR == "" || allData[i].ZZ_TRV_PUR == "PROJ") {
							selectedData.ZZ_TRV_PUR = "PROJ";
						} else {
							selectedData.ZZ_TRV_PUR = allData[i].ZZ_TRV_PUR;
						}

						if (allData[i].ZZ_SERV_TYP == "" || allData[i].ZZ_SERV_TYP == "NORM") {
							selectedData.ZZ_SERV_TYP = "NORM";
						} else {
							selectedData.ZZ_SERV_TYP = allData[i].ZZ_SERV_TYP;
						}

						// Populate dropdownlist in manager my task detail
						selectedData.serviceType = sap.ui.getCore().getModel("global").getData().serviceType;
						selectedData.purpose = sap.ui.getCore().getModel("global").getData().purpose;
						selectedData.subtype = sap.ui.getCore().getModel("global").getData().subtype;

						flag = true;
						break;
					}
				}
			}

			if (flag && (selectedData.ZZ_TRV_REQ == "" || selectedData.ZZ_TRV_REQ == "0000000000")) {
				// fetch assignment model based on deputation type
				var get = $.ajax({
					cache: false,
					url: sServiceUrl + "AssignmentSet?$filter=ZZ_SMODID eq '" + selectedData.ZZ_DEP_TYPE + "' and ZZ_DEP_REQ eq '" +
						selectedData.ZZ_DEP_REQ + "'&$format=json",
					type: "GET"
				});
				get.done(function(result) {
					if (result != null) {
						selectedData.assmodel = result.d.results;
						model.setData(selectedData);
						flexboxECOMyTaskDetail.setModel(model, "myECOSelectedTaskModel");
						flexboxECOMyTaskDetail.setVisible(true);
					}
					oHomeThis.assigmentDeferred.resolve();
				});
				$.when(oHomeThis.assigmentDeferred).done(function() {
					sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
					oHomeThis.assigmentDeferred = $.Deferred();
				});
			} else {
				model.setData(selectedData);
				flexboxECOMyTaskDetail.setModel(model, "myECOSelectedTaskModel");
				flexboxECOMyTaskDetail.setVisible(true);
				sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
				oHomeThis.assigmentDeferred.resolve();
			}
		} else if (myRole == "TAX") {
			var flexboxTAXMyTaskDetail = sap.ui.getCore().byId("flexboxTAXMyTaskDetail");
			flexboxTAXMyTaskDetail.setVisible(false);
			var selectedData = {};
			allData = sap.ui.getCore().byId("tableTAXMyTasks").getModel().getData();

			if (allData != null) {
				for (var i = 0; i < allData.length; i++) {
					if (allData[i].ZZ_DEP_REQ == selectedDep && allData[i].ZZ_REQ_TYP == reqTyp) {
						// Set etag
						eTagHome = allData[i].__metadata.etag;
						if (eTagHome == "W/\"''\"" || eTagHome == "W/\"'0.0000000%20'\"") {
							eTagHome = "*";
						}

						selectedData = jQuery.extend({}, allData[i]);
						if (allData[i].ZZ_DEP_SUB_TYPE == "") {
							selectedData.ZZ_DEP_SUB_TYPE = "";
						} else {
							selectedData.ZZ_DEP_SUB_TYPE = allData[i].ZZ_DEP_SUB_TYPE;
						}

						if (allData[i].ZZ_ASG_TYP == "") {
							selectedData.ZZ_ASG_TYP = "";
						} else {
							selectedData.ZZ_ASG_TYP = allData[i].ZZ_ASG_TYP;
						}

						if (allData[i].ZZ_TRV_PUR == "" || allData[i].ZZ_TRV_PUR == "PROJ") {
							selectedData.ZZ_TRV_PUR = "PROJ";
						} else {
							selectedData.ZZ_TRV_PUR = allData[i].ZZ_TRV_PUR;
						}

						if (allData[i].ZZ_SERV_TYP == "" || allData[i].ZZ_SERV_TYP == "NORM") {
							selectedData.ZZ_SERV_TYP = "NORM";
						} else {
							selectedData.ZZ_SERV_TYP = allData[i].ZZ_SERV_TYP;
						}
						// Populate dropdownlist in manager my task detail
						selectedData.serviceType = sap.ui.getCore().getModel("global").getData().serviceType;
						selectedData.purpose = sap.ui.getCore().getModel("global").getData().purpose;
						selectedData.subtype = sap.ui.getCore().getModel("global").getData().subtype;

						flag = true;
						break;
					}
				}
			}

			if (flag && (selectedData.ZZ_TRV_REQ == "" || selectedData.ZZ_TRV_REQ == "0000000000")) {
				// fetch assignment model based on deputation type
				var get = $.ajax({
					cache: false,
					url: sServiceUrl + "AssignmentSet?$filter=ZZ_SMODID eq '" + selectedData.ZZ_DEP_TYPE + "' and ZZ_DEP_REQ eq '" +
						selectedData.ZZ_DEP_REQ + "'&$format=json",
					type: "GET"
				});
				get.done(function(result) {
					if (result != null) {
						selectedData.assmodel = result.d.results;
						model.setData(selectedData);
						flexboxTAXMyTaskDetail.setModel(model, "myTAXSelectedTaskModel");
						flexboxTAXMyTaskDetail.setVisible(true);
					}
					oHomeThis.assigmentDeferred.resolve();
				});
				$.when(oHomeThis.assigmentDeferred).done(function() {
					sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
					oHomeThis.assigmentDeferred = $.Deferred();
				});
			} else {
				model.setData(selectedData);
				flexboxTAXMyTaskDetail.setModel(model, "myTAXSelectedTaskModel");
				flexboxTAXMyTaskDetail.setVisible(true);
				sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
				oHomeThis.assigmentDeferred.resolve();
			}
		} else if (myRole == "CTG") {
			var flexboxCTGMyTaskDetail = sap.ui.getCore().byId("flexboxCTGMyTaskDetail");
			flexboxCTGMyTaskDetail.setVisible(false);
			var selectedData = {};
			allData = sap.ui.getCore().byId("tableCTGMyTasks").getModel().getData();

			if (allData != null) {
				for (var i = 0; i < allData.length; i++) {
					if (allData[i].ZZ_DEP_REQ == selectedDep && allData[i].ZZ_REQ_TYP == reqTyp) {
						// Set etag
						eTagHome = allData[i].__metadata.etag;
						if (eTagHome == "W/\"''\"" || eTagHome == "W/\"'0.0000000%20'\"") {
							eTagHome = "*";
						}

						selectedData = jQuery.extend({}, allData[i]);
						if (allData[i].ZZ_DEP_SUB_TYPE == "") {
							selectedData.ZZ_DEP_SUB_TYPE = "";
						} else {
							selectedData.ZZ_DEP_SUB_TYPE = allData[i].ZZ_DEP_SUB_TYPE;
						}

						if (allData[i].ZZ_ASG_TYP == "") {
							selectedData.ZZ_ASG_TYP = "";
						} else {
							selectedData.ZZ_ASG_TYP = allData[i].ZZ_ASG_TYP;
						}

						if (allData[i].ZZ_TRV_PUR == "" || allData[i].ZZ_TRV_PUR == "PROJ") {
							selectedData.ZZ_TRV_PUR = "PROJ";
						} else {
							selectedData.ZZ_TRV_PUR = allData[i].ZZ_TRV_PUR;
						}

						if (allData[i].ZZ_SERV_TYP == "" || allData[i].ZZ_SERV_TYP == "NORM") {
							selectedData.ZZ_SERV_TYP = "NORM";
						} else {
							selectedData.ZZ_SERV_TYP = allData[i].ZZ_SERV_TYP;
						}
						// Populate dropdownlist in manager my task detail
						selectedData.serviceType = sap.ui.getCore().getModel("global").getData().serviceType;
						selectedData.purpose = sap.ui.getCore().getModel("global").getData().purpose;
						selectedData.subtype = sap.ui.getCore().getModel("global").getData().subtype;

						flag = true;
						break;
					}
				}
			}

			if (flag && (selectedData.ZZ_TRV_REQ == "" || selectedData.ZZ_TRV_REQ == "0000000000")) {
				// fetch assignment model based on deputation type
				var get = $.ajax({
					cache: false,
					url: sServiceUrl + "AssignmentSet?$filter=ZZ_SMODID eq '" + selectedData.ZZ_DEP_TYPE + "' and ZZ_DEP_REQ eq '" +
						selectedData.ZZ_DEP_REQ + "'&$format=json",
					type: "GET"
				});
				get.done(function(result) {
					if (result != null) {
						selectedData.assmodel = result.d.results;
						model.setData(selectedData);
						flexboxCTGMyTaskDetail.setModel(model, "myCTGSelectedTaskModel");
						flexboxCTGMyTaskDetail.setVisible(true);
					}
					oHomeThis.assigmentDeferred.resolve();
				});
				$.when(oHomeThis.assigmentDeferred).done(function() {
					sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
					oHomeThis.assigmentDeferred = $.Deferred();
				});
			} else {
				model.setData(selectedData);
				flexboxCTGMyTaskDetail.setModel(model, "myCTGSelectedTaskModel");
				flexboxCTGMyTaskDetail.setVisible(true);
				sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
				oHomeThis.assigmentDeferred.resolve();
			}
		}
	},

	setEliSponsorship: function(aData) {
		sap.ui.getCore().byId("cbSponsorByCompany").setEnabled(false);//(true);
		if (aData.ZZ_DEP_TOCNTRY == "KR" && aData.ZZ_TRV_CAT == "WRKP") {
			sap.ui.getCore().byId("cbSponsorByCompany").setEnabled(false);
			if (aData.ZZ_DEP_DAYS >= 360) {
				aData.ZZ_SP_CMPNY = "X";
			} else {
				aData.ZZ_SP_CMPNY = "";

			}
		}
		if (aData.ZZ_ASG_TYP == "STVA") {
			sap.ui.getCore().byId("cbSponsorByCompany").setEnabled(false);
		}
	},
	//uea6kor-uml6kor start of code-added RBEIITAPPPIPELINE-217
	onExtFileSelectPress : function(curEvt) {
		var ext="ExtFile";
		var currentViewId = curEvt.getSource().getParent().sId.split("--")[0];
			sap.ui.project.e2etm.util.StaticUtility.openDeputationExtFileDialog(oHomeThis, 
				sap.ui.getCore().byId(currentViewId+"--ExtViewRepeatId").getModel(),ext);
			
	},
	onDeputationExtFileDialogClose : function(evt) {
		var currentViewId = evt.getSource().mEventRegistry.press[0].oListener.currentViewId;//evt.getSource().oParent.sId.split("--")[0];
		sap.ui.project.e2etm.util.StaticUtility.closeFileDialog(oHomeThis, sap.ui.getCore().byId("extdoclistgrm--ExtViewRepeatId").getModel());
	},
	onDeputationExtFileDialogUpload : function(curEvt){
		var data = sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData();
		var ex_flag = false;
		if(data.ZZ_VREASON_EX == "EX"){
			ex_flag = true;
		}
		var stvaFlag = false;
		sap.ui.project.e2etm.util.StaticUtility.validateUploadCggsFile(curEvt, data.ZZ_DEP_REQ, data.ZZ_DEP_PERNR,
			sap.ui.getCore().byId("extdoclistgrm--ExtViewRepeatId"),
			stvaFlag, data.ZZ_VERSION, ex_flag,sap.ui.getCore().byId("extdoclistgrm--ExtViewRepeatId").getModel(),oHomeThis);//added exflag uea6kor-uml6kor 24/8/2020 RBEIITAPPPIPELINE-217 date change extension
		sap.ui.project.e2etm.util.StaticUtility.fetchExtCheckListForms(data, sap.ui.getCore().byId("extdoclistgrm--ExtViewRepeatId"));
		/// Close Pop up
		//sap.ui.project.e2etm.util.StaticUtility.closeFileDialog(oHomeThis, sap.ui.getCore().byId("extdoclistgrm--ExtViewRepeatId").getModel());
	},
	/////############################# Bug Fix UCD1KOR Nov 27,2020 ############################///
	onChangeZZ_CURR_VISA_TYP:function(evt){
		var selectedKey = evt.getSource().getSelectedKey();
		try{
			sap.ui.getCore().byId("dialogUploadVisaCopy").getModel().getData().selfVisa.ZZ_CURR_VISA_TYP = selectedKey;
		}catch(err){}
		

	},
	
	onExtFormsUpload : function(curEvt) {/*
		var data = sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData();
		var ex_flag = false;
		if(data.ZZ_VREASON_EX == "EX"){
			ex_flag = true;
		}
		var stvaFlag = false;
		sap.ui.project.e2etm.util.StaticUtility.validateUploadCggsFile(curEvt, data.ZZ_DEP_REQ, data.ZZ_DEP_PERNR,
			sap.ui.getCore().byId("extdoclistgrm--ExtViewRepeatId"),
			stvaFlag, data.ZZ_VERSION, ex_flag);//added exflag uea6kor-uml6kor 24/8/2020 RBEIITAPPPIPELINE-217 date change extension
		sap.ui.project.e2etm.util.StaticUtility.fetchExtCheckListForms(data, sap.ui.getCore().byId("extdoclistgrm--ExtViewRepeatId"));
	*/},
	onExtRemovePress: function(evt){
		var data = sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData();
		sap.ui.project.e2etm.util.StaticUtility.deleteFileFromDms(sap.ui.getCore().byId("extdoclistgrm--ExtViewRepeatId").getModel(),
			data.ZZ_DEP_REQ,
			data.ZZ_DEP_PERNR);
		
		/*sap.ui.project.e2etm.util.StaticUtility.fetchExtCheckListForms(data, sap.ui.getCore().byId("extdoclistgrm--ExtViewRepeatId"));*/
	},
	onExtFileDownloadPress : function(curEvt) {
	
	var data = sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData();
	sModule = "EX";
	sap.ui.project.e2etm.util.StaticUtility.downloadCggsForms(sap.ui.getCore().byId("extdoclistgrm--ExtViewRepeatId").getModel().getData().FileUpload,
		data.ZZ_DEP_REQ,
		data.ZZ_DEP_PERNR,
		sModule);

	},
	
	//end of code uea6kor-uml6kor 24/8/2020 RBEIITAPPPIPELINE-217 date change extension
	// This method is used for validating the VISA for DEPENDENTS during uploading visacopy
	validateVisaUploadDependent: function(dependents) {
		for (var i = 0; i < dependents.length; i++) {
			if (dependents[i].ZZ_VISA_SDATE == "") {
				dependents[i].ZZ_VISA_SDATE_ERROR = "Error";
				return "Please check visa valid from";
			} else {
				dependents[i].ZZ_VISA_SDATE_ERROR = "None";
			}

			if (dependents[i].ZZ_VISA_EDATE == "") {
				dependents[i].ZZ_VISA_EDATE_ERROR = "Error";
				return "Please check visa valid to";
			} else {
				dependents[i].ZZ_VISA_EDATE_ERROR = "None";
			}

			if (parseInt(dependents[i].ZZ_VISA_SDATE) > parseInt(dependents[i].ZZ_VISA_EDATE)) {
				dependents[i].ZZ_VISA_SDATE_ERROR = "Error";
				dependents[i].ZZ_VISA_SDATE_ERROR = "Error";
				return "Visa Valid To must be greater than Visa Valid From";
			} else {
				dependents[i].ZZ_VISA_SDATE_ERROR = "None";
				dependents[i].ZZ_VISA_EDATE_ERROR = "None";
			}

			if (dependents[i].ZZ_VISA_NO.trim() == "") {
				dependents[i].ZZ_VISA_NO_ERROR = "Error";
				return "Please enter Visa number";
			} else {
				dependents[i].ZZ_VISA_NO_ERROR = "None";
			}

			if (dependents[i].ZZ_CURR_VISA_TYP.trim() == "") {
				dependents[i].ZZ_PASSPORT_NO_ERROR = "Error";
				return "Please enter Visa type";
			} else {
				dependents[i].ZZ_PASSPORT_NO_ERROR = "None";
			}

			if (!dependents[i].visibleOpen && sap.ui.getCore().getModel("profile").getData().currentRole == "EMP") {
				return "Please upload visa copy for dependent " + dependents[i].ZZ_DEPNDT_TYP;
			}
		}
		return "";
	},
	// This method is used for validating the VISA for SELF during uploading visacopy
	validateVisaUploadSelf: function(self) {
		// Validate visa header
		if (self.ZZ_VISA_SDATE == "") {
			self.ZZ_VISA_SDATE_ERROR = "Error";
			return "Please check Visa Valid From";
		} else {
			self.ZZ_VISA_SDATE_ERROR = "None";
		}

		if (self.ZZ_VISA_EDATE == "") {
			self.ZZ_VISA_EDATE_ERROR = "Error";
			return "Please check Visa Valid To";
		} else {
			self.ZZ_VISA_EDATE_ERROR = "None";
		}

		if (parseInt(self.ZZ_VISA_SDATE) > parseInt(self.ZZ_VISA_EDATE)) {
			self.ZZ_VISA_SDATE_ERROR = "Error";
			self.ZZ_VISA_EDATE_ERROR = "Error";
			return "Visa Valid To must be greater than Visa Valid From";
		} else {
			self.ZZ_VISA_SDATE_ERROR = "None";
			self.ZZ_VISA_EDATE_ERROR = "None";
		}

		// Visa enddate must be greater than deputation startdate
		if (parseInt(self.ZZ_VISA_EDATE) < parseInt(self.ZZ_DEP_STDATE)) {
			self.ZZ_VISA_EDATE_ERROR = "Error";
			return "Visa Valid To must be greater than Deputation Start date";
		} else {
			self.ZZ_VISA_EDATE_ERROR = "None";
		}

		// Visa startdate must be less than deputation startdate
		if (parseInt(self.ZZ_VISA_SDATE) > parseInt(self.ZZ_DEP_STDATE)) {
			self.ZZ_VISA_SDATE_ERROR = "Error";
			return "Visa Valid From must be less than Deputation Start date";
		} else {
			self.ZZ_VISA_SDATE_ERROR = "None";
		}

		if (self.ZZ_VISA_NO.trim() == "") {
			self.ZZ_VISA_NO_ERROR = "Error";
			return "Please enter required field";
		} else {
			self.ZZ_VISA_NO_ERROR = "None";
		}

		if (self.ZZ_CURR_VISA_TYP.trim() == "") {
			self.ZZ_PASSPORT_NO_ERROR = "Error";
			return "Please enter required field";
		} else {
			self.ZZ_PASSPORT_NO_ERROR = "None";
		}

		if (!self.visibleOpen &&
			sap.ui.getCore().getModel("profile").getData().currentRole == "EMP") {
			return "Please upload visa copy of the request's owner";
		}
		return "";
	},
	// To check the Bank number updated or not for PE&NON-PE COuntries
	checkBankNumber: function(oRequest) {
		var currentRole = sap.ui.getCore().getModel("profile").getData().currentRole;
		var model = new sap.ui.model.json.JSONModel();

		var batch1 = oDataModel.createBatchOperation("BankDetailsSet(EmpNo='" + oRequest.ZZ_DEP_PERNR + "',TravelPlan='" + oRequest.ZZ_TRV_REQ +
			"',TravelType='" + oRequest.ZZ_REQ_TYP + "')", "GET");
		var batch2 = oDataModel.createBatchOperation("MRGeneralDataSet(EmpNo='" + oRequest.ZZ_DEP_PERNR + "',TravelPlan='" + oRequest.ZZ_TRV_REQ +
			"',TravelType='" + oRequest.ZZ_REQ_TYP + "',LoginRole='" + currentRole + "')", "GET");
		oDataModel.addBatchReadOperations([batch1, batch2]);
		oDataModel.submitBatch(function(oResult) {
			try {
				var data = {
					bankDet: {},
					generalDet: {}
				};

				var bankdet = oResult.__batchResponses[0].data;
				var generaldet = oResult.__batchResponses[1].data;
				data.bankDet = bankdet;
				data.generalDet = generaldet;
				model.setData(data);
				sap.ui.getCore().setModel(model, "monthrem");

				if (generaldet.PeOrNpe == "PE" && bankdet.Bkact != "") {

					oHomeThis.onEMPChangeClick(oRequest, "Monthly Remittance");
					sap.ui.core.routing.Router.getRouter("MyRouter").navTo("monthrem");
				} else if (generaldet.PeOrNpe == "PE" && bankdet.Bkact == "") {
					sap.m.MessageToast.show("Please update Bank details in the Bank Advice Form");
				} else if (generaldet.PeOrNpe == "NPE" && bankdet.Bkact != "") {

					oHomeThis.onEMPChangeClick(oRequest, "Monthly Remittance");
					sap.ui.core.routing.Router.getRouter("MyRouter").navTo("monthrem");

				} else if (generaldet.PeOrNpe == "NPE" && bankdet.Bkact == "") {

					oHomeThis.onEMPChangeClick(oRequest, "Monthly Remittance");
					sap.ui.core.routing.Router.getRouter("MyRouter").navTo("monthrem");

				}
			} catch (exc) {}
		});
	},

	// Display cargo menu button in EMP Dashboard
	isDisplayCargo: function(oRequest) {
		var stvaFlag = sap.ui.project.e2etm.util.StaticUtility.checkValidCargoTp(oRequest.ZZ_ASG_TYP, oRequest.ZZ_TRV_REQ,
			oRequest.ZZ_DEP_TOCNTRY, oRequest.ZZ_DEP_TOLOC);
		//    var dateBeforeStarDate = sap.ui.project.e2etm.util.StaticUtility.checkStartDate(oRequest.ZZ_DEP_STDATE);
		if (stvaFlag && Number(oRequest.ZZ_DEP_DAYS) >= Number(sap.ui.getCore().getModel("global").getData().cargoStvaMinDur) && oRequest.ZZ_DEP_TYPE ==
			"INTL" && (oRequest.ZZ_REQ_TYP == "DEPU" || oRequest.ZZ_REQ_TYP == "TRFR") &&
			oRequest.ZZ_STAT_FLAG == "FF001") {
			return true;

		} else if (Number(oRequest.ZZ_DEP_DAYS) >= Number(sap.ui.getCore().getModel("global").getData().timeActiveCargo)
			//        && dateBeforeStarDate == true
			&& oRequest.ZZ_DEP_TYPE == "INTL" && (oRequest.ZZ_REQ_TYP == "DEPU" || oRequest.ZZ_REQ_TYP == "TRFR") &&
			oRequest.ZZ_STAT_FLAG == "FF001") {
			return true;
		} else {
			return false;
		}
	},
	// Display insurance menu button in EMP Dashboard
	isDisplayInsurance: function(oRequest) {
		// disable insurance for secondary request.

		if (oRequest.ZZ_REQ_TYP == "SECO") {
			return false;
		}
		////########### UCD1KOR 22 July DOME TRFR = false ###############////
		if(oRequest.ZZ_DEP_TYPE =="DOME" && oRequest.ZZ_REQ_TYP == "INFO"){
			return false;
		}

		if (oRequest.ZZ_REQ_TYP == "INFO") {
			return true;
		}

		if (oRequest.ZZ_DEP_TYPE == "INTL" && oRequest.ZZ_REQ_TYP == "BUSR" && oRequest.ZZ_STAT_FLAG == "FF001") {
			return true;
		}
		//start of change_dye5kor_05.07.2017
		else if (oRequest.ZZ_DEP_TYPE == "INTL" && oRequest.ZZ_REQ_TYP == "DEPU" && (oRequest.ZZ_STAT_FLAG == "FF001" || oRequest.ZZ_STAT_FLAG ==
				"JJ000")) {
			var insrIndex = sap.ui.project.e2etm.util.StaticUtility.getArrayIndex(oRequest.ZE2E_REQ_STATUSSet.results, "ZZ_MODID", "INSR");
			if (insrIndex != -1) {
				if (oRequest.ZE2E_REQ_STATUSSet.results[insrIndex].ZZ_ACTION == "00") {
					return this.checkTcktForInsr(oRequest);
				} else {
					return true;
				}
			} else {
				return this.checkTcktForInsr(oRequest);
			}

			//start of change_dye5kor_05.07.2017
		} else {
			return false;
		}
		return false;
	},
	checkTcktForInsr: function(oRequest) {
		var tcktIndex = sap.ui.project.e2etm.util.StaticUtility.getArrayIndex(oRequest.ZE2E_REQ_STATUSSet.results, "ZZ_MODID", "TCKT");
		if (tcktIndex != -1) {
			if (oRequest.ZE2E_REQ_STATUSSet.results[tcktIndex].ZZ_ACTION == "12" &&
				oRequest.ZE2E_REQ_STATUSSet.results[tcktIndex].ZZ_NROLE == "03") {

				return true;
			}
		}
		return false;
	},

	// Disable all actions in Employee right panel
	disableAllActionsInEmpDashboard: function() {
		// Other action
		sap.ui.getCore().byId("lnkChangeDate").setEnabled(false);
		sap.ui.getCore().byId("lnkChangeEndDate").setEnabled(false);
		sap.ui.getCore().byId("lnkChangeDepes").setEnabled(false);
		sap.ui.getCore().byId("lnkNewBornKid").setEnabled(false);
		sap.ui.getCore().byId("lnkChangeFamilyReturn").setEnabled(false);
		sap.ui.getCore().byId("lnkCancel").setEnabled(false);
		sap.ui.getCore().byId("lnkUploadVisaCopies").setEnabled(false);
		sap.ui.getCore().byId("lnkUploadAdditionalDocs").setEnabled(false);
		sap.ui.getCore().byId("lnkUploadRequisition").setEnabled(false);
		sap.ui.getCore().byId("lnkUploadExitChecklist").setEnabled(false);
		// UCD1KOR 27 Apr 2020 added new link
		sap.ui.getCore().byId("lnkUploadContractLink").setEnabled(false);
		sap.ui.getCore().byId("lnkSecondary").setEnabled(false);
		sap.ui.getCore().byId("lnkEmergency").setEnabled(false);
		sap.ui.getCore().byId("lnkHomeTrip").setEnabled(false);

		// My action
		sap.ui.getCore().byId("lnkTicketing").setEnabled(false);
		sap.ui.getCore().byId("lnkInsurance").setEnabled(false);
		sap.ui.getCore().byId("lnkBankAdvice").setEnabled(false);
		sap.ui.getCore().byId("lnkMonthlyRemittance").setEnabled(false);
		sap.ui.getCore().byId("lnkPcalls").setEnabled(false);
		//    sap.ui.getCore().byId("lnkOnsiteAddress").setEnabled(false);
		sap.ui.getCore().byId("lnkAcceptCL").setEnabled(false);
		sap.ui.getCore().byId("lnkSignCs").setEnabled(false);
		sap.ui.getCore().byId("lnkSTAAllowance").setEnabled(false);

		// Initiate
		sap.ui.getCore().byId("lnkAccommodation").setEnabled(false);
		sap.ui.getCore().byId("lnkCargoOnward").setEnabled(false);
		//    sap.ui.getCore().byId("lnkPersonalBaggageOnward").setEnabled(false);
		sap.ui.getCore().byId("lnkCargoReturn").setEnabled(false);
		//    sap.ui.getCore().byId("lnkPersonalBaggageReturn").setEnabled(false);
		sap.ui.getCore().byId("lnkAdditionalAdvance").setEnabled(false);
		sap.ui.getCore().byId("lnkPaymentVoucher").setEnabled(false);
		sap.ui.getCore().byId("lnkReimb").setEnabled(false);
		sap.ui.getCore().byId("lnkTravelSettlement").setEnabled(false);
		sap.ui.getCore().byId("lnkINRAdvance").setEnabled(false);
		
		//10 Apr UCD1KOR repatriation link
		sap.ui.getCore().byId("idRepatriationLink").setEnabled(false);

	},
	//10 Apr UCD1KOR repatriation
	RepatriationLinkEnable:function(oRequest){
		var globalData = sap.ui.getCore().getModel("global").getData();
		globalData.ZZ_COMABBR =oRequest.ZZ_COMABBR
		this.disableAllActionsInEmpDashboard();
		sap.ui.getCore().byId("lnkOnsiteAddress").setEnabled(false);
		sap.ui.getCore().byId("idRepatriationLink").setEnabled(true);
	},
	generateDashboardAction: function(oRequest) {
		this.disableAllActionsInEmpDashboard();
		
		//10 APR 2020 UCD1KOR repatriation link enable
		// Conditions for Repatriation process
		//  Not applicable for : STA / STA ???PP
		if((oRequest.ZZ_REQ_TYP =="DEPU" && sap.ui.project.e2etm.util.StaticUtility.checkDateInPast(oRequest.ZZ_DEP_STDATE) ) && oRequest.ZZ_ASG_TYP != "STA" && oRequest.ZZ_ASG_TYP !="STAPP" && oRequest.ZZ_ASG_TYP !="" && oRequest.ZZ_STAT_FLAG == "FF001"){
			sap.ui.getCore().byId("idRepatriationLink").setEnabled(true);
		}
		else{
			sap.ui.getCore().byId("idRepatriationLink").setEnabled(false);
		}
		// UCD1KOR 27 APr 2020 Upload COntract link enability
		if(oRequest.ZZ_REQ_TYP =="DEPU"){
			sap.ui.getCore().byId("lnkUploadContractLink").setEnabled(true);
		}
		else{
			sap.ui.getCore().byId("lnkUploadContractLink").setEnabled(false);
		}
		
		sap.ui.getCore().byId("lnkCargoOnward").setTooltip("");
		sap.ui.getCore().byId("lnkCargoReturn").setTooltip("");

		// display Cancel Button?
		var cancelFlag = false;
		// If current date is after deputation end date then disable all buttons
		// if (sap.ui.project.e2etm.util.StaticUtility.checkDateInPast(oRequest.ZZ_DEP_ENDATE)) { // commented by VAB6KOR 
		// Added by VAB6KOR For Enabel the Cancel request link fro EMP role when dates are in the past
		if (sap.ui.project.e2etm.util.StaticUtility.checkDateInPast(oRequest.ZZ_DEP_ENDATE) && sap.ui.getCore().getModel("profile").getData().currentRole !=
			"EMP") {
			cancelFlag = false;
		} else {
			if (sap.ui.getCore().getModel("profile").getData().currentRole == "EMP") {
				cancelFlag = sap.ui.project.e2etm.util.Formatter.cancelEmployeeRequestButton(
					oRequest.ZZ_DEP_REQ, oRequest.ZZ_DEP_TYPE, oRequest.ZZ_TRV_REQ,
					oRequest.ZZ_REQ_TYP, oRequest.ZZ_STAT_FLAG, oRequest.ZZ_STAGE,
					oRequest.ZZ_SET, oRequest.ZZ_SUBSUBSET, oRequest.ZZ_DEP_STDATE, oRequest.ZZ_DEP_ENDATE);
			} else if (sap.ui.getCore().getModel("profile").getData().currentRole == "GRM") {
				cancelFlag = sap.ui.project.e2etm.util.Formatter.cancelManagerRequestButton(
					oRequest.ZZ_REQ_TYP, oRequest.ZZ_STAT_FLAG, oRequest.ZZ_TRV_REQ);
			} else if (sap.ui.getCore().getModel("profile").getData().currentRole == "DEPU") {
				cancelFlag = sap.ui.project.e2etm.util.Formatter.cancelRequestButton(
					oRequest.ZZ_DEP_REQ, oRequest.ZZ_DEP_TYPE, oRequest.ZZ_TRV_REQ,
					oRequest.ZZ_REQ_TYP, oRequest.ZZ_STAT_FLAG, oRequest.ZZ_STAGE,
					oRequest.ZZ_SET, oRequest.ZZ_SUBSUBSET);
			}
		}

		// display Insurance button?
		var insuranceFlag = this.isDisplayInsurance(oRequest);

		// display Cargo button?
		var cargoFlag = this.isDisplayCargo(oRequest);

		// dislay accommodation button
		var accFlag = true;
		if (oRequest.ZZ_REQ_TYP == "VISA") {
			accFlag = false;
		}
		var iAcom = sap.ui.project.e2etm.util.StaticUtility.getArrayIndex(oRequest.ZE2E_REQ_STATUSSet.results, "ZZ_MODID", "ACOM");
		//If no ze2e_req_status of ACOM found then turn off link Accommodaiton
		if (iAcom < 0) {
			accFlag = false;
		} else {
			var acomStatus = oRequest.ZE2E_REQ_STATUSSet.results[iAcom];
			//If ACOM status is no "ADMIN" "SUBMIT" then employee can't click on the link of Accommodaiton
			if (acomStatus.ZZ_ACTION != '01' || acomStatus.ZZ_NROLE != '03') {
				accFlag = false;
			}
		}

		// display ticketing,forex Buttons?
		var ticketingFlag = false;
		var forexFlag = false;
		if (sap.ui.getCore().getModel("profile").getData().currentRole == "EMP") {
			if (oRequest.ZZ_STAT_FLAG == "FF001") {
				ticketingFlag = true;
				forexFlag = true;
			} else {
				ticketingFlag = false;
				forexFlag = false;
			}
		} else {
			ticketingFlag = false;
			forexFlag = false;
		}

		// display Card Reload?
		var cardFlag = false;
		if (sap.ui.getCore().getModel("profile").getData().currentRole == "EMP") {
			var i = sap.ui.project.e2etm.util.StaticUtility.getArrayIndex(oRequest.ZE2E_REQ_STATUSSet.results, "ZZ_MODID", "CARD");
			if (i != -1) {
				cardFlag = true;
			}
		} else {
			cardFlag = false;
		}

		// display Monthly Remittance
		var remitanceFlag = false;
		if (sap.ui.getCore().getModel("profile").getData().currentRole == "EMP") {
			var i = sap.ui.project.e2etm.util.StaticUtility.getArrayIndex(oRequest.ZE2E_REQ_STATUSSet.results, "ZZ_MODID", "MR");
			if (i != -1) {
				remitanceFlag = true;
			}
		} else {
			remitanceFlag = false;
		}

		// display Bank Advice form
		var bankAdviceFlag = false;
		if (sap.ui.getCore().getModel("profile").getData().currentRole == "EMP") {
			var i = sap.ui.project.e2etm.util.StaticUtility.getArrayIndex(oRequest.ZE2E_REQ_STATUSSet.results, "ZZ_MODID", "BANK");
			if (i != -1)
				bankAdviceFlag = true;
			else
				bankAdviceFlag = false;
		}

		// display TravelSettlement
		var trSettleFlag = false;
		if (sap.ui.getCore().getModel("profile").getData().currentRole == "EMP") {
			var i = sap.ui.project.e2etm.util.StaticUtility.getArrayIndex(oRequest.ZE2E_REQ_STATUSSet.results, "ZZ_MODID", "TRST");
			if (i != -1)
				trSettleFlag = true;
			else
				trSettleFlag = false;
		}

		// display Payment Voucher
		var paymentFlag = false;
		if (sap.ui.getCore().getModel("profile").getData().currentRole == "EMP") {
			var i = sap.ui.project.e2etm.util.StaticUtility.getArrayIndex(oRequest.ZE2E_REQ_STATUSSet.results, "ZZ_MODID", "PYVR");
			if (i != -1)
				paymentFlag = true;
			else
				paymentFlag = false;
		}

		// display INR advance
		var inrflag = false;
		if (sap.ui.getCore().getModel("profile").getData().currentRole == "EMP") {
			var i = sap.ui.project.e2etm.util.StaticUtility.getArrayIndex(oRequest.ZE2E_REQ_STATUSSet.results, "ZZ_MODID", "INRA");
			if (i != -1)
				inrflag = true;
			else
				inrflag = false;
		}

		// Simcard changes
		var simCardLink;
		if (sap.ui.getCore().getModel("profile").getData().currentRole == "EMP") {
			if (oRequest.ZZ_REQ_TYP == 'BUSR' && oRequest.ZZ_DEP_TYPE == "INTL" && oRequest.ZZ_SIM_LINK == 'X') {
				simCardLink = true;
			} else {

				simCardLink = false;
			}

		}

		// display Change Button?
		var changeFlag = false;
		// If current date is after deputation end date then disable all buttons
		if (sap.ui.project.e2etm.util.StaticUtility.checkDateInPast(oRequest.ZZ_DEP_ENDATE)) {
			changeFlag = false;
		} else {
			if (sap.ui.getCore().getModel("profile").getData().currentRole == "EMP") {
				changeFlag = sap.ui.project.e2etm.util.Formatter.changeRequestButton(
					oRequest.ZZ_DEP_REQ, oRequest.ZZ_DEP_TYPE, oRequest.ZZ_TRV_REQ,
					oRequest.ZZ_REQ_TYP, oRequest.ZZ_STAT_FLAG, oRequest.ZZ_STAGE,
					oRequest.ZZ_SET, oRequest.ZZ_SUBSUBSET);
				/*Start Date Change Issues*/
				var chgDatesFlag = sap.ui.project.e2etm.util.StaticUtility.checkChangeDatesLogic(oRequest.ZZ_DEP_REQ, oRequest.ZZ_VREASON);
				if (oRequest.ZZ_DEP_TYPE == "INTL" && oRequest.ZZ_REQ_TYP == "DEPU" && chgDatesFlag) {
					this.checkChangeInDatesLink(oRequest);
				}
				/*End Date Change Issues*/
			} else if (sap.ui.getCore().getModel("profile").getData().currentRole == "DEPU") {
				changeFlag = sap.ui.project.e2etm.util.Formatter.changeCOCButton(
					oRequest.ZZ_DEP_STDATE, oRequest.ZZ_DEP_ENDATE, oRequest.ZZ_REQ_TYP,
					oRequest.ZZ_STAT_FLAG, oRequest.ZZ_TRV_REQ, oRequest.ZZ_DEP_TYPE);
			}
		}
		//disable change link,Cancel link for VISA
		if (oRequest.ZZ_REQ_TYP == "VISA") {
			changeFlag = false;
			cancelFlag = false;
		}

		// display Create Button?
		var createFlag = false;
		// If current date is after deputation end date then disable all buttons
		if (sap.ui.project.e2etm.util.StaticUtility.checkDateInPast(oRequest.ZZ_DEP_ENDATE)) {
			createFlag = false;
		} else {
			if (sap.ui.getCore().getModel("profile").getData().currentRole == "EMP") {
				createFlag = sap.ui.project.e2etm.util.Formatter.createRequestButton(oRequest.ZZ_REQ_TYP,
					oRequest.ZZ_STAT_FLAG, oRequest.ZZ_TRV_CAT);
			}
		}

		// display Upload Requisition Button for Domestic Transfer?
		var uploadTransferRequisition = false;
		if (oRequest.ZZ_DEP_TYPE == "DOME" && oRequest.ZZ_TRV_CAT == "TRFR" &&
			oRequest.ZZ_STAGE == "1" &&
			((oRequest.ZZ_SET == "1_2" && oRequest.ZZ_SUBSUBSET == "1_2_1_1") ||
				(oRequest.ZZ_SET == "1_1" && oRequest.ZZ_SUBSUBSET == "0")) &&
			(sap.ui.getCore().getModel("profile").getData().currentRole == "EMP" ||
				sap.ui.getCore().getModel("profile").getData().currentRole == "DEPU")) {
			uploadTransferRequisition = true;
		}

		// display Upload Exit Checklist for Transfer request?
		var uploadExitCheckList = false;
		if (oRequest.ZZ_TRV_CAT == "TRFR" && oRequest.ZZ_STAGE == "1" &&
			((oRequest.ZZ_SET == "1_2" && oRequest.ZZ_SUBSUBSET == "1_2_1_1" && oRequest.ZZ_DEP_TYPE == "DOME") ||
				(oRequest.ZZ_SET == "1_2" && oRequest.ZZ_SUBSUBSET == "1_2_1_3" && oRequest.ZZ_DEP_TYPE == "INTL") ||
				(oRequest.ZZ_SET == "1_1" && oRequest.ZZ_SUBSUBSET == "0")) &&
			sap.ui.getCore().getModel("profile").getData().currentRole == "DEPU") {
			uploadExitCheckList = true;
		}

		/////////////////////// Start genering options in menu popup ////////////////////////
		// GENERATE OPTIONS BASED ON FLAGS

		// Main Cancel Menu button
		if (cancelFlag) {
			sap.ui.getCore().byId("lnkCancel").setEnabled(true);
		}
		//////### UCD1KOR 14 May 2020 ############//// 
		/// Cancel request enable for BUSR with satatus FF001
		if(oRequest.ZZ_REQ_TYP == "BUSR" && oRequest.ZZ_STAT_FLAG =="FF001"){
			sap.ui.getCore().byId("lnkCancel").setEnabled(true);
		}
		else if(oRequest.ZZ_REQ_TYP == "BUSR" && oRequest.ZZ_STAT_FLAG !="FF001"){
			sap.ui.getCore().byId("lnkCancel").setEnabled(false);
		}

		// Main Upload Transfer Requisition Menu Button
		if (uploadTransferRequisition) {
			sap.ui.getCore().byId("lnkUploadRequisition").setEnabled(true);
		}

		// Main Upload Exit CheckList Menu Button
		if (uploadExitCheckList) {
			sap.ui.getCore().byId("lnkUploadExitChecklist").setEnabled(true);
		}

		var dateBeforeStarDate = sap.ui.project.e2etm.util.StaticUtility.checkStartDate(oRequest.ZZ_DEP_STDATE);

		var insrDateBeforeStarDate = sap.ui.project.e2etm.util.StaticUtility.checkInsrStartDate(oRequest.ZZ_DEP_STDATE);

		// Main Insurance Menu button
		if (insuranceFlag) {
			var iIndex = sap.ui.project.e2etm.util.StaticUtility.getArrayIndex(oRequest.ZE2E_REQ_STATUSSet.results, "ZZ_MODID", "INSR");
			// Main Insurance Menu button for before start date
			sap.ui.getCore().getModel("global").getData().ZE2E_REQ_STATUSSet = oRequest.ZE2E_REQ_STATUSSet.results[iIndex];
			sap.ui.getCore().getModel("global").refresh();
			if (insrDateBeforeStarDate) {

				if (iIndex == -1) {
					sap.ui.getCore().byId("lnkInsurance").setEnabled(true);
					sap.ui.getCore().byId("lnkInsurance").setText("Create Insurance Request");
				} else {
					if (oRequest.ZE2E_REQ_STATUSSet.results[iIndex].ZZ_ACTION == '00' ||
						oRequest.ZE2E_REQ_STATUSSet.results[iIndex].ZZ_ACTION == '02') {
						sap.ui.getCore().byId("lnkInsurance").setEnabled(true);
						//sap.ui.getCore().byId("lnkInsurance").setEnabled(this.oRequest,sap.ui.getCore().byId("lnkInsurance"));
						sap.ui.getCore().byId("lnkInsurance").setText("Change Insurance Request");
					} else {
						sap.ui.getCore().byId("lnkInsurance").setEnabled(true);
						//sap.ui.getCore().byId("lnkInsurance").setEnabled(this.oRequest,sap.ui.getCore().byId("lnkInsurance"));
						sap.ui.getCore().byId("lnkInsurance").setText("Open Insurance Request");
					}
				}
			} else { //if after start date and request not sent back or saved
				if (iIndex != -1 && oRequest.ZE2E_REQ_STATUSSet.results[iIndex].ZZ_ACTION != '02' && oRequest.ZE2E_REQ_STATUSSet.results[iIndex].ZZ_ACTION !=
					'00') {
					sap.ui.getCore().byId("lnkInsurance").setEnabled(true);
					//          sap.ui.getCore().byId("lnkInsurance").setEnabled(
					//              this.enableLinksConditions(oRequest,sap.ui.getCore().byId("lnkInsurance")));
					sap.ui.getCore().byId("lnkInsurance").setText("Open Insurance Request");
				} else if (iIndex != -1) {
					/// #### 18 March 2020 UCD1KOR #######/// Comment start
					/*if (oRequest.ZE2E_REQ_STATUSSet.results[iIndex].ZZ_REASON == "3" && oRequest.ZE2E_REQ_STATUSSet.results[iIndex].ZZ_ACTION == "00" &&
						oRequest.ZE2E_REQ_STATUSSet.results[iIndex].ZZ_NROLE == "01")
						sap.ui.getCore().byId("lnkInsurance").setEnabled(
						this.enableLinksConditions(oRequest, sap.ui.getCore().byId("lnkInsurance")));
					sap.ui.getCore().byId("lnkInsurance").setText("Change Insurance Request");*/
					/////////########### 18 March 2020 UCD1KOR /////// end
					/// ##### 18 March 2020 UCD1KOR ########//// added for insurance link start
					sap.ui.getCore().byId("lnkInsurance").setEnabled(
							this.enableLinksConditions(oRequest, sap.ui.getCore().byId("lnkInsurance")));
					sap.ui.getCore().byId("lnkInsurance").setText("Change Insurance Request");
					
					if (oRequest.ZE2E_REQ_STATUSSet.results[iIndex].ZZ_ACTION == "01" && oRequest.ZE2E_REQ_STATUSSet.results[iIndex].ZZ_NROLE == "01"){
						sap.ui.getCore().byId("lnkInsurance").setEnabled(false);
					}
					/// ##### 18 March 2020 UCD1KOR ########//// end
				}
			}
		}

		// Main Cargo Menu button
		if (cargoFlag) {
			var iOnward = sap.ui.project.e2etm.util.StaticUtility.getArrayIndex(oRequest.ZE2E_REQ_STATUSSet.results, "ZZ_MODID", "CARO");
			var iReturn = sap.ui.project.e2etm.util.StaticUtility.getArrayIndex(oRequest.ZE2E_REQ_STATUSSet.results, "ZZ_MODID", "CARR");
			// Main Onward Cargo Menu button for before start date
			if (dateBeforeStarDate) {
				if (iOnward == -1) {
					/*Start- Cargo Changes*/

					//  if(this.setCargoLinkEnable(oRequest,"O")){
					/*End- Cargo Changes*/
					sap.ui.getCore().byId("lnkCargoOnward").setEnabled(true);
					sap.ui.getCore().byId("lnkCargoOnward").setText("Create onward cargo request");
					/*Start- Cargo Changes*/
					//}else{
					//sap.ui.getCore().byId("lnkCargoOnward").setTooltip(this.setCargoLinkTooltip(oRequest,"O"));
					//}
					/*End- Cargo Changes*/
				} else if (oRequest.ZE2E_REQ_STATUSSet.results[iOnward].ZZ_ACTION == '00' ||
					oRequest.ZE2E_REQ_STATUSSet.results[iOnward].ZZ_ACTION == '02') {
					sap.ui.getCore().byId("lnkCargoOnward").setEnabled(true);
					sap.ui.getCore().byId("lnkCargoOnward").setText("Change Onward Request");
					this.setCargoLinkEnable(oRequest, "O");
				} else {
					sap.ui.getCore().byId("lnkCargoOnward").setEnabled(true);
					sap.ui.getCore().byId("lnkCargoOnward").setText("Open Onward Request");
					this.setCargoLinkEnable(oRequest, "O");
				}
			} else { //if after start date
				if (iOnward != -1 && oRequest.ZE2E_REQ_STATUSSet.results[iOnward].ZZ_ACTION != '02' && oRequest.ZE2E_REQ_STATUSSet.results[iOnward].ZZ_ACTION !=
					'00') {
					sap.ui.getCore().byId("lnkCargoOnward").setEnabled(true);
					sap.ui.getCore().byId("lnkCargoOnward").setText("Open Onward Request");
					this.setCargoLinkEnable(oRequest, "O");
				}
			}

			// Not displaying return option for transfer request
			//      if (oRequest.ZZ_REQ_TYP && oRequest.ZZ_TRV_CAT == "TRFR"){
			//
			//      } else {
			// Main Return Cargo Menu button for before after start date and before end date
			var dateAfterEndDate = sap.ui.project.e2etm.util.StaticUtility.checkEndDate(oRequest.ZZ_DEP_ENDATE);
			if (dateBeforeStarDate) {
				//do nothing
			} else {
				if (!dateAfterEndDate) { //if not end date yet

					if (iReturn == -1) {
						/*Start- Cargo Changes*/

						//if(this.setCargoLinkEnable(oRequest,"R")){
						/*End- Cargo Changes*/
						sap.ui.getCore().byId("lnkCargoReturn").setEnabled(true);

						sap.ui.getCore().byId("lnkCargoReturn").setText("Create return cargo request");
						//}else{
						//sap.ui.getCore().byId("lnkCargoReturn").setTooltip(this.setCargoLinkTooltip(oRequest,"R"));
						//}
					} else if (oRequest.ZE2E_REQ_STATUSSet.results[iReturn].ZZ_ACTION == '00' ||
						oRequest.ZE2E_REQ_STATUSSet.results[iReturn].ZZ_ACTION == '02') {
						sap.ui.getCore().byId("lnkCargoReturn").setEnabled(true);
						sap.ui.getCore().byId("lnkCargoReturn").setText("Change Return Request");
					} else {
						sap.ui.getCore().byId("lnkCargoReturn").setEnabled(true);
						sap.ui.getCore().byId("lnkCargoReturn").setText("Open Return Request");
					}
				} else { //if end date already
					if (iReturn != -1 && oRequest.ZE2E_REQ_STATUSSet.results[iReturn].ZZ_ACTION != '02' && oRequest.ZE2E_REQ_STATUSSet.results[iReturn]
						.ZZ_ACTION !=
						'00') {
						sap.ui.getCore().byId("lnkCargoReturn").setEnabled(true);
						sap.ui.getCore().byId("lnkCargoReturn").setText("Open Return Request");
					}
				} //end if not end date
			} //end if dateBeforeStarDate
			//      } //end check transfer request
		} //end check CargoFlag

		// Main ticketing Menu button
		if (ticketingFlag) {
			//sap.ui.getCore().byId("lnkTicketing").setEnabled(true);
			sap.ui.getCore().byId("lnkTicketing").setEnabled(
				this.enableLinksConditions(oRequest, sap.ui.getCore().byId("lnkTicketing")));
		}

		// Main Accommodation Menu button
		if (accFlag) {
			// sap.ui.getCore().byId("lnkAccommodation").setEnabled(true);
			sap.ui.getCore().byId("lnkAccommodation").setEnabled(
				this.enableLinksConditions(oRequest, sap.ui.getCore().byId("lnkAccommodation")));
		}
		
		//UCD1KOR 22/05/2021 enable logic for accomdation link
		if((oRequest.ZZ_REQ_TYP == "BUSR" || oRequest.ZZ_REQ_TYP == "INFO") && oRequest.ZZ_STAT_FLAG =="FF001" && (oRequest.ZZ_DEP_TOLOC =="BAN" || oRequest.ZZ_DEP_TOLOC =="Bangalore" || oRequest.ZZ_DEP_TOLOC =="COB" || oRequest.ZZ_DEP_TOLOC =="Coimbatore")){
			sap.ui.getCore().byId("lnkAccommodation").setEnabled(true);
		}
		else{
			sap.ui.getCore().byId("lnkAccommodation").setEnabled(false);
		}

		// Main Forex Menu button
		//    if (forexFlag) {
		//    var forexMenu = new sap.ui.unified.MenuItem();
		//    forexMenu.setText("Forex");
		//    forexMenu.setIcon("sap-icon://simple-payment");
		//    oHomeThis.openMenu.addItem(forexMenu);
		//    }

		// Main Card Reload Menu button
		if (cardFlag) {
			// sap.ui.getCore().byId("lnkAdditionalAdvance").setEnabled(true);
			sap.ui.getCore().byId("lnkAdditionalAdvance").setEnabled(
				this.enableLinksConditions(oRequest, sap.ui.getCore().byId("lnkAdditionalAdvance")));
			//######### UCD1KOR 13 March Logic changed for enability for links ###########/// start
			var enab = sap.ui.getCore().byId("lnkAdditionalAdvance").getEnabled();
			var cnty = oRequest.ZZ_DEP_TOCNTRY_TXT;
			if(enab == true && cnty != "India"){
				sap.ui.getCore().byId("lnkINRAdvance").setEnabled(false);
				sap.ui.getCore().byId("lnkAdditionalAdvance").setEnabled(true);
			}
			else{
				sap.ui.getCore().byId("lnkINRAdvance").setEnabled(true);
				sap.ui.getCore().byId("lnkAdditionalAdvance").setEnabled(false);
			}
			//######### UCD1KOR 13 March Logic changed for enability for links ###########/// end
		}

		// Monthly Remittance Menu
		if (remitanceFlag) {
			//sap.ui.getCore().byId("lnkMonthlyRemittance").setEnabled(true);
			sap.ui.getCore().byId("lnkMonthlyRemittance").setEnabled(
				this.enableLinksConditions(oRequest, sap.ui.getCore().byId("lnkMonthlyRemittance")));
		}
		// Bank Advice form
		if (bankAdviceFlag) {
			//sap.ui.getCore().byId("lnkBankAdvice").setEnabled(true);
			sap.ui.getCore().byId("lnkBankAdvice").setEnabled(
				this.enableLinksConditions(oRequest, sap.ui.getCore().byId("lnkBankAdvice")));
		}
		// Bank Advice form
		if (trSettleFlag) {
			//sap.ui.getCore().byId("lnkTravelSettlement").setEnabled(true);
			sap.ui.getCore().byId("lnkTravelSettlement").setEnabled(
				this.enableLinksConditions(oRequest, sap.ui.getCore().byId("lnkTravelSettlement")));
		}

		if (paymentFlag) {
			//sap.ui.getCore().byId("lnkPaymentVoucher").setEnabled(true);
			sap.ui.getCore().byId("lnkPaymentVoucher").setEnabled(
				this.enableLinksConditions(oRequest, sap.ui.getCore().byId("lnkPaymentVoucher")));
		}

		if (inrflag) {
			//sap.ui.getCore().byId("lnkINRAdvance").setEnabled(true);
			sap.ui.getCore().byId("lnkINRAdvance").setEnabled(
				this.enableLinksConditions(oRequest, sap.ui.getCore().byId("lnkINRAdvance")));
			//######### UCD1KOR 13 March Logic changed for enability for links ###########/// start
			var enab = sap.ui.getCore().byId("lnkINRAdvance").getEnabled();
			var cnty = oRequest.ZZ_DEP_TOCNTRY_TXT;
			if(enab == true && cnty == "India"){
				sap.ui.getCore().byId("lnkINRAdvance").setEnabled(true);
				sap.ui.getCore().byId("lnkAdditionalAdvance").setEnabled(false);
			}
			else{
				sap.ui.getCore().byId("lnkINRAdvance").setEnabled(false);
				sap.ui.getCore().byId("lnkAdditionalAdvance").setEnabled(true);
			}
			//######### UCD1KOR 13 March Logic changed for enability for links ###########/// end

		}

		//Simcard Link
		if (simCardLink) {
			sap.ui.getCore().byId("lnkPcalls").setEnabled(true);
		}

		var dateBeforeStarDate = sap.ui.project.e2etm.util.StaticUtility.checkStartDate(oRequest.ZZ_DEP_STDATE);
		// Reimbursment
		var reim_flag = false;
		if (sap.ui.getCore().getModel("profile").getData().currentRole == "EMP" && oRequest.ZZ_TRV_CAT == "WRKP" &&
			oRequest.ZZ_STAT_FLAG == "FF001" &&
			!dateBeforeStarDate) {
			reim_flag = true;
		}

		// If training and not Austria or Germany, disable reimbursement
		if (oRequest.ZZ_TRV_CAT == "TRNG" && oRequest.ZZ_DEP_TOCNTRY != "AT" && oRequest.ZZ_DEP_TOCNTRY != "GE") {
			reim_flag = false;
		}

		if (reim_flag == true) {
			// Begin reimbursement
			var iIndex = sap.ui.project.e2etm.util.StaticUtility.getArrayIndex(oRequest.ZE2E_REQ_STATUSSet.results, "ZZ_MODID", "REIM");
			var aReim = [];
			var dateAfterEndDate = sap.ui.project.e2etm.util.StaticUtility.checkEndDate(oRequest.ZZ_DEP_ENDATE);

			if (oRequest.ZE2E_REQ_STATUSSet.results != undefined) {
				//if it's after enddate
				if (dateAfterEndDate) {
					for (var i = 0; i < oRequest.ZE2E_REQ_STATUSSet.results.length; i++) {
						if (oRequest.ZE2E_REQ_STATUSSet.results[i].ZZ_MODID == 'REIM') {
							aReim.push(oRequest.ZE2E_REQ_STATUSSet.results[i]);
						}
					}
					if (aReim.length != 0) {
						//   sap.ui.getCore().byId("lnkReimb").setEnabled(true);
						sap.ui.getCore().byId("lnkReimb").setEnabled(
							this.enableLinksConditions(oRequest, sap.ui.getCore().byId("lnkReimb")));
						sap.ui.getCore().byId("lnkReimb").setText("Open Reimbursement Request");
					}

				} else { //if it's not enddate yet
					for (var i = 0; i < oRequest.ZE2E_REQ_STATUSSet.results.length; i++) {
						if (oRequest.ZE2E_REQ_STATUSSet.results[i].ZZ_MODID == 'REIM') {
							aReim.push(oRequest.ZE2E_REQ_STATUSSet.results[i]);
						}
					}
					if (oRequest.ZZ_TAB_FLAG == "MT") {
						if (aReim.length == 0) {
							//    sap.ui.getCore().byId("lnkReimb").setEnabled(true);
							sap.ui.getCore().byId("lnkReimb").setEnabled(
								this.enableLinksConditions(oRequest, sap.ui.getCore().byId("lnkReimb")));
							sap.ui.getCore().byId("lnkReimb").setText("Create Reimbursement Request");
						} else {
							var i = aReim.length - 1;
							if (aReim[i].ZZ_ACTION == '00' || aReim[i].ZZ_ACTION == '02') {
								//    sap.ui.getCore().byId("lnkReimb").setEnabled(true);
								sap.ui.getCore().byId("lnkReimb").setEnabled(
									this.enableLinksConditions(oRequest, sap.ui.getCore().byId("lnkReimb")));
								sap.ui.getCore().byId("lnkReimb").setText("Open Reimbursement Request");
							} else {
								//    sap.ui.getCore().byId("lnkReimb").setEnabled(true);
								sap.ui.getCore().byId("lnkReimb").setEnabled(
									this.enableLinksConditions(oRequest, sap.ui.getCore().byId("lnkReimb")));
								sap.ui.getCore().byId("lnkReimb").setText("Create Reimbursement Request");
							}
						}
					} else if (oRequest.ZZ_TAB_FLAG == "MR") {
						sap.ui.getCore().byId("lnkReimb").setEnabled(true);
						sap.ui.getCore().byId("lnkReimb").setText("Open Reimbursement Request");
					}
				} //end if it's after enddate

				//        if(aReim.length == 0){
				//        sap.ui.getCore().byId("lnkReimb").setEnabled(true);
				//        sap.ui.getCore().byId("lnkReimb").setText("Create Reimbursement Request");
				//        }else{
				//        var i = aReim.length - 1;
				//        if(aReim[i].ZZ_ACTION == '00' || aReim[i].ZZ_ACTION == '02'){
				//        sap.ui.getCore().byId("lnkReimb").setEnabled(true);
				//        sap.ui.getCore().byId("lnkReimb").setText("Open Reimbursement Request");
				//        }else{
				//        sap.ui.getCore().byId("lnkReimb").setEnabled(true);
				//        sap.ui.getCore().byId("lnkReimb").setText("Create Reimbursement Request");
				//        }
				//        }
			} //end if requeset status set != undefined
		} //End reimbursement flag
		//Begin TAX Clearance
		//    var oMenuCreate = new sap.ui.unified.MenuItem();
		//    oMenuCreate.setText("Create TAX Clearance");
		//    oMenuCreate.setIcon("sap-icon://money-bills");
		//    oHomeThis.openMenu.addItem(oMenuCreate);
		//End   TAX Clearance

		// Main Change menu button
		if (changeFlag) {
			if (sap.ui.getCore().getModel("profile").getData().currentRole == "EMP") {
				oHomeThis.generateEMPChangeActions(oRequest);
			}

		}
		/*Start-Always enable Upload Visa Copies link for employee Once travel Plan gets generated*/
		if (sap.ui.getCore().getModel("profile").getData().currentRole == "EMP") {
			if (oRequest.ZZ_TRV_REQ != "0000000000" && oRequest.ZZ_TRV_REQ != null && oRequest.ZZ_TRV_REQ != "") {
				if (oRequest.ZZ_STAT_FLAG != "" && oRequest.ZZ_STAT_FLAG != undefined && oRequest.ZZ_STAT_FLAG != null) {
					if (oRequest.ZZ_STAT_FLAG == "AA000" || oRequest.ZZ_STAT_FLAG.substring(2, 5) == "008" || oRequest.ZZ_STAT_FLAG == "FF001") {
						sap.ui.getCore().byId("lnkUploadVisaCopies").setEnabled(true);
					}
					// UCD1KOR 22/0/2021 hide upload visa copy link for India
					if(oRequest.ZZ_DEP_TOCNTRY == "IN"){
						sap.ui.getCore().byId("lnkUploadVisaCopies").setEnabled(false);
					}
				}
			}
		}
		/*End-Always enable Upload Visa Copies link for employee Once travel Plan gets generated*/

		//Accept CL
		//    if(sap.ui.project.e2etm.util.StaticUtility.checkDateInPast(oRequest.ZZ_DEP_STDATE)&&
		//      !(sap.ui.project.e2etm.util.StaticUtility.checkDateInPast(oRequest.ZZ_DEP_ENDATE))  ){

		oComponent.getModel().read("DepShStatusSet(DepReq='" + oRequest.ZZ_DEP_REQ + "',Version='" + oRequest.ZZ_VERSION + "')", null, null,
			true,
			function(oData, response) {
				if (oData.ClStatus == 'E')
					sap.ui.getCore().byId("lnkAcceptCL").setEnabled(true);
				if (oData.Status == "S")
					sap.ui.getCore().byId("lnkSignCs").setEnabled(true);
				if (oData.ALStatus == "AE")
					sap.ui.getCore().byId("lnkSTAAllowance").setEnabled(true);

			},
			function(error) {});

		//    }

		// Main Create menu button
		if (createFlag) {
			oHomeThis.generateEMPCreateActions(oRequest);
		}
		//Logic to enable Seco lnk for training_uml6kor_16/7/2020
	    if (oRequest.ZZ_REQ_TYP == "DEPU" && oRequest.ZZ_TRV_CAT == "TRNG" &&
		 (oRequest.ZZ_STAT_FLAG == "FF001" || oRequest.ZZ_STAT_FLAG == "JJ000")) { 
			sap.ui.getCore().byId("lnkSecondary").setEnabled(true);
		}
	  //Logic to enable Seco lnk for training_uml6kor_16/7/2020 
	    
		// Logic to enable Onsite Address
		sap.ui.getCore().byId("lnkOnsiteAddress").setEnabled(false);
		var sUrl = "/ZE2E_TR_STATUSSet(ZZ_REINR='{0}',ZZ_VERSION='{1}',ZZ_MODID='{2}')";
		sUrl = sUrl.replace("{0}", oRequest.ZZ_DEP_REQ);
		sUrl = sUrl.replace("{1}", 1);
		sUrl = sUrl.replace("{2}", "DEPU");

		if (sap.ui.project.e2etm.util.StaticUtility.checkDateInPast(oRequest.ZZ_DEP_STDATE) && !sap.ui.project.e2etm.util.StaticUtility.checkDateInPast(
				oRequest.ZZ_DEP_ENDATE) && oRequest.ZZ_REQ_TYP == "DEPU" && (oRequest.ZZ_ASG_TYP == "STA" || oRequest.ZZ_ASG_TYP == "STAPP" ||
				sap.ui.project.e2etm.util.StaticUtility.checkStvaAsg(oRequest.ZZ_ASG_TYP))) {

			oDataModel.read(sUrl, {
				success: function(oData) {
					if (oData.ZZ_STATUS === "FF001") {
						oRequest.ZZ_TRV_REQ_V1 = oData.ZZ_REINR;
						sap.ui.getCore().byId("lnkOnsiteAddress").setEnabled(true);
					}
				},
				error: function() {
					jQuery.sap.log.info("Odata Error occured");
				}
			});
		} else {
			sap.ui.getCore().byId("lnkOnsiteAddress").setEnabled(false);
		}
	},

	enableLinksConditions: function(oRequest, link) {
		var staFlag = sap.ui.project.e2etm.util.StaticUtility.checkSTA2018(oRequest.ZZ_DEP_STDATE);
		if (staFlag) {
			var id = link.getId();
			if (sap.ui.project.e2etm.util.StaticUtility.checkStvaAsg(oRequest.ZZ_ASG_TYP)) {
				if (id == "lnkInsurance" || id == "lnkTicketing" || id == "lnkAccommodation") {
					if (sap.ui.project.e2etm.util.StaticUtility.checkDateInPast(oRequest.ZZ_DEP_STDATE)) {
						return false;
					}
				} else if (id == "lnkBankAdvice" || id == "lnkMonthlyRemittance" || id == "lnkCargoReturn" ||
					id == "lnkAdditionalAdvance" || id == "lnkPaymentVoucher" || id == "lnkReimb" || id == "lnkTravelSettlement" || id ==
					"lnkTravelSettlement" || id == "lnkTravelSettlement" || id == "lnkINRAdvance") {
					return false;
				}
			}
		}
		return true;
	},

	checkChangeInDatesLink: function(oRequest) {
		var curDate = new Date();
		sap.ui.getCore().byId("lnkChangeDate").setEnabled(false);
		var deputationStartDate = new Date(oRequest.ZZ_DEP_STDATE.substr(0, 4), oRequest.ZZ_DEP_STDATE.substr(4, 2) - 1, oRequest.ZZ_DEP_STDATE
			.substr(
				6, 2));
		var deputationEndDate = new Date(oRequest.ZZ_DEP_ENDATE.substr(0, 4), oRequest.ZZ_DEP_ENDATE.substr(4, 2) - 1, oRequest.ZZ_DEP_ENDATE.substr(
			6, 2));
		var changeInDateFlag = sap.ui.project.e2etm.util.Formatter.changeInDatesLink(oRequest.ZZ_DEP_REQ, oRequest.ZZ_DEP_TYPE, oRequest.ZZ_TRV_REQ,
			oRequest.ZZ_REQ_TYP, oRequest.ZZ_STAT_FLAG, oRequest.ZZ_STAGE, oRequest.ZZ_SET, oRequest.ZZ_SUBSUBSET, oRequest.ZZ_ASG_TYP);
		var changeFamilyAccFlag = sap.ui.project.e2etm.util.Formatter.changeFamilyAccLink(oRequest.ZZ_DEP_REQ, oRequest.ZZ_DEP_TYPE, oRequest.ZZ_TRV_REQ,
			oRequest.ZZ_REQ_TYP, oRequest.ZZ_STAT_FLAG, oRequest.ZZ_STAGE, oRequest.ZZ_SET, oRequest.ZZ_SUBSUBSET);
		if (curDate < deputationStartDate) { //Before deputation
			if (changeInDateFlag) { //Change Dates Link
				// requestMenuList.addItem(oChangeDate);
				sap.ui.getCore().byId("lnkChangeDate").setText("Change Dates");
				sap.ui.getCore().byId("lnkChangeDate").setEnabled(true);
			}
			if (changeFamilyAccFlag) { //Amend request to change Family accompanying
				if (oRequest.ZZ_TRV_CAT != "TRNG") {
					// requestMenuList.addItem(oChangeDepes);
					sap.ui.getCore().byId("lnkChangeDepes").setEnabled(true);
					sap.ui.getCore().byId("lnkChangeDepes").setText("Amend request to Change accompanying Family");
				}
			}
		} else { //On Deputation
			if (changeFamilyAccFlag && oRequest.ZZ_TRV_CAT != "TRNG") {
				// requestMenuList.addItem(oChangeDepes);
				sap.ui.getCore().byId("lnkChangeDepes").setEnabled(true);
				sap.ui.getCore().byId("lnkChangeDepes").setText("Change family accompany(while on deputation)");

			}
		}
	},

	getCargoVendor: function(oRequest, cargoType) {

		var stvaFlag = sap.ui.project.e2etm.util.StaticUtility.checkValidCargoTp(oRequest.ZZ_ASG_TYP, oRequest.ZZ_TRV_REQ,
			oRequest.ZZ_DEP_TOCNTRY, oRequest.ZZ_DEP_TOLOC);

		switch (cargoType) {
			case "O": // Onward
				//if (oRequest.ZZ_ASG_TYP == "VA" || oRequest.ZZ_ASG_TYP == "VN" || oRequest.ZZ_ASG_TYP == "STVA"){ 
				// ucd1kor 21 jan 2021 oRequest.ZZ_ASG_TYP == "STX" added
				if (oRequest.ZZ_ASG_TYP == "VA" || oRequest.ZZ_ASG_TYP == "VN" || stvaFlag || oRequest.ZZ_ASG_TYP == "NC" || oRequest.ZZ_ASG_TYP == "LTX" || oRequest.ZZ_ASG_TYP == "NCX" || oRequest.ZZ_ASG_TYP == "STX") { //added new policy asg models (6/9/2019)
					return "AAL";
				} else { // DHL Onward
					return "DHL";
				}
				break;
			case "R": // Return
				var globalData = sap.ui.getCore().getModel("global").getData();
				///UCD1KOR  oRequest.ZZ_ASG_TYP == "STX" Condition added 21 jan 2021
				
				if (stvaFlag || oRequest.ZZ_ASG_TYP == "NC" || oRequest.ZZ_ASG_TYP == "STX") {
					if (Number(oRequest.ZZ_DEP_DAYS) >= Number(globalData.cargoStvaMinDur)) {
						return "AAL";
					}
				} else {
					if (Number(oRequest.ZZ_DEP_DAYS) >= Number(globalData.cargoCondition)) {
						/*Start-newly added for STA*/
						if (oRequest.ZZ_ASG_TYP == "STA" && oRequest.ZZ_DEP_TOCNTRY == "DE") {
							return "DHL"; // DHL
						} else if (oRequest.ZZ_ASG_TYP == "STA" && oRequest.ZZ_DEP_TOCNTRY != "DE") {
							if (oRequest.ZZ_FAMILY_ACCOMP == 'X')
								return "AAL";
							else
								return "DHL"; // DHL
						}
						/*End-newly added for STA*/
						if (oRequest.ZZ_FAMILY_ACCOMP == 'X') { // if family accompanied
							// then AAL
							return "AAL";
						} else {
							return "DHL"; // DHL
						}
					} else {
						return "DHL"; // DHL
					}
				}
				break;
		}
		return "";
	},
	setCargoLinkEnable: function(oData, cargoType) {
		var that = this;
		gCargoVendor = "";
		var currentDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
		var vendorType = this.getCargoVendor(oData, cargoType);
		if (vendorType == "DHL") {
			switch (cargoType) {
				case "O": // Onward
					var startDate = new Date(oData.ZZ_DEP_STDATE.substr(0, 4), oData.ZZ_DEP_STDATE.substr(4, 2) - 1, oData.ZZ_DEP_STDATE.substr(6, 2));
					var days = Math.round((startDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
					days = days + 1;
					return this.checkCargoEnableDaysDHL(cargoType, days);
					break;
				case "R": // Return
					var endDate = new Date(oData.ZZ_DEP_ENDATE.substr(0, 4), oData.ZZ_DEP_ENDATE.substr(4, 2) - 1, oData.ZZ_DEP_ENDATE.substr(6, 2));
					var days = Math.round((endDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
					days = days + 1;
					return this.checkCargoEnableDaysDHL(cargoType, days);
					break;
			}
		} else if (vendorType == "AAL") {
			var stvaFlag = sap.ui.project.e2etm.util.StaticUtility.checkValidCargoTp(oData.ZZ_ASG_TYP, oData.ZZ_TRV_REQ, oData.ZZ_DEP_TOCNTRY,
				oData.ZZ_DEP_TOLOC);
			switch (cargoType) {
				case "O": // Onward
					var startDate = new Date(oData.ZZ_DEP_STDATE.substr(0, 4), oData.ZZ_DEP_STDATE.substr(4, 2) - 1, oData.ZZ_DEP_STDATE.substr(6, 2));
					var days = Math.round((startDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
					days = days + 1;
					var duration = Number(oData.ZZ_DEP_DAYS.trim());
					/*if (days > 29 && days <= 50) {
						that.gCargoVendor = "AAL"; 
						gCargoVendor = "AAL"; //added 4/8/2020_uml6kor for enabling AAL
						return true;
					} else*/ 
					if (stvaFlag && (oData.ZZ_DEP_TOCNTRY != "AT" && oData.ZZ_DEP_TOLOC != "VNA")) { //else if(oData.ZZ_ASG_TYP == "STVA"){
						if (this.checkCargoEnableDaysDHL(cargoType, days) && duration >= 100) {
							gCargoVendor = "DHL";
							that.gCargoVendor = "DHL";
							return true;
						}else{
							that.gCargoVendor = "AAL"; 
							gCargoVendor = "AAL"; //added 4/8/2020_uml6kor for enabling AAL
							return true;
						}

					}else{
						that.gCargoVendor = "AAL"; 
						gCargoVendor = "AAL"; //added 4/8/2020_uml6kor for enabling AAL
						return true;
					}
					break;
				case "R": // Return
					var endDate = new Date(oData.ZZ_DEP_ENDATE.substr(0, 4), oData.ZZ_DEP_ENDATE.substr(4, 2) - 1, oData.ZZ_DEP_ENDATE.substr(6, 2));
					var days = Math.round((endDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
					days = days + 1;
					/*if (days > 29 && days <= 50) {
						gCargoVendor = "AAL"; //added 4/8/2020_uml6kor for enabling AAL
						that.gCargoVendor = "AAL";
						return true;
					}*/
					gCargoVendor = "AAL"; //added 4/8/2020_uml6kor for enabling AAL
					that.gCargoVendor = "AAL";
					return true;
					//        else{
					//          if(this.checkCargoEnableDaysDHL(cargoType,days)){
					//            gCargoVendor = "DHL";
					//            return true;
					//          }
					//        }
					break;
			}
		}
		return false;
		//return true;
	},
	checkCargoEnableDaysDHL: function(cargoType, days) {
		switch (cargoType) {
			case "O":
				if (days > 6 && days <= 15) {
					return true;
				}
				break;
			case "R":
				if (days > 19 && days <= 29) {
					return true;
				}
				break;
		}
		return false;
		//    return true;
	},
	setCargoLinkTooltip: function(oRequest, cargoType) {
		var vendorType = this.getCargoVendor(oRequest, cargoType);
		///########## UCD1KOR below condition added 08 Jan 21 #############////////////
		this.oRequest = oRequest;
		if(oRequest.ZZ_ASG_TYP == "STX" || oRequest.ZZ_ASG_TYP == "LTX" || oRequest.ZZ_ASG_TYP == "NCX" || oRequest.ZZ_ASG_TYP == "STVA"|| oRequest.ZZ_ASG_TYP == "VA"|| oRequest.ZZ_ASG_TYP == "VN"){
			var msg1 = "This is to inform that, there will be additional charges for CARGO movement, if associate does not have minimum of 7 working days from date of Manager approval to moving date. ";
			var msg2="Additional cost for Airfreight: With less than 5 working days (Mon-Fri), handling time left (from placing the order by team Mitarbeiterumzuege with moving company until pick up date). The fee is about 475 USD";
			var message = msg1+"\n"+msg2;
			this.cargoMessage = true;
			return message;
		}
		else{
			if (vendorType == "DHL") {
				switch (cargoType) {
					case "O": // Onward
						return "Link will be enabled only from 15th day to 7 days before travel start date";
					case "R": // Return
						return "Link will be enabled only from 29th day to 20th day before travel end date"; // DHL
				}
			} else if (vendorType == "AAL") {
				switch (cargoType) {
					case "O": // Onward
						return "Link will be enabled only from 50th day to 30 days before travel start date";
					case "R": // Return
						return "Link will be enabled only from 50th day to 30 days before travel end date"; // DHL
				}
			}
			return "";
		}
		
	},
	showCargoLeadTimeDialog: function(message) {
		var that = this;
		var globalData = sap.ui.getCore().getModel("global").getData();
		var stvaFlag = sap.ui.project.e2etm.util.StaticUtility.checkValidCargoTp(that.oRequest.ZZ_ASG_TYP, that.oRequest.ZZ_TRV_REQ, that.oRequest.ZZ_DEP_TOCNTRY,
				that.oRequest.ZZ_DEP_TOLOC);
		//############## UCD1KOR condiotion added ############///////
		if(this.cargoMessage == true){
			var dialog = new sap.m.Dialog({
				title: 'Warning',
				type: 'Message',
				state: 'Warning',
				content: new sap.m.Text({
					text: message
				}),
				beginButton: new sap.m.Button({
					text: 'Understood',
					press: function() {
						globalData.ZZ_ASG_TYP = that.oRequest.ZZ_ASG_TYP;
						globalData.ZZ_DEP_DAYS = that.oRequest.ZZ_DEP_DAYS;
						globalData.ZZ_FAMILY_ACCOMP = that.oRequest.ZZ_FAMILY_ACCOMP;
						if(globalData.ZZ_CAR_TYP == "O"){
							globalData.ZZ_CAR_TYP = "O";
						}
						else if(globalData.ZZ_CAR_TYP == "S"){
							globalData.ZZ_CAR_TYP = "S";
						}
						else if(globalData.ZZ_CAR_TYP == "R"){
							globalData.ZZ_CAR_TYP = "R";
						}
						else if(globalData.ZZ_CAR_TYP == "V"){
							globalData.ZZ_CAR_TYP = "V";
						}
						else if (stvaFlag && gCargoVendor == "DHL"){
							globalData.ZZ_CAR_TYP = "O";
						}
						else{
							globalData.ZZ_CAR_TYP = "V";
						}
						sap.ui.getCore().getModel("global").setData(globalData);
						if (gCargoVendor == "AAL"){		 
							sap.ui.core.routing.Router.getRouter("MyRouter").navTo("cargo");
						}else{
							that.onDisableDHL();
						}
						
						dialog.close();
					}
				}),
				endButton: new sap.m.Button({
					text: 'Close',
					press: function() {
						dialog.close();
					}
				}),
				afterClose: function() {
					dialog.destroy();
				}
			});

			dialog.open();
		}else{
		var dialog = new sap.m.Dialog({
			title: 'Warning',
			type: 'Message',
			state: 'Warning',
			content: new sap.m.Text({
				text: message
			}),
			beginButton: new sap.m.Button({
				text: 'OK',
				press: function() {
					dialog.close();
				}
			}),
			afterClose: function() {
				dialog.destroy();
			}
		});

		dialog.open();
	}
	},
	checkCargoCancelRequest: function(oRequest, modid) {
		for (var i = 0; i < oRequest.ZE2E_REQ_STATUSSet.results.length; i++) {
			if (oRequest.ZE2E_REQ_STATUSSet.results[i].ZZ_MODID == modid &&
				oRequest.ZE2E_REQ_STATUSSet.results[i].ZZ_ACTION == "09" &&
				oRequest.ZE2E_REQ_STATUSSet.results[i].ZZ_TRV_REQ == oRequest.ZZ_TRV_REQ) {
				return true;
			}
		}
		return false;
	},
	generateEMPChangeActions: function(oRequest) {
		// Get the current date and current row data
		var curDate = new Date();
		var deputationStartDate = new Date(oRequest.ZZ_DEP_STDATE.substr(0, 4),
			oRequest.ZZ_DEP_STDATE.substr(4, 2) - 1,
			oRequest.ZZ_DEP_STDATE.substr(6, 2));
		var deputationEndDate = new Date(oRequest.ZZ_DEP_ENDATE.substr(0, 4),
			oRequest.ZZ_DEP_ENDATE.substr(4, 2) - 1,
			oRequest.ZZ_DEP_ENDATE.substr(6, 2));
		// Consider deputation request
		if (oRequest.ZZ_REQ_TYP == "DEPU") {
			//      changeSubMenu.removeAllItems();

			//      var requestMenu = new sap.ui.unified.MenuItem();
			//      requestMenu.setText("Request");
			//      requestMenu.setIcon("sap-icon://request");
			//      changeSubMenu.addItem(requestMenu);
			//      var requestMenuList = new sap.ui.unified.Menu({
			//      itemSelect: function(evt){
			//      oHomeThis.onEMPChangeClick(evt);
			//      }
			//      });
			//      requestMenu.setSubmenu(requestMenuList);

			//      var otherMenu = new sap.ui.unified.MenuItem();
			//      otherMenu.setText("Upload");
			//      otherMenu.setIcon("sap-icon://documents");
			//      var otherMenuList = new sap.ui.unified.Menu({
			//      itemSelect: function(evt){
			//      oHomeThis.onEMPChangeClick(evt);
			//      }
			//      });
			//      otherMenu.setSubmenu(otherMenuList);

			//      // Define all the possible menus
			//      var eDock = sap.ui.core.Popup.Dock;

			// Before deputation
			// change dates menu
			//      var oChangeDate = new sap.ui.unified.MenuItem();
			//      oChangeDate.setText("Change dates");
			//      oChangeDate.setIcon("sap-icon://calendar");
			//      // change dependents menu
			//      var oChangeDepes = new sap.ui.unified.MenuItem();
			//      oChangeDepes.setText("Change dependents");
			//      oChangeDepes.setIcon("sap-icon://group");

			//      // On deputation
			//      // change end date menu
			//      var oChangeEDate = new sap.ui.unified.MenuItem();
			//      oChangeEDate.setText("Extend date");
			//      oChangeEDate.setIcon("sap-icon://expand");
			//      // change kid menu
			//      var oChangeKid = new sap.ui.unified.MenuItem();
			//      oChangeKid.setText("Add new born kid");
			//      oChangeKid.setIcon("sap-icon://calendar");
			//      // change family accompany menu
			//      var oChangeFamily = new sap.ui.unified.MenuItem();
			//      oChangeFamily.setText("Change family accompany");
			//      oChangeFamily.setIcon("sap-icon://group");
			//      // change family accompany returning date menu
			//      var oChangeFamilyReturn = new sap.ui.unified.MenuItem();
			//      oChangeFamilyReturn.setText("Change family return date");
			//      oChangeFamilyReturn.setIcon("sap-icon://calendar");

			//      // uploading new visa when on deputation
			//      var oChangeUploadVisa = new sap.ui.unified.MenuItem();
			//      oChangeUploadVisa.setText("Upload Visa Copies");
			//      oChangeUploadVisa.setIcon("sap-icon://upload");
			//      // uploading additional docs
			//      var oChangeUploadAdditional = new sap.ui.unified.MenuItem();
			//      oChangeUploadAdditional.setText("Upload Additional Documents");
			//      oChangeUploadAdditional.setIcon("sap-icon://document");

			//      //Insurance
			//      var iIndex = sap.ui.project.e2etm.util.StaticUtility.getArrayIndex(oRequest.ZE2E_REQ_STATUSSet.results,"ZZ_MODID","INSR");
			//      if(iIndex != -1){
			//      if( (oRequest.ZE2E_REQ_STATUSSet.results[iIndex].ZZ_ACTION == '00' && oRequest.ZE2E_REQ_STATUSSet.results[iIndex].ZZ_NROLE == "01" ) ||
			//      (oRequest.ZE2E_REQ_STATUSSet.results[iIndex].ZZ_ACTION == '02' && oRequest.ZE2E_REQ_STATUSSet.results[iIndex].ZZ_NROLE == "03")){
			//      var oChangeInsurance = new sap.ui.unified.MenuItem();
			//      oChangeInsurance.setText("Insurance");
			//      oChangeInsurance.setIcon("sap-icon://insurance-life");
			//      changeSubMenu.addItem(oChangeInsurance);
			//      }
			//      }

			//      //  Cargo
			//      var iOnward = sap.ui.project.e2etm.util.StaticUtility.getArrayIndex(oRequest.ZE2E_REQ_STATUSSet.results,"ZZ_MODID","CARO");
			//      var iReturn = sap.ui.project.e2etm.util.StaticUtility.getArrayIndex(oRequest.ZE2E_REQ_STATUSSet.results,"ZZ_MODID","CARR");
			//      if( iOnward != -1 || iReturn != -1 ){
			//      var currentDate = new Date();
			//      var dateBeforeStarDate = sap.ui.project.e2etm.util.StaticUtility.substractDate(oRequest.ZZ_DEP_STDATE,currentDate);
			//      if(Number(oRequest.ZZ_DEP_DAYS) >= Number(sap.ui.getCore().getModel("global").getData().timeActiveCargo) && 
			//      Number(dateBeforeStarDate) > Number(sap.ui.getCore().getModel("global").getData().DurStartDate) && 
			//      sap.ui.getCore().getModel("global").getData().ZZ_TRV_KEY =="DEPU"){
			//      var oChangeCargo = new sap.ui.unified.MenuItem();
			//      oChangeCargo.setText("Cargo");
			//      oChangeCargo.setIcon("sap-icon://cargo-train");
			//      changeSubMenu.addItem(oChangeCargo);

			//      //Change Cargo List
			//      var oChangeCargoList = new sap.ui.unified.Menu({
			//      itemSelect: function(evt){
			//      oHomeThis.onEMPChangeClick(evt);
			//      }
			//      });
			//      oChangeCargo.setSubmenu(oChangeCargoList);

			//      if( iOnward != -1 ){
			//      //Onward
			//      var oChangeOnward = new sap.ui.unified.MenuItem();
			//      oChangeOnward.setText("Onward");
			//      oChangeOnward.setIcon("sap-icon://contacts");
			//      oChangeCargoList.addItem(oChangeOnward);
			//      }

			//      if( iReturn != -1 ){
			//      //Return
			//      var oChangeReturn = new sap.ui.unified.MenuItem();
			//      oChangeReturn.setText("Return");
			//      oChangeReturn.setIcon("sap-icon://cargo-train");
			//      oChangeCargoList.addItem(oChangeReturn);
			//      }
			//      }
			//      }

			sap.ui.getCore().byId("lnkChangeDate").setText("Change Dates");
			// Domestic scenario
			if (oRequest.ZZ_DEP_TYPE == "DOME") {
				// Before deputation
				if (curDate < deputationStartDate) {
					//          requestMenuList.addItem(oChangeDate);
					sap.ui.getCore().byId("lnkChangeDate").setEnabled(true);
				} else { // On deputation
					//          requestMenuList.addItem(oChangeEDate);
					sap.ui.getCore().byId("lnkChangeEndDate").setEnabled(true);
				}
			} else { // International scenario
				//        changeSubMenu.addItem(otherMenu);
				// Before deputation
				if (curDate < deputationStartDate) {
					//          requestMenuList.addItem(oChangeDate);
					sap.ui.getCore().byId("lnkChangeDate").setEnabled(true);
					/*Start-Date change Issue*/
					this.checkChangeInDatesLink(oRequest);
					/*End-Date change Issue*/
					//          if (oRequest.ZZ_TRV_CAT != "TRNG") {/*Original code commented for Date change requirements*/
					////            requestMenuList.addItem(oChangeDepes);
					//            sap.ui.getCore().byId("lnkChangeDepes").setEnabled(true);
					//            sap.ui.getCore().byId("lnkChangeDepes").setText("Amend request to Change accompanying Family");
					//          }
				} else { // On deputation
					//          requestMenuList.addItem(oChangeEDate);
					sap.ui.getCore().byId("lnkChangeEndDate").setEnabled(true);
					if (oRequest.ZZ_TRV_CAT != "TRNG") {
						//            requestMenuList.addItem(oChangeKid);
						//            requestMenuList.addItem(oChangeFamily);
						//            requestMenuList.addItem(oChangeFamilyReturn);
						sap.ui.getCore().byId("lnkNewBornKid").setEnabled(true);
						/*Start-Date change Issue*/
						this.checkChangeInDatesLink(oRequest);
						/*End-Date change Issue*/
						//            sap.ui.getCore().byId("lnkChangeDepes").setEnabled(true);
						//            sap.ui.getCore().byId("lnkChangeDepes").setText("Change family accompany(while on deputation)");
						sap.ui.getCore().byId("lnkChangeFamilyReturn").setEnabled(true);
					}
				}
				/*---------------Start-Commented as per the change*/
				//        if (oRequest.ZZ_TRV_REQ != "0000000000" && oRequest.ZZ_TRV_REQ != null && oRequest.ZZ_TRV_REQ != "") {
				//          sap.ui.getCore().byId("lnkUploadVisaCopies").setEnabled(true);
				//        }
				/*---------------End-Commented as per the change*/
				sap.ui.getCore().byId("lnkUploadAdditionalDocs").setEnabled(true);
			}
			//      return changeSubMenu;
		} else {
			sap.ui.getCore().byId("lnkChangeDate").setEnabled(true);
			sap.ui.getCore().byId("lnkChangeDate").setText("Change");
		}
	},
	generateEMPCreateActions: function(oRequest) {
		
		
		if (oRequest.ZZ_ASG_TYP == "STA" || oRequest.ZZ_ASG_TYP == "NC") {
			sap.ui.getCore().byId("lnkHomeTrip").setEnabled(false);

		}
		var trvCheck = false;
		var staCheck = false;
		if (sap.ui.project.e2etm.util.StaticUtility.checkStvaAsg(oRequest.ZZ_ASG_TYP) &&
			oRequest.ZZ_PE_NPE == "X") {
			trvCheck = true;
		}

		if (oRequest.ZZ_ASG_TYP == "STA" || oRequest.ZZ_ASG_TYP == "STAPP") {
			staCheck = true;
		}

		//    if (oRequest.ZZ_TRV_CAT != "TRFR") {
		if (trvCheck) {
			sap.ui.project.e2etm.util.StaticUtility.checkTravelCreation(oRequest, sap.ui.getCore().byId("lnkSecondary"));
		} else if (staCheck) {
			sap.ui.getCore().byId("lnkSecondary").setEnabled(true);
		} else {
			sap.ui.getCore().byId("lnkSecondary").setEnabled(true);
		}

		if (oRequest.ZZ_DEP_TYPE == "INTL") {
			var bEmergency = false;
			var aList = sap.ui.getCore().getModel("global").getData().deputationList;
			for (var i = 0; i < aList.length; i++) {
				if (aList[i].ZZ_REQ_TYP == "EMER" &&
					aList[i].ZZ_STAT_FLAG != "FF001" &&
					aList[i].ZZ_DEP_REQ.replace(/^0+/, '') == oRequest.ZZ_TRV_REQ.replace(/^0+/, '')) {
					bEmergency = true;
					break;
				}
			}
			if (!bEmergency) {
				if (trvCheck) {
					sap.ui.project.e2etm.util.StaticUtility.checkTravelCreation(oRequest, sap.ui.getCore().byId("lnkEmergency"));
				} else if (staCheck) {
					sap.ui.getCore().byId("lnkEmergency").setEnabled(true);
				} else {
					sap.ui.getCore().byId("lnkEmergency").setEnabled(true);
				}
			}
		}

		if (parseInt(oRequest.ZZ_DEP_DAYS) > parseInt(sap.ui.getCore().getModel("global").getData().intlDuration) &&
			oRequest.ZZ_DEP_TYPE == "INTL" && oRequest.ZZ_ASG_TYP != "NC") {
			if (oRequest.ZZ_ASG_TYP == "STA" || oRequest.ZZ_ASG_TYP == "STAPP") {
				sap.ui.getCore().byId("lnkHomeTrip").setEnabled(true);
				return;
			}
			var aList = sap.ui.getCore().getModel("global").getData().deputationList;
			var bHome = false;
			for (var i = 0; i < aList.length; i++) {
				if (aList[i].ZZ_REQ_TYP == "HOME" &&
					aList[i].ZZ_DEP_REQ.replace(/^0+/, '') == oRequest.ZZ_TRV_REQ.replace(/^0+/, '')) {
					bHome = true;
					break;
				}
			}
			if (!bHome) {
				if (trvCheck) {
					sap.ui.project.e2etm.util.StaticUtility.checkTravelCreation(oRequest, sap.ui.getCore().byId("lnkHomeTrip"));
				} else {
					sap.ui.getCore().byId("lnkHomeTrip").setEnabled(true);
				}
			}
		}
		//    }
	},

	/*------------------------CUSTOM FUNCTION AREA END------------------------*/

	/*------------------------USER EVENT HANDLER AREA BEGIN------------------------*/
	// BUTTON TO VIEW CUSTOMER DIALOG
	onViewCustomer: function(evt) {
		// display popup
		if (oHomeThis.customerDialog) {
			oHomeThis.customerDialog.destroy();
		}
		// instantiate the Fragment if not done yet
		oHomeThis.customerDialog = sap.ui.xmlfragment("sap.ui.project.e2etm.fragment.common.TravelCustomerDialog", oHomeThis);
		oHomeThis.customerDialog.open();
		var model = new sap.ui.model.json.JSONModel();
		if (sap.ui.getCore().getModel("profile").getData().currentRole == "CTG") {
			var data = sap.ui.getCore().byId("flexboxCTGMyTaskDetail").getModel("myCTGSelectedTaskModel").getData();
		} else {
			var data = sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData();
		}

		var bindData = {};
		bindData.ZZ_CCDEPT = data.ZZ_CCDEPT;
		bindData.ZZ_CCOST = data.ZZ_CCOST;
		bindData.ZZ_CCNAME = data.ZZ_CCNAME;
		bindData.ZZ_CLENTY = data.ZZ_CLENTY;
		//bindData.ZZ_EANO = data.ZZ_EANO;
		bindData.ZZ_PONO = data.ZZ_PONO;
		//start added by UEA6KOR_14.03.2019 McrNonMcr
		bindData.ZZ_TASKID = data.ZZ_TASKID;	
		bindData.ZZ_TASKDESC = data.ZZ_TASKDESC;	
		bindData.ZZ_RESOURCEID = data.ZZ_RESOURCEID;	
		bindData.ZZ_RESOUCESDESC = data.ZZ_RESOUCESDESC;	
		bindData.ZZ_RESOURCETYP = data.ZZ_RESOURCETYP;	
		//end added by UEA6KOR_14.03.2019 McrNonMcr			
		model.setData(bindData);

		sap.ui.getCore().byId("dialogTravelCustomer").setModel(model);
		sap.ui.getCore().byId("dialogTravelCustomer").bindElement("/");
	},
	// BUTTON TO VIEW CUSTOMER DIALOG

	// BUTTON TO CLOSE CUSTOMER DIALOG
	onCloseCustomerDialog: function(evt) {
		try {
			oHomeThis.customerDialog.close();
		} catch (exc) {}
	},

	// BUTTON TO CLOSE TRIP DIALOG
	onCloseTripDialog: function(curEvt) {
		curEvt.getSource().getParent().close();
	},

	// BUTTON TO REFRESH HOME PAGE
	onRefreshData: function(evt) {
		sap.ui.project.e2etm.util.StaticUtility.setBusy(true, oHomeThis);
		oHomeThis.bindDataBasedOnRole();
	},

	// EVENT CHANGE TAB IN HOME PAGE
	handleSelectTab: function(curEvt) {
		curEvt.preventDefault();
		if (curEvt.getSource().getSelectedIndex() == 2) {
			oHomeThis.getView().byId("flexBoxCountrySpecificGuideLines").setBusy(true);
			// Call service to get the countries specific
			// Display available countries
			var get = $.ajax({
				cache: false,
				url: sServiceUrl + "CtrySpecGuidelinesSet?$format=json",
				type: "GET"
			});
			get.done(function(result) {
				if (result != null) {
					var model = new sap.ui.model.json.JSONModel();
					model.setData(result.d.results);
					oHomeThis.getView().byId("sltCountry").setModel(model);
					oHomeThis.getView().byId("sltCountry").bindItems("/", new sap.ui.core.Item({
						key: '{CountryKey}',
						text: '{CountryName}',
						tooltip: '{CountryName}'
					}));

					if (result.d.results[0].CountryKey == "IN" || result.d.results[0].CountryKey == "DE") {
						oHomeThis.getView().byId("flagCountry").setSrc("images/country_gif/" + result.d.results[0].CountryKey + ".gif");
					}

					var get = $.ajax({
						cache: false,
						url: sServiceUrl + "CtrySpecLocsSet?$filter=CountryKey eq '" + result.d.results[0].CountryKey + "'&$format=json",
						type: "GET"
					});
					get.done(function(result) {
						if (result != null) {
							var model = new sap.ui.model.json.JSONModel();
							model.setData(result.d.results);
							oHomeThis.getView().byId("sltLocation").setModel(model);
							oHomeThis.getView().byId("sltLocation").bindItems("/", new sap.ui.core.Item({
								key: '{Location}',
								text: '{Location}',
								tooltip: '{Location}'
							}));

							var get = $.ajax({
								cache: false,
								url: sServiceUrl + "CtrySpecDetsSet?$filter=CountryKey eq '" +
									oHomeThis.getView().byId("sltCountry").getSelectedKey() + "' and Location eq '" +
									result.d.results[0].Location + "'&$format=json",
								type: "GET"
							});
							get.done(function(result) {
								if (result.d.results.length == 1) {
									var model = new sap.ui.model.json.JSONModel();
									model.setData(result.d.results[0]);
									oHomeThis.getView().byId("flexBoxCountriesGuideLine").setModel(model);
								}
								oHomeThis.getView().byId("flexBoxCountrySpecificGuideLines").setBusy(false);
							});
						}
					});
				}
			});
		} else {
			var myRole = sap.ui.getCore().getModel("profile").getData().currentRole;
			var allData = null;

			if (myRole == "EMP" || myRole == null) {
				if (oHomeThis.myEmployeeTaskNumberofRows > 0) {
					sap.ui.getCore().byId("tableEmployeeMyTasks").clearSelection();
					sap.ui.getCore().byId("tableEmployeeMyTasks").setSelectedIndex(0);
				}
			} else if (myRole == "GRM") {
				if (oHomeThis.myManagerTaskNumberofRows > 0) {
					sap.ui.getCore().byId("tableManagerMyTasks").clearSelection();
					sap.ui.getCore().byId("tableManagerMyTasks").setSelectedIndex(0);
				}
				//Newly added code to Load data on select  
				this.bindDataBasedOnRole();
				//Newly added code to Load data on select        
			} else if (myRole == "ECO") {
				if (oHomeThis.myECOTaskNumberofRows > 0) {
					sap.ui.getCore().byId("tableECOMyTasks").clearSelection();
					sap.ui.getCore().byId("tableECOMyTasks").setSelectedIndex(0);
				}
			} else if (myRole == "TAX") {
				if (oHomeThis.myTAXTaskNumberofRows > 0) {
					sap.ui.getCore().byId("tableTAXMyTasks").clearSelection();
					sap.ui.getCore().byId("tableTAXMyTasks").setSelectedIndex(0);
				}
			} else if (myRole == "CTG") {
				if (oHomeThis.myCTGTaskNumberofRows > 0) {
					sap.ui.getCore().byId("tableCTGMyTasks").clearSelection();
					sap.ui.getCore().byId("tableCTGMyTasks").setSelectedIndex(0);
				}
			}
		}
	},

	// EVENT CHANGE COUNTRY IN COUNTRY SPECIFIC GUIDELINES TAB
	onCountryGuideLineChange: function(evt) {
		var key = oHomeThis.getView().byId("sltCountry").getSelectedKey();
		var get = $.ajax({
			cache: false,
			url: sServiceUrl + "CtrySpecLocsSet?$filter=CountryKey eq '" + key + "'&$format=json",
			type: "GET"
		});
		get.done(function(result) {
			if (result != null) {
				var model = new sap.ui.model.json.JSONModel();
				model.setData(result.d.results);
				oHomeThis.getView().byId("sltLocation").setModel(model);
				oHomeThis.getView().byId("sltLocation").bindItems("/", new sap.ui.core.Item({
					key: '{Location}',
					text: '{Location}',
					tooltip: '{Location}'
				}));

				var get = $.ajax({
					cache: false,
					url: sServiceUrl + "CtrySpecDetsSet?$filter=CountryKey eq '" +
						oHomeThis.getView().byId("sltCountry").getSelectedKey() + "' and Location eq '" +
						oHomeThis.getView().byId("sltLocation").getSelectedKey() + "'&$format=json",
					type: "GET"
				});
				get.done(function(result) {
					if (result.d.results.length == 1) {
						var model = new sap.ui.model.json.JSONModel();
						model.setData(result.d.results[0]);
						oHomeThis.getView().byId("flexBoxCountriesGuideLine").setModel(model);
					}
					sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
				});
			}
		});
	},
	// EVENT CHANGE LOCATION IN COUNTRY SPECIFIC GUIDELINES TAB
	onLocationGuideLineChange: function(evt) {
		sap.ui.project.e2etm.util.StaticUtility.setBusy(true, oHomeThis);
		var get = $.ajax({
			cache: false,
			url: sServiceUrl + "CtrySpecDetsSet?$filter=CountryKey eq '" +
				oHomeThis.getView().byId("sltCountry").getSelectedKey() + "' and Location eq '" +
				oHomeThis.getView().byId("sltLocation").getSelectedKey() + "'&$format=json",
			type: "GET"
		});
		get.done(function(result) {
			if (result.d.results.length == 1) {
				var model = new sap.ui.model.json.JSONModel();
				model.setData(result.d.results[0]);
				oHomeThis.getView().byId("flexBoxCountriesGuideLine").setModel(model);
			}
			sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
		});
	},

	// EVENT CHANGE SELECTED RECORD IN MYTASK TABLE.
	// SHOULD ONLY CALL THIS EVENT IF MYTASK TABLE HAS DETAILS PANEL ON RIGHT SIDE
	onMyTaskTableChange: function(evt) {
		if (evt.getSource().getSelectedIndex() == -1) {
			return;
		}
		try {
			sap.ui.project.e2etm.util.StaticUtility.setBusy(true, oHomeThis);
			var selectedModel = new sap.ui.model.json.JSONModel();
			// Get the  SPath of selected row   
			var sPath = evt.getParameter("rowContext").getPath();
			var tableName = "tableEmployeeMyTasks";
			var panelDetailsName = "flexboxEmployeeMyTaskDetail";
			var selectedModelName = "myEmployeeSelectedTaskModel";
			if (sap.ui.getCore().getModel("profile").getData().currentRole == "EMP") {
				tableName = "tableEmployeeMyTasks";
				panelDetailsName = "flexboxEmployeeMyTaskDetail";
				selectedModelName = "myEmployeeSelectedTaskModel";
			} else if (sap.ui.getCore().getModel("profile").getData().currentRole == "GRM") {
				tableName = "tableManagerMyTasks";
				panelDetailsName = "flexboxManagerMyTaskDetail";
				selectedModelName = "myManagerSelectedTaskModel";
			} else if (sap.ui.getCore().getModel("profile").getData().currentRole == "ECO") {
				tableName = "tableECOMyTasks";
				panelDetailsName = "flexboxECOMyTaskDetail";
				selectedModelName = "myECOrSelectedTaskModel";
			} else if (sap.ui.getCore().getModel("profile").getData().currentRole == "TAX") {
				tableName = "tableTAXMyTasks";
				panelDetailsName = "flexboxTAXMyTaskDetail";
				selectedModelName = "myTAXrSelectedTaskModel";
			} else if (sap.ui.getCore().getModel("profile").getData().currentRole == "CTG") {
				tableName = "tableCTGMyTasks";
				panelDetailsName = "flexboxCTGMyTaskDetail";
				selectedModelName = "myCTGrSelectedTaskModel";
			}

			sap.ui.getCore().byId(panelDetailsName).setVisible(true);
			selectedModel.setData(sap.ui.getCore().byId(tableName).getModel().getProperty(sPath));
			sap.ui.getCore().byId(panelDetailsName).setModel(selectedModel, selectedModelName);

			sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
		} catch (exc) {
			sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
		}
	},

	// View request details from My request/Team request/All request tabs
	onDeputationClick: function(curEvt) {
		var oRequest = curEvt.getSource().getModel().getProperty(curEvt.getSource().getBindingContext().getPath());
		this.navigateToDetailScreen(oRequest, "MR", false, "", false);
	},
	// View request details from DEPU My task tab
	onDeputationClickDEPUMyTask: function(curEvt) {
		var oRequest = curEvt.getSource().getModel().getProperty(curEvt.getSource().getBindingContext().getPath());
		this.navigateToDetailScreen(oRequest, "", false, "", false);
	},
	// View request details from Open Request Box
	onViewCurrentDepDetails: function(evt) {
		var index = sap.ui.getCore().byId("currentRequestRowRepeater").getCurrentPage() - 1;
		var selectedData = sap.ui.getCore().getModel("global").getData().openDeputationList[index];
		this.navigateToDetailScreen(selectedData, "", false, "", false);
	},
	// View request details from Employee dashboards
	onViewDepDetails: function(curEvt) {
		var selectedModel = sap.ui.getCore().byId("flexboxEmployeeMyTaskDetail").getModel("myEmployeeSelectedTaskModel");
		this.navigateToDetailScreen(selectedModel.getData(), "", false, "", false);
	},
	// View request details from Manager dashboards
	onManagerViewDepDetails: function(curEvt) {
		var selectedModel = sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel");
		 //########## 08 Apr 2020 UCD1KOR ##########/////
		if(selectedModel.getData().ZZ_REQ_TYP == "REPS"){
			oHomeThis.navigateToDetailScreen(selectedModel.getData(), "", false, "", false);
		}
		if(selectedModel.getData().ZZ_REQ_TYP == "CARR" || selectedModel.getData().ZZ_REQ_TYP == "CARO"){
			oHomeThis.navigateToDetailScreen(selectedModel.getData(), "", false, "", false);
		}
		if (selectedModel.getData().ZZ_REQ_TYP != "REIM" && selectedModel.getData().ZZ_REQ_TYP != "REPS" 
			&& selectedModel.getData().ZZ_REQ_TYP != "CARO" && selectedModel.getData().ZZ_REQ_TYP != "CARR") { //added by uml6kor cargo changes 7/11/2021
			oHomeThis.navigateToDetailScreen(selectedModel.getData(), "", false, "", false);
		} else {
			sap.ui.project.e2etm.util.StaticUtility.setBusy(true, oHomeThis);
			var reimAdminData = {};
			if (sap.ui.getCore().getModel("reimAdminData") != null) {
				reimAdminData = sap.ui.getCore().getModel("reimAdminData").getData();
			} else {
				reimAdminData.oData = {};
				var oModel = new sap.ui.model.json.JSONModel();
				sap.ui.getCore().setModel(oModel, "reimAdminData");
			}

			reimAdminData.oData.ZZ_OWNER = selectedModel.getData().ZZ_DEP_PERNR;
			reimAdminData.oData.TRV_HDR = {};
			reimAdminData.oData.TRV_HDR.ZZ_LAND1 = selectedModel.getData().ZZ_DEP_TOCNTRY;
			reimAdminData.oData.ZZ_COUNTRY_G = selectedModel.getData().ZZ_DEP_TOCNTRY;
			reimAdminData.oData.ZZ_TRV_KEY = "DEPU";
			reimAdminData.oData.ZZ_TRV_REQ = selectedModel.getData().ZZ_TRV_REQ;
			reimAdminData.oData.ZZ_VERSION = selectedModel.getData().ZZ_VERSION.trim();
			reimAdminData.oData.ZZ_VISA_PLAN = selectedModel.getData().ZZ_VISA_PLAN;

			sap.ui.getCore().getModel("reimAdminData").setData(reimAdminData);
			if(selectedModel.getData().ZZ_REQ_TYP != "REPS" 
				&& selectedModel.getData().ZZ_REQ_TYP != "CARO" && selectedModel.getData().ZZ_REQ_TYP != "CARR") { //added by uml6kor cargo changes 7/11/2021
			sap.ui.core.routing.Router.getRouter("MyRouter").navTo("reimbursement");
			}
		}
		
	},

	// EVENT ON CLICKING OF SAVE PROFILE IN PROFILE VIEW
	onSaveEmployeeDialog: function(evt) {
		sap.ui.project.e2etm.util.StaticUtility.onSaveEmployeeDialog(evt, this);
	},

	// EVENT ON CHANGE OF SERVICE TYPE DROPDOWNLIST
	onServiceTypeChange: function(evt) {
		var flexboxManagerMyTaskDetail = sap.ui.getCore().byId("flexboxManagerMyTaskDetail");
		var aData = flexboxManagerMyTaskDetail.getModel("myManagerSelectedTaskModel").getData();
		if (aData.ZZ_SERV_TYP == "SPCL") {
			sap.ui.getCore().byId("txtDurationService").setEnabled(true);
			sap.ui.getCore().byId("managerServiceConditionCheck").setVisible(true);
			sap.ui.getCore().byId("managerServiceConditionCheck").setEnabled(true);
			aData.ZZ_SRVTYP_MONTHS = "";
		} else {
			if (aData.ZZ_DEP_DAYS <= 90) {
				aData.ZZ_SRVTYP_MONTHS = "3";
			} else {
				aData.ZZ_SRVTYP_MONTHS = "6";
			}
			sap.ui.getCore().byId("txtDurationService").setEnabled(false);
			sap.ui.getCore().byId("managerServiceConditionCheck").setVisible(false);
			sap.ui.getCore().byId("managerServiceConditionCheck").setEnabled(false);
		}

		//    if ((aData.ZZ_ASG_TYP == "VA" || aData.ZZ_ASG_TYP == "VN") && 
		//        aData.ZZ_DEP_TYPE == "INTL") {
		//      aData.ZZ_SRVTYP_MONTHS = "24";
		//    }

		flexboxManagerMyTaskDetail.getModel("myManagerSelectedTaskModel").setData(aData);
	},

	// EVENT ON CHANGE OF ASSIGNMENT MODEL
	onAssignmentModelChange: function(evt) {
		var flexboxManagerMyTaskDetail = sap.ui.getCore().byId("flexboxManagerMyTaskDetail");
		var flexBoxTransferReason = sap.ui.getCore().byId("flexBoxTransferReason");
		/* Start-CGGS Changes */
		sap.ui.getCore().byId("cggsFlxBox").setVisible(false);
		/* End-CGGS Changes */
		var aData = flexboxManagerMyTaskDetail.getModel("myManagerSelectedTaskModel").getData();
		if (aData.ZZ_ASG_TYP == "TRFR" && aData.ZZ_DEP_TYPE == "DOME") {
			flexBoxTransferReason.setVisible(true);
		} else {
			flexBoxTransferReason.setVisible(false);
		}

		// Reset Service duration to 24 by default
		//    Cpmmented as per teh issue raised in HPALM
		//    if ((aData.ZZ_ASG_TYP == "VA" || aData.ZZ_ASG_TYP == "VN") && 
		//        aData.ZZ_DEP_TYPE == "INTL") {
		//      aData.ZZ_SRVTYP_MONTHS = "24";
		//    } else {
		if (aData.ZZ_SERV_TYP == "SPCL") {
			sap.ui.getCore().byId("txtDurationService").setEnabled(true);
			sap.ui.getCore().byId("managerServiceConditionCheck").setVisible(true);
			sap.ui.getCore().byId("managerServiceConditionCheck").setEnabled(true);
			aData.ZZ_SRVTYP_MONTHS = "";
		} else {
			if (aData.ZZ_DEP_DAYS <= 90) {
				aData.ZZ_SRVTYP_MONTHS = "3";
			} else {
				aData.ZZ_SRVTYP_MONTHS = "6";
			}
			sap.ui.getCore().byId("txtDurationService").setEnabled(false);
			sap.ui.getCore().byId("managerServiceConditionCheck").setVisible(false);
			sap.ui.getCore().byId("managerServiceConditionCheck").setEnabled(false);
		}
		//    }
		/* Start-CGGS Changes */
		this.getView().getModel("cggsmodel").getData().Asgtyp = aData.ZZ_ASG_TYP;
		/* End-CGGS Changes */
				
		
		// changes to family details 10/08/2016
		
		if (aData.ZZ_DEP_TOCNTRY_TXT == "Germany") {
			if (aData.ZZ_ASG_TYP == "STA") {
				sap.ui.getCore().byId("cbSponsorByCompany").setSelectedKey("");
				/* Start-CGGS Changes */
				var cggsFlag = sap.ui.project.e2etm.util.StaticUtility.visibleCggsData(aData.ZZ_TRV_REQ, aData.ZZ_DEP_TOCNTRY, aData.ZZ_ASG_TYP,
					aData.ZZ_REQ_TYP, aData.ZZ_TRV_CAT, aData.ZZ_VREASON, aData.ZZ_VREASON_EX);//uea6kor-uml6kor 27/8/2020 added RBEIITAPPPIPELINE-217  for Extension date 
				sap.ui.getCore().byId("cggsFlxBox").setVisible(cggsFlag);
				/* End-CGGS Changes */
			} else if (aData.ZZ_ASG_TYP == "VA" || aData.ZZ_ASG_TYP == "VN") {
				sap.ui.getCore().byId("cbSponsorByCompany").setSelectedKey("X");
			} else {
				sap.ui.getCore().byId("cbSponsorByCompany").setSelectedKey("");
			}
		}
		//start by uml6kor _New Policy_ 13/6/2019
		 if (aData.ZZ_ASG_TYP == "STX"  ) {
			sap.ui.getCore().byId("cbSponsorByCompany").setSelectedKey("");
			sap.ui.getCore().byId("cbSponsorByCompany").setEnabled(false);
				
		}else if ( aData.ZZ_ASG_TYP == "LTX" || aData.ZZ_ASG_TYP == "NCX" ) {
			sap.ui.getCore().byId("cbSponsorByCompany").setSelectedKey("X");
			sap.ui.getCore().byId("cbSponsorByCompany").setEnabled(false);
			}//end by uml6kor _New Policy_ 13/6/2019
		
		if (aData.ZZ_ASG_TYP == "STVA") {
			if (Number(aData.ZZ_DEP_DAYS) >= 395) {
				sap.ui.getCore().byId("cbSponsorByCompany").setSelectedKey("X");
			} else {
				sap.ui.getCore().byId("cbSponsorByCompany").setSelectedKey("");
			}
		}
		if (aData.ZZ_ASG_TYP == "NC") {
			sap.ui.getCore().byId("cbSponsorByCompany").setSelectedKey("");
			sap.ui.getCore().byId("cbSponsorByCompany").setEnabled(false);
			sap.ui.getCore().byId("cbServiceCon1").setEnabled(false);
			sap.ui.getCore().byId("cbServiceCon1").setSelectedKey("NORM");
			aData.ZZ_SRVTYP_MONTHS = "6";
			sap.ui.getCore().byId("txtDurationService").setEnabled(false);
		} else if (aData.ZZ_ASG_TYP == "STA") {
			sap.ui.getCore().byId("cbSponsorByCompany").setSelectedKey("");
			sap.ui.getCore().byId("cbSponsorByCompany").setEnabled(false);
		} else if (aData.ZZ_ASG_TYP == "VA" || aData.ZZ_ASG_TYP == "VN") {
			sap.ui.getCore().byId("cbSponsorByCompany").setSelectedKey("X");
			sap.ui.getCore().byId("cbSponsorByCompany").setEnabled(false);
		}

		sap.ui.project.e2etm.util.StaticUtility.fetchCGGSChecklistForms(aData, sap.ui.getCore().byId("grmCggsChecklist--cggsFormsDisplay"));

		//changes to family details
		flexboxManagerMyTaskDetail.getModel("myManagerSelectedTaskModel").setData(aData);
	},

	// EVENT ON CLICKING OF CANCEL BUTTON (OPEN DIALOG)
	onCancelEMPRequest: function(oRequest) {
		var globaData = sap.ui.getCore().getModel("global").getData();
		globaData.requestCancel = "";
		globaData.requestCancelModule = "";
		globaData.requestCancel = oRequest.ZZ_DEP_REQ;
		globaData.requestCancelModule = oRequest.ZZ_REQ_TYP;
		globaData.requestCancelTimeStamp = oRequest.ZZ_TIMESTAMP;
		sap.ui.getCore().getModel("global").setData(globaData);
		// Start of chages by VAB6KOR to display the information message when dates are in the past for cancel request 
				
		var cancelFlag = sap.ui.project.e2etm.util.Formatter.cancelEmployeeRequestButton(
			oRequest.ZZ_DEP_REQ, oRequest.ZZ_DEP_TYPE, oRequest.ZZ_TRV_REQ,
			oRequest.ZZ_REQ_TYP, oRequest.ZZ_STAT_FLAG, oRequest.ZZ_STAGE,
			oRequest.ZZ_SET, oRequest.ZZ_SUBSUBSET, oRequest.ZZ_DEP_STDATE, oRequest.ZZ_DEP_ENDATE);
		
		///////////////////UEA6KOR_10.6.2020 CancelRequest changes////////////////////////
		
		   var filterUrl = sServiceUrl+ "TravelPlanCancelFlag?&TravelPlan='"+globaData.ZZ_TRV_REQ+"'&$format=json" ;
		  	var get = $.ajax({
				cache: false,
				url: filterUrl, 
				type: "GET",
				dataType: 'json',
				async: false
			});

			var data_flag = '';
		       get.done(function(result) {
				data_flag = result.d.TravelPlanCancelFlag.TPCancelFlag;	
				sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);

			});

				get.fail(function(err) {
			sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
		});
		
		
		////////////////////UEA6KOR_10.6.2020 CancelRequest changes////////////////////////
		
		if (sap.ui.getCore().getModel("profile").getData().currentRole == "EMP" && cancelFlag && data_flag == "X" && sap.ui.project.e2etm.util.StaticUtility.checkDateInPast(
				oRequest.ZZ_DEP_ENDATE)) {
			///################ UCD1KOR 16 July 2021 Changes #############//////
			var text =  "You are about to cancel your travel." +" "+ "\n";
			var text1 ="As certain cost has been marked against your travel already, Kindly drop an email to the below stakeholders." +" "+ "\n";
				
			sap.m.MessageBox.show(
					text + text1 + "RBEI-Travel Settlement (CF/GSA2-IN).", {
					icon: sap.m.MessageBox.Icon.INFORMATION,
					title: "Information",
					actions: [sap.m.MessageBox.Action.CLOSE],
					onClose: function(oAction) {
						/ * do something * /
					}
				}
			);
		} else {
			// End of Changes by VAB6KOR to display the information message when dates are in the past for cancel Request
			// display popup
			if (oHomeThis.oCommonDialog) {
				oHomeThis.oCommonDialog.destroy();
			}
			// instantiate the Fragment if not done yet

			oHomeThis.oCommonDialog = sap.ui.xmlfragment("sap.ui.project.e2etm.fragment.common.CancelDialog", oHomeThis);

			oHomeThis.oCommonDialog.open();
		}
	},
	// EVENT ON CLICKING OF CANCEL BUTTON (BUTTON INSIDE DIALOG)
	onCancelRequestButtonClick: function(curEvt) {
		var globaData = sap.ui.getCore().getModel("global").getData();
		// Validate comment field
		if (sap.ui.getCore().byId("txtCancelRequestComment").getValue().trim() == "" ||
			sap.ui.getCore().byId("txtCancelRequestComment").getValue() == null) {
			sap.ca.ui.message.showMessageBox({
				type: sap.ca.ui.message.Type.ERROR,
				message: "Please give some comments",
				details: "Please give some comments"
			});
			return;
		}

		// Call backend service to cancel the request
		if (sap.ui.getCore().getModel("global").getData().requestCancelModule == 'DEPU') {
			var get = $.ajax({
				cache: false,
				url: sServiceUrl + "Cancel?DepReq='" + globaData.requestCancel + "'&Role='" +
					sap.ui.getCore().getModel("profile").getData().currentRole + "'&Comment='" +
					sap.ui.getCore().byId("txtCancelRequestComment").getValue() + "'&Module='" + globaData.requestCancelModule +
					"'&Button='Cancel'",
				type: "GET"
			});
		} else {
			var get = $.ajax({
				cache: false,
				url: sServiceUrl + "TravelCancel?ZZ_COMMENTS='" + sap.ui.getCore().byId("txtCancelRequestComment").getValue() +
					"'&ZZ_MGR_PERNR='" + sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_PERNR +
					"'&ZZ_REINR='" + globaData.requestCancel +
					"'&ZZ_ROLE='" + sap.ui.getCore().getModel("profile").getData().currentRole +
					"'&ZZ_TTYPE='" + globaData.requestCancelModule +
					"'&ZZ_TIMESTAMP='" + globaData.requestCancelTimeStamp + "'",
				type: "GET"
			});
		}
		get.done(function(result, response, header) {
			oHomeThis.oCommonDialog.close();
			oHomeThis.bindDataBasedOnRole();
			if (sap.ui.getCore().getModel("profile").getData().currentRole == "EMP") {
				sap.m.MessageToast.show("Cancellation requested successfully!");
			} else {
				sap.m.MessageToast.show("Request cancelled successfully!");
			}
		});
	},
	
///######### UCD1KOR 04 May 2020 ###########// Service call check start
	
	serviceCheck:function(Action){
		var that= this;
		var aData = sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData()
		sap.ui.core.BusyIndicator.show(1);
		var EmpNo = sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_PERNR;
		var filterUrl = sServiceUrl+ "ApproveTrapStatus/?Reinr='"+aData.ZZ_TRV_REQ+"'&Version='"+aData.ZZ_VERSION.trim()+"'&Action='"+Action+"'&Modid='"+aData.ZZ_REQ_TYP+"'&MgrPernr='"+EmpNo+"'";
		var get = $.ajax({
			cache: false,
			url: filterUrl, 
			type: "GET",
			dataType: 'json',
			async: false
		});
		var data = '';
		get.done(function(result) {
			data = result;	
			that.ApproveTrapStatus = data.d.ApproveTrapStatus.ApprvFlag;
			sap.ui.core.BusyIndicator.hide();
			
		});
		get.fail(function(err) {
			sap.ui.core.BusyIndicator.hide();
		});
	},

	// MANAGER WORKFLOW EVENTS
	onSentBackForChange: function(curEvt) {
		/*Changes done for VISA*/
		var item = oHomeThis.getSelectedRow();
		if (item) {
			oHomeThis.updateVisaDetails(item, "02", "02");
		} else {
			/*Changes done for VISA*/
			//#### UCD1KOR 04 May 2020 Approval service check
			var aData = sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData();
			if(aData.ZZ_REQ_TYP =="BUSR" || aData.ZZ_REQ_TYP =="SECO"|| aData.ZZ_REQ_TYP =="HOME" || aData.ZZ_REQ_TYP =="EMER" || (aData.ZZ_REQ_TYP =="DEPU" && aData.ZZ_TRV_REQ != "0000000000") ){
					var Action = "02"
					this.serviceCheck(Action);
					if(this.ApproveTrapStatus ==""){
						oHomeThis.managerAction('003', "Successfully Sent for changes");
					}
					else{
						sap.m.MessageBox.information("Request already Approved .Please refresh the screen");
					}
			}
			else{
				oHomeThis.managerAction('003', "Successfully Sent for changes");
			}
			
			
		}
	},
	onApproveRequest: function(curEvt) {
		/*Changes done for VISA*/
		var item = oHomeThis.getSelectedRow();
		if (item) {
			oHomeThis.updateVisaDetails(item, "02", "03");
		} else {
			/*Changes done for VISA*/
			//#### UCD1KOR 04 May 2020 Approval service check
			var aData = sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData();
			if(aData.ZZ_REQ_TYP =="BUSR" || aData.ZZ_REQ_TYP =="SECO"|| aData.ZZ_REQ_TYP =="HOME" || aData.ZZ_REQ_TYP =="EMER" || (aData.ZZ_REQ_TYP =="DEPU" && aData.ZZ_TRV_REQ != "0000000000") ){
					var Action = "03"
				this.serviceCheck(Action);
				if(this.ApproveTrapStatus ==""){
					oHomeThis.managerAction('001', "Successfully Approved");
				}
				else{
					sap.m.MessageBox.information("Request already Approved .Please refresh the screen");
				}
			}
			else{
				oHomeThis.managerAction('001', "Successfully Approved"); 
				//added by uea6kor_18.11.2020 for inland deputation CL generation
				/*if(aData.checkFlag != "X"){
					if (aData.ZZ_DEP_TYPE =="DOME" && aData.ZZ_REQ_TYP =="DEPU"){
						this.generateCL();
						oHomeThis.deputationAction('006', "Successfully Approved and CL generated");
					}
				}*/
				
				//added by uea6kor_18.11.2020 for inland deputation CL generation
				
			}
			
		}
	},
	updateVisaDetails: function(oData, role, action) {

		var results = {};
		sap.ui.project.e2etm.util.StaticUtility.setBusy(true, oHomeThis);

		var pernr = oData.ZZ_DEP_PERNR;

		var comments = sap.ui.getCore().byId("flexboxManagerMyTaskDetail").
		getModel("myManagerSelectedTaskModel").getData().ZZ_NEW_COMMENTS;

		results = {
			ZZ_PERNR: pernr,
			ZZ_VERSION: oData.ZZ_VERSION, //save 0 Submit Sent from back end
			ZZ_VISA_REQ: oData.ZZ_TRV_REQ, //from back end
			ZZ_OFF_NUM: '', //
			ZZ_VISA_TOCNTRY: '', //
			ZZ_VISA_TYP: '', //
			ZZ_VISA_PSDATE: '', // from date
			ZZ_VISA_PEDATE: '', //end date
			ZZ_VISA_NO: '', // entered by visa admin
			ZZ_VISA_SDATE: '', //entered by visa admin
			ZZ_VISA_EDATE: '', //entered by visa admin
			ZZ_COMMENTS: comments
		};

		results.BVISA_HDR_TO_COST_ASGN = [];
		//    for(var i= 0;i<oData.BVISA_HDR_TO_COST_ASGN.results.length;i++){
		results.BVISA_HDR_TO_COST_ASGN.push({
			ZZ_PERNR: '',
			ZZ_DEP_REQ: '',
			ZZ_REINR: '',
			ZZ_VERSION: '',
			//      ZZ_PERCENT:'',
			ZZ_KOSTL: '',
			ZZ_FISTL: '',
			ZZ_FIPOS: '',
			ZZ_WAERS: '',
			ZZ_FIPEX: '',
			ZZ_POSNR: '',
			ZZ_GEBER: '',
			ZZ_VKM: '',
			ZZ_CCNAME: '',
			ZZ_CCDEPT: '',
			ZZ_EANO: '',
			ZZ_CCOST: '',
			ZZ_PONO: '',
			ZZ_CLENTY: '',
		});
		//    }
		var oDataModel = new sap.ui.model.odata.ODataModel(sServiceUrl);

		oDataModel.setHeaders({
			role: role,
			action: action
		});
		oDataModel.create("ZE2E_BVISA_HDRSet", results, null, function(oData, response) {
			sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
			sap.m.MessageToast.show("Updated Successfully", {
				duration: 10000,
				closeOnBrowserNavigation: false
			});
			oHomeThis.bindDataBasedOnRole();
		}, function(error) {
			sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
			sap.m.MessageToast.show("Internal Server Error");
		});

	},
	getSelectedRow: function() {
		var data = sap.ui.getCore().getModel("global").getData();
		var item;
		var rowIndex = sap.ui.getCore().byId("tableManagerMyTasks").getSelectedIndex();
		var actualRow = rowIndex;
		if (rowIndex >= sap.ui.getCore().byId("tableManagerMyTasks").getVisibleRowCount()) {
			rowIndex = Math.floor(rowIndex % sap.ui.getCore().byId("tableManagerMyTasks").getVisibleRowCount());
		}
		
		//var reqTyp = sap.ui.getCore().byId("tableManagerMyTasks").getBinding().oList[rowIndex].ZZ_REQ_TYP;//sap.ui.getCore().byId("tableEmployeeMyTasks").getRows()[rowIndex].getCells()[0].getText(); /*Added by uea6kor_uml6kor_upgrade 6.12.2019 and commented below line*/
		
		var reqTyp = sap.ui.getCore().byId("tableManagerMyTasks").getRows()[rowIndex].getCells()[0].getText();
		if (reqTyp == "VISA") {
			var items = sap.ui.getCore().byId("tableManagerMyTasks").getBinding("rows").oList;;
			item = items[actualRow];
		}
		return item;

	},
	onRejectRequest: function(curEvt) {
		/*Changes done for VISA*/
		var item = oHomeThis.getSelectedRow();
		if (item) {
			oHomeThis.updateVisaDetails(item, "02", "08");
		} else {
			/*Changes done for VISA*/
			//#### UCD1KOR 04 May 2020 Approval service check
			var aData = sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData();
			if(aData.ZZ_REQ_TYP =="BUSR" || aData.ZZ_REQ_TYP =="SECO"|| aData.ZZ_REQ_TYP =="HOME" || aData.ZZ_REQ_TYP =="EMER" || (aData.ZZ_REQ_TYP =="DEPU" && aData.ZZ_TRV_REQ != "0000000000") ){
				var Action = "08"
				this.serviceCheck(Action);
				
				if(this.ApproveTrapStatus ==""){
					oHomeThis.managerAction('002', "Request rejected");
				}
				else{
					sap.m.MessageBox.information("Request already Approved .Please refresh the screen");
				}
			}
			else{
				oHomeThis.managerAction('002', "Request rejected");
			}
			
		}
	},
	onApproveCancelRequest: function(evt) {
		// Validate comment field
		var sComment = "";
		var sMyTask = "";
		var sModel = "";
		if (sap.ui.getCore().getModel("profile").getData().currentRole == "GRM") {
			sComment = "textAreaManagerComment";
			sMyTask = "flexboxManagerMyTaskDetail";
			sModel = "myManagerSelectedTaskModel";
		} else if (sap.ui.getCore().getModel("profile").getData().currentRole == "CTG") {
			sComment = "textAreaCTGComment";
			sMyTask = "flexboxCTGMyTaskDetail";
			sModel = "myCTGSelectedTaskModel";
		}
		if (sap.ui.getCore().byId(sComment).getValue().trim() == "" ||
			sap.ui.getCore().byId(sComment).getValue() == null) {
			sap.ca.ui.message.showMessageBox({
				type: sap.ca.ui.message.Type.ERROR,
				message: "Please give some comments",
				details: "Please give some comments"
			});
			return;
		}

		var data = sap.ui.getCore().byId(sMyTask).getModel(sModel).getData();
		// Call backend service to cancel the request
		//    if(data.ZZ_REQ_TYP == 'DEPU'){
		//      var get = $.ajax({
		//        cache: false,
		//        url: sServiceUrl + "Cancel?DepReq='" + data.ZZ_DEP_REQ + "'&Role='" + 
		//        sap.ui.getCore().getModel("profile").getData().currentRole + "'&Comment='" + 
		//        sap.ui.getCore().byId(sComment).getValue() + "'&Module=''&Button='AcceptCancel'",
		//        type: "GET"
		//      });
		//    }
		//    else{
		
		if(data.ZZ_REQ_TYP == "SECO"){
			var ZZ_REINR = data.ZZ_DEP_REQ;
		}
		else{
			var ZZ_REINR = data.ZZ_TRV_REQ;
		}
		var get = $.ajax({
			cache: false,
			url: sServiceUrl + "TravelCancel?ZZ_COMMENTS='" + sap.ui.getCore().byId(sComment).getValue() +
				"'&ZZ_MGR_PERNR='" + sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_PERNR +
				"'&ZZ_REINR='" + ZZ_REINR +
				"'&ZZ_ROLE='" + sap.ui.getCore().getModel("profile").getData().currentRole +
				"'&ZZ_TTYPE='" + data.ZZ_REQ_TYP +
				"'&ZZ_TIMESTAMP='" + data.ZZ_TIMESTAMP + "'",
			type: "GET"
		});
		//    }

		get.fail(function(err) {
			sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
			var sMsg = err.responseText;
			if (sMsg.indexOf("EX_OBSOLETE") != -1) {
				sMsg = "This request status is obsolete, please click refresh on the dashboard to retrieve new version";
			}
			sap.ca.ui.message.showMessageBox({
				type: sap.ca.ui.message.Type.ERROR,
				message: "Sorry for this inconvenience. Please contact support team",
				details: sMsg
			});
		});

		get.done(function(result, response, header) {
			oHomeThis.bindDataBasedOnRole();
			sap.m.MessageToast.show("Request cancellation approved!");
		});
	},
	onRejectCancelRequest: function(evt) {
		// Validate comment field
		var sComment = "";
		var sMyTask = "";
		var sModel = "";
		if (sap.ui.getCore().getModel("profile").getData().currentRole == "GRM") {
			sComment = "textAreaManagerComment";
			sMyTask = "flexboxManagerMyTaskDetail";
			sModel = "myManagerSelectedTaskModel";
		} else if (sap.ui.getCore().getModel("profile").getData().currentRole == "CTG") {
			sComment = "textAreaCTGComment";
			sMyTask = "flexboxCTGMyTaskDetail";
			sModel = "myCTGSelectedTaskModel";
		}

		if (sap.ui.getCore().byId(sComment).getValue().trim() == "" ||
			sap.ui.getCore().byId(sComment).getValue() == null) {
			sap.ca.ui.message.showMessageBox({
				type: sap.ca.ui.message.Type.ERROR,
				message: "Please give some comments",
				details: "Please give some comments"
			});
			return;
		}

		var data = sap.ui.getCore().byId(sMyTask).getModel(sModel).getData();

		// Call backend service to cancel the request
		if (data.ZZ_REQ_TYP == 'DEPU') {
			var get = $.ajax({
				cache: false,
				url: sServiceUrl + "Cancel?DepReq='" + data.ZZ_DEP_REQ + "'&Role='" +
					sap.ui.getCore().getModel("profile").getData().currentRole + "'&Comment='" +
					sap.ui.getCore().byId(sComment).getValue() + "'&Module=''&Button='RejectCancel'",
				type: "GET"
			});
		} else {
			var get = $.ajax({
				cache: false,
				url: sServiceUrl + "TravelCancelReject?ZZ_COMMENTS='" + sap.ui.getCore().byId(sComment).getValue() +
					"'&ZZ_MGR_PERNR='" + sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_PERNR +
					"'&ZZ_REINR='" + data.ZZ_DEP_REQ +
					"'&ZZ_ROLE='" + sap.ui.getCore().getModel("profile").getData().currentRole +
					"'&ZZ_TTYPE='" + data.ZZ_REQ_TYP +
					"'&ZZ_TIMESTAMP='" + data.ZZ_TIMESTAMP + "'",
				type: "GET"
			});
		}

		get.fail(function(err) {
			sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
			var sMsg = err.responseText;
			if (sMsg.indexOf("EX_OBSOLETE") != -1) {
				sMsg = "This request status is obsolete, please click refresh on the dashboard to retrieve new version";
			}
			sap.ca.ui.message.showMessageBox({
				type: sap.ca.ui.message.Type.ERROR,
				message: "Sorry for this inconvenience. Please contact support team",
				details: sMsg
			});
		});

		get.done(function(result, response, header) {
			oHomeThis.bindDataBasedOnRole();
			sap.m.MessageToast.show("Request cancellation rejected!");
		});
	},

	// CTG WORKFLOW EVENTS
	onCTGSentBackForChange: function(curEvt) {
		oHomeThis.ctgAction('003', "Successfully Sent for changes");
	},
	onCTGApproveRequest: function(curEvt) {
		oHomeThis.ctgAction('001', "Successfully Approved");
	},
	onCTGRejectRequest: function(curEvt) {
		oHomeThis.ctgAction('002', "Request rejected");
	},
	onCTGBudgetCheck: function(evt) {
		if (sap.ui.getCore().byId("flexboxCTGMyTaskDetail").getModel("myCTGSelectedTaskModel").getData().ZZ_DEP_SUB_TYPE == "") {
			sap.ca.ui.message.showMessageBox({
				type: sap.ca.ui.message.Type.ERROR,
				message: "Please enter Travel To",
				details: "Please enter Travel To"
			});
		} else {
			var reqNo = "";

			if (sap.ui.getCore().byId("flexboxCTGMyTaskDetail").getModel("myCTGSelectedTaskModel").getData().ZZ_REQ_TYP == "BUSR" ||
				sap.ui.getCore().byId("flexboxCTGMyTaskDetail").getModel("myCTGSelectedTaskModel").getData().ZZ_REQ_TYP == "INFO") {
				reqNo = sap.ui.getCore().byId("flexboxCTGMyTaskDetail").getModel("myCTGSelectedTaskModel").getData().ZZ_DEP_REQ;
			} else {
				reqNo = sap.ui.getCore().byId("flexboxCTGMyTaskDetail").getModel("myCTGSelectedTaskModel").getData().ZZ_TRV_REQ;
			}

			var get = $.ajax({
				cache: false,
				url: sServiceUrl + "BudgetCheck?ZZ_DEP_SUB_TYP='" +
					sap.ui.getCore().byId("flexboxCTGMyTaskDetail").getModel("myCTGSelectedTaskModel").getData().ZZ_DEP_SUB_TYPE +
					"'&ZZ_PERNR='" + sap.ui.getCore().byId("flexboxCTGMyTaskDetail").getModel("myCTGSelectedTaskModel").getData().ZZ_DEP_PERNR +
					"'&ZZ_MGR_PERNR='" + sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_PERNR +
					"'&ZZ_REINR='" + reqNo +
					"'&ZZ_STAT_FLAG='" + "" +
					"'&ZZ_TTYPE='" + sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData().ZZ_REQ_TYP +
					"'&$format=json",
				type: "GET"
			});
			get.done(function(data) {
				var budget = data.d.results[0].ZZ_BUDGET_AVL;
				var total = data.d.results[0].ZZ_TOT_AMOUNT;
				// display popup
				if (oHomeThis.oBudgetDialog) {
					oHomeThis.oBudgetDialog.destroy();
				}
				// instantiate the Fragment if not done yet
				oHomeThis.oBudgetDialog = sap.ui.xmlfragment("sap.ui.project.e2etm.fragment.common.BudgetDialog", oHomeThis);
				oHomeThis.oBudgetDialog.open();

				// Set value on popup
				sap.ui.getCore().byId("lblBudgetAvailability").setText(budget);
				sap.ui.getCore().byId("lblTotalAmount").setText(total);
			});
		}
	},
	onTripCostPress: function(evt) {
		if (sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData().ZZ_REQ_TYP == "BUSR" ||
			sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData().ZZ_REQ_TYP == "INFO") {
			reqNo = sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData().ZZ_DEP_REQ;
		} else {
			reqNo = sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData().ZZ_TRV_REQ;
		}
		/// 13 Apr 2020 UCD1KOR ZZ_DEP_SUB_TYPE value has to pass null
		//sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData().ZZ_DEP_SUB_TYPE
		var get = $.ajax({
			cache: false,
			url: sServiceUrl + "TripCostSplit?ZZ_DEP_SUB_TYP='" +"" +
				"'&ZZ_PERNR='" + sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData().ZZ_DEP_PERNR +
				"'&ZZ_MGR_PERNR='" + sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_PERNR +
				"'&ZZ_REINR='" + reqNo +
				"'&ZZ_STAT_FLAG='" + "" +
				"'&ZZ_TTYPE='" + sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData().ZZ_REQ_TYP +
				"'&$format=json",
			type: "GET"
		});
		get.done(function(data) {
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(data.d.results);
			var nTotal = sap.ui.project.e2etm.util.StaticUtility.calculateTotalCost(data.d.results);
			if (!oHomeThis["CostDialog"]) {
				oHomeThis["CostDialog"] = sap.ui.xmlfragment("sap.ui.project.e2etm.fragment.home.HOME_Dialog_Cost", oHomeThis);
				oHomeThis.getView().addDependent(oHomeThis["CostDialog"]);
			}
			oHomeThis["CostDialog"].setModel(oModel);
			sap.ui.getCore().byId("tableCost").bindRows("/");
			sap.ui.getCore().byId("tableCost").setVisibleRowCount(data.d.results.length);
			sap.ui.getCore().byId("totalId").setValue(nTotal);
			oHomeThis["CostDialog"].open();
		});
	},
	onBudgetCheckPress: function(evt) {
		/*if (sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData().ZZ_DEP_SUB_TYPE == "" &&
			sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData().ZZ_TRV_TO == "X") {
			sap.ca.ui.message.showMessageBox({
				type: sap.ca.ui.message.Type.ERROR,
				message: "Please enter Travel To",
				details: "Please enter Travel To"
			});
		} else {}*/
		///// 13 APR UCD1KOR below all condiotions has removed from else block

		if (sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData().ZZ_REQ_TYP == "BUSR" ||
			sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData().ZZ_REQ_TYP == "HOME" ||
			sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData().ZZ_REQ_TYP == "SECO" ||
			sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData().ZZ_REQ_TYP == "EMER" ||
			sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData().ZZ_REQ_TYP == "INFO") {
			reqNo = sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData().ZZ_DEP_REQ;
		} else {
			reqNo = sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData().ZZ_TRV_REQ;
		}
		// 13 Apr 2020 UCD1KOR ZZ_DEP_SUB_TYPE value has to pass ""
		//sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData().ZZ_DEP_SUB_TYPE
		var get = $.ajax({
			cache: false,
			url: sServiceUrl + "BudgetCheck?ZZ_DEP_SUB_TYP='" +"" +
				"'&ZZ_PERNR='" + sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData().ZZ_DEP_PERNR +
				"'&ZZ_MGR_PERNR='" + sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_PERNR +
				"'&ZZ_REINR='" + reqNo +
				"'&ZZ_STAT_FLAG='" + "" +
				"'&ZZ_TTYPE='" + sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData().ZZ_REQ_TYP +
				"'&$format=json",
			type: "GET"
		});
		get.done(function(output) {
			try {
				try {
					var sHasBudget = output.d.results[0].ZZ_BUDGET_AVL;
				} catch (ex) {
					var sHasBudget = 'X';
				}
				if (sap.ui.project.e2etm.util.StaticUtility.noBudgetCheck(
						sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData().ZZ_STAT_FLAG,
						sHasBudget,
						sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_DEPT,
						sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData().ZZ_FSTL,
						sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData().ZZ_GEBER,
						sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData().ZZ_DEP_TYPE)) {
					sap.ca.ui.message.showMessageBox({
						type: sap.ca.ui.message.Type.SUCCESS,
						message: "Budget is available for this travel",
						details: "Budget is available for this travel"
					});
				} else {
					sap.ca.ui.message.showMessageBox({
						type: sap.ca.ui.message.Type.ERROR,
						message: "Budget is not available for this travel",
						details: "Budget is not available for this travel"
					});
				}
			} catch (exc) {
				sap.ca.ui.message.showMessageBox({
					type: sap.ca.ui.message.Type.ERROR,
					message: "Budget is not available for this travel",
					details: "Budget is not available for this travel"
				});
				sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
			}
		});
	
	},

	// ECO WORKFLOW EVENTS
	onECOSentBackForChange: function(curEvt) {
		oHomeThis.ecoAction('003', "Successfully Sent for changes");
	},
	onECOApproveRequest: function(curEvt) {
		oHomeThis.ecoAction('001', "Successfully Approved");
	},
	onECORejectRequest: function(curEvt) {
		oHomeThis.ecoAction('002', "Request rejected");
	},

	// TAX WORKFLOW EVENTS
	onTAXSentBackForChange: function(curEvt) {
		oHomeThis.taxAction('003', "Successfully Sent for changes");
	},
	onTAXApproveRequest: function(curEvt) {
		oHomeThis.taxAction('001', "Successfully Approved");
	},
	onTAXRejectRequest: function(curEvt) {
		oHomeThis.taxAction('002', "Request rejected");
	},

	// EMPLOYEE WORKFLOW EVENTS
	onSearchListedCountries: function(curEvt) {
		var filters = [];
		var query = sap.ui.getCore().byId("inputSearchListedCountries").getValue();
		if (query && query.length > 0) {
			var filter = new sap.ui.model.Filter("ZZ_DEP_REQ",
				sap.ui.model.FilterOperator.Contains, query);
			filters.push(filter);
		}
		// update list binding
		var list = sap.ui.getCore().byId("tableListedCountries");
		var binding = list.getBinding("rows");
		binding.filter(filters);
	},

	// EVENT ON CLICKING OF CHANGE BUTTON IN DEPU DASHBOARD (OPEN CHANGE OPTION)
	// Add to submenu
	onChangeDEPURequest: function(oRequest, changeSubMenu) {
		// Get the current date and current row data
		var curDate = new Date();
		// Consider business request
		if (oRequest.ZZ_REQ_TYP == "BUSR" || oRequest.ZZ_REQ_TYP == "SECO" ||
			oRequest.ZZ_REQ_TYP == "EMER" || oRequest.ZZ_REQ_TYP == "HOME" || oRequest.ZZ_REQ_TYP == "INFO") {
			alert('Cannot upload COC for Business request');
		} else { // Consider Deputation request
			changeSubMenu.removeAllItems();

			// On deputation
			// change end date menu
			var oUploadCOC = new sap.ui.unified.MenuItem();
			oUploadCOC.setText("Upload COC");
			oUploadCOC.setIcon("sap-icon://upload");

			changeSubMenu.addItem(oUploadCOC);
		}
	},
	// EVENT ON CLICKING OF UPLOAD COC IN UPLOAD COC DIALOG BY DEPU
	onUploadCOC: function(evt) {
		sap.ui.project.e2etm.util.StaticUtility.setBusy(true, oHomeThis);
		// Send data for visa plan creation.
		var data = sap.ui.getCore().byId("dialogUploadCOC").getModel().getData();
		delete data["ZZ_DOC_PATH"];
		delete data["ZZ_COC_STDATE_VALUE"];
		delete data["ZZ_COC_EDATE_VALUE"];

		// Call service to create visa plan
		var token = "";
		var get = $.ajax({
			cache: false,
			url: sServiceUrl + "EMP_PASSPORT_INFOSet",
			type: "GET",
			headers: {
				'Authorization': token
			},
			beforeSend: function(xhr) {
				xhr.setRequestHeader('X-CSRF-Token', 'Fetch');
			}
		});
		get.done(function(result, response, header) {
			token = header.getResponseHeader("X-CSRF-Token");
			var post = $.ajax({
				cache: false,
				url: sServiceUrl + "CocUploadSet",
				type: "POST",
				beforeSend: function(xhr) {
					xhr.setRequestHeader('X-Requested-With', "XMLHttpRequest");
					xhr.setRequestHeader('X-CSRF-Token', token);
					xhr.setRequestHeader('Accept', "application/json");
					xhr.setRequestHeader('DataServiceVersion', "2.0");
					xhr.setRequestHeader('Content-Type', "application/json");
				},
				data: JSON.stringify(data),
				dataType: "json",
				success: function(result) {
					// Close the dialog
					sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
					sap.m.MessageToast.show("COC updated successfully!");
					oHomeThis.oCommonDialog.close();
				}
			});
		});
	},
	// EVENT ON UPLOAD COC DOCUMENT
	onCOCFileChange: function(evt) {
		sap.ui.project.e2etm.util.StaticUtility.setBusy(true, oHomeThis);
		var aData = sap.ui.getCore().byId("dialogUploadCOC").getModel().getData();
		var sDepReq = aData.ZZ_DEP_REQ;
		var sEmpNo = aData.ZZ_DEP_PERNR;
		var source = evt.getSource();
		var sFileName;
		var iIndex;

		var token = "";
		var get = $.ajax({
			cache: false,
			url: sServiceUrl + "EMP_PASSPORT_INFOSet",
			type: "GET",
			headers: {
				'Authorization': token
			},
			beforeSend: function(xhr) {
				xhr.setRequestHeader('X-CSRF-Token', 'Fetch');
			}
		});
		get.done(function(result, response, header) {
			sFileName = "CL_COC" + source.getProperty("value").substr(source.getProperty("value").lastIndexOf("."));

			var file = source.oFileUpload.files[0];
			var sUrl = sServiceUrl + "DmsDocsSet";
			sDepReq = sDepReq == null || sDepReq == "" ? '999999999' : sDepReq;
			sEmpNo = sEmpNo == null || sEmpNo == "" ? sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_PERNR : sEmpNo;
			var sSlung = sDepReq + "," + sEmpNo + "," + sFileName + "," + "L4";
			var oHeaders = {
				'X-Requested-With': "XMLHttpRequest",
				'X-CSRF-Token': header.getResponseHeader("X-CSRF-Token"),
				'Accept': "application/json",
				'DataServiceVersion': "2.0",
				'Content-Type': "application/json",
				"slug": sSlung
			};
			var post = jQuery.ajax({
				cache: false,
				type: 'POST',
				url: sUrl,
				headers: oHeaders,
				cache: false,
				contentType: file.type,
				processData: false,
				data: file
			});
			post.success(function(data) {
				aData.ZZ_DOC_PATH = data.d.FileUrl;
				sap.ui.getCore().byId("dialogUploadCOC").getModel().setData(aData);
				// Close the dialog
				sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
				sap.m.MessageToast.show("Upload Succesfully");
				//        oHomeThis.oCommonDialog.close();
			});
			post.fail(function(result, response, header) {
				sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
			});
		});
	},
	// EVENT ON UPLOAD REQUISITION DOCUMENT
	onRequisitionFileChange: function(evt) {
		sap.ui.project.e2etm.util.StaticUtility.setBusy(true, oHomeThis);
		var aData = sap.ui.getCore().byId("dialogUploadRequisition").getModel().getData();
		var sDepReq = aData.ZZ_DEP_REQ;
		var sEmpNo = aData.ZZ_DEP_PERNR;
		var source = evt.getSource();
		var sFileName;
		var iIndex;

		var token = "";
		var get = $.ajax({
			cache: false,
			url: sServiceUrl + "EMP_PASSPORT_INFOSet",
			type: "GET",
			headers: {
				'Authorization': token
			},
			beforeSend: function(xhr) {
				xhr.setRequestHeader('X-CSRF-Token', 'Fetch');
			}
		});
		get.done(function(result, response, header) {
			sFileName = "CL_TRFR" + source.getProperty("value").substr(source.getProperty("value").lastIndexOf("."));

			var file = source.oFileUpload.files[0];
			var sUrl = sServiceUrl + "DmsDocsSet";
			var sSlung = sDepReq + "," + sEmpNo + "," + sFileName + "," + "TRF";
			var oHeaders = {
				'X-Requested-With': "XMLHttpRequest",
				'X-CSRF-Token': header.getResponseHeader("X-CSRF-Token"),
				'Accept': "application/json",
				'DataServiceVersion': "2.0",
				'Content-Type': "application/json",
				"slug": sSlung
			};
			var post = jQuery.ajax({
				cache: false,
				type: 'POST',
				url: sUrl,
				headers: oHeaders,
				cache: false,
				contentType: file.type,
				processData: false,
				data: file
			});
			post.success(function(data) {
				aData.ZZ_DOC_PATH = data.d.FileUrl;
				sap.ui.getCore().byId("dialogUploadRequisition").getModel().setData(aData);
				sap.ui.getCore().byId("lnkRequisitionDocument").setVisible(true);
				// Close the dialog
				sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
				sap.m.MessageToast.show("Upload Succesfully");
				//        oHomeThis.oCommonDialog.close();
			});
			post.fail(function(result, response, header) {
				sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
			});
		});
	},
	// EVENT ON UPLOAD EXIT CHECKLIST DOCUMENT
	onExitCheckListFileChange: function(evt) {
		sap.ui.project.e2etm.util.StaticUtility.setBusy(true, oHomeThis);
		var aData = sap.ui.getCore().byId("dialogUploadExitCheckList").getModel().getData();
		var sDepReq = aData.ZZ_DEP_REQ;
		var sEmpNo = aData.ZZ_DEP_PERNR;
		var source = evt.getSource();
		var sFileName;
		var iIndex;

		var token = "";
		var get = $.ajax({
			cache: false,
			url: sServiceUrl + "EMP_PASSPORT_INFOSet",
			type: "GET",
			headers: {
				'Authorization': token
			},
			beforeSend: function(xhr) {
				xhr.setRequestHeader('X-CSRF-Token', 'Fetch');
			}
		});
		get.done(function(result, response, header) {
			sFileName = "CL_EXIT" + source.getProperty("value").substr(source.getProperty("value").lastIndexOf("."));

			var file = source.oFileUpload.files[0];
			var sUrl = sServiceUrl + "DmsDocsSet";
			var sSlung = sDepReq + "," + sEmpNo + "," + sFileName + "," + "EXI";
			var oHeaders = {
				'X-Requested-With': "XMLHttpRequest",
				'X-CSRF-Token': header.getResponseHeader("X-CSRF-Token"),
				'Accept': "application/json",
				'DataServiceVersion': "2.0",
				'Content-Type': "application/json",
				"slug": sSlung
			};
			var post = jQuery.ajax({
				cache: false,
				type: 'POST',
				url: sUrl,
				headers: oHeaders,
				cache: false,
				contentType: file.type,
				processData: false,
				data: file
			});
			post.success(function(data) {
				aData.ZZ_DOC_PATH = data.d.FileUrl;
				sap.ui.getCore().byId("dialogUploadExitCheckList").getModel().setData(aData);
				sap.ui.getCore().byId("lnkExitCheckListDocument").setVisible(true);
				// Close the dialog
				sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
				sap.m.MessageToast.show("Upload Succesfully");
				//        oHomeThis.oCommonDialog.close();
			});
			post.fail(function(result, response, header) {
				sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
			});
		});
	},

	// EVENT ON CLICKING OF CHANGE BUTTON IN EMPLOYEE DASHBOARD (OPEN CHANGE OPTION)
	// Add to submenu
	onChangeEMPRequest: function(oRequest, changeSubMenu) {
		// Get the current date and current row data
		var curDate = new Date();
		var deputationStartDate = new Date(oRequest.ZZ_DEP_STDATE.substr(0, 4),
			oRequest.ZZ_DEP_STDATE.substr(4, 2) - 1,
			oRequest.ZZ_DEP_STDATE.substr(6, 2));
		var deputationEndDate = new Date(oRequest.ZZ_DEP_ENDATE.substr(0, 4),
			oRequest.ZZ_DEP_ENDATE.substr(4, 2) - 1,
			oRequest.ZZ_DEP_ENDATE.substr(6, 2));
		// Consider business request
		if (oRequest.ZZ_REQ_TYP == "DEPU") {
			changeSubMenu.removeAllItems();

			var requestMenu = new sap.ui.unified.MenuItem();
			requestMenu.setText("Request");
			requestMenu.setIcon("sap-icon://request");
			changeSubMenu.addItem(requestMenu);
			var requestMenuList = new sap.ui.unified.Menu({
				itemSelect: function(evt) {
					oHomeThis.onEMPChangeClick(evt);
				}
			});
			requestMenu.setSubmenu(requestMenuList);

			var otherMenu = new sap.ui.unified.MenuItem();
			otherMenu.setText("Upload");
			otherMenu.setIcon("sap-icon://documents");
			var otherMenuList = new sap.ui.unified.Menu({
				itemSelect: function(evt) {
					oHomeThis.onEMPChangeClick(evt);
				}
			});
			otherMenu.setSubmenu(otherMenuList);

			// Define all the possible menus
			var eDock = sap.ui.core.Popup.Dock;

			// Before deputation
			// change dates menu
			var oChangeDate = new sap.ui.unified.MenuItem();
			oChangeDate.setText("Change dates");
			oChangeDate.setIcon("sap-icon://calendar");
			// change dependents menu
			var oChangeDepes = new sap.ui.unified.MenuItem();
			oChangeDepes.setText("Change dependents");
			oChangeDepes.setIcon("sap-icon://group");

			// On deputation
			// change end date menu
			var oChangeEDate = new sap.ui.unified.MenuItem();
			oChangeEDate.setText("Extend date");
			oChangeEDate.setIcon("sap-icon://expand");
			// change kid menu
			var oChangeKid = new sap.ui.unified.MenuItem();
			oChangeKid.setText("Add new born kid");
			oChangeKid.setIcon("sap-icon://calendar");
			// change family accompany menu
			var oChangeFamily = new sap.ui.unified.MenuItem();
			oChangeFamily.setText("Change family accompany");
			oChangeFamily.setIcon("sap-icon://group");
			// change family accompany returning date menu
			var oChangeFamilyReturn = new sap.ui.unified.MenuItem();
			oChangeFamilyReturn.setText("Change family return date");
			oChangeFamilyReturn.setIcon("sap-icon://calendar");

			// uploading new visa when on deputation
			var oChangeUploadVisa = new sap.ui.unified.MenuItem();
			oChangeUploadVisa.setText("Upload Visa Copies");
			oChangeUploadVisa.setIcon("sap-icon://upload");
			// uploading additional docs
			var oChangeUploadAdditional = new sap.ui.unified.MenuItem();
			oChangeUploadAdditional.setText("Upload Additional Documents");
			oChangeUploadAdditional.setIcon("sap-icon://document");

			//Insurance
			var iIndex = sap.ui.project.e2etm.util.StaticUtility.getArrayIndex(oRequest.ZE2E_REQ_STATUSSet.results, "ZZ_MODID", "INSR");
			if (iIndex != -1) {
				if ((oRequest.ZE2E_REQ_STATUSSet.results[iIndex].ZZ_ACTION == '00' && oRequest.ZE2E_REQ_STATUSSet.results[iIndex].ZZ_NROLE == "01") ||
					(oRequest.ZE2E_REQ_STATUSSet.results[iIndex].ZZ_ACTION == '02' && oRequest.ZE2E_REQ_STATUSSet.results[iIndex].ZZ_NROLE == "03")) {
					var oChangeInsurance = new sap.ui.unified.MenuItem();
					oChangeInsurance.setText("Insurance");
					oChangeInsurance.setIcon("sap-icon://insurance-life");
					changeSubMenu.addItem(oChangeInsurance);
				}
			}

			//  Cargo

			var iOnward = sap.ui.project.e2etm.util.StaticUtility.getArrayIndex(oRequest.ZE2E_REQ_STATUSSet.results, "ZZ_MODID", "CARO");
			var iReturn = sap.ui.project.e2etm.util.StaticUtility.getArrayIndex(oRequest.ZE2E_REQ_STATUSSet.results, "ZZ_MODID", "CARR");
			if (iOnward != -1 || iReturn != -1) {
				var currentDate = new Date();
				var dateBeforeStarDate = sap.ui.project.e2etm.util.StaticUtility.substractDate(oRequest.ZZ_DEP_STDATE, currentDate);
				if (Number(oRequest.ZZ_DEP_DAYS) >= Number(sap.ui.getCore().getModel("global").getData().timeActiveCargo) &&
					Number(dateBeforeStarDate) > Number(sap.ui.getCore().getModel("global").getData().DurStartDate) &&
					sap.ui.getCore().getModel("global").getData().ZZ_TRV_KEY == "DEPU") {
					var oChangeCargo = new sap.ui.unified.MenuItem();
					oChangeCargo.setText("Cargo");
					oChangeCargo.setIcon("sap-icon://cargo-train");
					changeSubMenu.addItem(oChangeCargo);

					//Change Cargo List
					var oChangeCargoList = new sap.ui.unified.Menu({
						itemSelect: function(evt) {
							oHomeThis.onEMPChangeClick(evt);
						}
					});
					oChangeCargo.setSubmenu(oChangeCargoList);

					if (iOnward != -1) {
						//Onward
						var oChangeOnward = new sap.ui.unified.MenuItem();
						oChangeOnward.setText("Onward");
						oChangeOnward.setIcon("sap-icon://contacts");
						oChangeCargoList.addItem(oChangeOnward);
					}

					if (iReturn != -1) {
						//Return
						var oChangeReturn = new sap.ui.unified.MenuItem();
						oChangeReturn.setText("Return");
						oChangeReturn.setIcon("sap-icon://cargo-train");
						oChangeCargoList.addItem(oChangeReturn);
					}
				}
			}
			// Domestic scenario
			if (oRequest.ZZ_DEP_TYPE == "DOME") {
				// Before deputation
				if (curDate < deputationStartDate) {
					requestMenuList.addItem(oChangeDate);
				} else { // On deputation
					requestMenuList.addItem(oChangeEDate);
				}
			} else { // International scenario
				changeSubMenu.addItem(otherMenu);
				// Before deputation
				if (curDate < deputationStartDate) {
					requestMenuList.addItem(oChangeDate);
					if (oRequest.ZZ_TRV_CAT != "TRNG") {
						requestMenuList.addItem(oChangeDepes);
					}
				} else { // On deputation
					requestMenuList.addItem(oChangeEDate);
					if (oRequest.ZZ_TRV_CAT != "TRNG") {
						requestMenuList.addItem(oChangeKid);
						requestMenuList.addItem(oChangeFamily);
						requestMenuList.addItem(oChangeFamilyReturn);
					}
				}
				if (oRequest.ZZ_TRV_REQ != "0000000000" && oRequest.ZZ_TRV_REQ != null && oRequest.ZZ_TRV_REQ != "") {
					otherMenuList.addItem(oChangeUploadVisa);
				}
				otherMenuList.addItem(oChangeUploadAdditional);
			}
			return changeSubMenu;
		}
	},
	// EVENT ON CLICKING OF EACH CHANGE OPTION IN EMPLOYEE DASHBOARD
	onEMPChangeClick: function(oRequest, param) {
		var globalData = sap.ui.getCore().getModel("global").getData();
		globalData.isChange = true;
		globalData.isCreate = false;
		globalData.whichTab = "";
		globalData.ZZ_DEP_REQ = oRequest.ZZ_DEP_REQ;
		globalData.ZZ_DEP_SUB_TYPE = oRequest.ZZ_DEP_SUB_TYPE;
		globalData.ZZ_VREASON = oRequest.ZZ_VREASON;
		globalData.ZZ_FSTL = oRequest.ZZ_FSTL;
		globalData.ZZ_GEBER = oRequest.ZZ_GEBER;

		// Common with onEMPCreateTrip
		globalData.changeType = "";
		globalData.ZZ_DEP_TYPE = oRequest.ZZ_DEP_TYPE;
		globalData.ZZ_REQ_TYP = oRequest.ZZ_REQ_TYP;
		globalData.ZZ_STAT_FLAG = oRequest.ZZ_STAT_FLAG;
		globalData.ZZ_DEP_PERNR = oRequest.ZZ_DEP_PERNR;
		globalData.ZZ_VERSION = oRequest.ZZ_VERSION;
		globalData.ZZ_TRV_REQ = oRequest.ZZ_TRV_REQ;
		globalData.ZZ_VISA_PLAN = oRequest.ZZ_VISA_PLAN;
		globalData.ZZ_DEP_TOCNTRY_TXT = oRequest.ZZ_DEP_TOCNTRY_TXT;
		globalData.ZZ_TRV_CAT = oRequest.ZZ_TRV_CAT;
		globalData.ZZ_TIMESTAMP = oRequest.ZZ_TIMESTAMP;

		/* Start-CGGS Changes */

		globalData.ZZ_PARENTNAME = oRequest.ZZ_PARENTNAME;
		globalData.ZZ_SPOUSENAME = oRequest.ZZ_SPOUSENAME;
		globalData.ZZ_DESIGNATION = oRequest.ZZ_DESIGNATION;
		/* End-CGGS Changes */
		
// 10 APR 2020 UCD1KOR Repatriation process fields added
		
		globalData.ZZ_RADIO_ES = oRequest.ZZ_RADIO_ES;
		globalData.ZZ_SDATE_E = oRequest.ZZ_SDATE_E;
		globalData.ZZ_RADIO_MS = oRequest.ZZ_RADIO_MS;
		globalData.ZZ_SDATE_M = oRequest.ZZ_SDATE_M;
		globalData.ZZ_HRBP_REMRK = oRequest.ZZ_HRBP_REMRK;
		
		globalData.ZZ_REP_RAAMT = oRequest.ZZ_REP_RAAMT;
		globalData.ZZ_REP_RELALLWC = oRequest.ZZ_REP_RELALLWC;
		globalData.ZZ_HRLPP_REMRKS = oRequest.ZZ_HRLPP_REMRKS;
		globalData.ZZ_ASG_TYP = oRequest.ZZ_ASG_TYP;
		globalData.ZZ_COMABBR = oRequest.ZZ_COMABBR;
		
		globalData.ZZ_DEP_STDATE = oRequest.ZZ_DEP_STDATE;
		globalData.ZZ_DEP_ENDATE = oRequest.ZZ_DEP_ENDATE;
		
		// Check the action
		switch (param) {
			case "Onward":
				//ZZ_FAMILY_ACCOMP
				if (oRequest.ZZ_ASG_TYP == "VA" || oRequest.ZZ_ASG_TYP == "VN" || oRequest.ZZ_ASG_TYP == "NCX" || oRequest.ZZ_ASG_TYP == "LTX" ) { //added by uml6kor 6.9.2019 new policy asg models 
					var globalData = sap.ui.getCore().getModel("global").getData();
					globalData.ZZ_ASG_TYP = oRequest.ZZ_ASG_TYP;
					globalData.ZZ_DEP_DAYS = oRequest.ZZ_DEP_DAYS;
					globalData.ZZ_DEP_DAYS = oRequest.ZZ_FAMILY_ACCOMP;
					globalData.ZZ_CAR_TYP = "V";
					sap.ui.getCore().getModel("global").setData(globalData);
					//        sap.ui.core.routing.Router.getRouter("MyRouter").navTo("CargoVAVN");   //form cargoVAVN currently not used
					sap.ui.core.routing.Router.getRouter("MyRouter").navTo("cargo");
				} else {
					globalData.ZZ_ASG_TYP = oRequest.ZZ_ASG_TYP;
					globalData.ZZ_CAR_TYP = "O";
					sap.ui.getCore().getModel("global").setData(globalData);
					sap.ui.core.routing.Router.getRouter("MyRouter").navTo("cargo");
				}
				return true;
			case "Return":
				if (Number(oRequest.ZZ_DEP_DAYS) >= Number(globalData.cargoCondition)) {
					var globalData = sap.ui.getCore().getModel("global").getData();
					globalData.ZZ_ASG_TYP = oRequest.ZZ_ASG_TYP;
					globalData.ZZ_DEP_DAYS = oRequest.ZZ_DEP_DAYS;
					globalData.ZZ_DEP_DAYS = oRequest.ZZ_FAMILY_ACCOMP;
					globalData.ZZ_CAR_TYP = "S";
					sap.ui.getCore().getModel("global").setData(globalData);
					//        sap.ui.core.routing.Router.getRouter("MyRouter").navTo("CargoVAVN");   //form cargoVAVN currently not used
					sap.ui.core.routing.Router.getRouter("MyRouter").navTo("cargo");
				} else {
					globalData.ZZ_ASG_TYP = oRequest.ZZ_ASG_TYP;
					globalData.ZZ_CAR_TYP = "R";
					sap.ui.getCore().getModel("global").setData(globalData);
					sap.ui.core.routing.Router.getRouter("MyRouter").navTo("cargo");
				}
				return true;
			case "Insurance":
				sap.ui.core.routing.Router.getRouter("MyRouter").navTo("insurance");
				sap.ui.getCore().getModel("global").setData(globalData);
				return true;
			case "Change Dates":
				// start changes by VAB6KOR for Change dates link enable in stage 2
				globalData.ZZ_ASG_TYP = oRequest.ZZ_ASG_TYP;
				// UCD1KOR 17/06/2021 included status "JJ010" ,"JJ005","JJ007"  && globalData.ZZ_ASG_TYP == "STA" 
				if (globalData.ZZ_REQ_TYP == "DEPU" && globalData.ZZ_DEP_TYPE == "INTL" && (globalData.ZZ_STAT_FLAG == "AA007" ||  globalData.ZZ_STAT_FLAG == "AA008"  || globalData.ZZ_STAT_FLAG ==
					"JJ008" || globalData.ZZ_STAT_FLAG == "JJ009" || globalData.ZZ_STAT_FLAG == "JJ010" || globalData.ZZ_STAT_FLAG == "JJ013"|| globalData.ZZ_STAT_FLAG == "JJ005" || globalData.ZZ_STAT_FLAG == "JJ007") )  {
					var dialog = new sap.m.Dialog({
						title: 'Information',
						type: 'Message',
						content: [
							new sap.m.Text({
								text: 'Please note that change in date at this stage will lead to reinitiating the entire deputation process. Please raise a date change in stage 3(Travel plan),  based on visa validity dates as mentioned in your passport after visa stamping.'
							})
						],
						beginButton: new sap.m.Button({
							text: 'OK',
							press: function() {
								dialog.close();
							}
						}),
					});
					dialog.open();
					return true;
				} else { // End Changes by VAB6KOR
			//////////#######################UCD1KOR CHeck valid Manager details#####################////////////
					this.CheckValidManager("Change Dates","DA",oRequest,globalData);
					return true;
					/*globalData.changeType = "DA";
					globalData.ZZ_VREASON = globalData.changeType;
					sap.ui.getCore().getModel("global").setData(globalData);
					sap.ui.core.routing.Router.getRouter("MyRouter").navTo("deputation", {
						"depId": Base64.encode(oRequest.ZZ_DEP_REQ)
					});*/
				}
			case "Amend request to Change accompanying Family":
				globalData.changeType = "DE";
				sap.ui.getCore().getModel("global").setData(globalData);
				sap.ui.core.routing.Router.getRouter("MyRouter").navTo("deputation", {
					"depId": Base64.encode(oRequest.ZZ_DEP_REQ)
				});
				return true;
			case "Change end date while on deputation":
				//////////#######################UCD1KOR CHeck valid Manager details#####################////////////
				this.CheckValidManager("Change end date while on deputation","DB",oRequest,globalData);
				return true;
				/*globalData.changeType = "DB";
				sap.ui.getCore().getModel("global").setData(globalData);
				sap.ui.core.routing.Router.getRouter("MyRouter").navTo("deputation", {
					"depId": Base64.encode(oRequest.ZZ_DEP_REQ)
				});*/
				
			case "Amend request to Add new born kid(While on Deputation)":
		
				globalData.changeType = "DF";
				sap.ui.getCore().getModel("global").setData(globalData);
				sap.ui.core.routing.Router.getRouter("MyRouter").navTo("deputation", {
					"depId": Base64.encode(oRequest.ZZ_DEP_REQ)
				});
				return true;
			case "Change family accompany(while on deputation)":
				globalData.changeType = "DG";
				sap.ui.getCore().getModel("global").setData(globalData);
				sap.ui.core.routing.Router.getRouter("MyRouter").navTo("deputation", {
					"depId": Base64.encode(oRequest.ZZ_DEP_REQ)
				});
				return true;
			case "Change Family return dates":
				globalData.changeType = "DH";
				sap.ui.getCore().getModel("global").setData(globalData);
				sap.ui.core.routing.Router.getRouter("MyRouter").navTo("deputation", {
					"depId": Base64.encode(oRequest.ZZ_DEP_REQ)
				});
				return true;
			case "Upload Visa copies":
				try {
					sap.ui.getCore().byId("UploadVisaSelf").destroy();
					sap.ui.getCore().byId("UploadVisaDependent").destroy();
				} catch (exc) {}

				sap.ui.project.e2etm.util.StaticUtility.setBusy(true, oHomeThis);
				// display popup
				if (oHomeThis.oCommonDialog) {
					oHomeThis.oCommonDialog.destroy();
				}
				// instantiate the Fragment if not done yet
				oHomeThis.oCommonDialog = sap.ui.xmlfragment("sap.ui.project.e2etm.fragment.common.UploadVisaDialog", oHomeThis);

				// call service to get visa items
				var get = $.ajax({
					cache: false,
					url: sServiceUrl + "DEP_VISA_PLANSet('" + oRequest.ZZ_VISA_PLAN + "')?$expand=VISAPLANTOITEM&$format=json",
					type: "GET"
				});
				get.fail(function(err) {
					oHomeThis.oCommonDialog.close();
				});
				get.done(function(data) {
					var model = new sap.ui.model.json.JSONModel();
					var bindData = {};
					bindData.selfVisa = data.d;
					bindData.selfVisa.visibleOpen = false;
					bindData.selfVisa.ZZ_DEP_REQ = oRequest.ZZ_DEP_REQ;
					bindData.selfVisa.ZZ_DEP_PERNR = oRequest.ZZ_DEP_PERNR;
					bindData.selfVisa.ZZ_TRV_CAT = oRequest.ZZ_TRV_CAT;
					bindData.selfVisa.ZZ_VISA_SDATE_VALUE = new Date(bindData.selfVisa.ZZ_VISA_SDATE.substr(0, 4),
						bindData.selfVisa.ZZ_VISA_SDATE.substr(4, 2) - 1,
						bindData.selfVisa.ZZ_VISA_SDATE.substr(6, 2));
					bindData.selfVisa.ZZ_VISA_EDATE_VALUE = new Date(bindData.selfVisa.ZZ_VISA_EDATE.substr(0, 4),
						bindData.selfVisa.ZZ_VISA_EDATE.substr(4, 2) - 1,
						bindData.selfVisa.ZZ_VISA_EDATE.substr(6, 2));

					bindData.visaItems = data.d.VISAPLANTOITEM.results;
					// Getting the visa data from backend
					if (data.d.VISAPLANTOITEM != null) {
						bindData.visaItems = data.d.VISAPLANTOITEM.results;
					} else {
						bindData.visaItems = [];
					}

					bindData.selfVisa = data.d;
					if (bindData.selfVisa.ZZ_VISA_EDATE == "00000000") {
						bindData.selfVisa.ZZ_VISA_EDATE = "";
					} else {
						bindData.selfVisa.ZZ_VISA_EDATE_VALUE = new Date(bindData.selfVisa.ZZ_VISA_EDATE.substr(0, 4),
							bindData.selfVisa.ZZ_VISA_EDATE.substr(4, 2) - 1,
							bindData.selfVisa.ZZ_VISA_EDATE.substr(6, 2));
					}
					if (bindData.selfVisa.ZZ_VISA_SDATE == "00000000") {
						bindData.selfVisa.ZZ_VISA_SDATE = "";
					} else {
						bindData.selfVisa.ZZ_VISA_SDATE_VALUE = new Date(bindData.selfVisa.ZZ_VISA_SDATE.substr(0, 4),
							bindData.selfVisa.ZZ_VISA_SDATE.substr(4, 2) - 1,
							bindData.selfVisa.ZZ_VISA_SDATE.substr(6, 2));
					}
					if (data.d.ZZ_MULT_ENTRY == "") {
						bindData.selfVisa.ZZ_MULT_ENTRY_CHAR = false;
					} else {
						bindData.selfVisa.ZZ_MULT_ENTRY_CHAR = true;
					}

					for (var i = 0; i < bindData.visaItems.length; i++) {
						bindData.visaItems[i].visibleOpen = false;
						if (bindData.visaItems[i].ZZ_MULT_ENTRY == "") {
							bindData.visaItems[i].ZZ_MULT_ENTRY_CHAR = false;
						} else {
							bindData.visaItems[i].ZZ_MULT_ENTRY_CHAR = true;
						}
						if (bindData.visaItems[i].ZZ_VISA_EDATE != "00000000") {
							bindData.visaItems[i].ZZ_VISA_EDATE_VALUE = new Date(
								bindData.visaItems[i].ZZ_VISA_EDATE.substr(0, 4),
								bindData.visaItems[i].ZZ_VISA_EDATE.substr(4, 2) - 1,
								bindData.visaItems[i].ZZ_VISA_EDATE.substr(6, 2));
						}
						if (bindData.visaItems[i].ZZ_VISA_SDATE != "00000000") {
							bindData.visaItems[i].ZZ_VISA_SDATE_VALUE = new Date(
								bindData.visaItems[i].ZZ_VISA_SDATE.substr(0, 4),
								bindData.visaItems[i].ZZ_VISA_SDATE.substr(4, 2) - 1,
								bindData.visaItems[i].ZZ_VISA_SDATE.substr(6, 2));
						}
					}

					var get = $.ajax({
						cache: false,
						url: sServiceUrl + "DmsDocsSet?$filter=DepReq+eq+'" +
							oRequest.ZZ_DEP_REQ + "'+and+EmpNo+eq+'" + oRequest.ZZ_DEP_PERNR + "'&$format=json",
						type: "GET"
					});
					get.done(function(result) {
						for (var i = 0; i < result.d.results.length; i++) {
							var sFileName = result.d.results[i].FileName;
							if (sFileName.substr(0, sFileName.indexOf(".")) == "CL_VISA_COPY_SELF_" + oRequest.ZZ_TRV_CAT) {
								bindData.selfVisa.visibleOpen = true;
								bindData.selfVisa.href = result.d.results[i].FileUrl;
								continue;
							}
							if (sFileName.substr(0, 22) == "CL_VISA_COPY_DEPENDENT") {
								try {
									for (var iIndex = 0; iIndex < bindData.visaItems.length; iIndex++) {
										var regex = new RegExp(/\(([^)]+)\)/g);
										//var dependentType = regex.exec(bindData.visaItems[iIndex].ZZ_DEPNDT_TYP)[1];
										try{
											var dependentType = regex.exec(bindData.visaItems[iIndex].ZZ_DEPNDT_TYP)[1];
										}catch(err){
											dependentType = bindData.visaItems[iIndex].ZZ_DEPNDT_TYP;
										}
										if (sFileName.split("_")[4].split(".")[0] == dependentType) {
											bindData.visaItems[iIndex].visibleOpen = true;
											bindData.visaItems[iIndex].href = result.d.results[i].FileUrl;
										}
									}
								} catch (ex) {}
								continue;
							}
						}
						model.setData(bindData);
						sap.ui.getCore().byId("dialogUploadVisaCopy").setModel(model);
						sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
						oHomeThis.oCommonDialog.open();
					});

					// Modify Visa Copy Panel dependent's name
					var ntid = oRequest.ZZ_DEP_PERNR;

					var get = $.ajax({
						cache: false,
						url: sServiceUrl + "DEP_EMPSet('" + ntid + "')?$expand=EMPtoEMPDEPNDNT&$format=json",
						type: "GET"
					});
					get.done(function(data) {
						for (var i = 0; i < bindData.visaItems.length; i++) {
							for (var j = 0; j < data.d.EMPtoEMPDEPNDNT.results.length; j++) {
								if (data.d.EMPtoEMPDEPNDNT.results[j].ZZ_DEP_TYP == bindData.visaItems[i].ZZ_DEPNDT_TYP) {
									bindData.visaItems[i].ZZ_DEPNDT_TYP = data.d.EMPtoEMPDEPNDNT.results[j].ZZ_DEP_NAME + " (" +
										data.d.EMPtoEMPDEPNDNT.results[j].ZZ_DEP_TYP + ")";
									model.setData(bindData);
									sap.ui.getCore().byId("dialogUploadVisaCopy").setModel(model);
									sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
									oHomeThis.oCommonDialog.open();
									break;
								}
							}
						}
					});
				});
				return true;
			case "Upload additional deputation documents":
				sap.ui.project.e2etm.util.StaticUtility.setBusy(true, oHomeThis);
				oHomeThis.additionalFileUpload = null;
				oHomeThis.SelectedDocumentName = null;
				var oModel = new sap.ui.model.json.JSONModel();
				var oDataModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
				var batchOperation0 = oDataModel.createBatchOperation("VISA_DOCSSet?$filter=Country+eq+'" + oRequest.ZZ_DEP_TOCNTRY +
					"'+and+VisaType+eq+'" + oRequest.ZZ_TRV_CAT + "'", "GET");
				var batchOperation1 = oDataModel.createBatchOperation("VISA_DOCSSet?$filter=Country+eq+'" + oRequest.ZZ_DEP_TOCNTRY +
					"'+and+VisaType+eq+'DPND'", "GET");
				var batchOperation2 = oDataModel.createBatchOperation("GetDomain?DomainName='ZZ_DOC_TYPE'&$format=json", "GET");

				oDataModel.addBatchReadOperations([batchOperation0, batchOperation1, batchOperation2]);
				oDataModel.submitBatch(function(oResult) {
					if (oHomeThis.uploadAdditional == null) {
						oHomeThis.uploadAdditional = sap.ui.xmlfragment(
							"sap.ui.project.e2etm.fragment.common.DeputationFileDialog",
							oHomeThis
						);
					}
					var oData = {};
					var docNameList = [];
					for (var i = 0; i < oResult.__batchResponses[0].data.results.length; i++) {
						if (oResult.__batchResponses[0].data.results[i].DocType == "T") {
							docNameList.push(oResult.__batchResponses[0].data.results[i]);
						}
					}
					if (docNameList.length > 0) {
						oHomeThis.SelectedDocumentName = docNameList[0].DocName;
					}
					oData.DocumentName = docNameList;
					//For each dependent, append document for them 
					if (oRequest.ZZ_FAMILY_ACCOMP != "") {
						oData.DocumentName = jQuery.merge(oData.DocumentName, oResult.__batchResponses[1].data.results);
					}

					var docTypeList = [];
					for (var i = 0; i < oResult.__batchResponses[2].data.results.length; i++) {
						if (oResult.__batchResponses[2].data.results[i].DOMVALUE_L == "T") {
							docTypeList.push(oResult.__batchResponses[2].data.results[i]);
						}
					}

					oData.DocumentType = docTypeList;
					oModel.setData(oData);
					oHomeThis.uploadAdditional.setModel(oModel);

					if (docNameList.length > 0) {
						oHomeThis.uploadAdditional.open();
					}
					sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
				});
				return true;
			case "Upload COC":
				sap.ui.project.e2etm.util.StaticUtility.setBusy(true, oHomeThis);
				// display popup
				if (oHomeThis.oCommonDialog) {
					oHomeThis.oCommonDialog.destroy();
				}
				// instantiate the Fragment if not done yet
				oHomeThis.oCommonDialog = sap.ui.xmlfragment("sap.ui.project.e2etm.fragment.common.UploadCOCDialog", oHomeThis);

				var model = new sap.ui.model.json.JSONModel();
				var bindData = {};
				bindData.ZZ_DEP_REQ = oRequest.ZZ_DEP_REQ;
				bindData.ZZ_VERSION = oRequest.ZZ_VERSION;
				if (oRequest.ZZ_COC_STDATE == "00000000") {
					bindData.ZZ_COC_STDATE = "";
				} else {
					bindData.ZZ_COC_STDATE = oRequest.ZZ_COC_STDATE;
				}

				bindData.ZZ_COC_EDATE = oRequest.ZZ_COC_EDATE;
				if (oRequest.ZZ_COC_EDATE == "00000000") {
					bindData.ZZ_COC_EDATE = "";
				} else {
					bindData.ZZ_COC_EDATE = oRequest.ZZ_COC_EDATE;
				}

				bindData.ZZ_COC_NO = oRequest.ZZ_COC_NO;
				bindData.ZZ_COC_STDATE_VALUE = new Date(bindData.ZZ_COC_STDATE.substr(0, 4),
					bindData.ZZ_COC_STDATE.substr(4, 2) - 1, bindData.ZZ_COC_STDATE.substr(6, 2));
				bindData.ZZ_COC_EDATE_VALUE = new Date(bindData.ZZ_COC_EDATE.substr(0, 4),
					bindData.ZZ_COC_EDATE.substr(4, 2) - 1, bindData.ZZ_COC_EDATE.substr(6, 2));

				var get = $.ajax({
					cache: false,
					url: sServiceUrl + "DmsDocsSet?$filter=DepReq+eq+'" +
						oRequest.ZZ_DEP_REQ + "'+and+EmpNo+eq+'" + oRequest.ZZ_DEP_PERNR + "'&$format=json",
					type: "GET"
				});
				get.done(function(result) {
					for (var i = 0; i < result.d.results.length; i++) {
						var sFileName = result.d.results[i].FileName;
						if (sFileName.substr(0, sFileName.indexOf(".")) == "CL_COC") {
							bindData.ZZ_DOC_PATH = result.d.results[i].FileUrl;
						}
					}
					model.setData(bindData);
					sap.ui.getCore().byId("dialogUploadCOC").setModel(model);
					sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
					if (bindData.ZZ_DOC_PATH == "") {
						sap.ui.getCore().byId("lnkCOCDocument").setVisible(false);
					} else {
						sap.ui.getCore().byId("lnkCOCDocument").setVisible(true);
					}
					oHomeThis.oCommonDialog.open();
				});
				return true;
			case null || "":
				globalData.changeType = "";
				sap.ui.getCore().getModel("global").setData(globalData);
				sap.ui.core.routing.Router.getRouter("MyRouter").navTo("deputation", {
					"depId": Base64.encode(oRequest.ZZ_DEP_REQ)
				});
				return true;
			case "Ticketing" || "Card Reload" || "Monthly Remittance" || "Bank Advice Form" || "Travel Settlement" || "Payment Voucher" || "Repatriation" ||
			"INR Advance":
				sap.ui.getCore().getModel("global").setData(globalData);
				return false;
		}
		return false;
	},
	//////////////################ UCD1KOR Aug11th 2020 ###############////////
	onDateSelectionChange:function(evt){
		var that= this;
		var selectedKey = sap.ui.getCore().byId("idDateChageKey").getSelectedKey();
		var globalData = sap.ui.getCore().getModel("global").getData();
		if(selectedKey =="02"){
			this.oDateChangeDialog.close();
			globalData.changeType = "DB";
			sap.ui.getCore().getModel("global").setData(globalData);
			sap.ui.core.routing.Router.getRouter("MyRouter").navTo("deputation", {
				"depId": Base64.encode(that.oRequestNo)
			});
		}
		sap.ui.getCore().getModel("global").setData(globalData);
		
	},
	
	CheckValidManager:function(changeDate,changeType,oRequest,globalData){
		//if ((globalData.ZZ_TRV_CAT == "TRFR" ||globalData.ZZ_TRV_CAT == "WRKP" ) && globalData.ZZ_DEP_TYPE == "INTL") {
			globalData.changeType = changeType;
			sap.ui.getCore().getModel("global").setData(globalData);
			var mgr_name = sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_GRM;
			var emp_name = sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_NAME;
			if(emp_name == mgr_name){
				mgr_name = null;
			} 
			if( mgr_name == null || mgr_name == undefined || mgr_name == "" )
			{
				if (this.oCommonMngrDialog) {
					this.oCommonMngrDialog.destroy();
				}
				// instantiate the Fragment if not done yet
				this.oCommonMngrDialog = sap.ui.xmlfragment("sap.ui.project.e2etm.fragment.common.CheckValidMgr", this);
				this.oCommonMngrDialog.open();
			}else{
				sap.ui.core.routing.Router.getRouter("MyRouter").navTo("deputation", {
					"depId": Base64.encode(oRequest.ZZ_DEP_REQ)
				});
			}
	//	}
	
	},
	
	onSubmitMgrNTID: function(){
		var that= this;
		var ntidmgr1 = sap.ui.getCore().byId("ManagerL1").getValue().toUpperCase();
		var ntidmgr2 = sap.ui.getCore().byId("ManagerL2").getValue().toUpperCase();
		var empNtid = sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_NTID;
		var globalData = sap.ui.getCore().getModel("global").getData();
		if(ntidmgr1 == empNtid || ntidmgr2 == empNtid){
			sap.m.MessageBox.error("Manager and Employee can not be identical");
			return;
		}
		if( ntidmgr1.trim() == null || ntidmgr1.trim() == undefined || ntidmgr1.trim() == "" ){
			sap.m.MessageBox.error("1st level Manager's NTID is mandatory");
			return;
		}
		sap.ui.project.e2etm.util.StaticUtility.setBusy(true, oHomeThis);
		var lv_epernr = sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_PERNR;
		var error_txt = "";
		var get = $.ajax({
			cache: false,
			url:  sServiceUrl + "CheckValidManager?NTID_L1='"
				+ntidmgr1.trim()+"'&NTID_L2='"+ntidmgr2.trim()+"'&EmpNo='"+lv_epernr+"'&Begda='"
				+globalData.ZZ_DEP_STDATE +"'&Endda='"+globalData.ZZ_DEP_ENDATE+"'&$format=json",
			async: false,
			type: "GET"
		});
		get.done(function(result) {
			sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
			if (result != null) {
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
					sap.ui.core.routing.Router.getRouter("MyRouter").navTo("deputation", {
						"depId": Base64.encode(globalData.ZZ_DEP_REQ)
					});
					/////////////////////////////////////////////////
				}
			}
		});
	},
	
	// EVENT ON CLICKING OF UPLOAD VISA COPIES IN VISACOPY PANEL DIALOG BY EMPLOYEE
	onVisaCopyUpload: function(evt) {
		sap.ui.project.e2etm.util.StaticUtility.setBusy(true, oHomeThis);
		// Send data for visa plan creation.
		var aData = sap.ui.getCore().byId("dialogUploadVisaCopy").getModel().getData();
		// Visa header
		var data = aData.selfVisa;
		// Visa items
		var items = aData.visaItems;

		// Validate visa header for employee
		var sError = oHomeThis.validateVisaUploadSelf(data);
		if (sError != "") {
			sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
			sap.ca.ui.message.showMessageBox({
				type: sap.ca.ui.message.Type.ERROR,
				message: sError,
				details: sError
			});
			return;
		}

		//Validate visa header for dependent
		sError = oHomeThis.validateVisaUploadDependent(items);
		if (sError != "") {
			sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
			sap.ca.ui.message.showMessageBox({
				type: sap.ca.ui.message.Type.ERROR,
				message: sError,
				details: sError
			});
			return;
		}

		if (data.ZZ_MULT_ENTRY_CHAR) {
			data.ZZ_MULT_ENTRY = 'X';
		} else {
			data.ZZ_MULT_ENTRY = '';
		}

		// Validate if visaExisting Dependent has all value
		for (var i = 0; i < items.length; i++) {
			var regex = new RegExp(/\(([^)]+)\)/g);
			var dependentType = regex.exec(items[i].ZZ_DEPNDT_TYP)[1];
			items[i].ZZ_DEPNDT_TYP = dependentType;

			if (items[i].ZZ_MULT_ENTRY_CHAR) {
				items[i].ZZ_MULT_ENTRY = 'X';
			} else {
				items[i].ZZ_MULT_ENTRY = '';
			}
			delete items[i]["ZZ_MULT_ENTRY_CHAR"];
			delete items[i]["ZZ_VISA_EDATE_VALUE"];
			delete items[i]["ZZ_VISA_SDATE_VALUE"];
			delete items[i]["ZZ_VISA_EDATE_ERROR"];
			delete items[i]["ZZ_VISA_SDATE_ERROR"];
			delete items[i]["ZZ_PASSPORT_NO_ERROR"];
			delete items[i]["ZZ_VISA_NO_ERROR"];
			delete items[i].enabled;
			delete items[i].enabledUpload;
			delete items[i].href;
			delete items[i].visibleOpen;
		}
		delete data["ZZ_DEP_PERNR"];
		delete data["ZZ_TRV_CAT"];
		delete data["ZZ_DEPNDT_TYP"];
		delete data["ZZ_MULT_ENTRY_CHAR"];
		delete data["ZZ_VISA_EDATE_VALUE"];
		delete data["ZZ_VISA_SDATE_VALUE"];
		delete data["ZZ_VISA_EDATE_ERROR"];
		delete data["ZZ_VISA_SDATE_ERROR"];
		delete data["ZZ_PASSPORT_NO_ERROR"];
		delete data["ZZ_VISA_NO_ERROR"];
		delete data["enabled"];
		delete data["enabledUpload"];
		delete data["href"];
		delete data["visibleOpen"];
		data.VISAPLANTOITEM = items;

		// Call service to create visa plan
		var token = "";
		var get = $.ajax({
			cache: false,
			url: sServiceUrl + "EMP_PASSPORT_INFOSet",
			type: "GET",
			headers: {
				'Authorization': token
			},
			beforeSend: function(xhr) {
				xhr.setRequestHeader('X-CSRF-Token', 'Fetch');
			}
		});
		get.done(function(result, response, header) {
			token = header.getResponseHeader("X-CSRF-Token");
			var post = $.ajax({
				cache: false,
				url: sServiceUrl + "DEP_VISA_PLANSet",
				type: "POST",
				beforeSend: function(xhr) {
					xhr.setRequestHeader('X-Requested-With', "XMLHttpRequest");
					xhr.setRequestHeader('X-CSRF-Token', token);
					xhr.setRequestHeader('Accept', "application/json");
					xhr.setRequestHeader('DataServiceVersion', "2.0");
					xhr.setRequestHeader('Content-Type', "application/json");
				},
				data: JSON.stringify(data),
				dataType: "json",
				success: function(result) {
					// Close the dialog
					sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
					sap.m.MessageToast.show("Visa copy uploaded successfully!");
					oHomeThis.oCommonDialog.close();
				}
			});
		});
	},
	// EVENT ON UPLOAD VISA COPIES DOCUMENT
	onFileChange: function(evt) {
		var that =this;
		sap.ui.project.e2etm.util.StaticUtility.setBusy(true, oHomeThis);
		if(evt.getSource().getId().indexOf("idFileUploadContractLetter") != -1){
			var sDepReq = this.selecedData.ZZ_DEP_REQ;
			var sEmpNo = this.selecedData.ZZ_DEP_PERNR;
			var source = evt.getSource();
			var trvCat = this.selecedData.ZZ_TRV_CAT;
		}else{
			var aData = sap.ui.getCore().byId("dialogUploadVisaCopy").getModel().getData();
			var sDepReq = aData.selfVisa.ZZ_DEP_REQ;
			var sEmpNo = aData.selfVisa.ZZ_DEP_PERNR;
			var source = evt.getSource();
			var trvCat = aData.selfVisa.ZZ_TRV_CAT;
		}
		var sFileName;
		try {
			var iIndex = source.oParent.oParent.oParent.getCurrentPage() - 1;
		} catch (exc) {}

		var token = "";
		var get = $.ajax({
			cache: false,
			url: sServiceUrl + "EMP_PASSPORT_INFOSet",
			type: "GET",
			headers: {
				'Authorization': token
			},
			beforeSend: function(xhr) {
				xhr.setRequestHeader('X-CSRF-Token', 'Fetch');
			}
		});
		get.done(function(result, response, header) {
			try {///######## UCD1KOR 29 APR 2020 to upload  contract letters added below if condition########/////// srart
				if(source.getId().indexOf("idFileUploadContractLetter") != -1){
					sFileName = "CL_CONTRACT_LETTER_"+sEmpNo+"_"+sDepReq+".PDF";
					docType = "CL";
				}
				else if (source.getId() == "UploadVisaSelf") {
					sFileName = "CL_VISA_COPY_SELF_" + trvCat + source.getProperty("value").substr(source.getProperty("value").lastIndexOf("."));
					docType = "L4";
				} else if (source.getId().substr(0, source.getId().indexOf("-")) == "UploadVisaDependent") {
					var regex = new RegExp(/\(([^)]+)\)/g);
					try{
						var dependentType = regex.exec(source.getParent().getItems()[0].getItems()[0].getText())[1];
					}catch(err){
						var dependentType = regex.exec(source.getParent().getItems()[0].getText())[1];
					}
					
					sFileName = "CL_VISA_COPY_DEPENDENT_" + dependentType + source.getProperty("value").substr(source.getProperty("value").lastIndexOf(
						"."));
					docType = "L4";
				}
				var file = source.oFileUpload.files[0];
				var sUrl = sServiceUrl + "DmsDocsSet";
				sDepReq = sDepReq == null || sDepReq == "" ? '999999999' : sDepReq;
				sEmpNo = sEmpNo == null || sEmpNo == "" ? sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_PERNR : sEmpNo;
				var sSlung = sDepReq + "," + sEmpNo + "," + sFileName + "," + docType;
				var oHeaders = {
					'X-Requested-With': "XMLHttpRequest",
					'X-CSRF-Token': header.getResponseHeader("X-CSRF-Token"),
					'Accept': "application/json",
					'DataServiceVersion': "2.0",
					'Content-Type': "application/json",
					"slug": sSlung
				};
				var post = jQuery.ajax({
					cache: false,
					type: 'POST',
					url: sUrl,
					headers: oHeaders,
					cache: false,
					contentType: file.type,
					processData: false,
					data: file
				});
				post.success(function(data) {
					if (source.getId() == "UploadVisaSelf") {
						aData.selfVisa.visibleOpen = true;
						aData.selfVisa.href = data.d.FileUrl;
						sap.ui.getCore().byId("dialogUploadVisaCopy").getModel().setData(aData);
					} else if (source.getId().substr(0, source.getId().indexOf("-")) == "UploadVisaDependent") {
						aData.visaItems[iIndex].visibleOpen = true;
						aData.visaItems[iIndex].href = data.d.FileUrl;
						sap.ui.getCore().byId("dialogUploadVisaCopy").getModel().setData(aData);
					}
					else if(source.getId().indexOf("idFileUploadContractLetter") != -1){
						that.getContractLettersModified();
					}
					
					
					// Close the dialog
					sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
					sap.m.MessageToast.show("Upload Succesfully");
				});
				post.fail(function(result, response, header) {
					sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
				});
			} catch (exc) {
				sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
			}
		});
	},
	///######## UCD1KOR 29 APR 2020 view con tract letters ########/////// srart
	getContractLettersModified:function(){
		var that =this;
		// Display contract letter
		var contractModel = new sap.ui.model.json.JSONModel();
		var get = $.ajax({
			cache: false,
			url: sServiceUrl + "ZE2E_DOCS_DETAILSSet?$filter=ZZ_DEP_REQ eq '" + this.selecedData.ZZ_DEP_REQ + "'&$format=json",
			type: "GET"
		});
		get.done(function(data) {
			if(data.d.results.length != 0 || data.d.results.length == 0){

				//changed start of code uea6kor 1/12/2020 upgrade issue fix 
				var contractlist = [];//oData.results;
				if (contractlist.length > 0) {

					contractlist.length = 0;
				}
				for (var j = 0; j < data.d.results.length; j++) {
					if (oData.results[j].ZZ_DOKTL == "CL") {
						contractlist.push({
							ZZ_ASG_TYP: data.d.results[j].ZZ_ASG_TYP,
							ZZ_AUTOMATIC: data.d.results[j].ZZ_AUTOMATIC,
							ZZ_DEP_PERNR: data.d.results[j].ZZ_DEP_PERNR,
							ZZ_DEP_REQ: data.d.results[j].ZZ_DEP_REQ,
							ZZ_DOC_PATH: data.d.results[j].ZZ_DOC_PATH,
							ZZ_DOKTL: data.d.results[j].ZZ_DOKTL,
							ZZ_HOSTENTITY: data.d.results[j].ZZ_HOSTENTITY,
							ZZ_JOB: data.d.results[j].ZZ_JOB,
							ZZ_JOB_CLS: data.d.results[j].ZZ_JOB_CLS,
							ZZ_MENTOR:data.d.results[j].ZZ_MENTOR,
							ZZ_SALARY_SHA: data.d.results[j].ZZ_SALARY_SHA,
							ZZ_STADECL_MODE: data.d.results[j].ZZ_STADECL_MODE,
							ZZ_VERSION: data.d.results[j].ZZ_VERSION,

						});

					}
				}
				//var contractlist = data.d.results;
				//changed end of code uea6kor 1/12/2020 upgrade issue fix 
				for (var i = 0; i < contractlist.length; i++) {
					if (i == 0) {
						contractlist[0].ZZ_DOC_NAME = "Contract Letter (Latest version)";
					} else {
						contractlist[i].ZZ_DOC_NAME =
							"Contract Letter version " + (contractlist.length - i);
					}
				}
				contractModel.setData(contractlist);
				that.getView().setModel(contractModel,"contractLetters");
				sap.ui.getCore().setModel(contractModel,"contractLetters");
			}
			
		});
	},///######## UCD1KOR 29 APR 2020 view con tract letters ########/////// end

	// EVENT ON CLICKING OF CLOSE VISACOPY PANEL DIALOG
	onCloseVisaCopyUpload: function(evt) {
		oHomeThis.oCommonDialog.close();
	},

	// EVENT ON CLICKING OF CREATE BUTTON IN EMPLOYEE DASHBOARD (OPEN CREATE OPTION)
	// Add to submenu
	onCreateEMPRequest: function(oRequest, createSubMenu) {
		createSubMenu.removeAllItems();

		var requestMenu = new sap.ui.unified.MenuItem();
		requestMenu.setText("Request");
		requestMenu.setIcon("sap-icon://request");
		createSubMenu.addItem(requestMenu);
		var requestMenuList = new sap.ui.unified.Menu({
			itemSelect: function(evt) {
				oHomeThis.onEMPCreateTrip(evt);
			}
		});
		requestMenu.setSubmenu(requestMenuList);

		var oSecondary = new sap.ui.unified.MenuItem();
		oSecondary.setText("Secondary Travel");
		oSecondary.setIcon("sap-icon://home-share");
		requestMenuList.addItem(oSecondary);

		if (oRequest.ZZ_DEP_TYPE == "INTL") {
			var bEmergency = false;
			var aList = sap.ui.getCore().getModel("global").getData().deputationList;
			for (var i = 0; i < aList.length; i++) {
				if (aList[i].ZZ_REQ_TYP == "EMER" &&
					aList[i].ZZ_STAT_FLAG != "FF001" &&
					aList[i].ZZ_DEP_REQ.replace(/^0+/, '') == oRequest.ZZ_TRV_REQ.replace(/^0+/, '')) {
					bEmergency = true;
					break;
				}
			}
			if (!bEmergency) {
				var oEmergencyTrip = new sap.ui.unified.MenuItem();
				oEmergencyTrip.setText("Emergency Travel");
				oEmergencyTrip.setIcon("images/emergency.png");
				requestMenuList.addItem(oEmergencyTrip);
			}
		}

		if (parseInt(oRequest.ZZ_DEP_DAYS) >
			parseInt(sap.ui.getCore().getModel("global").getData().intlDuration) &&
			oRequest.ZZ_DEP_TYPE == "INTL") {
			var aList = sap.ui.getCore().getModel("global").getData().deputationList;
			var bHome = false;
			for (var i = 0; i < aList.length; i++) {
				if (aList[i].ZZ_REQ_TYP == "HOME" &&
					aList[i].ZZ_DEP_REQ.replace(/^0+/, '') == oRequest.ZZ_TRV_REQ.replace(/^0+/, '')) {
					bHome = true;
					break;
				}
			}
			if (!bHome) {
				var oHomeTrip = new sap.ui.unified.MenuItem();
				oHomeTrip.setText("Home Travel");
				oHomeTrip.setIcon("sap-icon://home");
				requestMenuList.addItem(oHomeTrip);
			}
		}

		return createSubMenu;
	},
	// EVENT ON CLICKING OF EACH CREATE OPTION IN EMPLOYEE DASHBOARD (sencondary, home, emergency)
	onEMPCreateTrip: function(oRequest, param) {
		var that =this;
		var globalData = sap.ui.getCore().getModel("global").getData();
		globalData.isChange = false;
		globalData.isCreate = true;
		delete globalData["screenData"];
		globalData.ZZ_DEP_TOCNTRY = oRequest.ZZ_DEP_TOCNTRY;
		globalData.ZZ_DEP_TOLOC = oRequest.ZZ_DEP_TOLOC;
		globalData.ZZ_DEP_TOLOC_TXT = oRequest.ZZ_DEP_TOLOC_TXT;
		globalData.ZZ_DEP_STDATE = oRequest.ZZ_DEP_STDATE;
		globalData.ZZ_DEP_ENDATE = oRequest.ZZ_DEP_ENDATE;
		globalData.ZZ_FAMILY_ACCOMP = oRequest.ZZ_FAMILY_ACCOMP;
		globalData.ZZ_SP_CMPNY = oRequest.ZZ_SP_CMPNY;
		globalData.ZZ_ASG_TYP = oRequest.ZZ_ASG_TYP;

		// Common with onEMPChangeClick
		globalData.changeType = "";
		globalData.ZZ_DEP_TYPE = oRequest.ZZ_DEP_TYPE;
		globalData.ZZ_REQ_TYP = oRequest.ZZ_REQ_TYP;
		globalData.ZZ_STAT_FLAG = oRequest.ZZ_STAT_FLAG;
		globalData.ZZ_DEP_PERNR = oRequest.ZZ_DEP_PERNR;
		globalData.ZZ_VERSION = oRequest.ZZ_VERSION;
		globalData.ZZ_TRV_REQ = oRequest.ZZ_TRV_REQ;
		globalData.ZZ_VISA_PLAN = oRequest.ZZ_VISA_PLAN;
		globalData.ZZ_DEP_TOCNTRY_TXT = oRequest.ZZ_DEP_TOCNTRY_TXT;
		globalData.ZZ_TRV_CAT = oRequest.ZZ_TRV_CAT;
		globalData.ZZ_TIMESTAMP = oRequest.ZZ_TIMESTAMP;

		var stvaFlag;
		switch (param) {
			case "Request personal baggage onward":
				var oThis = this;
				var dialog = new sap.m.Dialog({
					title: 'Confirm',
					type: 'Message',
					content: [
						new sap.m.Text({
							text: 'On the approval of the Travel Plan, the INR amount will be processed to your salary bank account.'
						}),
						new sap.m.Text({
							text: '100 - 184 days     : INR 10000 advance.'
						}),
						new sap.m.Text({
							text: '185 days and above : INR 20000 advance.'
						}),
						new sap.m.Text({
							text: '---------------------------------------------------------------------------------------------'
						}),
						new sap.m.Text({
							text: 'Please note that, if opted for personal baggage, you will not be able to raise a Cargo request.'
						}),
						new sap.m.Text({
							text: 'Are you sure you want to request personal baggage ?'
						}),
						new sap.m.TextArea('submitDialogTextarea', {
							liveChange: function(oEvent) {
								var sText = oEvent.getParameter('value');
								var parent = oEvent.getSource().getParent();

								parent.getBeginButton().setEnabled(sText.length > 0);
							},
							width: '100%',
							placeholder: 'Comment (required)'
						})
					],
					beginButton: new sap.m.Button({
						text: 'Submit',
						enabled: false,
						press: function() {
							sap.ui.project.e2etm.util.StaticUtility.setBusy(true, oThis);
							var sText = sap.ui.getCore().byId('submitDialogTextarea').getValue();

							oRequest.PersonalBaggage = {};
							oRequest.PersonalBaggage.ZZ_REINR = oRequest.ZZ_TRV_REQ;
							oRequest.PersonalBaggage.ZZ_OWNER = oRequest.ZZ_DEP_PERNR;
							oRequest.PersonalBaggage.ZZ_TRV_KEY = oRequest.ZZ_REQ_TYP;
							oRequest.PersonalBaggage.ZZ_VERSION = oRequest.ZZ_VERSION.trim();
							oRequest.PersonalBaggage.ZZ_COMMENT = sText;

							var oModel = oThis.getView().getModel();
							oModel.setHeaders({
								role: "01",
								action: "01",
								MODID: "CAPO"
							});
							oModel.create("/ZE2E_CARGOSet", oRequest.PersonalBaggage, {
								success: jQuery.proxy(function(mResponse) {
									jQuery.sap.require("sap.m.MessageToast");
									// ID of newly inserted product is available in mResponse.ID
									sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oThis);
									sap.m.MessageToast.show("Request onward personal baggage successfully!");
									//refresh refresh list to refresh buttons
									sap.ui.project.e2etm.util.StaticUtility.setBusy(true, oHomeThis);
									oHomeThis.bindDataBasedOnRole();
								}, this),
								error: jQuery.proxy(function() {
									sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oThis);
									sap.m.MessageToast.show("Error!");
								}, this)
							});
							dialog.close();
							oRequest.PersonalBaggage = {};
						}
					}),
					endButton: new sap.m.Button({
						text: 'Cancel',
						press: function() {
							dialog.close();
						}
					}),
					afterClose: function() {
						dialog.destroy();
					}
				});
				dialog.open();
				return true;
			case "Request personal baggage return":
				var oThis = this;
				var dialog = new sap.m.Dialog({
					title: 'Confirm',
					type: 'Message',
					content: [
						new sap.m.Text({
							text: 'On the approval of the Travel Plan, the INR amount will be processed to your salary bank account.'
						}),
						new sap.m.Text({
							text: '100 - 184 days     : INR 10000 advance.'
						}),
						new sap.m.Text({
							text: '185 days and above : INR 20000 advance.'
						}),
						new sap.m.Text({
							text: '---------------------------------------------------------------------------------------------'
						}),
						new sap.m.Text({
							text: 'Please note that, if opted for personal baggage, you will not be able to raise a Cargo request.'
						}),
						new sap.m.Text({
							text: 'Are you sure you want to request personal baggage ?'
						}),
						new sap.m.TextArea('submitDialogTextarea', {
							liveChange: function(oEvent) {
								var sText = oEvent.getParameter('value');
								var parent = oEvent.getSource().getParent();

								parent.getBeginButton().setEnabled(sText.length > 0);
							},
							width: '100%',
							placeholder: 'Comment (required)'
						})
					],
					beginButton: new sap.m.Button({
						text: 'Submit',
						enabled: false,
						press: function() {
							sap.ui.project.e2etm.util.StaticUtility.setBusy(true, oThis);
							var sText = sap.ui.getCore().byId('submitDialogTextarea').getValue();

							oRequest.PersonalBaggage = {};
							oRequest.PersonalBaggage.ZZ_REINR = oRequest.ZZ_TRV_REQ;
							oRequest.PersonalBaggage.ZZ_OWNER = oRequest.ZZ_DEP_PERNR;
							oRequest.PersonalBaggage.ZZ_TRV_KEY = oRequest.ZZ_REQ_TYP;
							oRequest.PersonalBaggage.ZZ_VERSION = oRequest.ZZ_VERSION.trim();
							oRequest.PersonalBaggage.ZZ_COMMENT = sText;

							var oModel = oThis.getView().getModel();
							oModel.setHeaders({
								role: "01",
								action: "01",
								MODID: "CAPR"
							});
							oModel.create("/ZE2E_CARGOSet", oRequest.PersonalBaggage, {
								success: jQuery.proxy(function(mResponse) {
									jQuery.sap.require("sap.m.MessageToast");
									// ID of newly inserted product is available in mResponse.ID
									sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oThis);
									sap.m.MessageToast.show("Request onward personal baggage successfully!");
									//refresh refresh list to refresh buttons
									sap.ui.project.e2etm.util.StaticUtility.setBusy(true, oHomeThis);
									oHomeThis.bindDataBasedOnRole();
								}, this),
								error: jQuery.proxy(function() {
									sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oThis);
									sap.m.MessageToast.show("Error!");
								}, this)
							});
							dialog.close();
							oRequest.PersonalBaggage = {};
						}
					}),
					endButton: new sap.m.Button({
						text: 'Cancel',
						press: function() {
							dialog.close();
						}
					}),
					afterClose: function() {
						dialog.destroy();
					}
				});
				dialog.open();
				return true;
			case "Create onward cargo request":
				globalData.action = "00"; //Create
				//ZZ_FAMILY_ACCOMP
				if (this.setCargoLinkEnable(oRequest, "O")) {
					stvaFlag = sap.ui.project.e2etm.util.StaticUtility.checkValidCargoTp(oRequest.ZZ_ASG_TYP, oRequest.ZZ_TRV_REQ, oRequest.ZZ_DEP_TOCNTRY,
						oRequest.ZZ_DEP_TOLOC);
					// oRequest.ZZ_ASG_TYP == "STX" ucd1kor added oRequest.ZZ_ASG_TYP == "STX"
					if (oRequest.ZZ_ASG_TYP == "STX" || oRequest.ZZ_ASG_TYP == "VA" || oRequest.ZZ_ASG_TYP == "VN" || stvaFlag || oRequest.ZZ_ASG_TYP == "NC" || oRequest.ZZ_ASG_TYP == "LTX" || oRequest.ZZ_ASG_TYP == "NCX") { //added by uml6kor 6.9.2019 new policy asg models
						globalData.ZZ_ASG_TYP = oRequest.ZZ_ASG_TYP;
						globalData.ZZ_DEP_DAYS = oRequest.ZZ_DEP_DAYS;
						globalData.ZZ_FAMILY_ACCOMP = oRequest.ZZ_FAMILY_ACCOMP;
						if (stvaFlag && gCargoVendor == "DHL")
							globalData.ZZ_CAR_TYP = "O";
						else
							globalData.ZZ_CAR_TYP = "V";
						sap.ui.getCore().getModel("global").setData(globalData);
						//        sap.ui.core.routing.Router.getRouter("MyRouter").navTo("CargoVAVN"); //form CargoVAVN currently not used
						//sap.ui.core.routing.Router.getRouter("MyRouter").navTo("cargo");   //commented
						
//						********Added by UEA6KOR_24.2.2020 for disabling DHL Cargo*******
						if (gCargoVendor == "AAL"){		
							this.showCargoLeadTimeDialog(this.setCargoLinkTooltip(oRequest, "O"));	 
							//sap.ui.core.routing.Router.getRouter("MyRouter").navTo("cargo");
						}else{
							this.onDisableDHL();
						}
//						********Added by UEA6KOR_24.2.2020 for disabling DHL Cargo*******
						
					} else {
						globalData.ZZ_ASG_TYP = oRequest.ZZ_ASG_TYP;
						globalData.ZZ_DEP_DAYS = oRequest.ZZ_DEP_DAYS;
						globalData.ZZ_FAMILY_ACCOMP = oRequest.ZZ_FAMILY_ACCOMP;
						globalData.ZZ_CAR_TYP = "O";
						sap.ui.getCore().getModel("global").setData(globalData);
						//sap.ui.core.routing.Router.getRouter("MyRouter").navTo("cargo"); //commented						
						this.onDisableDHL();  //Added by UEA6KOR_24.2.2020 for disabling DHL Cargo
						
					}

				} else {
					this.showCargoLeadTimeDialog(this.setCargoLinkTooltip(oRequest, "O"));
				}
				return true;
			case "Change Onward Request":
				globalData.action = "01"; //Change
				//ZZ_FAMILY_ACCOMP
				stvaFlag = sap.ui.project.e2etm.util.StaticUtility.checkValidCargoTp(oRequest.ZZ_ASG_TYP, oRequest.ZZ_TRV_REQ,
					oRequest.ZZ_DEP_TOCNTRY, oRequest.ZZ_DEP_TOLOC);
				// UCD1KOR condition added  oRequest.ZZ_ASG_TYP == "STX" 22 jan 2021
				if (oRequest.ZZ_ASG_TYP == "STX" || oRequest.ZZ_ASG_TYP == "VA" || oRequest.ZZ_ASG_TYP == "VN" || stvaFlag || oRequest.ZZ_ASG_TYP == "NC" || oRequest.ZZ_ASG_TYP == "LTX" || oRequest.ZZ_ASG_TYP == "NCX") { //added by uml6kor 6.9.2019 new policy asg models) {
					globalData.ZZ_ASG_TYP = oRequest.ZZ_ASG_TYP;
					if (stvaFlag && gCargoVendor == "DHL")
						globalData.ZZ_CAR_TYP = "O";
					else
						globalData.ZZ_CAR_TYP = "V";
					sap.ui.getCore().getModel("global").setData(globalData);
					//        sap.ui.core.routing.Router.getRouter("MyRouter").navTo("CargoVAVN"); //form CargoVAVN currently not used
					sap.ui.core.routing.Router.getRouter("MyRouter").navTo("cargo");
				} else {
					globalData.ZZ_ASG_TYP = oRequest.ZZ_ASG_TYP;
					globalData.ZZ_CAR_TYP = "O";
					sap.ui.getCore().getModel("global").setData(globalData);
					sap.ui.core.routing.Router.getRouter("MyRouter").navTo("cargo");
				}
				return true;
			case "Open Onward Request":
				var actionFlag = this.checkCargoCancelRequest(oRequest, "CARO");
				if (actionFlag)
					globalData.action = "09"; //Cancelled
				else
					globalData.action = "02"; //Open
				//ZZ_FAMILY_ACCOMP
				stvaFlag = sap.ui.project.e2etm.util.StaticUtility.checkValidCargoTp(oRequest.ZZ_ASG_TYP, oRequest.ZZ_TRV_REQ,
					oRequest.ZZ_DEP_TOCNTRY, oRequest.ZZ_DEP_TOLOC);
				// UCD1KOR condition added  oRequest.ZZ_ASG_TYP == "STX" 22 jan 2021
				if (oRequest.ZZ_ASG_TYP == "STX" || oRequest.ZZ_ASG_TYP == "VA" || oRequest.ZZ_ASG_TYP == "VN" || stvaFlag || oRequest.ZZ_ASG_TYP == "NC" || oRequest.ZZ_ASG_TYP == "LTX" || oRequest.ZZ_ASG_TYP == "NCX") { //added by uml6kor 6.9.2019 new policy asg models) {
					globalData.ZZ_ASG_TYP = oRequest.ZZ_ASG_TYP;
					globalData.ZZ_DEP_DAYS = oRequest.ZZ_DEP_DAYS;
					globalData.ZZ_FAMILY_ACCOMP = oRequest.ZZ_FAMILY_ACCOMP;
					if (stvaFlag && gCargoVendor == "DHL")
						globalData.ZZ_CAR_TYP = "O"; //DHL
					else
						globalData.ZZ_CAR_TYP = "V"; //AAL
					sap.ui.getCore().getModel("global").setData(globalData);
					//        sap.ui.core.routing.Router.getRouter("MyRouter").navTo("CargoVAVN"); //form CargoVAVN currently not used
					sap.ui.core.routing.Router.getRouter("MyRouter").navTo("cargo");
				} else {
					globalData.ZZ_ASG_TYP = oRequest.ZZ_ASG_TYP;
					globalData.ZZ_DEP_DAYS = oRequest.ZZ_DEP_DAYS;
					globalData.ZZ_FAMILY_ACCOMP = oRequest.ZZ_FAMILY_ACCOMP;
					globalData.ZZ_CAR_TYP = "O";
					sap.ui.getCore().getModel("global").setData(globalData);
					sap.ui.core.routing.Router.getRouter("MyRouter").navTo("cargo");
				}
				return true;
			case "Create return cargo request":
				globalData.action = "00"; //Create return Cargo
				if (this.setCargoLinkEnable(oRequest, "R")) {
					stvaFlag = sap.ui.project.e2etm.util.StaticUtility.checkValidCargoTp(oRequest.ZZ_ASG_TYP, oRequest.ZZ_TRV_REQ,
						oRequest.ZZ_DEP_TOCNTRY, oRequest.ZZ_DEP_TOLOC);
					// UCD1KOR condition added  oRequest.ZZ_ASG_TYP == "STX" 22 jan 2021
					if (stvaFlag || oRequest.ZZ_ASG_TYP == "NC" ||  oRequest.ZZ_ASG_TYP == "STX") {
						if (Number(oRequest.ZZ_DEP_DAYS) >= Number(globalData.cargoStvaMinDur)) {
							globalData.ZZ_ASG_TYP = oRequest.ZZ_ASG_TYP;
							globalData.ZZ_DEP_DAYS = oRequest.ZZ_DEP_DAYS;
							globalData.ZZ_FAMILY_ACCOMP = oRequest.ZZ_FAMILY_ACCOMP;
							globalData.ZZ_CAR_TYP = "S"; //AAL
							sap.ui.getCore().getModel("global").setData(globalData);
							//sap.ui.core.routing.Router.getRouter("MyRouter").navTo("cargo");
							//############# UCD1KOR Commented above line added below line #############/////////////////
							this.showCargoLeadTimeDialog(this.setCargoLinkTooltip(oRequest, "O"));	
						}
					} else {
						if ((Number(oRequest.ZZ_DEP_DAYS) >= Number(globalData.cargoCondition))) {
							globalData.ZZ_ASG_TYP = oRequest.ZZ_ASG_TYP;
							globalData.ZZ_DEP_DAYS = oRequest.ZZ_DEP_DAYS;
							globalData.ZZ_FAMILY_ACCOMP = oRequest.ZZ_FAMILY_ACCOMP;

							if (oRequest.ZZ_FAMILY_ACCOMP == 'X') {
								globalData.ZZ_CAR_TYP = "S"; //AAL
							} else {
								globalData.ZZ_CAR_TYP = "R"; //DHL
							}

							if (oRequest.ZZ_ASG_TYP == "STA" && oRequest.ZZ_DEP_TOCNTRY == "DE") {
								globalData.ZZ_CAR_TYP = "R"; //DHL
							} else if (oRequest.ZZ_ASG_TYP == "STA" && oRequest.ZZ_DEP_TOCNTRY != "DE") {
								if (oRequest.ZZ_FAMILY_ACCOMP == 'X')
									globalData.ZZ_CAR_TYP = "S"; //AAL
								else
									globalData.ZZ_CAR_TYP = "R"; //DHL
							}

							sap.ui.getCore().getModel("global").setData(globalData);
							//sap.ui.core.routing.Router.getRouter("MyRouter").navTo("cargo"); 
							
							//********Added by UEA6KOR_24.2.2020 for disabling DHL Cargo
							if (globalData.ZZ_CAR_TYP == "S" || globalData.ZZ_CAR_TYP == "V"){
								this.showCargoLeadTimeDialog(this.setCargoLinkTooltip(oRequest, "O"));
								//############# UCD1KOR Commented below line added above line #############/////////////////
								//sap.ui.core.routing.Router.getRouter("MyRouter").navTo("cargo");
							}else{
								this.onDisableDHL();
							}
							//********Added by UEA6KOR_24.2.2020 for disabling DHL Cargo
						} else {
							globalData.ZZ_ASG_TYP = oRequest.ZZ_ASG_TYP;
							globalData.ZZ_DEP_DAYS = oRequest.ZZ_DEP_DAYS;
							globalData.ZZ_FAMILY_ACCOMP = oRequest.ZZ_FAMILY_ACCOMP;
							globalData.ZZ_CAR_TYP = "R"; //DHL
							sap.ui.getCore().getModel("global").setData(globalData);
							//sap.ui.core.routing.Router.getRouter("MyRouter").navTo("cargo"); //commented
							this.onDisableDHL();   //Added by UEA6KOR_24.2.2020 for disabling DHL Cargo
						}
					}

				} else {
					this.showCargoLeadTimeDialog(this.setCargoLinkTooltip(oRequest, "R"));
				}
				return true;
			case "Change Return Request":
				globalData.action = "01"; //Change
				stvaFlag = sap.ui.project.e2etm.util.StaticUtility.checkValidCargoTp(oRequest.ZZ_ASG_TYP, oRequest.ZZ_TRV_REQ,
					oRequest.ZZ_DEP_TOCNTRY, oRequest.ZZ_DEP_TOLOC);
				// UCD1KOR condition added  oRequest.ZZ_ASG_TYP == "STX" 22 jan 2021
				if (stvaFlag || oRequest.ZZ_ASG_TYP == "NC" || oRequest.ZZ_ASG_TYP == "STX") {
					if (Number(oRequest.ZZ_DEP_DAYS) >= Number(globalData.cargoStvaMinDur)) {
						globalData.ZZ_ASG_TYP = oRequest.ZZ_ASG_TYP;
						globalData.ZZ_DEP_DAYS = oRequest.ZZ_DEP_DAYS;
						globalData.ZZ_FAMILY_ACCOMP = oRequest.ZZ_FAMILY_ACCOMP;
						globalData.ZZ_CAR_TYP = "S"; //AAL
						sap.ui.getCore().getModel("global").setData(globalData);
						sap.ui.core.routing.Router.getRouter("MyRouter").navTo("cargo");
					}
				} else {
					if ((Number(oRequest.ZZ_DEP_DAYS) >= Number(globalData.cargoCondition))) {
						globalData.ZZ_ASG_TYP = oRequest.ZZ_ASG_TYP;
						globalData.ZZ_DEP_DAYS = oRequest.ZZ_DEP_DAYS;
						globalData.ZZ_FAMILY_ACCOMP = oRequest.ZZ_FAMILY_ACCOMP;

						if (oRequest.ZZ_FAMILY_ACCOMP == 'X') { //if family accompanied then AAL
							globalData.ZZ_CAR_TYP = "S"; //AAL
						} else {
							globalData.ZZ_CAR_TYP = "R"; //DHL
						}
						/*Start-newly added for STA*/
						if (oRequest.ZZ_ASG_TYP == "STA" && oRequest.ZZ_DEP_TOCNTRY == "DE") {
							globalData.ZZ_CAR_TYP = "R"; //DHL
						} else if (oRequest.ZZ_ASG_TYP == "STA" && oRequest.ZZ_DEP_TOCNTRY != "DE") {
							if (oRequest.ZZ_FAMILY_ACCOMP == 'X')
								globalData.ZZ_CAR_TYP = "S"; //AAL
							else
								globalData.ZZ_CAR_TYP = "R"; //DHL
						}
						/*End-newly added for STA*/

						sap.ui.getCore().getModel("global").setData(globalData);
						sap.ui.core.routing.Router.getRouter("MyRouter").navTo("cargo");
					} else {
						globalData.ZZ_ASG_TYP = oRequest.ZZ_ASG_TYP;
						globalData.ZZ_DEP_DAYS = oRequest.ZZ_DEP_DAYS;
						globalData.ZZ_FAMILY_ACCOMP = oRequest.ZZ_FAMILY_ACCOMP;
						globalData.ZZ_CAR_TYP = "R"; //DHL
						sap.ui.getCore().getModel("global").setData(globalData);
						sap.ui.core.routing.Router.getRouter("MyRouter").navTo("cargo");
					}
				}
				return true;
			case "Open Return Request":
				var actionFlag = this.checkCargoCancelRequest(oRequest, "CARR");
				if (actionFlag)
					globalData.action = "09"; // Cancelled
				else
					globalData.action = "02"; // Open
				stvaFlag = sap.ui.project.e2etm.util.StaticUtility.checkValidCargoTp(oRequest.ZZ_ASG_TYP, oRequest.ZZ_TRV_REQ,
					oRequest.ZZ_DEP_TOCNTRY, oRequest.ZZ_DEP_TOLOC);
				// UCD1KOR condition added  oRequest.ZZ_ASG_TYP == "STX" 22 jan 2021
				if (stvaFlag || oRequest.ZZ_ASG_TYP == "NC" || oRequest.ZZ_ASG_TYP == "STX") {
					if (Number(oRequest.ZZ_DEP_DAYS) >= Number(globalData.cargoStvaMinDur)) {
						globalData.ZZ_ASG_TYP = oRequest.ZZ_ASG_TYP;
						globalData.ZZ_DEP_DAYS = oRequest.ZZ_DEP_DAYS;
						globalData.ZZ_FAMILY_ACCOMP = oRequest.ZZ_FAMILY_ACCOMP;
						globalData.ZZ_CAR_TYP = "S"; //AAL
						sap.ui.getCore().getModel("global").setData(globalData);
						sap.ui.core.routing.Router.getRouter("MyRouter").navTo("cargo");
					}
				} else {
					if ((Number(oRequest.ZZ_DEP_DAYS) >= Number(globalData.cargoCondition))) {
						globalData.ZZ_ASG_TYP = oRequest.ZZ_ASG_TYP;
						globalData.ZZ_DEP_DAYS = oRequest.ZZ_DEP_DAYS;
						globalData.ZZ_FAMILY_ACCOMP = oRequest.ZZ_FAMILY_ACCOMP;
						//        if(oRequest.ZZ_ASG_TYP !="STVA"){
						if (oRequest.ZZ_FAMILY_ACCOMP == 'X') { // if family
							// accompanied then
							// AAL
							globalData.ZZ_CAR_TYP = "S"; // AAL
						} else {
							globalData.ZZ_CAR_TYP = "R"; // DHL
						}

						/*Start-newly added for STA*/
						if (oRequest.ZZ_ASG_TYP == "STA" && oRequest.ZZ_DEP_TOCNTRY == "DE") {
							globalData.ZZ_CAR_TYP = "R"; //DHL
						} else if (oRequest.ZZ_ASG_TYP == "STA" && oRequest.ZZ_DEP_TOCNTRY != "DE") {
							if (oRequest.ZZ_FAMILY_ACCOMP == 'X')
								globalData.ZZ_CAR_TYP = "S"; //AAL
							else
								globalData.ZZ_CAR_TYP = "R"; //DHL
						}
						/*End-newly added for STA*/

						sap.ui.getCore().getModel("global").setData(globalData);
						sap.ui.core.routing.Router.getRouter("MyRouter").navTo("cargo");
					} else {
						globalData.ZZ_ASG_TYP = oRequest.ZZ_ASG_TYP;
						globalData.ZZ_DEP_DAYS = oRequest.ZZ_DEP_DAYS;
						globalData.ZZ_FAMILY_ACCOMP = oRequest.ZZ_FAMILY_ACCOMP;
						globalData.ZZ_CAR_TYP = "R"; //DHL
						sap.ui.getCore().getModel("global").setData(globalData);
						sap.ui.core.routing.Router.getRouter("MyRouter").navTo("cargo");
					}
				}
				return true;
			case "Create Insurance Request":
				globalData.action = "00"; //Create
				sap.ui.getCore().getModel("global").setData(globalData);
				sap.ui.core.routing.Router.getRouter("MyRouter").navTo("insurance");
				return true;
			case "Change Insurance Request":
				globalData.action = "01"; //Change
				sap.ui.getCore().getModel("global").setData(globalData);
				sap.ui.core.routing.Router.getRouter("MyRouter").navTo("insurance");
				return true;
			case "Open Insurance Request":
				globalData.action = "02"; //Open
				sap.ui.getCore().getModel("global").setData(globalData);
				sap.ui.core.routing.Router.getRouter("MyRouter").navTo("insurance");
				return true;
			case "Secondary travel request": //Sencondary trip
				globalData.ZZ_REQ_TYP = "SECO";
			////started by uml6kor 27/12/2019 trvl_settlement seco travel
				sap.ui.project.e2etm.util.StaticUtility.setBusy(true, oHomeThis);
				var trvl_set_url = sServiceUrl + "checkTrvlSettlement?&ZZ_PERNR='" +
				globalData.ZZ_DEP_PERNR +
				"'&ZZ_SMODID='"+globalData.ZZ_DEP_TYPE+
				"'&ZZ_MODID='" +globalData.ZZ_REQ_TYP+
				"'&ZZ_ENDDATE='"+globalData.ZZ_DEP_ENDATE+
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
					that.onValidationCheck = true;
					sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
				});
				get.fail(function(err) {
					that.onValidationCheck = false;
					sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
					sap.m.MessageBox.error("We are not able to Porcess your request.Try After some time");
				});
				if( reinr_arr.length > 0 && that.onValidationCheck == true)
				{var list_r = "";
				var blkflag = "";
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
				blkflag = 'X'; //added by uml6kor 17/3/2020 new validation policy for trvl settlements
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
				
					//ended by uml6kor 27/12/2019 trvl_settlement
				
				//started by UEA6KOR_6.11.2020 NonPE Tax changes
				if( ((globalData.ZZ_REQ_TYP == "BUSR" || globalData.ZZ_REQ_TYP == "INFO") && ( globalData.ZZ_DEP_TYPE == "INTL"))){
					sap.ui.project.e2etm.util.StaticUtility.setBusy(true, oHomeThis);
					 var taxURL = "CheckNonPETaxExpSet(ZZ_MODID='"+globalData.ZZ_REQ_TYP+"',ZZ_SMODID='"+globalData.ZZ_DEP_TYPE+"',ZZ_PERNR='" +
					       globalData.ZZ_DEP_PERNR +
						"',ZZ_ENDDATE='"+globalData.ZZ_DEP_ENDATE+
						"',ZZ_STDATE='"+globalData.ZZ_DEP_ENDATE+
						"',ZZ_CNTRY='"+globalData.ZZ_DEP_TOCNTRY+"')";
					 
					 var totalDur;

					oDataModel.read(taxURL, null, null, false, jQuery.proxy(function(oData, response) {
						totalDur = oData.ZZ_DURATION;
						
						
					},this), function(error) {
						sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
						sap.m.MessageBox.error("We are not able to Porcess your request.Try After some time");
						return;
						
					});
					
					sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
					if(totalDur != "1-"){
						var total = 180;
						var remDur = total - totalDur;
						if (oRequest.ZZ_DEP_DAYS > remDur){
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
													
				//ended by UEA6KOR_6.11.2020 NonPE Tax changes
				}
				
				sap.ui.getCore().getModel("global").setData(globalData);
				sap.ui.core.routing.Router.getRouter("MyRouter").navTo("deputation");
				return true;
			case "Home trip travel request": //Home trip
				globalData.ZZ_REQ_TYP = "HOME";
				sap.ui.getCore().getModel("global").setData(globalData);
				sap.ui.core.routing.Router.getRouter("MyRouter").navTo("deputation");
				return true;
			case "Emergency travel request": //Emergency trip
				globalData.ZZ_REQ_TYP = "EMER";
				sap.ui.getCore().getModel("global").setData(globalData);
				sap.ui.core.routing.Router.getRouter("MyRouter").navTo("deputation");
				return true;
		}
		return false;
	},
	checkBReqStatusFlag: function(oRequest, flag) {
		if (flag) {
			if (oRequest.ZZ_STAT_FLAG == "002" || oRequest.ZZ_STAT_FLAG == "CANCL" || oRequest.ZZ_STAT_FLAG == "FF002" || oRequest.ZZ_STAT_FLAG ==
				"007") {
				flag = false;
			}
		}
		return flag;
	},
	// EVENT ON CLICKING OF OPEN ACTION LIST BUTTON IN DASHBOARD
	onOpenActionList: function(curEvt) {
		oHomeThis.selectedItem = curEvt.getSource();

		// Get the current selected Request
		var oRequest = curEvt.getSource().getModel().getProperty(curEvt.getSource().getBindingContext().getPath());

		// Depends on the current status of a request, the appropriate options will be displayed
		// Normally, there are 3 main buttons: view details, cancel, change and create
		// Prepare to open the popup
		if (!oHomeThis.openMenu) {
			oHomeThis.openMenu = new sap.ui.unified.Menu({
				itemSelect: function(evt) {
					oHomeThis.onMenuActionClick(evt);
				}
			});
		}
		oHomeThis.openMenu.removeAllItems();

		// display Cancel Button?
		var cancelFlag = false;
		var isTravelSettlementClosed = false;

		try {
			for (var i = 0; i < oRequest.ZE2E_REQ_STATUSSet.results.length; i++) {
				if (oRequest.ZE2E_REQ_STATUSSet.results[i].ZZ_MODID == "TRST" &&
					oRequest.ZE2E_REQ_STATUSSet.results[i].ZZ_ACTION == "14") {
					isTravelSettlementClosed = true;
				}
			}
		} catch (exc) {
			isTravelSettlementClosed = false;
		}
		// If current request is in my request tab then disable this button
		if (sap.ui.getCore().getModel("profile").getData().currentRole != "EMP" && !isTravelSettlementClosed) {
			if (sap.ui.getCore().getModel("profile").getData().currentRole == "GRM") {
				cancelFlag = sap.ui.project.e2etm.util.Formatter.cancelManagerRequestButton(
					oRequest.ZZ_REQ_TYP, oRequest.ZZ_STAT_FLAG, oRequest.ZZ_TRV_REQ);
			} else if (sap.ui.getCore().getModel("profile").getData().currentRole == "DEPU") {
				cancelFlag = sap.ui.project.e2etm.util.Formatter.cancelRequestButton(
					oRequest.ZZ_DEP_REQ, oRequest.ZZ_DEP_TYPE, oRequest.ZZ_TRV_REQ,
					oRequest.ZZ_REQ_TYP, oRequest.ZZ_STAT_FLAG, oRequest.ZZ_STAGE,
					oRequest.ZZ_SET, oRequest.ZZ_SUBSUBSET);
			}
		}

		// display Insurance button?
		var insuranceFlag = this.isDisplayInsurance(oRequest);

		// display Cargo button?
		var cargoFlag = this.isDisplayCargo(oRequest);

		//dislay accommodation button
		var accFlag = true;
		if (oRequest.ZZ_REQ_TYP == "VISA") {
			accFlag = false;
		}

		// display ticketing,forex Buttons?
		var ticketingFlag = false;
		var forexFlag = false;
		if (sap.ui.getCore().getModel("profile").getData().currentRole == "EMP") {
			if (oRequest.ZZ_STAT_FLAG == "FF001") {
				ticketingFlag = true;
				forexFlag = true;
			} else {
				ticketingFlag = false;
				forexFlag = false;
			}
		} else {
			ticketingFlag = false;
			forexFlag = false;
		}
		ticketingFlag = oHomeThis.checkBReqStatusFlag(oRequest, ticketingFlag);
		// display Card Reload?
		var cardFlag = false;
		if (sap.ui.getCore().getModel("profile").getData().currentRole == "EMP") {
			var i = sap.ui.project.e2etm.util.StaticUtility.getArrayIndex(oRequest.ZE2E_REQ_STATUSSet.results, "ZZ_MODID", "CARD");
			if (i != -1) {
				cardFlag = true;
			}
		} else {
			cardFlag = false;
		}
		cardFlag = oHomeThis.checkBReqStatusFlag(oRequest, cardFlag);
		//display Monthly Remittance
		var remitanceFlag = false;
		if (sap.ui.getCore().getModel("profile").getData().currentRole == "EMP") {
			var i = sap.ui.project.e2etm.util.StaticUtility.getArrayIndex(oRequest.ZE2E_REQ_STATUSSet.results, "ZZ_MODID", "MR");
			if (i != -1) {
				remitanceFlag = true;
			}
		} else {
			remitanceFlag = false;
		}

		remitanceFlag = oHomeThis.checkBReqStatusFlag(oRequest, remitanceFlag);
		//display Bank Advice form
		var bankAdviceFlag = false;
		if (sap.ui.getCore().getModel("profile").getData().currentRole == "EMP") {
			var i = sap.ui.project.e2etm.util.StaticUtility.getArrayIndex(oRequest.ZE2E_REQ_STATUSSet.results, "ZZ_MODID", "BANK");
			if (i != -1)
				bankAdviceFlag = true;
		}
		bankAdviceFlag = oHomeThis.checkBReqStatusFlag(oRequest, bankAdviceFlag);
		//display TravelSettlement
		var trSettleFlag = false;
		if (sap.ui.getCore().getModel("profile").getData().currentRole == "EMP") {
			var i = sap.ui.project.e2etm.util.StaticUtility.getArrayIndex(oRequest.ZE2E_REQ_STATUSSet.results, "ZZ_MODID", "TRST");
			if (i != -1)
				trSettleFlag = true;
		}
		trSettleFlag = oHomeThis.checkBReqStatusFlag(oRequest, trSettleFlag);
		var paymentFlag = false;
		if (sap.ui.getCore().getModel("profile").getData().currentRole == "EMP") {
			var i = sap.ui.project.e2etm.util.StaticUtility.getArrayIndex(oRequest.ZE2E_REQ_STATUSSet.results, "ZZ_MODID", "PYVR");
			if (i != -1)
				paymentFlag = true;
		}
		paymentFlag = oHomeThis.checkBReqStatusFlag(oRequest, paymentFlag);
		//INR advance
		var inrflag = false;
		if (sap.ui.getCore().getModel("profile").getData().currentRole == "EMP") {
			var i = sap.ui.project.e2etm.util.StaticUtility.getArrayIndex(oRequest.ZE2E_REQ_STATUSSet.results, "ZZ_MODID", "INRA");
			if (i != -1)
				inrflag = true;
		}
		inrflag = oHomeThis.checkBReqStatusFlag(oRequest, inrflag);
		// display Change Button?
		var changeFlag = false;
		// If current request is in my request tab then disable this button
		if (oRequest.ZZ_TAB_FLAG == "MR" && sap.ui.getCore().getModel("profile").getData().currentRole != "DEPU" && oRequest.ZZ_REQ_TYP !=
			"HOME" && oRequest.ZZ_REQ_TYP != "EMER") {
			changeFlag = false;
		} else {
			// If current date is after deputation end date then disable all buttons
			if (sap.ui.project.e2etm.util.StaticUtility.checkDateInPast(oRequest.ZZ_DEP_ENDATE)) {
				changeFlag = false;
			} else {
				if (sap.ui.getCore().getModel("profile").getData().currentRole == "EMP") {
					changeFlag = sap.ui.project.e2etm.util.Formatter.changeRequestButton(
						oRequest.ZZ_DEP_REQ, oRequest.ZZ_DEP_TYPE, oRequest.ZZ_TRV_REQ,
						oRequest.ZZ_REQ_TYP, oRequest.ZZ_STAT_FLAG, oRequest.ZZ_STAGE,
						oRequest.ZZ_SET, oRequest.ZZ_SUBSUBSET);

				} else if (sap.ui.getCore().getModel("profile").getData().currentRole == "DEPU") {
					changeFlag = sap.ui.project.e2etm.util.Formatter.changeCOCButton(
						oRequest.ZZ_DEP_STDATE, oRequest.ZZ_DEP_ENDATE, oRequest.ZZ_REQ_TYP,
						oRequest.ZZ_STAT_FLAG, oRequest.ZZ_TRV_REQ, oRequest.ZZ_DEP_TYPE);
				}
			}
		}

		// display Create Button?
		var createFlag = false;
		// If current request is in my request tab then disable this button
		if (oRequest.ZZ_TAB_FLAG == "MR") {
			createFlag = false;
		} else {
			// If current date is after deputation end date then disable all buttons
			if (sap.ui.project.e2etm.util.StaticUtility.checkDateInPast(oRequest.ZZ_DEP_ENDATE)) {
				createFlag = false;
			} else {
				if (sap.ui.getCore().getModel("profile").getData().currentRole == "EMP") {
					createFlag = sap.ui.project.e2etm.util.Formatter.createRequestButton(oRequest.ZZ_REQ_TYP,
						oRequest.ZZ_STAT_FLAG, oRequest.ZZ_TRV_CAT);
				}
			}
		}

		// display Upload Requisition Button for Domestic Transfer?
		var uploadTransferRequisition = false;
		if (oRequest.ZZ_DEP_TYPE == "DOME" && oRequest.ZZ_TRV_CAT == "TRFR" &&
			oRequest.ZZ_STAGE == "1" &&
			((oRequest.ZZ_SET == "1_2" && oRequest.ZZ_SUBSUBSET == "1_2_1_1") ||
				(oRequest.ZZ_SET == "1_1" && oRequest.ZZ_SUBSUBSET == "0")) &&
			(sap.ui.getCore().getModel("profile").getData().currentRole == "EMP" ||
				sap.ui.getCore().getModel("profile").getData().currentRole == "DEPU")) {
			uploadTransferRequisition = true;
		}

		// display Upload Exit Checklist for Transfer request?
		var uploadExitCheckList = false;
		if (oRequest.ZZ_TRV_CAT == "TRFR" && oRequest.ZZ_STAGE == "1" &&
			((oRequest.ZZ_SET == "1_2" && oRequest.ZZ_SUBSUBSET == "1_2_1_1" && oRequest.ZZ_DEP_TYPE == "DOME") ||
				(oRequest.ZZ_SET == "1_2" && oRequest.ZZ_SUBSUBSET == "1_2_1_3" && oRequest.ZZ_DEP_TYPE == "INTL") ||
				(oRequest.ZZ_SET == "1_1" && oRequest.ZZ_SUBSUBSET == "0")) &&
			sap.ui.getCore().getModel("profile").getData().currentRole == "DEPU") {
			uploadExitCheckList = true;
		}

		// GENERATE OPTIONS BASED ON FLAGS
		// Main View Detail Menu button
		var detailsMenu = new sap.ui.unified.MenuItem();
		detailsMenu.setText("View details");
		detailsMenu.setIcon("sap-icon://begin");
		oHomeThis.openMenu.addItem(detailsMenu);
		//// 13 Apr 2020 UCD1KOR cancel button remove from menu
		
		if(curEvt.getSource().getParent().getParent().getCells()[0].getText() =="REPS"){
			cancelFlag =false;
		}
		
		// Main Cancel Menu button
		if (cancelFlag) {
			var cancelMenu = new sap.ui.unified.MenuItem();
			cancelMenu.setText("Cancel");
			cancelMenu.setIcon("./images/cancel_request.png");
			oHomeThis.openMenu.addItem(cancelMenu);
		}

		// Main Upload Transfer Requisition Menu Button
		if (uploadTransferRequisition) {
			var uploadTransferRequisitionMenu = new sap.ui.unified.MenuItem();
			uploadTransferRequisitionMenu.setText("Upload Requisition Form");
			uploadTransferRequisitionMenu.setIcon("sap-icon://upload");
			oHomeThis.openMenu.addItem(uploadTransferRequisitionMenu);
		}

		// Main Upload Exit CheckList Menu Button
		if (uploadExitCheckList) {
			var uploadExitCheckListMenu = new sap.ui.unified.MenuItem();
			uploadExitCheckListMenu.setText("Upload Exit CheckList");
			uploadExitCheckListMenu.setIcon("sap-icon://upload");
			oHomeThis.openMenu.addItem(uploadExitCheckListMenu);
		}

		//    // Main Insurance Menu button for "My Task"
		//    if(insuranceFlag && oRequest.ZZ_TAB_FLAG == "MT"){
		//    var iIndex = sap.ui.project.e2etm.util.StaticUtility.getArrayIndex(oRequest.ZE2E_REQ_STATUSSet.results,"ZZ_MODID","INSR");
		//    var oMenu = new sap.ui.unified.MenuItem();
		//    oMenu.setText("Insurance");
		//    oMenu.setIcon("sap-icon://insurance-life");
		//    oHomeThis.openMenu.addItem(oMenu);

		//    var oMenuList = new sap.ui.unified.Menu();
		//    oMenu.setSubmenu(oMenuList);

		//    if( iIndex == -1 ){
		//    var oMenuCreate = new sap.ui.unified.MenuItem();
		//    oMenuCreate.setText("Create Insurance Request");
		//    oMenuCreate.setIcon("sap-icon://create");
		//    oMenuList.addItem(oMenuCreate);
		//    }else{
		//    if( oRequest.ZE2E_REQ_STATUSSet.results[iIndex].ZZ_ACTION == '00' ||
		//    oRequest.ZE2E_REQ_STATUSSet.results[iIndex].ZZ_ACTION == '02'){
		//    var oMenuEdit = new sap.ui.unified.MenuItem();
		//    oMenuEdit.setText("Change Insurance Request");
		//    oMenuEdit.setIcon("sap-icon://edit");
		//    oMenuList.addItem(oMenuEdit);
		//    }else{
		//    var oMenuOpen = new sap.ui.unified.MenuItem();
		//    oMenuOpen.setText("Open Insurance Request");
		//    oMenuOpen.setIcon("sap-icon://action");
		//    oMenuList.addItem(oMenuOpen);
		//    }
		//    }
		//    }

		// Main Insurance Menu button for "My Request"
		if (insuranceFlag && oRequest.ZZ_TAB_FLAG == "MR" && sap.ui.getCore().getModel("profile").getData().currentRole == "EMP") {
			var iIndex = sap.ui.project.e2etm.util.StaticUtility.getArrayIndex(oRequest.ZE2E_REQ_STATUSSet.results, "ZZ_MODID", "INSR");
			if (iIndex != -1) { //if exist insurance request
				var oMenu = new sap.ui.unified.MenuItem();
				oMenu.setText("Insurance");
				oMenu.setIcon("sap-icon://insurance-life");
				oHomeThis.openMenu.addItem(oMenu);

				var oMenuList = new sap.ui.unified.Menu();
				oMenu.setSubmenu(oMenuList);

				var oMenuOpen = new sap.ui.unified.MenuItem();
				oMenuOpen.setText("Open Insurance Request");
				oMenuOpen.setIcon("sap-icon://action");
				oMenuList.addItem(oMenuOpen);
			} //end if exist insurance request
		}

		// Main Cargo Menu button for "My Request"
		if (cargoFlag && oRequest.ZZ_TAB_FLAG == "MR" && sap.ui.getCore().getModel("profile").getData().currentRole == "EMP") {
			var iOnward = sap.ui.project.e2etm.util.StaticUtility.getArrayIndex(oRequest.ZE2E_REQ_STATUSSet.results, "ZZ_MODID", "CARO");
			var iReturn = sap.ui.project.e2etm.util.StaticUtility.getArrayIndex(oRequest.ZE2E_REQ_STATUSSet.results, "ZZ_MODID", "CARR");

			if (iOnward != -1 || iReturn != -1) { //only display Cargo menu if there's cargo request
				var oChangeCargo = new sap.ui.unified.MenuItem();
				oChangeCargo.setText("Cargo");
				oChangeCargo.setIcon("sap-icon://cargo-train");
				oHomeThis.openMenu.addItem(oChangeCargo);

				//Change Cargo List
				//        var oChangeCargoList = new sap.ui.unified.Menu({
				//        itemSelect: function(evt){
				//        oHomeThis.onEMPChangeClick(evt);
				//        }
				//        });
				var oChangeCargoList = new sap.ui.unified.Menu();
				oChangeCargo.setSubmenu(oChangeCargoList);
			} // end only display Cargo menu if there's cargo request

			if (iOnward != -1) {
				var oOnwardOpen = new sap.ui.unified.MenuItem();
				oOnwardOpen.setText("Open Onward Request");
				oOnwardOpen.setIcon("sap-icon://action");
				oChangeCargoList.addItem(oOnwardOpen);
			}

			if (iReturn != -1) {
				var oReturnOpen = new sap.ui.unified.MenuItem();
				oReturnOpen.setText("Open Return Request");
				oReturnOpen.setIcon("sap-icon://action");
				oChangeCargoList.addItem(oReturnOpen);
			}
		} //end check CargoFlag

		// Main ticketing Menu button
		if (ticketingFlag) {
			var ticketingMenu = new sap.ui.unified.MenuItem();
			ticketingMenu.setText("Ticketing");
			ticketingMenu.setIcon("sap-icon://flight");
			oHomeThis.openMenu.addItem(ticketingMenu);
		}

		// Main Accommodation Menu button
		if (accFlag && cargoFlag && oRequest.ZZ_TAB_FLAG == "MR" && sap.ui.getCore().getModel("profile").getData().currentRole == "EMP") {
			var iAcom = sap.ui.project.e2etm.util.StaticUtility.getArrayIndex(oRequest.ZE2E_REQ_STATUSSet.results, "ZZ_MODID", "ACOM");
			if (iAcom != -1) {
				var accommodationMenu = new sap.ui.unified.MenuItem();
				accommodationMenu.setText("Accommodation");
				accommodationMenu.setIcon("sap-icon://cargo-train");
				oHomeThis.openMenu.addItem(accommodationMenu);
			}
		}

		// Main Forex Menu button
		//    if (forexFlag) {
		//    var forexMenu = new sap.ui.unified.MenuItem();
		//    forexMenu.setText("Forex");
		//    forexMenu.setIcon("sap-icon://simple-payment");
		//    oHomeThis.openMenu.addItem(forexMenu);
		//    }

		// Main Card Reload Menu button
		if (cardFlag) {
			var cardMenu = new sap.ui.unified.MenuItem();
			cardMenu.setText("Additional Advance");
			cardMenu.setIcon("sap-icon://simple-payment");
			oHomeThis.openMenu.addItem(cardMenu);
		}

		//Monthly Remittance Menu
		if (remitanceFlag) {
			var remtnceMenu = new sap.ui.unified.MenuItem();
			remtnceMenu.setText("Monthly Remittance");
			remtnceMenu.setIcon("sap-icon://wallet");
			oHomeThis.openMenu.addItem(remtnceMenu);
		}
		//Bank Advice form
		if (bankAdviceFlag) {
			var bankMenu = new sap.ui.unified.MenuItem();
			bankMenu.setText("Bank Advice Form");
			bankMenu.setIcon("sap-icon://request");
			oHomeThis.openMenu.addItem(bankMenu);
		}
		//Bank Advice form
		if (trSettleFlag) {
			var trsMenu = new sap.ui.unified.MenuItem();
			trsMenu.setText("Travel Settlement");
			trsMenu.setIcon("sap-icon://request");
			oHomeThis.openMenu.addItem(trsMenu);
		}

		if (paymentFlag) {
			var paymentMenu = new sap.ui.unified.MenuItem();
			paymentMenu.setText("Payment Voucher");
			paymentMenu.setIcon("sap-icon://batch-payments");
			oHomeThis.openMenu.addItem(paymentMenu);
		}

		if (inrflag) {
			var inrMenu = new sap.ui.unified.MenuItem();
			inrMenu.setText("INR Advance");
			inrMenu.setIcon("sap-icon://add-process");
			oHomeThis.openMenu.addItem(inrMenu);
		}

		// Reimbursment
		var reim_flag = false;
		if (sap.ui.getCore().getModel("profile").getData().currentRole == "EMP" && oRequest.ZZ_TRV_CAT == "WRKP") {
			reim_flag = true;
		}

		//If training and not Austria or Germany, disable reimbursement
		if (oRequest.ZZ_TRV_CAT == "TRNG" && oRequest.ZZ_DEP_TOCNTRY != "AT" && oRequest.ZZ_DEP_TOCNTRY != "GE") {
			reim_flag = false;
		}

		if (reim_flag == true) {
			//Begin reimbursement
			var iIndex = sap.ui.project.e2etm.util.StaticUtility.getArrayIndex(oRequest.ZE2E_REQ_STATUSSet.results, "ZZ_MODID", "REIM");
			var aReim = [];
			if (oRequest.ZE2E_REQ_STATUSSet.results != undefined) {

				for (var i = 0; i < oRequest.ZE2E_REQ_STATUSSet.results.length; i++) {
					if (oRequest.ZE2E_REQ_STATUSSet.results[i].ZZ_MODID == 'REIM') {
						aReim.push(oRequest.ZE2E_REQ_STATUSSet.results[i]);
					}
				}

				if (aReim.length != 0) {
					var reimbursementMenu = new sap.ui.unified.MenuItem();
					reimbursementMenu.setText("Reimbursement");
					reimbursementMenu.setIcon("sap-icon://money-bills");
					oHomeThis.openMenu.addItem(reimbursementMenu);

					var oMenuListRI = new sap.ui.unified.Menu();
					reimbursementMenu.setSubmenu(oMenuListRI);

					var oMenuOpen = new sap.ui.unified.MenuItem();
					oMenuOpen.setText("Open Reimbursement Request");
					oMenuOpen.setIcon("sap-icon://create");
					oMenuListRI.addItem(oMenuOpen);
				}

				//        var reimbursementMenu = new sap.ui.unified.MenuItem();
				//        reimbursementMenu.setText("Reimbursement");
				//        reimbursementMenu.setIcon("sap-icon://money-bills");
				//        oHomeThis.openMenu.addItem(reimbursementMenu);

				//        var oMenuListRI = new sap.ui.unified.Menu();
				//        reimbursementMenu.setSubmenu(oMenuListRI);
				//        if(aReim.length == 0){
				//        var oMenuCreate = new sap.ui.unified.MenuItem();
				//        oMenuCreate.setText("Create Reimbursement Request");
				//        oMenuCreate.setIcon("sap-icon://create");
				//        oMenuListRI.addItem(oMenuCreate);
				//        }else{
				//        var i = aReim.length - 1;
				//        if(aReim[i].ZZ_ACTION == '00' || aReim[i].ZZ_ACTION == '02'){
				//        var oMenuEdit = new sap.ui.unified.MenuItem();
				//        oMenuEdit.setText("Open Reimbursement Request");
				//        oMenuEdit.setIcon("sap-icon://action");
				//        oMenuListRI.addItem(oMenuEdit);
				//        }else{
				//        var oMenuOpen = new sap.ui.unified.MenuItem();
				//        oMenuOpen.setText("Create Reimbursement Request");
				//        oMenuOpen.setIcon("sap-icon://create");
				//        oMenuListRI.addItem(oMenuOpen);
				//        }
				//        }

			} //end if request status set != undefined
		} //End reimbursement
		//Begin TAX Clearance
		//    var oMenuCreate = new sap.ui.unified.MenuItem();
		//    oMenuCreate.setText("Create TAX Clearance");
		//    oMenuCreate.setIcon("sap-icon://money-bills");
		//    oHomeThis.openMenu.addItem(oMenuCreate);
		//End   TAX Clearance

		// Main Change menu button
		if (changeFlag) {
			var changeMenu = new sap.ui.unified.MenuItem();
			changeMenu.setText("Change");
			changeMenu.setIcon("./images/edit.png");
			oHomeThis.openMenu.addItem(changeMenu);
			var changeSubMenu = new sap.ui.unified.Menu();
			// In Main Change menu button, normally we have 3 sub menus: Request, Cargo, Upload
			// and those submenu options will be displayed based on the conditions
			if (sap.ui.getCore().getModel("profile").getData().currentRole != "DEPU") {
				oHomeThis.onChangeEMPRequest(oRequest, changeSubMenu);
			} else {
				oHomeThis.onChangeDEPURequest(oRequest, changeSubMenu);
			}
			if (changeSubMenu.getItems().length > 0) {
				changeMenu.setSubmenu(changeSubMenu);
			}
		}

		// Main Create menu button
		if (createFlag) {
			var createMenu = new sap.ui.unified.MenuItem();
			createMenu.setText("Create");
			createMenu.setIcon("./images/add.png");
			oHomeThis.openMenu.addItem(createMenu);
			var createSubMenu = new sap.ui.unified.Menu();
			// In Main Create menu button, normally we have 3 sub menus: Request, Cargo, Upload
			// and those submenu options will be displayed based on the conditions
			oHomeThis.onCreateEMPRequest(oRequest, createSubMenu);
			if (createSubMenu.getItems().length > 0) {
				createMenu.setSubmenu(createSubMenu);
			}
		}

		// Open the menu
		oHomeThis.openMenu.open(false, curEvt.getSource(), sap.ui.core.Popup.Dock.BeginTop,
			sap.ui.core.Popup.Dock.BeginBottom, curEvt.getSource());
	},

	// EVENT ON CLICKING OF EACH ACTION LINK IN EMPLOYEE RIGHT PANEL
	onActionClick: function(curEvt) {
		var that= this;
		var oRequest = sap.ui.getCore().byId("flexboxEmployeeMyTaskDetail").getModel("myEmployeeSelectedTaskModel").getData();

		try {
			// onEMPChangeClick contains switch case of all sub menu items of group button
			// mostly for change button
			// onEMPCreateTrip contains switch case of all sub menu items of group button
			// mostly for create button
			if (oHomeThis.onEMPChangeClick(oRequest, curEvt.getSource().getText()) == false) {
				if (oHomeThis.onEMPCreateTrip(oRequest, curEvt.getSource().getText()) == false) {
					switch (curEvt.getSource().getText()) {
						case "Change":
							if (oRequest.ZZ_REQ_TYP == "BUSR" || oRequest.ZZ_REQ_TYP == "SECO" ||
								oRequest.ZZ_REQ_TYP == "EMER" || oRequest.ZZ_REQ_TYP == "HOME" || oRequest.ZZ_REQ_TYP == "INFO") {
								var globalData = sap.ui.getCore().getModel("global").getData();
								globalData.isChange = true;
								globalData.changeType = "TA";
								globalData.isCreate = false;
								sap.ui.getCore().getModel("global").setData(globalData);
								oHomeThis.navigateToDetailScreen(oRequest, "", true, "TA", false);
							}
							return;
						case "Cancel Request":
							oHomeThis.onCancelEMPRequest(oRequest);
							return;
						case "Ticketing":
							oHomeThis.onEMPChangeClick(oRequest, "Ticketing");
							sap.ui.core.routing.Router.getRouter("MyRouter").navTo("ticketing");
							return;
						case "Monthly Remittance":
							oHomeThis.checkBankNumber(oRequest);
							return;
						case "Onsite Address":
							var globalData = sap.ui.getCore().getModel("global").getData();
							globalData.Travel_Request = oRequest.ZZ_TRV_REQ_V1;
							globalData.Requester = oRequest.ZZ_DEP_PERNR;
							sap.ui.getCore().getModel("global").setData(globalData);
							sap.ui.core.routing.Router.getRouter("MyRouter").navTo("onsiteaddress");
							return;
						case "Bank Advice Form":
							oHomeThis.onEMPChangeClick(oRequest, "Bank Advice Form");
							sap.ui.core.routing.Router.getRouter("MyRouter").navTo("bnkadvfrm");
							return;
						case "Travel Settlement":
							
							var globalData = sap.ui.getCore().getModel("global").getData();
							if(globalData.ZZ_DEP_TYPE =="DOME" && globalData.ZZ_DEP_TOCNTRY =="IN"){
								sap.ui.project.e2etm.util.StaticUtility.setBusy(true, oHomeThis);
							var AccomDigitized = sServiceUrl + "AccomDigitizedBooking?&EmpNo='" +globalData.ZZ_DEP_PERNR +"'&TpNo='"+globalData.ZZ_TRV_REQ+"'&$format=json";
							var get = $.ajax({
											cache: false,
											url: AccomDigitized, 
											type: "GET",
											async: true
										});
										get.done(function(result) {
											globalData.DigiFlag  =result.d.AccomDigitizedBooking.DigiFlag;
											sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
										});
										get.fail(function(result) {
											sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
										});
							}
							else{
								globalData.DigiFlag ="";
							}
							sap.ui.getCore().getModel("global").refresh();
							oHomeThis.onEMPChangeClick(oRequest, "Travel Settlement");
							sap.ui.core.routing.Router.getRouter("MyRouter").navTo("trsettle");
							return;
						case "Payment Voucher":
							oHomeThis.onEMPChangeClick(oRequest, "Payment Voucher");
							sap.ui.core.routing.Router.getRouter("MyRouter").navTo("paymentvoucher");
							return;
						case "INR Advance":
							oHomeThis.onEMPChangeClick(oRequest, "INR Advance");
							sap.ui.core.routing.Router.getRouter("MyRouter").navTo("inradvance");
							return;
						case "Forex":
							sap.ui.core.routing.Router.getRouter("MyRouter").navTo("forex");
							return;
						case "Additional Advance":
							oHomeThis.onEMPChangeClick(oRequest, "Card Reload");
							sap.ui.core.routing.Router.getRouter("MyRouter").navTo("card");
							return;

							//SimCard

						case "Personal Calls Declaration":
							sap.ui.core.routing.Router.getRouter("MyRouter").navTo("SimCardRequest", {
								reinr: oRequest.ZZ_DEP_REQ,
								pernr: oRequest.ZZ_DEP_PERNR,
								query: {
									Tab: "R",
									subTab: oRequest.ZZ_SIM_TAB,
									subSubTab: ""
								}
							});

							return;
						case "Accommodation":
							//      var globalData = sap.ui.getCore().getModel("global").getData();
							var oModel = new sap.ui.model.json.JSONModel();
							sap.ui.getCore().setModel(oModel, "oRequest");
							sap.ui.getCore().getModel("oRequest").setData(oRequest);
							var sPernr = sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_PERNR;
							var sVersion = oRequest.ZZ_VERSION ? oRequest.ZZ_VERSION.trim() : oRequest.ZZ_VERSION;
							var sAccUrl = "ZE2E_ACC_HDRSet(ZZ_TRV_REQ='{0}',ZZ_OWNER='{1}',ZZ_TRV_KEY='{2}',ZZ_VERSION='{3}')?$expand=ZE2E_ACC_DETAILSet,ZE2E_BVISA_HDR/DEP_EMP&$format=json";
							sAccUrl = sAccUrl.replace("{0}",oRequest.ZZ_TRV_REQ); 
							sAccUrl = sAccUrl.replace("{1}",sPernr); 
							sAccUrl = sAccUrl.replace("{2}",oRequest.ZZ_REQ_TYP);         
							sAccUrl = sAccUrl.replace("{3}",sVersion);      
							var oDataModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
							oDataModel.read(sAccUrl, null, null,true, function(oData, response) {
										var data = JSON.parse(response.body);
										sap.ui.core.BusyIndicator.hide();
										if(data.d.ZE2E_ACC_DETAILSet.results.length === 0 ){
											sap.ui.core.routing.Router.getRouter("MyRouter").navTo("reservation",{
												reinr:oRequest.ZZ_TRV_REQ,
												pernr:sPernr,
												query: {
													travelPlan: true
												}});
										}
										else{
											sap.ui.core.routing.Router.getRouter("MyRouter").navTo("accommodation");
										}
									}, function(error) {
										sap.m.MessageToast.show("Error on Fetching accomdation details..! ");
									});
							//sap.ui.core.routing.Router.getRouter("MyRouter").navTo("accommodation");
							return;
							//      Begin reimbursement
						case "Create Reimbursement Request":
							var oModel = new sap.ui.model.json.JSONModel();
							sap.ui.getCore().setModel(oModel, "oRequest");
							sap.ui.getCore().getModel("oRequest").setData(oRequest);
							sap.ui.core.routing.Router.getRouter("MyRouter").navTo("reimbursement");
							return;
						case "Change Reimbursement Request":
							var oModel = new sap.ui.model.json.JSONModel();
							sap.ui.getCore().setModel(oModel, "oRequest");
							sap.ui.getCore().getModel("oRequest").setData(oRequest);
							sap.ui.core.routing.Router.getRouter("MyRouter").navTo("reimbursement");
							return;
						case "Open Reimbursement Request":
							var oModel = new sap.ui.model.json.JSONModel();
							sap.ui.getCore().setModel(oModel, "oRequest");
							sap.ui.getCore().getModel("oRequest").setData(oRequest);
							sap.ui.core.routing.Router.getRouter("MyRouter").navTo("reimbursement");
							return;
						case "Upload Requisition Form":
							// Applicable for Domestic only
							sap.ui.project.e2etm.util.StaticUtility.setBusy(true, oHomeThis);
							// display popup
							if (oHomeThis.oCommonDialog) {
								oHomeThis.oCommonDialog.destroy();
							}
							// instantiate the Fragment if not done yet
							oHomeThis.oCommonDialog = sap.ui.xmlfragment("sap.ui.project.e2etm.fragment.common.UploadRequisitionDialog", oHomeThis);

							var model = new sap.ui.model.json.JSONModel();
							var bindData = {};
							bindData.ZZ_DEP_REQ = oRequest.ZZ_DEP_REQ;
							bindData.ZZ_DEP_PERNR = oRequest.ZZ_DEP_PERNR;

							var get = $.ajax({
								cache: false,
								url: sServiceUrl + "DmsDocsSet?$filter=DepReq+eq+'" +
									oRequest.ZZ_DEP_REQ + "'+and+EmpNo+eq+'" + oRequest.ZZ_DEP_PERNR +
									"' and DocType eq 'TRF'&$format=json",
								type: "GET"
							});
							get.done(function(result) {
								bindData.ZZ_DOC_PATH = "";
								try {
									bindData.ZZ_DOC_PATH = result.d.results[result.d.results.length - 1].FileUrl;
								} catch (exc) {}
								model.setData(bindData);
								sap.ui.getCore().byId("dialogUploadRequisition").setModel(model);
								sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
								if (bindData.ZZ_DOC_PATH == "") {
									sap.ui.getCore().byId("lnkRequisitionDocument").setVisible(false);
								} else {
									sap.ui.getCore().byId("lnkRequisitionDocument").setVisible(true);
								}
								oHomeThis.oCommonDialog.open();
							});
							return;
						case "Upload Exit CheckList":
							// Applicable for Domestic only
							sap.ui.project.e2etm.util.StaticUtility.setBusy(true, oHomeThis);
							// display popup
							if (oHomeThis.oCommonDialog) {
								oHomeThis.oCommonDialog.destroy();
							}
							// instantiate the Fragment if not done yet
							oHomeThis.oCommonDialog = sap.ui.xmlfragment("sap.ui.project.e2etm.fragment.common.UploadExitCheckListDialog", oHomeThis);

							var model = new sap.ui.model.json.JSONModel();
							var bindData = {};
							bindData.ZZ_DEP_REQ = oRequest.ZZ_DEP_REQ;
							bindData.ZZ_DEP_PERNR = oRequest.ZZ_DEP_PERNR;

							var get = $.ajax({
								cache: false,
								url: sServiceUrl + "DmsDocsSet?$filter=DepReq+eq+'" +
									oRequest.ZZ_DEP_REQ + "'+and+EmpNo+eq+'" + oRequest.ZZ_DEP_PERNR +
									"' and DocType eq 'EXI'&$format=json",
								type: "GET"
							});
							get.done(function(result) {
								bindData.ZZ_DOC_PATH = "";
								try {
									bindData.ZZ_DOC_PATH = result.d.results[result.d.results.length - 1].FileUrl;
								} catch (exc) {}
								model.setData(bindData);
								sap.ui.getCore().byId("dialogUploadExitCheckList").setModel(model);
								sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
								if (bindData.ZZ_DOC_PATH == "") {
									sap.ui.getCore().byId("lnkExitCheckListDocument").setVisible(false);
								} else {
									sap.ui.getCore().byId("lnkExitCheckListDocument").setVisible(true);
								}
								oHomeThis.oCommonDialog.open();
							});
							return;
						case "Sign CL while on deputation":

							var clFragment = sap.ui.xmlfragment(this.getView().getId(), "sap.ui.project.e2etm.fragment.home.HOME_EMP_CL", oHomeThis);
							var dialog = new sap.m.Dialog({
								title: 'Contract Letters',
								type: 'Message',
								state: 'Success',
								contentWidth: "550px",
								content: clFragment,

								beginButton: new sap.m.Button({
									text: 'Close',
									press: function() {
										dialog.close();
									}
								}),
								beforeOpen: jQuery.proxy(function() {
									this.getContractLetters(oRequest, "CL");

								}, this),
								afterClose: function() {
									dialog.destroy();
								}
							});

							dialog.open();

							return;
						case "Sign salary slip while on deputation":

							var clFragment = sap.ui.xmlfragment(this.getView().getId(), "sap.ui.project.e2etm.fragment.home.HOME_EMP_CS", oHomeThis);
							var dialog = new sap.m.Dialog({
								title: 'Salary Slips',
								type: 'Message',
								state: 'Success',
								contentWidth: "550px",
								content: clFragment,

								beginButton: new sap.m.Button({
									text: 'Close',
									press: function() {
										dialog.close();
									}
								}),
								beforeOpen: jQuery.proxy(function() {
									this.getContractLetters(oRequest, "CS");

								}, this),
								afterClose: function() {
									dialog.destroy();
								}
							});

							dialog.open();

							return;
							//dye5kor

						case "Sign Revised Allowance Letter":
							var caFragment = sap.ui.xmlfragment(this.getView().getId(), "sap.ui.project.e2etm.fragment.home.HOME_EMP_CA", oHomeThis);
							var dialog = new sap.m.Dialog({
								title: 'Revised Allowance Letter',
								type: 'Message',
								state: 'Success',
								contentWidth: "550px",
								content: caFragment,

								beginButton: new sap.m.Button({
									text: 'Close',
									press: function() {
										dialog.close();
									}
								}),
								beforeOpen: jQuery.proxy(function() {
									this.getSTAAllowanceLetters(oRequest, "CA");

								}, this),
								afterClose: function() {
									dialog.destroy();
								}
							});

							dialog.open();

							return;
							//dye5kor
						case "Repatriation":
							//// ### 13 Apr 2020 UCD1KOR 
							sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
							if(oRequest.ZZ_TRV_REQ !=="0000000000"){
							sap.ui.core.routing.Router.getRouter("MyRouter").navTo("Repatriation", {
								"TpNo": Base64.encode(oRequest.ZZ_TRV_REQ),
								"EmpNo":Base64.encode(oRequest.ZZ_DEP_PERNR)
							});
						 }
						 else{
							 sap.m.MessageToast.show("Invalid TP No");
						 }
							
							return;
							// UCD1KOR 27 Apr 2020
						case "Upload Contract Letter":
							that.getContractLettersModified();
							that.UploadContractLetter = sap.ui.xmlfragment(this.getView().getId(), "sap.ui.project.e2etm.fragment.home.HOME_EMP_UploadContractLetters", oHomeThis);
							that.UploadContractLetter.open();
							return;
					}
				}
			}
		} catch (exc) {}
	},
	onCloseUploadContractLetters:function(){
		this.UploadContractLetter.close();
		this.UploadContractLetter.destroy();
	},
	//############ UCD1KOR 28 APR 2020 COntract letter upload ################//////// Start
	ontypeMissmatch: function () {
		sap.m.MessageToast.show("Please select PDF file only..!!");
	},
	/// ################## UCD1KOR 28 APR 2020 ###############///// End
	getSTAAllowanceLetters: function(oRequest, lType) {

		oComponent.getModel().read("ZE2E_DOCS_DETAILSSet?$filter=ZZ_DEP_REQ eq '" + oRequest.ZZ_DEP_REQ + "' and ZZ_DOKTL eq 'AL' ", null,
			null,
			true,
			jQuery.proxy(function(oData, response) {

				var staAlowanceLetter = [];
				staAlowanceLetter = oData.results;
				staAlowanceLetter = staAlowanceLetter.reverse();
				// modify the contract list value
				for (var i = 0; i < staAlowanceLetter.length; i++) {
					if (i == 0) {
						staAlowanceLetter[i].ZZ_DOC_NAME = "Revised Allowance Letter (Latest version)";
					} else {
						staAlowanceLetter[i].ZZ_DOC_NAME =
							"Allowance Letter version " + (staAlowanceLetter.length - i);
					}
				}
				var model = new sap.ui.model.json.JSONModel();
				model.setData(staAlowanceLetter);
				this.getView().byId("flexBoxSTAAllowanceLetter").setModel(model);

			}, this),
			function(error) {});

	},
	getContractLetters: function(oRequest, lType) {
		//  this.getView().byId("pnlSalSlip").setVisible(false);

		oComponent.getModel().read("ZE2E_DOCS_DETAILSSet?$filter=ZZ_DEP_REQ eq '" + oRequest.ZZ_DEP_REQ + "'", null, null, true,
			jQuery.proxy(function(oData, response) {

				if (sap.ui.project.e2etm.util.StaticUtility.checkCggs(oRequest.ZZ_DEP_TOCNTRY, oRequest.ZZ_ASG_TYP, oRequest.ZZ_TRV_CAT)) {
					//  this.getView().byId("pnlSalSlip").setVisible(true);
					var clIndex = 1;
					for (var i = 0; i < oData.results.length; i++) {
						if (oData.results[i].ZZ_DOKTL == "CL") {
							clIndex = i;
							break;
						}
					}
					var salaryList = [];

					if (lType != "CS") {
						if (clIndex > 0) {
							salaryList = oData.results.splice(0, clIndex);
						} else if (clIndex == -1) {
							if (data.d.results.length != 0) {
								salaryList = oData.results.splice(0);
							}
						}
					}

					if (lType == "CS") {
						//dye5kor_CGGS_Changes_11.09.2018
						if (salaryList.length > 0) {

							salaryList.length = 0;
						}
						for (var j = 0; j < oData.results.length; j++) {
							if (oData.results[j].ZZ_DOKTL == "CGS") {
								salaryList.push({
									ZZ_ASG_TYP: oData.results[j].ZZ_ASG_TYP,
									ZZ_AUTOMATIC: oData.results[j].ZZ_AUTOMATIC,
									ZZ_DEP_PERNR: oData.results[j].ZZ_DEP_PERNR,
									ZZ_DEP_REQ: oData.results[j].ZZ_DEP_REQ,
									ZZ_DOC_PATH: oData.results[j].ZZ_DOC_PATH,
									ZZ_DOKTL: oData.results[j].ZZ_DOKTL,
									ZZ_HOSTENTITY: oData.results[j].ZZ_HOSTENTITY,
									ZZ_JOB: oData.results[j].ZZ_JOB,
									ZZ_JOB_CLS: oData.results[j].ZZ_JOB_CLS,
									ZZ_MENTOR: oData.results[j].ZZ_MENTOR,
									ZZ_SALARY_SHA: oData.results[j].ZZ_SALARY_SHA,
									ZZ_STADECL_MODE: oData.results[j].ZZ_STADECL_MODE,
									ZZ_VERSION: oData.results[j].ZZ_VERSION,

								});

							}

						}
						//dye5kor_CGGS_Changes_11.09.2018
						if (salaryList.length > 0) {
							this.getView().byId("lblSalSlip").setVisible(false);
							this.getView().byId("flexBoxSalSlip").setVisible(true);

							//dye5kor_CGGS_Changes_11.09.2018
							/*for (var i = 0; i < oData.results.length; i++) {
        	  if(oData.results[i].ZZ_DOKTL != "CL"){
        		  if ( i ==  oData.results.length-1) {
                      salaryList[i].ZZ_DOC_NAME = "Salary Slip (Latest version)";
                    } else {
                      salaryList[i].ZZ_DOC_NAME = 
                        "Salary Slip version " + (salaryList.length - i);
                    }  
        		    
        	  }  
          }*/
							//dye5kor_CGGS_Changes_11.09.2018
							salaryList = salaryList.reverse();
							for (var i = 0; i < salaryList.length; i++) {
								if (i == 0) {
									salaryList[i].ZZ_DOC_NAME = "Salary Slip (Latest version)";
								} else {
									salaryList[i].ZZ_DOC_NAME =
										"Salary Slip version " + (salaryList.length - i);
								}

							}

							/*salaryList = salaryList.reverse();
          // modify the contract list value
          for (var i = 0; i < salaryList.length; i++) {
            if ( i == 0) {
              salaryList[i].ZZ_DOC_NAME = "Salary Slip (Latest version)";
            } else {
              salaryList[i].ZZ_DOC_NAME = 
                "Salary Slip version " + (salaryList.length - i);
            }
          }*/
							var model = new sap.ui.model.json.JSONModel();
							model.setData(salaryList);
							this.getView().byId("flexBoxSalSlip").setModel(model);
						} else {
							this.getView().byId("lblSalSlip").setVisible(true);
							this.getView().byId("flexBoxSalSlip").setVisible(false);
						}
					}
				}

				if (lType == "CL") {
				
					//added start of code uml6kor 1/12/2020 upgrade fix
					var contractList = [];//oData.results;
					if (contractList.length > 0) {

						contractList.length = 0;
					}
					for (var j = 0; j < oData.results.length; j++) {
						if (oData.results[j].ZZ_DOKTL == "CL") {
							contractList.push({
								ZZ_ASG_TYP: oData.results[j].ZZ_ASG_TYP,
								ZZ_AUTOMATIC: oData.results[j].ZZ_AUTOMATIC,
								ZZ_DEP_PERNR: oData.results[j].ZZ_DEP_PERNR,
								ZZ_DEP_REQ: oData.results[j].ZZ_DEP_REQ,
								ZZ_DOC_PATH: oData.results[j].ZZ_DOC_PATH,
								ZZ_DOKTL: oData.results[j].ZZ_DOKTL,
								ZZ_HOSTENTITY: oData.results[j].ZZ_HOSTENTITY,
								ZZ_JOB: oData.results[j].ZZ_JOB,
								ZZ_JOB_CLS: oData.results[j].ZZ_JOB_CLS,
								ZZ_MENTOR: oData.results[j].ZZ_MENTOR,
								ZZ_SALARY_SHA: oData.results[j].ZZ_SALARY_SHA,
								ZZ_STADECL_MODE: oData.results[j].ZZ_STADECL_MODE,
								ZZ_VERSION: oData.results[j].ZZ_VERSION,

							});

						}
					}

						//added end of code uml6kor 1/12/2020 upgrade fix
					//var contractList = oData.results.reverse();//commented 1/12/2020 uml6kor upgrade fix
					// modify the contract list value
					for (var i = 0; i < contractList.length; i++) {
						if (i == 0) {
							contractList[i].ZZ_DOC_NAME = "Contract Letter (Latest version)";
						} else {
							contractList[i].ZZ_DOC_NAME =
								"Contract Letter version " + (contractList.length - i);
						}
					}
					var model = new sap.ui.model.json.JSONModel();
					model.setData(contractList);
					this.getView().byId("flexBoxContractLetter").setModel(model);
				}
			}, this),
			function(error) {});
	},

	// EVENT ON FILTER ALL THE TABLE's COLUMNS
	onTableCentralFilter: function(curEvt) {
		var tableTobeFiltered = null;
		var filValue = curEvt.mParameters.value;
		var curRole = sap.ui.getCore().getModel("profile").getData().currentRole;

		// Check whether the table to be filtered is in my task tab or my request tab
		if (oHomeThis.getView().byId("tabStrip").getSelectedIndex() == 0) {
			if (curRole == "DEPU") {
				tableTobeFiltered = sap.ui.getCore().byId("tableDeputationMyTasks");
			} else if (curRole == "GRM") {
				tableTobeFiltered = sap.ui.getCore().byId("tableManagerMyTasks");
			} else if (curRole == "EMP") {
				tableTobeFiltered = sap.ui.getCore().byId("tableEmployeeMyTasks");
			} else if (curRole == "ECO") {
				tableTobeFiltered = sap.ui.getCore().byId("tableECOMyTasks");
			} else if (curRole == "TAX") {
				tableTobeFiltered = sap.ui.getCore().byId("tableTAXMyTasks");
			} else if (curRole == "CTG") {
				tableTobeFiltered = sap.ui.getCore().byId("tableCTGMyTasks");
			}
		} else if (oHomeThis.getView().byId("tabStrip").getSelectedIndex() == 1) {
			if (curRole == "DEPU") {
				tableTobeFiltered = sap.ui.getCore().byId("tableAllRequests");
			} else if (curRole == "GRM") {
				tableTobeFiltered = sap.ui.getCore().byId("tableTeamRequests");
			} else if (curRole == "EMP") {
				tableTobeFiltered = sap.ui.getCore().byId("tableEmployeeMyRequests");
			}
		}

		setTimeout(function() {
			try {
				if (oHomeThis.getView().byId("tabStrip").getSelectedIndex() == 0) {
					if (tableTobeFiltered.mBindingInfos.rows.binding.iLength > 0) {
						tableTobeFiltered.clearSelection();
						tableTobeFiltered.setSelectedIndex(0);
					} else {
						oHomeThis.setSelectedMyTask("", "");
						sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
					}
				}
			} catch (exc) {}
		}, 500);
	},

	// EVENT ON CLICKING OF EACH OPTION IN ACTION LIST
	onMenuActionClick: function(curEvt) {
		var oRequest = oHomeThis.selectedItem.getModel().getProperty(oHomeThis.selectedItem.getBindingContext().getPath());

		try {
			// Event on click for DEPU Change button
			if (curEvt.getParameter("item").getParent().getParent().getText() == "Change") {
				oHomeThis.onEMPChangeClick(oRequest, curEvt.getParameter("item").getProperty("text"));
			} else { // Event on click for EMP Change button
				if (curEvt.getParameter("item").getParent().getParent().getText() == "Insurance" || curEvt.getParameter("item").getParent().getParent()
					.getText() == "Cargo") {
					oHomeThis.onEMPCreateTrip(oRequest, curEvt.getParameter("item").getProperty("text"));
				} else if (curEvt.getParameter("item").getParent().getParent().getParent().getParent().getText() == "Change") {
					oHomeThis.onEMPChangeClick(oRequest, curEvt.getParameter("item").getProperty("text"));
				} else if (curEvt.getParameter("item").getParent().getParent().getParent().getParent().getText() == "Create") {
					oHomeThis.onEMPCreateTrip(oRequest, curEvt.getParameter("item").getProperty("text"));
				}
			}
		} catch (exc) {}

		switch (curEvt.getParameter("item").getProperty("text")) {
			case "View details":
				oHomeThis.navigateToDetailScreen(oRequest, "MR", false, "", false);
				return;
			case "Change":
				if (oRequest.ZZ_REQ_TYP == "BUSR" || oRequest.ZZ_REQ_TYP == "SECO" ||
					oRequest.ZZ_REQ_TYP == "EMER" || oRequest.ZZ_REQ_TYP == "HOME" || oRequest.ZZ_REQ_TYP == "INFO") {
					var globalData = sap.ui.getCore().getModel("global").getData();
					globalData.isChange = true;
					globalData.changeType = "TA";
					globalData.isCreate = false;
					sap.ui.getCore().getModel("global").setData(globalData);
					oHomeThis.navigateToDetailScreen(oRequest, "", true, "TA", false);
				}
				return;
			case "Cancel":
				oHomeThis.onCancelEMPRequest(oRequest);
				return;
			case "Ticketing":
				oHomeThis.onEMPChangeClick(oRequest, "Ticketing");
				sap.ui.core.routing.Router.getRouter("MyRouter").navTo("ticketing");
				return;
			case "Monthly Remittance":
				oHomeThis.checkBankNumber(oRequest);

				return;
			case "Bank Advice Form":
				oHomeThis.onEMPChangeClick(oRequest, "Bank Advice Form");
				sap.ui.core.routing.Router.getRouter("MyRouter").navTo("bnkadvfrm");
				return;
			case "Travel Settlement":
				oHomeThis.onEMPChangeClick(oRequest, "Travel Settlement");
				sap.ui.core.routing.Router.getRouter("MyRouter").navTo("trsettle");
				return;
			case "Payment Voucher":
				oHomeThis.onEMPChangeClick(oRequest, "Payment Voucher");
				sap.ui.core.routing.Router.getRouter("MyRouter").navTo("paymentvoucher");
				return;
			case "INR Advance":
				oHomeThis.onEMPChangeClick(oRequest, "INR Advance");
				sap.ui.core.routing.Router.getRouter("MyRouter").navTo("inradvance");
				return;
			case "Forex":
				sap.ui.core.routing.Router.getRouter("MyRouter").navTo("forex");
				return;
			case "Additional Advance":
				oHomeThis.onEMPChangeClick(oRequest, "Card Reload");
				sap.ui.core.routing.Router.getRouter("MyRouter").navTo("card");
				return;
			case "Accommodation":
				//      var globalData = sap.ui.getCore().getModel("global").getData();
				var oModel = new sap.ui.model.json.JSONModel();
				sap.ui.getCore().setModel(oModel, "oRequest");
				sap.ui.getCore().getModel("oRequest").setData(oRequest);
				sap.ui.core.routing.Router.getRouter("MyRouter").navTo("accommodation");
				return;

				//      Begin reimbursement
			case "Create Reimbursement Request":
				var oModel = new sap.ui.model.json.JSONModel();
				sap.ui.getCore().setModel(oModel, "oRequest");
				sap.ui.getCore().getModel("oRequest").setData(oRequest);
				sap.ui.core.routing.Router.getRouter("MyRouter").navTo("reimbursement");
				return;
			case "Change Reimbursement Request":
				var oModel = new sap.ui.model.json.JSONModel();
				sap.ui.getCore().setModel(oModel, "oRequest");
				sap.ui.getCore().getModel("oRequest").setData(oRequest);
				sap.ui.core.routing.Router.getRouter("MyRouter").navTo("reimbursement");
				return;
			case "Open Reimbursement Request":
				var oModel = new sap.ui.model.json.JSONModel();
				sap.ui.getCore().setModel(oModel, "oRequest");
				sap.ui.getCore().getModel("oRequest").setData(oRequest);
				sap.ui.core.routing.Router.getRouter("MyRouter").navTo("reimbursement");
				return;
				//      End reimbursement
				//      Begin Tax clearance
				//      case "Create TAX Clearance":
				//      var oModel = new sap.ui.model.json.JSONModel();
				//      sap.ui.getCore().setModel(oModel,"oRequest");
				//      sap.ui.getCore().getModel("oRequest").setData(oRequest);
				//      sap.ui.core.routing.Router.getRouter("MyRouter").navTo("taxclearance");
				//      return;
				//      End   Tac clearance

			case "Upload Requisition Form":
				// Applicable for Domestic only
				sap.ui.project.e2etm.util.StaticUtility.setBusy(true, oHomeThis);
				// display popup
				if (oHomeThis.oCommonDialog) {
					oHomeThis.oCommonDialog.destroy();
				}
				// instantiate the Fragment if not done yet
				oHomeThis.oCommonDialog = sap.ui.xmlfragment("sap.ui.project.e2etm.fragment.common.UploadRequisitionDialog", oHomeThis);

				var model = new sap.ui.model.json.JSONModel();
				var bindData = {};
				bindData.ZZ_DEP_REQ = oRequest.ZZ_DEP_REQ;
				bindData.ZZ_DEP_PERNR = oRequest.ZZ_DEP_PERNR;

				var get = $.ajax({
					cache: false,
					url: sServiceUrl + "DmsDocsSet?$filter=DepReq+eq+'" +
						oRequest.ZZ_DEP_REQ + "'+and+EmpNo+eq+'" + oRequest.ZZ_DEP_PERNR +
						"' and DocType eq 'TRF'&$format=json",
					type: "GET"
				});
				get.done(function(result) {
					bindData.ZZ_DOC_PATH = "";
					try {
						bindData.ZZ_DOC_PATH = result.d.results[result.d.results.length - 1].FileUrl;
					} catch (exc) {}
					model.setData(bindData);
					sap.ui.getCore().byId("dialogUploadRequisition").setModel(model);
					sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
					if (bindData.ZZ_DOC_PATH == "") {
						sap.ui.getCore().byId("lnkRequisitionDocument").setVisible(false);
					} else {
						sap.ui.getCore().byId("lnkRequisitionDocument").setVisible(true);
					}
					oHomeThis.oCommonDialog.open();
				});
				return;
			case "Upload Exit CheckList":
				// Applicable for Domestic only
				sap.ui.project.e2etm.util.StaticUtility.setBusy(true, oHomeThis);
				// display popup
				if (oHomeThis.oCommonDialog) {
					oHomeThis.oCommonDialog.destroy();
				}
				// instantiate the Fragment if not done yet
				oHomeThis.oCommonDialog = sap.ui.xmlfragment("sap.ui.project.e2etm.fragment.common.UploadExitCheckListDialog", oHomeThis);

				var model = new sap.ui.model.json.JSONModel();
				var bindData = {};
				bindData.ZZ_DEP_REQ = oRequest.ZZ_DEP_REQ;
				bindData.ZZ_DEP_PERNR = oRequest.ZZ_DEP_PERNR;

				var get = $.ajax({
					cache: false,
					url: sServiceUrl + "DmsDocsSet?$filter=DepReq+eq+'" +
						oRequest.ZZ_DEP_REQ + "'+and+EmpNo+eq+'" + oRequest.ZZ_DEP_PERNR +
						"' and DocType eq 'EXI'&$format=json",
					type: "GET"
				});
				get.done(function(result) {
					bindData.ZZ_DOC_PATH = "";
					try {
						bindData.ZZ_DOC_PATH = result.d.results[result.d.results.length - 1].FileUrl;
					} catch (exc) {}
					model.setData(bindData);
					sap.ui.getCore().byId("dialogUploadExitCheckList").setModel(model);
					sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
					if (bindData.ZZ_DOC_PATH == "") {
						sap.ui.getCore().byId("lnkExitCheckListDocument").setVisible(false);
					} else {
						sap.ui.getCore().byId("lnkExitCheckListDocument").setVisible(true);
					}
					oHomeThis.oCommonDialog.open();
				});
				return;
		}
	},

	// EVENT ON SELECT MY TASK RECORD IN TABLE AND DISPLAY ON RIGHT PANEL
	onEmployeeMyTaskTableChange: function(evt) {
		try {
			sap.ui.project.e2etm.util.StaticUtility.setBusy(true, oHomeThis);
			var rowIndex = evt.mParameters.rowIndex;
			////############ UCD1KOR 12 July 2021 Changes BUSR Copy ###########//////// 
			sap.ui.getCore().getModel("global").getData().isCopy = false;
			sap.ui.getCore().getModel("global").getData().copyGeneral= false;
			sap.ui.getCore().getModel("global").getData().copyTravelDetails= false;
			sap.ui.getCore().getModel("global").getData().copyCostAssignment= false;
			sap.ui.getCore().getModel("global").getData().copyAdvance= false;
			sap.ui.getCore().getModel("global").refresh();
			/*Commented by uea6kor_uml6kor_upgrade 6.12.2019*/
			//if (rowIndex >= sap.ui.getCore().byId("tableEmployeeMyTasks").getVisibleRowCount()) {
			//	rowIndex = Math.floor(rowIndex % sap.ui.getCore().byId("tableEmployeeMyTasks").getVisibleRowCount());
			//}
			/*Commented by uea6kor_uml6kor_upgrade 6.12.2019*/
			var depId = sap.ui.getCore().byId("tableEmployeeMyTasks").getBinding().oList[rowIndex].ZZ_DEP_REQ; //sap.ui.getCore().byId("tableEmployeeMyTasks").getRows()[rowIndex].getCells()[1].getText(); /*Added by uea6kor_uml6kor_upgrade 6.12.2019*/
			var reqTyp = sap.ui.getCore().byId("tableEmployeeMyTasks").getBinding().oList[rowIndex].ZZ_REQ_TYP;//sap.ui.getCore().byId("tableEmployeeMyTasks").getRows()[rowIndex].getCells()[0].getText();/*Added by uea6kor_uml6kor_upgrade 6.12.2019*/
			
			this.selecedData = sap.ui.getCore().byId("tableEmployeeMyTasks").getBinding().oList[rowIndex];
			oHomeThis.setSelectedMyTask(depId, reqTyp);
		} catch (exc) {
			sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
		}
	},
	onManagerMyTaskTableChange: function(evt) {
		try {
			sap.ui.project.e2etm.util.StaticUtility.setBusy(true, oHomeThis);
			var rowIndex = evt.mParameters.rowIndex;
			/*Commented by uea6kor_uml6kor_upgrade 6.12.2019*/
//			if (rowIndex >= sap.ui.getCore().byId("tableManagerMyTasks").getVisibleRowCount()) {
//				rowIndex = Math.floor(rowIndex % sap.ui.getCore().byId("tableManagerMyTasks").getVisibleRowCount());
//			}
//			var depId = sap.ui.getCore().byId("tableManagerMyTasks").getRows()[rowIndex].getCells()[1].getText();
//			var reqTyp = sap.ui.getCore().byId("tableManagerMyTasks").getRows()[rowIndex].getCells()[0].getText();
			/*Commented by uea6kor_uml6kor_upgrade 6.12.2019*/
			
			var depId = sap.ui.getCore().byId("tableManagerMyTasks").getBinding().oList[rowIndex].ZZ_DEP_REQ;  /*Added by uea6kor_uml6kor_upgrade 6.12.2019*/
			var reqTyp = sap.ui.getCore().byId("tableManagerMyTasks").getBinding().oList[rowIndex].ZZ_REQ_TYP;/*Added by uea6kor_uml6kor_upgrade 6.12.2019*/
			
			oHomeThis.setSelectedMyTask(depId, reqTyp);
		} catch (exc) {
			sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
		}
	},
	onECOMyTaskTableChange: function(evt) {
		try {
			sap.ui.project.e2etm.util.StaticUtility.setBusy(true, oHomeThis);
			var rowIndex = evt.mParameters.rowIndex;
			if (rowIndex >= sap.ui.getCore().byId("tableECOMyTasks").getVisibleRowCount()) {
				rowIndex = Math.floor(rowIndex % sap.ui.getCore().byId("tableECOMyTasks").getVisibleRowCount());
			}
			var depId = sap.ui.getCore().byId("tableECOMyTasks").getRows()[rowIndex].getCells()[1].getText();
			var reqTyp = sap.ui.getCore().byId("tableECOMyTasks").getRows()[rowIndex].getCells()[0].getText();
			oHomeThis.setSelectedMyTask(depId, reqTyp);
		} catch (exc) {
			sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
		}
	},
	onTAXMyTaskTableChange: function(evt) {
		try {
			sap.ui.project.e2etm.util.StaticUtility.setBusy(true, oHomeThis);
			var rowIndex = evt.mParameters.rowIndex;
			if (rowIndex >= sap.ui.getCore().byId("tableTAXMyTasks").getVisibleRowCount()) {
				rowIndex = Math.floor(rowIndex % sap.ui.getCore().byId("tableTAXMyTasks").getVisibleRowCount());
			}
			var depId = sap.ui.getCore().byId("tableTAXMyTasks").getRows()[rowIndex].getCells()[1].getText();
			var reqTyp = sap.ui.getCore().byId("tableTAXMyTasks").getRows()[rowIndex].getCells()[0].getText();
			oHomeThis.setSelectedMyTask(depId, reqTyp);
		} catch (exc) {
			sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
		}
	},
	onCTGMyTaskTableChange: function(evt) {
		try {
			sap.ui.project.e2etm.util.StaticUtility.setBusy(true, oHomeThis);
			var rowIndex = evt.mParameters.rowIndex;
			if (rowIndex >= sap.ui.getCore().byId("tableCTGMyTasks").getVisibleRowCount()) {
				rowIndex = Math.floor(rowIndex % sap.ui.getCore().byId("tableCTGMyTasks").getVisibleRowCount());
			}
			var depId = sap.ui.getCore().byId("tableCTGMyTasks").getRows()[rowIndex].getCells()[1].getText();
			var reqTyp = sap.ui.getCore().byId("tableCTGMyTasks").getRows()[rowIndex].getCells()[0].getText();
			oHomeThis.setSelectedMyTask(depId, reqTyp);
		} catch (exc) {
			sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
		}
	},

	// EVENT ON UPLOADING ADDITIONAL DOCUMENTS
	onDeputationFileDialogClose: function(evt) {
		oHomeThis.uploadAdditional.close();
	},
	onAdditionalFileChange: function(evt) {
		oHomeThis.additionalFileUpload = evt.getSource();
	},
	onChangeDocName: function(evt) {
		oHomeThis.SelectedDocumentName = evt.getSource().getSelectedKey();
	},
	onDeputationFileDialogUpload: function(evt) {
		if (oHomeThis.additionalFileUpload != null) {
			sap.ui.project.e2etm.util.StaticUtility.setBusy(true, oHomeThis);
			try {
				var oRequest = oHomeThis.selectedItem.getModel().
				getProperty(oHomeThis.selectedItem.getBindingContext().getPath());
			} catch (exc) {
				var oRequest = sap.ui.getCore().byId("flexboxEmployeeMyTaskDetail").
				getModel("myEmployeeSelectedTaskModel").getData();
			}
			var extension = oHomeThis.additionalFileUpload.getProperty("value").substr(
				oHomeThis.additionalFileUpload.getProperty("value").lastIndexOf("."));
			var file = oHomeThis.additionalFileUpload.oFileUpload.files[0];

			var sFileName = oHomeThis.SelectedDocumentName + extension;

			var token = "";
			var get = $.ajax({
				cache: false,
				url: sServiceUrl + "EMP_PASSPORT_INFOSet",
				type: "GET",
				headers: {
					'Authorization': token
				},
				beforeSend: function(xhr) {
					xhr.setRequestHeader('X-CSRF-Token', 'Fetch');
				},
			});

			get.done(function(result, response, header) {
				var sSlung = oRequest.ZZ_DEP_REQ + "," + oRequest.ZZ_DEP_PERNR + "," + sFileName + "," + "T";
				var oHeaders = {
					'X-Requested-With': "XMLHttpRequest",
					'X-CSRF-Token': header.getResponseHeader("X-CSRF-Token"),
					'Accept': "application/json",
					'DataServiceVersion': "2.0",
					'Content-Type': "application/json",
					"slug": sSlung,
				};

				var post = jQuery.ajax({
					cache: false,
					type: 'POST',
					url: sServiceUrl + "DmsDocsSet",
					headers: oHeaders,
					cache: false,
					contentType: file.type,
					processData: false,
					data: file,
				});
				post.done(function() {
					oHomeThis.additionalFileUpload.clear();
					sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oHomeThis);
					sap.m.MessageToast.show("Successfully uploaded");
				});
			});

		}
	},

	// EVENT ON SEARCHING REQUEST BY EMPID OR REQUEST NUMBER IN DEPU DASHBOARD ALLREQUEST TAB
	onEmployeeSearch: function(evt) {
		sap.ui.getCore().byId("RequestSearchId").setValue(""); //added uml6kor req filter 13/1/2021
			this.bindDataBasedOnDepu(evt);
	},
	onRequestSearch: function(evt) {
		sap.ui.getCore().byId("EmployeeSearchId").setValue(""); //added uml6kor req filter 13/1/2021
		this.bindDataBasedOnDepu(evt);
	},

	//EVENT FOR HPL REPORT
	onCountExpectedTravel: function() {
		sap.ui.core.routing.Router.getRouter("MyRouter").navTo("countexpectedtravel");

	},

	onEmployeeTravelDetails: function() {
		sap.ui.core.routing.Router.getRouter("MyRouter").navTo("chplemployeetraveldetailsreport");
	},

	onTravelEstimates: function() {
		sap.ui.core.routing.Router.getRouter("MyRouter").navTo("travelestimate");
	},

	checkCggsData: function(aData) {
		var data = this.getView().getModel("cggsmodel").getData();
		var managerData = sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData();
		var cggsFlag = sap.ui.project.e2etm.util.StaticUtility.visibleCggsData(managerData.ZZ_TRV_REQ, managerData.ZZ_DEP_TOCNTRY, managerData
			.ZZ_ASG_TYP,
			managerData.ZZ_REQ_TYP, managerData.ZZ_TRV_CAT,managerData.ZZ_VREASON, managerData.ZZ_VREASON_EX);//uea6kor-uml6kor 27/8/2020 added RBEIITAPPPIPELINE-217  for Extension date
		if (cggsFlag) {
			if (data.Zlevel == "" || data.Zlevel == undefined) {
				sap.ui.getCore().byId("ipCggsLevel").setValueState("Error");
				return "Please enter Level in Host country";
			} else {
				sap.ui.getCore().byId("ipCggsLevel").setValueState("None");
			}
			if (data.Jobtitle == "" || data.Jobtitle == undefined) {
				sap.ui.getCore().byId("ipCggsjobTitle").setValueState("Error");
				return "Please enter Job Title";
			} else {
				sap.ui.getCore().byId("ipCggsjobTitle").setValueState("None");
			}
			if (data.Amount == "" || data.Amount == undefined) {

				sap.ui.getCore().byId("ipCggsAmt").setValueState("Error");
				return "Please enter Amount";
			} else {
				sap.ui.getCore().byId("ipCggsAmt").setValueState("None");
			}
		}
		return "";
	},
	onCggsAmtChange: function(evt) {
		if (evt.getSource().getValue() == "") {
			this.getView().getModel("cggsmodel").getData().Amount = 0;
		}
	},
	onDepuToChange: function(evt) {
		var data = sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData();
		if (data.ZZ_DEP_TYPE == "INTL" && data.ZZ_REQ_TYP == "DEPU") {
			if (evt.getSource().getSelectedKey() == "GLOB") {
				sap.ui.getCore().byId("thirdPartyCustomer").setVisible(true);
			} else {
				sap.ui.getCore().byId("thirdPartyCustomer").setVisible(false);
			}
		} else {
			sap.ui.getCore().byId("thirdPartyCustomer").setVisible(false);
		}
	},
	visibleThirdPartyCustomerBox: function(selectedData) {
		sap.ui.getCore().byId("thirdPartyCustomer").setVisible(false);
		//    if(selectedData.ZZ_TRV_REQ != "" && selectedData.ZZ_TRV_REQ != "0000000000"){
		if (selectedData.ZZ_DEP_TYPE == "INTL" && selectedData.ZZ_REQ_TYP == "DEPU" &&
			selectedData.ZZ_DEP_SUB_TYPE == "GLOB") {
			sap.ui.getCore().byId("thirdPartyCustomer").setVisible(true);
		}
		//    }
	},
	onValueHelpRequest: function(evt) {
		var oControl = evt.oSource;
		var oValueHelpDialog = new sap.ui.comp.valuehelpdialog.ValueHelpDialog({
			supportMultiselect: false,
			cancel: function(oControlEvent) {
				oValueHelpDialog.close();
			},
			change: function() {
				alert("changeDialog");
			},
			afterClose: function() {
				oValueHelpDialog.destroy();
			},
			ok: function(oControlEvent) {
				var sKey = oControlEvent.getParameter("tokens")[0].getProperty("key");
				oControl.setValue(sKey);
				oValueHelpDialog.close();
				sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData().ZZ_3PARTY_CUST = sKey;
			},
		});
		var oRowsModel = new sap.ui.model.json.JSONModel();
		oValueHelpDialog.setModel(oRowsModel);
		oValueHelpDialog.theTable = oValueHelpDialog.getTable();
		oValueHelpDialog.theTable.bindRows("/");
		this.setCustomerF4(oRowsModel, oValueHelpDialog);
		oValueHelpDialog.open();

	},
	// Set customer for search help
	setCustomerF4: function(oRowsModel, oValueHelpDialog) {
		oValueHelpDialog.setTitle("CUSTOMER");
		oValueHelpDialog.setKey("NAME1");
		oValueHelpDialog.theTable.addColumn(new sap.ui.table.Column({
			width: "170px",
			label: new sap.ui.commons.Label({
				text: "CUSTOMER NAME"
			}),
			template: new sap.ui.commons.TextView().bindProperty("text", "NAME1"),
			sortProperty: "NAME1",
			filterProperty: "NAME1"
		}));
		oValueHelpDialog.theTable.addColumn(new sap.ui.table.Column({
			width: "170px",
			label: new sap.ui.commons.Label({
				text: "CUSTOMER NO"
			}),
			template: new sap.ui.commons.TextView().bindProperty("text", "KUNNR"),
			sortProperty: "KUNNR",
			filterProperty: "KUNNR"
		}));
		oValueHelpDialog.theTable.addColumn(new sap.ui.table.Column({
			width: "170px",
			label: new sap.ui.commons.Label({
				text: "COUNTRY"
			}),
			template: new sap.ui.commons.TextView().bindProperty("text", {
				path: "LAND1",
				formatter: function(fValue) {
					if (fValue) {
						return sap.ui.project.e2etm.util.Formatter.formatCountry(fValue);
					}
					return "0";
				}
			}),
			sortProperty: "LAND1",
			filterProperty: "LAND1"
		})), oValueHelpDialog.theTable.addColumn(new sap.ui.table.Column({
			width: "170px",
			label: new sap.ui.commons.Label({
				text: "CITY"
			}),
			template: new sap.ui.commons.TextView().bindProperty("text", "ORT01"),
			sortProperty: "ORT01",
			filterProperty: "ORT01"
		}));
		oValueHelpDialog.theTable.addColumn(new sap.ui.table.Column({
			width: "170px",
			label: new sap.ui.commons.Label({
				text: "POSTAL CODE"
			}),
			template: new sap.ui.commons.TextView().bindProperty("text", "PSTLZ"),
			sortProperty: "PSTLZ",
			filterProperty: "PSTLZ"
		}));
		oValueHelpDialog.theTable.addColumn(new sap.ui.table.Column({
			width: "170px",
			label: new sap.ui.commons.Label({
				text: "HOME ADDRESS"
			}),
			template: new sap.ui.commons.TextView().bindProperty("text", "STRAS"),
			sortProperty: "STRAS",
			filterProperty: "STRAS"
		}));
		oValueHelpDialog.theTable.addColumn(new sap.ui.table.Column({
			width: "170px",
			label: new sap.ui.commons.Label({
				text: "SEARCH TERM"
			}),
			template: new sap.ui.commons.TextView().bindProperty("text", "SORTL"),
			sortProperty: "SORTL",
			filterProperty: "SORTL"
		}));
		oValueHelpDialog.theTable.addColumn(new sap.ui.table.Column({
			width: "170px",
			label: new sap.ui.commons.Label({
				text: "PHONE NO"
			}),
			template: new sap.ui.commons.TextView().bindProperty("text", "TELF1"),
			sortProperty: "TELF1",
			filterProperty: "TELF1"
		}));
		var customer = sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData().customerAll;
		if (customer) {
			oRowsModel.setData(customer);
		} else {
			oValueHelpDialog.setBusy(true);
			this.getCustomerAll(oRowsModel, oValueHelpDialog);
		}

	},
	getCustomerAll: function(oRowsModel, oValueHelpDialog) {
		var oDataModel1 = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
		var odata;
		odata = {
			PERNR: sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_PERNR
		};
		oDataModel1.callFunction("CUSTOMER_DETAILS_ALL_RFC", "GET", odata, null, jQuery.proxy(function(oData, response) {
			oRowsModel.setData(oData.results);
			oValueHelpDialog.setBusy(false);
		}, this), function(error) {
			oValueHelpDialog.setBusy(false);
		}, true);
	},
	validateThirdPartyCustomer: function(status, depType, reqType) {
		var data = sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData();
		if (status.substring(2, 5) == "001" && depType == "INTL" && reqType == "DEPU") {
			if (sap.ui.getCore().byId("thirdPartyCustomer").getVisible() && (data.ZZ_3PARTY_CUST == "" || data.ZZ_3PARTY_CUST == undefined)) {
				return "Please enter Third Party Customer";
			}
		}
		return "";
	},
	displayPopUpMessage: function() {
		var odata;
		odata = {
			Selpar: '*'
		};
		odata["Constant"] = "BUDGET_CONTACTS";
		oComponent.getModel().callFunction("GetTrstPdfMsg", "GET", odata, null, function(oData, response) {
			var content = oData.GetTrstPdfMsg.Message;
			var html = new sap.ui.core.HTML({
				content: content
			});
			var dialog = new sap.m.Dialog({
				title: 'Information',
				type: 'Message',
				content: html,
				beginButton: new sap.m.Button({
					text: 'OK',
					press: function() {
						dialog.close();
					}
				}),
			});
			dialog.open();
		});
	},

	onPdmPress: function(evt) {
		sap.ui.core.routing.Router.getRouter("MyRouter").navTo("PreDepartureCalender");
	},
	
	/* --------Disable DHL Cargo UEA6KOR_21.2.2020----------*/
	onDisableDHL:function(){
//		MessageBox.error(
//				"You cannot create DHL Request", {
//					actions: [MessageBox.Action.CLOSE],
//					onClose: function (sAction) {
//						//MessageToast.show("Action selected: " + sAction);
//					}
//				}
//			);
//		return;
		
		var text ="Dear Employee,\n"+
		"\nYour eligibility for Cargo will be up to 10,000 INR/- & 30,000 INR/- for onward & return respectively. " +
				"You need to make your own arrangement & Claim as per limit at the time of travel settlement against original bills. ";
	    /*sap.ca.ui.message.showMessageBox({
		type: sap.ca.ui.message.Type.ERROR,
		message: text,
	});*/
		// Messagebox 
		sap.m.MessageBox.information(text);
	    
		return;
	},
	/* --------Disable DHL Cargo UEA6KOR_21.2.2020----------*/
	//##################### UCD1KOR 12 Feb 2020 #####################################//
	onPressRepatriation: function(evt) {
		sap.ui.core.routing.Router.getRouter("MyRouter").navTo("Repatriation");
	},
	
	//Added by UEA6KOR_18.11.2020 for inland deputation CL generation
	generateCL:function(){

		var aData = sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData();
	//	var comment = sap.ui.getCore().byId("txtManagerWFComment").getValue();
	//	var strAssModel = sap.ui.getCore().byId("cbAssModel").getSelectedKey();  
		//var strStaDeMode = sap.ui.getCore().byId("cbClFormat").getSelectedKey();
		
		// Validate if the assignment model is entered
//		var strAssModel = sap.ui.getCore().byId("cbAssModel").getSelectedKey();
//		if (strAssModel == "" || strAssModel == null || strAssModel == "Please select") {
//			sap.ca.ui.message.showMessageBox({
//				type: sap.ca.ui.message.Type.ERROR,
//				message: "Please enter Assignment Model",
//				details: "Please enter Assignment Model"
//			});
//			return;
//		}

		// Validation for mentor, host, job for creation process
		var strMentor = "";
		var strHost = "";
		var strJob = "";
		var strCls = "";
		var strSal = "";
		var strStaDeMode = "";


		sap.ui.project.e2etm.util.StaticUtility.setBusy(true,oHomeThis);

		// Getting Contract Letter from the backend
		var token = "";
		var get = $.ajax({
			cache: false,
			url: sServiceUrl + "EMP_PASSPORT_INFOSet",
			type: "GET",
			beforeSend: function(xhr){
				xhr.setRequestHeader('X-CSRF-Token', 'Fetch');
			},
		});
		get.done(function(result, response, header){
			token = header.getResponseHeader("X-CSRF-Token");
			var data = {};
			data.ZZ_DEP_REQ = aData.ZZ_DEP_REQ;
			data.ZZ_DEP_PERNR = aData.ZZ_DEP_PERNR;
			data.ZZ_ASG_TYP = aData.ZZ_ASG_TYP;
			data.ZZ_AUTOMATIC = 'X';
			data.ZZ_HOSTENTITY = strHost;
			data.ZZ_JOB = strJob;
			data.ZZ_MENTOR = strMentor;
			data.ZZ_JOB_CLS = strCls;
			data.ZZ_SALARY_SHA = strSal;
			data.ZZ_STADECL_MODE = strStaDeMode;

			var post = $.ajax({
				cache: false,
				url: sServiceUrl + "ZE2E_DOCS_DETAILSSet",
				type: "POST",
				beforeSend: function(xhr){
					xhr.setRequestHeader('X-Requested-With', "XMLHttpRequest");
					xhr.setRequestHeader('X-CSRF-Token', token);
					xhr.setRequestHeader('Accept', "application/json");
					xhr.setRequestHeader('DataServiceVersion', "2.0");
					xhr.setRequestHeader('Content-Type', "application/json");
				},
				data: JSON.stringify(data),
				dataType:"json",
				success: function(data, response, header) {
					// If contract letter is created, then call the get entity
					// service
					var get = $.ajax({
						cache: false,
						url: sServiceUrl + "ZE2E_DOCS_DETAILSSet?$filter=ZZ_DEP_REQ eq '" + aData.ZZ_DEP_REQ + "'&$format=json",
						type: "GET",
					});
					get.done(function(data) {
						sap.ui.project.e2etm.util.StaticUtility.setBusy(false,oHomeThis);
						// Open the link in new window.
					// window.open(data.d.results[data.d.results.length -
					// 1].ZZ_DOC_PATH,
						// '_blank' // <- This is what makes it open in a new
						// window.
//						window.open(data.d.results[0].ZZ_DOC_PATH,
//										'_blank'
//						);
					});
				},
			});
			post.fail(function(err) {
				sap.ui.project.e2etm.util.StaticUtility.setBusy(false,oHomeThis);
				sap.ui.core.routing.Router.getRouter("MyRouter").myNavBack();
			});
		});
			
	},
	// DEPU WORKFLOW ACTION
	deputationAction : function(status, statusString) {
		var that= this;
		sap.ui.project.e2etm.util.StaticUtility.setBusy(true,oHomeThis);

//		if (status != "CLOSE") {
//			var position = sap.ui.getCore().getModel("profile").getData().currentRole;
//			var roleKeys = sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_POSITION.split(";");
//			var rolePref = sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_STATUS_TXT.split(";");
//			for (var i = 0; i < roleKeys.length; i++) {
//				if (roleKeys[i] == position) {
//					status = rolePref[i] + status;
//					break;
//				}
//			}
//		}

		var data = sap.ui.getCore().byId("flexboxManagerMyTaskDetail").getModel("myManagerSelectedTaskModel").getData();
		var aData = {};
		aData.ZZ_DEP_REQ = data.ZZ_DEP_REQ;
		aData.ZZ_DEP_PERNR = data.ZZ_DEP_PERNR;
		aData.ZZ_DEP_NTID = data.ZZ_DEP_NTID;
		aData.ZZ_DEP_EMAIL = data.ZZ_DEP_EMAIL;
		aData.ZZ_DEP_TYPE = data.ZZ_DEP_TYPE;
		aData.ZZ_DEP_SUB_TYPE = data.ZZ_DEP_SUB_TYPE;
		aData.ZZ_DEP_TYPE_TXT = data.ZZ_DEP_TYPE_TXT;
		aData.ZZ_DEP_FRMLOC_TXT = data.ZZ_DEP_FRMLOC_TXT;
		aData.ZZ_DEP_TOLOC_TXT = data.ZZ_DEP_TOLOC_TXT;
		aData.ZZ_MGR_PERNR = sap.ui.getCore().getModel("profile").getData().employeeDetail.ZZ_DEP_PERNR;
		aData.ZZ_STAT_FLAG = status = "JJ006";

		aData.ZZ_VREASON_EX = data.ZZ_VREASON_EX;// uea6kor-uml6kor 24/8/2020
													// RBEIITAPPPIPELINE-217
													// date change extension
		
		 if (status.substring(2, 5) == "006") {
			aData.ZZ_NEW_COMMENTS = sap.ui.getCore().byId("textAreaManagerComment").getValue();
			aData.ZZ_ASG_TYP = data.ZZ_ASG_TYP;
		}

		if (aData.ZZ_DEP_TYPE == "DOME") {
			if (status != "CLOSE") {
				aData.ZZ_STAGE = "1";
				aData.ZZ_SET = "1_2";
				aData.ZZ_SUBSET = "1_2_1";
				aData.ZZ_SUBSUBSET = "1_2_1_2";
			} else {
				aData.ZZ_STAGE = "1";
				aData.ZZ_SET = "1_2";
				aData.ZZ_SUBSET = "1_2_1";
				aData.ZZ_SUBSUBSET = "1_2_1_4";
			}
		} 
		
		var get = $.ajax({
			cache: false,
		  //async: false, //Added
			url: sServiceUrl + "DEP_HDR_INFOSet(ZZ_DEP_REQ='" + sDeputationNo + "',ZZ_VERSION='')?$expand=HDR_ITEM&$format=json",
			type: "GET"
		});
		get.done(function(odata1, header, response) {
			eTagHome = response.getResponseHeader("etag");
			if (eTagHome.indexOf("W/")!== -1 || eTagHome == "W/\"''\"" || eTagHome == "W/\"'0.0000000%20'\"") {
				eTagHome = "*";
				///####################### UCD1KOR Added below event for service sequece Dec 19 #############################//////////////
				that.eTagFlagService(aData,status,statusString); /// For sequence
			}
		});
	},
	///UCD1KOR Added Below event 
	///####################### UCD1KOR Added below event for service sequece Dec 19 Start##################################//////////////
	eTagFlagService:function(aData,status,statusString){
		var token = "";
		var get = $.ajax({
			cache: false,
			url: sServiceUrl + "EMP_PASSPORT_INFOSet",
			type: "GET",
			beforeSend: function(xhr){
				xhr.setRequestHeader('X-CSRF-Token', 'Fetch');
			},
		});
		get.done(function(result, response, header){
			token = header.getResponseHeader("X-CSRF-Token");
			var post = $.ajax({
				cache: false,
				url: sServiceUrl + "DEP_HDR_INFOSet(ZZ_DEP_REQ='" + aData.ZZ_DEP_REQ + "',ZZ_VERSION='')", 
				type: "PUT",
				beforeSend: function(xhr){
					xhr.setRequestHeader('X-Requested-With', "XMLHttpRequest");
					xhr.setRequestHeader('X-CSRF-Token', token);
					xhr.setRequestHeader('Accept', "application/json");
					xhr.setRequestHeader('DataServiceVersion', "2.0");
					xhr.setRequestHeader('Content-Type', "application/json");
					xhr.setRequestHeader("If-Match",eTagHome);
					// "W/\"'000000858'\""
				},
				data: JSON.stringify(aData),
				dataType:"json",
				success: function(result, response, header) {
					try {
						oHomeThis.oCommonDialog.close();
					} catch(exc) {}
					sap.ui.project.e2etm.util.StaticUtility.setBusy(false,oHomeThis);
					if (aData.ZZ_STAT_FLAG == "JJ005" || aData.ZZ_STAT_FLAG == "JJ008" || 
							aData.ZZ_STAT_FLAG == "JJ009" || aData.ZZ_STAT_FLAG == "JJ013") {
						
					} else {
						if (aData.ZZ_STAT_FLAG == "CLOSE" && data.ZZ_TTYPE == "WTRP") {
							if (header.getResponseHeader('REASON') != "" && 
									header.getResponseHeader('REASON') != null) {
								sap.ca.ui.message.showMessageBox({
									type: sap.ca.ui.message.Type.ERROR,
									message: "Travel request cannot be created. Please contact help desk.",
									details: header.getResponseHeader('REASON')
								});
								return;
							}
						}
						sap.ui.core.routing.Router.getRouter("MyRouter").myNavBack();
						sap.m.MessageToast.show(statusString + "!");
					}
				},
			});
			post.fail(function(err) {
				// Call get entity service with deputation request number
				if (err.status == 412) {
					var get = $.ajax({
						cache: false,
						url: sServiceUrl + "DEP_LOCK_USERSet('" + sDeputationNo + "')?$format=json",
						type: "GET",
					});
					get.done(function(result) {
						try {
							oHomeThis.oCommonDialog.close();
						} catch(exc) {}
						sap.ui.project.e2etm.util.StaticUtility.setBusy(false,oHomeThis);
						sap.ca.ui.message.showMessageBox({
							type: sap.ca.ui.message.Type.ERROR,
							message: "This request was modified by " + result.d.ZZ_DEP_NTID + ". Please refresh homepage"
						});
					});
				} else {
					try {
						oHomeThis.oCommonDialog.close();
					} catch(exc) {}
					sap.ui.project.e2etm.util.StaticUtility.setBusy(false,oHomeThis);
					sap.ca.ui.message.showMessageBox({
						type: sap.ca.ui.message.Type.ERROR,
						message: "Sorry for this inconvenience. Please contact support team",
						details: oError.responseText
					});
				}
			});
		});
	},
	///####################### UCD1KOR Added below event for service sequece Dec 19 Stop###############################################//////////////
	//Added by UEA6KOR_18.11.2020 for inland deputation CL generation
	/*------------------------USER EVENT HANDLER AREA END------------------------*/
	
	/*############################################ UCD1KOR POC For Deputation Dashboard ##########################///////////////////*/
	onFinished:function(oEvent){
		 var oList = oEvent.getSource();
		 try{
			 var array = this.selectedTileObject.selectedItemsInPopOver;
			 for(let i=0;i<array.length;i++){
                 var regex = /\d+/g;
                 try{
                 	var string = array[i];
                     var val = string.match(regex).toString();
                     var oItem = oList.getItems()[parseInt(val)];
                     oList.setSelectedItem(oItem);
                 }
                 catch(err){
                     //TilesData.d.results[i].statusCount= 0;
                 }
                 
             }
		 }catch(err){}
	     
	       
	},
	onPressFilter1:function(oEvent){
		var oButton = oEvent.getSource();
		var obj = oEvent.getSource().getId().split("-")[oEvent.getSource().getId().split("-").length-1];
		this.selectedTileObject = sap.ui.getCore().getModel("Tile").getObject("/"+obj);
		this.selectedTileObject.TileId = oEvent.getSource().getId();
		var splitTileObj = this.selectedTileObject.StatusText.split(";");
		var StautsFlag = this.selectedTileObject.StatusFlag.split(";");
		splitTileObj.shift();
		var flag=[];
		for(var i=0;i<StautsFlag.length;i++){
			if(StautsFlag[i] !==""){
				flag.push(StautsFlag[i]);
			}
		}
		var statusList = [];
		for(var i=0;i<splitTileObj.length;i++){
			statusList.push({"StautsName":splitTileObj[i],"StautsFlag":flag[i]});
		}
		
		var SatusModel = new sap.ui.model.json.JSONModel();
		SatusModel.setData(statusList);
		this.getView().setModel(SatusModel, "Satus");
		sap.ui.getCore().setModel(SatusModel, "Satus");
		//////////############### UCD1KOR 10 Feb 2021 Open Popover #####################////////////////////////////////////
		if (!this._StatusList) {
			this._StatusList = sap.ui.xmlfragment(
				"sap.ui.project.e2etm.fragment.home.HOME_StatusList",
				oHomeThis
			);
			this.getView().addDependent(this._StatusList);
		}
		
		this._StatusList.openBy(oButton);
		//#################################################### Set selected items in popover#####################///////////
		if(this.selectedTileObject.selectedItemsInPopOver === undefined){
			sap.ui.getCore().byId("idPopoverTable").selectAll();
		}
		sap.ui.getCore().getModel("Tile").refresh();
		
		//sap.ui.getCore().byId("idPopoverTable").selectAll();
	},
	onListItemStatusOkPress:function(oEvent){
			var selectedItems = oEvent.getSource().getParent().getParent().getContent()[0].getSelectedContextPaths();
			
			if(selectedItems !== undefined && selectedItems.length !== 0){
				this.selectedTileObject.selectedItemsInPopOver = oEvent.getSource().getParent().getParent().getContent()[0].getSelectedContextPaths();
				try{
					 var array = this.selectedTileObject.selectedItemsInPopOver;
					 var val = 0;
					 var statusString =[];
					 var SelectedTileInfo = [];

					 for(let i=0;i<array.length;i++){
		                 var regex = /\d+/g;
		                 try{
		                 	var string = sap.ui.getCore().getModel("Satus").getObject(array[i]).StautsName;
		                     var count = string.match(regex).toString();
		                     val = val + parseInt(count);
		                     statusString.push(string.split(")")[1]);
		                     
		                     var flag = sap.ui.getCore().getModel("Satus").getObject(array[i]).StautsFlag;
		                     SelectedTileInfo.push(flag);
		                 }
		                 catch(err){
		                 }
		                 
		             }
				 }catch(err){}
				 if(this.SelectedStringFormat.length != 0){
					 for(var i=0;i<this.SelectedStringFormat.length;i++){
						 if(this.SelectedStringFormat[i].Country == this.selectedTileObject.Country){
							 var index = this.SelectedStringFormat.indexOf(this.SelectedStringFormat[i]);
							 if (index > -1) {
								 this.SelectedStringFormat.splice(index, 1);
							 }
						 }
					 }
				 }
				 this.SelectedStringFormat.push({"Country":this.selectedTileObject.Country,"StatusFlag":SelectedTileInfo.toString()});
				 this.selectedTileObject.Desc=statusString.toString();
				 this.selectedTileObject.Count = val;
				// this.FilterText();
				 sap.ui.getCore().getModel("Tile").refresh();
				 this.bindDataBasedOnRole();
				 var id = this.selectedTileObject.TileId;
				 sap.ui.getCore().byId(id).addStyleClass("backgroundColorClass");
				 
				 if(this.SelectedTileBorder.length != 0){
					 for(var i=0;i<this.SelectedTileBorder.length;i++){
						 if(this.SelectedTileBorder[i] == id){
							 var index = this.SelectedTileBorder.indexOf(this.SelectedTileBorder[i]);
							 if (index > -1) {
								 this.SelectedTileBorder.splice(index, 1);
							 }
						 }
					 }
				 }
				 this.SelectedTileBorder.push(id);
			}
			else{
				if(this.SelectedStringFormat.length != 0){
					 for(var i=0;i<this.SelectedStringFormat.length;i++){
						 if(this.SelectedStringFormat[i].Country == this.selectedTileObject.Country){
							 var index = this.SelectedStringFormat.indexOf(this.SelectedStringFormat[i]);
							 if (index > -1) {
								 this.SelectedStringFormat.splice(index, 1);
							 }
						 }
					 }
				 }
				var id = this.selectedTileObject.TileId;
				if(this.SelectedTileBorder.length != 0){
					 for(var i=0;i<this.SelectedTileBorder.length;i++){
						 if(this.SelectedTileBorder[i] == id){
							 var index = this.SelectedTileBorder.indexOf(this.SelectedTileBorder[i]);
							 if (index > -1) {
								 this.SelectedTileBorder.splice(index, 1);
							 }
						 }
					 }
				 }
				this.selectedTileObject.selectedItemsInPopOver = "";
				this.selectedTileObject.Desc = this.selectedTileObject.TotalDesc;
				this.selectedTileObject.Count = this.selectedTileObject.TotalCount;
				sap.ui.getCore().getModel("Tile").refresh();
				var id = this.selectedTileObject.TileId;
				 sap.ui.getCore().byId(id).removeStyleClass("backgroundColorClass");
				 this.bindDataBasedOnRole("None");
				// this.FilterText();
			}
			
		this._StatusList.close();
		
	},
	FilterText:function(Data){
		try {
			try{
				 var country = this.SelectedStringFormat.Country;
				 var desc = this.SelectedStringFormat.StatusFlag;
			}catch(err){}
				var countryName ="";
				if (country) {
					var countryList = sap.ui.getCore().getModel("global").getData().country;
					for (var i = 0; i < countryList.length; i++) {
						if (countryList[i].MOLGA == country) {
							 countryName = countryName+ countryList[i].LTEXT;
						}
						else if(country =="ROW"){
							 countryName = countryName+  "Rest Of World";
						}
					}
				}
				sap.ui.getCore().byId("idFilterToolbarText").setText("Selected Filters are "+countryName +" - "+desc);
			} catch (exc) {}
	},
	onListItemStatusPress:function(){
		this._StatusList.close();
	}
	
});