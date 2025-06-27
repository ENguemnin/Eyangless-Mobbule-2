declare module 'leaflet' {
  namespace L {
    interface Map {
      remove(): void;
    }
    
    interface Marker {
      options: any;
    }
    
    interface Icon {
      prototype: any;
    }
    
    interface LatLngBounds {
      pad(bufferRatio: number): LatLngBounds;
    }
  }
}

declare global {
  interface Window {
    selectCiteFromMap: (id: number) => void;
    navigateToCite: (id: number) => void;
  }
}

export {};