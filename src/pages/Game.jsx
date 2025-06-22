// Game.jsx
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
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
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

  useEffect(() => {
    if (!isStarted || isGameOver) return;
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime, isStarted, isGameOver]);

  useEffect(() => {
    if (words.length === 0 && isStarted && !isGameOver) setIsGameOver(true);
  }, [words, isStarted, isGameOver]);

  const startGame = () => {
    const types = Object.keys(wordsData);
    const chosenWords = types.flatMap(type =>
      shuffle(wordsData[type]).slice(0, 3).map(word => ({ word, type }))
    );
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
    const wordText = e.dataTransfer.getData('word');
    const wordType = e.dataTransfer.getData('type');
    if (baskets[basketLabel].includes(wordText)) return;
    const isCorrect = basketLabel === wordType;
    if (isCorrect) {
      playCorrectSound();
      setScore(prev => ({ ...prev, correct: prev.correct + 1 }));
      setBaskets(prev => ({
        ...prev,
        [basketLabel]: [...prev[basketLabel], wordText],
      }));
      setWords(prev => prev.filter(w => w.word !== wordText));
    } else {
      playWrongSound();
      setScore(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
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
    <div className="min-h-screen bg-blue-100/85 p-4 md:p-8">
      <h1 className="text-3xl font-bold text-center mb-6">
        🍎 Mevalarni to‘g‘ri savatlarga ajrating
      </h1>

      {!isStarted ? (
        <div className="max-w-sm mx-auto bg-white p-6 rounded-xl shadow-lg text-center">
          <button
            onClick={startGame}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            O‘yinni boshlash
          </button>
        </div>
      ) : (
        <>
          <Scoreboard correct={score.correct} incorrect={score.incorrect} time={elapsed} />

          <div className="flex flex-col md:flex-row gap-4 mt-6">
            {['kim', 'nima', 'qayer'].map(label => (
              <Basket key={label} label={label} onDrop={e => handleDrop(label, e)}>
                {baskets[label].map(word => (
                  <WordItem key={word} word={word} isInBasket={true} />
                ))}
              </Basket>
            ))}
          </div>

          <div className="flex flex-wrap justify-center mt-6">
            {words.map(w => (
              <WordItem
                key={w.word}
                word={w.word}
                isInBasket={false}
                onDragStart={(e) => handleDragStart(e, w)}
              />
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
