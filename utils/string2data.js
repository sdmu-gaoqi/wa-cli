module.exports = (str) => {
    try {
        return new Function('return ' + str)();
    } catch (error) {
        return str;
    }
}