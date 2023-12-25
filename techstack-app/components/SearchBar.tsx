import { useState } from "react";

export default function SearchBar() {
  const [query, setQuery] = useState("");

  const handleSearch = (event: any) => {
    event.preventDefault();
    console.log(query);
  };

  return (
    <>
      <h1>Search</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for products..."
        />
        <button type="submit">Search</button>
      </form>
    </>
  );
}
