"use client";

import React, { useState, useEffect } from "react";

// function to get song lyrics from the api
const getSongLyrics = async (songId: string) => {
  const response = await fetch(
    `https://genius-song-lyrics1.p.rapidapi.com/song/lyrics/?id=${songId}&text_format=plain`,
    {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPID_API_KEY as string,

        "X-RapidAPI-Host": "genius-song-lyrics1.p.rapidapi.com",
      },
    }
  );
  const data = await response.json();
  return data;
};

// export default function called search
export default function Search() {
  // store the current input
  const [input, setInput] = useState("");

  // store a list of songs
  const [songs, setSongs] = useState([]);

  // store the current song lyrics
  const [songLyrics, setSongLyrics] = useState("");

  // store whether data is loading
  const [loading, setLoading] = useState(false);

  // handler to update the input
  // this is typescript
  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  // a handler for when get lyrics is clicked
  const handleGetLyrics = (songId: string) => {
    // set the loading state to true
    setLoading(true);
    // get the song lyrics
    getSongLyrics(songId)
      .then((data) => {
        // set the song lyrics to the data
        setSongLyrics(data.lyrics.lyrics.body.plain);
      })
      .then(() => {
        // set the loading state to false
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // set the songs when the input changes
  useEffect(() => {
    // if the input is empty, return
    if (!input) return;
    // get the song data, converting response to json

    // set cancel variable to false
    let cancel = false;

    // set the loading state to true
    setLoading(true);

    // fetch the song data
    // we need the fetch here because we need to return a function to cancel the request
    fetch(
      `https://genius-song-lyrics1.p.rapidapi.com/search/?q=${input}&per_page=3&page=1`,
      {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPID_API_KEY as string,
          "X-RapidAPI-Host": "genius-song-lyrics1.p.rapidapi.com",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        // if the request has been cancelled, return
        if (cancel) return;
        // set the songs to the data if data isn't null
        if (data) setSongs(data.hits);
        // log the data
        console.log(data.hits);
      })
      .then(() => {
        // set the loading state to false
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });

    // return a function to cancel the request
    return () => {
      cancel = true;
    };
  }, [input]);

  // return the input and button
  return (
    <div>
      <input
        type="text"
        // on change, call the handle input function
        onChange={handleInput}
      />
      <button>Search</button>
      {loading && <p>Loading...</p>}
      {songs.length > 0 && (
        <div>
          {songs.map((song: any) => (
            <div key={song.result.id}>
              <h3>{song.result.full_title}</h3>
              <button
                // on click, call the handle get lyrics function
                onClick={() => handleGetLyrics(song.result.id)}
              >
                Get Lyrics
              </button>
            </div>
          ))}
        </div>
      )}
      {songLyrics && <p>{songLyrics}</p>}
    </div>
  );
}
