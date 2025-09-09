//V 0.4
function createDrawingNodes()

{
	var entryL = new LineEdit
	var mynames = [
		"CLOTHE_DARK",
		"SKIN_DARK",
		"HAIR_DARK",
		"HAIR_SPECULAR",
		"GUN_SPECULAR" 
	];
	var checkboxtable = [];
	var w = 120;
	var count = 5;
	var selectedNodes = selection.numberOfNodesSelected();
	var d = new Dialog();
	
	d.title = "GENERAL_SETUP";
	
	for(var i = 0; i < count; i++){
		var boxL = new CheckBox();
		boxL.text = mynames[i];
		d.add(boxL);
		checkboxtable.push(boxL);
	}
	
	while(true){
		if(d.exec()){
			var currentNode = selection.selectedNode(0);
			var parentNode = node.parentNode(currentNode);
			var check = true;
			var message = "Error:\n";

			for(var i = 0; i < count; i++){
				if(checkboxtable[i].checked){
					// replqce by function var name = myfunction(parentNode,labels);
					var preFixName = [
					"CH",
					"LS_GROUP"
					];
					var tempname = node.getName(parentNode) + "_" + checkboxtable[i].text;
					var tempname2 = tempname.replace("CH", "LS");
					var	name = tempname2.replace("LS_GROUP", "LS");
					
					var elementId = node.getElementId(parentNode + "/" + name);
					if(elementId != -1){
						//MessageBox.information(name + " alredy exist.");
						message += name + "\n";
						check = false;
					}
				}
			}
			if(check == true) break; 
			MessageLog.trace( "///////////Repeted name////////////");
			MessageBox.information(message + " alredy exist.");
		}
		else{
			MessageLog.trace("/////////No repeted names/////////")
			return;
		}
	}
	
	scene.beginUndoRedoAccum("Create Drawing Nodes");
	
	if(selectedNodes == 1){ 
		 
		var currentNode = selection.selectedNode(0);
		var posX = node.coordX(currentNode); 
		var posY = node.coordY(currentNode);  
		var center = ((count-1)*w)/2;
		for(var i = 0; i < count; i++){
			// replace also here
			if(checkboxtable[i].checked){
			var tempname = node.getName(node.parentNode(currentNode)) + "_" + checkboxtable[i].text;
			var name = tempname.replace("CH", "LS");
			
			var elemName = name; //"Draw" + (i + 1);
			var elemId = element.add(elemName, "BW", scene.numberOfUnitsZ(), "SCAN", "TVG");       
			if ( elemId != -1 ){
				var colName = column.generateAnonymousName();
				var newColor = new ColorRGBA(135, 125 , 145, 255);
				var newNode =  node.add(node.parentNode(currentNode), name, "READ" , posX + (w * i)- center, posY - 100, 0);
				column.add(colName, "DRAWING");      
				column.setElementIdOfDrawing( elemName, elemId );
				node.link(newNode, 0, currentNode, 0);
				node.linkAttr(newNode, "DRAWING.ELEMENT", elemName);
				node.setColor(newNode, newColor);
			}
			}
		}
		 MessageLog.trace("///////Created drawing nodes///////////")
	}else{  
		 MessageBox.information("You must select only 1 Composite node.");
		 MessageLog.trace("Error with selected node or not node selected")
	} 
	scene.endUndoRedoAccum(); 
}