//------ SETUP ------
const express = require("express");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const bcrypt = require("bcrypt");
const app = express();
const PORT = 8080;

const {
  generateRandomString,
  getUserByEmail,
  urlsForUser,
  createUser,
  authenticateUser,
} = require("./helpers");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cookieSession({
    name: "session",
    keys: [
      "A rush of blood to the head",
      "Viva la vida or death and all his friends",
    ],
  })
);

//------ DATABASES ------

const hashedPass1 = bcrypt.hashSync("user", 10);
const hashedPass2 = bcrypt.hashSync("pequeno", 10);

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: hashedPass1,
  },
  aJ48lW: {
    id: "aJ48lW",
    email: "pequeno_pollo@pampa.com",
    password: hashedPass2,
  },
};

//------ APP ------

app.get("/", (req, res) => {
  res.redirect("/urls");
});

//Register
app.get("/register", (req, res) => {
  const UserID = req.session.UserID;
  const loggedUser = users[UserID];
  const templateVars = { user: loggedUser };
  res.render("urls_register", templateVars);
});

app.post("/register", (req, res) => {
  const { email, password } = req.body;
  const userFound = getUserByEmail(email, users);
  if (!email || !password) {
    res.status(400).send("Please enter a valid email/password combination.");
  }
  if (userFound) {
    res.status(400).send("Email address is already registered.");
    return;
  }
  const UserID = createUser(email, password, users);
  req.session.UserID = UserID;
  res.redirect("/urls");
});

//Login
app.get("/login", (req, res) => {
  const templateVars = { user: null };
  res.render("urls_login", templateVars);
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = authenticateUser(email, password, users);
  if (!user) {
    return res.status(403).send("Wrong email/password combination.");
  }
  req.session.UserID = user.id;
  return res.redirect("urls");
});

//Logout
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

//URLs Index
app.get("/urls", (req, res) => {
  const UserID = req.session.UserID;
  const loggedUser = users[UserID];
  if (loggedUser) {
    const userUrls = urlsForUser(urlDatabase, UserID);
    const templateVars = { urls: userUrls, user: loggedUser, id: UserID };
    res.render("urls_index", templateVars);
  }
  res.redirect("login");
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString(6);
  const UserID = req.session.UserID;
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = { longURL: longURL, userID: UserID };
  res.redirect("/urls");
});

//New URL
app.get("/urls/new", (req, res) => {
  const UserID = req.session.UserID;
  const loggedUser = users[UserID];
  const templateVars = { user: loggedUser };
  if (!loggedUser) {
    return res.redirect("/login");
  }
  return res.render("urls_new", templateVars);
});

//URL<shortURL>
app.get("/urls/:id", (req, res) => {
  const UserID = req.session.UserID;
  const loggedUser = users[UserID];
  const templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id],
    user: loggedUser,
  };
  if (!loggedUser) {
    return res.redirect("/login");
  }
  return res.render("urls_show", templateVars);
});

app.post("/urls/:id", (req, res) => {
  const shortURL = req.params.id;
  const urlContent = req.body.urlContent;
  urlDatabase[shortURL].longURL = urlContent;
  res.redirect("/urls");
});

//URL<longURL>
app.get("/u/:id", (req, res) => {
  const shortURL = req.params.id;
  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});

//Delete URL
app.post("/urls/:id/delete", (req, res) => {
  const UserID = req.session.UserID;
  const loggedUser = users[UserID];
  const shortURL = req.params.id;
  if (!loggedUser) {
    return res.redirect("/login");
  }
  delete urlDatabase[shortURL];
  return res.redirect("/urls");
});

//------ LISTEN ------
app.listen(PORT, () => {
  console.log(`Tiny app listening on port ${PORT}!`);
});
