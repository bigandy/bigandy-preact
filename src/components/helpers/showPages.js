import { h } from 'preact';

import { Link } from 'react-router-dom';

const showPages = (pages) => {
	return pages.map((page, i) => {

		const href = (page.slug === 'home') ? '/' : `/pages/${page.slug}`;

		return (
			<Link
				to={{
				  pathname: href,
				  state: {
					  blogInfo: {
						  'content': page.content,
					  }
				}
				}}
				key={ i }
			>
				{ page.title }
			</Link>
		);
	});
};

export default showPages;
