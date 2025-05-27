export default async (req, res) => {
	const apiKey = process.env.TMDB_API_KEY;
	const baseUrl = 'https://api.themoviedb.org/3';
	const query = req.query.query || '';
	
	let endpoint;
	if (query) {
		endpoint = `${baseUrl}/search/movie?query=${encodeURIComponent(query)}`;
	} else {
		endpoint = `${baseUrl}/discover/movie?sort_by=popularity.desc`;
	}
	
	try {
		const response = await fetch(endpoint, {
			method: 'GET',
			headers: {
				accept: 'application/json',
				Authorization: `Bearer ${apiKey}`,
			},
		});
		if (!response.ok) {
			throw new Error('Failed to fetch movies');
		}
		const data = await response.json();
		res.status(200).json(data);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

