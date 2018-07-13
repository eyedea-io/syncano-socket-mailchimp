import Syncano from '@syncano/core'
import Validator from '@syncano/validate'
import axios from 'axios'
import { getMailchimpUrl } from './utils'

export default async ctx => {
  const {response, logger} = new Syncano(ctx)
  const validator = new Validator(ctx)
  const {info, warn} = logger('user-profile:get')
  const {MAILCHIMP_API_KEY} = ctx.config
  const {listId, email} = ctx.args

  try {
    await validator.validateRequest()
  } catch (err) {
    return response.json(err.messages, 400)
  }

  const endpoint = getMailchimpUrl(MAILCHIMP_API_KEY, listId)

  try {
    await axios.post(endpoint, {
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
