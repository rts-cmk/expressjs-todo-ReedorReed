import React from 'react';
import './Header.sass';
import { LuListTodo } from 'react-icons/lu';

export default function Header() {
	return (
		<header className="header">
			<h1>Todo's</h1>
			<LuListTodo />
		</header>
	);
}
