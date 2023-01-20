import Link from "next/link";
import type { NextPage } from "next";
import { Button } from "@mui/material";

const Home: NextPage = () => {
  return (
    <>
      Learn how to pray the rosary
      <Button variant="contained">
        <Link href="/app">Pray Rosary</Link>
      </Button>
    </>
  );
};

export default Home;
