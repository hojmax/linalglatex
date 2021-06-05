import ComputationTable from './components/ComputationTable'
import MatrixTable from './components/MatrixTable'
import LatexView from './components/LatexView'
import { GaussJordan, SquareInverse } from './components/GaussJordan'
import { useState } from "react"
import 'bootstrap/dist/css/bootstrap.min.css'
import 'katex/dist/katex.min.css'
import './App.css'

const defaultMatrix = [
  ["a", 1],
  [0, "1/7"]
]

function App() {
  const [latexString, setLatexString] = useState("")
  const [grid, setGrid] = useState(defaultMatrix)
  const [canBounce, setCanBounce] = useState(true)
  const [computation, setComputation] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [isCopied, setIsCopied] = useState(false)
  const options = require("./options.json")

  const runComputation = () => {
    if (computation === "") {
      setErrorMsg(options.error.no_computation)
    } else {
      if (computation === "gauss-jordan") {
        try {
          setLatexString(GaussJordan(grid))
          setCanBounce(true)
          setIsCopied(false)
        } catch {
          setErrorMsg(options.error.illegal_input)
        }
      } else if (computation === "square-inverse") {
        if (grid.length !== grid[0].length) {
          setErrorMsg(options.error.nxn_dimensions)
        } else {
          try {
            setLatexString(SquareInverse(grid))
            setCanBounce(true)
            setIsCopied(false)
          } catch {
            setErrorMsg(options.error.illegal_input)
          }
        }
      }
    }
  }

  return (<>
    <div className="logoText">LinAlgLatex.io</div>
    <center style={{ marginTop: "70px" }}>
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
        latexString={latexString}
        isCopied={isCopied}
        setIsCopied={setIsCopied} />}
    </center>
  </>)
}

export default App