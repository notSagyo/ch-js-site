// Fibonacci (for)
let input = prompt('Iterations of Fibonacci:');

if (!isNaN(input) && input != null){
	let currentN = 1;
	let previousN = 0;
	let result = 1;
	let message = '';

	for (let i = 0; i < input; i++) {
		message += result + ' ';
		result = currentN + previousN;
		previousN = currentN;
		currentN = result;
	}

	console.log(message);
} else {
	console.log('Invalid input!');
}

// Find in Fibonacci (while)
input = prompt('Enter a number to find if it\'s a Fibonacci number');

if (!isNaN(input) && input != null) {
	let found = false;
	let currentN = 1;
	let previousN = 0;
	let result = 1;

	while(result < input) {
		result = previousN + currentN;
		previousN = currentN;
		currentN = result;

		if (result == input) {
			console.log(input + ' is a Fibonacci number');
			found = true;
		}
	}

	if (!found) {
		console.log(input + ' is not a Fibonacci number');
	}
} else {
	console.log('Invalid input!');
}

// Count digits (do-while)
// Es el primer caso que se me ocurrió donde QUIZÁS se podrían ahorrar un par de
// lineas, ya que con un while "0" no entraría al loop
input = prompt('Enter a positive number to count its digits');

if (input > Number.MAX_SAFE_INTEGER) {
	console.log('The input exceeds 2^53-1 please try a smaller number');
} else if (!isNaN(input) && input != null) {
	let digits = 0;
	let currentN = input;

	do {
		currentN /= 10;
		currentN = ~~currentN;
		digits++;
	} while(currentN > 0);

	console.log(input + ' digits: ' + digits);
} else {
	console.log('Invalid input!');
}
