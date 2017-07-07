# Network

A constructor for Network objects.

**Parameters**

-   `neurons` **[Array&lt;Neuron&gt;]** Initial neurons. (optional, default `[]`)
-   `synapses` **[Array&lt;Synapse&gt;]** Initial synapses. (optional, default `[]`)

Returns **Network** 

# Network.activate

Creates a new Network by activating all neurons in the 
network based on current neuron activations.

**Parameters**

-   `inputs` **Array&lt;Object&gt;** An Array of Objects on the
    form { neuron: \<Neuron\>, value: \<number\> }.

Returns **Network** 

# Network.addNeuron

Creates a new Network with a new neuron added to it.

**Parameters**

-   `neuron` **Neuron** The neuron to add.

Returns **Network** 

# Network.addSynapse

Creates a new Network with a new synapse added to it.

**Parameters**

-   `synapse` **Synapse** The synapse to add.

Returns **Network** 

# Network.getNeuron

Retrieve a specific neuron from the network.

**Parameters**

-   `i` **number** The index of the neuron to retrieve.

Returns **Neuron** 

# Network.getNeurons

Retrieve all neurons from the network.

Returns **Array&lt;Neuron&gt;** 

# Network.getSynapse

Retrieve a specific synapse from the network.

**Parameters**

-   `i` **number** The index of the synapse to retrieve.

Returns **Synapse** 

# Network.getSynapses

Retrieve all synapses from the network.

Returns **Array&lt;Synapse&gt;** 

# Neuron

A constructor for Neuron objects.

**Parameters**

-   `activationFunction` **Function** An activation function
    taking the sum of neuron inputs as its single argument.
-   `name` **[string]** A name to use for display purposes. (optional, default `''`)
-   `activation` **[number]** The initial activation. (optional, default `0`)
-   `source` **[Neuron]** A reference to a previous
    neuron, if this neuron has replaced one. (optional, default `undefined`)

Returns **Neuron** 

# Neuron.activate

Create a new neuron by activating this one given the sum of
inputs.

**Parameters**

-   `inputSum` **number** The sum of inputs.

Returns **Neuron** 

# Neuron.getCurrentActivation

Get the current activation.

Returns **number** 

# Neuron.getName

Get a displayable name.

Returns **string** 

# Neuron.getSource

Get the neuron that this neuron has replaced.

Returns **Neuron** 

# Synapse

A constructor for Synapse objects.

**Parameters**

-   `fromNeuron` **Neuron** 
-   `toNeuron` **Neuron** 
-   `strength` **number** 

Returns **Synapse** 

# Synapse.getFromNeuron

Returns **Neuron** 

# Synapse.getStrength

Returns **number** 

# Synapse.getToNeuron

Returns **Neuron** 
