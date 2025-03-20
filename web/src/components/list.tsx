import { useState } from 'react';

const List = () => {
	const [items, setItems] = useState<
		{
			key: string;
			meta: Record<string, unknown>;
			lastModified: string;
			size: number;
			url: string;
		}[]
	>([]);
	const [countStr, setCountStr] = useState('');

	const handleList = async () => {
		const isInputValid = !Number.isNaN(Number(countStr.trim()));
		if (!isInputValid) {
			alert('Invalid number using default 5');
		}
		const count = isInputValid ? Number(countStr.trim()) : 5;

		const response = await fetch(`http://localhost:3000?c=${Math.max(count, 1)}`);
		const data = await response.json();

		setItems(data);
	};

	return (
		<div>
			<input
				placeholder='count'
				type='text'
				value={countStr}
				onChange={(e) => {
					const value = e.target.value;
					setCountStr(value);
				}}
			/>

			<button onClick={handleList}>List</button>

			<div>
				{items.map((item) => (
					<div key={item.key}>
						<p>{item.key}</p>
						<p>Size {item.size} Bytes</p>
						<a href={item.url} target='_blank'>Open</a>
						<hr></hr>
					</div>
				))}
			</div>
		</div>
	);
};

export default List;
