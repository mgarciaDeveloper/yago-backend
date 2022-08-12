//vamos usar MongoDb, e mongoose para o nosso banco de dados
const mongoose = require('mongoose')

//vamos criar um schema de collection, chamada 'ProductSchema'
const  ProductsSchema = new mongoose.Schema({
    nome:{type:String , required:[true,'complete com o nome']},
    category:{type:String,required:[true,'complete c categoria']},
    cost:{type:Number,required:[true,"complete com cost"]},
    destination:{type:String,required:[true,"complete com o destination"]}
})

//vamos criar uma collection. Essa collection vai ter o formato da 'ProductSchema'
const Product = mongoose.model('Product',ProductsSchema);

// vamos exportar a collection 'Product'
module.exports = Product;