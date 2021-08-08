jQuery.sap.require("sap.ui.project.e2etm.util.Formatter");
jQuery.sap.require("sap.ui.core.util.Export");
jQuery.sap.require("sap.ui.core.util.ExportType");
jQuery.sap.require("sap.ui.core.util.ExportTypeCSV");
jQuery.sap.require("sap.m.Dialog");
jQuery.sap.require("sap.m.TablePersoController");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.ui.project.e2etm.util.StaticUtility");
var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);

sap.ui.controller("sap.ui.project.e2etm.controller.SettlementReport", {
	/**
	 * Called when a controller is instantiated and its View controls (if
	 * available) are already created. Can be used to modify the View before it
	 * is displayed, to bind event handlers and do other one-time
	 * initialization.
	 * 
	 * @memberOf e2etm.view.SetlUsetlReport
	 */
	onInit : function() {
		var that = this;
		oInlandTravel = this;
		//oModel.setDefaultCountMode(sap.ui.model.odata.CountMode.None);
		//this.getView().setModel(oModel);
		//Commented
		/*var html = this.getView().byId("html");
		html.setContent("<div><ul><li>Inland Travel � Digital which are processed for Settlement and process is completed</li>" +
				
				"<li>In process-Travel plans which are submitted for settlement and under process of completion</li></ul></div>")*/
		
//	     var oGlobal = sap.ui.getCore().getModel("global").getData();
//	        sap.ui.getCore().getModel("global").setData(oGlobal);
//	        var oModel = new sap.ui.model.json.JSONModel();
//	        oModel.setData(oGlobal.country);
//	        oModel.setSizeLimit(oGlobal.country.length);
//	        this.getView().setModel(oModel, "reports"); 
		
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
		
		};
		this.table = new sap.m.TablePersoController({
			table : this.getView().byId("SettlementReport"),
			persoService : DemoPersoService,
		}).activate();
		
	},
	getReport:function(){
		var that = this;
		var StartFrom = that.getView().byId("idFromDateRangeS");
		var EndFrom = that.getView().byId("idToDateRangeE");
		//added code uml6kor 2/3/2021
		//<!-- added by uml6kor 3/3/2021 for ctg report setl/unsetl chnages -->
		var Settle = this.getView().byId("idsettle").getSelectedKey();
		var TStartFrom = this.getView().byId("idSFromDateRange");
		var TStartTo = this.getView().byId("idSToDateRange");
		var TEndFrom = this.getView().byId("idEFromDateRange");
		var TEndTo = this.getView().byId("idEToDateRange");
		
		var trvValue = this.getView().byId("idTrvTyp").getSelectedKeys();//this.getView().byId("idTrvTyp").getSelectedKey();
		trvValue = trvValue.toString();
		var asgTyp = this.getView().byId("ipAsgtyp").getSelectedKeys();
		asgTyp = asgTyp.toString();
		
		var fund= this.getView().byId("idFund").getSelectedKeys().toString();
		if(Settle == 'S'){
			try{
				var dateValue1 = StartFrom.getDateValue().getFullYear()+""+(StartFrom.getDateValue().getMonth()+1 < 10 ? "0"+(StartFrom.getDateValue().getMonth()+1):StartFrom.getDateValue().getMonth()+1)+""+(StartFrom.getDateValue().getDate()<10 ? "0"+StartFrom.getDateValue().getDate():StartFrom.getDateValue().getDate());
				var Error = "";
			}
			catch(err){
//				var dateValue1 = "";
				var Error = "Please enter Start Date";
//				sap.m.MessageToast.show("Please enter Start Date");
			}
			try{
				var dateValue2 = EndFrom.getDateValue().getFullYear()+""+(EndFrom.getDateValue().getMonth()+1 < 10 ? "0"+(EndFrom.getDateValue().getMonth()+1):EndFrom.getDateValue().getMonth()+1)+""+(EndFrom.getDateValue().getDate()<10 ? "0"+EndFrom.getDateValue().getDate():EndFrom.getDateValue().getDate());
				var Error = "";
			}catch(err){
				//var dateValue3 = "";
				var Error = "Please enter End Date";
//				sap.m.MessageToast.show("Please enter Start Date");
			}
		
		}else{
			try{
				var dateValue1 = TStartFrom.getDateValue().getFullYear()+""+(TStartFrom.getDateValue().getMonth()+1 < 10 ? "0"+(TStartFrom.getDateValue().getMonth()+1):TStartFrom.getDateValue().getMonth()+1)+""+(TStartFrom.getDateValue().getDate()<10 ? "0"+TStartFrom.getDateValue().getDate():TStartFrom.getDateValue().getDate());
				var Error = "";
			}
			catch(err){
				var dateValue1 = "00000000";
		//		var Error = "Please enter Start Date";
//				sap.m.MessageToast.show("Please enter Start Date");
			}
			try{
				var dateValue2 = TStartTo.getDateValue().getFullYear()+""+(TStartTo.getDateValue().getMonth()+1 < 10 ? "0"+(TStartTo.getDateValue().getMonth()+1):TStartTo.getDateValue().getMonth()+1)+""+(TStartTo.getDateValue().getDate()<10 ? "0"+TStartTo.getDateValue().getDate():TStartTo.getDateValue().getDate());
				var Error = "";
			}
			catch(err){
				var dateValue2 = "00000000";
			//	var Error = "Please enter Start Date";
//				sap.m.MessageToast.show("Please enter Start Date");
			}try{
				var dateValue3 = TEndFrom.getDateValue().getFullYear()+""+(TEndFrom.getDateValue().getMonth()+1 < 10 ? "0"+(TEndFrom.getDateValue().getMonth()+1):TEndFrom.getDateValue().getMonth()+1)+""+(TEndFrom.getDateValue().getDate()<10 ? "0"+TEndFrom.getDateValue().getDate():TEndFrom.getDateValue().getDate());
				var Error = "";
			}catch(err){
				var dateValue3 = "00000000";
				//var Error = "Please enter End Date";
//				sap.m.MessageToast.show("Please enter Start Date");
			}
			try{
				var dateValue4 = TEndTo.getDateValue().getFullYear()+""+(TEndTo.getDateValue().getMonth()+1 < 10 ? "0"+(TEndTo.getDateValue().getMonth()+1):TEndTo.getDateValue().getMonth()+1)+""+(TEndTo.getDateValue().getDate()<10 ? "0"+TEndTo.getDateValue().getDate():TEndTo.getDateValue().getDate());
				var Error = "";
			}catch(err){
				var dateValue4 = "00000000";
				//var Error = "Please enter End Date";
//				sap.m.MessageToast.show("Please enter Start Date");
			}
		
		}
			
		if(TStartFrom && TStartTo && (TStartFrom.getDateValue() > TStartTo.getDateValue())&&
				( TStartFrom.getDateValue()!=null && TStartTo.getDateValue() != null )){
			var Error = "From Start date should not be greater than to Start date";
		}
		else if(TEndFrom && TEndTo && (TEndFrom.getDateValue() > TEndTo.getDateValue())&&
				( TEndFrom.getDateValue()!=null && TEndTo.getDateValue() != null )){
			var Error = "From End date should not be greater than to end date";
		}
		else if(TStartFrom && TEndFrom && (TStartFrom.getDateValue() > TEndFrom.getDateValue())&&
				( TStartFrom.getDateValue()!=null && TEndFrom.getDateValue() != null )){
			var Error = "From Start date should not be greater than to from end date";
		}
		else if(TStartFrom && TEndTo && (TStartFrom.getDateValue() > TEndTo.getDateValue())&&
				( TStartFrom.getDateValue()!=null && TEndTo.getDateValue() != null )){
			var Error = "From Start date should be greater than to end date";
		}/*else if(TStartTo && TEndFrom && (TStartTo.getDateValue() > TEndFrom.getDateValue())&&
				( TEndFrom.getDateValue()!=null && TStartTo.getDateValue() != null )){
			var Error = "To Start date should not be greater than from end date";
		}
		else if(TStartTo && TEndTo && (TStartTo.getDateValue() > TEndTo.getDateValue())&&
				( TEndTo.getDateValue()!=null && TStartTo.getDateValue() != null )){
			var Error = "To start date should not be greater than to end date";
		}*/

		else {
			var Error = "";
		}
//		var Error = "";

//		<!-- added by uml6kor 3/3/2021 for ctg report setl/unsetl chnages url chnaged -->
		
		if(Error == ""){
			sap.ui.project.e2etm.util.StaticUtility.setBusy(true, oInlandTravel);
			var Trvstl_url = sServiceUrl + "TravelSettlementReport/?FromDate='"+dateValue1+"'&ToDate='"+dateValue2+
			"'&Fund='"+fund+"'&Settle='"+Settle+"'&Trvtyp='"+trvValue+"'&Asgtyp='"+asgTyp+"'&fsdate='"+dateValue1+
			"'&tsdate='"+dateValue2+"'&fedate='"+dateValue3+"'&tedate='"+dateValue4+"'";
			var get = $.ajax({
				cache: false,
				url: Trvstl_url, 
				type: "GET",
				async: true,
				dataType:'json',
			});
			var reinr_arr = '';
			get.done(function(result) {
				sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oInlandTravel);
				reinr_arr = result.d.results;	
				var reportsModel = new sap.ui.model.json.JSONModel();
				reportsModel.setData(reinr_arr);
				reportsModel.setSizeLimit(reinr_arr.length);
				if(reinr_arr.length <= 0 ){
					that.getView().byId("idExcelDownload").setVisible(false);
					sap.m.MessageToast.show("No data found");
				}
				else{
					that.getView().byId("idExcelDownload").setVisible(true);
				}
				that.getView().setModel(reportsModel,"reportsData");
			});
			get.fail(function(err) {
				sap.ui.project.e2etm.util.StaticUtility.setBusy(false, oInlandTravel);
				sap.m.MessageBox.error("We are not able to Porcess your request.Try After some time");
			});
		}
		else{
			sap.m.MessageBox.error(Error);
		}
		
	},
	
	onSetlButtonPressed : function(evt) {
		this.table.openDialog();
	},
	onUpdateFinished:function(evt){
		this.getView().byId("lblCount").setText("Details("+evt.getParameter("actual")+")");
	},
	
	onChange : function(evt) {
		var key = evt.getSource().getSelectedKey();
		filter = new sap.ui.model.Filter("Indicator", "EQ", key);
		this.getView().byId("SettlementReport").getBinding("items").aFilters = [];
		this.getView().byId("SettlementReport").getBinding("items").filter(filter);
	},
	 excelDownload: function() {
	        var table = this.getView().byId("SettlementReport");
	        var aData = this.getView().getModel("reportsData");
	        sap.m.MessageToast.show("Report is preparing be patient....!!");
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
	        saveAs(blob, "SettlementReport.xlsx");
	    },
	    /*################## Table preparation for XlSX file download #######################*/
	    prepareTableData: function() {
	        var table = this.getView().byId("SettlementReport");
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

//		<!-- added by uml6kor 3/3/2021 for ctg report setl/unsetl chnages start -->
	    onFilterAsg: function() {
	    	var trvValue = this.getView().byId("idTrvTyp").getSelectedKeys();
	    	if(trvValue.includes("DEPU") == true){//"DEPU"){
	    		this.getView().byId("ipAsgtyp").setVisible(true);
	    		this.getView().byId("lbAsgtyp").setVisible(true);
	    	}
	    	else
	    	{
	    		this.getView().byId("ipAsgtyp").setVisible(false);
	    		this.getView().byId("lbAsgtyp").setVisible(false);
	    	}
	    },
	    onChangeFilter:function(){
	    	var filterValue = this.getView().byId("idsettle").getSelectedKey();
		    	if(filterValue == 'S'){ //settled
		    		this.getView().byId("idfromSDateBox").setVisible(false);
		    		this.getView().byId("idfromEDateBox").setVisible(false);
		    		this.getView().byId("idfromDateBox").setVisible(true);
		    		this.getView().byId("idToDateBox").setVisible(true);
		    		
		    	}
		    	else{
		    		this.getView().byId("idfromSDateBox").setVisible(true);
		    		this.getView().byId("idfromEDateBox").setVisible(true);
		    		this.getView().byId("idfromDateBox").setVisible(false);
		    		this.getView().byId("idToDateBox").setVisible(false);
		    		
		    	}
	    }

//		<!-- added by uml6kor 3/3/2021 for ctg report setl/unsetl chnages end-->
/**
 * 
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