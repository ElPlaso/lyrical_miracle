import Search from "./components/search";
import "./styles/styles.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div>
      <h1 className={inter.className}>Become a Lyrical Miracle Individual</h1>
      <Search />
    </div>
  );
}
