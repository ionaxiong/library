const typeDefs = `
type User {
    username: String!
    favoriteGenre: String!
    id: ID!
}

type Token {
    value: String!
}

type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
}

type SimplifiedBook {
    title: String!
    published: Int!
    author: String!
    id: ID!
    genres: [String!]!
}

type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
}

type Query {
    me: User
    bookCount: Int!
    authorCount: Int!
    allBooks(genre: String): [SimplifiedBook!]!
    allAuthors: [Author!]!
}

type Mutation {
    addBook(
        title: String!
        author: String!
        published: Int!
        genres: [String!]!
    ): Book
    
    editAuthor(
        name: String!
        born: Int!
    ): Author

    createUser(
        username: String!
        favoriteGenre: String!
    ): User

    login(
        username: String!
        password: String!
    ): Token
    
  }

type Subscription {
    bookAdded: Book!
}
`;

module.exports = typeDefs;
