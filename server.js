const express = require("express");
const app = express();
const cors = require("cors");
const userAuthRouter = require("./routes/userAuthRoute");
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(cors());
app.use("/auth", userAuthRouter);

io.on("connection", (socket) => {
  socket.on("send-message", ({ name, message }) => {
    io.emit("send-message", { name, message });
  });
});

http.listen(4000, function () {
  console.log("listening on port 4000");
});
