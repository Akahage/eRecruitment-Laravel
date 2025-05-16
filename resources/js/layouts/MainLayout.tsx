import React from 'react';
import styled from 'styled-components';

const Layout = styled.div`
    min-height: 100vh;
    width: 100%;
`;

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <Layout>
            {children}
        </Layout>
    );
};

export default MainLayout;