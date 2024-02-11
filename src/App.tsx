import { Box, Text, useApp, useInput, useStdin } from 'ink'
import { useState } from 'react'
import reactUse from 'react-use'
const { useMount } = reactUse

const App = () => {
  const { exit } = useApp()
  const { isRawModeSupported, setRawMode } = useStdin()
  const [count, setCount] = useState(0)

  useMount(() => {
    if (isRawModeSupported) {
      setRawMode(true)
    }
  })

  useInput((input, key) => {
    if (input === 'q') {
      exit()
    }
    if (key.upArrow) {
      setCount(count + 1)
    }
    if (key.downArrow) {
      setCount(count - 1)
    }
  })

  return (
    <Box>
      <Text color="green">count: {count}</Text>
    </Box>
  )
}

export default App
