import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/Search.module.css";

export default function SearchResults() {
  const router = useRouter();
  const { searchitem } = router.query;
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (searchitem) {
      const query = (searchitem as string).split(" ").join("+");

      fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/scrape?q=${query}`)
        .then((response) => response.json())
        .then((data) => {
          setResults(data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data: ", error);
          setIsLoading(false);
        });
    }
  }, [searchitem]);

  const renderProducts = (data: any, sellerName: string) => {
    return data.map((item: any, index: number) => (
      <div key={index} className={styles.product}>
        <a href={item.productLink} target="_blank" rel="noopener noreferrer">
          <img
            src={item.productImage}
            alt={item.productName}
            className={styles.productImage}
          />
          <h3>{item.productName}</h3>
        </a>
        <p>Price: {item.productPrice}</p>
        <p>Seller: {sellerName}</p>
      </div>
    ));
  };

  return (
    <div>
      <h1>Search Results for: {searchitem}</h1>
      <div className={styles.resultsContainer}>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          Object.entries(results || {}).map(([seller, sellerData]) => {
            return (
              <React.Fragment key={seller}>
                {renderProducts(sellerData, seller.replace("Data", ""))}
              </React.Fragment>
            );
          })
        )}
      </div>
    </div>
  );
}
