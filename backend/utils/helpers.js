const generateTransactionRef = () => {
   const prefix = 'TRX';
   const timestamp = Date.now().toString();
   const random = Math.random().toString(36).substring(2, 8).toUpperCase();
   return `${prefix}${timestamp}${random}`;
};

module.exports = {
   generateTransactionRef,
};
