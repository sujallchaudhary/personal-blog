const express = require('express');
const app = express();
const connection = require('./database/connection');
const dotenv = require('dotenv');
dotenv.config();
connection();

const blogPostRouter = require('./routes/blogPostRoute');
const commentRoute = require('./routes/commentRoute');
const authRoute = require('./routes/authRoute');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/blog', blogPostRouter);
app.use('/comment', commentRoute);
app.use('/auth', authRoute);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

