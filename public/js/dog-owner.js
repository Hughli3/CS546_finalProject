$(function() {
    let urlpath = window.location.pathname;

    $("#edit-dog-profile-button").click(function() {
        $("#edit-dog-form-name").val($("#dog-name").text());
        $("#edit-dog-form-type").val($("#dog-type").text());
        $("#edit-dog-form-gender").val($("#dog-gender").text());
        $("#edit-dog-form-dob").val($("#dog-dob").text());
    });
  
    $("#edit-dog-form").submit(function(event) {
        event.preventDefault();
        $('#edit-dog-profile-modal').modal('toggle'); 

        $.ajax({
            method: "PUT",
            url: "",
            contentType: "application/json",
            data: JSON.stringify({ dog : {
                name: $("#edit-dog-form-name").val(),
                type: $("#edit-dog-form-type").val(),
                gender: $("#edit-dog-form-gender").val(),
                dob: $("#edit-dog-form-dob").val()
            }}),
            success: function(data){
                if (data.status == "success") {
                    $("#dog-name").text(data.dog.name);
                    $("#dog-gender").text(data.dog.gender);
                    $("#dog-dob").text(data.dog.dob);
                    $("#dog-type").text(data.dog.type);
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

    $("#update-avatar-form").submit(function(event) {
        event.preventDefault();
        $('#update-avatar-modal').modal('toggle'); 

        $.ajax({
            method: "POST",
            url: urlpath + "/avatar",
            data: new FormData(this),
            contentType: false,
            processData: false,
            success: function(data){
                if (data.status == "success") {
                    $("#dog-avatar").attr("src", data.avatar);
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

    $("#upload-photo-form").submit(function(event) {
        event.preventDefault();
        $('#upload-photo-modal').modal('toggle'); 

        $.ajax({
            method: "POST",
            url: urlpath + "/photos",
            data: new FormData(this),
            contentType: false,
            processData: false,
            success: function(data){
                if (data.status == "success") {
                    $("#photos").empty();
                    for(let photo of data.photos) {
                        addDogPhoto(photo.id, photo.photo, true);
                    }
                    if (data.isLastPage) $("#load-more-photos").hide();
                    else $("#load-more-photos").show();
                    $("#load-more-photos").data("current-page", "1");
                    $("#no-data-found-alert-photo").hide();
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

    $("#load-more-photos").click(function() {
        let page = $("#load-more-photos").data("current-page");
        let nextPage = parseInt(page) + 1;

        $.ajax({
            method: "GET",
            url: urlpath + "/photos?page=" + nextPage,
            success: function(data){
                if (data.status == "success") {
                    $("#load-more-photos").data("current-page", nextPage);
                    for (let photo of data.photos) {
                        addDogPhoto(photo.id, photo.photo, true);
                    }
                    if (data.isLastPage) {
                        $("#load-more-photos").hide();
                    }
                } else {
                    console.log(data);
                }
            },
            error: function(data){
                console.log("fail updating photos");
                console.log(data);
            }
        });
    });

    $("#load-more-comments").click(function() {
        let page = $("#load-more-comments").data("current-page");
        let nextPage = parseInt(page) + 1;

        $.ajax({
            method: "GET",
            url: urlpath + "/comments?page=" + nextPage,
            success: function(data){
                if (data.status == "success") {
                    $("#load-more-comments").data("current-page", nextPage);
                    for (let comment of data.comments) {
                        addComment(comment);
                    }
                    if (data.isLastPage) $("#load-more-comments").hide();
                } else {
                    console.log(data);
                }
            },
            error: function(data){
                console.log("fail updating comments");
                console.log(data);
            }
        });
    });

    $('#comment-form').submit(function(event) {
        event.preventDefault();

        $.ajax({
            method: "POST",
            url: urlpath + "/comments",
            contentType: "application/json",
            data: JSON.stringify({
                content: $("#comment-form-content").val()
            }),
            success: function(data){
                if (data.status == "success") {
                    $("#comments").empty();
                    for (let comment of data.comments) {
                        addComment(comment);
                    }
                    if (data.isLastPage) $("#load-more-comments").hide();
                    else $("#load-more-comments").show();
                    $("#load-more-comments").data("current-page", "1");
                    $("#no-data-found-alert-comment").hide();
                } else {
                    console.log(data);
                }
            },
            error: function(data){
                console.log("fail posting comment");
                console.log(data);
            }
        });
    });

    $('body').on('click', '.dog-img-container button', function() {
        let photoId = $(this).next().find('img').attr('id');
        $.ajax({
            method: "DELETE",
            url: urlpath + "/photo/" + photoId,
            success: function(data){
                if (data.status == "success") {
                    $("#photos").empty();
                    if (data.photos.length) {
                        console.log(data.photos);
                        for(let photo of data.photos) {
                            addDogPhoto(photo.id, photo.photo, true);
                        }
                    } else {
                        $("#no-data-found-alert-photo").show();
                    }
                    if (data.isLastPage) $("#load-more-photos").hide();
                    else $("#load-more-photos").show();
                    $("#load-more-photos").data("current-page", "1");
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

    $('#add-height-weight-form').submit(function(event) {
        event.preventDefault();
        $('#add-height-weight-modal').modal('toggle'); 
    
        $.ajax({
            method: "POST",
            url: window.location.pathname + "/heightWeight",
            contentType: "application/json",
            data: JSON.stringify({ heightWeight : {
                height: parseFloat($("#add-height-weight-form-height").val()),
                weight: parseFloat($("#add-height-weight-form-weight").val())
            }}),
            success: function(data){
                if (data.status == "success") {
                    updateLabelAndData(bmiChart, data.dog.healthDateList, data.dog.bmiList);
                    updateLabelAndData(weightChart, data.dog.healthDateList, data.dog.weightList);
                    $('#no-data-found-alert-health').hide();
                    $('#dog-health-info').show();
                    updateDogHealthInfo(data.dog.weight, data.dog.height, data.dog.bmi, "good", data.dog.lastHeightWeightUpdate);
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