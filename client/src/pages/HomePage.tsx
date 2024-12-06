import React, { useEffect, useState } from 'react';
import BlogCard from '../components/BlogCard';
import SideWidget from '../components/SideWidget';
import { BlogPost } from '../types/blog';
import useHttpRequest from '../hooks/useHttpRequest';

const HomePage: React.FC = () => {
  const { response, isLoading, error, sendRequest } = useHttpRequest<{ success: boolean; blogPosts: BlogPost[] }>();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchBlogPosts = async (page: number) => {
    try {
      const data = await sendRequest({
        url: `${import.meta.env.VITE_API_ENDPOINT}/blog/home/${page}`,
        method: 'GET',
      });

      if (data.success) {
        setBlogPosts(prevPosts => [...prevPosts, ...data.blogPosts]);
        if (data.blogPosts.length === 0) setHasMore(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBlogPosts(page);
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      if (isLoading || !hasMore) return;

      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        setPage(prevPage => prevPage + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading, hasMore]);

  const latestPosts = [...blogPosts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const popularPosts = [...blogPosts].sort((a, b) => b.views - a.views);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
  <div className="lg:col-span-2 flex justify-center">
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-8 text-center">Latest Posts</h1>
      <div className="space-y-8">
        {latestPosts.map((post) => (
          <BlogCard key={post._id} post={post} />
        ))}
        {isLoading && <p className="text-center">Loading...</p>}
        {!hasMore && <p className="text-center text-gray-500">No more Posts</p>}
      </div>
    </div>
  </div>
  <div className="lg:col-span-1 lg:sticky lg:top-0">
    <SideWidget />
  </div>
</div>

  );
};

export default HomePage;
