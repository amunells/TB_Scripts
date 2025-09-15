//V.03 Of Node creator

/* The script objective is to create a automatized node creator of our choice under selected nodes of our choice.

    The node type can be changed in type_of_node. The valid entries are, "COMPOSITE", "FADE" and all the nodes that follow a drawing type node.
    Notice that the created nodes can be created under a "COMPOSITE" node, so the constant types_acc can be changed to the type of nodes can 
    be selected to create the nodes.

    
*/
function node_creator(){


    // Variables for the whole scene.

    var all_nodes = selection.selectedNodes()
    var count = all_nodes.length
    var node_type = []
    const types_acc = ["READ", "COMPOSITE"]


    // Allows to change the type of node by "FADE", "COMPOSITE", "READ"... (For the read node it has to be set up the column association and the elementid thing.)

    var type_of_node = ["FADE"]
    

    // (//////////TEST///////////) (Return the path of the nodes od the type "type_of_node") Makes a counter to get the number of nodes inside i

    var count_nodes = node.getNodes(type_of_node)

   
   
    // The name you want to show for the node.

    var node_name_type = "LS_TRANSPARENCY"

    MessageLog.trace("There is " + count + " nodes selected.")

    
    
    if (count === 0){
        
        MessageLog.trace("No nodes selected.")
        MessageBox.information("No nodes selected. Please select a node")
        
    }else{
        
        
        
        for ( var i = 0 ; i < count ; i++){
            
            
            // Check the node type of every node selected.
            
            node_type.push(node.type(all_nodes[i]))
            var node_parent = node.parentNode(all_nodes[i])
            
            
            // Trace the type of the selectednodes to be able to know if there was an error with any specific node or to see if there is any node in another path than the rest.
            
            MessageLog.trace(node_type)
            MessageLog.trace(all_nodes[i])
            
    
            var test = types_acc.indexOf(node_type[i])
            
            MessageLog.trace(node_type)
            
    
            // *******************IndexOf dosen't read when there is no nodes selected. I need a way to compare the types
            // checks for each node type if it's inside the list, if it's not inside it brakes the loop.
            
            
            if (test !== -1){
                
                
                // Creates an undo action.
                
                scene.beginUndoRedoAccum("Loop node creation.")
                
                
                // Create a transparency node set up. (The type of the node is "FADE") (And the values need to be <transparency val="50" defaultValue="50"/>)
                
                // Creates a personalized name for the transparency nodes in case the name.
                
                var final_name = ""
                
                if (count_nodes < 1){
                    
                    final_name = node_name_type
                    
                }else{
                    
                    final_name = node_name_type + "_" + (count_nodes.length + 1 )
                    
                }
                
                
                // ***************There is still a problem with the test variable. When more than one node is selected, if there is nodes without link, the destination node dosent exist anymore. So I am guessing I need a if condition. 
                
                // //////////Test/////////// to get the node info of the selected node. There is any node linked?
                
                // For what I understood, the dstNodeInfo methode, checks the port that is on top. So it's not useful in case to understand wich is the port number.
                
                
                var node_temp = node.dstNodeInfo(all_nodes[i], 0, 0)
                
                
                var  port_temp = node_temp.port
                var node_test = node_temp.node
                
                MessageLog.trace("The temp node path is: " + node_test)
                MessageLog.trace("The temp node port is: " + port_temp)
                
                
                
                
                
                // Create the coordenates for each node.
                
                const coordX = node.coordX(all_nodes[i])
                const  coordY = node.coordY(all_nodes[i])
                
                var new_coordY = coordY + 100
                
                
                //Creates the nodes taking as source: the parent node, the name of the node, the type and the coordenates. 
                
                node.add(node_parent, final_name, type_of_node, coordX, new_coordY, 0)
                
                
                
                // Links the new node to the source node.
                
                var created_node = node_parent + "/" + final_name
                node.link(all_nodes[i], 0, created_node, 0)
                
                
                // Trace the name of the node and the path.
                
                MessageLog.trace(final_name)
                MessageLog.trace(created_node)
                
                // if the node is linked, link the transparency node between the node that is linked to.
                
                if (node.isLinked(all_nodes[i], port_temp) === true){
                    
                    
                    // Unlinks the original link and links the new node between the two linked nodes.
                    
                    var node_dst = node.dstNodeInfo(all_nodes[i])
                    var node_src = node.srcNodeInfo(all_nodes[i])
                    
                    
                    
                    
                    // Return information of the destination node. (///////////Test//////////)
                    
                    var node_dst_inf = node_dst.node
                    var port_dst_inf = node_dst.port
                    
                    
                    // Return the information of the source node. (////////TEST//////////)
                    
                    var node_src_inf = node_src.node
                    var port_src_inf =node_src.port
                    
                    // Console log that returns the node and port output.
                    
                    MessageLog.trace("Dst node path is: " + node_dst_inf)
                    MessageLog.trace("Dst node port is: " + port_dst_inf)
                    
                    MessageLog.trace("Src node path is: " + node_src_inf)
                    MessageLog.trace("Src node port is: " + port_src_inf)
                    
                    
                    
                    
                    // It will name the path to the node that we are linking due we don't have the path yet. (Transparency node)
                    
                    var node_to_link = node_parent + "/" + final_name
                    
                    
                    // Unlink the original link and then links the created node inbetween.
                    
                    node.unlink(node_dst_inf, port_dst_inf)
                    node.link(node_src_inf, port_src_inf, node_to_link, 0)
                    node.link(node_to_link, 0, node_dst_inf, port_dst_inf)
                    
                    // find the node port to be able to link it in the same space.
                    
                    MessageLog.trace("The connection with the node is" + node.link)
                    
                    MessageLog.trace("Link found procedure")
                    
                    
                }else{
                    
                    
                    // Links the new node to the source node.
                    
                    var created_node = node_parent + "/" + final_name
                    node.link(all_nodes[i], 0, created_node, 0)
                    
                    MessageLog.trace("No link found procedure.")
                }
                
                
            }else{
                
                // There is a problem with the method, when there is no node selected the condition dosen't work.  The objective is for the condition to jump directly to here.  
                
                // Warning in case the selected node is not a drawing or a composite.
                
                MessageBox.information("Plese, select Drawing or composite nodes.")
                MessageLog.trace("Wrong node type or missing selection.")
                MessageLog.trace(node_type[i])
                
                break
                
                
            }
            
            scene.endUndoRedoAccum()
            
        }        
    }
}