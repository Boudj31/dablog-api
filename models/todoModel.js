const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TodoSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        required: true
    }
})

const TodoModel = mongoose.model("todos", TodoSchema);
module.exports = {TodoModel}