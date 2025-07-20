let module;

function _BinaryConverter() {
    if (typeof BinaryConverter !== 'undefined') {
        BinaryConverter().then(wasmModule => {
            module = wasmModule;
            console.log('WebAssembly module loaded successfully!');
            window.binaryConverterModule = module;
        }).catch(error => {
            console.error('Failed to load WebAssembly module:', error);
            if (typeof showResult === 'function') {
                showResult('Error loading WebAssembly module: ' + error.message, true);
            }
        });
    } else {
        setTimeout(_BinaryConverter, 100);
    }
}

// Start waiting for BinaryConverter
_BinaryConverter();

function showResult(content, isError = false) {
    const resultElement = document.getElementById('result');
    if (resultElement) {
        resultElement.innerHTML = content;
        resultElement.style.display = 'block';
        resultElement.className = 'result ' + (isError ? 'error' : 'success');
    }
}

function convertInteger() {
    if (!module) {
        showResult('WebAssembly module not loaded yet. Please wait...', true);
        return;
    }

    try {
        const input = document.getElementById('numberInput').value.trim();
        if (!input) {
            showResult('กรุณาใส่ตัวเลข!', true);
            return;
        }

        const num = parseInt(input);
        if (isNaN(num)) {
            showResult('กรุณาใส่จำนวนเต็มที่ถูกต้อง!', true);
            return;
        }

        const binaryPtr = module._int_to_binary(num);
        const binary = module.UTF8ToString(binaryPtr);
        showResult(`<strong>Integer ${num}</strong><br>Binary: <strong>${binary}</strong>`);
    } catch (error) {
        showResult('Error: ' + error.message, true);
    }
}

function convertFloat() {
    if (!module) {
        showResult('WebAssembly module not loaded yet. Please wait...', true);
        return;
    }

    try {
        const input = document.getElementById('numberInput').value.trim();
        if (!input) {
            showResult('กรุณาใส่ตัวเลข!', true);
            return;
        }

        const num = parseFloat(input);
        if (isNaN(num)) {
            showResult('กรุณาใส่ตัวเลขทศนิยมที่ถูกต้อง!', true);
            return;
        }

        const binaryPtr = module._float_to_binary(num);
        const binary = module.UTF8ToString(binaryPtr);

        // Get IEEE 754
        const sign = module._get_sign_bit(num);
        const exponent = module._get_exponent(num);
        const mantissa = module._get_mantissa(num);

        showResult(`<strong>Float ${num}</strong><br>Binary: <strong>${binary}</strong><br><br>IEEE 754 Components:<br>Sign: ${sign}<br>Exponent: ${exponent}<br>Mantissa: ${mantissa}`);
    } catch (error) {
        showResult('Error: ' + error.message, true);
    }
}

const numberInput = document.getElementById('numberInput');
if (numberInput) {
    numberInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            const input = this.value.trim();
            if (input.includes('.') || input.includes('e') || input.includes('E')) {
                convertFloat();
            } else {
                convertInteger();
            }
        }
    });
}