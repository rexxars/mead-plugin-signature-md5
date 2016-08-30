/* eslint-disable no-console */
const Boom = require('boom')
const client = require('mead-client')

module.exports = {
  name: 'md5-signature',
  type: 'middleware',
  handler: md5Signer
}

function md5Signer(req, res, next) {
  const conf = res.locals
  const sourceConfig = conf.source.config || {}
  const adapterRequiresSignedUrls = conf.sourceAdapter.requiresSignedUrls
  const token = sourceConfig.secureUrlToken

  if (adapterRequiresSignedUrls && !token) {
    return next(Boom.badImplementation(
      `Source "${conf.source.name}" has an adapter that requires signed URLs,`
      + 'but no "secureUrlToken" was provided in config'
    ))
  }

  if (!token) {
    return next()
  }

  const path = req.url.replace(/([?&])s=.*?($|&)/, (match, start, end) => {
    return (end && (start === '?' ? '?' : '&')) || ''
  })

  const providedSignature = req.query.s || '' // eslint-disable-line id-length
  const expectedSignature = client.signQuery(token, path)
  if (providedSignature !== expectedSignature) {
    return next(Boom.unauthorized('URI signature match failed'))
  }

  return next()
}
