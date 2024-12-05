import config from "./config.js";
const apikey = config.API_KEY;
const blogContainer = document.getElementById("blog-container");
const searchField = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");

if (!blogContainer) {
  console.error("Blog container element not found");
} else {
  async function fetchRandomNews() {
    try {
      const cacheBuster = `&_=${new Date().getTime()}`; // Cache-busting parameter
      const apiUrl = `https://newsapi.org/v2/top-headlines?country=us&category=business&pageSize=10&apiKey=${apikey}${cacheBuster}`;

      const response = await fetch(apiUrl, { cache: "no-store" });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.articles) {
        console.error("No articles found in the API response");
        return [];
      }

      // Return the articles as-is, without shuffling or modifying the order
      return data.articles;
    } catch (error) {
      console.error("Error fetching the News:", error);
      return [];
    }
  }

  searchButton?.addEventListener("click", async () => {
    const query = searchField.value.trim();
    if (query !== "") {
      try {
        const articles = await fetchNewsQuery(query);
      } catch (error) {
        console.log(error);
      }
    }
  });

  function fetchNewsQuery() {
    // WRITE THIS QUERY SOON
  }

  function displayBlogs(articles) {
    blogContainer.innerHTML = ""; // Clear the container

    articles.forEach((article) => {
      const blogCard = document.createElement("div");
      blogCard.classList.add("blog-card");

      const title = document.createElement("h2");
      title.textContent = article.title || "No Title";

      const description = document.createElement("p");
      const maxLength = 30;
      const descriptionText =
        article.description || "No description available.";
      if (descriptionText.length > maxLength) {
        description.textContent =
          descriptionText.substring(0, maxLength) + "...";
      } else {
        description.textContent = descriptionText;
      }

      let img;
      if (article.urlToImage) {
        img = document.createElement("img");
        img.src = article.urlToImage;
        img.alt = article.title || "News image";
      } else {
        img = document.createElement("img");
        img.src = "https://placehold.co/600x400"; // Replace with a placeholder image
        img.alt = article.title || "News placeholder image";
      }

      blogCard.appendChild(img);
      blogCard.appendChild(title);
      blogCard.appendChild(description);
      blogCard.addEventListener("click", () => {
        window.open(article.url, "_blank");
      });

      blogContainer.appendChild(blogCard);
    });
  }

  (async () => {
    try {
      const articles = await fetchRandomNews();
      if (articles.length > 0) {
        displayBlogs(articles);
      } else {
        blogContainer.innerHTML =
          "<p>No articles found. Please try again later.</p>";
      }
    } catch (error) {
      console.log("Error fetching articles:", error);
    }
  })();
}
