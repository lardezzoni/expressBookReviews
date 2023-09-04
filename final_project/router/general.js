const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
 
    res.send(JSON.stringify(books,null,4))

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let ISBN2 = req.params.isbn;
    let var2 = books[1].ISBN;
    
for(i=1;i<Object.keys(books).length; i++){
    let var3 = books[i].ISBN;
    if(ISBN2 === var3){
        res.send(books[i])
    }
  }
  /*
    for(i=0;i<bookLoop.length; i++){
        if(ISBN2 === bookLoop[i]){
            res.send(bookLoop[i])
            res.end()
        }

    } */

    return res.status(300).json({message: "Yet to be implemented"});
  
 });
  
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
