async function geocode(location) {
  const apiKey = process.env.GEOAPIFY_API_KEY;

  console.log("API KEY:", apiKey);

  const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
    location
  )}&apiKey=${apiKey}`;

  console.log("URL:", url);

  const res = await fetch(url);
  const data = await res.json();

  console.log("Geoapify Response:");
  console.log(JSON.stringify(data, null, 2));

  if (data.features && data.features.length > 0) {
    return {
      lat: data.features[0].properties.lat,
      lng: data.features[0].properties.lon,
    };
  }

  throw new Error("Location not found");
}

module.exports = geocode;