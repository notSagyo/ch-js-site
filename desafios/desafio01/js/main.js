// Fibonacci (for)
let input = prompt('Iterations of Fibonacci:');

if (!isNaN(input) && input != null && input != '') {
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

	alert(message);
	console.log(message);
} else {
	alert('Invalid input!');
	console.log('Invalid input!');
}

// Find in Fibonacci (while)
input = prompt('Enter a number to find if it\'s a Fibonacci number');

if (!isNaN(input) && input != null && input != '') {
	let found = false;
	let currentN = 1;
	let previousN = 0;
	let result = 1;

	while(result < input) {
		result = previousN + currentN;
		previousN = currentN;
		currentN = result;

		if (result == input) {
			alert(input + ' is a Fibonacci number');
			console.log(input + ' is a Fibonacci number');
			found = true;
		}
	}

	if (!found) {
		alert(input + ' is not a Fibonacci number');
		console.log(input + ' is not a Fibonacci number');
	}
} else {
	alert('Invalid input!');
	console.log('Invalid input!');
}

// Count digits (do-while)
// Es el primer caso que se me ocurrió donde QUIZÁS se podrían ahorrar un par de
// lineas, ya que con un while "0" no entraría al loop
input = prompt('Enter a positive number to count its digits');

if (input > Number.MAX_SAFE_INTEGER) {
	alert('The input exceeds 2^53-1 please try a smaller number');
	console.log('The input exceeds 2^53-1 please try a smaller number');
} else if (!isNaN(input) && input != null && input != '') {
	let digits = 0;
	let currentN = input;

	do {
		currentN /= 10;
		currentN = Math.trunc(currentN);
		digits++;
	} while(currentN > 0);

	alert(input + ' digits: ' + digits);
	console.log(input + ' digits: ' + digits);
} else {
	alert('Invalid input!');
	console.log('Invalid input!');
}

// Days in a month (switch)
input = prompt('Enter a month to know how many days it has (inglés o español)');

if (input != null) {
	input = input.toLowerCase();
	switch (input) {
		case 'january':
		case 'enero':
			alert('January has 31 days.');
			console.log('January has 31 days');
			break;

		case 'february':
		case 'febrero':
			alert('February has 28 days (29 in leap years).');
			console.log('February has 28 days (29 in leap years).');
			break;

		case 'march':
		case 'marzo':
			alert('March has 31 days');
			console.log('March has 31 days');
			break;

		case 'april':
		case 'abril':
			alert('April has 30 days');
			console.log('April has 30 days');
			break;

		case 'may':
		case 'mayo':
			alert('May has 31 days');
			console.log('May has 31 days');
			break;

		case 'june':
		case 'junio':
			alert('June has 30 days');
			console.log('June has 30 days');
			break;

		case 'july':
		case 'julio':
			alert('July has 31 days');
			console.log('July has 31 days');
			break;

		case 'august':
		case 'agosto':
			alert('August has 31 days');
			console.log('August has 31 days');
			break;

		case 'september':
		case 'septiembre':
			alert('September has 30 days');
			console.log('September has 30 days');
			break;

		case 'october':
		case 'octubre':
			alert('October has 31 days');
			console.log('October has 31 days');
			break;

		case 'november':
		case 'noviembre':
			alert('November has 30 days');
			console.log('November has 30 days');
			break;

		case 'december':
		case 'diciembre':
			alert('December has 31 days');
			console.log('December has 31 days');
			break;

		default:
			alert('Invalid input!');
			console.log('Invalid input!');
			break;
	}
}
