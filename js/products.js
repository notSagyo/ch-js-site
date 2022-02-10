// Stores product related info
const Product = function(name, price, description, image, quantity = 1) {
	this.name = name;
	this.description = description;
	this.image = image || 'https://via.placeholder.com/256';

	let _price = price;
	let _quantity = quantity;
	let _total = price * quantity;

	this.updateTotal = () => {
		_total = _price * _quantity;
		return _total;
	}

	//#region Quantity methods ------ //
	this.increaseQuantity = (amount) => {
		return this.setQuantity(_quantity + (amount || 1));
	}

	this.decreaseQuantity = (amount) => {
		return this.setQuantity(_quantity + (-amount || -1));
	}

	this.resetQuantity = () => { return this.setQuantity(1); }
	//#endregion

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

	this.getPrice = () => _price
	this.getQuantity = () => _quantity;
	this.getTotal = () => _total;
	//#endregion
};

const ProductList = function(products) {
	let _products = products || [];
	let _productsHtml = '';

	//#region Product Methods ------- //
	this.addProduct = (product) => {
		// Return if not valid argument
		if (!(product instanceof Product)) {
			console.warn('Invalid arguments: Product expected');
			return null;
		} else if (product.getQuantity() < 1) {
			console.warn('Zero quantity products won\'t be added');
			return null;
		} else if (this.findProduct(product.name)) {
			console.warn('Product already exists!');
			return null;
		}

		// Add product
		_products.push(product);

		if (debugMode)
		console.log(`%cAdded to product list: ${product.name} ` +
			`(${product.getQuantity()})`,
			`color: ${colors.success}`);

		this.updateDom();
		return product;
	}

	this.removeProduct = (product) => {
		// Check if product exists
		let removedProduct = this.findProduct(product);
		if (!removedProduct) {
			console.warn('Product not found, no product removed');
			return null;
		}
		let removedIndex = _products.indexOf(removedProduct)

		// Remove product
		_products.splice(removedIndex, 1);

		if (debugMode)
			console.log(
				`%cRemoved from product list: ${removedProduct.name} ` +
				`(${removedProduct.getQuantity()})`,
				`color: ${colors.danger};`);

		this.updateDom();
		return removedProduct;
	}

	this.findProduct = (product)  => {
		return Product.findProduct(product, _products);
	}
	//#endregion

	// Generate HTML for the current product list
	this.generateHtml = () => {
		let html = ''
		_products.forEach(elem => {
			html += productToHTML(elem);
		});
		return html;
	}

	//#region Getters/Setters ------- //
	this.setProducts = (products) => {
		_products = products;
		this.updateDom();
	}

	this.getProducts = () => _products;
	this.getProductsHtml = () => _productsHtml;
	//#endregion

	// Update the list in the DOM with the current products
	this.updateDom = () => {
		let productListElem = document.querySelector('#product-list');
		if (!productListElem) return;

		_productsHtml = this.generateHtml();
		productListElem.innerHTML = _productsHtml;

		// Add the "add to cart" function to buttons
		let addBtns = document.querySelectorAll('.product-li__add');
		for (const key in _products) {
			addBtns[key].addEventListener(
				'click', () => activeCart.addItem(_products[key]));
		}

		// New prods aren't zoomable; initialize again
		initMaterialboxed();
	}
};

// Static method in Product to find a product in an array
Product.findProduct = function (product, arr) {
	let result = product;

	if (typeof product == "string") {
		product = product.toLowerCase();
		result = arr.find(x => x.name.toLowerCase() == product);
	}
	else if (product instanceof Product) {
		result = arr.find(x => x === product);
	} else {
		console.warn('Invalid arguments: Product or String expected');
		return null;
	}

	if (debugMode) {
		let notFound = (name) => console.log(
			`%cNot found: ${name}`, `color: ${colors.info};`);

		if (result)
			console.log(
				`%c${result.name} found.`, `color: ${colors.info}`);
		else if (typeof product === "string")
			notFound(product);
		else
			notFound(product.name);
	}
	return result;
}
