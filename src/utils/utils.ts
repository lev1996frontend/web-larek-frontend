export type SelectorCollection<T> = string | NodeListOf<Element> | T[];

export type SelectorElement<T> = T | string;

export function isSelector(x: any): x is string {
	return typeof x === 'string' && x.length > 1;
}

export function ensureElementsAll<T extends HTMLElement>(
	selectorElement: SelectorCollection<T>,
	context: HTMLElement = document as unknown as HTMLElement
): T[] {
	if (isSelector(selectorElement)) {
		return Array.from(context.querySelectorAll(selectorElement)) as T[];
	}
	if (selectorElement instanceof NodeList) {
		return Array.from(selectorElement) as T[];
	}
	if (Array.isArray(selectorElement)) {
		return selectorElement;
	}
	throw new Error(`Unknown selector element`);
}

export function ensureElement<T extends HTMLElement>(
	selectorElement: SelectorElement<T>,
	context?: HTMLElement
): T {
	if (isSelector(selectorElement)) {
		const elements = ensureElementsAll<T>(selectorElement, context);
		if (elements.length > 1) {
			console.warn(`selector ${selectorElement} return more then one element`);
		}
		if (elements.length === 0) {
			throw new Error(`selector ${selectorElement} return nothing`);
		}
		return elements.pop() as T;
	}
	if (selectorElement instanceof HTMLElement) {
		return selectorElement as T;
	}
	throw new Error('Unknown selector element');
}

export function cloneTemplate<T extends HTMLElement>(
	query: string | HTMLTemplateElement
): T {
	const template = ensureElement(query) as HTMLTemplateElement;
	return template.content.firstElementChild.cloneNode(true) as T;
}

export function isBoolean(v: unknown): v is boolean {
	return typeof v === 'boolean';
}

export function totalPrice(price: number | null): string {
	if (price === null) {
			return 'Бесценно'; // Обработка случая, когда цена равна null
	}

	const priceToString = price.toString();

	return priceToString.length < 5
			? priceToString
			: priceToString
					.split('')
					.reverse()
					.map((item, index) => 
							(index % 3 === 2 && index !== priceToString.length - 1) ? item + ' ' : item
					)
					.reverse()
					.join('');
}