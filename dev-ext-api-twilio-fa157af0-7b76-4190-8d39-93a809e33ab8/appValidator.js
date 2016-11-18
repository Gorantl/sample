
var validator = require('validator');

var appValidator = function (field, validators, errorCodes, errors) {
    var index = 0;
    if (validators && Array.isArray(validators)) {

        validators.forEach(function doValidation(type, index) {
            var err = new Error();
            switch (type) {
                case "email" :
                    if (!validator.isEmail(field)) {
                        err.name = errorCodes[index];
                        errors.push(err);
                    }
                    break;
                case "required":
                    if (validator.isNull(field)) {
                        err.name = errorCodes[index];
                        errors.push(err);
                    }

                    break;
                case "mobile":
                    if (!validator.isMobile(field)) {
                        err.name = errorCodes[index];
                        errors.push(err);
                    }
                    break;
                default:
            }
        });
        return errors;


    }

    function doValidation(type, index) {

        switch (type) {
            case "email" :
                if (!validator.isEmail(field)) {
                    errors.push(err.name = errorCodes[index]);
                    return true;
                }
                else {
                    return false;
                }
                break;
            case "required":
                if (!validator.isNull(field)) {
                    errors.push(err.name = errorCodes[index]);
                    return true;
                }
                else {
                    return false;
                }
                break;
            case "mobile":
                if (!validator.isMobile(field)) {
                    errors.push(err.name = errorCodes[index]);
                    return true;
                }
                else {
                    return false;
                }
                break;
            default:
                return true;
        }
    }
}

module.exports = appValidator;
