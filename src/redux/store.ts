import {
  legacy_createStore as createStore,
  combineReducers,
  applyMiddleware,
} from 'redux'
import reduxThunk from 'redux-thunk'
import reduxPromise from 'redux-promise'
import reducer1 from './reducer/reducer1'

const reducer = combineReducers({
  reducer1,
})

const store = createStore(reducer, applyMiddleware(reduxPromise, reduxThunk))

export default store
