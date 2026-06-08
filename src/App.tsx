import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Library from './pages/Library';
import Review from './pages/Review';
import Profile from './pages/Profile';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8 flex flex-col mt-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/library" element={<Library />} />
          <Route path="/review" element={<Review />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
