sap.ui.define([], function () {
	"use strict";
	return {
    dateConvert: function (sDate) {
		var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "YYYY/MM/dd" });   
		var dateFormatted = dateFormat.format(sDate);
		return dateFormatted
	},

	};
});
