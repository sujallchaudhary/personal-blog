import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { Eye, Calendar, User, CheckCircle,Share2Icon} from 'lucide-react';
import SideWidget from '../components/SideWidget';
import '../styles/prism-theme.css';
import useHttpRequest from '../hooks/useHttpRequest';
import { BlogPost, Comment } from '../types/blog';
import { Helmet } from 'react-helmet';

const BlogPostC: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const [commentName, setCommentName] = useState<string>('');
  const authToken = localStorage.getItem('token');

  const { sendRequest: fetchPost } = useHttpRequest<{ success: boolean; blogPost: BlogPost }>();
  const { sendRequest: fetchComments } = useHttpRequest<{ success: boolean; data: Comment[] }>();
  const { sendRequest: postComment } = useHttpRequest();
  const { sendRequest: approveComment } = useHttpRequest();

  useEffect(() => {
    const getPostAndComments = async () => {
      try {
        const data = await fetchPost({
          url: `${import.meta.env.VITE_API_ENDPOINT}/blog/slug/${slug}`,
          method: 'GET',
        });
        const postData = data.data;
        setPost(postData);

        if (postData?._id) {
          const commentUrl = authToken
            ? `${import.meta.env.VITE_API_ENDPOINT}/comment/all/${postData._id}`
            : `${import.meta.env.VITE_API_ENDPOINT}/comment/${postData._id}`;

          const commentsData = await fetchComments({
            url: commentUrl,
            method: 'GET',
            headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
          });

          setComments(commentsData.data);
        }
      } catch (error) {
        console.error('Error fetching post or comments:', error);
      }
    };

    getPostAndComments();
  }, [slug, fetchPost, fetchComments, authToken]);
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.excerpt,
        url: window.location.href,
      });
    } else {
      alert('Web Share API not supported in your browser.');
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const comment = { blogPostId: post?._id, name: commentName, comment: newComment };
      const commentData: { success: boolean; data: Comment} = await postComment({
        url: import.meta.env.VITE_API_ENDPOINT + '/comment',
        method: 'POST',
        body: comment,
      });
      setComments((prev) => [...prev, commentData.data]);
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const handleApproveComment = async (commentId: string) => {
    try {
      await approveComment({
        url: `${import.meta.env.VITE_API_ENDPOINT}/comment/approve/${commentId}`,
        method: 'PUT',
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setComments((prev) =>
        prev.map((comment) =>
          comment._id === commentId ? { ...comment, isApproved: true } : comment
        )
      );
    } catch (error) {
      console.error('Error approving comment:', error);
    }
  };

  if (!post) {
    return <div>Loading post...</div>;
  }

  return (
    <div className="max-w-8xl mx-auto">
    <Helmet>
    <title>{post.title} - Sujal Unfolded</title>
    <meta name="description" content={post.excerpt} />
    <meta name="keywords" content={post.tags} />
    <meta name="author" content="Your Name or Site" />
    <meta property="og:title" content={post.title} />
    <meta property="og:description" content={post.excerpt} />
    <meta property="og:type" content="article" />
    <meta property="og:url" content={window.location.href} />
    <meta property="og:image" content={post.thumbnail} />
    <meta name="twitter:card" content={post.thumbnail} />
    <meta name="twitter:title" content={post.title} />
    <meta name="twitter:description" content={post.excerpt} />
    <meta name="twitter:image" content={post.thumbnail} />
  </Helmet>
      <div className="grid grid-cols-12 gap-8">
        {/* Main Content */}
        <article className="col-span-12 lg:col-span-7 xl:col-span-8">
          {post.thumbnail && (
            <img
              src={post.thumbnail}
              alt={post.title}
              className="w-full h-96 object-cover rounded-lg mb-8"
            />
          )}

          <h1 className="text-4xl font-bold mb-6 dark:text-white">{post.title}</h1>

          <div className="flex flex-wrap gap-4 items-center text-sm text-gray-600 dark:text-gray-400 mb-8">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              <span>{post.author.name}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{format(new Date(post.createdAt), 'MMM d, yyyy')}</span>
            </div>
            <div className="flex items-center">
              <Eye className="w-4 h-4 mr-2" />
              <span>{post.views} views</span>
            </div>
            <div className="flex items-center">
             <a href="#"><Share2Icon className="w-4 h-4 mr-2" onClick={handleShare} /></a> 
            </div>
          </div>

          <div
            className="blog-content mb-12"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
            <h2 className="text-2xl font-bold mb-6 dark:text-white">Comments</h2>
            <div className="space-y-6">
              {comments.map((comment) => (
                <div
                  key={comment._id}
                  className={`border-b ${
                    comment.isApproved
                      ? 'border-gray-100 dark:border-gray-800'
                      : 'border-yellow-500'
                  } pb-6`}
                >
                  <div className="flex justify-between mb-2">
                    <span className="font-medium dark:text-white">{comment.name}</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{comment.comment}</p>
                  {!comment.isApproved && authToken && (
                    <button
                      onClick={() => handleApproveComment(comment._id)}
                      className="text-blue-500 text-sm flex items-center gap-1 hover:text-blue-600"
                    >
                      <CheckCircle className="w-4 h-4" /> Approve
                    </button>
                  )}
                </div>
              ))}
            </div>

            <form className="mt-8" onSubmit={handlePostComment}>
              <input
                className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white mb-4"
                value={commentName}
                onChange={(e) => setCommentName(e.target.value)}
                placeholder="Enter Your Name"
              />
              <textarea
                className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                rows={4}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
              />
              <button
                type="submit"
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Post Comment
              </button>
            </form>
          </div>
        </article>

        {/* Right Sidebar */}
        <div className="col-span-12 lg:col-span-4">
          <SideWidget />
        </div>
      </div>
    </div>
  );
};

export default BlogPostC;
