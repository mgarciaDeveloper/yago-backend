//vamos usar MongoDb, e mongoose para o nosso banco de dados
var mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const encrypt = require("mongoose-encryption");

//vamos criar um schema de collection, chamada 'ProductSchema'
const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  nomeDoUsuario: { type: String, required: [true, "Este campo é obrigatório"] },
  cidade: { type: String, required: [true, "Este campo é obrigatório"] },
  telefone: { type: Number, required: [true, "Este campo é obrigatório"] },
});

UserSchema.plugin(passportLocalMongoose); //criptografia de password e um esquema de login com username & password
/* 
UserSchema.plugin(encrypt, {
  //Criptografo alguma key da colection. não serve para login (criar sessão, autenticar...)
  secret: process.env.SECRET,
  encryptedFields: ["telefone"],
}); */

const User = mongoose.model("User", UserSchema);
// vamos exportar a collection 'Product'
module.exports = User;

// Para o Banco de Dados, usamos o MongoDB
// Como nosso servidor está configurado em node.js, usaremos o MONGOOSE Module
// Criamos um banco de dados com diversas colections, onde cada collection armazena um tipo de dado
// Cada dado precisa de um esquema, ou seja, um formato
// Esse formato é exportado para o servidor (index.js) para poder ser manipulado (de preferência, pelo frontend)
