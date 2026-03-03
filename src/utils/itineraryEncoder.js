export function encodeItinerary(itinerary) {
  try {
    const jsonStr = JSON.stringify(itinerary);
    return btoa(encodeURIComponent(jsonStr));
  } catch (err) {
    console.error("Failed to encode itinerary", err);
    return "";
  }
}

export function decodeItinerary(param) {
  try {
    const decodedStr = decodeURIComponent(atob(param));
    return JSON.parse(decodedStr);
  } catch (err) {
    console.error("Failed to decode itinerary", err);
    return null;
  }
}
