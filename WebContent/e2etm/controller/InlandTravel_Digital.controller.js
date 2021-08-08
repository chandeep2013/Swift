jQuery.sap.require("sap.ui.project.e2etm.util.Formatter");
jQuery.sap.require("sap.ui.core.util.Export");
jQuery.sap.require("sap.ui.core.util.ExportType");
jQuery.sap.require("sap.ui.core.util.ExportTypeCSV");
jQuery.sap.require("sap.m.Dialog");
jQuery.sap.require("sap.m.TablePersoController");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.ui.project.e2etm.util.StaticUtility");
var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);

sap.ui.controller("sap.ui.project.e2etm.controller.InlandTravel_Digital", {
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
		oModel.setDefaultCountMode(sap.ui.model.odata.CountMode.None);
		this.getView().setModel(oModel);
		//Commented
		/*var html = this.getView().byId("html");
		html.setContent("<div><ul><li>Inland Travel – Digital which are processed for Settlement and process is completed</li>" +
				
				"<li>In process-Travel plans which are submitted for settlement and under process of completion</li></ul></div>")*/
		
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
			table : this.getView().byId("InlandTravelReport"),
			persoService : DemoPersoService,
		}).activate();
		
	},
	getReport:function(){
		var that = this;
		var StartFrom = that.getView().byId("idFromDateRange");
		var StartTo = that.getView().byId("idFromDateRange1");
		var EndFrom = that.getView().byId("idToDateRange");
		var EndTo = that.getView().byId("idToDateRange1");
		///########################### UCD1KOR 24/09/2020 ######################/////////
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
		
		if(StartFrom && StartTo && (StartFrom.getDateValue() > StartTo.getDateValue())){
			var Error = "Start date should be greater than end date"
		}
		else if(EndFrom && EndTo && (EndFrom.getDateValue() > EndTo.getDateValue())){
			var Error = "Start date should be greater than end date"
		}
		else {
			var Error = "";
		}
	
		if(Error == ""){
			sap.ui.project.e2etm.util.StaticUtility.setBusy(true, oInlandTravel);
			var AccomDigitized_url = sServiceUrl + "AccomDigitizedReport/?FromStartDate='"+dateValue1+"'&ToStartDate='"+dateValue2+"'&FromEndDate='"+dateValue3+"'&ToEndDate='"+dateValue4+"'";
			var get = $.ajax({
				cache: false,
				url: AccomDigitized_url, 
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
	
	onPersoButtonPressed : function(evt) {
		this.table.openDialog();
	},
	onUpdateFinished:function(evt){
		this.getView().byId("lblCount").setText("Details("+evt.getParameter("actual")+")");
	},
	
	onChange : function(evt) {
		var key = evt.getSource().getSelectedKey();
		filter = new sap.ui.model.Filter("Indicator", "EQ", key);
		this.getView().byId("InlandTravelReport").getBinding("items").aFilters = [];
		this.getView().byId("InlandTravelReport").getBinding("items").filter(filter);
	},
	 excelDownload: function() {
	        var table = this.getView().byId("InlandTravelReport");
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
	        saveAs(blob, "Inland Travel – Digital Report.xlsx");
	    },
	    /*################## Table preparation for XlSX file download #######################*/
	    prepareTableData: function() {
	        var table = this.getView().byId("InlandTravelReport");
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