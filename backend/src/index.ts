import express from 'express';
import multer from 'multer';
import cors from 'cors';
import PostController from './Controllers/PostController'

const app = express();
const PORT = 3001;

app.use(cors());

const upload = multer({
  dest: 'uploads/',
});

app.get("/posts", PostController.index);
app.post('/posts/upload', upload.single('csvfile'), PostController.upload);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});