import { motion } from 'framer-motion';
import orange from '../assets/orange.png';

function WordItem({ word, onDragStart, isInBasket = false }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className={`w-24 h-24 md:w-28 md:h-28 m-2 rounded-xl font-bold text-white text-center flex items-center justify-center text-sm md:text-lg select-none ${
          isInBasket ? 'cursor-default' : 'cursor-grab'
        }`}
        style={{
          backgroundImage: `url(${orange})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        draggable={!isInBasket}
        onDragStart={(e) => !isInBasket && onDragStart(e, word)}
      >
      {word}
      </div>
    </motion.div>
  );
}

export default WordItem;
