let urlpath = window.location.pathname;

lightbox.option({
    'fadeDuration': 200,
    'imageFadeDuration': 200,
    'showImageNumberLabel': false,
    'resizeDuration': 200,
    'wrapAround': true
});

// chart
let updateLabelAndData = function(chart, label, data) {
    chart.data.labels = label;
    chart.data.datasets.forEach((dataset) => {
        dataset.data = data;
    });
    chart.update();
}

let addLabel = function(chart, label) {
    chart.data.labels.push(label);
    chart.update();
}

let addData = function(chart, data) {
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}

let addComment = function(comment) {
    let commentContainer = $('<div class="row single-comment">');
    let avatarContainer = $('<div class="col-2">');
    let avatar = $('<img class="avatar" src="/public/img/avatar/default-user.png">');
    if (comment.user.avatar) {
        avatar = $('<img class="avatar" src="' + comment.user.avatar + '">');
    }
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

let addDogPhoto = function(id, photo, isShowDelete) {
    let imgContainer = $('<div class="col-lg-3 col-6 my-3 dog-img-container">');
    let lightboxContainer = $('<a href="' + photo + '" data-alt="dog photos" data-lightbox="photos">');
    lightboxContainer.append('<img id="' + id + '" src="' + photo + '" class="dog-img img-fluid rounded w-100" alt="dog photos" />');
    if (isShowDelete) {
        imgContainer.append('<button type="button" class="btn btn-danger btn-sm btn-round btn-shadow btn-delete-photo position-absolute">delete</button>');
    }
    imgContainer.append(lightboxContainer);
    $("#photos").append(imgContainer);
}

let initSubmitCommentForm = function() {
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
                    $("#comment-form-content").val('');
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
    
    $("#comment-form-content").keypress(function (e) {
        if(e.which == 13) {
            $('#comment-form').submit();
            e.preventDefault();
        }
    });
}

let initLoadMoreComment = function() {
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
}

let initLoadMorePhoto = function(isShowDelete) {
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
                        addDogPhoto(photo.id, photo.photo, isShowDelete);
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
}