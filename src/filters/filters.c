#include <stdio.h>
#include <stdint.h>
#include <stdlib.h>
#include <string.h>
#include <emscripten.h>

typedef struct {
    uint8_t r, g, b;
} RGB;

EMSCRIPTEN_KEEPALIVE
void apply_black_and_white(RGB* image, int width, int height) {
    for (int i = 0; i < width * height; i++) {
        uint8_t avg = (image[i].r + image[i].g + image[i].b) / 3;
        image[i].r = image[i].g = image[i].b = avg;
    }
}

EMSCRIPTEN_KEEPALIVE
void apply_blur(RGB *image, int width, int height) {
    RGB *blurImage = malloc(width * height * sizeof(RGB));
    if (!blurImage) return;

    for (int y = 0; y < height; y++) {
        for (int x = 0; x < width; x++) {
            int sum_r = 0, sum_g = 0, sum_b = 0;
            int count = 0;

            for (int a = x - 1; a <= x + 1; a++) {
                for (int b = y - 1; b <= y + 1; b++) {
                    if (a >= 0 && a < width && b >= 0 && b < height) {
                        RGB pixel = image[b * width + a];
                        sum_r += pixel.r;
                        sum_g += pixel.g;
                        sum_b += pixel.b;
                        count++;
                    }
                }
            }

            RGB *blurPixel = &blurImage[y * width + x];
            blurPixel->r = sum_r / count;
            blurPixel->g = sum_g / count;
            blurPixel->b = sum_b / count;
        }
    }

    memcpy(image, blurImage, width * height * sizeof(RGB));
    free(blurImage);
}

EMSCRIPTEN_KEEPALIVE
void apply_darken(RGB *image, int width, int height) {
    for (int i = 0; i < width * height; i++) {
        RGB *pixel = &image[i];
        pixel->r = (pixel->r >= 30) ? pixel->r - 30 : 0;
        pixel->g = (pixel->g >= 30) ? pixel->g - 30 : 0;
        pixel->b = (pixel->b >= 30) ? pixel->b - 30 : 0;
    }
}

EMSCRIPTEN_KEEPALIVE
void apply_edges(RGB *image, int width, int height) {
    RGB *edgeImage = malloc(width * height * sizeof(RGB));
    if (!edgeImage) return;

    for (int y = 0; y < height; y++) {
        for (int x = 0; x < width; x++) {
            int sum_r = 0, sum_g = 0, sum_b = 0;

            for (int a = x - 1; a <= x + 1; a++) {
                for (int b = y - 1; b <= y + 1; b++) {
                    int weight = (a == x && b == y) ? 8 : -1;

                    if (a >= 0 && a < width && b >= 0 && b < height) {
                        RGB pixel = image[b * width + a];
                        sum_r += weight * pixel.r;
                        sum_g += weight * pixel.g;
                        sum_b += weight * pixel.b;
                    }
                }
            }

            RGB *edgePixel = &edgeImage[y * width + x];
            edgePixel->r = (sum_r < 0) ? 0 : (sum_r > 255 ? 255 : sum_r);
            edgePixel->g = (sum_g < 0) ? 0 : (sum_g > 255 ? 255 : sum_g);
            edgePixel->b = (sum_b < 0) ? 0 : (sum_b > 255 ? 255 : sum_b);
        }
    }

    memcpy(image, edgeImage, width * height * sizeof(RGB));
    free(edgeImage);
}

EMSCRIPTEN_KEEPALIVE
void apply_lighten(RGB *image, int width, int height) {
    for (int i = 0; i < width * height; i++) {
        RGB *pixel = &image[i];
        pixel->r = (pixel->r + 20 > 255) ? 255 : pixel->r + 20;
        pixel->g = (pixel->g + 20 > 255) ? 255 : pixel->g + 20;
        pixel->b = (pixel->b + 20 > 255) ? 255 : pixel->b + 20;
    }
}
