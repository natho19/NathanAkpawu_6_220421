module.exports = {
    passwordCheck: function(password) {
        // Au moins 6 caractères, un nombre, une minuscule, et une majuscule
        var regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6}/;
        return regex.test(password);
    }
  }