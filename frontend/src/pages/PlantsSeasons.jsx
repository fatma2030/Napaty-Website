import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';




const CropsPage = () => {
  const [plants] = useState([
    {
      id: 1,
      name: "الطماطم",
      img: "/images/tomato3.jpg",
      season: "Summer",
      seasonText: "مارس - مايو",
      modalImg: "/images/tomato3.jpg",
      method: "تزرع البذور في أحواض بعمق 1-2 سم…",
      cost: "15,000 - 20,000 جنيه",
      growth: "90 - 120 يوم",
      fertilizer: "سماد NPK متوازن",
      
      
    },
    {
      id: 2,
      name: "الخيار",
      img: "/images/cucumber.jpg",
      season: "Spring",
      seasonText: "مارس - مايو",
      modalImg: "/images/cucumber.jpg",
      method: "تزرع البذور مباشرة في الأرض على عمق 2-3 سم مع ري منتظم",
      cost: "12,000 - 18,000 جنيه",
      growth: "50-70 يوم",
      fertilizer: "سماد عضوي + نيتروجين"
    },
    {
      id: 3,
      name: "الفلفل",
      img: "/images/pepper.jpg",
      season: "Spring",
      seasonText: "مارس - مايو",
      modalImg: "/images/pepper.jpg",
      method: " زراعة البذور في مشتل ثم نقل الشتلات بعد 6-8 أسابيع",
      cost: "25,000 جنيه - 18,000 جنيه",
      growth: "80-100 يوم",
      fertilizer: "سماد فوسفوري + بوتاسيوم"
    },
    {
      id: 4,
      name: "الخس",
      img: "/images/lettuce3.jpg",
      season: "Spring",
      seasonText: "مارس - مايو",
      modalImg: "/images/lettuce3.jpg",
      method: "بذر مباشر في أحواض أو صواني، مع الحفاظ على رطوبة التربة",
      cost: "8,000 - 12,000 جنيه",
      growth: "45-60 يوم",
      fertilizer: "سماد نيتروجيني خفيف"
    },
    {
      id: 5,
      name: "السبانخ",
      img: "/images/Spinach.jpg",
      season: "Autumn",
      seasonText: "اغسطس - نوفمبر",
      modalImg: "/images/Spinach.jpg",
      method: "تزرع البذور في أحواض بعمق 1-2 سم…",
      cost: "15,000 - 20,000 جنيه",
      growth: "90 - 120 يوم",
      fertilizer: "سماد NPK متوازن"
    },
    {
      id: 6,
      name: "البطيخ",
      img: "/images/watermelon.jpg",
      season: "Summer",
      seasonText: "يناير - مايو",
      modalImg: "/images/watermelon.jpg",
      method: "زراعة البذور في جور على أبعاد 2×2 متر مع ري غزير",
      cost: "10,000 - 15,000 جنيه",
      growth: "90-120 يوم",
      fertilizer: "سماد بوتاسي عالي"
    },
    {
      id: 7,
      name: "الذرة",
      img: "/images/corn2.jpg",
      season: "Summer",
      seasonText: "مايو - يونيو",
      modalImg: "/images/corn2.jpg",
      method: "بذر مباشر في خطوط بمسافة 25 سم بين النباتات ",
      cost: "7,000 - 10,000 جنيه",
      growth: "100-120 يوم",
      fertilizer: "سماد نيتروجيني + فوسفوري"
    },
    {
      id: 8,
      name: "الباذنجان",
      img: "/images/باذنجان.jpg",
      season: "Autumn",
      seasonText: "مارس - مايو",
      modalImg: "/images/باذنجان.jpg",
      method: "زراعة في مشتل ثم نقل الشتلات على مسافة 50 سم",
      cost: "16,000 - 22,000 جنيه",
      growth: "80-100 يوم",
      fertilizer: "سماد NPK متوازن"
    },
    {
      id: 9,
      name: "الكوسة",
      img: "/images/كوسة.jpg",
      season: "Autumn",
      seasonText: "مارس - مايو",
      modalImg: "/images/كوسة.jpg",
      method: "بذر مباشر في جور على أبعاد 1×1 متر",
      cost: "9,000 - 14,000 جنيه",
      growth: "50-65 يوم",
      fertilizer: "سماد عضوي متحلل"
    },
    {
      id: 10,
      name: "الجزر",
      img: "/images/carrot3.jpg",
      season: "Autumn",
      seasonText: "مارس - مايو",
      modalImg: "/images/carrot3.jpg",
      method: "بذر مباشر في تربة رملية خفيفة على عمق 1 سم",
      cost: "10,000 - 15,000 جنيه",
      growth: "90-120 يوم",
      fertilizer: "سماد بوتاسي + فوسفوري"
    },
    {
      id: 11,
      name: "البروكلي",
      img: "/images/broccoli.jpg",
      season: "Autumn",
      seasonText: "يولو - اكتوبر",
      modalImg: "/images/broccoli.jpg",
      method: "زراعة شتلات على مسافة 40-50 سم في تربة جيدة الصرف",
      cost: "20,000 - 28,000 جنيه",
      growth: "70-100 يوم",
      fertilizer: "سماد نيتروجيني + كالسيوم"
    },
    {
      id: 12,
      name: "القرنبيط",
      img: "/images/قرنبيط.jpg",
      season: "Winter",
      seasonText: "سبتمبر-نوفمبر",
      modalImg: "/images/tomato3.jpg",
      method: "شتلات تزرع على أبعاد 50-60 سم مع ري منتظم",
      cost: "18,000 - 25,000 جنيه",
      growth: "80-110 يوم",
      fertilizer: "سماد NPK + عناصر صغرى"
    },
    {
      id: 13,
      name: "البصل",
      img: "/images/onions.jpg",
      season: "Autumn",
      seasonText: "سبتمبر - اكتوبر",
      modalImg: "/images/onions.jpg",
      method: "زراعة الأبصال الصغيرة على مسافة 10 سم في خطوط",
      cost: "12,000 - 18,000 جنيه",
      growth: "120-150 يوم",
      fertilizer: "سماد بوتاسي + كبريت"
    },
    {
      id: 14,
      name: "الثوم",
      img: "/images/Garlic.jpg",
      season: "Winter",
      seasonText: "سبتمبر - نوفمبر",
      modalImg: "/images/Garlic.jpg",
      method: "فصوص الثوم تزرع رأسياً على عمق 5 سم",
      cost: "15,000 - 22,000 جنيه",
      growth: "150-180 يوم",
      fertilizer: "سماد عضوي + كبريت"
    },
  ]);

  const [activeFilter, setActiveFilter] = useState('all');
  const [filteredPlants, setFilteredPlants] = useState(plants);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState(null);

  const seasons = [
    { key: 'all', label: 'كل الفصول', icon: 'far fa-calendar', subText: null },
    { key: 'Spring', label: 'الربيع', icon: 'fas fa-cloud', subText: 'مارس - مايو' },
    { key: 'Summer', label: 'الصيف', icon: 'fas fa-sun', subText: 'يونيو - أغسطس' },
    { key: 'Autumn', label: 'الخريف', icon: 'fas fa-cloud-rain', subText: 'سبتمبر - نوفمبر' },
    { key: 'Winter', label: 'الشتاء', icon: 'far fa-snowflake', subText: 'ديسمبر - فبراير' }
  ];

  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredPlants(plants);
    } else {
      const filtered = plants.filter(item => item.season === activeFilter);
      setFilteredPlants(filtered);
    }
  }, [activeFilter, plants]);

  const handleFilterClick = (filterKey) => {
    setActiveFilter(filterKey);
  };

  const handleCardClick = (plant) => {
    setSelectedPlant(plant);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPlant(null);
  };

  return (
    <>
     
      
      <section className="container py-5 text-center">
        <h3 className="title-txt text-center text-success mb-4">النباتات والفصول الزراعية</h3>
        <h5 className="title-txt text-center text-success mb-5">اكتشف افضل النباتات لكل فصل مع تفاصيل الزراعة والتكلفة</h5>
        
        <div className="btnAll d-flex flex-wrap justify-content-center gap-3 mb-5">
          {seasons.map(season => (
            <button
              key={season.key}
              className={`btnSeason btn btn-light text-success px-5 py-3 text-center fs-5 ${activeFilter === season.key ? 'active' : ''}`}
              onClick={() => handleFilterClick(season.key)}
            >
              <i className={`${season.icon} ms-2`}></i>
              {season.label}
              {season.subText && <small className="d-block text-success">{season.subText}</small>}
            </button>
          ))}
        </div>

        <div className="row g-4">
          {filteredPlants.map(plant => (
            <div key={plant.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div className="card plantCard pb-4" onClick={() => handleCardClick(plant)} style={{ cursor: 'pointer' }}>
                <img src={plant.img} className="card-img-top h-50" alt={plant.name} />
                <div className="card-body text-end text-success mt-2">
                  <h5 className="card-title">{plant.name}</h5>
                  <i className="far fa-calendar ms-2"></i>
                  <small className="text-success fs-5 mb-2">{plant.seasonText}</small>
                  <button className="moreInfo btn d-block mt-3 w-50" onClick={(e) => { e.stopPropagation(); handleCardClick(plant); }}>
                    عرض التفاصيل
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedPlant && (
          <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} id="myModal" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '550px' }}>
              <div className="modal-content" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                <div className="modal-header justify-content-between align-items-center">
                  <button type="button" className="btn-close ms-auto" onClick={handleCloseModal}></button>
                  <h4 className="modal-title text-success d-flex align-items-center gap-2">
                    <i className="fab fa-pagelines"></i>
                    <span id="modalTitle">{selectedPlant.name}</span>
                  </h4>
                </div>
                <img id="modalImg" src={selectedPlant.modalImg} className="modalImg d-flex align-self-center" alt={selectedPlant.name} style={{ height: '260px', objectFit: 'cover' }} />
                <div className="modal-body text-end">
                  <div className="p-3 mb-3 rounded" style={{ background: '#e3f8e3' }}>
                    <i className="fas fa-seedling text-success"></i>
                    <strong className="text-success">طريقة الزراعة</strong>
                    <p id="modalMethod" className="m-0 text-success">{selectedPlant.method}</p>
                  </div>
                  <div className="p-3 mb-3 rounded" style={{ background: '#ccf0cc' }}>
                    <i className="fas fa-dollar-sign text-success"></i>
                    <strong className="text-success">تكلفة الزراعة</strong>
                    <p id="modalCost" className="m-0 text-success">{selectedPlant.cost}</p>
                  </div>
                  <div className="p-3 mb-3 rounded" style={{ background: '#e3f8e3' }}>
                    <i className="far fa-clock text-success"></i>
                    <strong className="text-success">مدة النمو</strong>
                    <p id="modalGrowth" className="m-0 text-success">{selectedPlant.growth}</p>
                  </div>
                  <div className="text-white text-end p-2 mb-4 pe-3" style={{ backgroundColor: '#1d6421', borderRadius: '15px' }}>
                    <h4 className="fw-light m-0 soil-value py-2">السماد الموصلى به</h4>
                    <span id="modalFertilizer" className="d-block opacity-75 pb-2">{selectedPlant.fertilizer}</span>
                  </div>
                  <div className="text-white text-end p-2 mb-4 pe-3 bg-light d-flex justify-content-between">
                    <span className="opacity-75 text-success">الموسم المناسب</span>
                    <span id="modalSeason" className="fw-light py-1 w-25 text-center" style={{ backgroundColor: '#1d6421', borderRadius: '2rem' }}>
                      {selectedPlant.seasonText}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <footer className="footer">
        <div className="container">
          <div className="row">
            <div className="col-md-6 text-md-end">
              <div className="navbar-logo d-flex align-items-between me-5">
                <i className="fas fa-leaf bg-white text-success p-3 rounded-circle border border-success me-xxl-5 ms-3"></i>
                <span className="nameLogo mt-2">نباتي</span>
              </div>
            </div>
            <div className="col-md-6">
              <h5 className="text-white">تواصل مع الدعم</h5>
              <ul className="list-unstyled text-white">
                <li><i className="fas fa-phone-alt"></i> هاتف: 01234567890</li>
                <li><i className="fas fa-envelope"></i> البريد الإلكتروني: support@planthealth.com</li>
                <li><i className="fab fa-whatsapp"></i> واتساب: 01234567890</li>
              </ul>
            </div>
            <hr className="footer-line text-center" />
          </div>
        </div>
      </footer>

      {/* لتفعيل المودال */}
      {showModal && (
        <div className="modal-backdrop fade show" onClick={handleCloseModal}></div>
      )}
    </>
  );
};

export default CropsPage;