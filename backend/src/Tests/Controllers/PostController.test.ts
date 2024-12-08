import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import supertest from 'supertest';
import express, {Express, Response} from 'express';
import multer from 'multer';
import { faker } from '@faker-js/faker';
import PostController from './../../Controllers/PostController.ts';

const app: Express = express();
const uploadMiddleware = multer({ dest: 'uploads/' }).single('file');

app.post('/posts/upload', uploadMiddleware, PostController.upload);
app.get('/posts', PostController.index);

let testData: string[] = [];

describe('PostController.index', () => {

    beforeAll(async () => {
        let csvData: string[] = ["postId,id,name,email,body"];
        for (var i: number = 0; i < 500; i++) {
            csvData.push([faker.number.int(), i + 1, faker.person.fullName(), faker.internet.email(), faker.lorem.paragraph()].join(","))
        }

        testData = csvData;
        let csvContent: string = csvData.join("\n");

        const response = await supertest(app)
            .post('/posts/upload')
            .attach('file', Buffer.from(csvContent), 'test.csv');
    });


    it('first page', async () => {
        const response = await supertest(app).get('/posts?page=1').set('Accept', 'application/json');
        expect(response.status).toBe(200);
        expect(response.body.data).toHaveLength(PostController.MAX_PER_PAGE);
        expect(response.body.current_page).toBe(1);
        expect(response.body.total_page).toBe(Math.ceil(500 / PostController.MAX_PER_PAGE));
    });

    it('second page', async () => {
        const response = await supertest(app).get('/posts?page=2');
        expect(response.status).toBe(200);
        expect(response.body.data).toHaveLength(PostController.MAX_PER_PAGE);
        expect(response.body.current_page).toBe(2);
    });

    it('missing parameter page', async () => {
        const response = await supertest(app).get('/posts');
        expect(response.status).toBe(200);
        expect(response.body.data).toHaveLength(PostController.MAX_PER_PAGE);
        expect(response.body.current_page).toBe(1);
    });

    it('greater than max page', async () => {
        const response = await supertest(app).get('/posts?page=999');
        expect(response.status).toBe(200);
        expect(response.body.data).toHaveLength(0);
        expect(response.body.current_page).toBe(999);
    });

    it('non numeric page', async () => {
        const response = await supertest(app).get('/posts?page=test');
        expect(response.status).toBe(200);
        expect(response.body.data).toHaveLength(PostController.MAX_PER_PAGE);
        expect(response.body.current_page).toBe(1);
    });

    it('negative page', async () => {
        const response = await supertest(app).get('/posts?page=-1');
        expect(response.status).toBe(200);
        expect(response.body.data).toHaveLength(PostController.MAX_PER_PAGE);
        expect(response.body.current_page).toBe(1);
    });

    it('search', async () => {
        const email:string = testData[1].split(",")[3];
        const response = await supertest(app).get('/posts?search=' + email);
        expect(response.status).toBe(200);
        expect(response.body.data).toHaveLength(1);
        expect(response.body.data[0].email).toBe(email);
    });

    it('empty each result', async () => {
        const response = await supertest(app).get('/posts?search=not-on-csv@email.com');
        expect(response.status).toBe(200);
        expect(response.body.data).toHaveLength(0);
    });
});

describe('PostController.upload', () => {
    it('no file attached', async () => {
        const response = await supertest(app)
            .post('/posts/upload')
            .send(); 

        expect(response.status).toBe(422);
        expect(response.body.error).toBe('Something went wrong. Please try again.');
    });

    it('not a CSV file uploaded', async () => {
        const response = await supertest(app)
            .post('/posts/upload')
            .attach('file', Buffer.from('test'), 'test.txt');  // Uploading a .txt file

        expect(response.status).toBe(422);
        expect(response.body.error).toBe('Please upload a CSV file.');
    });
 
    it('invalid headers', async () => {
        const csvContent:string = `invalidHeader1, invalidHeader2\n1, John Doe`;
        const response = await supertest(app)
            .post('/posts/upload')
            .attach('file', Buffer.from(csvContent), 'test.csv')
            
        expect(response.status).toBe(422);
        expect(response.body.error).toBe('Invalid CSV headers');
    });

    it('success', async () => {
        let csvData: string[] = ["postId,id,name,email,body"];
        for (var i: number = 0; i < 500; i++) {
            csvData.push([faker.number.int(), i + 1, faker.person.fullName(), faker.internet.email(), faker.lorem.paragraph()].join(","))
        }

        testData = csvData;
        let csvContent: string = csvData.join("\n");
        
        const response = await supertest(app)
            .post('/posts/upload')
            .attach('file', Buffer.from(csvContent), 'test.csv');

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('File uploaded successfully');
    });
});