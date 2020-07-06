function isAllowedString(str) {
    let code, i, len;
    for (i = 0, len = str.length; i < len; i++) {
        code = str.charCodeAt(i);
        if (!(code > 43 && code < 47) &&
            !(code > 47 && code < 60) &&
            !(code > 64 && code < 91) &&
            !(code > 96 && code < 123) &&
            (code !== 32) && (code !== 33) &&
            (code !== 39)) {
            return false;
        }
    }
    return true;
}

function formatSeconds(sec) {
    let hours = Math.floor(sec / 3600);
    sec %= 3600;
    let minutes = Math.floor(sec / 60);
    let seconds = Math.floor(sec % 60);

    let timeDisplay = [];

    if (hours !== 0) {
        timeDisplay.push(` ${hours} hour(s)`);
    } if (minutes !== 0) {
        timeDisplay.push(` ${minutes} minute(s)`);
    } if (seconds !== 0) {
        timeDisplay.push(` ${seconds} second(s)`);
    }

    return timeDisplay.toString();
}

module.exports = {
    isAllowedString: isAllowedString,
    formatSeconds: formatSeconds
};