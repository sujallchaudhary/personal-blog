import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const WriteBlog: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [tags, setTags] = useState<string>('');
  const [category,setCategory]= useState<string>('');
  const [image,setImage] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image', 'video', 'formula','code-block'],
      ['clean'],
      [{ 'align': [] }],
    ],
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    tags.split(',').map(tag=>tag.trim());
    const formData = new FormData();
    formData.append('file', image);
    formData.append('title', title);
    formData.append('content', content);
    formData.append('tags', tags);
    formData.append('excerpt', content.replace(/<[^>]*>/g, '').slice(0, 150) + '...');
    formData.append('category', category);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/blog`,{
        method:'POST',
        body:formData,
        headers:{
          'Authorization':`Bearer ${localStorage.getItem('token')}`,
        }
      });
      const data = await response.json();
      if(data.success){
        alert('Post created successfully');
      }
      else{
        alert('Failed to create post');
      }
      
    } catch (error) {
      console.error(error);
      
    }

  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Write New Blog Post</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
            placeholder="Enter post title"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Category
          </label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
            placeholder="Enter post title"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
           Tags(seprated by comma)
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
            placeholder="Enter post title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Cover Image
          </label>
          <input
            type="file"
            accept='image/*'
            onChange={handleImageChange}
            className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
            placeholder="Enter image URL"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Content
          </label>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <ReactQuill
              value={content}
              onChange={setContent}
              modules={modules}
              className="h-96 bg-white dark:bg-gray-800"
              theme="snow"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-black dark:bg-white text-white dark:text-black px-8 py-3 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100"
          >
            Publish Post
          </button>
        </div>
      </form>
    </div>
  );
}

export default WriteBlog;