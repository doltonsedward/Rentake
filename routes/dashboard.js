const router = require('express').Router()

router.get('/login', function(req, res) {
    res.render('auth/login-admin', { title: 'Login to dashboard', isLogin: req.session.isLogin})
})

module.exports = router