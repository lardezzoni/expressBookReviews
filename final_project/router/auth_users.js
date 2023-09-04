const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
}
  
  const authenticatedUser = (username,password)=>{
    let validusers = users.filter((user)=>{
      return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
      return true;
    } else {
      return false;
    }
  }

regd_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!doesExist(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User registred."});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    if(!username || !password){
        return res.status(404).json({message: "Enter a valid username or password."});
    }
    return res.status(404).json({message: "Unable to register user."});
  });

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review", (req, res) => {
    let reviewQ = req.query.reviews;
    let isbnQ = req.query.ISBN;


for(i=1;i<Object.keys(books).length; i++){
    let var3 = books[i].ISBN;
    if(isbnQ === var3){
        let book = books[i];
        book["reviews"] = reviewQ;
        books[i]=book;
        let strB = JSON.stringify(book,null,4);
        res.send("book with ISBN "+isbnQ+" updated. The book is now "+strB)
    } 
  }
   
    
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.doesExist = doesExist;
module.exports.users = users;
