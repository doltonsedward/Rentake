const dbConnection = require('../connection/db')
const router = require('express').Router()
const uploadFile = require("../middlewares/uploadFile");

router.get('/movies', function(req, res) {
    const query = "SELECT * FROM tb_movie ORDER BY created_at DESC LIMIT 10"

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
            
            console.log(results)
            // const movies = []
            // for (let result of results) {
            //     console.log(result)
            // }

            res.render('/', { title: 'CRUD Session', isLogin: req.session.isLogin})
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

            console.log(movies)

            res.render('admin/detail-movie', {title: `Detail film - ${movies[0].movie_name}`, isLogin: req.session.isLogin, user: req.session.user, movies})
        })

        conn.release()
    })
})


module.exports = router;