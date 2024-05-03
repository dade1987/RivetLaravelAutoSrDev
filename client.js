import axios from 'axios';
import fs from 'fs';
import path from 'path';

// Set the base directory where files will be saved
const baseDir = '/home/dade/rivet/workspace/laravel';

// API URL from which to fetch the data
const apiUrl = 'http://127.0.0.1:3000/generate';

// Parse command line arguments
const args = process.argv.slice(2);
const task = args.find(arg => arg.startsWith('--task='))?.split('=')[1];
const test = args.includes('--test');
const filament = args.includes('--filament');


// Data to send with the POST request
const postData = {
  task: task || "Default task description here",
  test: test,
  filament: filament
};

// Function to save content to a file
const saveToFile = (filePath, content) => {
  const fullPath = path.join(baseDir, filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });  // Ensure the directory exists
  fs.writeFileSync(fullPath, content, 'utf8');  // Write content to the file
};

// Function to make the POST request and handle the response
const fetchDataAndSaveFiles = async () => {
  try {
    const response = await axios.post(apiUrl, postData);  // Send POST request
    const files = response.data.value;
    files.forEach(file => {
      saveToFile(file.path, file.content);
    });
    console.log('Files saved successfully!');
  } catch (error) {
    console.error('Error fetching data:', error.message);
  }
};

// Execute the function
fetchDataAndSaveFiles();
