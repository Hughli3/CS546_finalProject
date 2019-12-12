$(function() {
    $("#update-avatar-form").submit(function(event) {
        event.preventDefault();
        $.ajax({
            method: "POST",
            url:  "/user/avatar",
            data: new FormData(this),
            contentType: false,
            processData: false,
            success: function(data){
                if (data.redirect) {
                    window.location.href = data.redirect;
                    return;
                }
                if (data.status == "success") {
                    $('#update-avatar-modal').modal('toggle'); 
                    $("#user-avatar").attr("src", data.avatar);
                    success("avatar is changed");
                } else if (data.status == "error") {
                    error(data.errorMessage);
                }
            },
            error: function(data){
                error("fail connecting to server");
            }
        });
    });

    $("#add-dog-form").submit(function(event) {
        event.preventDefault();
        $.ajax({
            method: "POST",
            url: "/dog",
            contentType: "application/json",
            data: JSON.stringify({
                name: $("#add-dog-form-name").val(),
                type: $("#add-dog-form-type").val(),
                gender: $("#add-dog-form-gender").val(),
                dob: $("#add-dog-form-dob").val()
            }),
            success: function(data){
                if (data.redirect) {
                    window.location.href = data.redirect;
                    return;
                }
                if (data.status == "success") {
                    $('#add-dog-modal').modal('toggle'); 
                    addDog(data.dog._id, data.dog.name, data.dog.gender, data.dog.type, data.dog.age, data.dog.avatar);
                    $('#no-data-found-alert-dog').hide();
                    success("new dog is added");
                } else {
                    error(data.errorMessage);
                }
            },
            error: function(data){
                error("fail connecting to server");
            }
        });
    });
  
    function addDog(id, name, gender, type, age, avatar) {
        let dogContainer = $('<div class="col-md-3 mb-4 dog-container">');
        let button = $('<button type="button" class="btn btn-danger btn-sm btn-round btn-shadow btn-delete-dog position-absolute">delete</button>')
        let card = $('<div class="card">');
        let a = $('<a href="/dog/' + id + '">');
        let avatarContainer = $('<div class="avatar-container">')
        let img = $('<img src="/public/img/avatar/default-dog.png" class="card-img-top" alt="dog avatar">');
        if (avatar) {
            img = $('<img src="' + avatar + '" class="card-img-top" alt="dog avatar">');
        }
        avatarContainer.append(img);
        let cardbody = $('<div class="card-body">');
        let cardtitle = $('<h2 class="card-title display-4 mb-0">' + name + '</h2>');
        let cardtest = $('<p class="card-text">' + gender + ' ' + type + ' ' + age +' y/o</p>');
        cardbody.append(cardtitle).append(cardtest);
        a.append(avatarContainer).append(cardbody);
        card.append(a);
        dogContainer.append(button);
        dogContainer.append(card);

        $('#dogs-container').prepend(dogContainer);
    }

    $('body').on('click', '.dog-container button', function() {
        let dogSingleContainer = $(this).parent();
        let dogContainer = dogSingleContainer.parent();
        let dogURI = $(this).next().find('a').attr('href');
        $.ajax({
            method: "DELETE",
            url: dogURI,
            success: function(data){
                if (data.redirect) {
                    window.location.href = data.redirect;
                    return;
                }
                if (data.status == "success") {
                    dogSingleContainer.remove();
                    if (dogContainer.children().length === 0) {
                        $('#no-data-found-alert-dog').show();
                    }
                    success("dog is deleted");
                } else {
                    error(data.errorMessage);
                }
            },
            error: function(data){
                error("fail connecting to server");
            }
        });
    });

    $('#user-avatar-upload-btn').click(function() {
        $('#user-avatar-upload').click();
    });

    $('#user-avatar-upload').change(function() {
        let file = $(this).val().split('\\');
        let fileName = file[file.length - 1];
        $('#uploaded-file-name').text(fileName);
    });

    $('#change-password-form').submit(function(event){
        event.preventDefault();
        if ($("#change-password-form-new-password").val().length < 8) {
            error("length of password is less than 8");
            return;
        }
        if ($("#change-password-form-new-password").val() != $("#change-password-form-confirm-new-password").val()) {
            error("password and confirm password are different");
            return;
        }

        $.ajax({
            method: "POST",
            url: "/user/password",
            contentType: "application/json",
            data: JSON.stringify({
                oldpassword: $("#change-password-form-old-password").val(),
                newpassword: $("#change-password-form-new-password").val()
            }),
            success: function(data){
                if (data.redirect) {
                    window.location.href = data.redirect;
                    return;
                }
                if (data.status == "success") {
                    $('#change-password-modal').modal('toggle'); 
                    success("password is changed");
                } else {
                    error(data.errorMessage);
                }
            },
            error: function(data){
                error("fail connecting to server");
            }
        });
    });
});