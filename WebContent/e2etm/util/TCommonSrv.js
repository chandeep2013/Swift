/*
Name: Common services for custom project
Author: TinhTD
Created Date: 11/2018
*/
jQuery.sap.require("sap.ui.project.e2etm.util.Formatter");
jQuery.sap.require("sap.m.MessageBox");

sap.ui.project.e2etm.util.TCommonSrv = {
	onInit: function() {

	},
	/* //call save project area function diffirent controller */
	_exEvtBus: function(sView, sFncName) {

		var oEventBus = sap.ui.getCore().getEventBus();
		oEventBus.publish(sView, sFncName, {});
	},
	/* Handle show message */
	_showMsgBox: function(sTtitle, sMsg, sType) {
			if (!sType) {
				sType = "ERROR";
			}
			sap.m.MessageBox.alert(
				sMsg, {
					icon: sap.m.MessageBox.Icon.sType,
					title: sTtitle
				}
			);
		}
		/* Handle show hide obj */
		,
	_handleShowHideObj: function(aId, bVisible, oThis, mThis) {
		var aIds = aId.split(",");
		if (aIds.length > 0) {
			for (var i = 0; i < aIds.length; i++) {
				var sId = aIds[i];
				var oObj = oThis.getView().byId(sId);
				if (oObj === undefined) {
					oObj = mThis.getView().byId(sId);
				}

				if (oObj) {
					oObj.setVisible(bVisible);
				}

			}
		}
	},
	/* Add passenger info*/
	buildPassengerRow: function(sDep, bReload) {
		var oRow = {
			ZZ_PSG_NAME: "Traveler 01",
			ZZ_TRVCAT: "BUSR",
			ZZ_ZSLFDPD: sDep,
			ZZ_ZSEAT: "",
			ZZ_ZMEAL: "",
			ZZ_MOBILE: "",
			ZZ_ENABLED: false,
			ZZ_VISIBLE: true,
			ZZ_EXPANDED: true,
			ZZ_TRV_STATUS: true,
			ZZ_VISIBLE_ADD_BTN: false,
			ZZ_VISIBLE_REMOVE_BTN: false
		};
		if (!bReload && bReload === undefined || bReload === false) {
			oRow.aPassengerDtl = [];
		}
		return oRow;
	},
	/* Add more detail row of passenger */
	buildPassengerDtlEmptyRow: function(sDep) {
		var oRow = {
			ZZ_ZSLFDPD: sDep,
			ZZ_TRV_FROM_LOC: "BAN-IN",
			ZZ_TRV_FROM_TEXT: "Bangalore, India",
			ZZ_TRV_TO_LOC: "",
			ZZ_TRV_TO_TEXT: "",
			ZZ_DATE_VALUE: "",
			ZZ_TIME_VALUE: "",
			ZZ_ZMODE: "",
			ZZ_ENABLE: true,
			ZZ_F_ROW: true,
			ZZ_TRV_STATUS: true

		};
		return oRow;
	},
	buildPassengerDtlEmptyRndRow: function(sDep) {
		var oRow = {
			ZZ_ZSLFDPD: sDep,
			ZZ_LOC_FROM_KEY: "",
			ZZ_LOC_TO_KEY: "",
			ZZ_TRV_TO_LOC: "",
			ZZ_TRV_TO_TEXT: "",
			ZZ_FMDATE_VALUE: "",
			ZZ_FMTIME: "",
			ZZ_TODATE_VALUE: "",
			ZZ_TOTIME: "",
			ZZ_ZMODE: ""

		};
		return oRow;
	},
	/* Add more sponsor detail */
	buildSponsorDtlEmpRow: function(sSPFKey) {
		var oSpRow = {
			ZZ_HEAD_TITLE: sSPFKey,
			ZZ_EXPANDED: true,
			ZZ_VISIBLE: false,
			ZZ_TB_VISIBLE: true,
			ZZ_GEBER: sSPFKey,
			ZZ_PERCENT: 0,
			ZZ_CCDEPT: "",
			ZZ_CCNAME: "",
			ZZ_CCOST: "",
			ZZ_EANO: "",
			ZZ_FIPEX: "",
			ZZ_FIPOS: "",
			ZZ_FISTL: "",
			ZZ_PONO: "",
			ZZ_KOSTL: "",
			ZZ_TASKID:"",
			ZZ_RESOURCEID:"",
			ZZ_RESOURCETYP:""
		};
		return oSpRow;
	},
	buildEmptyTravelData: function() {
		var oTravelDataInfo = {
			ZZ_FMCNTRY: "",
			ZZ_TOCNTRY: "",
			ZZ_FMCITY: "",
			ZZ_TOCITY: "",
			ZZ_FMDATE: "",
			ZZ_TODATE: "",
			ZZ_FMTIME: "",
			ZZ_TOTIME: "",
			ZZ_DUR_DAY: 0,
			ZZ_ZMODE: ""
		};
		return oTravelDataInfo;

	},
	buidTravellerEmpty: function(sDept) {
		var oTraveller = {
			ZZ_ACTIVE: "X",
			ZZ_BEGDA: "",
			ZZ_BEGUR: "",
			ZZ_ENDDA: "",
			ZZ_ENDUZ: "",
			ZZ_TRVCAT: "BUSR",
			ZZ_ZFRPLACE: "",
			ZZ_ZMODE: "",
			ZZ_ZSLFDPD: sDept,
			ZZ_ZTOPLACE: ""
		};
		return oTraveller;
	},
	buildAcccmEmpty: function() {
		var oAccm = {
			"ZZ_PERNR": "",
			"ZZ_DEP_REQ": "",
			"ZZ_REINR": "",
			"ZZ_VERSION": "",
			"ZZ_ZPLACE": "",
			"ZZ_BEGDA": "",
			"ZZ_ENDDA": "",
			"ZZ_CONTACT": ""
		};
		return oAccm;
	},
	buildAdvMoneyEmpty: function(sCurr) {
		var oAdvM = {
			"ZZ_CUR1": sCurr,
			"ZZ_BODVL1": "0",
			"ZZ_LODVL1": "0",
			"ZZ_SRTVL1": "0",
			"ZZ_OTHVL1": "0",
			"ZZ_CUR2": "",
			"ZZ_BODVL2": "0",
			"ZZ_LODVL2": "0",
			"ZZ_SRTVL2": "0",
			"ZZ_OTHVL2": "0",
			"ZZ_CUR3": "",
			"ZZ_BODVL3": "0",
			"ZZ_LODVL3": "0",
			"ZZ_SRTVL3": "0",
			"ZZ_OTHVL3": "0"
		};
		return oAdvM;
	},
	buildAFundDefault: function() {
		var aFund = [{
			fikr: "6520",
			fincode: "F01",
			beschr: "RBEI Fund"
		}];
		return aFund;
	},
	getTravelPsgIdx: function(oEvent, oThis) {
		var oItem = oEvent.getSource().$().closest("section"); //get parent id
		var oParent = oThis.byId(oItem[0].id);
		var sIdx = oParent.oBindingContexts.trvRequestDtl.getPath().split("/")[3]; //get position of row in array
		return sIdx;
	},
	getRowIdxRoundTrip: function(oEvent) {
		var sPath = oEvent.getSource().mBindingInfos.value.binding.oContext.sPath;
		var nIdx = parseInt(sPath.split("/")[5]);
		return nIdx;

	},
	getRowIdxMultiCity: function(oEvent) {

		var sPath = oEvent.getSource().getParent().getParent().oBindingContexts.trvRequestDtl.sPath;
		var nIdx = parseInt(sPath.split("/")[5]);
		return nIdx;
	},
	convertStringToDate: function(sDate) {
		if (sDate) {
			var pattern = /(\d{2})\/(\d{2})\/(\d{4})/;
			return new Date(sDate.replace(pattern, '$3-$2-$1'));
		} else {
			return new Date();
		}

	},
	getTimeStamp: function() {
		var sTime = Number(new Date());
		return sTime;
	},
	sortDateArr: function(aDate) {
		return aDate.sort(this.sortDates);
	},
	sortDates: function(f, e) {
		return f.getTime() - e.getTime();
	},
	isValidDate: function(value) {
		return value.constructor.toString().indexOf("Date") > -1;
	},
	convertDateToString: function(userDate, sType) {
		// convert parameter to a date
		var returnDate = userDate;
		if (this.isValidDate(userDate) === false) {
			returnDate = this.convertStringToDate(userDate);
		}
		// get the day, month and year
		var y = returnDate.getFullYear();
		var m = returnDate.getMonth() + 1;
		var d = returnDate.getDate();

		// converting the integer values we got above to strings
		y = y.toString();
		m = m.toString();
		d = d.toString();

		// making days or months always 2 digits
		if (m.length === 1) {
			m = '0' + m;
		}
		if (d.length === 1) {
			d = '0' + d;
		}

		switch (sType) {
			case "d/m/y":
				returnDate = d + "/" + m + "/" + y;
				break;
			case "ymd":
				returnDate = y + m + d;
				break;

		}

		return returnDate;
	},
	buildDateHeader: function(sDateValue, nDay) {
		var sHeadDate = "";
		if (sDateValue) {
			var oDate = new Date(sDateValue);
			var sMonth = sap.ui.project.e2etm.util.Formatter.getMonthName(oDate);
			var sDay = sap.ui.project.e2etm.util.Formatter.add_number_suffix(oDate.getDate());
			if (nDay) {
				sDay = sap.ui.project.e2etm.util.Formatter.add_number_suffix(oDate.getDate() + 1);
				sHeadDate = sDay + " " + sMonth + " " + oDate.getFullYear();
			} else {
				sHeadDate = sDay + " " + sMonth + " " + oDate.getFullYear();
			}

		}
		return sHeadDate;
	},
	buildHeaderInfo: function() {

	},
	getCustomerCatFromIdx: function(nIdx) {
		var sCat = "INBO";
		switch (nIdx) {
			case 0:
				sCat = "GLOB";
				break;
			case 1:
				sCat = "INBO";
				break;
			case 2:
				sCat = "INRB";
				break;
		}
		return sCat;
	},
	getCustomerCatIdxFromType: function(sCat) {
		var nIdx = 0;
		switch (sCat) {
			case "GLOB":
				nIdx = 0;
				break;
			case "INBO":
				nIdx = 1;
				break;
			case "INRB":
				nIdx = 2;
				break;
		}
		return nIdx;
	},
	// findLocObjByCity: function(aCountries, sCityName) {
	// 	var oLoc = aCountries.filter(obj => {
	// 		return obj.CITY === sCityName;
	// 	});
	// 	return oLoc[0];
	// },
	// findPassengerByDep: function(aPass, sDep) {
	// 	var oPass = aPass.filter(obj => {
	// 		return obj.ZZ_ZSLFDPD === sDep;
	// 	});
	// 	return oPass[0];
	// },
	// findFundSelected: function(aFund, sFunKey){
	// 	var oFund = aFund.filter(obj => {
	// 		return obj.ZZ_GEBER === sFunKey;
	// 	});
	// 	return oFund[0];
	// },
	//check item in array with key property
	checkExistingArray: function(aSArray, sColumn, sKeyVal) {
		var aFound = aSArray.filter(function(obj) {
			return obj[sColumn] === sKeyVal;
		});
		return aFound[0];
	},

	//uea6kor-uml6kor commented and start of code
	// Phong 20/03 -- Start --- add for updating visa country
//	_updateVISACountry: function(oData, oVPD, oPModel, sToCountry) {
//		//process visa
//		for (var v = 0; v < oVPD.visaExistingDependent.length; v++) {
//			var oV = this.checkExistingArray(oData.aCountries, "CITY", oVPD.visaExistingDependent[v].ZZ_VISA_TOCNTRY);
//			if (oV !== undefined) {
//				oVPD.visaExistingDependent[v].ZZ_VISA_TOCNTRY = oV.COUNTRYCODE;
//			}
//		}
//		var aData = oVPD;
//		if (sToCountry !== "") {
//			aData.visaExistingDependent = oVPD.visaExistingDependent.filter(function(item) {
//				return item.ZZ_VISA_TOCNTRY === sToCountry;
//			});
//			if (aData.visaExistingDependent.length > 0) {
//				aData.visaExistingDependent = [aData.visaExistingDependent[aData.visaExistingDependent.length - 1]];
//			}
//			// aData.visaExistingDependent[0];
//		}
//		oPModel.setData(aData);
//	},
	_updateVISACountry: function(oData, oVPD, oPModel, sToCountry) {
		//process visa
		for (var v = 0; v < oVPD.visaExistingDependent.length; v++) {
			var oV = this.checkExistingArray(oData.aCountries, "CITY", oVPD.visaExistingDependent[v].ZZ_VISA_TOCNTRY);
			if (oV !== undefined) {
				oVPD.visaExistingDependent[v].ZZ_VISA_TOCNTRY = oV.COUNTRYCODE;
			}
		}
		var aData = oVPD;
		if (sToCountry !== "") {
			aData.visaExistingDependent = oVPD.visaExistingDependent.filter(function(item) {
				return item.ZZ_VISA_TOCNTRY === sToCountry;
			});
			if (aData.visaExistingDependent.length > 0) {
				var total = aData.visaExistingDependent.length - 1;
			if(oData.oHeader.ZZ_BEGDA != undefined && oData.oHeader.ZZ_BEGDA != "NaN" ) {
				for(var i = 0; i < aData.visaExistingDependent.length; i++){
				var sdate = aData.visaExistingDependent[i].ZZ_VISA_SDATE;
				var edate = aData.visaExistingDependent[i].ZZ_VISA_EDATE;
				var dep_sdate = sdate.substr(6,4) + sdate.substr(3,2) + sdate.substr(0,2); 
				var dep_edate = edate.substr(6,4) + edate.substr(3,2) + edate.substr(0,2); 
				var j = 0;
						if( oData.oHeader.ZZ_BEGDA >= dep_sdate && oData.oHeader.ZZ_ENDDA <= dep_edate){	
							if(aData.visaExistingDependent[i].ZZ_MULT_ENTRY == 'X'){
								aData.visaExistingDependent[i].ZZ_MULT_ENTRY = 'Yes';								
							}
							else{
								aData.visaExistingDependent[i].ZZ_MULT_ENTRY = 'No';
							}
							aData.visaExistingDependent = [aData.visaExistingDependent[i]]; 	
						j = j + 1;
						}

						if(i == total)
						{
							if(j == 0)
							{
								aData.visaExistingDependent = [];
							}
						}

						
//	aData.visaExistingDependent = [aData.visaExistingDependent[aData.visaExistingDependent.length - 1]];
				}
			// aData.visaExistingDependent[0];
		}else{
			aData.visaExistingDependent = [aData.visaExistingDependent[aData.visaExistingDependent.length - 1]];
			for(var i = 0; i < aData.visaExistingDependent.length; i++){
				if(aData.visaExistingDependent[i].ZZ_MULT_ENTRY == 'X'){
						aData.visaExistingDependent[i].ZZ_MULT_ENTRY = 'Yes';								
				} else {
						aData.visaExistingDependent[i].ZZ_MULT_ENTRY = 'No';
				}	
			}
		}
		
	}
	}
	oPModel.setData(aData);
	},

//uea6kor-uml6kor 15/7/2019

	// Phong 20/03 -- End ---add for updating visa country
	getDuration: function(sFromDate, sToDate) {
		var nDur = 0;
		var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
		var fromDate = new Date(sap.ui.project.e2etm.util.Formatter.ymToMDY(sFromDate));
		var toDate = new Date(sap.ui.project.e2etm.util.Formatter.ymToMDY(sToDate));

		nDur = Math.round(Math.abs((fromDate.getTime() - toDate.getTime()) / (oneDay))) + 1;
		console.info("Trip Duration: " + nDur);
		return nDur.toString();
	},

	setProfileData: function(aPass, oProfileData) {
		if (oProfileData) {
			aPass.ZZ_ZSEAT = oProfileData.zz_seat;
			aPass.ZZ_ZMEAL = oProfileData.zz_meal;
			aPass.ZZ_MOBILE = oProfileData.zz_mobile;
		}
	},

	//*advance money
	// Convert advance from object to array
	convertAdvanceObjToArr: function(oAdv) {
		var aAdv = [];
		//row 1
		var oRow1 = this.buildAdvMoneyEmpty(oAdv.ZZ_CUR1.trim());
		oRow1.ZZ_BODVL1 = parseFloat(oAdv.ZZ_BODVL1);
		aAdv.push(oRow1);
		//row 2
		var nAmout2 = parseFloat(oAdv.ZZ_BODVL2);
		if (nAmout2 !== 0) {
			var oRow2 = this.buildAdvMoneyEmpty(oAdv.ZZ_CUR2.trim());
			oRow2.ZZ_BODVL1 = nAmout2;
			aAdv.push(oRow2);

		}
		//row 3
		var nAmout3 = parseFloat(oAdv.ZZ_BODVL3);
		if (nAmout3 !== 0) {

			var oRow3 = this.buildAdvMoneyEmpty(oAdv.ZZ_CUR3.trim());
			oRow3.ZZ_BODVL1 = parseFloat(oAdv.ZZ_BODVL3);
			aAdv.push(oRow3);
		}
		return aAdv;
	},
	converttAdvArrToObj: function(aAdv) {
		var oAdv = this.buildAdvMoneyEmpty(aAdv[0].ZZ_CUR1);
		oAdv.ZZ_BODVL1 = aAdv[0].ZZ_BODVL1.toString();
		if (aAdv[1]) {
			oAdv.ZZ_BODVL2 = aAdv[1].ZZ_BODVL1.toString();
			oAdv.ZZ_CUR2 = aAdv[1].ZZ_CUR1;
		}
		if (aAdv[2]) {

			oAdv.ZZ_BODVL3 = aAdv[2].ZZ_BODVL1.toString();
			oAdv.ZZ_CUR3 = aAdv[2].ZZ_CUR1;
		}

		return oAdv;
	},
	checkAdvValid: function(oAdv) {
		var bValid = true;
		if (parseFloat(oAdv.ZZ_BODVL1) === 0 && parseFloat(oAdv.ZZ_BODVL2) === 0 && parseFloat(oAdv.ZZ_BODVL3) === 0) {
			bValid = false;
		}
		return bValid;
	},
	//end edvance money
	//switc hot fix
	_switchInject: function(bState, nIdx) {
		/*var aSwOn = $('.sapMSwtTextOn'),
			aSwOff = $('.sapMSwtTextOff');
		var oSwOn = aSwOn[nIdx],
			oSwOff = aSwOff[nIdx];
		if (oSwOn && oSwOff) {
			if (bState) {
				$("#" + oSwOn.id).addClass('swTextOnInject');
				$("#" + oSwOff.id).addClass('swTextOffInject');
			} else {
				$("#" + oSwOn.id).removeClass('swTextOnInject');
				$("#" + oSwOff.id).removeClass('swTextOffInject');
			}
		}*/

	},
	/* handle comment */
	_getLatestComment: function(sRealComt) {
		var aComts = sRealComt.split("-------------------------------------------------------");
		var sLatestComt = "";
		if (aComts) {
			sLatestComt = aComts[1].substring(50, aComts[1].length).trim();
		}
		return sLatestComt;

	},
	/* end handle comment */
	/* Validation */
	isValidReqId: function(sReqId) {
		var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
		var bValid = base64regex.test(sReqId);
		return bValid;
	},
	isEmpty: function(sValue) {
		if (sValue !== undefined && sValue !== null & sValue !== "") {
			return false;
		} else {
			return true;
		}

	},
	valiDateTravelingFirstRow: function(oTravelData) {
		if (this.isEmpty(oTravelData.ZZ_FMCNTRY) || this.isEmpty(oTravelData.ZZ_TOCNTRY) || this.isEmpty(oTravelData.ZZ_FMCITY) || this.isEmpty(
				oTravelData.ZZ_TOCITY) || this.isEmpty(oTravelData.ZZ_FMDATE) || this.isEmpty(oTravelData.ZZ_TODATE) || this.isEmpty(oTravelData.ZZ_ZMODE)) {
			return false;
		} else {
			return true;
		}

	},
	valiDateTravelingRoundTrip: function(aPassenger) {
		var bValid = true;
		var oThis = this;
		aPassenger.forEach(function(oPassenger) {
			var aPDetail = oPassenger.aPassengerDtl;
			for (var i = 0; i < aPDetail.length; i++) {
				var oTravelData = aPDetail[i];
				if (oThis.isEmpty(oTravelData.ZZ_FMCNTRY) || oThis.isEmpty(oTravelData.ZZ_TOCNTRY) || oThis.isEmpty(oTravelData.ZZ_FMCITY) || oThis
					.isEmpty(oTravelData.ZZ_TOCITY) || oThis.isEmpty(oTravelData.ZZ_FMDATE) || oThis.isEmpty(oTravelData.ZZ_ZMODE)) {
					bValid = false;
				}
			}
		});
		return bValid;

	},
	valiDateTravelingMultiCity: function(aPassenger) {
		var bValid = true;
		var oThis = this;
		aPassenger.forEach(function(oPassenger) {
			var aPDetail = oPassenger.aPassengerDtl;
			for (var i = 0; i < aPDetail.length; i++) {
				var oTravelData = aPDetail[i];
				if (oThis.isEmpty(oTravelData.ZZ_TRV_FROM_LOC) || oThis.isEmpty(oTravelData.ZZ_TRV_TO_LOC) || oThis.isEmpty(oTravelData.ZZ_DATE_VALUE) ||
					oThis.isEmpty(oTravelData.ZZ_ZMODE)
				) {
					bValid = false;
				}
			}
		});
		return bValid;

	},
	//check if multi city tab need to input three record
	valiDateTravellingMultiRecord: function(nAPassLen) {
		var bValid = true;
		var oThis = this;
		if (nAPassLen < 3) {
			bValid = false;
		}
		return bValid;
	},
	validFromToLoc: function(sFrom, sTo) {
		if (sFrom !== sTo) {
			return true;
		} else {
			return false;
		}

	},
	validPurpose: function(sPurposeKey) {
		var sPKeys = ["BMPP", "WCSI", "WCSE", "CRTP"];
		if (sPKeys.indexOf(sPurposeKey) === -1) {
			return false;
		} else {
			return true;
		}
	},
	_showErrMsgByCode: function(sCode, sType) {
			var sMsg = "",
				sType = "Error";
			if (sType === "V") {
				sType = "Error Validation";
			}
			switch (sCode) {
				case "E01":
					sMsg = "You can't create more passenger, Maximum 6 dependents";
					break;
				case "E02":
					sMsg = "Please fill all the mandatory fields before adding a new traveler";
					break;
				case "E03":
					sMsg = "City can't be same";
					break;
				case "E04":
					sMsg = "You can't create more row, Maximum 3 row";
					break;
				case "E05":
					sMsg = "Invalid Allocation, Allocation must > 0 and  < 100, Total percent must be 100";
					break;
				case "E06":
					sMsg = "Please input valid Sponsored or use Value help";
					break;
				case "E07":
					sMsg = "Enter required field(s)";
					break;
				case "E08":
					sMsg = "Please fill mandatory information of travelling details to continue";
					break;
				case "E09":
					sMsg = "Please input valid Cost Center or use Value help";
					break;
				case "E10":
					sMsg = "Please input valid Project Id or use Value help";
					break;
				case "E11":
					sMsg = "Please input valid Expense type or use Value help";
					break;
				case "E12":
					sMsg = "Please correct all field";
					break;
				case "E13":
					sMsg = "Invalid purpose, please select purpose from list";
					break;
				case "E14":
					sMsg = "Please notice Multi-City need least 2 records";
					break;
				case "E15":
					sMsg = "Traveler type can't duplicate value";
					break;
			}
			this._showMsgBox(sType, sMsg);
		}
		/* End Validation */

};