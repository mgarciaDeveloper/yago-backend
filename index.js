//jshint esversion:6

// NODE requires
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require('mongoose');
const app = express();
const session = require("express-session");
const flash = require("req-flash");
const passport = require("passport");
const MongoStore = require("connect-mongo");

//database setup Mongo Db setup

mongoose.connect(process.env.MONGO_URL,{
  useNewUrlParser : true,
  useUnifiedTopology:true,
});

app.use(
  cors({
    origin:"http://192.168.0.140:3000",
    credentials:true,
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

app.set("trust proxy ",1);
app.use(
  session({
    cookie:process.env.DEVELOPMENT
    ? null
    : {secure:true,maxAge:4*60*6000,sameSite:"none"},
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:false,
    store:process.env.PORT
    ? MongoStore.create(
       // pede onde criar e uma callback function
      {
        mongoUrl:process.env.MONGO_URL
      },
      function(err,resposta){
          //espaço para uma callback function
          console.log(err,resposta);
        }
    )
    :null
  })
 );
 
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// collections imports
var Product = require("./models/products");
var User = require("./models/users");
passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/horas",(req,res)=>{
  let horas = new Date();
  res.send(horas);
})

// objetos estão dentro de coleções no banco de dados.
// Vamos criar o ADMIN!
User.findOne({username:process.env.ADMIN_USERNAME},(err,obj)=>{
  //findone() ira encontrar o primeiro objeto que atenda ao filtro ,ele retorna esse objeto
  if(err){
    console.log(err);
  }
  else if (obj){
    console.log(obj)
  }
  else if (!obj){
    User.register(
       // irei registrar um usuário no DB
      {
        username:process.env.ADMIN_USERNAME,
        nomeDoUsuario:"yago",
        cidade:"Rio de Janeiro",
        telefone:21985121562
      },
      process.env.ADMIN_PASSWORD,
      function(err,userRegistrado){
        if(err){
          console.log(err)
        }
        else if (userRegistrado){
          console.log("usuario registrado com sucesso")
        }
      }
    )
  }
})

app.get("/produtos",(req,res)=>{
  let newobject = new Product({
    nome:"disco interestelar",
    cost:20,
    destination:'lojadochico',
    category:"filme"
  });

  newobject.save((err,savedObject)=>{
    if(err){
      res.send({
        err:true,
        mensagem:"deu erro"
      })
    }
    else if(savedObject){
      res.send(
       savedObject
      )
    }
    else if(!savedObject){
      res.send({
        err:true,
        mensagem:"deu erro"})
    }

  })

})

app.get("/auth",(req,res)=>{
  res.send(req.isAuthenticated())
});

app.post("/login", (req,res,next) => {
  passport.authenticate("local",(err,obj)=>{
    // Verifica se na UserDB existe alguém com o username e password da pessoa que está tentando logar
    if (err){
      console.log(err);
      return res.send({
        erro:true,// -> Lá no frontend, eu vou saber se deu erro através do res.data.erro ?
        mensagem:"Erro na hora de Logar o usuário",
      });
    }
    else if(!obj){
      return res.send({
        erro:true,
        mensagem:"Usuário ou senha inválidos",
      })
    }
    else if(obj){
        req.logIn(obj,(err)=>{
          if(err){
            return res.send({
              err:true,
              mensagem:"Erro na hora de autenticar Usuário",
            })
          }
          else {
            return res.send({
              err:false,
              mensagem:"Usuário logado com sucesso!",
              data: null,
            })
          }
        })
    }
  })(req,res,next);
});

app.post("/logout",(req,res)=>{
  req.logOut((err)=>{
    if(err){
      res.send({
        erro:true,
        mensagem:"usuario preso na matrix",
        data:null
      })
    }
    else{
      res.send({
        erro:false,
        mensagem:"usuario derrotou as maquinas",
        data:null,
      })
    }
  })
})

app.get('mostrarTodosOsprodutos', (req, res) => {
  if (req.isAuthenticated()) { //pega o cookie do sessão e verfica com o MongoStore
    // converso com o DB
  } else {
    res.send(false)
  }
})

app.listen(process.env.PORT || 4000,()=>{
    console.log('o servidor esta conectado');
});
