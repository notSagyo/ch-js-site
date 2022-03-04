// ?TODO: add pagination
class ProductList {
	constructor(products) {
		this.products = products || [];
		this.productsNodes = [];

		this.activePriceFilter = [0, 999999];
		this.activeCategoryFilter = 'all';
		this.filteredProductsNodes = [];
	}

	// Product Methods =======================================================//
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

		this.products.push(product);
		this.updateDom();
		return product;
	}

	// Product or string with an item name
	removeProduct(product) {
		// Check if product exists
		let removedProduct = this.findProduct(product);
		if (!removedProduct) {
			console.warn('Product not found, no product removed');
			return null;
		}
		let removedIndex = this.products.indexOf(removedProduct);

		this.products.splice(removedIndex, 1);
		this.updateDom();
		return removedProduct;
	}

	// Set products to an array of Products
	setProducts (products) {
		this.products = products;
		this.updateDom();
		return this.products;
	}

	// Product or string with an item name
	findProduct(product) { return Product.findProduct(product, this.products); }

	// DOM Methods ===========================================================//
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
		this.filterAndUpdate({
			startPrice: this.activePriceFilter[0],
			endPrice: this.activePriceFilter[1],
			categories: this.activeCategoryFilter
		});

		// New prods aren't listened by materialize; initialize again
		reinitMaterialize();
	}

	// Filter methods ========================================================//
	// Podía pedir nuevamente el JSON pero tenía ganas de complicarme la vida :)
	filterAndUpdate({
		startPrice = this.activePriceFilter[0],
		endPrice = this.activePriceFilter[1],
		categories = this.activeCategoryFilter
	}) {
		// Get array with filtered product nodes
		let filtered = this.filter({ startPrice, endPrice, categories });

		// Hide product if doesn't match filter
		this.productsNodes.forEach(prodElem =>
			hideOnCondition(prodElem, !filtered.includes(prodElem)));

		this.filteredProductsNodes = filtered;
		this.showEmptyList();
		return filtered;
	}

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

		return filtered;
	}

	// Get products in [prodList] in a price range
	filterPrice(startPrice, endPrice, prodList = this.productsNodes) {
		let min = document.querySelector('#min-price');
		let max  = document.querySelector('#max-price');

		let filtered = [...prodList.filter(x =>
			x.dataProduct.price > startPrice && x.dataProduct.price < endPrice)];

		if (min) min.value = startPrice;
		if (max) max.value = endPrice;

		return filtered;
	}

	// Get products in [prodList] that contain [categories]
	filterCategory(categories, prodList = this.productsNodes) {
		if (categories.includes('all'))
			return prodList;

		// If product has at least 1 category in common save it
		let filtered = prodList.filter(product =>
			categories.some(category => {
				let prodCategory = product.dataProduct.category.toLowerCase();
				return prodCategory.includes(category.toLowerCase());
			}));

		return filtered;
	}

	// If filtered products list is empty, show empty message
	showEmptyList() {
		if (this != activeProductList)
			return;

		let emtpyListElem = document.querySelector('.no-results');
		let productListElem = document.querySelector('.product-list');

		// Create and add the empty element if doesn't exists
		if (!emtpyListElem) {
			emtpyListElem = createElement(
				'div',
				undefined,
				noResultsHtml('No product found'));
			productListElem.appendChild(emtpyListElem);
			emtpyListElem = document.querySelector('.no-results');
		}

		// Toggle empty element
		hideOnCondition(emtpyListElem, this.filteredProductsNodes.length > 0);
		reinitMaterialize(); // Fix out of screen tooltips
	}
}

// Product list used globally
let activeProductList = new ProductList();

// TODO: move this to a class method to init listeners
(() => {
	// Add filter's event listeners ==========================================//
	// Categories ====================//
	let filters = document.querySelectorAll('.category-filter');

	if (filters) filters.forEach(filterElem => {
		let categories = filterElem.getAttribute('data-category').split(',');

		filterElem.addEventListener('click', () =>
			activeProductList.filterAndUpdate({ categories: categories }));
	});

	// Price =========================//
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
		activeProductList.filterAndUpdate({ startPrice: values[0], endPrice: values[1] }));
})();
