// Stores cart status and (todavia no) item list
const Cart = function({discount = 0, payments = 1, taxRate: monthTaxRate = 0.03} = {}) {
	let _productCount = 0;
	let _itemQuantity = 0;

	let _total = 0;
	let _subtotal = 0;
	let _discount = discount || 0;
	let _monthTaxRate = monthTaxRate || 0.03;
	let _payments = payments || 1;
	let _monthFee = 0;

	// Get / Set -------------------- //
	this.getTotal = () => { return _total; }
	this.setTotal = (amount) => {
		console.warn('Warning: you should not manually set the total.');
		_total = amount;
		return _total;
	 }

	this.getSubtotal = () => { return _subtotal; }
	this.setSubtotal = (amount) => {
		_subtotal = amount;
		this.updatePrice();
		return this.subtotal;
	}

	this.getDiscount = () => { return _discount; }
	this.setDiscount = (amount) => {
		_discount = amount;
		this.updatePrice();
		return _discount;
	}

	this.getPayments = () => { return _payments; }
	this.setPayments = (amount) => {
		_payments = amount;
		this.updatePrice();
		return _payments;
	}

	this.getTaxRate = () => { return _monthTaxRate };
	this.setTaxRate = (amount) => {
		_monthTaxRate = amount;
		this.updatePrice();
		return _monthTaxRate;
	}

	this.getMonthFee = () => { return _monthFee; }
	this.getItemCount = () => { return _productCount; }
	this.getItemQuantity = () => { return _itemQuantity; }

	// Item methods ----------------- //
	// Add item to cart
	this.addItem = (item) => {
		if (debugMode) console.log(`${item.name} added to cart`);
		_productCount++;
		_itemQuantity += item.getQuantity();
		this.subtotalAdd(item.getTotal());
		return item;
	}

	// Remove item from cart
	this.removeItem = (item) => {
		if (debugMode) console.log(`${item.name} removed from cart`);
		_productCount--;
		_itemQuantity -= item.getQuantiy();
		this.subtotalSubtract(item.getTotal());
		return item;
	}

	// Remove all items from cart
	this.clearCart = () => {
		if (debugMode) console.log(`Cart was cleared`);
		_productCount = 0;
		_itemQuantity = 0;
		this.setSubtotal(0);
	}

	// Price methods ---------------- //
	// After a variable set, update all variables
	this.updatePrice = () => {
		_total = _subtotal + this.calcTax(_payments, _monthTaxRate);
		_total = this.calcDiscount(_discount);
		_monthFee = _total / _payments;
		if (debugMode) console.log(`Cart price is now: $${this.getTotal()}`);
		return this.total;
	}

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
	this.calcTax = (payments = _payments, tax = _monthTaxRate) => {
		return (payments > 1) ? (_subtotal * tax * (payments - 1)) : 0;
	}

	// Calc. the monthly tax ($) for the current subtotal
	this.calcMonthTax = (payments = _payments, tax = _monthTaxRate) => {
		return this.calcTax(payments, tax) / payments;
	}

	// Other ------------------------ //
	// Print the object in readable format
	this.toString = (multiline = false) => {
		let str =
			`productCount: ${this.getItemCount()}, ` +
			`itemQuantity: ${this.getItemQuantity()}, ` +
			`total: $${this.getTotal().toFixed(2)}, ` +
			`subtotal: $${this.getSubtotal().toFixed(2)}, ` +
			`discount: ${(this.getDiscount() * 100).toFixed(2)}%, ` +
			`taxRate: ${(this.getTaxRate() * 100).toFixed(2)}%, ` +
			`payments: ${this.getPayments()}, ` +
			`monthFee: $${this.getMonthFee().toFixed(2)}`

		if (multiline) str = str.replace(/, /g, '\n');
		return str;
	}
};

// Stores product related info
const CartItem = function(name = 'Item', price = 0, quantity = 1) {
	this.name = name;
	let _price = price;
	let _quantity = quantity;
	let _total = price * quantity;

	// Get / Set -------------------- //
	this.getTotal = () => { return _total; }

	this.getQuantity = () => { return _quantity; }
	this.setQuantity = (amount) => {
		_quantity = amount;
		this.updateTotal();
		return _quantity;
	}

	// Quantity methods ------------- //
	this.increaseQuantity = (amount) => {
		_quantity += amount || 1;
		this.updateTotal();
		return _quantity;
	}

	this.decreaseQuantity = (amount) => {
		_quantity -= amount || 1;
		this.updateTotal();
		return _quantity;
	}

	this.resetQuantity = () => { return this.setQuantity(1); }

	// Price methods ---------------- //
	this.updateTotal = () => {
		_total = _price * _quantity;
		return _total;
	}
};

// Log extra info if debug
let debugMode = true;

// Create some new items
let shirt = new CartItem('T-Shirt', 20);
shirt.setQuantity(10);
let jeans = new CartItem('Jeans', 40);
jeans.increaseQuantity(4);
let shoes = new CartItem('Shoes', 55);
shoes.increaseQuantity();

// Create a new cart
let cart = new Cart();
cart.addItem(shirt);
cart.addItem(jeans);
cart.addItem(shoes);

// Print cart status
console.log(cart.toString(true));
