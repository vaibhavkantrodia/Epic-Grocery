import { diskStorage } from "multer";
import * as fs from "fs";
import * as path from "path";
import { HttpException, HttpStatus } from "@nestjs/common";

export const multerOptions = {

    limits: {
        fileSize: 1024 * 1024 * 2,
    },

    // Check the mimetypes to allow for upload
    fileFilter: (req: any, file: any, cb: any) => {
        try {
            if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
                throw new HttpException("Invalid file format. Only JPG, JPEG, and PNG are allowed.", HttpStatus.METHOD_NOT_ALLOWED);
            }
            cb(null, true);
        } catch (error) {
            cb(error, false);
        }
    },

    storage: diskStorage({

        destination(req, file, cb) {
            cb(null, path.join(__dirname, '../../', './files'))
        },

        // File modification details
        filename: (req: any, file: any, cb: any) => {
            if (!fs.existsSync('./files')) {
                fs.mkdirSync('./files')
            }
            cb(null, `${Date.now()}-${file.originalname}`);
        },
    }),
};