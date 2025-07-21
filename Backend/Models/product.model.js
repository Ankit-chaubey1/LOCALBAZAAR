const mongoose = require("mongoose")

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    location: {
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: false, // Changed from required: true to false
      },
      state: {
        type: String,
        required: false, // Changed from required: true to false
      },
      country: {
        type: String,
        required: false, // Changed from required: true to false
        default: "India",
      },
      village: {
        type: String,
      },
      district: {
        type: String,
      },
      pincode: {
        type: String,
      },
      coordinates: {
        latitude: {
          type: Number,
          required: true,
        },
        longitude: {
          type: Number,
          required: true,
        },
      },
    },
    usedFrom: {
      type: Date,
      required: true,
    },
    usedTo: {
      type: Date,
      required: true,
    },
    distance: {
      type: Number, // Optional: Distance travelled for transport items
    },
    availability: {
      type: Boolean,
      default: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
)

// Add index for geospatial queries
productSchema.index({ "location.coordinates": "2dsphere" })

const Product = mongoose.model("Product", productSchema)

module.exports = Product
