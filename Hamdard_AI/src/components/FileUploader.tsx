import React, { useState } from 'react';
import { Upload, Camera, X, Loader2, Image as ImageIcon } from 'lucide-react';

interface FileUploaderProps {
  onFileSelect: (base64: string) => void;
  isProcessing: boolean;
  label: string;
  description: string;
}

export default function FileUploader({ onFileSelect, isProcessing, label, description }: FileUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        setPreview(reader.result as string);
        onFileSelect(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const clear = () => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-white rounded-3xl border border-stone-200 shadow-sm">
      {preview ? (
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-stone-100 group">
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          <button
            onClick={clear}
            className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          {isProcessing && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white gap-3 backdrop-blur-sm">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="font-medium">Analyzing image...</span>
            </div>
          )}
        </div>
      ) : (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="w-full aspect-video border-2 border-dashed border-stone-200 rounded-2xl flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-primary/40 hover:bg-stone-50 transition-all group"
        >
          <div className="p-4 bg-stone-100 rounded-full group-hover:bg-primary/10 transition-colors">
            <Camera className="w-8 h-8 text-stone-400 group-hover:text-primary" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-serif font-bold text-primary">{label}</h3>
            <p className="text-sm text-stone-500 mt-1">{description}</p>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>
      )}

      {!preview && (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 text-primary font-semibold hover:underline"
        >
          <Upload className="w-4 h-4" />
          <span>Upload from Gallery</span>
        </button>
      )}
    </div>
  );
}
