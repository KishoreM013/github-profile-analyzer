/**
 * Transforms a flat GitHub tree array into a nested object structure
 * @param {Array} files - The 'tree' array from the GitHub Git Trees API
 * @returns {Object} A nested object representing the file system
 */
export const buildFileTree = (files) => {
  const root = {};
  if (!files || !Array.isArray(files)) return root;

  files.forEach(file => {
    // Split path into parts: e.g., "android/app/src" -> ["android", "app", "src"]
    const parts = file.path.split('/');
    let current = root;

    parts.forEach((part, index) => {
      if (!current[part]) {
        current[part] = { 
          name: part, 
          // If it's the last part of the path, use GitHub's type, otherwise it's a folder (tree)
          type: index === parts.length - 1 ? file.type : 'tree', 
          children: {} 
        };
      }
      current = current[part].children;
    });
  });
  
  return root;
};