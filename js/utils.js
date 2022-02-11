// Log extra info if debug
let debugMode = true;

// Colors
let colors = {
	info: 'steelblue',
	success: 'seagreen',
	danger: 'indianred'
}

// TODO: make this a Product's static method
// Converts a product info to an HTML element
function productToHTML(product, type = 'productItem') {
	type = type.toLowerCase();
	let html = '';

	let title = product.name;
	let price = product.getTotal();
	let description = product.description;
	let image = product.image;
	let quantity = product.getQuantity();


	if (type == 'productitem') {
		html = /* html */
		`<!-- PRODUCT -->
		<li class="product-li row">
			<!-- Left side: image -->
			<div class="product-li__image col-xs-12 col-sm-4 col-xl-3">
				<img src="${image}" alt="">
			</div>
			<!-- Right side: details -->
			<div class="product-li__details col-xs-12 col-sm">
				<!-- Title -->
				<span class="product-li__title">${title}</span>
				<!-- Description -->
				<p class="product-li__description">${description}</p>
				<div class="product-li__footer">
					<!-- Price -->
					<span class="product-li__price h6">$${price}</span>
					<!-- Add to cart -->
					<a href="javascript://" class="product-li__add cart-btn tooltipped" data-tooltip="Add to cart"><i class="material-icons">add_shopping_cart</i></a>
				</div>
			</div>
		</li>
		`;
	} else if (type == 'cartitem') {
		html = /* html */
		`<!-- PRODUCT -->
		<li class="cart-item row">
			<!-- Image  -->
			<div class="cart-item__image">
				<img src="${image}" alt="">
			</div>
			<!-- Details -->
			<div class="cart-item__details">
				<!-- Left Side -->
				<div class="cart-item__details-left">
					<div>
						<span class="h5">${title}</span>
						<span class="quantity">${quantity > 1 ? `x${quantity}` : ''}</span>
					</div>
					<span class="h6 cart-item__price">$${price}</span>
				</div>
				<!-- Right side -->
				<div class="cart-item__details-right">
					<!-- Remove from cart -->
					<a href="javascript://" class="cart-item__remove cart-btn tooltipped" data-tooltip="Remove from cart"><i class="material-icons">remove_shopping_cart</i></a>
				</div>
			</div>
		</li>
		`;
	}
	return html;
}

function cartItemToHTML(item) {
	html = productToHTML(item, 'cartItem');
	return html;
}
