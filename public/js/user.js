$(function() {
    let updateAvatarForm = $("#update-avatar-form");
    let userId = $("#user-id").val();

    updateAvatarForm.submit(function(event) {
        event.preventDefault();
        $('#update-avatar-modal').modal('toggle'); 

        $.ajax({
            method: "POST",
            url:  "/user/" + userId + "/avatar",
            data: new FormData(this),
            contentType: false,
            processData: false,
            success: function(data){
                if (data.status == "success") {
                    $("#user-avatar").attr("src", data.avatar);
                } else {
                    console.log(data);
                }
            },
            error: function(data){
                console.log("fail uploading image");
                console.log(data);
            }
        });
    });

    let addDogForm = $("#add-dog-form");

    addDogForm.submit(function(event) {
        event.preventDefault();
        $('#add-dog-modal').modal('toggle'); 

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
                if (data.status == "success") {
                    addDog(data.dog._id, data.dog.name, data.dog.gender, data.dog.type, data.dog.age, data.dog.avatar);
                    $('#no-data-found-alert-dog').hide();
                    error("good");
                } else {
                    console.log(data);
                }
            },
            error: function(data){
                console.log("fail adding dog");
                console.log(data);
            }
        });
    });
  
    function addDog(id, name, gender, type, age, avatar) {
        let dogContainer = $('<div class="col-md-3 mb-4 dog-container">');
        let button = $('<button type="button" class="btn btn-danger btn-sm btn-round btn-shadow btn-delete-dog position-absolute">delete</button>')
        let card = $('<div class="card">');
        let a = $('<a href="/dog/' + id + '">');
        let img = $('<img src="/public/img/dog/1.jpg" class="card-img-top" alt="dog avatar">');
        if (avatar) {
            img = $('<img src="' + avatar + '" class="card-img-top" alt="dog avatar">');
        }
        let cardbody = $('<div class="card-body">');
        let cardtitle = $('<h1 class="card-title display-4 mb-0">' + name + '</h1>');
        let cardtest = $('<p class="card-text">' + gender + ' ' + type + ' ' + age +' y/o</p>');
        cardbody.append(cardtitle).append(cardtest);
        a.append(img).append(cardbody);
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
                if (data.status == "success") {
                    dogSingleContainer.remove();
                    if (dogContainer.children().length === 0) {
                        $('#no-data-found-alert-dog').show();
                    }
                    success("good");
                } else {
                    console.log(data);
                }
            },
            error: function(data){
                console.log("fail updating avatar");
                console.log(data);
            }
        });
    });
});