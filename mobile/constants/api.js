// For iOS simulator and Android emulator, use the actual IP address of your machine
// For physical devices, replace with your machine's IP address
const getApiUrl = () => {
  // Development URLs
  if (__DEV__) {
    // For iOS simulator, localhost works fine
    // For Android emulator, you might need to use 10.0.2.2 instead of localhost
    // For physical device, replace localhost with your machine's IP address
    return "http://localhost:5001/api";
  }
  
  // Production URL
  return "https://expenso-5036.onrender.com";
};

export const API_URL = getApiUrl();