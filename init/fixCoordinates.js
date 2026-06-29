require("dotenv").config({ path: "../.env" });

const mongoose = require("mongoose");
const Listing = require("../models/listing");
const geocode = require("../utils/geocode");

console.log("ENV KEY =", process.env.GEOAPIFY_API_KEY);

mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log(err));

async function updateCoordinates() {
  const listings = await Listing.find({});
  console.log("Total Listings:", listings.length);

for (let listing of listings) {
  console.log(
    listing.title,
    listing.location,
    listing.coordinates
  );
}

  for (let listing of listings) {
    if (
  !listing.coordinates ||
  !listing.coordinates.lat ||
  !listing.coordinates.lng
) {
      try {
        const coords = await geocode(listing.location);

        listing.coordinates = {
          lat: coords.lat,
          lng: coords.lng,
        };

        await listing.save();

        console.log(`Updated: ${listing.title}`);
      } catch (err) {
        console.log(`Failed: ${listing.title}`);
      }
    }
  }

  console.log("All listings updated!");
  mongoose.connection.close();
}

updateCoordinates();