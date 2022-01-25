
'use strict';

var Template = require('dw/util/Template');
var HashMap = require('dw/util/HashMap');
var URLUtils = require('dw/web/URLUtils');

/**
 * Render logic for storefront.productBannerStrip component.
 * @param {dw.experience.ComponentScriptContext} context The Component script context object.
 * @returns {string} The template to be displayed
 */

module.exports.render = function (context) {
    var content = context.content;
    var model = new HashMap();
    model.imgAlt = content.alt;
    model.videoID = content.videoID ? content.videoID : null;

    return new Template('experience/components/youtube').render(model).text;
};
