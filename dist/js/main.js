// Log extra info if debug
let debugMode = true;

(() => {
	// Create a new cart
	let cart = new Cart();

	//#region Interactive --------------------------------------------------- //
	let interactiveCart = () => {
		let name = prompt('Para agregar un producto al carrito ingrese el nombre:');

		let price = Number(prompt('Ingrese: el precio:'));
		if (isNaN(price))
			return console.log('Entrada inválida');

		let qty = Number(prompt('Ingrese cuántas unidades:'));
		if (!Number.isInteger(qty))
			return console.log('Entrada inválida');

		let item = new CartItem(name, price, qty);
		cart.addItem(item);
	}

	let keepShopping = true;
	while(keepShopping) {
		interactiveCart();
		keepShopping = confirm(
			'• Si desea agregar otro producto, seleccione aceptar. ' +
			'\n• Por el contrario seleccione cancelar.');
	}
	//#endregion

	//#region Sapmle Cart ---------------------------------------------------//
	// let shirt = new CartItem('T-Shirt', 20, 12);
	// let jeans = new CartItem('Jeans', 40, 5);
	// let shoes = new CartItem('Shoes', 55, 2);
	// let items = [shirt, jeans, shoes];

	// cart.addItem(shirt);
	// cart.addItem(jeans);
	// cart.addItem(shoes);
	// cart.setItemList(items);
	// cart.removeItem('shoes');
	//#endregion

	// Print cart status
	console.log(cart.toString(true));
})();
