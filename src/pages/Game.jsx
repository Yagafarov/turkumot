import { useEffect, useState } from 'react';
import Basket from '../components/Basket';
import WordItem from '../components/WordItem';
import Scoreboard from '../components/Scoreboard';
import wordsData from '../data/words.json';
import { playCorrectSound, playWrongSound } from '../utils/sound';

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function Modal({ correct, incorrect, time, onRestart }) {
  return (
    <div className="fixed inset-0 bg-black/85  bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-sm w-full text-center shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-green-600">🎉 Tabrigingiz bilan!</h2>
        <p className="mb-2 text-lg">O'yin tugadi.</p>
        <p className="mb-1">✅ To‘g‘ri javoblar: {correct}</p>
        <p className="mb-1">❌ Noto‘g‘ri javoblar: {incorrect}</p>
        <p className="mb-4">⏱ O‘yin davomiyligi: {time} soniya</p>
        <button
          onClick={onRestart}
          className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Qayta boshlash
        </button>
      </div>
    </div>
  );
}

const allWords = Object.entries(wordsData).flatMap(([type, list]) =>
  list.map((word) => ({ word, type }))
);

function Game() {
  const [words, setWords] = useState([]);
  const [baskets, setBaskets] = useState({ kim: [], nima: [], qayer: [] });
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [startTime, setStartTime] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [selectedCount, setSelectedCount] = useState(10); // default 10 ta so'z

  // Vaqtni hisoblash
  useEffect(() => {
    if (isGameOver || !isStarted) return;

    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, isGameOver, isStarted]);

  // O'yin tugash sharti: words bo'sh bo'lsa
  useEffect(() => {
    if (words.length === 0 && !isGameOver && isStarted) {
      setIsGameOver(true);
    }
  }, [words, isGameOver, isStarted]);

  // O'yinni boshlash
  const startGame = () => {
    // 1. So‘zlarni har bir toifadan aralash qilib tanlaymiz
    // So‘zlar umumiy soni selectedCount bo‘lishi kerak
    // Har bir toifadan taxminan teng ta so‘z olamiz
    const types = Object.keys(wordsData);
    const perTypeCount = Math.floor(selectedCount / types.length);
    let chosenWords = [];

    types.forEach((type) => {
      const pool = shuffle(wordsData[type]);
      chosenWords = chosenWords.concat(
        pool.slice(0, perTypeCount).map((word) => ({ word, type }))
      );
    });

    // Agar selectedCount butun bo‘linmasa, qolgan so‘zlar random qilib qo‘shilsin
    const diff = selectedCount - chosenWords.length;
    if (diff > 0) {
      const remainingPool = shuffle(allWords).filter(
        (w) => !chosenWords.some((cw) => cw.word === w.word)
      );
      chosenWords = chosenWords.concat(remainingPool.slice(0, diff));
    }

    setWords(shuffle(chosenWords));
    setBaskets({ kim: [], nima: [], qayer: [] });
    setScore({ correct: 0, incorrect: 0 });
    setElapsed(0);
    setStartTime(Date.now());
    setIsGameOver(false);
    setIsStarted(true);
  };

  const handleDragStart = (e, wordObj) => {
    e.dataTransfer.setData('word', wordObj.word);
    e.dataTransfer.setData('type', wordObj.type);
  };

  const handleDrop = (basketLabel, e) => {
    e.preventDefault();

    if (isGameOver || !isStarted) return;

    const wordText = e.dataTransfer.getData('word');
    const wordType = e.dataTransfer.getData('type');

    if (baskets[basketLabel.toLowerCase()].includes(wordText)) {
      return;
    }

    const isCorrect = wordType === basketLabel.toLowerCase();

    if (isCorrect) {
      playCorrectSound();
      setScore((prev) => ({ ...prev, correct: prev.correct + 1 }));
      setBaskets((prev) => ({
        ...prev,
        [basketLabel.toLowerCase()]: [...prev[basketLabel.toLowerCase()], wordText],
      }));
      setWords((prev) => prev.filter((w) => w.word !== wordText));
    } else {
      playWrongSound();
      setScore((prev) => ({ ...prev, incorrect: prev.incorrect + 1 }));
    }
  };

  const handleRestart = () => {
    setIsStarted(false);
    setWords([]);
    setBaskets({ kim: [], nima: [], qayer: [] });
    setScore({ correct: 0, incorrect: 0 });
    setElapsed(0);
    setIsGameOver(false);
  };

  return (
    <div className="min-h-screen bg-blue-50/85 bg-opacity-80 p-4 md:p-8 relative flex flex-col">
      <h1 className="text-3xl text-center font-bold mb-4 md:mb-8">
        🍉 So‘zlarni to‘g‘ri savatlarga ajrating
      </h1>

      {!isStarted ? (
        <div className="max-w-sm mx-auto bg-white p-6 rounded-xl shadow-lg">
          <label className="block mb-4 font-semibold text-gray-700">
            O‘yin uchun so‘zlar sonini tanlang:
            <select
              value={selectedCount}
              onChange={(e) => setSelectedCount(parseInt(e.target.value))}
              className="mt-2 block w-full border border-gray-300 rounded-md p-2"
            >
              {[5, 10, 15, 20, 25, 30].map((num) => (
                <option key={num} value={num}>
                  {num} ta so‘z
                </option>
              ))}
            </select>
          </label>
          <button
            onClick={startGame}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            O‘ynashni boshlash
          </button>
        </div>
      ) : (
        <>
          <Scoreboard correct={score.correct} incorrect={score.incorrect} time={elapsed} />

          <div className="flex flex-col md:flex-row gap-4 mt-4 flex-grow">
            <Basket label="Kim?" onDrop={(e) => handleDrop('kim', e)}>
              {baskets.kim.map((w) => (
                <WordItem key={w} word={w} isInBasket />
              ))}
            </Basket>
            <Basket label="Nima?" onDrop={(e) => handleDrop('nima', e)}>
              {baskets.nima.map((w) => (
                <WordItem key={w} word={w} isInBasket />
              ))}
            </Basket>
            <Basket label="Qayer?" onDrop={(e) => handleDrop('qayer', e)}>
              {baskets.qayer.map((w) => (
                <WordItem key={w} word={w} isInBasket />
              ))}
            </Basket>
          </div>

          <div className="flex flex-wrap justify-center mt-6">
            {words.map((w) => (
              <WordItem key={w.word} word={w.word} onDragStart={(e) => handleDragStart(e, w)} />
            ))}
          </div>
        </>
      )}

      {isGameOver && (
        <Modal
          correct={score.correct}
          incorrect={score.incorrect}
          time={elapsed}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}

export default Game;
