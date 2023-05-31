import { readFile, readdir } from "fs/promises";
import path from "path";
import { DocumentCollections, DocumentTemplates } from "../common/enums";
import { inject, injectable } from "inversify";
import { DocumentsType } from "../common/types";
import { MAIN } from "../common/injectables.types";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdf = require("pdf-creator-node");

@injectable()
class DocumentsDatabase {
    //private readonly _templatesPath: string;

    constructor(
        @inject(MAIN.DocumentsPath) private readonly _documentsPath: string,
        //templatesPath: string
    ) {
        //this._templatesPath = templatesPath;
    }

    public async findDocument(documentTitle: string) {
        const documentsTitles = await readdir(path.resolve(this._documentsPath, documentTitle), "utf-8");
        const isExist = documentsTitles.includes(documentTitle);

        if(isExist) {
            return path.resolve(this._documentsPath, documentTitle);
        }

        return null;
    }

    public async createDocument(
        collectionName: DocumentCollections, 
        documentTitle: string,
        options: object,
        data: DocumentsType
    ) {
        const html = await readFile(path.resolve(this._documentsPath, collectionName, "template.html"), "utf-8");
        const document = {
            html,
            data,
            path: path.resolve(this._documentsPath, collectionName, "document-files", `${documentTitle}.pdf`)
        }
        return await pdf.create(document, options) as {filename: string};
        /* console.log(document.path);
        console.log(result); */
        
    }
}

export default DocumentsDatabase;