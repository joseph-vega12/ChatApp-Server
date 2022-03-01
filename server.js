const express = require("express");
const app = express();
const cors = require("cors");
const userAuthRouter = require("./routes/userAuthRoute");
const usersRoute = require("./routes/userRoute");
const chatsRoute = require("./routes/chatsRoute");
const http = require("http").createServer(app);
const jwt = require("jsonwebtoken");
const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
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
    console.log(err);
    return res.status(400).send("Invalid Token");
  }
};

app.use(express.json());
app.use(cors());
app.use("/auth", userAuthRouter);
app.use("/chat", restricted, chatsRoute);
app.use("/users", restricted, usersRoute);
app.use("/uploads", express.static("uploads"));

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

http.listen(process.env.PORT, () => {
  console.log("listening on port 4000");
});
