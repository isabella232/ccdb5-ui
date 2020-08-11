import * as sut from '../compare'

// ----------------------------------------------------------------------------
// Tests
describe( 'arrayEquals', () => {
  it( 'compares different length arrays', () => {
    const res = sut.arrayEquals( [], [ 1, 2 ] )
    expect( res ).toBeFalsy()
  } )

  it( 'compares equal arrays', () => {
    const res = sut.arrayEquals( [ 1, 2 ], [ 1, 2 ] )
    expect( res ).toBeTruthy()
  } )

  it( 'compares arrays with different values', () => {
    const res = sut.arrayEquals( [ 2, 2 ], [ 1, 2 ] )
    expect( res ).toBeFalsy()
  } )
} )
