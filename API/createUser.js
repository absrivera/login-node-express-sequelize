//security 
const bcrypt = require('bcrypt');

const fn = (req, res, model, cb) => {
    bcrypt.hash(req.body.password, 10).then((hash) => {
      return  model.create({
            username: req.body.username,
            password: hash,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
        })
    }).then((dbRes) => {
        cb(dbRes.toJSON());
    }).catch(err => {
        if (err){
            res.send(err);
            throw(err);
        }
    });
}

module.exports = fn;