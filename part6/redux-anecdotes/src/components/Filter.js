import React from 'react'
import { setFilter } from "../reducers/filterReducer";
import { connect } from "react-redux";

const Filter = (props) => {

    const handleChange = (event) => {
        event.preventDefault()
        console.log(event.target.value)
        props.setFilter(event.target.value)
    }
    const style = {
        marginBottom: 10
    }

    return (
        <div style={style}>
            filter <input onChange={handleChange}/>
        </div>
    )
}

const mapDispatchToProps = dispatch => {
    return {
        setFilter: value => dispatch(setFilter(value))
    }
}

export default connect(null, mapDispatchToProps)(Filter)