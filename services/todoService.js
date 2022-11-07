const ObjectID = require("mongoose").Types.ObjectId;
const {TodoModel} = require('../models/todoModel');

exports.findAll = async (req, res) => {
    TodoModel.find((err, docs) => {
        if (!err) res.send(docs);
        else console.log("Error to get data : " + err);
    })
}

exports.findAllPaginate = async (req, res) => {
    try {
        const pageNumber = parseInt(req.params.page) || 0;
        const limit = parseInt(req.params.max) || 12;
        const result = {};

        const totalPosts = await TodoModel.countDocuments().exec();
        let startIndex = pageNumber * limit;
        const endIndex = (pageNumber + 1) * limit;
        result.totalPosts = totalPosts;
        if (startIndex > 0) {
            result.previous = {
                pageNumber: pageNumber - 1,
                limit: limit,
            };
        }
        if (endIndex < (await TodoModel.countDocuments().exec())) {
            result.next = {
                pageNumber: pageNumber + 1,
                limit: limit,
            };
        }
        result.todos = await TodoModel.find()
            .sort("-_id")
            .skip(startIndex)
            .limit(limit)
            .exec();
        result.rowsPerPage = limit;
        return res.json({ msg: "Utilisateur chargé avec succès !", data: result });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Sorry, something went wrong" ,errorCode: 500});
    }
}

exports.findById = async (req, res) => {
    TodoModel.findById(
        req.params.id,
        (err, docs) => {
            if(!err) {
                return res.json({msg: "Todo avec l'id : " + req.params.id, data : docs})
            } else {
                console.log("Erreur : " + err)
                return res.status(500).json({ msg: "Sorry, something went wrong" , errorCode: 500});
            }

        }
    )
}

exports.countAll = async (req, res) => {

    TodoModel.count({}, (err, docs) => {
        if(!err) res.send("Nombre de todos : " + docs)
        else console.log("Erreur du count : " + err)
    })
}

exports.createTodo = async (req, res) => {
    const newTodo = new TodoModel({
        title: req.body.title,
        completed: req.body.completed
    });
    newTodo.save((err, docs) => {
        if(!err) res.send(docs);
        else console.log("Erreur pendant la creation :" + err)
    })
}

exports.updateTodo = async (req, res) => {
    if(!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID inconnu : " + req.params.id)

    const todoUpdated = {
        title: req.body.title,
        completed: req.body.completed
    }

    TodoModel.findByIdAndUpdate(
        req.params.id,
        {$set: todoUpdated},
        {new: true},
        (err, docs) => {
            if(!err) res.send(docs)
            else console.log("Update error: " + err)
        }
    )

}

exports.deleteTodo = async (req, res) => {
    if(!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID inconnu : " + req.params.id)

    TodoModel.findByIdAndDelete(
        req.params.id,
        (err, docs) => {
            if(!err) res.send(docs)
            else console.log("Delete error : " + err)
        }
    )
}