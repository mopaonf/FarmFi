import React, { useState, useEffect, useRef } from 'react';
import {
   Typography,
   // Grid,
   Card,
   Box,
   LinearProgress,
   useTheme,
   Button,
   Divider,
   // Chip,
   // IconButton,
   // Tooltip,
   MenuItem,
   Select,
   FormControl,
   InputLabel,
   TextField,
   Alert,
} from '@mui/material';
import { tokens } from '../../theme';
// import { projects } from '../../data/mockData';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import axios from 'axios';
import Modal from '@mui/material/Modal';
import Collapse from '@mui/material/Collapse';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const filterOptions = [
   { value: 'active', label: 'Active' },
   { value: 'submitted', label: 'Submitted' },
   { value: 'completed', label: 'Completed' },
   { value: 'denied', label: 'Denied' },
   { value: 'funded', label: 'Funded' },
];

const Projects = () => {
   const theme = useTheme();
   const colors = tokens(theme.palette.mode);
   const [scrolled, setScrolled] = useState(false);
   const [selectedFilter, setSelectedFilter] = useState('Active');
   const projectsRef = useRef(null);
   const headerHeight = 64;
   const headerRef = useRef(null);
   const [headerWidth, setHeaderWidth] = useState(0);
   const [projectsData, setProjectsData] = useState([]);
   const [loading, setLoading] = useState(true);
   const [expandedCards, setExpandedCards] = useState({});
   const [imageModalOpen, setImageModalOpen] = useState(false);
   const [selectedImageUrl, setSelectedImageUrl] = useState(null);
   const [completionModalOpen, setCompletionModalOpen] = useState(false);
   const [completionForm, setCompletionForm] = useState({ notes: '' });
   const [completionSubmitting, setCompletionSubmitting] = useState(false);
   const [completionError, setCompletionError] = useState('');
   const [completionSuccess, setCompletionSuccess] = useState('');
   const [selectedProjectId, setSelectedProjectId] = useState(null);
   const [profitModalOpen, setProfitModalOpen] = useState(false);
   const [profitForm, setProfitForm] = useState({ amount: '', notes: '' });
   const [profitSubmitting, setProfitSubmitting] = useState(false);
   const [profitError, setProfitError] = useState('');
   const [profitSuccess, setProfitSuccess] = useState('');

   const handleShowMoreToggle = (id) => {
      setExpandedCards((prev) => ({
         ...prev,
         [id]: !prev[id],
      }));
   };

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

   useEffect(() => {
      const fetchProjects = async () => {
         setLoading(true);
         try {
            const token = localStorage.getItem('token');
            const res = await axios.get(
               'http://localhost:5000/api/farmers/projects',
               {
                  headers: { Authorization: `Bearer ${token}` },
               }
            );
            setProjectsData(res.data);
         } catch (err) {
            setProjectsData([]);
         }
         setLoading(false);
      };
      fetchProjects();
   }, []);

   // Filter projects by status (case-insensitive)
   const filteredProjects = projectsData.filter(
      (project) =>
         project.status &&
         (selectedFilter.toLowerCase() === 'completed'
            ? ['completed'].includes(project.status.toLowerCase())
            : project.status.toLowerCase() === selectedFilter.toLowerCase())
   );

   // Handle completion form open
   const handleOpenCompletionModal = (projectId) => {
      setSelectedProjectId(projectId);
      setCompletionForm({ notes: '' });
      setCompletionError('');
      setCompletionSuccess('');
      setCompletionModalOpen(true);
   };

   // Handle completion form submit
   const handleCompletionSubmit = async (e) => {
      e.preventDefault();
      setCompletionSubmitting(true);
      setCompletionError('');
      setCompletionSuccess('');
      try {
         const token = localStorage.getItem('token');
         // You may need to adjust the endpoint and payload as per your backend
         await axios.post(
            `http://localhost:5000/api/farmers/projects/${selectedProjectId}/request-completion`,
            { notes: completionForm.notes },
            { headers: { Authorization: `Bearer ${token}` } }
         );
         setCompletionSuccess(
            'Completion request submitted for admin approval.'
         );
         setCompletionModalOpen(false);
         // Optionally, refresh projects list
         // ...fetchProjects()...
      } catch (err) {
         setCompletionError(
            err?.response?.data?.message ||
               'Failed to submit completion request.'
         );
      }
      setCompletionSubmitting(false);
   };

   // Handle profit form open
   const handleOpenProfitModal = (projectId) => {
      setSelectedProjectId(projectId);
      setProfitForm({ amount: '', notes: '' });
      setProfitError('');
      setProfitSuccess('');
      setProfitModalOpen(true);
   };

   // Handle profit form submit
   const handleProfitSubmit = async (e) => {
      e.preventDefault();
      setProfitSubmitting(true);
      setProfitError('');
      setProfitSuccess('');
      try {
         const token = localStorage.getItem('token');
         // Call backend to submit profit (this will deduct from wallet and record a transaction)
         await axios.post(
            `http://localhost:5000/api/farmers/projects/${selectedProjectId}/submit-profit`,
            { amount: profitForm.amount, notes: profitForm.notes },
            { headers: { Authorization: `Bearer ${token}` } }
         );
         setProfitSuccess(
            'Profit submitted for admin approval and recorded as a transaction.'
         );
         setProfitModalOpen(false);
         // Optionally, refresh wallet/transactions here if you want to show the new transaction line
      } catch (err) {
         setProfitError(
            err?.response?.data?.message || 'Failed to submit profit.'
         );
      }
      setProfitSubmitting(false);
   };

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

            {/* Filter Dropdown */}
            <Box
               display="flex"
               justifyContent="flex-start"
               alignItems="center"
               mt={2}
            >
               <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel
                     id="project-filter-label"
                     sx={{ color: colors.grey[100] }}
                  >
                     Filter by Status
                  </InputLabel>
                  <Select
                     labelId="project-filter-label"
                     id="project-filter"
                     value={selectedFilter}
                     label="Filter by Status"
                     onChange={(e) => setSelectedFilter(e.target.value)}
                     sx={{
                        color: colors.greenAccent[400],
                        background: colors.primary[400],
                        '.MuiOutlinedInput-notchedOutline': {
                           borderColor: colors.greenAccent[400],
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                           borderColor: colors.greenAccent[400],
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                           borderColor: colors.greenAccent[400],
                        },
                        '.MuiSvgIcon-root ': {
                           fill: colors.greenAccent[400],
                        },
                     }}
                  >
                     {filterOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                           {option.label}
                        </MenuItem>
                     ))}
                  </Select>
               </FormControl>
            </Box>
         </Box>

         {/* Add padding top when header is fixed to prevent content jump */}
         <Box sx={{ paddingTop: scrolled ? '120px' : 0 }}>
            {filteredProjects.length === 0 && (
               <Box
                  sx={{
                     display: 'flex',
                     flexDirection: 'column',
                     alignItems: 'center',
                     justifyContent: 'center',
                     minHeight: '40vh',
                     color: colors.grey[400],
                  }}
               >
                  <InfoOutlinedIcon
                     sx={{
                        fontSize: 60,
                        mb: 2,
                        color: colors.greenAccent[400],
                     }}
                  />
                  <Typography variant="h5" fontWeight="bold" mb={1}>
                     No Projects Found
                  </Typography>
                  <Typography variant="body1" color={colors.grey[300]}>
                     You currently have no projects in this category.
                  </Typography>
               </Box>
            )}
            {filteredProjects.map((project, index) => {
               const isExpanded = expandedCards[project._id || project.id];
               // Calculate dynamic values
               const unitsSold =
                  typeof project.unitsInvested === 'number'
                     ? project.unitsInvested
                     : project.unitsSold || 0;
               const totalUnits =
                  typeof project.totalUnits === 'number'
                     ? project.totalUnits
                     : 0;
               const availableUnits = totalUnits - unitsSold;
               const unitPrice =
                  typeof project.unitPrice === 'number' ? project.unitPrice : 0;
               const totalInvestment =
                  typeof project.totalInvestment === 'number'
                     ? project.totalInvestment
                     : unitsSold * unitPrice;
               const fundingProgress =
                  totalUnits > 0
                     ? Math.round((unitsSold / totalUnits) * 100)
                     : 0;
               const isFunded = project.status?.toLowerCase() === 'funded';
               const isPendingCompletion =
                  project.status?.toLowerCase() === 'pending_completion' ||
                  project.status?.toLowerCase() === 'awaiting_admin_completion';
               const isCompleted =
                  project.status?.toLowerCase() === 'completed';

               return (
                  <Card
                     key={project._id || project.id || index}
                     sx={{
                        display: 'block',
                        p: { xs: 2, md: 4 },
                        mb: 5,
                        borderRadius: 3,
                        boxShadow: '0px 8px 32px rgba(0,0,0,0.10)',
                        width: '100%',
                        maxWidth: '100%',
                        transition:
                           'box-shadow 0.5s cubic-bezier(.25,.8,.25,1), color 0.5s',
                        position: 'relative',
                        background: `linear-gradient(90deg, ${colors.primary[400]} 0%, ${colors.greenAccent[200]} 100%)`,
                        color: colors.grey[300],
                        '&:hover': {
                           boxShadow:
                              '0px 24px 48px 0px rgba(0,0,0,0.25), 0px 1.5px 8px 0px rgba(0,0,0,0.10)',
                           color: colors.grey[300],
                           fontWeight: 600,
                           transition:
                              'box-shadow 0.5s cubic-bezier(.25,.8,.25,1), color 0.5s, font-weight 0.3s',
                           '& .MuiTypography-root': {
                              color: `${colors.grey[300]} !important`,
                              fontWeight: 600,
                           },
                           '& .project-description-box': {
                              borderColor: colors.grey[100],
                           },
                        },
                     }}
                  >
                     {/* Main Content */}
                     <Box
                        sx={{
                           display: 'flex',
                           flexDirection: { xs: 'column', md: 'row' },
                           width: '100%',
                           gap: { xs: 2, md: 4 },
                        }}
                     >
                        {/* Left Section: Project Details */}
                        <Box flex="1" pr={{ md: 3 }}>
                           <Typography
                              variant="h5"
                              fontWeight="bold"
                              color={colors.greenAccent[400]}
                              mb={1}
                              sx={{ letterSpacing: 1 }}
                           >
                              {project.title}
                           </Typography>
                           <Typography
                              variant="subtitle2"
                              color={colors.grey[200]}
                              mb={2}
                              sx={{ fontStyle: 'italic' }}
                           >
                              {project.category || 'Uncategorized'} &mdash;{' '}
                              {project.location || 'Location N/A'}
                           </Typography>
                           <Box mb={1}>
                              <Typography
                                 variant="body2"
                                 color={colors.grey[300]}
                              >
                                 <strong>Land Size:</strong>{' '}
                                 <span
                                    style={{ color: colors.greenAccent[300] }}
                                 >
                                    {project.land_size != null
                                       ? `${project.land_size} hectares`
                                       : 'N/A'}
                                 </span>
                              </Typography>
                              <Typography
                                 variant="body2"
                                 color={colors.grey[300]}
                              >
                                 <strong>Budget:</strong>{' '}
                                 <span
                                    style={{ color: colors.greenAccent[300] }}
                                 >
                                    FCFA{' '}
                                    {project.budget_total != null
                                       ? Number(
                                            project.budget_total
                                         ).toLocaleString()
                                       : 'N/A'}
                                 </span>
                              </Typography>
                              <Typography
                                 variant="body2"
                                 color={colors.grey[300]}
                              >
                                 <strong>Funding Goal:</strong>{' '}
                                 <span
                                    style={{ color: colors.greenAccent[300] }}
                                 >
                                    FCFA{' '}
                                    {project.funding_goal != null
                                       ? Number(
                                            project.funding_goal
                                         ).toLocaleString()
                                       : 'N/A'}
                                 </span>
                              </Typography>
                              <Typography
                                 variant="body2"
                                 color={colors.grey[300]}
                              >
                                 <strong>Duration:</strong>{' '}
                                 <span
                                    style={{ color: colors.greenAccent[300] }}
                                 >
                                    {project.duration_in_months || 'N/A'} months
                                 </span>
                              </Typography>
                              <Typography
                                 variant="body2"
                                 color={colors.grey[300]}
                              >
                                 <strong>Created:</strong>{' '}
                                 <span
                                    style={{ color: colors.greenAccent[300] }}
                                 >
                                    {project.createdAt
                                       ? new Date(
                                            project.createdAt
                                         ).toLocaleString()
                                       : 'N/A'}
                                 </span>
                              </Typography>
                           </Box>
                           <Divider
                              sx={{
                                 my: 1,
                                 background: colors.greenAccent[700],
                              }}
                           />
                           <Box display="flex" gap={3} flexWrap="wrap" mt={1}>
                              <Box>
                                 <Typography
                                    variant="caption"
                                    color={colors.grey[200]}
                                 >
                                    Units Sold
                                 </Typography>
                                 <Typography
                                    variant="h6"
                                    color={colors.greenAccent[400]}
                                    fontWeight="bold"
                                 >
                                    {unitsSold}
                                 </Typography>
                              </Box>
                              <Box>
                                 <Typography
                                    variant="caption"
                                    color={colors.grey[200]}
                                 >
                                    Available Units
                                 </Typography>
                                 <Typography
                                    variant="h6"
                                    color={colors.greenAccent[400]}
                                    fontWeight="bold"
                                 >
                                    {availableUnits}
                                 </Typography>
                              </Box>
                              <Box>
                                 <Typography
                                    variant="caption"
                                    color={colors.grey[200]}
                                 >
                                    Raised
                                 </Typography>
                                 <Typography
                                    variant="h6"
                                    color={colors.greenAccent[400]}
                                    fontWeight="bold"
                                 >
                                    FCFA{' '}
                                    {Number(totalInvestment).toLocaleString()}
                                 </Typography>
                              </Box>
                           </Box>
                        </Box>
                        {/* Center Section: Funding Progress */}
                        <Box
                           flex="1"
                           pr={{ md: 3 }}
                           sx={{
                              backgroundColor: 'transparent',
                              p: 2,
                           }}
                        >
                           <Typography
                              variant="subtitle2"
                              color={colors.grey[200]}
                              mb={1}
                              fontWeight="bold"
                              sx={{ letterSpacing: 0.5 }}
                           >
                              Funding Progress
                           </Typography>
                           <LinearProgress
                              variant="determinate"
                              value={fundingProgress}
                              sx={{
                                 height: 12,
                                 borderRadius: 6,
                                 backgroundColor: 'transparent',
                                 '& .MuiLinearProgress-bar': {
                                    backgroundColor: colors.greenAccent[400],
                                 },
                                 border: `1px solid ${colors.grey[100]}`,
                              }}
                           />
                           <Typography
                              variant="h6"
                              color={colors.greenAccent[400]}
                              mt={1}
                              fontWeight="bold"
                           >
                              {fundingProgress}% Funded
                           </Typography>
                           {/* Photos Section */}
                           <Box mt={4} mb={2}>
                              <Typography
                                 variant="subtitle2"
                                 color={colors.grey[200]}
                                 mb={1}
                                 fontWeight="bold"
                              >
                                 Project Gallery
                              </Typography>
                              <Box display="flex" gap={1} flexWrap="wrap">
                                 {project.photos?.length > 0 ? (
                                    project.photos.map((photo, i) => {
                                       const url =
                                          typeof photo === 'string'
                                             ? photo
                                             : photo.url;
                                       if (url && /^https?:\/\//i.test(url)) {
                                          return (
                                             <Box
                                                key={i}
                                                sx={{
                                                   position: 'relative',
                                                   cursor: 'pointer',
                                                   border: `2px solid ${colors.greenAccent[400]}`,
                                                   borderRadius: '10px',
                                                   overflow: 'hidden',
                                                   transition: 'transform 0.2s',
                                                   '&:hover': {
                                                      transform: 'scale(1.07)',
                                                      boxShadow: `0 0 12px ${colors.greenAccent[400]}`,
                                                   },
                                                }}
                                                onClick={() => {
                                                   setSelectedImageUrl(url);
                                                   setImageModalOpen(true);
                                                }}
                                             >
                                                <Box
                                                   component="img"
                                                   src={url}
                                                   alt={`Project Photo ${
                                                      i + 1
                                                   }`}
                                                   sx={{
                                                      width: '80px',
                                                      height: '80px',
                                                      objectFit: 'cover',
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
                        </Box>
                        {/* Right Section: Description */}
                        <Box flex="1">
                           <Typography
                              variant="subtitle2"
                              color={colors.grey[200]}
                              mb={1}
                              fontWeight="bold"
                           >
                              Project Description
                           </Typography>
                           <Box
                              className="project-description-box"
                              sx={{
                                 backgroundColor: 'transparent',
                                 padding: 2,
                                 borderRadius: '10px',
                                 minHeight: '100px',
                                 maxHeight: '180px',
                                 overflowY: 'auto',
                                 border: `1px solid ${colors.grey[100]}`,
                                 boxShadow: 'none',
                                 transition: 'border-color 0.3s',
                              }}
                           >
                              <Typography
                                 variant="body2"
                                 color={colors.grey[100]}
                                 sx={{
                                    color: `${colors.grey[100]} !important`,
                                 }}
                              >
                                 {project.description ||
                                    'No description available for this project.'}
                              </Typography>
                           </Box>
                        </Box>
                     </Box>
                     {/* Expanded Details - Collapse for smooth transition */}
                     <Collapse
                        in={isExpanded}
                        timeout="auto"
                        unmountOnExit
                        sx={{
                           backgroundColor: 'transparent',
                        }}
                     >
                        <Box
                           mt={3}
                           p={2}
                           bgcolor="transparent"
                           borderRadius={2}
                        >
                           <Divider
                              sx={{
                                 mb: 2,
                                 backgroundColor: colors.greenAccent[700],
                              }}
                           />
                           <Typography
                              variant="h6"
                              color={colors.greenAccent[400]}
                              fontWeight="bold"
                              mb={2}
                           >
                              Additional Project Details
                           </Typography>
                           <Box
                              display="grid"
                              gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }}
                              gap={2}
                           >
                              {/* Use gray for all info text */}
                              <Typography
                                 variant="body2"
                                 sx={{ color: colors.grey[300] }}
                              >
                                 <strong>Investment per Unit:</strong> FCFA{' '}
                                 {project.unitPrice != null
                                    ? Number(project.unitPrice).toLocaleString()
                                    : 'N/A'}
                              </Typography>
                              <Typography
                                 variant="body2"
                                 sx={{ color: colors.grey[300] }}
                              >
                                 <strong>Total Units:</strong>{' '}
                                 {project.totalUnits}
                              </Typography>
                              <Typography
                                 variant="body2"
                                 sx={{ color: colors.grey[300] }}
                              >
                                 <strong>Expected ROI Range:</strong>{' '}
                                 {project.expected_roi_range || 'N/A'}
                              </Typography>
                              <Typography
                                 variant="body2"
                                 sx={{ color: colors.grey[300] }}
                              >
                                 <strong>Return Frequency:</strong>{' '}
                                 {project.return_frequency || 'N/A'}
                              </Typography>
                              <Typography
                                 variant="body2"
                                 sx={{ color: colors.grey[300] }}
                              >
                                 <strong>Return Start:</strong>{' '}
                                 {project.return_start_year_or_month || 'N/A'}
                              </Typography>
                              <Typography
                                 variant="body2"
                                 sx={{ color: colors.grey[300] }}
                              >
                                 <strong>Contract Duration:</strong>{' '}
                                 {project.contract_duration || 'N/A'}
                              </Typography>
                              <Typography
                                 variant="body2"
                                 sx={{ color: colors.grey[300] }}
                              >
                                 <strong>Annual Net Profit Estimate:</strong>{' '}
                                 {project.annual_net_profit_estimate || 'N/A'}
                              </Typography>
                              <Typography
                                 variant="body2"
                                 sx={{ color: colors.grey[300] }}
                              >
                                 <strong>Risks & Mitigation:</strong>{' '}
                                 {project.risks_and_mitigation || 'N/A'}
                              </Typography>
                              <Typography
                                 variant="body2"
                                 sx={{ color: colors.grey[300] }}
                              >
                                 <strong>Pitch Video:</strong>{' '}
                                 {project.pitch_video?.url ? (
                                    <a
                                       href={project.pitch_video.url}
                                       target="_blank"
                                       rel="noopener noreferrer"
                                       style={{
                                          color: colors.greenAccent[400],
                                          textDecoration: 'underline',
                                       }}
                                    >
                                       {project.pitch_video.name ||
                                          'View Video'}
                                    </a>
                                 ) : (
                                    'N/A'
                                 )}
                              </Typography>
                              <Typography
                                 variant="body2"
                                 sx={{ color: colors.grey[300] }}
                              >
                                 <strong>Farmer Bio:</strong>{' '}
                                 {project.farmer_bio || 'N/A'}
                              </Typography>
                              <Typography
                                 variant="body2"
                                 sx={{ color: colors.grey[300] }}
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
                                 sx={{ color: colors.grey[300] }}
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
                                 sx={{ color: colors.grey[300] }}
                              >
                                 <strong>Created At:</strong>{' '}
                                 {project.createdAt
                                    ? new Date(
                                         project.createdAt
                                      ).toLocaleString()
                                    : 'N/A'}
                              </Typography>
                              <Typography
                                 variant="body2"
                                 sx={{ color: colors.grey[300] }}
                              >
                                 <strong>Updated At:</strong>{' '}
                                 {project.updatedAt
                                    ? new Date(
                                         project.updatedAt
                                      ).toLocaleString()
                                    : 'N/A'}
                              </Typography>
                           </Box>
                        </Box>
                     </Collapse>
                     {/* Show More/Less Button - Absolutely at the bottom center */}
                     <Box
                        sx={{
                           width: '100%',
                           display: 'flex',
                           justifyContent: 'center',
                           mt: 3,
                           gap: 2,
                        }}
                     >
                        <Button
                           size="medium"
                           variant={isExpanded ? 'contained' : 'outlined'}
                           color="success"
                           sx={{
                              fontWeight: 'bold',
                              letterSpacing: 1,
                              px: 4,
                              py: 1.5,
                              borderRadius: 2,
                              boxShadow: isExpanded
                                 ? `0 2px 12px ${colors.greenAccent[400]}44`
                                 : 'none',
                              transition: 'all 0.2s',
                           }}
                           onClick={(e) => {
                              e.stopPropagation();
                              handleShowMoreToggle(project._id || project.id);
                           }}
                        >
                           {isExpanded ? 'Hide Details' : 'Show More'}
                        </Button>
                        {/* Mark as Completed button for Funded projects */}
                        {isFunded && !isPendingCompletion && (
                           <Button
                              size="medium"
                              variant="contained"
                              color="primary"
                              sx={{
                                 fontWeight: 'bold',
                                 letterSpacing: 1,
                                 px: 4,
                                 py: 1.5,
                                 borderRadius: 2,
                                 background: colors.greenAccent[400],
                                 color: colors.primary[900],
                                 '&:hover': {
                                    background: colors.greenAccent[300],
                                 },
                              }}
                              onClick={() =>
                                 handleOpenCompletionModal(
                                    project._id || project.id
                                 )
                              }
                           >
                              Mark as Completed
                           </Button>
                        )}
                        {/* Add Profit button for Completed projects */}
                        {isCompleted && (
                           <Button
                              size="medium"
                              variant="contained"
                              color="primary"
                              sx={{
                                 fontWeight: 'bold',
                                 letterSpacing: 1,
                                 px: 4,
                                 py: 1.5,
                                 borderRadius: 2,
                                 background: colors.greenAccent[400],
                                 color: colors.primary[900],
                                 '&:hover': {
                                    background: colors.greenAccent[300],
                                 },
                              }}
                              onClick={() =>
                                 handleOpenProfitModal(
                                    project._id || project.id
                                 )
                              }
                           >
                              Add Profit
                           </Button>
                        )}
                        {/* Show pending message if already requested */}
                        {isPendingCompletion && (
                           <Alert severity="info" sx={{ alignItems: 'center' }}>
                              Completion request pending admin approval.
                           </Alert>
                        )}
                     </Box>
                  </Card>
               );
            })}
         </Box>
         {/* Image Modal */}
         <Modal
            open={imageModalOpen}
            onClose={() => setImageModalOpen(false)}
            aria-labelledby="project-image-modal"
            aria-describedby="project-image-modal-description"
         >
            <Box
               sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  maxWidth: '90vw',
                  maxHeight: '90vh',
                  outline: 'none',
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  boxShadow: 24,
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
               }}
            >
               {selectedImageUrl && (
                  <img
                     src={selectedImageUrl}
                     alt="Project Large"
                     style={{
                        maxWidth: '80vw',
                        maxHeight: '80vh',
                        borderRadius: 8,
                        boxShadow: '0px 4px 24px rgba(0,0,0,0.25)',
                     }}
                  />
               )}
            </Box>
         </Modal>

         {/* Completion Modal */}
         <Modal
            open={completionModalOpen}
            onClose={() => setCompletionModalOpen(false)}
            aria-labelledby="completion-modal-title"
            aria-describedby="completion-modal-description"
         >
            <Box
               sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 400,
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  boxShadow: 24,
                  p: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
               }}
               component="form"
               onSubmit={handleCompletionSubmit}
            >
               <Typography
                  id="completion-modal-title"
                  variant="h6"
                  fontWeight="bold"
                  mb={2}
               >
                  Project Completion Form
               </Typography>
               <TextField
                  label="Completion Notes"
                  multiline
                  minRows={3}
                  value={completionForm.notes}
                  onChange={(e) =>
                     setCompletionForm((prev) => ({
                        ...prev,
                        notes: e.target.value,
                     }))
                  }
                  fullWidth
                  required
               />
               {completionError && (
                  <Alert severity="error">{completionError}</Alert>
               )}
               {completionSuccess && (
                  <Alert severity="success">{completionSuccess}</Alert>
               )}
               <Box display="flex" justifyContent="flex-end" gap={2}>
                  <Button
                     onClick={() => setCompletionModalOpen(false)}
                     color="secondary"
                     variant="outlined"
                     disabled={completionSubmitting}
                  >
                     Cancel
                  </Button>
                  <Button
                     type="submit"
                     color="success"
                     variant="contained"
                     disabled={completionSubmitting}
                  >
                     {completionSubmitting
                        ? 'Submitting...'
                        : 'Confirm Completion'}
                  </Button>
               </Box>
            </Box>
         </Modal>

         {/* Profit Modal */}
         <Modal
            open={profitModalOpen}
            onClose={() => setProfitModalOpen(false)}
            aria-labelledby="profit-modal-title"
            aria-describedby="profit-modal-description"
         >
            <Box
               sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 400,
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  boxShadow: 24,
                  p: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
               }}
               component="form"
               onSubmit={handleProfitSubmit}
            >
               <Typography
                  id="profit-modal-title"
                  variant="h6"
                  fontWeight="bold"
                  mb={2}
               >
                  Add Project Profit
               </Typography>
               <TextField
                  label="Profit Amount"
                  type="number"
                  value={profitForm.amount}
                  onChange={(e) =>
                     setProfitForm((prev) => ({
                        ...prev,
                        amount: e.target.value,
                     }))
                  }
                  fullWidth
                  required
                  inputProps={{ min: 1 }}
               />
               <TextField
                  label="Notes"
                  multiline
                  minRows={2}
                  value={profitForm.notes}
                  onChange={(e) =>
                     setProfitForm((prev) => ({
                        ...prev,
                        notes: e.target.value,
                     }))
                  }
                  fullWidth
               />
               {profitError && <Alert severity="error">{profitError}</Alert>}
               {profitSuccess && (
                  <Alert severity="success">{profitSuccess}</Alert>
               )}
               <Box display="flex" justifyContent="flex-end" gap={2}>
                  <Button
                     onClick={() => setProfitModalOpen(false)}
                     color="secondary"
                     variant="outlined"
                     disabled={profitSubmitting}
                  >
                     Cancel
                  </Button>
                  <Button
                     type="submit"
                     color="success"
                     variant="contained"
                     disabled={profitSubmitting}
                  >
                     {profitSubmitting ? 'Submitting...' : 'Submit Profit'}
                  </Button>
               </Box>
            </Box>
         </Modal>
      </Box>
   );
};

export default Projects;
