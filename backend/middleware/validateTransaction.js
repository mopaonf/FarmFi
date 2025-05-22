exports.validateTransaction = (req, res, next) => {
   const { amount } = req.body;

   if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: 'Invalid transaction amount' });
   }

   next();
};
