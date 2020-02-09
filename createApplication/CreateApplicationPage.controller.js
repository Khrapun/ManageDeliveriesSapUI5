sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"../model/formatter",
	"sap/m/MessageToast",
	"sap/ui/core/format/DateFormat",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Controller, formatter,MessageToast, DateFormat, JSONModel, Filter, FilterOperator) {
	"use strict";

	/**
     * Controller for product info
     * @class
     */

	return Controller.extend("khrapun.pavel.controller.ThirdPage", {
		formatter: formatter,
      /**
       * Controller's "init" lifecycle method.
       */


	onInit: function () {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		oRouter.getRoute("thirdPage")
	},

	getEnderedData: function() {
		this.cusId = this.byId('cusId').getValue();
		
		this.cusName = this.byId('cusName').getValue();
		this.cusEmail = this.byId('cusEmail').getValue();
		this.cusPhone = this.byId('cusPhone').getValue();
		this.cusIndustry = this.byId('cusIndustry').getValue();

		this.delFrom = this.byId('delFrom').getValue();
		this.delTo = this.byId('delTo').getValue();
		this.delDate = this.byId('delDate').getValue();
		var delComment = this.byId('delComment').getValue();
	},

	onOpenNavFirst: function(){

		var cusId = this.byId('cusId').getValue();
		
		var cusName = this.byId('cusName').getValue();
		var cusEmail = this.byId('cusEmail').getValue();
		var cusPhone = this.byId('cusPhone').getValue();
		var cusIndustry = this.byId('cusIndustry').getValue();

		var delFrom = this.byId('delFrom').getValue();
		var delTo = this.byId('delTo').getValue();
		var delDate = this.byId('delDate').getValue();
		var delComment = this.byId('delComment').getValue();


		const oOdataModel = this.getView().getModel('serverData')

		if(cusId & !cusName & !cusEmail & !cusPhone & !cusIndustry) {
	
			var oNewDelyveryApp = {
				CreatedDate: new Date().toISOString(),
				RequestedDate: new Date().toISOString(),
				FromAddress: delFrom,
				ToAddress: delTo,
				Comment: delComment,
				CustomerId: cusId-0,
				StatusCode: "DELIVERY_APPL_CREATED"
			};

			
		oOdataModel.create('/DeliveryApplications', oNewDelyveryApp, {
			success: () => {
				MessageToast.show('Delivery Application add.');
			}
		});
		}

		else if(!cusId){

			var oNewCustomer =   {
				Name: cusName,
				Email: cusEmail,
				PhoneNumber: cusPhone,
				Address: "string",
				Photo: "string",
				Industry: cusIndustry,
				WorkSinceDate: new Date().toISOString(),
				Rating: 0,
				Feedback: "string"
			  };
			
		oOdataModel.create('/Customer', oNewCustomer, {
			success: (e) => {

				var oNewDelyveryApp = {
					CreatedDate: new Date().toISOString(),
					RequestedDate: new Date().toISOString(),
					FromAddress: delFrom,
					ToAddress: delTo,
					Comment: delComment,
					CustomerId: e.Id,
					StatusCode: "DELIVERY_APPL_CREATED"
				};

				oOdataModel.create('/DeliveryApplication', oNewDelyveryApp, {
					success: () => {
						MessageToast.show('Delivery Application and Customer add.');
					}
				});
			}
		});

		}

		else {
			MessageToast.show('Please, choose one of the options: "Enter customer Id" OR "Create customer"');
			return
		}

		var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		oRouter.navTo("firstPage");

	},

	onOpenNavSecond: function(){
		var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		oRouter.navTo("secondPage", {
			id: this.getView().getBindingContext('odata').sPath
		  });
	  },

	});
});