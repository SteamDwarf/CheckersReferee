import { MongoClient, Db, ObjectId, Collection, OptionalId, WithId } from "mongodb";
import * as dotenv from 'dotenv';
import { CollectionNames } from "./enums";
import { DBCollections, DocumentTypes, DocumentWithID, IDBCollections } from "./types";
import { playersSchema } from "../players/players.model";
import { sportsCategorySchema } from "../models/sportsCategory.model";
import { IUser, userSchema } from "../auth/users.model";
import { tournamentSchema } from "../models/tournaments.model";
import { gamesSchema } from "../models/games.model";
import { playerStatsSchema } from "../playerStats/playerStats.model";

dotenv.config({path: `${__dirname}/../../.env`});

const URL = process.env.MONGO_URI || "mongodb://localhost:27017";
const client = new MongoClient(URL);

let database: Db;

const collections: IDBCollections = {
    players: undefined,
    sportsCategories: undefined,
    users: undefined,
    tournaments: undefined,
    games: undefined,
    playerStats: undefined
};

export const getDBCollections = (): IDBCollections => Object.assign({}, collections);

export const connectToDatabase = async(callback?: () => void) => {
    try {
        await client.connect()

        console.log(`Успешно установлено подключение к базе данных ${URL}`);
        database = client.db("checkers_referee");

        setCollections();

        await setCollectionsValidation();

        if(callback) callback();

    } catch (error) {
        console.error(error);
    }
}

const setCollections = () => {
    collections.users = database.collection(CollectionNames.USERS);
    collections.players = database.collection(CollectionNames.PLAYERS);
    collections.sportsCategories = database.collection(CollectionNames.SPORTS_CATEGORIES);
    collections.tournaments = database.collection(CollectionNames.TOURNAMENTS);
    collections.games = database.collection(CollectionNames.GAMES);
    collections.playerStats = database.collection(CollectionNames.PLAYER_STATS);
}

const setCollectionsValidation = async() => {
    await database.command({collMod: CollectionNames.PLAYERS, validator: playersSchema.validator})
    await database.command({collMod: CollectionNames.SPORTS_CATEGORIES, validator: sportsCategorySchema.validator})
    await database.command({collMod: CollectionNames.USERS, validator: userSchema.validator})
    await database.command({collMod: CollectionNames.TOURNAMENTS, validator: tournamentSchema.validator})
    await database.command({collMod: CollectionNames.GAMES, validator: gamesSchema.validator})
    await database.command({collMod: CollectionNames.PLAYER_STATS, validator: playerStatsSchema.validator})
}

export const findDocuments = (collection: Collection | undefined) => {
    return collection?.find({}).toArray();
}
export const findDocumentsWithFilter = (collection: Collection | undefined, filter: object) => {
    return collection?.find(filter).toArray();
}

export const findDocumentsById = (collection: Collection | undefined, ids: string[]) => {
    const objectIDs = ids.map(id => new ObjectId(id));
    return collection?.find({_id: {$in: objectIDs}}).toArray();
}

export const findDocument = (collection: DBCollections | undefined, filter: object) => {
    return collection?.findOne(filter);
}

export const findDocumentById = (collection: Collection | undefined, id: string) => {
    return collection?.findOne({_id: new ObjectId(id)});
}

export const createDocument = (collection: Collection | undefined, data: DocumentTypes) => {
    return collection?.insertOne(data)
            .then(result => collection.findOne({_id: new ObjectId(result.insertedId)}));
}

export const createDocuments = (collection: Collection | undefined, arrayData: DocumentTypes[]) => {
    return collection?.insertMany(arrayData)
            .then(insertedData => collection?.find({_id: {$in: Object.values(insertedData.insertedIds)}}).toArray());
}

export const deleteDocument = (collection: Collection | undefined, id: string) => {
    return collection?.deleteOne({_id: new ObjectId(id)});
}

export const deleteDocuments = (collection: Collection | undefined) => {
    return collection?.deleteMany({});
}

export const updateDocument = (collection: Collection | undefined, id: string, newDocument: object) => {
    return collection?.updateOne({_id: new ObjectId(id)}, {$set: newDocument})
            .then(() => collection.findOne({_id: new ObjectId(id)}))
}

export const updateDocuments = async (collection: Collection | undefined, newDocuments: DocumentWithID[]) => {
    const documents = [];

    for(let i = 0; i < newDocuments.length; i++) {
        const updatedDocument = await updateDocument(collection, newDocuments[i]._id.toString(), newDocuments[i]);

        documents.push(updatedDocument);
    }

    return documents;
}



