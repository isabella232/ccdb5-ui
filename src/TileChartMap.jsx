import './TileChartMap.less'
import { GEO_NORM_NONE, STATE_DATA } from './constants'
import { addStateFilter } from './actions/map'
import { connect } from 'react-redux'
import { hashObject } from './utils'
import React from 'react'
import { TileMap } from 'cfpb-chart-builder'

export class TileChartMap extends React.Component {
  componentDidUpdate( prevProps ) {
    const props = this.props
    if ( !props.data[0].length ) {
      return
    }

    // force redraw when switching tabs
    if ( hashObject( prevProps ) !== hashObject( props ) ||
      !document.getElementById( 'tile-chart-map' ).children.length ) {
      this._redrawMap()
    }
  }

  render() {
    return (
      <div>
        <div id="tile-chart-map"
             className="cfpb-chart"
             data-chart-type="tile_map">
        </div>
      </div>
    )
  }

  _toggleState( event ) {
    // pass in redux dispatch
    // point.fullName
    const compProps = this
    const { abbr, fullName } = event.point
    const selectedState = {
      abbr,
      // rename this for consistency
      // chart builder uses fullName
      name: fullName
    }
    if ( !compProps.selectedState || compProps.selectedState.abbr !== abbr ) {
      compProps.mapShapeToggled( selectedState )
    }
  }

  // --------------------------------------------------------------------------
  // Event Handlers
  _redrawMap() {
    console.log( 'redrawing map' )
    const colors = [
      'rgba(247, 248, 249, 0.5)',
      'rgba(212, 231, 230, 0.5)',
      'rgba(180, 210, 209, 0.5)',
      'rgba(137, 182, 181, 0.5)',
      'rgba(86, 149, 148, 0.5)',
      'rgba(37, 116, 115, 0.5)'
    ]
    const toggleState = this._toggleState
    const componentProps = this.props

    // eslint-disable-next-line no-unused-vars
    const chart = new TileMap( {
      el: document.getElementById( 'tile-chart-map' ),
      data: updateData( this.props ),
      colors,
      localize: true,
      events: {
        // custom event handlers we can pass on
        click: toggleState.bind( componentProps )
      }
    } )
  }
}

function updateData( props ) {
  const { data, dataNormalization } = props
  const def = dataNormalization === GEO_NORM_NONE
  const res = data[0].map( o => ( {
    ...o,
    value: normalizeValue( o, def )
  } ) )

  return [ res ]
}

function normalizeValue( stateObj, def ) {
  const pop = STATE_DATA.find( o => o.abbr === stateObj.name ).population
  return def ? stateObj.value : stateObj.value / pop * 1000
}

export const getStateClass = ( statesFilter, name ) => {
  // no filters so no classes.
  if ( statesFilter.length === 0 ) {
    return ''
  }

  return statesFilter.includes( name ) ? 'selected' : 'deselected'
}

export const processStates = state => {
  const statesFilter = state.query.state || []
  const states = state.map.state
  const stateData = states.map( o => {
    o.className = getStateClass( statesFilter, o.name )
    return o
  } )
  return [ stateData ]
}

export const mapStateToProps = state => ( {
  data: processStates( state ),
  dataNormalization: state.map.dataNormalization,
  stateFilters: state.query.state,
  selectedState: state.map.selectedState
} )

export const mapDispatchToProps = dispatch => ( {
  mapShapeToggled: selectedState => {
    dispatch( addStateFilter( selectedState ) )
  }
} )


export default connect( mapStateToProps, mapDispatchToProps )( TileChartMap )

