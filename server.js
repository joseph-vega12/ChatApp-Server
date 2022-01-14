const express = require("express");
const app = express();
const users = require("./routes/users");
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use("/users", users);

app.get("/", (req, res) => {
  res.send({ message: "Home" });
});

io.on("connection", (socket) => {
  socket.on("send-message", ({ name, message }) => {
    io.emit("send-message", { name, message });
  });
});

http.listen(4000, function () {
  console.log("listening on port 4000");
});
