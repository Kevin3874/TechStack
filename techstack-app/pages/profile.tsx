import Head from 'next/head'

export default function Page({ }) {
    return (
    <>
        <Head>
            <title>TechStack - Your Profile</title>
            <meta
            name="description"
            content="Compare and buy the latest tech products from the top brands. Save time, save money."
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
            <h1>Profile</h1>
        </main>
    </>    
    )
}