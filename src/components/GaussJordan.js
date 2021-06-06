var nerdamer = require('nerdamer')
const { det } = require('mathjs')
// var algebra = require('algebra.js');
// var Expression = algebra.Expression;

function copy2d(input) {
    return input.map(arr => arr.slice());
}

function rowAddition(input, row1, scalar, row2, steps) {
    const stepsScalar = nerdamer(scalar).toTeX()
    if (stepsScalar !== "0") {
        for (let i = 0; i < input[row1].length; i++) {
            input[row1][i] = nerdamer(`${input[row1][i]} ${scalar} * (${input[row2][i]})`).text('fractions')
        }
        steps.push({ type: "addition", row1: row1, scalar: stepsScalar, row2: row2, to: copy2d(input) })
    }
}

function rowSwap(input, row1, row2, steps) {
    const temp = input[row1]
    input[row1] = input[row2]
    input[row2] = temp
    steps.push({ type: "swap", row1: row1, row2: row2, to: copy2d(input) })
}

function augmentRight(matrix1, matrix2) {
    for (let i = 0; i < matrix1.length; i++) {
        matrix1[i] = matrix1[i].concat(matrix2[i])
    }
}

function rowScale(input, row1, scalar, steps) {
    const stepsScalar = nerdamer(scalar).toTeX()
    if (stepsScalar !== "1") {
        for (let i = 0; i < input[row1].length; i++) {
            input[row1][i] = nerdamer(`${scalar} * (${input[row1][i]})`).text('fractions')
        }
        steps.push({ type: "scale", row1: row1, scalar: stepsScalar, to: copy2d(input) })
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
        if (j === input[0].length) {
            break
        }
        for (let v = topRow + 1; v < input.length; v++) {
            rowAddition(input, v, `-(${input[v][j]})/(${input[topRow][j]})`, topRow, steps)
        }
    }
}

function IdentityMatrix(n) {
    let output = Array(n).fill(0).map(e => Array(n).fill(0))
    for (let i = 0; i < n; i++) {
        output[i][i] = 1
    }
    return output
}

function removeColumns(input, columns) {
    let output = []
    for (let i = 0; i < input.length; i++) {
        output[i] = []
        for (let j = 0; j < input[i].length; j++) {
            if (!columns.includes(j)) {
                output[i].push(input[i][j])
            }
        }
    }
    return output
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

function array2dLatex(array2d, position = -1) {
    let alignment;
    if (position !== -1) {
        alignment = "r".repeat(position) + "|" + "r".repeat(array2d[0].length - position)
    } else {
        alignment = "r".repeat(array2d[0].length)
    }
    let output = `\\left[\\begin{array}{${alignment}}\n\t`
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

function SquareInverse(input) {
    let hasInverse = true
    try {
        const determinant = det(input)
        if (determinant === 0) {
            hasInverse = false
        }
    } catch { }
    if (hasInverse) {
        let copy = copy2d(input)
        augmentRight(copy, IdentityMatrix(input.length))
        let output = `A&=${array2dLatex(input)}\\\\\n`
        let gauss = helperGaussJordan(copy, input.length)
        output += gauss.latex
        let inverse = removeColumns(gauss.steps[gauss.steps.length - 1].to, [...Array(input.length).keys()])
        output += `\\\\\nA^{-1}&=${array2dLatex(inverse)}`
        return centerLatex(output)
    } else {
        return "This\\: matrix\\: has\\: no\\: inverse\\: as\\: its\\: determinant\\: is\\: 0."
    }
}

function centerLatex(latex) {
    return `$$\\begin{aligned}\n${latex}\n\\end{aligned}$$`
}

function shouldAddParentheses(str) {
    let bracketCount = 0
    for (let i = 0; i < str.length; i++) {
        if (str[i] === "(" || str[i] === "{") {
            bracketCount += 1
        } else if (str[i] === ")" || str[i] === "}") {
            bracketCount -= 1
        } else if ((str[i] === "+" || str[i] === "-") && bracketCount === 0 && i !== 0) {
            return true
        }
    }
    return false
}

function helperGaussJordan(input, position = -1) {
    let output = ""
    let steps = []
    let copy = copy2d(input)
    forwardReduction(copy, steps)
    backwardReduction(copy, steps)
    output += array2dLatex(input, position) + "\n"
    for (let i = 0; i < steps.length; i++) {
        const e = steps[i]
        let action = "r_1";
        if (e.type === "addition") {
            if (shouldAddParentheses(e.scalar)) {
                action = `r_${e.row1 + 1}+(${e.scalar})r_${e.row2 + 1}\\to r_${e.row1 + 1}`
            } else {
                action = `r_${e.row1 + 1}${e.scalar[0] === "-" ? "" : "+"}${e.scalar === "-1" ? "-" : (e.scalar !== 1 ? e.scalar : "")}r_${e.row2 + 1}\\to r_${e.row1 + 1}`
            }
        } else if (e.type === "scale") {
            if (shouldAddParentheses(e.scalar)) {
                action = `(${e.scalar})r_${e.row1 + 1}\\to r_${e.row1 + 1}`
            } else {
                action = `${e.scalar}r_${e.row1 + 1}\\to r_${e.row1 + 1}`
            }
        } else if (e.type === "swap") {
            action = `r_${e.row1 + 1} \\leftrightarrow r_${e.row2 + 1}`
        }
        output += `\t&\\xrightarrow{${action}}\n`
        output += array2dLatex(e.to, position)
        if (i !== steps.length - 1) {
            output += "\\\\"
        }
    }
    return { latex: output, steps: steps }
}

function GaussJordan(input, position = -1) {
    return centerLatex(helperGaussJordan(input, position).latex)
}

export { GaussJordan, SquareInverse }