import React, { useState, useEffect, PureComponent } from 'react';
import './SearchBar.css'
export default class SearchBar extends PureComponent{
    
    constructor(props){
        super(props);
        this.state = {
            inputValue:''
        }
    }    
    handleInput = ()=>{
        this.props.onSearch(this.state.inputValue)
    }
    updateInput = (event) =>{
        this.setState({inputValue: event.target.value})
    }
    render(){
        return(
            <div className="Header">
                <div className="Logo">
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="green" className="bi bi-tree" viewBox="0 0 16 16">
                        <path d="M8.416.223a.5.5 0 0 0-.832 0l-3 4.5A.5.5 0 0 0 5 5.5h.098L3.076 8.735A.5.5 0 0 0 3.5 9.5h.191l-1.638 3.276a.5.5 0 0 0 .447.724H7V16h2v-2.5h4.5a.5.5 0 0 0 .447-.724L12.31 9.5h.191a.5.5 0 0 0 .424-.765L10.902 5.5H11a.5.5 0 0 0 .416-.777l-3-4.5zM6.437 4.758A.5.5 0 0 0 6 4.5h-.066L8 1.401 10.066 4.5H10a.5.5 0 0 0-.424.765L11.598 8.5H11.5a.5.5 0 0 0-.447.724L12.69 12.5H3.309l1.638-3.276A.5.5 0 0 0 4.5 8.5h-.098l2.022-3.235a.5.5 0 0 0 .013-.507z"/>
                    </svg>
                </div>
                <div className="AppName">
                    <span className="BoldAppName">AllTrails</span> at Lunch
                </div>
                <div className="SearchBar">
                    <input className="field"
                    value={this.state.inputValue}
                    onChange={this.updateInput} 
                    ></input>
                    <button
                    onClick={this.handleInput}
                    >
                    </button>
                </div>
            </div>
            
        )
    }
    

}