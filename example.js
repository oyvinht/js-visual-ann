function init () {
    var div = document.getElementById('canvasholder'),
	canvas = VisualANN.view.makeCanvas(div),
	draw = function () {
	    VisualANN.view.paint(network, canvas);
	    network = network.activate([]);
	};
    div.appendChild(canvas);
    // Create a network
    network = new VisualANN.core.Network();
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
    network = network.activate([
	{ neuron: network.getNeuron(0), value: 2 },
	{ neuron: network.getNeuron(1), value: -2 }
    ]);
    draw();
    setInterval(draw, 1000);
}
