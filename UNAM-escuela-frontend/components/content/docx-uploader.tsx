"use client";

import React, { useRef, useState } from "react";
import { Button, Progress, Card, CardBody } from "@heroui/react";
import { Upload, FileText, X, CheckCircle, AlertCircle } from "lucide-react";
import { useDocxConversion } from "@/app/hooks/use-docx-conversion";

interface DocxUploaderProps {
  contentId: string;
  onSuccess?: (data: string) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
  className?: string;
}

export default function DocxUploader({
  contentId,
  onSuccess,
  onError,
  disabled = false,
  className = "",
}: DocxUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const docxConversionMutation = useDocxConversion();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const isDocx =
        file.name.toLowerCase().endsWith(".docx") ||
        file.type.includes("officedocument.wordprocessingml.document");

      if (!isDocx) {
        setErrorMessage("Solo se permiten archivos Word (.docx)");
        setUploadStatus("error");
        return;
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        setErrorMessage(
          "El archivo es demasiado grande. Máximo 10MB permitido."
        );
        setUploadStatus("error");
        return;
      }

      setSelectedFile(file);
      setUploadStatus("idle");
      setErrorMessage("");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !contentId) {
      return;
    }

    setUploadStatus("uploading");

    try {
      const result = await docxConversionMutation.mutateAsync({
        contentId,
        docxBase64: await fileToBase64(selectedFile),
      });

      if (result.error) {
        setUploadStatus("error");
        setErrorMessage(result.error);
      } else {
        setUploadStatus("success");
        setSelectedFile(null);
        onSuccess?.(result.data);
      }
    } catch (error) {
      setUploadStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Error desconocido"
      );
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setUploadStatus("idle");
    setErrorMessage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className={`w-full ${className}`}>
      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || uploadStatus === "uploading"}
      />

      {/* Upload Button */}
      {!selectedFile && uploadStatus === "idle" && (
        <div className="flex justify-center">
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            variant="bordered"
            startContent={<Upload className="h-4 w-4" />}
            className="w-full max-w-sm"
          >
            Subir archivo Word (.docx)
          </Button>
        </div>
      )}

      {/* Selected File Display */}
      {selectedFile && uploadStatus !== "success" && (
        <Card className="w-full">
          <CardBody className="p-4">
            <div className="flex items-start gap-3">
              <FileText className="h-8 w-8 text-blue-500 flex-shrink-0 mt-1" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatFileSize(selectedFile.size)}
                </p>

                {uploadStatus === "uploading" && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                      <span>Convirtiendo a Markdown...</span>
                      <span>Por favor espera</span>
                    </div>
                    <Progress
                      isIndeterminate
                      size="sm"
                      color="primary"
                      className="max-w-md"
                    />
                  </div>
                )}

                {uploadStatus === "error" && errorMessage && (
                  <div className="mt-2 flex items-center gap-2 text-red-600 text-xs">
                    <AlertCircle className="h-3 w-3" />
                    <span>{errorMessage}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 flex-shrink-0">
                {uploadStatus === "idle" && (
                  <>
                    <Button
                      size="sm"
                      color="primary"
                      onClick={handleUpload}
                      disabled={disabled}
                      startContent={<Upload className="h-3 w-3" />}
                    >
                      Convertir
                    </Button>
                    <Button
                      size="sm"
                      variant="light"
                      onClick={handleCancel}
                      disabled={disabled}
                      isIconOnly
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </>
                )}

                {uploadStatus === "uploading" && (
                  <Button size="sm" variant="light" disabled isIconOnly>
                    <div className="animate-spin h-3 w-3 border border-gray-300 border-t-primary rounded-full" />
                  </Button>
                )}

                {uploadStatus === "error" && (
                  <Button
                    size="sm"
                    variant="light"
                    onClick={handleCancel}
                    isIconOnly
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Success State */}
      {uploadStatus === "success" && (
        <Card className="w-full border-green-200 bg-green-50">
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div className="flex-1">
                <p className="font-medium text-sm text-green-800">
                  ¡Archivo convertido exitosamente!
                </p>
                <p className="text-xs text-green-600 mt-1">
                  El contenido de tu documento Word ya está disponible en el
                  editor.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
