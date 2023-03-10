"use client";

// imports
import { useState, useEffect } from "react";
import "@/app/styles/styles.css";
import { Inter } from "next/font/google";
import VisibleLyrics from "./visible_lyrics";

const inter = Inter({ subsets: ["latin"] });

// displays portions of a song's lyrics and asks the user to fill in the missing words
export const SongLyricsQuiz = (props: any) => {
  const songLyricsArray: string[] = props.songLyrics.split(" ");
  const [input, setInput] = useState("");
  const [songLyricsPortion, setSongLyricsPortion] = useState([] as string[]);
  const [visibleSongLyrics, setVisibleSongLyrics] = useState([] as string[]);

  const getRandomLyrics = (lyrics: string[]) => {
    // get a random index to start from
    const randomIndex = Math.floor(
      Math.random() * (songLyricsArray.length - 20)
    );

    // add words to the song lyrics portion until a word contains a newline character
    let songLyrics = [] as string[];
    for (let i = randomIndex; i < lyrics.length; i++) {
      if (lyrics[i].includes("\n")) {
        if (songLyrics.length >= 5) {
          // add the word before the newline character to the song lyrics portion
          songLyrics.push(lyrics[i].substring(0, lyrics[i].indexOf("\n")));
          break;
        } else {
          // if the song lyrics portion is too short,
          // remove the new line character and add both words to the song lyrics portion
          lyrics[i] = lyrics[i].replace("\n", " ");
        }
      }
      songLyrics.push(lyrics[i]);
    }

    // make a copy of the song lyrics portion
    let visibleSongLyricsPortion = songLyrics.slice();

    // replace every character of the last 2 words of the song lyrics portion with an asterisk
    // except if the character is a punctuation mark
    for (
      let i = visibleSongLyricsPortion.length - 2;
      i < visibleSongLyricsPortion.length;
      i++
    ) {
      for (let j = 0; j < visibleSongLyricsPortion[i].length; j++) {
        if (
          !visibleSongLyricsPortion[i][j].match(
            /[.,\/#!?'"$%\^&\*;:{}=\-_`~()]/g
          )
        ) {
          visibleSongLyricsPortion[i] = visibleSongLyricsPortion[i].replace(
            visibleSongLyricsPortion[i][j],
            "*"
          );
        }
      }
    }

    // set the song lyrics portion as a string
    setSongLyricsPortion(songLyrics);

    // set the visible song lyrics portion as a string
    setVisibleSongLyrics(visibleSongLyricsPortion);
  };

  // split the song lyrics into a random portion starting from a random index when the component is mounted
  useEffect(() => {
    const loadInitialLyrics = () => {
      getRandomLyrics(songLyricsArray);
    };
    loadInitialLyrics();
  }, []);

  // handle the user's answer
  const handleAnswer = (lyrics: string[], answer: string) => {
    // split the song lyrics portion into an array of words
    let songLyricsPortionArray = lyrics;
    // get the last 2 words of the song lyrics portion
    const lastTwoWordsArray = songLyricsPortionArray.slice(
      songLyricsPortionArray.length - 2,
      songLyricsPortionArray.length
    );

    // join the last 2 words of the song lyrics portion into a string
    let lastTwoWords = lastTwoWordsArray.join(" ");

    // make answer and last two words case insensitive
    answer = answer.toLowerCase();
    lastTwoWords = lastTwoWords.toLowerCase();

    // make answer and last two words punctuation and space insensitive
    answer = answer.replace(/[.,\/#!?'"$%\^&\*;:{}=\-_`~()]/g, "");
    lastTwoWords = lastTwoWords.replace(/[.,\/#!?'"$%\^&\*;:{}=\-_`~()]/g, "");

    // make answer and last two words accented character insensitive
    answer = answer.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    lastTwoWords = lastTwoWords
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    // check if the user's answer matches the last 2 words of the song lyrics portion
    if (answer === lastTwoWords) {
      // if the user's answer is correct, set the visible song lyrics portion to the song lyrics portion
      setVisibleSongLyrics(lyrics);
    }
  };

  const showAnswer = () => {
    setVisibleSongLyrics(songLyricsPortion);
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button
          role="button"
          className="button"
          onClick={() => getRandomLyrics(songLyricsArray)}
        >
          New lyrics
        </button>
        <button role="button" className="button" onClick={showAnswer}>
          View answer
        </button>
      </div>

      {/* set key to remount on songLyricsPortion change 
        This will cause reanimation of the visible lyrics
        but will not cause reanimation when lyrics are revealed
      */}
      <VisibleLyrics
        key={songLyricsPortion}
        visibleSongLyrics={visibleSongLyrics}
      />

      <input
        type="text"
        value={input}
        onChange={(event) => {
          setInput(event.target.value);
        }}
      />

      <div>
        <button
          role="button"
          className="button"
          onClick={() => handleAnswer(songLyricsPortion, input)}
        >
          Submit
        </button>
      </div>
    </>
  );
};
