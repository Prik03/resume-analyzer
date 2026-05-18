import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { formatSize } from "~/lib/utils";

interface FileUploaderProps {
  onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0] || null;
      onFileSelect?.(file);
    },
    [onFileSelect],
  );

  const maxFIleSIze = 20 * 1024 * 1024;
  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      onDrop,
      multiple: false,
      accept: { "applicaton/pdf": [".pdf"] },
      maxSize: maxFIleSIze,
    });
  const file = acceptedFiles[0] || null;
  return (
    <div className="w-full gradient-border">
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {/* {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop some files here, or click to select files</p>
      )} */}
        <div className="space-y-4 cursor-pointer">
          {file ? (
            <div
              className="uploader-selected-file"
              onClick={(e) => e.stopPropagation()}
            >
              {" "}
              <img src="/images/pdf.png" alt="" className="size-10" />
              <div className="flex items-center space-x-3">
                <div>
                  <p className="text-sm text-gray-700 font-medium truncate max-w-xw">
                    {file.name}
                  </p>
                  <p className="text-sm text-gray">{formatSize(file.size)}</p>
                </div>
              </div>
              <button
                className="p-2 cursor-pointer"
                onClick={(e) => {
                  onFileSelect?.(null);
                }}
              >
                <img
                  src="/icons/cross.svg"
                  alt={"Remove, " + file.name}
                  className="w-4 h-4"
                />
              </button>
            </div>
          ) : (
            <div>
              <div className="mx-auto w-16 h-16 flex items-center justify-center">
                <img src="/icons/info.svg" alt="Upload" className="size-20" />
              </div>
              <p className="text-lg text-gray-500">
                <span className="font-bold">Click to upload</span> or drag and
                drop
              </p>
              <p className="text-lg text-gray-500">
                PDF (max {formatSize(maxFIleSIze)})
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
