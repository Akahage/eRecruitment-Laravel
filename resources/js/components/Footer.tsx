import React from 'react';
import styled from 'styled-components';
import { Link } from '@inertiajs/react';

const FooterWrapper = styled.footer`
  background: #F5FBFF;
  padding: 32px 0 18px 0;
  margin-top: 0px;
`;

const FooterContent = styled.div`
  max-width: 1200px; // Tetapkan lebar maksimum agar konten tidak terlalu melebar
  margin: 0 auto;
  display: flex;
  justify-content: space-between; // Sebar kolom secara merata
  align-items: flex-start; // Pastikan semua kolom sejajar di atas
  padding: 0 20px; // Tambahkan padding kiri dan kanan
  gap: 40px; // Tambahkan jarak antar kolom
`;

const FooterTitle = styled.div`
  font-weight: 700;
  margin-bottom: 8px;
  font-size: 15px;
  text-align: left;
  color: #222;
`;

const FooterCol1 = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
`;

const FooterCol2 = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start; // Tetap sejajar kiri
  text-align: left;
  padding-left: 75px; // Gunakan padding untuk jarak kiri agar lebih konsisten
`;

const FooterCol3 = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start; // Ubah ke flex-start agar sejajar kiri
  text-align: left;
`;

const FooterDesc = styled.div`
  color: #555;
  font-size: 13px;
  margin-bottom: 12px;
  margin-top: 2px;
  max-width: 210px;
`;

const FooterSocial = styled.div`
  margin-top: 8px;
  display: flex;
  gap: 12px;
  font-size: 16px;
  color: #1DA1F2;
  align-items: center;
`;

const FooterSocialLink = styled.a`
  color: #1DA1F2;
  transition: color 0.2s;
  &:hover {
    color: #0d8ddb;
  }
`;

const FooterList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0; // Hapus margin-left agar sejajar dengan title
`;

const FooterListItem = styled.li`
  margin-bottom: 4px;
  font-size: 13px;
  color: #222;
`;

const FooterContact = styled.div`
  color: #222;
  font-size: 13px;
  line-height: 1.7;
  display: flex;
  flex-direction: column;
  align-items: flex-start; // Pastikan semua elemen sejajar kiri
  gap: 0px; // Tambahkan jarak antar elemen untuk merapikan
`;

const ContactRow = styled.div`
  display: flex;
  align-items: center; // Pastikan icon dan teks sejajar vertikal
  gap: 12px; // Tambahkan jarak antara icon dan teks

  i {
    width: 16px; // Tetapkan lebar icon agar konsisten
    height: 16px; // Tetapkan tinggi icon agar konsisten
    display: flex;
    align-items: center;
    justify-content: center; // Pastikan icon berada di tengah
  }
`;

const FooterAddress = styled.div`
  color: #222;
  font-size: 13px;
  line-height: 1.7;
  display: flex;
  align-items: flex-start; // Pastikan icon dan teks sejajar kiri
  gap: 12px; // Tambahkan jarak antara icon dan teks
  margin-top: 0px; // Tambahkan jarak dari elemen sebelumnya

  i {
    width: 16px; // Tetapkan lebar icon agar konsisten
    height: 23px; // Tetapkan tinggi icon agar konsisten
    display: flex;
    align-items: center;
    justify-content: center; // Pastikan icon berada di tengah
  }

  div {
    flex: 1; // Biarkan teks mengambil sisa ruang
  }
`;

const Footer: React.FC = () => (
  <FooterWrapper>
    <FooterContent>
      {/* Kolom Kiri */}
      <FooterCol1>
        <FooterTitle>PT MITRA KARYA ANALITIKA</FooterTitle>
        <FooterDesc>
          Kami adalah perusahaan teknologi pintar yang senantiasa berkomitmen untuk memberikan dan meningkatkan kepuasan pelanggan
        </FooterDesc>
        <FooterSocial>
          <FooterSocialLink href="#"><i className="fa-brands fa-x-twitter" /></FooterSocialLink>
          <FooterSocialLink href="#"><i className="fa-brands fa-instagram" /></FooterSocialLink>
          <FooterSocialLink href="#"><i className="fa-brands fa-linkedin" /></FooterSocialLink>
          <FooterSocialLink href="#"><i className="fa-brands fa-youtube" /></FooterSocialLink>
          <FooterSocialLink href="#"><i className="fa-brands fa-whatsapp" /></FooterSocialLink>
        </FooterSocial>
      </FooterCol1>

      {/* Kolom Tengah */}
      <FooterCol2>
        <FooterTitle>Perusahaan Kami</FooterTitle>
        <FooterList>
          <FooterListItem>PT MITRA KARYA ANALITIKA</FooterListItem>
          <FooterListItem>PT AUTENTIK KARYA ANALITIKA</FooterListItem>
        </FooterList>
      </FooterCol2>

      {/* Kolom Kanan */}
      <FooterCol3>
        <FooterTitle>Contact</FooterTitle>
        <FooterContact>
          <ContactRow>
            <i className="fa-solid fa-user" style={{ color: '#1DA1F2', fontSize: 14 }} />
            Rudy Alfansyah: 082137384029
          </ContactRow>
          <ContactRow>
            <i className="fa-solid fa-user" style={{ color: '#1DA1F2', fontSize: 14 }} />
            Deeden Ernawan: 081387700111
          </ContactRow>
          <ContactRow>
            <i className="fa-solid fa-envelope" style={{ color: '#1DA1F2', fontSize: 14 }} />
            autentik.info@gmail.com
          </ContactRow>
          <FooterAddress>
            <i className="fa-solid fa-location-dot" style={{ color: '#1DA1F2', fontSize: 14 }} />
            <div>
              Jl. Klitren Ruko Amsterdam No.9E, Sendangmulyo,<br />
              Kec. Tembalang, Kota Semarang, Jawa Tengah 50272
            </div>
          </FooterAddress>
        </FooterContact>
      </FooterCol3>
    </FooterContent>
  </FooterWrapper>
);

export default Footer;