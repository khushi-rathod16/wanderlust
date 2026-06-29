
const mapElement = document.getElementById("map");

document.addEventListener("DOMContentLoaded", () => {
  const mapElement = document.getElementById("map");

  if (!mapElement) return;

  const lat = parseFloat(mapElement.dataset.lat);
  const lng = parseFloat(mapElement.dataset.lng);
  const title = mapElement.dataset.title;

  console.log("Lat:", lat);
console.log("Lng:", lng);
console.log("Map Element:", mapElement);
console.log("data-lat:", mapElement.dataset.lat);
console.log("data-lng:", mapElement.dataset.lng);

  const map = L.map("map").setView([lat, lng], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(title)
    .openPopup();
});