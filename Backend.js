const express = require('express');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/analyze', upload.single('image'), async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
    
    // Read the uploaded image
    const imageData = await fs.promises.readFile(req.file.path);
    const imageParts = [
      {
        inlineData: {
          data: imageData.toString('base64'),
          mimeType: req.file.mimetype,
        },
      },
    ];

    const result = await model.generateContent([
      'Extract and structure the following information from this receipt image: date, total amount, location, items purchased. Return the data in JSON format.',
      ...imageParts,
    ]);

    const extractedData = JSON.parse(result.response.text());

    // Here you would typically save extractedData to your database

    res.json(extractedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred during image analysis' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});