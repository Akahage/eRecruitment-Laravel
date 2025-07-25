import { usePage, Head, Link, useForm, router } from '@inertiajs/react';
import React from 'react';
import styled from 'styled-components';
import Swal from 'sweetalert2';

interface JobDetailProps extends Record<string, unknown> {
    job: {
        id: number;
        title: string;
        company: { name: string };
        job_description: string;
        requirements: string[];
        benefits: string[];
        major_id: number;
        major_name: string | null;
    };
    userMajor: number | null;
    isMajorMatched: boolean;
    canApply: boolean;
    applicationMessage: string;
    flash?: { success?: string; error?: string; };
}

const PageWrapper = styled.div`
    background-color: #f9f9f9;
`;

const ContentContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
`;

const HeroSection = styled.div`
    position: relative;
    height: 600px;
    background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
        url('/images/background.png');
    background-size: cover;
    background-position: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    text-align: center;
`;

const JobTitle = styled.h1`
    font-size: 2.5rem;
    margin-bottom: 10px;
    font-weight: bold;
`;

const CompanyTitle = styled.h2`
    font-size: 1.5rem;
    font-weight: bold;
`;

const InfoSection = styled.section`
    margin: 40px 0;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SectionHeading = styled.h3`
    font-size: 1.8rem;
    margin-bottom: 20px;
    color: #222;
`;

const JobDescription = styled.p`
    line-height: 1.6;
    margin-bottom: 15px;
    color: #333;
`;

const List = styled.ul`
    list-style-type: none;
    padding: 0;
`;

const ListItem = styled.li`
    margin-bottom: 10px;
    padding-left: 20px;
    position: relative;
    color: #222;

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

const MajorWarning = styled.div`
    background-color: #fff3cd;
    color: #856404;
    padding: 16px;
    border-radius: 8px;
    margin: 20px 0;
    border-left: 5px solid #ffeeba;
    display: flex;
    align-items: center;
    gap: 12px;
`;

const WarningIcon = styled.span`
    font-size: 24px;
`;

const MajorMatch = styled.div`
    background-color: #d4edda;
    color: #155724;
    padding: 16px;
    border-radius: 8px;
    margin: 20px 0;
    border-left: 5px solid #c3e6cb;
    display: flex;
    align-items: center;
    gap: 12px;
`;

const MatchIcon = styled.span`
    font-size: 24px;
`;

const ApplicationAlert = styled.div`
    background-color: #f8d7da;
    color: #721c24;
    padding: 16px;
    border-radius: 8px;
    margin: 20px 0;
    border-left: 5px solid #f5c6cb;
    display: flex;
    align-items: center;
    gap: 12px;
`;

const ApplicationIcon = styled.span`
    font-size: 24px;
`;

const JobDetailPage: React.FC = () => {
    const { job, userMajor, isMajorMatched, canApply, applicationMessage, flash } = usePage<JobDetailProps>().props;

    React.useEffect(() => {
        // Tampilkan flash messages dari backend
        if (flash?.success) {
            Swal.fire({
                title: 'Sukses!',
                text: flash.success,
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                // Update URL untuk application history
                window.location.href = '/candidate/application-history';
            });
        }

        if (flash?.error) {
            Swal.fire({
                title: 'Perhatian!',
                text: flash.error,
                icon: 'warning',
                confirmButtonText: 'OK'
            });
        }
    }, [flash]);

    const handleApply = async () => {
        Swal.fire({
            title: 'Konfirmasi',
            text: 'Anda akan melamar pekerjaan ini. Lanjutkan?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Lamar Sekarang',
            cancelButtonText: 'Batal'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Tampilkan loading
                    Swal.fire({
                        title: 'Memproses...',
                        text: 'Mohon tunggu sebentar',
                        allowOutsideClick: false,
                        showConfirmButton: false,
                        didOpen: () => {
                            Swal.showLoading(Swal.getDenyButton());
                        }
                    });

                    // Gunakan router.post() dari Inertia.js
                    router.post(`/candidate/apply/${job.id}`, {}, {
                        onSuccess: (data: any) => {
                            Swal.close();
                            
                            Swal.fire({
                                title: 'Berhasil!',
                                text: 'Lamaran Anda telah berhasil dikirim.',
                                icon: 'success',
                                confirmButtonText: 'OK'
                            }).then(() => {
                                // Redirect ke halaman application history
                                router.visit('/candidate/application-history');
                            });
                        },
                        onError: (errors: any) => {
                            Swal.close();
                            console.error('Apply error:', errors);

                            // Handle different error cases
                            if (errors.message) {
                                Swal.fire({
                                    title: 'Perhatian',
                                    text: errors.message,
                                    icon: 'warning',
                                    confirmButtonText: 'OK'
                                });
                            } else {
                                Swal.fire({
                                    title: 'Error',
                                    text: 'Terjadi kesalahan saat melamar. Silakan coba lagi.',
                                    icon: 'error',
                                    confirmButtonText: 'OK'
                                });
                            }
                        }
                    });
                } catch (error: unknown) {
                    Swal.close();
                    console.error('Apply error:', error);
                    
                    Swal.fire({
                        title: 'Error',
                        text: 'Terjadi kesalahan jaringan. Silakan coba lagi.',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                }
            }
        });
    };

    return (
        <>
            {/* Custom Header for Candidate Pages */}
            <header className="fixed top-0 right-0 left-0 z-50 h-[80px] border-b border-gray-200 bg-white px-[20px] shadow">
                <div className="container mx-auto flex items-center justify-between px-6 py-4">
                    <div className="text-[20px] font-bold text-gray-800">MITRA KARYA GROUP</div>

                    <nav className="hidden space-x-[24px] text-[14px] font-medium md:flex">
                        <a href="/candidate/dashboard" className="text-gray-900 hover:text-blue-600">
                            Dasbor
                        </a>
                        <a href="/candidate/profile" className="text-gray-900 hover:text-blue-600">
                            Profil
                        </a>
                        <a href="/candidate/jobs" className="text-gray-900 hover:text-blue-600">
                            Lowongan Pekerjaan
                        </a>
                        <a href="/candidate/application-history" className="text-gray-900 hover:text-blue-600">
                            Lamaran
                        </a>
                    </nav>
                    <div className="flex items-center gap-4">
                        {/* User menu can be added here */}
                    </div>
                </div>
            </header>
            <PageWrapper>
                <HeroSection>
                    <JobTitle>{job?.title}</JobTitle>
                    <CompanyTitle>{job?.company?.name}</CompanyTitle>
                </HeroSection>
                <ContentContainer>
                    {/* Tampilkan peringatan kesesuaian jurusan */}
                    {userMajor === null ? (
                        <MajorWarning>
                            <WarningIcon>⚠️</WarningIcon>
                            <div>
                                <strong>Data jurusan belum lengkap!</strong> Mohon lengkapi data pendidikan Anda terlebih dahulu
                                untuk dapat melamar lowongan ini.
                            </div>
                        </MajorWarning>
                    ) : isMajorMatched ? (
                        <MajorMatch>
                            <MatchIcon>✓</MatchIcon>
                            <div>
                                <strong>Jurusan Anda cocok!</strong> Lowongan ini membutuhkan jurusan {job?.major_name}
                                yang sesuai dengan jurusan Anda.
                            </div>
                        </MajorMatch>
                    ) : (
                        <MajorWarning>
                            <WarningIcon>⚠️</WarningIcon>
                            <div>
                                <strong>Jurusan tidak sesuai!</strong> Lowongan ini membutuhkan jurusan {job?.major_name}
                                yang tidak sesuai dengan jurusan Anda.
                            </div>
                        </MajorWarning>
                    )}

                    {/* Tampilkan pesan status aplikasi */}
                    {!canApply && applicationMessage && (
                        <ApplicationAlert>
                            <ApplicationIcon>🚫</ApplicationIcon>
                            <div>
                                <strong>Tidak dapat melamar!</strong> {applicationMessage}
                            </div>
                        </ApplicationAlert>
                    )}

                    <InfoSection>
                        <SectionHeading>Job Description</SectionHeading>
                        <JobDescription>{job?.job_description}</JobDescription>
                    </InfoSection>
                    <InfoSection>
                        <SectionHeading>Requirements</SectionHeading>
                        <List>
                            {job?.requirements?.map((requirement, index) => (
                                <ListItem key={index}>{requirement}</ListItem>
                            ))}
                        </List>
                    </InfoSection>
                    <InfoSection>
                        <SectionHeading>Benefits</SectionHeading>
                        <List>
                            {job?.benefits?.map((benefit, index) => (
                                <ListItem key={index}>{benefit}</ListItem>
                            ))}
                        </List>
                    </InfoSection>

                    {/* Button Apply dengan kondisi */}
                    <ApplyButton
                        onClick={handleApply}
                        disabled={!isMajorMatched || !canApply}
                        style={{
                            backgroundColor: (!isMajorMatched || !canApply) ? '#cccccc' : '#1a73e8',
                            cursor: (!isMajorMatched || !canApply) ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {!isMajorMatched
                            ? 'Tidak Dapat Apply (Jurusan Tidak Sesuai)'
                            : !canApply
                                ? 'Tidak Dapat Apply (Sudah Pernah Melamar)'
                                : 'Lamar Sekarang'
                        }
                    </ApplyButton>
                </ContentContainer>
            </PageWrapper>
            {/* Footer */}
            <footer className="bg-[#f6fafe] py-16">
                <div className="container mx-auto grid grid-cols-1 gap-10 px-6 md:grid-cols-3">
                    {/* Kolom 1 */}
                    <div>
                        <h4 className="mb-2 text-[16px] font-bold">MITRA KARYA GROUP</h4>
                        <p className="mb-6 text-sm text-gray-700">
                            Kami adalah perusahaan teknologi pintar yang senantiasa berkomitmen untuk memberikan dan meningkatkan kepuasan pelanggan
                        </p>
                        {/* Social Media Icons */}
                        <div className="flex space-x-6 text-xl text-blue-600">
                            {/* Instagram - Dropup untuk dua akun */}
                            <div className="relative group">
                                <a href="#" className="group-hover:text-blue-800">
                                    <i className="fab fa-instagram"></i>
                                </a>
                                <div className="absolute bottom-full left-0 mb-1 bg-white shadow-md rounded-md p-2 hidden group-hover:block z-10 w-40">
                                    <a
                                        href="https://www.instagram.com/mikacares.id"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block py-1 px-2 text-sm hover:text-blue-800 hover:bg-gray-50"
                                    >
                                        @mikacares.id
                                    </a>
                                    <a
                                        href="https://www.instagram.com/autentik.co.id"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block py-1 px-2 text-sm hover:text-blue-800 hover:bg-gray-50"
                                    >
                                        @autentik.co.id
                                    </a>
                                </div>
                            </div>

                            {/* LinkedIn - Dropup untuk dua perusahaan */}
                            <div className="relative group">
                                <a href="#" className="group-hover:text-blue-800">
                                    <i className="fab fa-linkedin-in"></i>
                                </a>
                                <div className="absolute bottom-8 left-0 mb-1 bg-white shadow-lg rounded-lg p-3 hidden group-hover:block z-50 w-72">
                                    <div className="flex flex-col gap-3">
                                        <a
                                            href="https://www.linkedin.com/company/pt-mitra-karya-analitika"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-md transition-colors"
                                        >
                                            <i className="fab fa-linkedin text-2xl text-[#0A66C2]"></i>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">PT Mitra Karya Analitika</span>
                                                <span className="text-xs text-gray-500">Follow us on LinkedIn</span>
                                            </div>
                                        </a>
                                        <div className="border-t border-gray-100"></div>
                                        <a
                                            href="https://www.linkedin.com/company/pt-autentik-karya-analitika"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-md transition-colors"
                                        >
                                            <i className="fab fa-linkedin text-2xl text-[#0A66C2]"></i>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">PT Autentik Karya Analitika</span>
                                                <span className="text-xs text-gray-500">Follow us on LinkedIn</span>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* YouTube */}
                            <a href="https://www.youtube.com/@mikacares" target="_blank" rel="noopener noreferrer" className="hover:text-blue-800">
                                <i className="fab fa-youtube"></i>
                            </a>

                            {/* WhatsApp */}
                            <a href="https://wa.me/6281770555554" target="_blank" rel="noopener noreferrer" className="hover:text-blue-800">
                                <i className="fab fa-whatsapp"></i>
                            </a>
                        </div>
                    </div>

                    {/* Kolom 2 */}
                    <div>
                        <h4 className="mb-2 text-[16px] font-bold">Perusahaan Kami</h4>
                        <ul className="space-y-1 text-sm text-gray-700">
                            <li>PT Mitra Karya Analitika</li>
                            <li>PT Autentik Karya Analitika</li>
                        </ul>
                    </div>

                    {/* Kolom 3 */}
                    <div>
                        <h4 className="mb-4 text-[16px] font-bold">Contact</h4>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li className="flex items-start gap-2">
                                <i className="fas fa-phone mt-1 text-blue-600" />
                                <div>+62 817 7055 5554</div>
                            </li>
                            <li className="flex items-center gap-2">
                                <i className="fas fa-envelope text-blue-600" />
                                <span>info@mitrakarya.com</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <i className="fas fa-map-marker-alt mt-1 text-blue-600" />
                                <span>Jakarta, Indonesia</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default JobDetailPage;
