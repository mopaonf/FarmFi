import React from 'react';
import {
   Box,
   Typography,
   Card,
   Divider,
   List,
   ListItem,
   ListItemText,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../theme';
import {
   AccountBalanceWallet,
   ArrowUpward,
   ArrowDownward,
} from '@mui/icons-material';

const Wallet = () => {
   const theme = useTheme();
   const colors = tokens(theme.palette.mode);

   return (
      <Box m="20px">
         {/* Header */}
         <Box mb="20px">
            <Typography
               variant="h4"
               fontWeight="bold"
               color={colors.grey[100]}
               mb={1}
            >
               My Wallet
            </Typography>
            <Typography variant="subtitle1" color={colors.greenAccent[400]}>
               Manage your finances with ease
            </Typography>
         </Box>

         {/* Wallet Overview */}
         <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap="20px">
            {/* Wallet Balance */}
            <Card
               sx={{
                  gridColumn: { xs: 'span 12', md: 'span 4' },
                  padding: '20px',
                  backgroundColor: colors.primary[400],
                  borderRadius: '12px',
                  boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
               }}
            >
               <Box display="flex" alignItems="center" mb={2}>
                  <AccountBalanceWallet
                     sx={{
                        fontSize: '40px',
                        color: colors.greenAccent[500],
                        mr: 2,
                     }}
                  />
                  <Typography
                     variant="h6"
                     fontWeight="bold"
                     color={colors.grey[100]}
                  >
                     Wallet Balance
                  </Typography>
               </Box>
               <Typography
                  variant="h4"
                  fontWeight="bold"
                  color={colors.grey[100]}
               >
                  FCFA 250,000
               </Typography>
               <Typography
                  variant="body2"
                  color={colors.greenAccent[400]}
                  mt={1}
               >
                  +18% from last month
               </Typography>
            </Card>

            {/* Income and Expenses */}
            <Card
               sx={{
                  gridColumn: { xs: 'span 12', md: 'span 8' },
                  padding: '20px',
                  backgroundColor: colors.primary[400],
                  borderRadius: '12px',
                  boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
               }}
            >
               <Box
                  display="flex"
                  justifyContent="space-around"
                  alignItems="center"
                  mb={2}
               >
                  {/* Income */}
                  <Box textAlign="center">
                     <ArrowUpward
                        sx={{
                           fontSize: '40px',
                           color: colors.greenAccent[500],
                        }}
                     />
                     <Typography
                        variant="h6"
                        fontWeight="bold"
                        color={colors.grey[100]}
                        mt={1}
                     >
                        Income
                     </Typography>
                     <Typography
                        variant="h5"
                        fontWeight="bold"
                        color={colors.greenAccent[500]}
                     >
                        FCFA 850,000
                     </Typography>
                  </Box>

                  <Divider
                     orientation="vertical"
                     flexItem
                     sx={{ backgroundColor: colors.grey[700] }}
                  />

                  {/* Expenses */}
                  <Box textAlign="center">
                     <ArrowDownward
                        sx={{ fontSize: '40px', color: colors.redAccent[500] }}
                     />
                     <Typography
                        variant="h6"
                        fontWeight="bold"
                        color={colors.grey[100]}
                        mt={1}
                     >
                        Expenses
                     </Typography>
                     <Typography
                        variant="h5"
                        fontWeight="bold"
                        color={colors.redAccent[500]}
                     >
                        FCFA 425,000
                     </Typography>
                  </Box>
               </Box>
            </Card>
         </Box>

         {/* Recent Transactions */}
         <Card
            sx={{
               marginTop: '20px',
               padding: '20px',
               backgroundColor: colors.primary[400],
               borderRadius: '12px',
               boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
            }}
         >
            <Typography
               variant="h6"
               fontWeight="bold"
               color={colors.grey[100]}
               mb={2}
            >
               Recent Transactions
            </Typography>
            <List>
               <ListItem divider>
                  <ListItemText
                     primary="+ FCFA 100,000 – Disbursement"
                     secondary="03/04/2025"
                     primaryTypographyProps={{
                        color: colors.greenAccent[500],
                        fontWeight: 'bold',
                     }}
                     secondaryTypographyProps={{ color: colors.grey[500] }}
                  />
               </ListItem>
               <ListItem divider>
                  <ListItemText
                     primary="- FCFA 10,000 – Withdrawal"
                     secondary="01/04/2025"
                     primaryTypographyProps={{
                        color: colors.redAccent[500],
                        fontWeight: 'bold',
                     }}
                     secondaryTypographyProps={{ color: colors.grey[500] }}
                  />
               </ListItem>
               <ListItem>
                  <ListItemText
                     primary="+ FCFA 160,000 – Profit Share"
                     secondary="21/03/2025"
                     primaryTypographyProps={{
                        color: colors.greenAccent[500],
                        fontWeight: 'bold',
                     }}
                     secondaryTypographyProps={{ color: colors.grey[500] }}
                  />
               </ListItem>
            </List>
         </Card>
      </Box>
   );
};

export default Wallet;
