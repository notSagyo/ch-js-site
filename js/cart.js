// TODO: convert to ES6 classes?
// TODO: manipulate quantity from cart
// TODO: add find item method
// Stores cart status and (todavia no) item list
const Cart = function({discount, payments, monthlyInterest} = {}) {
	let _itemList = [];
	let _productCount = 0;
	let _itemQuantity = 0;

	let _total = 0;
	let _subtotal = 0;
	let _discount = discount || 0;
	let _monthInterest = monthlyInterest || 0.03;
	let _payments = payments || 1;
	let _monthFee = 0;

	//#region Item Methods ---------- //
	// Add item to cart
	this.addItem = (item) => {
		if (!(item instanceof CartItem)) {
			console.error('Invalid arguments: CartItem expected');
			return;
		} else if (item.getQuantity() < 1) {
			console.warn('Warning: zero quantity items won\'t be added');
			return;
		}

		_itemList.push(item);
		_productCount++;
		_itemQuantity += item.getQuantity();

		if (debugMode)
			console.log(`%cAdded to cart: ${item.name} ` +
				`(${item.getQuantity()})`,
				'color: yellowgreen;');
		this.updateCart();
		return item;

	}

	// Remove item from cart (CartItem or name accepted)
	this.removeItem = (item) => {
		let itemName = item;
		let removedItem = item;
		let removedIndex = 0;

		if (item instanceof CartItem) {
			itemName = item.name;
			removedIndex = _itemList.indexOf(item);
		} else if (typeof item == "string") {
			removedItem = _itemList.find(x => x.name.toLowerCase() == itemName);
			removedIndex = _itemList.indexOf(removedItem);
		} else {
			console.error('Invalid arguments: CartItem or string expected');
			return;
		}
		if (removedIndex == -1) {
			console.warn('Warning: item not found, no item removed ');
			return;
		}

		_itemQuantity -= removedItem.getQuantity();
		_itemList.splice(removedIndex, 1);

		if (debugMode) {
			console.log(
				`%cRemoved from cart: ${itemName} ` +
				`(${removedItem.getQuantity()})`,
				'color: salmon;');
		}
		this.updateCart();
		return removedItem;
	}

	// Remove all items from cart
	this.clearCart = () => {
		_itemQuantity = 0;
		_itemList = [];
		if (debugMode) console.log('%cCART CLEARED', 'color: salmon;');
		this.updateCart();
	}

	// After modifying a field, should call this
	this.updateCart = () => {
		_subtotal = _itemList.reduce((a, b) => a + b.getTotal(), 0);
		_productCount = _itemList.length;
		_total = _subtotal + this.calcInterest(_payments, _monthInterest);
		_total = this.calcDiscount(_discount);
		_monthFee = _total / _payments;

		if (debugMode)
			console.log(`Cart price now is: $${this.getTotal()}`);
		return this.total;
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

	// TODO: get set of _itemList
	//#region Get / Set ------------- //
	this.setItemList = (items) => {
		if (!Array.isArray(items) || !items.every(x => x instanceof CartItem)) {
			console.error('Invalid arguments: CartItems[] expected');
			return;
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
	// Print the object in readable format
	this.toString = (multiline = false) => {
		let str =
			`productCount: ${_productCount}, ` +
			`itemQuantity: ${_itemQuantity}, ` +
			`total: $${_total.toFixed(2)}, ` +
			`subtotal: $${_subtotal.toFixed(2)}, ` +
			`discount: ${(_discount * 100).toFixed(2)}%, ` +
			`monthInterest: ${(_monthInterest * 100).toFixed(2)}%, ` +
			`payments: ${_payments}, ` +
			`monthFee: $${_monthFee.toFixed(2)}, `;
		if (multiline) str = str.replace(/, /g, '\n');

		let itemNames = [];
		_itemList.forEach(item => itemNames.push(item.name));
		itemNames = itemNames.join(', ');
		str += `items: ${itemNames}`;

		return str;
	}
};

// Stores product related info
// TODO: data validation
const CartItem = function(name = 'Item', price = 0, quantity = 1) {
	this.name = name;
	let _price = price;
	let _quantity = quantity;
	let _total = price * quantity;

	//#region Quantity methods ------ //
	this.increaseQuantity = (amount) => {
		return this.setQuantity(_quantity + (amount || 1));
	}

	this.decreaseQuantity = (amount) => {
		return this.setQuantity(_quantity + (amount || -1));
	}

	this.resetQuantity = () => { return this.setQuantity(1); }
	//#endregion

	// Price methods ---------------- //
	this.updateTotal = () => {
		_total = _price * _quantity;
		return _total;
	}

	//#region Get / Set ------------- //
	this.setPrice = (amount) => {
		if (!Number.isInteger(amount) || amount < 0) {
			console.error('Invalid arguments: positive integer expected');
			return;
		}
		_price = amount;
		this.updateTotal();
		return _price;
	}

	this.setQuantity = (amount) => {
		if (!Number.isInteger(amount) || amount < 0) {
			console.error('Invalid arguments: positive integer expected');
			return;
		}
		_quantity = amount;
		this.updateTotal();
		return _quantity;
	}

	this.setTotal = (amount) => {
		if (!Number.isInteger(amount) || amount < 0) {
			console.error('Invalid arguments: positive integer expected');
			return;
		}
		console.warn('Warning: total should not be manually set.');
		_total = amount;
		return _total;
	}

	this.getPrice = () => { return _price }
	this.getQuantity = () => { return _quantity; }
	this.getTotal = () => { return _total; }
	//#endregion
};
