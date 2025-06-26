import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
   Box,
   Typography,
   Button,
   Container,
   Grid,
   Card,
   CardContent,
   IconButton,
   AppBar,
   Toolbar,
   Rating,
   Chip,
   Paper,
   Avatar,
   Divider,
   Link,
   useTheme,
   useMediaQuery,
   Fade,
   Slide,
   Zoom,
} from '@mui/material';
import {
   NavigateBefore as ChevronLeft,
   NavigateNext as ChevronRight,
   Group as Users,
   TrendingUp,
   ShieldOutlined as Shield,
   Park as Leaf,
   ArrowForward as ArrowRight,
   Phone,
   Email,
   LocationOn as MapPin,
   Facebook,
   Twitter,
   Instagram,
   LinkedIn,
   Star,
   CheckCircle,
   PlayArrow,
} from '@mui/icons-material';

const FarmFiLanding = () => {
   const theme = useTheme();
   const isMobile = useMediaQuery(theme.breakpoints.down('md'));
   const [currentSlide, setCurrentSlide] = useState(0);
   const [isVisible, setIsVisible] = useState({});
   const navigate = useNavigate();
   // Green theme colors
   const primaryGreen = '#2E7D32';
   const lightGreen = '#4CAF50';
   const darkGreen = '#1B5E20';
   const greenGradient =
      'linear-gradient(135deg, #2E7D32 0%, #388E3C 50%, #4CAF50 100%)';

   // Slider data
   const slides = [
      {
         title: 'Smart Agricultural Financing',
         subtitle:
            'Revolutionizing farm investments with AI-powered lending solutions',
         features: [
            'Instant loan approvals',
            'Competitive interest rates',
            'Flexible repayment terms',
         ],
      },
      {
         title: 'Crop Insurance Made Simple',
         subtitle:
            'Protect your harvest with comprehensive coverage and quick claims',
         features: [
            'Weather-based insurance',
            'Satellite monitoring',
            'Quick claim processing',
         ],
      },
      {
         title: 'Market Intelligence Platform',
         subtitle:
            'Real-time pricing and market trends to maximize your profits',
         features: [
            'Live market prices',
            'Demand forecasting',
            'Export opportunities',
         ],
      },
   ];

   // Auto-slide functionality
   useEffect(() => {
      const timer = setInterval(() => {
         setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(timer);
   }, []);

   const nextSlide = () =>
      setCurrentSlide((prev) => (prev + 1) % slides.length);
   const prevSlide = () =>
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

   // Services data
   const services = [
      {
         icon: TrendingUp,
         title: 'Agricultural Loans',
         desc: 'Flexible financing for equipment, seeds, and expansion',
         color: '#FF6B6B',
      },
      {
         icon: Shield,
         title: 'Crop Insurance',
         desc: 'Comprehensive coverage against weather and market risks',
         color: '#4ECDC4',
      },
      {
         icon: Users,
         title: 'Financial Advisory',
         desc: 'Expert guidance for financial planning and investment',
         color: '#45B7D1',
      },
      {
         icon: Leaf,
         title: 'Sustainability Finance',
         desc: 'Green loans for eco-friendly farming practices',
         color: '#96CEB4',
      },
   ];

   // Testimonials data
   const testimonials = [
      {
         name: 'John Smith',
         location: 'Iowa Corn Farm',
         rating: 5,
         text: 'AgriVest transformed my farming business. Quick loans and excellent support.',
         avatar: 'JS',
      },
      {
         name: 'Maria Rodriguez',
         location: 'California Organic Farm',
         rating: 5,
         text: 'The insurance coverage saved my crops during the drought. Highly recommended!',
         avatar: 'MR',
      },
      {
         name: 'David Chen',
         location: 'Texas Cattle Ranch',
         rating: 5,
         text: 'Best financial platform for farmers. Easy to use and great customer service.',
         avatar: 'DC',
      },
   ];

   return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
         {/* Header */}
         <AppBar
            position="sticky"
            elevation={4}
            sx={{
               bgcolor: 'white',
               color: 'text.primary',
               '& .MuiToolbar-root': {
                  minHeight: { xs: 64, md: 80 },
               },
            }}
         >
            <Toolbar sx={{ px: { xs: 2, md: 4 } }}>
               <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                  <Avatar
                     sx={{
                        bgcolor: greenGradient,
                        width: 48,
                        height: 48,
                        mr: 2,
                     }}
                  >
                     <Leaf size={24} />
                  </Avatar>
                  <Typography
                     variant="h4"
                     component="div"
                     sx={{ fontWeight: 'bold', color: primaryGreen }}
                  >
                     AgriVest
                  </Typography>
               </Box>

               {!isMobile && (
                  <Box sx={{ display: 'flex', gap: 4, mr: 4 }}>
                     {[
                        'Home',
                        'Features',
                        'Services',
                        'Testimonials',
                        'Contact',
                     ].map((item) => (
                        <Link
                           key={item}
                           href={`#${item.toLowerCase()}`}
                           sx={{
                              textDecoration: 'none',
                              color: 'text.primary',
                              fontWeight: 500,
                              '&:hover': {
                                 color: primaryGreen,
                                 transition: 'color 0.3s ease',
                              },
                           }}
                        >
                           {item}
                        </Link>
                     ))}
                  </Box>
               )}

               <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                     variant="outlined"
                     sx={{
                        borderColor: primaryGreen,
                        color: primaryGreen,
                        '&:hover': {
                           borderColor: darkGreen,
                           bgcolor: `${primaryGreen}10`,
                        },
                     }}
                  >
                     Login
                  </Button>
                  <Button
                     variant="contained"
                      onClick={() => navigate('/auth')}
                     sx={{
                        background: greenGradient,
                        '&:hover': {
                           background: `linear-gradient(135deg, ${darkGreen} 0%, ${primaryGreen} 100%)`,
                        },
                     }}
                  >
                     Get Started
                  </Button>
               </Box>
            </Toolbar>
         </AppBar>

         {/* Hero Section */}
         <Box
            id="home"
            sx={{
               background: `linear-gradient(135deg, ${primaryGreen} 0%, ${darkGreen} 100%)`,
               color: 'white',
               py: { xs: 12, md: 16 },
               position: 'relative',
               overflow: 'hidden',
               display: 'flex',
               alignItems: 'center',
               minHeight: { xs: 600, md: 700 },
               '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0,0,0,0.1)',
                  zIndex: 1,
               },
            }}
         >
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
               <Grid
                  container
                  spacing={6}
                  alignItems="center"
                  justifyContent="center"
               >
                  <Grid
                     item
                     xs={12}
                     md={6}
                     sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        minHeight: 400,
                     }}
                  >
                     <Fade in={true} timeout={1000}>
                        <Box>
                           <Typography
                              variant="h2"
                              component="h1"
                              sx={{
                                 fontWeight: 'bold',
                                 mb: 3,
                                 fontSize: {
                                    xs: '2.5rem',
                                    md: '3.5rem',
                                    lg: '4rem',
                                 },
                                 lineHeight: 1.2,
                                 textAlign: { xs: 'center', md: 'left' },
                              }}
                           >
                              Empowering Farmers with
                              <Typography
                                 component="span"
                                 sx={{
                                    display: 'block',
                                    background:
                                       'linear-gradient(45deg, #FFD700, #FFA500)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                 }}
                              >
                                 Smart Finance
                              </Typography>
                           </Typography>
                           <Typography
                              variant="h6"
                              sx={{
                                 mb: 4,
                                 opacity: 0.9,
                                 lineHeight: 1.6,
                                 textAlign: { xs: 'center', md: 'left' },
                              }}
                           >
                              Revolutionary financial solutions designed
                              specifically for modern agriculture. Access loans,
                              insurance, and market intelligence all in one
                              platform.
                           </Typography>
                           <Box
                              sx={{
                                 display: 'flex',
                                 gap: 2,
                                 flexDirection: { xs: 'column', sm: 'row' },
                                 justifyContent: {
                                    xs: 'center',
                                    md: 'flex-start',
                                 },
                                 alignItems: { xs: 'center', md: 'flex-start' },
                              }}
                           >
                              <Button
                                 variant="contained"
                                 size="large"
                                 endIcon={<ArrowRight />}
                                 sx={{
                                    bgcolor: 'white',
                                    color: primaryGreen,
                                    py: 2,
                                    px: 4,
                                    fontWeight: 'bold',
                                    '&:hover': {
                                       bgcolor: 'grey.100',
                                       transform: 'translateY(-2px)',
                                       boxShadow: 6,
                                    },
                                    transition: 'all 0.3s ease',
                                 }}
                              >
                                 Start Your Journey
                              </Button>
                              <Button
                                 variant="outlined"
                                 size="large"
                                 startIcon={<PlayArrow />}
                                 sx={{
                                    borderColor: 'white',
                                    color: 'white',
                                    py: 2,
                                    px: 4,
                                    fontWeight: 'bold',
                                    '&:hover': {
                                       bgcolor: 'rgba(255,255,255,0.1)',
                                       borderColor: 'white',
                                    },
                                 }}
                              >
                                 Watch Demo
                              </Button>
                           </Box>
                        </Box>
                     </Fade>
                  </Grid>
                  <Grid
                     item
                     xs={12}
                     md={6}
                     sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                     }}
                  >
                     <Zoom in={true} timeout={1200}>
                        <Paper
                           elevation={20}
                           sx={{
                              p: 4,
                              borderRadius: 4,
                              background: 'rgba(255,255,255,0.1)',
                              backdropFilter: 'blur(10px)',
                              border: '1px solid rgba(255,255,255,0.2)',
                              textAlign: 'center',
                              height: 400,
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center',
                              alignItems: 'center',
                           }}
                        >
                           <Box
                              sx={{
                                 width: '100%',
                                 height: 300,
                                 bgcolor: 'rgba(255,255,255,0.1)',
                                 borderRadius: 3,
                                 display: 'flex',
                                 alignItems: 'center',
                                 justifyContent: 'center',
                                 mb: 2,
                              }}
                           >
                              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                                 [Hero Image Placeholder]
                              </Typography>
                           </Box>
                           <Typography variant="caption" sx={{ opacity: 0.7 }}>
                              Main visual goes here
                           </Typography>
                        </Paper>
                     </Zoom>
                  </Grid>
               </Grid>
               {/* Floating Stats */}
               <Slide in={true} direction="up" timeout={1500}>
                  <Box
                     sx={{
                        position: 'absolute',
                        bottom: 40,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: { xs: 'none', lg: 'flex' },
                        gap: 6,
                        bgcolor: 'rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(10px)',
                        px: 6,
                        py: 3,
                        borderRadius: 3,
                        border: '1px solid rgba(255,255,255,0.2)',
                     }}
                  >
                     {[
                        { value: '10K+', label: 'Active Farmers' },
                        { value: '$50M+', label: 'Loans Disbursed' },
                        { value: '95%', label: 'Satisfaction Rate' },
                     ].map((stat, index) => (
                        <Box
                           key={index}
                           sx={{ textAlign: 'center', minWidth: 120 }}
                        >
                           <Typography
                              variant="h4"
                              sx={{ fontWeight: 'bold', mb: 1 }}
                           >
                              {stat.value}
                           </Typography>
                           <Typography variant="body2" sx={{ opacity: 0.8 }}>
                              {stat.label}
                           </Typography>
                        </Box>
                     ))}
                  </Box>
               </Slide>
            </Container>
         </Box>

         {/* Features Section */}
         <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'white' }}>
            <Container maxWidth="lg">
               <Grid container justifyContent="center" alignItems="center">
                  <Grid item xs={12} md={4}>
                     <Box sx={{ mb: 4, textAlign: { xs: 'center', md: 'left' } }}>
                        <Typography
                           variant="h3"
                           component="h2"
                           sx={{
                              fontWeight: 'bold',
                              mb: 2,
                              color: 'text.primary',
                              fontSize: { xs: '2rem', md: '2.5rem' },
                           }}
                        >
                           Core Features
                        </Typography>
                        <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                           Comprehensive financial tools designed for
                           agricultural success
                        </Typography>
                     </Box>
                  </Grid>
                  <Grid item xs={12} md={8}>
                     <Box
                        sx={{
                           mx: 'auto',
                           width: { xs: '150%', md: 1000, lg: 1200 }, // Increased width
                           height: { xs: 420, md: 600, lg: 700 },    // Increased height
                           display: 'flex',
                           flexDirection: 'column',
                           alignItems: 'center',
                           justifyContent: 'center',
                           background: `linear-gradient(135deg, ${primaryGreen}10 0%, ${lightGreen}15 100%)`,
                           borderRadius: 4,
                           boxShadow: 8,
                           p: 4,
                           position: 'relative',
                        }}
                     >
                        <Paper
                           elevation={8}
                           sx={{
                              background: `linear-gradient(135deg, ${primaryGreen}10 0%, ${lightGreen}15 100%)`,
                              borderRadius: 4,
                              p: 4,
                              position: 'relative',
                           }}
                        >
                           <Box
                              sx={{
                                 display: 'flex',
                                 alignItems: 'center',
                                 justifyContent: 'space-between',
                                 mb: 4,
                              }}
                           >
                              <IconButton
                                 onClick={prevSlide}
                                 sx={{
                                    bgcolor: 'white',
                                    boxShadow: 4,
                                    '&:hover': {
                                       bgcolor: 'grey.50',
                                       transform: 'scale(1.1)',
                                       boxShadow: 6,
                                    },
                                    transition: 'all 0.3s ease',
                                 }}
                              >
                                 <ChevronLeft color={primaryGreen} />
                              </IconButton>

                              <Box sx={{ flex: 1, textAlign: 'center', px: 4 }}>
                                 <Typography
                                    variant="h4"
                                    sx={{
                                       fontWeight: 'bold',
                                       mb: 2,
                                       color: 'text.primary',
                                    }}
                                 >
                                    {slides[currentSlide].title}
                                 </Typography>
                                 <Typography
                                    variant="h6"
                                    sx={{ color: 'text.secondary', mb: 4 }}
                                 >
                                    {slides[currentSlide].subtitle}
                                 </Typography>

                                 <Box
                                    sx={{
                                       display: 'flex',
                                       justifyContent: 'center',
                                       gap: 2,
                                       mb: 4,
                                       flexWrap: 'wrap',
                                    }}
                                 >
                                    {slides[currentSlide].features.map(
                                       (feature, index) => (
                                          <Chip
                                             key={index}
                                             icon={<CheckCircle size={16} />}
                                             label={feature}
                                             sx={{
                                                bgcolor: 'white',
                                                fontWeight: 500,
                                                '& .MuiChip-icon': {
                                                   color: primaryGreen,
                                                },
                                             }}
                                          />
                                       )
                                    )}
                                 </Box>
                              </Box>

                              <IconButton
                                 onClick={nextSlide}
                                 sx={{
                                    bgcolor: 'white',
                                    boxShadow: 4,
                                    '&:hover': {
                                       bgcolor: 'grey.50',
                                       transform: 'scale(1.1)',
                                       boxShadow: 6,
                                    },
                                    transition: 'all 0.3s ease',
                                 }}
                              >
                                 <ChevronRight color={primaryGreen} />
                              </IconButton>
                           </Box>

                           {/* Slide Indicators */}
                           <Box
                              sx={{
                                 display: 'flex',
                                 justifyContent: 'center',
                                 gap: 1,
                                 mb: 4,
                              }}
                           >
                              {slides.map((_, index) => (
                                 <IconButton
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    sx={{
                                       width: 12,
                                       height: 12,
                                       minWidth: 12,
                                       bgcolor:
                                          currentSlide === index
                                             ? primaryGreen
                                             : 'grey.300',
                                       '&:hover': {
                                          bgcolor:
                                             currentSlide === index
                                                ? darkGreen
                                                : 'grey.400',
                                       },
                                       transition: 'all 0.3s ease',
                                    }}
                                 />
                              ))}
                           </Box>

                           {/* Visual Placeholder */}
                           <Paper
                              elevation={2}
                              sx={{
                                 height: 300,
                                 borderRadius: 3,
                                 display: 'flex',
                                 alignItems: 'center',
                                 justifyContent: 'center',
                                 bgcolor: 'white',
                              }}
                           >
                              <Box
                                 sx={{
                                    textAlign: 'center',
                                    color: 'text.secondary',
                                 }}
                              >
                                 <Paper
                                    elevation={1}
                                    sx={{
                                       width: 300,
                                       height: 200,
                                       display: 'flex',
                                       alignItems: 'center',
                                       justifyContent: 'center',
                                       mx: 'auto',
                                       mb: 2,
                                       bgcolor: 'grey.50',
                                    }}
                                 >
                                    <Typography variant="body2">
                                       [Slide {currentSlide + 1} Visual]
                                    </Typography>
                                 </Paper>
                                 <Typography variant="caption">
                                    Feature illustration goes here
                                 </Typography>
                              </Box>
                           </Paper>
                        </Paper>
                     </Box>
                  </Grid>
               </Grid>
            </Container>
         </Box>

         {/* Services Grid */}
         <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'grey.50' }}>
            <Container maxWidth="lg">
               <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
                  <Typography
                     variant="h3"
                     component="h2"
                     sx={{ fontWeight: 'bold', mb: 2 }}
                  >
                     Complete Financial Ecosystem
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                     Everything you need to grow your agricultural business
                  </Typography>
               </Box>
               <Grid
                  container
                  spacing={4}
                  alignItems="stretch"
                  justifyContent="center"
                  sx={{
                     flexWrap: 'nowrap',
                     overflowX: { xs: 'auto', md: 'unset' },
                  }}
               >
                  {services.map((service, index) => (
                     <Grid
                        item
                        xs={12}
                        sm={6}
                        md={3}
                        key={index}
                        sx={{
                           display: 'flex',
                           flexDirection: 'column',
                           alignItems: 'center',
                           minWidth: { xs: 260, md: 'auto' },
                           maxWidth: 320,
                        }}
                     >
                        <Zoom in={true} timeout={800 + index * 200}>
                           <Card
                              elevation={4}
                              sx={{
                                 width: '100%',
                                 minWidth: 240,
                                 maxWidth: 320,
                                 height: 340,
                                 display: 'flex',
                                 flexDirection: 'column',
                                 justifyContent: 'space-between',
                                 alignItems: 'center',
                                 p: 4,
                                 borderRadius: 3,
                                 transition: 'all 0.3s ease',
                                 '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: 12,
                                 },
                              }}
                           >
                              <CardContent
                                 sx={{ textAlign: 'center', p: 0, flexGrow: 1 }}
                              >
                                 <Avatar
                                    className="service-icon"
                                    sx={{
                                       width: 80,
                                       height: 80,
                                       bgcolor: service.color,
                                       mx: 'auto',
                                       mb: 3,
                                       transition: 'transform 0.3s ease',
                                    }}
                                 >
                                    <service.icon
                                       fontSize="large"
                                       sx={{ color: 'white', fontSize: 40 }}
                                    />
                                 </Avatar>
                                 <Typography
                                    variant="h6"
                                    sx={{ fontWeight: 'bold', mb: 2 }}
                                 >
                                    {service.title}
                                 </Typography>
                                 <Typography
                                    variant="body2"
                                    sx={{ color: 'text.secondary', mb: 3 }}
                                 >
                                    {service.desc}
                                 </Typography>
                              </CardContent>
                              <Button
                                 endIcon={<ArrowRight fontSize="small" />}
                                 sx={{
                                    color: primaryGreen,
                                    fontWeight: 500,
                                    mt: 2,
                                    '&:hover': {
                                       bgcolor: `${primaryGreen}10`,
                                    },
                                 }}
                              >
                                 Learn More
                              </Button>
                           </Card>
                        </Zoom>
                     </Grid>
                  ))}
               </Grid>
            </Container>
         </Box>

         {/* Testimonials */}
         <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'white' }}>
            <Container maxWidth="lg">
               <Box
                  sx={{
                     textAlign: 'center',
                     mb: { xs: 6, md: 8 },
                     maxWidth: '800px',
                     mx: 'auto',
                  }}
               >
                  <Typography
                     variant="h3"
                     component="h2"
                     sx={{ fontWeight: 'bold', mb: 2 }}
                  >
                     What Farmers Say
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                     Real stories from our farming community
                  </Typography>
               </Box>
               <Grid
                  container
                  spacing={4}
                  alignItems="stretch"
                  justifyContent="center"
                  sx={{
                     flexWrap: 'nowrap',
                     overflowX: { xs: 'auto', md: 'unset' },
                  }}
               >
                  {testimonials.map((testimonial, index) => (
                     <Grid
                        item
                        xs={12}
                        md={4}
                        key={index}
                        sx={{
                           display: 'flex',
                           flexDirection: 'column',
                           alignItems: 'center',
                           minWidth: { xs: 320, md: 'auto' },
                           maxWidth: 400,
                        }}
                     >
                        <Fade in={true} timeout={1000 + index * 300}>
                           <Card
                              elevation={6}
                              sx={{
                                 display: 'flex',
                                 flexDirection: 'column',
                                 width: '100%',
                                 minWidth: 280,
                                 maxWidth: 400,
                                 background: `linear-gradient(135deg, ${primaryGreen}08 0%, white 100%)`,
                                 borderRadius: 3,
                                 p: 4,
                                 alignItems: 'center',
                                 justifyContent: 'center',
                                 minHeight: 320,
                              }}
                           >
                              <CardContent
                                 sx={{
                                    p: 0,
                                    flexGrow: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                 }}
                              >
                                 <Rating
                                    value={testimonial.rating}
                                    readOnly
                                    sx={{
                                       mb: 2,
                                       '& .MuiRating-iconFilled': {
                                          color: '#FFD700',
                                       },
                                    }}
                                 />
                                 <Typography
                                    variant="body1"
                                    sx={{
                                       fontStyle: 'italic',
                                       mb: 3,
                                       color: 'text.secondary',
                                       lineHeight: 1.6,
                                       textAlign: 'center',
                                    }}
                                 >
                                    "{testimonial.text}"
                                 </Typography>
                                 <Box
                                    sx={{
                                       display: 'flex',
                                       alignItems: 'center',
                                       justifyContent: 'center',
                                    }}
                                 >
                                    <Avatar
                                       sx={{
                                          bgcolor: `${primaryGreen}20`,
                                          color: primaryGreen,
                                          mr: 2,
                                          fontWeight: 'bold',
                                       }}
                                    >
                                       {testimonial.avatar}
                                    </Avatar>
                                    <Box>
                                       <Typography
                                          variant="subtitle1"
                                          sx={{ fontWeight: 'bold' }}
                                       >
                                          {testimonial.name}
                                       </Typography>
                                       <Typography
                                          variant="body2"
                                          sx={{ color: 'text.secondary' }}
                                       >
                                          {testimonial.location}
                                       </Typography>
                                    </Box>
                                 </Box>
                              </CardContent>
                           </Card>
                        </Fade>
                     </Grid>
                  ))}
               </Grid>
            </Container>
         </Box>

         {/* CTA Section */}
         <Box
            sx={{
               py: { xs: 10, md: 14 },
               background: greenGradient,
               color: 'white',
               textAlign: 'center',
               position: 'relative',
               overflow: 'hidden',
               '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0,0,0,0.1)',
                  zIndex: 1,
               },
            }}
         >
            <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
               <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 3 }}>
                  Ready to Transform Your Farm?
               </Typography>
               <Typography
                  variant="h6"
                  sx={{ mb: 4, opacity: 0.9, lineHeight: 1.6 }}
               >
                  Join thousands of farmers who have already revolutionized
                  their agricultural business with AgriVest
               </Typography>
               <Box
                  sx={{
                     display: 'flex',
                     gap: 2,
                     justifyContent: 'center',
                     flexDirection: { xs: 'column', sm: 'row' },
                  }}
               >
                  <Button
                     variant="contained"
                     size="large"
                     sx={{
                        bgcolor: 'white',
                        color: primaryGreen,
                        py: 2,
                        px: 4,
                        fontWeight: 'bold',
                        '&:hover': {
                           bgcolor: 'grey.100',
                           transform: 'translateY(-2px)',
                           boxShadow: 8,
                        },
                     }}
                  >
                     Get Started Today
                  </Button>
                  <Button
                     variant="outlined"
                     size="large"
                     sx={{
                        borderColor: 'white',
                        color: 'white',
                        py: 2,
                        px: 4,
                        fontWeight: 'bold',
                        '&:hover': {
                           bgcolor: 'rgba(255,255,255,0.1)',
                           borderColor: 'white',
                        },
                     }}
                  >
                     Schedule a Demo
                  </Button>
               </Box>
            </Container>
         </Box>

         {/* Footer */}
         <Box
            sx={{ bgcolor: 'grey.900', color: 'white', py: { xs: 8, md: 12 } }}
         >
            <Container maxWidth="lg">
               <Grid container spacing={6} sx={{ mb: 8 }}>
                  <Grid item xs={12} md={3}>
                     <Box sx={{ mb: 3 }}>
                        <Box
                           sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
                        >
                           <Avatar
                              sx={{
                                 bgcolor: greenGradient,
                                 width: 40,
                                 height: 40,
                                 mr: 2,
                              }}
                           >
                              <Leaf size={20} />
                           </Avatar>
                           <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                              AgriVest
                           </Typography>
                        </Box>
                        <Typography
                           variant="body2"
                           sx={{ color: 'grey.400', mb: 3, lineHeight: 1.6 }}
                        >
                           Empowering farmers with innovative financial
                           solutions for sustainable agriculture.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                           {[Facebook, Twitter, Instagram, LinkedIn].map(
                              (Icon, index) => (
                                 <IconButton
                                    key={index}
                                    sx={{
                                       color: 'grey.400',
                                       '&:hover': {
                                          color: lightGreen,
                                          transform: 'translateY(-2px)',
                                       },
                                       transition: 'all 0.3s ease',
                                    }}
                                 >
                                    <Icon size={20} />
                                 </IconButton>
                              )
                           )}
                        </Box>
                     </Box>
                  </Grid>

                  <Grid item xs={12} md={3}>
                     <Typography
                        variant="h6"
                        sx={{ fontWeight: 'bold', mb: 2 }}
                     >
                        Services
                     </Typography>
                     <Box
                        sx={{
                           display: 'flex',
                           flexDirection: 'column',
                           gap: 1,
                        }}
                     >
                        {[
                           'Agricultural Loans',
                           'Crop Insurance',
                           'Market Intelligence',
                           'Financial Advisory',
                        ].map((item) => (
                           <Link
                              key={item}
                              href="#"
                              sx={{
                                 color: 'grey.400',
                                 textDecoration: 'none',
                                 '&:hover': {
                                    color: lightGreen,
                                 },
                                 transition: 'color 0.3s ease',
                              }}
                           >
                              {item}
                           </Link>
                        ))}
                     </Box>
                  </Grid>

                  <Grid item xs={12} md={3}>
                     <Typography
                        variant="h6"
                        sx={{ fontWeight: 'bold', mb: 2 }}
                     >
                        Support
                     </Typography>
                     <Box
                        sx={{
                           display: 'flex',
                           flexDirection: 'column',
                           gap: 1,
                        }}
                     >
                        {[
                           'Help Center',
                           'Documentation',
                           'Community',
                           'Contact Us',
                        ].map((item) => (
                           <Link
                              key={item}
                              href="#"
                              sx={{
                                 color: 'grey.400',
                                 textDecoration: 'none',
                                 '&:hover': {
                                    color: lightGreen,
                                 },
                                 transition: 'color 0.3s ease',
                              }}
                           >
                              {item}
                           </Link>
                        ))}
                     </Box>
                  </Grid>

                  <Grid item xs={12} md={3}>
                     <Typography
                        variant="h6"
                        sx={{ fontWeight: 'bold', mb: 2 }}
                     >
                        Contact Info
                     </Typography>
                     <Box
                        sx={{
                           display: 'flex',
                           flexDirection: 'column',
                           gap: 2,
                        }}
                     >
                        {[
                           { icon: Phone, text: '+1 (555) 123-4567' },
                           { icon: Email, text: 'support@agriVest.com' },
                           {
                              icon: MapPin,
                              text: '123 Agriculture St, Farm City',
                           },
                        ].map((contact, index) => (
                           <Box
                              key={index}
                              sx={{
                                 display: 'flex',
                                 alignItems: 'center',
                                 gap: 1,
                              }}
                           >
                              <contact.icon size={16} color={lightGreen} />
                              <Typography
                                 variant="body2"
                                 sx={{ color: 'grey.400' }}
                              >
                                 {contact.text}
                              </Typography>
                           </Box>
                        ))}
                     </Box>
                  </Grid>
               </Grid>

               <Divider sx={{ borderColor: 'grey.800', mb: 4 }} />

               <Typography
                  variant="body2"
                  sx={{ textAlign: 'center', color: 'grey.400' }}
               >
                  © 2025 AgriVest. All rights reserved. | Privacy Policy | Terms
                  of Service
               </Typography>
            </Container>
         </Box>
      </Box>
   );
};

export default FarmFiLanding;
