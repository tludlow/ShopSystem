import React, {Component} from "react";
import {Link} from "react-router";

export default class FourOFour extends Component {
    render() {
        return (
            <div className="FourOFour">
                <h3>There was an error finding this page.</h3>
                <Link to="/">Go back home</Link>
            </div>
        );
    }
}