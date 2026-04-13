// pages/SoilAnalysis.js
import React, { useState } from 'react';
import { FaSeedling, FaCheckCircle, FaLeaf } from 'react-icons/fa';

const SoilAnalysis = () => {
  const [selectedSoilType, setSelectedSoilType] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const soilTypes = [
    { id: 'sandy', name: 'تربة رملية', description: 'حبيبات كبيرة، تصريف مائي سريع' },
    { id: 'clay', name: 'تربة طينية', description: 'حبيبات دقيقة، تحتفظ بالماء' },
    { id: 'loamy', name: 'تربة طميية', description: 'مزيج متوازن، أفضل للزراعة' },
    { id: 'silty', name: 'تربة سلتية', description: 'حبيبات متوسطة، خصبة' }
  ];

  const handleSoilTypeChange = (soilId) => {
    setSelectedSoilType(soilId);
  };

  const handleAnalysis = async (e) => {
    if (e) e.preventDefault(); //  أهم سطر: يمنع المتصفح من إرسال GET لبورت 3000

    if (!selectedSoilType) {
      alert('يرجى اختيار نوع التربة');
      return;
    }

    setIsLoading(true);

    try {
const response = await fetch('http://127.0.0.1:8000/api/soil/analyze/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          soil_type: selectedSoilType
        }),
      });

     if (response.status === 401) {
  alert('لازم تخلي ال API AllowAny في Django');
  return;
}

if (!response.ok) {
  throw new Error('Server error');
}


      const data = await response.json();
      console.log("API Response:", data);

      setAnalysisResult({
        soilType: data.soil_type || data.soilType || 'غير معروف',
        plants: Array.isArray(data.plants)
          ? data.plants
          : typeof data.plants === 'string'
          ? data.plants.split(/،|,/)
          : [],
        fertilizers: Array.isArray(data.fertilizers)
          ? data.fertilizers
          : typeof data.fertilizers === 'string'
          ? data.fertilizers.split(/،|,/)
          : []
      });

    } catch (error) {
      console.error(error);
      alert('حصل خطأ في الاتصال بالسيرفر. تأكد أن Django يعمل على بورت 8000');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>تحليل التربة وتوصية المحاصيل</h2>
        <p>اختر نوع التربة للحصول على توصيات الزراعة المناسبة</p>
      </div>

      <div className="analysis-container">
        <div className="soil-selection-section">
          <h3 className="section-title">
            <FaSeedling /> اختر نوع التربة
          </h3>

          <div className="soil-types-grid">
            {soilTypes.map((soil) => (
              <label key={soil.id} className="soil-type-label">
                <input
                  type="radio"
                  name="soilType"
                  checked={selectedSoilType === soil.id}
                  onChange={() => handleSoilTypeChange(soil.id)}
                  className="soil-radio"
                />
                <div className="soil-type-card">
                  <div className="radio-circle"></div>
                  <div className="soil-content">
                    <h4>{soil.name}</h4>
                    <p>{soil.description}</p>
                  </div>
                </div>
              </label>
            ))}
          </div>

          <div className="analysis-actions">
            <button
              type="button" 
              onClick={(e) => handleAnalysis(e)} 
              disabled={!selectedSoilType || isLoading}
              className={`analyze-btn ${isLoading ? 'loading' : ''}`}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  جاري التحليل...
                </>
              ) : (
                <>
                  <FaCheckCircle />
                  المحاصيل والأسمدة المناسبة
                </>
              )}
            </button>
          </div>
        </div>

        {analysisResult && (
          <div className="result-section">
            <div className="result-header">
              <FaCheckCircle className="success-icon" />
              <h3>نتائج التحليل</h3>
            </div>

            <div className="soil-result-card">
              <div className="soil-type-banner">
                <h4>نوع التربة: {analysisResult.soilType}</h4>
              </div>

              <div className="recommendations-grid">
                <div className="recommendation-card">
                  <h5><FaLeaf /> المحاصيل المناسبة</h5>
                  <div className="list">
                    {analysisResult.plants.length > 0 ? (
                      analysisResult.plants.map((plant, idx) => (
                        <div key={idx} className="list-item">
                          <span>•</span> {plant}
                        </div>
                      ))
                    ) : (
                      <p>لا توجد بيانات</p>
                    )}
                  </div>
                </div>

                <div className="recommendation-card">
                  <h5>الأسمدة المناسبة</h5>
                  <div className="list">
                    {analysisResult.fertilizers.length > 0 ? (
                      analysisResult.fertilizers.map((fertilizer, idx) => (
                        <div key={idx} className="list-item">
                          <span>•</span> {fertilizer}
                        </div>
                      ))
                    ) : (
                      <p>لا توجد بيانات</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SoilAnalysis;