// TODO: manipulate qty from DOM

// Stores cart status and item list
class Cart {
	constructor({ discount, payments, monthInterestRate, tax, itemList } = {}) {
		this.itemList = itemList || [];
		this.itemCount = 0;
		this.totalQuantity = 0;

		this.total = 0;
		this.subtotal = 0;
		this.discount = discount || 0;
		this.monthInterest = monthInterestRate || 0.03;
		this.payments = payments || 1;
		this.taxRate = tax || 0;
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
		if (item.getQuantity() < 1) {
			console.warn('Zero quantity items won\'t be added');
			return null;
		}

		// If already in cart only increase quantity
		let result = this.findItem(item.name);
		if (result)
			result.increaseQuantity();
		else {
			let copy = copyObject(new Product(), item);
			this.itemList.push(copy);
		}

		let toastQty = item.quantity > 1 ? `${item.quantity}` : '';
		M.toast({ text: `${toastQty} ${item.name} added to cart.`,
			displayLength: 2000 });

		if (debugMode)
			console.log(
				`%cAdded to cart: ${item.name} ` +
				`(${item.getQuantity()})`,
				`color: ${colors.success}`);

		this.updateCart();
		return item;
	}

	// Remove item from cart (Product or string)
	removeItem(item) {
		// Check if item exists
		let removedItem = this.findItem(item);
		if (!removedItem) {
			console.warn('Item not found, no item removed');
			return null;
		}
		let removedIndex = this.itemList.indexOf(removedItem);

		// Remove item
		this.itemList.splice(removedIndex, 1);

		M.toast({
			text: `${removedItem.name} removed from cart.`,
			displayLength: 2000 });

		if (debugMode)
			console.log(
				`%cRemoved from cart: ${removedItem.name} ` +
				`(${removedItem.getQuantity()})`,
				`color: ${colors.danger};`);

		this.updateCart();
		return removedItem;
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

	//#region Price Methods --------- //
	calcDiscount(discount = this.discount) {
		return this.total * (1 - discount);
	}

	// Calc. the interest tax (flat $) for the subtotal
	calcInterest(payments = this.payments, interest = this.monthInterest) {
		interest = (payments > 1)
			? this.total * (1 + (interest * (payments - 1)))
			: this.total;
		return interest;
	}

	// Calc. the monthly interest tax (flat $) for the subtotal
	calcMonthInterest(payments = this.payments, interest = this.monthInterest) {
		return this.calcInterest(payments, interest) / payments;
	}

	// Calc. the total with tax rate applied
	calcTax(tax = this.taxRate) {
		return this.total * (1 + tax);
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
		cartListElem.replaceChildren(...itemsNodes);

		// New products aren't zoomable, initialize again
		initMaterialboxed();

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
		this.subtotal = this.itemList.reduce((a, b) => a + b.getTotal(), 0);
		this.totalQuantity = this.itemList.reduce((a, b) => a + b.getQuantity(), 0);
		this.itemCount = this.itemList.length;
		this.total = this.subtotal;
		this.total = this.calcInterest();
		this.total = this.calcDiscount();
		this.total = this.calcTax();
		this.monthFee = this.total / this.payments;

		Cart.saveCart();
		this.updateDom();

		if (debugMode)
			console.log(`Cart price now is: $${this.getTotal()}`);
		return this.total;
	}

	static saveCart(cartName = 'activeCart') {
		let cartString = JSON.stringify(activeCart);
		localStorage.setItem(cartName, cartString);
		return(cartString);
	}

	static loadCart(cartName = 'activeCart') {
		let cartJSON = localStorage.getItem(cartName);
		if (!cartJSON) return null;

		let cartParsed = JSON.parse(cartJSON);
		let cartRecovered = new Cart();

		let itemListFlat = '';
		let itemListRecovered = [];

		// TODO: replace with spread operator
		// Load cart properties
		for (const prop in cartParsed)
			cartRecovered[prop] = cartParsed[prop];

		// Copy the "flat" item list, but with real Product objects
		// this way methods and other data JSON doesn't save can be recovered
		itemListFlat = cartRecovered.itemList;

		for (const item in itemListFlat) {
			itemListRecovered[item] = new Product();

			for (const prop in itemListFlat[item])
				itemListRecovered[item][prop] = itemListFlat[item][prop];
		}
		cartRecovered.itemList = itemListRecovered;

		return cartRecovered;
	}
	//#endregion

	//#region Get / Set ------------- //
	// Setters
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
		this.monthInterest = amount;
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

	// Getters
	getItemList() { return this.itemList; }
	getItemCount() { return this.itemCount; }
	getTotalQuantity() { return this.totalQuantity; }

	getTotal() { return this.total; }
	getSubtotal() { return this.subtotal; }
	getDiscount() { return this.discount; }
	getMonthInterest() { return this.monthInterest; }
	getPayments() { return this.payments; }
	getTaxRate() { return this.taxRate; }
	getMonthFee() { return this.monthFee; }
	//#endregion
}

// TODO: make this static
// Active cart used globally
/**@type Cart */
let activeCart = Cart.loadCart();

if (!activeCart) activeCart = new Cart();
activeCart.updateDom();
