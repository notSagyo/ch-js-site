// Log extra info if debug
let debugMode = true;

// Media queries
let mediaSm = 600;
let mediaMd = 992;
let mediaLg = 1200;
let mediaXl = 1400;

// Colors
let colors = {
	info: 'steelblue',
	success: 'seagreen',
	danger: 'indianred'
};

// Other
let toastLen = 50;

function createElement(tagName, classList = [], innerHTML = '') {
	let element = document.createElement(tagName);
	element.classList.add(...classList);
	element.innerHTML = innerHTML;
	return element;
}

// If it's a cart item pass the cart
function quantityControls(parent, product, cart) {
	let qtyInput = parent.querySelector('.product-qty__input');
	let qtyIncrease = parent.querySelector('.product-qty__increase');
	let qtyDecrease = parent.querySelector('.product-qty__decrease');

	qtyInput.addEventListener('change', () => {
		if (qtyInput.value < 1) qtyInput.value = 1;
		if (cart)
			activeCart.setItemQuantity(product, Number(qtyInput.value));
		else
			product.setQuantity(Number(qtyInput.value));
	});
	qtyIncrease.addEventListener('click', () => {
		qtyInput.value++;
		qtyInput.dispatchEvent(new Event('change'));
	});
	qtyDecrease.addEventListener('click', () => {
		qtyInput.value--;
		qtyInput.dispatchEvent(new Event('change'));
	});
}

function copyObject(target, source) {
	let copy = JSON.parse(JSON.stringify(source));
	Object.assign(target, copy);
	return target;
}

function truncateText(text, length) {
	if (text.length > length) {
		text = text.substring(0, length);
		text = text.split(' ');
		text.splice(-1, 1);
		text = text.join(' ');
		text += '...';
	}
	return text;
}
