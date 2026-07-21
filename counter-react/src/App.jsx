import { useState } from 'react'

function App() {

  const [count, setCount] = useState(0)

  function handleClick() {
    setCount(count + 1)
  }

  return (
    <div className="card">
      <h1>Counter App- React</h1>
      <h2>{count}</h2>
      <button onClick={handleClick}>Click</button>
    </div>
  )
}

export default App
