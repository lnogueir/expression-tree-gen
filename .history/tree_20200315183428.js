function Node(value) {
    const radius = 32.5
    this.value = value;
    this.x = null;
    this.y = null;
    this.right = null;
    this.left = null;

    this.isLeaf = () => this.right == null && this.left == null;

    this.drawEdge = function (context, x, y, left_way) {
        context.strokeStyle = 'gray';
        context.beginPath()
        const x_y_ratio = Math.abs(this.y - y) / Math.abs(this.x - x)
        const w = radius * Math.sqrt(1 / (1 + Math.pow(x_y_ratio, 2)))
        const d = x_y_ratio * w
        if (left_way) {
            context.moveTo(this.x - w, this.y + d)
            context.lineTo(x + w, y - d)
        } else {
            context.moveTo(this.x + w, this.y + d)
            context.lineTo(x - w, y - d)
        }

        context.stroke()
    }

    this.draw = function (context) {
        context.beginPath()
        context.arc(this.x, this.y, radius, 0, Math.PI * 2, false)
        context.fillStyle = 'rgba(255, 255, 255, 0.5)'
        context.fill()
        context.strokeStyle = 'black'
        context.stroke()
        context.font = '25px Times New Roman'
        context.textAlign = 'center'
        context.textBaseline = 'middle'
        context.fillStyle = "black";
        context.fillText(this.value, this.x, this.y);
    }
}

function constructTree(postfix) {
    const OPERATORS = ['*', '/', '-', '+']
    var stack = []
    var root = null;
    var current;
    var shift = false;
    for (var i = postfix.length - 1; i >= 0; i--) {
        if (null === root) {
            current = new Node(postfix[i]);
            root = current;
        } else {
            if (shift) {
                current.left = new Node(postfix[i])
                current = current.left
                shift = false
            } else {
                current.right = new Node(postfix[i])
                current = current.right
            }
        }
        if (OPERATORS.includes(postfix[i])) {
            stack.push(current);
        } else {
            current = stack.pop();
            shift = true
        }
    }
    return root;
}

function getSize(root) {
    var size = 0
    function countSize(root) {
        if (null != root) {
            size++;
            countSize(root.left)
            countSize(root.right)
        }
    }
    countSize(root);
    return size;
}

function print_coords(root) {
    if (null != root) {
        print_coords(root.left)
        console.log(root.value, root.x, root.y)
        print_coords(root.right)
    }
}

function setCoordinates(root) {
    var i = 0
    const OFFSET = 50
    const size = getSize(root)
    const canvas_mid_point = window.innerWidth / 2;
    function setCoordinates(subt, depth) {
        if (null != subt) {
            setCoordinates(subt.left, depth + 1)
            subt.x = canvas_mid_point + (OFFSET * (i - size / 2))
            subt.y = OFFSET + (depth * 1.5 * OFFSET)
            i++
            setCoordinates(subt.right, depth + 1)
        }
    }
    setCoordinates(root, 0)
}

function drawTree(root, context) {
    if (null != root) {
        root.draw(context)
        if (null != root.left) {
            root.drawEdge(context, root.left.x, root.left.y, true);
        }
        drawTree(root.left, context)
        if (null != root.right) {
            root.drawEdge(context, root.right.x, root.right.y, false)
        }
        drawTree(root.right, context)
    }
}