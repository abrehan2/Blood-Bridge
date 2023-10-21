export const StorageKeys = {
  User_Data: "userData",
  Role: "role",
};

function saveItem(key: any, value: any) {
  localStorage.setItem(key, JSON.stringify(value));
  return true;
}

function removeItem(key: any) {
  localStorage.removeItem(key);
  return true;
}

function getItem(key: any) {
  if (typeof window !== 'undefined') {
    const value = localStorage.getItem(key);
    if (value !== null) {
      try {
        return JSON.parse(value);
      } catch (error) {
        console.error(`Error parsing JSON for key "${key}": ${error}`);
        return null;
      }
    }
  }
  return null;
}

export default {
  removeItem,
  StorageKeys,
  getItem,
  saveItem,
};
