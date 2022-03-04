(() => {
	// Create new product list and add some prods
	let products = [];
	let productList = new ProductList();
	activeProductList = productList;

	// TODO: make this a function
	// Prods in case fetch request fails
	fetch('../data/products.json')
		.then(res => res.json())
		.then(json =>  {
			products = [];
			json.forEach(product => {
				let { title, price, description, image, category } = product;
				products.push(new Product(title, price, description, image, category));
			});
			productList.setProducts(products);
		})
		.catch((err) => console.error(err));

	// Products API request
	fetch('https://fakestoreapi.com/products')
		.then(res => res.json())
		.then(json =>  {
			products = [];
			json.forEach(product => {
				let { title, price, description, image, category } = product;
				products.push(new Product(title, price, description, image, category));
			});
			productList.setProducts(products);
		})
		.catch((err) => console.error(err));
})();
