import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Eye } from 'lucide-react';
import { BlogPost } from '../types/blog';

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  return (
    <article className="bg-white dark:bg-black dark:text-white rounded-lg overflow-hidden transition-shadow">
      {post.thumbnail && (
        <img 
          src={post.thumbnail} 
          alt={post.title}
          className="w-full h-72 object-cover"
        />
      )}
      <div className="p-6">
        <Link to={`/blog/${post.slug}`}>
          <h2 className="text-2xl font-bold mb-2 hover:text-gray-400">{post.title}</h2>
        </Link>
        <p className="dark:text-white text-black mb-4">{post.excerpt}</p>
        <div className="flex justify-between items-center text-sm text-black dark:text-white">
          <div className="flex items-center space-x-4">
            <span>{post.author.name}</span>
            <span>{post.createdAt && !isNaN(Date.parse(post.createdAt))
            ? format(new Date(post.createdAt), 'MMM d, yyyy')
            : 'Unknown Date'}</span>
          </div>
          <div className="flex items-center">
            <Eye className="w-4 h-4 mr-1" />
            <span>{post.views}</span>
          </div>
        </div>
      </div>
      <div className='border-t border-gray-800 dark:border-gray-600 py-8 mt-auto'>
      </div>
    </article>
  );
}

export default BlogCard;