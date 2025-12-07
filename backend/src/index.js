const express = require('express');
const cors = require('cors');
const salesRoutes = require('./routes/salesRoutes');
const { initDatabase } = require('./db/init');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


initDatabase().then(() => {
    console.log('Database initialized successfully');
}).catch(err => {
    console.error('Failed to initialize database:', err);
});


app.use('/api/sales', salesRoutes);

app.get('/', (req, res) => {
    res.send('TruEstate Sales API is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
