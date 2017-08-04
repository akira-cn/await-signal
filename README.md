# await-signal

A simple promise-based signal system for running async tasks. 

## Installation

```bash
npm install await-signal
```

## Usage

in browser

```html
<script src="https://s1.ssl.qhres.com/!17e4956e/await-signals-0.1.1.js"></script>
```

[Demo 1](https://code.h5jun.com/biv/edit?js,output)

```js
let traffic = new Signal('stop')

requestAnimationFrame(async function update(t){
  //await traffic.while('stop')
  await traffic.until('pass')
  block.style.left = parseInt(block.style.left || 50) + 1 + 'px'
  requestAnimationFrame(update)
})

button.onclick = e => {
  traffic.state = button.className = button.className === 'stop' ? 'pass' : 'stop'
}
```

[Demo 2](https://code.h5jun.com/dow/edit?html,js,output)

```js
class Counter extends Signal{
  constructor(id){
    super(0)
    this.panel = document.getElementById(id)
  }
  inc(){
    this.panel.innerHTML = (++this.state) % 10
  }
}
const c0 = new Counter('clock0')
const c1 = new Counter('clock1')
const c2 = new Counter('clock2')

setInterval(async () => {
  c0.inc()
}, 100)

async function update(c1, c2){
  await c1.until(s => !(s % 10))
  c2.inc()
  await c1.while(s => !(s % 10))
  update(c1, c2)
}

;(async function(){
  await c0.while(s => !(s % 10))
  update(c0, c1)
  await c1.while(s => !(s % 10))
  update(c1, c2)
})();
```

[Demo 3](https://code.h5jun.com/cuv/edit?js,output)

[SpriteAnimator.generateAnimation](https://github.com/spritejs/sprite-animator) creates a signaling object.

```js
let animation, requestID

start.onclick = function(){
  if(requestID){
    cancelAnimationFrame(requestID)
  }

  animation = SpriteAnimator.generateAnimation([{width:0},{width:150},{width:200}], 
    {duration:2000, delay: 500})

  animation.play()

  block.style.backgroundColor = 'red'

  animation.until('running').then(() => {
    block.style.backgroundColor = 'green'
  })

  animation.until('finished').then(() => {
    block.style.backgroundColor = 'blue'
  })

  requestID = requestAnimationFrame(async function update(){
    await animation.while('idle')
    await animation.while('pending')
    
    let res = animation.next(),
        value = res.value

    if(value){
      block.style.width = value.width + 'px'
    }

    if(!res.done){
      await animation.while('paused')
      requestAnimationFrame(update)
    }
  })
}

pause.onclick = function(){
  if(animation){
    animation.pause()
  }
}

play.onclick = function(){
  if(animation){
    animation.play()
  }
}
```

## API

### new Signal(initState)

Initialize a signal with a state.

```js
const mySignal = new Signal(0)
```

### while(theState)

Return a promise that pendings when the signal state is theState.

```js
(async function(){

const signal = new Signal(true)

let i = 0
const timer = setInterval(() => {
	signal.state = ++i < 5
}, 1000)

await signal.while(i < 5)
clearInterval(timer)

console.log(i) //5

})()
```

### until(theState)

Return a promise that pendings when the signal state is not theState.

```js
(async function(){

const signal = new Signal(0)

const timer = setInterval(() => {
	signal.state++
}, 1000)

let states = await signal.until(5)

console.log(states) //0,1,2,3,4,5

})
```

## License

MIT