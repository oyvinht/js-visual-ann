var VisualANN = (function () {
    var
    /**
     * @param {Object} network - The network to activate.
     * @param {Object} inputs - An array of activations per input neuron.
     * @param {Object} - A network with updated neuron activations.
     */
    activate = function (network, inputs) {
	var newNetwork = makeNetwork(),
	    sumInput = function (neuron) {
		var syn,
		    input,
		    inputSum = 0;
		// See if it is among inputs
		for (input in inputs) {
		    if (inputs[input].neuron === neuron) {
			return inputs[input].activation;
		    }
		}
		// ... otherwise, activate based on other neurons.
		for (s in network.synapses) {
		    syn = network.synapses[s];
		    if (syn.to === neuron) {
			inputSum += syn.from.currentActivation
			    * syn.strength;
		    }
		}
		console.log('' + neuron.name + ' ' + inputSum);
		return inputSum;
	    },
	    n;
	// Create neurons with updated activation.
	for (i in network.neurons) {
	    n = network.neurons[i];
	    newNetwork = addNeuron(newNetwork, n.activate(sumInput(n)));
	}
	return newNetwork;
    },
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
     * @param {Function} activationfunction - 
     * neuron activation level given the sum of inputs.
     * @param {string} name - A name to display in the gui.
     * @returns {object} A neuron that can be used in a network.
     */
    makeNeuron = function (activationFunction, name) {
	return {
	    activate: function (inputSum) {
		var n = makeNeuron(activationFunction, name);
		n.currentActivation = activationFunction(inputSum);
		return n;
	    },
	    currentActivation: 0,
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
			console.log('TODO');
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
	    ctx.strokeStyle = '#808080';
	    ctx.stroke();
	}
	// Draw neurons
	for (n in neurons) {
	    var activation = neurons[n].currentActivation,
		pos = neurons[n].pos,
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
	    ctx.strokeStyle = '#a0a0a0';
	    ctx.stroke();
	    // Names
	    if (name) {
		ctx.fillStyle = '#606060';
		ctx.font = '16px Hack';
		ctx.fillText(name, pos.x - radius / 3, pos.y + radius / 2);
	    }
	    // Current activation
	    ctx.fillStyle = '#60a060';
	    ctx.fillRect(pos.x + radius / 3,
			 pos.y - activation * radius / 2 + radius / 3,
			 radius / 10,
			 activation * (radius / 2));
	    ctx.beginPath();
	    ctx.strokeStyle = '#606060';
	    ctx.rect(pos.x + radius / 3,
		     pos.y - radius / 6,
		     radius / 10,
		     radius / 2);
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
	activate: activate,
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
