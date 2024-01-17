import { gql } from "@apollo/client";

export const ALL_BOOKS = gql`
  query {
    allBooks {
      genres
      title
      author
      published
      id
    }
  }
`;

export const BOOKS_BY_GENRE = gql`
  query books_by_genre($genre: String) {
    allBooks(genre: $genre) {
      genres
      title
      author
      published
      id
    }
  }
`;

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      id
      bookCount
    }
  }
`;

export const ADD_BOOK = gql`
  mutation add_book($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
    addBook(title: $title, author: $author, published: $published, genres: $genres) {
      title
      author {
        name
      }
      published
      genres
    }
  }
`;

export const ME = gql`
  query {
    me {
      username
      favoriteGenre
    }
  }
`;

export const EDIT_AUTHOR = gql`
  mutation edit_author($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, born: $setBornTo) {
      name
      born
      id
    }
  }
`;

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`;

export const CREATE_USER = gql`
  mutation create_user($username: String!, $favoriteGenre: String!) {
    createUser(username: $username, favoriteGenre: $favoriteGenre) {
      username
      favoriteGenre
      id
    }
  }
`;

const BookDetails = gql`
  fragment BookDetails on Book {
    title
    author {
      name
    }
    published
    genres
  }
`;

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BookDetails
    }
  }
  ${BookDetails}
`;
