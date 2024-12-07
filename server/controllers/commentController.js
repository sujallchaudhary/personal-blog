const BlogPost = require('../models/blogPostModel');
const Comment = require('../models/commentModel');
const createComment = async (req, res) => {
    try{
        const {blogPostId,name,comment}=req.body;
        if(!blogPostId || !name || !comment){
            return res.status(400).json({success:false,message:'All fields are required'});
        }
        const blogPost = await BlogPost.findOne({_id:blogPostId,isDeleted:false}).select('_id');
        if(!blogPost){
            return res.status(400).json({success:false,message:'Invalid blog post'});
        }
        const newComment =await Comment.create({name,comment,blogPost:blogPostId});
        if(!newComment){
            return res.status(400).json({success:false,message:'Unable to create comment'});
        }
        return res.status(201).json({success:true,message:'Comment created successfully',data:newComment});
    }
    catch(error){
        return res.status(500).json({success:false,message:'Internal server error'+error});
    }
};

const getCommentsByBlogPostId = async (req, res) => {
    const id = req.params.id;
    try{   
        let comments = await Comment.find({blogPost:id,isDeleted:false,isApproved:true}).select('name comment').sort({createdAt:-1});     
        if(!comments){
            return res.status(400).json({success:false,message:'No comment found'});
        }
        return res.status(200).json({success:true,message:'comments fetched successfully',data:comments});
    }
    catch(error){
        return res.status(500).json({success:false,message:'Internal server error'+error});
    }
};
const getAllCommentByBlogPostId= async (req, res) => {
    const id = req.params.id;
    try{   
        let comments = await Comment.find({blogPost:id,isDeleted:false}).select('name comment isApproved').sort({createdAt:-1});     
        if(!comments){
            return res.status(400).json({success:false,message:'No comment found'});
        }
        return res.status(200).json({success:true,message:'comments fetched successfully',data:comments});
    }
    catch(error){
        return res.status(500).json({success:false,message:'Internal server error'+error});
    }
};
const approveComment = async (req, res) => {
    const id = req.params.id;
    try{
        const comment = await Comment.findOne({_id:id,isDeleted:false});
        if(!comment){
            return res.status(400).json({success:false,message:'Invalid comment'});
        }
        comment.isApproved = true;
        await comment.save();
        return res.status(200).json({success:true,message:'Comment approved successfully'});
    }
    catch(error){
        return res.status(500).json({success:false,message:'Internal server error'+error});
    }
};

const deleteComment = async (req, res) => {
    const id = req.params.id;
    try{
        const comment = await Comment.findOne({_id:id,isDeleted:false});
        if(!comment){
            return res.status(400).json({success:false,message:'Invalid comment'});
        }
        comment.isDeleted = true;
        await comment.save();
        return res.status(200).json({success:true,message:'Comment deleted successfully'});
    }
    catch(error){
        return res.status(500).json({success:false,message:'Internal server error'+error});
    }
};

module.exports = {createComment,getCommentsByBlogPostId,getAllCommentByBlogPostId,approveComment,deleteComment};