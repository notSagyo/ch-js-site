// TODO: convert to ES6 classes?
// TODO: manipulate qty from DOM
// TODO: Add taxes (not only monthly interest)

// Stores cart status and item list
const Cart = function({discount, payments, monthInterestRate} = {}) {
	let _itemList = [];
	let _itemCount = 0;
	let _totalQuantity = 0;

	let _total = 0;
	let _subtotal = 0;
	let _discount = discount || 0;
	let _monthInterest = monthInterestRate || 0.03;
	let _payments = payments || 1;
	let _monthFee = 0;

	//#region Item Methods ---------- //
	// Add item to cart
	this.addItem = (item) => {
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
			_itemList.push(item);

		if (debugMode)
			console.log(`%cAdded to cart: ${item.name} ` +
				`(${item.getQuantity()})`,
				`color: ${colors.success}`);
		M.toast({text: `${item.name} added to cart.`, displayLength: 2000});

		this.updateCart();
		return item;
	}

	// Remove item from cart (Product or string)
	this.removeItem = (item) => {
		// Check if item exists
		let removedItem = this.findItem(item);
		if (!removedItem) {
			console.warn('Item not found, no item removed');
			return null;
		}
		let removedIndex = _itemList.indexOf(removedItem)

		// Remove item
		_itemList.splice(removedIndex, 1);

		if (debugMode)
			console.log(
				`%cRemoved from cart: ${removedItem.name} ` +
				`(${removedItem.getQuantity()})`,
				`color: ${colors.danger};`);

		M.toast({
			text: `${removedItem.name} removed from cart.`,
			displayLength: 2000});

		this.updateCart();
		return removedItem;
	}

	// Remove all items from cart
	this.clearCart = () => {
		_totalQuantity = 0;
		_itemList = [];
		if (debugMode) console.log('%cCART CLEARED', `color: ${colors.danger};`);
		this.updateCart();
	}

	// After modifying a field, should call this
	this.updateCart = () => {
		_subtotal = _itemList.reduce((a, b) => a + b.getTotal(), 0);
		_totalQuantity = _itemList.reduce((a, b) => a + b.getQuantity(), 0);
		_itemCount = _itemList.length;
		_total = _subtotal + this.calcInterest(_payments, _monthInterest);
		_total = this.calcDiscount(_discount);
		_monthFee = _total / _payments;

		this.updateDom();
		if (debugMode)
			console.log(`Cart price now is: $${this.getTotal()}`);
		return this.total;
	}

	// Find an item in the cart (Product or string)
	this.findItem = (item) => {
		result = Product.findProduct(item, _itemList);
		return result;
	}

	// Quantity Methods ------------- //
	this.increaseItemQuantity = (item, amount = 1) => {
		let res = this.findItem(item);
		if (!res) return -1;

		res.setQuantity(res.getQuantity() + amount);
		this.updateCart();
		return amount;
	}

	this.decreaseItemQuantity = (item, amount = 1) => {
		let res = this.findItem(item);
		if (!res) return -1;

		res.setQuantity(res.getQuantity() - amount);
		this.updateCart();
		return amount;
	}

	this.setItemQuantity = (item, amount) => {
		if (!Number.isInteger(amount) || amount < 0) {
			console.warn('Invalid arguments: positive integer expected');
			return -1;
		}

		let res = this.findItem(item);
		if (!res) return -1;

		res.setQuantity(amount);
		this.updateCart();
		return amount;
	}
	//#endregion

	//#region Price Methods --------- //
	this.calcDiscount = (discount = _discount) => {
		return _total * (1 - discount);
	}

	// Calc. the interest tax (flat $) for the subtotal
	this.calcInterest = (payments = _payments, interest = _monthInterest) => {
		return (payments > 1) ? (_subtotal * interest * (payments - 1)) : 0;
	}

	// Calc. the monthly interest tax (flat $) for the subtotal
	this.calcMonthInterest = (payments = _payments, intereset = _monthInterest) => {
		return this.calcInterest(payments, intereset) / payments;
	}
	//#endregion

	//#region DOM Methods
	this.updateDom = () => {
		// Update cart badges to show product count
		let cartBadges = document.querySelectorAll('.cart-badge');
		if (_itemCount > 0) {
			cartBadges.forEach(elem => {
				elem.innerText = _itemCount
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
		if (!itemListElem) return;

		let itemsHTML = productsHTML = this.generateHtml();
		itemListElem.innerHTML = itemsHTML;

		// Add the "remove from cart" function to buttons
		let removeBtns = document.querySelectorAll('.cart-item__remove');
		for (const key in _itemList) {
			removeBtns[key].addEventListener(
				'click', () => activeCart.removeItem(_itemList[key]));
		}

		// New products aren't zoomable; initialize zoomable elements again
		if (debugMode)
			console.log('%cUpdating cart DOM.', `color: ${colors.info};`);
		initMaterialboxed();
	}

	this.generateHtml = () => {
		let html = ''
		_itemList.forEach(elem => {
			html += cartItemToHTML(elem);
		});
		return html;
	}
	//#endregion

	//#region Get / Set ------------- //
	// Setters
	this.setItemList = (items) => {
		if (!Array.isArray(items) || !items.every(x => x instanceof Product)) {
			console.warn('Invalid arguments: CartItems[] expected');
			return null;
		}

		if (debugMode) {
			console.groupCollapsed(
				`%cItem list set to:`, `color: ${colors.success};`)
			console.log(items);
			console.groupEnd();
		}

		_itemList = items;
		this.updateCart();
		return _itemList;
	}

	this.setDiscount = (amount) => {
		_discount = amount;
		this.updateCart();
		return amount;
	}

	this.setMonthInterest = (amount) => {
		_monthInterest = amount;
		this.updateCart();
		return amount;
	}

	this.setPayments = (amount) => {
		_payments = amount;
		this.updateCart();
		return amount;
	}

	// Getters
	this.getItemList = () => _itemList;
	this.getItemCount = () => _itemCount;
	this.getTotalQuantity = () => _totalQuantity;

	this.getTotal = () => _total;
	this.getSubtotal = () => _subtotal;
	this.getDiscount = () => _discount;
	this.getMonthInterest = () => _monthInterest;
	this.getPayments = () => _payments;
	this.getMonthFee = () => _monthFee;
	//#endregion

	// Other ------------------------ //
	// Log the cart in readable format
	this.log = () => {
		console.groupCollapsed(this.constructor.name);
		let msg = {
			_itemCount,
			_totalQuantity,
			_total,
			_subtotal,
			_discount,
			_monthInterest,
			_payments,
			_monthFee,
			_itemList
		}
		console.log(`${JSON.stringify(msg, null, 2)}`);
		console.groupEnd();
	}
};

// Active cart used globally
let activeCart = undefined;
