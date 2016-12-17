import React from 'react';
import { Row, Col, Button, Form, Input, Checkbox, Tabs, Tab, } from 'muicss/react'
import { SELECT_ALL, SELECT_REVERT, SELECT_CLEAR, SET_RANGE, RANGE_ALL, RANGE_CLEAR, COPY_LINKS, REBUILD_STATE } from './actions'
import _ from 'lodash'

export const MainButtons = ({ dispatch }) => (
	<Row>
		<Col xs={3}>
			<Button size="small" color="primary" onClick={(e) => { e.preventDefault(); window.chrome.extension.getBackgroundPage().getActiveBody((html) => dispatch(REBUILD_STATE(html))) } }>Refresh</Button>
		</Col>
		<Col xs={6} className='text-center'>
			<h4>Link Detector</h4>
		</Col>
		<Col xs={3} className='text-right'>
			<Button size="small" color="accent" onClick={(e) => { e.preventDefault(); dispatch(COPY_LINKS) } }>Copy</Button>
		</Col>
	</Row>
)

export const ToggleSelection = ({ dispatch, copyLinks }) => (
	copyLinks ? null :(
	<span className='float-left padding-left-15'>
		<Button size="small" color="primary" onClick={(e) => { e.preventDefault(); dispatch(SELECT_ALL) } }>All</Button>
		<Button size="small" color="danger" onClick={(e) => { e.preventDefault(); dispatch(SELECT_CLEAR) } }>Clear</Button>
		<Button size="small" color="accent" onClick={(e) => { e.preventDefault(); dispatch(SELECT_REVERT) } }>Revert</Button>
	</span>
))

export const RangeSelection = ({ dispatch, selectRange, copyLinks }) => {
	if (copyLinks) return null;
	return (
	<Form inline={true} className='float-right padding-right-15'>
		<span>Select Range:</span>
		<Input value={selectRange.low} className='range-text' onChange={ (e) => dispatch(SET_RANGE({low: e.target.value})) } />
		<span> - </span>
		<Input value={selectRange.high} className='range-text' onChange={ (e) => dispatch(SET_RANGE({high: e.target.value})) } style={{marginRight: 10}} />
		<Button size="small" color="primary" onClick={ (e) => { e.preventDefault(); dispatch(RANGE_ALL) } }>All</Button>
		<Button size="small" color="danger" onClick={ (e) => { e.preventDefault(); dispatch(RANGE_CLEAR) } }>Clear</Button>
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

export const TypeTabs = ({ filters, links, onSetTypeFilters, onSelectCopyLinks }) => (
	<Tabs justified={true}>
	{
		_.concat([
				<Tab label="Any" key='any' onActive={() => onSetTypeFilters({ filters, custom: true })} />
			],
			_.map(filters, (linkType, i) => (
				<Tab label={linkType.name} key={linkType.name} onActive={() => {onSetTypeFilters({ filters: [linkType] })}} />
			)),
			[
				<Tab label="Copy" key='copy' onActive={() => {
					onSelectCopyLinks();
					setTimeout(() => {
						let $input = document.getElementById('text-copy');
						$input.focus()
						$input.select()
					}, 100);
				}}>
					<textarea id="text-copy" value={_.map(_.filter(links, (link) => link.checked && link.visible), (link) => link.url).join('\n')} rows={18} />
				</Tab>
			]
		)
	}
	</Tabs>
)

export const LinkItem = ({ checked = false, index, titles, url, size, decoded, onChangeSel }) => (
	<Row className='link-row' title={url}>
		<Col xs={2}>
			<Checkbox checked={checked} onChange={onChangeSel} label={index.toString()} />
		</Col>
		<Col xs={size ? 8 : 9}>
			<a href={url} title={decoded || url}>{titles.join(' ')}</a>
		</Col>
		{
			size ?
			<Col xs={2}>{size > (1024*1024) ? `${Math.floor(size / (1024*1024))} MB` : `${Math.floor(size / 1024)} KB`}</Col>
			: null
		}
	</Row>
)

export const LinkList = ({ links, onChangeSel, copyLinks }) => (
	copyLinks ? null :
	(
	<div>
		<div className="link-list">
		{
		_.map(_.filter(links, (link) => link.visible), (link) => (<LinkItem {...link} key={`${link.index}`} onChangeSel={() => onChangeSel(link)} />))
		}
		</div>
        <hr />
	</div>
	)
)

const components = {
	MainButtons, ToggleSelection, RangeSelection, Filter, TypeTabs, LinkList
}

export default components
