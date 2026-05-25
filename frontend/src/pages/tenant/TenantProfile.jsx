import React, { useEffect, useState } from "react";
import api from "../../services/api";

const TenantProfile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.get("/tenant/me").then((res) => setProfile(res));
  }, []);

  if (!profile) return <div className="container">Đang tải thông tin cá nhân...</div>;

  return (
    <div className="container">
      <h2>Trang cá nhân</h2>
      <p>Họ tên: {profile.fullName}</p>
      <p>Email: {profile.email}</p>
      <p>SĐT: {profile.phone}</p>
      <p>CCCD: {profile.identityNumber}</p>
      <p>Địa chỉ: {profile.address}</p>
    </div>
  );
};

export default TenantProfile;
