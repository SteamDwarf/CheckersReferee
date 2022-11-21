import { MongoClient, Db } from "mongodb";
import * as dotenv from 'dotenv';

dotenv.config({path: `${__dirname}/../../.env`});

const URL = process.env.MONGO_URI || "dadad";
const client = new MongoClient(URL);

let database: Db;

export const connectToDatabase = () => {
    client.connect()
    .then(() => {
        console.log(`Успешно установлено подключение к базе данных ${URL}`);
        database = client.db("checkers_referee");
    })
    .catch(error => console.error(error));
}

export const findDocuments = (collectionName: string) => {
    if(database) {
        return database.collection(collectionName).find({}).toArray();
    }
}

export const findDocument = (collectionName: string, filter: object) => {
    if (database) {
        return database.collection(collectionName).findOne(filter);
    }
}
