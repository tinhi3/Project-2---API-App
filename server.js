////// IMPORT DEPENDENCIES //////
// This allows us to load our .env variables
require("dotenv").config()

const express = require("express")
const morgan = require("morgan")
const methodOverride = require("method-override")

// CONTROLLER ROUTES 
const userRoutes = require("./controller/user_routes")
const mountainRoutes = require("./controller/mountain_routes")
// Create our express application object
const app = require("liquid-express-views")(express())

// MIDDLEWARE
// Request logging
app.use(morgan("tiny"))
// Override delete method
app.use(methodOverride("_method"))
// Parses urlencoded request bodies
app.use(express.urlencoded({ extended: false }))
// Serve files from publicly statically
app.use(express.static("public"))
// Session middleware
const session = require("express-session")
const MongoStore = require("connect-mongo")
// Middleware that sets up our session
app.use(
    session({
        secret: process.env.SECRET,
        store: MongoStore.create({
            mongoUrl: process.env.DATABASE_URI
        }),
        saveUninitialized: true,
        resave: false
    })
)


//////// ROUTES ////////////
app.use("/users", userRoutes)
app.use("/mountains", mountainRoutes)


// localhost:5000/
// Make sure server is running
app.get("/", (req, res) => {
    res.send("Yo! That's server is popping!")
    res.redirect("/mountains")
})


////////////////////////////////////////////
// Server Listener
////////////////////////////////////////////
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`app is listening on port: ${PORT}`)
})