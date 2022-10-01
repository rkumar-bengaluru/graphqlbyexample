const express = require('express');
const colors = require('colors')
require('dotenv').config();
const {graphqlHTTP} = require('express-graphql')
const port = process.env.PORT || 5000;
const schema = require('./schema/schema.js')
const connectDB = require('./config/db.js')
const app = express();
const cors = require('cors')
// connect to database
console.log(encodeURIComponent(process.env.MONGO_DB_URL))
connectDB();

app.use(cors());
app.use('/graphql',graphqlHTTP({
    schema,
    graphiql:process.env.NODE_ENV === 'development'
}))

app.listen(port, console.log(`Server running on port ${port}`));
