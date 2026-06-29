const mongoose = require("mongoose");
const Listing = require("../models/listing");
const initData = require("./data.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => console.log("connected to DB"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({...obj, owner: "6a12f53a232cda6ee3bbfffa"}));
  await Listing.insertMany(initData.data);
  console.log("data saved");
};

initDB();
