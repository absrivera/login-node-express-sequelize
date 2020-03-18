const bcrypt = require('bcrypt');

const fn = (req, res, model, session, cb) => {
    model.findOne({
        where: {
            email: req.body.email
        }
    }).then(dbRes => {
        if (!dbRes) {
            cb('error');
        } else {
            //dbRes is user object from DB
            let userResponse = dbRes.toJSON();
            bcrypt.compare(req.body.password, userResponse.password).then((result) => {
                if (result === true) {
                    session.authenticated = true;
                    cb(userResponse);
                }else {
                    session.authenticated = false;
                    cb('noauth');
                }
            }).catch(err => {
                session.authenticated = false;
                cb('error');
            })
        }

    }).catch(err => {
        if (err) {
            res.send(err);
            throw (err);
        }

    });
}

module.exports = fn;