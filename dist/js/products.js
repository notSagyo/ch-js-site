// !TODO: MAKE FILTERS NOT OVERRIDE EACH OTHER
// Stores product related info
class Product {
	constructor(name, price, description, image, category, quantity = 1) {
		this.name = name;
		this.description = description || 'No description';
		this.image = image || 'https://via.placeholder.com/256';
		this.category = category || 'other';

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

	// ?TODO: add pagination
	// Product info represented as an DOM node
	static productToNode(product, type = 'productItem') {
		let elem = '';

		type = type.toLowerCase();
		if (type == 'productitem') {
			elem = createElement('li', ['product-li', 'row'], getProductHtml(product));

			let addBtn = elem.querySelector('.product-li__add');
			addBtn.addEventListener('click', () => activeCart.addItem(product));

			initQtyControls(elem, product);
		}
		else if (type == 'cartitem') {
			elem = createElement('li', ['cart-item', 'row'], getCartItemHtml(product));

			elem.querySelector('.cart-item__remove').addEventListener('click',
				() => activeCart.removeItem(product));

			initQtyControls(elem, product, activeCart);
		}

		if (elem) elem.dataProduct = product;
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
		// Update min/max input fields
		let min = document.querySelector('#min-price');
		let max  = document.querySelector('#max-price');
		min.value = startPrice;
		max.value = endPrice;

		// Get element price from the price tag
		this.productsNodes.forEach(prodElem => {
			let price = prodElem.dataProduct.price;
			hideOnCondition(prodElem, (price < startPrice || price > endPrice));
		});
	}

	onFilterCategory(categories) {
		// Check if each product belongs to any 'categories' and hide/unhide it
		for (let i = 0; i < this.productsNodes.length; i++) {
			let prodElem = this.productsNodes[i];
			let includesCategory = false;

			if (categories.includes('all')) {
				prodElem.classList.remove('hide');
				continue;
			}

			categories.forEach(category => {
				let elemCategory = prodElem.dataProduct.category;
				category = category.toLowerCase();
				if (!includesCategory)
					includesCategory = elemCategory.includes(category);
			});

			hideOnCondition(prodElem, !includesCategory);
		}
	}

	// Getters/Setters -------------- //
	setProducts (products) {
		this.products = products;
		this.updateDom();
	}

	getProducts() { return this.products; }
	getProductsNodes() { return this.productsNodes; }
}

(() => {
	// Add filter's events -------------------------------------------------- //
	// Categories
	let filters = document.querySelectorAll('.category-filter');
	filters && (filters.forEach(filterElem => {
		let categories = filterElem.getAttribute('data-category');
		categories = categories.split(',');
		filterElem.addEventListener('click', () =>
			activeProductList.onFilterCategory(categories));
	}));

	// Price ------------------------ //
	priceSlider && (priceSlider.noUiSlider.on('end', (values) =>
		activeProductList.onFilterPrice(values[0], values[1])));

	let min = document.querySelector('#min-price');
	let max = document.querySelector('#max-price');

	if (min && max && priceSlider) {
		let onMinMax = () => {
			priceSlider.noUiSlider.set([min.value, max.value], false, true);
			activeProductList.onFilterPrice(min.value, max.value);
		};

		min.addEventListener('change', onMinMax);
		max.addEventListener('change', onMinMax);
	}

	// Fix sticky filters --------------------------------------------------- //
	let filtersElement = document.querySelector('.product-filters');
	let navbar = document.querySelector('.navbar-fixed');


})();

// TODO: make this static
let activeProductList = new ProductList();
