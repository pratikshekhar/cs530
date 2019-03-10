import React, { Component } from 'react';
import './App.css';
import Form from './Components/Form';
import apiKey from './Constant.js';

import { Link } from "react-router-dom";

class App extends Component {

  state = {
    cravings: []
  }

  getCravings = async (e) => {
    const recipeName = e.target.elements.recipeName.value;
    e.preventDefault();
    const apiCall = await fetch(`https://www.food2fork.com/api/search?key=${apiKey}&q=${recipeName}&count=5`);
    const data = await apiCall.json();
    this.setState({cravings: data.recipes});
    console.log(this.state.cravings);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
            <h1 className="App-title">Happiness is Home Made Food</h1>
            <Form  getCravings={this.getCravings} />
            <div className = "container">
                <div className = "row">
                     {this.state.cravings.map((recipe)=>{
                        return (
                            <div key={recipe.title} className="col-md-4" style = {{marginBottom:"2rem"}}>
                                <div className="craving__box">
                                    <img className="craving__box-img" src={recipe.image_url} alt={recipe.title} />
                                    <div className="craving__text">
                                        <h5 className="craving__title">
                                        { recipe.title.length < 20 ? `${recipe.title}`: `${recipe.title.substring(0,20)}...`}
                                        </h5>
                                    </div>
                                    <button className="craving__buttons">
                                    <Link to={{pathname: `/recipe/${recipe.recipe_id}`}}>View Recipe</Link>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </header>
      </div>
    );
  }
}

export default App;
