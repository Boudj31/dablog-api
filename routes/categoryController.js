const express = require('express')
const router = express.Router();
const categoryService = require("../services/categoryService");
const auth = require('../middleware/auth')


// findAll
router.get("/", auth.tokenInterceptor,categoryService.findAll )
//findById

router.get('/id/:id', auth.tokenInterceptor, categoryService.findById)
/*
//countAll
router.get("/count", auth.tokenInterceptor, todoService.countAll)
// newCategory
router.post('/',auth.tokenInterceptor, todoService.createTodo)
// updateCategory
router.put('/:id',auth.tokenInterceptor, todoService.updateTodo)
// deleteCategory
router.delete('/:id',auth.tokenInterceptor, todoService.deleteTodo)

 */


module.exports = router;
