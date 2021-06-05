import ComputationTable from './components/ComputationTable'
import MatrixTable from './components/MatrixTable'
import LatexView from './components/LatexView'
import { GaussJordan, SquareInverse } from './components/GaussJordan'
import { useState, useEffect } from "react"
import 'bootstrap/dist/css/bootstrap.min.css'
import 'katex/dist/katex.min.css'
import './App.css'

const defaultMatrix = [
  ["a", 1],
  [0, "1/7"]
]

const containsEmpty = (grid) => {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === "") {
        return true
      }
    }
  }
  return false;
}

function App() {
  const [latexString, setLatexString] = useState("")
  const [grid, setGrid] = useState(defaultMatrix)
  const [canBounce, setCanBounce] = useState(true)
  const [computation, setComputation] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [canErrorShake, setCanErrorShake] = useState(true)
  const [isCopied, setIsCopied] = useState(false)
  const options = require("./options.json")

  const runComputation = () => {
    if (computation === "") {
      setCanErrorShake(true)
      setErrorMsg(options.error.no_computation)
    } else {
      if (containsEmpty(grid)) {
        setCanErrorShake(true)
        setErrorMsg(options.error.illegal_input)
      } else if (computation === "gauss-jordan") {
        try {
          setLatexString(GaussJordan(grid))
          setCanBounce(true)
          setIsCopied(false)
          setErrorMsg("")
        } catch {
          setCanErrorShake(true)
          setErrorMsg(options.error.illegal_input)
        }
      } else if (computation === "square-inverse") {
        if (grid.length !== grid[0].length) {
          setCanErrorShake(true)
          setErrorMsg(options.error.nxn_dimensions)
        } else {
          try {
            setLatexString(SquareInverse(grid))
            setCanBounce(true)
            setIsCopied(false)
            setErrorMsg("")
          } catch {
            setCanErrorShake(true)
            setErrorMsg(options.error.illegal_input)
          }
        }
      }
    }
  }

  return (<div style={{ position: 'relative', minHeight: "100vh", paddingTop: "70px" }}>
    <div className="logoText">LinAlgLatex.io</div>
    <center>
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
      {errorMsg && <p
        className={"errorMsg mt-4" + (canErrorShake ? " shakeIn" : "")}
        style={{ margin: "0" }}
        onAnimationEnd={() => setCanErrorShake(false)}>
        {errorMsg}
      </p>}
      {latexString && <LatexView
        canBounce={canBounce}
        setCanBounce={setCanBounce}
        latexString={latexString}
        isCopied={isCopied}
        setIsCopied={setIsCopied} />}
    </center>
    <p className="creditText">Built by Axel Højmark</p>
  </div>)
}

export default App