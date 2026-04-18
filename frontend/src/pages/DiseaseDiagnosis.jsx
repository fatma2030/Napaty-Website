import React, { useState } from "react";
import { FaCloudUploadAlt, FaImage, FaSpinner, FaCheckCircle } from "react-icons/fa";
import api from "../api/api"; 
import "../style/DiseaseDiagnosis.css";


const DiseaseDiagnosis = ({ language = "ar" }) => {
  const isArabic = language === "ar";

  const [selectedFile, setSelectedFile] = useState(null);    
  const [selectedImage, setSelectedImage] = useState(null);  
  const [result, setResult] = useState(null);                 
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const pickFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setResult({
        success: false,
        message: isArabic
          ? "من فضلك اختار صورة فقط (JPG/PNG/WEBP)"
          : "Please select an image only (JPG/PNG/WEBP)"
      });
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setResult({
        success: false,
        message: isArabic
          ? "حجم الصورة أكبر من 10MB"
          : "Image size is larger than 10MB"
      });
      return;
    }

    setSelectedFile(file);
    setResult(null);

    const reader = new FileReader();
    reader.onload = (e) => setSelectedImage(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    pickFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    pickFile(file);
  };

  const resetImage = () => {
    setSelectedFile(null);
    setSelectedImage(null);
    setResult(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile); 

      const res = await api.post("/api/diagnosis/upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResult({
        success: true,
        message: isArabic ? "تم رفع الصورة بنجاح" : "Image uploaded successfully",
        data: res.data,
      });
    } catch (err) {
      const status = err?.response?.status;
      const detail = err?.response?.data?.detail;

      let message = isArabic
        ? "حصل خطأ أثناء رفع الصورة"
        : "An error occurred while uploading the image";

      if (status === 401) {
        message = isArabic
          ? "عليك تسجّل الدخول أولاً لتتمكن من رفع الصورة"
          : "You need to log in first to upload the image";
      } else if (status === 403) {
        message = isArabic
          ? "ليس لديك صلاحية لرفع الصورة"
          : "You do not have permission to upload the image";
      } else if (detail) {
        message = detail;
      }

      setResult({
        success: false,
        message,
        status,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const uploadedImagePath = result?.success ? result?.data?.data?.image : null;

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>{isArabic ? "تشخيص أمراض النبات" : "Plant Disease Diagnosis"}</h2>
        <p>
          {isArabic
            ? "قم برفع صورة للنبات المصاب للحصول على تشخيص دقيق وعلاج مناسب"
            : "Upload an image of the infected plant to get an accurate diagnosis and suitable treatment"}
        </p>
      </div>

      <div className="diagnosis-container">
        <div className="upload-section">
          <div
            className={`upload-area ${isDragging ? "dragging" : ""} ${selectedImage ? "has-image" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {selectedImage ? (
              <div className="image-preview">
                <img
                  src={selectedImage}
                  alt={isArabic ? "النبات المصاب" : "Infected Plant"}
                />
                <div className="image-overlay">
                  <button
                    type="button"
                    className="change-image-btn"
                    onClick={resetImage}
                    disabled={isLoading}
                  >
                    <FaImage /> {isArabic ? "تغيير الصورة" : "Change Image"}
                  </button>
                </div>
              </div>
            ) : (
              <label className="upload-label">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="file-input"
                  disabled={isLoading}
                />
                <div className="upload-placeholder">
                  <div className="upload-icon">
                    <FaCloudUploadAlt />
                  </div>
                  <h3>{isArabic ? "رفع صورة النبات" : "Upload Plant Image"}</h3>
                  <p>
                    {isArabic
                      ? "اسحب وأفلت الصورة هنا أو انقر للاختيار"
                      : "Drag and drop the image here or click to choose"}
                  </p>
                  <div className="upload-features">
                    <span>
                      {isArabic ? "يدعم: JPG, PNG, WEBP" : "Supports: JPG, PNG, WEBP"}
                    </span>
                    <span>
                      {isArabic ? "الحد الأقصى: 10MB" : "Maximum size: 10MB"}
                    </span>
                  </div>
                </div>
              </label>
            )}
          </div>

          {selectedFile && (
            <button
              type="button"
              onClick={handleUpload}
              disabled={isLoading}
              className={`diagnose-btn ${isLoading ? "loading" : ""}`}
            >
              {isLoading ? (
                <>
                  <FaSpinner className="spinner" />
                  {isArabic ? "جاري الرفع..." : "Uploading..."}
                </>
              ) : (
                <>
                  <FaCheckCircle />
                  {isArabic ? "تشخيص المرض" : "Diagnose Disease"}
                </>
              )}
            </button>
          )}
        </div>

        {result && (
          <div className="result-section">
            <div className="result-header">
              <FaCheckCircle className="success-icon" />
              <h3>{result.success
                ? (isArabic ? "تمت العملية" : "Process Completed")
                : (isArabic ? "حصل خطأ" : "An Error Occurred")}</h3>
            </div>

            <div className="diagnosis-card">
              <p><b>{result.message}</b></p>

              {uploadedImagePath && (
                <div style={{ marginTop: 12 }}>
                  <p><b>{isArabic ? "الصورة المرفوعة:" : "Uploaded Image:"}</b></p>
                  <img
                    src={`http://127.0.0.1:8000${uploadedImagePath}`}
                    alt="Uploaded"
                    style={{ maxWidth: "100%", borderRadius: 10 }}
                  />
                </div>
              )}

            
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiseaseDiagnosis;
