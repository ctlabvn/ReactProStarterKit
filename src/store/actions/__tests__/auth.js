import * as actions from '~/store/actions/auth'

describe('actions auth', () => {
  it('should set new auth state to true', () => {
    const logged = true
    const expectedAction = {
      type: 'app/setAuthState',
      payload:logged,
    }
    expect(actions.setAuthState(logged)).toEqual(expectedAction)
  })
})