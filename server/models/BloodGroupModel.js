// IMPORTS -
const mongoose = require("mongoose");

const bloodGroupSchema = new mongoose.Schema({
  bloodGroup: {
    type: String,
    required: [true, "Please select the blood type"],
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  },

  stock: {
    type: Number,
    required: [true, "Please enter the blood type stock"],
    max: [1000, "Stock cannot exceed 1000 units"],
    default: 0,
  },

  bloodBank: {
    type: mongoose.Schema.ObjectId,
    ref: "bloodBank",
    required: true,
  },

  reservedBags: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },

      name: {
        type: String,
        required: true,
      },

      cnic: {
        type: String,
        required: true,
      },

      bloodBags: {
        type: String,
        required: true,
      },
    },
  ],

  stockHistory: [
    {
      stock: {
        type: Number,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

bloodGroupSchema.index({ bloodGroup: 1, bloodBank: 1 }, { unique: true });

// bloodGroupSchema.pre("save", function (next) {


  
//   if (this.isModified("stock")) {
//     this.stockHistory.push({
//       stock: this.stock,
//       createdAt: Date.now(),
//     });
//   }
//   next();
// });

bloodGroupSchema.pre("save", async function (next) {
  try {
    const originalDocument = await this.constructor.findOne({ _id: this._id });

    if (originalDocument && this.isModified("stock")) {
      this.stockHistory.push({
        stock: originalDocument.stock,
        createdAt: Date.now(),
      });
    }

    next();
  } catch (error) {
    next(error);
  }
});


const bloodGroup = mongoose.model("bloodGroup", bloodGroupSchema);
module.exports = bloodGroup;
