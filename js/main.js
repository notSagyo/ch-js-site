// Create new product list
let productList = new ProductList();
activeProductList = productList;

// Create some p
let prods = [];
fetch('https://fakestoreapi.com/products')
	.then(res=>res.json())
	.then(json =>  {
		json.forEach(prod => {
			let { title, price, description, image } = prod;
			prods.push(new Product(title, price, description, image));
		});
	})
	.then(() => productList.setProducts(prods));
