const express = require('express');
const router = express.Router();

const {createComment,getCommentsByBlogPostId,getAllCommentByBlogPostId,approveComment,deleteComment} = require('../controllers/commentController');
const {jwt}=require('../middlewares/jwt');

router.post('/',createComment);
router.get('/:id',getCommentsByBlogPostId);
router.get('/all/:id',jwt,getAllCommentByBlogPostId);
router.put('/approve/:id',jwt,approveComment);
router.delete('/:id',jwt,deleteComment);

module.exports = router;