import React, { useState } from 'react';


const Upload = () => {
	const [directory, setDirectory] = useState('');
	const [file, setFile] = useState<File | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!file) {
			alert('FILE NOT SELECTED');
			return;
		}

		const queryString = new URLSearchParams({ dir: directory }).toString();
		const response = await fetch(`http://localhost:3000/upload?${queryString}`, {
			method: 'POST',
			body: file,
			headers: {
				"Content-Type": file.type,
				"X-File-Name": file.name
			}
		});

		const data = await response.json();

		console.log('UPLOAD RESULT', data);
	};

	return (
		<form
			onSubmit={handleSubmit}
			className='form'
		>
			<input
				type='text'
				placeholder='directory'
				className='text'
				value={directory}
				onChange={(e) => setDirectory(e.target.value)}
			/>

			<input
				type='file'
				className='file'
				onChange={(e) => {
					const value = e.target.files;
					if (!value?.length) return;

					const file = value.item(0);
					if (!file) return;

					setFile(file);
				}}
			/>

			<button className='submit'>Submit</button>
		</form>
	);
};

export default Upload;
