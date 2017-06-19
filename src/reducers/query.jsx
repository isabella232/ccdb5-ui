import { SEARCH_TEXT } from '../constants'
export const defaultQuery = {
  searchText: '',
  from: 0,
  size: 10
}

export default (state = defaultQuery, action) => {
  switch(action.type) {
  case SEARCH_TEXT:
    return {
      ...state,
      searchText: action.searchText,
      from: 0
    }

  default:
    return state
  }
}
