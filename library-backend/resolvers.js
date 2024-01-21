const { GraphQLError } = require("graphql");
const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// require("dotenv").config();
const { SECRET } = require("./util/config");
// const SECRET = process.env.SECRET;

const Book = require("./models/book");
const Author = require("./models/author");
const User = require("./models/user");

const DataLoader = require("dataloader");

// const authorLoader = new DataLoader(async (authorIds) => {
//   const authors = await Author.find({ _id: { $in: authorIds } });
//   return authorIds.map((id) =>
//     authors.find((author) => author.id.toString() === id.toString()),
//   );
// });

// const bookLoader = new DataLoader(async (bookIds) => {
//   const books = await Book.find({ _id: { $in: bookIds } }.populate("author"));
//   return bookIds.map((id) => books.find((book) => book.id === id));
// });

// const bookCountLoader = new DataLoader(async (authorIds) => {
//   const bookCounts = await Book.aggregate([
//     {
//       $match: {
//         author: { $in: authorIds.map((id) => mongoose.Types.ObjectId(id)) },
//       },
//     },
//     {
//       $group: {
//         _id: "$author",
//         count: { $sum: 1 },
//       },
//     },
//   ]);

//   const countMap = new Map(
//     bookCounts.map((result) => [result._id.toString(), result.count]),
//   );

//   return authorIds.map((id) => countMap.get(id) || 0);
// });

const resolvers = {
  // Author: {
  //   bookCount: async (parent) => {
  //     return bookCountLoader.load(parent.id.toString());

  //     // const books = await bookLoader.loadMany(parent.books);
  //     // return books.length;
  //   },
  // },

  Query: {
    me: (root, args, context) => {
      return context.currentUser;
    },

    bookCount: async () => Book.collection.countDocuments(),

    authorCount: async () => Author.collection.countDocuments(),

    allBooks: async (root, args) => {
      let books = [];

      if (args.genre) {
        try {
          books = await Book.find({
            genres: { $in: [args.genre] },
          }).populate("author");
        } catch (error) {
          console.log("error while fetching books by genre", error);
          throw new GraphQLError("Fetching books by genre failed", error);
        }
      } else {
        try {
          books = await Book.find({}).populate("author");
        } catch (error) {
          throw new GraphQLError("Fetching books failed", error);
        }
      }

      const bookResult = books.map((book) => {
        const authorName =
          typeof book.author === "string" ? book.author : book.author.name;
        return {
          title: book.title,
          published: book.published,
          author: authorName,
          id: book.id,
          genres: book.genres,
        };
      });
      return bookResult;
    },

    // allAuthors: async () => {
    //   const authors = await Author.find({});
    //   return authors;
    // },

    allAuthors: async () => {
      const authors = await Author.find({});
      const books = await Book.find({}).populate("author");

      const authorsWithBookCount = authors.map((author) => {
        const bookCount = books.filter(
          (book) => book.author.name === author.name,
        ).length;
        return {
          name: author.name,
          born: author.born,
          id: author.id,
          bookCount: bookCount,
        };
      });

      return authorsWithBookCount;
    },
  },

  Mutation: {
    createUser: async (root, args) => {
      try {
        const user = new User({
          username: args.username,
          favoriteGenre: args.favoriteGenre,
        });

        await user.save();
        return user;
      } catch (error) {
        console.log("error while saving new user", error);
        throw new GraphQLError("Saving user failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.username,
            error,
          },
        });
      }
    },

    login: async (root, args) => {
      const existingUser = await User.findOne({ username: args.username });

      if (!existingUser) {
        throw new GraphQLError("User not found");
      }

      const passwordCorrect = await bcrypt.compare(
        args.password,
        existingUser.passwordHash,
      );

      if (!passwordCorrect) {
        throw new GraphQLError("Invalid password");
      }

      const userForToken = {
        username: existingUser.username,
        id: existingUser._id,
      };

      const token = jwt.sign(userForToken, SECRET);
      // const token = jwt.sign(userForToken, SECRET, {
      //   expiresIn: 60 * 60,
      // });

      return { value: token };
    },

    addBook: async (root, { title, author, published, genres }, context) => {
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      let authorObject;

      if (author.length < 4) {
        throw new GraphQLError(
          "Author name must be at least 4 characters long",
          {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: author,
            },
          },
        );
      }

      if (title.length < 5) {
        throw new GraphQLError("Title must be at least 5 characters long", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: title,
          },
        });
      }

      const existingAuthor = await Author.findOne({ name: author });

      if (!existingAuthor) {
        try {
          authorObject = new Author({ name: author });
          await authorObject.save();
        } catch (error) {
          console.log("error while saving new author", error);
          throw (
            (new GraphQLError("Saving author failed"),
            {
              extensions: {
                code: "BAD_USER_INPUT",
                invalidArgs: args.name,
                error,
              },
            })
          );
        }
      } else {
        authorObject = existingAuthor;
      }

      const newbook = new Book({
        title,
        author: authorObject.id,
        published,
        genres,
      });

      try {
        await newbook.save();
      } catch (error) {
        console.log("error while saving new book", error);
        throw (
          (new GraphQLError("Saving book failed"),
          {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.name,
              error,
            },
          })
        );
      }

      const bookWithPartialAuthor = {
        title,
        author: {
          name: authorObject.name,
        },
        published,
        genres,
      };

      pubsub.publish("BOOK_ADDED", { bookAdded: bookWithPartialAuthor });

      return bookWithPartialAuthor;
    },

    editAuthor: async (root, { name, born }, context) => {
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new GraphQLError("Not authenticated");
      }

      let updatedAuthor;
      const author = await Author.findOne({ name: name });
      try {
        updatedAuthor = await Author.findByIdAndUpdate(
          author.id,
          {
            born: born,
          },
          { new: true },
        );
      } catch (error) {
        console.log("error while saving updated author", error);
        throw (
          (new GraphQLError("Saving author failed"),
          {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.name,
              error,
            },
          })
        );
      }

      return updatedAuthor;
    },
  },

  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(["BOOK_ADDED"]),
    },
  },
};

module.exports = resolvers;
