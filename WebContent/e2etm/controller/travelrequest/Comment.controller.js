sap.ui.define([
	"sap/ui/project/e2etm/util/TCommonSrv"
], function(TCommonSrv) {
	"use strict";

	return sap.ui.controller("sap.ui.project.e2etm.controller.travelrequest.Comment", {
		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function() {

			}
			/*Handle when link clicked */
			,
		_onClickPolicy: function(oEvent) {
			var sUrl = "http://sgpvm070:8080/pkit/go/pelement.do?id=208178&type=Activity";
			window.open(sUrl, "_blank");
		}

	});
});