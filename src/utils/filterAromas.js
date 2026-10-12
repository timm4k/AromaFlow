export function filterAromas(aromas, searchQuery, category = "All") {
  const query = searchQuery.trim().toLowerCase();
  return aromas.filter((aroma) => {
    const matchesCategory = category === "All" || aroma.category === category;
    const matchesQuery =
      !query ||
      aroma.title?.toLowerCase().includes(query) ||
      aroma.category?.toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });
}
