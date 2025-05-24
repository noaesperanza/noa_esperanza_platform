export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <a href="https://noa-frontend-ivory.vercel.app">
        <img
          src="/avatar.jpg"
          alt="Avatar"
          className="w-36 h-36 rounded-full shadow-xl hover:scale-105 transition"
        />
      </a>
      <button className="mt-4 px-6 py-2 bg-rose-500 text-white rounded-full shadow-md hover:bg-rose-600 transition">
        Entrar pela Avaliação Inicial
      </button>
    </div>
  );
}
