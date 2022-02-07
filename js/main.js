// Create new cart and product list
let productList = new ProductList();
let cart = new Cart();

// Set the active cart to the new cart
activeCart = cart;

//#region Example ----------------------------------------------------------- //
// Create some products
let shirt = new Product('T-Shirt', 15, 'This is a simple T-Shirt.',
	'..//img/shirt.webp');
let jeans = new Product('Jeans', 30, 'These are simple Jeans.',
	'..//img/jeans.webp');
let shoes = new Product('Shoes', 50, 'These are simple Shoes.',
	'..//img/shoes.webp');
let belt = new Product('Belt', 20, 'This is a simple Belt.',
	'..//img/belt.webp');
let prods = [shirt, jeans, shoes, belt];

// Update the product list
productList.setProducts(prods);

cart.setItemList(prods);
//#endregion

// Log cart status
cart.log();
