import React from 'react';
import { Row, Col, Button, Form, Input, Checkbox, Tabs, Tab, } from 'muicss/react'
import { SELECT_ALL, SELECT_REVERT, SELECT_CLEAR, SET_RANGE, RANGE_ALL, RANGE_CLEAR, COPY_LINKS, REBUILD_STATE } from './actions'
import _ from 'lodash'
import { tr } from './i18n'
import Big from 'big.js'
import { sprintf } from 'sprintf'

export const MainButtons = ({ dispatch, selected, packageVersion }) => (
	<Row>
		<Col xs={3}>
			<Button size="small" color="primary" onClick={(e) => { e.preventDefault(); window.chrome.runtime.getBackgroundPage((page) =>
					page.getActiveBody((html) => dispatch(REBUILD_STATE(html)))
				) } }>{tr('refresh')}</Button>
		</Col>
		<Col xs={6} className='text-center'>
			<h4>{`${tr('extension_name')} ${packageVersion ? `v${packageVersion}` : ''}`}</h4>
		</Col>
		<Col xs={3} className='text-right'>
			<Button size="small" color="accent" onClick={(e) => { e.preventDefault(); dispatch(COPY_LINKS) } }>{`${tr('copy')} (${selected.length})`}</Button>
		</Col>
	</Row>
)

export const ToggleSelection = ({ dispatch, copyLinks, visible }) => (
	copyLinks ? null :(
	<span className='float-left padding-left-15'>
		<Button size="small" color="primary" onClick={(e) => { e.preventDefault(); dispatch(SELECT_ALL) } }>{`${tr('all')} (${visible})`}</Button>
		<Button size="small" color="danger" onClick={(e) => { e.preventDefault(); dispatch(SELECT_CLEAR) } }>{tr('clear')}</Button>
		<Button size="small" color="accent" onClick={(e) => { e.preventDefault(); dispatch(SELECT_REVERT) } }>{tr('revert')}</Button>
	</span>
))

export const RangeSelection = ({ dispatch, selectRange, copyLinks }) => {
	if (copyLinks) return null;
	return (
	<Form inline={true} className='float-right padding-right-15'>
		<span>{tr('select_range')}</span>
		<Input value={selectRange.low} className='range-text' onChange={ (e) => dispatch(SET_RANGE({low: e.target.value})) } />
		<span> - </span>
		<Input value={selectRange.high} className='range-text' onChange={ (e) => dispatch(SET_RANGE({high: e.target.value})) } style={{marginRight: 10}} />
		<Button size="small" color="primary" onClick={ (e) => { e.preventDefault(); dispatch(RANGE_ALL) } }>{tr('all')}</Button>
		<Button size="small" color="danger" onClick={ (e) => { e.preventDefault(); dispatch(RANGE_CLEAR) } }>{tr('clear')}</Button>
	</Form>
	)
}

export const Filter = ({ filters, filterResult, onToggleTypeFilter, onUpdateFilter, copyLinks }) => {
	return (
	<Row>
		<Col xs={7}>
			<Form inline={true}>
				<Checkbox label="Filter Result: " checked={filterResult.checked} onChange={(e) => onUpdateFilter({checked: e.target.checked})} />
				<Input value={filterResult.value} onChange={(e) => onUpdateFilter({value: e.target.value})} />
			</Form>
		</Col>
		<Col xs={5}>{
			copyLinks ? null : (
			<Form inline={true} className='text-right'>
			{
				filterResult.custom ? _.map(filters, (linkType, i) => (
					<Checkbox label={linkType.name} checked={linkType.checked} key={i} onChange={(e) => onToggleTypeFilter(linkType)} />
				))
				: null
			}
			</Form>
		)}
		</Col>
	</Row>
)
}

export const TypeTabs = ({ filters, links, onSetTypeFilters, onSelectCopyLinks, selected }) => (
	<Tabs justified={true}>
		<Tab label={`${tr('any')} (${_.sumBy(filters, (f) => f.count)})`} key='any' onActive={() => onSetTypeFilters({ filters, custom: true })} />
		{
			_.map(filters, (linkType, i) => (
				<Tab label={`${tr(linkType.name)} (${linkType.count})`} key={linkType.name} onActive={() => {onSetTypeFilters({ filters: [linkType] })}} />
			))
		}
		<Tab label={`${tr('copy')} (${selected.length})`} key='copy' onActive={() => {
			onSelectCopyLinks();
			setTimeout(() => {
				let $input = document.getElementById('text-copy');
				$input.focus()
				$input.select()
			}, 100);
		}}>
			<textarea id="text-copy" value={_.map(selected, (link) => link.url).join('\n')} rows={18} />
		</Tab>
	</Tabs>
)

const KB = 1024, MB = KB * 1024, GB = MB * 1024

function hfSize(size) {
	if (!size) return ''
	let s = new Big(size)
	if (s.gt(0x70000000)) {
		return `${s.div(GB).toFixed(1)} GB`
	}
	let n = size | 0
	return n < KB ? n : n < MB ? sprintf('%.1f KB', n / KB) : n < GB ? sprintf('%.1f MB', n / MB) : sprintf('%.1f GB', n / GB)
}

export const LinkItem = ({ checked = false, index, titles, url, size, decoded, onChangeSel }) => (
	<Row className='link-row' title={url}>
		<Col xs={2}>
			<Checkbox checked={checked} onChange={onChangeSel} label={index.toString()} />
		</Col>
		<Col xs={size ? 8 : 9}>
			<a href={url} title={decoded || url}>{_.map(titles, (title, i) => (<div key={i}>{title}</div>))}</a>
		</Col>
		{
			size ?
			<Col xs={2}>{hfSize(size)}</Col>
			: null
		}
	</Row>
)

export const LinkList = ({ links, onChangeSel, copyLinks }) => (
	copyLinks ? null :
	(
	<div className="link-list-wrap">
		<div className="link-list">
		{
		_.map(_.filter(links, (link) => link.visible), (link) => (<LinkItem {...link} key={`${link.index}`} onChangeSel={() => onChangeSel(link)} />))
		}
		</div>
	</div>
	)
)

const components = {
	MainButtons, ToggleSelection, RangeSelection, Filter, TypeTabs, LinkList
}

export default components
