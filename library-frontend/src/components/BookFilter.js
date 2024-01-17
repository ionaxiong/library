import React, { useEffect } from "react";
import { Button } from "react-bootstrap";
import { useQuery, useLazyQuery } from "@apollo/client";
import { BOOKS_BY_GENRE, ADD_BOOK } from "../queries";

const BookFilter = (props) => {
  const { setGenre, genre } = props;
  // const booksByGenreResult = useQuery(BOOKS_BY_GENRE, {
  //   variables: { genre },
  //   onCompleted: (data) => {
  //     props.setFilteredBooks(data.allBooks);
  //   },
  // });

  const [getBooksByGenre] = useLazyQuery(BOOKS_BY_GENRE, {
    onCompleted: (data) => {
      props.setFilteredBooks(data.allBooks);
    },
  });

  // useEffect(() => {
  //   booksByGenreResult.refetch();
  // }, [genre, booksByGenreResult]);

  useEffect(() => {
    if (genre) {
      getBooksByGenre({ variables: { genre } });
    }
  }, [genre, getBooksByGenre]);

  const handleGenreFilter = (event) => {
    event.preventDefault();
    setGenre(event.target.value);
    console.log("genre after clicking button:", event.target.value);
  };

  return (
    <div style={{ marginTop: 40 }}>
      {props.uniqueGenres.map((genre) => (
        <Button
          key={genre}
          value={genre}
          style={{ marginRight: 10, marginBottom: 10 }}
          onClick={handleGenreFilter}
          variant="outline-primary"
        >
          {genre}
        </Button>
      ))}
    </div>
  );
};

export default BookFilter;
