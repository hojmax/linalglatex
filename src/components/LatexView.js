import { useState } from "react"
import Tooltip from '@material-ui/core/Tooltip';
var Latex = require('react-latex');

function LatexView(props) {
    const [isCopied, setIsCopied] = useState(false)
    const [canShake, setCanShake] = useState(false)
    const getClipboardClassname = () => {
        let output = "clipboardIcon fas fa-clipboard"
        if (isCopied) {
            output += "-check "
        }
        if (canShake) {
            output += " shakeAnimation"
        }
        return output
    }
    return <div
        className={"mt-4 mb-4 latexContainer " + (props.canBounce && "bounceIn")}
        onAnimationEnd={() => props.setCanBounce(false)}>
        <Tooltip title={isCopied ? "Copied!" : "Copy LaTeX"}>
            <i onAnimationEnd={() => setCanShake(false)}
                onClick={() => { setCanShake(true); setIsCopied(true); navigator.clipboard.writeText(props.latexString) }}
                className={getClipboardClassname()}></i>
        </Tooltip>
        <Latex>{`$$${props.latexString}$$`}</Latex>
    </div>
}

export default LatexView