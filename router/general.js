const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios'); // Importing axios



// Register a new user

public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "Username already exists" });
  }

  //Register new user
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
// public_users.get('/',function (req, res) {
//   //Write your code here
//   return res.status(200).json({ books: JSON.stringify(books, null, 2) });
// });


// public_users.get('/', async (req, res) => {
//   try {
//     const getBooks = async () => {
//       return new Promise((resolve, reject) => {
//         setTimeout(() => {
//           resolve(books);
//         }, 1000); // Simulating an async operation
//       });
//     };

//     const bookList = await getBooks();
//     return res.status(200).json({ books: JSON.stringify(books, null, 2)});
//   } catch (error) {
//     return res.status(500).json({ message: "Error fetching books", error: error.message });
//   }
// });
// Serve books data


public_users.get('/books', (req, res) => {
  res.status(200).json(books);
});


public_users.get('/', async (req, res) => {
  try {
    // Fetch books from an external API
    const response = await axios.get('http://localhost:3000/books'); // Replace with actual API endpoint
    const bookList = response.data;

    return res.status(200).json({ books: bookList});
  } catch (error) {
    console.error("Error fetching books:", error.message);
    return res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});






// // Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
const isbn= parseInt(req.params.isbn);
if(books[isbn])
{
  return res.status(200).json(books[isbn]);
}
else
  return res.status(404).json({message:"books not found"});
 });
  

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn; // Retrieve the ISBN from the request parameters
  try {
    const response = await axios.get(`http://localhost:3000/books/${isbn}`); // Adjust the URL as per your endpoint
    return res.status(200).json(response.data); // Send back the book details
  } catch (error) {
    return res.status(404).json({ message: "Book not found", error: error.message });
  }
});







// Get book details based on author
public_users.get('/author/:author',function (req, res) {

  //Write your code here
  const author = req.params.author;
  const foundBooks = Object.values(books).filter(book => book.author === author);
  if (foundBooks.length > 0) {
    return res.status(200).json(foundBooks);
  }
  else {
    return res.status(404).json({ message: "No books found for this author" });
  }
});

// Task 12: Get book details by author
public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author; // Retrieve the author from the request parameters
  try {
      // Simulating an Axios call to fetch data
      const response = await axios.get(`http://localhost:3000/books`); // Fetching all books (assuming this endpoint returns the books)
      
      // Filter books by author from the fetched data
      const filteredBooks = response.data.filter(book => book.author.toLowerCase() === author.toLowerCase());

      if (filteredBooks.length > 0) {
          return res.status(200).json(filteredBooks); // Send back the filtered books
      } else {
          return res.status(404).json({ message: "No books found by this author" });
      }
  } catch (error) {
      return res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const foundBooks = Object.values(books).filter(book => book.title.toLowerCase().includes(title.toLowerCase()));

  if (foundBooks.length > 0) {
    return res.status(200).json(foundBooks);
  } else {
    return res.status(404).json({ message: "No books found with this title" });
  }
});

// Task 13: Get book details by title
public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title; // Retrieve the title from the request parameters
  try {
      // Simulating an Axios call to fetch data
      const response = await axios.get(`http://localhost:3000/books`); // Fetching all books (assuming this endpoint returns the books)
      
      // Filter books by title from the fetched data
      const filteredBooks = response.data.filter(book => book.title.toLowerCase() === title.toLowerCase());

      if (filteredBooks.length > 0) {
          return res.status(200).json(filteredBooks); // Send back the filtered books
      } else {
          return res.status(404).json({ message: "No books found with this title" });
      }
  } catch (error) {
      return res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  if (books[isbn] && books[isbn].reviews) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "No reviews found for this book" });
  }
});

module.exports.general = public_users;
