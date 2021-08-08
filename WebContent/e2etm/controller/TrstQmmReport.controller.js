jQuery.sap.require("sap.ui.core.util.Export");
jQuery.sap.require("sap.ui.core.util.ExportType");
jQuery.sap.require("sap.ui.core.util.ExportTypeCSV");
jQuery.sap.require("sap.ui.project.e2etm.util.Formatter");
jQuery.sap.require("sap.ui.project.e2etm.util.StaticUtility");
jQuery.sap.require("sap.m.MessageBox");
sap.ui.controller("sap.ui.project.e2etm.controller.TrstQmmReport", {
	/**
	 * Called when a controller is instantiated and its View controls (if
	 * available) are already created. Can be used to modify the View before it
	 * is displayed, to bind event handlers and do other one-time
	 * initialization.
	 * 
	 * @memberOf e2etm.view.TrstQmmReport
	 */
	onInit : function() {
		sap.ui.core.routing.Router.getRouter("MyRouter")
				.attachRoutePatternMatched(this.onRouteMatched, this);
	},
	onRouteMatched : function(evt) {
		this.getView().byId("txtPlace").setVisible(false);
		this.getView().byId("txtAccdt").setVisible(false);
		this.getView().byId("txtPaydt").setVisible(false);
		this.getView().byId("txtLtime").setVisible(false);
		this.getView().byId("txtDocno").setVisible(false);
		this.getView().byId("txtSLA").setVisible(false);
		this.getView().byId("flxTpEmp").setVisible(false);
		this.getView().byId("flxTkMod").setVisible(false);
		if (evt.getParameter("arguments").name == "QMM") {
			this["Report"] = "QMM";
			this.getView().byId("reportPage").setTitle("QMM-SLA Compliance");
			this.getView().byId("txtInidt").getHeader().setText(
					"Initiation date");
			this.getView().byId("txtClsdt").getHeader().setText("Closed date");
			/*
			 * this.getView().byId("txtAccdt").setVisible(true);
			 * this.getView().byId("txtLtime").setVisible(true);
			 * this.getView().byId("txtDocno").setVisible(true);
			 * this.getView().byId("txtSLA").setVisible(true);
			 * this.getView().byId("txtPaydt").setVisible(true);
			 */
			this.getView().byId("flxTpEmp").setVisible(true);
			this.onSelectQmmReport();
		} else if (evt.getParameter("arguments").name == "OEI") {
			this["Report"] = "OEI";
			this.getView().byId("reportPage").setTitle("OEI Report");
			this.getView().byId("txtInidt").getHeader().setText("Start date");
			this.getView().byId("txtClsdt").getHeader().setText("Closure date");
			// this.getView().byId("txtPlace").setVisible(true);
			this.getView().byId("flxTkMod").setVisible(true);

			let visibleColumns = [ "idQmmEmpNo", "idQmmEmpName", "idQmmTpNo",
					"txtScndt", "idQmmTrvlSetAckDate", "idQmmReviewbyTRST",
					"idQmmApprbyTRST", "idQmmSentForex", "idQmmINRrec",
					"idQmmEnhncDate", "idQmmTaxables", "idQmmFnlMngrApr",
					"idQmmEmpSubdate", "idQmmBudgetCode", "idQmmWBS",
					"idQmmCostcenter", "idQmmFundCenter", "idQmmFund",
					"idQmmBU", "idQmmSection", "idQmmDepartment", "idQmmGroup",
					"idQmmTravellocation", "idQmmTravelCountry", "idQmmDays",
					"idQmmEndDate", "idQmmStartDate","idTrstQmmType","txtClsdt","txtAccdt"

			];
			for (var i = 0; i < visibleColumns.length; i++) {
				this.getView().byId(visibleColumns[i]).setVisible(true);
			}

			this.getView().byId("idQmmRadioHBox").setVisible(false);
		}
	},
	onSubmit : function() {
		var that = this;
		var frmdate = this.getView().byId("fromdate").getValue();
		var todate = this.getView().byId("todate").getValue();
		var tp = this.getView().byId("tpno").getValue();
		var empno = this.getView().byId("empno").getValue();
		var traveltype = this.getView().byId("traveltype").getValue();
		var module = this.getView().byId("module").getValue();
		var filterString;
		if (frmdate) {
			filterString = "Inidt ge '" + frmdate + "'";
		}
		if (todate) {
			filterString = filterString + " and Inidt le '" + todate + "'";
		}
		if (tp) {
			filterString = filterString ? (filterString + " and Reinr eq '"
					+ tp + "'") : ("Reinr eq '" + tp + "'");
		}
		if (empno) {
			filterString = filterString ? (filterString + " and Pernr eq '"
					+ empno + "'") : ("Pernr eq '" + empno + "'");
		}
		if (traveltype) {
			filterString = filterString ? (filterString + " and Trvky eq '"
					+ traveltype + "'") : ("Trvky eq '" + traveltype + "'");
		}
		if (module) {
			filterString = filterString ? (filterString + " and Modid eq '"
					+ module + "'") : ("Modid eq '" + module + "'");
		}
		// ########### UCD1KOR Conditions added for QMM DEC 10########### //
		sap.ui.core.BusyIndicator.show(1);
		if (filterString) {
			
			if(this["Report"] == "QMM"){
				let selectedReport = this.getView().byId("idQmmReportSelect").getSelectedIndex();
				if(selectedReport == 0){ /// advance
					
					filterString = filterString + " and SModid eq '' and Modid eq 'INRA'"
				}
				else if(selectedReport == 1){ /// inland
					
					filterString = filterString + " and SModid eq 'DOME' and Modid eq 'TRST'"
				}
				else if(selectedReport == 2){/// intl
					
					filterString = filterString + "and SModid eq 'INTL' and Modid eq 'TRST'"
				}
			}
			
			
			filterString = filterString + " and Report eq '" + this["Report"]
					+ "'";
			oComponent.getModel().read(
					"TrstQmmSlaRepSet?$filter=" + filterString, null, null,
					true,
					// success
					jQuery.proxy(function(oData, response) {
						var model = new sap.ui.model.json.JSONModel();
						model.setData(oData.results);
						model.setSizeLimit(500);
						if(oData.results.length > 1000){
							sap.m.MessageBox.information('There are total '+oData.results.length+ ' available for this selection ' +
									 'Displaying all these records may lead to performance issues and page may not respond as expected.' +
									 'Kindly check your selection parameters accordingly. \n\n' +
									 'Do you want to continue fetching  and displaying all records ?', {
					                       icon: sap.m.MessageBox.Icon.INFORMATION,
					                       title: "Information",
					                       actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
					                       emphasizedAction: sap.m.MessageBox.Action.YES,
					                       onClose: function (oAction) { 
					                    	   if(oAction == "YES"){
					                    		   model.setSizeLimit(5000);
					                    		   that.getView().byId("qmmRep").setModel(model);
					                    		   that.getView().byId("idDetailsRecords").setText("Details("+ oData.results.length+")");
					       						   that.getView().byId("qmmRep").setModel(model);
					       						   sap.ui.core.BusyIndicator.hide();
					                    	   }
					                    	   else{
					                    		   that.getView().byId("idDetailsRecords").setText("Details("+ oData.results.length+")");
					       						   that.getView().byId("qmmRep").setModel(model);
					       						   sap.ui.core.BusyIndicator.hide();
					                    	   }
					                       }
									}); 
							}
						else{
							that.getView().byId("idDetailsRecords").setText("Details("+ oData.results.length+")");
							this.getView().byId("qmmRep").setModel(model);
							sap.ui.core.BusyIndicator.hide();
						}
						
					}, this), jQuery.proxy(function(error) {
						sap.ui.core.BusyIndicator.hide();
					}, this));
		} else {
			sap.ui.core.BusyIndicator.hide();
			sap.m.MessageToast.show("Please enter any filter criteria");
		}
	},
	onChange : function(evt) {
		var searchIndex = -1;
		var table = this.getView().byId("qmmRep");
		var data = table.getModel().getData();
		var listIndex = table.indexOfItem(evt.getSource().getParent());
		if (!(this["changedRows"])) {
			this["changedRows"] = [];
			this["changedRows"].push(data[listIndex]);
		} else {
			var crows = this["changedRows"];
			for (var i = 0; i < crows.length; i++) {
				if (crows[i].Pernr == data[listIndex].Pernr
						&& crows[i].Reinr == data[listIndex].Reinr
						&& crows[i].Trvky == data[listIndex].Trvky
						&& crows[i].Modid == data[listIndex].Modid) {
					searchIndex = i;
					break;
				}
			}
			if (searchIndex != -1) {
				this["changedRows"][searchIndex] = data[listIndex];
			} else {
				this["changedRows"].push(data[listIndex]);
			}
		}
	},
	// /UCD1KOR Satrt
	onSelectQmmReport : function() {
		let selectedReport = this.getView().byId("idQmmReportSelect").getSelectedIndex();
		let visibleColumns = [ "idQmmEmpNo", "idQmmEmpName", "idQmmTpNo",
				  "idQmmReceivedatCob", "txtInidt",
				"idQmmPostedOn", "idQmmReimbursedOn", "idQmmLeadTime",
				"txtLtime", "idTrstQmmType", "idQmmReceivedOn",
				"idQmmMailForex", "idQmmEnhncRec", "idQmmIntlLeadTime",
				"txtLtime", "idQmmSlaCompliace", "txtScndt",
				"idQmmTrvlSetAckDate", "idQmmReviewbyTRST", "idQmmApprbyTRST",
				"idQmmSentForex", "idQmmINRrec", "idQmmEnhncDate",
				"idQmmTaxables", "idQmmFnlMngrApr", "idQmmEmpSubdate",
				"idQmmBudgetCode", "idQmmWBS", "idQmmCostcenter",
				"idQmmFundCenter", "idQmmFund", "idQmmBU", "idQmmSection",
				"idQmmDepartment", "idQmmGroup", "idQmmTravellocation",
				"idQmmTravelCountry", "idQmmDays", "idQmmEndDate",
				"idQmmStartDate"

		];
		for (var i = 0; i < visibleColumns.length; i++) {
			this.getView().byId(visibleColumns[i]).setVisible(false);
		}

		if (selectedReport === 0) {
			let visibleColumns = [ "idQmmEmpNo", "idQmmEmpName", "idQmmTpNo",
					 "txtInidt", "idQmmPostedOn",
					"idQmmReimbursedOn", "idQmmIntlLeadTime", "txtLtime",
					"idQmmSlaCompliace" ];
			for (var i = 0; i < visibleColumns.length; i++) {
				this.getView().byId(visibleColumns[i]).setVisible(true);
			}
		} else if (selectedReport === 1) {

			let visibleColumns = [ "idQmmEmpNo", "idQmmEmpName", "idQmmTpNo",
					 "idQmmReceivedatCob", "idQmmPostedOn",
					"idQmmReimbursedOn", "idQmmIntlLeadTime", "txtLtime",
					"idQmmSlaCompliace" ];
			for (var i = 0; i < visibleColumns.length; i++) {
				this.getView().byId(visibleColumns[i]).setVisible(true);
			}
		} else if (selectedReport === 2) {

			let visibleColumns = [ "idQmmEmpNo", "idQmmEmpName", "idQmmTpNo",
					"idTrstQmmType", "idQmmReceivedOn", "idQmmMailForex",
					"idQmmEnhncRec", "idQmmPostedOn", "idQmmIntlLeadTime",
					"idQmmLeadTime", "txtLtime" ];
			for (var i = 0; i < visibleColumns.length; i++) {
				this.getView().byId(visibleColumns[i]).setVisible(true);
			}

		}
	},
	onSave : function() {
		var oData = {};
		oData["TrstQmmSla"] = this["changedRows"];
		// oData["TrstQmmSla"][0]["Accdt"] = oData["TrstQmmSla"][0]["Scndt"]
		// for(var i=0;i<oData.TrstQmmSla.length;i++){
		// for(var prop in oData.TrstQmmSla[i]){
		// if(prop=="Scndt"||prop=="Accdt"||prop=="Paydt"){
		// var date = oData.TrstQmmSla[i][prop];
		// if(date){
		// if(date instanceof Date){
		// oData.TrstQmmSla[i][prop] = ""+date.getFullYear()+"-"+
		// (date.getMonth() + 1)+"-"+date.getDate()+"T00:00:00";
		// }else{
		// oData.TrstQmmSla[i][prop] = ""+date.substring(0,4)+"-"+
		// (date.substring(4,6))+"-"+date.substring(6,8)+"T00:00:00";
		// }
		// }
		// }
		// }
		// }
		//		
		if (oData["TrstQmmSla"]) {
			oComponent.getModel().create("TrstQmmSlaRepSet", oData, null,
					jQuery.proxy(function(oData, response) {
						sap.m.MessageToast.show("Updated Successfully", {
							duration : 10000,
							closeOnBrowserNavigation : false
						});
						this.onSubmit();
					}, this), function(error) {
						sap.m.MessageToast.show("Internal Server Error");
					}, true);
		} else {
			sap.m.MessageToast.show("No changes to save");
		}
	},
	onExport : function() {
		var table = this.getView().byId("qmmRep");
		var model = table.getModel();
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
		if (this["Report"] == "QMM") {
			oExport.saveFile("QMM-SLA Compliance").always(function() {
				this.destroy();
			});
		} else {
			oExport.saveFile("OEI Report").always(function() {
				this.destroy();
			});
		}
	},
	getExcelColumns : function(table) {
		var columns = [];
		var table;
		// table = this.getView().byId("idItemTable");
		var cells = table.getBindingInfo("items").template.getCells();
		var cols = table.getColumns();
		for (var i = 0; i < cols.length; i++) {
			if (cols[i].getVisible()) {
				if (cells[i].getBindingInfo("text")
						|| cells[i].getBindingInfo("value")
						|| cells[i].getBindingInfo("dateValue")) {
					var path = cells[i].getBindingInfo("text") ? cells[i]
							.getBindingInfo("text").parts[0].path : (cells[i]
							.getBindingInfo("value") ? cells[i]
							.getBindingInfo("value").parts[0].path : cells[i]
							.getBindingInfo("dateValue").parts[0].path);
					// var path = cells[i].getBindingInfo("text").parts[0].path;
					var text = cols[i].getId();
					if (text) {
						var id = text.split("--");
						if (id[1] == "txtInidt" || id[1] == "txtScndt"
								|| id[1] == "txtPaydt" || id[1] == "txtAccdt"
								|| id[1] == "txtClsdt") {
							columns.push({
								name : cols[i].getHeader().getText(),
								template : {
									content : {
										// parts:[
										// {path:path,
										// type:new
										// sap.ui.model.type.Date({oFormatOptions:{style:'short'}})}],
										path : path,
										formatter : function(value) {
											if (value != "" && value != null
													&& value != undefined) {
												var yyyy = value
														.substring(0, 4);
												var MM = value.substring(4, 6);
												var dd = value.substring(6, 8);
												var dateStr = dd + "-" + MM
														+ "-" + yyyy;
												return dateStr;
											}
										}
									}
								}
							});
						} else {
							columns.push({
								name : cols[i].getHeader().getText(),
								template : {
									content : "{" + path + "}"
								}
							});
						}
					} else {
						columns.push({
							name : cols[i].getHeader().getText(),
							template : {
								content : "{" + path + "}"
							}
						});
					}
				}
			}
		}
		return columns;
	},
	
	 /*
		 * ######################## onPress Excel download button
		 * ##########################
		 */
    excelDownload: function() {
        var table = this.getView().byId("qmmRep");
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
        if (this["Report"] == "QMM") {
        	saveAs(blob, "QMM-SLA Report.xlsx");
        }
        else{
        	saveAs(blob, "OEI Report.xlsx");
        }
        
    },
    /*
	 * ################## Table preparation for XlSX file download
	 * #######################
	 */
    prepareTableData: function() {
        var table = this.getView().byId("qmmRep");
        var allColumns = table.getColumns();
        var columns = [];
        for(var i=0;i<allColumns.length;i++){
        	if(allColumns[i].getVisible()){
        		columns.push(allColumns[i]) 
            }
        }
        var aBuffer = [];
        aBuffer.push("<html><head><style>td{font-weight:900;}</style></head><body><table>");
        aBuffer.push("<tr>");
        $.each(columns, function(index, column) {
            aBuffer.push("<td width='450px' style='font-weight:bold'><div><b>" + column.mAggregations.header.getText() + "</b></div></td>");
        });
        aBuffer.push("</tr>");
        let selectedReport = this.getView().byId("idQmmReportSelect").getSelectedIndex();
        if(this["Report"] == "OEI"){
        	selectedReport = "OEI"
        }
        for (var i = 0; i < table.getItems().length; i++) {
            aBuffer.push("<tr>");
            for (var j = 0; j < table.getItems()[i].getCells().length; j++) {
                var property = table.getItems()[i].getCells()[j].mProperties.text;
                try{
                	var check = table.getItems()[i].getCells()[j].mProperties.wrapping;
                	if(j!==1 && check == true){
                		var date = table.getItems()[i].getCells()[j].mProperties.text;
                		if(date.split("/")[1] != undefined){
                			property = date.split("/")[1]+"/"+date.split("/")[0]+"/"+date.split("/")[2];
                		}
                		else{
                			property = "NA"
                		}
                	}
                }catch(err){}
                if(property == undefined){
                	try{
                		property = table.getItems()[i].getCells()[44].mProperties.value;
                		property = (property == undefined || property == "") ? "NA" : property.substring(4,6) +"/"+property.substring(6,8) +"/"+property.substring(0,4);
                	}catch(err){
                		property = table.getItems()[i].getCells()[36].mProperties.value;
                		property = (property == undefined || property == "") ? "NA" : property.substring(4,6) +"/"+property.substring(6,8) +"/"+property.substring(0,4);
                	}
                	
                }
                if(property !=="notRequired" && selectedReport === 0 && (j==0 || j==1 || j==2  || j==28 || j==29 || j==30 || j==31 || j==33 || j==34) ){
                	aBuffer.push("<td width='450px'>" + property + "</td>");
                }
                else if(property !=="notRequired" && selectedReport === 1 && (j==0 || j==1 || j==2 || j==21|| j==24 || j==29|| j==30 || j==31 || j==33 || j==34) ){
                	aBuffer.push("<td width='450px'>" + property + "</td>");
                }
                else if(property !=="notRequired" && selectedReport === 2 && (j==0 || j==1 || j==2 || j==3 || j==24 || j==25 || j==26 || j==29 || j==31 || j==32 || j==33) ){
                	aBuffer.push("<td width='450px'>" + property + "</td>");
                }
                else if(property !=="notRequired" && selectedReport === "OEI" && (j==0 || j==1 || j==2 || j==3 || j==5 ||j==6|| j==7||j==8|| j==9|| j==10||j==11||j==12||j==13||j==14
                		||j == 15 ||j == 16 ||j == 17 ||j == 18 ||j == 19|| j==20||j == 36 ||j == 37 ||(j>=38 && j<46) ) ){
                	aBuffer.push("<td width='450px'>" + property + "</td>");
                }
                //aBuffer.push("<td width='450px'>" + property + "</td>");
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
 * @memberOf e2etm.view.TrstQmmReport
 */
// onBeforeRendering: function() {
//
// },
/**
 * Called when the View has been rendered (so its HTML is part of the document).
 * Post-rendering manipulations of the HTML could be done here. This hook is the
 * same one that SAPUI5 controls get after being rendered.
 * 
 * @memberOf e2etm.view.TrstQmmReport
 */
// onAfterRendering: function() {
//
// },
/**
 * Called when the Controller is destroyed. Use this one to free resources and
 * finalize activities.
 * 
 * @memberOf e2etm.view.TrstQmmReport
 */
// onExit: function() {
//
// }
});