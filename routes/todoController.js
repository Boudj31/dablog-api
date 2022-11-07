const express = require('express')
const router = express.Router();
const todoService = require("../services/todoService");
const auth = require('../middleware/auth')


// findAll
router.get("/",todoService.findAll )
//findAllPaginate
router.get("/paginate/:page/:max", todoService.findAllPaginate);
//findById
router.get('/id/:id', todoService.findById)
//countAll
router.get("/count", todoService.countAll)
// newTodo
router.post('/',auth.tokenInterceptor, todoService.createTodo)
// updateTodo
router.put('/:id',auth.tokenInterceptor, todoService.updateTodo)
// deleteTodo
router.delete('/:id',auth.tokenInterceptor, todoService.deleteTodo)


module.exports = router;
