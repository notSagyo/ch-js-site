(() => {
	// Create new product list
	let productList = new ProductList();
	activeProductList = productList;

	// Add some prods
	let prods = [];

	// TODO: put these in a JSON file
	// Prods in case fetch request fails
	prods = [
		new Product('Shirt', 15,
			'This is a simple shirt! If you\'re still reading this the products'
			+ ' API is taking too long or maybe even failed! 🙃',
			'../img/shirt.webp' ),
		new Product('Jeans', 30, 'These are simple Jeans.', '../img/jeans.webp'),
		new Product('Shoes', 50, 'These are simple Shoes.', '../img/shoes.webp'),
		new Product('Belt', 20, 'This is a simple Belt.', '../img/belt.webp'),
		new Product('Goated Shirt', 75, 'Most goated T-Shirt.', '../img/shirt.webp')
	];
	productList.setProducts(prods);

	fetch('https://fakestoreapi.com/products')
		.then(res => res.json())
		.then(json =>  {
			prods = [];
			json.forEach(prod => {
				let { title, price, description, image, category } = prod;
				prods.push(new Product(title, price, description, image, category));
			});
			productList.setProducts(prods);
		})
		.catch((err) => console.error(err));
})();
