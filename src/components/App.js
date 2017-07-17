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
		return posts.map((item, i) => {
			if (deep === false) {
				item = item.post;
			}

			return (
				<Article
					content={ item.content }
					excerpt={ item.excerpt }
					link={ `/posts/${item.id}` }
					title={ item.title }
					isList={ true }
					key={ i }
				/>
			);
		});
	};

	showPages = (pages, deep = false) => {
		return pages.map(item => {
			if (deep === false) {
				item = item.post;
			}

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
		store.outbox('readwrite')
			.then(db => db.getAll())
			.then(allObjs => {
				console.log('cdm', allObjs);
				return new Promise((resolve, reject) => {
					if (allObjs.length >= 1) {
						// console.log('already have posts in indexedDB')

						resolve(this.showPosts(allObjs));
					} else {
						// console.log('do not have posts');
						// Do not have posts so fetch some from API
						fetchFromAPI('posts', this.postsNumber).then((posts) => {
							resolve(this.showPosts(posts, true));
						});
					}
				})
			}).then(posts => {
				this.setState({
					posts
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
