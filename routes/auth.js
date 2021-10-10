const dbConnection = require('../connection/db')
const router = require('express').Router()

// import bcrypt for password hashing
const bcrypt = require('bcrypt') 

router.get('/login', function(req, res) {
    res.render('auth/login', { title: 'Login', isLogin: req.session.isLogin})
})

router.get('/register', function(req, res) {
    res.render('auth/register', { title: 'Register', isLogin: req.session.isLogin})
})

router.get('/dashboard/login', function(req, res) {
    res.render('auth/login-admin', { title: 'Login Dashboard', isLogin: req.session.isLogin})
})

// For logout will destroy session
router.get('/logout', function(req, res) {
    req.session.destroy()
    res.redirect('/')
})

// Login handler
router.post('/login', function(req, res) {
    const { email, password } = req.body
    const query = 'SELECT id, name, email, password FROM tb_user WHERE email= ?'

    if (email == '' || password == '') {
        req.session.message = {
            type: 'wrong',
            message: 'Please fulfill input'
        }

        res.redirect('/login')
        return
    }

    dbConnection.getConnection((err, conn) => {
        if (err) throw err

        conn.query(query, [email], (err, results) => {
            if (err) throw err

            const isMatch = bcrypt.compareSync(password, results[0].password)
            if (!isMatch) {
                req.session.message = {
                    type: 'wrong',
                    message: 'Email or password are incorrect'
                }

                return res.redirect('/login')
            } else {
                req.session.message = {
                    type: 'success',
                    message: 'Login successful'
                }

                req.session.isLogin = true
                req.session.user = {
                    id: results[0].id,
                    email: results[0].email,
                    name: results[0].name
                }

                return res.redirect('/')
            }
        })

        conn.release()
    })
})

router.post('/register', function(req, res) {
    const { name, email, password } = req.body
    const query = 'INSERT INTO tb_user (name, email, password) VALUES (?,?,?)';

    if (name == '' || email == '' || password == '') {
        req.session.message = {
            type: 'wrong',
            message: 'Please fulfill input'
        }

        res.redirect('/register')
        return
    }

    const hashPass = bcrypt.hashSync(password, 10)
    dbConnection.getConnection((err, conn) => {
        if (err) throw err

        conn.query(query, [name, email, hashPass], (err, results) => {
            if (err) throw err

            req.session.message = {
                type: 'valid',
                message: 'register successful'
            }

            res.redirect('/register')
        })

        conn.release()
    })
})

router.post('/dashboard/login', function(req, res) {
    const { email, password } = req.body
    const query = 'SELECT id, name, email, password, user_status, user_status FROM tb_user WHERE email= ?'

    if (email == '' || password == '') {
        req.session.message = {
            type: 'wrong',
            message: 'Please fulfill input'
        }

        res.redirect('/dashboard/login')
        return
    }

    dbConnection.getConnection((err, conn) => {
        if (err) throw err

        conn.query(query, [email], (err, results) => {
            if (err) throw err

            // console.log(results[0].user_status)

            const isMatch = bcrypt.compareSync(password, results[0].password)
            if (!isMatch) {
                console.log(isMatch)
                console.log(results[0])
                req.session.message = {
                    type: 'wrong',
                    message: 'Email or password are incorrect'
                }

                return res.redirect('/dashboard/login')
            } else {
                if (!results[0].user_status == 1) {
                    req.session.message = {
                        type: 'wrong',
                        message: 'You are not admin!'
                    }

                    return res.redirect('/dashboard/login')
                }

                req.session.message = {
                    type: 'success',
                    message: 'Login successful'
                }

                req.session.isLogin = true
                req.session.isAdmin = true
                req.session.user = {
                    id: results[0].id,
                    email: results[0].email,
                    name: results[0].name
                }

                return res.redirect('/dashboard')
            }
        })

        conn.release()
    })
})

router.get('/dashboard', function(req, res) {
    const query = "SELECT * FROM tb_user ORDER BY created_at DESC"

    if (!req.session.isLogin) {
        return res.redirect('/dashboard/login')
    }

    dbConnection.getConnection((err, conn) => {
        if (err) throw err

        conn.query(query, (err, results) => {

            const users = []
            for (let result of results) {
                users.push({...result})
            }

            const admins = []
            for (let result of results) {
                if (result.user_status === 1) {
                    admins.push({...result})
                }
            }
            
            res.render('admin/dashboard', { title: 'Welcome admin', isLogin: req.session.isLogin, users, admins})
        })

        conn.release()
    })
})

module.exports = router;