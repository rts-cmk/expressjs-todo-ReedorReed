import React, { useEffect, useState } from 'react';

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
		<>
			<form onSubmit={addTodo}>
				<input
					type="text"
					value={text}
					onChange={(event) => setText(event.target.value)}
					placeholder="Add todo..."
				/>
				<button type="submit">Add</button>
			</form>
			<ul>
				{todos.map((todo) => (
					<li key={todo.id}>
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
								<button onClick={() => saveEdit(todo.id)}>Save</button>
								<button onClick={cancelEdit}>Cancel</button>
							</>
						) : (
							<>
								{todo.text}{' '}
								<button onClick={() => remove(todo.id)}>Delete</button>
								<button onClick={() => startEdit(todo.id)}>Edit</button>
							</>
						)}
					</li>
				))}
			</ul>
		</>
	);
}
