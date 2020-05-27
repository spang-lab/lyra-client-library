

/**
 * Form input validation
 * @memberof module:util
 */

/**
 * checks if the value is a valid email,
 * note: this check will not reject many invalid emails
 * @param {String} email - the possible email adress
 */
export function isEmail(email) {
    if (typeof email !== 'string') {
        return false;
    }
    if (email.length < 5) {
        return false;
    }
    if (email.length > 256) {
        return false;
    }
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}
/**
 * checks if the value is a valid string
 * @param {String} text - the text to check
 * @param {Number} maxLength - maximum allowed length
 */
export function isText(text, maxLength = 64) {
    if (typeof text !== 'string') {
        return false;
    }
    if (text.length < 3 || text.length > maxLength) {
        return false;
    }
    return true;
}

/**
 * Calulate password entropy in bits
 * @param {String} password - the password to check
 */
export function getEntropy(password) {
    if (typeof password !== 'string') {
        return 0;
    }
    let poolsize = 0;
    const re1 = /[a-z]/;
    if (re1.test(password)) {
        poolsize += 26;
    }
    const re2 = /[A-Z]/;
    if (re2.test(password)) {
        poolsize += 26;
    }
    const re3 = /[0-9]/;
    if (re3.test(password)) {
        poolsize += 10;
    }
    const re4 = /[^a-zA-Z0-9]/;
    if (re4.test(password)) {
        poolsize += 10;
    }
    if (poolsize === 0) {
        return 0;
    }
    const entropy = Math.log2(poolsize) * password.length;
    return entropy;
}

/**
 * checks if the value is a strong password
 * @param {String} password - the password to check
 */
export function isPassword(password) {
    if (typeof password !== 'string') {
        return false;
    }
    if (getEntropy(password) < 40) {
        return false;
    }
    return true;
}

/**
 * automatically validate a certain form key
 * @param {String} key - the name of the form field
 * @param {String} value - the value of the field
 */
export function validateKey(key, value) {
    switch (key) {
    case 'name':
        if (isText(value, 64)) {
            return {
                value,
                error: null,
                valid: true,
            };
        }
        return {
            value,
            error: 'invalid username, please choose a name between 3 and 64 characters',
            valid: false,
        };
    case 'password':
        if (!isText(value, 64)) {
            return {
                value,
                error: 'please choose a password less than 64 characters long',
                valid: false,
            };
        }
        if (isPassword(value)) {
            return {
                value,
                error: null,
                valid: true,
            };
        }
        return {
            value,
            error: 'invalid password, please choose longer or more complicated password',
            valid: false,
        };
    case 'password2':
        if (value.password === value.password2) {
            return {
                value: value.password2,
                error: null,
                valid: true,
            };
        }
        return {
            value: value.password2,
            error: 'passwords do not match',
            valid: false,
        };
    case 'email':
        if (isEmail(value)) {
            return {
                value,
                error: null,
                valid: true,
            };
        }
        return {
            value,
            error: 'invalid email address',
            valid: false,
        };
    case 'fullName':
        if (isText(value, 128)) {
            return {
                value,
                error: null,
                valid: true,
            };
        }
        return {
            value,
            error: 'please enter your full name',
            valid: false,
        };
    case 'institute':
        if (isText(value, 128)) {
            return {
                value,
                error: null,
                valid: true,
            };
        }
        return {
            value,
            error: 'please enter your institute',
            valid: false,
        };
    case 'captchaSolution':
        if (typeof value === 'string' && value.length < 6) {
            return {
                value,
                error: null,
                valid: null,
            };
        }
        return {
            value,
            error: 'invalid captchaSolution',
            valid: false,
        };


    default:
        return {
            value,
            error: `no validation for key ${key}`,
            valid: false,
        };
    }
}
/**
 * validate a user completely
 * @param {Object} user - the user
 * @param {string} user.name - the name of the user
 * @param {string} user.password - the users password
 * @param {string} user.email - the users email adress
 * @param {string} user.fullName - the users full name
 * @param {string} user.institute - the users institute
 */
export function validateAll(user) {
    const errors = [];
    const valid = Object.keys(user).reduce((acc, key) => {
        if (key === 'password2') {
            return acc;
        }
        const vobj = validateKey(key, user[key]);
        if (vobj.error) {
            errors.push(vobj.error);
            return false;
        }
        return acc && vobj.valid;
    }, true);
    return {
        valid,
        errors,
    };
}

