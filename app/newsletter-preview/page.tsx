'use client';

import { useState } from 'react';

export default function NewsletterPreview() {
  const [companyName, setCompanyName] = useState('Blockchain Firm');
  const [headline, setHeadline] = useState('Get All Your Tech Solutions In One Spot');
  const [mainContent, setMainContent] = useState('Explore the future of technology with our trusted partnership in development and consulting. From tailored solutions to innovative services, we empower businesses to thrive in the digital age.');
  const [accentColor, setAccentColor] = useState('#DC4444');

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Soft Newsletter Template</h1>
          <p className="text-gray-600">A beautiful, customizable newsletter template inspired by modern design</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Customize Your Newsletter</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
              <input
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="w-full h-10 border border-gray-300 rounded-md"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Headline</label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Main Content</label>
              <textarea
                value={mainContent}
                onChange={(e) => setMainContent(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Newsletter Preview */}
        <div className="flex justify-center">
          <div className="max-w-2xl w-full bg-white shadow-lg" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>
            {/* Header Section */}
            <div className="text-center py-8 px-6">
              {/* Logo */}
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 mb-4" style={{ backgroundColor: accentColor }}>
                  <div className="w-8 h-8 bg-white" style={{ 
                    clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                    transform: 'rotate(180deg)'
                  }} />
                </div>
              </div>
              
              {/* Company Name */}
              <div className="text-sm font-semibold tracking-widest text-gray-600 uppercase mb-6">
                {companyName}
              </div>
              
              {/* Main Headline */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
                {headline}
              </h1>
            </div>

            {/* Geometric Design Section */}
            <div className="relative px-6 py-12 overflow-hidden">
              {/* Background geometric elements */}
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Large background circles */}
                <div className="absolute w-32 h-32 bg-gray-100 rounded-full opacity-60 -top-8 -left-8" />
                <div className="absolute w-24 h-24 bg-gray-100 rounded-full opacity-40 top-16 right-12" />
                <div className="absolute w-20 h-20 bg-gray-100 rounded-full opacity-50 bottom-8 left-16" />
                <div className="absolute w-16 h-16 bg-gray-100 rounded-full opacity-30 bottom-16 right-8" />
                
                {/* Decorative lines */}
                <div className="absolute w-24 h-0.5 bg-gray-200 top-20 left-20 rotate-45" />
                <div className="absolute w-16 h-0.5 bg-gray-200 bottom-24 right-16 -rotate-45" />
                
                {/* Small geometric shapes */}
                <div className="absolute w-6 h-6 bg-gray-200 top-32 left-8 rotate-45" />
                <div className="absolute w-4 h-4 bg-gray-200 bottom-32 right-20" style={{
                  clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
                }} />
              </div>
              
              {/* Central hexagon with logo */}
              <div className="relative z-10 flex justify-center mb-8">
                <div 
                  className="w-20 h-20 flex items-center justify-center text-white shadow-lg"
                  style={{ 
                    backgroundColor: accentColor,
                    clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)'
                  }}
                >
                  <div className="w-8 h-8 grid grid-cols-2 gap-0.5">
                    <div className="bg-white w-full h-full" />
                    <div className="bg-white w-full h-full" />
                    <div className="bg-white w-full h-full" />
                    <div className="bg-white w-full h-full" />
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="relative z-10 text-center">
                <p className="text-gray-600 leading-relaxed mb-8 max-w-md mx-auto">
                  {mainContent}
                </p>
                
                {/* CTA Button */}
                <a 
                  href="#"
                  className="inline-block px-8 py-3 text-white font-medium rounded-none shadow-lg hover:shadow-xl transition-shadow duration-300"
                  style={{ backgroundColor: '#333333' }}
                >
                  Visit page
                </a>
              </div>
            </div>

            {/* Footer Section */}
            <div className="text-center py-8 px-6 bg-gray-50">
              <p className="text-gray-600 mb-4 font-medium">
                Kind Regards,
              </p>
              
              <div className="text-sm text-gray-500 space-y-1">
                <p className="font-medium">©{new Date().getFullYear()} {companyName},</p>
                <p>SRP Stratford, OMR, PTK Nagar,</p>
                <p>Thiruvanmiyur, Chennai,</p>
                <p>Tamil Nadu 600041</p>
                <p className="mt-4">All rights reserved.</p>
              </div>

              {/* Social Links Placeholder */}
              <div className="flex justify-center space-x-6 mt-6">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-gray-500 rounded-full" />
                </div>
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-gray-500 rounded-full" />
                </div>
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-gray-500 rounded-full" />
                </div>
              </div>
              
              {/* Footer links */}
              <div className="flex justify-center space-x-6 mt-6 text-sm text-gray-500">
                <a href="#" className="hover:text-gray-700 transition-colors">Our Blog</a>
                <a href="#" className="hover:text-gray-700 transition-colors">Unsubscribe</a>
                <a href="#" className="hover:text-gray-700 transition-colors">Policies</a>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">How to Use This Template</h2>
          <div className="prose text-gray-600">
            <p className="mb-4">This soft newsletter template features:</p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li><strong>Geometric Design:</strong> Abstract shapes and circles create visual interest</li>
              <li><strong>Customizable Colors:</strong> Easy to match your brand colors</li>
              <li><strong>Responsive Layout:</strong> Looks great on all devices</li>
              <li><strong>Professional Typography:</strong> Clean, readable fonts</li>
              <li><strong>Modern Aesthetic:</strong> Soft shadows and smooth transitions</li>
            </ul>
            <p>You can easily customize the company name, headline, content, and accent color using the controls above. The template is built with Tailwind CSS and React for easy integration into your project.</p>
          </div>
        </div>
      </div>
    </div>
  );
}