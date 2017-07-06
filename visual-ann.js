var VisualANN = (function () {
    var
    /**
     * @param {Object} network - The network to activate.
     * @param {Object} - A new network with updated activation
     
    activate = function (network) {
	var currentActivations = [],
	    i;
	for (i = 0, i < network.neurons.length; 
	for (n in network) {
	    currentActivations.push(network[n].currentActivation);
	}
    },*/
    /**
     * @param {Object} network - A network to extend.
     * @param {Object} neuron - A neuron to add.
     * @returns - A new network.
     */
    addNeuron = function (network, neuron) {
	return {
	    neurons: network.neurons.concat(neuron),
	    synapses: network.synapses
	};
    },
    /**
     * @param {Object} network - A network to extend.
     * @param {Object} synapse - A synapse to add.
     * @returns - A new network.
     */
    addSynapse = function (network, synapse) {
	return {
	    neurons: network.neurons,
	    synapses: network.synapses.concat(synapse)
	};
    },
    /**
     * @param {Element} div - The intended place to put the canvas.
     */
    makeCanvas = function (div) {
	var cvs = document.createElement('canvas');
	cvs.setAttribute('height', div.clientHeight);
	cvs.setAttribute('width', div.clientWidth);
	return cvs;
    },
    makeNetwork = function () {
	return { neurons: [], synapses: [] }
    },
    /**
     * @param {number} activationfunction - a function that calculates
     * neuron activation level given the sum of inputs.
     * @param {string} name - a name to display in the gui.
     * @returns {object} a neuron that can be used in a network.
     */
    makeNeuron = function (activationfunction, name) {
	return {
	    activate: activationfunction,
	    currentactivation: 0,
	    name: name
	};
    },
    /**
     * @param {object} fromneuron - the source.
     * @param {object toneuron - the target.
     * @param {number} strength - the "weight" of the connection.
     */
    makeSynapse = function (fromNeuron, toNeuron, strength) {
	return {
	    from: fromNeuron,
	    strength: strength,
	    to: toNeuron
	};
    },
    nextActivation = function (neuron) {
	var inputSum = 0,
	    syn;
	for (s in synapses) {
	    syn = synapse[s];
	    if (syn.to === neuron) {
		inputSum += syn.from.currentActivation * syn.strength;
	    }
	}
	return neuron.activate(inputSum);
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
	// Calculate neuron positions
	for (n in neurons) {
	    lastPos = getNextPos(lastPos);
	    neurons[n].pos = lastPos;
	}
	// Draw synapses
	for (s in synapses) {
	    var from = synapses[s].from.pos,
		to = synapses[s].to.pos;
	    ctx.beginPath();
	    ctx.moveTo(from.x, from.y);
	    ctx.lineTo(to.x, to.y);
	    ctx.stroke();
	}
	// Draw neurons
	for (n in neurons) {
	    var pos = neurons[n].pos,
		name = neurons[n].name,
		fillGrad = ctx.createRadialGradient(
		    pos.x - margin, pos.y - margin , (radius - margin) / 4,
		    pos.x - margin, pos.y - margin, radius - margin);
	    fillGrad.addColorStop(0, '#ffffff');
	    fillGrad.addColorStop(1, '#f0f0f0');
	    ctx.beginPath();
	    ctx.fillStyle = fillGrad;
	    ctx.arc(pos.x, pos.y, radius - margin, 0, Math.PI * 2, true);
	    ctx.fill();
	    ctx.stroke();
	    // Names
	    if (name) {
		ctx.fillStyle = 'black';
		ctx.font = '16px Hack';
		ctx.fillText(name, pos.x - radius / 3, pos.y + radius / 2);
	    }
	    // Current activation
	    console.log(neurons[n].currentActivation);
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
	addSynapse: addSynapse,
	makeCanvas: makeCanvas,
	makeNetwork: makeNetwork,
	makeNeuron: makeNeuron,
	makeSynapse: makeSynapse,
	paint: paint,
	SIGMOID_ACTIVATION: SIGMOID_ACTIVATION
    };
}());
