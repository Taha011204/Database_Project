const pool = require("../db");
// const bcrypt = require('bcryptjs');
// works
async function login(req, res) {
  const { email, password } = req.body;
  try {
    const userQuery =
      'SELECT * FROM "Users" WHERE email = $1 and password = $2 LIMIT 1';
    
    const userResult = await pool.query(userQuery, [email, password]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    } else {
      const user = userResult.rows[0];

      return res.status(200).json({
        message: "Login Successful",
        user: {
          username: user.username,
          email: user.email,
          userID: user.userID,
        },
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// const crypto = require('crypto');
// const jwt = require('jsonwebtoken');
// const JWT_SECRET = 'your_jwt_secret'; // Replace with a secure secret key

// async function register(req, res) {
//   const { username, email, password } = req.body;

//   let client; // Declare the client outside the try block

//   try {
//     // Start a transaction
//     client = await pool.connect();
//     await client.query("BEGIN");

//     // Check if the user already exists by email or username
//     const checkUserQuery =
//       'SELECT * FROM "Users" WHERE email = $1 OR username = $2';
//     const userExists = await client.query(checkUserQuery, [email, username]);

//     if (userExists.rows.length > 0) {
//       // If the user already exists, rollback the transaction and return an error
//       await client.query("ROLLBACK");
//       return res.status(400).json({ message: "User already exists" });
//     }

//     // Hash the password before storing
//     const hashedPassword = hashPassword(password);
//     console.log('Hashed Password:', hashedPassword);  // Debugging: Check the hashed password

//     // Get the new user ID
//     const generateUserIDQuery =
//       'SELECT COALESCE(MAX("userID"), 0) + 1 AS "newUserID" FROM "Users"';
//     const { newUserID } = (await client.query(generateUserIDQuery)).rows[0];

//     // Insert the new user into the database with the hashed password
//     const insertUserQuery =
//       'INSERT INTO "Users" (username, email, password, "userID") VALUES ($1, $2, $3, $4)';
//     await client.query(insertUserQuery, [
//       username,
//       email,
//       hashedPassword,  // Ensure you're inserting the hashed password here
//       newUserID,
//     ]);

//     // Commit the transaction
//     await client.query("COMMIT");

//     // Generate a JWT token
//     const token = jwt.sign({ userID: newUserID, username, email }, JWT_SECRET, {
//       expiresIn: '1h', // Token validity period
//     });

//     return res.json({ message: "Registration successful", token });
//   } catch (error) {
//     // Rollback the transaction if an error occurs
//     if (client) {
//       await client.query("ROLLBACK");
//     }

//     console.error(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   } finally {
//     // Release the client back to the pool
//     if (client) {
//       client.release();
//     }
//   }
// }

// // Simple password hashing function using SHA-1 and a shorter salt (8 bytes)
// function hashPassword(password) {
//   // Generate a random salt (8 bytes = 16 hex characters)
//   const salt = crypto.randomBytes(8).toString('hex');

//   // Create a SHA-1 hash of the password + salt
//   const hash = crypto.createHmac('sha1', salt)
//                      .update(password)
//                      .digest('hex');

//   // Return the salt + the hash (this can be stored in the database together)
//   return salt + '$' + hash; // This combined value will be inserted into the password column
// }





const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret'; // Replace with a secure secret key
async function register(req, res) {
  const { username, email, password } = req.body;

  let client; // Declare the client outside the try block

  try {
    // Start a transaction
    client = await pool.connect();
    await client.query("BEGIN");

    // Check if the user already exists by email or username
    const checkUserQuery =
      'SELECT * FROM "Users" WHERE email = $1 OR username = $2';
    const userExists = await client.query(checkUserQuery, [email, username]);

    if (userExists.rows.length > 0) {
      // If the user already exists, rollback the transaction and return an error
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "User already exists" });
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
   

    // console.log('Hashed Password:', hashedPassword);
    // Get the new user ID
    const generateUserIDQuery =
      'SELECT COALESCE(MAX("userID"), 0) + 1 AS "newUserID" FROM "Users"';
    const { newUserID } = (await client.query(generateUserIDQuery)).rows[0];

    // Insert the new user
    const insertUserQuery =
      'INSERT INTO "Users" (username, email, password, "userID") VALUES ($1, $2, $3, $4)';
    await client.query(insertUserQuery, [
      username,
      email,
      hashedPassword,
      newUserID,
    ]);

    // Commit the transaction
    await client.query("COMMIT");

    // Generate a JWT token
    const token = jwt.sign({ userID: newUserID, username, email }, JWT_SECRET, {
      expiresIn: '1h', // Token validity period
    });

    return res.json({ message: "Registration successful", token });
  } catch (error) {
    // Rollback the transaction if an error occurs
    if (client) {
      await client.query("ROLLBACK");
    }

    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    // Release the client back to the pool
    if (client) {
      client.release();
    }
  }
}


// works
async function getAllBooks(req, res) {
  try {
    // Query to get all books
    const getBooksQuery =
      'SELECT "Books"."ISBN", "Books"."title", "Books"."author", "Books"."subject", "Books"."class", "Books"."edition", "Books"."remarks", "Books"."userID", "Users"."email", "Users"."username" FROM "Books" LEFT JOIN "Users" ON "Books"."userID" = "Users"."userID"';
    const booksResult = await pool.query(getBooksQuery);

    // Return the list of books
    const books = booksResult.rows;
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getAllUserInfo(req, res) {
  try {
    // Query to get all users
    const getUsersQuery =
      'SELECT "Users"."userID", "Users"."email", "Users"."username" FROM "Users"';
    const usersResult = await pool.query(getUsersQuery);

    // Return the list of users
    const users = usersResult.rows;
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getSpecificUserInfo(req, res) {
  const userId = req.params.userId;

  try {
    // Query to get information for a specific user
    const getUserQuery =
      'SELECT "Users"."userID", "Users"."email", "Users"."username" FROM "Users" WHERE  "userID" = $1';
    const getUserBookQuery = 'SELECT * FROM "Books" WHERE  "userID" = $1';

    const userResult = await pool.query(getUserQuery, [userId]);
    const UserBookResult = await pool.query(getUserBookQuery, [userId]);

    // Check if the user exists
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the user information
    const user = userResult.rows[0];
    const userbook = UserBookResult.rows;

    res.json({ user: user, books: userbook });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function updateSpecificUser(req, res) {
  const userId = req.params.userId;
  const updatedUserData = req.body;
  let client;

  try {
    // Start a transaction
    client = await pool.connect();
    await client.query("BEGIN");

    // Check if the user exists
    const checkUserQuery = 'SELECT * FROM "Users" WHERE "userID" = $1';
    const existingUser = await client.query(checkUserQuery, [userId]);

    if (existingUser.rows.length === 0) {
      // Rollback the transaction if the user is not found
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "User not found" });
    }

    // Generate the dynamic SET clause for the update query
    const updateColumns = Object.keys(updatedUserData);
    const setClause = updateColumns
      .map((column, index) => `"${column}" = $${index + 2}`)
      .join(", ");

    // Update the user data
    const updateUserQuery = `UPDATE "Users" SET ${setClause} WHERE "userID" = $1 RETURNING *`;

    // Prepare the values for the query, including the user ID as the first parameter
    const queryValues = [
      userId,
      ...updateColumns.map((column) => updatedUserData[column]),
    ];

    const updatedUser = await client.query(updateUserQuery, queryValues);

    // Check if the updated username and email are unique
    const checkUniqueQuery =
      'SELECT * FROM "Users" WHERE (username = $1 OR email = $2) AND "userID" != $3';
    const duplicateUser = await client.query(checkUniqueQuery, [
      updatedUserData.username,
      updatedUserData.email,
      userId,
    ]);

    if (duplicateUser.rows.length > 0) {
      // Rollback the transaction if there is a duplicate username or email
      await client.query("ROLLBACK");
      return res.json({
        message:
          "Updated username or email already exists. Update rolled back.",
      });
    }

    // Commit the transaction if everything is successful
    await client.query("COMMIT");

    res.json({
      message: "User updated successfully",
      user: updatedUser.rows[0],
    });
  } catch (error) {
    // Rollback the transaction if an error occurs
    if (client) {
      await client.query("ROLLBACK");
    }
    
    console.log(error);

    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    // Release the client back to the pool
    if (client) {
      client.release();
    }
  }
}

async function deleteSpecificUser(req, res) {
  const userId = req.params.userId;

  try {
    // Check if the user exists
    const checkUserQuery = 'SELECT * FROM "Users" WHERE "userID" = $1';
    const existingUser = await pool.query(checkUserQuery, [userId]);

    if (existingUser.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the user
    const deleteUserQuery =
      'DELETE FROM "Users" WHERE "userID" = $1 RETURNING *';
    const deletedUser = await pool.query(deleteUserQuery, [userId]);

    res.json({
      message: "User deleted successfully",
      user: deletedUser.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// works - check in case of edit if you need anything
async function getSpecificBookInfo(req, res) {
  const ISBN = req.params.isbn;

  try {
    // Query to retrieve specific book information based on ISBN
    const getBookQuery = 'SELECT * FROM "Books" WHERE "ISBN" = $1';

    // Execute the query
    const { rows } = await pool.query(getBookQuery, [ISBN]);

    // Check if a book with the specified ISBN exists
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Book not found with the specified ISBN" });
    }

    // Return specific book information
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// works
async function addBook(req, res) {
  const userId = req.params.userId;

  const {
    ISBN,
    title,
    author,
    subject,
    class: bookClass,
    edition,
    remarks,
    condition,
    stock,
  } = req.body;

  let client; // Declare the client outside the try block

  try {
    // Start a transaction
    client = await pool.connect();
    await client.query("BEGIN");

    // Check if the ISBN is unique
    const checkIsbnQuery = 'SELECT * FROM "Books" WHERE "ISBN" = $1';
    const existingBook = await client.query(checkIsbnQuery, [ISBN]);

    if (existingBook.rows.length > 0) {
      const bookDetail =
        'SELECT * FROM "BookDetails" WHERE "ISBN" = $1 AND "condition" = $2';
      const updateDetail = await client.query(bookDetail, [ISBN, condition]);

      if (updateDetail.rows.length > 0) {
        const getStock =
          'UPDATE "BookDetails" SET "stock" = "stock" + $1 WHERE "ISBN" = $2 AND "condition" = $3 RETURNING *';
        const updateGetStock = await client.query(getStock, [
          stock,
          ISBN,
          condition,
        ]);

        res.json({
          message: "Book updated successfully",
          getStock: updateGetStock.rows[0],
        });
      } else {
        const newbookDetail =
          'INSERT INTO "BookDetails" ("ISBN", "condition", "stock") VALUES ($1, $2, $3) RETURNING *';
        const updatenewbookDetail = await client.query(newbookDetail, [
          ISBN,
          condition,
          stock,
        ]);

        res.json({
          message: "Book added in BookDetails successfully",
          newbookDetail: updatenewbookDetail.rows[0],
        });
      }
      await client.query("COMMIT");
    } else {
      // Insert the new book into the "Books" table
      const addBookQuery = `
      INSERT INTO "Books" ("ISBN", "userID", "title", "author", "subject", "class", "edition", "remarks")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`;
      const newBook = await client.query(addBookQuery, [
        ISBN,
        userId,
        title,
        author,
        subject,
        bookClass,
        edition,
        remarks,
      ]);

      // Insert the new book details into the "BookDetails" table
      const addBookDetailQuery =
        'INSERT INTO "BookDetails" ("ISBN", "condition", "stock") VALUES ($1, $2, $3) RETURNING *';
      const newBookDetail = await client.query(addBookDetailQuery, [
        ISBN,
        condition,
        stock,
      ]);

      // Commit the transaction if everything is successful
      await client.query("COMMIT");

      res.json({
        message: "Book added successfully",
        newBook: newBook.rows[0],
        newBookDetail: newBookDetail.rows[0],
      });
    }
  } catch (error) {
    // Rollback the transaction if an error occurs
    if (client) {
      await client.query("ROLLBACK");
    }
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    // Release the client back to the pool
    if (client) {
      client.release();
    }
  }
}

// works
async function getBookFilter(req, res) {
  try {
    const q = req.query.q;

    const query = `SELECT * FROM "Books" WHERE LOWER("Books"."title") LIKE LOWER('%' || $1 || '%')`;
    const filteredBooks = await pool.query(query, [q]);

    res.json(filteredBooks.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function allRequestBook(req, res) {
  try {
    // Query to retrieve all requests from the UserInteractions table
    const allRequestsQuery = 'SELECT * FROM "UserInteractions"';

    // Execute the query
    const requests = await pool.query(allRequestsQuery);

    // Return the list of requests
    res.json({ requests: requests.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function requestBook(req, res) {
  const userID = req.params.userId;
  const { bookRequest } = req.body;

  try {
    // Check if the ISBN exists in the database and has positive total stock
    const checkIsbnQuery = `
      SELECT "Books"."ISBN"
      FROM "Books"
      LEFT JOIN "BookDetails" ON "Books"."ISBN" = "BookDetails"."ISBN"
      WHERE "Books"."ISBN" = $1 AND "BookDetails"."stock" > 0
      LIMIT 1
    `;

    const existingBook = await pool.query(checkIsbnQuery, [bookRequest]);

    if (existingBook.rows.length > 0) {
      return res.json({ message: "Book is Available" });
    } else {
      // Check if the user has already made a request for the same ISBN
      const checkExistingRequestQuery =
        'SELECT * FROM "UserInteractions" WHERE "userID" = $1 AND "bookRequest" = $2';
      const existingRequest = await pool.query(checkExistingRequestQuery, [
        userID,
        bookRequest,
      ]);

      if (existingRequest.rows.length > 0) {
        return res.json({
          message: "Request for the same ISBN already exists for this user",
        });
      }

      // Insert the new request into the "UserInteractions" table
      const insertRequestQuery =
        'INSERT INTO "UserInteractions" ("userID", "bookRequest") VALUES ($1, $2) RETURNING *';
      const newRequest = await pool.query(insertRequestQuery, [
        userID,
        bookRequest,
      ]);

      // Return a message indicating that a request has been generated
      return res.json({
        message: "Book request generated. ISBN does not exist in the database.",
        request: newRequest.rows[0],
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function deleteRequest(req, res) {
  const bookRequest = req.params.bookRequest;

  try {
    // Query to delete the request by ISBN from the UserInteractions table
    const deleteRequestQuery =
      'DELETE FROM "UserInteractions" WHERE "bookRequest" = $1 RETURNING *';

    // Execute the query
    const deletedRequest = await pool.query(deleteRequestQuery, [bookRequest]);

    // Check if a request was deleted
    if (deletedRequest.rows.length > 0) {
      // Return a success message along with the deleted request details
      res.json({
        message: "Request deleted successfully",
        deletedRequest: deletedRequest.rows[0],
      });
    } else {
      // Return a message indicating that the request with the specified ISBN was not found
      res
        .status(404)
        .json({ message: "Request not found with the specified ISBN" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function updateBook(req, res) {
  const userID = req.params.userId;
  const previousISBN = req.params.ISBN; // Assuming ISBN is a parameter in the request URL
  const updatedBookData = req.body;

  try {
    // Check if the book with the specified ISBN belongs to the requesting user
    const checkOwnershipQuery =
      'SELECT * FROM "Books" WHERE "ISBN" = $1 AND "userID" = $2';
    const ownedBook = await pool.query(checkOwnershipQuery, [
      previousISBN,
      userID,
    ]);

    if (ownedBook.rows.length === 0) {
      return res
        .status(403)
        .json({ message: "You do not have permission to update this book." });
    }

    // Check if the ISBN is being changed
    if (previousISBN !== updatedBookData.ISBN) {
      // Check if the updated ISBN already exists
      const checkExistingISBNQuery = 'SELECT * FROM "Books" WHERE "ISBN" = $1';
      const existingISBN = await pool.query(checkExistingISBNQuery, [
        updatedBookData.ISBN,
      ]);

      if (existingISBN.rows.length > 0) {
        // Call the function to update Books and BookDetails
        await updateBookAndDetails(
          existingISBN.rows[0].ISBN,
          updatedBookData,
          userID
        );

        res.json({ message: "Book and details updated successfully" });
      } else {
        return res
          .status(400)
          .json({ message: "Updated ISBN does not exist in the table." });
      }
    } else {
      // If ISBN is not changed, update only Books
      const updateColumns = Object.keys(updatedBookData);
      const setClause = updateColumns
        .map((column, index) => `"${column}" = $${index + 3}`)
        .join(", ");

      const updateBookQuery = `
        UPDATE "Books"
        SET ${setClause}
        WHERE "ISBN" = $1 AND "userID" = $2
        RETURNING *
      `;

      const queryValues = [
        previousISBN,
        userID,
        ...updateColumns.map((column) => updatedBookData[column]),
      ];

      const updatedBook = await pool.query(updateBookQuery, queryValues);

      res.json({
        message: "Book updated successfully",
        updatedBook: updatedBook.rows[0],
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function updateBookAndDetails(newISBN, updatedBookData) {
  // Add your logic here to update both Books and BookDetails
  // You can use transactions to ensure atomicity
}

async function addBookToCart(req, res) {
  const userID = req.params.userId;
  const { ISBN, condition } = req.body;
  let client; // Declare the client outside the try block

  try {
    // Start a transaction
    client = await pool.connect();
    await client.query("BEGIN");

    // Checking if userId and ISBN already exist in the "Transactions" table
    const checkTransactionQuery =
      'SELECT * FROM "Transactions" WHERE "userID" = $1 AND "ISBN" = $2';
    const existingTransaction = await client.query(checkTransactionQuery, [
      userID,
      ISBN,
    ]);

    if (existingTransaction.rows.length > 0) {
      return res.json({
        message: "Book already in the cart",
      });
    }

    // Check if the book is in stock
    const checkStockQuery =
      'SELECT * FROM "BookDetails" WHERE "ISBN" = $1 AND "condition" = $2 AND "stock" > 0';
    const existingStock = await client.query(checkStockQuery, [
      ISBN,
      condition,
    ]);

    if (existingStock.rows.length === 0) {
      return res.json({ message: "Book is out of stock" });
    }

    // Insert the current time into the "Transactions" table
    const currentTime = new Date();
    const insertTransactionQuery =
      'INSERT INTO "Transactions" ("userID", "ISBN", "condition", "date") VALUES ($1, $2, $3, $4) RETURNING *';
    const newTransaction = await client.query(insertTransactionQuery, [
      userID,
      ISBN,
      condition,
      currentTime,
    ]);

    // Decrement the stock by 1 in the "BookDetails" table
    const updateStockQuery =
      'UPDATE "BookDetails" SET "stock" = "stock" - 1 WHERE "ISBN" = $1 AND "condition" = $2';
    await client.query(updateStockQuery, [ISBN, condition]);

    // Commit the transaction if everything is successful
    await client.query("COMMIT");

    res.json({
      message: "Book added to the cart successfully",
      newTransaction: newTransaction.rows[0],
    });
  } catch (error) {
    // Rollback the transaction if an error occurs
    if (client) {
      await client.query("ROLLBACK");
    }

    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    // Release the client back to the pool
    if (client) {
      client.release();
    }
  }
}

async function viewMyCart(req, res) {
  const userID = req.params.userId;

  try {
    // Retrieve the items in the cart for the specific user
    const viewCartQuery = `
      SELECT "Transactions"."userID", "Transactions"."ISBN",
             "Books"."title", "Books"."author", "Books"."subject", "Books"."class", "Books"."edition", "Books"."remarks"
            FROM "Transactions"
            LEFT JOIN "Books" ON "Transactions"."ISBN" = "Books"."ISBN"
            WHERE "Transactions"."userID" = $1`;
    const cartItems = await pool.query(viewCartQuery, [userID]);

    res.json({ cartItems: cartItems.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function removeFromCart(req, res) {
  const userID = req.params.userId;
  const { ISBN, condition } = req.body;
  let client; // Declare the client outside the try block

  try {
    // Start a transaction
    client = await pool.connect();
    await client.query("BEGIN");

    // Check if the book is in the cart
    const checkTransactionQuery =
      'SELECT * FROM "Transactions" WHERE "userID" = $1 AND "ISBN" = $2 AND "condition" = $3';
    const existingTransaction = await client.query(checkTransactionQuery, [
      userID,
      ISBN,
      condition,
    ]);

    if (existingTransaction.rows.length === 0) {
      return res.json({ message: "Book not found in the cart" });
    }

    // Remove the book from the cart and get the removed data
    const removeBookQuery =
      'DELETE FROM "Transactions" WHERE "userID" = $1 AND "ISBN" = $2 RETURNING *';
    const removedBook = await client.query(removeBookQuery, [userID, ISBN]);

    // Increment the stock by 1 in the "BookDetails" table
    const incrementStockQuery =
      'UPDATE "BookDetails" SET "stock" = "stock" + 1 WHERE "ISBN" = $1 AND "condition" = $2';
    await client.query(incrementStockQuery, [ISBN, condition]);

    // Commit the transaction if everything is successful
    await client.query("COMMIT");

    res.json({
      message: "Book returned successfully",
      removedBook: removedBook.rows[0],
    });
  } catch (error) {
    // Rollback the transaction if an error occurs
    if (client) {
      await client.query("ROLLBACK");
    }

    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    // Release the client back to the pool
    if (client) {
      client.release();
    }
  }
}

// works
async function showProfile(req, res) {
  const userID = req.params.userId;

  try {
    // Fetch user information
    const userQuery =
      'SELECT "Users"."userID", "Users"."email", "Users"."username" FROM "Users" WHERE "userID" = $1';
    const userResult = await pool.query(userQuery, [userID]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userResult.rows[0];

    // Fetch books associated with the user from the "Books" table
    const booksQuery = 'SELECT * FROM "Books" WHERE "userID" = $1';
    const booksResult = await pool.query(booksQuery, [userID]);

    // Fetch books added to the cart from the "Transactions" table
    const cartQuery = `
      SELECT "Books"."ISBN", "Transactions"."date", "Transactions"."condition"
      FROM "Transactions"
      JOIN "Books" ON "Transactions"."ISBN" = "Books"."ISBN"
      WHERE "Transactions"."userID" = $1
    `;

    const cartResult = await pool.query(cartQuery, [userID]);

    res.json({
      user,
      books: booksResult.rows,
      cart: cartResult.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// newly added, works
async function getStats(req, res) {
  try {
    // Fetch user information
    const usersCountQuery = 'SELECT COUNT("Users"."userID") FROM "Users"';
    const usersResult = await pool.query(usersCountQuery);
    const usersCount = usersResult.rows[0].count; // Access the count value

    // Fetch book information
    const booksCountQuery = 'SELECT COUNT("Books"."userID") FROM "Books"';
    const booksResult = await pool.query(booksCountQuery);
    const booksCount = booksResult.rows[0].count; // Access the count value

    res.json({
      users: usersCount,
      books: booksCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
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
  removeFromCart,
  viewMyCart,
  showProfile,
  getStats,
};
