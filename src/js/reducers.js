import _ from 'lodash'
import detectLinks from './linkDetector'
import showTip from './tip'

const DEFAULT_STATE = {
	filterResult: {
		name: 'filterResult',
		checked: true,
		value: '',
		custom: true,
	},
	selectRange: {
		low: '',
		high: '',
	},
	copyLinks: false,
}

export function buildState(state = DEFAULT_STATE, html = '') {
	let { links, filters } = detectLinks(html);
	showTip(`Detected ${links.length} links`);
	return {
		...DEFAULT_STATE,
		...state,
		links: _.map(links, (link, index) => ({
			...link,
			checked: false,
			index: index + 1,
			visible: true,
		})),
		filters: _.filter(
			_.map(filters, (f) => ({
				name: f,
				checked: true,
				count: _.filter(links, ({ prefix }) => prefix === f).length,
			})),
			(f) => f.count > 0
		),
		visible: links.length,
		selected: [],
	};
}

function toggleLink(state, action) {
	return {
		...state,
		links: _.map(state.links, (link) => link === action.link ? { ...link, checked: !link.checked } : link),
	}
}

function setTypeFilters({links, filters, filterResult, ...state}, action) {
	let selected = {}, index = 0;
	for (let f of action.filters) {
		selected[f.name] = 1;
	}
	links = _.map(links, (link) => {
		return {
			...link,
			index: link.prefix in selected ? (++index) : null,
			visible: link.prefix in selected,
		}
	})
	filters = _.map(filters, (filter) => ({
		...filter,
		checked: filter.name in selected,
	}))
	return {
		...state,
		links,
		filters,
		filterResult: {
			...filterResult,
			custom: action.custom,
		},
	}
}

function setFilterAttrs(state, action) {
	let { filterResult } = state;
	return {
		...state,
		filterResult: {
			...filterResult,
			...action.attrs,
		},
	}
}

function toggleTypeFilter({links, filters, filterResult, ...state}, action) {
	let selected = {}, index = 0;
	filters = _.map(filters, (f) => f === action.linkType ? { ...f, checked: !f.checked } : f)
	for (let f of filters) {
		if (f.checked)
			selected[f.name] = 1;
	}
	links = _.map(links, (link) => {
		return {
			...link,
			index: link.prefix in selected ? (++index) : null,
			visible: link.prefix in selected,
		}
	})
	return {
		...state,
		links,
		filters,
		filterResult,
	}
}

function selectAll({links, ...state}) {
	return {
		...state,
		links: _.map(links, (link) => ({
			...link,
			checked: link.visible ? true : link.checked,
		}))
	}
}

function selectRevert({links, ...state}) {
	return {
		...state,
		links: _.map(links, (link) => ({
			...link,
			checked: link.visible ? !link.checked : link.checked,
		}))
	}
}

function selectClear({links, ...state}) {
	return {
		...state,
		links: _.map(links, (link) => ({
			...link,
			checked: link.visible ? false : link.checked,
		}))
	}
}

function copyLinksToClipboard(state) {
	if (state.selected.length) {
		let $input = document.getElementById('text-copy-invisible');
		$input.value = document.getElementById('text-copy').value
		$input.focus()
		$input.select()
		document.execCommand('Copy')
		showTip(`Copied ${state.selected.length} links`)
	} else {
		showTip(`No link selected`)
	}
	return state
}

function updateCounts(state) {
	return {
		...state,
		visible: _.filter(state.links, (link) => link.visible).length,
		selected: _.filter(state.links, (link) => link.checked && link.visible),
	}
}

function updateFilterResult(state) {
	let { filterResult, links } = state

	if (!filterResult.checked) return {
		...state,
		links: _.map(links, (link) => ({
			...link,
			visible: !!link.index,
		})),
	};

	let words = {};
	_.each(filterResult.value.trim().toLowerCase().split(/\s+/), (w) => (words[w] = 1));
	words = _.keys(words);

	links = _.map(links, (link) => {
		if (!link.index) return link;
		let text = _.filter([link.url, link.decoded, ...link.titles], (s) => s).join(' ').toLowerCase();
		for (let key of words) {
			if (text.indexOf(key) < 0) {
				return {
					...link,
					visible: false,
				}
			}
		}
		return {
			...link,
			visible: true,
		};
	})
	return {
		...state,
		links,
	}
}

function setRange(state, action) {
	let { selectRange } = state, attrs = {};
	_.each(action.attrs, (v, k) => (attrs[k] = parseInt(v.replace(/\D/g, ''), 10) || ''))
	return {
		...state,
		selectRange: {
			...selectRange,
			...attrs,
		},
	}
}

function setRangeSelect(state, action) {
	let { links, selectRange } = state;
	if (!(_.isInteger(selectRange.low) && _.isInteger(selectRange.high)))
		return state;

	let checked = action === 'ALL'
	, low = _.min([selectRange.low, selectRange.high])
	, high = _.max([selectRange.low, selectRange.high])
	return {
		...state,
		links: _.map(links, (link) => (
			link.visible && link.index >= low && link.index <= high ?
			{
				...link,
				checked,
			}
			: link
		)),
	}
}

function reducer(state, action) {
	state = (({copyLinks, ...state}) => ({
			...state,
			copyLinks: action.type === 'SELECT_COPY_LINKS',
		}))(state);
	switch (action.type) {
		case 'REBUILD_STATE':
			state = buildState(state, action.html);
			break;
		case 'COPY_LINKS':
			state = copyLinksToClipboard(state);
			break;
		case 'SET_RANGE':
			state = setRange(state, action);
			break;
		case 'TOGGLE_TYPE_FILTER':
			state = toggleTypeFilter(state, action);
			break;
		case 'SET_FILTER_ATTRS':
			state = setFilterAttrs(state, action);
			break;
		case 'SET_TYPE_FILTERS':
			state = setTypeFilters(state, action);
			break;
		case 'TOGGLE_LINK':
			state = toggleLink(state, action);
			break;
		default:
	}
	state = updateFilterResult(state)

	switch (action.type) {
		case 'SELECT_ALL':
			state = selectAll(state);
			break;
		case 'SELECT_REVERT':
			state = selectRevert(state);
			break;
		case 'SELECT_CLEAR':
			state = selectClear(state);
			break;
		case 'RANGE_ALL':
			state = setRangeSelect(state, 'ALL');
			break;
		case 'RANGE_CLEAR':
			state = setRangeSelect(state, 'NONE');
			break;
		default:
	}
	return updateCounts(state);
}

export default reducer

