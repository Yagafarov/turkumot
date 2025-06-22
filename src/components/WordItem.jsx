import { motion } from 'framer-motion';

function WordItem({ word, onDragStart, isInBasket = false }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className={`px-3 md:px-5 py-1 md:py-2 m-2 rounded-full shadow-md font-semibold text-white text-sm md:text-lg select-none ${
          isInBasket
            ? 'bg-gradient-to-r from-emerald-400 to-lime-400 cursor-default'
            : 'bg-gradient-to-r from-pink-500 to-red-400 cursor-grab'
        }`}
        draggable={!isInBasket}
        onDragStart={(e) => !isInBasket && onDragStart(e, word)}
      >
        🍎 {word}
      </div>
    </motion.div>
  );
}

export default WordItem;
