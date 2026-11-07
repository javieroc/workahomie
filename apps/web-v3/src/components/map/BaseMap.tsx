import { forwardRef, type ComponentProps } from 'react';
import Map, { type MapRef } from 'react-map-gl/maplibre';
import type { Map as MLMap } from 'maplibre-gl';
import { env } from '@/lib/env';

/**
 * Re-tints the free OpenFreeMap "positron" style so maps feel like part of the brand
 * (paper land, lavender water, sage parks) without paying for a custom style host.
 */
export function brandMapStyle(map: MLMap) {
  const style = map.getStyle();
  style?.layers?.forEach((layer) => {
    const id = layer.id.toLowerCase();
    try {
      if (layer.type === 'background')
        map.setPaintProperty(layer.id, 'background-color', '#f3ede3');
      else if (layer.type === 'fill' && id.includes('water'))
        map.setPaintProperty(layer.id, 'fill-color', '#d8d2e8');
      else if (layer.type === 'line' && id.includes('water'))
        map.setPaintProperty(layer.id, 'line-color', '#c9c1de');
      else if (layer.type === 'fill' && /(park|wood|grass|landcover)/.test(id))
        map.setPaintProperty(layer.id, 'fill-color', '#e4e6d4');
      else if (layer.type === 'fill' && id.includes('building'))
        map.setPaintProperty(layer.id, 'fill-color', '#e9e1d4');
      else if (layer.type === 'fill' && /(residential|landuse)/.test(id))
        map.setPaintProperty(layer.id, 'fill-color', '#efe8dc');
    } catch {
      // layer may use data-driven expressions we don't override; ignore
    }
  });
}

type Props = Omit<ComponentProps<typeof Map>, 'mapStyle'>;

export const BaseMap = forwardRef<MapRef, Props>(({ onLoad, ...props }, ref) => (
  <Map
    ref={ref}
    mapStyle={env.mapStyleUrl}
    attributionControl={{ compact: true }}
    dragRotate={false}
    onLoad={(e) => {
      brandMapStyle(e.target);
      onLoad?.(e);
    }}
    {...props}
  />
));
BaseMap.displayName = 'BaseMap';
