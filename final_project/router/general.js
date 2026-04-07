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
  try{
    const isbn = req.params.isbn
    const response = await axios.get(`http://localhost:500/isbn/${isbn}`)
    
    res.send(JSON.stringify(books[isbn], null, 4))
  }catch(error){
    res.status(500).json({message: "Error fetching book", error: error.message})
  }
    

    
});
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    try {
        const author = req.params.author;
        const allKeys = Object.keys(books);
        const booksByAuthor = [];

        allKeys.forEach(key => {
            if (books[key].author === author) {
                booksByAuthor.push(books[key]);
            }
        });

        res.send(JSON.stringify(booksByAuthor, null, 4));
    } catch (error) {
        res.status(500).json({ message: "Error fetching books by author", error: error.message });
    }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    try {
        const title = req.params.title;
        const allKeys = Object.keys(books);
        const booksByTitle = [];

        allKeys.forEach(key => {
            if (books[key].title === title) {
                booksByTitle.push(books[key]);
            }
        });

        res.send(JSON.stringify(booksByTitle, null, 4));
    } catch (error) {
        res.status(500).json({ message: "Error fetching books by title", error: error.message });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
    const isbn = req.params.isbn

    res.send(JSON.stringify(books[isbn].reviews, null, 4))
});

module.exports.general = public_users;
