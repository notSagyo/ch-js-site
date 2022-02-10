// TODO: manipulate qty from DOM
// TODO: Add taxes (not only monthly interest)

// Stores cart status and item list
class Cart {
	constructor({ discount, payments, monthInterestRate } = {}) {
		this.itemList = [];
		this.itemCount = 0;
		this.totalQuantity = 0;

		this.total = 0;
		this.subtotal = 0;
		this.discount = discount || 0;
		this.monthInterest = monthInterestRate || 0.03;
		this.payments = payments || 1;
		this.monthFee = 0;
	}

	//#region Item Methods ---------- //
	// Add item to cart
	addItem(item) {
		// Return if not valid argument
		if (!(item instanceof Product)) {
			console.warn('Invalid arguments: CartItem expected');
			return null;
		} else if (item.getQuantity() < 1) {
			console.warn('Zero quantity items won\'t be added');
			return null;
		}

		// If already in cart only increase quantity
		if (this.findItem(item.name))
			item.increaseQuantity();

		else
			this.itemList.push(item);

		if (debugMode)
			console.log(`%cAdded to cart: ${item.name} ` +
				`(${item.getQuantity()})`,
				`color: ${colors.success}`);
		M.toast({ text: `${item.name} added to cart.`, displayLength: 2000 });

		this.updateCart();
		return item;
	}

	// Remove item from cart (Product or string)
	removeItem (item) {
		// Check if item exists
		let removedItem = this.findItem(item);
		if (!removedItem) {
			console.warn('Item not found, no item removed');
			return null;
		}
		let removedIndex = this.itemList.indexOf(removedItem);

		// Remove item
		this.itemList.splice(removedIndex, 1);

		if (debugMode)
			console.log(
				`%cRemoved from cart: ${removedItem.name} ` +
				`(${removedItem.getQuantity()})`,
				`color: ${colors.danger};`);

		M.toast({
			text: `${removedItem.name} removed from cart.`,
			displayLength: 2000
		});

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

	// After modifying a field, should call this
	updateCart() {
		this.subtotal = this.itemList.reduce((a, b) => a + b.getTotal(), 0);
		this.totalQuantity = this.itemList.reduce((a, b) => a + b.getQuantity(), 0);
		this.itemCount = this.itemList.length;
		this.total = this.subtotal + this.calcInterest(this.payments, this.monthInterest);
		this.total = this.calcDiscount(this.discount);
		this.monthFee = this.total / this.payments;

		this.updateDom();
		if (debugMode)
			console.log(`Cart price now is: $${this.getTotal()}`);
		return this.total;
	}

	// Find an item in the cart (Product or string)
	findItem (item) {
		let result = Product.findProduct(item, this.itemList);
		return result;
	}

	// Quantity Methods ------------- //
	increaseItemQuantity (item, amount = 1) {
		let result = this.findItem(item);
		if (!result)
			return -1;

		result.setQuantity(result.getQuantity() + amount);
		this.updateCart();
		return amount;
	}

	decreaseItemQuantity (item, amount = 1) {
		let result = this.findItem(item);
		if (!result)
			return -1;

		result.setQuantity(result.getQuantity() - amount);
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
	calcDiscount (discount = this.discount) {
		return this.total * (1 - discount);
	}

	// Calc. the interest tax (flat $) for the subtotal
	calcInterest (payments = this.payments, interest = this.monthInterest) {
		return (payments > 1) ? (this.subtotal * interest * (payments - 1)) : 0;
	}

	// Calc. the monthly interest tax (flat $) for the subtotal
	calcMonthInterest (payments = this.payments, intereset = this.monthInterest) {
		return this.calcInterest(payments, intereset) / payments;
	}
	//#endregion

	//#region DOM Methods
	updateDom() {
		// Update cart badges to show product count
		let cartBadges = document.querySelectorAll('.cart-badge');
		if (this.itemCount > 0) {
			cartBadges.forEach(elem => {
				elem.innerText = this.itemCount;
				elem.classList.remove('hide');
			});
		} else {
			cartBadges.forEach(elem => {
				if (!elem.classList.contains('hide'))
					elem.classList.add('hide');
			});
		}

		// Update displayed cart items
		let itemListElem = document.querySelector('#cart-list');
		if (!itemListElem)
			return;

		let itemsHTML = this.generateHtml();
		itemListElem.innerHTML = itemsHTML;

		// Add the "remove from cart" function to buttons
		let removeBtns = document.querySelectorAll('.cart-item__remove');
		for (const key in this.itemList) {
			removeBtns[key].addEventListener(
				'click', () => activeCart.removeItem(this.itemList[key]));
		}

		// New products aren't zoomable; initialize zoomable elements again
		if (debugMode)
			console.log('%cUpdating cart DOM.', `color: ${colors.info};`);
		initMaterialboxed();
	}

	generateHtml() {
		let html = '';
		this.itemList.forEach(elem => {
			html += cartItemToHTML(elem);
		});
		return html;
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
				`%cItem list set to:`, `color: ${colors.success};`);
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

	// Getters
	getItemList() { return this.itemList; }
	getItemCount() { return this.itemCount; }
	getTotalQuantity() { return this.totalQuantity; }

	getTotal() { return this.total; }
	getSubtotal() { return this.subtotal; }
	getDiscount() { return this.discount; }
	getMonthInterest() { return this.monthInterest; }
	getPayments() { return this.payments; }
	getMonthFee() { return this.monthFee; }
	//#endregion
}

// Active cart used globally
let activeCart = undefined;
