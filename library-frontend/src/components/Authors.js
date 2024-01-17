import { Table } from "react-bootstrap";
import { useQuery } from "@apollo/client";
import { ALL_AUTHORS } from "../queries";
import EditAuthor from "./EditAuthor";

const Authors = (props) => {
  const authorsResult = useQuery(ALL_AUTHORS, {
    onError: (error) => {
      console.log("error", error);
    },
    fetchPolicy: "cache-and-network",
  });
  
  const setErrorMessage = props.setErrorMessage;

  if (authorsResult.loading) {
    return <div>loading...</div>;
  }

  // const authors = []
  const authors = authorsResult.data.allAuthors;

  return (
    <div>
      <div>
        <h2 style={{ textAlign: "center", marginTop: 20, marginBottom: 20 }}>Authors</h2>
        <Table striped bordered hover>
          <tbody>
            <tr>
              <th>Name</th>
              <th>Born in</th>
              <th>books</th>
            </tr>
            {authors.map((a) => (
              <tr key={a.name}>
                <td>{a.name}</td>
                <td>{a.born}</td>
                <td>{a.bookCount}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <div style={{ marginTop: 40 }}>
        <h2 style={{ textAlign: "center", marginTop: 20, marginBottom: 20 }}>Set Birthyear</h2>
        <EditAuthor setErrorMessage={setErrorMessage} authors={authors} />
      </div>
    </div>
  );
};

export default Authors;
