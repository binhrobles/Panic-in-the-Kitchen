import './style.css'
import { PLAYER_1, SYSTEM } from '@rcade/plugin-input-classic'
import { PLAYER_1 as PLAYER_1_SPINNER } from '@rcade/plugin-input-spinners'

const app = document.querySelector<HTMLDivElement>('#app')!
app.innerHTML = `
  <h1>Krazy Kitchen</h1>
  <p id="status">Press 1P START</p>
  <div id="controls"></div>
`

const status = document.querySelector<HTMLParagraphElement>('#status')!
const controls = document.querySelector<HTMLDivElement>('#controls')!

let gameStarted = false

function update() {
  if (!gameStarted) {
    if (SYSTEM.ONE_PLAYER) {
      gameStarted = true
      status.textContent = 'Game Started!'
    }
  } else {
    const inputs: string[] = []
    if (PLAYER_1.DPAD.up) inputs.push('↑')
    if (PLAYER_1.DPAD.down) inputs.push('↓')
    if (PLAYER_1.DPAD.left) inputs.push('←')
    if (PLAYER_1.DPAD.right) inputs.push('→')
    if (PLAYER_1.A) inputs.push('A')
    if (PLAYER_1.B) inputs.push('B')

    const player1SpinnerDelta = PLAYER_1_SPINNER.SPINNER.consume_step_delta();
    if (player1SpinnerDelta) {
      inputs.push(`spin[${player1SpinnerDelta}]`);
    }

    controls.textContent = inputs.length > 0 ? inputs.join(' ') : '-'
  }

  requestAnimationFrame(update)
}

update()
