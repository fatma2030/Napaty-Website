import React, { useState } from "react";
import { FaCloudUploadAlt, FaImage, FaSpinner, FaCheckCircle } from "react-icons/fa";
import api from "../api/api"; 

const DiseaseDiagnosis = () => {
  const [selectedFile, setSelectedFile] = useState(null);     // ✅ ملف الصورة للرفع
  const [selectedImage, setSelectedImage] = useState(null);   // ✅ preview base64
  const [result, setResult] = useState(null);                 // { success, message, status, data }
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const pickFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setResult({ success: false, message: "من فضلك اختار صورة فقط (JPG/PNG/WEBP)" });
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setResult({ success: false, message: "حجم الصورة أكبر من 10MB" });
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
        message: "تم رفع الصورة بنجاح",
        data: res.data,
      });
    } catch (err) {
      const status = err?.response?.status;
      const detail = err?.response?.data?.detail;

      let message = "حصل خطأ أثناء رفع الصورة";

      if (status === 401) {
        message = "عليك تسجّل الدخول أولاً لتتمكن من رفع الصورة";
      } else if (status === 403) {
        message = "ليس لديك صلاحية لرفع الصورة";
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
        <h2>تشخيص أمراض النبات</h2>
        <p>قم برفع صورة للنبات المصاب للحصول على تشخيص دقيق وعلاج مناسب</p>
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
                <img src={selectedImage} alt="النبات المصاب" />
                <div className="image-overlay">
                  <button
                    type="button"
                    className="change-image-btn"
                    onClick={resetImage}
                    disabled={isLoading}
                  >
                    <FaImage /> تغيير الصورة
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
                  <h3>رفع صورة النبات</h3>
                  <p>اسحب وأفلت الصورة هنا أو انقر للاختيار</p>
                  <div className="upload-features">
                    <span>يدعم: JPG, PNG, WEBP</span>
                    <span>الحد الأقصى: 10MB</span>
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
                  جاري الرفع...
                </>
              ) : (
                <>
                  <FaCheckCircle />
                     تشخيص المرض
                </>
              )}
            </button>
          )}
        </div>

        {result && (
          <div className="result-section">
            <div className="result-header">
              <FaCheckCircle className="success-icon" />
              <h3>{result.success ? "تمت العملية" : "حصل خطأ"}</h3>
            </div>

            <div className="diagnosis-card">
              <p><b>{result.message}</b></p>
              {/*result.status && <p>Status: {result.status}</p>*/}

              {uploadedImagePath && (
                <div style={{ marginTop: 12 }}>
                  <p><b>Uploaded Image:</b></p>
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
