import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { ADD_BOOK, ALL_BOOKS, ALL_AUTHORS, BOOKS_BY_GENRE, BOOK_ADDED } from "../queries";
import { updateCache } from "../App";

const NewBook = (props) => {
  const favoriteGenre = props.favoriteGenre;
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [published, setPublished] = useState("");
  const [genre, setGenre] = useState("");
  const [genres, setGenres] = useState([]);

  const [addBook] = useMutation(ADD_BOOK, {
    // Fetch new data from the server for the Books and Authors components after a new book is added
    // refetchQueries: [
    //   // { query: ALL_BOOKS },
    //   { query: ALL_AUTHORS },
    //   // { query: BOOKS_BY_GENRE, variables: { genre: favoriteGenre } },
    // ],
    onError: (error) => {
      const messages = error.graphQLErrors.map((e) => e.message).join("\n");
      // props.setErrorMessage(messages);
      console.log("error from graphql:", error);
    },
    update: (cache, response) => {
      updateCache(cache, { query: ALL_BOOKS }, response.data.addBook);
      // updateCache(cache, { query: ALL_AUTHORS }, response.data.addBook.author);
      // updateCache(cache, { query: BOOKS_BY_GENRE }, response.data.addBook);
    },
    // update: (cache, { data: { addBook } }) => {
    //   cache.updateQuery({ query: ALL_BOOKS }, (data) => {
    //     return {
    //       allBooks: [...data.allBooks, addBook],
    //     };
    //   });

    //   try {
    //     if (addBook.genres.includes(favoriteGenre)) {
    //       cache.updateQuery(
    //         { query: BOOKS_BY_GENRE, variables: { genre: favoriteGenre } },
    //         (data) => {
    //           return {
    //             allBooks: [...data.allBooks, addBook],
    //           };
    //         }
    //       );
    //     }
    //   } catch (error) {
    //     console.log("error updating cache for books by genre", error);
    //   }
    // },
  });

  const submit = async (event) => {
    event.preventDefault();
    try {
      await addBook({
        variables: { title, author, published: Number(published), genres },
      });
      setTitle("");
      setPublished("");
      setAuthor("");
      setGenres([]);
      setGenre("");
    } catch (error) {
      console.log("error adding book", error);
    }
  };

  const addGenre = () => {
    setGenres(genres.concat(genre));
    setGenre("");
  };

  return (
    <Form onSubmit={submit} style={{ marginTop: 20 }}>
      <Form.Group className="mb-3">
        <Form.Label>Title:</Form.Label>
        <Form.Control value={title} onChange={({ target }) => setTitle(target.value)} />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Author:</Form.Label>
        <Form.Control value={author} onChange={({ target }) => setAuthor(target.value)} />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Published:</Form.Label>
        <Form.Control
          type="number"
          value={published}
          onChange={({ target }) => setPublished(target.value)}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Genres:</Form.Label>
        <Form.Control value={genre} onChange={({ target }) => setGenre(target.value)} />
        <Button
          variant="outline-primary"
          style={{ marginTop: 10 }}
          onClick={addGenre}
          type="button"
        >
          Add Genre
        </Button>
      </Form.Group>
      <div style={{ fontWeight: "bold", marginBottom: 20 }}>Genres: {genres.join(" ")}</div>
      <Button type="submit">Create Book</Button>
    </Form>
  );
};

export default NewBook;
