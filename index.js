require('dotenv').config()
const http = require('http')
const express = require('express')
const path = require('path')
const session = require('express-session')
const flash = require('express-flash')

const app = express()
const hbs = require('hbs')

const dbConnection = require('./connection/db')
dbConnection.connection.on('error', (err) => {
  console.log(err)
  return res.render("response/500")
})

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

// use routes
const routes = require('./routes')
app.use(routes)

const server = http.createServer(app)
const port = 5000
server.listen(process.env.PORT || port, () => {
    console.log(`Server sedang berjalan pada http://localhost:${port}`)
})
