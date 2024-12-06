const express = require('express');
const router = express.Router();
const {createBlogPost,getBlogPosts,getBlogPostAtHome,getBlogPostById,getBlogPostBySlug,getPopularPost,getRecentPost,updateBlogPost,deleteBlogPost} = require('../controllers/blogPostController');
const {jwt}=require('../middlewares/jwt');

router.post('/',jwt,createBlogPost);
router.get('/',getBlogPosts);
router.get('/slug/:slug',getBlogPostBySlug);
router.get('/home/:page',getBlogPostAtHome);
router.get('/popular',getPopularPost);
router.get('/recent',getRecentPost);
router.get('/:id',getBlogPostById);
router.put('/:id',jwt,updateBlogPost);
router.delete('/:id',jwt,deleteBlogPost);

module.exports = router;
