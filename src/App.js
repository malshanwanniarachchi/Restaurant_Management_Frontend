import React, { Component } from 'react'
import {BrowserRouter, Route} from "react-router-dom";
import RestaurantList from './component/ReataurantManagement/RestaurantList';

export default class App extends Component {
  render() {
    return (
      <div>
        <BrowserRouter>
        
       <Route path="/" exact component={RestaurantList}></Route>
       
       
   </BrowserRouter>

   
      </div>
    )
  }
}



