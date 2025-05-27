import { Client, Databases, ID, Query } from "appwrite";
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;

const client = new Client()
	.setEndpoint("https://cloud.appwrite.io/v1")
	.setProject(PROJECT_ID)

const db = new Databases(client);


export async function updateSearchCount(searchTerm, movie) {
	try {
		const normalizedSearchTerm = searchTerm.toLowerCase().replace(/\s/g, '-');
	 
		const result = await db.listDocuments(DATABASE_ID, COLLECTION_ID, [
			Query.equal('searchTerm', normalizedSearchTerm),
	    ]);
		if ( result.documents.length > 0 ) {
			const doc = result.documents[0];
			await db.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
				count: doc.count + 1
			})
		} else {
			
			await db.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
				searchTerm: normalizedSearchTerm,
				count: 1,
				movie_id: movie.id,
				poster_url: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
			})
		}
	} catch (error) {
	    console.error('Error:', error);
	}
}
export async function getTrendingMovies() {
	try {
	    const result = await db.listDocuments(DATABASE_ID, COLLECTION_ID, [
			Query.limit(100)
	    ]);
		
		const agg = {};  // movie_id → { movie_id, poster_url, count }
		
		result.documents.forEach(doc => {
			const { movie_id, poster_url, count } = doc;
			
			if (agg[movie_id]) {
				agg[movie_id].count += count;
			} else {
				agg[movie_id] = { movie_id, poster_url, count };
			}
		});
		
		return Object.values(agg)
		             .sort((a, b) => b.count - a.count)
		             .slice(0, 5);
		
	} catch (error) {
	    console.error('Error:', error);
	}
}
