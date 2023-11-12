const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  // Check if username and password are provided in the request body
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the username already exists
  if (users.hasOwnProperty(username)) {
    return res.status(409).json({ message: "Username already exists" });
  }

  // Register the new user
  users[username] = { password };

  return res.status(201).json({ message: "User registered successfully" });
});


// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  const bookList = JSON.stringify(books); // Assuming 'books' is an array of book objects
  return res.status(200).json({ books: bookList });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const requestedISBN = req.params.isbn;

  // Check if the requestedISBN exists as a property in the 'books' object
  if (!books.hasOwnProperty(requestedISBN)) {
    return res.status(404).json({ message: "Book not found" });
  }

  // If the ISBN exists, return the book details
  const book = books[requestedISBN];
  return res.status(200).json({ book });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const requestedAuthor = req.params.author;
  const matchingBooks = [];

  // Iterate through the keys of the 'books' object
  for (const isbn in books) {
    if (books.hasOwnProperty(isbn)) {
      const book = books[isbn];

      // Check if the author matches the requested author
      if (book.author === requestedAuthor) {
        matchingBooks.push({ isbn, ...book });
      }
    }
  }

  // If no matching books are found, return a 404 response
  if (matchingBooks.length === 0) {
    return res.status(404).json({ message: "No books found for the specified author" });
  }

  // If matching books are found, return the book details
  return res.status(200).json({ books: matchingBooks });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const requestedTitle = req.params.title;
  const matchingBooks = [];

  // Iterate through the keys of the 'books' object
  for (const isbn in books) {
    if (books.hasOwnProperty(isbn)) {
      const book = books[isbn];

      // Check if the title matches the requested title
      if (book.title.toLowerCase().includes(requestedTitle.toLowerCase())) {
        matchingBooks.push({ isbn, ...book });
      }
    }
  }

  // If no matching books are found, return a 404 response
  if (matchingBooks.length === 0) {
    return res.status(404).json({ message: "No books found for the specified title" });
  }

  // If matching books are found, return the book details
  return res.status(200).json({ books: matchingBooks });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const requestedISBN = req.params.isbn;

  // Check if the requestedISBN exists as a property in the 'books' object
  if (!books.hasOwnProperty(requestedISBN)) {
    return res.status(404).json({ message: "Book not found" });
  }

  // If the ISBN exists, get the book reviews
  const bookReviews = books[requestedISBN].reviews;

  // If there are no reviews for the book, return a message
  if (!bookReviews || Object.keys(bookReviews).length === 0) {
    return res.status(200).json({ message: "No reviews found for the specified book" });
  }

  // If reviews are found, return the reviews
  return res.status(200).json({ reviews: bookReviews });
});

module.exports.general = public_users;
