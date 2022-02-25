// Stores product related info
class Product {
	constructor(name, price, description, image, quantity = 1) {
		this.name = name;
		this.description = description || 'No description';
		this.image = image || 'https://via.placeholder.com/256';

		this.price = price;
		this.quantity = quantity;
		this.total = price * quantity;
	}

	updateTotal() {
		this.total = this.price * this.quantity;
		return this.total;
	}

	// Quantity methods ------------- //
	increaseQuantity(amount = 1) {
		return this.setQuantity(this.quantity + amount);
	}

	decreaseQuantity(amount = 1) {
		return this.setQuantity(this.quantity - amount);
	}

	//#region Get / Set ------------- //
	setPrice(amount) {
		if (!Number.isInteger(amount) || amount < 0) {
			console.warn('Invalid arguments: positive integer expected');
			return null;
		}
		this.price = amount;
		this.updateTotal();
		return this.price;
	}

	setQuantity(amount) {
		if (!Number.isInteger(amount) || amount < 0) {
			console.warn('Invalid arguments: positive integer expected');
			return null;
		}
		this.quantity = amount;
		this.updateTotal();
		return this.quantity;
	}

	setTotal(amount) {
		if (!Number.isInteger(amount) || amount < 0) {
			console.warn('Invalid arguments: positive integer expected');
			return null;
		}
		console.warn('Warning: total should not be manually set.');
		this.total = amount;
		return this.total;
	}

	getName() { return this.name; }
	getDescription() { return this.description; }
	getImage() { return this.image; }
	getPrice() { return this.price; }
	getQuantity() { return this.quantity; }
	getTotal() { return this.total; }
	//#endregion

	//#region Static methods -------- //
	// Find product in an array
	static findProduct(product, arr) {
		let result = product;

		if (typeof product == 'string') {
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
					`%cFound: ${result.name}`, `color: ${colors.info}`);
			else if (typeof product === 'string')
				notFound(product);

			else
				notFound(product.name);
		}
		return result;
	}

	// !TODO: make category filters work!
	// Product info represented as an DOM node
	static productToNode(product, type = 'productItem') {
		let elem = '';

		type = type.toLowerCase();
		if (type == 'productitem') {
			elem = createElement('li', ['product-li', 'row'], getProductHtml(product));

			let addBtn = elem.querySelector('.product-li__add');
			addBtn.addEventListener('click', () => activeCart.addItem(product));

			initQtyControls(elem, product);
		} else if (type == 'cartitem') {
			elem = createElement('li', ['cart-item', 'row'], getCartItemHtml(product));

			elem.querySelector('.cart-item__remove').addEventListener('click',
				() => activeCart.removeItem(product)
			);

			initQtyControls(elem, product, activeCart);
		}

		return elem;
	}

	static copy(source) {
		let copy = JSON.parse(JSON.stringify(source));
		copy = Object.assign(new Product(), copy);
		return copy;
	}
	//#endregion
}

class ProductList {
	constructor(products) {
		this.products = products || [];
		this.productsNodes = [];
		this.filterPriceRange = [0, 9999];
	}

	//#region Product Methods ------- //
	addProduct(product) {
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
		this.products.push(product);

		if (debugMode)
			console.log(
				`%cAdded to product list: ${product.name}
				(${product.getQuantity()})`,
				`color: ${colors.success}`);

		this.updateDom();
		return product;
	}

	removeProduct(product) {
		// Check if product exists
		let removedProduct = this.findProduct(product);
		if (!removedProduct) {
			console.warn('Product not found, no product removed');
			return null;
		}
		let removedIndex = this.products.indexOf(removedProduct);

		// Remove product
		this.products.splice(removedIndex, 1);

		if (debugMode)
			console.log(
				`%cRemoved from product list: ${removedProduct.name} ` +
				`(${removedProduct.getQuantity()})`,
				`color: ${colors.danger};`);

		this.updateDom();
		return removedProduct;
	}

	findProduct(product) { return Product.findProduct(product, this.products); }
	//#endregion

	//#region DOM Methods ----------- //
	// Generate DOM nodes for the current product list
	generateNodes() {
		let nodes = [];
		this.products.forEach(prod => nodes.push(Product.productToNode(prod)));
		return nodes;
	}

	// Update the list in the DOM with the current products
	updateDom() {
		let productListElem = document.querySelector('#product-list');
		if (!productListElem)
			return;

		// Update the products in the HTML
		this.productsNodes = this.generateNodes();
		productListElem.replaceChildren(...this.productsNodes);

		// New prods aren't listened by materialize; initialize again
		reinitMaterialize();
	}
	//#endregion

	// Filters ----------------------- //
	onFilterPrice(startPrice, endPrice) {
		this.productsNodes.forEach(prodElem => {
			let price = prodElem.querySelector('.product-li__price');
			let prodClasses = prodElem.classList;
			price = +price.innerHTML.slice(1);

			if (price < startPrice || price > endPrice) {
				if (!prodClasses.contains('hide'))
					prodClasses.add('hide');
			} else {
				prodClasses.remove('hide');
			}
		});
	}

	// Getters/Setters -------------- //
	setProducts (products) {
		this.products = products;
		this.updateDom();
	}

	getProducts() { return this.products; }
	getProductsNodes() { return this.productsNodes; }
}

// TODO: make this static
let activeProductList = new ProductList();

// Add events
(() => {
	priceSlider && (priceSlider.noUiSlider.on('set', (values) => {
		activeProductList.onFilterPrice(values[0], values[1]);
	}));
})();
