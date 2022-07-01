//jshint esversion:6

// NODE requires
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

/* mongodb+srv://<username>:<password>@cluster0.kin8f.mongodb.net/?retryWrites=true&w=majority */


/* app.use(
  cors({
    origin: process.env.FRONT_URL, // <-- location of the react app were connecting to. pass to .env
    credentials: true,
  })
); */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
/* app.postOUgetOUdelete("/rotas", (req,res) =>{
funcoes...
} ) */

app.get("/relogio", (req, res) => {
  let horas = new Date();
  res.send(horas);
});

app.listen(process.env.PORT || 4000, () => {
  console.log("O servidor está conectado");
});
