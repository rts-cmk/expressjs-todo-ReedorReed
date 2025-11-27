import express from 'express';
import cors from 'cors';

const app = express();

const PORT = 3500;

const todos = [];

app.use(cors());
app.use(express.json());

app.get('/', (request, response) => {
	response.send('<h1>Todo list</h1>');
});

app.get('/todos', (request, response) => {});

app.listen(PORT, () => {
	console.log(`Server is live and freighting on http://localhost:${PORT}`);
});
