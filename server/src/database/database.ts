import { MongoClient, Db, ObjectId, Collection, OptionalId } from "mongodb";
import * as dotenv from 'dotenv';
import { CollectionNames } from "./enums";
import { DBCollections, DocumentTypes, IDBCollections } from "./types";
import { playersSchema } from "../models/players.model";
import { sportsCategorySchema } from "../models/sportsCategory.model";
import { IUser, userSchema } from "../models/users.model";
import { tournamentSchema } from "../models/tournaments.model";
import { gamesSchema } from "../models/games.model";
import { playerStatsSchema } from "../models/playerStats.model";

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

const setCollections = () => {
    collections.users = database.collection<OptionalId<IUser>>(CollectionNames.USERS);
    collections.players = database.collection(CollectionNames.PLAYERS);
    collections.sportsCategories = database.collection(CollectionNames.SPORTS_CATEGORIES);
    collections.tournaments = database.collection(CollectionNames.TOURNAMENTS);
    collections.games = database.collection(CollectionNames.GAMES);
    collections.playerStats = database.collection(CollectionNames.PLAYER_STATS);
}

const validateCollections = () => {
    return database.command({collMod: CollectionNames.PLAYERS, validator: playersSchema.validator})
    .then(() => database.command({collMod: CollectionNames.SPORTS_CATEGORIES, validator: sportsCategorySchema.validator}))
    .then(() => database.command({collMod: CollectionNames.USERS, validator: userSchema.validator}))
    .then(() => database.command({collMod: CollectionNames.TOURNAMENTS, validator: tournamentSchema.validator}))
    .then(() => database.command({collMod: CollectionNames.GAMES, validator: gamesSchema.validator}))
    .then(() => database.command({collMod: CollectionNames.PLAYER_STATS, validator: playerStatsSchema.validator}))
}

export const connectToDatabase = (callback?: () => void) => {
    client.connect()
    .then(() => {
        console.log(`Успешно установлено подключение к базе данных ${URL}`);
        database = client.db("checkers_referee");

        setCollections();
        return validateCollections();
    })
    .then(() => callback ? callback(): undefined)
    .catch(error => console.error(error));
}

export const findDocuments = (collection: Collection | undefined) => {
    return collection?.find({}).toArray();
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

export const deleteDocument = (collection: Collection | undefined, id: string) => {
    return collection?.deleteOne({_id: new ObjectId(id)});
}

export const updateDocument = (collection: Collection | undefined, id: string, newDocument: any) => {
    return collection?.updateOne({_id: new ObjectId(id)}, {$set: newDocument})
            .then(() => collection.findOne({_id: new ObjectId(id)}))
}



