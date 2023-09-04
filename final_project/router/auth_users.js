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
    req.session.username = username;
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review", (req, res) => {
    let reviewQ = req.query.reviews;
    let isbnQ = req.query.ISBN;

// this considers that for every review there is an user
for(i=1;i<Object.keys(books).length; i++){
    let var3 = books[i].ISBN;
    if(isbnQ === var3){
        let user2 = req.session.username;
        let book = books[i];
        let var4 = book.reviews.length;
        console.log(var4);
        //iterate through all the reviews
        if(book.username != null){
        for(n=0; n<book.reviews.length; n++){
            
                //if it is the same user
                if(book.username[n] == user2){
                       //if not the same review
                    if(book.reviews[n] != reviewQ){
                        book.reviews[n] = reviewQ;
                
                        books[i]=book;
                    }
                } 
                //need to create a method to add a string to the last review[]
        }
        }   
        else{
            book.reviews[0] = reviewQ;
            book.username[0] = user2;
            books[i]=book;
        }

        let strB = JSON.stringify(book,null,4);
        res.send("book with ISBN "+isbnQ+" updated. the user is "+ user2+" The book is now "+strB)
    } 
  }
   
    
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.doesExist = doesExist;
module.exports.users = users;
