sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/model/odata/v2/ODataModel",
  ], function (UIComponent, ODataModel) {
	"use strict";
  
	return UIComponent.extend("khrapun.pavel.Component", {
	  metadata: {
		manifest: "json"
	  },

	    /**
       * Controller's "init" lifecycle method.
       */
  
	  init : function () {
		UIComponent.prototype.init.apply(this, arguments);

		/**
    * Create JSON models, for correct display columns "Customer Name" and "Manager Name"
    * Create odata model.
	* 
    * @param {sap.ui.base.Event} oEvent the event object
    *
    */
	
		const onDelAppSucces = (deliveryApplicationsObject) => {
			oODataModel.read("/Customers", {success: (customersObject) => {
				const deliveryAppModel = new sap.ui.model.json.JSONModel({
					DeliveryApplications: deliveryApplicationsObject.results.map(el => {
						return {...el, CustomerName: customersObject.results.find(element => element.Id === el.CustomerId).Name}
					})
				})
				this.setModel(deliveryAppModel, "JSONDeliveryApplictionsModel")
				this.setModel(oODataModel, "serverData")
				this.getRouter().initialize();
			}})
		}

		/**
    * Create JSON model, for correct display column "Customer Name" and "Manager Name" in Delivery table
    *
    * @param {sap.ui.base.Event} oEvent the event object
    *
    */

		const onDelSucces = (deliveryObject) => {
			oODataModel.read("/Customers", {success: (costomersObject) => {
				oODataModel.read("/Employees", {success: (employeesObject) => {
				const deliveryModel = new sap.ui.model.json.JSONModel({
					Delivery: deliveryObject.results.map(el => {
						return {...el, CustomerName: costomersObject.results.find(element => element.Id === el.CustomerId).Name}
					}).map(el => {
						return {...el, ManagerName: employeesObject.results.find(element => element.Id === el.ManagerId).Name}})
				})
				this.setModel(deliveryModel, "JSONDeliveryModel")
			}})
			}})
		}

		var oODataModel = new ODataModel("http://localhost:3000/odata", {
		  useBatch: false,
		  defaultBindingMode: "TwoWay",
		  refreshAfterChange: "Enable"
		});

		oODataModel.read("/Deliveries", {success: onDelSucces})
		oODataModel.read("/DeliveryApplications", {success: onDelAppSucces})

	  },
	});
  });