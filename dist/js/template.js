// Me cansé de modificar los html todo el rato así que le mando esto

(() => {
	let pagesPath = window.location.href.includes('index.html') ? 'pages/' : '';
	let currentPage = getCurrentPage();

	let pageHeader = /* HTML */
		`<!------ HEADER ------>
		<header class="navbar-fixed">
			<!-- NAVBAR -->
			<nav>
				<div class="nav-wrapper container">
					<a href="${setHref('index', '../')}" class="brand-logo truncate">E-Commerce</a>
					<a href="#" data-target="slide-out" class="sidenav-trigger"><i class="material-icons">menu</i></a>
					<ul class="right hide-on-med-and-down">
						<li><a class="waves-effect waves-classic" href="${setHref('index', '../')}">HOME</a></li>
						<li><a class="waves-effect waves-classic" href="${setHref('products', pagesPath)}">PRODUCTS</a></li>
						<li><a class="waves-effect waves-classic" href="${setHref('contact', pagesPath)}">CONTACT</a></li>
						<li><a class="waves-effect waves-classic" href="${setHref('about', pagesPath)}">ABOUT</a></li>
						<li><a class="waves-effect waves-classic" href="${setHref('cart', pagesPath)}">
								<i class="material-icons badge-container">
									<span class="cart-badge hide">0</span>
									shopping_cart
								</i>
						</a></li>
					</ul>
				</div>
			</nav>
		</header>
		`;

	let pageFooter = /* HTML */
		`<!------ FOOTER ------>
		<footer class="page-footer">
			<div class="footer-container">
				<div class="row">
					<div class="col l4 s12">
						<h5 class="footer-header h5 white-text">Links</h5>
						<ul>
							<li><a class="grey-text text-lighten-3" href="#!">Link 1</a></li>
							<li><a class="grey-text text-lighten-3" href="#!">Link 2</a></li>
							<li><a class="grey-text text-lighten-3" href="#!">Link 3</a></li>
							<li><a class="grey-text text-lighten-3" href="#!">Link 4</a></li>
						</ul>
					</div>
					<div class="col l6 s12">
						<h5 class="footer-header h5 white-text">E-Commerce</h5>
						<p class="grey-text text-lighten-4">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ut neque voluptates nam nihil excepturi est quos itaque. Dolorum, mollitia natus?</p>
					</div>
				</div>
			</div>
			<div class="footer-copyright">
				<div class="container">
					<div class="">
						<span class="center center-block">© 2022 E-Commerce</span>
					</div>
				</div>
			</div>
		</footer>
	`;

	let sidenav = /* HTML */
		`<!-- SIDENAV -->
		<div class="sidenav" id="slide-out">
			<div class="sidenav-header">
				<a href="javascript://" class="sidenav-close white-text close-button">
					<i class="material-icons">close</i>
				</a>
				<span class="white-text">E-COMMERCE</span>
			</div>
			<ul>
				<li><a class="waves-effect waves-classic ${sidenavActiveClass('index')}" href="${setHref('index', '../')}"><span class="a">HOME</span><i class="material-icons ${sidenavActiveClass('index')}">home</i></a></li>
				<li><a class="waves-effect waves-classic ${sidenavActiveClass('products')}" href="${setHref('products', pagesPath)}"><span class="a">PRODUCTS</span><i class="material-icons ${sidenavActiveClass('products')}">shopping_bag</i></a></li>
				<li><a class="waves-effect waves-classic ${sidenavActiveClass('cart')}" href="${setHref('cart', pagesPath)}"><span class="a">CART</span>
					<i class="material-icons badge-container ${sidenavActiveClass('cart')}">
						<span class="cart-badge hide">0</span>
						shopping_cart
					</i>
				</a></li>
				<li><a class="waves-effect waves-classic ${sidenavActiveClass('contact')}" href="${setHref('contact', pagesPath)}"><span class="a">CONTACT</span><i class="material-icons ${sidenavActiveClass('contact')}">contact_support</i></a></li>
				<li><a class="waves-effect waves-classic ${sidenavActiveClass('aobut')}" href="${setHref('about', pagesPath)}"><span class="a">ABOUT</span><i class="material-icons ${sidenavActiveClass('about')}">info</i></a></li>
			</ul>
		</div>
		`;

	let body = document.querySelector('body');
	body.innerHTML = body.innerHTML.replace('{{pageHeader}}', pageHeader);
	body.innerHTML = body.innerHTML.replace('{{sidenav}}', sidenav);
	body.innerHTML = body.innerHTML.replace('{{pageFooter}}', pageFooter);

	function setHref(currentPage, path) {
		return isActivePage(`${currentPage}`) ? '#' : `${path}${currentPage}.html`;
	}

	function sidenavActiveClass(page) {
		if (!isActivePage(page)) return '';
		return 'primary white-text';
	}

	function isActivePage(page) {
		return page == currentPage;
	}

	function getCurrentPage() {
		// Así porque soy malísimo con Regex
		let page = window.location.href.split('/');
		page = page[page.length - 1].split('.html');
		page = page[0]
		return page;
	}
})();
