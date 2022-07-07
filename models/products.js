const mongoose = require('mongoose')

const  ProductsSchema = new mongoose.Schema({
    nome:{type:String , required:[true,'complete com o nome']},
    category:{type:String,required:[true,'complete c categoria']},
    cost:{type:Number,required:[true,"complete com cost"]},
    destination:{type:String,required:[true,"complete com o destination"]}
})

const Product = mongoose.model('Product',ProductsSchema);

module.exports = Product;