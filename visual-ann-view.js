VisualANN.view = (function () {
    var
    /**
     * @param {Element} div - The intended place to put the canvas.
     */
    makeCanvas = function (div) {
	var cvs = document.createElement('canvas');
	cvs.setAttribute('height', div.clientHeight);
	cvs.setAttribute('width', div.clientWidth);
	return cvs;
    },
    /**
     * @param {Object} network - The network to draw onto a canvas.
     * @param {Canvas} canvas - A canvas to draw onto.
     */
    paint = function (network, canvas) {
	var neurons = network.neurons,
	    synapses = network.synapses,
	    radius = Math.sqrt(
		(((canvas.height * canvas.width) / neurons.length) / 2)
		    / Math.PI),
	    margin = radius * 0.3,
	    ctx = canvas.getContext('2d'),
	    lastPos= {x: 0, y: 0},
	    getNextPos = function (lastPos) {
		if (lastPos.x == 0 && lastPos.y == 0) {
		    return { x: radius, y: radius };
		} else {
		    if (lastPos.x + 3 * radius > canvas.width) {
			return { x: radius, y: lastPos.y + 2 * radius };
		    } else if (lastPos.y + 2 * radius > canvas.height) {
			console.log('TODO');
		    } else {
			return { x: lastPos.x + 2 * radius, y: lastPos.y }
		    }
		}
	    };
	ctx.imageSmoothingEnabled = true;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	// Calculate neuron positions
	for (n in neurons) {
	    lastPos = getNextPos(lastPos);
	    neurons[n].pos = lastPos;
	}
	// Draw synapses
	for (s in synapses) {
	    var from = synapses[s].from.pos,
		to = synapses[s].to.pos,
		strength = synapses[s].strength;
	    ctx.beginPath();
	    ctx.moveTo(from.x, from.y);
	    ctx.lineTo(to.x, to.y);
	    ctx.lineWidth = Math.abs(strength) / 2
	    if (strength < 0) {
		ctx.setLineDash([4, 4]);
		ctx.lineDashOffset = 20;
	    }
	    ctx.strokeStyle = '#808080';
	    ctx.stroke();
	    ctx.lineWidth = 1;
	    ctx.setLineDash([]);
	}
	// Draw neurons
	for (n in neurons) {
	    var activation = neurons[n].currentActivation,
		pos = neurons[n].pos,
		name = neurons[n].name,
		linGrad = ctx.createLinearGradient(
		    pos.x + radius / 3, pos.y - radius / 6,
		    pos.x + radius / 3 + radius / 10, pos.y - radius / 6
		),
		fillGrad = ctx.createRadialGradient(
		    pos.x - margin, pos.y - margin , (radius - margin) / 4,
		    pos.x - margin, pos.y - margin, radius - margin);
	    linGrad.addColorStop(0, '#888');
	    linGrad.addColorStop(0.3, '#fff');
	    linGrad.addColorStop(0.7, '#fff');
	    linGrad.addColorStop(1, '#888');
	    fillGrad.addColorStop(0, '#ffffff');
	    fillGrad.addColorStop(1, '#f0f0f0');
	    ctx.beginPath();
	    ctx.fillStyle = fillGrad;
	    ctx.arc(pos.x, pos.y, radius - margin, 0, Math.PI * 2, true);
	    ctx.fill();
	    ctx.strokeStyle = '#a0a0a0';
	    ctx.stroke();
	    // Names
	    if (name) {
		ctx.fillStyle = '#606060';
		ctx.font = ''.concat(radius / 8,'px Hack, Courier, Verdana');
		ctx.fillText(name, pos.x - radius / 3, pos.y + radius / 2);
	    }
	    // Current activation
	    ctx.beginPath(); // Background for activation column
	    ctx.fillStyle = linGrad;
	    ctx.rect(pos.x + radius / 3,
		     pos.y - radius / 6,
		     radius / 10,
		     radius / 2);
	    ctx.fill();
	    ctx.fillStyle = '#60a060'; // Activation
	    ctx.fillRect(pos.x + radius / 3,
			 pos.y - activation * radius / 2 + radius / 3,
			 radius / 10,
			 activation * (radius / 2));
	    ctx.strokeStyle = '#d0d0d0';
	    ctx.rect(pos.x + radius / 3,
		     pos.y - radius / 6,
		     radius / 10,
		     radius / 2);
	    ctx.stroke();
	}
    };
    /**
     * Things to export.
     */
    return {
	makeCanvas: makeCanvas,
	paint: paint
    };
}());
