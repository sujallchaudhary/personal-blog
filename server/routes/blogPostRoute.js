const express = require('express');
const router = express.Router();
const {createBlogPost,getBlogPosts,getBlogPostAtHome,getBlogPostById,getBlogPostBySlug,getPopularPost,getRecentPost,updateBlogPost,deleteBlogPost,getBlogMetaData,getBlogSiteMap,getPageViews} = require('../controllers/blogPostController');
const {jwt}=require('../middlewares/jwt');
const uploadFile = require('../middlewares/fileUploadToDO');

router.post('/',jwt,uploadFile,createBlogPost);
router.get('/',getBlogPosts);
router.get('/slug/:slug',getBlogPostBySlug);
router.get('/home/:page',getBlogPostAtHome);
router.get('/popular',getPopularPost);
router.get('/recent',getRecentPost);
router.get('/sitemap',getBlogSiteMap);
router.get('/:id',getBlogPostById);
router.put('/:id',jwt,updateBlogPost);
router.delete('/:id',jwt,deleteBlogPost);
router.get('/metadata/:slug',getBlogMetaData);
router.get('/views/:slug',getPageViews);


module.exports = router;
