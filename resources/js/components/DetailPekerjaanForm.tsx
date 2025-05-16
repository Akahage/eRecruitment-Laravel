import React from 'react';
import styled from 'styled-components';
import Header from './Header';
import Footer from './Footer';

interface VacancyProps {
    id: number;
    title: string;
    company: string;
    description: string;
    requirements: string[];
    benefits: string[];
}

const PageContainer = styled.div`
    background-color: #f9f9f9;
`;

const JobDetailContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
`;

const Hero = styled.div`
    position: relative;
    height: 600px;
    background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
        url('/images/background.jpg'); /* Replace with your image path */
    background-size: cover;
    background-position: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    text-align: center;
`;

const Title = styled.h1`
    font-size: 2.5rem;
    margin-bottom: 10px;
    font-weight: bold; // Tambahkan agar bold
`;

const CompanyName = styled.h2`
    font-size: 1.5rem;
    font-weight: bold; // Ubah dari normal ke bold
`;

const Section = styled.section`
    margin: 40px 0;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h3`
    font-size: 1.8rem;
    margin-bottom: 20px;
    color: #222; // Tambahkan warna gelap
`;

const Description = styled.p`
    line-height: 1.6;
    margin-bottom: 15px;
    color: #333; // Tambahkan warna gelap
`;

const List = styled.ul`
    list-style-type: none;
    padding: 0;
`;

const ListItem = styled.li`
    margin-bottom: 10px;
    padding-left: 20px;
    position: relative;
    color: #222; // Tambahkan warna gelap
    
    &:before {
        content: "•";
        position: absolute;
        left: 0;
        color: #1a73e8;
    }
`;

const ApplyButton = styled.button`
    background-color: #1a73e8;
    color: white;
    border: none;
    padding: 15px 150px;
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;
    display: block;
    margin: 40px auto;
    
    &:hover {
        background-color: #1557b0;
    }
`;

const staticVacancy = {
    title: "Hardware Engineer",
    company: "PT Autentik Karya Analitika",
    description: `Ahli yang merancang, mengembangkan, dan menguji perangkat keras, termasuk desain PCB dan integrasi komponen elektronik, untuk aplikasi seperti robotika dan sistem tertanam.

Jika Anda memiliki minat dalam bidang elektronika, robotika, dan desain PCB serta ingin bekerja di lingkungan inovatif, maka Anda adalah kandidat yang tepat untuk posisi ini.`,
    requirements: [
        "D3/S1 bidang Teknik Listrik, Teknik Elektro, Mekatronika, Elektromekanik, atau yang relevan;",
        "Memiliki pengetahuan tingkat lanjut terkait robotika, pemrograman tertanam, PCB layout, dan PCB desain;",
        "Tidak buta warna",
        "Bersedia ditempatkan di Kota Semarang"
    ],
    benefits: [
        "Gaji Pokok",
        "Training",
        "Lorem ipsum dolor sit amet"
    ]
};

const DetailPekerjaanForm: React.FC = () => {
    const vacancy = staticVacancy;

    const handleApply = async () => {
        try {
            const response = await fetch(`/detail-pekerjaan/apply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            if (response.ok) {
                alert('Lamaran berhasil dikirim');
            }
        } catch (error) {
            console.error('Error submitting application:', error);
        }
    };

    return (
        <>
            <Header />
            <PageContainer>
                <Hero>
                    <Title>{vacancy.title}</Title>
                    <CompanyName>{vacancy.company}</CompanyName>
                </Hero>

                <JobDetailContainer>
                    <Section>
                        <SectionTitle>Detail Pekerjaan</SectionTitle>
                        <Description>{vacancy.description}</Description>
                    </Section>

                    <Section>
                        <SectionTitle>Persyaratan</SectionTitle>
                        <List>
                            {vacancy.requirements.map((requirement, index) => (
                                <ListItem key={index}>{requirement}</ListItem>
                            ))}
                        </List>
                    </Section>

                    <Section>
                        <SectionTitle>Benefits</SectionTitle>
                        <List>
                            {vacancy.benefits.map((benefit, index) => (
                                <ListItem key={index}>{benefit}</ListItem>
                            ))}
                        </List>
                    </Section>

                    <ApplyButton onClick={handleApply}>Lamar</ApplyButton>
                </JobDetailContainer>
            </PageContainer>
            <Footer />
        </>
    );
};

export default DetailPekerjaanForm;