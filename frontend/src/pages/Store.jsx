import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const ShoppingPage = () => {
  const productsData = [
    {
      id: 1,
      name: "سماد عضوي طبيعي",
      img: "images/Organic.jpg",
      type: "fert",
      price: 150,
      description: "سماد عضوي غني بالمواد الغذائية مناسب لجميع النباتات.",
      details: "يحسّن بنية التربة – يزيد الاحتفاظ بالماء – آمن تماماً للنباتات المنزلية والمحاصيل."
    },
    {
      id: 2,
      name: "مبيد حشري قوي",
      img: "images/مبيد حشاائش.jpg",
      type: "pest",
      price: 90,
      description: "مبيد فعال للقضاء على الحشرات الضارة.",
      details: "يعمل ضد الذبابة البيضاء – المن – الحشرات القشرية دون الإضرار بالأوراق."
    },
    {
      id: 3,
      name: "أداة حرث زراعية",
      img: "images/الجرار.jpg",
      type: "tools",
      price: 350,
      description: "أداة قوية للحرث وتجهيز الأرض.",
      details: "مصنوعة من الحديد المقوى – مناسبة للأراضي الصلبة – سهلة الاستخدام."
    },
    {
      id: 4,
      name: "مبيد حشائش فعال",
      img: "images/Fungicide.jpg",
      type: "pest",
      price: 95,
      description: "مبيد متخصص لإزالة الحشائش من التربة.",
      details: "يقضي على الحشائش الجذرية – يستمر تأثيره لمدة 45 يوم."
    },
    {
      id: 5,
      name: "بذور طماطم عالية الجودة",
      img: "images/tomato3.jpg",
      type: "seeds",
      price: 45,
      description: "بذور طماطم مميزة تعطي إنتاجًا وفيرًا.",
      details: "إنبات سريع – إنتاج قوي – مقاومة للأمراض الشائعة."
    },
    {
      id: 6,
      name: "أداة زراعة متعددة الاستخدام",
      img: "images/فاس.jpg",
      type: "tools",
      price: 120,
      description: "أداة زراعية عالية الجودة.",
      details: "تستخدم للحفر – خلط التربة – تنظيف سطح الأرض."
    },
    {
      id: 7,
      name: "شتلات رمان",
      img: "images/Pomegranate.jpg",
      type: "seeds",
      price: 70,
      description: "شتلات رمان مناسبة للحدائق والمزارع.",
      details: "عمر 6 أشهر – مقاومة للجفاف نسبياً – إنتاج بعد 2–3 سنوات."
    },
    {
      id: 8,
      name: "بذور قمح ممتازة",
      img: "images/قمح.jpg",
      type: "seeds",
      price: 80,
      description: "بذور قمح نقية عالية الإنتاج.",
      details: "معدل إنبات عالي – مقاومة للأمراض – إنتاج وفير."
    },
    {
      id: 9,
      name: "مجرفة يد صغيرة",
      img: "images/اداة للزراعة.jpeg",
      type: "tools",
      price: 65,
      description: "مجرفة خفيفة لخلط التربة.",
      details: "مناسبة للأحواض – قوية – مقبض مريح."
    },
    {
      id: 10,
      name: "رشاش ري زراعي",
      img: "images/sprinkler.jpg",
      type: "water",
      price: 600,
      description: "رشاش يوزع المياه بالتساوي.",
      details: "مناسب للمزارع – تغطية كبيرة – يتحمل الضغط العالي."
    },
    {
      id: 11,
      name: "مبيد نيماتودا قوي",
      img: "images/مبيد نيماتودا.jpg",
      type: "pest",
      price: 120,
      description: "مبيد متخصص للقضاء على النيماتودا.",
      details: "يحمي الجذور – يحسن النمو – مناسب للخضروات والأشجار."
    },
    {
      id: 12,
      name: "سماد فوسفات عالي الجودة",
      img: "images/Phosphate (2).jpg",
      type: "fert",
      price: 160,
      description: "يقوي الجذور ويزيد الإزهار.",
      details: "يساعد على امتصاص العناصر – مناسب لجميع المحاصيل."
    }
  ];

  const [filter, setFilter] = useState('all');
  const [cartItems, setCartItems] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(productsData);

  const filters = [
    { key: 'all', icon: 'far fa-calendar', text: 'الكل' },
    { key: 'fert', icon: 'fas fa-seedling', text: 'أسمدة' },
    { key: 'pest', icon: 'fas fa-bug', text: 'مبيدات' },
    { key: 'tools', icon: 'fas fa-tools', text: 'أدوات' },
    { key: 'seeds', icon: 'fas fa-seedling', text: 'بذور' },
    { key: 'water', icon: 'fas fa-tint', text: 'أنظمة ري' }
  ];

  const paymentMethods = [
    { id: 'vodafone', namee: 'Vodafone Cash', image: '/images/vodafone.png', color: 'text-danger' },
    { id: 'We', namee: 'WePay', image: '/images/we.png', color: 'text-danger' },
    { id: 'bank', namee: 'Visa', image: '/images/visaa.PNG', color: 'text-primary' },
    { id: 'instapay', namee: 'InstaPay', image: '/images/instapay.PNG', color: 'text-purple' },
    { id: 'visa', namee: 'FawryPay', image: '/images/fawry.PNG', color: 'text-info' },
    { id: 'etisalat', namee: 'etisalat cash', image: '/images/etisalat.png', color: 'text-danger' },
  ];

  const handleFilterChange = (filterKey) => {
    setFilter(filterKey);
    if (filterKey === 'all') {
      setFilteredProducts(productsData);
    } else {
      setFilteredProducts(productsData.filter(p => p.type === filterKey));
    }
  };

  const addToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(cartItems.map(item =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handlePayment = () => {
    if (!selectedPaymentMethod) {
      alert('الرجاء اختيار طريقة الدفع أولاً');
      return;
    }

    alert(`تم الدفع بنجاح بقيمة ${calculateTotal()} جنيه عبر ${paymentMethods.find(m => m.id === selectedPaymentMethod)?.namee}`);
    clearCart();
    setShowPaymentModal(false);
    setSelectedPaymentMethod('');
  };

  const ProductCard = ({ product }) => (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3">
      <div className="card shopCard pb-4 h-100">
        <img 
          src={product.img} 
          className="card-img-top h-50 object-fit-cover" 
          alt={product.name}
          style={{ objectFit: 'cover', height: '200px' }}
        />
        
        <div className="card-body text-end text-success mt-2 d-flex flex-column">
          <h5 className="card-title">{product.name}</h5>
          <small className="text-success fs-5 d-block mb-2">{product.price} جنيه</small>
          <p className="card-text text-muted small flex-grow-1">{product.description}</p>
          
          <div className="mt-auto">
            <button 
              className="btn btn-success w-100 mt-2"
              onClick={() => addToCart(product)}
            >
              <i className="fas fa-cart-plus me-2"></i>
              أضف إلى السلة
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const ShoppingCart = () => {
    if (cartItems.length === 0) {
      return (
        <div className="card shadow-lg border-0">
          <div className="card-header bg-success text-white">
            <h5 className="mb-0">
              <i className="fas fa-shopping-cart me-2"></i>
              سلة التسوق
            </h5>
          </div>
          <div className="card-body text-center py-5">
            <i className="fas fa-shopping-basket fa-3x text-muted mb-3"></i>
            <p className="text-muted">السلة فارغة</p>
          </div>
        </div>
      );
    }

    return (
      <div className="card shadow-lg border-0 sticky-top" style={{ top: '20px' }}>
        <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <i className="fas fa-shopping-cart me-2"></i>
            سلة التسوق
          </h5>
          <span className="badge bg-light text-success">{cartItems.length}</span>
        </div>
        
        <div className="card-body">
          {cartItems.map(item => (
            <div key={item.id} className="border-bottom pb-3 mb-3">
              <div className="d-flex justify-content-between align-items-start">
                <div className="flex-grow-1">
                  <h6 className="mb-1">{item.name}</h6>
                  <small className="text-muted">{item.price} جنيه</small>
                </div>
                <button 
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => removeFromCart(item.id)}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
              
              <div className="d-flex align-items-center justify-content-between mt-2">
                <div className="d-flex align-items-center">
                  <button 
                    className="btn btn-sm btn-outline-success"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <i className="fas fa-minus"></i>
                  </button>
                  
                  <span className="mx-2">{item.quantity}</span>
                  
                  <button 
                    className="btn btn-sm btn-outline-success"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
                
                <span className="text-success fw-bold">
                  {item.price * item.quantity} ج.م
                </span>
              </div>
            </div>
          ))}
          
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="mb-0">الإجمالي:</h6>
            <h5 className="mb-0 text-success">{calculateTotal()} جنيه</h5>
          </div>
          
          <div className="d-grid gap-2">
            <button 
              className="btn btn-success"
              onClick={() => setShowPaymentModal(true)}
            >
              <i className="fas fa-credit-card me-2"></i>
              الدفع الآن
            </button>
            
            <button 
              className="btn btn-outline-danger"
              onClick={clearCart}
            >
              <i className="fas fa-trash me-2"></i>
              إفراغ السلة
            </button>
          </div>
        </div>
      </div>
    );
  };

  const PaymentModal = () => {
    if (!showPaymentModal) return null;

    return (
      <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '500px' }}>
          <div className="modal-content" style={{ borderRadius: '20px', overflow: 'hidden' }}>
            <div className="modal-header">
              <h4 className="modal-title text-success w-100 text-center">إتمام عملية الشراء</h4>
              <button 
                type="button" 
                className="btn-close ms-auto" 
                onClick={() => {
                  setShowPaymentModal(false);
                  setSelectedPaymentMethod('');
                }}
              ></button>
            </div>
            
            <div className="modal-body text-end">
              <div className="p-3 mb-3 rounded" style={{ background: '#e3f8e3' }}>
                <h6 className="text-success mb-3">تفاصيل المشتريات</h6>
                {cartItems.map(item => (
                  <div key={item.id} className="d-flex justify-content-between mb-2">
                    <span>{item.name} × {item.quantity}</span>
                    <span>{item.price * item.quantity} ج.م</span>
                  </div>
                ))}
                <hr />
                <div className="d-flex justify-content-between fw-bold">
                  <span>الإجمالي</span>
                  <span>{calculateTotal()} جنيه</span>
                </div>
              </div>
              
              <h6 className="text-success mb-3">اختر وسيلة الدفع</h6>
              <div className="row g-2 mb-4">
                {paymentMethods.map(method => (
                  <div key={method.id} className="col-6">
                    <div 
                      className={`p-3 rounded border text-center cursor-pointer ${
                        selectedPaymentMethod === method.id ? 'border-success border-2' : 'border-1'
                      }`}
                      onClick={() => setSelectedPaymentMethod(method.id)}
                      style={{ cursor: 'pointer' }}
                    >




                     {method.image ? (
                        <img 
                          src={method.image} 
                          alt={method.name}
                          className="mb-3"
                          style={{ height: '50px', objectFit: 'contain' }}
                        />
                      ) : (
                        <i className={`${method.icon} ${method.color} fa-3x mb-3 d-block`}></i>
                      )}




                      <span className="text-success">{method.name}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="d-grid gap-2">
                <button 
                  className="btn btn-success py-2 fs-5"
                  onClick={handlePayment}
                >
                  <i className="fas fa-lock me-2"></i>
                  تأكيد الدفع
                </button>
                <button 
                  className="btn btn-outline-secondary py-2"
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedPaymentMethod('');
                  }}
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="shopping-page">
      <style jsx>{`
        .shopping-page {
          direction: rtl;
        }
        .shopCard {
          border: 1px solid #ddd;
          border-radius: 15px;
          overflow: hidden;
          transition: transform 0.3s, box-shadow 0.3s;
          height: 100%;
        }
        .shopCard:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        .shopFilterBtn.active {
          background-color: #198754 !important;
          color: white !important;
          border-color: #198754 !important;
        }
        .shopFilterBtn {
          border: 2px solid #198754;
          border-radius: 10px;
          transition: all 0.3s;
        }
        .shopFilterBtn:hover:not(.active) {
          background-color: #e8f5e9;
        }
        .sticky-top {
          position: -webkit-sticky;
          position: sticky;
          top: 20px;
        }
        .object-fit-cover {
          object-fit: cover;
        }
        .text-purple {
          color: #6f42c1 !important;
        }
        .cursor-pointer {
          cursor: pointer;
        }
        .title-txt {
          font-family: 'Arial', sans-serif;
          font-weight: bold;
        }
        .badge {
          font-size: 0.7rem;
          padding: 0.35em 0.65em;
        }
      `}</style>

      <div className="container py-5 text-center">
        <h3 className="title-txt text-center text-success mb-4">المتجر الزراعي</h3>
        <h5 className="title-txt text-center text-success mb-5">
          تسوق أفضل الأسمدة والمبيدات والبذور والأدوات الزراعية
        </h5>
        
        <div className="shopFilterGroup d-flex flex-wrap justify-content-center gap-3 mb-5">
          {filters.map(filterItem => (
            <button
              key={filterItem.key}
              className={`shopFilterBtn btn btn-light text-success px-4 py-3 text-center fs-5 ${
                filter === filterItem.key ? 'active' : ''
              }`}
              onClick={() => handleFilterChange(filterItem.key)}
            >
              <i className={`${filterItem.icon} ms-2`}></i>
              {filterItem.text}
            </button>
          ))}
        </div>
        
        <div className="row">
          <div className="col-lg-9">
            <div className="row g-4">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
          
          <div className="col-lg-3">
            <ShoppingCart />
          </div>
        </div>
      </div>

      <PaymentModal />
    </div>
  );
};

export default ShoppingPage;