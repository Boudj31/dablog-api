const mongoose = require("mongoose")

const Schema = mongoose.Schema;


const PostSchema = new Schema(
    {
        author: {
            type: String,
            required: true
        },
        /*
         author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        },
         */
        title: {
            type: String,
            required: true
        },
        slug: {
            type: String,
            required: true
        },
        summary: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'users'
        },
        date: {
            type: Date,
            default: Date.now()
        }
    },
)

const PostModel = mongoose.model("posts", PostSchema)


module.exports = {PostModel}