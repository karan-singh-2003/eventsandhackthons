"use client";

import React, { useState } from "react";
import { Upload, X } from "lucide-react";

interface EventPhotoUploadProps {
  value: File | null;
  onChange: (file: File | null) => void;
}

export default function EventPhotoUpload({ value, onChange }: EventPhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (file: File) => {
    onChange(file); // ✅ pass file to parent

    // ✅ preview only
    setPreview(URL.createObjectURL(file));
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileChange(file);
  };

  const handleRemove = () => {
    onChange(null);
    setPreview(null);
  };

  return (
    <div className="border p-4 rounded-md bg-white shadow">
      <h2 className="text-lg font-semibold mb-2">Upload Event Photo</h2>

      {!preview ? (
        <label className="flex flex-col items-center justify-center border-2 border-dashed p-10 rounded cursor-pointer hover:bg-gray-50">
          <Upload className="w-10 h-10 text-gray-600" />
          <p className="mt-2 text-gray-500">Click to upload image</p>
          <input type="file" accept="image/*" className="hidden" onChange={handleInput} />
        </label>
      ) : (
        <div className="relative">
          <img src={preview} className="w-full h-64 object-cover rounded" />
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
