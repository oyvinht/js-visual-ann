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
	var cvs = document.createElement('canvas'),
	    ctx = cvs.getContext('2d');
	cvs.setAttribute('height', div.clientHeight);
	cvs.setAttribute('width', div.clientWidth);
	document.addEventListener('activating', function (e) {
	    paintNeuron(e.detail.neuron, ctx, null, true);
	});
	document.addEventListener('layeractivated', function (e) {
	    setTimeout(function () {
		paintSynapses(e.detail.network, ctx, e.detail.neurons);
		setTimeout(function () {
		    paintSynapses(e.detail.network, ctx, []);
		}, 200);
	    }, 600);
	});
	return cvs;
    },
    message,
    neuronPositions = [],
    paintNeuronActivation = function (neuron, ctx, radius,
				      isActivating, activation) {
	var act = activation || neuron.getCurrentActivation(),
	    actDiff = neuron.getCurrentActivation() - act,
	    pos = neuronPositions[neuron.getName()],
	    r = pos.r,
	    linGrad = ctx.createLinearGradient(
		pos.x, pos.y - r / 9,
		pos.x + r / 10, pos.y - r / 9
	    );
	linGrad.addColorStop(0, '#888');
	linGrad.addColorStop(0.3, '#fff');
	linGrad.addColorStop(0.7, '#fff');
	linGrad.addColorStop(1, '#888');
	ctx.beginPath(); // Background for activation column
	ctx.fillStyle = linGrad;
	ctx.rect(pos.x,
		 pos.y - r / 3,
		 r / 10,
		 r / 2);
	ctx.fill();
	ctx.fillStyle = '#60a060'; // Activation
	ctx.fillRect(pos.x,
		     pos.y - act * r / 2 + r / 6,
		     r / 10,
		     act * (r / 2));

	if (isActivating || Math.abs(actDiff) > 0.1) {
	    setTimeout(function () {
		paintNeuronActivation(
		    neuron, ctx, radius, false,
		    act + actDiff / 5);
	    }, 50);
	}
	ctx.rect(pos.x,
		 pos.y - r / 3,
		 r / 10,
		 r / 2);
	ctx.stroke();
	ctx.restore();	
    },
    /**
     * Draw (or redraw) a neuron on 2d context.
     * @param {Neuron} neuron - The neuron to (re)draw.
     * @param {2DContext} ctx - A context to draw in.
     * @param {number} radius - The neuron radius to use.
     */
    paintNeuron = function (neuron, ctx, radius, isActivating) {
	var name = neuron.getName(),
	    inSum = neuron.getInputSum(),
	    pos = neuronPositions[name],
	    r = radius || pos.r,
	    margin = r * 0.3,
	    fillGrad = ctx.createRadialGradient(
		pos.x - margin, pos.y - margin , (r - margin) / 4,
		pos.x - margin, pos.y - margin, r - margin);
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
	// Input
	if (inSum != null) {
	    ctx.fillStyle = '#606060';
	    ctx.font = ''.concat(r / 12,'px Hack, Courier, Verdana');
	    ctx.fillText('-> '.concat(
		inSum.toFixed(2)),
			 pos.x - r + margin * 1.2,
			 pos.y + r / 50);
	}
	// Output
	if (inSum != null) {
	    ctx.fillStyle = '#606060';
	    ctx.font = ''.concat(r / 12,'px Hack, Courier, Verdana');
	    ctx.fillText(''.concat(
		neuron.getCurrentActivation().toFixed(2), ' ->'),
			 pos.x + r - margin * 2.3,
			 pos.y + r / 50);
	}
	// Animate activation change
	paintNeuronActivation(neuron, ctx, radius, isActivating);
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
	    // Message on top
	    if (this.message) {
		ctx.fillStyle = '#606060';
		ctx.font = '10px Hack, Courier, Verdana';
		ctx.fillText(this.message, 10, 10);
	    }
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
	    paintSynapses(network, ctx);
	    // Draw neurons
	    //neurons.map(function (neuron) {
	//	paintNeuron(neuron, ctx);
	 //   });
	}
    },
    // Draw synapses
    paintSynapses = function (network, ctx, activeFromNeurons) {
	network.getSynapses().map(function (synapse) {
	    var actFrom = activeFromNeurons || [],
		fromNeuron = synapse.getFromNeuron();
	    paintSynapseActivity(
		fromNeuron,
		synapse.getToNeuron(),
		synapse.getStrength(),
		ctx,
		actFrom.some(function (actFromNeuron) {
		    return fromNeuron === actFromNeuron;
		}));
	});
    },
    paintSynapseActivity = function (from, to, strength, ctx, activity) {
	var fromPos = neuronPositions[from.getName()],
	    toPos = neuronPositions[to.getName()];
	ctx.beginPath();
	ctx.moveTo(fromPos.x, fromPos.y);
	ctx.lineTo(toPos.x, toPos.y);
	ctx.save();
	if (activity) {
	    ctx.lineWidth = Math.abs(strength);
	    ctx.shadowBlur = 10;
	    ctx.shadowColor = '#000000';
	} else {
	    ctx.lineWidth = Math.abs(strength) * 10;
	    ctx.strokeStyle = '#ffffff';
	    ctx.stroke();
	}
	if (strength < 0) {
	    ctx.setLineDash([4, 4]);
	    ctx.lineDashOffset = 20;
	}
	ctx.lineWidth = Math.abs(strength) / 2;
	ctx.strokeStyle = '#808080';
	ctx.stroke();
	ctx.restore();
	paintNeuron(from, ctx);
	paintNeuron(to, ctx);
    },
    setMessage = function (message) {
	this.message = message;
    };
    // Things to export.
    return {
	makeCanvas: makeCanvas,
	paint: paint,
	setMessage: setMessage
    };
}());
