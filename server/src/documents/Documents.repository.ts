import { inject, injectable } from "inversify";
import { MAIN } from "../common/injectables.types";
import DocumentsDatabase from "../DB/DocumentsDatabase";
import PlayerSertificatePlain from "./PlayerSertificatePlain.entity";
import { DocumentCollections } from "../common/enums";
import { DocumentsOptions } from "../common/types";
import RankList from "./RankList.entity";

@injectable()
class DocumentsRepository{
    constructor(
        @inject(MAIN.DocumentsDatabase) private readonly _db: DocumentsDatabase
    ) {
    }

    public async createPlayerSertificate(
        sertificateData: PlayerSertificatePlain,
        documentTitle: string,
        options: DocumentsOptions
    ) {
        return await this._db.createDocument(
            DocumentCollections.PlayerSertificate,
            documentTitle,
            options,
            sertificateData
        )
    }

    public async findeRankList(documentTitle: string,) {
        return await this._db.findDocument(DocumentCollections.RankList, documentTitle);
    }

    public async createRankList(
        rankListData: RankList,
        documentTitle: string,
        options: DocumentsOptions
    ) {
        return await this._db.createDocument(
            DocumentCollections.RankList,
            documentTitle,
            options,
            rankListData
        )
    }
}

export default DocumentsRepository;