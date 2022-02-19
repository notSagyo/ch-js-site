(() => {
	gsap.registerPlugin(ScrollTrigger);

	let defs = { duration: 1, ease: 'sine' };
	let tl = gsap.timeline({ defaults: defs });

	let logo = '#svg-logo',
		box = '#svg-logo-box',
		upper = '#svg-logo-upper',
		lower = '#svg-logo-lower',
		line = '#svg-logo-line',
		heroBackground = '#hero-background-img',
		heroLeft = '#hero-img-left',
		heroRight = '#hero-img-right';

	// Hero order images animation
	gsap.from(heroLeft, { x: '-100%' });
	gsap.from(heroRight, { x: '100%' });

	//#region Logo animation ------------------------------------------------ //
	// Hide cursor
	gsap.to(line, { duration: 0, opacity: 0 });

	// Logo anim
	tl.to(logo, { opacity: 1 }, 0)
		.to([box, upper], { x: '-115px' })
		.to(lower, { x: '115px' }, '<')
		.to(upper, { y: '47px', duration: .75 }, '>')
		.to(lower, { y: '-43px', duration: .75 }, '<')
		.totalDuration(1.75);

	// Cursor anim
	gsap.set(line, { strokeWidth: 4 });
	tl = gsap.timeline({ repeat: -1, yoyo: true, delay: tl.totalDuration() * 0.75 })
		.to(line, { opacity: 0, duration: 0.25 })
		.to(line, { opacity: 1, duration: 0.5 });
	//#endregion

	//#region Background animation ------------------------------------------ //
	// Recuerdos de guerra de Algebra y hacer gráficos en Pascal
	let screentCenterX = window.screen.width / 2;
	let screenCenterY = window.screen.height / 2;
	let bgForce = 0.05;

	if (window.screen.width > mediaMd) {
		document.addEventListener('mousemove', (e) => {
			let posX = (e.clientX - screentCenterX) * bgForce  + 'px';
			let posY = (e.clientY - screenCenterY) * bgForce  + 'px';

			gsap.to(heroBackground, {
				backgroundPositionX: posX,
				backgroundPositionY: posY,
				duration: 0.35,
				ease: 'ease-in-out'
			});
		});
	}
	//#endregion
})();

function typeWriter(elem, text, timeout = 75) {
	elem.innerText = ' ';
	gsap.to(elem, {
		scrollTrigger: elem,
		onComplete: typewriterEffect,
		onCompleteParams: [elem, text, timeout]
	});
}

// *Don't manually call this!
function typewriterEffect(elem, text, timeout, i = 0) {
	if (i == text.length) return;
	elem.innerText = elem.innerText.replace(' ', '');
	elem.innerText += text[i];
	setTimeout(() => typewriterEffect(elem, text, timeout, ++i), timeout);
}
