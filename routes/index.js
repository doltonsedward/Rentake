const express = require("express")
const router = express.Router()
const Movie = require('../models/Movie')

const authRoute = require('./auth')
const movieRoute = require('./movies')
const dashboardRoute = require('./dashboard')

router.get('/', async (req, res) => {
    try {
        const movies = await Movie.find()

        const dataMovies = []
        movies.map(item => {
            dataMovies.push({...item})
        })

        res.render('index', {title: 'Home page', isLogin: req.session.isLogin, user: req.session.user, dataMovies})
    } catch (error) {
        console.log(error)
    }
  })

router.use('/', authRoute)
router.use('/movies', movieRoute)
router.use('/dashboard', dashboardRoute)


router.all('*', (req, res) => {
    res.status(404).render('response/400', { title: '404 NOT FOUND'})
})

module.exports = router