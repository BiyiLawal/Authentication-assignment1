const { findUser } = require("./db.function");

// Test the findUser function
const usernameToFind = "oovi";
const passwordToFind = "1234";
const user = findUser(usernameToFind, passwordToFind);
console.log("User found:", user);