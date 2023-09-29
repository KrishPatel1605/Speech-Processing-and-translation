const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const recognizedText = document.getElementById('recognizedText');
const translation = document.getElementById('translation');
let recognition;

// Check if the browser supports the Web Speech API
if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();

    // Get the target language element
    const targetLanguageSelect = document.getElementById('targetLanguage');

    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en'; // Set the default language (you can change this)

    startButton.addEventListener('click', () => {
        // Clear the recognized and translated text boxes
        recognizedText.textContent = '';
        translation.textContent = '';

        recognition.start();
        startButton.style.display = 'none';
        stopButton.style.display = 'inline-block';
    });

    stopButton.addEventListener('click', () => {
        recognition.stop();
        startButton.style.display = 'inline-block';
        stopButton.style.display = 'none';
    });

    recognition.onresult = async (event) => {
        const result = event.results[0][0].transcript;
        recognizedText.textContent = result;

        // Get the selected target language code from the dropdown
        const targetLang = targetLanguageSelect.value;

        // Translate the recognized text using the Mymemory Translation API
        const translatedText = await translateText(result, 'en', targetLang); // Translate from English to the selected target language
        translation.textContent = translatedText;
    };

    recognition.onend = () => {
        startButton.style.display = 'inline-block';
        stopButton.style.display = 'none';
    };

    async function translateText(text, sourceLang, targetLang) {
        const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
            text
        )}&langpair=${sourceLang}|${targetLang}`;

        const response = await fetch(apiUrl);

        if (response.ok) {
            const data = await response.json();
            if (data.responseData && data.responseData.translatedText) {
                return data.responseData.translatedText;
            }
        }

        console.error('Translation failed.');
        return 'Translation Error';
    }
} else {
    console.error('Web Speech API is not supported in this browser.');
}
