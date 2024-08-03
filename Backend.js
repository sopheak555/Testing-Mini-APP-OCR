async function analyzeReceipt() {
    const input = document.getElementById('imageInput');
    const file = input.files[0];
    if (!file) {
        alert('Please select an image first.');
        return;
    }

    const reader = new FileReader();
    reader.onload = async function(e) {
        const base64Image = e.target.result.split(',')[1];

        try {
            const response = await fetch('https://api.github.com/repos/YOUR_USERNAME/telegram-receipt-scanner/dispatches', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer YOUR_GITHUB_PAT',
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    event_type: 'analyze_receipt',
                    client_payload: {
                        image: base64Image
                    }
                })
            });

            if (response.ok) {
                document.getElementById('result').innerText = 'Analysis request sent. Check repository actions for results.';
            } else {
                throw new Error('Failed to send analysis request');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred during analysis request.');
        }
    };
    reader.readAsDataURL(file);
}