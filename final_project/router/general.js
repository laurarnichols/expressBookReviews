const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
    let userswithsamename = users.filter((user) => {
      return user.username === username;
    });
    return userswithsamename.length > 0;
};

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!doesExist(username)) {
          users.push({ "username": username, "password": password });
          return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
          return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
    try {
        let getAllBooks = new Promise((resolve, reject) => {
            // Before this would be where you would get all books from database
            if (books) {
                resolve(books);
            } else {
                reject("No books present in database.");
            }
            
        });

        let allBooks = await getAllBooks;
        res.status(200).json(allBooks);
        console.log("Promise for getting all books resolved.");
    } catch (error) {
        res.status(404).json({message: `${error}`});
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    try {
        let isbn = parseInt(req.params.isbn);

        let getBookByISBN = new Promise((resolve, reject) => {
            // This would be where you would get your book from the database
            let book = books[isbn];

            if(book) {
                resolve(book);
            } else {
                reject("Book not found");
            }
        });

        let book = await getBookByISBN;
        res.status(200).json(book);
        console.log("Promise for getting book by ISBN resolved.");
    } catch (error) {
        res.status(404).json({message: `${error}`});
    }
  
 });
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
    try {
        let author = req.params.author;

        let getBooksByAuthor = new Promise((resolve, reject) => {
            let booksArray = Object.values(books);
            let filteredBooks = booksArray.filter((book) =>  book.author === author);

            if(filteredBooks.length > 0) {
                resolve(filteredBooks);
            } else {
                reject(`No books found for author ${author}`);
            }
        });
        
        let booksByAuthor = await getBooksByAuthor;
        res.status(200).json(booksByAuthor);
        console.log("Promise for getting book by author resolved.");
    } catch (error) {
        res.status(404).json({message: `${error}`});
    }
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
    try {
        let title = req.params.title;

        let getBooksByTitle = new Promise((resolve, reject) => {
            let booksArray = Object.values(books);
            let filteredBooks = booksArray.filter((book) =>  book.title === title);

            if(filteredBooks.length > 0) {
                resolve(filteredBooks);
            } else {
                reject(`No books found for author ${title}`);
            }
        });
        
        let booksByTitle = await getBooksByTitle;
        res.status(200).json(booksByTitle);
        console.log("Promise for getting book by author resolved.");
    } catch (error) {
        res.status(404).json({message: `${error}`});
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = parseInt(req.params.isbn);
    res.send(JSON.stringify(books[isbn].reviews));
});

module.exports.general = public_users;
