$(function() {
    let urlpath = window.location.pathname;
    let editDogForm = $("#edit-dog-form");
    let updateAvatarForm = $("#update-avatar-form");
    let uploadPhotoForm = $("#upload-photo-form");
    let editDogButton = $("#edit-dog-profile-button");

    editDogButton.click(function() {
        $("#edit-dog-form-name").val($("#dog-name").text());
        $("#edit-dog-form-type").val($("#dog-type").text());
        $("#edit-dog-form-gender").val($("#dog-gender").text());
        $("#edit-dog-form-dob").val($("#dog-dob").text());
    });
  
    editDogForm.submit(function(event) {
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

    updateAvatarForm.submit(function(event) {
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

    uploadPhotoForm.submit(function(event) {
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
                        addDogPhoto(photo.id, photo.photo);
                    }
                    if (data.isLastPage) $("#load-more-photos").hide();
                    else $("#load-more-photos").show();
                    $("#load-more-photos").attr("current-page", "1");
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
        let page = $("#load-more-photos").attr("current-page");
        let nextPage = parseInt(page) + 1;

        $.ajax({
            method: "GET",
            url: urlpath + "/photos?page=" + nextPage,
            success: function(data){
                if (data.status == "success") {
                    $("#load-more-photos").attr("current-page", nextPage);
                    for (let photo of data.photos) {
                        addDogPhoto(photo.id, photo.photo);
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
        let page = $("#load-more-comments").attr("current-page");
        let nextPage = parseInt(page) + 1;

        $.ajax({
            method: "GET",
            url: urlpath + "/comments?page=" + nextPage,
            success: function(data){
                if (data.status == "success") {
                    $("#load-more-comments").attr("current-page", nextPage);
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
                    $("#load-more-comments").attr("current-page", "1");
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

    function addComment(comment) {
        let commentContainer = $('<div class="row single-comment">');
        let avatarContainer = $('<div class="col-2">');
        let avatar = $('<img class="avatar" src="' + comment.user.avatar + '">');
        avatarContainer.append(avatar);
        let contentContainer = $('<div class="col-10">');
        let contentInnerContainer = $('<div class="comment-content">');
        contentInnerContainer.append('<p>' + comment.content + '</p>');
        let contentDataContainer = $('<p class="comment-data">');
        contentDataContainer.append('<a href="/user/' + comment.user.username + '">' + comment.user.username + '</a> ');
        contentDataContainer.append('<span class="comment-date">' + comment.date + '</span>');
        contentInnerContainer.append(contentDataContainer);
        contentContainer.append(contentInnerContainer);
        commentContainer.append(avatarContainer);
        commentContainer.append(contentContainer);
        $("#comments").append(commentContainer);
    }

    function addDogPhoto(id, photo) {
        let imgContainer = $('<div class="col-lg-3 col-6 my-3 dog-img-container">');
        let lightboxContainer = $('<a href="' + photo + '" data-alt="dog photos" data-lightbox="photos">');
        lightboxContainer.append('<img id="' + id + '" src="' + photo + '" class="dog-img img-fluid rounded w-100" alt="dog photos" />');
        imgContainer.append('<button type="button" class="btn btn-danger btn-sm btn-round btn-shadow btn-delete-photo position-absolute">delete</button>');
        imgContainer.append(lightboxContainer);
        $("#photos").append(imgContainer);
    }

    $('body').on('click', '.dog-img-container button', function() {
        let photoId = $(this).next().find('img').attr('id');
        $.ajax({
            method: "DELETE",
            url: urlpath + "/photo/" + photoId,
            success: function(data){
                if (data.status == "success") {
                    $("#photos").empty();
                    for(let photo of data.photos) {
                        addDogPhoto(photo.id, photo.photo);
                    }
                    if (data.isLastPage) $("#load-more-photos").hide();
                    else $("#load-more-photos").show();
                    $("#load-more-photos").attr("current-page", "1");
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

function updateLabelAndData(chart, label, data) {
    chart.data.labels = label;
    chart.data.datasets.forEach((dataset) => {
        dataset.data = data;
    });
    chart.update();
}

function addLabel(chart, label) {
    chart.data.labels.push(label);
    chart.update();
}

function addData(chart, data) {
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}

let addHeightWeightForm = $('#add-height-weight-form');
addHeightWeightForm.submit(function(event) {
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
                console.log(data);
                updateLabelAndData(bmiChart, data.dog.healthDateList, data.dog.bmiList);
                updateLabelAndData(weightChart, data.dog.healthDateList, data.dog.weightList);
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