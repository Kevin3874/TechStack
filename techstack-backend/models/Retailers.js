function GetRetailers(queryWords) {
  // Add more GPU retailers
  // Target, Walmart, ?
  const queryURL = queryWords.join('+');

  // Add to end
  let amazonURL = "https://www.amazon.com/s?k=" + queryURL;
  let bestbuyURL = "https://www.bestbuy.com/site/searchpage.jsp?st=" + queryURL;
  let neweggURL = "https://www.newegg.com/p/pl?d=" + queryURL;
  let targetURL = "https://www.target.com/s?searchTerm=" + queryURL;

  return [
    amazonURL,
    bestbuyURL,
    neweggURL,
    targetURL
  ];
}

module.exports = GetRetailers;