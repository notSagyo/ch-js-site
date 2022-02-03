// TODO: convert to ES6 classes?
// TODO: manipulate quantity from cart
// Stores cart status and (todavia no) item list
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
		if (!(item instanceof Product)) {
			console.warn('Invalid arguments: CartItem expected');
			return null;
		} else if (item.getQuantity() < 1) {
			console.warn('Zero quantity items won\'t be added');
			return null;
		}

		_itemList.push(item);
		_productCount++;
		_itemQuantity += item.getQuantity();

		if (debugMode)
			console.log(`%cAdded to cart: ${item.name} ` +
				`(${item.getQuantity()})`,
				`color: ${colorSuccess}`);
		this.updateCart();
		return item;
	}

	// Remove item from cart (CartItem or name accepted)
	this.removeItem = (item) => {
		let removedItem = this.findItem(item);
		if (!removedItem) {
			console.warn('Item not found, no item removed ');
			return null;
		}
		let removedIndex = _itemList.indexOf(removedItem)

		_itemQuantity -= removedItem.getQuantity();
		_itemList.splice(removedIndex, 1);

		if (debugMode) {
			console.log(
				`%cRemoved from cart: ${removedItem.name} ` +
				`(${removedItem.getQuantity()})`,
				`color: ${colorDanger};`);
		}
		this.updateCart();
		return removedItem;
	}

	// Remove all items from cart
	this.clearCart = () => {
		_itemQuantity = 0;
		_itemList = [];
		if (debugMode) console.log('%cCART CLEARED', `color: ${colorDanger};`);
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

		if (debugMode)
			console.log(`Cart price now is: $${this.getTotal()}`);
		return this.total;
	}

	// Find an item in the cart
	this.findItem = (item) => {
		let result = item;
		let itemIndex = 0;

		if (typeof item == "string"){
			item = item.toLowerCase();
			result = _itemList.find(x => x.name.toLowerCase() == item);
		}
		else if (item instanceof Product) {
			result = _itemList.find(x => x === result);
		} else {
			console.warn('Invalid arguments: CartItem or string expected');
			return null;
		}

		let notFound = (name) => console.log(
			`%cItem not found: ${name}`, `color: ${colorInfo};`);

		if (debugMode && result)
			console.log(
				`%cItem ${result.name} found at position [${itemIndex}].`,
				`color: ${colorInfo}`);
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

	//#region Get / Set ------------- //
	this.setItemList = (items) => {
		if (!Array.isArray(items) || !items.every(x => x instanceof Product)) {
			console.warn('Invalid arguments: CartItems[] expected');
			return null;
		}

		if (debugMode) {
			console.groupCollapsed(
				`%cItem list set to:`, `color: ${colorSuccess};`)
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
