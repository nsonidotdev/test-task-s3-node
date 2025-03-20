export const handleDeleteObject = async (req, res) => {
    const key = req.params.key;
    console.log('DELETE OBJECT KEY', key)

	res.writeHead(200);
	res.end(JSON.stringify({ message: 'Delete successful' }));
};
