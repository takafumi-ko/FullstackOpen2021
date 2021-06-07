import React from 'react'
import { setFilter } from "../reducers/filterReducer";
import { useDispatch } from "react-redux";

const Filter = () => {
    const dispatch = useDispatch()

    const handleChange = (event) => {
        event.preventDefault()
        console.log(event.target.value)
        dispatch(setFilter(event.target.value))
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

export default Filter