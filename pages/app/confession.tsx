import type { NextPage } from "next";
import { ConfessionGuide } from "@/components";

const Confession: NextPage = () => {
  return (
    <>
      <h1>Confession</h1>
      <p>Learn how confess your sins.</p>
      <ConfessionGuide />
    </>
  );
};

export default Confession;
