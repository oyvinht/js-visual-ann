var VisualANN = {};

VisualANN.activation = (function () {
    'use strict';
    var sigmoid = function (inputSum) {
	return 1 / (1 + Math.exp(- inputSum));
    };
    return {
	SIGMOID: sigmoid
    };
}());

VisualANN.core = (function () {
    'use strict';
    var
    /**
     * @private
     * @param {Network} network The network to generate
     * a new, activated, network from.
     * @param {Array} inputs An array of { neuron: \<Network\>,
     * value: \<number\> }-objects. Typically one such object per
     * input neuron.
     * @returns {Network} A network with updated neuron activations.
     */
    activate = function (network, inputs) {
	var sumInput = function (neuron) {
		var input = inputs.find(function (input) {
		    return input.neuron === neuron;
		});
		// If neuron is among input neurons return its value.
		if (input) {
		    return input.value;
		}
		// ... otherwise, collect inputs form other neurons
		return network.getSynapses().map(function (syn) {
		    if (syn.getToNeuron() === neuron) {
			return syn.getFromNeuron()
			    .getCurrentActivation() *
			    syn.getStrength();
		    } else {
			return 0;
		    }
		}).reduce(function (sum, val) { // ... and sum them.
		    return sum + val;
		}, 0);
	},
	    newNeurons = network.getNeurons().map(
		function (neuron) {
		    return neuron.activate(sumInput(neuron));
		}),
	    newSynapses = network.getSynapses().map(
		function (synapse) {
		    return new Synapse(
			newNeurons.find(function (neuron) {
			    return neuron.getSource() ===
				synapse.getFromNeuron();
			}),
			newNeurons.find(function (neuron) {
			    return neuron.getSource() ===
				synapse.getToNeuron();
			}),
			synapse.getStrength());
		});
	return new Network(newNeurons, newSynapses);
    },
    /**
     * Creates a new Network with an additional neuron added to it.
     * @private
     * @param {Network} network A network to add a new neuron to.
     * @param {Neuron} neuron - The new neuron to add.
     * @returns {Network}
     */
    addNeuron = function (network, neuron) {
	return new Network(network.getNeurons().concat(neuron),
			   network.getSynapses());
    },
    /**
     * Creates a new Network with an additional synapse added to it.
     * @private
     * @param {Network} network A network to add a new synapse to.
     * @param {Synapse} synapse - A synapse to add.
     * @returns {Network}
     */
    addSynapse = function (network, synapse) {
	return new Network(network.getNeurons(),
			   network.getSynapses().concat(synapse));
    },
    /**
     * A constructor for Network objects.
     * @param {Array<Neuron>} [neurons=[]] Initial neurons.
     * @param {Array<Synapse>} [synapses=[]] Initial synapses.
     * @returns {Network}
     */
    Network = function (neurons, synapses) {
	var neus = neurons || [],
	    syns = synapses || [];
	/**
	 * Creates a new Network by activating all neurons in the 
	 * network based on current neuron activations.
	 * @name Network.activate
	 * @param {Array<Object>} inputs An Array of Objects on the
	 * form { neuron: \<Neuron\>, value: \<number\> }.
	 * @returns {Network}
	 */
	this.activate = function (inputs) {
	    return activate(this, inputs);
	};
	/**
	 * Creates a new Network with a new neuron added to it.
	 * @name Network.addNeuron
	 * @param {Neuron} neuron The neuron to add.
	 * @returns {Network}
	 */
	this.addNeuron = function (neuron) {
	    return addNeuron(this, neuron);
	};
	/**
	 * Creates a new Network with a new synapse added to it.
	 * @name Network.addSynapse
	 * @param {Synapse} synapse The synapse to add.
	 * @returns {Network}
	 */
	this.addSynapse = function (synapse) {
	    return addSynapse(this, synapse);
	};
	/**
	 * Retrieve a specific neuron from the network.
	 * @name Network.getNeuron
	 * @param {number} i The index of the neuron to retrieve.
	 * @returns {Neuron}
	 */
	this.getNeuron = function (i) {
	    return neus[i];
	};
	/**
	 * Retrieve all neurons from the network.
	 * @name Network.getNeurons
	 * @returns {Array<Neuron>}
	 */
	this.getNeurons = function () {
	    return neus;
	};
	/**
	 * Retrieve a specific synapse from the network.
	 * @name Network.getSynapse
	 * @param {number} i The index of the synapse to retrieve.
	 * @returns {Synapse}
	 */
	this.getSynapse = function (i) {
	    return syns[i];
	};
	/**
	 * Retrieve all synapses from the network.
	 * @name Network.getSynapses
	 * @returns {Array<Synapse>}
	 */
	this.getSynapses = function () {
	    return syns;
	};
    },
    /**
     * A constructor for Neuron objects.
     * @param {Function} activationFunction An activation function
     * taking the sum of neuron inputs as its single argument.
     * @param {string} [name=''] A name to use for display purposes.
     * @param {number} [activation=0] The initial activation.
     * @param {Neuron} [source=undefined] A reference to a previous
     * neuron, if this neuron has replaced one.
     * @returns {Neuron}
     */
    Neuron = function (activationFunction, name, activation, source) {
	/**
	 * Create a new neuron by activating this one given the sum of
	 * inputs.
	 * @name Neuron.activate
	 * @param {number} inputSum The sum of inputs.
	 * @returns {Neuron}
	 */
	this.activate = function (inputSum) {
	    return new Neuron(activationFunction,
			      name,
			      activationFunction(inputSum),
			      this);
	};
	/**
	 * Get the current activation.
	 * @name Neuron.getCurrentActivation
	 * @returns {number}
	 */
	this.getCurrentActivation = function () {
	    return activation || 0;
	};
	/**
	 * Get a displayable name.
	 * @name Neuron.getName
	 * @returns {string}
	 */
	this.getName = function () { return name || ''; };
	/**
	 * Get the neuron that this neuron has replaced.
	 * @name Neuron.getSource
	 * @returns {Neuron}
	 */
	this.getSource =  function () { return source; };
    },
    requirements = document.createElement('script'),
    /**
     * A constructor for Synapse objects.
     * @param {Neuron} fromNeuron
     * @param {Neuron} toNeuron
     * @param {number} strength
     * @returns {Synapse}
     */
    Synapse = function (fromNeuron, toNeuron, strength) {
	/**
	 * @name Synapse.getFromNeuron
	 * @returns {Neuron}
	 */
	this.getFromNeuron = function () { return fromNeuron; };
	/**
	 * @name Synapse.getToNeuron
	 * @returns {Neuron}
	 */
	this.getToNeuron = function () { return toNeuron; };
	/**
	 * @name Synapse.getStrength
	 * @returns {number}
	 */
	this.getStrength = function () { return strength; };
    };
    // Things to require.
    requirements.setAttribute('src', 'js-visual-ann/visual-ann-view.js');
    document.head.append(requirements);
    // Things to export.
    return {
	Network: Network,
	Neuron: Neuron,
	Synapse: Synapse
    };
}());
