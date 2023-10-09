import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
  const [characters, setCharacters] = useState([]);

  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }

  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function removeOneCharacter(id, index) {
      console.log("Removing character with ID:", id, "at index:", index);

    // Send a DELETE request to the backend to delete the user by ID
    fetch(`http://localhost:8000/users/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.status === 204) {
          // If the DELETE operation was successful (status code 204), update the state
            const updated = characters.filter((character, i) => {
              return i !== index;
            });
            setCharacters(updated);
        } else {
          throw new Error(`Failed to delete user. Status code: ${res.status}`);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function updateList(person) {
    postUser(person)
      .then((res) => {
        if (res.status === 201) {
          return res.json();
        } else {
          throw new Error(`Failed to create user. Status code: ${res.status}`);
        }
      })
      .then((json) => setCharacters([...characters, json]))
      .catch((error) => {
        console.log(error);
      });
  }

  function postUser(person) {
    const promise = fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });

    return promise;
  }

  return (
    <div className="container">
      <Table characterData={characters} removeCharacter={removeOneCharacter} />
      <Form handleSubmit={updateList} />
    </div>
  );
}

export default MyApp;
