VisualANN.view = (function () {
    var
    calculateRadius = function (canvas, numNeurons) {
	return Math.sqrt(((
	    (canvas.height * canvas.width) / numNeurons) /
		   2) / Math.PI);
    },
    /**
     * Create a canvas to render the network to.
     * @param {Element} div - The intended place to put the canvas.
     * @returns {Canvas}
     */
    makeCanvas = function (div) {
	var cvs = document.createElement('canvas');
	cvs.setAttribute('height', div.clientHeight);
	cvs.setAttribute('width', div.clientWidth);
	document.addEventListener('activating', function (e) {
	    paintNeuron(e.detail.neuron, cvs, null, true);
	});
	return cvs;
    },
    neuronPositions = [],

    /**
     * Draw (or redraw) a neuron onto canvas.
     * @param {Neuron} neuron - The neuron to (re)draw.
     * @param {Canvas} canvas - A canvas to draw onto.
     * @param {number} radius - The neuron radius to use.
     */
    paintNeuron = function (neuron, canvas, radius, isActivating) {
	var ctx = canvas.getContext('2d'),
	    name = neuron.getName(),
	    pos = neuronPositions[name],
	    r = radius || pos.r,
	    activation = neuron.getCurrentActivation(),
	    margin = r * 0.3,
	    linGrad = ctx.createLinearGradient(
		pos.x + r / 3, pos.y - r / 6,
		pos.x + r / 3 + r / 10, pos.y - r / 6
	    ),
	    fillGrad = ctx.createRadialGradient(
		pos.x - margin, pos.y - margin , (r - margin) / 4,
		pos.x - margin, pos.y - margin, r - margin);
	linGrad.addColorStop(0, '#888');
	linGrad.addColorStop(0.3, '#fff');
	linGrad.addColorStop(0.7, '#fff');
	linGrad.addColorStop(1, '#888');
	fillGrad.addColorStop(0, '#ffffff');
	fillGrad.addColorStop(1, '#f0f0f0');	
	ctx.beginPath();
	ctx.fillStyle = fillGrad;
	ctx.arc(pos.x, pos.y, r - margin, 0, Math.PI * 2, true);
	ctx.fill();
	ctx.strokeStyle = '#a0a0a0';
	ctx.stroke();
	// Names
	if (name) {
	    ctx.fillStyle = '#606060';
	    ctx.font = ''.concat(r / 8,'px Hack, Courier, Verdana');
	    ctx.fillText(name, pos.x - r / 3, pos.y + r / 2);
	}
	// Current activation
	ctx.beginPath(); // Background for activation column
	ctx.fillStyle = linGrad;
	ctx.rect(pos.x + r / 3,
		 pos.y - r / 6,
		 r / 10,
		 r / 2);
	ctx.fill();
	ctx.fillStyle = '#60a060'; // Activation
	ctx.fillRect(pos.x + r / 3,
		     pos.y - activation * r / 2 + r / 3,
		     r / 10,
		     activation * (r / 2));
	if (isActivating) {
	    ctx.save();
	    ctx.strokeStyle = '#a0b0c0';
	    ctx.lineWidth = 4;
	    setTimeout(function () {
		paintNeuron(neuron, canvas, radius, false);
	    }, 1000);
	}
	ctx.rect(pos.x + r / 3,
		 pos.y - r / 6,
		 r / 10,
		 r / 2);
	ctx.stroke();
	ctx.restore();
    },
    /**
     * @param {Network} network - The network to draw.
     * @param {Canvas} canvas - A canvas to draw onto.
     */
    paint = function (network, canvas) {
	if (network && canvas) {
	    var neurons = network.getNeurons(),
		radius = calculateRadius(canvas, neurons.length),
		ctx = canvas.getContext('2d'),
		getNextPos = function (pos) {
		    // Find next position in a grid
		    if (pos.x == 0 && pos.y == 0) {
			return { x: radius, y: radius };
		    } else {
			if (pos.x + 3 * radius > canvas.width) {
			    return {
				r: radius,
				x: radius,
				y: pos.y + 2 * radius
			    };
			} else if (pos.y + 2 * radius > canvas.height) {
			    return {
				r: radius,
				x: pos.x + 2 * radius,
				y: radius
			    };
			} else {
			    return {
				r: radius,
				x: pos.x,
				y: pos.y + 2 * radius
			    };
			}
		    }
		};
	    ctx.imageSmoothingEnabled = true;
	    ctx.clearRect(0, 0, canvas.width, canvas.height);
	    // Calculate neuron positions
	    neuronPositions = neurons.reduce(function (res, neuron) {
		if (Object.keys(res.neuronPositions).length > 0) {
		    res.neuronPositions[neuron.getName()] =
			getNextPos(
			    res.neuronPositions[res.last.getName()]);
		} else {
		    res.neuronPositions[neuron.getName()] = 
			{ r: radius, x: radius, y: radius };
		}
		res.last = neuron;
		return res;
	    }, { neuronPositions: [] }).neuronPositions;
	    // Draw synapses
	    network.getSynapses().map(function (synapse) {
		var from = neuronPositions[synapse
					   .getFromNeuron()
					   .getName()],
		    to = neuronPositions[synapse
					 .getToNeuron()
					 .getName()],
		    strength = synapse.getStrength();
		ctx.beginPath();
		ctx.moveTo(from.x, from.y);
		ctx.lineTo(to.x, to.y);
		ctx.save();
		ctx.lineWidth = Math.abs(strength) / 2;
		if (strength < 0) {
		    ctx.setLineDash([4, 4]);
		    ctx.lineDashOffset = 20;
		}
		ctx.strokeStyle = '#808080';
		ctx.stroke();
		ctx.restore();
	    });
	    // Draw neurons
	    neurons.map(function (neuron) {
		paintNeuron(neuron, canvas);
	    });
	}
    };
    // Things to export.
    return {
	makeCanvas: makeCanvas,
	paint: paint
    };
}());
