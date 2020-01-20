import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Landing from './Landing';
import MyChart from './MyChart';
import Table from './Table';
import Map from './Map';

const Root = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Landing} />
      {/* <Route exact path="/chart" component={MyChart} />
      <Route exact path="/table" component={Table} />
      <Route exact path="/map" component={Map} /> */}
    </Switch>
  </BrowserRouter>
);

export default Root;
