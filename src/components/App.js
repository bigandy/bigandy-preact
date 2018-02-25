import { h, Component } from 'preact';

import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import Posts from './Posts';
import Article from './Article';
import SinglePage from './SinglePage';
import Notes from './Notes';
import Footer from './Footer';

import store from './helpers/store';
import fetchFromAPI from './helpers/fetchFromAPI';
import showPages from './helpers/showPages';
import showPosts from './helpers/showPosts';

class App extends Component {
	constructor(props) {
		super(props);
		this.postsNumber = 10;
		this.state = {
			posts: [],
			pages: [],
			showFooter: false,
			showNotes: false,
		};
		this.useIDB = true;
	};

	componentDidMount() {
		// get the posts
		if (this.useIDB === true) {
			store.outbox('readwrite')
				.then(db => db.getAll())
				.then(allObjs => {
					return new Promise((resolve, reject) => {
						if (allObjs.length >= 1) {
							// console.log('already have posts in indexedDB')
							resolve(allObjs[0]);
						} else {
							// console.log('do not have posts');
							// Do not have posts so fetch some from API
							fetchFromAPI().then((posts) => {
								resolve(posts);
							});
						}
					})
				}).then((results) => {
					const posts = showPosts(results.posts);
					const pages = showPages(results.pages);

					this.setState({
						posts,
						pages,
						showFooter: true,
						showNotes: true
					});
				});
		} else {
			return new Promise((resolve, reject) => {
				fetchFromAPI().then((posts) => {
					resolve(this.showPosts(posts));
				});
			})
			.then((results) => {
				const posts = showPosts(results.posts);
				const pages = showPages(results.pages);

				this.setState({
					posts,
					pages,
					showFooter: true,
					showNotes: true
				});
			});
		}
	};

	render() {
		const nav = this.state.pages ? this.state.pages.map(page => page) : null;
		const posts = (this.state.posts.length > 0) ? <Posts posts={ this.state.posts } /> : null;

		return (
			<Router>
				<div>
					<header className="header">
						<div className="container">
							<h1 className="header__title">
								<Link to="/">Andrew Hudson</Link>
							</h1>
							<nav className="header__nav">
								{
								nav
								}
							</nav>
						</div>
					</header>
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

							{
								(this.state.showNotes === true) &&
								<Route path="/" exact render={() => <Notes /> } />
							}
						</div>
					</main>

					{
						(this.state.showFooter === true) &&
							<Footer />
					}


				</div>
			</Router>
		);
	}
}

export default App;
