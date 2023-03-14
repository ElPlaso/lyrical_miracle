"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import "../styles/styles.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

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

  // store whether data is loading
  const [loading, setLoading] = useState(false);

  // handler to update the input
  // this is typescript
  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  // set the songs when the input changes
  useEffect(() => {
    // if the input is empty, return
    if (!input) {
      setSongs([]);
      return;
    }

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
    <>
      <div>
        <label className={inter.className}>Search</label>
        <input
          type="text"
          // on change, call the handle input function
          onChange={handleInput}
        />
      </div>
      <div>
        {loading && <p className={inter.className}>Loading...</p>}
        {songs && (
          <div>
            {songs.map((song: any) => (
              <div key={song.result.id} className="card">
                <Link
                  href={{
                    pathname: "/quiz",
                    query: { songID: song.result.id },
                  }}
                >
                  <span>
                    <h2 className={inter.className}>
                      {song.result.full_title}
                    </h2>
                  </span>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
