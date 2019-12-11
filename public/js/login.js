$(function() {    
    $('#login-form').submit(function(event) {
        console.log("a");
        let letterNumber = /^[0-9a-zA-Z]+$/;
        if ($('#username').val().length < 6) {
            event.preventDefault();
            error("length of username is less than 6");
            return;
        }
        if (!$('#username').val().match(letterNumber)) {
            event.preventDefault();
            error("username should contain only letter and number");
            return;
        }
        if ($('#password').val().length < 8) {
            event.preventDefault();
            error("length of password is less than 8");
            return;
        }
    });
});