// A function to convert a File object to a base64 string
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // The result is a data URL (e.g., "data:image/jpeg;base64,..."). 
      // We only need the base64 part, so we split the string and take the second element.
      const base64String = (reader.result as string).split(',')[1];
      if (base64String) {
        resolve(base64String);
      } else {
        reject(new Error('Failed to parse base64 string from file.'));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};
