import { useState, useEffect } from 'react';
import { ShoppingCart, History, LayoutDashboard, Trash2 } from 'lucide-react';

interface Sale {
  id: string;
  customerName: string;
  quantity: number;
  totalPrice: number;
  timestamp: string;
}

function App() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const PRICE_PER_BOTTLE = 15;

  // Load data from LocalStorage on mount
  useEffect(() => {
    const savedSales = localStorage.getItem('drinkingWaterSales');
    if (savedSales) {
      setSales(JSON.parse(savedSales));
    }
  }, []);

  // Save data to LocalStorage when sales change
  useEffect(() => {
    localStorage.setItem('drinkingWaterSales', JSON.stringify(sales));
  }, [sales]);

  const handleAddSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || quantity <= 0) return;

    const newSale: Sale = {
      id: Date.now().toString(),
      customerName,
      quantity,
      totalPrice: quantity * PRICE_PER_BOTTLE,
      timestamp: new Date().toLocaleString('th-TH'),
    };

    setSales([newSale, ...sales]);
    setCustomerName('');
    setQuantity(1);
  };

  const deleteSale = (id: string) => {
    if (window.confirm('คุณต้องการลบรายการนี้ใช่หรือไม่?')) {
      setSales(sales.filter(sale => sale.id !== id));
    }
  };

  const totalQuantity = sales.reduce((sum, sale) => sum + sale.quantity, 0);
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalPrice, 0);

  return (
    <div className="container">
      <header style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <ShoppingCart size={32} color="#3498db" /> บันทึกขายน้ำ
        </h1>
      </header>

      {/* สรุปยอดขาย */}
      <section className="card">
        <h2 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <LayoutDashboard size={20} /> สรุปวันนี้
        </h2>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-value">{totalQuantity}</div>
            <div className="stat-label">จำนวนถังรวม</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{totalRevenue.toLocaleString()}</div>
            <div className="stat-label">ยอดเงินรวม (บาท)</div>
          </div>
        </div>
      </section>

      {/* ฟอร์มบันทึกการขาย */}
      <section className="card">
        <h2 style={{ fontSize: '1.2rem' }}>บันทึกรายการใหม่</h2>
        <form onSubmit={handleAddSale}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ fontSize: '0.9rem', color: '#666' }}>ชื่อลูกค้า</label>
            <input
              type="text"
              placeholder="เช่น บ้านคุณสมชาย"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ fontSize: '0.9rem', color: '#666' }}>จำนวนถัง (ถังละ 15.-)</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              required
            />
          </div>
          <div style={{ padding: '10px', background: '#f9f9f9', borderRadius: '8px', marginBottom: '10px', textAlign: 'center' }}>
            ยอดเงินที่ต้องเก็บ: <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#27ae60' }}>{(quantity * PRICE_PER_BOTTLE).toLocaleString()}</span> บาท
          </div>
          <button type="submit" style={{ backgroundColor: '#3498db', fontSize: '1.1rem', padding: '15px' }}>
            บันทึกการขาย
          </button>
        </form>
      </section>

      {/* ประวัติการขาย */}
      <section className="card">
        <h2 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <History size={20} /> ประวัติการขาย
        </h2>
        {sales.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#999' }}>ยังไม่มีรายการขายในวันนี้</p>
        ) : (
          <ul className="sale-list">
            {sales.map((sale) => (
              <li key={sale.id} className="sale-item">
                <div className="sale-info">
                  <h4>{sale.customerName}</h4>
                  <p>{sale.quantity} ถัง • {sale.timestamp}</p>
                </div>
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <div className="sale-price">{sale.totalPrice.toLocaleString()} ฿</div>
                  <button onClick={() => deleteSale(sale.id)} className="btn-delete">
                    <Trash2 size={14} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default App;
