const express = require("express");

const app = express();

const port = 3000;

const apiRoutes = require("./routes/apiRoutes");

app.get("/", (req, res) => {
  console.log("synchronous code");
  throw new Error("some error occured");
  res.json({ message: "API running..." });
});

app.get("/a", (req, res, next) => {
  setTimeout(() => {
    try {
      aconsole.log("asynchronous code");
    } catch (err) {
      next(err);
    }
  }, 1000)
//next(new Error("some error occured"))
});

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
