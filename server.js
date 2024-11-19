const dotenv = require("dotenv")
dotenv.config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const methodOverride = require("method-override")
const morgan = require("morgan")

mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`)
})

app.use(express.urlencoded({ extended: false }))
app.use(methodOverride("_method"))
app.use(morgan("dev"))

const Game = require('./models/game.js')

app.get("/", async (req, res) => {
    res.render("index.ejs")
})

app.delete('/games/:gameId', async (req, res)=>{
    await Game.findByIdAndDelete(req.params.gameId)
    res.redirect("/games")
})

app.get("/games/:gameId/edit", async (req, res) =>{
    const foundGame = await Game.findById(req.params.gameId)
    res.render("games/edit.ejs", {
        game: foundGame,
    })
})

app.get("/games/new", (req, res) => {
    res.render("games/new.ejs")
})

app.get('/games', async (req, res) => {
    const allGames = await Game.find()
    res.render('games/index.ejs', {
        games: allGames
    })
})

app.put("/games/:gameId", async (req, res) => {
    if (req.body.isInStock === "on"){
        req.body.isInStock = true
    } else {
        req.body.isInStock = false
    }
    await Game.findByIdAndUpdate(req.params.gameId, req.body)
    res.redirect(`/games/${req.params.gameId}`)
})

app.post("/games", async (req, res) => {
    if (req.body.isInStock === "on") {
        req.body.isInStock = true;
    } else {
        req.body.isInStock = false;
    }
    await Game.create(req.body)
    res.redirect("/games")
})

app.get("/games/:gameId", async (req, res) => {
    const foundGame = await Game.findById(req.params.gameId)
    res.render("games/show.ejs", { game: foundGame })
})

app.listen(3002, () => {
    console.log("Listening on port 3002")
})

