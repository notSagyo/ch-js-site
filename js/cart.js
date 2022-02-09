// TODO: convert to ES6 classes?
// TODO: manipulate quantity from cart

// Stores cart status and item list
const Cart = function({discount, payments, monthInterestRate} = {}) {
	let _itemList = [];
	let _productCount = 0;
	let _itemQuantity = 0;

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

		// Add product
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
			console.warn('Item not found, no item removed ');
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
		M.toast({text: `${item.name} removed from cart.`, displayLength: 2000});

		this.updateCart();
		return removedItem;
	}

	// Remove all items from cart
	this.clearCart = () => {
		_itemQuantity = 0;
		_itemList = [];
		if (debugMode) console.log('%cCART CLEARED', `color: ${colors.danger};`);
		this.updateCart();
	}

	// After modifying a field, should call this
	this.updateCart = () => {
		_subtotal = _itemList.reduce((a, b) => a + b.getTotal(), 0);
		_itemQuantity = _itemList.reduce((a, b) => a + b.getQuantity(), 0);
		_productCount = _itemList.length;
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
		let result = item;

		if (typeof item == "string"){
			item = item.toLowerCase();
			result = _itemList.find(x => x.name.toLowerCase() == item);
		}
		else if (item instanceof Product) {
			result = _itemList.find(x => x === item);
		} else {
			console.warn('Invalid arguments: CartItem or string expected');
			return null;
		}

		let notFound = (name) => console.log(
			`%cItem not found: ${name}`, `color: ${colors.info};`);

		if (debugMode && result)
			console.log(
				`%cItem ${result.name} found.`,
				`color: ${colors.info}`);
		else if (debugMode && typeof item === "string")
			notFound(item);
		else if (debugMode)
			notFound(item.name);
		return result;
	}
	//#endregion

	//#region Price Methods --------- //
	// Add amount to subtotal
	this.subtotalAdd = (amount) => {
		this.setSubtotal(_subtotal + amount)
		return this.subtotal;
	}

	// Subtract amount from subtotal
	this.subtotalSubtract = (amount) => {
		return this.subtotalAdd(-amount);
	}

	this.calcDiscount = (discount = _discount) => {
		return _total * (1 - discount);
	}

	// Calc. the tax ($) for the current subtotal
	this.calcInterest = (payments = _payments, interest = _monthInterest) => {
		return (payments > 1) ? (_subtotal * interest * (payments - 1)) : 0;
	}

	// Calc. the monthly tax ($) for the current subtotal
	this.calcMonthInterest = (payments = _payments, tax = _monthInterest) => {
		return this.calcInterest(payments, tax) / payments;
	}
	//#endregion

	//#region DOM Methods
	this.updateDom = () => {
		// Update cart badges to show product count
		let cartBadges = document.querySelectorAll('.cart-badge');
		if (_productCount > 0) {
			cartBadges.forEach(elem => {
				elem.innerText = _productCount
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

		let itemsHTML = productsHTML = this.getHTML();
		itemListElem.innerHTML = itemsHTML;

		// Add the remove from cart function to buttons
		let removeElems = document.querySelectorAll('.cart-item__remove');
		for (const key in _itemList) {
			removeElems[key].addEventListener(
				'click', () => activeCart.removeItem(_itemList[key]))
		}

		// New products aren't zoomable; initialize zoomable elements again
		if (debugMode)
			console.log('%cUpdating cart DOM.', `color: ${colors.info};`);
		initMaterialboxed();
	}

	this.getHTML = () => {
		let html = ''
		_itemList.forEach(elem => {
			html += cartItemToHTML(elem);
		});
		return html;
	}
	//#endregion

	//#region Get / Set ------------- //
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

	this.setTotal = (amount) => {
		console.warn('Warning: total should not be manually set.');
		_total = amount;
		return _total;
	}

	this.setSubtotal = (amount) => {
		_subtotal = amount;
		this.updateCart();
		return _subtotal;
	}

	this.setDiscount = (amount) => {
		_discount = amount;
		this.updateCart();
		return _discount;
	}

	this.setMonthInterest = (amount) => {
		_monthInterest = amount;
		this.updateCart();
		return _monthInterest;
	}

	this.setPayments = (amount) => {
		_payments = amount;
		this.updateCart();
		return _payments;
	}

	this.getItems = () => { return _itemList; }
	this.getProductCount = () => { return _productCount; }
	this.getItemQuantity = () => { return _itemQuantity; }

	this.getTotal = () => { return _total; }
	this.getSubtotal = () => { return _subtotal; }
	this.getDiscount = () => { return _discount; }
	this.getMonthInterest = () => { return _monthInterest };
	this.getPayments = () => { return _payments; }
	this.getMonthFee = () => { return _monthFee; }
	//#endregion

	// Other ------------------------ //
	// Log the cart in readable format
	this.log = () => {
		console.groupCollapsed(this.constructor.name);
		let msg = {
			_productCount,
			_itemQuantity,
			_total,
			_subtotal,
			_discount,
			_monthInterest,
			_payments,
			_monthFee,
			_itemList
		}
		console.log(`${JSON.stringify(msg, null, '	')}`);
		console.groupEnd();
	}
};

// Active cart used globally
let activeCart = undefined;
