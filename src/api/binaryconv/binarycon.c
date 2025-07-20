#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>
#include <math.h>

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#define EXPORT EMSCRIPTEN_KEEPALIVE
#else
#define EXPORT
#endif

static char binary_result[65]; // 64 bits + null terminator

EXPORT char* int_to_binary(int num) {
    if (num == 0) {
        strcpy(binary_result, "0");
        return binary_result;
    }
    
    int is_negative = (num < 0);
    if (is_negative) {
        uint32_t unsigned_num = (uint32_t)num;
        
        for (int i = 31; i >= 0; i--) {
            binary_result[31 - i] = ((unsigned_num >> i) & 1) ? '1' : '0';
        }
        binary_result[32] = '\0';
    } else {
        int temp = num;
        int index = 0;
        char temp_result[64];
        
        while (temp > 0) {
            temp_result[index++] = (temp % 2) ? '1' : '0';
            temp /= 2;
        }
        
        for (int i = 0; i < index; i++) {
            binary_result[i] = temp_result[index - 1 - i];
        }
        binary_result[index] = '\0';
    }
    
    return binary_result;
}

EXPORT char* float_to_binary(float num) {
    union {
        float f;
        uint32_t i;
    } converter;
    
    converter.f = num;
    uint32_t bits = converter.i;
    
    for (int i = 31; i >= 0; i--) {
        binary_result[31 - i] = ((bits >> i) & 1) ? '1' : '0';
    }
    binary_result[32] = '\0';
    
    return binary_result;
}

EXPORT int get_sign_bit(float num) {
    union {
        float f;
        uint32_t i;
    } converter;
    
    converter.f = num;
    return (converter.i >> 31) & 1;
}

EXPORT uint32_t get_exponent(float num) {
    union {
        float f;
        uint32_t i;
    } converter;
    
    converter.f = num;
    return (converter.i >> 23) & 0xFF;
}

EXPORT uint32_t get_mantissa(float num) {
    union {
        float f;
        uint32_t i;
    } converter;
    
    converter.f = num;
    return converter.i & 0x7FFFFF;
}

static char double_binary_result[65];

EXPORT char* double_to_binary(double num) {
    union {
        double d;
        uint64_t i;
    } converter;
    
    converter.d = num;
    uint64_t bits = converter.i;
    
    for (int i = 63; i >= 0; i--) {
        double_binary_result[63 - i] = ((bits >> i) & 1) ? '1' : '0';
    }
    double_binary_result[64] = '\0';
    
    return double_binary_result;
}

EXPORT int binary_to_int(const char* binary_str) {
    if (!binary_str || strlen(binary_str) == 0) {
        return 0;
    }
    
    int result = 0;
    int len = strlen(binary_str);
    
    if (len == 32 && binary_str[0] == '1') {
        result = -1;
        for (int i = 1; i < 32; i++) {
            if (binary_str[i] == '0') {
                result -= (1 << (31 - i));
            }
        }
    } else {
        for (int i = 0; i < len; i++) {
            if (binary_str[i] == '1') {
                result += (1 << (len - 1 - i));
            }
        }
    }
    
    return result;
}

EXPORT float binary_to_float(const char* binary_str) {
    if (!binary_str || strlen(binary_str) != 32) {
        return 0.0f;
    }
    
    union {
        float f;
        uint32_t i;
    } converter;
    
    converter.i = 0;
    
    for (int i = 0; i < 32; i++) {
        if (binary_str[i] == '1') {
            converter.i |= (1 << (31 - i));
        }
    }
    
    return converter.f;
}

EXPORT double binary_to_double(const char* binary_str) {
    if (!binary_str || strlen(binary_str) != 64) {
        return 0.0;
    }
    
    union {
        double d;
        uint64_t i;
    } converter;
    
    converter.i = 0;
    
    for (int i = 0; i < 64; i++) {
        if (binary_str[i] == '1') {
            converter.i |= (1ULL << (63 - i));
        }
    }
    
    return converter.d;
}

EXPORT char* build_float_binary(int sign, uint32_t exponent, uint32_t mantissa) {
    union {
        float f;
        uint32_t i;
    } converter;
    
    converter.i = 0;
    converter.i |= (sign & 1) << 31;        
    converter.i |= (exponent & 0xFF) << 23; 
    converter.i |= mantissa & 0x7FFFFF;     
    
    return float_to_binary(converter.f);
}

// Regularly compile using mingw gcc g++
#ifndef __EMSCRIPTEN__
int main() {
    int choice;
    char input_str[256];
    
    printf("=== Binary Converter Interactive Mode ===\n");
    printf("1. Integer to Binary\n");
    printf("2. Binary to Integer\n");
    printf("3. Float to Binary\n");
    printf("4. Binary to Float\n");
    printf("5. Double to Binary\n");
    printf("6. Binary to Double\n");
    printf("7. Manual Float Construction\n");
    printf("8. Run All Tests\n");
    printf("0. Exit\n");
    
    while (1) {
        printf("\nEnter your choice (0-8): ");
        if (scanf("%d", &choice) != 1) {
            printf("Invalid input. Please enter a number.\n");
            while (getchar() != '\n'); // Clear input buffer
            continue;
        }
        
        switch (choice) {
            case 0:
                printf("Goodbye!\n");
                return 0;
                
            case 1: {
                int num;
                printf("Enter an integer: ");
                if (scanf("%d", &num) == 1) {
                    char* binary = int_to_binary(num);
                    printf("Integer %d in binary: %s\n", num, binary);
                } else {
                    printf("Invalid input!\n");
                    while (getchar() != '\n');
                }
                break;
            }
            
            case 2: {
                printf("Enter binary string (e.g., 101010): ");
                if (scanf("%255s", input_str) == 1) {
                    int result = binary_to_int(input_str);
                    printf("Binary %s = Integer %d\n", input_str, result);
                } else {
                    printf("Invalid input!\n");
                    while (getchar() != '\n');
                }
                break;
            }
            
            case 3: {
                float num;
                printf("Enter a float: ");
                if (scanf("%f", &num) == 1) {
                    char* binary = float_to_binary(num);
                    printf("Float %.6f in binary: %s\n", num, binary);
                    printf("  Sign: %d, Exponent: %u, Mantissa: %u\n", 
                           get_sign_bit(num), get_exponent(num), get_mantissa(num));
                } else {
                    printf("Invalid input!\n");
                    while (getchar() != '\n');
                }
                break;
            }
            
            case 4: {
                printf("Enter 32-bit binary string: ");
                if (scanf("%255s", input_str) == 1) {
                    if (strlen(input_str) == 32) {
                        float result = binary_to_float(input_str);
                        printf("Binary %s = Float %.6f\n", input_str, result);
                    } else {
                        printf("Error: Must be exactly 32 bits!\n");
                    }
                } else {
                    printf("Invalid input!\n");
                    while (getchar() != '\n');
                }
                break;
            }
            
            case 5: {
                double num;
                printf("Enter a double: ");
                if (scanf("%lf", &num) == 1) {
                    char* binary = double_to_binary(num);
                    printf("Double %.15f in binary: %s\n", num, binary);
                } else {
                    printf("Invalid input!\n");
                    while (getchar() != '\n');
                }
                break;
            }
            
            case 6: {
                printf("Enter 64-bit binary string: ");
                if (scanf("%255s", input_str) == 1) {
                    if (strlen(input_str) == 64) {
                        double result = binary_to_double(input_str);
                        printf("Binary %s = Double %.15f\n", input_str, result);
                    } else {
                        printf("Error: Must be exactly 64 bits!\n");
                    }
                } else {
                    printf("Invalid input!\n");
                    while (getchar() != '\n');
                }
                break;
            }
            
            case 7: {
                int sign;
                unsigned int exponent, mantissa;
                printf("Enter sign bit (0 or 1): ");
                if (scanf("%d", &sign) != 1) {
                    printf("Invalid sign!\n");
                    while (getchar() != '\n');
                    break;
                }
                printf("Enter exponent (0-255): ");
                if (scanf("%u", &exponent) != 1) {
                    printf("Invalid exponent!\n");
                    while (getchar() != '\n');
                    break;
                }
                printf("Enter mantissa (0-8388607): ");
                if (scanf("%u", &mantissa) != 1) {
                    printf("Invalid mantissa!\n");
                    while (getchar() != '\n');
                    break;
                }
                
                char* binary = build_float_binary(sign, exponent, mantissa);
                float result = binary_to_float(binary);
                printf("Manual float: %s = %.6f\n", binary, result);
                break;
            }
            
            case 8: {
                printf("\n=== Running All Tests ===\n");
                
                printf("--- Integer Tests ---\n");
                int test_ints[] = {42, -42, 0, 255, -128, 1024};
                int num_tests = sizeof(test_ints) / sizeof(test_ints[0]);
                
                for (int i = 0; i < num_tests; i++) {
                    char* binary = int_to_binary(test_ints[i]);
                    int converted = binary_to_int(binary);
                    printf("Integer %d: %s (converted back: %d)\n", test_ints[i], binary, converted);
                }
                
                printf("\n--- Float Tests ---\n");
                float test_floats[] = {3.14f, -2.5f, 0.0f, 1.0f, -1.0f};
                int num_float_tests = sizeof(test_floats) / sizeof(test_floats[0]);
                
                for (int i = 0; i < num_float_tests; i++) {
                    char* binary = float_to_binary(test_floats[i]);
                    float converted = binary_to_float(binary);
                    printf("Float %.2f: %s (converted back: %.2f)\n", test_floats[i], binary, converted);
                    printf("  Sign: %d, Exponent: %u, Mantissa: %u\n", 
                           get_sign_bit(test_floats[i]), 
                           get_exponent(test_floats[i]), 
                           get_mantissa(test_floats[i]));
                }
                
                printf("\n--- Double Tests ---\n");
                double test_doubles[] = {3.141592653589793, -2.718281828459045};
                int num_double_tests = sizeof(test_doubles) / sizeof(test_doubles[0]);
                
                for (int i = 0; i < num_double_tests; i++) {
                    char* binary = double_to_binary(test_doubles[i]);
                    double converted = binary_to_double(binary);
                    printf("Double %.15f: %s (converted back: %.15f)\n", test_doubles[i], binary, converted);
                }
                
                printf("\n--- Manual Float Construction ---\n");
                char* manual_binary = build_float_binary(0, 128, 0x400000); // 2.0
                float manual_float = binary_to_float(manual_binary);
                printf("Manual float: %s = %.2f\n", manual_binary, manual_float);
                break;
            }
            
            default:
                printf("Invalid choice! Please enter 0-8.\n");
                break;
        }
    }
    
    return 0;
}
#endif

/*
    gcc -O3 -march=native -Wall -Wextra -lm binarycon.c -o binarycon
    emcc binarycon.c -o binarycon.js -s EXPORTED_FUNCTIONS="['_int_to_binary','_float_to_binary','_double_to_binary','_get_sign_bit','_get_exponent','_get_mantissa','_binary_to_int','_binary_to_float','_binary_to_double','_build_float_binary','_malloc','_free']" -s EXPORTED_RUNTIME_METHODS="['ccall','cwrap','UTF8ToString','stringToUTF8']" -s MODULARIZE=1 -s EXPORT_NAME="BinaryConverter" -O3
*/