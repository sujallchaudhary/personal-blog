const BlogPost = require('../models/blogPostModel');

const createBlogPost = async (req, res) => {
    try{
        const {title,content,excerpt,category,tags,file,aiDiscussionAudio}=req.body;
        if(!title || !content || !category || !tags || !file){
            return res.status(400).json({success:false,message:'All fields are required'});
        }
        const slug = title.replace(/[^a-zA-Z0-9 ]/g, '').replace(/ /g, '-').toLowerCase();
        const blogPost = BlogPost.create({
            title,
            content,
            slug,
            excerpt,
            author: req.userId,
            category,
            tags,
            thumbnail:file,
            aiDiscussionAudio
        });
        if(!blogPost){
            return res.status(400).json({success:false,message:'Unable to create blog post'});
        }
        return res.status(201).json({success:true,message:'Blog post created successfully'});
    }catch(error){
        return res.status(500).json({success:false,message:'Internal server error'+error});
    }
};

const getBlogPosts = async (req, res) => {
    try {
        const blogPosts = await BlogPost.find({isDeleted:false}).populate('author','name').sort({createdAt:-1});
        if (!blogPosts) {
            return res.status(400).json({success:false,message:'No blog post found'});
        }
        return res.status(200).json({success:true,blogPosts});
        
    } catch (error) {
        return res.status(500).json({success:false,message:'Internal server error'+error});
        
    }
};
const getBlogPostAtHome = async (req, res) => {
    const page = req.params.page;
    const limit = 5;
    const startIndex = (page - 1) * limit;
    try{
        const blogPosts = await BlogPost.find({isDeleted:false}).select('title excerpt slug thumbnail createdAt views').populate('author','name').sort({createdAt:-1}).limit(limit).skip(startIndex);
        if(!blogPosts){
            return res.status(400).json({success:false,message:'No blog post found'});
        }
        return res.status(200).json({success:true,blogPosts});

    }
    catch(error){
        return res.status(500).json({success:false,message:'Internal server error'+error});
    }

};
const getBlogPostById = async (req, res) => {
    const id = req.params.id;
    try{
        const blogPost = await BlogPost.findOne({_id:id,isDeleted:false}).populate('author','name');
        if(!blogPost){
            return res.status(400).json({success:false,message:'No blog post found'});
        }
        blogPost.views += 1;
        blogPost.save();
        return res.status(200).json({success:true,blogPost});

    }
    catch(error){
        return res.status(500).json({success:false,message:'Internal server error'+error});
    }
};
const getBlogPostBySlug = async (req, res) => {
    const slug = req.params.slug;
    try {
        const blogPost = await BlogPost.findOne({ slug, isDeleted: false }).populate('author', 'name');
        
        if (!blogPost) {
            return res.status(400).json({ success: false, message: 'No blog post found' });
        }
        const previousPost = await BlogPost.findOne({ slug: { $lt: slug }, isDeleted: false })
            .sort({ slug: -1 })
            .select('slug');
        const nextPost = await BlogPost.findOne({ slug: { $gt: slug }, isDeleted: false })
            .sort({ slug: 1 })
            .select('slug');
        return res.status(200).json({
            success: true,
            data: blogPost,
            previousSlug: previousPost ? previousPost.slug : null,
            nextSlug: nextPost ? nextPost.slug : null,
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal server error: ' + error });
    }
};
const getPopularPost = async (req, res) => {
    try{
        const blogPosts = await BlogPost.find({isDeleted:false}).select('title slug thumbnail views createdAt').populate('author','name').sort({views:-1}).limit(5);
        if(!blogPosts){
            return res.status(400).json({success:false,message:'No blog post found'});
        }
        return res.status(200).json({success:true,blogPosts});
    }
    catch(error){
        return res.status(500).json({success:false,message:'Internal server error'+error});
    }
};
const getRecentPost = async (req, res) => {
    try{
        const blogPosts = await BlogPost.find({isDeleted:false}).select('title slug thumbnail views createdAt').populate('author','name').sort({createdAt:-1}).limit(5);
        if(!blogPosts){
            return res.status(400).json({success:false,message:'No blog post found'});
        }
        return res.status(200).json({success:true,blogPosts});
    }
    catch(error){
        return res.status(500).json({success:false,message:'Internal server error'+error});
    }
};
const updateBlogPost = async (req, res) => {
    const id = req.params.id;
    try{
        const blogPost = await BlogPost.findOneAndUpdate({_id:id,isDeleted:false},req.body,{new:true});
        if(!blogPost){
            return res.status(400).json({success:false,message:'No blog post found'});
        }
        blogPost.slug = blogPost.title.replace(/ /g, '-').toLowerCase();
        blogPost.updatedAt = Date.now();
        await blogPost.save();
        return res.status(200).json({success:true,message:'Blog post updated successfully'});
    }
    catch(error){
        return res.status(500).json({success:false,message:'Internal server error'+error});
    }
};
const deleteBlogPost = async (req, res) => {
    const id = req.params.id;
    try{
        const blogPost = await BlogPost.findOneAndUpdate({_id:id,isDeleted:false},{isDeleted:true});
        if(!blogPost){
            return res.status(400).json({success:false,message:'No blog post found'});
        }
        return res.status(200).json({success:true,message:'Blog post deleted successfully'});
    }
    catch(error){
        return res.status(500).json({success:false,message:'Internal server error'+error});
    }
};

const getBlogMetaData = async(req,res)=>{
    try{
        const slug = req.params.slug;
        const blogPost = await BlogPost.findOne({slug,isDeleted:false}).populate('author','name').select('title slug excerpt tags thumbnail author');
        if(!blogPost){
            return res.status(400).json({success:false,message:'No blog post found'});
        }
        return res.status(200).json({success:true,data:blogPost});


    }
    catch(error){
        return res.status(500).json({success:false,message:'Internal server error'+error});
    }
}

const getBlogSiteMap = async(req,res)=>{
    try {
        const blogPosts = await BlogPost.find({isDeleted:false}).select('slug updatedAt');
        if (!blogPosts) {
            return res.status(400).json({success:false,message:'No blog post found'});
        }
        return res.status(200).json({success:true,data:blogPosts});
    } catch (error) {
        return res.status(500).json({success:false,message:'Internal server error'+error});
        
    }
}

const getPageViews = async(req,res)=>{
    const slug = req.params.slug;
    try{
        const blogPosts = await BlogPost.findOne({isDeleted:false,slug}).select('views');
        if(!blogPosts){
            return res.status(400).json({success:false,message:'No blog post found'});
        }
        blogPosts.views += 1;
        await blogPosts.save();
        return res.status(200).json({success:true,data:blogPosts});
    }
    catch(error){
        return res.status(500).json({success:false,message:'Internal server error'+error});
    }
}

module.exports = {
    createBlogPost,
    getBlogPosts,
    getBlogPostAtHome,
    getBlogPostById,
    getBlogPostBySlug,
    getPopularPost,
    getRecentPost,
    updateBlogPost,
    deleteBlogPost,
    getBlogMetaData,
    getBlogSiteMap,
    getPageViews
};
