//vamos usar MongoDb, e mongoose para o nosso banco de dados
var mongoose = require("mongoose");

//vamos criar um schema de collection, chamada 'ProductSchema'
const ProductSchema = new mongoose.Schema({
  nome: { type: String, required: [true, "Este campo é obrigatório"] },
  custo: { type: Number, required: [true, "Este campo é obrigatório"] },
  categoria: { type: String, required: [true, "Este campo é obrigatório"] },
  destino: { type: String, required: [true, "Este campo é obrigatório"] },
});

//vamos criar uma collection. Essa collection vai ter o formato da 'ProductSchema'
const Product = mongoose.model("Product", ProductSchema);

// vamos exportar a collection 'Product'
module.exports = Product;
