const express = require("express");
const app = express();
const cors = require("cors");
const userAuthRouter = require("./routes/userAuthRoute");
const usersRoute = require("./routes/userRoute");
const chatsRoute = require("./routes/chatsRoute");
const jwt = require("jsonwebtoken");
const http = require("http");
const socketio = require("socket.io");
const server = http.createServer(app);
const port = process.env.PORT_DEV || process.env.PORT;
const io = socketio(server, {
  cors: {
    origin: "*",
  },
});

const restricted = (req, res, next) => {
  const token = req.header("token");
  if (!token) return res.status(401).send("Access Denied");

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    return res.status(400).send("Invalid Token");
  }
};

app.use(express.json());
app.use(cors());
app.use("/auth", userAuthRouter);
app.use("/chat", restricted, chatsRoute);
app.use("/user", restricted, usersRoute);

io.on("connection", (socket) => {
  socket.on("send-message", (data) => {
    io.emit("receive-message", data);
  });
  socket.on("fetch-rooms", () => {
    io.emit("recieve-fetch-rooms");
  });
  socket.on("create-room", (data) => {
    io.emit("recieve-room", data);
  });
});

server.listen(port, () => {
  console.log(`listening on port ${port}`);
});
