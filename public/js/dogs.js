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
    let newTypeInput = $("#edit-dog-form-type");
    //   newDecriptionArea = $("#new-task-description"),
    //   todoArea = $("#todo-area");
  
    // function bindEventsToTodoItem(todoItem) {
    //   todoItem.find(".finishItem").on("click", function(event) {
    //     event.preventDefault();
    //     var currentLink = $(this);
    //     var currentId = currentLink.data("id");
  
    //     var requestConfig = {
    //       method: "POST",
    //       url: "/api/todo/complete/" + currentId
    //     };
  
    //     $.ajax(requestConfig).then(function(responseMessage) {
    //       var newElement = $(responseMessage);
    //       bindEventsToTodoItem(newElement);
    //       todoItem.replaceWith(newElement);
    //     });
    //   });
    // }
  
    // todoArea.children().each(function(index, element) {
    //   bindEventsToTodoItem($(element));
    // });
  
    editDogForm.submit(function(event) {
        event.preventDefault();
        $('#edit-dog-profile-modal').modal('toggle'); 

        let newType = newTypeInput.val();
        if (newType) {
            let requestConfig = {
                method: "PUT",
                url: "",
                contentType: "application/json",
                data: JSON.stringify({
                    type: newType
                })
            };

            $.ajax(requestConfig).then(function(responseMessage) {
                console.log(responseMessage);
            // newContent.html(responseMessage.message);
            //                alert("Data Saved: " + msg);
            });
        }
    });
  })(window.jQuery);