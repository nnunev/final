'use strict';

/**
 * Display the returned message.
 * @param {string} data - data returned from the server's ajax call
 * @param {Object} button - button that was clicked for contact us sign-up
 */

function displayMessage(data, button) {
    $.spinner().stop();
    var status;
    if (data.success) {
        status = 'alert-success';
    } else {
        status = 'alert-danger';
    }

    if ($(".NotifyMeBackInStock-signup-message").length === 0) {
        $("body").append('<div class="NotifyMeBackInStock-signup-message"></div>');
    }

    $(".NotifyMeBackInStock-signup-message").append(
      '<div class="NotifyMeBackInStock-signup-alert text-center ' 
      + status 
      + '" role="alert">' 
      + data.msg 
      + "</div>"
    );
 
    setTimeout(function () {
      $(".NotifyMeBackInStock-signup-message").remove();
      button.removeAttr('disabled');
    }, 5000);
}

module.exports = {
    NotifyMeBackInStock: function () {
        $("form.NotifyMeBackInStock").submit(function (e) {
            e.preventDefault();
            var form = $(this);
            var button = $(".subscribe-NotifyMeBackInStock");
            var url = form.attr("action");
      
            $.spinner().start();
            button.attr("disabled", true);
            
            $.ajax({
                url: url,
                type: "post",
                dataType: "json",
                data: form.serialize(),
                success: function (data) {
                    console.log(data);
                    displayMessage(data, button);
                    if (data.success) {
                    $(".NotifyMeBackInStock").trigger("reset");
                   
                    
                    }
                    // $.spinner().stop();
                },
                
                error: function (err) {
                    displayMessage(err, button); 
                    console.log(err);
                    if (err.responseJSON.redirectUrl) {
                        window.location.href = err.responseJSON.redirectUrl;
                    } else {
                        createErrorNotification(err.responseJSON.errorMessage);
                        // $.spinner().stop();
                    }

                },
                
            });
        });
    }
};
