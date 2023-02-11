const express = require("express");

const app = express();

const port = 3000;

const apiRoutes = require("./routes/apiRoutes");

app.get("/", (req, res) => {
  res.json({ message: "API running..." });
});


//mongodb connection
const connectDB= require("./config/db")
connectDB();

app.use("/api", apiRoutes);


//show errors in the console
app.use((error, req, res, next) => {
  console.log(error);
  res.status(500).json({
    message: error.message,
    stack: error.stack
  })
})

app.use((error, req, res, next) => {
  console.log(error);
  next(error)
})

app.get("/api/products", (req, res) => {
  res.send("Handling product routes.");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
