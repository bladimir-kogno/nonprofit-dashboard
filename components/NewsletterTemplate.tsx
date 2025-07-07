interface NewsletterTemplateProps {
  companyName?: string;
  logoElement?: JSX.Element;
  headline?: string;
  subheadline?: string;
  mainContent?: string;
  buttonText?: string;
  buttonLink?: string;
  footerMessage?: string;
  companyDetails?: {
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  accentColor?: string;
}

const NewsletterTemplate: React.FC<NewsletterTemplateProps> = ({
  companyName = "Your Company",
  logoElement,
  headline = "Get All Your Tech Solutions In One Spot",
  subheadline = "Innovative Technology Services",
  mainContent = "Explore the future of technology with our trusted partnership in development and consulting. From tailored solutions to innovative services, we empower businesses to thrive in the digital age.",
  buttonText = "Visit page",
  buttonLink = "#",
  footerMessage = "Kind Regards,",
  companyDetails = {
    address: "123 Innovation Drive",
    city: "Tech City",
    state: "TC",
    zipCode: "12345",
    country: "United States"
  },
  accentColor = "#DC4444"
}) => {
  return (
    <div className="max-w-2xl mx-auto bg-white font-sans" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>
      {/* Header Section */}
      <div className="text-center py-8 px-6">
        {/* Logo */}
        <div className="mb-6">
          {logoElement || (
            <div className="inline-flex items-center justify-center w-12 h-12 mb-4" style={{ backgroundColor: accentColor }}>
              <div className="w-8 h-8 bg-white" style={{ 
                clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                transform: 'rotate(180deg)'
              }} />
            </div>
          )}
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
            href={buttonLink}
            className="inline-block px-8 py-3 text-white font-medium rounded-none shadow-lg hover:shadow-xl transition-shadow duration-300"
            style={{ backgroundColor: '#333333' }}
          >
            {buttonText}
          </a>
        </div>
      </div>

      {/* Footer Section */}
      <div className="text-center py-8 px-6 bg-gray-50">
        <p className="text-gray-600 mb-4 font-medium">
          {footerMessage}
        </p>
        
        <div className="text-sm text-gray-500 space-y-1">
          <p className="font-medium">©{new Date().getFullYear()} {companyName},</p>
          {companyDetails.address && (
            <p>{companyDetails.address}, {companyDetails.city}, {companyDetails.state}, {companyDetails.zipCode}</p>
          )}
          {companyDetails.country && (
            <p>{companyDetails.country}</p>
          )}
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
  );
};

export default NewsletterTemplate;