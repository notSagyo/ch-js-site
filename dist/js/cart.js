// Por qué tengo una clase de Cart y ProductList en vez de un obj único?
// la verdad es que pensaba que haya varias instancias de Cart y que se puedan
// comparar lado a lado, pero al final no terminó en el proyecto.

// Stores cart status and item list
class Cart {
	constructor({ discount, payments, annualInterest, tax, itemList } = {}) {
		// Item properties
		this.itemList = itemList || [];
		this.itemCount = 0;

		// Price properties
		this.total = 0;
		this.subtotal = 0;
		this.taxRate = tax || 0.21;
		this.discount = discount || 0;
		this.payments = payments || 1;
		this.annualInterestRate = annualInterest || 0.43;
		this.monthInterestRate = this.annualInterestRate / 12;
	}

	// Item Methods ==========================================================//
	// Add item to cart
	addItem(item) {
		if (!(item instanceof Product)) {
			console.warn('Invalid arguments: CartItem expected');
			return null;
		}
		if (item.quantity < 1) {
			console.warn('Zero quantity items won\'t be added');
			return null;
		}

		let addedItem = this.findItem(item.name);
		let toastQty = item.quantity > 1 ? `(${item.quantity}) ` : '';

		// If already in cart only increase quantity
		if (!addedItem) {
			addedItem = Product.copy(item);
			this.itemList.push(addedItem);
		} else addedItem.increaseQuantity();

		M.toast({
			text: truncateText(`Added ${toastQty}${addedItem.name}`, toastLen),
			displayLength: 2000 });

		this.updateCart();
		return addedItem;
	}

	// Product or string with an item name
	removeItem(item) {
		let removedItem = this.findItem(item);
		if (!removedItem) {
			console.warn('Item not found, no item removed');
			return null;
		}

		let removedIndex = this.itemList.indexOf(removedItem);
		let toastQty = removedItem.quantity > 1 ? `(${removedItem.quantity}) ` : '';

		this.itemList.splice(removedIndex, 1);

		M.toast({
			text: truncateText(`Removed ${toastQty}${removedItem.name}`, toastLen),
			displayLength: 2000 });

		this.updateCart();
		return removedItem;
	}

	// Product or string with an item name
	findItem(item) {
		let result = Product.findProduct(item, this.itemList);
		return result;
	}

	clearCart() {
		this.itemList = [];
		this.updateCart();
	}

	// Quantity Methods ======================================================//
	increaseItemQuantity(item, amount = 1) {
		let result = this.findItem(item);
		if (!result)
			return -1;

		result.increaseQuantity(amount);
		this.updateCart();
		return amount;
	}

	decreaseItemQuantity(item, amount = 1) {
		let result = this.findItem(item);
		if (!result)
			return -1;

		result.decreaseQuantity(amount);
		this.updateCart();
		return amount;
	}

	setItemQuantity (item, amount) {
		if (!Number.isInteger(amount) || amount < 0) {
			console.warn('Invalid arguments: positive integer expected');
			return -1;
		}

		let result = this.findItem(item);
		if (!result)
			return -1;

		result.setQuantity(amount);
		this.updateCart();
		return amount;
	}

	// DOM Methods ===========================================================//
	updateDom() {
		let cartListElem = document.querySelector('#cart-list');
		let itemNodes = [];

		Cart.updateCartBadges();

		// If not called from activeCart or no cart-list elem in HTML return
		if (this != activeCart || !cartListElem)
			return '';

		// Update the cart items in HTML
		itemNodes = this.generateNodes();
		if (itemNodes.length > 0)
			cartListElem.replaceChildren(...itemNodes);
		else
			cartListElem.innerHTML = noResultsHtml('The cart is empty');

		// New nodes aren't listened by materialize
		reinitMaterialize();

		this.updateCartSummary();
		return itemNodes;
	}

	// Generate DOM nodes for the cart
	generateNodes() {
		let nodes = [];
		this.itemList.forEach(item => nodes.push(Cart.itemToNode(item)));
		return nodes;
	}

	// Update cart price summary in DOM
	updateCartSummary() {
		let subtotalElem = document.querySelector('.cart__summary-subtotal');
		let interestElem = document.querySelector('.cart__summary-interest');
		let discountElem = document.querySelector('.cart__summary-discount');
		let taxElem = document.querySelector('.cart__summary-tax');
		let totalElem = document.querySelector('.cart__summary-total');

		subtotalElem.innerText = `$${this.subtotal.toFixed(2)}`;
		interestElem.innerText = `${(this.getTotalInterestRate() * 100).toFixed(2)}%`;
		discountElem.innerText = `${this.discount * 100}%`;
		taxElem.innerText = `${this.taxRate * 100}%`;
		totalElem.innerText = `$${this.total.toFixed(2)}`;
	}

	// Update cart icons to show a badge with item count
	static updateCartBadges() {
		let cartBadges = document.querySelectorAll('.cart-badge');

		cartBadges.forEach(badgeElem => {
			badgeElem.innerText = activeCart.itemCount;
			hideOnCondition(badgeElem, activeCart.itemCount < 1);
		});

		return cartBadges;
	}

	// Cart item info represented as a DOM node
	static itemToNode(item) {
		let node = Product.productToNode(item, 'cartItem');
		return node;
	}

	// Cart status ===========================================================//
	// After modifying a property, this should be called
	updateCart() {
		this.subtotal = this.itemList.reduce((a, b) => a + b.total, 0);
		this.itemCount = this.itemList.length;
		this.total = this.subtotal;
		this.total *= (1 - this.discount)
			* (1 + this.taxRate)
			* (1 + this.getTotalInterestRate());

		Cart.saveCart();
		this.updateDom();

		return this.total;
	}

	// Save cart in localstorage
	static saveCart(cartName = 'activeCart') {
		let cartString = JSON.stringify(activeCart);
		localStorage.setItem(cartName, cartString);
		return(cartString);
	}

	// Load cart from localstorage
	static loadCart(cartName = 'activeCart') {
		let cartJSON = localStorage.getItem(cartName);
		if (!cartJSON)
			return null;

		let cartParsed = JSON.parse(cartJSON);
		let cartRecovered = new Cart();
		let itemListParsed = [];
		let itemListRecovered = [];

		// Load cart properties
		Object.assign(cartRecovered, cartParsed);

		// Copy the parsed list, but save Product objects to recover methods
		itemListParsed = cartRecovered.itemList;
		itemListParsed.forEach(item => {
			itemListRecovered.push(Object.assign(new Product(), item));
		});
		cartRecovered.itemList = itemListRecovered;

		return cartRecovered;
	}

	// Get / Set =============================================================//
	setDiscount(amount) {
		this.discount = amount;
		this.updateCart();
		return amount;
	}

	setMonthInterest (amount) {
		this.monthInterestRate = amount;
		this.updateCart();
		return amount;
	}

	setPayments(amount) {
		this.payments = amount;
		this.updateCart();
		return amount;
	}

	setTaxRate(amount) {
		this.taxRate = amount;
		this.updateCart();
		return amount;
	}

	setItemList(items) {
		if (!Array.isArray(items) || !items.every(x => x instanceof Product)) {
			console.warn('Invalid arguments: CartItems[] expected');
			return null;
		}

		this.itemList = items;
		this.updateCart();
		return this.itemList;
	}

	getTotalInterestRate() {
		let interest = (this.payments > 1)
			? this.monthInterestRate * (this.payments)
			: 0;
		return  interest;
	}
}

// TODO: make this static
// Active cart used globally
/**@type Cart */
let activeCart = Cart.loadCart() || new Cart();
activeCart.updateDom();

// TODO: put this in an initialization method
(() => {
	// Get the payments <select> and add event listener
	let paymentsElem = document.querySelector('#cart-payments');
	if (!paymentsElem)
		return;

	paymentsElem.value = activeCart.payments;
	paymentsElem.addEventListener('change', () =>
		activeCart.payments = activeCart.setPayments(paymentsElem.value));

	// Add interest% hint next to the payments count
	paymentsElem.childNodes.forEach(child => {
		let payments = child.value;
		let interest = Math.round(activeCart.monthInterestRate * payments * 100);
		if (payments > 1) {
			child.innerHTML =
				`${payments} <span class="cart__payments-interest"> (${interest}%)</span>`;
		}
	});
})();
