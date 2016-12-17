import { sprintf } from 'sprintf'

export function tr(text, defaultText) {
	try {
		let r = window.chrome.i18n.getMessage(text);
		return r && r.length ? r : (defaultText || text);
	} catch (e) {
		return defaultText || text
	}
}

export function tf(key, defaultFormat, ...args) {
	return sprintf(tr(key, defaultFormat), ...args);
}
