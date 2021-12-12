const router = require('express').Router()

router.get('/login', function(req, res) {
    res.render('auth/login-admin', { title: 'Login to dashboard', isLogin: req.session.isLogin})
})

router.get('/', function(req, res) {
    res.render('admin/dashboard', { title: 'Dashboard', isLogin: req.session.isLogin})
})

module.exports = router