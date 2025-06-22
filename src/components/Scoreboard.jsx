function Scoreboard({ correct, incorrect, time }) {
  return (
    <div className="bg-white/90 p-3 md:p-4 rounded-xl shadow-lg text-center mt-4 select-none text-sm md:text-base">
      <p>
        ✅ To‘g‘ri: {correct} &nbsp;&nbsp; ❌ Xato: {incorrect}
      </p>
      <p className="mt-1 text-gray-700">⏱️ Vaqt: {time} soniya</p>
    </div>
  );
}

export default Scoreboard;
