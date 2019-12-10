function error(data) {
    const message = $('<div class="alert alert-danger alert-message">');
    const close = $('<button type="button" class="close" data-dismiss="alert">&times</button>');
    message.append(close);
    message.append(data);
    message.appendTo($('body')).show().delay(3000).fadeOut(400);
}

function success(data) {
    const message = $('<div class="alert alert-success alert-message">');
    const close = $('<button type="button" class="close" data-dismiss="alert">&times</button>');
    message.append(close);
    message.append(data);
    message.appendTo($('body')).show().delay(2000).fadeOut(300);
}