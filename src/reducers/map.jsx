// reducer for the Map Tab
import { API_CALLED, TILE_MAP_STATES } from '../constants'
import { COMPLAINTS_FAILED, COMPLAINTS_RECEIVED } from '../actions/complaints'

export const defaultState = {
  issue: [],
  product: [],
  state: []
}

export const processAggregations = agg => {
  const total = agg.doc_count
  const chartResults = []
  for ( const k in agg ) {
    if ( agg[k].buckets ) {
      agg[k].buckets.forEach( o => {
        chartResults.push( {
          name: o.key,
          value: o.doc_count,
          pctChange: 1,
          isParent: true,
          hasChildren: false,
          pctOfSet: Math.round( o.doc_count / total * 100 )
            .toFixed( 2 ),
          width: 0.5
        } )
      } )
    }
  }
  return chartResults
}

export default ( state = defaultState, action ) => {
  switch ( action.type ) {
    case API_CALLED:
      return {
        ...state,
        activeCall: action.url,
        isLoading: true
      }

    case COMPLAINTS_RECEIVED: {
      const result = { ...state };

      // only need state
      const stateData = action.data.aggregations.state;
      // doc count = stateData.doc_count
      const total = stateData.doc_count;
      const mapObj = o => (
        {
          // RAD: 2019-10-22 for some reason britecharts isnt ellipsing the
          // text correctly
          name: o.key,
          value: o.doc_count,
          pctChange: 1,
          isParent: true,
          hasChildren: false,
          pctOfSet: Math.round( o.doc_count / total * 100 )
            .toFixed( 2 ),
          width: 0.5
        }
      );

      const states = Object.values( stateData.state.buckets )
        .filter( o => TILE_MAP_STATES.includes( o.key ) )
        .map( o => ( {
          name: o.key,
          value: o.doc_count,
          issue: 'Being broke',
          product: 'Some Product Name'
        } ) );

      const stateNames = states.map( o => o.name );

      // patch any missing data
      if ( stateNames.length > 0 ) {
        TILE_MAP_STATES.forEach( o => {
          if ( !stateNames.includes( o ) ) {
            states.push( { name: o, value: 0, issue: '', product: '' } );
          }
        } );
        result.state = states;
      }

      const issueData = action.data.aggregations.issue;
      const productData = action.data.aggregations.product;
      //result.issue = processAggregations( issueData )
      result.issue = issueData.issue.buckets.map( mapObj );
      result.product = productData.product.buckets.map( mapObj );

      return result;
    }

    case COMPLAINTS_FAILED:
      return {
        ...defaultState,
        error: action.error
      }

    default:
      return state
  }
}