function defer(){
  const ret = {}
  ret.promise = new Promise((resolve, reject) => {
    ret.resolve = resolve
    ret.reject = reject
  })
  return ret
}

const _state = Symbol('state'),
      _deferChecker = Symbol('deferChecker')

class Signal{
  constructor(initState){
    this[_deferChecker] = new Set()
    this[_state] = initState 
  }
  set state(state){
    if(this[_state] !== state){ //state change!
      this[_state] = state
      const checkers = [...this[_deferChecker]]
      this[_deferChecker].clear()
      checkers.forEach(checker => checker(state))
    }
  }
  get state(){
    return this[_state]
  }
  while(state){
    const states = [this[_state]]

    let checkState = state
    if(typeof state !== 'function'){
      checkState = currentState => currentState === state
    }

    if(checkState(this[_state])){
      const deferred = defer()
      const checkers = this[_deferChecker]

      checkers.add(function check(newState){
        states.push(newState)

        if(!checkState(newState)){
          deferred.resolve(states)
        } else {
          checkers.add(check)
        }
      })

      return deferred.promise
    } else {
      return Promise.resolve(states)
    }
  }
  until(state){
    const states = [this[_state]]

    let checkState = state
    if(typeof state !== 'function'){
      checkState = currentState => currentState === state
    }

    if(checkState(this[_state])){
      return Promise.resolve(states)
    } else {
      const deferred = defer()
      const checkers = this[_deferChecker]

      checkers.add(function check(newState){
        states.push(newState)
        if(checkState(newState)){
          deferred.resolve(states)
        } else {
          checkers.add(check)
        }
      })

      return deferred.promise
    }
  }
}

module.exports = Signal
