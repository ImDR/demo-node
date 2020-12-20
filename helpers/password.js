const bcrypt = require('bcryptjs');

module.exports = {
    passwordHash: (password) => {
        return new Promise((resolve, reject) => {
            bcrypt.genSalt(10, function(err, salt) {
                if (err) return reject(err);

                bcrypt.hash(password, salt, function(err, hash) {
                    if (err) return reject(err);

                    resolve(hash);
                });
            });
        });   
    }
}