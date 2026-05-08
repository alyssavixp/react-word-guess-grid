
import React, { useState } from "react";
import "./App.css";

const WORD_LENGTH = 5;
const MAX_GUESSES = 5;
const WORDS = ["SPEND", "REACT", "STACK", "CLOUD", "DEBUG"];

function getRandomWord() {
  const randomIndex = Math.floor(Math.random() * WORDS.length);
  return WORDS[randomIndex];
}

function getLetterStatus(letter, index, secretWord) {
  if (!letter) return "empty";
  if (letter === secretWord[index]) return "correct";
  if (secretWord.includes(letter)) return "present";
  return "absent";
}

export default function App() {
  const [secretWord, setSecretWord] = useState(getRandomWord());
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [message, setMessage] = useState("");

  function handleInputChange(event) {
    const nextGuess = event.target.value.toUpperCase();

    if (nextGuess.length > WORD_LENGTH) return;

    setCurrentGuess(nextGuess);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (message) return;
    if (currentGuess.length !== WORD_LENGTH) {
      setMessage("Enter a 5-letter word.");
      return;
    }

    const nextGuesses = [...guesses, currentGuess];

    setGuesses(nextGuesses);
    setCurrentGuess("");

    if (currentGuess === secretWord) {
      setMessage("You won.");
      return;
    }

    if (nextGuesses.length === MAX_GUESSES) {
      setMessage(`You lost. The word was ${secretWord}.`);
    }
  }

  function handleReset() {
    setSecretWord(getRandomWord());
    setGuesses([]);
    setCurrentGuess("");
    setMessage("");
  }

  const rows = [];

  for (let rowIndex = 0; rowIndex < MAX_GUESSES; rowIndex++) {
    const guess = guesses[rowIndex] || "";
    const letters = [];

    for (let letterIndex = 0; letterIndex < WORD_LENGTH; letterIndex++) {
      const letter = guess[letterIndex] || "";
      const status = getLetterStatus(letter, letterIndex, secretWord);

      letters.push(
        <div key={letterIndex} className={`letter-cell ${status}`}>
          {letter}
        </div>
      );
    }

    rows.push(
      <div key={rowIndex} className="guess-row">
        {letters}
      </div>
    );
  }

  return (
    <main className="app">
      <section className="game-card">
        <h1>Word Guess Grid</h1>
        <p className="subtitle">Guess the 5-letter word in 5 tries.</p>

        <div className="grid">{rows}</div>

        <form onSubmit={handleSubmit} className="guess-form">
          <input
            value={currentGuess}
            onChange={handleInputChange}
            disabled={message.includes("won") || message.includes("lost")}
            maxLength={WORD_LENGTH}
            aria-label="Enter a 5-letter guess"
          />

          <button type="submit" disabled={message.includes("won") || message.includes("lost")}>
            Guess
          </button>
        </form>

        {message && <p className="message">{message}</p>}

        <button type="button" className="reset-button" onClick={handleReset}>
          New Game
        </button>
      </section>
    </main>
  );
}
