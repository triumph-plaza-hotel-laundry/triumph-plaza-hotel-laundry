import "./App.css";
import logo from "./assets/logo.png";

function App() {
  return (
    <div className="app">

      {/* Sidebar */}
      <aside className="sidebar">

        <div className="logo-box">
          <img src={logo} alt="Triumph Logo" className="logo" />

          <h2>TRIUMPH PLAZA</h2>
          <p>Laundry Service</p>
        </div>

        <nav>

          <button className="menu-btn">🏠 الرئيسية</button>

          <button className="menu-btn">🤖 المساعد الذكي</button>

          <button className="menu-btn">🧺 البرامج</button>

          <button className="menu-btn">💰 أسعار الجست</button>

          <button className="menu-btn">💰 أسعار الأوت سايد</button>

          <button className="menu-btn">📅 جدول الشيفتات</button>

        </nav>

      </aside>

      {/* Main */}
      <main className="content">

        <header className="topbar">

          <h1>TRIUMPH PLAZA </h1>

          <div className="actions">

            <button>🌍</button>

            <button>🌙</button>

          </div>

        </header>

        <section className="hero">

          <h2>مرحباً بك</h2>

          <p>
            نظام إدارة مغسلة فندق Triumph Plaza
          </p>

        </section>

      </main>

    </div>
  );
}

export default App;