import { Request, Response } from 'express';
import fs from 'fs';
import path from "path";
import csvParser from 'csv-parser';
import { Post } from '../Interfaces/Post/PostInterface'

var PostList: Post[] = [];

export default class PostController {
    static readonly MAX_PER_PAGE: number = 7;

    static index(req: Request, res: Response): void {
        const page: number = parseInt(req.query.page as string, 10) || 1;
        const search: string | null = req.query.search as string || null;

        let list: Post[] = PostList;

        if (search) {
            list = list.filter(o => Object.values(o).join(" ").toLowerCase().includes(search.toLowerCase().trim()))
        }

        let pageSize: number = PostController.MAX_PER_PAGE;
        let start: number = (page - 1) * pageSize;
        let end: number = start + pageSize;

        let finalList = list.slice(start, end);

        res.send(JSON.stringify({
            data: finalList,
            current_page: page,
            total_page: Math.ceil(list.length / pageSize),
        }));
    }

    static upload(req: Request, res: Response): void {
        const file = req.file;

        if (!file) {
            res.status(422).json({ error: 'Something went wrong. Please try again.' });
            return;
        }

        if (path.extname(file.originalname).toLowerCase() !== ".csv") {
            res.status(422).json({ error: 'Please upload a CSV file.' });
            return;
        }

        const totalSize = parseInt(req.headers['content-length'] || '0', 10);
        let uploadedSize = 0;

        const readStream = fs.createReadStream(file.path);
        const chunks: Buffer[] = [];

        readStream.on('data', (chunk: Buffer) => {
            uploadedSize += chunk.length;
            const progress = ((uploadedSize / totalSize) * 100).toFixed(2);
            chunks.push(chunk);
        });

        readStream.on('end', () => {
            PostList = [];
            let isHeaderValid: boolean = true;

            fs.createReadStream(file.path)
                .pipe(
                    csvParser({
                        mapHeaders: ({ header }) => header.replace(/"+/g, '').trim(), //sanitize header
                    })
                )
                .on("headers", (headers: string[]) => {
                    if (!['postId', 'id', 'name', 'email', 'body'].every(header => headers.includes(header))) {
                        isHeaderValid = false;
                        readStream.destroy();
                    }
                })
                .on('data', (row: Post) => PostList.push(row))
                .on('end', () => {
                    fs.unlinkSync(file.path);

                    if (!isHeaderValid) {
                        res.status(400).json({ error: "Invalid CSV headers" });
                        PostList = [];
                    } else {
                        res.json({ message: 'File uploaded successfully' });
                    }
                });
        });

        readStream.on('error', (error) => {
            res.status(500).json({ error: 'Error processing file' });
        });
    }
}