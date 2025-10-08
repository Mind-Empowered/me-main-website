const Story = () => {
    return (
<div>
  {/* Section Header */}
  <div className="text-center mb-8 md:mb-12">
    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#461711] mb-4 leading-none">
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffdb5b] to-[#ff7612]">
        Our Story
      </span>
    </h1>
    <div className="w-20 h-1 bg-gradient-to-r from-[#ff7612] to-[#ffdb5b] mx-auto mb-4 rounded-full"></div>
    <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
      Born from compassion during challenging times, dedicated to mental health empowerment
    </p>
  </div>
  
  {/* Story and Image Section */}
  <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12 items-center">
    <div className="flex justify-center items-center h-full lg:col-span-1">
      <img src="/mestory.svg" alt="ME Story Illustration" className="w-full h-full object-contain" />
    </div>
    <div className="space-y-4 text-base text-gray-700 leading-relaxed lg:col-span-3">
      <p>
        <span className="font-bold text-[#461711]">Mind Empowered (ME)</span> is a charitable organization based in India, born from compassion and understanding. It is the brainchild of <span className="font-semibold text-[#ff7612]">Maya Menon and her sister</span>, two sisters who resonate positivity and happiness wherever they go.
      </p>
      <p>
        During the lockdown period, the sisters started conducting free online classes on Spoken English and Interview Skills for college students. Through this close association, they realized Gen-Z was grappling with a wide range of mental health issues—from anxiety and depression to loneliness and cyberbullying—in ways they never had before.
      </p>
      <p>
        Recognizing the urgent need to eliminate the stigma associated with mental illness, the idea of an open forum to help students came to life by forming "ME".
      </p>
      <blockquote className="border-l-4 border-[#ffdb5b] pl-4 py-2 my-4 bg-gray-50 rounded-r-lg">
        <p className="text-lg font-semibold text-[#461711] italic">
          "Don't Suffer in Silence. Let's talk About Mental Health."
        </p>
      </blockquote>
      <p>
        ME started on <span className="font-semibold text-[#ff7612]">October 10th, 2020 (World Mental Health Day)</span>, with enriching and inspiring online sessions for the youth conducted by our expert Empowering Coaches, completely free of charge.
      </p>
    </div>
  </div>

  {/* Objectives Section */}
  <div className="mt-16 md:mt-20">
    <div className="text-center mb-8 md:mb-12">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#461711] mb-4">
        Our Core Objectives
      </h2>
      <div className="w-20 h-1 bg-gradient-to-r from-[#ff7612] to-[#ffdb5b] mx-auto rounded-full"></div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {/* Self Awareness Card */}
      <div className="bg-white rounded-xl shadow-xl p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#ff7612]/10 to-[#ffdb5b]/20 rounded-full flex items-center justify-center flex-shrink-0">
            <img src="/obj1.png" alt="Self Awareness" className="w-8 h-8 object-contain" />
          </div>
          <h3 className="text-xl font-bold text-[#461711]">
            Self Awareness
          </h3>
        </div>
        <p className="text-base text-gray-600 mb-3 flex-grow leading-relaxed">
          Through comprehensive educational programs.
        </p>
        <ul className="space-y-2 text-base text-gray-700 leading-relaxed">
          <li className="flex items-center">
             <span className="w-2 h-2 bg-[#ff7612] rounded-full mr-3"></span>
            Interactive Webinars
          </li>
          <li className="flex items-center">
             <span className="w-2 h-2 bg-[#ff7612] rounded-full mr-3"></span>
            Mental Health Workshops
          </li>
          <li className="flex items-center">
             <span className="w-2 h-2 bg-[#ff7612] rounded-full mr-3"></span>
            Offline Community Events
          </li>
        </ul>
      </div>

      {/* Self Expression Card */}
      <div className="bg-white rounded-xl shadow-xl p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#ff7612]/10 to-[#ffdb5b]/20 rounded-full flex items-center justify-center flex-shrink-0">
            <img src="/obj2.png" alt="Self Expression" className="w-8 h-8 object-contain" />
          </div>
          <h3 className="text-xl font-bold text-[#461711]">
            Self Expression
          </h3>
        </div>
        <p className="text-base text-gray-600 mb-3 flex-grow leading-relaxed">
          Through creative and community engagement.
        </p>
        <ul className="space-y-2 text-base text-gray-700 leading-relaxed">
          <li className="flex items-center">
             <span className="w-2 h-2 bg-[#ff7612] rounded-full mr-3"></span>
            Skills Showcase Events
          </li>
          <li className="flex items-center">
             <span className="w-2 h-2 bg-[#ff7612] rounded-full mr-3"></span>
            Community Volunteering
          </li>
          <li className="flex items-center">
             <span className="w-2 h-2 bg-[#ff7612] rounded-full mr-3"></span>
            Support Groups
          </li>
        </ul>
      </div>

      {/* Self Sufficiency Card */}
      <div className="bg-white rounded-xl shadow-xl p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#ff7612]/10 to-[#ffdb5b]/20 rounded-full flex items-center justify-center flex-shrink-0">
            <img src="/obj3.png" alt="Self Sufficiency" className="w-8 h-8 object-contain" />
          </div>
          <h3 className="text-xl font-bold text-[#461711]">
            Self Sufficiency
          </h3>
        </div>
        <p className="text-base text-gray-600 mb-3 flex-grow leading-relaxed">
          Through skill development and empowerment.
        </p>
        <ul className="space-y-2 text-base text-gray-700 leading-relaxed">
          <li className="flex items-center">
             <span className="w-2 h-2 bg-[#ff7612] rounded-full mr-3"></span>
            Technical Workshops
          </li>
          <li className="flex items-center">
             <span className="w-2 h-2 bg-[#ff7612] rounded-full mr-3"></span>
            Creative Workshops
          </li>
          <li className="flex items-center">
             <span className="w-2 h-2 bg-[#ff7612] rounded-full mr-3"></span>
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