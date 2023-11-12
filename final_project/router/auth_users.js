const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [ { username: "my_username", password: "my_password" }];
// let userReviews = {};

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  // Validate if the username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  // Check if the user is a valid registered user
  if (!isValid(username) || !authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  // Generate a JWT token and send it in the response
  const token = jwt.sign({ username }, "secret_key"); // Replace "your_secret_key" with your actual secret key
  res.status(200).json({ token });
});

// Add a book review 
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const { username,review} = req.body;
  const { isbn } = req.params;
  

  // Validate if the review, username, and ISBN are provided
  if (!review || !username || !isbn) {
    return res.status(400).json({ message: "Review, username, and ISBN are required." });
  }

  // Check if the user is valid
  if (!isValid(username)) {
    return res.status(401).json({ message: "Invalid user." });
  }

  // Check if the user has already reviewed this ISBN
  if (userReviews.hasOwnProperty(isbn) && userReviews[isbn].hasOwnProperty(username)) {
    // Modify the existing review
    userReviews[isbn][username] = review;
  } else {
    // Add a new review
    if (!userReviews.hasOwnProperty(isbn)) {
      userReviews[isbn] = {};
    }
    userReviews[isbn][username] = review;
  }

  return res.status(200).json({ message: "Review added/modified successfully." });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  // Write your code here
  const { username } = req.body;
  const { isbn } = req.params;

  // Validate if the username and ISBN are provided
  if (!username || !isbn) {
    return res.status(400).json({ message: "Username and ISBN are required." });
  }

  // Check if the user is valid
  if (!isValid(username)) {
    return res.status(401).json({ message: "Invalid user." });
  }

  // Check if the user has a review for this ISBN
  if (userReviews.hasOwnProperty(isbn) && userReviews[isbn].hasOwnProperty(username)) {
    // Delete the user's review for this ISBN
    delete userReviews[isbn][username];
    return res.status(200).json({ message: "Review deleted successfully." });
  } else {
    return res.status(404).json({ message: "Review not found for the specified user and ISBN." });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
