// lib/db.js
import mongoose from 'mongoose';

const connection = {}; // Connection cache

async function connect() {
    console.log('Connecting to database...');
    if (connection.isConnected) {
        return;
    }

    const db = await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    connection.isConnected = db.connections[0].readyState;
}

export default connect;
