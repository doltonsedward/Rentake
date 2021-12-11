const dbConnection = require('../connection/db')
const router = require('express').Router()

router.get('/detail', function(req, res) {
    const query = "SELECT * FROM tb_movie ORDER BY created_at DESC"

    dbConnection.getConnection((err, conn) => {
        if (err) throw err

        conn.query(query, (err, results) => {
            if (err) throw err

            const movies = []
            for (let result of results) {
                movies.push({...result})
            }

            res.render('movies/movie', {title: 'Movies', isLogin: req.session.isLogin, user: req.session.user})
        })

        conn.release()
    })
})

router.get('/cart', function(req, res) {
    const query = `
    SELECT tb_movie.movie_name, tb_ticket.ticket_number, tb_ticket.date_show, tb_ticket.price, tb_ticket.venue
    FROM tb_movie
    inner join tb_ticket ON tb_movie.id = tb_ticket.movie_id;
    `

    dbConnection.getConnection((err, conn) => {
        if (err) throw err

        conn.query(query, (err, results) => {
            if (err) throw err

            const infoTicket = []
            for (let result of results) {
                infoTicket.push({...result})
            }

            res.render('movies/cart', { title: 'Cart', isLogin: req.session.isLogin, user: req.session.user, infoTicket })
        })

        conn.release()
    })
})

router.get('/search', function(req, res) {
    const {searchInput} = req.query 
    const query = `
    SELECT tb_movie.type_id, tb_type.type_name, tb_movie.id, tb_movie.movie_name, tb_movie.image
    FROM tb_type INNER JOIN tb_movie
    ON tb_type.id = tb_movie.type_id
    WHERE movie_name LIKE ?
    `

    dbConnection.getConnection((err, conn) => {
        if (err) throw err

        conn.query(query, [`${searchInput}%`], (err, results) => {
            if (err) throw err

            const movies = []
            for (let result of results) {
            movies.push({...result})
            }
            
            res.render('movies/movie', {title: 'Movissses', isLogin: req.session.isLogin, user: req.session.user, movies})
        })

        conn.release()
    })
})

router.post('/payment', function(req, res) {
    const {moviesId, userId, ticketNumber, dateShow, timeShow, price, venue} = req.body
    const query = `
    INSERT INTO tb_ticket 
    (movie_id, user_id, ticket_number, date_show, time_show, price, venue)
    VALUES (?,?,?,?,?,?,?)
    `

    dbConnection.getConnection((err, conn) => {
        if (err) throw err

        conn.query(query, [moviesId, userId, ticketNumber, dateShow, timeShow, price, venue], (err, results) => {
            if (err) throw err

            req.session.message = {
                type: 'valid',
                message: 'Thank you for buying our ticket'
            }

            res.redirect('/cart')
        })

        conn.release()
    })
})

router.get('/setting', function(req, res) {
    res.render('movies/setting', {title: 'Setting page', isLogin: req.session.isLogin, user: req.session.user})
})

router.post('/setting', function(req, res) {
    const {userId, userName} = req.body
    const query = `
    UPDATE tb_user
    SET name = ?, updated_at = ''
    WHERE id = ?
    `

    dbConnection.getConnection((err, conn) => {
        if (err) throw err

        conn.query(query, [userName, userId], (err, results) => {
            if (err) throw err

            res.redirect('/')
        })

        conn.release()
    })
})

router.post('/ticket', function(req, res) {
    const {moviesId, userId, ticketNumber, dateShow, timeShow, price, venue} = req.body
    const query = `
    INSERT INTO tb_ticket 
    (movie_id, user_id, ticket_number, date_show, time_show, price, venue)
    VALUES (?,?,?,?,?,?,'')
    `

    dbConnection.getConnection((err, conn) => {
        if (err) throw err

        conn.query(query, [moviesId, userId, ticketNumber, dateShow, timeShow, price, venue], (err, results) => {
            if (err) throw err

            res.redirect('/')
        })
    })
})

router.get('/detail/:id', function(req, res) {
    const { id } = req.params

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

            res.render('movies/detail-movie', {title: `Detail film - ${movies[0].name}`, isLogin: req.session.isLogin, user: req.session.user, movies})
        })

        conn.release()
    })
})



module.exports = router;