const ObjectID = require("mongoose").Types.ObjectId;
const {PostModel} = require('../models/postModel');
const {UserModel} = require("../models/userModel");
const {categoryModel, CategoryModel} = require("../models/categoryModel");

function slugify(str)
{
    str = str.replace(/^\s+|\s+$/g, '');

    str = str.toLowerCase();

    let from = "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆa·/_,:;";
    let to   = "AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa------";
    for (let i=0, l=from.length ; i<l ; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '')

        .replace(/\s+/g, '-')

        .replace(/-+/g, '-');

    return str;
}

exports.findAll = async (req, res) => {
    PostModel.find((err, docs) => {
        if (!err) res.send(docs);
        else console.log("Error to get data : " + err);
    })
}

exports.countAll = async (req, res) => {

    PostModel.count({}, (err, docs) => {
        if(!err) res.send("Nombre d'articles : " + docs)
        else console.log("Erreur du count : " + err)
    })
}

exports.findAllPaginate = async (req, res) => {
    try {
        const pageNumber = parseInt(req.params.page) || 0;
        const limit = parseInt(req.params.max) || 12;
        const result = {};

        const totalPosts = await PostModel.countDocuments().exec();
        let startIndex = pageNumber * limit;
        const endIndex = (pageNumber + 1) * limit;
        result.totalPosts = totalPosts;
        if (startIndex > 0) {
            result.previous = {
                pageNumber: pageNumber - 1,
                limit: limit,
            };
        }
        if (endIndex < (await PostModel.countDocuments().exec())) {
            result.next = {
                pageNumber: pageNumber + 1,
                limit: limit,
            };
        }
        result.posts = await PostModel.find()
            .sort("-_id")
            .skip(startIndex)
            .limit(limit)
            .exec();
        result.rowsPerPage = limit;
        return res.json({ msg: "Articles chargé avec succès !", data: result });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Sorry, something went wrong" ,errorCode: 500});
    }
}

exports.findById = async (req, res) => {
    PostModel.findById(
        req.params.id,
        (err, docs) => {
            if(!err) {
                return res.json({msg: "Article avec l'id : " + req.params.id, data : docs})
            } else {
                console.log("Erreur du count : " + err)
                return res.status(500).json({ msg: "Sorry, something went wrong" , errorCode: 500});
            }

        }
    )
};
exports.findBySlug = async (req, res) => {
    PostModel.findOne(
        {slug: req.params.slug},
        (err, docs) => {
            if(!err && docs != null) {
                return res.json({msg: "Article avec le slug : " + req.params.slug, data : docs})
            } else {
                return res.status(500).json({ msg: "Sorry, something went wrong" , errorCode: 500});
            }

        }
    )
}

exports.count = async (req, res) => {
PostModel.count({}, (err, docs) => {
    if(!err) {
        return res.send(docs)
    }
    else {
        console.log("Erreur du count : " + err)
    }
})

}

exports.createPost = async (req, res) => {
    const {author, title, content, category, summary, image} = req.body
    const newPost = new PostModel({
        author: author,
        title: title,
        slug: slugify(title),
        content: content,
        category: category,
        summary: summary,
        image: image
    });
    newPost.save((err, docs) => {
        if(!err) {
            CategoryModel.findByIdAndUpdate(category._id, {
                $push: {posts: docs._id}
            }, {
                new: true, useFindAndModify: false
            })

            res.send(docs);
        }
        else {
            console.log("Erreur pendant la creation :" + err)
        }
    })
}

exports.updatePost = async (req, res) => {
    if(!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID inconnu : " + req.params.id)

    const postUpdated = {
        author: req.body.author,
        title: req.body.title,
        slug: slugify(req.body.title),
        content: req.body.content,
        category: req.body.category,
        summary: req.body.summary,
        image: req.body.image
    }

    PostModel.findByIdAndUpdate(
        req.params.id,
        {$set: postUpdated},
        {new: true},
        (err, docs) => {
            if(!err) res.send(docs)
            else console.log("Update error: " + err)
        }
    )

}

exports.deletePost = async (req, res) => {
    if(!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID inconnu : " + req.params.id)

    PostModel.findByIdAndDelete(
        req.params.id,
        (err, docs) => {
            if(!err) res.send(docs)
            else console.log("Delet error : " + err)
        }
    )
}