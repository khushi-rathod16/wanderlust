
const mongoose = require("mongoose");
const user = require("./user");
const Schema = mongoose.Schema;


const reviewSchema = new mongoose.Schema({
    comment: String,
    rating: {
        type: Number,   // ✅ FIXED
        min: 1,
        max: 5,
        required: true
    },
    createdAt: {       // ✅ naming fixed
        type: Date,
        default: Date.now
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
});


module.exports = mongoose.model("Review", reviewSchema);