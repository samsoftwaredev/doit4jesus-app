import type { NextPage } from "next";
import Link from "next/link";

const App: NextPage = () => {
  return (
    <>
      <h1>Welcome</h1>
      <ul>
        <li>
          <Link href={"app/rosary"}>Rosary</Link>
        </li>
        <li>
          <Link href={"app/confession"}>Confession</Link>
        </li>
      </ul>
    </>
  );
};

export default App;
