// Stores cart status and item list
class Cart {
	constructor({ discount, payments, annualIntereset, tax, itemList } = {}) {
		this.itemList = itemList || [];
		this.itemCount = 0;
		this.totalQuantity = 0;

		this.total = 0;
		this.subtotal = 0;
		this.discount = discount || 0;
		this.annualInterestRate = annualIntereset || 0.43;
		this.monthInterestRate = this.annualInterestRate / 12;
		this.payments = payments || 1;
		this.taxRate = tax || 0.21;
		this.monthFee = 0;
	}

	//#region Item Methods ---------- //
	// Add item to cart
	addItem(item) {
		// Return if not valid argument
		if (!(item instanceof Product)) {
			console.warn('Invalid arguments: CartItem expected');
			return null;
		}
		if (item.quantity < 1) {
			console.warn('Zero quantity items won\'t be added');
			return null;
		}

		// If already in cart only increase quantity
		let added = this.findItem(item.name);
		if (added)
			added.increaseQuantity();
		else {
			let copy = Product.copy(item);
			this.itemList.push(copy);
		}

		let toastQty = item.quantity > 1 ? `(${item.quantity}) ` : '';
		M.toast({
			text: truncateText(`Added ${toastQty} ${item.name}`, toastLen),
			displayLength: 2000
		});

		if (debugMode)
			console.log(
				`%cAdded to cart: ${item.name} ` +
				`(${item.quantity})`,
				`color: ${colors.success}`);

		this.updateCart();
		return item;
	}

	// Remove item from cart (Product or string)
	removeItem(item) {
		// Check if item exists
		let removed = this.findItem(item);
		if (!removed) {
			console.warn('Item not found, no item removed');
			return null;
		}
		let removedIndex = this.itemList.indexOf(removed);
		let toastQty = removed.quantity > 1 ? `(${removed.quantity}) ` : '';

		// Remove item
		this.itemList.splice(removedIndex, 1);

		M.toast({
			text: truncateText(`Removed ${toastQty} ${removed.name}`, toastLen),
			displayLength: 2000 });

		if (debugMode)
			console.log(
				`%cRemoved from cart: ${removed.name} ` +
				`(${removed.quantity})`,
				`color: ${colors.danger};`);

		this.updateCart();
		return removed;
	}

	// Remove all items from cart
	clearCart() {
		this.totalQuantity = 0;
		this.itemList = [];
		if (debugMode)
			console.log('%cCART CLEARED', `color: ${colors.danger};`);
		this.updateCart();
	}

	// Find an item in the cart (Product or string)
	findItem(item) {
		let result = Product.findProduct(item, this.itemList);
		return result;
	}

	// Quantity Methods ------------- //
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
	//#endregion

	//#region DOM Methods
	updateDom() {
		let cartListElem = document.querySelector('#cart-list');
		let itemsNodes = [];

		Cart.updateCartBadges();

		// If this is not activeCart or there's no cart-list in HTML return
		if (this != activeCart || !cartListElem)
			return '';

		// Update the cart items in HTML
		itemsNodes = this.generateNodes();
		if (itemsNodes.length > 0)
			cartListElem.replaceChildren(...itemsNodes);
		else
			cartListElem.innerHTML = Cart.emptyCartHtml();

		this.updateCartSummary();

		// New prods aren't listened by materialize; initialize again
		reinitMaterialize();

		if (debugMode)
			console.log('%cUpdating cart DOM.', `color: ${colors.info};`);

		return itemsNodes;
	}

	// Generate DOM nodes for the cart
	generateNodes() {
		let nodes = [];
		this.itemList.forEach(item => nodes.push(Cart.cartItemToNode(item)));
		return nodes;
	}

	updateCartSummary() {
		let summaryElem = document.querySelector('#cart-summary');
		let subtotalElem = summaryElem.querySelector('.cart__summary-subtotal');
		let interestElem = summaryElem.querySelector('.cart__summary-interest');
		let taxElem = summaryElem.querySelector('.cart__summary-tax');
		let discountElem = summaryElem.querySelector('.cart__summary-discount');
		let totalElem = summaryElem.querySelector('.cart__summary-total');

		subtotalElem.innerText = `$${this.subtotal.toFixed(2)}`;
		interestElem.innerText = `${(this.getTotalInterestRate() * 100).toFixed(2)}%`;
		taxElem.innerText = `${this.taxRate * 100}%`;
		discountElem.innerText = `${this.discount * 100}%`;
		totalElem.innerText = `$${this.total.toFixed(2)}`;
	}

	// Update cart icons to show a badge with the prod count
	static updateCartBadges() {
		let cartBadges = document.querySelectorAll('.cart-badge');

		// If at least 1 item in cart, remove hidden from badges
		// Else if the elem isn't hidden, hide it
		if (activeCart.itemCount > 0) {
			cartBadges.forEach(e => {
				e.innerText = activeCart.itemCount;
				e.classList.remove('hide');
			});
		} else {
			cartBadges.forEach(e => {
				if (!e.classList.contains('hide'))
					e.classList.add('hide');
			});
		}

		return cartBadges;
	}

	// Cart item info represented as HTML element as string
	static cartItemToNode(item) {
		let node = Product.productToNode(item, 'cartItem');
		return node;
	}
	//#endregion

	//#region Cart status ----------- //
	// After modifying a field, should call this
	updateCart() {
		this.subtotal = this.itemList.reduce((a, b) => a + b.total, 0);
		this.totalQuantity = this.itemList.reduce((a, b) => a + b.quantity, 0);
		this.itemCount = this.itemList.length;
		this.total = this.subtotal;
		this.total *=
			(1 - this.discount)
			* (1 + this.taxRate)
			* (1 + this.getTotalInterestRate());
		this.monthFee = this.total / this.payments;

		Cart.saveCart();
		this.updateDom();

		if (debugMode)
			console.log(`Cart price now is: $${this.total}`);
		return this.total;
	}

	static saveCart(cartName = 'activeCart') {
		let cartString = JSON.stringify(activeCart);
		localStorage.setItem(cartName, cartString);
		return(cartString);
	}

	static loadCart(cartName = 'activeCart') {
		let cartJSON = localStorage.getItem(cartName);
		if (!cartJSON)
			return null;

		let cartParsed = JSON.parse(cartJSON);
		let cartRecovered = new Cart();
		let itemListParsed = [];
		let itemListRecovered = [];

		let paymentsElem = document.querySelector('#cart-payments');

		// Load cart properties
		Object.assign(cartRecovered, cartParsed);

		// Copy the parsed list, but save Product objects to recover methods
		itemListParsed = cartRecovered.itemList;
		itemListParsed.forEach(item => {
			itemListRecovered.push(Object.assign(new Product(), item));
		});
		cartRecovered.itemList = itemListRecovered;

		if (paymentsElem) {
			// Get the payments element and add the event listener
			paymentsElem.value = cartRecovered.payments;
			paymentsElem.addEventListener('change', () => {
				cartRecovered.payments =
				cartRecovered.setPayments(paymentsElem.value);
			});

			// Then add interest% next to the payments count
			paymentsElem.childNodes.forEach(child => {
				let payments = child.value;
				let interest =
					Math.round(cartRecovered.monthInterestRate * payments * 100);
				if (payments > 1) {
					child.innerHTML =
						`${payments} <span class="cart__payments-interest"> (${interest}%)</span>`;
				}
			});
		}

		return cartRecovered;
	}

	static emptyCartHtml() {
		let emoji = ['🙁', '😕', '🤨', '🥺', '❌', '🛒', '🎈', '💤', '🐱‍👤', '💔'];
		emoji = emoji[Math.floor(Math.random() * 10)];
		let html =
			`<span class="empty-cart-msg">The cart is empty ${emoji}</span>`;
		return html;
	}
	//#endregion

	//#region Get / Set ------------- //
	getTotalInterestRate() {
		let interest = (this.payments > 1)
			? this.monthInterestRate * (this.payments)
			: 0;
		return  interest;
	}

	setItemList(items) {
		if (!Array.isArray(items) || !items.every(x => x instanceof Product)) {
			console.warn('Invalid arguments: CartItems[] expected');
			return null;
		}

		if (debugMode) {
			console.groupCollapsed(
				'%cItem list set to:',
				`color: ${colors.success};`);
			console.log(items);
			console.groupEnd();
		}

		this.itemList = items;
		this.updateCart();
		return this.itemList;
	}

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
	//#endregion
}

// TODO: make this static
// Active cart used globally
/**@type Cart */
let activeCart = Cart.loadCart();

if (!activeCart) activeCart = new Cart();
activeCart.updateDom();
