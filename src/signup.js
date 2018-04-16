import Syncano from '@syncano/core'
import axios from 'axios'
import { getMailchimpUrl } from './utils'

export default async ctx => {
  const {response, logger} = new Syncano(ctx)
  const {info, warn} = logger('user-profile:get')
  const {MAILCHIMP_API_KEY} = ctx.config
  const {listId, email} = ctx.args

  try {
    if (!listId) {
      throw new Error('Invalid listId parameter.')
    }
    if (!email) {
      throw new Error('Email is required.')
    }
    if (!isEmail(email)) {
      throw new Error('Invalid email.')
    }
  } catch ({message}) {
    warn(message)
    return response.json({message}, 400)
  }

  const endpoint = getMailchimpUrl(MAILCHIMP_API_KEY, listId)

  try {
    await axios(endpoint, {
      method: 'post',
      data: {
        email_address: email,
        status: 'pending'
      },
      headers: {
        authorization: `apikey ${MAILCHIMP_API_KEY}`
      }
    })
    info(`Subscribed ${email} to list ${listId}`)
    response.json({
      message: `You're now subscribed. Thanks!`
    })
  } catch (err) {
    const message = {
      'Invalid Resource': 'Given email is invalid.',
      'Member Exists': `${ctx.args.email} is already on the list.`
    }[err.response.data.title] || 'Unexpected error.'
    warn(message)
    response.json({message}, 400)
  }
}

export function isEmail (str) {
  // eslint-disable-next-line
  const regex = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i

  return regex.test(str)
}
