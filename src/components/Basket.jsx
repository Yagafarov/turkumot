function Basket({ label, onDrop, children }) {
  const handleDrop = (e) => {
    e.preventDefault();
    onDrop(e);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="flex-1 relative bg-yellow-100-80 rounded-3xl p-6 mx-2 min-h-[200px] flex flex-col items-center shadow-lg
                 border-[8px] border-yellow-300
                 overflow-hidden"
      
    >
      {/* Savat chetida bog'lama tayoqlari */}
      <div className="absolute top-0 left-0 w-full h-6 bg-yellow-400 rounded-t-3xl border-b-4 border-yellow-600 shadow-inner"></div>
      <div className="absolute bottom-0 left-0 w-full h-6 bg-yellow-400 rounded-b-3xl border-t-4 border-yellow-600 shadow-inner"></div>

      <h2 className="relative z-10 text-2xl font-extrabold mb-4 text-yellow-900 select-none drop-shadow-lg">
        🧺 {label}
      </h2>

      <div className="relative z-10 flex flex-wrap justify-center gap-3 max-w-full overflow-auto">
        {children}
      </div>
    </div>
  );
}

export default Basket;
