import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';

export function encodeItinerary(itinerary) {
  try {
    const jsonStr = JSON.stringify(itinerary);
    return compressToEncodedURIComponent(jsonStr);
  } catch (err) {
    console.error("Failed to encode itinerary", err);
    return "";
  }
}

export function decodeItinerary(param) {
  try {
    const decompressed = decompressFromEncodedURIComponent(param);
    if (decompressed) {
      return JSON.parse(decompressed);
    }
    const decodedStr = decodeURIComponent(atob(param));
    return JSON.parse(decodedStr);
  } catch (err) {
    console.error("Failed to decode itinerary", err);
    return null;
  }
}
