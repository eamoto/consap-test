import { Request, Response } from 'express';
import fs from 'fs';
import path from "path";
import csvParser from 'csv-parser';
import { Post } from '../Interfaces/Post/PostInterface'

export default class PostController {
    static readonly MAX_PER_PAGE: number = 8;
    
    //Temporary - for testing purposes. For production, it is advisable to create a data model.
    static readonly POST_HEADERS: string[] = ['postId', 'id', 'name', 'email', 'body'];
    static PostList: Post[] = [];

    static index(req: Request, res: Response): void {
        let page: number = parseInt(req.query.page as string, 10) || 1;
        let search: string | null = req.query.search as string || null;

        if (page < 1) page = 1;

        let list: Post[] = PostController.PostList;

        if (search) {
            list = list.filter(o => Object.values(o).join(" ").toLowerCase().includes(search.toLowerCase().trim()))
        }

        let pageSize: number = PostController.MAX_PER_PAGE;
        let start: number = (page - 1) * pageSize;
        let end: number = start + pageSize;

        let finalList: Post[] = list.slice(start, end);

        res.json({
            data: finalList,
            current_page: page,
            total_page: Math.ceil(list.length / pageSize),
        });
    }

    static upload(req: Request, res: Response): void {
        const file: Express.Multer.File | undefined = req.file;

        if (!file) {
            res.status(422).json({ error: 'Something went wrong. Please try again.' });
            return;
        }

        if (path.extname(file.originalname).toLowerCase() !== ".csv") {
            res.status(422).json({ error: 'Please upload a CSV file.' });
            return;
        }

        const readStream: fs.ReadStream = fs.createReadStream(file.path);
        const chunks: Buffer[] = [];

        readStream.on('data', (chunk: Buffer) => {
            chunks.push(chunk);
        });

        readStream.on('end', () => {
            PostController.PostList = [];
            let isHeaderValid: boolean = true;

            fs.createReadStream(file.path)
                .pipe(
                    csvParser({
                        mapHeaders: ({ header }) => header.replace(/"+/g, '').trim(), //sanitize header
                        mapValues: ({ header, value }) => {
                            if (header === "body")
                                return value.replace(/\\n/g, '<br />');

                            return value;
                        },
                    })
                )
                .on("headers", (headers: string[]) => {
                    if (!PostController.POST_HEADERS.every(header => headers.includes(header))) {
                        isHeaderValid = false;
                        readStream.destroy();
                    }
                })
                .on('data', (row: Post) => PostController.PostList.push(row))
                .on('end', () => {
                    fs.unlinkSync(file.path);

                    if (!isHeaderValid) {
                        res.status(422).json({ error: "Invalid CSV headers" });
                        PostController.PostList = [];
                    } else {
                        res.json({ message: 'File uploaded successfully' });
                    }
                });
        });
    }
}