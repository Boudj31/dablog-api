const express = require('express')
const router = express.Router();
const userService = require("../services/userService");
const auth = require('../middleware/auth')


// findAll
router.get("/", auth.tokenInterceptor ,userService.findAll )
//findAllPaginate
router.get("/paginate/:page/:max",auth.tokenInterceptor, userService.findAllPaginate);
//findById
router.get('/id/:id', auth.tokenInterceptor , userService.findById)
//countAll
router.get("/count", auth.tokenInterceptor , userService.countAll)
// newUser
router.post('/', userService.createUser)
// updateUser
router.put('/:id',auth.tokenInterceptor, userService.updateUser)
// deleteUser
router.delete('/:id',auth.tokenInterceptor , userService.deleteUser)
//login
router.post('/login', userService.login)


module.exports = router;

