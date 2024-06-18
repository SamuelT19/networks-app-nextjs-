export const fetchMovies = async () => {
  try {
    const response = await fetch("movies.json");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
};
