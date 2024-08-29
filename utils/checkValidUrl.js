function isValidURL(str) {
  const pattern = new RegExp('^(https?:\\/\\/)'+ // enforce https protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,})' + // domain name
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator

  const domainExtensionPattern = /\.(com|org|net|gov|edu|io|co|us|in|info|biz|me)$/i; // domain extension pattern

  return pattern.test(str) && domainExtensionPattern.test(str);
}

module.exports = isValidURL;
