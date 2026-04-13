import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSeedling, FaLeaf, FaTint, FaBug, FaUserTie, FaShoppingCart } from 'react-icons/fa';
import styles from '../style/Welcome.module.css';

function Welcome() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  const features = [
    {
      icon: <FaLeaf />,
      title: 'تشخيص الأمراض النباتية',
      description: 'قم برفع صورة للنبات المصاب واحصل على تشخيص فوري وعلاج مناسب باستخدام الذكاء الاصطناعي'
    },
    {
      icon: <FaTint />,
      title: 'تحليل التربة',
      description: 'تعرف على نوع تربتك والمحاصيل المناسبة لها والأسمدة التي تحتاجها'
    },
    {
      icon: <FaSeedling />,
      title: 'النباتات والفصول',
      description: 'اكتشف أفضل النباتات لكل فصل زراعي مع تفاصيل الزراعة والتكاليف'
    },
    {
      icon: <FaShoppingCart />,
      title: 'المتجر الزراعي',
      description: 'تسوق أفضل الأسمدة والمبيدات والبذور والأدوات الزراعية بأسعار منافسة'
    },
    {
      icon: <FaUserTie />,
      title: 'استشارات الخبراء',
      description: 'احصل على استشارات مباشرة من خبراء زراعيين ذوي خبرة'
    },
    {
      icon: <FaBug />,
      title: 'مكافحة الآفات',
      description: 'تعرف على كيفية التعامل مع الآفات الزراعية بطرق فعالة وآمنة'
    }
  ];

  const statistics = [
    { number: '10,000+', label: 'مزارع مسجل' },
    { number: '500+', label: 'خبير زراعي' },
    { number: '50,000+', label: 'تشخيص ناجح' },
    { number: '95%', label: 'رضا العملاء' }
  ];

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.row}>
          <div className={styles.col6}>
            <h1 className={styles.title}>
              مرحباً بك في <span className={styles.highlight}>نباتي</span>
            </h1>
            <h2 className={styles.subtitle}>
              المنصة الزراعية الشاملة لجميع احتياجات المزارعين
            </h2>
            <p className={styles.description}>
              نقدم لك حلولاً زراعية متكاملة باستخدام أحدث تقنيات الذكاء الاصطناعي، 
              نساعدك في تشخيص الأمراض، تحليل التربة، اختيار المحاصيل المناسبة، 
              والتسوق للمستلزمات الزراعية بكل سهولة.
            </p>
            <button className={styles.btn} onClick={handleGetStarted}>
              ابدأ رحلتك الآن
            </button>
          </div>
          <div className={styles.col6}>
            <div className={styles.imageContainer}>
              <img 
                src="/images/Capture.png" 
                alt="نباتات زراعية" 
                className={styles.heroImage}
              />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.stats}>
        <div className={styles.row}>
          {statistics.map((stat, index) => (
            <div key={index} className={styles.col3}>
              <div className={styles.statCard}>
                <h3 className={styles.statNum}>{stat.number}</h3>
                <p>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.features}>
        <h2 className={styles.sectionTitle}>ماذا نقدم لك؟</h2>
        
        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.featureItem}>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  {feature.icon}
                </div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.steps}>
        <h2 className={styles.sectionTitle}>كيف يعمل الموقع؟</h2>
        <div className={styles.row}>
          <div className={styles.col4}>
            <div className={styles.stepCard}>
              <div className={styles.stepNum}>1</div>
              <h3>سجل حساب جديد</h3>
              <p>أنشئ حسابك في دقائق وابدأ رحلتك الزراعية</p>
            </div>
          </div>
          <div className={styles.col4}>
            <div className={styles.stepCard}>
              <div className={styles.stepNum}>2</div>
              <h3>استخدم الخدمات</h3>
              <p>اختر الخدمة التي تحتاجها من القائمة الرئيسية</p>
            </div>
          </div>
          <div className={styles.col4}>
            <div className={styles.stepCard}>
              <div className={styles.stepNum}>3</div>
              <h3>احصل على النتائج</h3>
              <p>تلقَ النتائج والتوصيات الفورية من خبرائنا</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className={styles.ctaCard}>
          <h2 className={styles.ctaTitle}>جاهز لبدء رحلتك الزراعية؟</h2>
          <p className={styles.ctaDesc}>
            انضم إلى آلاف المزارعين الذين يثقون بنا في تطوير وتحسين إنتاجهم الزراعي
          </p>
          <button className={styles.btn} onClick={handleGetStarted}>
            سجل الدخول الآن
          </button>
        </div>
      </section>
    </div>
  );
}

export default Welcome;