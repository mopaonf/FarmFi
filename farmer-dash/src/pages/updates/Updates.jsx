import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
   CircularProgress,
   MenuItem,
   Select,
   Box,
   Typography,
} from '@mui/material'; // Added missing imports for Box and Typography
import { useTheme } from '@mui/material/styles'; // Added missing import for useTheme
import { motion } from 'framer-motion'; // Added missing import for motion
import { tokens } from '../../theme'; // Assuming tokens are used for consistent theming
import { projects, mockUpdates } from '../../data/mockData'; // Mock data for projects and updates

const UpdatesPage = () => {
   const [selectedProject, setSelectedProject] = useState('');
   const [isLoading, setIsLoading] = useState(false);
   const [projectUpdates, setProjectUpdates] = useState([]); // Store updates for the selected project
   const theme = useTheme();
   const colors = tokens(theme.palette.mode);

   const handleProjectChange = (event) => {
      const projectId = parseInt(event.target.value); // Convert to number since IDs are numbers
      setSelectedProject(projectId);
      setIsLoading(true);

      // Simulate fetching updates for the selected project
      setTimeout(() => {
         const updates = mockUpdates.filter(
            (update) => update.project.id === projectId // Changed from _id to id
         );
         setProjectUpdates(updates);
         setIsLoading(false);
      }, 800);
   };

   return (
      <motion.div
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ duration: 0.5 }}
         className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8"
         style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
         }}
      >
         {/* Header */}
         <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{
               backgroundColor: colors.primary[400],
               padding: '15px 20px',
               borderRadius: '8px',
               boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.15)',
               marginBottom: '20px',
            }}
         >
            <Box>
               <Typography
                  variant="h4"
                  fontWeight="bold"
                  color={colors.grey[100]}
               >
                  UPDATES
               </Typography>
               <Typography variant="subtitle1" color={colors.greenAccent[400]}>
                  Welcome to your farmer updates page
               </Typography>
            </Box>
         </Box>

         {/* Project Selection */}
         <Box
            display="flex"
            justifyContent="flex-start"
            alignItems="center"
            mb={4}
         >
            <Select
               value={selectedProject}
               onChange={handleProjectChange}
               displayEmpty
               sx={{
                  width: '400px',
                  backgroundColor: colors.greenAccent[600],
                  borderRadius: '8px',
                  boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                  '& .MuiSelect-select': {
                     padding: '10px',
                  },
               }}
            >
               <MenuItem value="" disabled>
                  Select a project
               </MenuItem>
               {projects.map((project) => (
                  <MenuItem key={project.id} value={project.id}>
                     {project.title}
                  </MenuItem>
               ))}
            </Select>
         </Box>

         {/* Loading or Updates */}
         <Box
            flex="1"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            textAlign="center"
         >
            {isLoading ? (
               <CircularProgress size={80} />
            ) : !selectedProject ? (
               <Typography
                  variant="h5"
                  color="textSecondary"
                  sx={{ fontSize: '30px' }}
               >
                  No project selected
               </Typography>
            ) : (
               <Box width="100%">
                  {/* Project Name */}
                  <Typography
                     variant="h5"
                     fontWeight="bold"
                     color={colors.greenAccent[400]}
                     mb={4}
                  >
                     Updates for Project:{' '}
                     {projects.find((p) => p.id === selectedProject)?.title}
                  </Typography>

                  {/* Updates List */}
                  {projectUpdates.length > 0 ? (
                     <Box sx={{ maxWidth: '100%', px: 2 }}>
                        {projectUpdates.map((update) => (
                           <Box
                              key={update._id}
                              sx={{
                                 backgroundColor: colors.primary[400],
                                 borderRadius: '8px',
                                 padding: '20px',
                                 marginBottom: '20px',
                                 boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
                              }}
                           >
                              <Typography
                                 variant="h6"
                                 fontWeight="bold"
                                 color={colors.grey[100]}
                              >
                                 Phase:{' '}
                                 {update.milestone_type
                                    .split('_')
                                    .map(
                                       (word) =>
                                          word.charAt(0).toUpperCase() +
                                          word.slice(1)
                                    )
                                    .join(' ')}
                              </Typography>

                              {/* Photos Grid */}
                              <Box
                                 sx={{
                                    display: 'grid',
                                    gridTemplateColumns:
                                       'repeat(auto-fit, minmax(200px, 1fr))',
                                    gap: 2,
                                    my: 3,
                                 }}
                              >
                                 {update.media.map((img, index) => (
                                    <Box
                                       key={index}
                                       component="img"
                                       src={img}
                                       alt={`Phase ${index + 1}`}
                                       sx={{
                                          width: '100%',
                                          height: '200px',
                                          objectFit: 'cover',
                                          borderRadius: '8px',
                                          boxShadow:
                                             '0px 2px 8px rgba(0, 0, 0, 0.15)',
                                       }}
                                    />
                                 ))}
                              </Box>

                              <Typography
                                 color={colors.grey[100]}
                                 sx={{ mt: 2 }}
                              >
                                 {update.text_content}
                              </Typography>

                              <Typography
                                 variant="body2"
                                 color={colors.greenAccent[400]}
                                 sx={{ mt: 2 }}
                              >
                                 Updated on:{' '}
                                 {new Date(
                                    update.createdAt
                                 ).toLocaleDateString()}
                              </Typography>
                           </Box>
                        ))}
                     </Box>
                  ) : (
                     <Typography
                        variant="body1"
                        color="textSecondary"
                        sx={{ marginTop: '20px' }}
                     >
                        No updates available for this project.
                     </Typography>
                  )}

                  {/* Add Update Button */}
                  <Box display="flex" justifyContent="flex-end" mt={4}>
                     <button className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
                        + Add Update
                     </button>
                  </Box>
               </Box>
            )}
         </Box>

         {/* Footer */}
         <Box
            sx={{
               backgroundColor: colors.primary[400],
               color: colors.grey[100],
               bottom: 0,
               left: 0,
               width: 'calc(100%)', // Adjust width to exclude the sidebar
               padding: '20px 20px 20px 150px',
               boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.15)',
            }}
         >
            <Typography
               variant="h4"
               color={colors.greenAccent[400]}
               fontWeight="bold"
               textAlign="center"
               paddingRight={70}
               mb={2}
            >
               <u>Update Guidelines</u>
            </Typography>
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={4}>
               {/* Left Column */}
               <Box>
                  <Typography
                     variant="h6"
                     fontWeight="bold"
                     color={colors.greenAccent[400]}
                     mb={2}
                  >
                     What to Include
                  </Typography>
                  <ul style={{ paddingLeft: '20px' }}>
                     <li>Project milestones and achievements</li>
                     <li>Photos or media showcasing progress</li>
                     <li>Key challenges and solutions</li>
                     <li>Upcoming plans and goals</li>
                  </ul>
               </Box>

               {/* Right Column */}
               <Box>
                  <Typography
                     variant="h6"
                     fontWeight="bold"
                     color={colors.greenAccent[400]}
                     mb={2}
                  >
                     Best Practices
                  </Typography>
                  <ul style={{ paddingLeft: '20px' }}>
                     <li>Use clear and concise language</li>
                     <li>Provide accurate and up-to-date information</li>
                     <li>Include high-quality images</li>
                     <li>Focus on transparency and accountability</li>
                  </ul>
               </Box>
            </Box>
         </Box>
      </motion.div>
   );
};

export default UpdatesPage;
