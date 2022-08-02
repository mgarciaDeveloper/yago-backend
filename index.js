//jshint esversion:6

// NODE requires
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const session = require("express-session");
const flash = require("req-flash");
const passport = require("passport");
const app = express();

// Mongo DB setup

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(
  cors({
    origin: process.env.FRONT_URL, // <-- location of the react app were connecting to. pass to .env
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.set("trust proxy", 1);
app.use(
  session({
    cookie: process.env.DEVELOPMENT
      ? null
      : { secure: true, maxAge: 4 * 60 * 60000, sameSite: "none" },
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: process.env.PORT
      ? MongoStore.create(
        // pede onde criar e uma callback function
        {
          mongoUrl: process.env.MONGO_URL,
        },
        function (err, resposta) {
          //espaço para uma callback function
          console.log(err, resposta);
        }
      )
      : null,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); // ...

// collections imports
var Product = require("./models/Products");
var User = require("./models/Users");
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/relogio", (req, res) => {
  let horas = new Date();
  res.send(horas);
});

// objetos estão dentro de coleções no banco de dados.
// Vamos criar o ADMIN!
User.findOne({ username: process.env.ADMIN_USERNAME }, (err, obj) => {
  // findOne irá encontrar o primeiro objeto que bate com o filtro. Ele retorna este objeto
  if (err) {
    console.log(err);
  } else if (obj) {
    console.log("já existe um admin");
  } else if (!obj) {
    User.register(
      // irei registrar um usuário no DB
      {
        username: process.env.ADMIN_USERNAME,
        nomeDoUsuario: "Gerência",
        cidade: "Porto Alegre/RS",
        telefone: 5551993449012,
      },
      process.env.ADMIN_PASSWORD,
      function (err, userRegistrado) {
        if (err) {
          console.log(err);
        } else if (userRegistrado) {
          console.log("ADMIN registrado com sucesso!! ");
        }
      }
    );
  }
});

app.post("/criarProduto", (req, res) => {
  let newProduct = new Product({
    nome: req.body.nome,
    custo: 15,
    categoria: req.body.categoria,
    destino: req.body.destino,
  });

  newProduct.save((err, objetoSalvo) => {
    if (err) {
      //erro ao salvar (sintaxe ou configuração)
      console.log(err);
      res.send({
        status: true,
        mensagem: "Erro! O objeto não foi salvo",
      });
    } else if (objetoSalvo) {
      // o objeto foi salvo

      res.send(objetoSalvo);
    } else if (!objetoSalvo) {
      //o objeto não foi salvo
      res.send({
        status: true,
        mensagem: "Erro! O objeto não foi salvo",
      });
    }
  });
});

app.get("/autenticado", (req, res) => {
  res.send(req.isAuthenticated()); //Verifica se o usuário tentando acessar essa porta está autenticado
});

app.get('mostrarTodosOsprodutos', (req, res) => {
  if (req.isAuthenticated()) { //pega o cookie do sessão e verfica com o MongoStore
    // converso com o DB
  } else {
    res.send(false)
  }
})

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, obj) => {
    // Verifica se na UserDB existe alguém com o username e password da pessoa que está tentando logar
    if (err) {
      console.log(err);
      res.send({
        erro: true, // -> Lá no frontend, eu vou saber se deu erro através do res.data.erro ?
        mensagem: "Erro na hora de Logar o usuário",
      });
    } else if (!obj) {
      res.send({
        erro: true,
        mensagem: "Usuário ou senha inválidos",
      });
    } else if (obj) {
      // frontend passou username e senha corretos!
      req.logIn(obj, (err) => {
        if (err) {
          res.send({
            erro: true,
            mensagem: "Erro na hora de autenticar Usuário",
          });
        } else {
          res.send({
            erro: false,
            mensagem: "Usuário logado com sucesso!",
            data: null,
          });
        }
      });
    }
  })(req, res, next);
});

app.post("/logout", (req, res) => {
  req.logOut((err) => {
    if (err) {
      res.send({
        erro: true,
        mensagem: "Usuário não pode ser deslogado!",
        data: null,
      });
    } else {
      res.send({
        erro: false,
        mensagem: "Usuário deslogado com sucesso!",
        data: null,
      });
    }
  });
});




app.listen(process.env.PORT || 4000, () => {
  console.log("O servidor está conectado");
});
