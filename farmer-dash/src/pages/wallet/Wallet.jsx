import React, { useEffect, useState } from 'react';
import {
   Box,
   Typography,
   Card,
   CardContent,
   List,
   ListItem,
   ListItemText,
   CircularProgress,
   Grid,
   Chip,
   Button,
   Avatar,
   Divider,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
   AccountBalanceWallet,
   TrendingUp,
   TrendingDown,
   Download,
   CheckCircle,
   Schedule,
   Error,
   Receipt,
} from '@mui/icons-material';
import axios from 'axios';

// Professional color scheme
const colors = {
   primary: '#1565C0',      // Professional blue
   secondary: '#37474F',    // Dark grey
   success: '#2E7D32',      // Professional green
   warning: '#F57C00',      // Professional orange
   error: '#C62828',        // Professional red
   background: '#F8F9FA',   // Light grey background
   surface: '#FFFFFF',      // White surface
   text: {
      primary: '#212121',
      secondary: '#616161',
      disabled: '#9E9E9E',
   },
};

const getStatusColor = (status) => {
   switch (status) {
      case 'confirmed': return colors.success;
      case 'pending': return colors.warning;
      case 'failed': return colors.error;
      default: return colors.text.disabled;
   }
};

const getTransactionIcon = (type) => {
   const iconProps = { fontSize: 'small' };
   switch (type) {
      case 'deposit':
      case 'payout':
      case 'disbursement':
         return <TrendingUp {...iconProps} sx={{ color: colors.success }} />;
      case 'withdrawal':
      case 'investment':
         return <TrendingDown {...iconProps} sx={{ color: colors.error }} />;
      default:
         return <Receipt {...iconProps} sx={{ color: colors.text.secondary }} />;
   }
};

const StatCard = ({ title, value, icon, color = colors.primary }) => (
   <Card elevation={2} sx={{ height: '100%' }}>
      <CardContent sx={{ textAlign: 'center', py: 3 }}>
         <Avatar sx={{ bgcolor: color, mx: 'auto', mb: 2, width: 56, height: 56 }}>
            {icon}
         </Avatar>
         <Typography variant="h5" fontWeight="600" color={colors.text.primary} gutterBottom>
            FCFA {value?.toLocaleString() || '0'}
         </Typography>
         <Typography variant="body2" color={colors.text.secondary}>
            {title}
         </Typography>
      </CardContent>
   </Card>
);

const TransactionItem = ({ transaction }) => {
   const isPositive = ['deposit', 'payout', 'disbursement'].includes(transaction.type);
   const amount = `${isPositive ? '+' : '-'}FCFA ${transaction.amount?.toLocaleString() || '0'}`;
   
   return (
      <ListItem divider sx={{ py: 2 }}>
         <Box sx={{ mr: 2 }}>
            {getTransactionIcon(transaction.type)}
         </Box>
         <ListItemText
            primary={
               <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body1" fontWeight="500">
                     {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                  </Typography>
                  <Typography 
                     variant="body1" 
                     fontWeight="600"
                     color={isPositive ? colors.success : colors.error}
                  >
                     {amount}
                  </Typography>
               </Box>
            }
            secondary={
               <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                  <Typography variant="body2" color={colors.text.secondary}>
                     {transaction.description || 'No description'}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                     <Chip
                        label={transaction.status}
                        size="small"
                        icon={
                           transaction.status === 'confirmed' ? <CheckCircle /> :
                           transaction.status === 'pending' ? <Schedule /> : <Error />
                        }
                        sx={{
                           bgcolor: getStatusColor(transaction.status),
                           color: 'white',
                           fontSize: '0.75rem',
                           height: 24,
                        }}
                     />
                     <Typography variant="caption" color={colors.text.disabled}>
                        {transaction.timestamp ? 
                           new Date(transaction.timestamp).toLocaleDateString() : ''
                        }
                     </Typography>
                  </Box>
               </Box>
            }
         />
      </ListItem>
   );
};

const Wallet = () => {
   const [wallet, setWallet] = useState(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchWallet = async () => {
         try {
            const token = localStorage.getItem('token');
            let userId = localStorage.getItem('userId');
            
            if (!userId && token) {
               try {
                  const payload = JSON.parse(atob(token.split('.')[1]));
                  userId = payload.id || payload.userId || payload._id;
               } catch (e) {
                  console.error('Token decode error:', e);
               }
            }

            let url = 'http://localhost:5000/api/wallets/stats';
            if (userId) {
               url += `?userId=${userId}`;
            }

            const response = await axios.get(url, {
               headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            
            setWallet(response.data);
         } catch (error) {
            console.error('Failed to fetch wallet:', error);
            setWallet(null);
         } finally {
            setLoading(false);
         }
      };

      fetchWallet();
   }, []);

   if (loading) {
      return (
         <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress size={48} sx={{ color: colors.primary }} />
         </Box>
      );
   }

   if (!wallet) {
      return (
         <Box textAlign="center" py={8}>
            <Typography variant="h6" color={colors.error}>
               Failed to load wallet data
            </Typography>
         </Box>
      );
   }

   return (
      <Box sx={{ maxWidth: '95%', mx: 'auto', p: 2 }}>
         {/* Header */}
         <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Box>
               <Typography variant="h4" fontWeight="700" color={colors.text.primary} gutterBottom>
                  Wallet Dashboard
               </Typography>
               <Typography variant="body1" color={colors.text.secondary}>
                  Monitor your financial activity and portfolio performance
               </Typography>
            </Box>
            <Button
               variant="contained"
               startIcon={<Download />}
               sx={{
                  bgcolor: colors.primary,
                  color: 'white',
                  fontWeight: 600,
                  px: 3,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#0D47A1' },
               }}
               onClick={() => alert('Statement download coming soon!')}
            >
               Download Statement
            </Button>
         </Box>

         {/* Account Summary */}
         <Card elevation={3} sx={{ mb: 4, bgcolor: colors.surface }}>
            <CardContent sx={{ p: 3 }}>
               <Box display="flex" alignItems="center" gap={3}>
                  <Avatar sx={{ bgcolor: colors.primary, width: 64, height: 64 }}>
                     <AccountBalanceWallet sx={{ fontSize: 32 }} />
                  </Avatar>
                  <Box flex={1}>
                     <Typography variant="h5" fontWeight="600" color={colors.text.primary}>
                        {wallet.ownerName || 'Account Holder'}
                     </Typography>
                     <Typography variant="body2" color={colors.text.secondary} sx={{ mt: 0.5 }}>
                        Wallet ID: {wallet._id || 'N/A'}
                     </Typography>
                     <Typography variant="body2" color={colors.text.disabled}>
                        Last updated: {wallet.lastUpdated ? 
                           new Date(wallet.lastUpdated).toLocaleString() : 
                           new Date().toLocaleString()
                        }
                     </Typography>
                  </Box>
               </Box>
            </CardContent>
         </Card>

         {/* Statistics Grid */}
         <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={6} md={3}>
               <StatCard
                  title="Current Balance"
                  value={wallet.balance}
                  icon={<AccountBalanceWallet sx={{ fontSize: 28 }} />}
                  color={colors.primary}
               />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
               <StatCard
                  title="Total Invested"
                  value={wallet.totalInvested}
                  icon={<TrendingDown sx={{ fontSize: 28 }} />}
                  color={colors.error}
               />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
               <StatCard
                  title="Total Returns"
                  value={wallet.totalReturns}
                  icon={<TrendingUp sx={{ fontSize: 28 }} />}
                  color={colors.success}
               />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
               <StatCard
                  title="Pending Returns"
                  value={wallet.pendingReturns}
                  icon={<Schedule sx={{ fontSize: 28 }} />}
                  color={colors.warning}
               />
            </Grid>
         </Grid>

         {/* Recent Transactions */}
         <Card elevation={2} sx={{ bgcolor: colors.surface }}>
            <CardContent sx={{ p: 0 }}>
               <Box sx={{ p: 3, pb: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                     <Typography variant="h6" fontWeight="600" color={colors.text.primary}>
                        Recent Transactions
                     </Typography>
                     <Chip
                        label={`${(wallet.recentTransactions || []).length} transactions`}
                        size="small"
                        sx={{
                           bgcolor: colors.secondary,
                           color: 'white',
                           fontWeight: 500,
                        }}
                     />
                  </Box>
               </Box>
               <Divider />
               <List sx={{ pt: 0 }}>
                  {(wallet.recentTransactions || []).length === 0 ? (
                     <ListItem>
                        <ListItemText
                           primary="No recent transactions"
                           primaryTypographyProps={{
                              color: colors.text.secondary,
                              textAlign: 'center',
                              py: 4,
                           }}
                        />
                     </ListItem>
                  ) : (
                     wallet.recentTransactions.map((transaction, index) => (
                        <TransactionItem
                           key={transaction.reference || index}
                           transaction={transaction}
                        />
                     ))
                  )}
               </List>
            </CardContent>
         </Card>
      </Box>
   );
};

export default Wallet;