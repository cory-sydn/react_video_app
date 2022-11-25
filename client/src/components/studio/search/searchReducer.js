import { ACTION_TYPES } from "./searchActionTypes";

export const INITIAL_STATE = {
  search: [],
  rawSearch: "",
  searchFor: "",
  searchFrom: "",
  openOptions: false,
  chips: [],
  warnning: "",
};

export const searchReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.CLICK_SEARCH:
      return {
        ...state,
        openOptions: true,
      };
    case ACTION_TYPES.ON_WRITING:
      return {
        ...state,
        rawSearch: action.payload,
        openOptions: false,
        searchFor: action.payload,
        warnning: "",
      };
    case ACTION_TYPES.ADD_SEARCH_CHIP:
      if (state.search.includes(state.rawSearch)) return {
        ...state,
        warnning : "Please enter a different parameter!"
      }
      if (action.payload) {
        return {
          ...state,
          search: [...state.search, state.rawSearch],
          chips: [...state.chips, `${action.payload} contains: '${state.rawSearch}'`],
          searchFor: "",
          rawSearch: ""
        };
      }
      return {
        ...state,
       search: [...state.search, state.rawSearch.toLocaleLowerCase()],
       chips: [...state.chips, state.rawSearch],
       rawSearch: "",
       searchFor: "",
      };
    case ACTION_TYPES.ENTER_SEARCH:
      if (state.search.includes(action.payload)) return {
        ...state,
        warnning : "Please enter a different parameter!"
      }
      if (state.searchFrom) {
        return {
          ...state,
          search: [...state.search, action.payload],
          chips: [...state.chips, `${state.searchFrom} contains: '${action.payload}'`],
          searchFrom: "",
        };
      }
      return {
        search: [...state.search, action.payload],
        chips: [...state.chips, action.payload],
        rawSearch: "",
        searchFor: "",
        openOptions: false,
      };  
    case ACTION_TYPES.REMOVE_SEARCH_CHIP:
      return {
        ...state,
        search: state.search.filter((param) => param !== state.search.at(action.payload)),
        chips: state.chips.filter((chip) => chip !== state.chips.at(action.payload)),
      };
    case ACTION_TYPES.CHOOSE_SEARCH_FROM:
      return {
        ...state,
        searchFrom: action.payload,
      };
    case ACTION_TYPES.CLICK_OUTSIDE:
      return {
        ...state,
        searchFor: "",
        warnning: "",
        openOptions: false,
      };
    case ACTION_TYPES.CLOSE_FLOATING_INPUT:
      return {
        ...state,
        searchFrom: "",
      };
    default:
      return state;
  }
};