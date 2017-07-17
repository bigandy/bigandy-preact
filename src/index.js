import { h, render } from 'preact';
import App from './components/App';
// import './style/style.css';	

const app = document.getElementById('app');

render(
	<App />,
	app,
	app.firstElementChild
);
