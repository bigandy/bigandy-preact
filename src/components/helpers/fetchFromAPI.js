import store from './store';

const fetchFromAPI = (type = 'posts') => {
	return new Promise((resolve, reject) => {
		fetch('https://big-andy.co.uk/wp-json/bigandy/v1/posts-pages/')
			.then((response) => {
				// Convert to JSON
				return response.json();
			}).then((json) => {
				const { posts, pages } = json;

				store.outbox('readwrite')
					.then(tx => {
						tx.put({
							pages,
							posts,
						});
						return tx.complete;
					});
				return resolve(json);
			});
	});
};

export default fetchFromAPI;
