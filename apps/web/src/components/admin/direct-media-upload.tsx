'use client';

import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  Film,
  X,
  Check,
  AlertCircle,
  Loader2,
  Play,
  Link as LinkIcon,
  HardDrive,
} from 'lucide-react';

interface DirectMediaUploadProps {
  label: string;
  type: 'image' | 'video';
  value: string;
  onChange: (url: string) => void;
  helperText?: string;
}

export function DirectMediaUpload({
  label,
  type,
  value,
  onChange,
  helperText,
}: DirectMediaUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptedTypes =
    type === 'image'
      ? 'image/png,image/jpeg,image/webp,image/gif,image/svg+xml,image/avif'
      : 'video/mp4,video/webm,video/ogg,video/quicktime';

  const handleFile = async (file: File) => {
    setError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Upload failed with status ${res.status}`);
      }

      const data = await res.json();
      if (data.url) {
        onChange(data.url);
      } else {
        throw new Error('No URL returned from upload');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to upload media file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleClear = () => {
    onChange('');
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const isVideo = type === 'video';
  const Icon = isVideo ? Film : ImageIcon;

  return (
    <div className="space-y-1.5 text-xs">
      {/* Header & Mode Switcher */}
      <div className="flex items-center justify-between">
        <label className="font-semibold text-neutral-300 flex items-center gap-1.5">
          <Icon className={`h-3.5 w-3.5 ${isVideo ? 'text-emerald-400' : 'text-sky-400'}`} />
          <span>{label}</span>
          <span className="rounded bg-neutral-800 px-1.5 py-0.2 text-[9px] font-mono text-neutral-400">
            Local Disk Upload
          </span>
        </label>

        <div className="flex items-center gap-1 text-[10px]">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
              mode === 'upload' ? 'bg-neutral-800 text-white font-semibold' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <span className="flex items-center gap-1">
              <HardDrive className="h-2.5 w-2.5" /> From Disk
            </span>
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
              mode === 'url' ? 'bg-neutral-800 text-white font-semibold' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <span className="flex items-center gap-1">
              <LinkIcon className="h-2.5 w-2.5" /> URL Link
            </span>
          </button>
        </div>
      </div>

      {/* Main Upload / Preview Area */}
      {mode === 'upload' ? (
        <div className="space-y-2">
          {/* Active Upload Preview */}
          {value ? (
            <div className="relative rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 flex items-center gap-3">
              {/* Media Thumbnail */}
              <div className="relative h-16 w-24 shrink-0 rounded-lg overflow-hidden border border-neutral-800 bg-neutral-900 flex items-center justify-center">
                {isVideo ? (
                  <video
                    src={value}
                    muted
                    autoPlay
                    loop
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={value}
                    alt={label}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Path & Details */}
              <div className="flex-1 min-w-0">
                <span className="block text-[11px] font-semibold text-white truncate font-mono">
                  {value}
                </span>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5 font-medium">
                  <Check className="h-3 w-3" />
                  Stored directly in local app storage
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-lg bg-neutral-800 px-2 py-1 text-[10px] text-neutral-300 hover:text-white transition-colors cursor-pointer"
                >
                  Replace
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1 text-neutral-500 hover:text-red-400 rounded transition-colors cursor-pointer"
                  title="Remove file"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ) : (
            /* Drag & Drop Upload Zone */
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-4 transition-all flex flex-col items-center justify-center text-center cursor-pointer ${
                isDragging
                  ? 'border-emerald-500 bg-emerald-500/10'
                  : 'border-neutral-800 bg-neutral-950/60 hover:border-neutral-700 hover:bg-neutral-900/40'
              }`}
            >
              {isUploading ? (
                <div className="flex flex-col items-center gap-1.5 py-2">
                  <Loader2 className="h-5 w-5 text-emerald-400 animate-spin" />
                  <span className="text-xs text-neutral-300 font-medium">
                    Uploading directly to local library...
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5 py-1">
                  <div className="h-8 w-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400">
                    <UploadCloud className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-neutral-200">
                      Click to choose {type} from disk
                    </span>
                    <span className="text-neutral-500 block text-[10px]">
                      or drag & drop {isVideo ? 'MP4 / WebM' : 'PNG / JPG / WebP / SVG'} file directly
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Hidden HTML File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedTypes}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
            className="hidden"
          />
        </div>
      ) : (
        /* Fallback URL Input Mode */
        <div className="relative">
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`https://.../preview.${isVideo ? 'mp4' : 'jpg'}`}
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-white outline-none focus:border-emerald-500 font-mono text-[11px]"
          />
        </div>
      )}

      {/* Error Notice */}
      {error && (
        <div className="flex items-center gap-1.5 text-[10px] text-red-400 mt-1">
          <AlertCircle className="h-3 w-3" />
          <span>{error}</span>
        </div>
      )}

      {helperText && (
        <p className="text-[10px] text-neutral-500">{helperText}</p>
      )}
    </div>
  );
}

