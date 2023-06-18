import { fromJS } from 'immutable'

interface InterfaceAction {
  type: string
  [key: string]: any
}

interface InterfaceState {
  userInfo: any
}

const state: InterfaceState = {
  userInfo: {},
}

const reducer1 = (
  preState: InterfaceState = state,
  action: InterfaceAction
): any => {
  let newPreState = fromJS(preState)
  switch (action.type) {
    case 'change_userInfo':
      newPreState = newPreState.setIn(['userInfo'], action.userInfo)
      return newPreState.toJS()
    default:
      return newPreState.toJS()
  }
}

export default reducer1
