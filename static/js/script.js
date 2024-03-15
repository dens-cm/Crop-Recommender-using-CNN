document.addEventListener('DOMContentLoaded', function () {

    // Get references to the buttons, file input, and result element
    var uploadButton = document.getElementById('upload_photo');
    var recommendButton = document.getElementById('recommend');
    var fileInput = document.getElementById('file_input');
    var soilResult = document.getElementById('soil_result');
    var uploadedImage = document.getElementById('uploaded_image');
    var result_header = document.getElementById('result_header');
    var soil_header = document.getElementById('soil_header');
    var crop_header = document.getElementById('crop_header');
    var rice = document.getElementById('rice');
    var palmOil = document.getElementById('palm_oil');
    var corn = document.getElementById('corn');
    var banana = document.getElementById('banana');
    var loadingDiv = document.getElementById('loading');
    var info = document.getElementById('info');

    // Function to show loading div
    function showLoading() {
        loadingDiv.style.display = 'block';
        hideResultAndCrops();
    }

    // Function to hide loading div
    function hideLoading() {
        loadingDiv.style.display = 'none';
        showResultAndCrops();
    }

    // Function to hide result and crops
    function hideResultAndCrops() {
        result_header.style.display = 'none';
        soil_header.style.display = 'none';
        soilResult.style.display = 'none';
        crop_header.style.display = 'none';
        rice.style.display = 'none';
        palmOil.style.display = 'none';
        corn.style.display = 'none';
        banana.style.display = 'none';
    }

    // Function to show result and crops
    function showResultAndCrops() {
        result_header.style.display = 'block';
        soil_header.style.display = 'block';
        soilResult.style.display = 'block';
        crop_header.style.display = 'block';
    }

    // Function to hide all crops
    function hideAllCrops() {
        rice.style.display = 'none';
        palmOil.style.display = 'none';
        corn.style.display = 'none';
        banana.style.display = 'none';
    }

    hideLoading();
    hideAllCrops();

    // Add click event listener to the upload button
    uploadButton.addEventListener('click', function () {
        // Trigger the click event of the file input
        fileInput.click();
    });

    // Add change event listener to the file input
    fileInput.addEventListener('change', function () {
        // Check if a file is selected
        if (fileInput.files && fileInput.files[0]) {
            var reader = new FileReader();

            // Read the selected file as a data URL
            reader.readAsDataURL(fileInput.files[0]);

            // Set the uploaded image source when the file is loaded
            reader.onload = function (e) {
                uploadedImage.src = e.target.result;
            };
        }
    });

    // Add click event listener to the recommend button
    recommendButton.addEventListener('click', function () {
        // Check if a file is selected
        if (!fileInput.files || !fileInput.files[0]) {
            alert('Please select an image first.');
            return;
        }

        // Show loading div
        showLoading();

        // Create a FormData object to send the file to the server
        var formData = new FormData();
        formData.append('file', fileInput.files[0]);

        // Send an asynchronous POST request to the Flask server
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/predict', true);

        // Set up the callback function to handle the server's response
        xhr.onload = function () {
            if (xhr.status === 200) {
                // Parse the JSON response
                var response = JSON.parse(xhr.responseText);

                // Map numeric class to soil type
                var soilType;
                switch (response['class']) {
                    case 0:
                        soilType = 'Black Soil (Black shallow)';
                        break;
                    case 1:
                        soilType = 'Clay Soil (Silty clay)';
                        break;
                    case 2:
                        soilType = 'Red Soil';
                        break;
                    default:
                        soilType = 'Try again';
                        // Hide all crops for Unknown Soil after 2.5 seconds
                        setTimeout(hideAllCrops, 2500);
                }

                // Update the soil_result element with the predicted result after 2.5 seconds
                setTimeout(function () {
                    result_header.textContent = 'Recommended Crop:';
                    soilResult.textContent = soilType;
                    info.textContent = 'This chart displays the percentage distribution of classified crops based on the input soil image.';
                }, 2500);

                // Hide loading div after another 2.5 seconds
                setTimeout(hideLoading, 2500);
            } else {
                alert('Error predicting class. Please try again.');
                // Hide loading div immediately in case of an error
                hideLoading();
            }
        };

        // Send the FormData to the server
        xhr.send(formData);
    });
});
