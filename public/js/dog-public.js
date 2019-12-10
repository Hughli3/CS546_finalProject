$(function() {
    let urlpath = window.location.pathname;

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
                        addDogPhoto(photo.id, photo.photo, false);
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


});