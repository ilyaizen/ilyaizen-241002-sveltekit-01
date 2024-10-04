export function match(param) {
	console.log({ lang: { param } });
	return param === 'he' || param === 'en-us';
}
