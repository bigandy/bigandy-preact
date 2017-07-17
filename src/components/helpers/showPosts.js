import { h } from 'preact';

import Article from '../Article';

const showPosts = (posts) => {
	return posts.map((post, i) => {
		return (
			<Article
				content={ post.content }
				excerpt={ post.excerpt }
				link={ `/posts/${post.id}` }
				title={ post.title }
				isList={ true }
				key={ i }
			/>
		);
	});
};

export default showPosts;
