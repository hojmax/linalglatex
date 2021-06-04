import ComputationTable from './components/ComputationTable'
import MatrixTable from './components/MatrixTable'
import LatexView from './components/LatexView'
import GaussJordan from './components/GaussJordan'
import { useState } from "react"
import 'bootstrap/dist/css/bootstrap.min.css'
import 'katex/dist/katex.min.css'
import './App.css'

const defaultMatrix = [
  ["a", 1, 2],
  [0, "1/7", 19],
  ["1/9", 9, 1]
]

function App() {
  const [latexString, setLatexString] = useState("")
  const [grid, setGrid] = useState(defaultMatrix)
  const [canBounce, setCanBounce] = useState(true)
  const [computation, setComputation] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const options = require("./options.json")

  const runComputation = () => {
    if (computation === "") {
      setErrorMsg(options.error.no_computation)
    } else {
      if (computation === "gauss-jordan") {
        try {
          setLatexString(GaussJordan(grid))
          setCanBounce(true)
        } catch {
          setErrorMsg(options.error.illegal_input)
        }
      }
    }
  }

  return (<>
    <div className="logoText">LinAlgLatex.io</div>
    <center className="mt-5">
      <MatrixTable
        grid={grid}
        setGrid={setGrid}
        setErrorMsg={setErrorMsg}
        runComputation={runComputation}
        errorMsg={errorMsg} />
      <ComputationTable
        computation={computation}
        setComputation={setComputation}
        setErrorMsg={setErrorMsg}
        errorMsg={errorMsg}
        grid={grid}
        runComputation={runComputation}
        setLatexString={setLatexString} />
      {errorMsg && <p className="errorMsg mt-4">{errorMsg}</p>}
      {latexString && <LatexView
        canBounce={canBounce}
        setCanBounce={setCanBounce}
        latexString={latexString} />}
    </center>
  </>)
}

export default App