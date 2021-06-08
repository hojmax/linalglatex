import { useState } from "react"
import Tooltip from '@material-ui/core/Tooltip';
// var Latex = require('react-latex');
import 'katex/dist/katex.min.css'
import Latex from 'react-latex-next'

function LatexView(props) {
    const [canShake, setCanShake] = useState(false)
    const getClipboardClassname = () => {
        let output = "clipboardIcon fas fa-clipboard"
        if (props.isCopied) {
            output += "-check "
        }
        if (canShake) {
            output += " shakeAnimation"
        }
        return output
    }
    return <div className="latexWrapper">
        <div
            className={"mt-4 latexContainer " + (props.canBounce && "fadeIn")}
            style={{ marginBottom: "30px" }}
            onAnimationEnd={() => props.setCanBounce(false)}>
            <Tooltip title={props.isCopied ? "Copied!" : "Copy LaTeX"}>
                <i onAnimationEnd={() => setCanShake(false)}
                    onClick={() => { setCanShake(true); props.setIsCopied(true); navigator.clipboard.writeText(props.latexString) }}
                    className={getClipboardClassname()}></i>
            </Tooltip>
            <Latex>{props.latexString}</Latex>
        </div>
    </div>
}


{/* <div style={{
    top: "0px",
    bottom: "0px",
    left: "0px",
    right: "0px",
    position: "absolute",
    backgroundColor: "red"
}}> */}

export default LatexView