import { auth, googleAuthProvider } from '../lib/firebase';
import Head from 'next/head';
import { useContext } from 'react';
import { UserContext } from '../lib/context';
import { signInWithPopup, signInAnonymously, signOut } from 'firebase/auth';


export default function Enter(props: any) {

    const { user, username } = useContext(UserContext)

    // 1. user signed out <SignInButton />
    // 2. user signed in, but missing username <UsernameForm />
    // 3. user signed in, has username <SignOutButton />
    return (
        <>
            <Head>
                <title>TechStack - Sign In</title>
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
                {user ? 
                    !username ? <SignInButton /> : <SignOutButton /> 
                    : <UsernameForm />
                    
                }
            </main>
        </>
    )
}

// Sign in with Google button
function SignInButton() {
    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleAuthProvider);
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <button className="btn-google" onClick={signInWithGoogle}>
        <img src={'/google-logo.png'} /> Sign in with Google
        </button>
    );
}
  
// Sign out button
function SignOutButton() {
    return <button onClick={() => auth.signOut()}>Sign Out</button>;
}
  
function UsernameForm() {
    

    return (
        <div>
            Username Form
        </div>
    );
}