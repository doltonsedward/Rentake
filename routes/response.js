const router = require('express').Router()

router.get('/500', function(req, res) {
    res.render('response/500', { title: 'Response'})
})

module.exports = router