import React, { useState, useRef } from 'react';
import {
   Box,
   TextField,
   Typography,
   Button,
   Grid,
   MenuItem,
   InputAdornment,
   Stepper,
   Step,
   StepLabel,
   // FormControl,
   // FormHelperText,
   Paper,
   Divider,
   IconButton,
   Chip,
   Stack,
   useTheme,
   FormControlLabel,
   Switch,
   Tooltip,
   CircularProgress,
   Alert,
} from '@mui/material';
import {
   CloudUpload,
   Delete,
   AddPhotoAlternate,
   AttachFile,
   Info,
   ArrowBack,
   ArrowForward,
   Save,
   CheckCircleOutline,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { tokens } from '../../theme';

const SubmitProject = () => {
   const theme = useTheme();
   const colors = tokens(theme.palette.mode);
   const fileInputRef = useRef(null);
   const documentInputRef = useRef(null);

   // State for current active step
   const [activeStep, setActiveStep] = useState(0);
   // State for form submission
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [submitSuccess, setSubmitSuccess] = useState(false);
   // State for form validation
   const [errors, setErrors] = useState({});

   // Form state
   const [formData, setFormData] = useState({
      title: '',
      description: '',
      category: '',
      location: '',
      land_size: '',
      budget_total: '',
      funding_goal: '',
      duration_in_months: '',
      investment_model: '',
      risk_level: 'medium',
      status: 'draft',
      photos: [],
      documents: [],
      start_date: null,
      end_date: null,
      is_draft: true,
   });

   // Preview for uploaded photos
   const [photoPreview, setPhotoPreview] = useState([]);
   // Documents list
   const [documentsList, setDocumentsList] = useState([]);

   // Form steps configuration
   const steps = [
      'Basic Information',
      'Financial Details',
      'Documentation',
      'Review & Submit',
   ];

   // Handle text input changes
   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({
         ...formData,
         [name]: value,
      });

      // Clear error for this field if it exists
      if (errors[name]) {
         setErrors({
            ...errors,
            [name]: null,
         });
      }
   };

   // Handle date changes
   const handleDateChange = (name, date) => {
      setFormData({
         ...formData,
         [name]: date,
      });

      if (errors[name]) {
         setErrors({
            ...errors,
            [name]: null,
         });
      }
   };

   // Handle photo uploads
   const handlePhotoUpload = (e) => {
      const files = Array.from(e.target.files);
      const newPhotos = [...formData.photos];
      const newPreviews = [...photoPreview];

      files.forEach((file) => {
         // In real app, would upload to server
         const fileId = `photo_${Date.now()}_${newPhotos.length}`;
         newPhotos.push(fileId);

         // Create preview URL
         const previewUrl = URL.createObjectURL(file);
         newPreviews.push({
            id: fileId,
            url: previewUrl,
            name: file.name,
         });
      });

      setFormData({
         ...formData,
         photos: newPhotos,
      });
      setPhotoPreview(newPreviews);

      // Clear error if it exists
      if (errors.photos) {
         setErrors({
            ...errors,
            photos: null,
         });
      }
   };

   // Handle document uploads
   const handleDocumentUpload = (e) => {
      const files = Array.from(e.target.files);
      const newDocuments = [...formData.documents];
      const newDocumentsList = [...documentsList];

      files.forEach((file) => {
         // In real app, would upload to server
         const fileId = `doc_${Date.now()}_${newDocuments.length}`;
         newDocuments.push(fileId);

         newDocumentsList.push({
            id: fileId,
            name: file.name,
            size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
         });
      });

      setFormData({
         ...formData,
         documents: newDocuments,
      });
      setDocumentsList(newDocumentsList);
   };

   // Remove photo
   const handleRemovePhoto = (photoId) => {
      setFormData({
         ...formData,
         photos: formData.photos.filter((id) => id !== photoId),
      });
      setPhotoPreview(photoPreview.filter((photo) => photo.id !== photoId));
   };

   // Remove document
   const handleRemoveDocument = (docId) => {
      setFormData({
         ...formData,
         documents: formData.documents.filter((id) => id !== docId),
      });
      setDocumentsList(documentsList.filter((doc) => doc.id !== docId));
   };

   // Toggle draft status
   const handleDraftToggle = (e) => {
      setFormData({
         ...formData,
         is_draft: e.target.checked,
         status: e.target.checked ? 'draft' : 'under_review',
      });
   };

   // Validate current step
   const validateStep = () => {
      const newErrors = {};

      if (activeStep === 0) {
         // Basic Information validation
         if (!formData.title.trim()) newErrors.title = 'Title is required';
         if (!formData.description.trim())
            newErrors.description = 'Description is required';
         if (!formData.category) newErrors.category = 'Category is required';
         if (!formData.location.trim())
            newErrors.location = 'Location is required';
         if (!formData.land_size) newErrors.land_size = 'Land size is required';
         if (formData.land_size && formData.land_size <= 0)
            newErrors.land_size = 'Land size must be greater than 0';
      } else if (activeStep === 1) {
         // Financial Details validation
         if (!formData.budget_total)
            newErrors.budget_total = 'Budget total is required';
         if (formData.budget_total && formData.budget_total <= 0)
            newErrors.budget_total = 'Budget must be greater than 0';

         if (!formData.funding_goal)
            newErrors.funding_goal = 'Funding goal is required';
         if (formData.funding_goal && formData.funding_goal <= 0)
            newErrors.funding_goal = 'Funding goal must be greater than 0';

         if (!formData.duration_in_months)
            newErrors.duration_in_months = 'Duration is required';
         if (formData.duration_in_months && formData.duration_in_months <= 0)
            newErrors.duration_in_months = 'Duration must be greater than 0';

         if (!formData.investment_model)
            newErrors.investment_model = 'Investment model is required';
         if (!formData.start_date)
            newErrors.start_date = 'Start date is required';
         if (!formData.end_date) newErrors.end_date = 'End date is required';

         if (
            formData.start_date &&
            formData.end_date &&
            formData.start_date >= formData.end_date
         ) {
            newErrors.end_date = 'End date must be after start date';
         }
      } else if (activeStep === 2) {
         // Documentation validation
         if (formData.photos.length === 0)
            newErrors.photos = 'At least one photo is required';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
   };

   // Handle next step
   const handleNext = () => {
      if (validateStep()) {
         setActiveStep((prevStep) => prevStep + 1);
      }
   };

   // Handle back step
   const handleBack = () => {
      setActiveStep((prevStep) => prevStep - 1);
   };

   // Handle form submission
   const handleSubmit = async () => {
      if (validateStep()) {
         setIsSubmitting(true);

         try {
            // In a real app, this would be an API call
            console.log('Submitting form:', formData);

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500));

            setSubmitSuccess(true);
            // In real app, redirect or show success message
         } catch (error) {
            console.error('Error submitting form:', error);
            // Handle error
         } finally {
            setIsSubmitting(false);
         }
      }
   };

   // Render current step content
   const getStepContent = (step) => {
      switch (step) {
         case 0:
            return (
               <Grid container spacing={3}>
                  <Grid item xs={12}>
                     <Typography
                        variant="h6"
                        color={colors.greenAccent[400]}
                        fontWeight="bold"
                     >
                        Project Overview
                     </Typography>
                     <Typography
                        variant="body2"
                        mb={2}
                        color={colors.grey[400]}
                     >
                        Provide basic information about your agricultural
                        project
                     </Typography>
                  </Grid>

                  <Grid item xs={12}>
                     <TextField
                        fullWidth
                        required
                        label="Project Title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        error={!!errors.title}
                        helperText={errors.title}
                        placeholder="E.g., Sustainable Coffee Farm Expansion"
                     />
                  </Grid>

                  <Grid item xs={12}>
                     <TextField
                        fullWidth
                        required
                        label="Project Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        error={!!errors.description}
                        helperText={errors.description}
                        multiline
                        rows={4}
                        placeholder="Describe your project in detail, including your goals, methods, and expected outcome"
                     />
                  </Grid>

                  <Grid item xs={12} md={6}>
                     <TextField
                        fullWidth
                        required
                        select
                        label="Category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        error={!!errors.category}
                        helperText={
                           errors.category ||
                           'Select the category that best describes your project'
                        }
                     >
                        <MenuItem value="crop">Crop Farming</MenuItem>
                        <MenuItem value="livestock">Livestock Farming</MenuItem>
                        <MenuItem value="processing">
                           Agricultural Processing
                        </MenuItem>
                     </TextField>
                  </Grid>

                  <Grid item xs={12} md={6}>
                     <TextField
                        fullWidth
                        required
                        label="Project Location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        error={!!errors.location}
                        helperText={errors.location}
                        placeholder="E.g., Bamenda, North-West Region"
                     />
                  </Grid>

                  <Grid item xs={12} md={6}>
                     <TextField
                        fullWidth
                        required
                        type="number"
                        label="Land Size"
                        name="land_size"
                        value={formData.land_size}
                        onChange={handleChange}
                        error={!!errors.land_size}
                        helperText={errors.land_size}
                        InputProps={{
                           endAdornment: (
                              <InputAdornment position="end">
                                 hectares
                              </InputAdornment>
                           ),
                        }}
                        inputProps={{ min: 0, step: 0.1 }}
                     />
                  </Grid>

                  <Grid item xs={12} md={6}>
                     <TextField
                        fullWidth
                        select
                        label="Risk Level"
                        name="risk_level"
                        value={formData.risk_level}
                        onChange={handleChange}
                        helperText="Estimated risk level of your project"
                     >
                        <MenuItem value="low">Low Risk</MenuItem>
                        <MenuItem value="medium">Medium Risk</MenuItem>
                        <MenuItem value="high">High Risk</MenuItem>
                     </TextField>
                  </Grid>
               </Grid>
            );

         case 1:
            return (
               <Grid container spacing={3}>
                  <Grid item xs={12}>
                     <Typography
                        variant="h6"
                        color={colors.greenAccent[400]}
                        fontWeight="bold"
                     >
                        Financial Information
                     </Typography>
                     <Typography
                        variant="body2"
                        mb={2}
                        color={colors.grey[400]}
                     >
                        Provide details about your project's financial
                        requirements and timeline
                     </Typography>
                  </Grid>

                  <Grid item xs={12} md={6}>
                     <TextField
                        fullWidth
                        required
                        type="number"
                        label="Total Budget"
                        name="budget_total"
                        value={formData.budget_total}
                        onChange={handleChange}
                        error={!!errors.budget_total}
                        helperText={errors.budget_total}
                        InputProps={{
                           startAdornment: (
                              <InputAdornment position="start">
                                 FCFA
                              </InputAdornment>
                           ),
                        }}
                        inputProps={{ min: 0 }}
                     />
                  </Grid>

                  <Grid item xs={12} md={6}>
                     <TextField
                        fullWidth
                        required
                        type="number"
                        label="Funding Goal"
                        name="funding_goal"
                        value={formData.funding_goal}
                        onChange={handleChange}
                        error={!!errors.funding_goal}
                        helperText={
                           errors.funding_goal || 'The amount you need to raise'
                        }
                        InputProps={{
                           startAdornment: (
                              <InputAdornment position="start">
                                 FCFA
                              </InputAdornment>
                           ),
                        }}
                        inputProps={{ min: 0 }}
                     />
                  </Grid>

                  <Grid item xs={12} md={6}>
                     <TextField
                        fullWidth
                        required
                        type="number"
                        label="Project Duration"
                        name="duration_in_months"
                        value={formData.duration_in_months}
                        onChange={handleChange}
                        error={!!errors.duration_in_months}
                        helperText={errors.duration_in_months}
                        InputProps={{
                           endAdornment: (
                              <InputAdornment position="end">
                                 months
                              </InputAdornment>
                           ),
                        }}
                        inputProps={{ min: 1, max: 60 }}
                     />
                  </Grid>

                  <Grid item xs={12} md={6}>
                     <TextField
                        fullWidth
                        required
                        select
                        label="Investment Model"
                        name="investment_model"
                        value={formData.investment_model}
                        onChange={handleChange}
                        error={!!errors.investment_model}
                        helperText={
                           errors.investment_model ||
                           'How investors will participate in your project'
                        }
                     >
                        <MenuItem value="crowdfunding">Crowdfunding</MenuItem>
                        <MenuItem value="fixed_return">Fixed Return</MenuItem>
                        <MenuItem value="profit_sharing">
                           Profit Sharing
                        </MenuItem>
                     </TextField>
                  </Grid>

                  <Grid item xs={12} md={6}>
                     <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                           label="Start Date *"
                           value={formData.start_date}
                           onChange={(date) =>
                              handleDateChange('start_date', date)
                           }
                           renderInput={(params) => (
                              <TextField
                                 {...params}
                                 fullWidth
                                 error={!!errors.start_date}
                                 helperText={errors.start_date}
                              />
                           )}
                           disablePast
                        />
                     </LocalizationProvider>
                  </Grid>

                  <Grid item xs={12} md={6}>
                     <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                           label="End Date *"
                           value={formData.end_date}
                           onChange={(date) =>
                              handleDateChange('end_date', date)
                           }
                           renderInput={(params) => (
                              <TextField
                                 {...params}
                                 fullWidth
                                 error={!!errors.end_date}
                                 helperText={errors.end_date}
                              />
                           )}
                           disablePast
                           minDate={formData.start_date || new Date()}
                        />
                     </LocalizationProvider>
                  </Grid>
               </Grid>
            );

         case 2:
            return (
               <Grid container spacing={3}>
                  <Grid item xs={12}>
                     <Typography
                        variant="h6"
                        color={colors.greenAccent[400]}
                        fontWeight="bold"
                     >
                        Project Documentation
                     </Typography>
                     <Typography
                        variant="body2"
                        mb={2}
                        color={colors.grey[400]}
                     >
                        Upload photos and supporting documents for your project
                     </Typography>
                  </Grid>

                  <Grid item xs={12}>
                     <Paper
                        variant="outlined"
                        sx={{
                           p: 3,
                           borderColor: errors.photos
                              ? theme.palette.error.main
                              : colors.primary[300],
                           borderStyle: 'dashed',
                           borderWidth: '2px',
                           bgcolor: colors.primary[700],
                           textAlign: 'center',
                           cursor: 'pointer',
                           '&:hover': {
                              bgcolor: colors.primary[600],
                           },
                        }}
                        onClick={() => fileInputRef.current.click()}
                     >
                        <input
                           ref={fileInputRef}
                           type="file"
                           accept="image/*"
                           multiple
                           onChange={handlePhotoUpload}
                           style={{ display: 'none' }}
                        />
                        <AddPhotoAlternate
                           sx={{
                              fontSize: 40,
                              color: colors.greenAccent[400],
                              mb: 1,
                           }}
                        />
                        <Typography variant="h6" gutterBottom>
                           Upload Project Photos
                        </Typography>
                        <Typography variant="body2" color={colors.grey[300]}>
                           Click or drag images here (JPG, PNG)
                        </Typography>
                        <Typography
                           variant="body2"
                           color={colors.grey[400]}
                           mt={1}
                        >
                           Add photos of your farm, equipment, or related
                           visuals
                        </Typography>
                        {errors.photos && (
                           <Typography color="error" variant="body2" mt={1}>
                              {errors.photos}
                           </Typography>
                        )}
                     </Paper>
                  </Grid>

                  {photoPreview.length > 0 && (
                     <Grid item xs={12}>
                        <Typography variant="subtitle1" mb={2}>
                           Uploaded Photos ({photoPreview.length})
                        </Typography>
                        <Grid container spacing={2}>
                           {photoPreview.map((photo) => (
                              <Grid
                                 item
                                 xs={6}
                                 sm={4}
                                 md={3}
                                 lg={2}
                                 key={photo.id}
                              >
                                 <Box
                                    sx={{
                                       position: 'relative',
                                       height: 150,
                                       borderRadius: 1,
                                       overflow: 'hidden',
                                    }}
                                 >
                                    <Box
                                       component="img"
                                       src={photo.url}
                                       alt={photo.name}
                                       sx={{
                                          width: '100%',
                                          height: '100%',
                                          objectFit: 'cover',
                                       }}
                                    />
                                    <IconButton
                                       size="small"
                                       sx={{
                                          position: 'absolute',
                                          top: 8,
                                          right: 8,
                                          bgcolor: 'rgba(0,0,0,0.5)',
                                          '&:hover': {
                                             bgcolor: 'rgba(0,0,0,0.7)',
                                          },
                                       }}
                                       onClick={() =>
                                          handleRemovePhoto(photo.id)
                                       }
                                    >
                                       <Delete sx={{ color: '#fff' }} />
                                    </IconButton>
                                 </Box>
                                 <Typography variant="caption" noWrap>
                                    {photo.name}
                                 </Typography>
                              </Grid>
                           ))}
                        </Grid>
                     </Grid>
                  )}

                  <Grid item xs={12} mt={2}>
                     <Divider />
                  </Grid>

                  <Grid item xs={12}>
                     <Paper
                        variant="outlined"
                        sx={{
                           p: 3,
                           borderColor: colors.primary[300],
                           borderStyle: 'dashed',
                           borderWidth: '2px',
                           bgcolor: colors.primary[700],
                           textAlign: 'center',
                           cursor: 'pointer',
                           '&:hover': {
                              bgcolor: colors.primary[600],
                           },
                        }}
                        onClick={() => documentInputRef.current.click()}
                     >
                        <input
                           ref={documentInputRef}
                           type="file"
                           multiple
                           onChange={handleDocumentUpload}
                           style={{ display: 'none' }}
                        />
                        <AttachFile
                           sx={{
                              fontSize: 40,
                              color: colors.greenAccent[400],
                              mb: 1,
                           }}
                        />
                        <Typography variant="h6" gutterBottom>
                           Upload Supporting Documents
                        </Typography>
                        <Typography variant="body2" color={colors.grey[300]}>
                           Click or drag files here (PDF, DOC, XLS)
                        </Typography>
                        <Typography
                           variant="body2"
                           color={colors.grey[400]}
                           mt={1}
                        >
                           Business plans, permits, certificates, cost
                           breakdowns, etc.
                        </Typography>
                     </Paper>
                  </Grid>

                  {documentsList.length > 0 && (
                     <Grid item xs={12}>
                        <Typography variant="subtitle1" mb={2}>
                           Uploaded Documents ({documentsList.length})
                        </Typography>
                        <Stack spacing={1}>
                           {documentsList.map((doc) => (
                              <Paper
                                 key={doc.id}
                                 sx={{
                                    p: 2,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    bgcolor: colors.primary[600],
                                 }}
                              >
                                 <Box display="flex" alignItems="center">
                                    <AttachFile
                                       sx={{ mr: 1, color: colors.grey[300] }}
                                    />
                                    <Typography>{doc.name}</Typography>
                                    <Chip
                                       label={doc.size}
                                       size="small"
                                       sx={{
                                          ml: 1,
                                          bgcolor: colors.primary[400],
                                       }}
                                    />
                                 </Box>
                                 <IconButton
                                    size="small"
                                    onClick={() => handleRemoveDocument(doc.id)}
                                 >
                                    <Delete color="error" />
                                 </IconButton>
                              </Paper>
                           ))}
                        </Stack>
                     </Grid>
                  )}
               </Grid>
            );

         case 3:
            return (
               <Grid container spacing={3}>
                  <Grid item xs={12}>
                     <Typography
                        variant="h6"
                        color={colors.greenAccent[400]}
                        fontWeight="bold"
                     >
                        Review Your Project Submission
                     </Typography>
                     <Typography
                        variant="body2"
                        mb={3}
                        color={colors.grey[400]}
                     >
                        Please review all information before submitting your
                        project
                     </Typography>

                     <Paper sx={{ p: 3, mb: 3, bgcolor: colors.primary[700] }}>
                        <Typography
                           variant="subtitle1"
                           fontWeight="bold"
                           gutterBottom
                        >
                           Project Details
                        </Typography>
                        <Grid container spacing={2}>
                           <Grid item xs={12} sm={6}>
                              <Typography
                                 variant="body2"
                                 color={colors.grey[300]}
                              >
                                 <strong>Title:</strong>{' '}
                                 {formData.title || 'Not provided'}
                              </Typography>
                           </Grid>
                           <Grid item xs={12} sm={6}>
                              <Typography
                                 variant="body2"
                                 color={colors.grey[300]}
                              >
                                 <strong>Category:</strong>{' '}
                                 {formData.category
                                    ? formData.category === 'crop'
                                       ? 'Crop Farming'
                                       : formData.category === 'livestock'
                                       ? 'Livestock Farming'
                                       : 'Agricultural Processing'
                                    : 'Not provided'}
                              </Typography>
                           </Grid>
                           <Grid item xs={12} sm={6}>
                              <Typography
                                 variant="body2"
                                 color={colors.grey[300]}
                              >
                                 <strong>Location:</strong>{' '}
                                 {formData.location || 'Not provided'}
                              </Typography>
                           </Grid>
                           <Grid item xs={12} sm={6}>
                              <Typography
                                 variant="body2"
                                 color={colors.grey[300]}
                              >
                                 <strong>Land Size:</strong>{' '}
                                 {formData.land_size
                                    ? `${formData.land_size} hectares`
                                    : 'Not provided'}
                              </Typography>
                           </Grid>
                           <Grid item xs={12} sm={6}>
                              <Typography
                                 variant="body2"
                                 color={colors.grey[300]}
                              >
                                 <strong>Risk Level:</strong>{' '}
                                 {formData.risk_level.charAt(0).toUpperCase() +
                                    formData.risk_level.slice(1)}
                              </Typography>
                           </Grid>
                           <Grid item xs={12}>
                              <Typography
                                 variant="body2"
                                 color={colors.grey[300]}
                              >
                                 <strong>Description:</strong>
                              </Typography>
                              <Typography
                                 variant="body2"
                                 color={colors.grey[400]}
                                 sx={{ mt: 1, pl: 2 }}
                              >
                                 {formData.description || 'Not provided'}
                              </Typography>
                           </Grid>
                        </Grid>
                     </Paper>

                     <Paper sx={{ p: 3, mb: 3, bgcolor: colors.primary[700] }}>
                        <Typography
                           variant="subtitle1"
                           fontWeight="bold"
                           gutterBottom
                        >
                           Financial Information
                        </Typography>
                        <Grid container spacing={2}>
                           <Grid item xs={12} sm={6}>
                              <Typography
                                 variant="body2"
                                 color={colors.grey[300]}
                              >
                                 <strong>Total Budget:</strong>{' '}
                                 {formData.budget_total
                                    ? `FCFA ${Number(
                                         formData.budget_total
                                      ).toLocaleString()}`
                                    : 'Not provided'}
                              </Typography>
                           </Grid>
                           <Grid item xs={12} sm={6}>
                              <Typography
                                 variant="body2"
                                 color={colors.grey[300]}
                              >
                                 <strong>Funding Goal:</strong>{' '}
                                 {formData.funding_goal
                                    ? `FCFA ${Number(
                                         formData.funding_goal
                                      ).toLocaleString()}`
                                    : 'Not provided'}
                              </Typography>
                           </Grid>
                           <Grid item xs={12} sm={6}>
                              <Typography
                                 variant="body2"
                                 color={colors.grey[300]}
                              >
                                 <strong>Duration:</strong>{' '}
                                 {formData.duration_in_months
                                    ? `${formData.duration_in_months} months`
                                    : 'Not provided'}
                              </Typography>
                           </Grid>
                           <Grid item xs={12} sm={6}>
                              <Typography
                                 variant="body2"
                                 color={colors.grey[300]}
                              >
                                 <strong>Investment Model:</strong>{' '}
                                 {formData.investment_model
                                    ? formData.investment_model ===
                                      'crowdfunding'
                                       ? 'Crowdfunding'
                                       : formData.investment_model ===
                                         'fixed_return'
                                       ? 'Fixed Return'
                                       : 'Profit Sharing'
                                    : 'Not provided'}
                              </Typography>
                           </Grid>
                           <Grid item xs={12} sm={6}>
                              <Typography
                                 variant="body2"
                                 color={colors.grey[300]}
                              >
                                 <strong>Start Date:</strong>{' '}
                                 {formData.start_date
                                    ? formData.start_date.toLocaleDateString()
                                    : 'Not provided'}
                              </Typography>
                           </Grid>
                           <Grid item xs={12} sm={6}>
                              <Typography
                                 variant="body2"
                                 color={colors.grey[300]}
                              >
                                 <strong>End Date:</strong>{' '}
                                 {formData.end_date
                                    ? formData.end_date.toLocaleDateString()
                                    : 'Not provided'}
                              </Typography>
                           </Grid>
                        </Grid>
                     </Paper>

                     <Paper sx={{ p: 3, bgcolor: colors.primary[700] }}>
                        <Typography
                           variant="subtitle1"
                           fontWeight="bold"
                           gutterBottom
                        >
                           Documentation
                        </Typography>
                        <Grid container spacing={2}>
                           <Grid item xs={12} sm={6}>
                              <Typography
                                 variant="body2"
                                 color={colors.grey[300]}
                              >
                                 <strong>Photos:</strong> {photoPreview.length}{' '}
                                 uploaded
                              </Typography>
                           </Grid>
                           <Grid item xs={12} sm={6}>
                              <Typography
                                 variant="body2"
                                 color={colors.grey[300]}
                              >
                                 <strong>Documents:</strong>{' '}
                                 {documentsList.length} uploaded
                              </Typography>
                           </Grid>
                        </Grid>

                        {photoPreview.length > 0 && (
                           <Box mt={2}>
                              <Typography
                                 variant="body2"
                                 color={colors.grey[300]}
                                 mb={1}
                              >
                                 <strong>Photo Preview:</strong>
                              </Typography>
                              <Box display="flex" gap={1} flexWrap="wrap">
                                 {photoPreview.slice(0, 5).map((photo) => (
                                    <Box
                                       key={photo.id}
                                       component="img"
                                       src={photo.url}
                                       alt={photo.name}
                                       sx={{
                                          width: 60,
                                          height: 60,
                                          borderRadius: 1,
                                          objectFit: 'cover',
                                       }}
                                    />
                                 ))}
                                 {photoPreview.length > 5 && (
                                    <Box
                                       sx={{
                                          width: 60,
                                          height: 60,
                                          borderRadius: 1,
                                          bgcolor: colors.primary[500],
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                       }}
                                    >
                                       <Typography variant="body2">
                                          +{photoPreview.length - 5} more
                                       </Typography>
                                    </Box>
                                 )}
                              </Box>
                           </Box>
                        )}
                     </Paper>

                     <Box mt={3}>
                        <FormControlLabel
                           control={
                              <Switch
                                 checked={formData.is_draft}
                                 onChange={handleDraftToggle}
                                 color="success"
                              />
                           }
                           label={
                              <Box display="flex" alignItems="center">
                                 <Typography variant="body2" mr={1}>
                                    Save as draft
                                 </Typography>
                                 <Tooltip title="Save as draft to edit later, or uncheck to submit for review">
                                    <Info fontSize="small" color="disabled" />
                                 </Tooltip>
                              </Box>
                           }
                        />

                        <Typography
                           variant="body2"
                           color={colors.grey[400]}
                           mt={1}
                        >
                           {formData.is_draft
                              ? 'Your project will be saved as a draft for you to edit later.'
                              : 'Your project will be submitted for review. Once approved, it will be live for funding.'}
                        </Typography>
                     </Box>
                  </Grid>
               </Grid>
            );

         default:
            return 'Unknown step';
      }
   };

   // Show success screen after submission
   if (submitSuccess) {
      return (
         <Box
            sx={{
               display: 'flex',
               flexDirection: 'column',
               alignItems: 'center',
               justifyContent: 'center',
               height: '100vh',
               textAlign: 'center',
               bgcolor: colors.primary[700],
               color: colors.grey[100],
               p: 3,
            }}
         >
            <CheckCircleOutline
               sx={{ fontSize: 80, color: colors.greenAccent[400], mb: 2 }}
            />
            <Typography variant="h4" fontWeight="bold" mb={2}>
               Project Submitted Successfully!
            </Typography>
            <Typography variant="body1" mb={3}>
               Your project has been submitted for review. You will be notified
               once it is approved.
            </Typography>
            <Button
               variant="contained"
               color="success"
               onClick={() => window.location.reload()}
            >
               Submit Another Project
            </Button>
         </Box>
      );
   }

   return (
      <Box sx={{ p: 3 }}>
         <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => (
               <Step key={index}>
                  <StepLabel error={!!errors[label]}>{label}</StepLabel>
               </Step>
            ))}
         </Stepper>

         <Box sx={{ mt: 4 }}>{getStepContent(activeStep)}</Box>

         <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
               variant="outlined"
               color="primary"
               disabled={activeStep === 0}
               onClick={handleBack}
               startIcon={<ArrowBack />}
            >
               Back
            </Button>
            {activeStep < steps.length - 1 ? (
               <Button
                  variant="contained"
                  color="success"
                  onClick={handleNext}
                  endIcon={<ArrowForward />}
               >
                  Next
               </Button>
            ) : (
               <Button
                  variant="contained"
                  color="success"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  startIcon={
                     isSubmitting ? <CircularProgress size={20} /> : <Save />
                  }
               >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
               </Button>
            )}
         </Box>

         {Object.keys(errors).length > 0 && (
            <Alert severity="error" sx={{ mt: 3 }}>
               Please fix the errors above before proceeding.
            </Alert>
         )}
      </Box>
   );
};

export default SubmitProject;
