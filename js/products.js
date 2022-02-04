// Stores product related info
// TODO: Functioning add to cart button
const Product = function(name, price, description, image, quantity = 1) {
	this.name = name;
	this.description = description;
	this.image = image;
	let _price = price;
	let _quantity = quantity;
	let _total = price * quantity;

	//#region Quantity methods ------ //
	this.increaseQuantity = (amount) => {
		return this.setQuantity(_quantity + (amount || 1));
	}

	this.decreaseQuantity = (amount) => {
		return this.setQuantity(_quantity + (amount || -1));
	}

	this.resetQuantity = () => { return this.setQuantity(1); }
	//#endregion

	// Price methods ---------------- //
	this.updateTotal = () => {
		_total = _price * _quantity;
		return _total;
	}

	//#region Get / Set ------------- //
	this.setPrice = (amount) => {
		if (!Number.isInteger(amount) || amount < 0) {
			console.warn('Invalid arguments: positive integer expected');
			return null;
		}
		_price = amount;
		this.updateTotal();
		return _price;
	}

	this.setQuantity = (amount) => {
		if (!Number.isInteger(amount) || amount < 0) {
			console.warn('Invalid arguments: positive integer expected');
			return null;
		}
		_quantity = amount;
		this.updateTotal();
		return _quantity;
	}

	this.setTotal = (amount) => {
		if (!Number.isInteger(amount) || amount < 0) {
			console.warn('Invalid arguments: positive integer expected');
			return null;
		}
		console.warn('Warning: total should not be manually set.');
		_total = amount;
		return _total;
	}

	this.getPrice = () => { return _price }
	this.getQuantity = () => { return _quantity; }
	this.getTotal = () => { return _total; }
	//#endregion
};

const ProductList = function(products) {
	this.products = products || [];
	this.productsHTML = '';

	this.addProduct = (product) => { this.products.push(product); }
	this.setProducts = (products) => { this.products = products; }

	// Get HTML for the current product list
	this.getHTML = () => {
		let html = ''
		this.products.forEach(elem => {
			html += productToHTML(elem);
		});
		return html;
	}

	// Update the list in the DOM with the current products
	this.updateDom = () => {
		let productListElem = document.querySelector('#product-list');
		this.productsHTML = this.getHTML();
		productListElem.innerHTML = this.productsHTML;

		// Add add to cart function
		let productElems = document.querySelectorAll('.product-li__add');
		console.log(productElems);
		for (const key in this.products) {
			productElems[key].addEventListener(
				'click', () => addToCart(this.products[key]))
		}

		// New products aren't zoomable; initialize zoomable elements again
		initMaterialboxed();
	}
};

// Converts a product info to an HTML element
function productToHTML(product) {
	let title = product.name;
	let price = product.getPrice();
	let description = product.description || 'No description';
	let image = product.image || 'https://via.placeholder.com/256';

	let template =
		/* html */
		`<!-- PRODUCT -->
		<li class="product-li row">
			<!-- Left side: image -->
			<div class="product-li__image col-xs-12 col-sm-4 col-xl-3">
				<img src="${image}" alt="">
			</div>
			<!-- Right side: details -->
			<div class="product-li__details col-xs-12 col-sm">
				<!-- Title -->
				<span class="product-li__title">${title}</span>
				<!-- Description -->
				<p class="product-li__description">${description}</p>
				<div class="product-li__footer">
					<!-- Price -->
					<span class="product-li__price">$${price}</span>
					<!-- Add to cart -->
					<a href="javascript://addToCart" class="product-li__add indigo-text text-accent-2"><i class="material-icons">add_shopping_cart</i></a>
				</div>
			</div>
		</li>
		`;
	return template;
}
