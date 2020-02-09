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
     * Controller for create delivery
     * @class
     */

	return Controller.extend("khrapun.pavel.controller.SecondPage", {
		formatter: formatter,

    /**
     * Controller's "init" lifecycle method.
    */


	onInit: function () {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		oRouter.getRoute("secondPage");

		var itemsDelivery = new sap.ui.model.json.JSONModel({
			data: []
		});

		this.getView().setModel(itemsDelivery, "oItemsData")
		

		this.getView().byId("delivryItemsTable").setModel(itemsDelivery);

	},

	/**
    * Open dialog for create delivery item
    *
    * @listens press
    *
    */


	onOpenDialogCreateDeliveryItem: function() {
		var oView = this.getView();
  
		if (!this.oDialog) {
		    this.oDialog = sap.ui.xmlfragment(
			oView.getId(),
			"khrapun.pavel.view.fragments.CreateDeliveryItemDialog",
			this
		    );
		    oView.addDependent(this.oDialog);
		};
		  this.oDialog.open();
		},

	/**
    * Send the new item to the JSON model and close dialog
    *
    * @listens press
    *
    */


		onDialogCreateItemPress: function() {

			var itemName = this.byId('itemDelName').getValue();
			var itemQuantity = this.byId('itemDelQuantity').getValue();

			var checkCorrectlyQuantity = /[a-zа-яё]/i.test(itemQuantity);

			if(!itemName || checkCorrectlyQuantity === true) {
				MessageToast.show('Fill correctly');
			}
			else {
				var itemRow = {
					Name: itemName,
					Quantity: itemQuantity-0,
					DeliveryId: 2
				};
	
				var oModel = this.getView().getModel('oItemsData');
	 
				var itemData = oModel.getProperty("/data");
	
				itemData.push(itemRow);
	
				oModel.setData({
					data: itemData
				});
		  
				this.oDialog.close();
				
		  		MessageToast.show('Item add.');
      }
      

	},

	/**
		* Close item creation dialog
		*
		* @listens press
		*
	*/
	  
	onDialogCancelItemPress: function() { 
		this.oDialog.close();
	},

	/**
    * Searches selected item for delete, and delete this item
    *
    * @listens press
    *
    */


	onDeleteDeliveryItem: function() {

		var oTable = this.getView().byId("delivryItemsTable");

		var oModelDel = this.getView().getModel('oItemsData');

		var aRows = oModelDel.getData().data;

		var aContexts = oTable.getSelectedContexts();

		var afinishItems = [];

		var indexSelectedItem = aContexts[0].sPath.replace(/\D+/g,"")-0;
		
		aRows.forEach((el, index) => {
				if(indexSelectedItem !== index){
					afinishItems.push(el)
				}
		})


		oModelDel.setData({
			data: afinishItems
		})

		aContexts = []

		afinishItems = [];
	},

	/**
    * Open dialog, for select Manager
    *
    * @listens press
    *
    * @param {sap.ui.base.Event} oEvent the event object
    *
    */


	handleValueHelp : function (oEvent) {
		var sInputValue = oEvent.getSource().getValue();

		this.respInotId = oEvent.getSource().getId();

		// create value help dialog
		if (!this._valueHelpDialog) {
			this._valueHelpDialog = sap.ui.xmlfragment(
				"khrapun.pavel.view.fragments.SelectResponsivleManagerDialog",
				this
			);
			this.getView().addDependent(this._valueHelpDialog);
		}

		// create a filter for the binding
		this._valueHelpDialog.getBinding("items").filter([new Filter(
			"Name",
			sap.ui.model.FilterOperator.Contains, sInputValue
		)]);

		// open value help dialog filtered by the input value
		this._valueHelpDialog.open(sInputValue);
	},

	/**
    * Create filter, for search Manager
    *
    * @param {sap.ui.base.Event} evt the event object
    *
    */


	_handleValueHelpSearch : function (evt) {
		var sValue = evt.getParameter("value");
		var oFilter = new Filter(
			"Name",
			sap.ui.model.FilterOperator.Contains, sValue
		);
		evt.getSource().getBinding("items").filter([oFilter]);
	},

	/**
    * Save the selected Manager
    *
    * @listens press
    *
    * @param {sap.ui.base.Event} oEvent the event object
    *
    */


	_handleValueHelpClose : function (evt) {
		var oSelectedItem = evt.getParameter("selectedItem");
		if (oSelectedItem) {
			var productInput = this.byId(this.respInotId);
			productInput.setValue(oSelectedItem.getTitle());
		}
		evt.getSource().getBinding("items").filter([]);
	},

	/**
    * Create new delivery
    */

	createDelyvery: function() {

		const oOdataModel = this.getView().getModel('serverData')

		var sCustomerId = this.byId('customerId').getValue();
		var sManagerId = this.byId('responsibleManagerInpt').getValue()-0
		var sTransportId = this.byId('delTransport').getSelectedItem().getText().replace(/\D+/g,"")-0;
		var sDelDate = this.byId('delDate').getValue();
		var sPrice = this.byId('delPrice').getValue();
		var sFromAddress = this.byId('sendAddress').getValue();
        var sToAddress = this.byId('destAddress').getValue();
      
		var checkCustomerId =  /[a-zа-яё]/i.test(sCustomerId);
		var checkCorrectlyPrice = /[a-zа-яё]/i.test(sPrice);

		if(!sTransportId || !sDelDate || checkCorrectlyPrice === true || !sManagerId || checkCustomerId === true) {
			MessageToast.show('Fill input fields.');
      	}
      
      	else {
			var oNewDelyvery = {
			FromAddress: sFromAddress,
			ToAddress: sToAddress,
			Price: sPrice-0,
			PriceCurrency: "BYN",
			ArrivalDate: "2020-02-07T09:13:15.448Z",
			DeliveryDate: sDelDate,
			CustomerFeedbackRating: 0,
			CustomerFeedbackText: '',
			CrewFeedbackText: "string",
			StatusCode: "DELIVERY_CREATED",
			CustomerId: sCustomerId-0,
			ManagerId: sManagerId,
			SourceApplicationId: 0,
			TransportId: sTransportId
			};
	
			
			oOdataModel.create('/Deliveries', oNewDelyvery, {
				success: (e) => {
				this.createDeliveryItems(e.Id);
				MessageToast.show('Successfully added.')
				}
			});

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("firstPage");
		}
	},

	/**
    * Create new delivery items
    *
    * @param  id the id of created delivery
    *
    */

	createDeliveryItems: function(id) {
		const oOdataModel = this.getView().getModel('serverData');

		var oModelDel = this.getView().getModel('oItemsData');

    	var aRows = oModelDel.getData().data;

		aRows.forEach(item => {
      		item.DeliveryId = id;
			oOdataModel.create('/DeliveryItems', item);
    	});
    
	},

	/**
    * Run functions for create delivery and delivery items
    *
    * @listens press
    *
    */


	onCreateDelivery: function(){

		this.createDelyvery();
		
	},

	/**
    * Return to start page
    *
    * @listens press
    *
    */

	onCancelDelivery: function(){
		var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		oRouter.navTo("firstPage");
	  },
	});
});