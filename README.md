# Linked Bundle Node Map

## Table of Contents

- [Installation](#Installation)
- [Usage](#Usage)
- [Todo](#TODO)

## Demos

Basic Example: [Demo Page](https://akalinux.github.io/linked-bundle-node-map/)

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
        "router":{"i":"./images/router_up.png"},
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
        { "i":"l2", "s":"s", "d":"r", "o":"up", "a":"b","l":"Vlan Area Network-2"},
        { "i":"w1", "s":"r", "d":"f", "o":"up", "a":"b","l":"Intranet 1"},
        { "i":"w2", "s":"r", "d":"f", "o":"down", "a":"n","l":"Intranet 2"}
      ]
    };
    return <LinkedNodeMap {...data} />
  }

```


## TODO

1. Provide More examples
2. Fully Document the code
3. Add an exported cordinate and transform merge method
