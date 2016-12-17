import actions from './actions'
import components from './components'
import { connect } from 'react-redux'

const defaultStateMap = (state, ownProps) => ({...state, ...ownProps})

export const MainButtons = connect(defaultStateMap)(components.MainButtons)
export const ToggleSelection = connect(defaultStateMap)(components.ToggleSelection)
export const RangeSelection = connect(defaultStateMap)(components.RangeSelection)
export const Filter = connect(
		defaultStateMap,
		(dispatch, ownProps) => ({
			onToggleTypeFilter: (linkType) => dispatch(actions.TOGGLE_TYPE_FILTER(linkType)),
			onUpdateFilter: (attrs) => dispatch(actions.SET_FILTER_ATTRS(attrs)),
		})
	)(components.Filter)
export const TypeTabs = connect(
		defaultStateMap,
		(dispatch, ownProps) => ({
			onSetTypeFilters: (attrs = {}) => dispatch(actions.SET_TYPE_FILTERS(attrs)),
			onSelectCopyLinks: () => dispatch(actions.SELECT_COPY_LINKS),
		})
	)(components.TypeTabs)
export const LinkList = connect(
		defaultStateMap,
		(dispatch, ownProps) => ({
			onChangeSel: (link) => dispatch(actions.TOGGLE_LINK(link)),
		})
	)(components.LinkList)
