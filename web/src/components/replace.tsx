import { useState } from 'react';

const Replace = () => {
	const [key, setKey] = useState('');
	const [file, setFile] = useState<File | null>(null);

	const handleReplace = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!file) {
			return alert('Select file please');
		}

		const response = await fetch(`http://localhost:3000?key=${key}`, {
			method: 'PUT',
			headers: {
				'Content-Type': file.type, // Set correct content type
			},
			body: file, 
		});

		const data = await response.json();

		console.log('REPLACE RESPNOSE', data);
	};

	return (
		<form
			onSubmit={handleReplace}
			className='form'
		>
			<input
				placeholder='Object key'
				value={key}
				onChange={(e) => {
					setKey(e.target.value);
				}}
			/>

			<input
				placeholder='File'
				type='file'
				onChange={(e) => {
					const value = e.target.files;
					if (!value?.length) return;

					const file = value.item(0);
					if (!file) return;

					setFile(file);
				}}
			/>

			<button>Replace</button>
		</form>
	);
};

export default Replace;
