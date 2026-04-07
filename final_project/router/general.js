const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios')


public_users.post("/register", (req,res) => {
  //Write your code here
    const username = req.body.username
    const password = req.body.password

    if(!username || !password){
        return res.status(400).json({message: "Username and password are required"})
    }

    const userExist = users.some(user => user.username === username)

    if(userExist){
        return res.status(409).json({message: "Isername already exists!"})
    }

    users.push({username: username, password: password})
    return res.status(200).json({message: "User successfully registered!"})
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  try{
    const response = await axios.get('http://localhost:5000/')

    res.send(JSON.stringify(books, null, 4))
  }catch (error){
    res.status(500).json({message: "Error fetching books", error: error.message})
  }
  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
    const isbn = req.params.isbn

    res.send(JSON.stringify(books[isbn], null, 4))
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
    const author = req.params.author

    const allKeys = Object.keys(books)

    const booksbyAuthor =[]

    allKeys.forEach(key => {
        if(books[key].author === author){
            booksbyAuthor.push(books[key])
        }
    })

    res.send(JSON.stringify(booksbyAuthor, null, 4))
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
    const title = req.params.title

    const allKeys = Object.keys(books)

    const booksbyTitle = []

    allKeys.forEach(key => {
        if(books[key].title === title){
            booksbyTitle.push(books[key])
        }
    })

    res.send(JSON.stringify(booksbyTitle, null, 4))
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
    const isbn = req.params.isbn

    res.send(JSON.stringify(books[isbn].reviews, null, 4))
});

module.exports.general = public_users;
