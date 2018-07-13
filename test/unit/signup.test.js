/* global describe it expect jest */
import {run} from '@syncano/test'
import mockAxios from 'axios'

describe('signup', () => {
  const config = {MAILCHIMP_API_KEY: 'apikey-rs10'}

  it('require email', async () => {
    const args = {listId: 'xxx'}

    const result = await run('signup', {args, config})

    expect(result).toHaveProperty('code', 400)
    expect(result.data[''][0]).toMatch('Should have required property \'email\'')
  })

  it('require valid email', async () => {
    const args = {listId: 'xxx', email: 'invalid'}

    const result = await run('signup', {args, config})

    expect(result).toHaveProperty('code', 400)
    expect(result.data.email[0]).toMatch('Should match format "email"')
  })

  it('save email to members list', async () => {
    const args = {listId: 'xxx', email: 'valid@email.com'}

    mockAxios.post = jest.fn()
    mockAxios.post.mockImplementationOnce(() => Promise.resolve(200, {}))

    const result = await run('signup', {args, config})

    expect(result).toHaveProperty('code', 200)
    expect(result.data).toHaveProperty('message')
    expect(result.data.message).toMatch('You\'re now subscribed. Thanks!')
  })

  it('throws error when user already signed up', async () => {
    const email = 'valid@email.com'
    const args = {listId: 'xxx', email}

    const rejectResponse = {response: {data: {title: 'Member Exists'}}}
    mockAxios.post = jest.fn()
    mockAxios.post.mockImplementationOnce(() => Promise.reject(rejectResponse))

    const result = await run('signup', {args, config})

    expect(result).toHaveProperty('code', 400)
    expect(result.data).toHaveProperty('message')
    expect(result.data.message).toMatch(`${email} is already on the list.`)
  })

  it('throws error when mailchimp rejects given email', async () => {
    const email = 'invalid@email.com'
    const args = {listId: 'xxx', email}

    const rejectResponse = {response: {data: {title: 'Invalid Resource'}}}
    mockAxios.post = jest.fn()
    mockAxios.post.mockImplementationOnce(() => Promise.reject(rejectResponse))

    const result = await run('signup', {args, config})

    expect(result).toHaveProperty('code', 400)
    expect(result.data).toHaveProperty('message')
    expect(result.data.message).toMatch('Given email is invalid.')
  })
})
