import { useRouter } from 'next/router';

export default function SearchResults() {
  const router = useRouter();
  const { searchitem } = router.query;

  return (
    <div>
      <h1>Search Results for: {searchitem}</h1>
      {/* Display search results here */}
    </div>
  );
}