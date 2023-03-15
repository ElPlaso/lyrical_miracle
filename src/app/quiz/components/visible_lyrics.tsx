import "@/app/styles/styles.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function VisibleLyrics(props: any) {
  const visibleSongLyrics = props.visibleSongLyrics;

  return (
    <p className="typed">
      <span className={inter.className}>. . . </span>
      {visibleSongLyrics.map((word: string, index: number) => {
        return (
          <>
            <span
              key={index}
              className={inter.className}
              style={
                index >= visibleSongLyrics.length - 2
                  ? {
                      fontWeight: "bold",
                    }
                  : {}
              }
            >
              {word.toUpperCase()}
            </span>
            {"   "}
          </>
        );
      })}
    </p>
  );
}
