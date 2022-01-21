'use strict';

/**
 * @namespace BackInStock
 */

var server = require('server');

var csrfProtection = require('*/cartridge/scripts/middleware/csrf');
var consentTracking = require('*/cartridge/scripts/middleware/consentTracking');
var URLUtils = require('dw/web/URLUtils');
/**
 * Checks if the phone value entered is correct format
 * @param {string} phone - phone string to check if valid
 * @returns {boolean} Whether phone is valid
 */
function validatePhone(phone) {
    var regex = /^[0-9]*$/;
    return regex.test(phone);
}

/**
 * Checks if the phone value entered is correct format
 * @param {string} phone - phone string to check if valid
 * @returns {boolean} Whether phone is valid
 */
function notEmptyPhone(phone) {
    return (!empty(phone));
}

// NotifyMeBackInStock.phoneNumbers.error = Resource.msg('error.message.parse.phone.backInStockForm.form', 'forms', null);

/**
 * Account-EditProfile : The Account-EditProfile endpoint renders the page that allows a shopper to edit their profile. The edit profile form is prefilled with the shopper's first name, last name, phone number and email
 * @name BackInStock-Show
 * @function
 * @memberof Account
 * @param {middleware} - server.middleware.https
 * @param {middleware} - csrfProtection.generateToken
 * @param {middleware} - consentTracking.consent
 * @param {renders} - isml
 * @param {serverfunction} - get
 */
server.get(
    'Show',
    server.middleware.https,
    csrfProtection.generateToken,
    consentTracking.consent,
    function (req, res, next) {
        var backInStockForm = server.forms.getForm('NotifyMeBackInStock');
        backInStockForm.clear();
        res.render('product/components/NotifyMeBackInStock', { backInStockForm: backInStockForm }); 
        return next();
    }
);

/**
 * Account-SaveProfile : The Account-SaveProfile endpoint is the endpoint that gets hit when a shopper has edited their profile
 * @name BackInStock-Save
 * @function
 * @memberof Account
 * @param {middleware} - server.middleware.https
 * @param {middleware} - csrfProtection.validateAjaxRequest
 * @param {httpparameter} - productId - Input field for the out-of-stock product, string
 * @param {httpparameter} - phoneNumbers - Input field for the subscribers phone numbers, comma separated string
 * @param {httpparameter} - csrf_token - hidden input field CSRF token
 * @param {returns} - json
 * @param {serverfunction} - post
 */

server.post(
    'Save',
    server.middleware.https,
    csrfProtection.validateAjaxRequest,
    function (req, res, next) {
        var CustomObjectMgr = require('dw/object/CustomObjectMgr');
        var formErrors = require('*/cartridge/scripts/formErrors');
        var NotifyMeBackInStock = server.forms.getForm('NotifyMeBackInStock');
        var NOTIFY_ME_BACK_IN_STOCK_CO = 'NotifyMeBackInStock';
        var Resource = require('dw/web/Resource');
        var Transaction = require('dw/system/Transaction');
        var NotifyMeBackInStockResult = CustomObjectMgr.getCustomObject(NOTIFY_ME_BACK_IN_STOCK_CO, req.form.productId);
        
        var form = req.form;
        var error = false;

        if (!form) { error = true; }

        try {
        if (!empty(NotifyMeBackInStockResult)) {

            Transaction.wrap(function () {
                var NotifyMeBackInStockEntry = CustomObjectMgr.getCustomObject(NOTIFY_ME_BACK_IN_STOCK_CO, req.form.productId);
                NotifyMeBackInStockEntry.custom.phoneNumbers =NotifyMeBackInStockEntry.custom.phoneNumbers + ' , ' + req.form.phoneNumbers;
            });
        } else {
            Transaction.wrap(function () {
                var NotifyMeBackInStockEntry = CustomObjectMgr.createCustomObject(NOTIFY_ME_BACK_IN_STOCK_CO, req.form.productId);
                NotifyMeBackInStockEntry.custom.phoneNumbers = req.form.phoneNumbers ;
            });
        }
        } catch (error) {
            error = true;
        }

        if (error) {
            res.json({ error: true });
        } else {
            res.json({ error: false, redirectUrl: URLUtils.url('BackInStock-Show').toString(), });
        }
        
        return next();
    });

module.exports = server.exports();


// Transaction.wrap(function () {CustomObjectMgr.remove(CustomObjectMgr.getCustomObject(NOTIFY_ME_BACK_IN_STOCK_CO, req.form.productId));});

    try {
        Transaction.wrap(function () {
            var newsletter = CustomObjectMgr.createCustomObject(type, keyValue);
            newsletter.custom.msFirstName = form.firstName;
            newsletter.custom.msLastName = form.lastName;
            newsletter.custom.msEmail = form.email;
            newsletter.custom.msGender = form.gender;
        });
    } catch (error) {
        error = true;
    }

    if (error) {
        res.json({ error: true });
    } else {
        res.json({ error: false, id: keyValue });
    }

    return next();
});