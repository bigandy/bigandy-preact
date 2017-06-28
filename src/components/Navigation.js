import { h, Component } from 'preact';

import { Link } from 'react-router-dom';

class Navigation extends Component {
	render() {
		let pages = this.props.pages.length > 0 && this.props.pages.map(page => page);

		return (
			<header className="header">
				<div className="container">
					<h1 className="header__title">
						<Link to="/">Andrew Hudson</Link>
					</h1>
					<nav className="header__nav">
						{ pages }
					</nav>
				</div>
			</header>
		);
	}
};

export default Navigation;
