import { h } from 'preact';

const Notes = ({posts}) => {
	return (
		<div className="notes">
			<h2 className="main__introduction">I'm a front-end developer based in sunny Oxfordshire. hello!</h2>

			<picture>
				<source className="avatar" srcSet="/images/me-avatar.webp" type="image/webp" />
				<source className="avatar" srcSet="/images/me-avatar.jpg" type="image/jpeg" />
				<img className="avatar" src="/images/me-avatar.jpg" width="280" height="280" alt="Andrew Hudson" />
			</picture>

			<p>This should be:</p>
			<ul className="notes__list">
				<li><del>Utilise the full-width of the browser</del></li>
				<li><del>Using grid or flexbox with fallback</del></li>
				<li><del>loaded from the WP-API,</del></li>
				<li><del>cached in Service Worker,</del></li>
				<li><del>Using React Router</del></li>
				<li>Should work without JS i.e. server-rendered initially if possible</li>
				<li><del>Posts and Pages both served from the WP-API</del></li>
				<li>Style Guide</li>
			</ul>

			<h3>Optional Extras:</h3>
			<ul className="notes__list">
				<li>Have some kind of real-time thing using socket.io</li>
				<li>Use external API e.g. Strava API to grab latest running statistics. Done daily, at the end of each  day or triggered by external node tracker?? Investigate this.</li>
			</ul>
		</div>
	)
};

export default Notes;
