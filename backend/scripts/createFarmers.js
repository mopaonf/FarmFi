const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Farmer = require('../models/farmers/Farmer');

const farmers = [
   {
      name: 'Nelson Tabe',
      email: 'nelson@gmail.com',
      phone: '+237 677 111 222',
      address: 'Bonduma, Buea',
      country: 'Cameroon',
   },
   {
      name: 'Laura Niba',
      email: 'laura@gmail.com',
      phone: '+237 678 222 333',
      address: 'Molyko, Buea',
      country: 'Cameroon',
   },
   {
      name: 'James Fon',
      email: 'james@gmail.com',
      phone: '+237 679 333 444',
      address: 'Ntamulung, Bamenda',
      country: 'Cameroon',
   },
   {
      name: 'Clara Mbah',
      email: 'clara@gmail.com',
      phone: '+237 680 444 555',
      address: 'Muea, Buea',
      country: 'Cameroon',
   },
   {
      name: 'Henry Njie',
      email: 'henry@gmail.com',
      phone: '+237 681 555 666',
      address: 'Limbe, South-West',
      country: 'Cameroon',
   },
   {
      name: 'Grace Acha',
      email: 'grace@gmail.com',
      phone: '+237 682 666 777',
      address: 'Mankon, Bamenda',
      country: 'Cameroon',
   },
   {
      name: 'Peter Suh',
      email: 'peter@gmail.com',
      phone: '+237 683 777 888',
      address: 'Mile 4, Limbe',
      country: 'Cameroon',
   },
   {
      name: 'Esther Boma',
      email: 'esther@gmail.com',
      phone: '+237 684 888 999',
      address: 'Tiko, South-West',
      country: 'Cameroon',
   },
   {
      name: 'David Enow',
      email: 'david@gmail.com',
      phone: '+237 685 999 000',
      address: 'Ekona, South-West',
      country: 'Cameroon',
   },
   {
      name: 'Lilian Weka',
      email: 'lilian@gmail.com',
      phone: '+237 686 000 111',
      address: 'Nkwen, Bamenda',
      country: 'Cameroon',
   },
];

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/FarmFi'; // Use 'FarmFi' with correct case

(async () => {
   await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
   });

   for (let farmer of farmers) {
      const plainPassword = farmer.name.split(' ')[0].toLowerCase() + '123';
      const hash = await bcrypt.hash(plainPassword, 10);
      farmer.password = hash;
   }

   await Farmer.insertMany(farmers);
   console.log('Inserted 10 farmers!');
   await mongoose.disconnect();
})();
