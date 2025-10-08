
const Objectives = () => {
    return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#461711] mb-6 leading-tight">
            Our Objectives
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#ff7612] to-[#ffdb5b] mx-auto mb-6 rounded-full"></div>
          <p className="text-lg sm:text-xl text-gray-600 font-medium max-w-3xl mx-auto">
            Three pillars of empowerment for comprehensive mental health support
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 lg:w-28 lg:h-28 bg-gradient-to-br from-[#ff7612] to-[#ffdb5b] rounded-full flex items-center justify-center shadow-md mb-6">
                <img src="/obj1.png" alt="Self Awareness" className="w-16 h-16 lg:w-18 lg:h-18 object-contain" />
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#461711] mb-4">
                Self Awareness
              </h3>
              <p className="text-lg sm:text-xl text-gray-600 mb-4 font-medium">
                Through comprehensive educational programs
              </p>
              <ul className="space-y-3 text-left">
                <li className="flex items-center text-base sm:text-lg text-gray-700">
                  <span className="w-2 h-2 bg-[#ff7612] rounded-full mr-3 flex-shrink-0"></span>
                  Interactive Webinars
                </li>
                <li className="flex items-center text-base sm:text-lg text-gray-700">
                  <span className="w-2 h-2 bg-[#ff7612] rounded-full mr-3 flex-shrink-0"></span>
                  Mental Health Workshops
                </li>
                <li className="flex items-center text-base sm:text-lg text-gray-700">
                  <span className="w-2 h-2 bg-[#ff7612] rounded-full mr-3 flex-shrink-0"></span>
                  Offline Community Events
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 lg:w-28 lg:h-28 bg-gradient-to-br from-[#ff7612] to-[#ffdb5b] rounded-full flex items-center justify-center shadow-md mb-6">
                <img src="/obj2.png" alt="Self Expression" className="w-16 h-16 lg:w-18 lg:h-18 object-contain" />
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#461711] mb-4">
                Self Expression
              </h3>
              <p className="text-lg sm:text-xl text-gray-600 mb-4 font-medium">
                Through creative and community engagement
              </p>
              <ul className="space-y-3 text-left">
                <li className="flex items-center text-base sm:text-lg text-gray-700">
                  <span className="w-2 h-2 bg-[#ff7612] rounded-full mr-3 flex-shrink-0"></span>
                  Skills Showcase Events
                </li>
                <li className="flex items-center text-base sm:text-lg text-gray-700">
                  <span className="w-2 h-2 bg-[#ff7612] rounded-full mr-3 flex-shrink-0"></span>
                  Community Volunteering
                </li>
                <li className="flex items-center text-base sm:text-lg text-gray-700">
                  <span className="w-2 h-2 bg-[#ff7612] rounded-full mr-3 flex-shrink-0"></span>
                  Support Groups
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 lg:w-28 lg:h-28 bg-gradient-to-br from-[#ff7612] to-[#ffdb5b] rounded-full flex items-center justify-center shadow-md mb-6">
                <img src="/obj3.png" alt="Self Sufficiency" className="w-16 h-16 lg:w-18 lg:h-18 object-contain" />
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#461711] mb-4">
                Self Sufficiency
              </h3>
              <p className="text-lg sm:text-xl text-gray-600 mb-4 font-medium">
                Through skill development and empowerment
              </p>
              <ul className="space-y-3 text-left">
                <li className="flex items-center text-base sm:text-lg text-gray-700">
                  <span className="w-2 h-2 bg-[#ff7612] rounded-full mr-3 flex-shrink-0"></span>
                  Technical Workshops
                </li>
                <li className="flex items-center text-base sm:text-lg text-gray-700">
                  <span className="w-2 h-2 bg-[#ff7612] rounded-full mr-3 flex-shrink-0"></span>
                  Creative Workshops
                </li>
                <li className="flex items-center text-base sm:text-lg text-gray-700">
                  <span className="w-2 h-2 bg-[#ff7612] rounded-full mr-3 flex-shrink-0"></span>
                  Soft Skills Training
                </li>
              </ul>
            </div>
          </div>
        </div>
    </div>
    );
};

export default Objectives;