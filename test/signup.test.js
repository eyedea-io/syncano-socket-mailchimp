import {assert} from 'chai'
import {describe, it} from 'mocha'
import {run} from '@syncano/test'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import {getMailchimpUrl} from '../src/utils'

const axiosMock = new MockAdapter(axios)

describe('signup', () => {
  const config = {MAILCHIMP_API_KEY: 'apikey-rs10'}

  it('require email', async () => {
    const fakeResponse = new Error('Email is required.')
    const args = {listId: 'xxx'}
    const result = await run('signup', {args})

    assert.propertyVal(result, 'code', 400)
    assert.deepPropertyVal(result, 'data', {message: fakeResponse.message})
  })
  it('require valid email', async () => {
    const fakeResponse = new Error('Invalid email.')
    const args = {listId: 'xxx', email: 'invalid@email'}
    const result = await run('signup', {args, config})

    assert.propertyVal(result, 'code', 400)
    assert.deepPropertyVal(result, 'data', {message: fakeResponse.message})
  })
  it('save email to members list', async () => {
    const args = {listId: 'xxx', email: 'valid@email.com'}
    const endpoint = getMailchimpUrl('apikey-rs10', 'xxx')

    axiosMock.onPost(endpoint, {
      email_address: 'valid@email.com',
      status: 'pending'
    }).reply(200, {})

    const result = await run('signup', {args, config})

    assert.propertyVal(result, 'code', 200)
    assert.deepPropertyVal(result, 'data', {message: `You're now subscribed. Thanks!`})
  })
  it('throws error when user already signed up', async () => {
    const email = 'valid@email.com'
    const args = {listId: 'xxx', email}
    const endpoint = getMailchimpUrl('apikey-rs10', 'xxx')

    axiosMock.onPost(endpoint, {
      email_address: email,
      status: 'pending'
    }).reply(400, {title: 'Member Exists'})

    const result = await run('signup', {args, config})

    assert.propertyVal(result, 'code', 400)
    assert.deepPropertyVal(result, 'data', {message: `${email} is already on the list.`})
  })
  it('throws error when mailchimp rejects given email', async () => {
    const email = 'invalid@email.com'
    const args = {listId: 'xxx', email}
    const endpoint = getMailchimpUrl('apikey-rs10', 'xxx')

    axiosMock.onPost(endpoint, {
      email_address: email,
      status: 'pending'
    }).reply(400, {title: 'Invalid Resource'})

    const result = await run('signup', {args, config})

    assert.propertyVal(result, 'code', 400)
    assert.deepPropertyVal(result, 'data', {message: `Given email is invalid.`})
  })
})
