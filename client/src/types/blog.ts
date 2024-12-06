export interface BlogPost {
  _id: string;
  title: string;
  content: string;
  slug: string;
  excerpt: string;
  thumbnail: string;
  author: {
    _id: string;
    name: string;
  };
  views: number;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  name: string;
  comment: string;
  isApproved: boolean;
}

export interface LoginFormData{
  email: string;
  password: string;
}
