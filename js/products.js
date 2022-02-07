// Stores product related info
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
	this.setProducts = (products) => {
		this.products = products;
		this.updateDom();
	}

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
		if (!productListElem) return;

		this.productsHTML = this.getHTML();
		productListElem.innerHTML = this.productsHTML;

		// Add add to cart function
		let productElems = document.querySelectorAll('.product-li__add');
		for (const key in this.products) {
			productElems[key].addEventListener(
				'click', () => activeCart.addItem(this.products[key]))
		}

		// New products aren't zoomable; initialize zoomable elements again
		initMaterialboxed();
	}
};
