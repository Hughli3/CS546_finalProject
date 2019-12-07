let ctx1 = document.getElementById('myChart1').getContext('2d');
let ctx2 = document.getElementById('myChart2').getContext('2d');

new Chart(ctx1, {
    type: 'line',
    data: {
        labels: ['2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4'],
        datasets: [{
            label: 'BMI',
            backgroundColor: "#3099d8",
            borderColor: "#3099d8",
            data: [
                10,20,15,22,24,10,20,15,22,24,24,10,20,15,22,24,24,10,20,15,22,24,24,10,20,15,22,24,24,10,20,15,22,24,24,10,20,15,22,24
            ],
            fill: false,
        }]
    },
    options: {
        responsive: true,
        title: {
            display: true,
            text: 'BMI Trend'
        },
        tooltips: {
            mode: 'index',
            intersect: false,
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            xAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Date'
                }
            }],
            yAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'BMI'
                }
            }]
        }
    }
});


new Chart(ctx2, {
    type: 'line',
    data: {
        labels: ['2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4','2018-10-4'],
        datasets: [{
            label: 'Weight',
            backgroundColor: "#3099d8",
            borderColor: "#3099d8",
            data: [
                15,20,24,25,21,10,20,24,25,21,10,20,24,25,21,10,20,24,25,21,10,20,24,25,21,10,20,24,25,21,10,20,24,25,21
            ],
            fill: false,
        }]
    },
    options: {
        responsive: true,
        title: {
            display: true,
            text: 'Weight Trend'
        },
        tooltips: {
            mode: 'index',
            intersect: false,
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            xAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Weight'
                }
            }],
            yAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Date'
                }
            }]
        }
    }
});


(function($) {
    let editDogForm = $("#edit-dog-form");

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

        let requestConfig = {
            method: "PUT",
            url: "",
            contentType: "application/json",
            data: JSON.stringify({ dog : {
                name: $("#edit-dog-form-name").val(),
                type: $("#edit-dog-form-type").val(),
                gender: $("#edit-dog-form-gender").val(),
                dateOfBirth: $("#edit-dog-form-dob").val()
                }
            })
        };

        $.ajax(requestConfig).then(function(responseMessage) {
            console.log(responseMessage);

            $("#dog-name").text(responseMessage.dog.dogName);
            $("#dog-gender").text(responseMessage.dog.gender);
            $("#dog-dob").text(responseMessage.dog.gender);

            $("#dog-type").text(responseMessage.dog.type);
        // newContent.html(responseMessage.message);
        //                alert("Data Saved: " + msg);
        });
    });
  })(window.jQuery);