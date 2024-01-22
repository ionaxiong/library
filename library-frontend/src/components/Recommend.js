import React from "react";
import { Table } from "react-bootstrap";
import { useQuery } from "@apollo/client";
import { BOOKS_BY_GENRE } from "../queries";

const Recommend = (props) => {
  const favoriteGenre = props.favoriteGenre;
  console.log("favoriteGenre", favoriteGenre);
  
  const booksByGenreResult = useQuery(BOOKS_BY_GENRE, {
    variables: { genre: favoriteGenre },
    onError: (error) => {
      console.log("error", error);
    },
    fetchPolicy: "network-only",
  });

  if (booksByGenreResult.loading) {
    return <div>loading...</div>;
  }
  // const [getBooksByGenre, booksByGenreResult] = useLazyQuery(BOOKS_BY_GENRE);

  // const {
  //   data: userData,
  //   loading: userLoading,
  //   error: userError,
  // } = useQuery(ME, {
  //   onError: (error) => {
  //     console.log("User query error: ", error);
  //     const messages = error.graphQLErrors.map((err) => err.message);
  //     props.setErrorMessages(messages);
  //   },
  // });

  // useEffect(() => {
  //   if (userData && userData.me && userData.me.favoriteGenre) {
  //     getBooksByGenre({ variables: { genre: userData.me.favoriteGenre } });
  //   }
  // }, [userData]);

  // if (userError) return <p>Error loading user data!</p>;
  // if (userLoading) return <p>Loading...</p>;

  // useEffect(() => {
  //   if (favoriteGenre) {
  //     getBooksByGenre({ variables: { genre: props.favoriteGenre } });
  //   }
  // }, [favoriteGenre, getBooksByGenre]);

  // if (userError) return <p>Error loading user data!</p>;
  // if (userLoading) return <p>Loading...</p>;

  return (
    <div>
      <h2 style={{ textAlign: "center", marginTop: 20, marginBottom: 20 }}>
        {/* Books in Genre {userData?.me?.favoriteGenre} */}
        Books in Genre {favoriteGenre}
      </h2>
      {booksByGenreResult.data && (
        <Table striped bordered hover>
          <tbody>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Published</th>
            </tr>
            {booksByGenreResult.data?.allBooks?.map((book) => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.published}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default Recommend;
