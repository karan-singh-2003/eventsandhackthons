'use client';

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function CreateAgentPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const [name, setName] = useState('');
  const [image, setImage] = useState<File | string | null>(null);
  const [previewImage, setPreviewImage] = useState<string>('/default-image.png');

  // Handle uploaded image
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Select default image
  const handleSelectDefault = () => {
    const defaultImg = '/airobotimage.webp';
    setImage(defaultImg);
    setPreviewImage(defaultImg);
  };

  // Create agent
  const handleCreate = async () => {
    const formData = new FormData();
    formData.append('name', name);

    if (image instanceof File) {
      formData.append('file', image);
    } else if (typeof image === 'string') {
      formData.append('imageurl', image);
    }

    const res = await fetch('/api/event/createagent', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    console.log('Agent Created:', data);

    router.push('/');
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-t from-black to-[#030353] flex flex-col justify-center items-center p-4">

      {/* Profile Preview */}
      <Image
        src={previewImage}
        alt="profile"
        width={200}
        height={200}
        className="rounded-full border-4 border-white shadow cursor-pointer hover:opacity-80 transition"
        onClick={handleSelectDefault}
      />

      {/* File Upload */}
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="mt-4"
      />

      {/* Name Input */}
      <Input
        placeholder="Enter your name"
        className="mt-6 text-white placeholder:text-gray-300"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {/* Create Button */}
      {name && (
        <Button
          onClick={handleCreate}
          className="mt-4 bg-amber-100 text-black"
        >
          Create Your Assistant
        </Button>
      )}
    </div>
  );
}
