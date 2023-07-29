import { Collection, Db, MongoClient, ObjectId } from "mongodb";
import { sportsCategorySchema } from "../sportsCategory/sportsCategory.model";
import { playersSchema } from "../players/players.model";
import { userSchema } from "../auth/users.model";
import { tournamentSchema } from "../tournaments/tournaments.model";
import { gamesSchema } from "../games/games.model";
import { playerStatsSchema } from "../playerStats/playerStats.model";
import { inject, injectable } from "inversify";
import { MAIN } from "../common/injectables.types";
import { DBCollections, DocumentTypes, DocumentWithID, IDBCollections } from "../common/types";
import { CollectionNames } from "../common/enums";

@injectable()
class DataBase {
    private _client: MongoClient;
    private readonly _collections: IDBCollections;

    private _database: Db | undefined;

    constructor(@inject(MAIN.DatabaseURI) private readonly _URI: string) {
        this._collections = {
            players: undefined,
            sportsCategories: undefined,
            users: undefined,
            tournaments: undefined,
            games: undefined,
            playerStats: undefined,
        }
        this.authenticate();
    }

    get collections() {
        return {...this._collections}
    }


    public async connectToDatabase(callback?: () => void) {
        try {
            await this._client.connect();

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
        return collection?.find(filter).toArray() || [];
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

    public async deleteDocuments (collection: Collection | undefined, IDs: (string | undefined)[]){
        const results = [];

        for(let i = 0; i < IDs.length; i++) {
            const id = IDs[i];
            
            if(id) {
                const deleteResult = await this.deleteDocument(collection, id);

                results.push(deleteResult);
            }

        }

        return results;
    }

    public deleteAllDocuments (collection: Collection | undefined){
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

    private authenticate() {
        const username = encodeURIComponent(process.env.MONGO_USERNAME || "");
        const password = encodeURIComponent(process.env.MONGO_PASSWORD || "");
        const authMechanism = "DEFAULT";
        const connectURI = `mongodb://${username}:${password}@${this._URI}/?authMechanism=${authMechanism}`;

        this._client = new MongoClient(connectURI);
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