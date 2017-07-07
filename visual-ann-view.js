VisualANN.view = (function () {
    var
    /**
     * Create a canvas to render the network to.
     * @param {Element} div - The intended place to put the canvas.
     * @returns {Canvas}
     */
    makeCanvas = function (div) {
	var cvs = document.createElement('canvas');
	cvs.setAttribute('height', div.clientHeight);
	cvs.setAttribute('width', div.clientWidth);
	return cvs;
    },
    /**
     * @param {Network} network - The network to draw.
     * @param {Canvas} canvas - A canvas to draw onto.
     */
    paint = function (network, canvas) {
	var neurons = network.getNeurons(),
	    radius = Math.sqrt(((
		(canvas.height * canvas.width) / neurons.length) /
				2) / Math.PI),
	    margin = radius * 0.3,
	    ctx = canvas.getContext('2d'),
	    getNextPos = function (pos) {
		// Find next position in a grid
		if (pos.x == 0 && pos.y == 0) {
		    return { x: radius, y: radius };
		} else {
		    if (pos.x + 3 * radius > canvas.width) {
			return {
			    x: radius,
			    y: pos.y + 2 * radius
			};
		    } else if (pos.y + 2 * radius > canvas.height) {
			return {
			    x: pos.x + 2 * radius,
			    y: radius
			};
		    } else {
			return {
			    x: pos.x,
			    y: pos.y + 2 * radius
			};
		    }
		}
	    };
	ctx.imageSmoothingEnabled = true;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	// Calculate neuron positions
	neurons = neurons.reduce(function (res, neuron) {
	    if (res.length > 0) {
		neuron.pos = getNextPos(res[res.length - 1].pos);
	    } else {
		neuron.pos = { x: radius, y: radius };
	    }
	    return res.concat(neuron);
	}, []);
	// Draw synapses
	network.getSynapses().map(function (synapse) {
	    var from = synapse.getFromNeuron().pos,
		to = synapse.getToNeuron().pos,
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
	    var activation = neuron.getCurrentActivation(),
		pos = neuron.pos,
		name = neuron.getName(),
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
	});
    };
    // Things to export.
    return {
	makeCanvas: makeCanvas,
	paint: paint
    };
}());
