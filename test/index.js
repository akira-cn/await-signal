const test = require("ava")

const Signal = require('../lib/index.js')

test('signal until', async t => {
  const signal = new Signal(0)

  setInterval(function(){
    signal.state++
  }, 100)

  let result = await signal.until(5)

  t.deepEqual(result, [0, 1, 2, 3, 4, 5])
})

test('signal while', async t => {
  const signal = new Signal(true)
  let i = 0

  setInterval(function(){
    signal.state = i++ < 5
  }, 100)

  let result = await signal.while(true)
  t.deepEqual(result, [true, false])
})

test('signal class', async t => {
  class Foo extends Signal{
    constructor(){
      super(0)
    }
    inc() {
      return this.state++
    }
  }

  const foo = new Foo()

  let timer = setInterval(() => {
    console.log(foo.inc())
  }, 100)

  console.log('foo: 1 - 5')
  await foo.until(5)
  console.log('foo: 6 - 10')
  await foo.until(20)
  console.log('foo: 11 - 20')

  clearInterval(timer)

  t.is(foo.state, 20)
})
