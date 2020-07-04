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

module.exports = {
    isAllowedString: isAllowedString
};