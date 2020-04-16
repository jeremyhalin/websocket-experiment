document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded!'); 
    let WS = new WebSocket("ws://localhost:9999");
    
    var width = window.innerWidth;
    var height = window.innerHeight - 25;
    
    // first we need Konva core things: stage and layer
    var stage = new Konva.Stage({
        container: 'container',
        width: width,
        height: height
    });

    WS.onopen = function() {
        var layer = new Konva.Layer();
        stage.add(layer);

        var isPaint = false;
        var mode = 'brush';
        var lastLine;
        
        stage.on('mousedown touchstart', function(e) {
            isPaint = true;
            var pos = stage.getPointerPosition();
            lastLine = new Konva.Line({
                stroke: '#df4b26',
                strokeWidth: 5,
                globalCompositeOperation:
                mode === 'brush' ? 'source-over' : 'destination-out',
                points: [pos.x, pos.y]
            });
            layer.add(lastLine);
        });
        
        stage.on('mouseup touchend', function() {
            isPaint = false;
            WS.send(stage.toJSON());
        });
        
        // and core function - drawing
        stage.on('mousemove touchmove', function() {
            if (!isPaint) {
                return;
            }
            
            const pos = stage.getPointerPosition();
            var newPoints = lastLine.points().concat([pos.x, pos.y]);
            lastLine.points(newPoints);
            layer.batchDraw();
        });
        
        var select = document.getElementById('tool');
        select.addEventListener('change', function() {
            mode = select.value;
        });        
    }
    
    WS.onmessage = function(event) {
        console.log(event.data);
        
        var layer = Konva.Node.create(event.data, 'container');
        stage.destroyChildren()
        stage.add(layer);
    }
})
