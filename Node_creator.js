//V.01 Of Node creator

/* The script objective is to create a automatized node creator of our choice under selected nodes of our choice.

    I will set a specific part for the attribute setting.
    The node type can be changed in type_of_node. The valid entries are, "COMPOSITE", "FADE" and all the nodes that follow a drawing type node.
    Notice that the created nodes can be created under a "COMPOSITE" node, so I recommend to errase the condition (|| node_type == "COMPOSITE")
    in case of creating composite nodes.

    
*/
function node_creator(){


    // Variables for the whole scene.

    var all_nodes = selection.selectedNodes()
    var count = all_nodes.length
    var node_type = []
    const types_acc = ["READ", "COMPOSITE"]
    // Allows to change the type of node by "FADE", "COMPOSITE", "READ"... (For the read node it has to be set up the column association and the elementid thing.)

    var type_of_node = "FADE"
    

    // Makes a counter to get the number of nodes inside i
    // (//////////TEST///////////) (Return the path of the nodes od the type "type_of_node")

    var count_nodes = node.getnodes(type_of_node)

    // The name you want to show for the node.

    var node_name_type = "LS_TRANSPARENCY"

    MessageLog.trace("there is " + count + " nodes selected.")


    for ( var i = 0 ; i < count ; i++){


        // Check the node type of every node selected.

        node_type.push(node.type(all_nodes[i]))
        var node_parent = node.parentNode(all_nodes[i])


        // Trace the type of the selectednodes to be able to know if there was an error with any specific node or to see if there is any node in another path than the rest.

        MessageLog.trace(node_type)
        MessageLog.trace(all_nodes[i])


        // checks for each node type if it's inside the list, if it's not inside it brakes the loop.

        if (types_acc.indexOf(node_type[i]) != -1){



            // Creates an undo action.
            MessageLog.trace(node_type)
            scene.beginUndoRedoAccum("Loop node creation.")


            // Create a transparency node set up. (The type of the node is "FADE") (And the values need to be <transparency val="50" defaultValue="50"/>)

            // Creates a personalized name for the transparency nodes in case the name.

            var final_name

            if (count_nodes < 1){

                final_name = node_name_type

            }else{

                final_name = node_name_type + "_" + count_nodes + 1
                
                final_name += 1

            }


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

            if (node.isLinked(all_nodes[i]) === true){
                
            
                // Unlinks the original link and links the new node between the two linked nodes.
                
                var node_dst = node.dstNodeInfo(all_nodes[i])
                var node_src = node.srcNodeInfo(all_nodes[i])
                
                
                // Return information of the destination node. (///////////Test//////////)
                
                var node_dst_inf = node_dst.node
                var port_dst_inf = node_dst.port

                
                // Return the information of the source node. (////////TEST//////////)

                var node_src_inf = node_src.node
                var port_src_inf =node_src.port


                // Console log to follow the node and port output.

                MessageLog.trace("Dst node path is: " + node_dst_inf)
                MessageLog.trace("Dst node port is: " + port_dst_inf)
                
                MessageLog.trace("Src node path is: " + node_src_inf)
                MessageLog.trace("Src node port is: " + port_src_inf)
                
            

                var node_to_link = node_parent + "/" + final_name

                // in this step we will also have to check how many transparency nodes there is in the scene. maybe we can even do it after the if to be able to stablish it before the condition and use it in both.
                
                


                // The statement would be like: if there is any transparency node, let i = to the number of transparency nodes.
                
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






               // Warning in case the selected node is not a drawing or a composite.

               MessageBox.information("Plese, select Drawing or composite nodes.")
               MessageLog.trace("Wrong node type or missing selection.")
               MessageLog.trace(node_type[i])

               break

               //There is a problem with the node selection. the value it returns is false, so it's not selecting any node.

        }

        scene.endUndoRedoAccum()

    }        
}