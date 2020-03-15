var canvas = document.querySelector('canvas')

canvas.height = document.getElementById('canvas-container').offsetHeight;
canvas.width = document.getElementById('canvas-container').offsetWidth;

var c = canvas.getContext('2d')

$('#generate-tree').click(() => {
    var expression = $('#expression-input').val()
    if (typeof expression !== 'undefined' && null != expression) {
        expression = expression.replace(/\s+/g, '')
        expression = expression.toLowerCase()
        var postfix = infixToPostfix(expression);
        if (null !== postfix) {
            var root = constructTree(postfix)
            setCoordinates(root)
            c.clearRect(0, 0, canvas.width, canvas.height);
            drawTree(root, c)
        } else {
            alert('Enter valid expression')
        }

    } else {
        alert('Enter valid expression')
    }
})
