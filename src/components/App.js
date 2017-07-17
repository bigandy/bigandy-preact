import { h, Component } from 'preact';

import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import Navigation from './Navigation';
import Posts from './Posts';
import Article from './Article';
import SinglePage from './SinglePage';
import Notes from './Notes';
import Footer from './Footer';

import store from './helpers/store';
import fetchFromAPI from './helpers/fetchFromAPI';

class App extends Component {
	constructor(props) {
		super(props);
		this.postsNumber = 10;
		this.state = {
			posts: [],
			pages: [],
		};
		this.useIDB = false;
	};

	showPosts = (posts, deep = false) => {
		return posts.posts.map((post, i) => {

			// console.log(post);

			if (deep !== false) {
				post = post.post;
			}
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

	showPages = (pages, deep = false) => {
		return pages.pages.map(item => {
			console.log(item);

			// if (deep === false) {
			// 	item = item.post;
			// }

			if (item.slug === 'style-guide') {
				return null;
			}

			let href = `/pages/${item.slug}`;

			if (item.slug === 'home') {
				href = '/';
			}
			return (
				<Link
					to={{
					  pathname: href,
					  state: {
						  blogInfo: {
							  'content': item.content,
				  		  }
			  		}
					}}
					key={ item.id }
				>
					{ item.title }
				</Link>
			);
		});
	};

	componentDidMount() {
		// get the posts
		store.outbox('readwrite')
			.then(db => db.getAll())
			.then(allObjs => {
				return new Promise((resolve, reject) => {
					if (this.useIDB === true && allObjs.length >= 1) {
						// console.log('already have posts in indexedDB')
						resolve(this.showPosts(allObjs[0]));
					} else {
						console.log('do not have posts');
						// Do not have posts so fetch some from API
						fetchFromAPI().then((posts) => {
							resolve(this.showPosts(posts, true));
						});
					}
				})
			}).then(posts => {

				console.log('componentDidMount posts', posts);

				this.setState({
					posts
				});
			});

			store.outbox('readwrite')
				.then(db => db.getAll())
				.then(allObjs => {
					return new Promise((resolve, reject) => {
						if (allObjs.length >= 1) {
							// console.log(allObjs);
							// console.log('already have posts in indexedDB')
							resolve(this.showPages(allObjs[0]));
						} else {
							// console.log('do not have posts');
							// Do not have posts so fetch some from API
							fetchFromAPI('posts', this.postsNumber).then((pages) => {
								resolve(this.showPages(pages, true));
							});
						}
					})
				}).then(pages => {
					console.log('componentDidMount posts', pages);

					this.setState({
						pages
					});
				});

		// store.outbox('readwrite')
		// 	.then(db => db.getAll())
		// 	.then(allObjs => {
		// 		return new Promise((resolve, reject) => {
		// 			if (allObjs.length >= 1) {
		// 				// console.log('already have pages in indexedDB')

		// 				resolve(this.showPages(allObjs));
		// 			} else {
		// 				// console.log('do not have posts');

		// 				fetchFromAPI('pages', 10).then((pages) => {
		// 					resolve(this.showPages(pages, true));
		// 				});
		// 			}
		// 		})
		// 	}).then(pages => {
		// 		// console.log('Here are the pages', pages);
		// 		// Populate this.state.pages with the returned pages
		// 		this.setState({
		// 			pages
		// 		});
		// 	});
	};

	render() {
		const navigation = (this.state.pages.length > 0) ? <Navigation pages={ this.state.pages }/> : null;

		const posts = (this.state.posts.length > 0) ? <Posts posts={ this.state.posts } /> : null;

		return (
			<Router>
				<div>
					{ navigation }
					<main>
						<div className="container container--main">
							<section className="main__posts">
								<Route path="/" exact render={ () => posts } />
								<Route path="/posts/:postid" render={ (props) => {
									if (this.state.pages.length > 0) {
										return (
											<Article posts={ this.state.posts } { ...props } />
										);
									} else {
										return null;
									}
								} } />
								<Route path="/pages/:pageid" render={ (props) => {
									if (this.state.pages.length > 0) {
										return (
											<SinglePage pages={ this.state.pages } { ...props } />
										);
									} else {
										return null;
									}
								} } />
							</section>

							<Route path="/" exact render={() => <Notes /> } />
						</div>
					</main>

					<Footer />
				</div>
			</Router>
		);
	}
}

export default App;
