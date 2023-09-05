const express = require('express');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

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




public_users.post("/register", (req,res) => {
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
// Get the book list available in the shop
public_users.get('/',function (req, res) {
    let myPromise1 = new Promise((resolve,reject) => {
        setTimeout(() => {
         
        },2000)
        try{
            resolve(res.send(JSON.stringify(books,null,4)))
        }
        catch{
            reject("error")
        }
    })

});


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
        let ISBN2 = req.params.isbn;
        let myPromise1 = new Promise((resolve,reject) => {
            setTimeout(() => {
         
            },2000)

            for(i=1;i<Object.keys(books).length; i++){
                 let var3 = books[i].ISBN;
                if(ISBN2 === var3){
                     resolve(res.send(books[i]));
                }
            }
            reject("not found");

        })


        
  
 });
  
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let author2 = req.params.author;
    //create promise
    let myPromise1 = new Promise((resolve,reject) => {
        setTimeout(() => {
     
        },2000)

        //the params have to be AuthorName so to find need to lowercase
        author2 = author2.toLowerCase();
        //loop through all books
        for(i=1;i<Object.keys(books).length; i++){
             let var3 = books[i].author;
             //remove spaces and lowercase to compare
             var3 = var3.replace(/\s/g, '');
             var3 = var3.toLowerCase();
            if(author2 === var3){
                 resolve(res.send(books[i]));
            }
        }
        reject("author not found");

    }) 
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title2 = req.params.title;
    //create promise
    let myPromise1 = new Promise((resolve,reject) => {
        setTimeout(() => {
     
        },2000)

        //the params have to be TitleName so to find need to lowercase
        title2 = title2.toLowerCase();
        //loop through all books
        for(i=1;i<Object.keys(books).length; i++){
             let var3 = books[i].title;
             //remove spaces and lowercase to compare
             var3 = var3.replace(/\s/g, '');
             var3 = var3.toLowerCase();
            if(title2 === var3){
                 resolve(res.send(books[i]));
            }
        }
        reject("title not found");

    }) 

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {

    let ISBN2 = req.params.isbn;
    let myPromise1 = new Promise((resolve,reject) => {
        setTimeout(() => {
     
        },2000)

        for(i=1;i<Object.keys(books).length; i++){
             let var3 = books[i].ISBN;
            if(ISBN2 === var3){
                 resolve(res.send(books[i].reviews));
            }
        }
        reject("not found");

    })

});

module.exports.general = public_users;
