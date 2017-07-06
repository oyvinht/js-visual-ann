var VisualANN = {};

VisualANN.activation = (function () {
    var sigmoid = function (inputSum) {
	return 1 / (1 + Math.exp(- inputSum));
    };
    return {
	SIGMOID: sigmoid
    };
}());

VisualANN.core = (function () {
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
		    numInputs = 0,
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
			numInputs += 1;
			inputSum += syn.from.currentActivation
			    * syn.strength;
		    }
		}
		return inputSum;
	    },
	    n,
	    s,
	    from,
	    findNeuronFromSource = function (source) {
		for (i in newNetwork.neurons) {
		    if (newNetwork.neurons[i].source === source) {
			return newNetwork.neurons[i];
		    }
		}
		return null;
	    },
	    to;
	// Create neurons with updated activation.
	for (i in network.neurons) {
	    n = network.neurons[i];
	    newNetwork = addNeuron(newNetwork, n.activate(sumInput(n)));
	}
	// Create synapses
	for (i in network.synapses) {
	    s = network.synapses[i];
	    from = findNeuronFromSource(s.from);
	    to = findNeuronFromSource(s.to);
	    newNetwork = addSynapse(
		newNetwork, makeSynapse(from, to, s.strength));
	}
	return newNetwork;
    },
    /**
     * @param {Object} network - A network to extend.
     * @param {Object} neuron - A neuron to add.
     * @returns - A new network.
     */
    addNeuron = function (network, neuron) {
	network.neurons = network.neurons.concat(neuron);
	return network;
    },
    /**
     * @param {Object} network - A network to extend.
     * @param {Object} synapse - A synapse to add.
     * @returns - A new network.
     */
    addSynapse = function (network, synapse) {
	network.synapses = network.synapses.concat(synapse);
	return network;
    },
    makeNetwork = function () {
	return {
	    activate: function (inputs) {
		return activate(this, inputs);
	    },
	    addNeuron: function (neuron) {
		return addNeuron(this, neuron);
	    },
	    addSynapse: function (synapse) {
		return addSynapse(this, synapse);
	    },
	    neurons: [], synapses: []
	};
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
		n.source = this;
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
    requirements = document.createElement('script');
    /**
     * Things to require.
     */
    requirements.setAttribute('src', 'js-visual-ann/visual-ann-view.js');
    document.head.append(requirements);
    /**
     * Things to export.
     */
    return {
	makeNetwork: makeNetwork,
	makeNeuron: makeNeuron,
	makeSynapse: makeSynapse
    };
}());
