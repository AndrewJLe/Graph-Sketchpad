/* Andrew Le
 * Graph Theory 453
 * WSU Fall 2021
 * 11701998
*/

/********** INITIALIZE START ***********/
var info = document.getElementById('info');
var cy = cytoscape({
    container: document.getElementById('cy'),
    elements: [],
    style: [ // the stylesheet for the graph
        {
            selector: 'node',
            style: {
                'background-color': 'rgb(0, 130, 252)',
                'label': 'data(id)',
                'borderWidth': '1',
            },
        },

        {
            selector: 'edge',
            style: {
                'width': 2,
                'line-color': '#a0a0a0',
                'target-arrow-color': '#000000',
                'curve-style': 'bezier',
                "label": "data(id)"
            },
        },
    ]

});

// Settings
var enableNodeCreation = true;
var toggleDirectedModeFlag = true;

// Vertices Info
var vertexID = 0;
var selectedVertex;

// Edges Info
var edgeID = 0;
var edgeSource;
var edgeTarget;
/********** INITIALIZE END ***********/

/********** EVENTS START ***********/

// Directed Edges Toggle
document.addEventListener('keydown', toggleDirectedMode);
function toggleDirectedMode(e) {
    if (e.ctrlKey) {
        if (toggleDirectedModeFlag) {
            console.log('directed mode enabled')
            cy.style().selector('edge').style({
                'target-arrow-shape': 'triangle',
            }).update();
        }
        else {
            console.log('undirected mode disabled')
            cy.style().selector('edge').style({
                'target-arrow-shape': 'none',
            }).update();
        }
        toggleDirectedModeFlag = !toggleDirectedModeFlag;
    }
}

// Add Node on click
cy.on('click', function (e) {
    if (enableNodeCreation) {
        var vertex = cy.add({
            group: 'nodes',
            data: { id: 'v' + vertexID },
            renderedPosition: {
                x: e.renderedPosition.x,
                y: e.renderedPosition.y,
            }
        });
        selectedVertex = vertex;
        vertexID += 1; // update vertexID
        clearEdgeSourceTarget()
        updateVerticesInfo();
        updateCurrentVertex(vertex);
    }
});

// update selected vertex
cy.on('click', 'node', function (e) {
    selectedVertex = this;
    updateCurrentVertex(this);
});

// Add Edge on double selection
cy.on('click', 'node', function (e) {
    selectedVertex = this;
    if (edgeSource == null) {
        edgeSource = this;
        return;
    }
    else if (edgeSource != null) {
        edgeTarget = this;
        cy.add({
            group: 'edges',
            data: {
                id: 'e' + edgeID,
                source: edgeSource.id(),
                target: edgeTarget.id()
            },
        });
        edgeID += 1;
        updateCurrentVertex(this);
    }
    updateEdgesInfo();
    clearEdgeSourceTarget()
});

// Clear Edge source/target
function clearEdgeSourceTarget() {
    edgeSource = null;
    edgeTarget = null;
}

// Delete Edge on right-click
cy.on('cxttap', "edge", function (e) {
    cy.remove(this);
    updateEdgesInfo();
});

// Delete Node on right-click
cy.on('cxttap', "node", function (e) {
    cy.remove(this);
    updateEdgesInfo();
    updateVerticesInfo();
});

/********** EVENTS END ***********/

/********** QUALITY OF LIFE START ***********/
// Disable node creation while hovering node
cy.on('mouseover', 'node', function (event) {
    enableNodeCreation = false;
    // console.log('hovering ' + this.id());
});

// Enable node creation while not hovering node
cy.on('mouseout', 'node', function (evt) {
    // console.log('now unhovering ' + this.id());
    enableNodeCreation = true;
});

// Print Edge ID on Hover
cy.on('mouseover', 'edge', function (evt) {
    // console.log('hovering ' + this.id());
});

cy.on('mouseout', 'edge', function (evt) {
    // console.log('now unhovering ' + this.id());
});
/********** QUALITY OF LIFE END ***********/

/********** INFO START ***********/
function updateVerticesInfo() {
    var infoNumVertices = document.getElementById('numberVertices');
    infoNumVertices.innerHTML = "Number of Vertices: " + cy.nodes().size()
}

function updateEdgesInfo() {
    var infoNumEdges = document.getElementById('numberEdges');
    infoNumEdges.innerHTML = "Number of Edges: " + cy.edges().size();
}

function updateCurrentVertex(vertex) {
    var infoCurrentVertex = document.getElementById('currentVertex');
    infoCurrentVertex.innerHTML = "Selected Vertex: " + vertex.id() + " | Degrees: " + vertex.degree();
}

/********** INFO END ***********/