
function App() {
    const course = {
        id: 1,
        name: 'Half Stack application development',
        parts: [
            {
                name: 'Fundamentals of React',
                exercises: 10,
                id: 1
            },
            {
                name: 'Using props to pass data',
                exercises: 7,
                id: 2
            },
            {
                name: 'State of a component',
                exercises: 14,
                id: 3
            }
        ]
    }

    return <Course course={course} />
}
const Course = (props) =>{
    console.log(props)
    return(
        <>
            <Header course={props.course.name} />
            <Content parts={props.course.parts} />
        </>
    )
}

const Header = (props) => {
    return (
        <h1>{props.course}</h1>
    )
}

const Part = (props) => {
    return (
        <p>
            {props.message.name} {props.message.exercises}
        </p>
    )
}

const Content = (props) => {
    return props.parts.map(part =>
        <Part message={part}/>
    )
}

export default App;
