jQuery.sap.require("sap.ui.project.e2etm.util.Formatter");
jQuery.sap.require("sap.ui.core.util.Export");
jQuery.sap.require("sap.ui.core.util.ExportType");
jQuery.sap.require("sap.ui.core.util.ExportTypeCSV");
jQuery.sap.require("sap.m.Dialog");
jQuery.sap.require("sap.m.TablePersoController");
jQuery.sap.require("sap.m.MessageBox");
var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);

sap.ui.controller("sap.ui.project.e2etm.controller.SetlUsetlReport", {
	/**
	 * Called when a controller is instantiated and its View controls (if
	 * available) are already created. Can be used to modify the View before it
	 * is displayed, to bind event handlers and do other one-time
	 * initialization.
	 * 
	 * @memberOf e2etm.view.SetlUsetlReport
	 */
	onInit : function() {
		sap.ui.core.routing.Router.getRouter("MyRouter").attachRoutePatternMatched(this.onRouteMatched, this);
	},
	onRouteMatched:function(oEvent){
		var oThis = this;
		// var filter = new sap.ui.model.Filter("Indicator","EQ","A");
		// this.getView().byId("setlusetlrep").getBinding("items").filter([filter]);
		var param = oEvent.getParameter("arguments").role;
		this.LoggedInRole = Base64.decode(param);
		if(this.LoggedInRole ==="GRM"){
			this.getView().byId("HideSection").setVisible(true);
			//this.onServiceCall();
			this.getView().byId("idIndirectreportees").setVisible(true);
		}
		else{
			this.getView().byId("HideSection").setVisible(true);
			this.getView().byId("idIndirectreportees").setVisible(false);
		}
		
		
		
		/*oModel.setDefaultCountMode(sap.ui.model.odata.CountMode.None);
		this.getView().setModel(oModel);*/
		
		var html = this.getView().byId("html");
		html.setContent("<div><ul><li>Settled-Travel plans which are processed for Settlement and process is completed</li>" +
				"<li>Unsettled-Travel plans which are yet to be initiated for settlement</li>" +
				"<li>In process-Travel plans which are submitted for settlement and under process of completion</li></ul></div>")
		
		
		var DemoPersoService = {
			oData : {
				_persoSchemaVersion : "1.0",
				aColumns : []
			},
			getPersData : function() {
				var oDeferred = new jQuery.Deferred();
				if (!this._oBundle) {
					this._oBundle = this.oData;
				}
				var oBundle = this._oBundle;
				oDeferred.resolve(oBundle);
				return oDeferred.promise();
			},
			setPersData : function(oBundle) {
				var oDeferred = new jQuery.Deferred();
				this._oBundle = oBundle;
				oDeferred.resolve();
				return oDeferred.promise();
			},
			resetPersData : function() {
				var oDeferred = new jQuery.Deferred();
				var oInitialData = {
					_persoSchemaVersion : "1.0",
					aColumns : []
				};
				// set personalization
				this._oBundle = oInitialData;
				oDeferred.resolve();
				return oDeferred.promise();
			},
		// this caption callback will modify the TablePersoDialog' entry for the
		// 'Weight' column
		// to 'Weight (Important!)', but will leave all other column names as
		// they are.
		// getCaption : function (oColumn) {
		// if (oColumn.getHeader() && oColumn.getHeader().getText) {
		// if (oColumn.getHeader().getText() === "Weight") {
		// return "Weight (Important!)";
		// }
		// }
		// return null;
		// },
		//				
		// getGroup : function(oColumn) {
		// if( oColumn.getId().indexOf('productCol') != -1 ||
		// oColumn.getId().indexOf('supplierCol') != -1) {
		// return "Primary Group";
		// }
		// return "Secondary Group";
		// }
		};
		this.table = new sap.m.TablePersoController({
			table : this.getView().byId("setlusetlrep"),
			persoService : DemoPersoService,
		}).activate();
	
	},
	///////################## UCD1KOR Aug 10th #################//////////////
	onServiceCall:function(){
		var oThis= this;
		var dateStartFrom = this.getView().byId("idFromDateRange_Settle").getValue();
		var dateStartTo = this.getView().byId("idFromDateRange1_Settle").getValue();
		var Indirectreportees = this.getView().byId("idIndirectreportees").getSelected();
		if(Indirectreportees == true){
			var IndirectMgr  = 'X';
		}
		else{
			IndirectMgr  = '';
		}
		if(dateStartFrom ==="" || dateStartTo ===""){
			sap.m.MessageBox.error("Enter Mandataory Fields");
			return;
		}
		if(dateStartFrom > dateStartTo){
			sap.m.MessageBox.error("Start Date should be Less than End Date");
			return;
		}
		
		this.getView().byId("setlusetlrep").setBusy(true);
		var report = new sap.ui.model.json.JSONModel();
		
       var ReportsURL = "TrstSetlUsetlSet?$filter=LogRole+eq+'"+this.LoggedInRole+"'+and+StartFrom+eq+'"+dateStartFrom+"'+and+StartTo+eq+'"+dateStartTo+"'+and+IndirectMgr+eq+'"+IndirectMgr+"'";
    	oDataModel.read(ReportsURL, null, null, true, function(oData, response) {
    		for(var i=0;i<oData.results.length;i++){
    			if(oData.results[i].Addfund !== undefined && oData.results[i].Addfund !=""){
    				try{
    					oData.results[i].Addfund= oData.results[i].Addfund.split("-")[0];
    				}catch(err){
    					oData.results[i].Addfund = "NA";
    				}
    			}
    			else{
    				oData.results[i].Addfund = "NA";
    			}
    		}
    		report.setData(oData);
    		if(oData.results.length === 0){
    			sap.m.MessageToast.show("No Records Found");
    		}
    		if(oData.results.length >200 ){
    			sap.m.MessageBox.information(
    					"The report may take more time than anticipated. Would you like to continue?", {
    						icon: sap.m.MessageBox.Icon.INFORMATION,
    						title: "INFORMATION",
    						actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
    						emphasizedAction: sap.m.MessageBox.Action.YES,
    						onClose: function (oAction) { 
    							if(oAction == "YES"){
    								report.setSizeLimit(oData.results.length);
    							}
    							else{
    								report.setSizeLimit(200);
    							}
    						}
    					}
    				);
    		}
    		else{
    			report.setSizeLimit(oData.results.length);
    		}
    		oThis.getView().setModel(report,"report");
    		oThis.getView().byId("setlusetlrep").setBusy(false);
		}, function(error) {
			sap.m.MessageToast.show("Internal Server Error");
			oThis.getView().byId("setlusetlrep").setBusy(false);
		});
	},
	onPersoButtonPressed : function(evt) {
		this.table.openDialog();
	},
	onUpdateFinished:function(evt){
		this.getView().byId("lblCount").setText("Details("+evt.getParameter("actual")+")");
	},
	
	onChange : function(evt) {
		var key = evt.getSource().getSelectedKey();
		/*filter = new sap.ui.model.Filter("Indicator", "EQ", key);
		this.getView().byId("setlusetlrep").getBinding("items").aFilters = [];
		this.getView().byId("setlusetlrep").getBinding("items").filter(filter);*/
			if(key === "S"){
				var filters = [];
				var StatusVal = "C";
				var Status = new sap.ui.model.Filter("Status",
					sap.ui.model.FilterOperator.Contains, StatusVal);
				filters.push(Status);
				var TlockVal ="X";
				var Tlock = new sap.ui.model.Filter("Tlock",
						sap.ui.model.FilterOperator.Contains, TlockVal);
					filters.push(Tlock);
				var oBinding = this.getView().byId("setlusetlrep").getBinding("items");
				oBinding.filter([Status,Tlock],"Appliation");
			}
			else if(key === "A"){
				var oBinding = this.getView().byId("setlusetlrep").getBinding("items");
				oBinding.filter([],"Appliation");
			}
			else if(key === "U"){
				var filters = [];
				var ActionVal = "No action";
				var Action = new sap.ui.model.Filter("action",
					sap.ui.model.FilterOperator.Contains, ActionVal);
				filters.push(Action);
				var RoleVal = "No role";
				var Role = new sap.ui.model.Filter("role",
						sap.ui.model.FilterOperator.Contains, RoleVal);
					filters.push(Role);
				var oBinding = this.getView().byId("setlusetlrep").getBinding("items");
				oBinding.filter([Action,Role],"Appliation");
			}
			else if(key === "I"){
				var filters = [];
				var ActionVal = "No action";
				var Action = new sap.ui.model.Filter("action",
					sap.ui.model.FilterOperator.NE, ActionVal);
				filters.push(Action);
				var RoleVal = "No role";
				var Role = new sap.ui.model.Filter("role",
						sap.ui.model.FilterOperator.NE, RoleVal);
					filters.push(Role);
				var oBinding = this.getView().byId("setlusetlrep").getBinding("items");
				oBinding.filter([Action,Role],"Appliation");
			}
		},
	onExport : function() {
		//commented by uik1kor on 01/09/2020
		/*var table = this.getView().byId("setlusetlrep");
		var model = this.getView().getModel();
		model.setDefaultCountMode(sap.ui.model.odata.CountMode.None);
		var sFilterParams = table.getBinding("items").sFilterParams;
		var columns = this.getExcelColumns(table);
		/*UCD1KOR 10 Jan 2020 Mssage toast added*/
		/*sap.m.MessageToast.show("Report is preparing be patient....!!");
		oExport = new sap.ui.core.util.Export({
			exportType : new sap.ui.core.util.ExportTypeCSV({
				separatorChar : ","
			}),
			models : model,
			rows : {
				path : "/TrstSetlUsetlSet?$top=0&" + sFilterParams
			},
			columns : columns
		});
		oExport.saveFile("Settled/Unsetteled Report").always(function() {
			this.destroy();
		});*/
		//Added by UIK1KOR on 01/09/2020 to download report
		var table = this.getView().byId("setlusetlrep");
        var aData = this.getView().getModel("report");
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
        saveAs(blob, "Settled/Unsetteled Report.xlsx");
	},
	prepareTableData: function() {
        var table = this.getView().byId("setlusetlrep");
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
                if(j !==1 && j !==8 && property == "NA" && table.getItems()[i].getCells()[j].mProperties.wrapping == true){
                	var check = property.split("/");
                	val = check[1]+"/"+check[0]+"/"+check[2];
                	var date = check[1] == undefined ? "NA": val;
                	aBuffer.push("<td width='450px'>" + date + "</td>");
                }else{
                	aBuffer.push("<td width='450px'>" + property + "</td>");
                }
                
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
    //end of change by UIK1KOR on 01/09/2020
    
	getExcelColumns : function(table) {
		var columns = [];
		var table;
		// table = this.getView().byId("idItemTable");
		var cells = table.getBindingInfo("items").template.getCells();
		var cols = table.getColumns();
		for ( var i = 0; i < cols.length; i++) {
			if (cells[i].getBindingInfo("text")) {
				var path = cells[i].getBindingInfo("text").parts[0].path;
				// var path = cells[i].getBindingInfo("text").parts[0].path;
				var text = cols[i].getId();
				if (text) {
					var id = text.split("--");
					if (id[1] == "txtDate1" || id[1] == "txtDate2") {
						columns.push({
							name : cols[i].getHeader().getText(),
							template : {
								content : {
									// parts:[
									// {path:path,
									// type:new
									// sap.ui.model.type.Date({oFormatOptions:{style:'short'}})}],
									path : path,
									type : new sap.ui.model.type.DateTime({
										  pattern:'dd.MM.yyyy'
									})
								}
							}
						});
					}else if(id[1]=="txtPacmp"||id[1]=="txtReim"||id[1]=="txtCost"){
						columns.push({
							name : cols[i].getHeader().getText(),
							template : {
								content : {
									// parts:[
									// {path:path,
									// type:new
									// sap.ui.model.type.Date({oFormatOptions:{style:'short'}})}],
									path : path,
									type : new sap.ui.model.type.Float({
										oFormatOptions: {
							                maxFractionDigits: 2,
							                groupingEnabled: true, 
							                groupingSeparator: ','
							                	}
									})
								}
							}
						});
					}else {
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
		return columns;
	},
	onExportCSV: sap.m.Table.prototype.exportData || function(oEvent) {

            var ModelTodownload = this.getView().getModel("report"),
                columnsToDownload = [{
                        name: "Employee No",
                        template: {
                            content: {
                                path: "Pernr"
                            }
                        }
                    }, {
                        name: "Employee Name",
                        template: {
                            content: {
                                path: "Ename",
                                formatter: function (name) {
                            		if(name=="" || name== undefined){
                            			return "NA";
                            		}
                            		else{
                            			return name.substr(0,1)+name.substr(1).toLocaleLowerCase();

                            		}
                            	}
                            }
                        }
                    },
                    {
                        name: "Business Unit",
                        template: {
                            content: {
                                path: "zbunit"
                            }
                        }
                    },
                    {
                        name: "Section",
                        template: {
                            content: {
                                path: "zsection"
                            }
                        }
                    },
                    {
                        name: "Department",
                        template: {
                            content: {
                                path: "zdept"
                            }
                        }
                    },
                    {
                        name: "Level",
                        template: {
                            content: {
                                path: "Zlevel"
                            }
                        }
                    },
                    {
                        name: "Travel Plan",
                        template: {
                            content: {
                                path: "Reinr"
                            }
                        }
                    },
                    {
                        name: "Destination",
                        template: {
                            content: {
                                path: "Zort1"
                            }
                        }
                    },
                    {
                        name: "Country",
                        template: {
                            content: {
                                path: "Zland"
                            }
                        }
                    },
                    {
                        name: "Trip Type",
                        template: {
                            content: {
                                path: "Trptyp"
                            }
                        }
                    },
                    {
                        name: "Reason",
                        template: {
                            content: {
                                path: "Kunde"
                            }
                        }
                    },
                    {
                        name: "Status",
                        template: {
                            content: {
                                path: "Status",
                                formatter: function (status) {
                                	if(status == "C"){
                            			return "Closed"
                            		}
                            		else{
                            			return "Open"
                            		}
                                }
                            }
                        }
                    },
                    {
                        name: "Company Code",
                        template: {
                            content: {
                                path: "Addccod"
                            }
                        }
                    },
                    {
                        name: "Budget Code",
                        template: {
                            content: {
                                path: "Addfipo"
                            }
                        }
                    },
                    {
                        name: "Cost Center",
                        template: {
                            content: {
                                path: "Addcost"
                            }
                        }
                    },
                    {
                        name: "WBS Element",
                        template: {
                            content: {
                                path: "ADDFIPOS"
                            }
                        }
                    },
                    {
                        name: "Fund Center",
                        template: {
                            content: {
                                path: "Addfctr"
                            }
                        }
                    },
                    {
                        name: "Fund",
                        template: {
                            content: {
                                path: "Addfund"
                            }
                        }
                    },
                    {
                        name: "Duration",
                        template: {
                            content: {
                                path: "Tripdur"
                            }
                        }
                    },{
                        name: "Travel Settlement Status",
                        template: {
                            content: {
                            	parts: ['action','role'],
                                formatter: function (action,role) {
                                	if(action == null || role == null ){
                            			return "Not Available";
                            		}
                            		else if(action !== undefined && role !== undefined){
                            			action = action.trim();
                            			role = role.trim();
                            			if(role == "Travel Settleme"){
                            				role ="Travel Settlement"
                            			}
                            		}
                            		
                            		if(action =="No action" && role == "No role"){
                            			return "Yet to Initiate"; //"Not Available";
                            		}
                            		else{
                            			return action +" by "+ role;
                            		}
        						}
                            }
                        }
                    },
                    {
                        name: "Trip Type",
                        template: {
                            content: {
                                path: "Kunde"
                            }
                        }
                    },{
                        name: "Recieved date(MM/DD/YYYY)",
                        template: {
                            content: {
                                path: "recdt",
                                formatter: function (recvdt) {
                                	if(recvdt == "    -  -  " || recvdt == undefined || recvdt == "0000-00-00"){
                            			return "NA";
                            		}
                            		else{
                            			var date = recvdt.split("-")[1]+"/"+recvdt.split("-")[2]+"/"+recvdt.split("-")[0]
                            			return date;
                            		}
                                }
                            }
                        }
                    },{
                        name: "Remarks",
                        template: {
                            content: {
                                path: "remarks"
                            }
                        }
                    },{
                        name: "Emp Group",
                        template: {
                            content: {
                                path: "persg"
                            }
                        }
                    },
                    {
                        name: "Begins On(MM/DD/YYYY)",
                        template: {
                            content: {
                                path: "Datv1",
                                formatter: function (val) {
                                	if(val){
                            			var data = val.split("T")[0];
                            			if(data){
                            				if(data.split("-")){
                            					var date =data.split("-");
                            					return date[1]+"/"+date[2]+"/"+date[0];
                            				}else{
                            					return "NA";
                            				}
                            			}
                            			else{
                            				return "NA";
                            			}

                            		}
                                }
                            }
                        }
                    },{
                        name: "Ends On(MM/DD/YYYY)",
                        template: {
                            content: {
                                path: "Datb1",
                                formatter: function (val) {
                                	if(val){
                            			var data = val.split("T")[0];
                            			if(data){
                            				if(data.split("-")){
                            					var date =data.split("-");
                            					return date[1]+"/"+date[2]+"/"+date[0];
                            				}else{
                            					return "NA";
                            				}
                            			}
                            			else{
                            				return "NA";
                            			}

                            		}
                                }
                            }
                        }
                    },{
                        name: "Currency",
                        template: {
                            content: {
                                path: "Currency"
                            }
                        }
                    },{
                        name: "Reimbursement",
                        template: {
                            content: {
                                path: "SumReimbu"
                            }
                        }
                    },{
                        name: "Paid by Company",
                        template: {
                            content: {
                                path: "SumPaidco"
                            }
                        }
                    },{
                        name: "Total Cost",
                        template: {
                            content: {
                                path: "TripTotal"
                            }
                        }
                    },
                    {
                        name: "Email Id",
                        template: {
                            content: {
                                path: "USRID_LONG",
                                formatter: function (name) {
                            		if(name=="" || name== undefined){
                            			return "NA";
                            		}
                            		else{
                            			return name.substr(0,1)+name.substr(1).toLocaleLowerCase();

                            		}
                            	}
                            }
                        }
                    },
                    {
                        name: "Year",
                        template: {
                            content: {
                                path: "recdt"
                            }
                        }
                    },{
                        name: "Employee status",
                        template: {
                            content: {
                                path: "EmpStatus"
                            }
                        }
                    },
                    {
                        name: "Advance",
                        template: {
                            content: {
                                path: "Advance"
                            }
                        }
                    },
                    {
                        name: "Responsible",
                        template: {
                            content: {
                                path: "Responsible"
                            }
                        }
                    }
                ]

        

        //////////////////////////////Download CSV File /////////////////////////////////	
        var oExport = new sap.ui.core.util.Export({
            // Type that will be used to generate the content. Own ExportType's can be created to support other formats
            exportType: new sap.ui.core.util.ExportTypeCSV({
                //	separatorChar : ";",
                charset: "utf-8",
            }),
            // Pass in the model created above
            models: ModelTodownload,
            // binding information for the rows aggregation
            rows: {
                path: "/results"
            },
            // column definitions with column name and binding info for the content
            columns: columnsToDownload
        });
        oExport.generate().done(function(sContent) {
            //console.log(sContent);
        }).always(function() {
            this.destroy();
        });
        // download exported file
        oExport.saveFile("Settled/Unsettled Travel Report").catch(function(oError) {
            console.log("oError", oError);
            sap.m.MessageToast.show("Error when downloading data. Browser might not be supported!\n\n" + oError);
        }).then(function() {
            oExport.destroy();
        });
    },
	
/**
 * Similar to onAfterRendering, but this hook is invoked before the controller's
 * View is re-rendered (NOT before the first rendering! onInit() is used for
 * that one!).
 * 
 * @memberOf e2etm.view.SetlUsetlReport
 */
// onBeforeRendering: function() {
//
// },
/**
 * Called when the View has been rendered (so its HTML is part of the document).
 * Post-rendering manipulations of the HTML could be done here. This hook is the
 * same one that SAPUI5 controls get after being rendered.
 * 
 * @memberOf e2etm.view.SetlUsetlReport
 */
// onAfterRendering: function() {
//
// },
/**
 * Called when the Controller is destroyed. Use this one to free resources and
 * finalize activities.
 * 
 * @memberOf e2etm.view.SetlUsetlReport
 */
// onExit: function() {
//
// }
});