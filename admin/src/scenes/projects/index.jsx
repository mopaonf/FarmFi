import React, { useState } from 'react';
import {
   Box,
   Typography,
   Card,
   Select,
   MenuItem,
   IconButton,
   Tooltip,
   useTheme,
   Modal,
   Button,
   Divider,
} from '@mui/material';
import { tokens } from '../../theme';
import { projects } from '../../data/mockData';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import ZoomInIcon from '@mui/icons-material/ZoomIn';

const ProjectsPage = () => {
   const theme = useTheme();
   const colors = tokens(theme.palette.mode) || {};
   const [selectedFilter, setSelectedFilter] = useState('All');
   const [projectList, setProjectList] = useState(projects);
   const [selectedProject, setSelectedProject] = useState(null); // Track selected project for modal
   const [isModalOpen, setIsModalOpen] = useState(false); // Track modal state
   const [isImageModalOpen, setIsImageModalOpen] = useState(false);
   const [selectedImage, setSelectedImage] = useState(null);

   // Filter projects by status
   const filteredProjects =
      selectedFilter === 'All'
         ? projectList
         : projectList.filter((project) => project.status === selectedFilter);

   // Handle project approval
   const handleApprove = (id) => {
      setProjectList((prev) =>
         prev.map((project) =>
            project.id === id ? { ...project, status: 'Active' } : project
         )
      );
      setIsModalOpen(false); // Close modal after action
   };

   // Handle project rejection
   const handleReject = (id) => {
      setProjectList((prev) =>
         prev.map(
            (project) =>
               project.id === id ? { ...project, status: 'Denied' } : project // Removed invalid </Box>
         )
      );
      setIsModalOpen(false); // Close modal after action
   };

   // Open modal with selected project details
   const handleCardClick = (project) => {
      setSelectedProject(project);
      setIsModalOpen(true);
   };

   const handleImageClick = (image) => {
      setSelectedImage(image);
      setIsImageModalOpen(true);
   };

   return (
      <Box m="20px">
         {/* Header */}
         <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={4}
         >
            <Box>
               <Typography
                  variant="h4"
                  fontWeight="bold"
                  color={colors.grey?.[100] || '#fff'} // Fallback color
               >
                  PROJECTS
               </Typography>
               <Typography
                  variant="subtitle1"
                  color={colors.greenAccent?.[400] || '#00ff00'} // Fallback color
               >
                  Manage and validate farmer-submitted projects
               </Typography>
            </Box>
            <Box>
               <Select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  displayEmpty
                  sx={{
                     backgroundColor: colors.primary?.[400] || '#333', // Fallback color
                     color: colors.grey?.[100] || '#fff', // Fallback color
                     borderRadius: '8px',
                     padding: '5px 15px',
                     '& .MuiSelect-select': {
                        padding: '10px',
                     },
                  }}
               >
                  <MenuItem value="All">All Projects</MenuItem>
                  <MenuItem value="Submitted">Submitted</MenuItem>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Denied">Denied</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
               </Select>
            </Box>
         </Box>

         {/* Projects List */}
         <Box
            display="grid"
            gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))"
            gap={4}
         >
            {filteredProjects.map((project) => (
               <Card
                  key={project.id}
                  onClick={() => handleCardClick(project)} // Open modal on card click
                  sx={{
                     backgroundColor: colors.primary?.[400] || '#333', // Fallback color
                     padding: '20px',
                     borderRadius: '12px',
                     boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
                     cursor: 'pointer',
                     '&:hover': {
                        boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.3)',
                     },
                  }}
               >
                  <Typography
                     variant="h6"
                     fontWeight="bold"
                     color={colors.greenAccent?.[400] || '#00ff00'} // Fallback color
                     mb={1}
                  >
                     {project.title}
                  </Typography>
                  <Typography
                     variant="body2"
                     color={colors.grey?.[300] || '#ccc'}
                     mb={1}
                  >
                     <strong>Category:</strong> {project.category}
                  </Typography>
                  <Typography
                     variant="body2"
                     color={colors.grey?.[300] || '#ccc'}
                     mb={1}
                  >
                     <strong>Status:</strong>{' '}
                     <span
                        style={{
                           color:
                              project.status === 'Submitted'
                                 ? colors.yellowAccent?.[400] || '#ff0'
                                 : project.status === 'Active'
                                 ? colors.greenAccent?.[400] || '#0f0'
                                 : project.status === 'Denied'
                                 ? colors.redAccent?.[400] || '#f00'
                                 : colors.grey?.[300] || '#ccc',
                        }}
                     >
                        {project.status}
                     </span>
                  </Typography>
                  <Typography
                     variant="body2"
                     color={colors.grey?.[300] || '#ccc'}
                     mb={1}
                  >
                     <strong>Funding Goal:</strong> FCFA{' '}
                     {project.fundingGoal.toLocaleString()}
                  </Typography>
                  <Typography
                     variant="body2"
                     color={colors.grey?.[300] || '#ccc'}
                     mb={1}
                  >
                     <strong>Progress:</strong> {project.progress}%
                  </Typography>
                  <Typography
                     variant="body2"
                     color={colors.grey?.[300] || '#ccc'}
                     mb={2}
                  >
                     <strong>Location:</strong> {project.location}
                  </Typography>

                  {/* Photos Section */}
                  <Box mt={4} mb={2}>
                     <Typography
                        variant="body2"
                        color={colors.grey[700]}
                        mb={1}
                     >
                        <strong>Photos:</strong>
                     </Typography>
                     <Box display="flex" gap={1} flexWrap="wrap">
                        {project.photos?.length > 0 ? (
                           project.photos.map((photo, i) => (
                              <Box
                                 key={i}
                                 sx={{
                                    position: 'relative',
                                    cursor: 'pointer',
                                 }}
                                 onClick={(e) => {
                                    e.stopPropagation();
                                    handleImageClick(photo);
                                 }}
                              >
                                 <Box
                                    component="img"
                                    src={photo}
                                    alt={`Project Photo ${i + 1}`}
                                    sx={{
                                       width: '80px',
                                       height: '80px',
                                       borderRadius: '8px',
                                       objectFit: 'cover',
                                       boxShadow:
                                          '0px 2px 5px rgba(0, 0, 0, 0.1)',
                                    }}
                                 />
                                 <ZoomInIcon
                                    sx={{
                                       position: 'absolute',
                                       top: '5px',
                                       right: '5px',
                                       color: 'white',
                                       backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                       borderRadius: '50%',
                                       padding: '2px',
                                    }}
                                 />
                              </Box>
                           ))
                        ) : (
                           <Typography variant="body2" color={colors.grey[500]}>
                              No photos available
                           </Typography>
                        )}
                     </Box>
                  </Box>
               </Card>
            ))}
         </Box>

         {/* No Projects Message */}
         {filteredProjects.length === 0 && (
            <Box textAlign="center" mt={4}>
               <Typography variant="h6" color={colors.grey?.[300] || '#ccc'}>
                  No projects found for the selected filter.
               </Typography>
            </Box>
         )}

         {/* Project Details Modal */}
         <Modal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            aria-labelledby="project-details-modal"
            aria-describedby="project-details-description"
         >
            <Box
               sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '80%',
                  maxHeight: '90%',
                  overflowY: 'auto',
                  backgroundColor: colors.primary?.[400] || '#333',
                  borderRadius: '12px',
                  boxShadow: 24,
                  p: 4,
               }}
            >
               {selectedProject && (
                  <>
                     <Typography
                        id="project-details-modal"
                        variant="h4"
                        fontWeight="bold"
                        color={colors.greenAccent?.[400] || '#00ff00'}
                        mb={2}
                     >
                        {selectedProject.title}
                     </Typography>
                     <Divider
                        sx={{
                           mb: 2,
                           backgroundColor: colors.grey?.[300] || '#ccc',
                        }}
                     />
                     <Typography
                        variant="body1"
                        color={colors.grey?.[300] || '#ccc'}
                        mb={2}
                     >
                        <strong>Category:</strong> {selectedProject.category}
                     </Typography>
                     <Typography
                        variant="body1"
                        color={colors.grey?.[300] || '#ccc'}
                        mb={2}
                     >
                        <strong>Location:</strong> {selectedProject.location}
                     </Typography>
                     <Typography
                        variant="body1"
                        color={colors.grey?.[300] || '#ccc'}
                        mb={2}
                     >
                        <strong>Land Size:</strong> {selectedProject.landSize}{' '}
                        hectares
                     </Typography>
                     <Typography
                        variant="body1"
                        color={colors.grey?.[300] || '#ccc'}
                        mb={2}
                     >
                        <strong>Budget Total:</strong> FCFA{' '}
                        {selectedProject.budgetTotal.toLocaleString()}
                     </Typography>
                     <Typography
                        variant="body1"
                        color={colors.grey?.[300] || '#ccc'}
                        mb={2}
                     >
                        <strong>Funding Goal:</strong> FCFA{' '}
                        {selectedProject.fundingGoal.toLocaleString()}
                     </Typography>
                     <Typography
                        variant="body1"
                        color={colors.grey?.[300] || '#ccc'}
                        mb={2}
                     >
                        <strong>Duration:</strong>{' '}
                        {selectedProject.duration_in_months} months
                     </Typography>
                     <Typography
                        variant="body1"
                        color={colors.grey?.[300] || '#ccc'}
                        mb={2}
                     >
                        <strong>Description:</strong>{' '}
                        {selectedProject.documentation}
                     </Typography>
                     <Typography
                        variant="body1"
                        color={colors.grey?.[300] || '#ccc'}
                        mb={2}
                     >
                        <strong>Timestamp:</strong> {selectedProject.timestamp}
                     </Typography>

                     {/* Photos Section */}
                     <Typography
                        variant="h6"
                        fontWeight="bold"
                        color={colors.greenAccent?.[400] || '#00ff00'}
                        mt={4}
                        mb={2}
                     >
                        Photos
                     </Typography>
                     <Box display="flex" gap={2} flexWrap="wrap" mb={4}>
                        {selectedProject.photos?.length > 0 ? (
                           selectedProject.photos.map((photo, index) => (
                              <Box
                                 key={index}
                                 component="img"
                                 src={photo}
                                 alt={`Project Photo ${index + 1}`}
                                 sx={{
                                    width: '150px',
                                    height: '150px',
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                                 }}
                              />
                           ))
                        ) : (
                           <Typography
                              variant="body2"
                              color={colors.grey?.[300] || '#ccc'}
                           >
                              No photos available
                           </Typography>
                        )}
                     </Box>

                     {/* Certificates Section */}
                     <Typography
                        variant="h6"
                        fontWeight="bold"
                        color={colors.greenAccent?.[400] || '#00ff00'}
                        mb={2}
                     >
                        Attached Certificates
                     </Typography>
                     <Box display="flex" flexDirection="column" gap={2} mb={4}>
                        {selectedProject.documents?.length > 0 ? (
                           selectedProject.documents.map((doc, index) => (
                              <Button
                                 key={index}
                                 variant="outlined"
                                 color="primary"
                                 href={doc.url} // Assuming the document has a URL
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 sx={{
                                    textTransform: 'none',
                                    justifyContent: 'flex-start',
                                 }}
                              >
                                 {doc.name || `Document ${index + 1}`}
                              </Button>
                           ))
                        ) : (
                           <Typography
                              variant="body2"
                              color={colors.grey?.[300] || '#ccc'}
                           >
                              No certificates attached
                           </Typography>
                        )}
                     </Box>

                     <Box display="flex" justifyContent="space-between" mt={4}>
                        <Button
                           variant="contained"
                           color="success"
                           onClick={() => handleApprove(selectedProject.id)}
                           startIcon={<CheckCircleOutlineIcon />}
                        >
                           Approve
                        </Button>
                        <Button
                           variant="contained"
                           color="error"
                           onClick={() => handleReject(selectedProject.id)}
                           startIcon={<CancelOutlinedIcon />}
                        >
                           Reject
                        </Button>
                     </Box>
                  </>
               )}
            </Box>
         </Modal>

         {/* Image Modal */}
         <Modal
            open={isImageModalOpen}
            onClose={() => setIsImageModalOpen(false)}
            aria-labelledby="image-modal"
            aria-describedby="image-modal-description"
         >
            <Box
               sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  maxWidth: '90%',
                  maxHeight: '90%',
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  boxShadow: 24,
                  p: 2,
               }}
            >
               {selectedImage && (
                  <Box
                     component="img"
                     src={selectedImage}
                     alt="Selected Project Image"
                     sx={{
                        width: '100%',
                        height: 'auto',
                        borderRadius: '8px',
                     }}
                  />
               )}
            </Box>
         </Modal>
      </Box>
   );
};

export default ProjectsPage;
