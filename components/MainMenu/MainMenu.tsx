import { MainContent } from "@/components/index";
import Link from "next/link";

const MainMenu = () => {
  return (
    <MainContent>
      <ul>
        <li>
          <Link href={"app/rosary"}>Rosary</Link>
        </li>
        <li>
          <Link href={"app/confession"}>Confession</Link>
        </li>
      </ul>
    </MainContent>
  );
};

export default MainMenu;
