let logger;

const consoleInit = function() {
    logger = document.getElementById('log');
    _print(new Date().toString());
    _print("");
};

const _print = function(message) {
    if (!logger) {
        logger = document.getElementById('log');
    }

    for (let i = 0; i < arguments.length; i++) {
        if (typeof arguments[i] == 'object') {
            logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(arguments[i], undefined, 2) : arguments[i]) + '<br />';
        } else {
            logger.innerHTML += arguments[i] + '<br />';
        }
    }
};

const _print_bold = function(message) {
    if (!logger) {
        logger = document.getElementById('log');
    }

    for (let i = 0; i < arguments.length; i++) {
        if (typeof arguments[i] == 'object') {
            logger.innerHTML += '<b>' + (JSON && JSON.stringify ? JSON.stringify(arguments[i], undefined, 2) : arguments[i]) + '</b><br />';
        } else {
            logger.innerHTML += '<b>' + arguments[i] + '</b><br />';
        }
    }
};

const _print_link = function(message, onclickFunction) {
    if (!logger) {
        logger = document.getElementById('log');
    }

    const uuid = ID();

    logger.innerHTML += '<a href="#" id=' + uuid + '>' + message + '</a><br />';

    $(document).ready(function() {
        $('#' + uuid).click(function(){
            console.log("clicked");
            onclickFunction();
        });
    });
};

const _print_button = function(message, onclickFunction) {
    if (!logger) {
        logger = document.getElementById('log');
    }

    const uuid = ID();

    logger.innerHTML += '<button type="button" id=' + uuid + '>' + message + '</button>';

    $(document).ready(function() {
        $('#' + uuid).click(function(){
            console.log("clicked");
            onclickFunction();
        });
    });
};

const _print_button_input = function(message, defaultValue, onclickFunction) {
    if (!logger) {
        logger = document.getElementById('log');
    }

    const uuid = ID();
    const input_uuid = ID();

    logger.innerHTML += '<button type="button" id=' + uuid + '>' + message + '</button>';
    logger.innerHTML += '<input type="text" id=' + input_uuid + ' value="'+ defaultValue +'"></input>';
    $(document).ready(function() {
        $('#' + uuid).click(function(){
            let value = $('#' + input_uuid).val();
            value = String(Number(value).toFixed(18))
            onclickFunction(value);
        });
    });
};

const _print_button_input_pure = function(message, defaultValue, onclickFunction) {
    if (!logger) {
        logger = document.getElementById('log');
    }

    const uuid = ID();
    const input_uuid = ID();

    logger.innerHTML += '<button type="button" id=' + uuid + '>' + message + '</button>';
    logger.innerHTML += '<input type="text" id=' + input_uuid + ' value="'+ defaultValue +'"></input>';
    $(document).ready(function() {
        $('#' + uuid).click(function(){
            let value = $('#' + input_uuid).val();
            onclickFunction(value);
        });
    });
};

const _print_href = function(message, href) {
    if (!logger) {
        logger = document.getElementById('log');
    }

    const uuid = ID();

    logger.innerHTML += `<a href="${href}" target="_blank" id="${uuid}">${message}</a><br />`;
};

const printWarning = function() {
    _print_bold("WARNING: Do audit the contract before staking any asset!\n")
};