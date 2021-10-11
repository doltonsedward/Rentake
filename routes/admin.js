const dbConnection = require('../connection/db')
const router = require('express').Router()
const uploadFile = require("../middlewares/uploadFile")
const path = require('path')
const fs = require('fs')

router.get('/movies', function(req, res) {
    const query = "SELECT * FROM tb_movie ORDER BY updated_at DESC LIMIT 10"

    if (!req.session.isAdmin) {
        return res.redirect('/dashboard/login')
    }

    dbConnection.getConnection((err, conn) => {
        if (err) throw err

        conn.query(query, (err, results) => {

            const movies = []
            for (let result of results) {
                movies.push({...result})
            }
            
            res.render('admin/add-movies', { title: 'CRUD Session', movies, isAdmin: req.session.isAdmin})
        })

        conn.release()
    })
})

router.post('/movies', uploadFile("image"), function(req, res) {
    let {genre, name, movieHour, content} = req.body
    let image = req.file.filename
    const query = `
    INSERT INTO tb_movie (type_id, movie_name, movie_hour, image, content) VALUES (?,?,?,?,?);
    `

    if (!req.session.isLogin) {
        return res.redirect('/dashboard/login')
    }

    dbConnection.getConnection((err, conn) => {
        if (err) throw err

        conn.query(query, [genre, name, movieHour, image, content], (err, results) => {
            if (err) throw err

            res.redirect('/')
        })

        conn.release()
    })
})

router.post('/movies/update',  uploadFile("image"), function(req, res) {
    const {movieId, movieName, movieHour, content} = req.body
    let image = req.file.filename
    const query = `
    UPDATE tb_movie
    SET movie_name = ?, movie_hour = ?, image = ?, content = ?, updated_at = NULL
    WHERE id = ?;
    `

    if (!req.session.isLogin) {
        return res.redirect('/dashboard/login')
    }

    dbConnection.getConnection((err, conn) => {
        if (err) throw err

        conn.query(query, [movieName, movieHour, image, content, movieId], (err, results) => {
            if (err) throw err

            console.log(results)
            res.redirect('/dashboard')
        })

        conn.release()
    })
})

router.get('/movies/update/:id', function(req, res) {
    const {id} = req.params
    const query = 'SELECT * FROM tb_movie WHERE id = ?'

    dbConnection.getConnection((err, conn) => {
        if (err) throw err

        conn.query(query, [id], (err, results) => {
            if (err) throw err

            const movies = []
            for (let result of results) {
                movies.push({...result})
            }

            res.render('admin/update-movies', {title: 'Update movie', isLogin: req.session.isLogin, isAdmin: req.session.isAdmin, user: req.session.user, movies})
        })
        
        conn.release()
    })
})

router.get('/movies/delete/:id/:image', function(req, res) {
    const {id, image} = req.params
    const query = 'DELETE FROM tb_movie WHERE id = ?'

    dbConnection.getConnection((err, conn) => {
        if (err) throw err

        conn.query(query, [id], (err, results) => {
            if (err) throw err

            console.log(results)
            fs.unlinkSync(path.join(__dirname, `../uploads/${image}`))

            res.redirect('/dashboard/movies')
        })
        
        conn.release()
    })
})


router.get('/movies/:id', function(req, res) {
    const {id} = req.params

    if (!req.session.isLogin) {
        return res.redirect('/dashboard/login')
    }

    const query = `
    SELECT tb_movie.id, tb_movie.movie_name, tb_type.type_name, tb_movie.image, tb_movie.movie_hour, tb_movie.content
    FROM tb_type INNER JOIN tb_movie
    ON tb_type.id = tb_movie.type_id
    WHERE tb_movie.id = ?;
    `

    dbConnection.getConnection((err, conn) => {
        if (err) throw err

        conn.query(query, [id], (err, results) => {
            if (err) throw err

            const movies = []
            for (let result of results) {
                movies.push({...result})
            }

            res.render('admin/detail-movie', {title: `Detail film - ${movies[0].movie_name}`, isLogin: req.session.isLogin, isAdmin: req.session.isAdmin, user: req.session.user, movies})
        })

        conn.release()
    })
})


module.exports = router;