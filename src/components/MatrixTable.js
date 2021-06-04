import Button from '@material-ui/core/Button';

function MatrixTable(props) {
    const options = require("../options.json")
    return <table style={{ marginLeft: "-50px" }}>
        <tbody>
            <tr>
                <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                    <div className="mr-2">
                        <Button
                            className="sizeButton"
                            variant="contained" color="primary"
                            onClick={(event) => {
                                if (props.grid.length > 1) {
                                    let newGrid = props.grid.map(row => [...row])
                                    newGrid.splice(newGrid.length - 1, 1)
                                    props.setGrid(newGrid)
                                }
                            }}><i className="fas fa-minus"></i></Button><br />
                        <Button
                            className="sizeButton mt-1"
                            variant="contained" color="primary"
                            onClick={(event) => {
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
                                    {array.map((e, j) => <td key={`e${i}${j}`}>
                                        <input
                                            type="text"
                                            className="matrixInput"
                                            style={{ textAlign: "center" }}
                                            value={props.grid[i][j]}
                                            onKeyPress={(event) => event.key === 'Enter' && props.runComputation()}
                                            onChange={(event) => {
                                                if (props.errorMsg === options.error.illegal_input) {
                                                    props.setErrorMsg("")
                                                }
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
                            variant="contained" color="primary"
                            className="sizeButton"
                            onClick={(event) => {
                                if (props.grid[0].length > 1) {
                                    let newGrid = props.grid.map(row => [...row])
                                    for (let i = 0; i < newGrid.length; i++) {
                                        newGrid[i].splice(newGrid[i].length - 1, 1)
                                    }
                                    props.setGrid(newGrid)
                                }
                                //
                            }}><i className="fas fa-minus"></i></Button>
                        <Button
                            variant="contained" color="primary"
                            className="sizeButton ml-1"
                            onClick={(event) => {
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