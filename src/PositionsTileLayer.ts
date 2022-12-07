import {
    CompositeLayer,
    Layer,
    LayerContext,
    LayersList
  } from "@deck.gl/core/typed";
  import { MVTLayer, TileLayerProps } from "@deck.gl/geo-layers/typed";
  import { ScatterplotLayer } from "@deck.gl/layers/typed";
  import { MVTLoader } from "@loaders.gl/mvt";
  import { groupBy, orderBy } from "lodash";
  
  export class PositionsTileLayer extends CompositeLayer<TileLayerProps> {
    static layerName = "PositionsTileLayer";
  
    initializeState(context: LayerContext) {
      super.initializeState(context);
      this.state = {
        allPositions: [],
        lastPositions: []
      };
    }
  
    onViewportLoad = (tiles: any) => {
      const allPositions = orderBy(
        tiles.flatMap((tile: any) => tile.dataInWGS84),
        "properties.htime"
      ).filter(Boolean);
      const positionsByVessel = groupBy(allPositions, "properties.vesselId");
      const lastPositions: any = [];
      Object.keys(positionsByVessel)
        .filter((p) => p !== "undefined")
        .forEach((vesselId) => {
          const vesselPositions = positionsByVessel[vesselId];
          lastPositions.push(...vesselPositions.slice(-1));
        });
      this.setState({
        allPositions,
        lastPositions
      });
    };
  
    renderLayers(): Layer<{}> | LayersList {
      const { allPositions, lastPositions } = this.state;
      return [
        new MVTLayer({
          id: "position-tiles",
          data:
            "https://gateway.api.dev.globalfishingwatch.org/v2/4wings/tile/position/{z}/{x}/{y}?datasets[0]=public-global-fishing-effort%3Av20201001&date-range=2021-05-01,2021-05-28",
          minZoom: 9,
          maxZoom: 9,
          loaders: [MVTLoader],
          onViewportLoad: this.onViewportLoad
        }),
        new ScatterplotLayer({
          id: "allPositions",
          data: allPositions,
          getPosition: (d) => d.geometry.coordinates,
          filled: true,
          getFillColor: [255, 0, 0, 255],
          radiusMinPixels: 3
        }),
        new ScatterplotLayer({
          id: "lastPositions",
          data: lastPositions,
          getPosition: (d) => d.geometry.coordinates,
          filled: true,
          getFillColor: [255, 255, 0, 255],
          radiusMinPixels: 8
        })
      ];
    }
  }
  