const { assert } = require("chai");
const {
  generateRandomString,
  getUserByEmail,
  urlsForUser,
  createUser,
  authenticateUser,
} = require("../helpers");

const testUsers = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

describe("getUserByEmail", () => {
  it("should return a user with valid email", () => {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedUserID = "userRandomID";
    // Write your assert statement here
  });
  it("should return false if the email doesn't match an user", () => {
    const result = getUserByEmail("user@examplo.com", testUsers);
    assert(!result);
  });
});
