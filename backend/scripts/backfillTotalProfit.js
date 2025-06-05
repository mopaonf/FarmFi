const mongoose = require('mongoose');
const Project = require('../models/projects/Project');

async function backfillTotalProfit() {
   await mongoose.connect('mongodb://localhost:27017/YOUR_DB_NAME'); // Change DB name if needed

   const projects = await Project.find({});
   for (const project of projects) {
      const total = (project.profitSubmissions || [])
         .filter((ps) => ps.status === 'approved')
         .reduce((sum, ps) => sum + (ps.amount || 0), 0);
      project.totalProfit = total;
      await project.save();
      console.log(`Updated project ${project._id} with totalProfit: ${total}`);
   }
   await mongoose.disconnect();
}

backfillTotalProfit();
