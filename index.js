const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const app = express();
const ussdRoutes = require('./routes/ussdRoutes')

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', ussdRoutes);

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('USSD Service is running...');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
