import { useState } from 'react';

const Delete = () => {
	const [key, setKey] = useState('');

	const handleDelete = async () => {
		const encodedKey = encodeURIComponent(key);
		const response = await fetch(`http://localhost:3000/${encodedKey}`, {
			method: 'DELETE',
		});
        const data = await response.json();

        console.log("DELETE RESPONSE", data)
	};

	return (
		<div>
			<input
                placeholder='Object key'
				value={key}
				onChange={(e) => setKey(e.target.value)}
			/>

			<button onClick={handleDelete}>Delete</button>
		</div>
	);
};

export default Delete;
