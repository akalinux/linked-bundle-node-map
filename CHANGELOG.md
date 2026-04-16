# Changes

1.0.1
 - Offical release
 
1.0.2
  - README.md updates
  - Added this file CHANGELOG.md
  - Added CONTRIBUTING.md

1.0.3
  - Added group node drag support
  - added funding to package.json

1.0.4
  - added eslint checking
  - updated contribution documentation

1.0.5
  - not released

1.0.6
  - fixed bug causing animations to render in the wrong order
  - simplified the box creation code for nodes
  - documentation cleanups

1.0.7
  - Added missing entries to this file
  - Spelling/grammer cleanups in the docs

1.0.8
  - added Unit test CI Badge
  - added npm version badge

1.0.9
  - Code internal spelling mistakes cleaned up
  - Indexer now uses Map in place of Object, ( performance improivement )
  - nodes internal structure changed from object, to Map ( performacne improvement )
  - Created Common method for node highlighting
  - Converted link/index/cache to Map from Object ( performance improvement )
  - Image loader optimizations
  - unit tests updated to match new internal optimizations

1.0.10
  - Added .vscode config to enforce proper typescript version.. ( Vscode randomly breaks if you don't )
  - Fixed launch script for development
  - removed console.log statement

1.0.11
  - Added varied node size suppport..  ( long over due )
  - Added demo of varied node size support

1.0.12
  - Removed Socket badge.. 

1.0.13
  - node.k is now validated and set only once at dataBuild time.
  - drawLink optimizations, bundle computations moved outside of the loop
  - fixed node highlight render defect now links ends clear properly on highlight
  - fixed issue with node indexing post drag not being applied with proper geometry when a node.k value other than 1 is used.

1.0.14
  - Fixed demos

1.0.15
  - fixed issue that caused links to be rendered multiple times while nodes,links,bundles, or groups were being dragged
  - animations now persist through dragging

1.0.16
  - all devDependencies upgraded.. 
    -- This was a major undertaking.. TypeScript has been upgraded from 5.x to 6.x
  - package.json exports have been modernized
  - webpack builds have been upgraded, we are now no longer using deprecated features.

1.0.17
  - animation rendering optimization

1.0.18
  - added missing change log for version 1.0.17

1.0.19
  - fixed nulll check for theme options in the demos
  - removed extranious variable from the drawLink method
