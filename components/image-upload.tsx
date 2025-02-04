'use client';

import Image from "next/image";
import { useState } from "react";

export default function ImageUpload() {
    const [file, setFile] = useState<string | undefined>(undefined);
    const [imageArray, setImageArray] = useState<Uint8Array | null>(null);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files.length != 0) {
            const file = e.target.files[0];
            setFile(URL.createObjectURL(file));
            const reader = new FileReader();
            reader.readAsArrayBuffer(file); // Read file as binary

            reader.onload = () => {
                const img = new Image();
                img.src = reader.result as string;
                img.crossOrigin = "Anonymous"; // Prevent CORS issues

                const targetWidth = 28;  // Set the desired width
                const targetHeight = 28; // Set the desired height
                
                img.onload = () => {
                    // Create a smaller canvas for resizing
                    const canvas = document.createElement("canvas");
                    canvas.width = targetWidth;
                    canvas.height = targetHeight;
                    const ctx = canvas.getContext("2d");

                    if (ctx) {
                        // Draw the resized image on the canvas
                        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
                        const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
                        const pixelArray = imageData.data; // RGBA pixel data

                        // Convert to grayscale (Single channel)
                        const grayArray = new Uint8Array(targetWidth * targetHeight);

                        for (let i = 0; i < pixelArray.length; i += 4) {
                            const r = pixelArray[i];
                            const g = pixelArray[i + 1];
                            const b = pixelArray[i + 2];

                            // Grayscale formula: Y = 0.299R + 0.587G + 0.114B
                            const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
                            grayArray[i / 4] = gray; // Store as single channel
                        }

                        setGrayData({ width: targetWidth, height: targetHeight, array: grayArray });
                        console.log("Resized Grayscale Array:", grayArray);
                    }
                };
            };

            reader.onerror = () => {
                console.error("Error reading file.");
            }; 
        }
        else {
            return
        }
    }

   return (
        <div>
            <h2>Add Image:</h2>
            <input type="file" onChange={handleChange} />
            <Image
                src={file || ""}
                alt="test image"
                width={500}
                height={500}
             />
        </div>
   );
};
