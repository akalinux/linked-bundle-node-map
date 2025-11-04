import LinkedNodeMap, { SetCalculatorData, CalculateNodeXY } from 'linked-bundle-node-map'
import React from 'react';
import '../MinimalDemo/min.css';
import { PreNodeEl } from 'linked-bundle-node-map/dist/CommonTypes';
import BaseOptions from './BaseOptions.json'
const RawNodes: PreNodeEl[] = [];

function CreateNodes() {
  const size = 3;
  const sets = [4, 7, 9, 2, 1, 11, 2,5,];
  let setId = 0;
  let setPos = -1;
  let setCount = 1;
  let setSize=sets[setId];
  for (let i = 1; i < 50; ++i) {
    const id = i.toString();
    ++setPos;
    
    if (setPos >=setSize) {
      setPos = 0;
      ++setCount;
      
      ++setId;
      if (setId >= sets.length) {
        setId = 0;
      }
      setSize=sets[setId];
    }
    /* The GenerateXY class groups nodes togeather by tag string or number values. 
    *  The sets array defines how many nodes can show up in each group max.
    */
    const t = `${setCount}-${setSize}`

    const num = id.padStart(size, '0');
    const node: PreNodeEl = {
      i: id,
      o: 'server',       // Use the server icon
      l: `Node-${num}`,  // Pretty format Node-0000
      t,
    }

    RawNodes.push(node);
  }
}


export default function ThemeEventsReset() {

  // fire up our node generation only as needed
  if (RawNodes.length == 0) CreateNodes();
  
  const builder = new CalculateNodeXY();
  
  /* The default aspect ratio for clustered drawing tiles of node node clusters is 16/9.
  * Default shown here   */
  builder.ratio=16/9;
  builder.processNodes(RawNodes);
  const data: SetCalculatorData = {
    ...BaseOptions,
    nodes: builder.nodes,
    links: [],
  }


  return <div className='container'>
    <div className='infoBlock'>
      <div>Linked Bundle NodeMap, Generate Grouped Layouts</div>
      <div>
        <div className='noBlock'>
          <ul>
            <li><a href="https://github.com/akalinux/linked-bundle-node-map/">Back to the githib project</a></li>
            <li>
              <a href="https://github.com/akalinux/linked-bundle-node-map/blob/master/demo_app/src/demos/GenerateXY/GenerateXY.tsx">
                View this example's source
              </a>
            </li>
          </ul>
        </div>
        <div className='noBlock' style={{ marginLeft: "10px" }}>
          <p>This example creates xy positions based on grouping, of nodes by the tag or "t" field in the PreNodeEl data structure.
          The default ratio for drawing tiles of grouped nodes is 16/9, this can be changed by setting the ratio option on the instance of CalculateNodeXY. </p>
        </div>
      </div>
    </div>
    <div className='mapContainer'>
      <LinkedNodeMap {...data} />
    </div>
  </div>
}

