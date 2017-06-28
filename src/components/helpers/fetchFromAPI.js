import store from './store';

const fetchFromAPI = (type = 'posts', number = 9) => {
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
						store.outbox('pages', 'readwrite')
							.then(tx => {
								tx.put({
									post
								});
								return tx.complete;
						});
					} else {
						store.outbox('posts', 'readwrite')
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
