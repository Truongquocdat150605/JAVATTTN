import React, { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  User,
  CheckCircle2,
  ShieldCheck,
  Home,
} from "lucide-react";
import AuthService from "../../services/AuthService";
import { toast } from 'react-toastify';
/* ─────────────────────── Inline styles ─────────────────────── */
const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 16px",
    background:
      "linear-gradient(135deg, #0d0221 0%, #0a0f2c 30%, #060d1f 60%, #0d0221 100%)",
    position: "relative",
    overflow: "hidden",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  blob1: {
    position: "absolute",
    top: "-180px",
    left: "-180px",
    width: "560px",
    height: "560px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)",
    filter: "blur(40px)",
    pointerEvents: "none",
    animation: "blobFloat 8s ease-in-out infinite",
  },
  blob2: {
    position: "absolute",
    bottom: "-160px",
    right: "-160px",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)",
    filter: "blur(50px)",
    pointerEvents: "none",
    animation: "blobFloat 10s ease-in-out infinite reverse",
  },
  blob3: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "800px",
    height: "800px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 60%)",
    pointerEvents: "none",
  },
  gridOverlay: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
    backgroundSize: "48px 48px",
    pointerEvents: "none",
  },
  container: {
    position: "relative",
    zIndex: 10,
    width: "100%",
    maxWidth: "460px",
  },
  /* Logo / header */
  logoWrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    marginBottom: "32px",
  },
  logoBox: {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 0 24px rgba(99,102,241,0.5)",
  },
  logoText: {
    fontSize: "20px",
    fontWeight: 900,
    color: "#fff",
    letterSpacing: "-0.5px",
  },
  brandName: {
    fontSize: "22px",
    fontWeight: 800,
    color: "#fff",
    letterSpacing: "-0.5px",
  },
  brandSub: {
    fontSize: "12px",
    color: "rgba(148,163,184,0.8)",
    marginTop: "-2px",
  },
  /* Card */
  card: {
    borderRadius: "24px",
    border: "1px solid rgba(255,255,255,0.08)",
    background:
      "linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    padding: "36px 32px",
    boxShadow:
      "0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05) inset",
  },
  cardHeader: {
    marginBottom: "28px",
    textAlign: "center",
  },
  cardTitle: {
    fontSize: "26px",
    fontWeight: 800,
    color: "#fff",
    margin: 0,
    letterSpacing: "-0.5px",
    lineHeight: 1.2,
  },
  cardSubtitle: {
    fontSize: "14px",
    color: "rgba(148,163,184,0.85)",
    marginTop: "8px",
  },
  /* Form */
  form: { display: "flex", flexDirection: "column", gap: "18px" },
  fieldGroup: { display: "flex", flexDirection: "column", gap: "6px" },
  label: {
    fontSize: "13px",
    fontWeight: 600,
    color: "rgba(203,213,225,0.9)",
    letterSpacing: "0.3px",
  },
  inputWrap: { position: "relative" },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 44px",
    borderRadius: "12px",
    border: "1.5px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.04)",
    color: "#f1f5f9",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s, background 0.2s",
    letterSpacing: "0.2px",
  },
  inputFocus: {
    borderColor: "rgba(99,102,241,0.7)",
    boxShadow: "0 0 0 3px rgba(99,102,241,0.15)",
    background: "rgba(99,102,241,0.05)",
  },
  iconLeft: {
    position: "absolute",
    left: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "rgba(148,163,184,0.6)",
    pointerEvents: "none",
    display: "flex",
  },
  iconRight: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "rgba(148,163,184,0.6)",
    display: "flex",
    padding: "4px",
    borderRadius: "8px",
    transition: "color 0.2s, background 0.2s",
  },
  /* Password strength */
  strengthBar: {
    display: "flex",
    gap: "4px",
    marginTop: "6px",
  },
  strengthSegment: (active, color) => ({
    flex: 1,
    height: "3px",
    borderRadius: "2px",
    background: active ? color : "rgba(255,255,255,0.08)",
    transition: "background 0.3s",
  }),
  strengthLabel: (color) => ({
    fontSize: "11px",
    color,
    marginTop: "3px",
    fontWeight: 600,
  }),
  /* Checkbox */
  checkRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    cursor: "pointer",
  },
  checkbox: {
    width: "16px",
    height: "16px",
    marginTop: "2px",
    flexShrink: 0,
    accentColor: "#6366f1",
    cursor: "pointer",
  },
  checkLabel: { fontSize: "13px", color: "rgba(148,163,184,0.85)", lineHeight: 1.5 },
  highlight: { color: "#a78bfa", fontWeight: 600 },
  /* Error */
  errorBox: {
    borderRadius: "12px",
    border: "1px solid rgba(248,113,113,0.3)",
    background: "rgba(239,68,68,0.08)",
    padding: "12px 16px",
    fontSize: "13px",
    color: "#fca5a5",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  matchErr: { fontSize: "12px", color: "#f87171", marginTop: "4px" },
  /* Submit button */
  submitBtn: {
    width: "100%",
    padding: "13px",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #6366f1 100%)",
    backgroundSize: "200% 200%",
    color: "#fff",
    fontSize: "15px",
    fontWeight: 700,
    letterSpacing: "0.3px",
    transition: "opacity 0.2s, transform 0.15s, box-shadow 0.2s",
    boxShadow: "0 4px 20px rgba(99,102,241,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  submitDisabled: {
    opacity: 0.45,
    cursor: "not-allowed",
    boxShadow: "none",
  },
  /* Divider */
  divider: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    margin: "4px 0",
  },
  dividerLine: { flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" },
  dividerText: { fontSize: "12px", color: "rgba(148,163,184,0.5)", whiteSpace: "nowrap" },
  /* Social buttons */
  socialGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" },
  socialBtn: {
    padding: "11px 12px",
    borderRadius: "12px",
    border: "1.5px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.03)",
    color: "rgba(203,213,225,0.85)",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "background 0.2s, border-color 0.2s",
  },
  socialIcon: {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: 800,
  },
  /* Footer link */
  footerText: {
    textAlign: "center",
    fontSize: "13.5px",
    color: "rgba(148,163,184,0.7)",
    marginTop: "24px",
  },
  footerLink: {
    color: "#818cf8",
    fontWeight: 700,
    textDecoration: "none",
    marginLeft: "4px",
  },
  /* Features row */
  featuresRow: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginBottom: "28px",
    flexWrap: "wrap",
  },
  featureChip: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "12px",
    color: "rgba(148,163,184,0.7)",
  },
};

/* ─────────────────────── Password strength ─────────────────── */
function getStrength(pw) {
  if (!pw) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { score, label: "Rất yếu", color: "#f87171" };
  if (score === 2) return { score, label: "Yếu", color: "#fb923c" };
  if (score === 3) return { score, label: "Trung bình", color: "#facc15" };
  if (score === 4) return { score, label: "Mạnh", color: "#4ade80" };
  return { score: 5, label: "Rất mạnh", color: "#34d399" };
}

/* ─────────────────────── Focus-aware input ─────────────────── */
function FocusInput({ style, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      {...props}
      style={{
        ...styles.input,
        ...(focused ? styles.inputFocus : {}),
        ...style,
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}

/* ─────────────────────── Main component ────────────────────── */
const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptedTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const strength = useMemo(() => getStrength(form.password), [form.password]);

  const canSubmit = useMemo(() => {
    if (!form.username.trim()) return false;
    if (!form.fullName.trim()) return false;
    if (!form.email.trim()) return false;
    if (form.password.length < 6) return false;
    if (form.password !== form.confirmPassword) return false;
    if (!form.acceptedTerms) return false;
    return true;
  }, [form]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

// Xóa hàm handleSubmit cũ, giữ lại hàm này:

const onSubmitRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (!canSubmit) {
        setErrorMsg("Vui lòng kiểm tra lại thông tin và chấp nhận điều khoản.");
        return;
    }
    try {
        setLoading(true);
        await AuthService.register({
            username: form.username,
            fullName: form.fullName,
            email: form.email,
            password: form.password,
            role: "TENANT" // Mặc định tạo tenant
        });
        toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
        navigate("/login");
    } catch (err) {
        const message = err.response?.data?.message || "Đăng ký thất bại. Email hoặc username đã được sử dụng.";
        setErrorMsg(message);
        toast.error(message);
    } finally {
        setLoading(false);
    }
};

  return (
    <>
      {/* Keyframe animations injected once */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @keyframes blobFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-24px) scale(1.04); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .reg-card { animation: fadeSlideUp 0.55s cubic-bezier(0.22,1,0.36,1) both; }
        .social-btn:hover { background: rgba(255,255,255,0.07) !important; border-color: rgba(255,255,255,0.14) !important; }
        .eye-btn:hover { color: #a5b4fc !important; background: rgba(99,102,241,0.12) !important; }
        .submit-btn:not(:disabled):hover { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 8px 28px rgba(99,102,241,0.5) !important; }
        .submit-btn:not(:disabled):active { transform: translateY(0); }
        input::placeholder { color: rgba(100,116,139,0.6); }
      `}</style>

      <div style={styles.page}>
        {/* Background decorations */}
        <div style={styles.blob1} />
        <div style={styles.blob2} />
        <div style={styles.blob3} />
        <div style={styles.gridOverlay} />

        <div style={styles.container} className="reg-card">
          {/* Logo */}
          <div style={styles.logoWrap}>
            <div style={styles.logoBox}>
              <Home size={22} color="#fff" />
            </div>
            <div>
              <div style={styles.brandName}>SmartPhòng</div>
              <div style={styles.brandSub}>Quản lý phòng trọ thông minh</div>
            </div>
          </div>

          {/* Feature chips */}
          <div style={styles.featuresRow}>
            {[
              { icon: <ShieldCheck size={13} />, text: "Bảo mật cao" },
              { icon: <CheckCircle2 size={13} />, text: "Miễn phí đăng ký" },
              { icon: <Home size={13} />, text: "Quản lý dễ dàng" },
            ].map((f, i) => (
              <div key={i} style={styles.featureChip}>
                <span style={{ color: "#818cf8" }}>{f.icon}</span>
                {f.text}
              </div>
            ))}
          </div>

          {/* Card */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h1 style={styles.cardTitle}>Tạo tài khoản mới</h1>
              <p style={styles.cardSubtitle}>
                Đăng ký để bắt đầu quản lý phòng trọ của bạn
              </p>
            </div>

<form onSubmit={onSubmitRegister} style={styles.form}>
              {/* Username */}
              <div style={styles.fieldGroup}>
                <label style={styles.label} htmlFor="reg_username">Tên đăng nhập</label>
                <div style={styles.inputWrap}>
                  <span style={styles.iconLeft}><User size={16} /></span>
                  <FocusInput
                    id="reg_username"
                    name="username"
                    type="text"
                    value={form.username}
                    onChange={onChange}
                    placeholder="nguyenvana"
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              {/* Full name */}
              <div style={styles.fieldGroup}>
                <label style={styles.label} htmlFor="reg_fullName">Họ và tên</label>
                <div style={styles.inputWrap}>
                  <span style={styles.iconLeft}><User size={16} /></span>
                  <FocusInput
                    id="reg_fullName"
                    name="fullName"
                    type="text"
                    value={form.fullName}
                    onChange={onChange}
                    placeholder="Nguyễn Văn A"
                    autoComplete="name"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div style={styles.fieldGroup}>
                <label style={styles.label} htmlFor="reg_email">Email</label>
                <div style={styles.inputWrap}>
                  <span style={styles.iconLeft}><Mail size={16} /></span>
                  <FocusInput
                    id="reg_email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={onChange}
                    placeholder="ten@example.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div style={styles.fieldGroup}>
                <label style={styles.label} htmlFor="reg_password">Mật khẩu</label>
                <div style={styles.inputWrap}>
                  <span style={styles.iconLeft}><Lock size={16} /></span>
                  <FocusInput
                    id="reg_password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={onChange}
                    placeholder="Tối thiểu 6 ký tự"
                    autoComplete="new-password"
                    style={{ paddingRight: "44px" }}
                    required
                  />
                  <button
                    type="button"
                    className="eye-btn"
                    aria-label="Toggle password"
                    onClick={() => setShowPassword((s) => !s)}
                    style={styles.iconRight}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {/* Strength bar */}
                {form.password && (
                  <>
                    <div style={styles.strengthBar}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <div
                          key={n}
                          style={styles.strengthSegment(
                            strength.score >= n,
                            strength.color
                          )}
                        />
                      ))}
                    </div>
                    <div style={styles.strengthLabel(strength.color)}>
                      {strength.label}
                    </div>
                  </>
                )}
              </div>

              {/* Confirm password */}
              <div style={styles.fieldGroup}>
                <label style={styles.label} htmlFor="reg_confirmPassword">
                  Nhập lại mật khẩu
                </label>
                <div style={styles.inputWrap}>
                  <span style={styles.iconLeft}><Lock size={16} /></span>
                  <FocusInput
                    id="reg_confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={onChange}
                    placeholder="Nhập lại mật khẩu"
                    autoComplete="new-password"
                    style={{ paddingRight: "44px" }}
                    required
                  />
                  <button
                    type="button"
                    className="eye-btn"
                    aria-label="Toggle confirm password"
                    onClick={() => setShowConfirmPassword((s) => !s)}
                    style={styles.iconRight}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {form.confirmPassword && form.password !== form.confirmPassword && (
                  <div style={styles.matchErr}>⚠ Mật khẩu nhập lại chưa khớp</div>
                )}
                {form.confirmPassword && form.password === form.confirmPassword && form.confirmPassword.length > 0 && (
                  <div style={{ fontSize: "12px", color: "#4ade80", marginTop: "4px", fontWeight: 600 }}>
                    ✓ Mật khẩu khớp
                  </div>
                )}
              </div>

              {/* Terms */}
              <label style={styles.checkRow} htmlFor="reg_terms">
                <input
                  id="reg_terms"
                  type="checkbox"
                  name="acceptedTerms"
                  checked={form.acceptedTerms}
                  onChange={onChange}
                  style={styles.checkbox}
                />
                <span style={styles.checkLabel}>
                  Tôi đồng ý với{" "}
                  <span style={styles.highlight}>Điều khoản dịch vụ</span> và{" "}
                  <span style={styles.highlight}>Chính sách bảo mật</span>
                </span>
              </label>

              {/* Error */}
              {errorMsg && (
                <div style={styles.errorBox}>
                  <span>⚠</span> {errorMsg}
                </div>
              )}

              {/* Submit */}
              <button
                id="reg_submit"
                type="submit"
                disabled={!canSubmit || loading}
                className="submit-btn"
                style={{
                  ...styles.submitBtn,
                  ...(!canSubmit || loading ? styles.submitDisabled : {}),
                }}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
                    Đang tạo tài khoản...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={18} />
                    Đăng ký ngay
                  </>
                )}
              </button>

              {/* Divider */}
              <div style={styles.divider}>
                <div style={styles.dividerLine} />
                <span style={styles.dividerText}>Hoặc đăng ký bằng</span>
                <div style={styles.dividerLine} />
              </div>

              {/* Social buttons */}
              <div style={styles.socialGrid}>
                <button
                  type="button"
                  className="social-btn"
                  style={styles.socialBtn}
                >
                  <span
                    style={{
                      ...styles.socialIcon,
                      background:
                        "linear-gradient(135deg,#4285F4,#34A853,#FBBC05,#EA4335)",
                      color: "#fff",
                    }}
                  >
                    G
                  </span>
                  Google
                </button>
                <button
                  type="button"
                  className="social-btn"
                  style={styles.socialBtn}
                >
                  <span
                    style={{
                      ...styles.socialIcon,
                      background: "#24292e",
                      color: "#fff",
                      border: "1px solid rgba(255,255,255,0.15)",
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                    </svg>
                  </span>
                  GitHub
                </button>
              </div>
            </form>
          </div>

          {/* Footer */}
          <p style={styles.footerText}>
            Đã có tài khoản?
            <Link to="/login" style={styles.footerLink}>
              Đăng nhập ngay →
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default Register;
