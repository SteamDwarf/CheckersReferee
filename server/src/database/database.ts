import { MongoClient, Db, ObjectId, Collection } from "mongodb";
import * as dotenv from 'dotenv';
import { CollectionNames } from "./enums";
import { DocumentTypes, IDBCollections } from "./types";

dotenv.config({path: `${__dirname}/../../.env`});

const URL = process.env.MONGO_URI || "mongodb://localhost:27017";
const client = new MongoClient(URL);

let database: Db;

export const collections: IDBCollections = {};

export const connectToDatabase = (callback?: () => void) => {
    client.connect()
    .then(() => {
        console.log(`Успешно установлено подключение к базе данных ${URL}`);
        database = client.db("checkers_referee");

        setCollections();
    })
    .then(() => callback ? callback(): undefined)
    .catch(error => console.error(error));
}

export const findDocuments = (collection: Collection | undefined) => {
    return collection?.find({}).toArray();
}

export const findDocument = (collection: Collection | undefined, filter: object) => {
    return collection?.findOne(filter);
}

export const findDocumentById = (collection: Collection | undefined, id: string) => {
    return collection?.findOne({_id: new ObjectId(id)});
}

export const createDocument = (collection: Collection | undefined, data: DocumentTypes) => {
    return collection?.insertOne(data);
}

export const deleteDocument = (collection: Collection | undefined, id: string) => {
    return collection?.deleteOne({_id: new ObjectId(id)});
}

export const updateDocument = (collection: Collection | undefined, id: string, newDocument: any) => {
    return collection?.updateOne({_id: new ObjectId(id)}, {$set: newDocument})
            .then(() => collection.findOne({_id: new ObjectId(id)}))
}

const setCollections = () => {
    collections.players = database.collection(CollectionNames.PLAYERS);
    collections.sportsCategories = database.collection(CollectionNames.SPORTS_CATEGORIES);
    collections.users = database.collection(CollectionNames.USERS);
    collections.tournaments = database.collection(CollectionNames.TOURNAMENTS);
}
