import { StateMachine } from './core/state-machine'
import { State } from './core/state'

let gameStateMachine: StateMachine

const createGameStateMachine = function(initialState: State) {
    gameStateMachine = new StateMachine(initialState)
}

export { gameStateMachine, createGameStateMachine }