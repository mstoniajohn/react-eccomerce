import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
	return (
		<header>
			<h1>AntiqueLee</h1>
			<nav>
				<ul>
					<li>
						<Link to="/">Products</Link>
					</li>
				</ul>
			</nav>
		</header>
	);
};

export default Header;
