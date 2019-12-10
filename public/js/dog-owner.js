$(function() {
    let updateDogHealthInfo = function(weight, height, bmi, condition, date) {
        $('#dog-weight').text(weight);
        $('#dog-height').text(height);
        $('#dog-bmi').text(bmi);
        $('#dog-health').text(condition);
        $('#dog-date').text(date);
    }

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

    $('#add-height-weight-form').submit(function(event) {
        event.preventDefault();
    
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
                    $('#add-height-weight-modal').modal('toggle');
                    success("height weight have been updated");
                    updateLabelAndData(bmiChart, data.dog.healthDateList, data.dog.bmiList);
                    updateLabelAndData(weightChart, data.dog.healthDateList, data.dog.weightList);
                    $('#no-data-found-alert-health').hide();
                    $('#dog-health-info').show();
                    $('#dog-health-charts').removeClass('hide-chart');
                    updateDogHealthInfo(data.dog.weight, data.dog.height, data.dog.bmi, "good", data.dog.lastHeightWeightUpdate);
                } else {
                    error(data.errorMessage);
                }
            },
            error: function(data){
                error("fail updating height weight");
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

    // delete photo
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
    
    initLoadMorePhoto(true);

    initSubmitCommentForm();
    initLoadMoreComment();
});