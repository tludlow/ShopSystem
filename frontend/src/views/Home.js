import React, {Component} from 'react';

export default class Home extends Component {

	constructor(props) {
		super();
		this.state = {meow: "testing internal component state"};
	}

	render() {
		return (
            <div>
                <h2>{this.state.meow}</h2>
            </div>
        );
    }
}
