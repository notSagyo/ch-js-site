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

	// Quantity methods ======================================================//
	increaseQuantity(amount = 1) {
		return this.setQuantity(this.quantity + amount);
	}

	decreaseQuantity(amount = 1) {
		return this.setQuantity(this.quantity - amount);
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

	// Setters ===============================================================//
	setPrice(amount) {
		if (!Number.isInteger(amount) || amount < 0) {
			console.warn('Invalid arguments: positive integer expected');
			return null;
		}

		this.price = amount;
		this.updateTotal();
		return this.price;
	}

	// Static methods ========================================================//
	// Find product in an array, product or string with an item name are valid
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

		return result;
	}

	// Product info represented as an DOM node
	static productToNode(product, type = 'productItem') {
		type = type.toLowerCase();
		if (!(product instanceof Product)) {
			console.warn('Invalid arguments: Product instance expected');
			return null;
		}

		let elem = '';
		if (type == 'productitem') {
			elem = createElement('li', ['product-li', 'row'], getProductHtml(product));
			initQtyControls(elem, product);

			let addBtn = elem.querySelector('.product-li__add');
			addBtn.addEventListener('click', () => activeCart.addItem(product));
		}

		else if (type == 'cartitem') {
			elem = createElement('li', ['cart-item', 'row'], getCartItemHtml(product));
			initQtyControls(elem, product, activeCart);

			let removeBtn = elem.querySelector('.cart-item__remove');
			removeBtn.addEventListener('click', () => activeCart.removeItem(product));
		}

		else {
			console.warn('Invalid arguments: type \'cartItem\''
				+ 'or \'productItem\' expected');
			return null;
		}

		if (elem) elem.dataProduct = product;
		return elem;
	}

	// Deep copy product with depth 1
	static copy(source) {
		let copy = JSON.parse(JSON.stringify(source));
		copy = Object.assign(new Product(), copy);
		return copy;
	}
}
