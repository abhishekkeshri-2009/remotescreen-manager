export type ComponentType = 'search' | 'banner' | 'destinations';

export type SearchComponent = { type: 'search' };
export type BannerComponent = { type: 'banner'; image: string };
export type DestinationsComponent = { type: 'destinations' };

export type ScreenComponent = SearchComponent | BannerComponent | DestinationsComponent;

export type ScreenLayout = {
  screen: string;
  components: ScreenComponent[];
};

export function isLayout(x: any): x is ScreenLayout {
  return x && typeof x === 'object' && typeof x.screen === 'string' && Array.isArray(x.components);
}

