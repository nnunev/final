/**
 * is Page Designer page in Edit Mode
 */

 {
    "Hooks": [
        {
            "name": "app.experience.editmode",
            "script": "./cartridge/experience/hooks.js"
        }
    ]
}

function editmode() {
    session.privacy.consent = true; // eslint-disable-line no-undef
}

exports.editmode = editmode;

{
    "Hooks": [
        {
            "name": "app.experience.editmode",
            "script": "./cartridge/experience/hooks.js"
        }
    ]
}