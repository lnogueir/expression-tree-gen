


(function () {
    const SAMPLE_EXPRESSIONS = [
        '(a + b)*c - (x - y)/z',
        '(a * b) - c + z / x',
        'x - y + (c / (a + b))',
        '(a / y) + b - (c * x)',
        '(a - b) * (c + d) / z',
        '(a * b) - (x / y)'
    ]
    var canvas = document.querySelector('canvas')
    var c = canvas.getContext('2d')
    function clearCanvas() { c.clearRect(0, 0, canvas.width, canvas.height) }

    document.getElementById('generate-tree').addEventListener('click', () => {
        var expression = document.getElementById('expression-input').value
        if (typeof expression !== 'undefined' && null != expression) {
            expression = expression.replace(/\s+/g, '')
            expression = expression.toLowerCase()
            var postfix = infixToPostfix(expression);
            if (null !== postfix) {
                try {
                    var root = constructTree(postfix)
                    setCoordinates(root)
                    clearCanvas()
                    canvas.height = document.getElementById('canvas-container').offsetHeight;
                    canvas.width = document.getElementById('canvas-container').offsetWidth;
                    drawTree(root, c)
                } catch (e) {
                    displayErrorMessage()
                }
            } else {
                displayErrorMessage()
            }

        } else {
            displayErrorMessage()
        }
    })

    document.getElementById('clear-tree').addEventListener('click', () => {
        document.getElementById('expression-input').value = ''
        clearCanvas()
    })

    document.getElementById('expression-input').value = SAMPLE_EXPRESSIONS[Math.floor(Math.random() * SAMPLE_EXPRESSIONS.length)]
    setTimeout(() => {
        document.getElementById('generate-tree').click()
    }, 500)
})();



function displayErrorMessage() {
    Swal.fire({
        icon: 'error',
        title: 'Invalid expression',
        html: `
            <div style="font-size:1.1em;text-align: left;margin:0px 0px 0px 60px;">
                - You may only use these brackets ( ). <br/>
                - Use * for multiplication and / for division. <br/>
                - Valid operators and operands are:<br/>
                <div style="margin-left: 10px;">
                    <i>Operators</i>: <b>[+ - * / ]</b><br/>
                    <i>Operands</i>: Any alphabetic letter.
                </div>
            </div>
        `,
        footer: '<a href="https://github.com/lnogueir/expression-tree-gen">Learn more</a>'
    })
}
