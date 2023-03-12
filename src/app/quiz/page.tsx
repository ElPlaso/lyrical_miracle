import Link from "next/link";
import { SongLyricsQuiz } from "./components/song_lyrics_quiz";

async function getSongLyrics(id: String) {
  const response = await fetch(
    `https://genius-song-lyrics1.p.rapidapi.com/song/lyrics/?id=${id}&text_format=plain`,
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
}

export default async function QuizPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const songData = await getSongLyrics(searchParams?.songID as string);

  const songTitle = songData["lyrics"]["tracking_data"]["title"];

  const songArtist = songData["lyrics"]["tracking_data"]["primary_artist"];

  const songLyrics = songData["lyrics"]["lyrics"]["body"]["plain"];

  return (
    <div>
      <h1>Finish these lyrics for: </h1>
      <h2>{songTitle}</h2>
      <h3>{songArtist}</h3>
      <SongLyricsQuiz songLyrics={songLyrics} />
      <Link href="/">Home</Link>
    </div>
  );
}
