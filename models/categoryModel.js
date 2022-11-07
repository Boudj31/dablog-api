const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    posts : [
        {type: mongoose.Schema.Types.ObjectId, ref: 'posts'}
    ]
});

const CategoryModel = mongoose.model("categories", CategorySchema);

module.exports = {CategoryModel}