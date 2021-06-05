import Button from '@material-ui/core/Button'
import { useState } from "react"

function MatrixTable(props) {
    const [precendence, setPrecedence] = useState("waveVert")
    const [direction, setDirection] = useState("")
    const [resized, setResized] = useState(false)
    const getAnimation = (i, j) => {
        let choice = ""
        if (!resized) {
            choice = "waveVertAnti"
        } else if (precendence === "waveVert") {
            if (i === props.grid.length - 1) {
                choice = "waveVert" + direction
            }
        } else {
            if (j === props.grid[0].length - 1) {
                choice = "waveHori" + direction
            }
        }
        return {
            animationName: choice,
            animationDuration: "0.5s",
        }
    }
    return <table style={{ marginLeft: "-50px" }}>
        <tbody>
            <tr>
                <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                    <div className="mr-2">
                        <Button
                            size="small"
                            className="sizeButton"
                            variant="contained" color="primary"
                            onClick={(event) => {
                                if (props.grid.length > 1) {
                                    setResized(true)
                                    setPrecedence("waveVert")
                                    setDirection("Anti")
                                    let newGrid = props.grid.map(row => [...row])
                                    newGrid.splice(newGrid.length - 1, 1)
                                    props.setGrid(newGrid)
                                }
                            }}><i className="fas fa-minus"></i></Button><br />
                        <Button
                            size="small"
                            className="sizeButton mt-1"
                            variant="contained" color="primary"
                            onClick={(event) => {
                                setResized(true)
                                setPrecedence("waveVert")
                                setDirection("")
                                let newGrid = props.grid.map(row => [...row])
                                newGrid.push(Array(props.grid[0].length).fill(0))
                                props.setGrid(newGrid)
                            }}><i className="fas fa-plus"></i></Button>
                    </div>
                </td>
                <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                    <div className="matrixBrackets">
                        <div className="topLeftBorder" />
                        <div className="topRightBorder" />
                        <div className="bottomLeftBorder" />
                        <div className="bottomRightBorder" />
                        <table style={{ margin: "auto" }}>
                            <tbody>
                                {props.grid.map((array, i) => <tr key={`row${i}`}>
                                    {array.map((e, j) => <td key={`e${i}${j}`} style={getAnimation(i, j)}>
                                        <input
                                            type="text"
                                            className="matrixInput"
                                            style={{ textAlign: "center" }}
                                            value={props.grid[i][j]}
                                            onKeyPress={(event) => event.key === 'Enter' && props.runComputation()}
                                            onChange={(event) => {
                                                let newGrid = props.grid.map(row => [...row])
                                                newGrid[i][j] = event.target.value
                                                props.setGrid(newGrid)
                                            }} />
                                    </td>)}
                                </tr>)}
                            </tbody>
                        </table>
                    </div>
                </td>
            </tr>
            <tr>
                <td></td>
                <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                    <div className="mt-2">
                        <Button
                            size="small"
                            variant="contained" color="primary"
                            className="sizeButton"
                            onClick={(event) => {
                                if (props.grid[0].length > 1) {
                                    setResized(true)
                                    setPrecedence("waveHori")
                                    setDirection("Anti")
                                    let newGrid = props.grid.map(row => [...row])
                                    for (let i = 0; i < newGrid.length; i++) {
                                        newGrid[i].splice(newGrid[i].length - 1, 1)
                                    }
                                    props.setGrid(newGrid)
                                }
                                //
                            }}><i className="fas fa-minus"></i></Button>
                        <Button
                            size="small"
                            variant="contained" color="primary"
                            className="sizeButton ml-1"
                            onClick={(event) => {
                                setResized(true)
                                setPrecedence("waveHori")
                                setDirection("")
                                let newGrid = props.grid.map(row => [...row])
                                for (let i = 0; i < newGrid.length; i++) {
                                    newGrid[i].push(0)
                                }
                                props.setGrid(newGrid)
                            }}
                        ><i className="fas fa-plus"></i></Button>
                    </div>
                </td>
            </tr>
        </tbody>
    </table >
}

export default MatrixTable