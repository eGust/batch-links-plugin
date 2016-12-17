export const SELECT_ALL = {
	type: 'SELECT_ALL'
}

export const SELECT_REVERT = {
	type: 'SELECT_REVERT'
}

export const SELECT_CLEAR = {
	type: 'SELECT_CLEAR'
}

export const SELECT_COPY_LINKS = {
	type: 'SELECT_COPY_LINKS'
}

export const COPY_LINKS = {
	type: 'COPY_LINKS'
}

export const RANGE_ALL = {
	type: 'RANGE_ALL',
}

export const RANGE_CLEAR = {
	type: 'RANGE_CLEAR',
}

export const SET_RANGE = (attrs) => ({
	type: 'SET_RANGE',
	attrs,
})

export const TOGGLE_TYPE_FILTER = (linkType) => ({
	type: 'TOGGLE_TYPE_FILTER',
	linkType,
})

export const SET_FILTER_ATTRS = (attrs) => ({
	type: 'SET_FILTER_ATTRS',
	attrs,
})

export const SET_TYPE_FILTERS = ({filters = [], custom = false}) => ({
	type: 'SET_TYPE_FILTERS',
	filters,
	custom,
})

export const TOGGLE_LINK = (link) => ({
	type: 'TOGGLE_LINK',
	link,
})

export const REBUILD_STATE = (html) => ({
	type: 'REBUILD_STATE',
	html,
})

const actions = {
	SELECT_ALL, SELECT_REVERT, SELECT_CLEAR, SELECT_COPY_LINKS,
	TOGGLE_LINK, RANGE_ALL, RANGE_CLEAR, SET_RANGE,
	TOGGLE_TYPE_FILTER, SET_FILTER_ATTRS, SET_TYPE_FILTERS,
	REBUILD_STATE, COPY_LINKS,
}

export default actions
