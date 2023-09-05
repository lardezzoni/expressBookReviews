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
    if(!req.session.username && !req.session.password){
        return res.status(200).json({message: "invalid username or password"});
    }
    else{
        // this considers that for every review there is an user
        for(i=1;i<Object.keys(books).length; i++){
            let var3 = books[i].ISBN;
            if(isbnQ === var3){
                let user2 = req.session.username;
                let book = books[i];

                //iterate through all the reviews
                if(book.userReview != null){
                  for(n=0; n<book.reviews.length; n++){
                    
                        //if it is the same user
                        if(book.userReview[n] == user2){
                            //if not the same review
                            if(book.reviews[n] != reviewQ){
                     
                                book.reviews[n] = reviewQ;
                                book.userReview[n] = user2;
                                books[i]=book;
 
                            }
                        } 
                    else{
                        //if the loop is in the last review
                        //append in the last a new review
                        if((n+1) == book.reviews.length){
                                book.reviews.push(reviewQ);
                                book.userReview.push(user2);
                                books[i]=book;
                        }

                    }
                  }
                }   
                else{
 
                    book.reviews = reviewQ;
                    book.userReview = user2;
                    books[i]=book;
                }

        let strB = JSON.stringify(book,null,4);
        res.send("book with ISBN "+isbnQ+" updated. The user that add the review is "+ user2+". The book is now "+strB)
    }          
    } 
  }
   
    
  return res.status(300).json({message: "error"});
});
regd_users.delete("/auth/review/:isbn", (req,res) => {

    let isbnDelete = req.params.isbn;
    
    for(i=1;i<Object.keys(books).length; i++){
         let var3 = books[i].ISBN;
         console.log(var3);
        if(isbnDelete === var3){
            let book = books[i];
            for(n = 0; n < book.userReview.length; n++){
                if(book.userReview[n] == req.session.username){
                    console.log("here");
                    book.userReview[n] = {};
                    console.log("here2");
                    book.reviews[n] = {};
                    console.log("here3");
                    books[i] = book;
                    res.send("Review deleted. The updated book is "+ JSON.stringify(book,null,4));
                }
                
            }
        }

    }
    return res.status(200).json({message: "ISBN or user not found"});

});

module.exports.authenticated = regd_users;
module.exports.doesExist = doesExist;
module.exports.users = users;
