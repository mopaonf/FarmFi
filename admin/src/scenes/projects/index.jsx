import React, { useState, useEffect } from 'react';
import {
   Box,
   Typography,
   Card,
   Select,
   MenuItem,
   Modal,
   Button,
   Divider,
   useTheme,
} from '@mui/material';
import { tokens } from '../../theme';
import axios from 'axios';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import ZoomInIcon from '@mui/icons-material/ZoomIn';

const ProjectsPage = () => {
   const theme = useTheme();
   const colors = tokens(theme.palette.mode) || {};
   const [selectedFilter, setSelectedFilter] = useState('All');
   const [projectList, setProjectList] = useState([]);
   const [selectedProject, setSelectedProject] = useState(null); // Track selected project for modal
   const [isModalOpen, setIsModalOpen] = useState(false); // Track modal state
   const [isImageModalOpen, setIsImageModalOpen] = useState(false);
   const [selectedImage, setSelectedImage] = useState(null);
   const [loading, setLoading] = useState(true);
   const [expandedCards, setExpandedCards] = useState({});

   // Fetch projects from backend
   useEffect(() => {
      const fetchProjects = async () => {
         setLoading(true);
         try {
            const token = localStorage.getItem('adminToken');
            const res = await axios.get('http://localhost:5000/api/projects', {
               headers: { Authorization: `Bearer ${token}` },
            });
            setProjectList(res.data);
         } catch (err) {
            // handle error
         }
         setLoading(false);
      };
      fetchProjects();
   }, []);

   // Filter projects by status
   const filteredProjects =
      selectedFilter === 'All'
         ? projectList
         : projectList.filter((project) => project.status === selectedFilter);

   // Handle project approval
   const handleApprove = async (id) => {
      try {
         const token = localStorage.getItem('adminToken');
         const res = await axios.patch(
            `http://localhost:5000/api/projects/${id}/status`,
            { status: 'Active' },
            { headers: { Authorization: `Bearer ${token}` } }
         );
         setProjectList((prev) =>
            prev.map((project) => (project._id === id ? res.data : project))
         );
         setIsModalOpen(false);
      } catch (err) {
         // handle error
      }
   };

   // Handle project rejection
   const handleReject = async (id) => {
      try {
         const token = localStorage.getItem('adminToken');
         const res = await axios.patch(
            `http://localhost:5000/api/projects/${id}/status`,
            { status: 'Denied' },
            { headers: { Authorization: `Bearer ${token}` } }
         );
         setProjectList((prev) =>
            prev.map((project) => (project._id === id ? res.data : project))
         );
         setIsModalOpen(false);
      } catch (err) {
         // handle error
      }
   };

   // Handle project stop (for Active projects)
   const handleStop = (id) => {
      setProjectList((prev) =>
         prev.map((project) =>
            project.id === id ? { ...project, status: 'Stopped' } : project
         )
      );
      setIsModalOpen(false); // Close modal after action
   };

   // Handle project completion approval (for pending_completion)
   const handleApproveCompletion = async (id) => {
      try {
         const token = localStorage.getItem('adminToken');
         const res = await axios.patch(
            `http://localhost:5000/api/projects/${id}/approve-completion`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
         );
         setProjectList((prev) =>
            prev.map((project) =>
               project._id === id
                  ? { ...project, status: 'completed' }
                  : project
            )
         );
         setIsModalOpen(false);
      } catch (err) {
         // handle error
      }
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

   const handleShowMoreToggle = (id) => {
      setExpandedCards((prev) => ({
         ...prev,
         [id]: !prev[id],
      }));
   };

   if (loading) {
      return <div>Loading...</div>;
   }

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
            {filteredProjects.map((project) => {
               const isExpanded = expandedCards[project._id];
               return (
                  <Card
                     key={project._id}
                     onClick={() => handleCardClick(project)}
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
                     {/* Farmer Name */}
                     <Typography
                        variant="body2"
                        color={colors.greenAccent?.[400] || '#00ff00'}
                        mb={1}
                     >
                        <strong>Farmer:</strong>{' '}
                        {project.farmer?.name ? project.farmer.name : 'Unknown'}
                     </Typography>
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
                                 project.status === 'submitted'
                                    ? colors.yellowAccent?.[400] || '#ff0'
                                    : project.status === 'active'
                                    ? colors.greenAccent?.[400] || '#0f0'
                                    : project.status === 'denied'
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
                        {project.funding_goal != null
                           ? Number(project.funding_goal).toLocaleString()
                           : 'N/A'}
                     </Typography>
                     <Typography
                        variant="body2"
                        color={colors.grey?.[300] || '#ccc'}
                        mb={1}
                     >
                        <strong>Budget Total:</strong> FCFA{' '}
                        {project.budget_total != null
                           ? Number(project.budget_total).toLocaleString()
                           : 'N/A'}
                     </Typography>
                     <Typography
                        variant="body2"
                        color={colors.grey?.[300] || '#ccc'}
                        mb={1}
                     >
                        <strong>Description:</strong>{' '}
                        {project.description || 'No description available.'}
                     </Typography>
                     <Typography
                        variant="body2"
                        color={colors.grey?.[300] || '#ccc'}
                        mb={1}
                     >
                        <strong>Timestamp:</strong>{' '}
                        {project.createdAt
                           ? new Date(project.createdAt).toLocaleString()
                           : 'N/A'}
                     </Typography>
                     {/* Show More/Less Button */}
                     <Box mt={2}>
                        <Button
                           size="small"
                           variant="outlined"
                           onClick={(e) => {
                              e.stopPropagation();
                              handleShowMoreToggle(project._id);
                           }}
                        >
                           {isExpanded ? 'Show Less' : 'Show More'}
                        </Button>
                     </Box>

                     {/* Expanded Details */}
                     {isExpanded && (
                        <Box mt={2}>
                           <Divider
                              sx={{
                                 mb: 2,
                                 backgroundColor: colors.grey?.[300] || '#ccc',
                              }}
                           />
                           <Typography
                              variant="body2"
                              color={colors.grey?.[300] || '#ccc'}
                              mb={1}
                           >
                              <strong>Land Size:</strong> {project.land_size}{' '}
                              hectares
                           </Typography>
                           <Typography
                              variant="body2"
                              color={colors.grey?.[300] || '#ccc'}
                              mb={1}
                           >
                              <strong>Investment per Unit:</strong> FCFA{' '}
                              {project.unitPrice != null
                                 ? Number(project.unitPrice).toLocaleString()
                                 : 'N/A'}
                           </Typography>
                           <Typography
                              variant="body2"
                              color={colors.grey?.[300] || '#ccc'}
                              mb={1}
                           >
                              <strong>Total Units:</strong> {project.totalUnits}
                           </Typography>
                           <Typography
                              variant="body2"
                              color={colors.grey?.[300] || '#ccc'}
                              mb={1}
                           >
                              <strong>Expected ROI Range:</strong>{' '}
                              {project.expected_roi_range}
                           </Typography>
                           <Typography
                              variant="body2"
                              color={colors.grey?.[300] || '#ccc'}
                              mb={1}
                           >
                              <strong>Return Frequency:</strong>{' '}
                              {project.return_frequency}
                           </Typography>
                           <Typography
                              variant="body2"
                              color={colors.grey?.[300] || '#ccc'}
                              mb={1}
                           >
                              <strong>Return Start Year:</strong>{' '}
                              {project.return_start_year_or_month}
                           </Typography>
                           <Typography
                              variant="body2"
                              color={colors.grey?.[300] || '#ccc'}
                              mb={1}
                           >
                              <strong>Contract Duration:</strong>{' '}
                              {project.contract_duration}
                           </Typography>
                           <Typography
                              variant="body2"
                              color={colors.grey?.[300] || '#ccc'}
                              mb={1}
                           >
                              <strong>Annual Net Profit Estimate:</strong>{' '}
                              {project.annual_net_profit_estimate}
                           </Typography>
                           <Typography
                              variant="body2"
                              color={colors.grey?.[300] || '#ccc'}
                              mb={1}
                           >
                              <strong>Risks & Mitigation:</strong>{' '}
                              {project.risks_and_mitigation}
                           </Typography>
                           <Typography
                              variant="body2"
                              color={colors.grey?.[300] || '#ccc'}
                              mb={1}
                           >
                              <strong>Pitch Video:</strong>{' '}
                              {project.pitch_video?.url ? (
                                 <a
                                    href={project.pitch_video.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                 >
                                    {project.pitch_video.name || 'View Video'}
                                 </a>
                              ) : (
                                 'N/A'
                              )}
                           </Typography>
                           <Typography
                              variant="body2"
                              color={colors.grey?.[300] || '#ccc'}
                              mb={1}
                           >
                              <strong>Farmer Bio:</strong> {project.farmer_bio}
                           </Typography>
                           <Typography
                              variant="body2"
                              color={colors.grey?.[300] || '#ccc'}
                              mb={1}
                           >
                              <strong>Start Date:</strong>{' '}
                              {project.start_date
                                 ? new Date(
                                      project.start_date
                                   ).toLocaleDateString()
                                 : 'N/A'}
                           </Typography>
                           <Typography
                              variant="body2"
                              color={colors.grey?.[300] || '#ccc'}
                              mb={1}
                           >
                              <strong>End Date:</strong>{' '}
                              {project.end_date
                                 ? new Date(
                                      project.end_date
                                   ).toLocaleDateString()
                                 : 'N/A'}
                           </Typography>
                           <Typography
                              variant="body2"
                              color={colors.grey?.[300] || '#ccc'}
                              mb={1}
                           >
                              <strong>Created At:</strong>{' '}
                              {project.createdAt
                                 ? new Date(project.createdAt).toLocaleString()
                                 : 'N/A'}
                           </Typography>
                           <Typography
                              variant="body2"
                              color={colors.grey?.[300] || '#ccc'}
                              mb={1}
                           >
                              <strong>Updated At:</strong>{' '}
                              {project.updatedAt
                                 ? new Date(project.updatedAt).toLocaleString()
                                 : 'N/A'}
                           </Typography>
                        </Box>
                     )}
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
                              project.photos.map((photo, i) => {
                                 // Support both string and object with url
                                 const url =
                                    typeof photo === 'string'
                                       ? photo
                                       : photo.url;
                                 // Only render if url is a valid HTTP(S) URL
                                 if (url && /^https?:\/\//i.test(url)) {
                                    return (
                                       <Box
                                          key={i}
                                          sx={{
                                             position: 'relative',
                                             cursor: 'pointer',
                                          }}
                                          onClick={(e) => {
                                             e.stopPropagation();
                                             handleImageClick(url);
                                          }}
                                       >
                                          <Box
                                             component="img"
                                             src={url}
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
                                                backgroundColor:
                                                   'rgba(0, 0, 0, 0.5)',
                                                borderRadius: '50%',
                                                padding: '2px',
                                             }}
                                          />
                                       </Box>
                                    );
                                 }
                                 return null;
                              })
                           ) : (
                              <Typography
                                 variant="body2"
                                 color={colors.grey[500]}
                              >
                                 No photos available
                              </Typography>
                           )}
                        </Box>
                     </Box>
                  </Card>
               );
            })}
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
                        <strong>Status:</strong> {selectedProject.status}
                     </Typography>
                     <Typography
                        variant="body1"
                        color={colors.grey?.[300] || '#ccc'}
                        mb={2}
                     >
                        <strong>Land Size:</strong> {selectedProject.land_size}{' '}
                        hectares
                     </Typography>
                     <Typography
                        variant="body1"
                        color={colors.grey?.[300] || '#ccc'}
                        mb={2}
                     >
                        <strong>Budget Total:</strong> FCFA{' '}
                        {selectedProject.budget_total != null
                           ? Number(
                                selectedProject.budget_total
                             ).toLocaleString()
                           : 'N/A'}
                     </Typography>
                     <Typography
                        variant="body1"
                        color={colors.grey?.[300] || '#ccc'}
                        mb={2}
                     >
                        <strong>Funding Goal:</strong> FCFA{' '}
                        {selectedProject.funding_goal != null
                           ? Number(
                                selectedProject.funding_goal
                             ).toLocaleString()
                           : 'N/A'}
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
                        {selectedProject.description}
                     </Typography>
                     <Typography
                        variant="body1"
                        color={colors.grey?.[300] || '#ccc'}
                        mb={2}
                     >
                        <strong>Timestamp:</strong> {selectedProject.timestamp}
                     </Typography>
                     <Typography
                        variant="body1"
                        color={colors.grey?.[300] || '#ccc'}
                        mb={2}
                     >
                        <strong>Investment per Unit:</strong> FCFA{' '}
                        {selectedProject.unitPrice != null
                           ? Number(selectedProject.unitPrice).toLocaleString()
                           : 'N/A'}
                     </Typography>
                     <Typography
                        variant="body1"
                        color={colors.grey?.[300] || '#ccc'}
                        mb={2}
                     >
                        <strong>Total Units:</strong>{' '}
                        {selectedProject.totalUnits}
                     </Typography>
                     <Typography
                        variant="body1"
                        color={colors.grey?.[300] || '#ccc'}
                        mb={2}
                     >
                        <strong>Expected ROI Range:</strong>{' '}
                        {selectedProject.expected_roi_range}
                     </Typography>
                     <Typography
                        variant="body1"
                        color={colors.grey?.[300] || '#ccc'}
                        mb={2}
                     >
                        <strong>Return Frequency:</strong>{' '}
                        {selectedProject.return_frequency}
                     </Typography>
                     <Typography
                        variant="body1"
                        color={colors.grey?.[300] || '#ccc'}
                        mb={2}
                     >
                        <strong>Return Start Year:</strong>{' '}
                        {selectedProject.return_start_year_or_month}
                     </Typography>
                     <Typography
                        variant="body1"
                        color={colors.grey?.[300] || '#ccc'}
                        mb={2}
                     >
                        <strong>Contract Duration:</strong>{' '}
                        {selectedProject.contract_duration}
                     </Typography>
                     <Typography
                        variant="body1"
                        color={colors.grey?.[300] || '#ccc'}
                        mb={2}
                     >
                        <strong>Annual Net Profit Estimate:</strong>{' '}
                        {selectedProject.annual_net_profit_estimate}
                     </Typography>
                     <Typography
                        variant="body1"
                        color={colors.grey?.[300] || '#ccc'}
                        mb={2}
                     >
                        <strong>Risks & Mitigation:</strong>{' '}
                        {selectedProject.risks_and_mitigation}
                     </Typography>
                     <Typography
                        variant="body1"
                        color={colors.grey?.[300] || '#ccc'}
                        mb={2}
                     >
                        <strong>Pitch Video:</strong>{' '}
                        {selectedProject.pitch_video?.url ? (
                           <a
                              href={selectedProject.pitch_video.url}
                              target="_blank"
                              rel="noopener noreferrer"
                           >
                              {selectedProject.pitch_video.name || 'View Video'}
                           </a>
                        ) : (
                           'N/A'
                        )}
                     </Typography>
                     <Typography
                        variant="body1"
                        color={colors.grey?.[300] || '#ccc'}
                        mb={2}
                     >
                        <strong>Farmer Bio:</strong>{' '}
                        {selectedProject.farmer_bio}
                     </Typography>
                     <Typography
                        variant="body1"
                        color={colors.grey?.[300] || '#ccc'}
                        mb={2}
                     >
                        <strong>Progress:</strong> {selectedProject.progress}%
                     </Typography>
                     <Typography
                        variant="body1"
                        color={colors.grey?.[300] || '#ccc'}
                        mb={2}
                     >
                        <strong>Status:</strong> {selectedProject.status}
                     </Typography>
                     <Typography
                        variant="body1"
                        color={colors.grey?.[300] || '#ccc'}
                        mb={2}
                     >
                        <strong>Farmer:</strong>{' '}
                        {selectedProject.farmer?.name
                           ? selectedProject.farmer.name
                           : 'Unknown'}
                     </Typography>
                     <Typography
                        variant="body1"
                        color={colors.grey?.[300] || '#ccc'}
                        mb={2}
                     >
                        <strong>Start Date:</strong>{' '}
                        {selectedProject.start_date
                           ? new Date(
                                selectedProject.start_date
                             ).toLocaleDateString()
                           : 'N/A'}
                     </Typography>
                     <Typography
                        variant="body1"
                        color={colors.grey?.[300] || '#ccc'}
                        mb={2}
                     >
                        <strong>End Date:</strong>{' '}
                        {selectedProject.end_date
                           ? new Date(
                                selectedProject.end_date
                             ).toLocaleDateString()
                           : 'N/A'}
                     </Typography>
                     <Typography
                        variant="body1"
                        color={colors.grey?.[300] || '#ccc'}
                        mb={2}
                     >
                        <strong>Created At:</strong>{' '}
                        {selectedProject.createdAt
                           ? new Date(
                                selectedProject.createdAt
                             ).toLocaleString()
                           : 'N/A'}
                     </Typography>
                     <Typography
                        variant="body1"
                        color={colors.grey?.[300] || '#ccc'}
                        mb={2}
                     >
                        <strong>Updated At:</strong>{' '}
                        {selectedProject.updatedAt
                           ? new Date(
                                selectedProject.updatedAt
                             ).toLocaleString()
                           : 'N/A'}
                     </Typography>

                     {/* Photos Section in Modal */}
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
                           selectedProject.photos.map((photo, index) => {
                              const url =
                                 typeof photo === 'string' ? photo : photo.url;
                              if (url && /^https?:\/\//i.test(url)) {
                                 return (
                                    <Box
                                       key={index}
                                       sx={{
                                          position: 'relative',
                                          cursor: 'pointer',
                                       }}
                                       onClick={() => handleImageClick(url)}
                                    >
                                       <Box
                                          component="img"
                                          src={url}
                                          alt={`Project Photo ${index + 1}`}
                                          sx={{
                                             width: '150px',
                                             height: '150px',
                                             objectFit: 'cover',
                                             borderRadius: '8px',
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
                                             backgroundColor:
                                                'rgba(0, 0, 0, 0.5)',
                                             borderRadius: '50%',
                                             padding: '2px',
                                          }}
                                       />
                                    </Box>
                                 );
                              }
                              return null;
                           })
                        ) : (
                           <Typography
                              variant="body2"
                              color={colors.grey?.[300] || '#ccc'}
                           >
                              No photos available
                           </Typography>
                        )}
                     </Box>

                     <Box display="flex" justifyContent="space-between" mt={4}>
                        {selectedProject.status === 'submitted' && (
                           <>
                              <Button
                                 variant="contained"
                                 color="success"
                                 onClick={() =>
                                    handleApprove(selectedProject._id)
                                 }
                                 startIcon={<CheckCircleOutlineIcon />}
                              >
                                 Approve
                              </Button>
                              <Button
                                 variant="contained"
                                 color="error"
                                 onClick={() =>
                                    handleReject(selectedProject._id)
                                 }
                                 startIcon={<CancelOutlinedIcon />}
                              >
                                 Reject
                              </Button>
                           </>
                        )}
                        {selectedProject.status === 'active' && (
                           <Button
                              variant="contained"
                              color="error"
                              onClick={() => handleStop(selectedProject._id)}
                              startIcon={<CancelOutlinedIcon />}
                           >
                              Stop Project
                           </Button>
                        )}
                        {/* Approve completion for pending_completion */}
                        {selectedProject.status === 'pending_completion' && (
                           <Button
                              variant="contained"
                              color="success"
                              onClick={() =>
                                 handleApproveCompletion(selectedProject._id)
                              }
                              startIcon={<CheckCircleOutlineIcon />}
                           >
                              Approve Completion
                           </Button>
                        )}
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
