//vamos usar MongoDb, e mongoose para o nosso banco de dados
var mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const encrypt = require("mongoose-encryption");

//vamos criar um schema de collection, chamada 'ProductSchema'
const UserSchema = new mongoose.Schema({
  nome: { type: String, required: [true, "Este campo é obrigatório"] },
  username: { type: Number, required: [true, "Este campo é obrigatório"] },
  password: { type: String, required: [true, "Este campo é obrigatório"] },
  cidade: { type: String, required: [true, "Este campo é obrigatório"] },
  telefone: { type: String, required: [true, "Este campo é obrigatório"] },
});

//vamos criar uma collection. Essa collection vai ter o formato da 'ProductSchema'
UserSchema.plugin(passportLocalMongoose); //criptografia de password e um esquema de login com username & password

UserSchema.plugin(encrypt, {
  //Criptografo alguma key da colection. não serve para login (criar sessão, autenticar...)
  secret: process.env.SECRET,
  encryptedFields: ["telefone"],
});
const User = mongoose.model("User", UserSchema);
// vamos exportar a collection 'Product'
module.exports = User;
