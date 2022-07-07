//jshint esversion:6

// NODE requires
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require('mongoose');
const app = express();

//database setup Mongo Db setup
mongoose.connect(process.env.MONGO_URL),{
  useNewUrlParser : true,
  useUnifiedTopology:true,
};

//



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


const Product = require("./models/products")


app.get("/horas",(req,res)=>{
  let horas = new Date()
  return res.send(horas)
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

app.listen(process.env.PORT || 4000,()=>{
    console.log('o servidor esta conectado');
});

