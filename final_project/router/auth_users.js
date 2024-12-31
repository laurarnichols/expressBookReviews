const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  return validusers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      { username }, 
      'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    };
    return res.status(200).json({ message: "User successfully logged in"});
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;

  if(!books[isbn]) {
    return res.status(404).json({message: "ISBN does not exist in database"});
  } else {
    let username = req.user.username;

    books[isbn].reviews[username] = req.body.review;

    return res.status(200).json({message: "Review successfully updated"});
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;

  if(!books[isbn]) {
    return res.status(404).json({message: "ISBN does not exist in database"});
  } else {
    let username = req.user.username;

    if(books[isbn].reviews[username]) {
        delete books[isbn].reviews[username];

        return res.status(200).json({message: "Review successfully deleted"});
    } else {
        return res.status(404).json({message: `No review for ISBN ${isbn} found for user ${username}`});
    }

    
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
