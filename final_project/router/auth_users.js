const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    return users.some(user => user.username === username)
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    return users.some(user => user.username === username && user.password === password)
 }

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
    const username = req.body.username
    const password = req.body.password

    if(!username || !password){
        return res.status(400).json({mesage: "Username and password are required"})
    }

    if(!isValid){
        return res.status(404).json({message: "User not found! Please register first!"})
    }

    if(!authenticatedUser){
        return res.status(401).json({message: "Wrong password! Please try again!"})
    }

    let accessToken = jwt.sign(
        {username: username},
        "access",
        {expiresIn: "1h"}
    )

    req.session.authorization = {accessToken}

    return res.status(200).json({message: "User successfully logged in!"})

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
    const isbn = req.params.isbn

    const review = req.query.review

    const username = req.session.authorization.accessToken
    const decoded = require('jsonwebtoken').verify(username, "access")
    const user = decoded.username

    if(!books[isbn]){
        return res.status(404).json({message: "Book not found"})
    }

    if(!review){
        return res.status(400).json({message: "Review is required!"})
    }

    books[isbn].reviews[user] = review

    return res.status(200).json({message: `Review for ISBN ${isbn} has been added/updated!`, reviews: books[isbn].reviews})
});

regd_users.delete("/auth/review/:isbn", (req, res) => {

    const isbn = req.params.isbn

    const username = req.session.authorization.accessToken
    const decoded = require('jsonwebtoken').verify(username, "access")
    const user = decoded.username

    if(!books[isbn]){
        return res.status(404).json({message: "Book not found"})
    }

    if(!books[isbn].reviews[user]){
        return res.status(404).json({message: "You dont have a review for this book!"})
    }

    delete books[isbn].reviews[user]

    return res.status(200).json({message: "Review has been deleted", reviews: books[isbn].reviews})
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
