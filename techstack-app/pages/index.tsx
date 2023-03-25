import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { Main } from 'next/document'
import Link from 'next/link'
import Loader from '@/components/Loader'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>TechStack - Compare. Buy. Save.</title>
        <meta
          name="description"
          content="Compare and buy the latest tech products from the top brands. Save money and time with TechStack."
        />
        <meta 
          name="author" 
          content="Kevin Zhang" 
        />
        <meta 
          name="viewport" 
          content="width=device-width, initial-scale=1.0" />
        <link 
          rel="icon" 
          href="/TechStack.ico" 
        />
      </Head>

      <main>
        <div className={styles.container}>
          <h1 className={styles.title}>TechStack</h1>
          <p className={styles.description}>
            Compare and buy the latest tech products from the top brands. Save
            money and time with TechStack.
          </p>
        </div>
        <div>
          <Link href={{
                pathname: '/[searchitem]',
                query: { searchitem: 'laptops' }
              }}>
            Laptops
          </Link>
        </div>
      </main>
  
    </>
  )
}
