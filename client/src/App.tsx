import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from "./ProtectedRoute";
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import BlogPost from './pages/BlogPost';
import WriteBlog from './pages/WriteBlog';
import LoginPage from './pages/Login';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
            <Route path="/write" element={<WriteBlog />} />
            </Route>
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;