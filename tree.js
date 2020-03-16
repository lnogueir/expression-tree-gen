function Node(value) {
    const radius = 32.5
    this.value = value;
    this.x = null;
    this.y = null;
    this.right = null;
    this.left = null;

    this.isLeaf = () => this.right == null && this.left == null;

    this.drawEdge = function (context, x, y, left_way, resolve) {
        context.strokeStyle = 'gray';
        context.beginPath()
        const x_y_ratio = Math.abs(this.y - y) / Math.abs(this.x - x)
        const w = radius * Math.sqrt(1 / (1 + Math.pow(x_y_ratio, 2)))
        const d = x_y_ratio * w
        if (left_way) {
            drawEdgeAnimated(this.x - w, this.y + d, x + w, y - d, context, resolve)
        } else {
            drawEdgeAnimated(this.x + w, this.y + d, x - w, y - d, context, resolve)
        }
    }

    this.draw = function (context) {
        context.beginPath()
        context.arc(this.x, this.y, radius, 0, Math.PI * 2, false)
        context.fillStyle = 'white'
        context.fill()
        context.strokeStyle = '#212121'
        context.stroke()
        context.font = '25px Times New Roman'
        context.textAlign = 'center'
        context.textBaseline = 'middle'
        context.fillStyle = "#212121";
        context.fillText(this.value, this.x, this.y);
    }
}

function drawEdgeAnimated(origin_x, origin_y, destine_x, destine_y, ctx, resolve) {
    const vertices = [{ x: origin_x, y: origin_y }, { x: destine_x, y: destine_y }]
    const N = 35;
    var waypoints = [];
    for (var i = 1; i < vertices.length; i++) {
        var pt0 = vertices[i - 1];
        var pt1 = vertices[i];
        var dx = pt1.x - pt0.x;
        var dy = pt1.y - pt0.y;
        for (var j = 0; j <= N; j++) {
            var x = pt0.x + dx * j / N;
            var y = pt0.y + dy * j / N;
            waypoints.push({ x: x, y: y });
        }
    }
    var t = 1
    function resolveCallback(callback) {
        function animate() {
            if (t < waypoints.length - 1) { requestAnimationFrame(animate) }
            else { callback() }
            ctx.beginPath();
            ctx.moveTo(waypoints[t - 1].x, waypoints[t - 1].y);
            ctx.lineTo(waypoints[t].x, waypoints[t].y);
            ctx.stroke();
            t++;
        }
        return animate
    }

    requestAnimationFrame(resolveCallback(resolve))
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
            subt.y = 1.75 * OFFSET + (depth * 1.5 * OFFSET)
            i++
            setCoordinates(subt.right, depth + 1)
        }
    }
    setCoordinates(root, 0)
}

// must be async in order to await till animation is done
async function drawTree(root, context) {
    if (null != root) {
        root.draw(context)
        if (null != root.left) {
            await new Promise(resolve => root.drawEdge(context, root.left.x, root.left.y, true, resolve))
        }
        drawTree(root.left, context)
        if (null != root.right) {
            await new Promise(resolve => root.drawEdge(context, root.right.x, root.right.y, false, resolve))
        }
        drawTree(root.right, context)
    }
}