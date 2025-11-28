import React, { useEffect, useState } from 'react';
import './Form.sass';

export default function Form() {
	const [text, setText] = useState('');
	const [todos, setTodos] = useState([]);
	const [editingId, setEditingId] = useState(null);
	const [editingText, setEditingText] = useState('');

	async function load() {
		const response = await fetch('http://localhost:3500/todos');
		setTodos(await response.json());
	}

	useEffect(() => {
		load;
	}, []);

	async function addTodo(event) {
		event.preventDefault();
		const response = await fetch('http://localhost:3500/todos', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ text: text.trim() })
		});
		const created = await response.json();
		setTodos((prev) => [...prev, created]);
		setText('');
	}

	async function remove(id) {
		await fetch(`http://localhost:3500/todos/${id}`, { method: 'DELETE' });
		setTodos((todo) => todo.filter((x) => x.id !== id));
	}
	function startEdit(id) {
		const todo = todos.find((t) => t.id === id);
		if (!todo) return;
		setEditingId(id);
		setEditingText(todo.text);
	}

	function cancelEdit() {
		setEditingId(null);
		setEditingText('');
	}

	async function saveEdit(id) {
		const newText = editingText.trim();
		if (!newText) return;

		const response = await fetch(`http://localhost:3500/todos/${id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ text: newText })
		});

		const updated = await response.json();
		setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
		cancelEdit();
	}

	return (
		<div className="todo">
			<form onSubmit={addTodo} className="todo__form">
				<input
					type="text"
					value={text}
					onChange={(event) => setText(event.target.value)}
					placeholder="Add todo..."
					className="todo__input"
				/>
				<button type="submit" className="todo__button">
					+
				</button>
			</form>
			<ul className="todo__ul">
				{todos.map((todo) => (
					<li key={todo.id} className="todo__li">
						{editingId === todo.id ? (
							<>
								<input
									value={editingText}
									onChange={(event) => setEditingText(event.target.value)}
									onKeyDown={(event) => {
										if (event.key === 'Enter') saveEdit(todo.id);
										if (event.key === 'Escape') cancelEdit();
									}}
									autoFocus
								/>
								<button
									onClick={() => saveEdit(todo.id)}
									className="todo__button">
									Save
								</button>
								<button onClick={cancelEdit} className="todo__button">
									Cancel
								</button>
							</>
						) : (
							<div className="todo__button-container">
								{todo.text}{' '}
								<button
									onClick={() => remove(todo.id)}
									className="todo__button">
									Delete
								</button>
								<button
									onClick={() => startEdit(todo.id)}
									className="todo__button">
									Edit
								</button>
							</div>
						)}
					</li>
				))}
			</ul>
		</div>
	);
}
