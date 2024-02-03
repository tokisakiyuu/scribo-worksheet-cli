import { useState, useEffect } from 'react'
import { Text } from 'ink'

const App = () => {
  const [counter, setCounter] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCounter(previousCounter => previousCounter + 1)
    }, 100)

    return () => {
      clearInterval(timer)
    }
  }, [])

  return <Text color="green">{counter} tests passed</Text>
}

export default App
