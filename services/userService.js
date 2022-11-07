const ObjectID = require("mongoose").Types.ObjectId;
const {UserModel} = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.findAll = async (req, res) => {
    UserModel.find((err, docs) => {
        if (!err) res.send(docs);
        else console.log("Error to get data : " + err);
    })
}

exports.findAllPaginate = async (req, res) => {
    try {
        const pageNumber = parseInt(req.params.page) || 0;
        const limit = parseInt(req.params.max) || 12;
        const result = {};

        const totalPosts = await UserModel.countDocuments().exec();
        let startIndex = pageNumber * limit;
        const endIndex = (pageNumber + 1) * limit;
        result.totalPosts = totalPosts;
        if (startIndex > 0) {
            result.previous = {
                pageNumber: pageNumber - 1,
                limit: limit,
            };
        }
        if (endIndex < (await UserModel.countDocuments().exec())) {
            result.next = {
                pageNumber: pageNumber + 1,
                limit: limit,
            };
        }
        result.users = await UserModel.find()
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
    UserModel.findById(
        req.params.id,
        (err, docs) => {
            if(!err) {
                return res.json({msg: "Utilisateur avec l'id : " + req.params.id, data : docs})
            } else {
                console.log("Erreur du count : " + err)
                return res.status(500).json({ msg: "Sorry, something went wrong" , errorCode: 500});
            }

        }
    )
}

exports.countAll = async (req, res) => {

    UserModel.count({}, (err, docs) => {
        if(!err) res.send("Nombre d'Utilisateurs : " + docs)
        else console.log("Erreur du count : " + err)
    })
}

exports.createUser = async (req, res) => {
    const { email, password, fName, lName, phone, role} = req.body;

    const userAlreadyExist = await UserModel.findOne({email})
    //check if user already exist
    if(userAlreadyExist) {
        return res.status(403).send("User Already Exist. Please Login");
    }

    // encrypt password
    let passwordCrypted = await bcrypt.hash(password, 10)

    const newUser = new UserModel({
        email: email,
        password: passwordCrypted,
        fName: fName,
        lName: lName,
        phone: phone,
        role: role
    });

    newUser.save((err, docs) => {
        if(!err) res.send(docs);
        else console.log("Erreur pendant la creation :" + err)
    })
}

exports.updateUser = async (req, res) => {
    if(!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID inconnu : " + req.params.id)
    const { email, password, fName, lName, phone, role} = req.body;



    let passwordCrypted = await bcrypt.hash(password, 10)
    const userUpdated = {
        email: email,
        password: passwordCrypted ,
        fName: fName,
        lName: lName,
        phone: phone,
        role: role
    }

    UserModel.findByIdAndUpdate(
        req.params.id,
        {$set: userUpdated},
        {new: true},
        (err, docs) => {
            if(!err) res.send(docs)
            else console.log("Update error: " + err)
        }
    )

}

exports.deleteUser = async (req, res) => {
    if(!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID inconnu : " + req.params.id)

    UserModel.findByIdAndDelete(
        req.params.id,
        (err, docs) => {
            if(!err) res.send(docs)
            else console.log("Delete error : " + err)
        }
    )
}

exports.login = async (req, res) => {

    // Our login logic starts here
    try {
        // Get user input
        const { email, password } = req.body;

        // Validate if user exist in our database
        const user = await UserModel.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            //expiration
            const expiresIn = 24*60*60 // 1 day
            // Create token
            const token = jwt.sign(
                { user_id: user._id, email },
                process.env.SECRET_KEY,
                {
                    expiresIn: expiresIn,
                }
            );

            // user
            return res.status(200).json({msg: "Connexion réussie", user: user, token : token});
        }
       return res.status(401).send("Identifiants erronés");
    } catch (err) {
        console.log(err);
    }

}