# Linked Bundle Node Map

This npm package was created to solve a few problems. This widget provides good network diagrams, with no dependencies other than the version of React that comes with your build.  The rendering is done in a single pass, with minimal data processing.  The diagram interactions are indexed using binary space partitioning. Indexing is deferred until a user tries to interact with the top level canvas.  The core design is fairly easy to subclass.  The internals are written in TypeScript and the dist folder is uglified/minified es6. The widgets were developed using functional React, which makes the code simple to read and manage.

## Table of Contents

- [Installation](#Installation)
- [Features](#Features)
- [Usage](#Usage)
- [LinkedNodeMap Types](#LinkedNodeMapTypes)
- [Managing Events](#Events)
- [Merging Data Sets](#MergingData)
- [Themes](#ThemeContext)
- [Todo](#TODO)

## Features

- Pan & Zoom support, enabled by default, but can be disabled via props.
- Toggle full screen mode ( enabled by default can be disabled via props )
- Node/Map Dragging support ( enabled by default, can be disabled vi props )
- Stack multiple connections between nodes 
- Bundle connections between nodes together
- Stack multiple bundles between nodes
- Tool tip support
- Overloadable UI Components(including tooltips)
- Status mapping for nodes and links
- Milti directional Link animations.
- Data Merging utilities
- Dynamically scale connections between nodes
- Supports fully non interactive mode (useful for creating tool tips and sub diagrams)
- Nodes can be disabled with the connections still showing
- Nodes, links, and bundles are rendered in a deterministic order
- Map is drawn using canvas not svg ( even when loading custom images )
- Deferred indexing, only created when needed
- No Square roots are applied when looking up what a user is interacting with
- Ref forwarding support allowing for screen shots, pdf generation etc..
- Extensible Theme support, ( default light and dark ) add more as you see fit

## Demos

- [Minimal Demo](https://akalinux.github.io/linked-bundle-node-map/?demo=min)
- [Manual Tool tips & Bundles](https://akalinux.github.io/linked-bundle-node-map/?demo=ttb)
- [Events and Themes](https://akalinux.github.io/linked-bundle-node-map/?demo=theme_reset_event)

## Installation

```bash
npm install linked-bundle-node-map
```

## Usage

```tsx
  import LinkedNodeMap from 'linked-bundle-node-map';
  // assumes you have a css loader
  import 'linked-bundle-node-map/dist/linked-bundle-node.css'
  
  function RenderMap() {
    const data={
      "autoFit":true,
      "grid":true,
      "nodeOpts":{
        "router":{"i":"./images/router_up.svg.png"},
        "firewall":{"i":"./images/fwl_up.png"},
        "server":{"i":"./images/server.svg"}
      },
      "linkOpts":{
        "default":{"c":"#ADD8E6"},
        "up":{"c":"green"},
        "down":{"c":"lightpink"}
      },
      "nodes":[
        { "i": "s", "o": "server", "x": 150, "y": 25, "l": "Server"  },
        { "i": "r", "o": "router", "x": 150, "y": 125, "l": "Main-Router"  },
        { "i": "f", "o": "firewall", "x": 150, "y": 225, "l": "Firewall" }
      ],
      "links":[
        { "i":"l1", "s":"s", "d":"r", "o":"up", "a":"b","l":"Vlan Network-1"},
        { "i":"l2", "s":"s", "d":"r", "o":"up", "a":"b","l":"Vlan Network-2"},
        { "i":"w1", "s":"r", "d":"f", "o":"up", "a":"b","l":"Intranet 1"},
        { "i":"w2", "s":"r", "d":"f", "o":"down", "a":"n","l":"Intranet 2"}
      ]
    };
    return <LinkedNodeMap {...data} />
  }

```

## LinkedNodeMapTypes

LinkedNodeMap supports the following properties (see the source for the final word on this):

```ts

// Tool tip data structure
interface ToolTipData{[key:string]:{label:string,data?:string[]}}

// Resolution values, internals default to 1920x1080
interface CoreSize {
  width: number;
  height: number;
}

// Node Element data structure
interface NodeEl {
  // Human Readable Label
  l: string;
  
  x: number;
  y: number;
  // Option driver to use
  o: string;
  // Unique Internal ID
  i: string;
  
  // user tagged data set ( internals never look at or touch this value )
  t?:any;
  
  // Hide this node
  h?:boolean|number;
}

// Link Element Data structure
interface LinkEl {
  // Unique Internal ID
  i: string;
  
  // Source Node ID
  s: string;
  // Destination Node ID
  d: string;
  
  // Link Animation flag: n|s|d|b  ( n=none,s=to source,d=to destination,b=both }
  a: string;
  
  // link options to use
  o: string;
  
  // Optional Bundle names to group this link with others between the same node
  b?: string[];
  
  // Optional human readable string representing the link
  l?: string;
  
  // Internally generated structure ( you can ignore this )
  n?:{
    s: NodeEl;
    d: NodeEl;
  };
}


// at least one or the other option must be set
interface NodeElOpt {
  // image path
  i?: string;
  // Color value
  c?: string;
}

interface LinkElOpt {
  c: string;
}

// Canvas Transform values
interface CoreTransform {
  x: number;
  y: number;
  k: number;
}

// Base Notation for x and y  positions used by internals
interface Cordinate {
  x: number;
  y: number;
  [key: string]: any;
}

// Data structure showing what has changed
interface MapChanges {
  nodes: { [nodeId: string]: Cordinate; };
  transform: CoreTransform;
  grid: boolean;
  tick: number;
}

// Color options used for canvas rendering
interface ColorOptionSet {
  color: string;
  bgColor: string;
  bundleColor: string;
  shadeColor: string;
  lineColor:string;
  fillColor:string;
  mouseOverColor:string;
  fill:string;
  stroke:string;
}

// maps color options to to themes, defaults are: "light" and "dark"
interface ThemeOptionSets {
  [theme: string]: ColorOptionSet;
}

// Full Props list
interface SetCalculatorData {
  toolTipData?: ToolTipData,
  changes?: MapChanges;
  
  // Turns the grid on or off
  grid?: boolean;
  
  // used by internals, set by ThemeContext ( you can this )
  theme?: string;
  transform?: CoreTransform;
  themes?: ThemeOptionSets;
  r?: number;
  // tells the diagram to try to auto fit the page.. ( center on both x and y )
  autoFit?: boolean,
  
  // prevent user changes
  noChange?: boolean;
  
  // sets the canvas resolution, defaults to: 1920x1080
  size?: CoreSize;
  
  // required list of nodes ( can be 0 elements long )
  nodes: NodeEl[];
  
  // required list of links ( can be 0 elements long )
  links: LinkEl[];
  
  // node options structure, maps to "o" value of node
  nodeOpts?: { [optId: string]: NodeElOpt };
  
  // link options structure, maps to "o" value of link
  linkOpts?: { [option: string]: LinkElOpt };
  autoToolTip?: boolean;

    // sets the animation tick number ( starts at 0 )
    tick?: number;

  // toolbar control
  noTools?: boolean;
  hideCompass?: boolean;
  hideFullScreen?: boolean;
  showReset?: boolean;
  hideGridToggle?: boolean;
  hideSearch?: boolean;
  hideZoomAndRestore?: boolean;
}

// Represents the changes to the map
interface MapChanges {

  // the id of each node and the updated x and y values
  nodes: { [nodeId: string]: Cordinate; };
  
  // the x,y,k transformations currently applied
  transform: CoreTransform;
  
  // grid status
  grid: boolean;
  // animation tick 
	tick: number;
}

// 
interface StatusContextInterface {
  sendEvent(event:CoreEvent<any>, data:MapChanges):void;
  getSlotRefWatcher():ManageInstance<React.RefObject<HTMLDivElement>>|undefined;
  setSlotRefWatcher(m:ManageInstance<React.RefObject<HTMLDivElement>>|undefined):void;
}

```
## Events

Events are managed by the FormContext export.  The simplest way to access ad or manage events is to create a new LinkedMapStatus and overwrite the default sendEvent(event,changes) method.

Example showing how to get Events

```tsx
  import LinkedNodeMap, { FormContext, LinkedMapStatus } from 'linked-bundle-node-map'
  import data './local.json'; 
  
  function MyWidget() {

    const fc=  const fc = new LinkedMapStatus();
    fc.sendEvent = (event, mapChanges) => {
      console.log(event, mapChanges);
    }
    
    return <FormContext.Provider value={fc}>
      <LinkedNodeMap {...data} />
    </FormContext.Provider>
  }
```

## MergingData

The helper method "MergeMapChanges" can be imported from 'linked-bundle-node-map'.  For a detailed example [see](https://github.com/akalinux/linked-bundle-node-map/blob/master/demo_app/src/demos/ThemeEventsReset/ThemeEventsReset.tsx).

How to import MergeMapChanges

```
  import LinkedNodeMap, { FormContext, LinkedMapStatus, MergeMapChanges } from 'linked-bundle-node-map'
```

## ThemeContext

Themse are managed via a ThemeContext, the theme applies to 2 things.

1. Css Class
2. Data Structure

The 2 css classes provided are: linked-node-map-dark and linked-node-map-light. See the css source file [here](https://github.com/akalinux/linked-bundle-node-map/blob/master/src/LinkedSet.css).

The default "themes" data structure source code is [here](https://github.com/akalinux/linked-bundle-node-map/blob/master/src/THEME_MAP.ts).

## TODO

1. Provide More examples
2. Fully Document the code
