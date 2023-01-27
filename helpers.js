const bcrypt = require("bcrypt");

//------ HELPERS ------

// The function returns a random generated string, it takes a Number as a parameter
// that defines the length of the generated string
const generateRandomString = (length) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

// The function looks for the email key inside the database object and returns
// the user object that matches the email key,
// if the key doesn't match, it returns false
const getUserByEmail = (email, database) => {
  for (let userID in database) {
    const user = database[userID];
    if (email === user.email) {
      return user;
    }
  }
  return false;
};

//The function returns the urls that match the id key
// it returns an empty object if the id doesn't match
const urlsForUser = (database, id) => {
  let newObj = {};
  for (let key in database) {
    if (database[key].userID === id) {
      newObj[key] = {
        longURL: database[key].longURL,
      };
    }
  }
  return newObj;
};

// The function creates a new user inside the database object and return its random generated ID
// it takes an email, a password and a database as parameters
const createUser = (email, password, database) => {
  const userID = generateRandomString(6);
  database[userID] = {
    id: userID,
    email,
    password: bcrypt.hashSync(password, 10),
  };
  return userID;
};

//The function returns a user object that matches the parameters
// if the user is not found returns false
const authenticateUser = (email, password, database) => {
  const userFound = getUserByEmail(email, database);
  if (userFound && bcrypt.compareSync(password, userFound.password)) {
    return userFound;
  }
  return false;
};

module.exports = {
  generateRandomString,
  getUserByEmail,
  urlsForUser,
  createUser,
  authenticateUser,
};
