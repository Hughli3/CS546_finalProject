$(function() {
    let urlpath = window.location.pathname;
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