import Image from "next/image";
import { Inter } from "next/font/google";

//imports
import Search from "./components/search";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main>
      <div>
        <Search />
      </div>
    </main>
  );
}
