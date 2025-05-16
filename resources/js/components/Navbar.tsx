import React from 'react';
import { Link } from '@inertiajs/react';
import styled from 'styled-components';

const NavContainer = styled.div`
  width: 100%;
  background: white;
  border-bottom: 1px solid #eaeaea;
  position: fixed;
  top: 0;
  z-index: 1000;
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 1.2rem;
  font-weight: 600;
  color: #000;
  text-decoration: none;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const NavLink = styled(Link)`
  color: #4B5563;
  text-decoration: none;
  font-size: 0.9rem;
  
  &:hover {
    color: #000;
  }
`;

const ProfileButton = styled(Link)`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1a73e8;
  border-radius: 50%;
  color: white;
`;

const Navbar = () => {
  return (
    <NavContainer>
      <NavContent>
        <Logo href="/">MITRA KARYA GROUP</Logo>
        <NavLinks>
          <NavLink href="/dashboard">Dashor</NavLink>
          <NavLink href="/profil">Profil</NavLink>
          <NavLink href="/lowongan-pekerjaan">Lowongan Pekerjaan</NavLink>
          <NavLink href="/lamaran">Lamaran</NavLink>
          <ProfileButton href="/profile">
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </ProfileButton>
        </NavLinks>
      </NavContent>
    </NavContainer>
  );
};

export default Navbar;