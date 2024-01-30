import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

export default function Scan() {
	const navigate = useNavigate();

	return (
		<main>
			<h1>Scan</h1>
			<Outlet />
		</main>
	);
}
