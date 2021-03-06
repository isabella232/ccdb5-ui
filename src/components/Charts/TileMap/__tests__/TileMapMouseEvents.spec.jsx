import * as d3 from 'd3'
import * as sut from '../index'

// we put this test in a separate so we don't clobber the d3 import for bin
// calculation

jest.mock( 'd3', () => {
  const props = [
    'select', 'classed'
  ]

  const mock = {}

  for ( let i = 0; i < props.length; i++ ) {
    const propName = props[i]
    mock[propName] = jest.fn().mockImplementation( () => {
      return mock
    } )
  }

  return mock
} )

describe( 'Tile map: mouse events', () => {
  afterEach( () => {
    jest.clearAllMocks()
  } )

  it( 'handles mouseout', () => {
    sut.name = 'fooout'
    const dSpy = jest.spyOn( d3, 'select' )
    const dSpyClassed = jest.spyOn( d3, 'classed' )
    sut.mouseoutPoint()
    expect( dSpy ).toHaveBeenCalledWith( '.tile-fooout' )
    expect( dSpyClassed ).toHaveBeenCalledWith( 'hover', false )
  } )

  it( 'handles mouseover', () => {
    sut.name = 'fooover'
    const dSpy = jest.spyOn( d3, 'select' )
    const dSpyClassed = jest.spyOn( d3, 'classed' )
    sut.mouseoverPoint()
    expect( dSpy ).toHaveBeenCalledWith( '.tile-fooover' )
    expect( dSpyClassed ).toHaveBeenCalledWith( 'hover', true )
  } )
} )
