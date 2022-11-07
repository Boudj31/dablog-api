const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const UserSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        fName: {
            type: String,
            required: true
        },
        lName: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        role: {
            type: String,
            required: true,
            default: "USER"
        },
        /*
        posts : [
            {type: mongoose.Schema.Types.ObjectId, ref: 'posts'}
        ]

         */
    },
)
const UserModel = mongoose.model("users", UserSchema)
module.exports = {UserModel}