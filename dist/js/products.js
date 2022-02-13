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
					`%c${result.name} found.`, `color: ${colors.info}`);
			else if (typeof product === 'string')
				notFound(product);

			else
				notFound(product.name);
		}
		return result;
	}

	// Product info represented as HTML element as string
	static productToHTML(product, type = 'productItem') {
		type = type.toLowerCase();
		let html = '';

		let title = product.name;
		let price = product.getTotal();
		let description = product.description;
		let image = product.image;
		let quantity = product.getQuantity();


		if (type == 'productitem') {
			html = /* html */
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
						<span class="product-li__price h6">$${price}</span>
						<!-- Add to cart -->
						<a href="javascript://" class="product-li__add cart-btn tooltipped" data-tooltip="Add to cart"><i class="material-icons">add_shopping_cart</i></a>
					</div>
				</div>
			</li>
			`;
		} else if (type == 'cartitem') {
			html = /* html */
			`<!-- PRODUCT -->
			<li class="cart-item row">
				<!-- Image  -->
				<div class="cart-item__image">
					<img src="${image}" alt="">
				</div>
				<!-- Details -->
				<div class="cart-item__details">
					<!-- Left Side -->
					<div class="cart-item__details-left">
						<div>
							<span class="h5">${title}</span>
							<span class="quantity">${quantity > 1 ? `x${quantity}` : ''}</span>
						</div>
						<span class="h6 cart-item__price">$${price}</span>
					</div>
					<!-- Right side -->
					<div class="cart-item__details-right">
						<!-- Remove from cart -->
						<a href="javascript://" class="cart-item__remove cart-btn tooltipped" data-tooltip="Remove from cart"><i class="material-icons">remove_shopping_cart</i></a>
					</div>
				</div>
			</li>
			`;
		}
		return html;
	}
	//#endregion
}

class ProductList {
	constructor(products) {
		this.products = products || [];
		this.productsHtml = '';
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
	// Generate HTML for the current product list
	generateHtml() {
		let html = '';
		this.products.forEach(e => html += Product.productToHTML(e));
		return html;
	}

	// Update the list in the DOM with the current products
	updateDom() {
		let productListElem = document.querySelector('#product-list');
		if (!productListElem)
			return;

		// Update the products in the HTML
		this.productsHtml = this.generateHtml();
		productListElem.innerHTML = this.productsHtml;

		// Add the "add to cart" function to buttons
		let addBtns = document.querySelectorAll('.product-li__add');
		for (const key in this.products) {
			addBtns[key].addEventListener(
				'click', () => activeCart.addItem(this.products[key]));
		}

		// New prods aren't zoomable; initialize again
		initMaterialboxed();
	}
	//#endregion

	// Getters/Setters -------------- //
	setProducts (products) {
		this.products = products;
		this.updateDom();
	}

	getProducts() { return this.products; }
	getProductsHtml() { return this.productsHtml; }
}
