const bcrypt = require("bcrypt");

//------ HELPERS ------
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

const getUserByEmail = (email, database) => {
  for (let userID in database) {
    const user = database[userID];
    if (email === user.email) {
      return user;
    }
  }
  return false;
};

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

const createUser = (email, password, database) => {
  const userID = generateRandomString(6);
  database[userID] = {
    id: userID,
    email,
    password: bcrypt.hashSync(password, 10),
  };
  return userID;
};

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
