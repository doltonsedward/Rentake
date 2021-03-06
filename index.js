require('dotenv').config()
const http = require('http')
const express = require('express')
const path = require('path')
const session = require('express-session')
const flash = require('express-flash')

const app = express()
const hbs = require('hbs')

// import routes
const authRoute = require('./routes/auth')
const movieRoute = require('./routes/movies')
const dashboardRoute = require('./routes/dashboard')

const dbConnection = require('./connection/db')

app.use("/static", express.static(path.join(__dirname, "/public")))
app.use("/uploads", express.static(path.join(__dirname, "/uploads")))
app.use(express.urlencoded({ extended: false }));

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "hbs")

hbs.registerPartials(path.join(__dirname, 'views/partials'))

// user session
app.use(
  session({
    cookie: {
      maxAge: 7200000,
      secure: false,
      httpOnly: true,
    },
    store: new session.MemoryStore(),
    saveUninitialized: true,
    resave: false,
    secret: "secretValue",
  })
);

// use flash for sending message
app.use(flash())

// set up flash
app.use((req, res, next) => {
  res.locals.message = req.session.message
  delete req.session.message
  next()
})

app.get('/', (req, res) => {
    const query = 'SELECT * FROM tb_movie ORDER BY created_at DESC'

    dbConnection.getConnection((err, conn) => {
      if (err) return res.render("response/500")

      conn.query(query, (err, results) => {
        if (err) throw err
        
        const movies = []
        for (let result of results) {
          movies.push({...result})
        }
        
        res.render("index", {title: 'Home Page', isLogin: req.session.isLogin, user: req.session.user, movies})
      })

      conn.release()
    })
})

// use routes
app.use('/', authRoute)
app.use('/movies', movieRoute)
app.use('/dashboard', dashboardRoute)

app.all('*', (req, res) => {
  res.status(404).render('response/400', { title: '404 NOT FOUND'})
})

const server = http.createServer(app)
const port = 5000
server.listen(process.env.PORT || port, () => {
    console.log(`Server sedang berjalan pada http://localhost:${port}`)
})
