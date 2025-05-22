const Farmer = require('../../models/farmers/Farmer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Farmer signup
exports.signup = async (req, res) => {
   const { name, email, password, phone, address, country } = req.body;

   try {
      const existingFarmer = await Farmer.findOne({ email });
      if (existingFarmer) {
         return res.status(400).json({ message: 'Farmer already exists' });
      }

      // Create and save the farmer
      const farmer = new Farmer({
         name,
         email,
         password,
         phone,
         address,
         country,
      });
      await farmer.save();

      // Generate token after saving
      const token = jwt.sign({ id: farmer._id }, process.env.JWT_SECRET, {
         expiresIn: '1d',
      });

      res.status(201).json({
         name,
         email,
         phone,
         address,
         country,
         message: 'Farmer registered successfully',
         token,
      });
   } catch (error) {
      res.status(500).json({ message: 'Server error', error });
   }
};

// Farmer login
exports.login = async (req, res) => {
   const { email, password } = req.body;

   try {
      const farmer = await Farmer.findOne({ email });
      if (!farmer) {
         return res.status(404).json({ message: 'Farmer not found' });
      }

      const isMatch = await bcrypt.compare(password, farmer.password);
      if (!isMatch) {
         return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: farmer._id }, process.env.JWT_SECRET, {
         expiresIn: '1d',
      });

      res.status(200).json({ message: 'Login successful', token });
   } catch (error) {
      res.status(500).json({ message: 'Server error', error });
   }
};

// Get farmer profile
exports.getProfile = async (req, res) => {
   try {
      const farmer = await Farmer.findById(req.user.id).select('-password');
      if (!farmer) {
         return res.status(404).json({ message: 'Farmer not found' });
      }
      res.status(200).json(farmer); // createdAt will be included automatically
   } catch (error) {
      res.status(500).json({ message: 'Server error', error });
   }
};

// Update farmer profile
exports.updateProfile = async (req, res) => {
   try {
      console.log('Update Request Body:', req.body); // Log the request body
      console.log('Authenticated User ID:', req.user.id); // Log the user ID

      const updatedFarmer = await Farmer.findByIdAndUpdate(
         req.user.id,
         req.body,
         { new: true, runValidators: true }
      ).select('-password');

      if (!updatedFarmer) {
         return res.status(404).json({ message: 'Farmer not found' });
      }

      res.status(200).json({
         message: 'Profile updated successfully',
         updatedFarmer,
      });
   } catch (error) {
      console.error('Error in updateProfile:', error); // Log the error
      res.status(500).json({ message: 'Server error', error });
   }
};

// Delete farmer profile
exports.deleteProfile = async (req, res) => {
   try {
      const deletedFarmer = await Farmer.findByIdAndDelete(req.user.id);
      if (!deletedFarmer) {
         return res.status(404).json({ message: 'Farmer not found' });
      }
      res.status(200).json({ message: 'Profile deleted successfully' });
   } catch (error) {
      res.status(500).json({ message: 'Server error', error });
   }
};

// Get all farmers (Admin only)
exports.getAllFarmers = async (req, res) => {
   try {
      const farmers = await Farmer.find().select('-password');
      res.status(200).json(farmers);
   } catch (error) {
      console.error('Error fetching farmers:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
   }
};

// Delete farmer (Admin only)
exports.deleteFarmer = async (req, res) => {
   try {
      const farmer = await Farmer.findByIdAndDelete(req.params.id);
      if (!farmer) {
         return res.status(404).json({ message: 'Farmer not found' });
      }
      res.status(200).json({ message: 'Farmer deleted successfully' });
   } catch (error) {
      console.error('Error deleting farmer:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
   }
};

// Admin: Get farmer by ID
exports.getFarmerById = async (req, res) => {
   try {
      const farmer = await Farmer.findById(req.params.id).select('-password');
      if (!farmer) {
         return res.status(404).json({ message: 'Farmer not found' });
      }
      res.status(200).json(farmer);
   } catch (error) {
      res.status(500).json({
         message: 'Error getting farmer',
         error: error.message,
      });
   }
};

// Admin: Update farmer
exports.updateFarmerByAdmin = async (req, res) => {
   try {
      const farmer = await Farmer.findByIdAndUpdate(
         req.params.id,
         { ...req.body },
         { new: true, runValidators: true }
      ).select('-password');

      if (!farmer) {
         return res.status(404).json({ message: 'Farmer not found' });
      }
      res.status(200).json({ message: 'Farmer updated successfully', farmer });
   } catch (error) {
      res.status(500).json({
         message: 'Error updating farmer',
         error: error.message,
      });
   }
};
