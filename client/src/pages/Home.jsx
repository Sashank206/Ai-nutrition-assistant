import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-6">

      <h1 className="text-5xl font-bold">
        AI Nutrition Assistant 🚀
      </h1>

      <div className="flex gap-4">

        <Link
          to="/login"
          className="bg-blue-500 px-6 py-3 rounded-lg"
        >
          Login
        </Link>

        <Link
          to="/register"
          className="bg-green-500 px-6 py-3 rounded-lg"
        >
          Register
        </Link>

      </div>
    </div>
  );
}

export default Home;