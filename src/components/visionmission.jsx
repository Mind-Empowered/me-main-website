const VisionMission = () => {
  return (
    <div className="flex flex-col gap-10 my-4 mx-auto px-8 max-w-screen-xl md:flex-row md:items-stretch">
      <div className="flex flex-col justify-between bg-white rounded-lg shadow-md p-8 flex-1 max-w-md hover:shadow-lg hover:-translate-y-1 transition-transform duration-300">
        <div className="flex flex-col items-center gap-6">
          <img
            src="/vision.png"
            alt="vision"
            className="w-48 h-48 object-contain"
          />
          <div>
            <h2 className="text-4xl font-bold italic text-[#461711] mb-4">
              Our Vision
            </h2>
            <p className="text-xl">
              Empowering{" "}
              <span className="inline-highlight-1">Individuals</span>{" "}
              to navigate life with{" "}
              <span className="inline-highlight-1">
                Emotional Resilience
              </span>.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between bg-white rounded-lg shadow-md p-8 flex-1 max-w-md hover:shadow-lg hover:-translate-y-1 transition-transform duration-300">
        <div className="flex flex-col items-center gap-6">
          <img
            src="/mission.png"
            alt="mission"
            className="w-48 h-48 object-contain"
          />
          <div>
            <h2 className="text-4xl font-bold italic text-[#461711] mb-4">
              Our Mission
            </h2>
            <p className="text-xl">
              Championing the cause of mental health through{" "}
              <span className="inline-highlight-1">Awareness</span>,{" "}
              <span className="inline-highlight-1">Education</span>,{" "}
              <span className="inline-highlight-1">Advocacy</span> and
              creating an empathetic community.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisionMission;
