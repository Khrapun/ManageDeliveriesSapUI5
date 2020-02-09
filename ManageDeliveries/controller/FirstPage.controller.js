sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"../model/formatter",
	"sap/m/MessageToast",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterType",
	"sap/m/Dialog",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/Fragment"
], function (Controller, formatter, MessageToast, Filter, FilterType, Dialog, FilterOperator, Fragment) {
	"use strict";

	/**
     * Controller for stores list
     * @class
     */

	return Controller.extend("khrapun.pavel.controller.FirstPage", {

	formatter: formatter,

	onInit: function() {

		this.deliveryFilter = sap.ui.xmlfragment(this.getView().getId(), "khrapun.pavel.view.fragments.DeliveryFilter", this);

		this.deliveryAppFilter = sap.ui.xmlfragment(this.getView().getId(), "khrapun.pavel.view.fragments.DeliveryAppFilter", this);

		this.deliveryApplicationFragment = sap.ui.xmlfragment(this.getView().getId(), "khrapun.pavel.view.fragments.DeliveryApplicationsTable", this);

		this.deliveryFragment = sap.ui.xmlfragment(this.getView().getId(), "khrapun.pavel.view.fragments.DeliveryTable", this);

		this.tablePageContainer = this.getView().byId('myContainer');

		this.filterPageContainer = this.getView().byId('filterPanel');

		this.filterPageContainer.insertContent(this.deliveryAppFilter);

		this.tablePageContainer.insertContent(this.deliveryApplicationFragment);
	},

	/**
    * Navigate to details of a selected store
    *
    * @listens press
    *
    * @param {sap.ui.base.Event} oEvent event object
    *
    */

   onSelectionChange: function(oEvent) {
		var oView = this.getView();

		var oODataModel = oView.getModel("odata");

		this.delApplicationId = oEvent.getSource().getSelectedItem().mAggregations.cells[0].mProperties.title;

		this.customerId = (oODataModel.getData().DeliveryApplications.find(e => {
			if(e.Id === (this.delApplicationId-0)) {
				return "hello"
			}})).CustomerId;
   },

   onNavCreateDelivery: function() {
		var oRouter = this.getOwnerComponent().getRouter();
		oRouter.navTo("secondPage");
   },

   onNavCreateDeliveryApllication: function(oEvent){
		if(this.delApplicationId) {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("thirdPage", {
				id: this.delApplicationId,
				customerId: this.customerId
			});
		}
		else {
			MessageToast.show('Please select Delivery Application, for add Delivery');
		}
		this.delApplicationId = null;
    },


   onSelectTab: function(oEvent) {

		var deliveryTabFlag = oEvent.getParameter('item')["sId"].slice(-1);

		this.tablePageContainer.removeAllContent();
		this.filterPageContainer.removeAllContent();

		if(deliveryTabFlag === '0') {
			this.tablePageContainer.insertContent(this.deliveryApplicationFragment);
			this.filterPageContainer.insertContent(this.deliveryAppFilter);
		}

		else {
			this.tablePageContainer.insertContent(this.deliveryFragment);
			this.filterPageContainer.insertContent(this.deliveryFilter);
		}

	},

	onSearchDel: function(oEvent) {

		var aValues = oEvent.getSource().getFilterGroupItems().map((el)=>{
			return el.getControl().getValue();
		});

		var oFilter = this.getFiltersDel(aValues);

		this.getView().byId("deliveryTable").getBinding("items").filter(oFilter, FilterType.Application);
	},

	onSearchApp: function(oEvent) {

		var aValues = oEvent.getSource().getFilterGroupItems().map((el)=>{
			return el.getControl().getValue();
		});

		var oFilter = this.getFiltersApp(aValues);

		this.getView().byId("productsTable").getBinding("items").filter(oFilter, FilterType.Application);
	},

	getFiltersDel: function(aCurrentFilterValues) {

		if(aCurrentFilterValues[0] >= 1) {
			var aFilters = [ 
				new Filter ("Id", FilterOperator.EQ, aCurrentFilterValues[0]),
			];

			return new Filter({
				filters: aFilters,
				and: true
			});
		}
		else {
			var aFilters = [
			new Filter ("FromAddress", FilterOperator.Contains, aCurrentFilterValues[1]), 
			new Filter ("ToAddress", FilterOperator.Contains, aCurrentFilterValues[2]), 
			new Filter ("ManagerName", FilterOperator.Contains, aCurrentFilterValues[4]), 
			// new Filter ("CreatedDate", FilterOperator.EQ,  aCurrentFilterValues[3])
			];
	
			return new Filter({
				filters: aFilters,
				and: true
			});
		}
	},

	getFiltersApp: function(aCurrentFilterValues) {

		if(aCurrentFilterValues[0] >= 1) {
			var aFilters = [ 
			new Filter ("Id", FilterOperator.EQ, aCurrentFilterValues[0]),
			];

			return new Filter({
				filters: aFilters,
				and: true
			});
		}
		else {
			var aFilters = [
			new Filter ("FromAddress", FilterOperator.Contains, aCurrentFilterValues[1]), 
			new Filter ("ToAddress", FilterOperator.Contains, aCurrentFilterValues[2]), 
			// new Filter ("CreatedDate", FilterOperator.BT, aCurrentFilterValues[3])
			];
	
			return new Filter({
				filters: aFilters,
				and: true
			});
		}
	},

	getTable: function() {
		return this.getView().byId("productsTable");
	},

	getTableItems: function() {
		return this.getTable().getBinding("items");
	},

	});
});