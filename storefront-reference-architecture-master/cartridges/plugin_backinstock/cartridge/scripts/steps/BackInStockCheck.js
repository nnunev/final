var ProductMgr = require('dw/catalog/ProductMgr');
var CustomObjectMgr = require('dw/object/CustomObjectMgr');
var LocalServiceRegistry = require('dw/svc/LocalServiceRegistry');
var Transaction = require('dw/system/Transaction');
var HTTPService = require('dw/svc/HTTPService');

module.exports.execute = function () {
    
    var IteratorBackInStock = CustomObjectMgr.getAllCustomObjects('NotifyMeBackInStock');
    
    while (IteratorBackInStock.hasNext()) {
        var NotifyMeBackInStockEntry = IteratorBackInStock.next();
        var currentProductId = NotifyMeBackInStockEntry.custom.productId;
        var currentProduct = ProductMgr.getProduct(currentProductId);
        var currentProductIsInStock = currentProduct.availabilityModel.inStock;
   
        if (currentProductIsInStock) {
            var currentProductPhoneNumbers = NotifyMeBackInStockEntry.custom.phoneNumbers.split(',');
            
            for each( e in currentProductPhoneNumbers) {
				var phoneNumber = e;
                
                var requestBody ='To=' + phoneNumber.trim() + '&Body=' + currentProductId + '-' +currentProduct.name + ' is back in stock&From=+16075233986';
               
                var sendSMS = LocalServiceRegistry.createService("plugin_backinstock.https.twilio.send", {
                    createRequest: function(svc, args) {
                        svc.addHeader("Content-Type", "application/x-www-form-urlencoded");
            
                        return args;
                    },
                    parseResponse: function(svc, client) {
                        return client.text;
                    }
                }); 
                var response = sendSMS.call(requestBody);
            };
            Transaction.wrap(function () {CustomObjectMgr.remove(NotifyMeBackInStockEntry)});
        };
    }
};



// var requestBody = {
                //     'To=': phoneNumber,
                //     'Body=': "Hello",
                //     'From=': "+359000000000",    
                // };
                // var requestBody = {body:'Hi there ' + currentProductId + 'is back in stock', from: '+15017122661', To: [phoneNumber]}
