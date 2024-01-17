import { Table } from "react-bootstrap";
import { useQuery } from "@apollo/client";
import { ALL_BOOKS } from "../queries";
import BookFilter from "./BookFilter";
import { useState } from "react";

const Books = (props) => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [genre, setGenre] = useState("");
  const booksResult = useQuery(
    ALL_BOOKS,
    // Optional method to poll the server for new data when a new book is added
    // {
    //   pollInterval: 2000,
    // }
    {
      onCompleted: (data) => {
        setBooks(data.allBooks);
        setFilteredBooks(data.allBooks);
      },
      // fetchPolicy: "cache-and-network",
    },
    
  );

  let uniqueGenres = [];

  if (booksResult.loading) {
    return <div>loading...</div>;
  }

  if (books && books.length > 0) {
    const genresArray = books.flatMap((book) => book.genres);
    uniqueGenres = [...new Set(genresArray)];
  }

  return (
    <div>
      <h2 style={{ textAlign: "center", marginTop: 20, marginBottom: 20 }}>
        Books
      </h2>

      {genre && (
        <h5 style={{ marginBottom: 20 }}>
          In Genre <strong>{genre}</strong>
        </h5>
      )}

      <Table striped bordered hover>
        <tbody>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Published</th>
          </tr>
          {filteredBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <BookFilter
        uniqueGenres={uniqueGenres}
        setErrorMessage={props.setErrorMessage}
        setFilteredBooks={setFilteredBooks}
        genre={genre}
        setGenre={setGenre}
      />
    </div>
  );
};

export default Books;
