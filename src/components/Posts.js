import { h, Component } from 'preact';

class Posts extends Component {
	render() {
		let posts = this.props.posts.length > 0 && this.props.posts.map(post => post);

		return (
			<div>
				<h2>Latest Posts</h2>

				<section className="posts">
					{ posts }
				</section>
			</div>
		);
	}
};

export default Posts;
