import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3> نباتي </h3>
            <p>منصة متكاملة لمساعدة المزارعين في تحسين إنتاجية محاصيلهم</p>
          </div>
          
          <div className="footer-section">
            <h4>روابط سريعة</h4>
            <ul>
              <li><a href="/diagnosis">تشخيص الأمراض</a></li>
              <li><a href="/soil-analysis">تحليل التربة</a></li>
              <li><a href="/plants-seasons">النباتات والفصول</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>اتصل بنا</h4>
            <p>البريد الإلكتروني: hamza2004mohamed@gmail.com</p>
            <p>الهاتف: 01025058377</p>
          </div>
        </div>
        
        
      </div>
    </footer>
  );
};

export default Footer;