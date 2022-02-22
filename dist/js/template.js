// Me cansé de modificar los html todo el rato así que le mando esto

// PAGES HTML --------------------------------------------------------------- //
(() => {
	let currentPage = getCurrentPage();
	let pagesPath = (currentPage) == 'index' ? 'pages/' : '';
	let imgPath = (currentPage == 'index') ? 'img/' : '../img/';

	let pageHeader = /* HTML */
		`<!------ HEADER ------>
		<header class="navbar-fixed">
			<!-- NAVBAR -->
			<nav>
				<div class="nav-wrapper container">
					<a href="${setHref('index', '../')}" class="brand-logo truncate vertical-align">
					<svg width="48" height="48" viewBox="0 0 230 230" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M0 0V230H230V0H0ZM224.697 224.697H5.30259V5.30259H224.697V224.697Z" fill="currentcolor"/>
						<path d="M180.654 27H200.268L139.403 108.157L115.634 76.4707L91.8693 108.157L31 27H50.6139L91.8722 82.008L105.83 63.3956L78.5328 27.0018H98.1468L115.637 50.3208L133.125 27.0018H152.737L125.443 63.3956L139.403 82.008L180.654 27Z" fill="currentcolor"/>
						<path d="M15 128.736H22.7291L24.9374 173.05H25.6735L30.0902 128.736H36.3471L40.7637 173.05H41.4998L43.7081 128.736H51.4372L46.2845 187.625H37.4512L33.2554 156.855L28.986 187.625H20.1527L15 128.736ZM57.3261 187.625V128.736H74.2565V134.625H64.6872V153.764H72.7843V159.653H64.6872V180.264H74.2565V187.625H57.3261V187.625ZM79.4093 187.625V128.736H90.5981C98.18 128.736 100.683 133.447 100.683 141.912V143.458C100.683 148.537 99.505 152.512 98.18 155.383V155.678C100.904 157.96 102.597 162.45 102.965 170.252V172.608C102.376 182.987 99.6522 187.625 92.0703 187.625H79.4093ZM86.7703 153.764H90.5981C92.6592 153.764 94.1314 151.335 94.1314 143.458V141.912C94.1314 136.244 92.8064 134.625 90.5981 134.625H86.7703V153.764ZM86.7703 180.264H92.0703C94.2786 180.264 95.8244 178.423 96.1189 172.608V170.252C95.8244 161.493 94.2786 159.653 92.0703 159.653H86.7703V180.264ZM106.645 169.664H114.08C114.227 179.159 114.963 181 117.613 181C121.22 181 121.22 177.982 121.22 169.958C121.22 158.18 106.645 161.346 106.645 145.667C106.645 136.465 106.645 128 117.687 128C125.858 128 128.066 132.637 128.581 143.753H121.22C120.926 135.729 120.042 133.889 117.687 133.889C114.08 133.889 114.08 137.864 114.08 145.667C114.08 157.076 128.728 153.028 128.728 169.958C128.728 180.264 128.728 188.361 117.613 188.361C109.074 188.361 107.087 183.282 106.645 169.664V169.664ZM134.617 187.625V128.736H141.978V153.764H149.339V128.736H156.7V187.625H149.339V159.653H141.978V187.625H134.617ZM163.325 156.635C163.325 136.097 163.767 128 174.809 128C185.85 128 186.292 136.097 186.292 156.635C186.292 180.19 185.85 188.361 174.809 188.361C163.767 188.361 163.325 180.19 163.325 156.635ZM170.686 156.635C170.686 177.908 170.686 181 174.809 181C178.931 181 178.931 177.908 178.931 156.635C178.931 137.496 178.931 133.889 174.809 133.889C170.686 133.889 170.686 137.496 170.686 156.635V156.635ZM192.917 187.625V128.736H204.842C212.424 128.736 214.411 133.374 215 144.489V146.844C214.411 157.96 212.424 162.597 204.842 162.597H200.278V187.625H192.917V187.625ZM200.278 156.708H204.842C207.05 156.708 207.86 154.868 208.154 146.844V144.489C207.86 136.465 207.05 134.625 204.842 134.625H200.278V156.708Z" fill="currentcolor"/>
					</svg>
					</a>
					<a href="#" data-target="slide-out" class="sidenav-trigger"><i class="material-icons">menu</i></a>
					<ul class="right hide-on-med-and-down">
						<li><a class="waves-effect waves-classic" href="${setHref('index', '../')}">Home</a></li>
						<li><a class="waves-effect waves-classic" href="${setHref('products', pagesPath)}">Products</a></li>
						<li><a class="waves-effect waves-classic" href="${setHref('contact', pagesPath)}">Contact</a></li>
						<li><a class="waves-effect waves-classic" href="${setHref('about', pagesPath)}">About</a></li>
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
						<h5 class="footer-header h5 white-text">Webshop</h5>
						<p class="grey-text text-lighten-4">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ut neque voluptates nam nihil excepturi est quos itaque. Dolorum, mollitia natus?</p>
					</div>
				</div>
			</div>
			<div class="footer-copyright">
				<div class="container">
					<div class="">
						<span class="center center-block">© 2022 Webshop</span>
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
				<span class="white-text">Webshop</span>
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
			<div class="sidenav__footer"><span>© 2022 Webshop</span></div>
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
		// Github index is the only that doesn't include .html
		let page = window.location.href;
		if (!page.includes('html')) return 'index';

		// Así porque soy malísimo con Regex
		page = page.split('/');
		page = page[page.length - 1].split('.html');
		page = page[0];
		return page;
	}
})();

// PRODUCTS HTML ------------------------------------------------------------ //
function getProductHtml(product) {
	let { name, description, image, total } = product;
	if (total % 1 != 0) total = total.toFixed(2);

	let html = /* HTML */
		`<!-- Left side: image -->
			<div class="product-li__image col-xs-12 col-sm-4 col-xl-3">
				<img src="${image}" alt="">
			</div>
			<!-- Right side: details -->
			<div class="product-li__details col-xs-12 col-sm">
				<span class="product-li__title">
					<span class="product-li__title-text">${name}</span>
				</span>
				<p class="product-li__description">
					<span class="product-li__description-text">${description}</span>
				</p>
				<!-- Footer -->
				<div class="product-li__footer">
					<span class="product-li__price">$${total}</span>
					<div class="product-qty">
						<a href="javascript:void(0)" class="product-qty__decrease"> <i class="material-icons">remove</i> </a>
						<input class="product-qty__input input-field" type="number" placeholder="Qty" value="1"></input>
						<a href="javascript:void(0)" class="product-qty__increase"> <i class="material-icons">add</i> </a>
					</div>
					<a href="javascript:void(0)" class="product-li__add cart-btn tooltipped" data-tooltip="Add to cart">
						<i class="material-icons">add_shopping_cart</i>
					</a>
				</div>
			</div>
		`;

	return html;
}

function getCartItemHtml(product) {
	let { name, description, quantity, image, total } = product;
	if (total % 1 != 0) total = total.toFixed(2);

	let html = /* HTML */
		`<!-- CART ITEM -->
		<div class="cart-item__image-wrapper">
			<div class="cart-item__image">
				<img src="${image}" alt="">
			</div>
		</div>
		<!-- Details -->
		<div class="cart-item__details">
			<!-- Left Side -->
			<div class="cart-item__details-left">
				<div class="cart-item__title"><span>${name}</span></div>
				<div class="cart-item__description hide-on-small-and-down"><p>${description}</p></div>
			</div>
			<!-- Right side -->
			<div class="cart-item__details-right">
				<div class="cart-item__details-numbers">
					<span class="h6 cart-item__price">$${total}</span>
					<div class="product-qty">
						<a href="javascript:void(0)" class="product-qty__decrease"> <i class="material-icons">remove</i>
						<input class="product-qty__input input-field" type="number" placeholder="Qty" value="${quantity}"></input>
						<a href="javascript:void(0)" class="product-qty__increase"> <i class="material-icons">add</i>
					</div>
				</div>
				<a href="javascript:void(0)" class="cart-item__remove cart-btn tooltipped" data-tooltip="Remove from cart"> <i class="material-icons">remove_shopping_cart</i> </a>
			</div>
		</div>
		`;

	return html;
}
