const Listing = require("../models/listing");
const geocode = require("../utils/geocode");

async function getCoordinates(location) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
  );

  const data = await response.json();

  if (data.length > 0) {
    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
    };
  }

  return {
    lat: 23.2599,
    lng: 77.4126,
  };
}

module.exports.index = async (req, res) => {
  try {

    const search = req.query.search;

    let allListings;

    if (search && search.trim() !== "") {

      allListings = await Listing.find({
        $or: [
          {
            title: {
              $regex: search,
              $options: "i",
            },
          },
          {
            location: {
              $regex: search,
              $options: "i",
            },
          },
          {
            country: {
              $regex: search,
              $options: "i",
            },
          },
        ],
      });

    } else {

      allListings = await Listing.find({});

    }

    res.render("listings/index", { allListings });

  } catch (err) {

    console.log(err);
    res.send("Error loading listings");

  }
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;

  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
        select: "username",
      },
    })
    .populate("owner");
    console.log(listing.coordinates);

  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing });
};



module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;

  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing does not exist!");
    return res.redirect("/listings");
  }
let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace(
    "/upload",
    "/upload/,w_250"
  );

  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;

  let listing = await Listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { new: true }
  );

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;

    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;

  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);

  req.flash("success", "Listing deleted!");
  res.redirect("/listings");
};

module.exports.createListing = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;

  const coords = await geocode(req.body.listing.location);

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };

  newListing.coordinates = {
    lat: coords.lat,
    lng: coords.lng
  };

  await newListing.save();

  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};