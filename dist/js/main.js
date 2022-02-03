// Log extra info if debug
let debugMode = true;

// Create new cart and product list
let productList = new ProductList();
let cart = new Cart();

//#region Interactive --------------------------------------------------- //
// let interactiveCart = () => {
// 	let name = prompt('Para agregar un producto al carrito ingrese el nombre:');

// 	let price = Number(prompt('Ingrese: el precio:'));
// 	if (isNaN(price))
// 		return console.log('Entrada inválida');

// 	let qty = Number(prompt('Ingrese cuántas unidades:'));
// 	if (!Number.isInteger(qty))
// 		return console.log('Entrada inválida');

// 	let item = new CartItem(name, price, qty);
// 	cart.addItem(item);
// }

// let keepShopping = true;
// while(keepShopping) {
// 	interactiveCart();
// 	keepShopping = confirm(
// 		'• Si desea agregar otro producto, seleccione aceptar. ' +
// 		'\n• Por el contrario seleccione cancelar.');
// }
//#endregion

//#region Example --------------------------------------------------------//
let shirt = new Product('T-Shirt', 15, 'This is a simple T-Shirt.');
let jeans = new Product('Jeans', 30, 'These are simple Jeans.');
let shoes = new Product('Shoes', 50, 'These are simple Shoes.');
let belt = new Product('Belt', 20, 'This is a simple Belt.');
let prods = [shirt, jeans, shoes, belt];

productList.setProducts(prods);
productList.updateDom();

cart.setItemList(prods);
cart.removeItem(belt);
cart.removeItem(shoes);
//#endregion

// Log cart status
cart.log();
