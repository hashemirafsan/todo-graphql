const express = require('express');
const graphHTTP = require('express-graphql');
const mongoose = require('mongoose');
const schema = require('./schema/schema');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8090;
const path = require('path');

// Cors
app.use(cors());
app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// mongoose
// mongoose.connect("mongodb://127.0.0.1:27017/bikroy");
// mongoose.connection.once('open', () => {
//     console.log('Connect To My Database');
// })

mongoose.connect("mongodb://hashemirafsan:01625903501RrR@ds115762.mlab.com:15762/graphql");
mongoose.connection.once('open', () => {
    console.log('Connect To Mlab');
})

//graphql
app.use('/graphql', graphHTTP({
    schema,
    graphiql: true
}));

app.listen(port, () => {
    console.log(`App listen on http://localhost:${port}`);
});