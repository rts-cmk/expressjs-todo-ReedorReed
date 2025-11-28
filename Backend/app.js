import express, { request, response } from 'express';
import cors from 'cors';

const app = express();

const PORT = 3500;

const todos = [];

app.use(cors());
app.use(express.json());

app.get('/', (request, response) => {
	response.send('<h1>Todo list</h1>');
});

app.get('/todos', (request, response) => {
	response.json(todos);
});

app.post('/todos', (request, response) => {
	const { text } = request.body;
	const id = Date.now().toString();
	const todo = { id, text, done: false };
	todos.push(todo);
	response.status(201).json(todo);
});

app.put('/todos/:id', (request, response) => {
	const { id } = request.params;
	const { text, done } = request.body;
	const index = todos.findIndex((i) => i.id === id);

	const todo = todos[index];
	if (typeof text === 'string') todo.text = text;
	if (typeof done === 'boolean') todo.done = done;
	response.json(todo);
});

app.delete('/todos/:id', (request, response) => {
	const { id } = request.params.id;
	const index = todos.findIndex((i) => i.id === id);
	const removed = todos.splice(index, 1)[0];
	response.json(removed);
});

app.listen(PORT, () => {
	console.log(`Server is live and freighting on http://localhost:${PORT}`);
});
