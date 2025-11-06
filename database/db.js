import mongoose from 'mongoose';

const Connection = async (username, password) => {

    // const URL = `mongodb+srv://webdevlopment7890_db_user:<db_password>@cluster0.0cunwue.mongodb.net/`
    const URL = `mongodb+srv://${username}:${password}@cluster0.6hru5fv.mongodb.net/`
    try {
        await mongoose.connect(URL, { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false });
        console.log('Database Connected Succesfully');
    } catch(error) {
        console.log('Error: ', error.message);
    }

};

export default Connection;