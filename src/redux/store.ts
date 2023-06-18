import {
  legacy_createStore as createStore,
  combineReducers,
  applyMiddleware,
} from 'redux'
import reduxThunk from 'redux-thunk'
import reduxPromise from 'redux-promise'
import userInfoReducer from './reducer/userInfoReducer'
import collaspesdReducer from './reducer/collaspesdReducer'
import loadingReducer from './reducer/loadingReducer'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  // 存到本地中key: 'root'的值里面
  key: 'root',
  storage,
  // 这里是黑名单，表示不会被持久化的
  blacklist: ['LoadingReducer'],
}

const reducer = combineReducers({
  userInfoReducer,
  collaspesdReducer,
  loadingReducer,
})
// 将合并后的reducer作持久化，经过persistedReducer生成store
const persistedReducer = persistReducer(persistConfig, reducer)
// persistedReducer是为store服务的reducer，再将persistedReducer生成store
const store = createStore(
  persistedReducer,
  applyMiddleware(reduxPromise, reduxThunk)
)
const persistor = persistStore(store)
export { store, persistor }
