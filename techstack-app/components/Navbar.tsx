import Link from 'next/link';
import Image from 'next/image';
import { useContext } from 'react';
import { UserContext } from '../lib/context';

// Top navbar
export default function Navbar() {
  
  const { user, username } = useContext(UserContext)

  return (
    <>
      <nav className="navbar">
        <ul>
          <li>
            <Link href="/">
              <Image src={'/TechStack.png'} alt="logo" width={250} height={250}/>
            </Link>
          </li>

          {/* user is signed-in and has username */}
          {username && (
            <>
              <li className="push-left">
                <Link href="/admin">
                  <button className="btn-blue">Write Posts</button>
                </Link>
              </li>
              <li>
                <Link href={`/${username}`}>
                  <Image src={user?.photoURL} alt="image"/>
                </Link>
              </li>
            </>
          )}

          {/* user is not signed OR has not created username */}
          {!username && (
            <li>
              <Link href="/enter">
                <button className="btn-blue">Log in</button>
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </>
  );
}