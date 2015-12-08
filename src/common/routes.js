import  {Route, IndexRout, Redirect } from 'react-router'
import React from 'react';

import Main from './components/Main'

var routes = [
    <Route path="/**" component={Main}/>,

    /*
    <Route path="/tag/*" component={TagFilter}/>
    

    */

]

export default routes

//      <Route path="**" component={Entries}>
