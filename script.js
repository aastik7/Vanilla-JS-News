const apikey = "f84cc82620c74a418f3556d0bbab24f9";
const blogContainer = document.getElementById("blog-container");

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

      return data.articles;
    } catch (error) {
      console.error("Error fetching the News:", error);
      return [];
    }
  }

  function displayBlogs(articles) {
    blogContainer.innerHTML = ""; // Clear the container
    articles.forEach((article) => {
      const blogCard = document.createElement("div");
      blogCard.classList.add("blog-card");

      const img = document.createElement("img");
      img.src = article.urlToImage || "https://via.placeholder.com/600x400";
      img.alt = article.title || "News image";

      const title = document.createElement("h2");
      title.textContent = article.title || "No Title";

      const description = document.createElement("p");
      description.textContent =
        article.description || "No description available.";

      blogCard.appendChild(img);
      blogCard.appendChild(title);
      blogCard.appendChild(description);
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
