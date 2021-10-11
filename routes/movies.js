
const dbConnection = require('../connection/db')
const router = require('express').Router()

router.get('/detail', function(req, res) {
    const query = "SELECT * FROM tb_movie ORDER BY created_at DESC"

    dbConnection.getConnection((err, conn) => {
        if (err) throw err

        // need debugging
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

            req.session.isBtnActive = {
                home: 'active',
                favorite: 'not-active',
                watchList: 'not-active',
                cart: 'not-active',
        
                friends: 'not-active',
                parties: 'not-active',
                setting: 'not-active'
            }
            
            res.render('movies/movie', {
                title: 'Movissses', 
                isLogin: req.session.isLogin, 
                user: req.session.user, movies, 
                isBtnActive: req.session.isBtnActive, 
                numberOfMovies: movies.length}
            )
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
                message: 'THank you for buying our ticket'
            }

            res.redirect('/cart')
        })

        conn.release()
    })
})

router.get('/fav', function(req, res) {
    const {name} = req.session.user 
    const query = `
    SELECT tb_user.name, tb_movie.id, tb_movie.movie_name, tb_movie.image
    FROM tb_user INNER JOIN tb_movie
    ON tb_user.id = tb_movie.favorite_user
    WHERE tb_user.name LIKE ?
    `

    dbConnection.getConnection((err, conn) => {
        if (err) throw err

        conn.query(query, [`${name}%`], (err, results) => {
            if (err) throw err

            const favorites = []
            for (let result of results) {
                favorites.push({...result})
            }

            req.session.isBtnActive = {
                home: 'active',
                favorite: 'not-active',
                watchList: 'not-active',
                cart: 'not-active',
        
                friends: 'not-active',
                parties: 'not-active',
                setting: 'not-active'
            }

            console.log(favorites)
            res.render('movies/fav', {title: 'Movissses', isLogin: req.session.isLogin, user: req.session.user, isBtnActive: req.session.isBtnActive, favorites})
        })

        conn.release()
    })
})

router.get('/setting', function(req, res) {
    req.session.isBtnActive = {
        home: 'not-active',
        favorite: 'not-active',
        watchList: 'not-active',
        cart: 'not-active',

        friends: 'not-active',
        parties: 'not-active',
        setting: 'active'
    }

    res.render('movies/setting', {title: 'Setting page', isLogin: req.session.isLogin, user: req.session.user, isBtnActive: req.session.isBtnActive})
})

router.post('/setting', function(req, res) {
    const {userId, userName} = req.body
    const query = `
    UPDATE tb_user
    SET name = ?, updated_at = NULL
    WHERE id = ?;
    SELECT * FROM tb_user
    WHERE name = 
    `

    dbConnection.getConnection((err, conn) => {
        if (err) throw err

        conn.query(query, [userName, userId], (err, results) => {
            if (err) throw err

            // req.session.user = {
            //     id: results[0].id,
            //     email: results[0].email,
            //     name: results[0].name
            // }

            // NEED TO BE FIXED
            // for (let result of results[1]) {
            //     console.log({...result})
            // }

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
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `

    dbConnection.getConnection((err, conn) => {
        if (err) throw err

        const intMovieId = parseInt(moviesId)
        const intUserId = parseInt(userId)
        const intTicketNumber = parseInt(ticketNumber)
        const doublePrice = parseFloat(price)

        conn.query(query, [intMovieId, intUserId, intTicketNumber, dateShow, timeShow, doublePrice, venue], (err, results) => {
            if (err) throw err

            // console.log(results)
            res.redirect(`/movies/cart/${userId}`)
        })

        conn.release()
    })
})

router.get('/cart', function(req, res) {
    
    const query = `
    SELECT tb_movie.movie_name, tb_movie.movie_hour, tb_ticket.date_show, tb_ticket.time_show, tb_ticket.price, tb_ticket.venue
    FROM tb_movie INNER JOIN tb_ticket
    ON tb_movie.id = tb_ticket.movie_id
    WHERE tb_ticket.user_id = ?
    `
    if (!req.session.isLogin) {
        return res.redirect('/login')
    }

    dbConnection.getConnection((err, conn) => {
        if (err) throw err

        const userId = req.session.user.id
        conn.query(query, [userId], (err, results) => {
            if (err) throw err

            req.session.isBtnActive = {
                home: 'not-active',
                favorite: 'not-active',
                watchList: 'not-active',
                cart: 'active',
        
                friends: 'not-active',
                parties: 'not-active',
                setting: 'not-active'
            }

            let infoTicket = []
            let totalPriceTicket = []
            for (let ticket of results) {
                infoTicket.push({...ticket})
                totalPriceTicket.push(ticket.price)
            }

            let finalPrice = 0
            if (!totalPriceTicket.length) {
                finalPrice = 0
            } else {
                finalPrice = totalPriceTicket.reduce((accumulator, currentValue) => accumulator + currentValue)
            }
            
            let amount = totalPriceTicket.length

            res.render('movies/cart', {
                title: 'Cart', 
                isBtnActive: req.session.isBtnActive, 
                user: req.session.user, 
                isLogin: req.session.isLogin, 
                infoTicket,
                finalPrice,
                amount
                }
            )
        })

        conn.release()
    })
})

router.post('/cart', function(req, res) {
    const {userId, amount, subTotal} = req.body

    const query = `
    INSERT INTO tb_payment (ticket_id, amount, sub_total) VALUES (?,?,?)
    `
    if (!req.session.isLogin) {
        return res.redirect('/login')
    }

    dbConnection.getConnection((err, conn) => {
        if (err) throw err

        conn.query(query, [userId, amount, subTotal], (err, results) => {
            if (err) throw err

            res.redirect('/movies/cart')
        })

        conn.release()
    })
})

router.get('/detail/:id', function(req, res) {
    const {id} = req.params

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

            req.session.isBtnActive = {
                home: 'active',
                favorite: 'not-active',
                watchList: 'not-active',
                cart: 'not-active',
        
                friends: 'not-active',
                parties: 'not-active',
                setting: 'not-active'
            }

            res.render('movies/detail-movie', {
                title: `Detail film - ${movies[0].movie_name}`, 
                isBtnActive: req.session.isBtnActive,
                isLogin: req.session.isLogin, 
                user: req.session.user,
                movies
                }
            )
        })

        conn.release()
    })
})



module.exports = router;