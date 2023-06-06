import { inject, injectable } from "inversify";
import BaseRepository from "../common/Base.repository";
import { MAIN } from "../common/injectables.types";
import { privateDecrypt } from "crypto";
import DocumentsDatabase from "../DB/DocumentsDatabase";
import PlayerSertificatePlain from "./PlayerSertificatePlain.entity";
import { DocumentCollections } from "../common/enums";
import { DocumentsOptions } from "../common/types";

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
}

export default DocumentsRepository;