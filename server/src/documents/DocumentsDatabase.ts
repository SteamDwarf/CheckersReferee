import { readFile, readdir } from "fs/promises";
import path from "path";
import { DocumentTemplates } from "../common/enums";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdf = require("pdf-creator-node");

class DocumentsDatabase {
    private readonly _documentsPath: string;
    private readonly _templatesPath: string;

    constructor(
        documentsPath: string,
        templatesPath: string
    ) {
        this._documentsPath = documentsPath;
        this._templatesPath = templatesPath;
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
        template: DocumentTemplates, 
        documentTitle: string,
        options: object,
        data: object
    ) {
        const html = await readFile(path.resolve(this._templatesPath, template), "utf-8");
        const document = {
            html,
            data,
            path: path.resolve(__dirname, "documents/documentsTemplates", documentTitle)
        }
        return await pdf.create(document, options);
    }
}

export default DocumentsDatabase;