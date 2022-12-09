import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { firebase } from "@/init";
import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@mui/material";

const Home: NextPage = () => {
  useEffect(() => {
    firebase.start();
  }, []);
  return (
    <div className={styles.container}>
      Learn how to pray the rosary
      <Button variant="contained">
        <Link href="/app">Pray Rosary</Link>
      </Button>
    </div>
  );
};

export default Home;
