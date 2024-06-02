function isValidObjectId(id) {
    const objectIdRegex = /^[a-fA-F0-9]{24}$/;
    return objectIdRegex.test(id);
}

module.exports = { isValidObjectId }