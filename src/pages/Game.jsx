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
      <div className="bg-white/85 rounded-xl p-6 max-w-sm w-full text-center shadow-lg">
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

function isMobileDevice() {
  return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
}

function Game() {
  const [wordCount, setWordCount] = useState(9);
  const [words, setWords] = useState([]);
  const [baskets, setBaskets] = useState({ kim: [], nima: [], qayer: [] });
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [startTime, setStartTime] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [selectedWord, setSelectedWord] = useState(null);
  const [selectedBasket, setSelectedBasket] = useState(null);
  const mobile = isMobileDevice();

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
    const perType = Math.ceil(wordCount / types.length);

    const chosen = types.flatMap(type =>
      shuffle(wordsData[type]).slice(0, perType).map(word => ({ word, type }))
    ).slice(0, wordCount);

    setWords(shuffle(chosen));
    setBaskets({ kim: [], nima: [], qayer: [] });
    setScore({ correct: 0, incorrect: 0 });
    setElapsed(0);
    setStartTime(Date.now());
    setIsGameOver(false);
    setIsStarted(true);
    setSelectedWord(null);
    setSelectedBasket(null);
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
      setBaskets(prev => ({ ...prev, [basketLabel]: [...prev[basketLabel], wordText] }));
      setWords(prev => prev.filter(w => w.word !== wordText));
    } else {
      playWrongSound();
      setScore(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
    }
  };

  const handleAddToBasketMobile = () => {
    if (!selectedWord || !selectedBasket) return;
    if (baskets[selectedBasket].includes(selectedWord.word)) return;
    const isCorrect = selectedWord.type === selectedBasket;
    if (isCorrect) {
      playCorrectSound();
      setScore(prev => ({ ...prev, correct: prev.correct + 1 }));
      setBaskets(prev => ({ ...prev, [selectedBasket]: [...prev[selectedBasket], selectedWord.word] }));
      setWords(prev => prev.filter(w => w.word !== selectedWord.word));
    } else {
      playWrongSound();
      setScore(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
    }
    setSelectedWord(null);
    setSelectedBasket(null);
  };

  const handleRestart = () => {
    setIsStarted(false);
    setWords([]);
    setBaskets({ kim: [], nima: [], qayer: [] });
    setScore({ correct: 0, incorrect: 0 });
    setElapsed(0);
    setIsGameOver(false);
    setSelectedWord(null);
    setSelectedBasket(null);
  };

  return (
    <div className="min-h-screen bg-blue-100/50 p-4 md:p-8">
      <h1 className="text-3xl font-bold text-center mb-6">
        🍎 Mevalarni to‘g‘ri savatlarga ajrating
      </h1>

      {!isStarted ? (
        <div className="max-w-sm mx-auto bg-white/85 p-6 rounded-xl shadow-lg text-center space-y-4">
          <div>
            <label htmlFor="wordCount" className="block mb-2 font-semibold">🥝 Mevalar sonini kiriting:</label>
            <input
              id="wordCount"
              type="number"
              min={3}
              max={30}
              value={wordCount}
              onChange={(e) => setWordCount(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
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
              <div
                key={label}
                onClick={() => mobile && selectedWord && setSelectedBasket(label)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(label, e)}
                className={`cursor-pointer border-4 border-dashed rounded-2xl p-4 flex-1 flex flex-col items-center shadow-xl select-none
                  ${selectedBasket === label ? 'border-green-500 bg-green-100' : 'border-gray-600 bg-white/50'}`}
              >
                <h2 className="text-xl md:text-2xl font-bold mb-3 text-gray-800">
                  🧺 {label.charAt(0).toUpperCase() + label.slice(1)}?
                </h2>
                <div className="flex flex-wrap justify-center min-h-[150px] w-full">
                  {baskets[label].map((w) => (
                    <WordItem key={w} word={w} isInBasket />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-center mt-6">
            {words.map((w) => (
              <div
                key={w.word}
                onClick={() => mobile && setSelectedWord(w)}
                draggable={!mobile}
                onDragStart={(e) => handleDragStart(e, w)}
                className={`cursor-pointer ${selectedWord?.word === w.word ? 'ring-4 ring-green-400 rounded-lg' : ''}`}
              >
                <WordItem word={w.word} isInBasket={false} />
              </div>
            ))}
          </div>

          {mobile && selectedWord && (
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white/50 rounded-xl shadow-lg p-4 flex flex-col items-center gap-3 max-w-sm w-full z-50">
              <div className="mb-2 font-semibold">Tanlangan meva: {selectedWord.word}</div>
              <div className="flex gap-4">
                <button
                  onClick={handleAddToBasketMobile}
                  disabled={!selectedBasket}
                  className={`px-4 py-2 rounded text-white transition ${
                    selectedBasket ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  {selectedBasket ? `Savatga qo'shish (${selectedBasket})` : 'Savatni tanlang'}
                </button>
                <button
                  onClick={() => {
                    setSelectedWord(null);
                    setSelectedBasket(null);
                  }}
                  className="px-4 py-2 bg-red-500 rounded text-white hover:bg-red-600 transition"
                >
                  Bekor qilish
                </button>
              </div>
            </div>
          )}
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
