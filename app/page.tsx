"use client";

import { FormEvent, useEffect, useState } from "react";

const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61590518783118";
const ZALO_URL = "https://zalo.me/0329309293";
const MAP_URL = "https://maps.app.goo.gl/ujtgE2iRYuLd7j8m9";
const YOUTUBE_URL = "https://www.youtube.com/@chamcham97-c6f";
const TIKTOK_URL = "https://www.tiktok.com/@chamchamedemy?_r=1&_t=ZS-98BKi5KPsQB";

const reactionItems = [
  { type: "Phản ứng hóa hợp", formula: "2H₂ + O₂ → 2H₂O", icon: "💧" },
  { type: "Phản ứng phân hủy", formula: "CaCO₃ → CaO + CO₂", icon: "☁️" },
  { type: "Phản ứng thế", formula: "Fe + 2HCl → FeCl₂ + H₂", icon: "⚙️" },
  { type: "Phản ứng trung hòa", formula: "NaOH + HCl → NaCl + H₂O", icon: "🧂" },
];

const elementExplorer = [
  { number: 1, symbol: "H", name: "Hydrogen", category: "Phi kim", application: "Nhiên liệu sạch cho pin nhiên liệu và nguyên liệu sản xuất ammonia.", fact: "Là nguyên tố nhẹ nhất và phổ biến nhất trong vũ trụ.", visual: "🚀", visualLabel: "Nhiên liệu sạch", tone: "sky" },
  { number: 6, symbol: "C", name: "Carbon", category: "Phi kim", application: "Than chì trong ruột bút chì, điện cực và vật liệu graphene.", fact: "Kim cương và than chì đều được tạo nên từ carbon.", visual: "✏️", visualLabel: "Bút chì & vật liệu", tone: "ink" },
  { number: 7, symbol: "N", name: "Nitrogen", category: "Phi kim", application: "Bảo quản thực phẩm và sản xuất phân bón cho cây trồng.", fact: "Khoảng 78% không khí quanh ta là nitrogen.", visual: "🌱", visualLabel: "Nông nghiệp", tone: "sky" },
  { number: 8, symbol: "O", name: "Oxygen", category: "Phi kim", application: "Hô hấp y tế, luyện kim và hỗ trợ quá trình đốt cháy.", fact: "Oxygen chiếm gần 21% thể tích không khí.", visual: "🩺", visualLabel: "Hô hấp & y tế", tone: "sky" },
  { number: 11, symbol: "Na", name: "Sodium", category: "Kim loại kiềm", application: "Muối ăn, sản xuất thủy tinh và công nghệ pin sodium-ion.", fact: "Sodium kim loại phản ứng mạnh nên không tồn tại tự do trong tự nhiên.", visual: "🔋", visualLabel: "Pin sodium-ion", tone: "gold" },
  { number: 12, symbol: "Mg", name: "Magnesium", category: "Kim loại kiềm thổ", application: "Hợp kim nhẹ cho xe, máy bay và pháo sáng.", fact: "Magnesium cháy tạo ánh sáng trắng rất mạnh.", visual: "✈️", visualLabel: "Hợp kim nhẹ", tone: "gold" },
  { number: 13, symbol: "Al", name: "Aluminium", category: "Kim loại", application: "Lon nước, giấy bạc, khung cửa và vật liệu hàng không.", fact: "Nhẹ, bền và có thể tái chế nhiều lần.", visual: "🥫", visualLabel: "Bao bì & hàng không", tone: "mint" },
  { number: 14, symbol: "Si", name: "Silicon", category: "Á kim", application: "Chip điện tử, tấm pin mặt trời và sản xuất thủy tinh.", fact: "Silicon là nguyên tố phổ biến thứ hai trong vỏ Trái Đất.", visual: "☀️", visualLabel: "Pin mặt trời & chip", tone: "violet" },
  { number: 17, symbol: "Cl", name: "Chlorine", category: "Halogen", application: "Khử khuẩn nước và sản xuất nhựa PVC.", fact: "Trong muối ăn, chlorine tồn tại an toàn ở dạng ion chloride.", visual: "💧", visualLabel: "Khử khuẩn nước", tone: "violet" },
  { number: 20, symbol: "Ca", name: "Calcium", category: "Kim loại kiềm thổ", application: "Vật liệu xây dựng; ion calcium quan trọng với xương và răng.", fact: "Đá vôi có thành phần chính là calcium carbonate.", visual: "🦴", visualLabel: "Xương & vật liệu", tone: "gold" },
  { number: 26, symbol: "Fe", name: "Iron", category: "Kim loại chuyển tiếp", application: "Sản xuất thép cho cầu đường, nhà ở và máy móc.", fact: "Ion iron là thành phần quan trọng trong hemoglobin.", visual: "🏗️", visualLabel: "Thép xây dựng", tone: "mint" },
  { number: 29, symbol: "Cu", name: "Copper", category: "Kim loại chuyển tiếp", application: "Dây điện, động cơ và thiết bị điện tử nhờ dẫn điện tốt.", fact: "Copper có màu đỏ cam đặc trưng.", visual: "🔌", visualLabel: "Dây điện & điện tử", tone: "mint" },
];

const trustNotices = [
  { icon: "🧭", title: "Bài test nền tảng 15 phút đang mở", text: "Nhận chẩn đoán phần đang hổng trước khi chọn lớp." },
  { icon: "📚", title: "Lớp Hóa 8–9 đang nhận đăng ký", text: "Có lộ trình lấy gốc, ôn vào 10 và chuyên Hóa." },
  { icon: "✉️", title: "Phụ huynh nhận phiếu sau mỗi buổi", text: "Theo dõi rõ nội dung học, lỗi sai và bài cần luyện." },
];

const courses = [
  {
    label: "Xây nền · chuyển cấp",
    icon: "⚗️",
    title: "Hóa 8–9 & ôn thi vào 10",
    description:
      "Dành cho học sinh cần học lại từ gốc, bám chắc chương trình hoặc ôn thi vào 10/chuyên Hóa.",
    topics: ["Hóa trị & lập công thức", "Cân bằng PTHH, mol & nồng độ", "Ôn thi vào 10 / chuyên Hóa"],
    format: "Học kèm / nhóm nhỏ",
  },
  {
    label: "Toàn diện",
    icon: "🔬",
    title: "KHTN 9: Lý – Hóa – Sinh",
    description:
      "Hệ thống kiến thức trọng tâm lớp 9 bằng bài giảng ngắn, tài liệu và bài tập đi kèm.",
    topics: ["Video xem lại", "Tài liệu trực quan", "Hỏi đáp cùng giáo viên"],
    format: "Online linh hoạt",
  },
  {
    label: "Chuyển cấp",
    icon: "🧪",
    title: "Lấy gốc & chinh phục Hóa 10",
    description:
      "Nối lại kiến thức THCS, làm quen cách học Hóa THPT và tránh hổng ngay từ đầu năm.",
    topics: ["Kiểm tra đầu vào", "Lộ trình theo năng lực", "Luyện bài theo buổi"],
    format: "Google Meet tương tác",
  },
  {
    label: "Củng cố · luyện thi",
    icon: "🚀",
    title: "Hóa 11–12 & luyện thi",
    description:
      "Học chắc kiến thức lớp 11–12, luyện bài theo chuyên đề và mục tiêu điểm số.",
    topics: ["Chuyên đề 11–12", "Bài tập phân hóa", "Ôn thi tốt nghiệp THPT"],
    format: "Online / trực tiếp Quận 9",
  },
];

const learningLevels = [
  { step: "01", label: "ƯU TIÊN", title: "Xây lại nền tảng", text: "Hóa trị, công thức, PTHH, mol và nồng độ — học đúng phần đang hổng thay vì ôn tràn lan.", note: "Phù hợp học sinh mất gốc hoặc chưa tự tin" },
  { step: "02", label: "CỐT LÕI", title: "Vững chương trình phổ thông", text: "Theo sát bài trên lớp, hiểu bản chất và luyện đủ dạng để cải thiện điểm số bền vững.", note: "Phù hợp học sinh trung bình – khá" },
  { step: "03", label: "MỞ RỘNG", title: "Nâng cao theo đúng mục tiêu", text: "Học sinh lớp 9 có thể chọn nhánh ôn thi vào 10/chuyên Hóa; lớp 11–12 học nâng cao theo chuyên đề và mục tiêu thi.", note: "Tách rõ lộ trình, không học vượt quá sức" },
];

const benefits = [
  {
    number: "01",
    title: "Biết mình đang hổng ở đâu",
    text: "Bắt đầu từ điểm xuất phát thật, không học dàn trải và không bỏ qua lỗ hổng nền tảng.",
  },
  {
    number: "02",
    title: "Hiểu trước, nhớ sau",
    text: "Sơ đồ, infographic và ví dụ gần gũi giúp công thức có ý nghĩa thay vì chỉ học thuộc.",
  },
  {
    number: "03",
    title: "Được làm và được sửa",
    text: "Mỗi buổi đều có phần luyện tập, chữa bài và chốt lại lỗi sai cần tránh.",
  },
  {
    number: "04",
    title: "Có người đồng hành",
    text: "Học sinh được hỏi khi chưa hiểu và nhận định hướng tiếp theo phù hợp với mục tiêu.",
  },
];

export default function Home() {
  const [message, setMessage] = useState("");
  const [contactReady, setContactReady] = useState(false);
  const [reactionActive, setReactionActive] = useState(false);
  const [activeElement, setActiveElement] = useState(elementExplorer[0]);
  const [discoveredElements, setDiscoveredElements] = useState<string[]>([elementExplorer[0].symbol]);
  const [noticeIndex, setNoticeIndex] = useState(0);

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNoticeIndex((current) => (current + 1) % trustNotices.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, []);

  async function copyToClipboard(text: string) {
    try {
      if (!navigator.clipboard) throw new Error("Clipboard API unavailable");
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      const copied = document.execCommand("copy");
      document.body.removeChild(textarea);
      return copied;
    }
  }

  async function handleCopy(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const grade = form.get("grade");
    const goal = form.get("goal");
    const generatedMessage = `Em muốn nhận bài test đầu vào 15 phút tại ChamChamEdemy. Lớp hiện tại: ${grade}. Mục tiêu: ${goal}. Cô Trâm giúp em kiểm tra phần đang hổng và tư vấn lộ trình phù hợp với ạ.`;
    setMessage(generatedMessage);
    setContactReady(await copyToClipboard(generatedMessage));
  }

  async function handleCopyAgain() {
    setContactReady(await copyToClipboard(message));
  }

  function discoverElement(element: (typeof elementExplorer)[number]) {
    setActiveElement(element);
    setDiscoveredElements((current) => current.includes(element.symbol) ? current : [...current, element.symbol]);
  }

  return (
    <main>
      <a className="skip-link" href="#main-content">Bỏ qua điều hướng</a>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="ChamChamEdemy — về đầu trang">
          <img className="brand-logo" src="/chamcham-logo.png" alt="Logo ChamChamEdemy" width="58" height="58" />
          <span>ChamCham<span>Edemy</span><small>Học Hóa bằng tư duy trực quan</small></span>
        </a>
        <nav className="desktop-nav" aria-label="Điều hướng chính">
          <a href="#khoa-hoc">Khóa học</a>
          <a href="#giang-vien">Giảng viên</a>
          <a href="/feedback">Feedback</a>
          <a href="/blog">Blog Hóa</a>
          <a href="#dang-ky" className="nav-cta">Nhận test đầu vào</a>
        </nav>
        <details className="mobile-menu">
          <summary aria-label="Mở menu"><span /><span /><span /></summary>
          <nav aria-label="Điều hướng mobile"><a href="#khoa-hoc">Khóa học</a><a href="#giang-vien">Giảng viên</a><a href="/feedback">Feedback</a><a href="/blog">Blog Hóa</a><a href="#dang-ky">Nhận tư vấn</a></nav>
        </details>
      </header>

      <section className="hero" id="main-content">
        <div className="hero-copy">
          <div className="eyebrow"><span>✦</span> Không cần học chuyên mới học tốt Hóa</div>
          <h1>Vững nền trước.<br /><em>Tiến xa</em> đúng sức.</h1>
          <p className="hand-note"><span>⌁</span> Mỗi ngày hiểu thêm một chút</p>
          <p className="hero-lead">
            ChamChamEdemy cùng cô Trâm giúp học sinh THCS–THPT đi từ mất gốc,
            vững chương trình phổ thông đến nâng cao theo đúng mục tiêu.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#dang-ky">
              Làm test nền tảng 15 phút <span aria-hidden="true">→</span>
            </a>
            <a className="button button-ghost" href="#khoa-hoc">Xem các khóa học</a>
          </div>
          <div className="hero-notes" aria-label="Thông tin nổi bật">
            <span>✓ Chẩn đoán trước khi xếp lớp</span>
            <span>✓ Nhóm nhỏ, có tương tác</span>
            <span>✓ Không ép học quá sức</span>
          </div>
          <button
            className={`reaction-button ${reactionActive ? "is-reacting" : ""}`}
            type="button"
            aria-pressed={reactionActive}
            onClick={() => setReactionActive((active) => !active)}
          >
            <span className="mini-flask" aria-hidden="true"><i /><i /><i /></span>
            <span><strong>Mini reaction</strong><small>{reactionActive ? "Phản ứng đang xảy ra — dung dịch đổi màu!" : "Chạm để khởi động phản ứng"}</small></span>
          </button>
        </div>

        <div className="hero-visual" aria-label="Minh họa lớp học Hóa ChamChamEdemy">
          <div className="element-cloud" aria-hidden="true">
            <span>H<small>1</small></span><span>O<small>8</small></span><span>Na<small>11</small></span><span>Fe<small>26</small></span>
          </div>
          <div className="atom atom-a"><i /><i /><i /></div>
          <div className="atom atom-b"><i /><i /></div>
          <div className="mascot-card">
            <div className="mascot-badge">HỌC CÙNG CÔ TRÂM</div>
            <img className="mascot-image" src="/co-tram-mascot.jpg" alt="Mascot gấu Cô Trâm Hóa Học của ChamChamEdemy" width="620" height="620" fetchPriority="high" />
            <div className="speech">À, hóa ra là vậy!</div>
          </div>
          <div className="floating-card float-top">
            <span>📘</span><div><strong>Học có lộ trình</strong><small>Từ gốc đến vận dụng</small></div>
          </div>
          <div className="floating-card float-bottom">
            <span>💡</span><div><strong>Giảng trực quan</strong><small>Dễ hiểu · dễ nhớ</small></div>
          </div>
        </div>
      </section>

      <div className="reaction-marquee" aria-label="Các phương trình hóa học minh họa">
        <div>
          {[...reactionItems, ...reactionItems].map((reaction, index) => (
            <span className="reaction-chip" key={`${reaction.formula}-${index}`}>
              <b aria-hidden="true">{reaction.icon}</b>
              <span><small>{reaction.type}</small><strong>{reaction.formula}</strong></span>
            </span>
          ))}
        </div>
      </div>

      <section className="element-game" id="bang-tuan-hoan" aria-labelledby="element-game-title">
        <div className="game-heading" data-reveal>
          <div>
            <p className="section-kicker">HỌC MÀ CHƠI · CHƠI MÀ NHỚ</p>
            <h2 id="element-game-title">Chạm một nguyên tố.<br /><span>Khám phá một ứng dụng thật.</span></h2>
          </div>
          <div className="trust-notice" aria-live="polite">
            <span className="notice-icon" aria-hidden="true">{trustNotices[noticeIndex].icon}</span>
            <div><small>CẬP NHẬT TỪ CHAMCHAM</small><strong>{trustNotices[noticeIndex].title}</strong><span>{trustNotices[noticeIndex].text}</span></div>
            <div className="notice-dots" aria-hidden="true">
              {trustNotices.map((notice, index) => <i className={index === noticeIndex ? "active" : ""} key={notice.title} />)}
            </div>
          </div>
        </div>

        <div className="game-shell" data-reveal>
          <div className="periodic-panel">
            <div className="periodic-toolbar">
              <div><span>MINI PERIODIC LAB</span><strong>12 nguyên tố quanh em</strong></div>
              <div className="game-progress" aria-label={`Đã khám phá ${discoveredElements.length} trên ${elementExplorer.length} nguyên tố`}>
                <small>{discoveredElements.length}/{elementExplorer.length} đã khám phá</small>
                <span><i style={{ width: `${(discoveredElements.length / elementExplorer.length) * 100}%` }} /></span>
              </div>
            </div>
            <div className="element-grid" aria-label="Các nguyên tố để khám phá">
              {elementExplorer.map((element) => (
                <button
                  type="button"
                  className={`element-tile ${element.tone} ${activeElement.symbol === element.symbol ? "is-active" : ""} ${discoveredElements.includes(element.symbol) ? "is-discovered" : ""}`}
                  key={element.symbol}
                  onClick={() => discoverElement(element)}
                  aria-pressed={activeElement.symbol === element.symbol}
                  aria-label={`Khám phá ${element.name}`}
                >
                  <small>{element.number}</small><strong>{element.symbol}</strong><span>{element.name}</span><i aria-hidden="true">✓</i>
                </button>
              ))}
            </div>
          </div>

          <aside className={`element-result ${activeElement.tone}`} aria-live="polite">
            <div className="result-top"><span>{activeElement.number}</span><small>{activeElement.category}</small></div>
            <div className="result-identity">
              <div className="result-symbol">{activeElement.symbol}</div>
              <div className="element-illustration" aria-label={`Minh họa: ${activeElement.visualLabel}`}><span aria-hidden="true">{activeElement.visual}</span><small>{activeElement.visualLabel}</small></div>
            </div>
            <h3>{activeElement.name} có mặt ở đâu?</h3>
            <p className="application-text"><span>ỨNG DỤNG THỰC TẾ</span>{activeElement.application}</p>
            <div className="fact-card"><span>💡</span><p><strong>Em có biết?</strong>{activeElement.fact}</p></div>
            <small className="game-hint">Chọn một ô khác để tiếp tục khám phá →</small>
          </aside>
        </div>
      </section>

      <section className="positioning-section" aria-labelledby="positioning-title">
        <div className="positioning-heading" data-reveal>
          <div>
            <p className="section-kicker">MỘT LỘ TRÌNH, BA ĐIỂM ĐẾN</p>
            <h2 id="positioning-title">Không chạy theo chữ “chuyên”.<br /><span>Chọn đúng mức để tiến bộ thật.</span></h2>
          </div>
          <p>Phần lớn học sinh cần chắc nền và theo kịp chương trình trước. Ôn chuyên Hóa là nhánh riêng cho học sinh lớp 9 thi vào 10, không gộp chung với Hóa 11–12.</p>
        </div>
        <div className="level-grid">
          {learningLevels.map((level) => (
            <article key={level.step} data-reveal>
              <div className="level-top"><b>{level.step}</b><span>{level.label}</span></div>
              <h3>{level.title}</h3>
              <p>{level.text}</p>
              <small>{level.note}</small>
            </article>
          ))}
        </div>
        <div className="diagnostic-strip" data-reveal>
          <div><span>🧭</span><strong>Chưa biết mình thuộc nhóm nào?</strong><small>Làm bài test ngắn để cô Trâm xác định phần hổng và mức bài phù hợp.</small></div>
          <a href="#dang-ky">Nhận bài test miễn phí →</a>
        </div>
      </section>

      <section className="courses-section" id="khoa-hoc">
        <div className="section-heading" data-reveal>
          <div>
            <p className="section-kicker">LỘ TRÌNH HỌC</p>
            <h2>Từ nền tảng đến nâng cao,<br /><span>mỗi bước đều vừa sức.</span></h2>
          </div>
          <p>Mỗi học sinh có một “điểm hổng” khác nhau. ChamChamEdemy giúp em xác định phần cần học trước, chọn đúng lớp và nhìn thấy tiến bộ qua từng buổi.</p>
        </div>

        <div className="learning-path" data-reveal aria-label="Lộ trình học bốn bước">
          <article className="stair-step stair-step-1"><b>01</b><em aria-hidden="true">🧭</em><div><span>CHẨN ĐOÁN</span><strong>Tìm đúng phần kiến thức đang hổng</strong></div></article>
          <article className="stair-step stair-step-2"><b>02</b><em aria-hidden="true">🧩</em><div><span>XÂY LỘ TRÌNH</span><strong>Học từ nền tảng đến vận dụng</strong></div></article>
          <article className="stair-step stair-step-3"><b>03</b><em aria-hidden="true">✍️</em><div><span>LUYỆN & SỬA</span><strong>Tự làm bài và sửa lỗi ngay</strong></div></article>
          <article className="stair-step stair-step-4"><b>04</b><em aria-hidden="true">🚀</em><div><span>PHÁT TRIỂN</span><strong>Chọn phổ thông, nâng cao hoặc ôn thi vào 10</strong></div></article>
        </div>

        <div className="course-grid">
          {courses.map((course, index) => (
            <article className={`course-card course-card-${index + 1}`} key={course.title} data-reveal>
              <div className="course-topline">
                <span className="course-icon" aria-hidden="true">{course.icon}</span>
                <span className="course-label">{course.label}</span>
              </div>
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <ul>
                {course.topics.map((topic) => <li key={topic}>{topic}</li>)}
              </ul>
              <div className="course-format"><span>Hình thức</span><strong>{course.format}</strong></div>
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noreferrer"
                aria-label={`Nhận tư vấn khóa ${course.title} qua Facebook`}
              >Tư vấn khóa này <span aria-hidden="true">↗</span></a>
            </article>
          ))}
        </div>
      </section>

      <section className="teacher-profile" id="giang-vien" aria-labelledby="teacher-title">
        <div className="teacher-portrait" data-reveal>
          <div className="portrait-frame">
            <img src="/co-le-thuy-tram-professional.png" alt="Cô Lê Thùy Trâm - giáo viên Hóa học ChamChamEdemy" loading="lazy" />
            <span className="portrait-formula" aria-hidden="true">H₂O</span>
          </div>
          <div className="experience-seal"><strong>4+</strong><span>năm kinh nghiệm<br />THCS & THPT</span></div>
          <div className="teacher-quote">“Hiểu bản chất trước, công thức sẽ không còn đáng sợ.”</div>
        </div>

        <div className="teacher-copy" data-reveal>
          <p className="section-kicker">GIẢNG VIÊN ĐỒNG HÀNH</p>
          <h2 id="teacher-title">Cô Lê Thùy Trâm<br /><span>Dạy Hóa bằng tư duy trực quan.</span></h2>
          <p className="teacher-lead">Giáo viên Hóa học với hơn 4 năm kinh nghiệm giảng dạy THCS–THPT; thế mạnh là giải bài theo từng bước logic, dạy học liên môn KHTN và phối hợp cùng phụ huynh trong suốt tiến trình học.</p>

          <div className="credential-grid">
            <article><span>🎓</span><div><small>ĐÀO TẠO CHUYÊN MÔN</small><strong>Sư phạm Hóa học</strong><p>Đại học Đồng Nai · Tốt nghiệp loại Khá</p></div></article>
            <article><span>🏅</span><div><small>CHỨNG CHỈ LIÊN MÔN</small><strong>Khoa học tự nhiên</strong><p>Đại học Thủ đô Hà Nội · Loại Xuất sắc</p></div></article>
            <article><span>🤖</span><div><small>PHƯƠNG PHÁP GIẢNG DẠY</small><strong>STEM & công nghệ</strong><p>Học liệu số, AI, Robotics và bài học nhập vai</p></div></article>
          </div>

          <div className="teacher-results" aria-label="Kết quả giảng dạy nổi bật theo hồ sơ chuyên môn">
            <div><strong>80%</strong><span>học sinh tiến bộ rõ rệt</span></div>
            <div><strong>73%</strong><span>học sinh khá giỏi Hóa 8–9 & KHTN</span></div>
            <div><strong>97%</strong><span>kết quả lớp Hóa 9.3</span></div>
          </div>

          <div className="career-line"><span>2022–2023 · THCS Tân Bửu</span><i>→</i><span>2023–2024 · VStarSchool</span><i>→</i><span>2024–2026 · KDI Education</span></div>
          <small className="profile-source">Thông tin và số liệu được tổng hợp từ hồ sơ chuyên môn do giảng viên cung cấp.</small>
        </div>
      </section>

      <section className="proof-section" id="phuong-phap">
        <div className="learning-lab" data-reveal>
          <div className="lab-copy">
            <p className="section-kicker light">PHÒNG THÍ NGHIỆM CỦA SỰ TIẾN BỘ</p>
            <h2>Không học để nhớ tạm.<br /><span>Học để tự làm được.</span></h2>
            <p>Mỗi buổi học là một chu trình khép kín: tìm điểm hổng, giải thích bản chất, luyện ngay tại lớp và chốt lại điều cần cải thiện.</p>
            <div className="survey-proof">
              <div><strong>28</strong><span>học sinh tham gia khảo sát</span></div>
              <div><strong>100%</strong><span>đánh giá cách giảng dễ hiểu</span></div>
              <a href="/feedback">Xem feedback thật →</a>
            </div>
          </div>
          <div className="lab-cycle" aria-label="Chu trình học tập tại ChamChamEdemy">
            <div className="lab-core"><span>Hiểu</span><strong>BẢN CHẤT</strong></div>
            {benefits.map((benefit, index) => (
              <article key={benefit.number} className={`lab-step lab-step-${index + 1}`}>
                <b>{benefit.number}</b><span>{benefit.title}</span>
              </article>
            ))}
            <div className="orbit-ring" aria-hidden="true"><i /><i /><i /></div>
          </div>
        </div>

        <div className="outcome-report-grid">
          <section className="outcome-card" aria-labelledby="outcome-title" data-reveal>
            <div className="outcome-copy">
              <p className="section-kicker">TIẾN BỘ NHÌN THẤY ĐƯỢC</p>
              <h2 id="outcome-title">Không chỉ “cảm thấy hiểu”.<br /><span>Điểm số phải kể được câu chuyện.</span></h2>
              <p>Kết quả học viên được ẩn danh. Mỗi lộ trình bắt đầu bằng bài kiểm tra ngắn để theo dõi đúng phần em cần cải thiện.</p>
              <div className="gain-badge"><strong>+3.5 điểm</strong><span>sau 2 tuần học</span></div>
            </div>
            <div className="score-chart" role="img" aria-label="Điểm kiểm tra tăng từ 4 lên 7.5 sau hai tuần">
              <div className="chart-scale" aria-hidden="true"><span>10</span><span>5</span><span>0</span></div>
              <div className="chart-bars">
                <div className="score-column before"><strong>4.0</strong><i style={{ height: "40%" }} /><span>Trước khi học</span></div>
                <div className="score-column after"><strong>7.5</strong><i style={{ height: "75%" }} /><span>Sau 2 tuần</span></div>
              </div>
            </div>
            <small className="outcome-note">Kết quả có thể khác nhau tùy điểm xuất phát và mức độ hoàn thành bài tập.</small>
          </section>

          <section className="parent-value" aria-labelledby="parent-value-title" data-reveal>
            <div className="parent-value-copy">
              <p className="section-kicker light">ĐỒNG HÀNH CÙNG PHỤ HUYNH</p>
              <h2 id="parent-value-title">Nắm rõ tiến độ của con<br />sau mỗi buổi học.</h2>
              <p>Phụ huynh nhận được báo cáo ngắn gọn về mức độ tiếp thu, phần cần cải thiện và cách đồng hành cùng con.</p>
            </div>
            <div className="report-window">
              <div className="report-header">
                <img src="/chamcham-logo.png" alt="" aria-hidden="true" />
                <strong>PHIẾU NHẬN XÉT BUỔI HỌC</strong>
              </div>
              <div className="report-content">
                <div className="report-meta"><span>📅 08/07/2026</span><span>📚 Thành phần nguyên tử</span></div>
                <h3>📝 Nhận xét</h3>
                <p>Em Khoa ngoan, lễ phép và hợp tác tốt với giáo viên trong suốt buổi học. Em tiếp thu được các kiến thức cơ bản và hoàn thành tốt các bài tập ở mức yêu cầu (cấu tạo nguyên tử, các loại hạt trong nguyên tử, kích thước, khối lượng các loại hạt trong nguyên tử). Khả năng ghi nhớ của em tương đối tốt, tuy nhiên đôi khi vẫn nhầm lẫn một số kiến thức trong bài.</p>
                <div className="report-columns">
                  <div><strong>✅ Giáo viên đã hỗ trợ</strong><span>Chốt trọng tâm · Sửa lỗi · Giao bài củng cố.</span></div>
                  <div><strong>🤝 Phụ huynh đồng hành</strong><span>Nhắc em hoàn thành bài tập về nhà.</span></div>
                </div>
              </div>
              <div className="report-sent"><span>✓</span> Phiếu được gửi sau buổi học</div>
            </div>
          </section>
        </div>

        <div className="evidence-panel" data-reveal>
          <div className="evidence-copy">
            <p className="section-kicker">MINH CHỨNG TỪ CÁCH HỌC</p>
            <h2>Học thử trước.<br />Cảm nhận thật rồi quyết định.</h2>
            <p>Trong buổi học thử, học sinh được trải nghiệm đúng cách lớp học vận hành — không phải một buổi chỉ để giới thiệu khóa.</p>
            <div className="proof-pills">
              <span>📄 Xem mẫu tài liệu</span>
              <span>🧩 Làm bài ngay trong buổi</span>
              <span>💬 Được giải đáp trực tiếp</span>
            </div>
          </div>
          <div className="lesson-flow" aria-label="Quy trình một buổi học">
            <div className="flow-item active"><b>01</b><div><strong>Xác định điểm hổng</strong><small>Câu hỏi ngắn, đúng trọng tâm</small></div></div>
            <div className="flow-line" />
            <div className="flow-item"><b>02</b><div><strong>Giải thích bản chất</strong><small>Sơ đồ + ví dụ dễ hình dung</small></div></div>
            <div className="flow-line" />
            <div className="flow-item"><b>03</b><div><strong>Luyện và sửa lỗi</strong><small>Tự làm, nhận phản hồi ngay</small></div></div>
            <div className="flow-line" />
            <div className="flow-item"><b>04</b><div><strong>Chốt bước tiếp theo</strong><small>Biết rõ cần ôn gì sau buổi học</small></div></div>
          </div>
        </div>

        <div className="material-showcase" data-reveal>
          <div className="showcase-heading">
            <div><p className="section-kicker light">TÀI LIỆU TỰ BIÊN SOẠN</p><h2>Không chỉ nói “dễ hiểu”.<br />Cho em xem cách kiến thức được trình bày.</h2></div>
            <p>Infographic, sơ đồ dòng chất và tài liệu khóa học đều được thiết kế để học sinh nhìn thấy mối liên hệ giữa các bước giải.</p>
          </div>
          <div className="material-grid">
            <a href="/lay-goc-hoa-bang-mindmap.jpg" target="_blank"><img src="/lay-goc-hoa-bang-mindmap.jpg" alt="Mindmap lấy gốc Hóa: hóa trị, oxide, acid, base, muối và dãy hoạt động kim loại" loading="lazy" /><span><strong>Lấy gốc Hóa bằng mindmap</strong><small>Xem toàn bộ ↗</small></span></a>
            <a href="/so-do-dong-chat-fe-cu.jpg" target="_blank"><img src="/so-do-dong-chat-fe-cu.jpg" alt="Sơ đồ dòng chất Fe và Cu trong bài toán hóa học" loading="lazy" /><span><strong>Sơ đồ dòng chất Fe – Cu</strong><small>Xem toàn bộ ↗</small></span></a>
            <a href="/khoa-hoc-khtn-9.jpg" target="_blank"><img src="/khoa-hoc-khtn-9.jpg" alt="Tổng quan tài liệu và bài giảng khóa học KHTN 9 ChamChamEdemy" loading="lazy" /><span><strong>Kho học liệu KHTN 9</strong><small>Xem toàn bộ ↗</small></span></a>
          </div>
        </div>

        <div className="register-panel" id="dang-ky" data-reveal>
          <div className="register-copy">
            <span className="register-tag">BÀI TEST NỀN TẢNG 15 PHÚT</span>
            <h2>Chẩn đoán trước.<br />Xếp đúng lộ trình sau.</h2>
            <p>Chọn lớp và mục tiêu hiện tại. Cô Trâm sẽ gửi bài test phù hợp, nhận xét phần đang hổng rồi mới tư vấn lớp — phổ thông hay nâng cao đều bắt đầu từ năng lực thật.</p>
          </div>
          <form onSubmit={handleCopy}>
            <label htmlFor="grade">Lớp hiện tại</label>
            <select id="grade" name="grade" defaultValue="Lớp 10">
              <option>Lớp 8</option>
              <option>Lớp 9</option>
              <option>Lớp 10</option>
              <option>Lớp 11</option>
              <option>Lớp 12</option>
            </select>
            <label htmlFor="goal">Mục tiêu chính</label>
            <select id="goal" name="goal" defaultValue="Lấy lại kiến thức nền">
              <option>Lấy lại kiến thức nền</option>
              <option>Cải thiện điểm trên lớp</option>
              <option>Học chắc chương trình phổ thông</option>
              <option>Ôn thi vào 10 / chuyên Hóa</option>
              <option>Học nâng cao theo chuyên đề</option>
              <option>Ôn thi chuyển cấp</option>
              <option>Ôn thi tốt nghiệp THPT</option>
            </select>
            <button className="button button-primary submit-button" type="submit">Nhận bài test phù hợp →</button>
            {message && (
              <div className="message-preview" role="status" aria-live="polite">
                <p>{message}</p>
                <div>
                  <span>{contactReady ? "✓ Đã sao chép. Chọn kênh bên dưới để gửi." : "Trình duyệt chưa cho phép sao chép tự động."}</span>
                  <button type="button" onClick={handleCopyAgain}>{contactReady ? "Sao chép lại" : "Sao chép lời nhắn"}</button>
                </div>
              </div>
            )}
            <div className="contact-buttons">
              <a href={FACEBOOK_URL} target="_blank" rel="noreferrer">Facebook ↗</a>
              <a href={ZALO_URL} target="_blank" rel="noreferrer">Zalo: 0329 309 293 ↗</a>
            </div>
            <small>Không lưu thông tin cá nhân trên website.</small>
          </form>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-inner">
          <a className="brand footer-brand" href="#main-content">
            <img className="brand-logo" src="/chamcham-logo.png" alt="Logo ChamChamEdemy" width="52" height="52" />
            <span>ChamCham<span>Edemy</span><small>Học Hóa bằng tư duy trực quan</small></span>
          </a>
          <nav className="footer-nav" aria-label="Liên kết cuối trang"><a href="#khoa-hoc">Khóa học</a><a href="#giang-vien">Giảng viên</a><a href="/feedback">Feedback</a><a href="/blog">Blog</a><a href="#dang-ky">Đăng ký</a></nav>
          <div className="footer-social" aria-label="Kết nối với ChamChamEdemy">
            <a href={MAP_URL} target="_blank" rel="noreferrer" aria-label="Địa chỉ ChamChamEdemy trên Google Maps"><span>⌖</span>Địa chỉ</a>
            <a href={YOUTUBE_URL} target="_blank" rel="noreferrer" aria-label="YouTube ChamChamEdemy"><span>▶</span>YouTube</a>
            <a href={FACEBOOK_URL} target="_blank" rel="noreferrer" aria-label="Facebook ChamChamEdemy"><span>f</span>Facebook</a>
            <a href={TIKTOK_URL} target="_blank" rel="noreferrer" aria-label="TikTok ChamChamEdemy"><span>♪</span>TikTok</a>
          </div>
        </div>
      </footer>
      <div className="mobile-cta-bar" aria-label="Liên hệ nhanh"><a href={FACEBOOK_URL} target="_blank" rel="noreferrer">Facebook</a><a href={ZALO_URL} target="_blank" rel="noreferrer">Zalo tư vấn</a></div>
    </main>
  );
}
