import React, { useState, useEffect, useRef } from 'react';
import {
   Typography,
   // Grid,
   Card,
   Box,
   LinearProgress,
   useTheme,
   // Chip,
   // Button,
   // IconButton,
   // Tooltip,
} from '@mui/material';
import { tokens } from '../../theme';
import { projects } from '../../data/mockData';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const Projects = () => {
   const theme = useTheme();
   const colors = tokens(theme.palette.mode);
   const [scrolled, setScrolled] = useState(false);
   const [selectedFilter, setSelectedFilter] = useState('Active');
   const projectsRef = useRef(null);
   const headerHeight = 64;
   const headerRef = useRef(null);
   const [headerWidth, setHeaderWidth] = useState(0);

   // Handle scroll event to set fixed header
   useEffect(() => {
      const handleScroll = () => {
         if (!projectsRef.current) return;

         const scrollPosition = window.scrollY;
         const projectsOffset =
            projectsRef.current.getBoundingClientRect().top + scrollPosition;

         if (scrollPosition > projectsOffset - headerHeight) {
            setScrolled(true);
         } else {
            setScrolled(false);
         }
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
   }, [headerHeight]);

   // Calculate header width on mount and window resize
   useEffect(() => {
      if (headerRef.current) {
         setHeaderWidth(headerRef.current.offsetWidth);
      }

      const handleResize = () => {
         if (headerRef.current) {
            setHeaderWidth(headerRef.current.offsetWidth);
         }
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
   }, []);

   // Filter projects by status
   const filteredProjects = projects.filter(
      (project) => project.status === selectedFilter
   );

   return (
      <Box ref={projectsRef} sx={{ position: 'relative' }}>
         {/* HEADER */}
         <Box
            ref={headerRef}
            sx={{
               position: scrolled ? 'fixed' : 'relative',
               top: scrolled ? headerHeight : 'auto',
               zIndex: 100,
               backgroundColor: colors.primary[400],
               padding: '15px 20px',
               marginBottom: '40px',
               boxShadow: scrolled
                  ? '0px 2px 10px rgba(0, 0, 0, 0.15)'
                  : 'none',
               transition: 'all 0.3s ease',
               width: scrolled ? headerWidth - 40 : '100%',
               borderRadius: '4px 4px 0 0',
            }}
         >
            <Box
               display="flex"
               justifyContent="space-between"
               alignItems="center"
            >
               <Box>
                  <Typography
                     variant="h5"
                     fontWeight="bold"
                     color={colors.grey[100]}
                     sx={{ mb: '5px' }}
                  >
                     PROJECTS
                  </Typography>
                  <Typography variant="h7" color={colors.greenAccent[400]}>
                     Welcome to your farmer projects
                  </Typography>
               </Box>
            </Box>

            {/* Filters */}
            <Box
               display="flex"
               justifyContent="space-around"
               alignItems="center"
               mt={2}
            >
               {['Active', 'Submitted', 'Denied', 'Completed'].map((filter) => (
                  <Typography
                     key={filter}
                     variant="h6"
                     color={
                        selectedFilter === filter
                           ? colors.greenAccent[400]
                           : colors.grey[100]
                     }
                     sx={{
                        cursor: 'pointer',
                        position: 'relative',
                        paddingBottom: '5px',
                        '&:hover': {
                           color: colors.greenAccent[400],
                        },
                        '&::after': {
                           content: '""',
                           position: 'absolute',
                           bottom: 0,
                           left: '50%',
                           width: selectedFilter === filter ? '250px' : '0',
                           height: '3px',
                           backgroundColor: colors.greenAccent[400],
                           transform: 'translateX(-50%)',
                           transition:
                              selectedFilter === filter
                                 ? 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                                 : 'none',
                        },
                     }}
                     onClick={() => setSelectedFilter(filter)}
                  >
                     {filter}
                  </Typography>
               ))}
            </Box>
         </Box>

         {/* Add padding top when header is fixed to prevent content jump */}
         <Box sx={{ paddingTop: scrolled ? '120px' : 0 }}>
            {filteredProjects.map((project, index) => (
               <Card
                  key={index}
                  sx={{
                     display: 'flex',
                     flexDirection: { xs: 'column', md: 'row' },
                     alignItems: 'flex-start',
                     justifyContent: 'space-between',
                     p: 3,
                     mb: 4, // Increased margin-bottom for more space between cards
                     borderRadius: 2,
                     boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)', // Increased box shadow for distinction
                     maxWidth: '1750px',
                     // margin: '5',
                     transition: 'box-shadow 0.3s ease',
                     '&:hover': {
                        boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.3)', // Enhanced hover effect
                     },
                  }}
               >
                  {/* Left Section: Project Details */}
                  <Box flex="1" pr={3}>
                     <Typography
                        variant="h6"
                        fontWeight="bold"
                        color={colors.greenAccent[600]}
                        mb={1}
                     >
                        {project.title}
                     </Typography>
                     <Typography
                        variant="body2"
                        color={colors.grey[700]}
                        mb={1}
                     >
                        <strong>Category:</strong> {project.category || 'N/A'}
                     </Typography>
                     <Typography
                        variant="body2"
                        color={colors.grey[700]}
                        mb={1}
                     >
                        <strong>Location:</strong> {project.location || 'N/A'}
                     </Typography>
                     <Typography
                        variant="body2"
                        color={colors.grey[700]}
                        mb={1}
                     >
                        <strong>Land Size:</strong> {project.landSize || 'N/A'}{' '}
                        hectares
                     </Typography>
                     <Typography
                        variant="body2"
                        color={colors.grey[700]}
                        mb={1}
                     >
                        <strong>Budget Total:</strong> FCFA{' '}
                        {project.budgetTotal?.toLocaleString() || 'N/A'}
                     </Typography>
                     <Typography
                        variant="body2"
                        color={colors.grey[700]}
                        mb={1}
                     >
                        <strong>Funding Goal:</strong> FCFA{' '}
                        {project.fundingGoal?.toLocaleString() || 'N/A'}
                     </Typography>
                     <Typography
                        variant="body2"
                        color={colors.grey[700]}
                        mb={1}
                     >
                        <strong>Duration:</strong>{' '}
                        {project.duration_in_months || 'N/A'} months
                     </Typography>
                     <Typography
                        variant="body2"
                        color={colors.grey[700]}
                        mb={1}
                     >
                        <strong>Timestamp:</strong> {project.timestamp || 'N/A'}
                     </Typography>
                  </Box>

                  {/* Center Section: Funding Progress - Keeping exactly as original */}
                  <Box flex="1" pr={3}>
                     <Typography
                        variant="body2"
                        color={colors.grey[700]}
                        mb={1}
                     >
                        <strong>Funding Progress:</strong>
                     </Typography>
                     <LinearProgress
                        variant="determinate"
                        value={project.progress}
                        sx={{
                           height: 8,
                           borderRadius: 4,
                           backgroundColor: '#e0e0e0',
                           '& .MuiLinearProgress-bar': {
                              backgroundColor: colors.greenAccent[400],
                           },
                        }}
                     />
                     <Typography
                        variant="body2"
                        color={colors.grey[700]}
                        mt={1}
                     >
                        {project.progress}% Funded
                     </Typography>
                     {/* Photos Section - Keeping exactly as original */}
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
                              ))
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
                  </Box>

                  {/* Right Section: Description */}
                  <Box flex="1">
                     <Typography
                        variant="body2"
                        color={colors.grey[700]}
                        mb={1}
                     >
                        <strong>Description:</strong>
                     </Typography>
                     <Box
                        sx={{
                           backgroundColor: colors.primary[100],
                           padding: 2,
                           borderRadius: '8px',
                           maxHeight: '150px',
                           overflowY: 'auto',
                           boxShadow: 'inset 0px 2px 5px rgba(0, 0, 0, 0.1)',
                        }}
                     >
                        <Typography variant="body2" color={colors.grey[700]}>
                           {project.documentation ||
                              'No description available.'}
                        </Typography>
                     </Box>
                  </Box>
               </Card>
            ))}
         </Box>
      </Box>
   );
};

export default Projects;
