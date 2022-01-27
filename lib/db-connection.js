import mongooseService from 'mongoose';
const { connect, connection } = mongooseService;

const uri = process.env.MONGO_URL;

const db = connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

connection.on('connected', () => {
    console.log('Mongoose is connected to DB');
});

connection.on('err', err => {
    console.log(`Mongoose connection error: ${err.message}`);
});

connection.on('disconnected', () => {
    console.log('Mongoose is disconnected from DB');
});

process.on('SIGINT', async () => {
    connection.close();
    console.log('Connection with DB closed');
    process.exit(1);
});

export default db;