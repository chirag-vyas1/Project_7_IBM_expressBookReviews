const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];


const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
const user = users.find(user => user.username === username);
 // Check if user exists and password matches
return user ? user.password === password : false;

}

//only registered users can login
regd_users.post("/login", (req,res) => {

  //Write your code here
  const {username , password} = req.body;

  if (!username ||!password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (!isValid(username)) {
    return res.status(401).json({ message: "Invalid username" });
  }
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid password" });
  }
  req.session.user = username;
  const token = jwt.sign({ username }, 'chirag1234', { expiresIn: '1h' });
  res.json({ token });

  //save user in the users array for future reference.
  users.push(username);

  // save user's book history in the books array for future reference.
  
//   for (let bookID in books) {
//     let book = books[bookID];
//     if (book.author === username) {
//       if (!book.history) {
//         book.history = [];
//       }
//       book.history.push({ review: null, date: new Date() });
//     }
//   }
 }
);

// Add a book review
regd_users.put("/auth/review/:isbn",(req, res) => {

 
  //Write your code here
  const isbn = req.params.isbn; // Retrieve the ISBN from the request parameters
  const { reviews } = req.body; // Retrieve the review from the request body

  console.log("Request Body:", req.body); // Log the request body
  console.log("Reviews Variable:", reviews); // Log the reviews variable

  if (!isbn ||!reviews || typeof reviews !== 'string') {
    return res.status(400).json({ message: "ISBN and review are required" });
  }

  const book =books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
    // Add the review to the book's reviews array (assuming the book has a reviews property)
   // Ensure reviews is an array
   if (!book.reviews||!Array.isArray(book.reviews)) {
    console.log(`Invalid reviews format for ISBN ${isbn}:`, book.reviews);
    book.reviews = []; // Reset to an empty array if it's not
  }

 
 // Debugging information
 console.log(`Current reviews for ISBN ${isbn}:`, book.reviews); // Debugging information

  // Find existing review by the user
  const existingReviewIndex =book.reviews.findIndex(r => r.username === req.session.user);

    // Create a review object
    const reviewEntry = {
      username: req.session.user, // Get the username from the session
      review: reviews,
      date: new Date()
  };


  if (existingReviewIndex !== -1) {
    // User has already reviewed this book, modify the existing review
    book.reviews[existingReviewIndex] = reviewEntry;
    console.log("Review modified successfully",book)
    return res.status(200).json({ message: "Review modified successfully", book });

  } else {
    // Add the new review
    book.reviews.push(reviewEntry);
    console.log("Review added successfully", book)
    return res.status(200).json({ message: "Review added successfully", book });

  }

   
  
});

// Delete a book review

  regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Check if reviews exist
    if (!book.reviews || !Array.isArray(book.reviews) || book.reviews.length === 0) {
        return res.status(404).json({ message: "No reviews found for this book" });
    }

    // Filter reviews to remove the one by the current user
    const initialReviewsCount = book.reviews.length;
    book.reviews = book.reviews.filter(review => review.username !== req.session.user);

    // Check if any reviews were deleted
    if (book.reviews.length === initialReviewsCount) {
        return res.status(403).json({ message: "You can only delete your own reviews" });
    }
    console.log("Review deleted successfully")
    return res.status(200).json({ message: "Review deleted successfully", book });
    
});




module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
