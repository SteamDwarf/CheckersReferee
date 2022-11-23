import { MongoClient, Db } from "mongodb";
import * as dotenv from 'dotenv';
import { CollectionNames } from "./enums";
import { DocumentTypes } from "./types";

dotenv.config({path: `${__dirname}/../../.env`});

const URL = process.env.MONGO_URI || "mongodb://localhost:27017";
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

export const findDocuments = (collectionName: CollectionNames) => {
    if(database) {
        return database.collection(collectionName).find({}).toArray();
    }
}

export const findDocument = (collectionName: CollectionNames, filter: object) => {
    if (database) {
        return database.collection(collectionName).findOne(filter);
    }
}

export const createDocument = (collectionName: CollectionNames, data: DocumentTypes) => {
    if(database) {
        return database.collection(collectionName).insertOne(data);
    }
}
