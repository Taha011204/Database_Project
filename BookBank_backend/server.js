const express = require("express");
const bodyParser = require("body-parser");
const pool = require("./db");
const cors = require("cors");

const {
  login,
  register,
  getAllBooks,
  getAllUserInfo,
  getSpecificUserInfo,
  updateSpecificUser,
  deleteSpecificUser,

  getSpecificBookInfo,
  getBookFilter,

  addBook,
  requestBook,
  allRequestBook,
  deleteRequest,
  updateBook,
  addBookToCart,
  viewMyCart,
  removeFromCart,
  showProfile,
  getStats,
} = require("./routes/libraryRoutes");

const app = express();
const PORT = 5000;

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Login and Register:
app.post("/login", login);
app.post("/register", register);

// Book Functionality:
app.get("/books/filter", getBookFilter);
app.get("/books/:isbn", getSpecificBookInfo);
app.get("/books", getAllBooks);
app.post("/books/:userId/add-book", addBook);

app.patch("/books/:userId/updatebook/:ISBN", updateBook); 

//Specific User Functionality:
app.get("/users/:userId", getSpecificUserInfo);
app.patch("/users/:userId", updateSpecificUser);
app.delete("/users/:userId", deleteSpecificUser);
app.get("/users", getAllUserInfo);

// User Requests Functionality:
app.post("/requests/:userId", requestBook);
app.get("/requests", allRequestBook);
app.delete("/requests/deleterequest/:bookRequest", deleteRequest);

//Cart Functionality:
app.post("/cart/addbook/:userId", addBookToCart);
app.get("/cart/viewcart/:userId", viewMyCart);
app.delete("/cart/removebook/:userId", removeFromCart);

//Profile:
app.get("/profile/:userId", showProfile);

//Stats
app.get("/stats", getStats);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
