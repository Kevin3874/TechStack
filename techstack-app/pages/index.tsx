import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import Link from "next/link";
import Loader from "@/components/Loader";
import { toast } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>** Server is not up as it costs money, check github below on how to run **</title>
        <title>TechStack - Save time. Save money.</title>
        <meta
          name="description"
          content="Compare and buy the latest tech products from the top brands. Save time, save money."
        />
        <meta name="author" content="Kevin Zhang" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/TechStack.ico" />
      </Head>
      <main>
        <div className={styles.container}>
          <h1 className={styles.title}>TechStack</h1>
          <h1>** Server is not up as it costs money, check github below on how to run **</h1>
          <h2 className={styles.description}>
            Compare and buy the latest tech products from the top brands. Save
            money and time with TechStack.
          </h2>
          <br></br>
          <Link href='https://github.com/Kevin3874/TechStack'>
              <h2>GitHub &rarr;</h2>
              <h2>Check out the source code for this project + instructions on how to run!</h2>
          </Link>
          <h2 className={styles.description}>
            Try searching an item! Ex: {'"RTX 4070 Laptop"'} <br></br>
            Currently supports: BestBuy, Amazon, Newegg. <br></br>
          </h2>
        </div>
      </main>
    </>
  );
}
