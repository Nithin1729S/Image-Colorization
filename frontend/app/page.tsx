"use client";

import { useState } from "react";
import { Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [colorizedImage, setColorizedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setOriginalImage(URL.createObjectURL(file));
    setIsSubmitted(false);
    setColorizedImage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsLoading(true);
    setIsSubmitted(true);

    // Create FormData for API request
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      // Replace with your actual API endpoint
      const response = await fetch("/api/colorize", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) throw new Error("Failed to colorize image");
      
      const data = await response.json();
      setColorizedImage(data.colorizedImageUrl);
    } catch (error) {
      console.error("Error colorizing image:", error);
      alert("Failed to colorize image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Image Colorization
          </h1>
          <p className="text-lg text-gray-600">
            Transform your black & white photos into vibrant colored images
          </p>
        </div>

        {/* Upload Form */}
        <form onSubmit={handleSubmit} className="mb-12 space-y-6">
          <label
            htmlFor="image-upload"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-12 h-12 mb-4 text-gray-500" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and
                drop
              </p>
              <p className="text-xs text-gray-500">PNG, JPG or JPEG</p>
              {selectedFile && (
                <p className="mt-2 text-sm text-blue-500 font-medium">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>
            <input
              id="image-upload"
              type="file"
              className="hidden"
              accept="image/png, image/jpeg"
              onChange={handleImageSelect}
            />
          </label>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={!selectedFile || isLoading}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium
                disabled:bg-gray-300 disabled:cursor-not-allowed
                hover:bg-blue-600 transition-colors"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </span>
              ) : (
                "Colorize Image"
              )}
            </button>
          </div>
        </form>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center space-y-4 mb-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <p className="text-gray-600">Processing your image...</p>
          </div>
        )}

        {/* Results Section */}
        {isSubmitted && (originalImage || colorizedImage) && (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Original Image */}
            {originalImage && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Original</h2>
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={originalImage}
                    alt="Original image"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            )}

            {/* Colorized Image */}
            {colorizedImage && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Colorized</h2>
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={colorizedImage}
                    alt="Colorized image"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}