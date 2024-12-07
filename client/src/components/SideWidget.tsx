import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { BlogPost } from '../types/blog';
import useHttpRequest from '../hooks/useHttpRequest';

interface SideWidgetProps {}

const SideWidget: React.FC<SideWidgetProps> = () => {
  const { response: popularResponse, sendRequest: fetchPopularPosts } = useHttpRequest<{ success: boolean; blogPosts: BlogPost[] }>();
  const { response: latestResponse, sendRequest: fetchLatestPosts } = useHttpRequest<{ success: boolean; blogPosts: BlogPost[] }>();

  const [popularPosts, setPopularPosts] = useState<BlogPost[]>([]);
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const popularData = await fetchPopularPosts({ url: import.meta.env.VITE_API_ENDPOINT+'/blog/popular', method: 'GET' });
        const latestData = await fetchLatestPosts({ url: import.meta.env.VITE_API_ENDPOINT+'/blog/recent', method: 'GET' });

        if (popularData.success) {
          setPopularPosts(popularData.blogPosts);
        }
        if (latestData.success) {
          setLatestPosts(latestData.blogPosts);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchPosts();
  }, [fetchPopularPosts, fetchLatestPosts]);

  return (
<aside className="space-y-6 bg-gray-100 dark:bg-black p-4 rounded-lg w-full max-w-xs lg:sticky lg:top-0 lg:self-start">
  <div>
    <h3 className="text-lg font-bold mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">Latest Posts</h3>
    <ul className="space-y-3">
      {latestPosts.map((post) => (
        <li key={post._id}>
          <Link to={`/blog/${post.slug}`} className="hover:text-gray-600 dark:hover:text-gray-300">
            <h4 className="font-medium text-sm">{post.title}</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {format(new Date(post.createdAt), 'MMM d, yyyy')}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  </div>
  <div>
    <h3 className="text-lg font-bold mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">Popular Posts</h3>
    <ul className="space-y-3">
      {popularPosts.map((post) => (
        <li key={post._id}>
          <Link to={`/blog/${post.slug}`} className="hover:text-gray-600 dark:hover:text-gray-300">
            <h4 className="font-medium text-sm">{post.title}</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">{post.views} views</p>
          </Link>
        </li>
      ))}
    </ul>
  </div>
</aside>

  );
};

export default SideWidget;
