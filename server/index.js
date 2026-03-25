const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const startDeadlineAlerts = require('./utils/deadlineAlert');

dotenv.config();

const app = express();

app.use(cors({ origin: '*', credentials: false }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth',         require('./routes/auth'));
app.use('/api/internships',  require('./routes/internships'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/wishlist',     require('./routes/wishlist'));

app.get('/', (req, res) => res.json({ message: 'Interna API running ✓' }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected ✓');
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT} ✓`);
    });
    startDeadlineAlerts();
  })
  .catch(err => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });

  //Refract this code for later