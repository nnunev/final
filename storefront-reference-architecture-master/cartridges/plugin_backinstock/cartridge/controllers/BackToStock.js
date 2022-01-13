'use strict';

/**
 * @namespace BackToStock
 */

var server = require('server');

var csrfProtection = require('*/cartridge/scripts/middleware/csrf');
var consentTracking = require('*/cartridge/scripts/middleware/consentTracking');

/**
 * Checks if the phone value entered is correct format
 * @param {string} phone - phone string to check if valid
 * @returns {boolean} Whether phone is valid
 */
// function validatePhone(phone) {
//     var regex = /^\(?([2-9][0-8][0-9])\)?[\-\. ]?([2-9][0-9]{2})[\-\. ]?([0-9]{4})(\s*x[0-9]+)?$/;
//     return regex.test(phone);
// }

/**
 * Account-EditProfile : The Account-EditProfile endpoint renders the page that allows a shopper to edit their profile. The edit profile form is prefilled with the shopper's first name, last name, phone number and email
 * @name Base/Account-EditProfile
 * @function
 * @memberof Account
 * @param {middleware} - server.middleware.https
 * @param {middleware} - csrfProtection.generateToken
 * @param {middleware} - userLoggedIn.validateLoggedIn
 * @param {middleware} - consentTracking.consent
 * @param {category} - sensitive
 * @param {renders} - isml
 * @param {serverfunction} - get
 */
server.get(
    'Show',
    server.middleware.https,
    csrfProtection.generateToken,
    consentTracking.consent,
    function (req, res, next) {
        var backToStockForm = server.forms.getForm('BackToStockForm');
        backToStockForm.clear();
        res.render('product/components/SMSFormTemplate' , { backToStockForm: backToStockForm });
        
        
        return next();
    }
);

/**
 * Account-SaveProfile : The Account-SaveProfile endpoint is the endpoint that gets hit when a shopper has edited their profile
 * @name Base/Account-SaveProfile
 * @function
 * @memberof Account
 * @param {middleware} - server.middleware.https
 * @param {middleware} - csrfProtection.validateAjaxRequest
 * @param {httpparameter} - dwfrm_profile_customer_firstname - Input field for the shoppers's first name
 * @param {httpparameter} - dwfrm_profile_customer_lastname - Input field for the shopper's last name
 * @param {httpparameter} - dwfrm_profile_customer_phone - Input field for the shopper's phone number
 * @param {httpparameter} - dwfrm_profile_customer_email - Input field for the shopper's email address
 * @param {httpparameter} - dwfrm_profile_customer_emailconfirm - Input field for the shopper's email address
 * @param {httpparameter} - dwfrm_profile_login_password  - Input field for the shopper's password
 * @param {httpparameter} - csrf_token - hidden input field CSRF token
 * @param {category} - sensititve
 * @param {returns} - json
 * @param {serverfunction} - post
 */
server.post(
    'Save',
    server.middleware.https,
    csrfProtection.validateAjaxRequest,
    function (req, res, next) {
        var CustomObjectMgr = require('dw/object/CustomObjectMgr');
        // var formErrors = require('*/cartridge/scripts/formErrors');
        var URLUtils = require('dw/web/URLUtils');
        var backToStockForm = server.forms.getForm('BackToStockForm');
        var NOTIFY_ME_BACK_IN_STOCK_CO = 'NotifyMeBackInStock';
        var Resource = require('dw/web/Resource');
        var Transaction = require('dw/system/Transaction');
        // var backToStockResult = CustomObjectMgr.getCustomObject(NOTIFY_ME_BACK_IN_STOCK_CO, backToStockForm.productId.value)
        // var result = {
        //     phone: backToStockForm.phone.value,
        //     productID: backToStockForm.productID.value,
        //     profileForm: profileForm
        // };

        // form validation
        // if (validatePhone(backToStockForm.phoneNumbers.value) === false) {
        //     backToStockForm.valid = false;
        //     backToStockForm.phone.valid = false;
        //     backToStockForm.phone.error = Resource.msg('error.message.parse.phone.profile.form', 'forms', null);
        // }
        backToStockForm.valid = true;
        if (backToStockForm.valid) {
            Transaction.wrap(function () {
                var backToStockEntry = CustomObjectMgr.createCustomObject(NOTIFY_ME_BACK_IN_STOCK_CO, backToStockForm.productId.value);
                backToStockEntry.custom.phoneNumbers = backToStockForm.phoneNumbers.value;
            });

            res.json({
                success: true,
                redirectUrl: URLUtils.url('BackToStock-Show').toString()
            });
        }
        return next();
    });

module.exports = server.exports();
