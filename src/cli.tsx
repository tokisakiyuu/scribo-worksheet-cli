import { render } from 'ink'
import terminalKit from 'terminal-kit'
import App from './App.js'

const { realTerminal } = terminalKit

// enter alternate screen
realTerminal.fullscreen(true)

const app = render(<App />, {
  exitOnCtrlC: false,
})

app.waitUntilExit().then(() => {
  // exit alternate screen
  realTerminal.fullscreen(false)
})
