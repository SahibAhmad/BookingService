const express = require('express');
const bodyParser = require('body-parser');

const { PORT } = require('./config/serverConfig');
const apiRoutes = require('./routes/index');
const db = require('./models/index');

const setupAndStartServer = async () => {
    const app = express();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    app.use('/api',apiRoutes);
    
    app.listen(PORT,()=>{
        console.log(`Server started on port: ${PORT}`);

        if(process.env.DB_SYNC) {
            db.Sequelize.sync({alter: true});
        }

    })
}

setupAndStartServer();