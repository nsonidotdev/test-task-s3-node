import './App.css';
import Upload from './components/upload';
import List from './components/list';
import Delete from './components/delete';
import Replace from './components/replace';

function App() {
	return (
		<>
			<List />

			<Delete />

			<Upload />

			<Replace />
		</>
	);
}

export default App;
