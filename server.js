const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

let Task = [];

app.listen(3000, () => console.log('Listening on port 5000'));