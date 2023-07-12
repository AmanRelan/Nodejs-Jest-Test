const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect("mongodb+srv://amanrelan:heyyouwhatsup@cluster0.ac3jhfl.mongodb.net/?retryWrites=true&w=majority");
    }
    catch (error) {
        console.log("Failed to connect to Mongo Db because of this ", error);
    }
}


module.exports = { connect };