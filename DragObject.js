        var cellSize = 1.0;
        
        var lastMouseX = -1;
        var lastMouseY = -1;
        
        var draggedTransformNode = null;
        
        //vectors in 3D world space, associated to mouse x/y movement on the screen
        var draggingUpVec    = null;
        var draggingRightVec = null;
        
        var unsnappedDragPos = null;

        
        //------------------------------------------------------------------------------------------------------------------
        
        var mouseMoved = function(event)
        {
            //offsetX / offsetY polyfill for FF
            var target = event.target || event.srcElement;
            var rect = target.getBoundingClientRect();
            event.offsetX = event.clientX - rect.left;
            event.offsetY = event.clientY - rect.top;
        
            if (lastMouseX === -1)
            {
                lastMouseX = event.offsetX;
            }
            if (lastMouseY === -1)
            {
                lastMouseY = event.offsetY;
            }

            if (draggedTransformNode)
            {
               dragObject(event.offsetX - this.lastMouseX, event.offsetY - this.lastMouseY);
            }

            lastMouseX = event.offsetX;
            lastMouseY = event.offsetY;
        };
        
        //------------------------------------------------------------------------------------------------------------------
        
        var startDragging = function(transformNode)
        {        
            //disable navigation during dragging
            document.getElementById("navInfo").setAttribute("type", '"NONE"');
                       
            draggedTransformNode = transformNode;            
            unsnappedDragPos     = new x3dom.fields.SFVec3f.parse(transformNode.getAttribute("translation"));
            
            
            //compute the dragging vectors in world coordinates
            //(since navigation is disabled, those will not change until dragging has been finished)

            //get the viewer's 3D local frame
            var x3dElem  = document.getElementById("x3dElement");
            var vMatInv  = x3dElem.runtime.viewMatrix().inverse();            
            var viewDir  = vMatInv.multMatrixVec(new x3dom.fields.SFVec3f(0.0, 0.0, -1.0));
            
            //use the viewer's up-vector and right-vector
            draggingUpVec    = vMatInv.multMatrixVec(new x3dom.fields.SFVec3f(0.0, 1.0,  0.0));;
            draggingRightVec = viewDir.cross(this.draggingUpVec);   

            
            //project a world unit to the screen to get its size in pixels            
            var x3dElem  = document.getElementById("x3dElement");
            var p1 = x3dElem.runtime.calcCanvasPos(unsnappedDragPos.x, unsnappedDragPos.y, unsnappedDragPos.z);
            var p2 = x3dElem.runtime.calcCanvasPos(unsnappedDragPos.x + draggingRightVec.x,
                                                   unsnappedDragPos.y + draggingRightVec.y,
                                                   unsnappedDragPos.z + draggingRightVec.z)
            var magnificationFactor = 1.0 / Math.abs(p1[0] - p2[0]);
            
            //scale up vector and right vector accordingly            
            draggingUpVec    = draggingUpVec.multiply(magnificationFactor);
            draggingRightVec = draggingRightVec.multiply(magnificationFactor);            
        };

        //------------------------------------------------------------------------------------------------------------------

        var dragObject = function(dx, dy)
        {
            //scale up vector and right vector accordingly            
            var offsetUp    = draggingUpVec.multiply(-dy);
            var offsetRight = draggingRightVec.multiply(dx);

            unsnappedDragPos = unsnappedDragPos.add(offsetUp).add(offsetRight);

            var snappedDragPos;

            //if enabled, take grid snapping into account
            if (document.getElementById("snapCheckbox").checked)
            {
                snappedDragPos = new x3dom.fields.SFVec3f(cellSize * Math.ceil(unsnappedDragPos.x / cellSize),
                                                          cellSize * Math.ceil(unsnappedDragPos.y / cellSize),
                                                          cellSize * Math.ceil(unsnappedDragPos.z / cellSize));
                draggedTransformNode.setAttribute("translation", snappedDragPos.toString());
            }
            else
            {
                draggedTransformNode.setAttribute("translation", unsnappedDragPos.toString());
            }
        }

        //------------------------------------------------------------------------------------------------------------------

        var stopDragging = function()
        {
            draggedTransformNode = null;                
            draggingUpVec        = null;
            draggingRightVec     = null;
            unsnappedDragPos     = null;
            
            //re-enable navigation after dragging
            document.getElementById("navInfo").setAttribute("type", '"EXAMINE" "ANY"');
        };  
