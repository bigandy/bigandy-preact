import store from './store';

const fetchFromAPI = (type = 'posts') => {
	return new Promise((resolve, reject) => {
		fetch(`https://big-andy.co.uk/wp-json/bigandy/v1/posts-pages/`)
			.then((response) => {
				// console.log('doing a post fetch');
				// Convert to JSON
				return response.json();
			}).then((posts) => {
				const postsOutput = posts[type].map((post) => {
					return post;
				});

				postsOutput.forEach((post) => {
					if (type === 'pages') {
						store.outbox('readwrite')
							.then(tx => {
								console.log('pages store')
								tx.put({
									'page': post
								});
								return tx.complete;
						});
					} else {
						store.outbox('readwrite')
							.then(tx => {
								tx.put({
									post
								});
								return tx.complete;
						});
					}


				});
				return resolve(postsOutput);
			});
	});
};

export default fetchFromAPI;
