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
                        $("#photos").append('<img class="col-3 my-3" src="' + photo + '" />');
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
                    console.log(data);
                    $("#load-more-photos").attr("current-page", nextPage);
                    for (let photo of data.photos) {
                        $("#photos").append('<img class="col-3 my-3" src="' + photo + '" />');
                    }
                    if (data.isLastPage) {
                        $("#load-more-photos").hide();
                    }
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