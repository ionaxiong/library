import Authors from "./components/Authors";
import Books from "./components/Books";
import NavBar from "./components/NavBar";
import NewBook from "./components/NewBook";
import Notification from "./components/Notification";
import Login from "./components/Login";
import { Routes, Route } from "react-router-dom";
import { useState, useContext } from "react";
import ProtectedAuth from "./components/ProtectedAuth";
import { AuthContext } from "./context/auth";
import Recommend from "./components/Recommend";
import { useSubscription } from "@apollo/client";
import { BOOK_ADDED, ALL_BOOKS } from "./queries";

// function that takes care of manipulating cache
export const updateCache = (cache, query, addedBook) => {
  // helper that is used to eliminate saving same person twice
  const uniqByTitle = (a) => {
    let seen = new Set();
    return a.filter((item) => {
      let k = item.title;
      return seen.has(k) ? false : seen.add(k);
    });
  };

  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByTitle(allBooks.concat(addedBook)),
    };
  });
};

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const { user } = useContext(AuthContext);
  const { username, favoriteGenre } = user;
  console.log("favoriteGenre", favoriteGenre);

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      console.log("subscription data", data);
      const addedBook = data.data.bookAdded;
      console.log("addedBook", addedBook);
      window.alert(`New book added: ${addedBook.title}`);
      // setErrorMessage(`New book added: ${addedBook.title}`);
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook);
      // updateCache(client.cache, { query: ALL_AUTHORS }, addedBook.author);
      // updateCache(client.cache, { query: BOOKS_BY_GENRE }, addedBook);
    },
  });

  return (
    <div>
      <NavBar username={username} />
      <div className="container">
        <Notification errorMessage={errorMessage} setErrorMessage={setErrorMessage} />
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedAuth>
                <Authors setErrorMessage={setErrorMessage} />
              </ProtectedAuth>
            }
          />

          <Route
            path="/books"
            element={
              <ProtectedAuth>
                <Books setErrorMessage={setErrorMessage} />
              </ProtectedAuth>
            }
          />

          <Route
            path="/add_book"
            element={
              <ProtectedAuth>
                <NewBook favoriteGenre={favoriteGenre} />
              </ProtectedAuth>
            }
          />

          <Route
            path="/recommend"
            element={
              <ProtectedAuth>
                <Recommend favoriteGenre={favoriteGenre} />
              </ProtectedAuth>
            }
          />

          {/* {user && (
            <ProtectedRoutes errorMessage={errorMessage} setErrorMessage={setErrorMessage} />
          )} */}
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
