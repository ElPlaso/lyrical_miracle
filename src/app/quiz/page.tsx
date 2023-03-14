import Link from "next/link";
import { SongLyricsQuiz } from "./components/song_lyrics_quiz";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

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

  if (songData["lyrics"]) {
    const songTitle = songData["lyrics"]["tracking_data"]["title"];

    const songArtist = songData["lyrics"]["tracking_data"]["primary_artist"];

    const songLyrics = songData["lyrics"]["lyrics"]["body"]["plain"];

    return (
      <>
        <div>
          <h1 className={inter.className}>Finish these lyrics for: </h1>

          <h2 className={inter.className}>
            {songTitle} by {songArtist}
          </h2>

          <SongLyricsQuiz songLyrics={songLyrics} />
        </div>

        <Link style={{ textDecoration: "underline" }} href="/">
          <h3 className={inter.className}>Home</h3>
        </Link>
      </>
    );
  } else {
    return <div className={inter.className}>Page not found</div>;
  }
}
