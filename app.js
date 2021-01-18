require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const mongoose = require('mongoose')
const encrypt = require('mongoose-encryption')

const app = express()

console.log(process.env.API_KEY)

const port = 3000

app.use(express.static("public"))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({
  extended: true
}))

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

// const userSchema = {
//   email: String,
//   password: String
// }

const userSchema = new mongoose.Schema({
  email: String,
  password: String
})

const secret = "Thisisourlittlesecret."

userSchema.plugin(encrypt, {
  secret: process.env.SECRET,
  encryptedFields: ['password']
})

const User = mongoose.model("User", userSchema)

app.get("/", (req, res) => {
  res.render("home")
})

app.get("/login", (req, res) => {
  res.render("login")
})

app.get("/register", (req, res) => {
  res.render("register")
})

app.get("/logout", (req, res) => {
  res.redirect("/")
})

app.post("/register", (req, res) => {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  })

  newUser.save((err) => {
    if (err) {
      console.log(err)
    } else {
      res.render("secrets")
    }
  })
})

app.post("/login", (req, res) => {
  const userEmail = req.body.username
  const userPassword = req.body.password

  User.findOne({
    email: userEmail
  }, (err, foundUser) => {
    if (err) {
      console.log(err)
    } else {
      if (foundUser) {
        if (foundUser.password === userPassword) {
          console.log("User found")
          res.render("secrets")
        } else {
          console.log("Wrong Password")
        }
      } else {
        console.log("User not found")
      }
    }
  })
})

app.listen(port, () => {
  console.log(`Server started at port ${port}`)
})
