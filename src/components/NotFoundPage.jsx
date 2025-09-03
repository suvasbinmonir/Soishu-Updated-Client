import { useNavigate } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col justify-center items-center h-screen">
      <div className="flex flex-col items-center justify-center border border-gray-300 p-10 rounded-2xl max-w-4xl w-full max-h-80 h-full">
        <div className="text-9xl text-red-500">
          <FaExclamationTriangle size={100} />
        </div>
        <h1 className="text-3xl font-semibold mt-2 text-[#495057]">
          404 - Page Not Found
        </h1>
        <p className="text-sm text-gray-500 mt-2 text-center">
          The page you're looking for doesn’t exist or has been moved.
        </p>
      </div>
      <button
        className="mt-10 px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-100 cursor-pointer"
        onClick={() => navigate('/')}
      >
        Back to Home
      </button>
    </div>
  );
}
