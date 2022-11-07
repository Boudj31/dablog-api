const express = require("express");
const router = express.Router();
const postService = require('../services/postsService')
const auth = require('../middleware/auth')

// findAll
router.get("/", postService.findAll )
//findAllPaginate
router.get("/paginate/:page/:max", postService.findAllPaginate);
//findById
router.get('/id/:id', postService.findById)
//findBySlug
router.get('/slug/:slug', postService.findBySlug)
//countAll
router.get("/count", postService.countAll)
// newPost
router.post('/',auth.tokenInterceptor, postService.createPost)
// updatePost
router.put('/:id',auth.tokenInterceptor, postService.updatePost)
// deletePost
router.delete('/:id',auth.tokenInterceptor, postService.deletePost)


module.exports = router;

