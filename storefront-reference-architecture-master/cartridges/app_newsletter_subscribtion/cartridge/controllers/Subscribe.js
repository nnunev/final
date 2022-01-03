'use strict';

/**
 * @namespace MySubscribtion
 */


var server = require('server');
var CustomObjectMgr = require('dw/object/CustomObjectMgr');
var Transaction = require('dw/system/Transaction');
var UUIDUtils = require('dw/util/UUIDUtils');

server.post('Create', server.middleware.https, function (req, res, next) {
    var form = req.form;
    var error = false;

    if (!form) { error = true; }

    var type = 'MySubscribtion';
    var keyValue = UUIDUtils.createUUID();

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

/**
 * Delete
*/

server.post('Delete', server.middleware.https, function (req, res, next) {
    var form = req.form;
    var error = false;

    if (!form) { error = true; }

    var type = 'MySubscribtion';
    var keyValue = UUIDUtils.createUUID();

    try {
        var newsletter = CustomObjectMgr.createCustomObject(type, keyValue);
        Transaction.wrap(function () {
            CustomObjectMgr.remove(newsletter);
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


module.exports = server.exports();
