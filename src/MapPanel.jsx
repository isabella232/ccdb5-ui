import './MapPanel.less'
import ActionBar from './ActionBar'
import { connect } from 'react-redux'
import DateIntervals from './DateIntervals'
import ErrorBlock from './Error'
import { hasFiltersEnabled } from './utils'
import Loading from './Dialogs/Loading'
import MapToolbar from './MapToolbar'
import PerCapita from './PerCapita'
import React from 'react'
import RowChart from './RowChart'
import TileChartMap from './TileChartMap'
import Warning from './Warning'

const WARNING_MESSAGE = 'Due to your filter selections, the "Complaints per ' +
  '1,000" option has been disabled'

export class MapPanel extends React.Component {
  render() {
    return (
      <section className="map-panel">
        <ActionBar/>
        { this.props.error &&
          <ErrorBlock text="There was a problem executing your search" />
        }
        { this.props.showWarning && <Warning text={ WARNING_MESSAGE } /> }
        <div className="layout-row refine">
          <DateIntervals/>
          <PerCapita/>
        </div>
        <TileChartMap/>
        <MapToolbar/>
        <RowChart aggtype="product" />
        <RowChart aggtype="issue" />
        <Loading isLoading={ this.props.isLoading || false }/>
      </section>
    )
  }
}

const mapStateToProps = state => ( {
  error: state.map.error,
  isLoading: state.map.isLoading,
  showWarning: hasFiltersEnabled( state.query )
} )

export default connect( mapStateToProps )( MapPanel )
