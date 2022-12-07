import React from 'react';
import { DeckGL } from "@deck.gl/react/typed";
import { PositionsTileLayer } from "./PositionsTileLayer";

import './App.css';
import { GeoBoundingBox, TileLayer } from '@deck.gl/geo-layers/typed';
import { BitmapLayer } from '@deck.gl/layers/typed';


const INITIAL_VIEW_STATE = {
  longitude: -7.2,
  latitude: 43.7,
  zoom: 9,
  pitch: 0,
  bearing: 0
};

const layers = [new TileLayer({
  data: 'http://tile.osm.org/{z}/{x}/{y}.png',
  renderSubLayers: (props) => {
    const { west, south, east, north } = props.tile.bbox as GeoBoundingBox
    return new BitmapLayer(props, {
      data: null,
      image: props.data,
      bounds: [west, south, east, north],
    })
  },
}),new PositionsTileLayer()];

function App() {
  return (
    <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        // onViewStateChange={(e)=> {console.log(e)}}
        controller={true}
        layers={layers}
      />
  );
}

export default App;
