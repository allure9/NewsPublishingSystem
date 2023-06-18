import { fromJS } from 'immutable'

interface InterfaceAction {
  type: string
  [key: string]: any
}

interface InterfaceState {
  isLoading: boolean
}

const state: InterfaceState = {
  isLoading: false,
}

const loadingReducer = (
  preState: InterfaceState = state,
  action: InterfaceAction
): any => {
  let newPreState = fromJS(preState)
  console.log(action.type)
  switch (action.type) {
    case 'change_isLoading':
      newPreState = newPreState.setIn(['isLoading'], action.payLoad)
      return newPreState.toJS()
    default:
      return newPreState.toJS()
  }
}

export default loadingReducer
