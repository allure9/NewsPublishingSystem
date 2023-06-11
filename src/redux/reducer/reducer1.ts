import { fromJS } from 'immutable'

interface InterfaceAction {
  type: string
  [key: string]: any
}

interface InterfaceState {
  num: number
}

const state: InterfaceState = {
  num: 0,
}

const reducer1 = (
  preState: InterfaceState = state,
  action: InterfaceAction
): any => {
  let newPreState = fromJS(preState)
  switch (action.type) {
    case '1':
      newPreState = newPreState.setIn(['num'], 1)
      return newPreState.toJS()
    default:
      break
  }
  return newPreState.toJS()
}

export default reducer1
