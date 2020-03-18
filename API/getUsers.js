const fn = (req, res, model) => {
    model.findAll({
       // attributes : ['', ''], only include when you want to specify certain fields to show
    }).then(dbRes => {
        res.json(dbRes);

    });
}

module.exports = fn;