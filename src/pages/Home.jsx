import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-100/90 bg-opacity-90 px-4">
      <h1 className="text-5xl font-extrabold mb-6">So‘zlar Bozori</h1>
      <p className="mb-6 text-xl text-center max-w-md">
        Bozor rastasidagi mevalarni to‘g‘ri savatlarga joylashtiring! O‘yin orqali
        "Kim?", "Nima?", "Qayer?" so‘z turkumlarini o‘rganing.
      </p>
      <Link to="/game">
        <button className="bg-green-600 text-white px-8 py-3 rounded-xl shadow-lg hover:bg-green-700 transition duration-300">
          Boshlash
        </button>
      </Link>
    </div>
  );
}

export default Home;
