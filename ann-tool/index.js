function makeNetwork (type) {
    var network;
    switch (type) {
    case "ffn":
	console.log("Creating Feed-Forward Network.");
	break;
    case "ffn-demo":
	console.log("Creating Feed-Forward Network.");
	// Test code below
	network = new VisualANN.core.Network(
	    null, null, VisualANN.core.networkTypes.FFN);
	network = network.addNeuron(
	    new VisualANN.core.Neuron(VisualANN.activation.SIGMOID,
				      'in-1',
				      0,
				      null,
				      0));
	network = network.addNeuron(
	    new VisualANN.core.Neuron(VisualANN.activation.SIGMOID,
				      'in-2',
				      0,
				      null,
				      0));
	network = network.addNeuron(
	    new VisualANN.core.Neuron(VisualANN.activation.SIGMOID,
				      'out',
				      0,
				      null,
				      1));
	network = network.addSynapse(
	    new VisualANN.core.Synapse(
		network.getNeuron(0), network.getNeuron(2), 2));
	network = network.addSynapse(
	    new VisualANN.core.Synapse(
		network.getNeuron(1), network.getNeuron(2), -1));
	break;
    case "rnn":
	console.log("Creating Recurrent Neural Network.");
	break;
    case "rnn-demo":
	// Test code below
	network = new VisualANN.core.Network(
	    null, null, VisualANN.core.networkTypes.RNN);
	network = network.addNeuron(
	    new VisualANN.core.Neuron(
		VisualANN.activation.SIGMOID, 'in-1'));
	network = network.addNeuron(
	    new VisualANN.core.Neuron(
		VisualANN.activation.SIGMOID, 'in-2'));
	network = network.addNeuron(
	    new VisualANN.core.Neuron(
		VisualANN.activation.SIGMOID, 'in-3'));
	network = network.addNeuron(
	    new VisualANN.core.Neuron(
		VisualANN.activation.SIGMOID, 'out-1'));
	network = network.addNeuron(
	    new VisualANN.core.Neuron(
		VisualANN.activation.SIGMOID, 'out-2'));
	network = network.addNeuron(
	    new VisualANN.core.Neuron(
		VisualANN.activation.SIGMOID, 'out-3'));
	network = network.addSynapse(
	    new VisualANN.core.Synapse(
		network.getNeuron(0), network.getNeuron(3), -2));
	network = network.addSynapse(
	    new VisualANN.core.Synapse(
		network.getNeuron(0), network.getNeuron(4), -2));
	network = network.addSynapse(
	    new VisualANN.core.Synapse(
		network.getNeuron(1), network.getNeuron(4), 0));
	network = network.addSynapse(
	    new VisualANN.core.Synapse(
		network.getNeuron(2), network.getNeuron(5), 5));
	network = network.addSynapse(
	    new VisualANN.core.Synapse(
		network.getNeuron(2), network.getNeuron(4), 2));
	// Send initial activation    
	network.activate([
	    { neuron: network.getNeuron(0), value: 2 },
	    { neuron: network.getNeuron(1), value: -2 }
	]);
	break;
    default:
	//network = new VisualANN.core.Network();
    }
    return network;
}

function init () {
    var div = document.getElementById('canvasholder'),
	canvas = VisualANN.view.makeCanvas(div),
	network,
	draw = function (network, canvas) {
	    if (!network) { throw 'No network to draw.'; }
	    if (!canvas) { throw 'No canvas to draw onto.'; }
	    VisualANN.view.paint(network, canvas);
	},
	networkSelector = document.getElementById('network-type'),
	neuronPanel = document.getElementById('neuron-panel'),
	addNeuronButton = document.getElementById(
	    'add-neuron-button'),
	addSynapseButton = document.getElementById(
	    'add-synapse-button');
    // Hook up listeners
    networkSelector.onchange = function (event) {
	var type = event.target.value,
	    name = document.getElementById(
		"neuron-name"),
	    layerNumber = document.getElementById(
		"neuron-layer"),
	    layerNumberLabel = document.getElementById(
		"neuron-layer-label");
	switch (type) {
	case "ffn":
	    layerNumber.style.display = "initial";
	    layerNumberLabel.style.display = "initial";
	    break;
	default:
	    layerNumber.style.display = "none";
	    layerNumberLabel.style.display = "none";
	}
	network = makeNetwork(type);
    };
    addNeuronButton.onclick = function () {
	var name = document.getElementById("neuron-name").value,
	    layerNumber = document.getElementById(
		"neuron-layer").value,
	    selectFromNeuron = document.getElementById("synapse-from"),
	    selectToNeuron = document.getElementById("synapse-to"),
	    i;
	network = network.addNeuron(
	    new VisualANN.core.Neuron(VisualANN.activation.SIGMOID,
				      name,
				      0, // Initial activation
				      null, // Neuron to replace
				      layerNumber));
	// Update neuron select inputs
	for (i = selectFromNeuron.options.length ; i >= 0; i--) {
	    selectFromNeuron.remove(0);
	}
	network.getNeurons().map(
	    function (n) {
		var opt = document.createElement('option');
		opt.value = n;
		opt.innerHTML = n.getName();
		selectFromNeuron.appendChild(opt);
	    });
	for (i = selectToNeuron.options.length ; i >= 0; i--) {
	    selectToNeuron.remove(0);
	}
	network.getNeurons().map(
	    function (n) {
		var opt = document.createElement('option');
		opt.value = n;
		opt.innerHTML = n.getName();
		selectToNeuron.appendChild(opt);
	    });
	network.countLayers();
    };
    addSynapseButton.onclick = function () {
	var strength = document.getElementById(
		"synapse-strength").value;
	// TODO: Add check for layer number here
	network = network.addSynapse(
	    new VisualANN.core.Synapse(
		network.getNeuron(0), network.getNeuron(3), -2));
    };
    // Create network
    networkSelector.selectedIndex = 1;
    networkSelector.onchange({target: networkSelector});
    div.appendChild(canvas);
    draw(network, canvas);
    setTimeout(function () {
	VisualANN.view.setMessage('Setting inputs to 2 and -1.');
	draw(network, canvas);
	network.activate(
	    [{ neuron: network.getNeuron(0), value: 2 },
	     { neuron: network.getNeuron(1), value: -1 }]);
	setTimeout(function () {
	    VisualANN.view.setMessage('Switching inputs to -2 and 1.');
	    draw(network, canvas);
	    network.activate(
		[{ neuron: network.getNeuron(0), value: -2 },
		 { neuron: network.getNeuron(1), value: 1 }]);
	}, 3000);
    }, 2000);
}
