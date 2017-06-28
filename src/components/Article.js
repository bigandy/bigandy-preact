import { h, Component } from 'preact';

import { Link } from 'react-router-dom';

class Article extends Component {
	render() {
		let title = this.props.title;
		let content = this.props.content;

		let wrapperClass = '';
		let renderedContent = '';
		let header;

		if (this.props.isList) {
			wrapperClass = 'post';
			renderedContent = this.props.excerpt;

			header = (
				<header>
					<h2 className="post__title">
						<Link to={{
							pathname: this.props.link,
							state: {
								blogInfo: {
									title,
									content,
									'isSingle': false
								}
							}
						}}>
							{ title }
						</Link>
					</h2>
				</header>
			);
		} else { // Single Post
			const path = this.props.location.pathname;

			const check404 = this.props.posts.filter(post => {
				if (post !== null && post.props.link === path) {
					return true;
				} else {
					return false;
				}
			});

			if (check404.length > 0) {
				header = (
					<header>
						<Link to="/" className="post__back-link">Back</Link>

						<h2 className="post__title">
							{ check404[0].props.title }
						</h2>
					</header>
				);

				// const blogInfo = this.props.location.state.blogInfo;
				renderedContent = check404[0].props.content;
			} else {
				renderedContent = '<div><h1>404 Post not found</h1></h1></div>';
			}

			wrapperClass = 'post post--single';
		}

		return (
			<article className={ wrapperClass }>
				{ header }

				<div dangerouslySetInnerHTML={ { __html: renderedContent } }></div>
			</article>
		);
	}
};

export default Article;
