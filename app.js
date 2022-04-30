//jshint esversion:6

require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 12;

const app = express();

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});

const User = mongoose.model("User", userSchema);

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req,res){
  res.render("home");
})


app.get("/login", function(req,res){
  res.render("login");
})


app.get("/register", function(req,res){
  res.render("register");
})

app.post("/register", function(req, res){

  const hash = bcrypt.hashSync(req.body.password, saltRounds);
  const newUser = new User({
    email:  req.body.username,
    password:   hash
  })

  newUser.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.render("secrets");
    }
  });

})

app.post("/login", function(req,res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email:username}, function(err, foundUser){
    if(err){
      console.log(err);
    }else{
      if(foundUser){
        if(bcrypt.compareSync(password, foundUser.password)){
          res.render("secrets");
        }else{
          res.render("errors")
        }
      }
    }
  })
});







app.listen("3000", function(){
  console.log("Server has started at port 3000");
})
