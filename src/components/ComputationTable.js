
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
    formControl: {
        minWidth: "200px"
    },
}))

function ComputationTable(props) {
    const options = require("../options.json")
    const classes = useStyles()
    return <table className="mt-3" >
        <tbody>
            <tr>
                <td><FormControl className={classes.formControl}>
                    <InputLabel style={{
                        fontFamily: "'Helvetica neue', sans-serif"
                    }}>Computation</InputLabel>
                    <Select
                        value={props.computation}
                        onChange={(event) => {
                            props.setComputation(event.target.value)
                            if (props.errorMsg === options.error.no_computation) {
                                props.setErrorMsg("")
                            }
                        }}
                        style={{
                            fontFamily: "'Helvetica neue', sans-serif"
                        }}
                    >
                        <MenuItem value={"gauss-jordan"}>Gauss-Jordan</MenuItem>
                        <MenuItem value={"square-inverse"}>Square Inverse</MenuItem>
                    </Select>
                </FormControl></td>
                <td><Button
                    className="mt-1 ml-3"
                    style={{
                        marginBottom: "-7px",
                        fontFamily: "'Helvetica neue', sans-serif"
                    }}
                    variant="contained" color="primary"
                    onClick={props.runComputation}>Run</Button></td>
            </tr>
        </tbody>
    </table >
}

export default ComputationTable