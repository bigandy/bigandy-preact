import { h, Component } from 'preact';

class SinglePage extends Component {
	render() {
		let content = '';
		if (typeof this.props.location.state !== 'undefined') {
			content = this.props.location.state.blogInfo.content;
		} else {
			const split = this.props.location.pathname.split('/');
			const endSplit = split[split.length - 1];

			const check404 = this.props.pages.filter(page => {
				if (page !== null && page.props.children.toLowerCase() === endSplit) {
					// console.log(page.props);
					return true;
				} else {
					return false;
				}
			});

			if (check404.length > 0) {
				content = check404[0].props.to.state.blogInfo.content;
			} else {
				content = '<div><h1>404 Page not found</h1></h1></div>';
			}

		}

		return (
			<section className="single-page">
				<div dangerouslySetInnerHTML={{ __html: content }}></div>
			</section>
		);
	};
};

export default SinglePage;
