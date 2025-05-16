import React from 'react';
import styled from 'styled-components';
import { Link } from '@inertiajs/react';

const HeaderWrapper = styled.header`
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const HeaderContent = styled.div`
  width: 100%;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px; // Tambahkan padding kiri-kanan seperlunya
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: flex-start;
  font-weight: bold;
`;

const CenterSection = styled.nav`
  display: flex;
  gap: 24px;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
`;

const Logo = styled(Link)`
  font-weight: 700;
  font-size: 16px;
  letter-spacing: 0.5px;
  margin-left: 0;
  color: #111;
  text-decoration: none;
`;

const Nav = styled.nav`
  display: flex;
  gap: 24px;
  align-items: center;
`;

const NavLink = styled(Link)`
  color: #222;
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
  transition: color 0.2s;
  padding: 0 4px;

  &:hover {
    color: #1DA1F2;
  }
`;

const ProfileIcon = styled(Link)`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #e5f1fb;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1DA1F2;
  font-size: 22px;
  margin-right: 8px;
  border: 1.5px solid #e5e7eb;
`;

const Header: React.FC = () => (
  <HeaderWrapper>
    <HeaderContent>
      <LeftSection>
        <Logo href="/">MITRA KARYA GROUP</Logo>
      </LeftSection>
      <CenterSection>
        <NavLink href="/dashboard">Dasbor</NavLink>
        <NavLink href="/profil">Profil</NavLink>
        <NavLink href="/lowongan-pekerjaan">Lowongan Pekerjaan</NavLink>
        <NavLink href="/lamaran">Lamaran</NavLink>
      </CenterSection>
      <RightSection>
        <ProfileIcon href="/profile">
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="8" r="4" fill="#1DA1F2" />
            <rect x="4" y="16" width="16" height="6" rx="3" fill="#1DA1F2" />
          </svg>
        </ProfileIcon>
      </RightSection>
    </HeaderContent>
  </HeaderWrapper>
);

export default Header;

// Define the VacancyProps interface
interface VacancyProps {
  id: number;
  title: string;
  description: string;
  location: string;
  // Add other properties as needed
}

const DetailPekerjaanForm: React.FC<{ vacancy: VacancyProps }> = ({ vacancy }) => {
  return (
    <div>
      <Header />
      <div style={{ padding: '1rem' }}>
        {/* ...existing content... */}
      </div>
    </div>
  );
};