import React from 'react';

export const FooterSocialMedia: React.FC = () => {
  return (
    <>
      <a href="#" className="hover:text-blue-800 transition-colors">
        <i className="fab fa-facebook-f"></i>
      </a>
      <a href="#" className="hover:text-blue-800 transition-colors">
        <i className="fab fa-twitter"></i>
      </a>
      <a href="#" className="hover:text-blue-800 transition-colors">
        <i className="fab fa-instagram"></i>
      </a>
      <a href="#" className="hover:text-blue-800 transition-colors">
        <i className="fab fa-linkedin-in"></i>
      </a>
      <a href="#" className="hover:text-blue-800 transition-colors">
        <i className="fab fa-youtube"></i>
      </a>
    </>
  );
};

export default FooterSocialMedia;
