// for chart
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

// add comment, photo
function addComment(comment) {
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

function addDogPhoto(id, photo, isShowDelete) {
    let imgContainer = $('<div class="col-lg-3 col-6 my-3 dog-img-container">');
    let lightboxContainer = $('<a href="' + photo + '" data-alt="dog photos" data-lightbox="photos">');
    lightboxContainer.append('<img id="' + id + '" src="' + photo + '" class="dog-img img-fluid rounded w-100" alt="dog photos" />');
    if (isShowDelete) {
        imgContainer.append('<button type="button" class="btn btn-danger btn-sm btn-round btn-shadow btn-delete-photo position-absolute">delete</button>');
    }
    imgContainer.append(lightboxContainer);
    $("#photos").append(imgContainer);
}

lightbox.option({
    'fadeDuration': 200,
    'imageFadeDuration': 200,
    'showImageNumberLabel': false,
    'resizeDuration': 200,
    'wrapAround': true
})

function updateDogHealthInfo(weight, height, bmi, condition, date) {
    $('#dog-weight').text(weight);
    $('#dog-height').text(height);
    $('#dog-bmi').text(bmi);
    $('#dog-health').text(condition);
    $('#dog-date').text(date);
}