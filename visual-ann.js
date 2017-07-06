var VisualANN = (function () {
    var
    /**
     * 
     */
    addNeuron = function (activationFunction) {
	var n = {};
	n.activate = activationFunction;
	n.id = "";
	neurons.push(n);
	console.log('Adding neuron');
    },
    addSynapse = function (fromNeuron, toNeuron) {

    },
    /**
     * Provides "global" access to the drawing context.
     */
    canvas,
    gensym = (function () {
	var i = 0;
    }()),
    /**
     * @param div - A place to draw.
     */
    init = function (div) {
	var cvs = document.createElement('canvas');
	cvs.setAttribute('height', div.clientHeight);
	cvs.setAttribute('width', div.clientWidth);
	div.appendChild(cvs);
	canvas = cvs;
	console.log("Appended canvas of size ".concat(
	    cvs.clientWidth, 'x', cvs.clientHeight, '.'));
	return this;
    },
    neurons = [],
    repaint = function () {
	var radius = Math.sqrt(
	    (((canvas.height * canvas.width) / neurons.length) / 2)
		/ Math.PI),
	    margin = radius * 0.3,
	    ctx = canvas.getContext('2d'),
	    lastPos= {x: 0, y: 0}
	    getNextPos = function (lastPos) {
		if (lastPos.x == 0 && lastPos.y == 0) {
		    return { x: radius, y: radius };
		} else {
		    if (lastPos.x + 3 * radius > canvas.width) {
			return { x: radius, y: lastPos.y + 2 * radius };
		    } else if (lastPos.y + 2 * radius > canvas.height) {
			console.log('a');
		    } else {
			return { x: lastPos.x + 2 * radius, y: lastPos.y }
		    }
		}
	    };
	for (n in neurons) {
	    lastPos = getNextPos(lastPos);
	    console.log(lastPos);
	    ctx.beginPath();
	    ctx.arc(lastPos.x, lastPos.y, radius - margin, 0, Math.PI * 2, true);
	    ctx.stroke();
	}
    },
    SIGMOID_ACTIVATION = function (inputSum) {
	return 1 / (1 + Math.exp(- inputSum));
    };
    /**
     * Things to export.
     */
    return {
	addNeuron: addNeuron,
	init: init,
	repaint: repaint,
	SIGMOID_ACTIVATION: SIGMOID_ACTIVATION
    };
}());
