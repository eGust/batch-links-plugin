import React from 'react';
import { MainButtons, ToggleSelection, RangeSelection, Filter, LinkList, TypeTabs } from './containers';
import { Row, Panel } from 'muicss/react'

const App = () =>(
    <Panel>
      <MainButtons />
      <Filter />
      <TypeTabs />
      <LinkList />
      <Row>
        <ToggleSelection />
        <RangeSelection />
      </Row>
    </Panel>
  )

export default App;
