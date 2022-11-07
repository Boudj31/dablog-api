const ObjectID = require("mongoose").Types.ObjectId;
const {CategoryModel} = require('../models/categoryModel');


exports.findAll = async (req, res) => {
    CategoryModel.find((err, docs) => {
        if(!err) return res.status(200).json(docs)
        else console.log("Error to get data : " + err);

    })
}

exports.findById = async (req, res) => {
    const {id} = req.params;
    CategoryModel.findById(
        id,
        (err, docs) => {
            if(!err) {
                return res.json({msg: "Categorie avec l'id : " + req.params.id, data : docs})
            } else {
                console.log("Erreur : " + err)
                return res.status(500).json({ msg: "Sorry, something went wrong" , errorCode: 500});
            }

        }).populate('posts')

}