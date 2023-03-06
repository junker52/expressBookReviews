const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  let { username, password } = req.body;
  if (!username) {
    return res.status(400).json({ error: 'Username cannot be empty' });
  }
  if (!password) {
    return res.status(400).json({ error: 'Password cannot be empty' });
  }
  if (users.some(user => user.username === username)) {
    return res.status(400).json({ error: 'This username already exists in DB' });
  }
  users.push({username, password});
  return res.status(201).json({ message: 'User successfully registred. Now you can login' });
});

// Get the book list available in the shop
public_users.get('/',async (req, res) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(res.status(200).json(Object.values(books)));
    }, 2000)
  })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async (req, res) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const isbnBook = Object.values(books).find(b => b.isbn.includes(req.params.isbn))
      isbnBook ? resolve(res.status(200).json(isbnBook)) : reject(res.status(404).json({ message : 'Book not found'}));
    }, 2000)});
 });
  
// Get book details based on author
public_users.get('/author/:author',async (req, res) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const authorBook = Object.values(books).find(b => b.author === req.params.author)
      authorBook ?
          resolve(res.status(200).json(authorBook)) :
          reject(res.status(404).json({ message : 'Book not found'}));
    }, 2000)});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const titleBook = Object.values(books).find(b => b.title === req.params.title)
      titleBook ? resolve(res.status(200).json(titleBook)) : reject(res.status(404).json({ message : 'Book not found'}));
    }, 2000)});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const reviews = Object.values(books).find(b => b.isbn === req.params.isbn).reviews;
  return res.status(reviews ? 200 : 404).json(reviews);
});

module.exports.general = public_users;
