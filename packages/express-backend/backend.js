// backend.js
import express from "express";
import cors from "cors";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());


const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor",
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer",
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor",
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress",
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender",
    },
  ],
};


app.get("/", (req, res) => {
  res.send("Hello World!");
});

const findUserByName = (name) => {
  return users["users_list"].filter((user) => user["name"] === name);
};


  

app.get("/users", (req, res) => {
  const name = req.query.name;
  if (name != undefined) {
    let result = findUserByName(name);
    result = { users_list: result };
    res.send(result);
  } else {
    res.send(users);
  }
});

const findUserByJob = (job) => {
  return users["users_list"].filter((user) => user["job"] === job); 
}

const findUserById = (id) =>
    users['users_list']
        .find( (user) => user['id'] === id);
    
app.get('/users/:id', (req, res) => {
    const id = req.params['id']; //or req.params.id
    let result = findUserById(id);
    if (result === undefined) {
        res.status(404).send('Resource not found.');
    } else {
        res.send(result);
    }
});

const deleteUserById = (id) => {
  const index = users.users_list.findIndex((user) => user.id === id);
  if (index !== -1) {
    // User found, remove it from the list
    users.users_list.splice(index, 1);
    return true;
  }
  return false;
};

// Add a new route to handle user deletion
app.delete("/users/:id", (req, res) => {
  const id = req.params.id;
  const deleted = deleteUserById(id);
  if (deleted) {
    res.status(204).send(); // No Content - Successful delete
  } else {
    res.status(404).send("Resource not found.");
  }
});

const generateRandomID = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const numbers = 
    "0123456789";
  let randomID = "";
  for (let i = 0; i < 3; i++) {
    randomID += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  for (let i = 0; i < 3; i++) {
    randomID += numbers.charAt(
      Math.floor(Math.random() * numbers.length)
    );
  }
  return randomID;
};


const addUser = (user) => {
  const randomID = generateRandomID();
  user['id'] = randomID; // Assign the generated ID to the new user object
  users["users_list"].push(user);
  return user;
};

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  const addedUser = addUser(userToAdd); // Get the added user with the assigned ID
  res.status(201).json(addedUser); // Return a 201 status code and the added user
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
