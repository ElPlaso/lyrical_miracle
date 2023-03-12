"use client";

// imports
import { useState, useEffect } from "react";

// displays portions of a song's lyrics and asks the user to fill in the missing words
export const SongLyricsQuiz = (props: any) => {
  const [input, setInput] = useState("");
  const [songLyricsPortion, setSongLyricsPortion] = useState("");
  const [visibleSongLyrics, setVisibleSongLyrics] = useState("");

  // split the song lyrics into a random portion starting from a random index when the component is mounted
  useEffect(() => {
    setSongLyricsPortion("");

    // split the song lyrics into an array of words
    const songLyricsArray = props.songLyrics.split(" ");
    // get a random index to start from
    const randomIndex = Math.floor(
      Math.random() * (songLyricsArray.length - 20)
    );

    // add words to the song lyrics portion until a word contains a newline character
    let songLyricsPortion = [];
    for (let i = randomIndex; i < songLyricsArray.length; i++) {
      if (songLyricsArray[i].includes("\n")) {
        if (songLyricsPortion.length >= 5) {
          // add the word before the newline character to the song lyrics portion
          songLyricsPortion.push(
            songLyricsArray[i].substring(0, songLyricsArray[i].indexOf("\n"))
          );
          break;
        } else {
          // if the song lyrics portion is too short,
          // remove the new line character and add both words to the song lyrics portion
          songLyricsArray[i] = songLyricsArray[i].replace("\n", " ");
        }
      }
      songLyricsPortion.push(songLyricsArray[i]);
    }

    // make a copy of the song lyrics portion
    const visibleSongLyricsPortion = [...songLyricsPortion];
    // replace every character of the last 2 words of the song lyrics portion with an underscore
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
            "_"
          );
        }
      }
    }

    // set the song lyrics portion as a string
    setSongLyricsPortion(songLyricsPortion.join(" "));

    // set the visible song lyrics portion as a string
    setVisibleSongLyrics(visibleSongLyricsPortion.join(" "));

    console.log(songLyricsPortion);
  }, [props.songLyrics]);

  // handle the user's answer
  const handleAnswer = (answer: string) => {
    // split the song lyrics portion into an array of words
    const songLyricsPortionArray = songLyricsPortion.split(" ");
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
      setVisibleSongLyrics(songLyricsPortion);
    }
  };

  return (
    <div>
      <p>...{visibleSongLyrics}</p>
      <input
        type="text"
        value={input}
        onChange={(event) => {
          setInput(event.target.value);
        }}
      />
      <button onClick={() => handleAnswer(input)}>Submit</button>
    </div>
  );
};
