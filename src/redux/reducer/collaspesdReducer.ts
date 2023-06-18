import { fromJS } from 'immutable'

interface InterfaceAction {
  type: string
  [key: string]: any
}

interface InterfaceState {
  isCollapsed: boolean
}

const state: InterfaceState = {
  isCollapsed: false,
}

const collaspesdReducer = (
  preState: InterfaceState = state,
  action: InterfaceAction
): any => {
  let newPreState = fromJS(preState)
  console.log(action.type)
  switch (action.type) {
    case 'change_collasped':
      newPreState = newPreState.setIn(
        ['isCollapsed'],
        !newPreState.get('isCollapsed')
      )
      return newPreState.toJS()
    default:
      return newPreState.toJS()
  }
}

export default collaspesdReducer
