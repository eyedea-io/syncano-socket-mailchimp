export function getMailchimpUrl (apiKey, listId) {
  const region = apiKey.split('-').pop()

  return `https://${region}.api.mailchimp.com/3.0/lists/${listId}/members`
}
