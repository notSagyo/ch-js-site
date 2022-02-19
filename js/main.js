// Create new product list
let clothesList = new ProductList();
activeProductList = clothesList;

// Create some products
let prods = [
	new Product('Shirt', 15, 'This is a simple Shirt.', '../img/shirt.webp'),
	new Product('Jeans', 30, 'These are simple Jeans.', '../img/jeans.webp'),
	new Product('Shoes', 50, 'These are simple Shoes.', '../img/shoes.webp'),
	new Product('Belt', 20, 'This is a simple Belt.', '../img/belt.webp'),
	new Product('Goated Shirt', 75, 'Most goated T-Shirt.', '../img/shirt.webp')
];

// Update the product list
clothesList.setProducts(prods);
