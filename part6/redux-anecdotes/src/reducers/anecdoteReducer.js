import anecdoteService from "../services/anecdoteService";

const anecdotesAtStart = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
    return {
        content: anecdote,
        id: getId(),
        votes: 0
    }
}

const initialState = anecdotesAtStart.map(asObject)

const anecdoteReducer = (state = initialState, action) => {
    console.log('state now: ', state)
    console.log('action', action)
    switch (action.type) {
        case'VOTE':
            return state.map(anecdote => anecdote.id !== action.data.anecdote.id ? anecdote : action.data.anecdote)
        case 'NEW_ANECDOTE':
            return state.concat(action.data.anecdote)
        case 'INIT':
            return action.data.anecdotes
        default:
            return state
    }
}
export const initializeAnecdotes = () => {
    return async dispatch => {
        const anecdotes = await anecdoteService.getAll()
        dispatch({
            type: 'INIT',
            data: { anecdotes }
        })
    }
}

export const createAnecdote = (content) => {
    return async dispatch => {
        const anecdote = await anecdoteService.createAnecdote(content)
        dispatch({
            type: 'NEW_ANECDOTE',
            data: { anecdote }
        })
    }
}

export const incrementVote = (id) => {
    return async dispatch => {
        const anecdote = await anecdoteService.voteAnecdote(id)
        dispatch({
            type: "VOTE",
            data: { anecdote }
        })
    }
}

export default anecdoteReducer