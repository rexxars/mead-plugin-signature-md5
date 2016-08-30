/* eslint-disable id-length */
const test = require('tape')
const plugin = require('..')
const md5 = plugin.handler

test('has plugin props', t => {
  ['name', 'type', 'handler'].forEach(prop => {
    t.ok(plugin[prop])
  })
  t.end()
})

test('type is middleware', t => {
  t.equal(plugin.type, 'middleware')
  t.end()
})

test('errors if adapters requires signed urls but there is no token', t => {
  md5(
    {url: '/foo/bar/baz.png', query: {}},
    {locals: {source: {}, sourceAdapter: {requiresSignedUrls: true}}},
    err => {
      t.ok(err, 'should error')
      t.ok(err.message.includes('secureUrlToken'))
      t.end()
    }
  )
})

test('returns without error if no token is given for channel', t => {
  md5(
    {url: '/foo/bar/baz.png', query: {}},
    {locals: {source: {}, sourceAdapter: {}}},
    err => {
      t.ifError(err, 'should error')
      t.end()
    }
  )
})

test('401s if signature does not match', t => {
  md5(
    {url: '/foo/bar/baz.png?s=abc123', query: {s: 'abc123'}},
    {locals: {source: {config: {secureUrlToken: 'foo'}}, sourceAdapter: {}}},
    err => {
      t.ok(err, 'should error')
      t.ok(err.message.includes('URI signature'))
      t.is(err.output.statusCode, 401)
      t.end()
    }
  )
})

test('401s if signature does not match (complex url)', t => {
  md5(
    {url: '/foo/bar/baz.png?w=1024&s=abc123&h=768', query: {s: 'abc123', w: 1024, h: 768}},
    {locals: {source: {config: {secureUrlToken: 'foo'}}, sourceAdapter: {}}},
    err => {
      t.ok(err, 'should error')
      t.ok(err.message.includes('URI signature'))
      t.is(err.output.statusCode, 401)
      t.end()
    }
  )
})

test('401s if signature is not provided', t => {
  md5(
    {url: '/foo/bar/baz.png', query: {}},
    {locals: {source: {config: {secureUrlToken: 'foo'}}, sourceAdapter: {}}},
    err => {
      t.ok(err, 'should error')
      t.ok(err.message.includes('URI signature'))
      t.is(err.output.statusCode, 401)
      t.end()
    }
  )
})

test('passes without error on matching signature', t => {
  const hash = 'd72888a3e8ee49db8f4fbf85b5447f30'
  md5(
    {url: `/foo/bar/baz.png?w=1024&s=${hash}&h=768`, query: {w: 1024, s: hash, h: 768}},
    {locals: {source: {config: {secureUrlToken: 'foo'}}, sourceAdapter: {}}},
    err => {
      t.ifError(err, 'should not error')
      t.end()
    }
  )
})

test('passes without error on matching signature (signature at query start)', t => {
  const hash = 'd72888a3e8ee49db8f4fbf85b5447f30'
  md5(
    {url: `/foo/bar/baz.png?s=${hash}&w=1024&h=768`, query: {s: hash, w: 1024, h: 768}},
    {locals: {source: {config: {secureUrlToken: 'foo'}}, sourceAdapter: {}}},
    err => {
      t.ifError(err, 'should not error')
      t.end()
    }
  )
})

test('passes without error on matching signature (signature at query end)', t => {
  const hash = 'd72888a3e8ee49db8f4fbf85b5447f30'
  md5(
    {url: `/foo/bar/baz.png?w=1024&h=768&s=${hash}`, query: {w: 1024, h: 768, s: hash}},
    {locals: {source: {config: {secureUrlToken: 'foo'}}, sourceAdapter: {}}},
    err => {
      t.ifError(err, 'should not error')
      t.end()
    }
  )
})

