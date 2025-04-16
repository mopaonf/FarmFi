const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const FarmerSchema = new mongoose.Schema(
   {
      name: {
         type: String,
         required: true,
      },
      email: {
         type: String,
         required: true,
         unique: true,
      },
      password: {
         type: String,
         required: true,
      },
      phone: {
         type: String,
         required: true,
      },
      address: {
         type: String,
         required: true,
      },
      country: {
         type: String,
         required: true,
      },
   },
   { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Hash password before saving
FarmerSchema.pre('save', async function (next) {
   if (!this.isModified('password')) return next();
   const salt = await bcrypt.genSalt(10);
   this.password = await bcrypt.hash(this.password, salt);
   next();
});

module.exports = mongoose.model('Farmer', FarmerSchema);
