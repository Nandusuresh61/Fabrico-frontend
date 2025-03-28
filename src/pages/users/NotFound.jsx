import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="text-center bg-white shadow-2xl rounded-xl p-8 max-w-md w-full transform transition-all hover:scale-105 duration-300">
        <div className="flex justify-center mb-6">
          <AlertTriangle 
            size={80} 
            className="text-yellow-500 animate-bounce"
          />
        </div>
        <h1 className="text-5xl font-extrabold text-gray-800 mb-4 tracking-tight">
          404
        </h1>
        <p className="text-xl text-gray-600 mb-6 italic">
          Not Found
        </p>
        <div className="flex justify-center space-x-4">
          <a 
            href="/" 
            className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow-md"
          >
            Back to Home
          </a>
        </div>
        <p className="text-sm text-gray-400 mt-6">
          The page {location.pathname} seems to have disappeared
        </p>
      </div>
    </div>
  );
};

export default NotFound;