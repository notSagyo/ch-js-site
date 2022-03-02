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

	//#region Setters --------------- //
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

		this.activePriceFilter = [];
		this.activeCategoryFilter = '';
	}

	setProducts (products) {
		this.products = products;
		this.updateDom();
	}

	//#region Product Methods ------- //
	addProduct(product) {
		// Return if not valid argument
		if (!(product instanceof Product)) {
			console.warn('Invalid arguments: Product expected');
			return null;
		} else if (product.quantity < 1) {
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
				(${product.quantity})`,
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
				`(${removedProduct.quantity})`,
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

		// Filter results with active filters
		this.filter({
			startPrice: this.activePriceFilter[0],
			endPrice: this.activePriceFilter[1],
			categories: this.activeCategoryFilter
		});

		// New prods aren't listened by materialize; initialize again
		reinitMaterialize();
	}
	//#endregion

	// Podría haber hecho los filtros pidiendo nuevamente el JSON
	// pero tenía ganas de trabajarlo así para complicarme la vida :)
	//#region Filters --------------- //
	filter({
		startPrice = this.activePriceFilter[0],
		endPrice = this.activePriceFilter[1],
		categories = this.activeCategoryFilter
	}) {
		let filtered = this.productsNodes;

		if (startPrice && endPrice) {
			this.activePriceFilter = [startPrice, endPrice];
			filtered = this.filterPrice(startPrice, endPrice, filtered);
		}
		if (categories) {
			this.activeCategoryFilter = categories;
			filtered = this.filterCategory(categories, filtered);
		}

		if (filtered != this.productsNodes) {
			this.productsNodes.forEach(prodElem =>
				hideOnCondition(prodElem, !filtered.includes(prodElem)));
		} else {
			this.productsNodes.forEach(prodElem =>
				prodElem.classList.remove('hide'));
		}
	}

	filterPrice(startPrice, endPrice, prodList = this.productsNodes) {
		let filtered = [];
		let min = document.querySelector('#min-price');
		let max  = document.querySelector('#max-price');

		if (min) min.value = startPrice;
		if (max) max.value = endPrice;

		prodList.forEach(prodElem => {
			let price = prodElem.dataProduct.price;
			if (price > startPrice && price < endPrice)
				filtered.push(prodElem);
		});

		return filtered;
	}

	filterCategory(categories, prodList = this.productsNodes) {
		if (categories.includes('all'))
			return this.productsNodes;

		let filtered = [];
		for (let i = 0; i < prodList.length; i++) {
			let prodElem = prodList[i];
			let includesCategory = false;

			categories.forEach(category => {
				let elemCategory = prodElem.dataProduct.category;
				elemCategory = elemCategory.toLowerCase();
				category = category.toLowerCase();

				if (!includesCategory)
					includesCategory = elemCategory.includes(category);
			});

			if (includesCategory) filtered.push(prodElem);
		}

		return filtered;
	}
	//#endregion
}

(() => {
	// Add filter's events -------------------------------------------------- //
	// Categories ------------------- //
	let filters = document.querySelectorAll('.category-filter');

	if (filters) filters.forEach(filterElem => {
		let categories = filterElem.getAttribute('data-category').split(',');

		filterElem.addEventListener('click', () =>
			activeProductList.filter({ categories: categories }));
	});

	// Price ------------------------ //
	// On price input's number change
	let min = document.querySelector('#min-price');
	let max = document.querySelector('#max-price');

	if (min && max && priceSlider) {
		let onMinMax = () => {
			priceSlider.noUiSlider.set([min.value, max.value], false, true);
			activeProductList.filterPrice(min.value, max.value);
		};

		min.addEventListener('change', onMinMax);
		max.addEventListener('change', onMinMax);
	}

	// On price slider change
	(priceSlider) && priceSlider.noUiSlider.on('set', (values) =>
		activeProductList.filter({ startPrice: values[0], endPrice: values[1] }));
})();

// TODO: make this static
let activeProductList = new ProductList();
