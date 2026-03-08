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
    const parseAndValidate = (value) => {
      const parsed = JSON.parse(value);
      // Accept both compact shared format and full state shape.
      const isCompactShape = parsed && typeof parsed === 'object' && parsed.sp;
      const isFullShape = parsed && typeof parsed === 'object' && parsed.searchParams;
      if (!isCompactShape && !isFullShape) {
        return null;
      }
      return parsed;
    };

    if (decompressed) {
      return parseAndValidate(decompressed);
    }
    const decodedStr = decodeURIComponent(atob(param));
    return parseAndValidate(decodedStr);
  } catch (err) {
    console.error("Failed to decode itinerary", err);
    return null;
  }
}
