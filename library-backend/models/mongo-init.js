db.createUser({
  user: "the_username",
  pwd: "the_password",
  roles: [
    {
      role: "dbOwner",
      db: "the_database",
    },
  ],
});

db.createCollection("authors");
db.createCollection("books");
db.createCollection("users");

// Insert starting data for authors
db.authors.insert({
  name: "Robert Martin",
  born: 1952,
});

db.books.insert({
  title: "Refactoring, edition 2",
  published: 2018,
  author: db.authors.findOne({ name: "Robert Martin" })._id,
  genres: ["refactoring"],
});

db.books.insert({
  title: "Clean Code",
  published: 2008,
  author: db.authors.findOne({ name: "Robert Martin" })._id,
  genres: ["refactoring"],
});

db.books.insert({
  title: "Agile software development",
  published: 2002,
  author: db.authors.findOne({ name: "Robert Martin" })._id,
  genres: ["agile", "patterns", "design"],
});

db.authors.insert({
  name: "Fyodor Dostoevsky",
  born: 1821,
});

db.books.insert({
  title: "Crime and punishment",
  published: 1866,
  author: db.authors.findOne({ name: "Fyodor Dostoevsky" })._id,
  genres: ["classic", "crime"],
});

db.books.insert({
  title: "The Demon ",
  published: 1872,
  author: db.authors.findOne({ name: "Fyodor Dostoevsky" })._id,
  genres: ["classic", "revolution"],
});

db.authors.insert({
  name: "Joshua Kerievsky", // birthyear not known
});

db.books.insert({
  title: "Refactoring to patterns",
  published: 2008,
  author: db.authors.findOne({ name: "Joshua Kerievsky" })._id,
  genres: ["refactoring", "patterns"],
});

db.authors.insert({
  name: "Sandi Metz", // birthyear not known
});

db.books.insert({
  title: "Practical Object-Oriented Design, An Agile Primer Using Ruby",
  published: 2012,
  author: db.authors.findOne({ name: "Sandi Metz" })._id,
  genres: ["refactoring", "design"],
});

// Insert starting data for users
db.users.insert({
  username: "admin",
  favoriteGenre: "agile",
  passwordHash: "$2b$10$vvtQuEfx9YnIAUHQzaVxg.1xx8oJ532DJ7T7Nn93J6Hdw3I01RscW",
});

db.users.insert({
  username: "root",
  favoriteGenre: "refactoring",
  passwordHash: "$2b$10$o10O1IBivv3u//9VEu4/su65J0UQtnsnnbUvBIF42vdw/UAoL8/Uq",
});
