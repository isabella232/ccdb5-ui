import target, {
  defaultState
} from '../trends'
import actions from '../../actions'
import {
  trendsFocusAggs,
  trendsFocusAggsResults
} from '../__fixtures__/trendsFocusAggs'
import {
  trendsLensIssueResults,
  trendsResults
} from '../__fixtures__/trendsResults'
import trendsAggs from '../__fixtures__/trendsAggs'
import trendsAggsDupes from '../__fixtures__/trendsAggsDupes'
import trendsAggsDupeResults from '../__fixtures__/trendsAggsDupeResults'
import trendsAggsMissingBuckets from '../__fixtures__/trendsAggsMissingBuckets'
import trendsAggsMissingBucketsResults
  from '../__fixtures__/trendsAggsMissingBucketsResults'

describe( 'reducer:trends', () => {
  let action, result

  describe( 'reducer', () => {
    it( 'has a default state', () => {
      expect( target( undefined, {} ) ).toEqual( {
        activeCall: '',
        chartType: 'line',
        colorMap: {},
        error: false,
        expandedTrends: [],
        filterNames: [],
        focus: '',
        isLoading: false,
        lastDate: false,
        lens: 'Overview',
        results: {
          dateRangeArea: [],
          dateRangeLine: [],
          dateRangeBrush: [],
          issue: [],
          product: []
        },
        subLens: '',
        tooltip: false,
        total: 0
      } )
    } )
  } )

  describe( 'CHART_TYPE_CHANGED action', () => {
    it( 'changes the chart type', () => {
      action = {
        type: actions.CHART_TYPE_CHANGED,
        chartType: 'FooBar'
      }

      expect( target( { tooltip: true }, action ) ).toEqual( {
        chartType: 'FooBar',
        tooltip: false
      } )
    } )
  } )

  describe( 'DATA_LENS_CHANGED action', () => {
    it( 'updates the data lens overview', () => {
      action = {
        type: actions.DATA_LENS_CHANGED,
        lens: 'Overview'
      }

      expect( target( { focus: 'gg', tooltip: 'foo' }, action ) ).toEqual( {
        chartType: 'line',
        focus: '',
        lens: 'Overview',
        subLens: '',
        tooltip: false
      } )
    } )

    it( 'updates the data lens', () => {
      action = {
        type: actions.DATA_LENS_CHANGED,
        lens: 'Foo'
      }

      expect( target( { focus: 'gg', tooltip: 'foo' }, action ) ).toEqual( {
        focus: '',
        lens: 'Foo',
        subLens: 'sub_foo',
        tooltip: false
      } )
    } )
  } )

  describe( 'DATA_SUBLENS_CHANGED action', () => {
    it( 'updates the data sublens', () => {
      action = {
        type: actions.DATA_SUBLENS_CHANGED,
        subLens: 'sub_something'
      }

      expect( target( { subLens: 'gg' }, action ) ).toEqual( {
        subLens: 'sub_something'
      } )
    } )
  } )

  describe( 'FOCUS_CHANGED action', () => {
    it( 'updates the FOCUS and clears the tooltip', () => {
      action = {
        type: actions.FOCUS_CHANGED,
        focus: 'Some Rando Text'
      }

      expect( target( {
        focus: 'gg',
        tooltip: { wut: 'isthis' }
      }, action ) ).toEqual( {
        focus: 'Some Rando Text',
        tooltip: false
      } )
    } )
  } )

  describe( 'FILTER_ALL_REMOVED action', () => {
    it( 'resets the FOCUS', () => {
      action = {
        type: actions.FILTER_ALL_REMOVED
      }

      expect( target( { focus: 'gg', }, action ) )
        .toEqual( { focus: '' } )
    } )
  } )

  describe( 'TAB_CHANGED action', () => {
    it( 'handles trends tabs', () => {
      action = {
        type: actions.TAB_CHANGED,
        tab: 'Trends'
      }

      expect( target( { results: [ 1, 2, 3 ] }, action ) ).toEqual( {
        results: [ 1, 2, 3 ]
      } )
    } )

    it( 'clears results when its Other tabs', () => {
      action = {
        type: actions.TAB_CHANGED,
        tab: 'Foo'
      }

      expect( target( { results: [ 1, 2, 3 ] }, action ) ).toEqual( {
        results: {
          dateRangeArea: [],
          dateRangeBrush: [],
          dateRangeLine: [],
          issue: [],
          product: []
        }
      } )
    } )

  } )

  describe( 'TRENDS_API_CALLED actions', () => {
    action = {
      type: actions.TRENDS_API_CALLED,
      url: 'http://www.example.org'
    }
    expect( target( {}, action ) ).toEqual( {
      activeCall: 'http://www.example.org',
      isLoading: true
    } )
  } )

  describe( 'TRENDS_FAILED actions', () => {
    it( 'handles failed error messages', () => {
      action = {
        type: actions.TRENDS_FAILED,
        error: { message: 'foo bar', name: 'ErrorTypeName' }
      }
      expect( target( {
        activeCall: 'someurl',
        results: {
          dateRangeArea: [ 1, 2, 3 ],
          dateRangeBrush: [ 4, 5, 6 ],
          dateRangeLine: [ 7, 8, 9 ],
          issue: [ 10, 11, 12 ],
          product: [ 13, 25 ]
        }
      }, action ) ).toEqual( {
        activeCall: '',
        error: { message: 'foo bar', name: 'ErrorTypeName' },
        isLoading: false,
        results: {
          dateRangeArea: [],
          dateRangeBrush: [],
          dateRangeLine: [],
          issue: [],
          product: []
        }
      } )
    } )
  } )

  describe( 'TRENDS_RECEIVED actions', () => {
    let state
    beforeEach( () => {
      action = {
        type: actions.TRENDS_RECEIVED,
        data: {
          aggregations: trendsAggs
        }
      }
      state = Object.assign( {}, defaultState )
    } )

    it( 'maps data to object state - Overview', () => {
      result = target( state, action )
      expect( result ).toEqual( trendsResults )
    } )

    it( 'maps data to object state - Issue Lens', () => {
      state.lens = 'Issue'
      result = target( state, action )
      expect( result ).toEqual( trendsLensIssueResults )
    } )

    it( 'maps data to object state - dupe rows', () => {
      action.data.aggregations = trendsAggsDupes
      result = target( state, action )
      expect( result ).toEqual( trendsAggsDupeResults )
    } )

    it( 'maps data to object state - Missing Bucket', () => {
      state.lens = 'Product'
      action.data.aggregations = trendsAggsMissingBuckets
      result = target( state, action )
      expect( result ).toEqual( trendsAggsMissingBucketsResults )
    } )

    it( 'maps data to object state - Focus', () => {
      state.lens = 'Issue'
      state.subLens = 'sub_issue'
      state.focus = 'Incorrect information on your report'
      action.data.aggregations = trendsFocusAggs
      result = target( state, action )
      expect( result ).toEqual( trendsFocusAggsResults )
    } )

  } )

  describe( 'TREND_TOGGLED', () => {
    let state, action
    beforeEach( () => {
      state = {
        expandedTrends: [ 'bar' ],
        filterNames: [ 'bar', 'foo' ],
        results: {
          issue: [
            { name: 'bar', visible: true },
            { name: 'bar1', visible: true, parent: 'bar' },
            { name: 'bar2', visible: true, parent: 'bar' },
            { name: 'foo', visible: true },
            { name: 'foo1', visible: false, parent: 'foo' },
            { name: 'foo2', visible: false, parent: 'foo' }
          ]
        }
      }

    } )

    it( 'makes bars visible', () => {
      action = { type: actions.TREND_TOGGLED, value: 'foo' }
      expect( target( state, action ) ).toEqual( {
        expandedTrends: [ 'bar', 'foo' ],
        filterNames: [ 'bar', 'foo' ],
        results: {
          issue: [
            { name: 'bar', visible: true },
            { name: 'bar1', visible: true, parent: 'bar' },
            { name: 'bar2', visible: true, parent: 'bar' },
            { name: 'foo', visible: true },
            { name: 'foo1', visible: true, parent: 'foo' },
            { name: 'foo2', visible: true, parent: 'foo' }
          ]
        }
      } )
    } )

    it( 'hides bars', () => {
      action = { type: actions.TREND_TOGGLED, value: 'bar' }
      expect( target( state, action ) ).toEqual( {
        expandedTrends: [],
        filterNames: [ 'bar', 'foo' ],
        results: {
          issue: [
            { name: 'bar', visible: true },
            { name: 'bar1', visible: false, parent: 'bar' },
            { name: 'bar2', visible: false, parent: 'bar' },
            { name: 'foo', visible: true },
            { name: 'foo1', visible: false, parent: 'foo' },
            { name: 'foo2', visible: false, parent: 'foo' }
          ]
        }
      } )
    } )

    it( 'ignores bogus values not in filterNames', () => {
      action = { type: actions.TREND_TOGGLED, value: 'haha' }
      expect( target( state, action ) ).toEqual( {
        expandedTrends: [ 'bar' ],
        filterNames: [ 'bar', 'foo' ],
        results: {
          issue: [
            { name: 'bar', visible: true },
            { name: 'bar1', visible: true, parent: 'bar' },
            { name: 'bar2', visible: true, parent: 'bar' },
            { name: 'foo', visible: true },
            { name: 'foo1', visible: false, parent: 'foo' },
            { name: 'foo2', visible: false, parent: 'foo' }
          ]
        }
      } )
    } )
  } )

  describe( 'TRENDS_TOOLTIP_CHANGED', () => {
    it( 'handles no value', () => {
      const action = { type: actions.TRENDS_TOOLTIP_CHANGED }
      const state = { results: {} }
      const res = target( state, action )

      expect( res.tooltip ).toBeFalsy()
    } )

    it( 'calculates total and sets the title', () => {
      const action = {
        type: actions.TRENDS_TOOLTIP_CHANGED,
        value: {
          interval: 'Month',
          key: '2018-04-01T00:00:00.000Z',
          date: '2018-04-01T00:00:00.000Z',
          dateRange: {
            from: '2011-07-21',
            to: '2018-11-30'
          },
          values: [
            {
              name: 'Alpha',
              value: 17,
              date: '2018-04-01T00:00:00.000Z'
            },
            {
              name: 'Beta',
              value: 28,
              date: '2018-04-01T00:00:00.000Z'
            },
            {
              name: 'Cooo',
              value: 8,
              date: '2018-04-01T00:00:00.000Z'
            }
          ]
        }
      }
      const state = {
        colorMap: {
          Alpha: '#2cb34a',
          Beta: '#addc91',
          Cooo: '#257675'
        }
      }
      const res = target( state, action )

      expect( res.tooltip ).toEqual( {
        date: '2018-04-01T00:00:00.000Z',
        dateRange: {
          from: '2011-07-21',
          to: '2018-11-30'
        },
        interval: 'Month',
        key: '2018-04-01T00:00:00.000Z',
        title: 'Date Interval: 04/01/2018 - 04/30/2018',
        total: 53,
        values: [
          {
            colorIndex: 0,
            date: '2018-04-01T00:00:00.000Z',
            name: 'Alpha',
            value: 17
          },
          {
            colorIndex: 1,
            date: '2018-04-01T00:00:00.000Z',
            name: 'Beta',
            value: 28
          },
          {
            colorIndex: 2,
            date: '2018-04-01T00:00:00.000Z',
            name: 'Cooo',
            value: 8
          }
        ]
      } )
    } )
  } )


  describe( 'URL_CHANGED actions', () => {
    let action
    let state
    beforeEach( () => {
      action = {
        type: actions.URL_CHANGED,
        params: {}
      }

      state = { ...defaultState }
    } )

    it( 'handles empty params', () => {
      expect( target( state, action ) ).toEqual( state )
    } )

    it( 'handles lens params', () => {
      action.params = { lens: 'hello', subLens: 'mom', nope: 'hi' }

      const actual = target( state, action )
      expect( actual.lens ).toEqual( 'hello' )
      expect( actual.subLens ).toEqual( 'mom' )
      expect( actual.nope ).toBeFalsy()
    } )
  } )
} )
