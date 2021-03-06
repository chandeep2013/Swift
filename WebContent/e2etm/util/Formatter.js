jQuery.sap.declare("sap.ui.project.e2etm.util.Formatter");
jQuery.sap.require("sap.ui.project.e2etm.util.StaticUtility");
jQuery.sap.require("sap.ui.core.format.DateFormat");
sap.ui.project.e2etm.util.Formatter = {

	_statusStateMap: {
		"P": "Success",
		"N": "Warning"
	},
	noValueFormat: function(value) {
		if (value == null || value == "") {
			return "Not available";
		} else {
			return value;
		}
	},
	formatSAPDateFilter: function() {
		return new sap.ui.model.type.Date({
			pattern: "dd/mm/yyyy"
		});
	},

	/* REPORT PAGE */
	formatReportTitle: function() {
		if (sap.ui.getCore().getModel("profile").getData().currentRole == "GRM") {
			return "Manager Report";
		} else if (sap.ui.getCore().getModel("profile").getData().currentRole == "DEPU") {
			return "Deputation Report";
		} else if (sap.ui.getCore().getModel("profile").getData().currentRole == "ECO") {
			return "ECO Report";
		} else if (sap.ui.getCore().getModel("profile").getData().currentRole == "TAX") {
			return "Tax Report";
		}
		return "";
	},
	formatReportDimension: function(iBox) {
		if (sap.ui.getCore().getModel("profile").getData().currentRole == "GRM") {
			sTitle = "Manager Report";
			switch (iBox) {
				case "1":
					return "TEAM DEPUTATION STATUS";
				case "2":
					return "TEAM APPLICATION STATUS";
				case "3":
					return "TEAM LOCATION WORLDWIDE";
			}
		} else if (sap.ui.getCore().getModel("profile").getData().currentRole == "DEPU") {
			switch (iBox) {
				case "1":
					return "DEPUTATION DETAILS OF EMPLOYEE";
				case "2":
					return "ASSIGNMENT MODEL WISE";
				case "3":
					return "DEPUTED COUNTRY WISE";
			}
		} else if (sap.ui.getCore().getModel("profile").getData().currentRole == "ECO") {
			switch (iBox) {
				case "1":
					return "GREEN LISTED REPORTS";
				case "2":
					return "YELLOW LISTED REPORTS";
				case "3":
					return "TEAM LOCATION WORLDWIDE";
			}
		} else if (sap.ui.getCore().getModel("profile").getData().currentRole == "TAX") {
			switch (iBox) {
				case "1":
					return "TEAM DEPUTATION STATUS";
				case "2":
					return "TEAM APPLICATION STATUS";
				case "3":
					return "TEAM LOCATION WORLDWIDE";
			}
		}
		return "";
	},
	/* REPORT PAGE */

	/* CANCELLATION */

	visibleCancelRequestDetails: function(status, req_typ) { // manager dashboard
		//      if(req_typ=="TRST"||req_typ=="CARD"||req_typ=="PYVR"||req_typ=="INRA")
		//      {
		//        return false;
		//      }
		//      else{
		//      if (status == "AA001") {
		if (status == "AA001" || status == "BB009") { // Added by VAB6KOR on 13.11.2017
			return true;
		} else {
			if (req_typ != "DEPU") {
				var action = status.substring(2, 5);
				if (action == "009") {
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}
		}

	},
	invisibleCancelRequestDetails: function(status, req_typ) {
		//    if (status == "AA001") {
		if (status == "AA001" || status == "BB009") { // Added by VAB6KOR on 13.11.2017
			return false;
		} else {
			if (req_typ != "DEPU") {
				var action = status.substring(2, 5);
				if (action == "009") {
					return false;
				} else {
					return true;
				}
			} else {
				return true;
			}
		}
	},
	invisibleApprovalButtons: function(status, req_typ) {
		///################### UCD1KOR Conditions included for CARR , CARO ############///////////////
		
		if (req_typ != "REIM" && req_typ != "TRST" && req_typ != "PYVR" && req_typ != "CARD" && req_typ != "INRA" &&  req_typ != "CARR" &&  req_typ != "CARO") {
			//        if (status == "AA001") {
			if (status == "AA001" || status == "BB009") { // Added by VAB6KOR on 13.11.2017
				return false;
			} else {
				if (req_typ != "DEPU") {
					var action = status.substring(2, 5);
					if (action == "009") {
						return false;
					} else {
						return true;
					}
				} else {
					return true;
				}
			}
		} else {
			return false;
		}
	},
	inVisibleCommentBox: function(req_typ) {
		if (req_typ != "REIM") {
			return true;
		} else {
			return false;
		}
	},

	cancelEmployeeRequestButton: function(reqid, depu_type, trv_req, req_type, status, stage, set, subsubset, startDate, endDate) {
		try {
			// Check current date first
			var curDate = new Date();
			var deputationStartDate = new Date(startDate.substr(0, 4), startDate.substr(4, 2) - 1, startDate.substr(6, 2));
			var deputationEndDate = new Date(endDate.substr(0, 4), endDate.substr(4, 2) - 1, endDate.substr(6, 2)); // Added by VAB6KOR
			if (curDate >= deputationStartDate || curDate >= deputationEndDate) {
				// Changes start by VAB6KOR for Cancel request Link Enable if start date is in the past
				//  return false;   
				return true;
				// Changes End for Cancel Request Link Enable 
			} else {
				if (req_type == "BUSR" || req_type == "SECO" || req_type == "EMER" || req_type == "HOME" || req_type == "INFO") { // Business request
					if (status == "FF001") {
						return true;
					} else {
						return false;
					}
				} else { // Deputation request
					if (status != "AA001" && status != "CANCL") {
						// After accepting a contract letter
						if (depu_type == "DOME") {
							var action = status.substring(2, 5);
							var prefix = status.substring(0, 2);
							if (trv_req == "0000000000" || trv_req == null) { // If no tr status data
								if (action == "002") {
									return false;
								} else {
									// After accepting a contract letter
									if (stage == "1") {
										if (status != "AA014") {
											if (set == "1_2") {
												if (subsubset >= "1_2_1_3") {
													return true;
												} else {
													return false;
												}
											} else if (set > "1_2") {
												return true;
											} else {
												return false;
											}
										} else {
											return false;
										}
									} else if (stage > "1") {
										return true;
									} else {
										return false;
									}
								}
							} else { // With tr status data
								if ((action == "001" && prefix != "FF") || action == "009" || action == "007" || action == "008" || status == "FF002") {
									return false;
								} else {
									if (status != "AA000" && status != "") {
										if (status == "FF001" || status == "JJ000") {
											return true;
										} else {
											// Considering send back
											var action = status.substring(2, 5);
											var prefix = status.substring(0, 2);
											if (prefix != "AA" && action == "008") {
												return true;
											} else {
												return false;
											}
										}
									} else {
										return true;
									}
								}
							}
						} else {
							var action = status.substring(2, 5);
							var prefix = status.substring(0, 2);
							if (trv_req == "0000000000" || trv_req == null) { // If no tr status data
								if (action == "002") {
									return false;
								} else {
									// After accepting a contract letter
									if (stage == "1") {
										if (status != "AA014") {
											if (set == "1_2") {
												if (subsubset >= "1_2_1_5") {
													return true;
												} else {
													return false;
												}
											} else if (set > "1_2") {
												return true;
											} else {
												return false;
											}
										} else {
											return false;
										}
									} else if (stage > "1") {
										return true;
									} else {
										return false;
									}
								}
							} else { // With tr status data
								if ((action == "001" && prefix != "FF") || action == "009" || action == "007" || action == "008" || status == "FF002") {
									return false;
								} else {
									if (status != "AA000" && status != "") {
										if (status == "FF001" || status == "JJ000") {
											return true;
										} else {
											// Considering send back
											var action = status.substring(2, 5);
											var prefix = status.substring(0, 2);
											if (prefix != "AA" && action == "008") {
												return true;
											} else {
												return false;
											}
										}
									} else {
										return true;
									}
								}
							}
						}
					} else {
						return false;
					}
				}
			}
		} catch (exc) {
			return false;
		}
	},
	cancelRequestButton: function(reqid, depu_type, trv_req, req_type, status, stage, set, subsubset) {
		try {
			if (req_type == "BUSR" || req_type == "SECO" || req_type == "EMER" || req_type == "HOME" || req_type == "INFO") { // Business request
				if (status == "FF001") {
					return true;
				} else {
					return false;
				}
			} else { // Deputation request
				if (status != "AA001" && status != "CANCL") {
					// After accepting a contract letter
					if (depu_type == "DOME") {
						var action = status.substring(2, 5);
						var prefix = status.substring(0, 2);
						if (trv_req == "0000000000" || trv_req == null) { // If no tr status data
							if (action == "002") {
								return false;
							} else {
								// After accepting a contract letter
								if (stage == "1") {
									if (status != "AA014") {
										if (set == "1_2") {
											if (subsubset >= "1_2_1_3") {
												return true;
											} else {
												return false;
											}
										} else if (set > "1_2") {
											return true;
										} else {
											return false;
										}
									} else {
										return false;
									}
								} else if (stage > "1") {
									return true;
								} else {
									return false;
								}
							}
						} else { // With tr status data
							if ((action == "001" && prefix != "FF") || action == "009" || action == "007" || action == "008" || status == "FF002") {
								return false;
							} else {
								if (status != "AA000" && status != "") {
									if (status == "FF001" || status == "JJ000") {
										return true;
									} else {
										// Considering send back
										var action = status.substring(2, 5);
										var prefix = status.substring(0, 2);
										if (prefix != "AA" && action == "008") {
											return true;
										} else {
											return false;
										}
									}
								} else {
									return true;
								}
							}
						}
					} else {
						var action = status.substring(2, 5);
						var prefix = status.substring(0, 2);
						if (trv_req == "0000000000" || trv_req == null) { // If no tr status data
							if (action == "002") {
								return false;
							} else {
								// After accepting a contract letter
								if (stage == "1") {
									if (status != "AA014") {
										if (set == "1_2") {
											if (subsubset >= "1_2_1_5") {
												return true;
											} else {
												return false;
											}
										} else if (set > "1_2") {
											return true;
										} else {
											return false;
										}
									} else {
										return false;
									}
								} else if (stage > "1") {
									return true;
								} else {
									return false;
								}
							}
						} else { // With tr status data
							if ((action == "001" && prefix != "FF") || action == "009" || action == "007" || action == "008" || status == "FF002") {
								return false;
							} else {
								if (status != "AA000" && status != "") {
									if (status == "FF001" || status == "JJ000") {
										return true;
									} else {
										// Considering send back
										var action = status.substring(2, 5);
										var prefix = status.substring(0, 2);
										if (prefix != "AA" && action == "008") {
											return true;
										} else {
											return false;
										}
									}
								} else {
									return true;
								}
							}
						}
					}
				} else {
					return false;
				}
			}
		} catch (exc) {
			return false;
		}
	},
	cancelManagerRequestButton: function(req_type, status, trv_req) {
		try {
			var action = status.substring(2, 5);
			var prefix = status.substring(0, 2);
			if (req_type == "BUSR" || req_type == "SECO" || req_type == "EMER" || req_type == "HOME" || req_type == "INFO") {
				if ((action == "001" && prefix != "FF") || action == "009" || action == "007" || action == "008" || status == "FF002") {
					return false;
				} else {
					return true;
				}
			} else {
				if (trv_req == "0000000000" || trv_req == null) {
					if (status != "AA001" && status != "CANCL" && action != "002") {
						return true;
					} else {
						return false;
					}
				} else {
					if ((action == "001" && prefix != "FF") || action == "009" || action == "007" || action == "008" || status == "FF002") {
						return false;
					} else {
						if (status != "AA001" && status != "CANCL") {
							return true;
						} else {
							return false;
						}
					}
				}
			}
		} catch (exc) {
			return false;
		}
	},
	/* CANCELLATION */

	/* CHANGE REQUEST */
	visibleChangeHeaderText: function(vreason, reqtype) {
		if (reqtype == "REIM" || reqtype == "TRST" || reqtype == "PYVR" || reqtype == "CARD" || reqtype == "INRA") {
			return false;
		} else {
			if (vreason != "" && vreason != "DC" && vreason != "DD") {
				return true;
			} else {
				return false;
			}
		}
	},
	formatChangeHeaderText: function(vreason, reqTyp) {
		if (reqTyp == "DEPU" || reqTyp == "BUSR" || reqTyp == "INFO" ||
			reqTyp == "HOME" || reqTyp == "SECO" || reqTyp == "EMER") {
			if (vreason == "DA" || vreason == "DR") {
				return "THIS REQUEST HAS BEEN CHANGED IN DATES";
			} else if (vreason == "DB") {
				return "THIS REQUEST HAS BEEN CHANGED IN END DATE";
			} else if (vreason == "DE") {
				return "THIS REQUEST HAS BEEN CHANGED IN TRAVELLING DEPENDENTS";
			} else if (vreason == "TA") {
				return "THIS REQUEST HAS BEEN CHANGED";
			} else if (vreason == "DC") {
				return "THIS REQUEST HAS BEEN SENT FOR CANCELLATION";
			} else if (vreason == "DD") {
				return "THIS REQUEST HAS BEEN CANCELLED";
			} else if (vreason == "DF") {
				return "THIS REQUEST HAS ADDED A NEW BORN KID";
			} else if (vreason == "DG") {
				return "THIS REQUEST HAS ADDED ADDITIONAL TRAVELLING MEMBER(S)";
			} else if (vreason == "DH") {
				return "THIS REQUEST HAS BEEN CHANGED IN FAMILY RETURNING DATE";
			}
		}
		return "PLEASE MAINTAIN THE TEXT FOR THIS CHANGE TYPE";
	},
	formatChangeTextDepuTable: function(vreason) {
		if (vreason == "DA") {
			return "Change in dates - Before deputation";
		} else if (vreason == "DB") {
			return "Change in end date - On deputation";
		} else if (vreason == "DC") {
			return "Cancellation Requested";
		} else if (vreason == "DD") {
			return "Cancelled";
		} else if (vreason == "DR") {
			return "Change in dates - TP Stage";
		} else if (vreason == "TA") {
			return "Travel Request Change";
		} else if (vreason == "DE") {
			return "Family Accompanied - Before deputation";
		} else if (vreason == "DF") {
			return "Addition of Kid - On Deputation";
		} else if (vreason == "DG") {
			return "Family Accompanied - On deputation";
		} else if (vreason == "DH") {
			return "Family Return";
		} else {
			return "Creation";
		}
	},
//start of code Displaying information related to conversion in Deputation dashboard RBEIITAPPPIPELINE-683 uml6kor_11.04.2020 
	formatChangeConvTextDepuTable: function(vreason,convrsn) {
		if(convrsn == "" || convrsn == null ||convrsn == undefined){
			if (vreason == "DA") {
				return "Change in dates - Before deputation";
			} else if (vreason == "DB") {
				return "Change in end date - On deputation";
			} else if (vreason == "DC") {
				return "Cancellation Requested";
			} else if (vreason == "DD") {
				return "Cancelled";
			} else if (vreason == "DR") {
				return "Change in dates - TP Stage";
			} else if (vreason == "TA") {
				return "Travel Request Change";
			} else if (vreason == "DE") {
				return "Family Accompanied - Before deputation";
			} else if (vreason == "DF") {
				return "Addition of Kid - On Deputation";
			} else if (vreason == "DG") {
				return "Family Accompanied - On deputation";
			} else if (vreason == "DH") {
				return "Family Return";
			} else {
				return "Creation";
			}
			
		}
		else
		{
			return "Conversion"+' '+'( '+convrsn+' )';
			
		}
		
	},

	//End of code Displaying information related to conversion in Deputation dashboard RBEIITAPPPIPELINE-683 uml6kor_11.04.2020 
	disabledIfChange: function(vreason) {
		if (vreason == "") {
			return true;
		} else {
			return false;
		}
	},
	disabledIfChangeServiceDuration: function(vreason, serv_typ) {
		if (vreason == "") {
			if (serv_typ == "NORM") {
				return false;
			} else {
				return true;
			}
		} else {
			return false;
		}
	},
	changeCOCButton: function(stdate, eddate, reqtyp, status, trvReq, depType) {
		try {
			if (reqtyp == "DEPU" && depType == "INTL") {
				var curDate = new Date();
				var start = new Date(stdate.substr(0, 4), stdate.substr(4, 2) - 1, stdate.substr(6, 2));
				var end = new Date(eddate.substr(0, 4), eddate.substr(4, 2) - 1, eddate.substr(6, 2));
				if (curDate > start && curDate < end && (status == "FF001" || status == "JJ000")) {
					return true;
				} else {
					if (trvReq != "" && trvReq != "0000000000" && trvReq != null && status.substring(2, 5) == "000") {
						return true;
					} else {
						return false;
					}
				}
			} else {
				return false;
			}
		} catch (exc) {
			return false;
		}
	},
	createRequestButton: function(reqtyp, status, trvCat) {
		try {
			if (reqtyp == "DEPU" && trvCat != "TRNG" &&
				(status == "FF001" || status == "JJ000")) { //Deputation request
				return true;
			} else {
				return false;
			}
		} catch (exc) {
			return false;
		}
	},
	changeRequestButton: function(reqid, depu_type, trv_req, req_type, status, stage, set, subsubset) {
		try {
			if (req_type == "BUSR" || req_type == "SECO" || req_type == "EMER" || req_type == "HOME" || req_type == "INFO") { // Business request
				if (status == "FF001") {
					return true;
				} else {
					return false;
				}
			} else { // Deputation request
				if (status != "AA001" && status != "CANCL") {
					if (depu_type == "DOME") {
						var action = status.substring(2, 5);
						var prefix = status.substring(0, 2);
						if (trv_req == "0000000000" || trv_req == null) { // If no tr status data
							if (action == "002") {
								return false;
							} else {
								// After accepting a contract letter
								if (stage == "1") {
									if (status != "AA014") {
										if (set == "1_2") {
											if (subsubset >= "1_2_1_3") {
												return true;
											} else {
												return false;
											}
										} else if (set > "1_2") {
											return true;
										} else {
											return false;
										}
									} else {
										return false;
									}
								} else if (stage > "1") {
									return true;
								} else {
									return false;
								}
							}
						} else { // With tr status data
							if ((action == "001" && prefix != "FF") || action == "009" || action == "007" || action == "008" || status == "FF002") {
								return false;
							} else {
								if (status != "AA000" && status != "") {
									if (status == "FF001" || status == "JJ000") {
										return true;
									} else {
										// Considering send back
										var action = status.substring(2, 5);
										var prefix = status.substring(0, 2);
										if (prefix != "AA" && action == "008") {
											return true;
										} else {
											return false;
										}
									}
								} else {
									return true;
								}
							}
						}
					} else {
						var action = status.substring(2, 5);
						var prefix = status.substring(0, 2);
						if (trv_req == "0000000000" || trv_req == null) { // If no tr status data
							if (action == "002") {
								return false;
							} else {
								// After accepting a contract letter
								if (stage == "1") {
									if (status != "AA014") {
										if (set == "1_2") {
											if (subsubset >= "1_2_1_5") {
												return true;
											} else {
												return false;
											}
										} else if (set > "1_2") {
											return true;
										} else {
											return false;
										}
									} else {
										return false;
									}
								} else if (stage > "1") {
									return true;
								} else {
									return false;
								}
							}
						} else { // With tr status data
							if ((action == "001" && prefix != "FF") || action == "009" || action == "007" || action == "008" || status == "FF002") {
								return false;
							} else {
								if (status != "AA000" && status != "") {
									if (status == "FF001" || status == "JJ000") {
										return true;
									} else {
										// Considering send back
										var action = status.substring(2, 5);
										var prefix = status.substring(0, 2);
										if (prefix != "AA" && action == "008") {
											return true;
										} else {
											return false;
										}
									}
								} else {
									return true;
								}
							}
						}
					}
				} else {
					return false;
				}
			}
		} catch (exc) {
			return false;
		}
	},
	changeInDatesLink: function(reqid, depu_type, trv_req, req_type, status, stage, set, subsubset, asg_typ) {
		try {
			if (req_type == "BUSR" || req_type == "SECO" || req_type == "EMER" || req_type == "HOME" || req_type == "INFO") { // Business request
				if (status == "FF001") {
					return true;
				} else {
					return false;
				}
			} else { // Deputation request
				if (status != "AA001" && status != "CANCL") {
					if (depu_type == "DOME") {
						var action = status.substring(2, 5);
						var prefix = status.substring(0, 2);
						if (trv_req == "0000000000" || trv_req == null || stage == "1") { // If no tr status data
							if (action == "002" || action == "003") {
								return false;
							} else {
								// After accepting a contract letter
								if (stage == "1") {
									if (status != "AA014") {
										if (set == "1_2") {
											if (subsubset >= "1_2_1_3") {
												return true;
											} else {
												return false;
											}
										} else if (set > "1_2") {
											return true;
										} else {
											return false;
										}
									} else {
										return false;
									}
								} else if (stage > "1") {
									return true;
								} else {
									return false;
								}
							}
						} else { // With tr status data
							if ((action == "001" && prefix != "FF") || action == "009" || action == "007" || action == "008" || status == "FF002") {
								return false;
							} else {
								if (status != "AA000" && status != "") {
									if (status == "FF001" || status == "JJ000") {
										return true;
									} else {
										// Considering send back
										var action = status.substring(2, 5);
										var prefix = status.substring(0, 2);
										if (prefix != "AA" && action == "008") {
											return true;
										} else {
											return false;
										}
									}
								} else {
									return true;
								}
							}
						}
					} else { //International
						var action = status.substring(2, 5);
						var prefix = status.substring(0, 2);
						if (trv_req == "0000000000" || trv_req == null || stage == "1" || stage == "2") { // If no tr status data
							if (action == "002" || action == "003" || action == "005") {
								return false;
							} else {
								// After accepting a contract letter
								if (stage == "1") {
									if (status != "AA014") {
										if (set == "1_2") {
											if (subsubset >= "1_2_1_4" && subsubset <= "1_2_1_6") { //from cl generation to stage1 documents upload
												return true;
											} else {
												return false;
											}
										} else if (set > "1_2") {
											//return true;
											return false;
										} else {
											return false;
										}
									} else {
										return false;
									}
								} else if (stage > "1") {
									// start added by VAB6KOR for Change dates link enable in stage 2
									//  if (action == "007" && prefix == "JJ" && stage == "2" && set == "1_1" && subsubset == "1_1_1_2" && asg_typ == "STA"){
									// UCD1KOR 17/06/2021 included status "JJ010"  && asg_typ == "STA"
									if ((status == "JJ005" || status == "JJ007" || status == "AA008"   || status == "AA007" || status == "JJ008" || status == "JJ009" || status == "JJ010" || status == "JJ013") && stage == "2" ) {
										return true;
									} else { // End Changes VAB6KOR
										return false;
									}
								} else {
									return false;
								}
							}
						} else { // With tr status data
							if ((action == "001" && prefix != "FF") || action == "009" || action == "007" || action == "008" || status == "FF002") {
								return false;
							} else {
								if (status != "AA000" && status != "") {
									if (status == "FF001" || status == "JJ000") {
										return true;
									} else {
										return false;
									}
								} else {
									return false;
								}
							}
						}
					}
				} else {
					return false;
				}
			}
		} catch (exc) {
			return false;
		}
	},
	changeFamilyAccLink: function(reqid, depu_type, trv_req, req_type, status, stage, set, subsubset) {
		try {
			if (req_type == "BUSR" || req_type == "SECO" || req_type == "EMER" || req_type == "HOME" || req_type == "INFO") { // Business request
				if (status == "FF001") {
					return true;
				} else {
					return false;
				}
			} else { // Deputation request
				if (status != "AA001" && status != "CANCL") {
					if (depu_type == "DOME") {
						var action = status.substring(2, 5);
						var prefix = status.substring(0, 2);
						if (trv_req == "0000000000" || trv_req == null || stage == "1") { // If no tr status data
							if (action == "002" || action == "003") {
								return false;
							} else {
								// After accepting a contract letter
								if (stage == "1") {
									if (status != "AA014") {
										if (set == "1_2") {
											if (subsubset >= "1_2_1_3") {
												return true;
											} else {
												return false;
											}
										} else if (set > "1_2") {
											return true;
										} else {
											return false;
										}
									} else {
										return false;
									}
								} else if (stage > "1") {
									return true;
								} else {
									return false;
								}
							}
						} else { // With tr status data
							if ((action == "001" && prefix != "FF") || action == "009" || action == "007" || action == "008" || status == "FF002") {
								return false;
							} else {
								if (status != "AA000" && status != "") {
									if (status == "FF001" || status == "JJ000") {
										return true;
									} else {
										// Considering send back
										var action = status.substring(2, 5);
										var prefix = status.substring(0, 2);
										if (prefix != "AA" && action == "008") {
											return true;
										} else {
											return false;
										}
									}
								} else {
									return true;
								}
							}
						}
					} else { //International
						var action = status.substring(2, 5);
						var prefix = status.substring(0, 2);
						if (trv_req == "0000000000" || trv_req == null || stage == "1" || stage == "2") { // If no tr status data
							if (action == "002" || action == "003" || action == "005") {
								return false;
							} else {
								// After accepting a contract letter
								if (stage == "1") {
									if (status != "AA014") {
										if (set == "1_2") {
											if (subsubset >= "1_2_1_4" && subsubset <= "1_2_1_6") { //from cl generation to stage1 documents upload
												return true;
											} else {
												return false;
											}
										} else if (set > "1_2") {
											//return true;
											return false;
										} else {
											return false;
										}
									} else {
										return false;
									}
								} else if (stage > "1") {
									return false;
								} else {
									return false;
								}
							}
						} else { // With tr status data
							if ((action == "001" && prefix != "FF") || action == "009" || action == "007" || action == "008" || status == "FF002") {
								return false;
							} else {
								if (status == "AA000" || status == "" || status == "FF001") {
									return true;
								} else {
									return false;
								}
							}
						}
					}
				} else {
					return false;
				}
			}
		} catch (exc) {
			return false;
		}
	},
	/* CHANGE REQUEST */
	formatTravelRequest: function(trv_req, req_typ, dep_req) {
		try {
			if (req_typ == "SECO") {
				return dep_req;
			} else {
				return trv_req;
			}
		} catch (exc) {
			return trv_req;
		}
	},

	formatReqType: function(reqType) {
		if (reqType == "DEPU") {
			return "DEPUTATION REQUEST";
		} else if (reqType == "BUSR") {
			return "BUSINESS REQUEST";
		} else if (reqType == "EMER") {
			return "EMERGENCY REQUEST";
		} else if (reqType == "HOME") {
			return "HOME TRIP REQUEST";
		} else if (reqType == "SECO") {
			return "SECONDARY REQUEST";
		} else if (reqType == "INFO") {
			return "INFO TRAVEL";
		} else if (reqType == "TRST") {
			return "TRAVEL SETTLEMENT";
		} else if (reqType == "PYVR") {
			return "PAYMENT VOUCHER";
		} else if (reqType == "INRA") {
			return "INR ADVANCE";
		}
		else if (reqType == "REPS") {
			return "Repatriation request";
		}
		else if (reqType == "CARO") {
			return "Onward Cargo";
		}
		else if (reqType == "CARR") {
			return "Return Cargo";
		}
	},

	visisblePleaseSelectTravelCategory: function(description, min, max) {
		if (description == "Please Select") {
			return "Please Select";
		} else {
			return description + "  -  (" + min + " To " + max + " days)";
		}
	},

	visibleDurationIfDOMETRFR: function(trv_cat, dep_type) {
		if (trv_cat == "TRFR" && dep_type == "DOME") {
			return false;
		} else {
			return true;
		}
	},

	statusText: function(value) {
		var bundle = this.getModel("i18n").getResourceBundle();
		return bundle.getText("StatusText" + value, "?");
	},
	statusState: function(value) {
		var map = sap.ui.project.e2etm.util.Formatter._statusStateMap;
		return (value && map[value]) ? map[value] : "None";
	},
	sapBoolean: function(value) {
		return value != "" && value != undefined;
	},

	sapDatePicker: function() {
		return new sap.ui.model.type.Date({
			pattern: "dd/MM/yyyy"
		});
	},
	formatEmptyDate: function(value) {
		if (value == "00000000") {
			return "";
		}
		else{
			return value;
		}
	},
	visibleViewCustomer: function(fund) {
		if (fund.indexOf("F03") == "-1") {
			return false;
		} else {
			return true;
		}
	},
	visibleLink: function(value) {
		if (value == "") {
			return false;
		} else {
			return true;
		}
	},
	sapDate: function(value) {
		if (value != null && value != "" && value != "00000000" && value != "0.0000000 ") {
			var oDateFormat = sap.ui.core.format.DateFormat
				.getDateTimeInstance({
					pattern: "dd/MM/yyyy"
				});
			return oDateFormat.format(new Date(value.substr(0, 4), value
				.substr(4, 2) - 1, value.substr(6, 2)));
		}
		return "NA";
	},
	asgType: function(value){
		if (value != null)
			{
			if(value == 'LDEP')
				{
				return 'Local Deputation';
				}
			else if(value == 'IDEP')
				{
				return 'Inland Deputation';
				}
			}
			return 'NA';
	},
	rsgfch: function(value){
		if (value != null)
			{
			if(value == 'DA')
				{
				return 'Date change before deputation';
				}
			else if(value == 'DB')
				{
				return 'Date change while on deputaiton';
				}
			}
			return 'New Request';
	},
	sapDate_Onsite: function(value) {
		try {
			var sDay = value.getDate();
			var sMonth = value.getMonth() + 1; //Months are zero based
			var sYear = value.getFullYear();
			if (sDay < 10) {
				sDay = '0' + sDay;
			}
			if (sMonth < 10) {
				sMonth = '0' + sMonth;
			}
			var sToday = "{0}/{1}/{2}";
			sToday = sToday.replace("{0}", sDay);
			sToday = sToday.replace("{1}", sMonth);
			sToday = sToday.replace("{2}", sYear);
			return sToday;
		} catch (exc) {
			return "";
		}

	},
	visiblePreviousDateVersion: function(vreason) {
		if (vreason == "" || vreason == "DC" || vreason == "DD") {
			return false;
		} else {
			if (vreason == "DA" || vreason == "DB" || vreason == "DR") {
				return true;
			} else {
				return false;
			}
		}
	},
	visiblePreviousDependentVersion: function(vreason) {
		if (vreason == "" || vreason == "DC" || vreason == "DD") {
			return false;
		} else {
			if (vreason == "DE" || vreason == "DF" || vreason == "DH" || vreason == "DG") {
				return true;
			} else {
				return false;
			}
		}
	},
	visisbleTravelRequest: function(travelReq, travelCat, reqtype) {
		try {
			//        if(reqtype=="TRST"||reqtype=="PYVR"||reqtype=="CARD"||reqtype=="INRA")
			//        {
			//          return true;
			//        }
			//        else{
			if (travelCat == "BUSR" || travelCat == "SECO" || travelCat == "EMER" || travelCat == "HOME" || travelCat == "INFO" || travelCat ==
				"VISA") {
				return true;
			} else {
				if (travelReq == "0000000000" || travelReq == "") {
					return false;
				} else {
					return true;
				}
			}

		} catch (exc) {
			return false;
		}
	},
	visisbleTravelRequestWithF08:function(travelReq, travelCat, fund){

		try {
			  if(fund.indexOf("F08") !== -1){
			         return false;
			  }
			if (travelCat == "BUSR" || travelCat == "SECO" || travelCat == "EMER" || travelCat == "HOME" || travelCat == "INFO" || travelCat ==
				"VISA") {
				return true;
			} else {
				if (travelReq == "0000000000" || travelReq == "") {
					return false;
				} else {
					return true;
				}
			}

		} catch (exc) {
			return false;
		}
	
		
	},
	displayForTravelRequest: function(travelReq, travelCat, reqTyp) {
		/// ### 13 Apr UCD1KOR Travel To field is not required in manaager dashboard
		//// logic start -- simply returning as false
		if(reqTyp == "REPS"){
			return false;
		}
		///  logic end
		try {
			if (reqTyp != "REIM" && reqTyp != "PYVR") { //&&reqTyp != "TRST") {
				if (travelCat == "BUSR" || travelCat == "SECO" || travelCat == "EMER" || travelCat == "HOME" || travelCat == "INFO") {
					return true;
				} else if (travelCat == "VISA") {
					return false;
				} else {
					if (travelReq == "0000000000" || travelReq == "") {
						return false;
					} else {
						return true;
					}
				}
			} else {
				return false;
			}
		} catch (exc) {
			return false;
		}
	},
	visibleReimbursement: function(reqTyp) {
		if (reqTyp == "REIM") {
			return true;
		} else {
			return false;
		}
	},
	visisbleTravelToRequest: function(status) {
		if (status == 'X') {
			return true;
		} else {
			return false;
		}
	},
	visisbleTravelCBox: function(req_type, vreason, asgTyp) {
		if (vreason == "") {
			if (req_type == 'DOME') {
				if (asgTyp == "LDEP") {
					return false;
				} else {
					return true;
				}
			} else if (req_type == 'INTL') {
				return false;
			} else {
				return false;
			}
		} else {
			return false;
		}
	},
	checkTravelCBox: function(req_type, vreason, ttype, asgTyp, fromLoc, toLoc) {
		if (ttype == "" || ttype == null || ttype == "*") {
			if (req_type == 'DOME') {
				if (asgTyp == "TRFR") {
					if (fromLoc == toLoc) {
						return false;
					} else {
						return true;
					}
				} else {
					if (asgTyp == "LDEP" || asgTyp == "BDEP") {
						return false;
					} else {
						return true;
					}
				}
			} else if (req_type == 'INTL') {
				return true;
			} else {
				return true;
			}
		} else {
			if (ttype == "WTRP") {
				return true;
			} else if (ttype == "WOTP") {
				return false;
			}
		}
	},
	checkServiceDiscussedCBox: function(serv_type, vreason) {
		if (vreason == "") {
			return false;
		} else {
			if (serv_type == "NORM") {
				return false;
			} else {
				return true;
			}
		}
	},
	inVisisbleTravelRequest: function(travelReq, travelCat, reqtype) {
		try {
			//        if(reqtype=="TRST")
			//        {
			//          return false;
			//        }
			//        else{
			if (travelCat == "BUSR" || travelCat == "SECO" || travelCat == "EMER" || travelCat == "HOME" || travelCat == "INFO" || travelCat ==
				"VISA") {
				return false;
			} else {
				if (travelReq == "0000000000" || travelReq == "") {
					return true;
				} else {
					return false;
				}
			}

		} catch (exc) {
			return true;
		}
	},
	inVisisbleTravelRequestandDOME: function(travelReq, depType, travelCat, reqtype) {
		try {
			//        if(reqtype=="TRST")
			//        {
			//          return false;
			//        }
			//        else{
			if (travelCat == "BUSR" || travelCat == "SECO" || travelCat == "EMER" || travelCat == "HOME" || travelCat == "INFO" || travelCat ==
				"VISA") {
				return false;
			} else {
				if (travelReq == "0000000000" || travelReq == "") {
					if (depType == "DOME") {
						return false;
					} else {
						return true;
					}
				} else {
					return false;
				}
			}

		} catch (exc) {
			return true;
		}
	},
	inVisisbleTravelRequestandDOMEService: function(travelReq, depType, travelCat, serType, reqtype) {
		try {
			//        if(reqtype=="TRST")
			//        {
			//          return false;
			//        }
			//        else{
			if (travelCat == "BUSR" || travelCat == "SECO" || travelCat == "EMER" || travelCat == "HOME" || travelCat == "INFO") {
				return false;
			} else {
				if (travelReq == "0000000000" || travelReq == "") {
					if (depType == "DOME") {
						return false;
					} else {
						if (serType == "NORM") {
							return false;
						} else {
							return true;
						}
					}
				} else {
					return false;
				}
			}

		} catch (exc) {
			return true;
		}
	},
	inVisisbleCompanySponsor: function(travelReq, travelCat, reqType, depType) {
		try {
			if (reqType == "BUSR" || reqType == "SECO" || reqType == "EMER" || reqType == "HOME" || reqType == "INFO") { //||reqType == "TRST") {
				return false;
			} else {
				if ((travelReq == "0000000000" || travelReq == "") && depType == "INTL") {
					if (travelCat == "TRNG") {
						return false;
					} else {
						return true;
					}
				} else {
					return false;
				}
			}

		} catch (exc) {
			return true;
		}
	},

	visibleServiceTypeMonths: function(serviceType) {
		if (serviceType == "SPCL") {
			return true;
		} else {
			return false;
		}
	},

	visibleTransferReason: function(assigmentModel, subType, reqtype) {
		//      if(reqtype=="TRST")
		//      {
		//        return false;
		//      }
		//      else{
		if (assigmentModel == "TRFR" && subType == "DOME") {
			return true;
		} else {
			return false;
		}
		//      }
	},

	enableTravelTo: function(status) {
		return status.substring(2, 5) == "003";
	},

	visibleModifyEmployeeButtons: function(status, trv_req, cat) {
		try {
			var action = status.substring(2, 5);
			var prefix = status.substring(0, 2);
			// For deputation request
			if (cat != "BUSR" && cat != "SECO" && cat != "EMER" && cat != "HOME" && cat != "INFO") {
				if (prefix != "AA") {
					if (action == "003") {
						return true;
					} else {
						return false;
					}
				} else {
					return false;
				}
			} else {
				if (action == "008") {
					return true;
				} else {
					return false;
				}
			}
		} catch (exc) {
			return false;
		}
	},

	visibleSaveEmployeeButtons: function(status, trv_req, dep_req, cat) {
		try {
			// For deputation request
			if (cat != "BUSR" && cat != "SECO" && cat != "EMER" && cat != "HOME" && cat != "INFO") {
				if (status == "AA000") {
					if (trv_req != dep_req && trv_req != "0000000000") {
						return false;
					} else {
						return true;
					}
				} else {
					return false;
				}
			} else {
				var action = status.substring(2, 5);
				if (action == "000") {
					return true;
				} else {
					return false;
				}
			}
		} catch (exc) {
			return false;
		}
	},

	visibleUploadDocEmployeeButtons: function(status) {
		try {
			if (status == "HH001") {
				return true;
			} else {
				return false;
			}
		} catch (exc) {
			return false;
		}
	},
	visibleEditTravelPlanEmployeeButtons: function(cat, trv_req, req) {
		try {
			// For deputation request
			if (cat != "BUSR" && cat != "SECO" && cat != "EMER" && cat != "HOME" && cat != "INFO") {
				if (trv_req != "0000000000" && trv_req != "") {
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}
		} catch (exc) {
			return false;
		}
	},
	visibleSubmitVisaEmployeeButtons: function(status) {
		try {
			if (status == "JJ007") {
				return true;
			} else {
				return false;
			}
		} catch (exc) {
			return false;
		}
	},
	visibleSubmitDocsEmployeeButtons: function(status) {
		try {
			if (status == "AA004") {
				return true;
			} else {
				return false;
			}
		} catch (exc) {
			return false;
		}
	},
	visibleSubmitAddtionalDocsEmployeeButtons: function(status) {
		try {
			if (status == "JJ010") {
				return true;
			} else {
				return false;
			}
		} catch (exc) {
			return false;
		}
	},
	visibleEmployeeButtons: function(status) {
		try {
			if (status != "JJ006") {
				return false;
			} else {
				return true;
			}
		} catch (exc) {
			return false;
		}
	},

	visibleDeputationGenerate: function(status) {
		try {
			var action = status.substring(2, 5);
			var prefix = status.substring(0, 2);
			if (prefix != "AA") {
				if (action == "001") {
					return true;
				}
			}
			return false;
		} catch (exc) {
			return false;
		}
	},

	visibleDeputationApprove: function(status) {
		if (status == "AA004") {
			return true;
		} else {
			return false;
		}
	},

	formatCheckBoxStatus: function(status) {
		if (status) {
			return "YES";
		} else {
			return "NO";
		}
	},

	formatFamilyJoinStatus: function(status) {
		if (status) {
			return "NOW";
		} else {
			return "LATER";
		}
	},
	formatCountry: function(country) {
		try {
			if(country == ""){
				return "NA";
			}
			if (country) {
				var countryList = sap.ui.getCore().getModel("global").getData().country;
				for (var i = 0; i < countryList.length; i++) {
					if (countryList[i].MOLGA == country) {
						var str = countryList[i].LTEXT;
						return str.replace(/ /g, '');
					}
				}
			}
			return country;
		} catch (exc) {
			return country;
		}
	},

	formatPurposeOfTravel: function(purpose) {
		if (purpose) {
			var purposeList = sap.ui.getCore().getModel("global").getData().purpose;
			for (var i = 0; i < purposeList.length; i++) {
				if (purposeList[i].ZZ_TRV_PUR == purpose) {
					return purposeList[i].ZZ_TRV_DESC;
				}
			}
		}
		return purpose;
	},

	email: function(value) {
		if (value) {
			var atpos = value.indexOf("@");
			var dotpos = value.lastIndexOf(".");
			if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= value.length) {
				return false;
			}
		}
		return true;
	},

	date: function(value) {
		if (value) {
			var oDateFormat = sap.ui.core.format.DateFormat
				.getDateTimeInstance({
					pattern: "yyyy-MM-dd"
				});
			return oDateFormat.format(new Date(value));
		} else {
			return value;
		}
	},

	quantity: function(value) {
		try {
			return (value) ? parseFloat(value).toFixed(0) : value;
		} catch (err) {
			return "Not-A-Number";
		}
	},

	imageUrl: function(value) {
		return "https://sapes1.sapdevcenter.com" + value;
	},

	countTotalMyTasks: function(oValue) {
		if (oValue) {
			return oValue.length;
		}
	},

	radioButtonYes: function(value) {
		if (value == "" || value == undefined) {
			return false;
		}
		return true;
	},

	radioButtonNo: function(value) {
		if (value == "" || value == undefined) {
			return true;
		}
		return false;
	},

	getFileType: function(sExtension) {
		switch (sExtension) {
			case ".gif":
			case ".jpeg":
			case ".png":
			case ".jpg":
				return "image/jpg";
			case ".doc":
			case ".docx":
				return "application/msword";
			case ".xls":
			case ".xlsx":
				return "application/msexcel";
			case ".pdf":
				return "application/pdf";
		}
		return "text/plain";
	},
	//### 18 March 2020 UCD1KOR #####/// To display Insurance QuestionnaireName
	QuestionnaireName:function(name,value){
		var type = ""
		if (value == "00") {
			type = "Self";
		} else if (value == "01") {
			type = "Spouse";
		} else if (value == "02") {
			type = "Child 1";
		} else if (value == "90") {
			type = "Child 2";
		} else if (value == "03") {
			type = "Child 3";
		} else if (value == "04") {
			type = "Child 4";
		} else if (value == "05") {
			type= "Child 5";
		}
		
		if(name == undefined || name =="" ){
			name = "";
		}
		
		if(type== "" ){
			return "";
		}else{
			return name +" ( "+ type + " ) ";
		}
	},
	getNameAndDependentText: function(sType) {
		var oView = sap.ui.project.e2etm.util.StaticUtility.findView(this);
		var oData = oView.getModel("new").getData();
		var sTypeHR = sap.ui.project.e2etm.util.StaticUtility.mappingDependent(sType);
		if (sTypeHR == "") { //Self
			var sName = oData.ZZ_DEP_NAME;
		} else {
			//Dependent
			var iIndex = sap.ui.project.e2etm.util.StaticUtility.getArrayIndex(oData.EMPtoEMPDEPNDNT.results, "ZZ_DEP_TYP", sTypeHR);
			if (iIndex != -1) {
				var sName = oData.EMPtoEMPDEPNDNT.results[iIndex].ZZ_DPND_FNAME + " " +
					oData.EMPtoEMPDEPNDNT.results[iIndex].ZZ_DPND_LNAME;
			}
		}
		var iIndex = sap.ui.project.e2etm.util.StaticUtility.getArrayIndex(oData.DEPENDENT_TYPE.results, "DOMVALUE_L", sType);
		if (iIndex != -1) {
			sDependentText = oData.DEPENDENT_TYPE.results[iIndex].DDTEXT;
		}
		return "Name of member: " + sName + " (" + sDependentText + ")";
	},

	getQuestion: function(sKey) {
		var oView = sap.ui.project.e2etm.util.StaticUtility.findView(this);
		var oData = oView.getModel("new").getData();
		var iIndex = sap.ui.project.e2etm.util.StaticUtility.getArrayIndex(oData.QUESTION.results, "ZZ_QA_KEY", sKey);
		if (iIndex != -1) {
			return oData.QUESTION.results[iIndex].ZZ_QA_ANS;
		}
		return "";
	},

	//TGG1HC
	actionBy: function(value) {
		switch (value) {
			case "00":
				return "Saved";
			case "01":
				return "Submitted";
			case "02":
				return "Sendback";
			case "03":
				return "Approved";
			case "04":
				return "Re-Assigned";
			case "08":
				return "Rejected";
			case "09":
				return "Cancelled";
			case "14":
				return "Closed";
		}
	},
	dateApprove: function(value) {
		value = value.slice(0, 14);
		var year = value.slice(0, 4);
		var month = value.slice(4, 6);
		var day = value.slice(6, 8);
		var hour = value.slice(8, 10);
		var min = value.slice(10, 12);
		var sec = value.slice(12, 14);
		return day + "/" + month + "/" + year + " " + hour + ":" + min + ":" + sec;
	},
	//formatter icon
	iconFormat: function(ZZ_TRV_TYP) {
		switch (ZZ_TRV_TYP) {
			case "DEPU":
				return "./images/travel_type/D.png";
			case "BUSR":
				return "./images/travel_type/B.png";
			case "INFO":
				return "./images/travel_type/I.png";
			case "HOME":
				return "./images/travel_type/H.png";
			case "EMER":
				return "./images/travel_type/E.png";
			case "SECO":
				return "./images/travel_type/S.png";
			case "VISA":
				return "./images/travel_type/V.png";
		}
	},

	// TGG1HC

	isEmployee: function(value) {
		return value == "EMP";
	},
	// start Changes for cargo cancel button visible by Vanitha bashetty
	visibleCargoCancelBtn: function(role, nRole, action) {
		///########## UCD1KOR role GRM condition included #########////
		if(role == "GRM"){
			return false;
		}
		else if (role == "EMP") {
			if (nRole == "03" && action == "01")
				return false;
		}
		return true;
	},
	// end Changes for cargo cancel button visible by Vanitha bashetty
	isNotEmployee: function(value) {
		///########## UCD1KOR role GRM condition included #########////
		if(value ==  "GRM"){
			return false;
		}
		
		return value != "EMP";
	},
	isNotEmployeeSendBack:function(value){
		return value != "EMP";
	},

	getPolicyText: function(value) {
		return value != "EMP" ? "Policy Info" : "";
	},

	sapRadio: function(value) {
		if (value == undefined ) {
			return 2;
		} else {
			if (value == 'X') {
				return 0;
			} else {
				return 1;
			}
		}
	},

	//Editable field for admin only
	editableAdmin: function(value) {
		if (value == '02') { // Open
			return false;
		} else if (value == '00' || value == '01') { // Change
			return sap.ui.getCore().getModel("profile").getData().currentRole != "EMP";
		}
	},

	//Editable field for employee only
	editableEmployee: function(value,reqtype,reqstatusobj) {
	///////############################### UCD1KOR Nov 25, 2020 Create, Open === true ####################////////
	//////####################################################################################///////////////////	
		try{
			if (value == '02') { // Open
				if(reqstatusobj && reqstatusobj.ZZ_ACTION == "01" && reqstatusobj.ZZ_NROLE == "01"){
					var cond = false;
				}
				else{
					var cond = true;
				}
				if(reqtype == "DEPU" && cond){
					return true; 
				}else{
					return false; 
				}
			} else if (value == '00') { // Create
				return true;
			} else { //Change
				if (sap.ui.getCore().getModel("profile").getData().currentRole == "EMP") {
					return true;
				} else {
					return false;
				}
			}
		}catch(err){}
		
	},

	//visible only if that's not employee
	visibleNotEmployee: function() {
		if (sap.ui.getCore().getModel("profile").getData().currentRole == "EMP") {
			return false;
		} else {
			return true;
		}
	},

	setAcknowledgementCheck: function(value) {
		return value == '02' || sap.ui.getCore().getModel("profile").getData().currentRole != "EMP";
	},

	editableAction: function(value) {
		return value == "00" || value == "01" || value == "09";
	},

	getEndorsement: function(value) {
		switch (value) {
			case '':
				return "New";
			case '1':
				return 'Travel Extended';
			case '2':
				return 'Travel Shortened';
			case '3':
				return 'Change in dependents';
			case '4':
				return 'Dependent date change';
			case '5':
				return 'Cancelled';
		}
	},

	displayInsuranceSponsore: function(sType, sSponsore) {
		if (sType == "DEPU") {
			return true;
		}
		return false;
	},

	enableInsuranceSponsore: function(sType) {
		return sType == "BUSR" || sType == "INFO" || sType == "SECO";
	},

	getInsuranceFamilyStatus: function(sType) {
		switch (sType) {
			case "1":
				return "Single";
			case "2":
				return "Couple";
			case "3":
				return "Family";
			case "4":
				return "Single Parent";
		}
	},
	checkIfAALogistic: function(sCargoType) {
		switch (sCargoType) {
			case "O":
				return false;
			case "R":
				return false;
			case "V":
				return true;
			case "S":
				return true;
		}
	},
	checkIfDHL: function(sCargoType) {
		switch (sCargoType) {
			case "O":
				return true;
			case "R":
				return true;
			case "V":
				return false;
			case "S":
				return false;
		}
	},

	getTextCargoType: function(ZZ_CAR_TYP) {
		switch (ZZ_CAR_TYP) {
			case "O":
				return "./images/cargo_type/DHL.png";
			case "R":
				return "./images/cargo_type/DHL.png";
			case "V":
				return "./images/cargo_type/AA.png";
			case "S":
				return "./images/cargo_type/AA.png";
		}
	},
	// convert famillyaccommodation 
	getTextFamAcc: function(sFamAcc) {
		switch (sFamAcc) {
			case "":
				return "No";
			case "X":
				return "Yes";
		}
	},
	// convertNumber0: 
	convertNumber0: function(number) {
		if (number == "000000000000000") {
			return "";
		} else {
			return number;
		}

	},
	// format period cargo eligibility
	formatPeriod: function(sType, sPeriodFrom, sPeriodTo) {
		if(sPeriodFrom){
		sPeriodFrom = sPeriodFrom.substr(1);
		if (sType == "V" || sType == "V1") {
			if (sPeriodTo > 999) {
				return "AAL ONWARD JOURNEY " + sPeriodFrom + " days and above";
			} else {
				sPeriodTo = sPeriodTo.substr(1);
				return "AAL ONWARD JOURNEY " + sPeriodFrom + " to " + sPeriodTo + " days";
			}
		}

		if (sType == "S" || sType == "S1") {
			if (sPeriodTo > 999) {
				return "AAL RETURN JOURNEY " + sPeriodFrom + " days and above";
			} else {
				sPeriodTo = sPeriodTo.substr(1);
				return "AAL RETURN JOURNEY " + sPeriodFrom + " to " + sPeriodTo + " days";
			}
		}

		if (sType == "O" || sType == "O1") {
			if (sPeriodTo > 999) {
				return "DHL ONWARD JOURNEY " + sPeriodFrom + " days and above";
			} else {
				sPeriodTo = sPeriodTo.substr(1);
				return "DHL ONWARD JOURNEY " + sPeriodFrom + " to " + sPeriodTo + " days";
			}
		}

		if (sType == "R" || sType == "R1") {
			if (sPeriodTo > 999) {
				return "DHL RETURN JOURNEY " + sPeriodFrom + " days and above";
			} else {
				sPeriodTo = sPeriodTo.substr(1);
				return "DHL RETURN JOURNEY " + sPeriodFrom + " to " + sPeriodTo + " days";
			}
		}
		return "";
	}
		else{
			return "";
		}
	},
	//format eligibility
	formatEligibility: function(sCarLimit, sUnit) {
		return sCarLimit + " " + sUnit;
	},

	formatTicketCommentsDate: function(value) {
		if (value == "") {
			return "NA";
		} else {
			try {
				var date = value.split("T");
				return date[0].split("-").reverse().join("/");
			} catch (exc) {
				return "";
			}
		}
	},

	editableAdminAcc: function(value) {
		if (value == 'EMP') { // Open
			return true; // ucd1kor replaced with true
		} else if (value == 'ACCD') { // Change
			return true;
		} else if (value == 'ACCO') { // Change
			return true;
		}

	},
	editAdminAcc1: function(role, accType, asgGroup) {
		//// ucd1kor 23/05/2021 added below try catch
		try{
			var currentRole = sap.ui.getCore().getModel("profile").getData().currentRole;
			if(currentRole == "EMP"){
				return false;
			}
		}catch(err){}
		
		if (role == 'EMP') { // Open
			return false;
		} else if (role == 'ACCD' || role == "ACCO") { // Change
			if ((accType == "RBEI" || accType == "OHA") && asgGroup == "ACCI")
				return false;
			return true;
		}
	},
	editableReim: function(role, index, length, req, act) {
		if (role == 'EMP') {

			if (act != undefined) {
				if (act.length != 0) {
					if (length == length - index && req == true) {
						return true;
					} else {
						if (index == "0") {
							act.sort(function(version1, version2) {
								return version1.ZZ_VERSION - version2.ZZ_VERSION;
							});
							if (act[length - 1].ZZ_ACTION == "00" && act[length - 1].ZZ_NROLE == "01") {
								return true;
							} else if (act[length - 1].ZZ_ACTION == "02") {
								return true;
							} else {
								return false;
							}

						} else {
							return false;
						}
					}
				} else {
					return true;
				}

			}

		} else {

			return false;
		}

	},

	editableReim_1: function(role, index, length, req, act) {
		if (role == 'EMP') {
			if (act != undefined) {
				if (act.length != 0) {
					if (req == true) {
						status = true;
						return true;
					} else {
						if (index == "0") {
							if (req == true) {
								status = true;
								return true;
							} else {
								act.sort(function(version1, version2) {
									return version2.ZZ_VERSION - version1.ZZ_VERSION;
								});
								if (act[0].ZZ_ACTION == "00" && act[0].ZZ_NROLE == "01") {
									status = true;
									return true;

								} else if (act[0].ZZ_ACTION == "02") {
									status = true;
									return true;

								} else {
									status = false;
									return false;
								}
							}
						} else if (index != undefined) {
							if (status == "true") {
								return true;
							} else {
								return false;
							}
						}

					}
				} else {
					return true;
				}
			}
		} else {

			return false;
		}

	},

	editableFilterAcc: function(value) {
		if (value == "CANCELLED" || value == "CLOSED") {
			return false;
		}
	},

	inVisibleCustomer: function(trvcat, reqtype) {
		//      if(reqtype=="TRST")
		//      {
		//        return true;
		//      }
		//      else{
		if (trvcat == "VISA")
			return false;
		else
			return true;
		//      }

		
	},
	//start of change 5/7/2019
	inVisibleCustomer_new: function(trvcust){		
		if(trvcust != "")
			return true;
		else
			return false;
//		end of change 5/7/2019
		
	},visaPlanCheckBox: function(value) {
		if (value == "X") {
			return true;
		} else
			return false;
	},
	forexEmpNo: function(value) {
		if (value == "" || value == undefined) {
			return "";
		} else {
			return "Employee No: " + value;
		}
	},
	forexEmpName: function(value) {
		if (value == "" || value == undefined) {
			return "";
		} else {
			return "Employee Name: " + value;
		}
	},
	forexDepartment: function(value) {
		if (value == "" || value == undefined) {
			return "Department:NA";
		} else {
			return "Department: " + value;
		}
	},
	formatObjectStatus: function(value) {
		if (value == "X") {
			return "Success";
		} else {
			return "Error";
		}
	},
	formatObjectIcon: function(value) {
		if (value == "X") {
			return "sap-icon://accept";
		} else {
			return "sap-icon://decline";
		}
	},
	formatObjectAccIcon: function(traveltype, acc) {
		if (traveltype == "BUSR" || traveltype == "INFO" || traveltype == "SECO") {
			return "sap-icon://accept";
		} else {
			if (acc == "X") {
				return "sap-icon://accept";
			} else {
				return "sap-icon://decline";
			}
		}

	},
	formatObjectAccStatus: function(traveltype, acc) {
		if (traveltype == "BUSR" || traveltype == "INFO" || traveltype == "SECO") {
			return "Success";
		} else {
			if (acc == "X") {
				return "Success";
			} else {
				return "Error";
			}
		}

	},
	formatAmountValue: function(value) {
		if (value) {
			var oNumberFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
				maxFractionDigits: 2,
				groupingEnabled: true,
				groupingSeparator: ",",
				decimalSeparator: "."
			});

			return oNumberFormat.format(value);
		}
	},
	formatAmountValue1: function(value) {
		if (value == "" || value == undefined) {
			return 0.00;
		} else {
			var oNumberFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
				maxFractionDigits: 2,
				groupingEnabled: true,
				groupingSeparator: ",",
				decimalSeparator: "."
			});

			return oNumberFormat.format(value);
		}
	},
	formatAmountValueRec: function(value) {
		if (value == "" || value == undefined) {
			return 0.00;
		} else {
			///parseFloat(parseFloat(value).toFixed(2));
			var oNumberFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
				maxFractionDigits: 2,
				groupingEnabled: true,
				groupingSeparator: ",",
				decimalSeparator: "."
			});

			return oNumberFormat.format(value);
		}
	},
	formatTabs: function(tab, key) {
		if (key == "INTL") {
			return false;
		}
	},
	changeTableText: function(role) {
		if (role == "FINA") {
			return "Invoice Date";

		} else {
			return "Received Date";
		}
	},
	formatExchangeEdit: function(ptype, whichtab) {
		if (whichtab == "NEW" || whichtab == "" || whichtab == "NGREE" || whichtab == "CARD" || whichtab == "SBFT" || whichtab == "CHCLS") {
			if (ptype) {
				if (ptype == "EEFC") {
					return false;
				} else {
					return true;
				}
			}
		} else {
			return false;
		}
	},

	changeButtonText: function(trvcat) {
		if (trvcat == "VISA") {
			return "Edit VISA Request";
		} else {
			return "Edit Travel Request";
		}
	},
	datepicker: function(value) {
		if (value == "00000000")
			return "";
		else
			return value;
	},
	//    formatStyleClass:function(value){
	//    if(value=="X")
	//    return 'required';
	//    else
	//    return '';
	//    },

	formatFamilyAccompanied: function(value) {

		if (value) {
			return "Yes";
		} else
			return "No";
	},
	formatTravelAdvance: function(value) {
		if (value) {
			return value;
		} else
			return "";
	},
	formatMonth: function(value) {
		var monthNames = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November",
			"December"
		];
		return monthNames[parseInt(value)];
	},
	formatBooleanValue: function(value) {

		if (value == "X") {
			return true;
		} else
			return false;
	},

	formatMRTable: function(chck, role, action) {

		if (chck == "") {
			//if((role == "01"||role == "04"||role=="06")&&(action=="00"||action=="02"||action=="03"))
			if ((role == "" && action == "") || (role == "01" && action == "00") || (role == "04" && action == "02") || (role == "01" && action ==
					"01") || (role == "04" && action == "18") || (role == "04" && action == "03") || (role == "06" && action == "03") || (role == "09" &&
					action == "03")) {
				return true;
			} else {
				return false;
			}
		} else if (chck == "X") {
			return false;
		}

	},
	formatGender: function(value) {
		if (value == "1") {
			return "Male";
		} else if (value == "2") {
			return "Female";
		}
	},

	formatFamilyType: function(value) {
		if (value == "00") {
			return "Self";
		} else if (value == "01") {
			return "Spouse";
		} else if (value == "02") {
			return "Child 1";
		} else if (value == "90") {
			return "Child 2";
		} else if (value == "03") {
			return "Child 3";
		} else if (value == "04") {
			return "Child 4";
		} else if (value == "05") {
			return "Child 5";
		}
	},
	formatTransportType: function(value) {
		switch (value) {
			case "A":
				return "Air";
				break;
			case "T":
				return "Train";
				break;
			case "B":
				return "Bus";
				break;
			case "X":
				return "Taxi";
				break;
			case "O":
				return "Own Arrangements";
				break;

		}
	},
	//    formatTSCurrencyEditable:function(pacmp,traveltype,tabkey){
	//    if (tabkey == "NEW") {
	//    if (traveltype != "DOME") {
	//    if (pacmp == "" || pacmp == undefined || pacmp == 0) {
	//    return true;
	//    } else {
	//    return false;
	//    }
	//    } else
	//    return false;
	//    } else {
	//    return false;
	//    }
	//    },
	formatTSCurrencyEditable: function(pacmp, tabkey) {
		if (tabkey == "NEW") {
			if (pacmp == "" || pacmp == undefined || pacmp == 0) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	},
	formatTSCurrencyValue: function(currency, traveltype) {
		if (traveltype != "DOME") {
			return currency;
		} else {
			return "INR";
		}
	},
	formatPolicyExchangeRate: function(pcurrency, currency) {
		if (currency == pcurrency) {
			return false;
		} else
			return true;
	},
	inVisibleCommentArea: function(reqtype) {
		/////####### UCD1KOR Conditions included for CARR, CARO ###############////////
		if (reqtype == "TRST" || reqtype == "REIM" || reqtype == "CARD" || reqtype == "PYVR" || reqtype == "INRA" || reqtype == "CARR" || reqtype == "CARO") {
			return false;
		} else {
			return true;
		}
	},
	visibleFurtherAction: function(reqtype) {
		if (reqtype == "TRST" || reqtype == "CARD" || reqtype == "PYVR" || reqtype == "INRA"|| reqtype == "CARO"|| reqtype == "CARR") {
			return true;
		} else {
			return false;
		}
	},
	visibleForexStatusAmount: function(value) {
		if (value == "FSURR") {
			return false;
		} else {
			return true;
		}
	},
	visibleForexStatusAmountIcon: function(value) {
		if (value == "FSURR") {
			return false;
		} else if (value == "CARD") {
			return false;
		} else {
			return true;
		}
	},
	visibleForexTrstTables: function(value) {
		if (value == "FSURR" || value == "PSUR" || value == "SURR" || value == "CLSR") {
			return true;
		} else {
			return false;
		}
	},

	visibleCreditExpense: function(value) {
		if (value == "2") {
			return true;
		} else {
			return false;
		}
	},
	formatVisaAdminCheck: function(value) {
		if (value == true) {
			return false;
		} else {
			return true;
		}
	},
	visiblePDFButton: function(role, action) {
		if (role == "11" && action == "03") {
			return true;
		} else {
			return false;
		}
	},
	formatOHADropDown: function(value) {
		if (value == undefined || value == "" || value == " ") {
			return "No";
		} else {
			return value;
		}
	},

	visibleCIDivision: function(ctype) {
		if (ctype == "BSCH")
			return true;
		else
			return false;

	},
	visibleCIDepartment: function(division, ctype) {
		if (division == "CI" && ctype == "BSCH")
			return true;
		else
			return false;

	},
	areaPinCode: function(cargoType) {
		if (cargoType == "O" || cargoType == "V")
			return "Please enter Indian Pin code for Onward Cargo";
		else if (cargoType == "R" || cargoType == "S")
			return "Please fill Onsite PIN code for return Cargo";
	},
	setCargoMovtDateTooltip: function(cargoType) {
		if (cargoType == "O" || cargoType == "R")
			return "Cargo Date should be atleast 2 or 3 days prior to your deputation start or end Date";
		else if (cargoType == "V" || cargoType == "S")
			return "Cargo Date should be atleast 5-6 days prior to your deputation start or end Date";

	},
	visibleCargoPolicy: function(role, cargoType) {
		if (role == "EMP") {
			if (cargoType == "O" || cargoType == "R")
				return true;
			else
				return false;
		} else
			return false;
	},
	changeDate: function(value) {
		if (value != undefined && value != null && value != "" && value != "00000000" && value != "0000-00-00") {
			var formatValue = value.split("-");
			return formatValue[2] + "-" + formatValue[1] + "-" + formatValue[0];
		}
		return "NA";
	},

	// sap date return ddMMyyy format
	sapDateddMMyyyy: function(value) {
		if (value != null && value != "" && value != "00000000") {
			var oDateFormat = sap.ui.core.format.DateFormat
				.getDateTimeInstance({
					pattern: "ddMMyyyy"
				});
			return oDateFormat.format(new Date(value.substr(0, 4), value
				.substr(4, 2) - 1, value.substr(6, 2)));
		}
		return "NA";
	},

	//    formatter for travel status
	statusFormat: function(value) {
		if (value.substr(0, 2) == 'ff' || value.substr(0, 2) == 'FF') {
			switch (value) {
				case "ff001":
					return "TR Closed";
					break;
				case "FF001":
					return "TR Closed";
					break;
				case "ff002":
					return "TR Cancelled";
					break;
				case "FF002":
					return "TR Cancelled";
					break;
			}
		} else {
			switch (value.substr(2, 3)) {
				case "000":
					return "TR Saved";
					break;
				case "001":
					return "TR Sent for cancellation";
					break;
				case "002":
					return "TR Deleted";
					break;
				case "003":
					return "TR Submitted";
					break;
				case "004":
					return "";
					break;
				case "005":
					return "";
					break;
				case "006":
					return "Approved by GRM";
					break;
				case "007":
					return "Rejected by GRM";
					break;
				case "008":
					return "Sent back by GRM";
					break;
				case "009":
					return "Approved for cancellation";
					break;
				case "010":
					return "Rejected for cancelllation";
					break;
			}
		}

	},

	//    Formatter for Visa Type
	visaTypeFormat: function(value) {
		switch (value) {
			case "BUSR":
				return "Business";
				break;
			case "DPND":
				return "Dependent";
				break;
			case "TOUR":
				return "Tourist";
				break;
			case "TRNG":
				return "Training";
				break;
			case "WRKP":
				return "Work permit";
				break;
		}
	},

	//convert from key to text for country
	formatKeyCountry: function(country) {
		try {
			if (country) {
				var countryList = sap.ui.getCore().getModel("global").getData().country;
				for (var i = 0; i < countryList.length; i++) {
					//            if (countryList[i].MOLGA == country) {
					//            return countryList[i].LTEXT;
					//            }
					if (countryList[i].LTEXT == country) {
						return countryList[i].MOLGA;
					}

				}
			}
			return country;
		} catch (exc) {
			return country;
		}
	},

	formatNoFamilyMembers: function(amount) {
		try {
			if (amount == "") {
				return 0 + " members";
			}
			return amount + " members";
		} catch (exc) {
			return 0 + " members";
		}
	},
	formatApplicableCargo: function(sType) {
		if (sType == 'O' || sType == 'R' || sType == 'V' || sType == 'S') {
			return "For Employee";
		} else if (sType == 'O1' || sType == 'R1' || sType == 'V1' || sType == 'S1') {
			return "For Dependant";
		}
	},
	travelEstimateLabel: function(sLabel, sDept) {
		if (sDept == null) {
			return sLabel;
		} else {
			if (sLabel == 'X') {
				return "Not eligible";
			} else {
				switch (Number(sLabel)) {
					case 0:
						return "Associate can travel for 1 - 90 days";
						break;
					case 1:
						return "Associate can travel for 91 - 180 days";
						break;
					case 2:
						return "Associate can travel for 181 - 270 days";
						break;
					case 3:
						return "Associate can travel for 271 - 360 days";
						break;
					case 4:
						return "Associate can travel for 361 - 450 days";
						break;
					case 5:
						return "Associate can travel for 451 - 540 days";
						break;
					case 6:
						return "Associate can travel for 541 - 630 days";
						break;
					case 7:
						return "Associate can travel for more than 630 days";
						break;
				} //end switch
			} //end if not eligible
		}
	},

	None2Inactive: function(text) {
		if (text = "None") {
			return "Inactive";
		} else {
			return text;
		}

	},
	visibleCggsData: function(approved, trvreq, toCountry, asgtyp, reqtyp, trvcat) {
		if (approved && reqtyp == "DEPU" && trvcat == "WRKP") {
			if ((trvreq == "" || trvreq == "0000000000")) { // DH
				if (toCountry == "DE" && asgtyp == "STA") {
					return true;
				}
			}
		}
		return false;
	},
	visibleCggsPersonalData: function(trvreq, toCountry, asgtyp, reqtyp) {
		var role = sap.ui.getCore().getModel("profile").getData().currentRole;
		if (role == "EMP") {
			if (reqtyp == "DEPU") {
				if ((trvreq == "" || trvreq == "0000000000")) { // DH
					if (toCountry == "DE") {
						return true;
					}
				}
			}
		} else {
			if (reqtyp == "DEPU") {
				if ((trvreq == "" || trvreq == "0000000000")) { // DH
					if (toCountry == "DE" && asgtyp == "STA") {
						return true;
					}
				}
			}
		}
		return false;
	},
	editQmmScndt: function(scndt) {
		if (scndt == "" || (!scndt)) {
			return true;
		} else {
			return false;
		}
	},
	visibleCGGSFormsPanel: function(toCountry, asgType, trvCat, reqType, vreason, vreason_ex) {
		if(vreason == "DB" && vreason_ex == "EX"){ //uea6kor-uml6kor 27/8/2020  RBEIITAPPPIPELINE-217  for Extension date 
			return false;			
		}else if (toCountry == "DE" && asgType == "STA" && trvCat == "WRKP" && reqType == "DEPU") {
			return true;
		} else if (sap.ui.project.e2etm.util.StaticUtility.checkStvaAsg(asgType) && trvCat == "TRFR") {
			return true;
		}
		return false;
	},

//	 //start uea6kor-uml6kor 27/8/2020  RBEIITAPPPIPELINE-217  for Extension date 
//	visibleExtFormsPanel: function( vreason, vreason_ex) {
//		if(vreason == "DB" && vreason_ex == "EX"){ //uea6kor-uml6kor 27/8/2020  RBEIITAPPPIPELINE-217  for Extension date 
//			return true;			
//		}else{
//		return false;
//		}
//	},
	 //end uea6kor-uml6kor 27/8/2020  RBEIITAPPPIPELINE-217  for Extension date 

	returnFormsPanelText: function(toCountry, asgType, trvCat) {
		if (toCountry == "DE" && asgType == "STA" && trvCat == "WRKP") {
			return "CGGS Related Documents";
		} else if (sap.ui.project.e2etm.util.StaticUtility.checkStvaAsg(asgType) && trvCat == "TRFR") {
			return "Requisition Forms";
		}

	},
	visibleAllwFormsPanel: function(toCountry, asgType, trvCat, depType) {
		if ((asgType == 'STA' || asgType == 'STAPP' || asgType == 'TRNG') && (trvCat == "WRKP" || trvCat == "TRNG") && toCountry != 'DE' &&
			depType == "INTL") {
			return true;
		}
		return false;
	},
	visibleUploadBtns: function(value) {
		var role = sap.ui.getCore().getModel("profile").getData().currentRole;
		if (role == "DEPU" || role == "GRM") {
			return true;
		}
		return false;
	},
	formatMRFieldsOnCntry: function(chck, role, action, toCountry, trvky, asgType) {
		if (toCountry == "DE" && trvky == "DEPU" && asgType == "STA") {
			return false;
		} else {
			return sap.ui.project.e2etm.util.Formatter.formatMRTable(chck, role, action);
		}
	},
	enableBusinessOption: function(trvType, dpndType) {

		if (trvType == "BUSR" || trvType == "INFO" || trvType == "SECO" || trvType == "DEPU") {
			if (dpndType == "00")
				return true;

		}

		return false;
	},
	enableTouristOption: function(trvType, dpndType, familySpons) {
		if (trvType == "BUSR" || trvType == "INFO" || trvType == "SECO") {
			if (dpndType == "00")
				return false;
			else
				return true;
		} else if (trvType == "DEPU") {
			if (dpndType == "00")
				return false;
			else {
				if (familySpons == "X")
					return true;
			}
		}
		return false;

	},
	enableWRKPOption: function(trvType, dpndType) {
		if (trvType == "DEPU") {
			if (dpndType == "00")
				return true;
		}
		return false;

	},
	enableTRNGOption: function(trvType, dpndType) {
		if (trvType == "DEPU") {
			if (dpndType == "00")
				return true;
		}
		return false;

	},
	enableDPNDOption: function(trvType, dpndType) {
		if (trvType == "DEPU") {
			if (dpndType != "00") {
				return true;
			}

		}
		return false;
	},
	editablePayType: function(action, trvType) {
		if (trvType == "DEPU")
			return false;
		else {
			return sap.ui.project.e2etm.util.Formatter.editableEmployee(action);
		}
	},
	formatResvDate: function(value) {
		return value.substr(6, 2) + "/" + value.substr(4, 2);
	},
	formatColor: function(value) {
		if (value == "A")
			return "color_green";
	},
	formatBookingText: function(value) {
		if (value == "B")
			return "Book";
		else if (value == "M")
			return "Modify";
		else if (value == "C")
			return "Closed";
	},
	enableBookingOption: function(value) {
		if (value == "B" || value == "M")
			return true;
		else
			return false;
	},
	formatAccReportValues: function(value, currency) {
		if (value == "" || !(value))
			return 0.00;
		else {
			var oLocale = new sap.ui.core.Locale("en-US");
			var oFormatOptions = {
				maxFractionDigits: 2,
				groupingEnabled: true,
				groupingSeparator: ','
			};

			var oFloatFormat = sap.ui.core.format.NumberFormat.getFloatInstance(oFormatOptions, oLocale);
			return oFloatFormat.format(oFloatFormat.parse(value));
		}

	},
	formatBookingReportValues: function(value, currency) {
		if (value == "" || !(value))
			return "--";
		else {
			var oLocale = new sap.ui.core.Locale("en-US");
			var oFormatOptions = {
				maxFractionDigits: 2,
				groupingEnabled: true,
				groupingSeparator: ','
			};

			var oFloatFormat = sap.ui.core.format.NumberFormat.getFloatInstance(oFormatOptions, oLocale);
			return oFloatFormat.format(oFloatFormat.parse(value));
		}

	},
	formatTotalAccReportValues: function(value, currency) {
		if (value == "" || !(value))
			return 0.00;
		else {
			var oLocale = new sap.ui.core.Locale("en-US");
			var oFormatOptions = {

				maxFractionDigits: 3,
				currencyCode: false,

			};

			var oFloatFormat = sap.ui.core.format.NumberFormat.getCurrencyInstance(oFormatOptions, oLocale);
			return oFloatFormat.format(value, currency);
		}

	},

	formatReservationStatus: function(value) {
		if (value == "C") {
			return "Booked";
		} else if (value == "B") {
			return "Blocked";
		} else if (value == "M")
			return "Blocked for Maintenance";
	},
	visibleReservation: function(value) {
		if (value == "ACCI" || !(value) || Array.isArray(value)) {
			return true;
		}
		return false;
	},
	formatHcodeLeadZero: function(value) {
		if (value != "" && value) {
			if (value.charAt(0) == "0")
				return '="' + value + '"';
		}
		return value;
	},
	visibleResEmpDetails: function(value) {
		if (value == "9999999999") {
			return false;
		}
		return true;
	},
	visibleTransferFields: function(trvCat, depType) {
		if (trvCat == "TRFR" && depType == "INTL")
			return true;
		return false;
	},

	editPassportFields: function(value, editable) {
		if (editable) {
			return true;
		}
		return false;
	},
	/* --------------------------------TinhTD */
	isINTL: function(sType) {
		if (sType === "INTL") {
			return true;

		} else {
			return false;
		}
	},
	isEnable: function(sType) {
		if (sType === "Y") {
			return true;

		} else {
			return false;
		}

	},
	checkPsgChild: function(nPsg) {
		var bIsChild = "true";
		if (nPsg !== undefined) {
			if (parseInt(nPsg) !== 0) {
				bIsChild = false;
			}
		}
		return bIsChild;

	},
	sponsorCostFieldVisible: function(sFundKey) {
		var bVisible = false;
		if (sFundKey === "F01" || sFundKey === "F07" || sFundKey === "F08") {
			bVisible = true;
		}
		return bVisible;
	},
	sponsorProjFieldVisible: function(sFundKey) {
		var bVisible = false;
		if (sFundKey !== "F01") {
			bVisible = true;
		}
		return bVisible;
	},
	sponsorCusFieldVisible: function(sFundKey) {
		var bVisible = false;
		if (sFundKey === "F03") {
			bVisible = true;
		}
		return bVisible;
	},
	//get month name by month number
	getMonthName: function(dt) {
		if (dt) {
			mlist = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
			return mlist[dt.getMonth()];
		} else {
			return "";
		}

	},
	/// add suffix 1st 2nd .. to number
	add_number_suffix: function(i) {
		if (i) {
			var j = i % 10,
				k = i % 100;
			if (j == 1 && k != 11) {
				return i + "st";
			}
			if (j == 2 && k != 12) {
				return i + "nd";
			}
			if (j == 3 && k != 13) {
				return i + "rd";
			}
			return i + "th";
		} else {
			return "";
		}

	},
	keepDateAlways: function(sInput) {
		if (sInput) {
			if (sInput.indexOf("/") === -1) {

				var sDate = this.ymToDMY(sInput);
				return sDate;
			} else {
				return sInput;
			}
		}

	},
	//convert yyyymmdd to dd/mm/yyyy
	ymToDMY: function(sYM) {

		var year = sYM.substring(0, 4),
			month = sYM.substring(4, 6),
			day = sYM.substring(6, 8);

		return day + '/' + month + '/' + year;
	},
	//convert yyyymmdd to mm/dd/yyyy
	ymToMDY: function(sYM) {

		var year = sYM.substring(0, 4),
			month = sYM.substring(4, 6),
			day = sYM.substring(6, 8);

		return month + '/' + day + '/' + year;
	},
	//convert date from dd/mm/yyyy to yyyymmdd
	dateToYM: function(sDate, nDay) {
		var aSDate = sDate.split('/');
		if (nDay) {
			var sDate = aSDate[2] + aSDate[1];
			var sFDay = parseInt(aSDate[0]) + parseInt(nDay);
			if (parseInt(aSDate[0]) < 9) {
				sFDay = "0" + sFDay;
			}
			return sDate + sFDay;
		}
		return aSDate[2] + aSDate[1] + aSDate[0];
	},
	plusDayToDMY: function(sDate, nDay) {
		var aSDate = sDate.split('/');
		if (nDay) {
			return parseInt(aSDate[0]) + nDay + "/" + aSDate[1] + "/" + aSDate[2];
		} else {
			return sDate
		}
	},
	_injectPPFileName: function(sFileName) {
		var sName = "";
		sName = "Passport." + sFileName.substring(sFileName.length - 3, sFileName.length);
		return sName;

	},
	isEnabledDelete: function(sZStatus) {
		var bIsEnabled = false;
		if (sZStatus) {
			var sState = sZStatus.substring(2, sZStatus.length);
			if (sState === "000") {
				bIsEnabled = true;
			}
		}

		return bIsEnabled;
	},
	//dye5kor
	mcrVisible:function(Mcr){
		if(Mcr==undefined){
			Mcr = false;
		}
	return Mcr;
	},
	//dye5kor
	desableCheckBox:function(val,edit){
		if(val =="EMP" && edit == true){ 
			return true;
		}
		else {
			return false;
		}
		
	},
	//UCD1KOR 2 Dec 2019
	// Cost element Editable false for Fund F03,F04 and F08
	/// ###### UCD1KOR Dec 10 2019 ########////
	desableCostCenter:function(fund,future,EnableCostCenterForF08){
		//#######################################################//
		// UCD1KOR 23 Mar 2021 Included F08 in below if condition //
		/// ???Cost Center??? should be disabled. added
		if(EnableCostCenterForF08 == false && fund == "F08"){
			return false;
		}
		
		if(fund == "F03" || fund =="F04" || fund =="F08"){
			return false;
		}
		else if((fund == "F01"|| fund =="F02" || fund =="F08")&& future == false){
			return false;
		}
		else{
			return true;
		}
	},
	/*UCD1KOR 18 Dec 2019 converting yyyymmdd format to dd-mm-yyyy*/
	DateFormatForCargo:function(value){
		if(value == "" || value== undefined || value=="00000000"){
			return "NA";
		}
		else{
			return value.substring(6,8)+"-"+value.substring(4,6)+"-"+value.substring(0,4);
		}
	
		
	},
	NameFormat:function(name){
		if(name=="" || name== undefined){
			return "NA";
		}
		else{
			return name.substr(0,1)+name.substr(1).toLocaleLowerCase();

		}
	},
	NameFormatPYVR:function(name){
		if(name=="" || name== undefined){
			return "";
		}
		else{
			try{
				var val = name.split("-");
				if(val.length == 2){
					var splitvalue1 = val[0].trim();
					var splitvalue2 = val[1].trim();
					return splitvalue1.substr(0,1)+splitvalue1.substr(1).toLocaleLowerCase() +"-"+splitvalue2.substr(0,1)+splitvalue2.substr(1).toLocaleLowerCase();
				}
				else{
					return name.substr(0,1)+name.substr(1).toLocaleLowerCase();
				}
			}catch(err){}
		}
		
	},
	/*UEA6KOR 3.1.2019 converting yyyymmdd format to dd-mm-yyyy*/
	EmpGroupSetlUnsetlReport:function(group){
		if(group == "" || group== undefined){
			return "NA";
		}
		else{
			if(group == "1")
			return "Active";
			else if (group == "5")
			return "Outbound";
			else if (group == "7")
			return "Inbound"; 
		    else if (group == "9")
			return "External"; 
			
		}
	},
	RecDtSetlUnsetlReport:function(recvdt){
		if(recvdt == "    -  -  " || recvdt == undefined){
			return "NA";
		}
		else{
			var date = recvdt.split("-")[2]+"/"+recvdt.split("-")[1]+"/"+recvdt.split("-")[0]
			return date;

			/*mnth = recvdt.substring(5,7);
			if(mnth){
				mlist = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov",
					"Dec"];

				return mlist[parseInt(mnth)]+"'"+recvdt.substring(0,4);
			
			}*/
			//return "'"+recvdt.substring(0,4);
		}
	},
	/*UCD1KOR status text changing*/
	ClosedOPenStatus:function(status){
		
		if(status == "C"){
			return "Closed"
		}
		else{
			return "Open"
		}
		 
		
	},

	/**- start added by uml6kor 7/12/2020 RBEIITAPPPIPELINE-833_4*/
	EmpStatusSetlUnsetlReport:function(estat){
		if(estat == "" || estat == undefined){
			return "NA";
		}
		else{
			if(estat == "1")
				return "Active";
			else 
				return "--"; 
		}
	},
	/**- end added by uml6kor 7/12/2020 RBEIITAPPPIPELINE-833_4*/ 
	
	/* ########### 10 APR 2020 Adding conditions for Repatriation Process*/
	VisibleButtons:function(role){
		if(role =="EMP" && role == "REPP"){
			return false;
		}
		else{
			return true;
		}
	},
	VisibleNavBackButtons:function(role,display){
		if(role =="REPP" && display !="NoActions"){
			return true;
		}
		else{
			return false;
		}
	},
	VisibleSubmitButtonWithCondition:function(role,ZZ_NEXTACTION,ZZ_REP_PERNR){
		if(role== "EMP" && ZZ_NEXTACTION ==ZZ_REP_PERNR ){
			return true;
		}
		else{
			return false;
		}
		
	},
	VisibleSendBackButtons:function(role,endDate,display){
		var endDate = sap.ui.project.e2etm.util.StaticUtility.checkDateInPast(endDate) ;
		if(role !="EMP" && display !="NoActions"){
			return true;
		}
		else{
			return false;
		}
	},
	VisibleApproveButtons:function(role,endDate,display){
//		var endDate = sap.ui.project.e2etm.util.StaticUtility.checkDateInPast(endDate) ;
		var sydate = new Date();
		var trvDatepre = new Date(endDate.substr(0, 4), endDate.substr(4, 2) - 2, endDate.substr(6, 2));//one month prior
		sydate = new Date(sydate.toDateString());
	
//		if(role !="EMP" && endDate && display !="NoActions"){
		if(role !="EMP" && (trvDatepre <= sydate) && display !="NoActions"){
			return true;
		}
		else{
			return false;
		}
	},
	VisibleEMpReason:function(val){
		if(val == 2){
			return true;
		}
		else{
			return false;
		}
	},
	VisibleMNGRReason:function(val){
		if(val == 2){
			return true;
		}
		else{
			return false;
		}
	},
	VisibilityHRBPForms:function(role){
		if(role =="EMP" || role =="GRM"){
			return false;
		}
		else{
			return true;
		}
	},
	ManagerFormEnabled:function(role,nextAction,empNo){
		if(role== "GRM" && nextAction == empNo ){
			return true;
		}
		else{
			return false;
		}
	},
	travrlToDesc:function(val){
		if(val == "" || val == undefined){
			return "NA";
		}
		else if(val == "GLOB"){
			return "Global Customer";
		}
		else if(val == "INBO"){
			return "Within Bosch";
		}
		else if(val == "INRB"){
			return "Within RBEI";
		}
	},
	enableHRBPForms:function(role,display){
		if(role =="REPP"  && display !="NoActions"){
			return true;
		}
		else{
			return false;
		}
	},
	enableHRBPComments:function(role,display){
		if(role =="REBP"  && display !="NoActions" ){
			return true;
		}
		else{
			return false;
		}
	},
	changeDateFormat:function(date,time){
		if(date && time){
			return date.substring(6,8)+"/"+date.substring(4,6)+"/"+date.substring(0,4)+","+time.substring(0,2)+":"+time.substring(2,4);
		}
	},
	RoleText:function(role){
		if(role =="01"){
			return "Employee"
		}
		else if(role =="02"){
			return "Manager"
		}
		else if(role =="13"){
			return "HRBP"
		}
		else if(role =="14"){
			return "HRL-PP3"
		}
	},
	enableDownloadPDf:function(role,action){
		if(role =="14" && action =="03"){
			return true;
		}
		else {
			return false;
		}
	},
	visibleReportButton:function(role){
		
		if(role =="REBP"  || role =="REPP" ){
			return true;
		}
		else{
			return false;
		}
	},
	VisibleComma:function(val){
		if(val !=""){
			return true;
		}
		else{
			return false;
		}
	},
	
	DigiFlag:function(val){
		if(val =="X" || val =="x"){
			return true;
		}
		else{
			return false;
		}
	},
	visiblePaidByColumn:function(lodging,loggedInUser,requestWith){
		if(lodging.expenses[0] && lodging.expenses[0].BookedBy != "" && lodging.expenses[0].BookedBy != undefined){
			return true;
		}
		else if(loggedInUser == requestWith){
			return true;
		}
		else if(requestWith == ""){
            return true;
        }
		else {
			return false;
		}
	},
	
	tooltipBookedBy:function(BookedBy){
		if(BookedBy == "ACCO"){
			return "RBEI Accommodation Desk";
		}
		else if(BookedBy == "HOTE"){
			return "RBEI Hotel Desk";
		}
		else if(BookedBy == "OTHE"){
            return "Others";
        }
		else {
			return "";
		}
	},
	tooltipType:function(type){

		if(type == "KITA"){
			return "Kit Allowances";
		}
		else if(type == "MEDI"){
			return "Medical Claims";
		}
		else if(type == "MISC"){
            return "Miscellaneous/Others";
        }
		else if(type == "COVBO"){
            return "Covid 19 - Boarding";
        }
		else if(type == "COVLO"){
            return "Covid 19 ??? Lodging";
        }
		else if(type == "COVOT"){
            return "Covid 19 ??? Others";
        }
		else {
			return "";
		}
	
	},
	optionName:function(sVal){
		
		if(sVal == "1"){
			return "Option 1"
		}else if(sVal == "2"){
			return "Option 2"
		}else if(sVal == "3"){
			return "Option 3"
		}else{
			return "Option 4"
		}
		
	},
	optionSelected:function(sVal){
		if(sVal == "X"){
			return true;
		}
		else{
			return false;
		}
	},
	ItemName:function(sVal){
		try{
			if(sVal.trim() == "1"){
				return "Item 1"
			}else if(sVal.trim() == "2"){
				return "Item 2"
			}else if(sVal.trim() == "3"){
				return "Item 3"
			}else if(sVal.trim() == "4"){
				return "Item 4"
			}
			else if(sVal.trim() == "5"){
				return "Item 5"
			}
			else if(sVal.trim() == "6"){
				return "Item 6"
			}
			else if(sVal.trim() == "7"){
				return "Item 7"
			}
		}catch(err){}
		
		
	},
	AddChargeText:function(val){
		if(val === "01"){
			return "Reissuance charges";
		}
		else if(val === "02"){
			return "Cancellation charges";
		}
		else if(val === "03"){
			return "Side trip ticket";
		}
		else if(val === "04"){
			return "Others";
		}
		else{
			return "-";
		}
	},
	OptionsVisibility:function(val){
		if(val === "X" || val ==="x"){
			return true;
		}
		else{
			return false;
		}
	},
	DateTimeFormat:function(val){
		if(val){
			var data = val.split("T")[0];
			if(data){
				if(data.split("-")){
					var date =data.split("-");
					return date[2]+"/"+date[1]+"/"+date[0];
				}else{
					return "NA";
				}
			}
			else{
				return "NA";
			}

		}
	},
	DateTimeFormat1:function(val){
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
	},
	//*********************************start of code  paging 9/9/2020 uml6kor***********************************
	formatPageInitatorRole:function(role){
		if(role == "FEX" || role == "FINA" || role == "TRST" || role == "TRSD"){
			return true;
			
		}else{
			return false;
		}
		
	},
	//*********************************end of code paging 9/9/2020 uml6kor***********************************
	
	//*********************************UEA6KOR_15.9.2020 Personal trip during official travels_RBEIITAPPPIPELINE-176 ***********************************
	VisiblePersonalTrip:function(trvtype, smodid){
		if(trvtype == "BUSR" && smodid == "INTL" ){
			return true;
			
		}else{
			return false;
		}
		
	},
	hideNonMedicalAmount:function(val){
		if(val == "0.0" || val =="0" || val ==""){
			return false;
		}
		else{
			return true;
		}
	},
	//////////////////////////////################ UCD1KOR Nov 19,2020 #####################///////////////////
	visibleInsrMessage:function(ZZ_DEP_TYPE,ZZ_TRV_CAT,ZZ_REQ_TYP){
		if(ZZ_DEP_TYPE === "INTL" && ZZ_TRV_CAT === "TRFR" && ZZ_REQ_TYP === "DEPU"){
			return true;
		}
		else{
			return false;
		}
		
	},
	dateFormat:function(val){
		
		if(val==="0000-00-00" || val ===""){
			return "NA";
		}else{
			try{
				var date = val.split("-");
				return date[2]+"/"+date[1]+"/"+date[0];
			}catch(err){}
			
		}
		
	},
	visibleoldTraveller:function(val){
		if(val.length !== 0){
			return true;
		}
		else{
			return false;
		}
		
	},
	removeQuesnire:function(val){
		if(val == true || val =="true"){
			return false;
		}
		else{
			return true;
		}
	},
	showNA:function(val){
		if(val !== ""){
			return val;
		}
		else{
			return "NA";
		}
	},
	showNALead:function(val){
		if(val == "" || val == null){
			return "NA";
		}
		else{
			return val;
		}
		
	},
	//start of code uml6kor _2-2-2021 added trvlsetl chnages RBEIITAPPPIPELINE-197_11
	BoardingTRST: function(flag){
		if(flag == "X"){
			return true;
		}
		else{
			return false;
		}
	},
	NumericType:function(val){
		if(val > 100){
			return "Error";
		}
		else if(val > 75){
			return "Critical";
		}
		else if(val > 55){
			return "Neutral";
		}
		else if(val >25){
			return "Good";
		}
		else{
			return "Good";
		}
	},
	formatTextCountry: function(country) {
		try {
			if (country) {
				var countryList = sap.ui.getCore().getModel("global").getData().country;
				for (var i = 0; i < countryList.length; i++) {
					if (countryList[i].MOLGA == country) {
						return countryList[i].LTEXT;
					}
					else if(country =="ROW"){
						return "Rest of World";
					}
				}
				return country;
			}
			else{
				return "NA";
			}
			
		} catch (exc) {
			return country;
		}
	},
	hideImgeForF08:function(val){
		if(val == true || val == "true"){
			return true;
		}
		else{
			return false;
		}
		
	},
	desableUrl:function(url){
		if(url == "" || url == null){
			return false;
		}
		else{
			return true;
		}
	},
	ArrangeStatus: function(role,action){
		if( role == '01' && action == '01'){
			return "Submitted by Employee";
		}
		else if (role == '02' && action == '02')
			{
			return "Sent back by Manager";
			}
		else if (role == '02' && action == '03')
			{
			return "Approved by Manager";
			}
		else if (role == '14' && action == '02')
			{
			return "Sent back by HRL-PP";
			}
		else
			{
			return " ";
			}
	}, 
 


	//end of code uml6kor _2-2-2021 added trvlsetl chnages RBEIITAPPPIPELINE-197_11

//	<!-- start uml6kor 4/5/2021  RBEIITAPPPIPELINE-1350 (Feedback form) -->
	RatingDescr: function(rkey){ 
		var data = sap.ui.getCore().getModel("global").getData().ratings;
		if(rkey != null){
			rkey = rkey.toString();
			for(var i = 0; i<data.length;i++)
			{
				if(data[i].Rating_Key.trim() == (rkey && rkey.trim())){
					return data[i].Description;
				}
				if(rkey && (rkey.trim() == "0" || rkey.trim() == "NA")){
					return "";
				}
			}	
		}
	},
	newDateFormatforDate:function(val){
		if(val){
			return val.substring(6,8)+ "/"+ val.substring(4,6) +"/"+val.substring(0,4);
		}else{
			return "NA"
		}
	},
	VisibleFema:function(val,role){
		
		if(val == true && role == "FINA"){
			return true;
		}
		else{
			return false;
		}
		
	},
	enableEvUrl:function(val){
		if(val == ""){
			return false;
		}
		else{
			return true;
		}
	},
	RecoveryEditable : function(action, role)
	{
		if(action == '03' && role == '12')//action == '03' && role == '12' action == '00' && role == '11'
			{
			return true;
			}
		else
			{
			return false;
			}
	},
	//Ucd1kor 6 June 2021, Settle/Unsettle Report
	TravelSettlementStatus:function(action, role){
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
		
	},
	CopyRequestTitle:function(data){
		if(data != null){
			try{
				if(data.ZZ_REQ_TYP == "BUSR"){
					var reqtype= "Business Travel";
				}else if(data.ZZ_REQ_TYP == "DEPU"){
					reqtype="Deputation Travel";
				}else if(data.ZZ_REQ_TYP == "INFO"){
					reqtype = "Info Travel";
				}else if(data.ZZ_REQ_TYP == "SECO"){
					reqtype = "Secondary Travel";
				}
				
				if(data.ZZ_DEP_STDATE !="" && data.ZZ_DEP_ENDATE !=""){
					var fromdate = data.ZZ_DEP_STDATE.substring(6,8) +"."+data.ZZ_DEP_STDATE.substring(4,6)+"."+data.ZZ_DEP_STDATE.substring(0,4);
					var enddate = data.ZZ_DEP_ENDATE.substring(6,8) +"."+data.ZZ_DEP_ENDATE.substring(4,6)+"."+data.ZZ_DEP_ENDATE.substring(0,4);
					return reqtype +", "+ data.ZZ_DEP_FRMLOC_TXT +" to "+ data.ZZ_DEP_TOLOC_TXT+ ", "+fromdate +" to "+ enddate;
				}
				else{
					return reqtype +", "+ data.ZZ_DEP_FRMLOC_TXT +" to "+ data.ZZ_DEP_TOLOC_TXT;
				}
			}catch(err){}
		}
	},
	CopyRequestDesc:function(data){
		if(data != null){
			try{
				if(data.ZZ_TRV_REQ !== ""){
					var tpno = data.ZZ_TRV_REQ;
				}else{
					tpno = "NA";
				}
				
				if(data.ZZ_GEBER !== ""){
					var fund = data.ZZ_GEBER.split("(")[0];
				}
				else{
					fund="NA";
				}
				if(data.ZZ_FSTL !== ""){
					var budgetcntr = data.ZZ_FSTL.split("(")[0];
				}
				else{
					budgetcntr="NA";
				}
				if(data.ZZ_KOSTL !== ""){
					var costcntr = data.ZZ_KOSTL;
				}
				else{
					costcntr="NA";
				}
				if(data.ZZ_FIPEX !== ""){
					var budgetcode = data.ZZ_FIPEX.split("(")[0];
				}
				else{
					budgetcode="NA";
				}
				if(data.ZZ_FIPOS){
					var wbs = data.ZZ_FIPOS.split("(")[0];
				}
				else{
					wbs="NA";
				}
				if(costcntr == "NA"){
					return "TP- " + tpno +" ( "+fund+"/ "+budgetcntr+"/ "+wbs+"/ "+budgetcode +" )";
				}
				else if(wbs == "NA"){
					return "TP- " + tpno +" ( "+fund+"/ "+budgetcntr+"/ "+costcntr+"/ "+budgetcode +" )";
				}
				else{
					return "TP- " + tpno +" ( "+fund+"/ "+budgetcntr+"/ "+costcntr+"/ "+wbs+"/ "+budgetcode +" )";
				}
			}catch(err){}
		}
	},
	DesableEndforDOMETrfr:function(val,globalData){
		if(globalData.TrfrFlag === "X"){
			return false;
		}
		else if(val === true){
			return true;
		}
		else{
			return false;
		}
	},
	DesableForManager:function(data){
		var val = sap.ui.getCore().getModel("profile").getData().currentRole;
		if(val){
			return false;
		}
		else{
			return true;
		}
	},
//					<!-- end uml6kor 4/5/2021  RBEIITAPPPIPELINE-1350 (Feedback form) -->
//				
	
//	PersonalTripEditable:function(role,status){
//		substatus = status.substring(2, 5) 
//		if(role == "EMP" && substatus == "000"){
//			return true;
//		}else{
//			return false;
//		}
//	}
	//*********************************UEA6KOR_15.9.2020 Personal trip during official travels_RBEIITAPPPIPELINE-176 ***********************************
	

	/*-------------------------------End TinhTD*/

};