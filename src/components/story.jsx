const Story = () => {
    return (
<div>
  {/* Section Header */}
  <div className="text-center mb-16 md:mb-24 lg:mb-32">
    <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-[10rem] font-bold text-[#461711] mb-6 md:mb-10 leading-none">
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffdb5b] to-[#ff7612]">
        Our Story
      </span>
    </h1>
    <div className="w-24 h-1.5 lg:w-36 lg:h-2 bg-gradient-to-r from-[#ff7612] to-[#ffdb5b] mx-auto mb-6 md:mb-10 rounded-full"></div>
    <p className="text-lg sm:text-xl md:text-3xl lg:text-5xl text-gray-600 max-w-5xl mx-auto leading-relaxed">
      Born from compassion during challenging times, dedicated to mental health empowerment
    </p>
  </div>
  
  {/* Story and Image Section */}
  <div className="grid grid-cols-1 lg:grid-cols-4 gap-24 lg:gap-32 items-center">
    <div className="flex justify-center items-center h-full lg:col-span-1">
      <img src="/mestory.svg" alt="ME Story Illustration" className="w-full h-full object-contain" />
    </div>
    <div className="space-y-6 md:space-y-8 lg:space-y-12 text-base sm:text-lg md:text-2xl lg:text-5xl text-gray-700 leading-relaxed lg:col-span-3">
      <p>
        <span className="font-bold text-[#461711]">Mind Empowered (ME)</span> is a charitable organization based in India, born from compassion and understanding. It is the brainchild of <span className="font-semibold text-[#ff7612]">Maya Menon and her sister</span>, two sisters who resonate positivity and happiness wherever they go.
      </p>
      <p>
        During the lockdown period, the sisters started conducting free online classes on Spoken English and Interview Skills for college students. Through this close association, they realized Gen-Z was grappling with a wide range of mental health issues—from anxiety and depression to loneliness and cyberbullying—in ways they never had before.
      </p>
      <p>
        Recognizing the urgent need to eliminate the stigma associated with mental illness, the idea of an open forum to help students came to life by forming "ME".
      </p>
      <blockquote className="border-l-4 md:border-l-8 border-[#ffdb5b] pl-4 md:pl-8 lg:pl-12 py-4 my-8 lg:my-12 bg-gray-50 rounded-r-lg">
        <p className="text-xl sm:text-2xl md:text-4xl lg:text-7xl font-semibold text-[#461711] italic">
          "Don't Suffer in Silence. Let's talk About Mental Health."
        </p>
      </blockquote>
      <p>
        ME started on <span className="font-semibold text-[#ff7612]">October 10th, 2020 (World Mental Health Day)</span>, with enriching and inspiring online sessions for the youth conducted by our expert Empowering Coaches, completely free of charge.
      </p>
    </div>
  </div>

  {/* Objectives Section */}
  <div className="mt-24 md:mt-32 lg:mt-48">
    <div className="text-center mb-16 md:mb-24">
      <h2 className="text-3xl sm:text-5xl md:text-7xl font-bold text-[#461711] mb-6 md:mb-8">
        Our Core Objectives
      </h2>
      <div className="w-20 h-1.5 lg:w-32 lg:h-2 bg-gradient-to-r from-[#ff7612] to-[#ffdb5b] mx-auto rounded-full"></div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16 lg:gap-24">
      {/* Self Awareness Card */}
      <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 flex flex-col">
        <div className="flex items-center gap-4 lg:gap-8 mb-6 lg:mb-8">
          <div className="w-24 h-24 lg:w-48 lg:h-48 bg-gradient-to-br from-[#ff7612]/10 to-[#ffdb5b]/20 rounded-full flex items-center justify-center flex-shrink-0">
            <img src="/obj1.png" alt="Self Awareness" className="w-16 h-16 lg:w-32 lg:h-32 object-contain" />
          </div>
          <h3 className="text-2xl lg:text-6xl font-bold text-[#461711]">
            Self Awareness
          </h3>
        </div>
        <p className="text-base lg:text-5xl text-gray-600 mb-4 lg:mb-6 flex-grow leading-relaxed">
          Through comprehensive educational programs.
        </p>
        <ul className="space-y-2 lg:space-y-4 text-base lg:text-5xl text-gray-700 leading-relaxed">
          <li className="flex items-center">
            <span className="w-2.5 h-2.5 bg-[#ff7612] rounded-full mr-4"></span>
            Interactive Webinars
          </li>
          <li className="flex items-center">
            <span className="w-2.5 h-2.5 bg-[#ff7612] rounded-full mr-4"></span>
            Mental Health Workshops
          </li>
          <li className="flex items-center">
            <span className="w-2.5 h-2.5 bg-[#ff7612] rounded-full mr-4"></span>
            Offline Community Events
          </li>
        </ul>
      </div>

      {/* Self Expression Card */}
      <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 flex flex-col">
        <div className="flex items-center gap-4 lg:gap-8 mb-6 lg:mb-8">
          <div className="w-24 h-24 lg:w-48 lg:h-48 bg-gradient-to-br from-[#ff7612]/10 to-[#ffdb5b]/20 rounded-full flex items-center justify-center flex-shrink-0">
            <img src="/obj2.png" alt="Self Expression" className="w-16 h-16 lg:w-32 lg:h-32 object-contain" />
          </div>
          <h3 className="text-2xl lg:text-6xl font-bold text-[#461711]">
            Self Expression
          </h3>
        </div>
        <p className="text-base lg:text-5xl text-gray-600 mb-4 lg:mb-6 flex-grow leading-relaxed">
          Through creative and community engagement.
        </p>
        <ul className="space-y-2 lg:space-y-4 text-base lg:text-5xl text-gray-700 leading-relaxed">
          <li className="flex items-center">
            <span className="w-2.5 h-2.5 bg-[#ff7612] rounded-full mr-4"></span>
            Skills Showcase Events
          </li>
          <li className="flex items-center">
            <span className="w-2.5 h-2.5 bg-[#ff7612] rounded-full mr-4"></span>
            Community Volunteering
          </li>
          <li className="flex items-center">
            <span className="w-2.5 h-2.5 bg-[#ff7612] rounded-full mr-4"></span>
            Support Groups
          </li>
        </ul>
      </div>

      {/* Self Sufficiency Card */}
      <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 flex flex-col">
        <div className="flex items-center gap-4 lg:gap-8 mb-6 lg:mb-8">
          <div className="w-24 h-24 lg:w-48 lg:h-48 bg-gradient-to-br from-[#ff7612]/10 to-[#ffdb5b]/20 rounded-full flex items-center justify-center flex-shrink-0">
            <img src="/obj3.png" alt="Self Sufficiency" className="w-16 h-16 lg:w-32 lg:h-32 object-contain" />
          </div>
          <h3 className="text-2xl lg:text-6xl font-bold text-[#461711]">
            Self Sufficiency
          </h3>
        </div>
        <p className="text-base lg:text-5xl text-gray-600 mb-4 lg:mb-6 flex-grow leading-relaxed">
          Through skill development and empowerment.
        </p>
        <ul className="space-y-2 lg:space-y-4 text-base lg:text-5xl text-gray-700 leading-relaxed">
          <li className="flex items-center">
            <span className="w-2.5 h-2.5 bg-[#ff7612] rounded-full mr-4"></span>
            Technical Workshops
          </li>
          <li className="flex items-center">
            <span className="w-2.5 h-2.5 bg-[#ff7612] rounded-full mr-4"></span>
            Creative Workshops
          </li>
          <li className="flex items-center">
            <span className="w-2.5 h-2.5 bg-[#ff7612] rounded-full mr-4"></span>
            Soft Skills Training
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>
    );
};

export default Story;