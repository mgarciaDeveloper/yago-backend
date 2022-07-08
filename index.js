//jshint esversion:6

// NODE requires
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// Mongo DB setup

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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

// collections imports
const Product = require("./models/Products");
const User = require("./models/Users");

app.get("/relogio", (req, res) => {
  let horas = new Date();
  res.send(horas);
});

app.post("/criarLivro", (req, res) => {
  console.log(req);
  let newBook = new Product({
    nome: req.body.nome,
    custo: 15,
    categoria: req.body.categoria,
    destino: req.body.destino,
  });

  newBook.save((err, objetoSalvo) => {
    if (err) {
      //erro ao salvar (sintaxe ou configuração)
      console.log(err);
      res.send({
        erro: true,
        mensagem: "Erro! O objeto não foi salvo",
      });
    } else if (objetoSalvo) {
      // o objeto foi salvo

      res.send(objetoSalvo);
    } else if (!objetoSalvo) {
      //o objeto não foi salvo
      res.send({
        erro: true,
        mensagem: "Erro! O objeto não foi salvo",
      });
    }
  });
});

app.listen(process.env.PORT || 4000, () => {
  console.log("O servidor está conectado");
});
