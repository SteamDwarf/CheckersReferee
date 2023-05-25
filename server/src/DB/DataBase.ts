import { Collection, Db, MongoClient, ObjectId } from "mongodb";
import { CollectionNames } from "../database/enums";
import { DBCollections, DocumentTypes, DocumentWithID, IDBCollections } from "../database/types";
import { sportsCategorySchema } from "../models/sportsCategory.model";
import { playersSchema } from "../players/players.model";
import { userSchema } from "../auth/users.model";
import { tournamentSchema } from "../models/tournaments.model";
import { gamesSchema } from "../models/games.model";
import { playerStatsSchema } from "../playerStats/playerStats.model";

class DataBase {
    private readonly _client;
    private readonly _collections: IDBCollections;
    private readonly _URI;

    private _database: Db | undefined;

    constructor(mongoURI: string) {
        this._URI = mongoURI;
        this._client = new MongoClient(mongoURI);
        this._collections = {
            players: undefined,
            sportsCategories: undefined,
            users: undefined,
            tournaments: undefined,
            games: undefined,
            playerStats: undefined
        }
    }

    get collections() {
        return {...this._collections}
    }

    public async connectToDatabase(callback?: () => void) {
        try {
            await this._client.connect()
    
            console.log(`Успешно установлено подключение к базе данных ${this._URI}`);
            this._database = this._client.db("checkers_referee");
    
            this.setCollections();
    
            await this.setCollectionsValidation();
    
            if(callback) callback();
    
        } catch (error) {
            console.error(error);
        }
    }

    public findDocuments (collection: Collection | undefined){
        return collection?.find({}).toArray();
    }
    public findDocumentsWithFilter (collection: Collection | undefined, filter: object){
        return collection?.find(filter).toArray();
    }

    public findDocumentsById (collection: Collection | undefined, ids: string[]){
        const objectIDs = ids.map(id => new ObjectId(id));
        return collection?.find({_id: {$in: objectIDs}}).toArray();
    }

    public findDocument (collection: DBCollections | undefined, filter: object) {
        return collection?.findOne(filter);
    }

    public findDocumentById (collection: Collection | undefined, id: string){
        return collection?.findOne({_id: new ObjectId(id)});
    }

    public createDocument (collection: Collection | undefined, data: DocumentTypes) {
        return collection?.insertOne(data)
                .then(result => collection.findOne({_id: new ObjectId(result.insertedId)}));
    }

    public createDocuments (collection: Collection | undefined, arrayData: DocumentTypes[]){
        return collection?.insertMany(arrayData)
                .then(insertedData => collection?.find({_id: {$in: Object.values(insertedData.insertedIds)}}).toArray());
    }

    public deleteDocument (collection: Collection | undefined, id: string){
        return collection?.deleteOne({_id: new ObjectId(id)});
    }

    public deleteDocuments (collection: Collection | undefined){
        return collection?.deleteMany({});
    }

    public updateDocument (collection: Collection | undefined, id: string, newDocument: object){
        return collection?.updateOne({_id: new ObjectId(id)}, {$set: newDocument})
                .then(() => collection.findOne({_id: new ObjectId(id)}))
    }

    public async updateDocuments (collection: Collection | undefined, newDocuments: DocumentWithID[]){
        const documents = [];

        for(let i = 0; i < newDocuments.length; i++) {
            const updatedDocument = await this.updateDocument(collection, newDocuments[i]._id.toString(), newDocuments[i]);

            documents.push(updatedDocument);
        }

        return documents;
    }

    private setCollections() {
        this._collections.users = this._database?.collection(CollectionNames.USERS);
        this._collections.players = this._database?.collection(CollectionNames.PLAYERS);
        this._collections.sportsCategories = this._database?.collection(CollectionNames.SPORTS_CATEGORIES);
        this._collections.tournaments = this._database?.collection(CollectionNames.TOURNAMENTS);
        this._collections.games = this._database?.collection(CollectionNames.GAMES);
        this._collections.playerStats = this._database?.collection(CollectionNames.PLAYER_STATS);
    }

    private async setCollectionsValidation(){
        await this._database?.command({collMod: CollectionNames.SPORTS_CATEGORIES, validator: sportsCategorySchema.validator})
        await this._database?.command({collMod: CollectionNames.PLAYERS, validator: playersSchema.validator})
        await this._database?.command({collMod: CollectionNames.USERS, validator: userSchema.validator})
        await this._database?.command({collMod: CollectionNames.TOURNAMENTS, validator: tournamentSchema.validator})
        await this._database?.command({collMod: CollectionNames.GAMES, validator: gamesSchema.validator})
        await this._database?.command({collMod: CollectionNames.PLAYER_STATS, validator: playerStatsSchema.validator})
    }

    

}

export default DataBase;