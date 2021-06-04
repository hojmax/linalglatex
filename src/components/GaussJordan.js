var nerdamer = require('nerdamer')

function copy2d(input) {
    return input.map(arr => arr.slice());
}

function rowAddition(input, row1, scalar, row2, steps) {
    const stepsScalar = nerdamer(scalar).toTeX()
    if (stepsScalar !== "0") {
        for (let i = 0; i < input[row1].length; i++) {
            input[row1][i] = nerdamer(`${input[row1][i]} ${scalar} * (${input[row2][i]})`).text('fractions')
        }
        steps.push({ type: "addition", row1: row1, scalar: nerdamer(scalar).toTeX(), row2: row2, to: copy2d(input) })
    }
}

function rowSwap(input, row1, row2, steps) {
    const temp = input[row1]
    input[row1] = input[row2]
    input[row2] = temp
    steps.push({ type: "swap", row1: row1, row2: row2, to: copy2d(input) })
}

function rowScale(input, row1, scalar, steps) {
    const stepsScalar = nerdamer(scalar).toTeX()
    if (stepsScalar !== "1") {
        for (let i = 0; i < input[row1].length; i++) {
            input[row1][i] = nerdamer(`${scalar} * (${input[row1][i]})`).text('fractions')
        }
        steps.push({ type: "scale", row1: row1, scalar: nerdamer(scalar).toTeX(), to: copy2d(input) })
    }
}

function forwardReduction(input, steps) {
    for (let topRow = 0; topRow < input.length - 1; topRow++) {
        let j = 0
        loop2: while (j < input[0].length) {
            for (let i = topRow; i < input.length; i++) {
                if (input[i][j] !== "" && input[i][j] !== "0" && input[i][j] !== 0) {
                    if (i !== topRow) {
                        rowSwap(input, i, topRow, steps)
                    }
                    break loop2
                }
            }
            j++
        }
        for (let v = topRow + 1; v < input.length; v++) {
            rowAddition(input, v, `-(${input[v][j]})/(${input[topRow][j]})`, topRow, steps)
        }
    }
}

function backwardReduction(input, steps) {
    for (let i = input.length - 1; i >= 0; i--) {
        for (let j = 0; j < input[0].length; j++) {
            if (input[i][j] !== "" && input[i][j] !== "0" && input[i][j] !== 0) {
                rowScale(input, i, `1/(${input[i][j]})`, steps)
                for (let v = i - 1; v >= 0; v--) {
                    rowAddition(input, v, `-(${input[v][j]})`, i, steps)
                }
                break
            }
        }
    }
}

function array2dLatex(array2d) {
    let output = `\\left[\\begin{array}{${"r".repeat(array2d[0].length)}}\n\t`
    for (let i = 0; i < array2d.length; i++) {
        for (let j = 0; j < array2d[i].length; j++) {
            output += nerdamer(array2d[i][j].toString()).toTeX()
            if (j === array2d[i].length - 1) {
                output += "\\\\\n" + (i !== array2d.length - 1 ? "\t" : "")
            } else {
                output += " & "
            }
        }
    }
    output += "\\end{array}\\right]"
    return output
}

function GaussJordan(input) {
    let output = "\\begin{aligned}\n"
    let steps = []
    let copy = copy2d(input)
    forwardReduction(copy, steps)
    backwardReduction(copy, steps)
    output += array2dLatex(input) + "\n"
    for (let i = 0; i < steps.length; i++) {
        const e = steps[i]
        let action = "r_1";
        if (e.type === "addition") {
            action = `r_${e.row1 + 1}${e.scalar[0] === "-" ? "" : "+"}${e.scalar === "-1" ? "-" : (e.scalar !== 1 ? e.scalar : "")}r_${e.row2 + 1}\\to r_${e.row1 + 1}`
        } else if (e.type === "scale") {
            action = `${e.scalar}r_${e.row1 + 1}\\to r_${e.row1 + 1}`
        } else if (e.type === "swap") {
            action = `r_${e.row1 + 1} \\leftrightarrow r_${e.row2 + 1}`
        }
        output += `\t&\\xrightarrow{${action}}\n`
        output += array2dLatex(e.to)
        output += "\\\\\n"
    }
    output += "\\end{aligned}"
    return output
}

export default GaussJordan